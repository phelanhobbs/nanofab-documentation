# PreciousMetalReader — Known Issues & Technical Debt

Working list for `NanofabToolkit/PreciousMetalReader`. Separate from the successor docs. Mostly recommendations; where code or credentials have already changed it's noted inline.

Severity: **High** = security/correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. CORES Bearer token via local `auth.py` — High *(token rotated 2026-06-29 → local `auth.py` value now 403; rollout required to restore the tool)*
- **Status:** ✅ *env-var preference added 2026-06-22* — `RetrieveMonthsMetals.py` prefers the `CORES_TOKEN` environment variable (`HSCCode = 'Bearer ' + os.environ['CORES_TOKEN']`), falling back to the legacy local `auth.py` only if it's unset. ⚠️ **Now required (was owner-deferred):** the shared CORES token was **rotated 2026-06-29** (see `known-issues/UNanofabTools/hscdownloader.md` #1), so the value baked into each machine's local `auth.py` is now **revoked (403)** — the tool will fail to download until operators set the new `CORES_TOKEN`, rebuild the `.exe`, and delete `auth.py`. `auth.py` was verified **never committed** (`git log -- '*auth.py'`), so there is no git-history leak (unlike the HSCDownloader token).
- **Where:** `from auth import HSCCode` fallback in `RetrieveMonthsMetals.py`, used as the `Authorization` header; `src/auth.py` is gitignored and local-only.
- **Risk:** until the new token is rolled out, **the tool is non-functional** (CORES returns 403 to the old `auth.py` value); the credential also still lives in a loose local `auth.py` on each machine. The setup contract must be documented so a successor can run it.
- **Fix (remaining):** on each machine, set `CORES_TOKEN` to the **new** token, delete the local `auth.py`, and rebuild the `.exe`; document the `CORES_TOKEN` env var in the README. The shared CORES token has already been rotated (see `known-issues/UNanofabTools/hscdownloader.md` #1), so this rollout is what restores the tool.

### 2. Hard-coded service-ID list — Medium
- **Where:** the embedded list (`[768, 808, 809, ..., 818]`) inside `download_Metal("all", ...)`.
- **Risk:** if CORES renumbers a service, the corresponding metal silently goes missing from "all" downloads; the mapping is undocumented.
- **Fix:** lift this into a documented machine → metal → service_id table; validate IDs on startup.

### 3. No request timeout / retry — Medium
- **Where:** `requests.get(constructedURL, headers=header)` (no `timeout`).
- **Risk:** a slow or unreachable CORES freezes the UI; "all" mode could hang for minutes per endpoint with no recovery.
- **Fix:** add `timeout=` and a brief retry-with-backoff; report per-endpoint failures rather than aborting.

### 4. UI freezes during downloads — Medium
- **Where:** `download_Metal` runs synchronously on the Tk main thread.
- **Risk:** the window appears unresponsive (especially in "all" mode where ~12 endpoints are pulled).
- **Fix:** move downloads to a worker thread (cf. `ParalyneReader`) and post progress back to the UI.

### 5. Errors swallowed at endpoint granularity — Low/Medium
- **Where:** in "all" mode, individual endpoints are skipped if `status_code != 200`, but the user may not see which ones failed.
- **Fix:** collect per-endpoint statuses and present them at the end of the run.

### 6. Hard-coded month/year handling — Low
- **Where:** `daysinMonth` and the date-string building use plain integers without validation; an invalid year string would crash.
- **Fix:** validate user-entered year; clamp to a sensible range.

### 7. Frozen vs. dev path logic is fragile — Low
- **Where:** `download_Metal` walks three `dirname` levels to find the project dir in dev mode.
- **Risk:** breaks if the file is moved or the project is re-laid out.
- **Fix:** pass a project root explicitly (env var / settings), or use `pathlib.Path(__file__).resolve()` with a clear anchor.

### 8. Independent of the cleanroom server — Low (context)
- **Note:** this app talks to CORES, not to `nfhistory.nanofab.utah.edu`. Easy to miss; a successor may waste time looking for the API on our server.

### 9. PyInstaller build steps undocumented — Low
- **Where:** packaging artifacts present; no captured spec/command.
- **Fix:** add a one-page build note to the README.

### 10. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** mock-based tests around `download_Metal` (request shape, response parsing) and `summarize_metal_charges`.

---

## Suggested priority order
1. #1 **finish the CORES env rollout — now required** (token rotated 2026-06-29; set the new `CORES_TOKEN`, delete `auth.py`, rebuild the `.exe`) — High; then #2 centralize service IDs — Medium
2. #3 + #4 timeouts, retries, and a worker-thread download path — Medium
3. #10 + #5 add tests and surface per-endpoint failure detail — Medium
4. #6, #7, #8, #9 — Low
