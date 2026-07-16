# HSC Downloader — Known Issues & Technical Debt

Working list for `HSCDownloader.py`. Separate from the successor docs. Resolved items are tracked in the ✅ Resolved / Closed section at the bottom (and marked inline where a numbered item has been closed).

Severity: **High** = security / data correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. CORES API token — de-sourced + rotated — ✅ RESOLVED (2026-06-29)
- **Status:** Closed in two steps. (1) **De-sourced 2026-06-22** (commit `4175995`): `HSCDownloader.py` now reads `AUTH = 'Bearer ' + os.environ['CORES_TOKEN']`, with `CORES_TOKEN` in the gitignored `.env`; the `hscdownloader` user-systemd service runs on it. (2) **Rotated 2026-06-29:** the CORES n8n admin issued a new bearer token (and patched a detached auth credential on the n8n node that had been 500-ing both tokens); the new value went into `.env` and `systemctl --user restart hscdownloader` picked it up.
- **Where (historical):** was `HSCDownloader.py:26` → `AUTH = 'Bearer <redacted-cores-bearer-token>'`, used as the `Authorization` header.
- **Verified:** the **old token now returns `403`** (revoked) and the downloader pulls fresh data on the new one (`small_*` CSVs rewrote at the restart timestamp).
- **Residual (Low, optional cleanup):** the old value still sits in old commits (≤ `0114dc5`), but it is now a **dead credential** (403) — a `git filter-repo`/BFG history scrub is optional hygiene, not a live security need.
- **Cross-tool note:** `PreciousMetalReader` **shares this CORES token**. Its local `auth.py` now holds the revoked value (403), so that tool needs its env rollout (set the new `CORES_TOKEN`, delete `auth.py`, rebuild the `.exe`) to keep working — see `known-issues/NanofabToolkit/PreciousMetalReader.md` #1.

### 2. Minimal error handling on downloads — Medium (mostly resolved)
- **Where:** `downloadFile`.
- **Status:** `downloadFile` now uses `timeout=30` and `raise_for_status()`, and `save()` wraps each machine in its own `try/except`. A CORES outage, slow response, or revoked token now surfaces as a clean, per-machine-contained failure instead of a hang or a confusing `JSONDecodeError` that aborts the whole run.
- **Residual (Low):** no automatic retry yet, and no alerting — a failing machine is logged and left stale until the next cycle (see #3).

### 3. No staleness detection / alerting — Medium (partly mitigated)
- **Where:** the scheduled `save()` loop.
- **Risk:** if downloads start failing, nobody is notified; the website quietly shows old data.
- **Mitigation in place:** `save()` runs each machine in its own `try/except` and logs a per-run failure summary, so one machine's failure no longer aborts the others and each failure is visible in the log. **Proactive alerting is still missing.**
- **Fix:** record last-successful-update per machine; alert if a machine hasn't updated in N cycles.

### 4. Machine→service_id map is brittle and buried — Medium
- **Where:** `retrieveData` is a long if/elif mapping names to numeric IDs (`761`…`845`).
- **Risk:** if CORES renumbers a service, that machine silently stops updating; the mapping is hard to audit.
- **Fix:** lift it into a documented dict/table; validate IDs at startup.

### 5. Heavy per-machine duplication — Medium
- **Where:** ~19 `save<Machine>()` functions repeat the same download/reshape/write structure.
- **Risk:** changes must be made many times; easy to let machines drift apart.
- **Fix:** drive formatting from a per-machine column spec; collapse to one generic save routine.

### 6. Output columns coupled to the portal with no contract test — Medium
- **Where:** `small_<Machine>_DataCollection.csv` columns must match what `data_service.py` / the machine pages expect.
- **Risk:** editing a `save<Machine>()` function can silently break a machine page's table or graph.
- **Fix:** a small test asserting each `small_` CSV has the columns the portal graphs.

### 7. `changedData()` is an unfinished TODO — Low
- **Where:** stubbed with `#TODO`.
- **Risk:** no incremental/change-aware updates; every cycle re-pulls and rewrites everything.
- **Fix:** finish it (compare new vs. existing) or remove it.

### 8. `breakLoop` / loop-control leftovers — Low
- **Where:** module-level `breakLoop = 0` and related control flow.
- **Fix:** clean up unused control variables; rely on the signal-based `graceful_exit`.

### 9. Some machines flagged "CURRENTLY HAS NO DATA" — Low (context)
- **Where:** comments in `retrieveData` (e.g. service IDs `844`, `845`).
- **Note:** expected empty sources, not bugs; revisit if those tools start producing data.

### 10. `savePECVD()` is implemented but not scheduled — Low/Medium
- **Where:** `savePECVD()` exists, but the `save()` orchestrator comments out the call.
- **Risk:** maintainers may assume PECVD is refreshed because the function and service-id mapping exist, while the scheduled loop never writes `small_PECVD_DataCollection.csv`.
- **Fix:** confirm whether PECVD should be active. If yes, re-enable the call and add a portal-column contract check; if no, keep it documented as intentionally disabled.

---

## Suggested priority order
1. #2 + #3 robust downloads + staleness alerting — Medium
2. #4 + #5 centralize the machine map and de-duplicate save functions — Medium
3. #6 add a portal-column contract test — Medium
4. #7, #8, #9, #10 cleanup / activation decision — Low

*(#1 CORES token rotation — ✅ resolved 2026-06-29; see above and the Resolved / Closed section.)*

---

## ✅ Resolved / Closed

### Ebeam (+ Denton635 / Denton18 / TMV) `Base Pressure` save crashed on string data — was High — CLOSED (commit `8717375`; deployed live 2026-06-29)
- **Original concern:** `Base Pressure` could arrive as a string and was multiplied by a float (`row['Base Pressure'] * 10**(int(powerFactor)+6)`), raising `can't multiply sequence by non-int of type 'float'`. The error was caught and only logged, so the service stayed up while that machine's save aborted and its `small_<Machine>_DataCollection.csv` went stale.
- **Why closed:** commit `8717375` adds a `scalePressure(value, powerFactor)` helper (`HSCDownloader.py:190`) that casts the value and tolerates bad rows (logs and leaves them unchanged instead of aborting), and routes Ebeam (`:295`), Denton635 (`:455`), Denton18 (`:531`), and TMV (`:625` onward, including its sputter-deposition pressures) through it — removing the fragile in-loop `astype(float)`. Locally validated against the real function: it reproduces the old `TypeError`, returns correct scaled values, and bad rows no longer crash.
- **Deployed:** live 2026-06-29 (commit `8717375`, pulled + `systemctl --user restart hscdownloader`) alongside the CORES token rotation — verified: the `can't multiply sequence` error is gone from `journalctl --user -u hscdownloader` and `save()` runs to completion (a malformed TMV row even logged `Could not scale pressure … leaving as-is` and was skipped instead of aborting).
- **Residual (Low, new):** removing the in-loop `astype(float)` reintroduced a pandas dtype `FutureWarning` on the TMV `Base Pressure` assignment — non-fatal today (pandas upcasts the column), but coerce it once with `pd.to_numeric(col, errors='coerce')` before a future pandas upgrade turns it into a hard error.
