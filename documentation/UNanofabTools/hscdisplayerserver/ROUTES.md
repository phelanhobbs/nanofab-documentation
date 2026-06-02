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
