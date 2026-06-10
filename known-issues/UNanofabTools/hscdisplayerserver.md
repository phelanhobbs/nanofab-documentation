# HSC Displayer Server (Legacy) — Known Issues & Technical Debt

Working list for `HSCDisplayerServer.py`. Separate from the successor docs. Nothing here has been changed in the code.

> **Overarching item:** this is the legacy monolith. The single biggest "issue" is that it still exists in parallel with the Flask `app/` rewrite. The end state should be: fully migrate to the Flask app and retire this file. Everything below is secondary to that.

Severity: **High** = security / correctness / architecture · **Medium** = maintainability · **Low** = cleanup.

---

### 1. Monolithic, hand-rolled dispatch — High (architecture)
- **Where:** `do_GET` (~350 lines) and `do_POST` (~700 lines) branch on `self.path`.
- **Risk:** extremely hard to read, test, or modify safely; the reason the Flask rewrite exists.
- **Fix:** don't extend it — migrate remaining usage to the Flask app and retire this file.

### 2. `addUser` defined twice — Medium
- **Where:** two `def addUser(...)` definitions (≈ lines 85 and 180); the second silently shadows the first.
- **Risk:** confusing; whichever is later wins, and a maintainer may edit the dead one.
- **Fix:** remove the duplicate (and verify which behavior is intended).

### 3. In-process TLS instead of a reverse proxy — Medium
- **Where:** the server wraps its own socket with SSL.
- **Risk:** the application process manages certificates and TLS directly; the Flask app's nginx-in-front model is more robust and is the current standard.
- **Fix:** if this must keep running, front it with nginx like the Flask app; otherwise retire it.

### 4. Duo keys imported from a module, not env — Medium (security)
- **Where:** `from DuoKeys import DUO_IKEY, DUO_SKEY, DUO_HOST`.
- **Risk:** credentials live in a Python module on disk rather than environment/secret storage; easy to commit by accident.
- **Fix:** load from environment variables (as the Flask app does).

### 5. HTML built by string concatenation — Medium (security/maintainability)
- **Where:** throughout (`generateHTMLfrom*`, inline page builders).
- **Risk:** no templating means manual escaping; easy to introduce cross-site-scripting if any user-supplied value is interpolated unescaped.
- **Fix:** N/A if retiring; otherwise audit every interpolation for escaping.

### 6. Direct sqlite3 everywhere, three DBs — Medium
- **Where:** `create_db` / `create_session_db` / `create_task_db` and ad-hoc queries.
- **Risk:** same split-database bookkeeping as the Flask app, but with hand-written SQL scattered through a huge file.
- **Fix:** covered by migrating to the Flask app's models.

### 7. `DEBUGMODE` global must never ship True — High (operational)
- **Where:** `DEBUGMODE = False` toggles off Duo + SSL.
- **Risk:** if ever set True on the server, it disables two-factor and TLS.
- **Fix:** same discipline as the Flask app; ideally derive from environment with a safe default.

### 8. Possible endpoint drift vs. the Flask app — Medium
- **Where:** e.g. `/getChartCount` and any `startswith`-matched GET prefixes may have no Flask equivalent.
- **Risk:** behavior differs depending on which server is live; clients relying on a legacy-only endpoint break after migration.
- **Fix:** inventory both servers' routes (see `ROUTES.md`), reconcile, and ensure the Flask app covers everything still in use before retiring this.

### 9. Duplicate / shared logic with the Flask app — Medium
- **Where:** CSV/graphing, auth, sensor ingest all exist here and in `app/`.
- **Risk:** two implementations to keep in sync until this is retired.
- **Fix:** single-source on the Flask app.

### 10. ~~Unclear which server is actually in production~~ — **Resolved by evidence (2026-06-01), keep verified**
- **Was:** High (operational) — maintainers might patch the wrong server.
- **Resolution:** the 2026-06-01 `phelan` survey snapshot (`documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_2026-06-01.txt`) shows the Flask app (`python run.py`, pid 2665755, in the `flaskserver` tmux session) as the live web process, with nginx proxying to `127.0.0.1:5000`. **No `HSCDisplayerServer.py` process appears anywhere in the snapshot.** The Flask app is production; this legacy server is not running.
- **Remaining action:** the Flask app is authoritative — patch there. Re-verify with the quarterly survey, and close this item entirely once the legacy code is removed from the production checkout.

---

## Suggested priority order
1. #1 commit to retiring the monolith (production confirmed: Flask is live per #10's evidence) — High
2. #8 reconcile routes so the Flask app covers everything still used — Medium/High
3. #7 ensure DEBUGMODE can't ship True — High (operational)
4. #2, #4 quick correctness/security fixes if it must keep running — Medium
5. #3, #5, #6, #9 only relevant if not retiring soon — Medium
