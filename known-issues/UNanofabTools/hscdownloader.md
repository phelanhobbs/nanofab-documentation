# HSC Downloader — Known Issues & Technical Debt

Working list for `HSCDownloader.py`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = security / data correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. CORES API token — de-sourced to `.env`; **rotation still required** — High (security)
- **Status (2026-06-22):** ✅ *code de-sourced & deployed.* `HSCDownloader.py` now reads `AUTH = 'Bearer ' + os.environ['CORES_TOKEN']` (commit `4175995`), with `CORES_TOKEN` in the gitignored `.env`; the `hscdownloader` user-systemd service runs on it. ⛔ **Still open — token rotation (owner-planned, not yet done):** the value is unchanged and remains in git history (commits ≤ `0114dc5`), so the leaked credential stays valid until CORES issues a new one.
- **Where:** was `HSCDownloader.py:26` → `AUTH = 'Bearer <redacted-cores-bearer-token>'`, used as the `Authorization` header.
- **Risk:** a working credential to the university records system is still in repo history; anyone with repo (or leaked-copy) access has it until rotated.
- **Remaining fix:** (1) get a new bearer token from the CORES n8n admin, then on the server `sed -i "s|^CORES_TOKEN=.*|CORES_TOKEN=<NEW>|" .env` + `systemctl --user restart hscdownloader`; (2) if the GitHub repo is public, scrub the old token from history (`git filter-repo`/BFG + force-push); (3) apply the same env pattern to PreciousMetalReader if it shares the token.
- **Validation:** old token no longer authenticates; new value lives in `.env` only; (if scrubbed) `git log -p | grep` finds no token.

### 2. Minimal error handling on downloads — Medium
- **Where:** `downloadFile` does `json.loads(requests.get(...).text)` with no status check, timeout, or retry.
- **Risk:** a CORES outage, slow response, or token rotation throws or yields empty data; machine pages silently go stale.
- **Fix:** check HTTP status, add timeouts + retries, and log/alert on failure.

### 3. No staleness detection / alerting — Medium
- **Where:** the scheduled `save()` loop.
- **Risk:** if downloads start failing, nobody is notified; the website quietly shows old data.
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
1. #1 rotate the CORES token with the CORES admin (code de-sourced to `.env` & deployed 2026-06-22; rotation still pending) — High
2. #2 + #3 robust downloads + staleness alerting — Medium
3. #4 + #5 centralize the machine map and de-duplicate save functions — Medium
4. #6 add a portal-column contract test — Medium
5. #7, #8, #9, #10 cleanup / activation decision — Low
