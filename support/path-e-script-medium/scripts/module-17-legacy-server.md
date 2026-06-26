# Medium Full Path E - Module 17: Legacy Server

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-17-legacy-server.md

# Module 17 - Legacy Server

## Goal

The maintainer recognizes deprecated `hscdisplayerserver`, understands why it exists in the docs, and does not spend major effort improving it unless live evidence proves it has become relevant again.

## Required Screen

SHOW:

- `presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx` (repo path: presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx)
- `presentation/UNanofabTools/hscdisplayerserver/README.md` (repo path: presentation/UNanofabTools/hscdisplayerserver/README.md)
- `documentation/UNanofabTools/hscdisplayerserver/README.md` (repo path: documentation/UNanofabTools/hscdisplayerserver/README.md)
- `documentation/UNanofabTools/hscdisplayerserver/ROUTES.md` (repo path: documentation/UNanofabTools/hscdisplayerserver/ROUTES.md)
- `known-issues/UNanofabTools/hscdisplayerserver.md` (repo path: known-issues/UNanofabTools/hscdisplayerserver.md)

## Verbatim Script

READ ALOUD:

"This module is intentionally short but important. `hscdisplayerserver` is deprecated legacy context. It is included so a maintainer recognizes it if they encounter it. The default instruction is not to improve it. The default instruction is to preserve context and ship work to the Flask app."

SHOW:

Open `HSC-Displayer-Server-Legacy.pptx`.

READ ALOUD:

"A legacy system can be dangerous because it looks like a project that wants maintenance. Before spending time on it, ask whether it is live, whether users depend on it, whether the current Flask app replaced it, and whether known issues say to retire it."

SHOW:

Open `known-issues/UNanofabTools/hscdisplayerserver.md` (repo path: known-issues/UNanofabTools/hscdisplayerserver.md).

READ ALOUD:

"The known-issues file should be clear: this is not a normal enhancement backlog. The expected direction is retirement unless live evidence changes the priority."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What is `hscdisplayerserver`? | The legacy monolithic/predecessor server documented for historical recognition. |
| Is it current or deprecated? | Deprecated. |
| Why is it documented? | So maintainers recognize it and understand why not to revive it by default. |
| What should you do before spending time improving it? | Verify live use and known-issues priority; otherwise defer/retire it. |
| Where should new web-app work normally go? | The current Flask app in UNanofabTools, not the deprecated legacy server. |

REQUIRE:

The maintainer can say: "`hscdisplayerserver` is deprecated; recognize it, do not revive it without evidence."

## Stop Point

STOP POINT:

Stop here if the maintainer treats legacy-server improvement as a first priority.


# Expanded Module 17: Legacy Server

READ ALOUD:

This expanded section revisits Module 17, Legacy Server. The focus is deprecated hscdisplayerserver context and retirement posture. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 17

READ ALOUD:

We are now doing the orientation pass for Legacy Server. The maintainer should connect this module to deprecated hscdisplayerserver context and retirement posture. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx`
- `presentation/UNanofabTools/hscdisplayerserver/README.md`
- `documentation/UNanofabTools/hscdisplayerserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention deprecated hscdisplayerserver context and retirement posture. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 17

READ ALOUD:

We are now doing the evidence pass for Legacy Server. The maintainer should connect this module to deprecated hscdisplayerserver context and retirement posture. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx`
- `presentation/UNanofabTools/hscdisplayerserver/README.md`
- `documentation/UNanofabTools/hscdisplayerserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention deprecated hscdisplayerserver context and retirement posture. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Source-code pass for Module 17

READ ALOUD:

We are now doing the source-code pass for Legacy Server. The maintainer should connect this module to deprecated hscdisplayerserver context and retirement posture. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx`
- `presentation/UNanofabTools/hscdisplayerserver/README.md`
- `documentation/UNanofabTools/hscdisplayerserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention deprecated hscdisplayerserver context and retirement posture. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Live-state pass for Module 17

READ ALOUD:

We are now doing the live-state pass for Legacy Server. The maintainer should connect this module to deprecated hscdisplayerserver context and retirement posture. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx`
- `presentation/UNanofabTools/hscdisplayerserver/README.md`
- `documentation/UNanofabTools/hscdisplayerserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention deprecated hscdisplayerserver context and retirement posture. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Failure-mode pass for Module 17

