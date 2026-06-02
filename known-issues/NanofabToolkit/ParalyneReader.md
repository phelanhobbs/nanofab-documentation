# ParalyneReader — Known Issues & Technical Debt

Working list for `NanofabToolkit/ParalyneReader`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = correctness/security · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. `return_selected` calls a non-existent server endpoint — Medium
- **Where:** `src/ParalyneReader.py` GETs `/api/paralyne/analog/return/<filename>`.
- **Risk:** any code path that uses it errors at runtime; the function is effectively dead code that misleads readers.
- **Fix:** implement `/return/<filename>` server-side (if needed), or remove the client function.

### 2. Certificate validation disabled (`verify=False`) — Medium
- **Where:** all `requests.get(...)` calls in `ParalyneReader.py`.
- **Risk:** standard internal-cert tradeoff (encrypted but unverified). On the internal network this is acceptable; off-network it's not.
- **Fix:** install the internal CA into the executable's trust store; re-enable verification.

### 3. Downloads land in the current working directory — Medium
- **Where:** `download_file(filename)` uses `os.path.abspath(filename)`.
- **Risk:** when run as a frozen executable, files drop next to the `.exe`; users lose track of them, and the folder may be read-only.
- **Fix:** default to a `Downloads/` subfolder; make the destination configurable.

### 4. No timeout / retry on API calls — Medium
- **Where:** `requests.get(...)` without `timeout`.
- **Risk:** a hung server makes the app appear frozen; first request after sleep can fail with no recovery.
- **Fix:** add `timeout=` and a simple retry-with-backoff for `list_files`/`download_file`.

### 5. Errors raise generic `Exception` — Low
- **Where:** `raise Exception(f"Error ...")` patterns.
- **Fix:** define a small custom exception (`ParalyneAPIError`) so callers can handle it specifically.

### 6. PyInstaller build steps undocumented — Low
- **Where:** packaging artifacts present, but no captured spec/command.
- **Fix:** add a one-page build note to the README so a successor can rebuild the .exe.

### 7. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** add tests that mock the HTTP responses to lock in the API contract and the filename/path handling.

### 8. `urllib3.disable_warnings()` globally suppresses noise — Low
- **Where:** module-level call.
- **Risk:** hides legitimate warnings unrelated to the internal cert.
- **Fix:** scope the suppression to the internal hostname, or remove once verification is restored (#2).

---

## Suggested priority order
1. #2 + #1 align with the server: re-enable TLS verify; drop the dead `return_selected` (or implement the endpoint) — Medium
2. #4 timeouts + retries — Medium
3. #3 configurable download directory — Medium
4. #7 add tests — Medium
5. #5, #6, #8 — Low