READ ALOUD:

We are now doing the failure-mode pass for Legacy Server. The maintainer should connect this module to deprecated hscdisplayerserver context and retirement posture. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx`
- `presentation/UNanofabTools/hscdisplayerserver/README.md`
- `documentation/UNanofabTools/hscdisplayerserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention deprecated hscdisplayerserver context and retirement posture. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Module Documentation Corpus



# Read-Aloud Documentation Corpus: documentation/UNanofabTools/hscdisplayerserver/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# HSC Displayer Server (Legacy) — Developer Documentation

Reference for `HSCDisplayerServer.py`, the original monolithic server that predates the Flask `app/` rewrite. This file (`README.md`) covers architecture and behavior; `ROUTES.md` is the route-by-route reference. Bugs/tech debt: `known-issues/UNanofabTools/hscdisplayerserver.md`.

> **Status / scope.** This is the legacy implementation. The maintained codebase is the Flask app under `app/` (documented in `documentation/UNanofabTools/flaskserver/`). **Production evidence (2026-06-01 `phelan` survey):** the live web process on `nfhistory` is the Flask app (`python run.py` in the `flaskserver` tmux session); no `HSCDisplayerServer.py` process was running. New features go in the Flask app, not here. Re-confirm against the latest survey snapshot before changing anything here.

## 1. Architecture

A single ~2,600-line script built on the Python standard library's `http.server`:

- `class MyServer(BaseHTTPRequestHandler)` handles every request. Two giant dispatch methods — `do_GET` (page views, file serving, downloads, graphs) and `do_POST` (form submissions, uploads, sensor ingest) — branch on `self.path` to route requests. This hand-rolled dispatcher is the structural opposite of Flask's blueprint/route decorators; the rewrite exists largely to replace it.
- Served via `HTTPServer((hostName, PORT), MyServer)` with SSL (TLS) wrapping; a background thread cleans up old sessions.
- Persistence is **direct `sqlite3`** (no ORM): a users DB, a sessions DB, and a tasks DB, created by `create_db` / `create_session_db` / `create_task_db`.
- External integrations: **Duo** 2FA (`duo_client`, keys imported from a `DuoKeys` module), and **pandas** for machine CSV processing.

### Standard library, not Flask
Because it uses `BaseHTTPRequestHandler`, the code manually parses cookies (`http.cookies`), form data (`cgi`), query strings (`urllib.parse`), and builds HTML by string concatenation. There is no templating engine, no routing table, no middleware — all of that is open-coded. Keep this in mind: patterns that are one line in Flask are several here.

## 2. Configuration & startup

```python
DEBUGMODE = False     # skips Duo + SSL for localhost testing — NEVER True on the server
DATA_DIR  = os.path.join(os.path.dirname(__file__), 'HSCDATA')
from DuoKeys import DUO_IKEY, DUO_SKEY, DUO_HOST
```
- `DEBUGMODE` mirrors the Flask app's `DEBUG_MODE`: it disables Duo and TLS for local work. The header comment is explicit that it must never run on the server.
- Duo credentials are imported from a separate `DuoKeys.py` module (not committed, presumably) rather than env vars.
- `DATA_DIR` is the same `HSCDATA` folder `HSCDownloader.py` writes and the Flask app reads — all three share it.
- At the bottom: `httpd = HTTPServer((hostName, PORT), MyServer)`, wrapped with SSL, plus `start_cleanup_thread()` for session expiry.

## 3. Data model (SQLite, direct)

Same logical shape as the Flask app's SQLite databases (this is what they were modeled on):

- **Users** — `addUser(username, password, uNID)`, `hash_password` (bcrypt), `verify_userInfo`, `verify_userUnid`, `isUserAdmin`, `canUserAssign`. (Note: `addUser` is **defined twice** — see known-issues.)
- **Sessions** — `createUserSession`, `getUserFromSession`, `delete_old_sessions`, cookie set via `setSessionCookie`; a background `cleanup_loop` thread purges old rows.
- **Tasks** — `fetchUserTasks`, `fetchAllTasks`, `fetchUnfinishedTasks`, `change_task_status`, `claimTask`, `handle_file_upload`, with HTML generated by `generateHTMLfromUserTasks` / `generateHTMLfromTasks`.

## 4. Request handling

### `do_GET` (≈ lines 1222–1574)
A long `if self.path == ... / elif self.path.startswith(...)` chain serving: the machine pages (via `getAndDisplay`, `handleHSCData`, `getMachineData`), log-file listing and graphing (`getLogFiles`, `graphLogs`, `graphCSV`, `graphTXT`, `sortByTime`), file downloads (`serve_file`, `getFilesToDownload`, `_listFilesInSubdirectories`), the admin panel (`serveAdminPanel`), static assets (`serve_static`), the Parylene analog file listing (`serve_paralyne_analog_files`), HTTPS redirect (`redirect_to_https`, `is_secureConnection`), and the login/landing pages.

### `do_POST` (≈ lines 1751–2458)
Branches on `self.path` for: `/login`, `/signup`, `/resetpassword`, `/toggleAssign`, `/deleteUser`, `/toggleAdminStatus`, `/createtasks`, `/sdsanalog`, `/sdsanalogfinished`, `/denton18pump`, `/denton18pumpfinished`, `/changestatus`, `/uploadtaskfile`, `/claimTask`, `/submitALDData`, `/getChartCount`. Full list in `ROUTES.md`.

These paths are the historical source of the Flask app's routes — most map one-to-one to a Flask blueprint endpoint, which makes this file a useful Rosetta stone when comparing old vs. new behavior.

## 5. Auth & security

- Passwords: bcrypt (`hash_password` / `verify_userInfo`), same as the Flask app.
- 2FA: `async def duo_authenticate(username)` via `duo_client`, gated by `DEBUGMODE`.
- Sessions: server-side rows + a cookie (`setSessionCookie`), with background expiry.
- TLS: handled in-process by wrapping the socket with SSL (the Flask app instead sits behind nginx).
- Input handling: `sanitize_input(input, max_length=255)` mirrors the Flask helper.
- HTTP→HTTPS: `redirect_to_https` / `is_secureConnection` enforce TLS when not in debug.

## 6. CSV / graphing

`csv_to_html_table`, `getAndDisplay`, `graphLogs`, `preparetoGraph`, `graphCSV`, `graphTXT`, `sortByTime` — the same machine-data display logic later refactored into `app/services/data_service.py`. Reads `small_<Machine>_DataCollection.csv` from `HSCDATA`.

## 7. Sensor ingest

The same device endpoints the Flask `api` blueprint now serves are implemented here in `do_POST`: `/sdsanalog` + `/sdsanalogfinished` (Parylene batches, with `combine_csv_batches_final`), `/denton18pump` + `/denton18pumpfinished`. The Parylene/Denton firmware predate the Flask app and were written against these.

## 8. Relationship to the rest of the system

```
HSCDownloader → HSCDATA ─┬─► HSCDisplayerServer (legacy, this file)
                         └─► Flask app (app/, the rewrite)
Pico firmware ───────────► (whichever server is live) sensor endpoints
```

The legacy server and the Flask app are two implementations of the same system reading the same data. Only one should be live at a time — and per the 2026-06-01 survey, the live one is the Flask app.

## 9. Maintenance guidance

- **Prefer the Flask app for all new work.** Treat this file as reference/fallback.
- Production is the Flask app (2026-06-01 survey: `python run.py` live, no `HSCDisplayerServer.py` process). The remaining priority is to retire this code from the production checkout — see known-issues #1 and #10.
- Don't add features here; if you must patch it, mirror the change in the Flask app.
- See `ROUTES.md` for the endpoint inventory and `known-issues/UNanofabTools/hscdisplayerserver.md` for defects (duplicate `addUser`, monolithic dispatch, in-process TLS, `DuoKeys` import, etc.).

See also the layman guide at `presentation/UNanofabTools/hscdisplayerserver/README.md`.


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/hscdisplayerserver/ROUTES.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# HSC Displayer Server (Legacy) — Route Reference

Endpoint inventory for `HSCDisplayerServer.py`, derived from the `do_GET` and `do_POST` dispatchers in `class MyServer`. Paths are matched by `if/elif` on `self.path` (exact match or `startswith`), not a routing table. Compare against the Flask app's `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` — most map one-to-one.

## POST routes (`do_POST`, ≈ lines 1751–2458)

| Path | Purpose | Flask-app equivalent |
|------|---------|----------------------|
| `/login` | Authenticate (password + Duo), set session cookie | `auth.login` |
| `/signup` | Create a user (Duo-gated) | `auth.signup` |
| `/resetpassword` | Reset password by username + uNID | `auth.reset_password` |
| `/toggleAssign` | Toggle a user's task-assign permission | `admin.toggle_assign` |
| `/deleteUser` | Delete a user | `admin.delete_user` |
| `/toggleAdminStatus` | Toggle a user's admin flag | `admin.toggle_admin` |
| `/createtasks` | Create a task | `tasks.create_task` |
| `/changestatus` | Mark a task complete | `tasks.change_status` |
| `/uploadtaskfile` | Attach a file to a task | `tasks.upload_file` |
| `/claimTask` | Claim a task | `tasks.claim_task` |
| `/sdsanalog` | Receive a Parylene CSV batch | `api.sds_analog` |
| `/sdsanalogfinished` | Finalize/combine Parylene batches | `api.sds_analog_finished` |
| `/denton18pump` | Receive a Denton 18 pressure sample | `api.denton18_pump` |
| `/denton18pumpfinished` | Close the Denton 18 run file | `api.denton18_pump_finished` |
| `/submitALDData` | ALD deposition-rate calculator | `machines.submit_ald_data` |
| `/getChartCount` | Chart/peak count helper | (no direct Flask equivalent — verify) |

## GET routes (`do_GET`, ≈ lines 1222–1574)

GET handling is a longer chain mixing exact paths and `startswith` prefixes. Functionally it serves:

| Area | Handled by | Flask-app equivalent |
|------|-----------|----------------------|
| Login / landing pages | inline HTML builders | `auth.login`, `machines.index` |
| Per-machine data pages | `getAndDisplay`, `handleHSCData`, `getMachineData` | `machines.<tool>` routes |
| Log-file listings | `getLogFiles`, `sortByTime` | `machines.log_files` / `render_log_files` |
| Log-file graphing | `graphLogs`, `preparetoGraph`, `graphCSV`, `graphTXT` | `machines.graph_file` |
| File downloads | `serve_file`, `getFilesToDownload`, `_listFilesInSubdirectories` | `machines.download_file` |
| Admin panel | `serveAdminPanel`, `fetchAdminPanelData`, `generateAdminPanelHTML` | `admin.admin_panel` |
| Parylene analog file listing | `serve_paralyne_analog_files` | `api.list_paralyne_files` / `download_paralyne_file` |
| Static assets | `serve_static` | inline `/js`,`/css` routes |
| HTTPS enforcement | `is_secureConnection`, `redirect_to_https` | (nginx handles this for the Flask app) |

## Notes for comparison

- **Routing style:** legacy uses manual `self.path` branching; Flask uses `@blueprint.route(...)`. When porting behavior, find the matching `elif` block here and the corresponding Flask view.
- **One-to-one mapping:** the POST endpoints above are essentially the contract the Pico firmware and front-end were built against; the Flask app preserved these paths so clients kept working across the rewrite.
- **Possible legacy-only endpoints:** `/getChartCount` (and any `startswith`-matched GET prefixes) may not have a Flask twin — verify before assuming parity.
- **Source of truth:** these line numbers are approximate (from the dispatcher map) and may shift; grep `self.path ==` / `self.path.startswith` in `HSCDisplayerServer.py` for the authoritative list.

See `README.md` (this folder) for architecture and `known-issues/UNanofabTools/hscdisplayerserver.md` for defects.


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/hscdisplayerserver.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

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


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/hscdisplayerserver/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# HSC Displayer Server (Legacy) — A Plain-English Guide

This guide explains `HSCDisplayerServer.py`, the **original, all-in-one version of the website's server**. Written for a non-coder; terms are defined as they appear.

## What it is

`HSCDisplayerServer.py` is a single, very large program (about 2,600 lines) that was the cleanroom website's server before it was rewritten. It does everything the current website does — logins, the task list, the machine pages, accepting sensor data — but all packed into **one file**.

The current website is a tidied-up, reorganized version of this. If you've seen the "Flask server" sessions, this is the predecessor: same jobs, older structure. It's labeled "legacy" because new work happens in the new version, not here.

## Why it's worth understanding

Two reasons:

1. **History.** Knowing where the current server came from explains a lot about why the new one is organized the way it is.
2. **It may still be the running one.** Depending on the deployment, this monolith — or the new version — is what actually serves the site. A maintainer needs to know which is live and how this one works.

## What it does

All the same things the current website does, including:

- **Logins** — usernames, passwords, two-factor via Duo, admin permissions.
- **The task list** — assign, claim, complete, attach files.
- **Machine pages** — tables and graphs for each tool, plus log-file browsing and downloads.
- **Accepting sensor data** — the same Raspberry Pi endpoints (particle data, Parylene batches, Denton 18 pressures).
- **An admin panel** — manage users and permissions.

The big difference from the new version is purely organizational: here it's all in one file instead of being split into tidy sections.

## How it's built (and how that differs from the new version)

- The new website is built on **Flask**, a popular framework that handles a lot of the plumbing for you and encourages splitting code into neat sections.
- This legacy server is built on Python's **built-in web server tools** instead — more bare-bones, with the developer writing more of the plumbing by hand.

In practice that means this file contains one enormous "switchboard" that looks at each incoming web address and decides what to do — login here, machine page there, sensor data over there — all in two long stretches of code (one for page views, one for form submissions and uploads). The new version breaks that switchboard into separate, labeled chapters.

Everything else is conceptually the same as the new server: it stores users and tasks in small databases, reads machine spreadsheets to draw the pages, hashes passwords so they're never stored in plain text, requires two-factor login, and cleans up old sessions in the background.

## A "debug mode" switch

Like the new server, this one has a **debug mode** for testing on a personal computer — it skips the two-factor and encryption steps so a developer can work locally. The code is emphatic that this must **never** be turned on for the real server. Same rule as the new version.

## The bottom line

Think of `HSCDisplayerServer.py` as the **first draft** of the website's server: complete and functional, but everything in one big file. The current Flask version is the **clean rewrite** of the same idea. This guide exists so that anyone maintaining the system understands the original — where the features came from, how it's wired, and why the rewrite was organized the way it was.

For the deeper, developer-level details (the exact addresses it answers and how each is handled), see the successor documentation for this tool.


# Module Slide Note Corpus



## Slide Notes From presentation/UNanofabTools/hscdisplayerserver/slides/_build/build_tool.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); const fs = require(
- ); const { Deck } = require(
- ); const M = require(
- ); const modPath = process.argv[2]; if (!modPath) { console.error(
- ); process.exit(1); } const OUT = process.env.OUT || path.join(__dirname,
- ); fs.mkdirSync(OUT, { recursive: true }); (async () => { const mod = require(path.join(__dirname, modPath)); const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter, footer:
- + mod.title }); mod.build(d); const outPath = path.join(OUT, mod.filename); await d.save(outPath); console.log(


## Slide Notes From presentation/UNanofabTools/hscdisplayerserver/slides/_build/deckkit.js

READ ALOUD OR USE AS SPEAKER NOTES:

- . */ const pptxgen = require(
- ); // ---- Palette ---- const C = { crimson:
- , // U of U primary crimsonDk:
- , // darker crimson for bands/title ink:
- , // near-black body text gray:
- , // muted text grayLt:
- , // light panel / code box background panelLine:
- , // panel border codeInk:
- , // code text white:
- , }; const FONT_H =
- ; // headers — has personality, professional const FONT_B =
- ; // body const FONT_M =
- ; // monospace for code const PW = 13.33, PH = 7.5; // page size (LAYOUT_WIDE) const MX = 0.7; // left/right margin const CONTENT_W = PW - MX * 2; function makeShadow() { return { type:
- , blur: 5, offset: 2, angle: 135, opacity: 0.12 }; } class Deck { constructor({ title, subtitle, author, footer }) { const p = new pptxgen(); p.layout =
- ; p.author = author ||
- ; p.title = title; this.p = p; this.shortTitle = title; this.footer = footer ||
- ; this.n = 0; } // crimson footer band + slide number; consistent motif on content slides _footer(slide) { slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: PH - 0.32, w: PW, h: 0.32, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(this.footer, { x: MX, y: PH - 0.32, w: 8, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); slide.addText(String(this.n), { x: PW - 1.2, y: PH - 0.32, w: 0.5, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); } // small crimson square motif + title at top of content slides _header(slide, title) { slide.addShape(this.p.shapes.RECTANGLE, { x: MX, y: 0.55, w: 0.18, h: 0.36, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(title, { x: MX + 0.32, y: 0.42, w: CONTENT_W - 0.32, h: 0.7, margin: 0, fontFace: FONT_H, fontSize: 26, bold: true, color: C.ink, align:
- , }); } _content(title) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; this._header(slide, title); this._footer(slide); return slide; } _notes(slide, notes) { if (notes) slide.addNotes(notes); } // ---------- TITLE SLIDE ---------- title_slide({ kicker, title, subtitle, presenter, role, dept, date, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; // left crimson band motif slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: PH, fill: { color: C.crimson }, line: { type:
- }, }); // kicker (topic number / series) slide.addText(kicker ||
- , { x: 1.0, y: 1.5, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color: C.crimson, charSpacing: 2, align:
- , }); // main title slide.addText(title, { x: 1.0, y: 2.0, w: PW - 2, h: 1.7, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.ink, align:
- , }); // subtitle slide.addText(subtitle ||
- , { x: 1.0, y: 3.75, w: PW - 2.2, h: 0.8, margin: 0, fontFace: FONT_B, fontSize: 17, color: C.gray, align:
- , }); // presenter block const block = [ { text: presenter ||
- , options: { bold: true, color: C.ink, fontSize: 14, breakLine: true } }, ]; if (role) block.push({ text: role, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (dept) block.push({ text: dept, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (date) block.push({ text: date, options: { color: C.grayLt, fontSize: 11 } }); slide.addText(block, { x: 1.0, y: 5.5, w: PW - 2, h: 1.4, margin: 0, fontFace: FONT_B, align:
- , lineSpacingMultiple: 1.15, }); this._notes(slide, notes); return slide; } // ---------- SECTION DIVIDER ---------- section_slide({ label, title, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.crimsonDk }; slide.addText(label ||
- , { x: 1.0, y: 2.7, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color:
- , charSpacing: 2, }); slide.addText(title, { x: 1.0, y: 3.2, w: PW - 2, h: 1.6, margin: 0, fontFace: FONT_H, fontSize: 34, bold: true, color: C.white, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- BULLETS ---------- bullets({ title, intro, bullets, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const items = bullets.map((b, i) => { if (typeof b ===
- ) { return { text: b, options: { bullet: { code:
- , indent: 18 }, color: C.ink, fontSize: 15, paraSpaceAfter: 10, breakLine: true } }; } // {t, sub:true} return { text: b.t, options: { bullet: { code:
- , indent: 18 }, indentLevel: 1, color: C.gray, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true } }; }); slide.addText(items, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: PH - y - 0.6, margin: 0, fontFace: FONT_B, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- CODE / MONO CALLOUT ---------- code({ title, intro, code, caption, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, color: C.ink, valign:
- , }); y += 0.65; } const boxH = PH - y - (caption ? 1.0 : 0.6); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: boxH, rectRadius: 0.06, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(code, { x: MX + 0.5, y: y + 0.12, w: CONTENT_W - 0.7, h: boxH - 0.24, margin: 0, fontFace: FONT_M, fontSize: 12.5, color: C.codeInk, align:
- , }); if (caption) { slide.addText(caption, { x: MX + 0.32, y: y + boxH + 0.1, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 12, italic: true, color: C.gray, valign:
- , }); } this._notes(slide, notes); return slide; } // ---------- TWO COLUMN ---------- twocol({ title, left, right, notes }) { const slide = this._content(title); const y = 1.45, colW = (CONTENT_W - 0.5) / 2, h = PH - y - 0.6; const colX = [MX, MX + colW + 0.5]; [left, right].forEach((col, idx) => { const x = colX[idx]; // header chip slide.addText(col.heading, { x, y, w: colW, h: 0.45, margin: 0, fontFace: FONT_H, fontSize: 16, bold: true, color: C.crimson, valign:
- , }); const items = col.items.map((b) => ({ text: typeof b ===
- ? b : b.t, options: { bullet: { code:
- , indent: 16 }, color: C.ink, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true }, })); slide.addText(items, { x, y: y + 0.5, w: colW, h: h - 0.5, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- TABLE ---------- table({ title, intro, headers, rows, colW, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, italic: true, color: C.gray, valign:
- , }); y += 0.55; } const head = headers.map((htext) => ({ text: htext, options: { fill: { color: C.crimson }, color: C.white, bold: true, fontSize: 12.5, valign:
- }, })); const body = rows.map((r, ri) => r.map((cell) => ({ text: String(cell), options: { fill: { color: ri % 2 === 0 ? C.white : C.panel }, color: C.ink, fontSize: 11.5, valign:
- , }, })) ); slide.addTable([head, ...body], { x: MX + 0.32, y, w: CONTENT_W - 0.32, colW: colW || undefined, border: { type:
- , pt: 0.5, color: C.panelLine }, align:
- , fontFace: FONT_B, rowH: 0.3, autoPage: false, }); this._notes(slide, notes); return slide; } // ---------- NUMBERED STEPS / PROCESS ---------- steps({ title, intro, steps, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.6; } const n = steps.length; const avail = PH - y - 0.6; const rowH = Math.min(0.95, avail / n); steps.forEach((s, i) => { const ry = y + i * rowH; // number circle slide.addShape(this.p.shapes.OVAL, { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(String(i + 1), { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, margin: 0, fontFace: FONT_B, fontSize: 15, bold: true, color: C.white, align:
- , }); const parts = [{ text: s.h +
- , options: { bold: true, color: C.ink, fontSize: 14 } }]; if (s.d) parts.push({ text: s.d, options: { color: C.gray, fontSize: 13 } }); slide.addText(parts, { x: MX + 0.95, y: ry - 0.12, w: CONTENT_W - 0.95, h: 0.69, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- BIG STAT CALLOUTS (grid of numbers) ---------- stats({ title, intro, stats, notes }) { const slide = this._content(title); let y = 1.5; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const n = stats.length; const gap = 0.4; const cardW = (CONTENT_W - gap * (n - 1)) / n; const cardH = 2.4; stats.forEach((s, i) => { const x = MX + i * (cardW + gap); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(s.big, { x, y: y + 0.3, w: cardW, h: 1.1, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.crimson, align:
- , }); slide.addText(s.label, { x: x + 0.15, y: y + 1.45, w: cardW - 0.3, h: 0.85, margin: 0, fontFace: FONT_B, fontSize: 13, color: C.ink, align:


## Slide Notes From presentation/UNanofabTools/hscdisplayerserver/slides/_build/meta.js

READ ALOUD OR USE AS SPEAKER NOTES:

- Utah Nanofab · University of Utah
- UNanofabTools Server — A Plain-English Guide


## Slide Notes From presentation/UNanofabTools/hscdisplayerserver/slides/_build/tooldecks/hscdisplayerserver.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); module.exports = { filename:
- The original all-in-one website server — the predecessor of today's site. A plain-English walkthrough.
- This session covers HSCDisplayerServer.py — the original, all-in-one version of the website's server, before it was rewritten into
- the modern Flask app. It does everything the current site does, but packed into one large file. We'll cover what it is, why it's
- worth understanding, how it differs from the new version, and what should happen to it. No coding background needed.
- Does everything the current site does, all in one file.
- The current Flask website is a tidied-up rewrite of this.
- Labeled 'legacy' because new work happens in the new version.
- Define it plainly. This is one big file that was the cleanroom website's server before the rewrite. It handles logins, tasks, machine
- pages, and sensor data — everything — but all in a single program. The current Flask site is the reorganized version of this same
- thing. It's called 'legacy' because it's the old version; new development targets the new one.
- Why understand it at all?
- History: it explains why the new server is organized the way it is.
- It may still be the one actually running, depending on the setup.
- A maintainer must know which server is live and how this one works.
- It's a 'Rosetta stone' between old behavior and the new code.
- Two reasons to care. First, history: understanding the original explains many choices in the rewrite. Second, and more practically,
- depending on the deployment this monolith might still be the live server — so a maintainer needs to know which one is running and how
- this one behaves. Because its web addresses match the new server's, it's also a useful reference for comparing old and new behavior.
- The task list: assign, claim, complete, attach files.
- Machine pages: tables, graphs, log downloads.
- Accepts the same Raspberry Pi sensor data the new site does.
- List the features to show it's a complete server, not a fragment. It does everything the current site does: the whole login and
- permission system, the task list, the machine pages with their tables and graphs, and the sensor-data endpoints the Picos post to.
- Functionally it and the new server are the same; the difference is purely how the code is organized.
- How it differs from the new version
- One giant 'switchboard' for all addresses.
- Split into labeled chapters (blueprints).
- Encryption handled by nginx out front.
- Organized into many small files.
- Contrast the two. The legacy server uses Python's built-in, bare-bones web tools, so the developer wrote a lot of plumbing by hand —
- including one enormous switchboard that decides what to do for each web address, and its own encryption. The new version uses Flask,
- which handles that plumbing, splits the switchboard into tidy labeled chapters, and lets nginx handle encryption. Same behavior, much
- cleaner structure. That cleanup is exactly why the rewrite happened.
- All requests funnel through two long decision blocks:
- a page view comes in → do_GET:
- if /machines ... elif /admin ... elif /download ...
- a form/upload comes in → do_POST:
- if /login ... elif /createtasks ... elif /sdsanalog ...
- (the new server splits these into separate chapters)
- Two long 'if this address, do that' blocks handle everything.
- Make the structure concrete without code skills. Every request funnels into one of two long decision blocks: one for page views, one
- for form submissions and uploads. Each is a long 'if the address is this, do that' chain covering every feature. It works, but it's
- hard to read and change — which is why the rewrite broke it into separate, labeled sections. Seeing this explains the whole motivation
- Same fundamentals as the new server
- Passwords hashed (never stored in plain text).
- Small databases for users, sessions, and tasks.
- Reads the same machine spreadsheets to draw pages.
- Reassure that the security and data fundamentals are the same — this is what the new server was modeled on. Passwords are hashed,
- two-factor is required, users/sessions/tasks live in small databases, and it reads the same HSCDATA spreadsheets to render machine
- pages. The new server didn't change these ideas; it reorganized how they're expressed in code.
- Has a debug mode for local testing, like the new server.
- Debug mode skips two-factor and encryption for convenience.
- The code is emphatic: never turn it on for the real server.
- Same rule and same risk as the new version.
- Note the debug switch since it's a shared risk. Like the new server, this one has a debug mode that skips two-factor and encryption
- for local development, with prominent warnings never to enable it in production. Same discipline applies. It's worth knowing both
- From monolith to modern site
- The arc this file sits in.
- one big file did everything — and it worked.
- the same features, split into tidy chapters.
- confirm what's live and retire the older one.
- Give the historical arc. This monolith came first and did the whole job. The Flask app is the rewrite of the same features into a
- maintainable structure. The remaining step is organizational: confirm which is actually serving the site and consolidate onto the
- Flask app. Framing it as a timeline helps a non-technical audience see this isn't 'broken,' it's 'superseded.'
- If this is the one in production
- First priority: verify which server is actually live.
- Make sure the Flask app covers every address still in use.
- Watch for a couple of legacy-only addresses with no new-version twin.
- Then plan the cutover and retire this file.
- Address the practical case. If this monolith is what's actually running, the work is to confirm that, check that the Flask app
- implements every address still being used (a couple of legacy-only ones may exist), then plan a careful cutover. The risk to avoid is
- patching one server while the other is live. The developer notes include a route-by-route comparison to support this.
- What should happen to it
- Treat it as reference/fallback — don't add features here.
- Confirm which server is actually live in production.
- Make sure the new server covers everything still in use.
- Then fully migrate and retire this file.
- End with the recommendation. The plan should be: don't extend this file, confirm which server is actually running, ensure the Flask
- app covers every address still in use (a couple of legacy-only ones may exist), then migrate fully and retire the monolith. Running
- two implementations of the same system in parallel is the real long-term risk. All of this is in the developer notes and issues list.
- Same features; one giant file instead of tidy chapters.
- Same fundamentals: hashing, two-factor, the same data.
- Goal: confirm what's live, reconcile, then retire it for the Flask app.
- Wrap up. HSCDisplayerServer is the first draft of the website's server — complete and functional, but monolithic. The Flask app is
- the clean rewrite. Understanding this file explains the rewrite and helps whoever maintains the system know what's live. The endgame
- is to consolidate on the Flask app. Questions welcome.
