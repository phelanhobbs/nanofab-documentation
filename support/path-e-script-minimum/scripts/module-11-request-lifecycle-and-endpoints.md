# Minimum Acceptable Full Path E - Module 11: Request Lifecycle And Endpoints

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-11-request-lifecycle-endpoints.md

# Module 11 - Request Lifecycle And Endpoint Reference

## Goal

The maintainer can trace one request from browser or device to nginx, Flask, blueprint, service code, persistence, response, and documentation, then use that skill to audit route drift.

## Required Screen

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx)
- `presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx)
- `presentation/UNanofabTools/flaskserver/13-Request-Lifecycle-Walkthrough.md` (repo path: presentation/UNanofabTools/flaskserver/13-Request-Lifecycle-Walkthrough.md)
- `presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md` (repo path: presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md)
- `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (repo path: documentation/UNanofabTools/flaskserver/05-http-api-reference.md)

## Verbatim Script

READ ALOUD:

"This module ties together everything we have covered so far. A request is not magic. It enters through a network path, reaches Flask, passes through routing and guards, calls code, touches data, and returns a response."

SHOW:

Open `13-Request-Lifecycle-Walkthrough.pptx`.

READ ALOUD:

"For a browser request, the public user talks to `nfhistory` over HTTPS. nginx receives the request and proxies to Flask. Flask matches a route. Decorators and route logic enforce login or admin requirements where applicable. The route calls service functions or direct helpers. The app reads or writes SQLite, PostgreSQL, or file trees. Then Flask returns HTML, JSON, a redirect, a file, or an error."

"For a device request, the shape is similar but the guard model may differ. Device endpoints can be unauthenticated. That makes payload validation and network exposure especially important."

SHOW:

Open `15-Endpoint-Reference.pptx`.

READ ALOUD:

"The endpoint reference exists so a maintainer can audit what the app exposes. For each route family, we want method, path, guard, inputs, behavior, response, and known risks. If source changes, this reference must change."

## Source Demo

DO:

Run:

```sh
rg -n "@.*route|Blueprint|login_required|admin_required" ../UNanofabTools/app/blueprints
```

READ ALOUD:

"This command finds route decorators and guards. The source is the starting point for a route drift audit."

DO:

Pick one endpoint from `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (repo path: documentation/UNanofabTools/flaskserver/05-http-api-reference.md). For that endpoint, identify:

```text
method
path
guard
source file
function name
input
service calls
data side effects
response
known issue, if any
```

READ ALOUD:

"This is the basic endpoint audit pattern. If you can do this for one endpoint, you can do it for all endpoints. This is how future route changes stay documented."

## Drift Rule

READ ALOUD:

"If an endpoint exists in source but not in docs, docs are incomplete. If an endpoint exists in docs but not source, docs are stale. If the docs say a route requires login but the source has no guard, that is potentially high severity. If the docs say an endpoint writes one data store but source writes another, that can be a data-integrity finding."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What are the stages in a browser request? | Browser to HTTPS/nginx, proxy to Flask, route/blueprint match, auth guard, service/data work, response. |
| What are the stages in a device request? | Device POST/GET to API endpoint, Flask route, validation, storage or lookup, JSON response; auth may differ from browser routes. |
| How do you find all route decorators? | Run `rg -n "@.*route|Blueprint|login_required|admin_required" ../UNanofabTools/app/blueprints`. |
| What does the endpoint reference need to say for each route? | Method, path, guard, inputs, behavior, side effects, response, and known risks/issues. |
| What is route drift? | A mismatch between documented endpoints and actual source behavior. |
| Which route-drift cases are high severity? | Missing auth in source, undocumented write routes, docs claiming wrong guards, source writing different data stores, or recovery/security commands pointing to wrong paths. |

REQUIRE:

The maintainer can audit one endpoint from docs to source to data side effects.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot perform one route audit. Assign a second endpoint as homework.


# Expanded Module 11: Request Lifecycle And Endpoints

READ ALOUD:

This expanded section revisits Module 11, Request Lifecycle And Endpoints. The focus is browser/device request flow and route drift audits. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 11

READ ALOUD:

We are now doing the orientation pass for Request Lifecycle And Endpoints. The maintainer should connect this module to browser/device request flow and route drift audits. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx`
- `presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx`
- `documentation/UNanofabTools/flaskserver/05-http-api-reference.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention browser/device request flow and route drift audits. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 11

READ ALOUD:

We are now doing the evidence pass for Request Lifecycle And Endpoints. The maintainer should connect this module to browser/device request flow and route drift audits. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx`
- `presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx`
- `documentation/UNanofabTools/flaskserver/05-http-api-reference.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention browser/device request flow and route drift audits. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/05-http-api-reference.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 05 — HTTP API Reference

Complete reference for every route the server exposes. Routes are grouped by blueprint. For each: HTTP method(s), path, authentication, request inputs, response, status codes, and side effects.

## 5.1 Conventions

- **Auth** values: `Public` (no auth), `Login` (`@login_required`), `Admin` (`@login_required`+`@admin_required`), `Assign` (login + `can_assign` checked in-body), `Device` (no auth; intended for private-network devices).
- "Form" = `application/x-www-form-urlencoded` or `multipart/form-data`. "JSON" = `application/json` body. "Query" = URL query string.
- Blueprints with a URL prefix are noted; otherwise routes are at the site root.
- Unless stated, HTML routes return `text/html`; API routes return `application/json`.

## 5.2 Auth blueprint — `app/blueprints/auth.py` (no prefix)

### `GET|POST /login` — Public
- **GET**: renders `login.html`.
- **POST form**: `username`, `password`.
- **Behavior**: `sanitize_input` both fields → `verify_user_credentials`. If valid and `DEBUG_MODE`, create session + `login_user` + redirect `tasks.index`. If valid and not debug, run `duo_authenticate(user.unid)`; on `allow`, proceed; else flash `'2FA authentication failed'` and redirect to login. Invalid creds flash `'Invalid credentials'`.
- **Responses**: 302 redirect to `/tasks` on success; 302 back to `/login` on failure (with flash).

### `GET|POST /signup` — Public
- **GET**: renders `signup.html`.
- **POST form**: `username`, `password`, `unid`.
- **Behavior**: reject if username exists. If `DEBUG_MODE`, create user immediately; else `duo_authenticate(unid)` first. On success flash `'User created successfully'` and redirect to `/login`.
- **Responses**: 302 to `/login` (success) or `/signup` (failure).

### `GET /logout` — Login
- **Behavior**: `logout_user()`, flash, redirect to `/login`.
- **Responses**: 302 to `/login`.

### `GET|POST /resetpassword` — Public
- **GET**: renders `resetpassword.html`.
- **POST form**: `username`, `unid`, `password` (new).
- **Behavior**: `verify_user_unid(username, unid)`; if matched, `update_user_password`. Flash success/failure.
- **Responses**: 302 to `/login` (success) or `/resetpassword` (failure).
- **Note**: no Duo step; the uNID is the only secret.

## 5.3 Tasks blueprint — `app/blueprints/tasks.py` (no prefix)

### `GET /tasks` — Login
- **Behavior**: fetches `get_user_tasks(current_user.username)`, `get_unfinished_tasks()`, `get_all_tasks()`, and `can_user_assign(...)`; renders `tasks.html`.
- **Response**: 200 HTML.

### `GET|POST /createtasks` — Assign
- **Guard**: if `not can_user_assign(...)`, flash + redirect to `/tasks`.
- **GET**: renders `createTask.html`.
- **POST form**: `title`, `description`, `dueDate` (`YYYY-MM-DD`, optional), `priority`, `assignees` (multi-valued via `getlist`).
- **Behavior**: parse due date (flash on bad format), `task_service.create_task(...)`. Flash success/failure.
- **Responses**: 302 to `/tasks` (success) or `/createtasks` (failure).

### `POST /changestatus` — Login
- **JSON body**: `{ "taskId": <id> }`.
- **Behavior**: `update_task_status(task_id)` → defaults status to `'Completed'`.
- **Responses**: `200 {"status":"success"}` or `400 {"status":"error"}`.
- **Note**: no ownership check; any logged-in user may complete any task.

### `POST /claimTask` — Login
- **JSON body**: `{ "taskId": <id> }`.
- **Behavior**: `claim_task(task_id, current_user.username)` adds the user as an assignee unless already present.
- **Responses**: `200 {"status":"success","message":"Task claimed"}` or `400 {"status":"error","message":"Task already claimed or error occurred"}`.

### `POST /uploadtaskfile` — Login
- **Form (multipart)**: `task_id`, `file`.
- **Behavior**: validates presence + extension; `upload_task_file` saves with `secure_filename` + timestamp suffix and records the path.
- **Responses**: `200` success; `400` on missing/invalid file.

### `GET /users` — Login
- **Behavior**: opens `instance/signininfo.db` (or `./signininfo.db`) directly via `sqlite3`; returns sorted usernames.
- **Responses**: `200 ["alice","bob",...]`; `500 []` on error.

## 5.4 Admin blueprint — `app/blueprints/admin.py` (no prefix)

All routes are `Admin` (decorated `@login_required` + `@admin_required`). The guard redirects non-admins to `/tasks` with a flash.

### `GET /adminpanel` — Admin
- Renders `adminpanel.html` with `get_all_users()`.

### `POST /deleteUser` — Admin
- **JSON body**: `{ "uNID": "<unid>" }`. → `admin_service.delete_user`.
- **Responses**: `200 {"status":"success"}` or `400 {"status":"error"}`.

### `POST /toggleAdminStatus` — Admin
- **JSON body**: `{ "uNID": "<unid>" }`. → `toggle_admin_status`.
- **Responses**: `200`/`400` as above.

### `POST /toggleAssign` — Admin
- **JSON body**: `{ "uNID": "<unid>" }`. → `toggle_assign_privilege`.
- **Responses**: `200`/`400` as above.

## 5.5 Machines blueprint — `app/blueprints/machines.py` (no prefix)

All routes are `Login`. Three categories: index pages, per-machine pages, and file/graph utilities.

### Index pages
| Route | Renders |
|-------|---------|
| `GET /` | `index.html` (site root) |
| `GET /machines` | `machines.html` |
| `GET /logfiles` | `logFileIndex.html` |

### Per-machine data pages
Each calls `render_machine_data(machine, graph_columns)` (CSV table + optional graphs) or `render_log_files(machine, datatype)` (file listing).

| Route | Handler call |
|-------|--------------|
| `GET /ald` | `render_machine_data('ALD', [['Chuck Temperature (C)','Precursor Temperature (C)']])` |
| `GET /ebeam` | `render_machine_data('Ebeam', ['Base Pressure','Temperature 1','Temperature 2'])` |
| `GET /mocvd` | `render_machine_data('MOCVD', [])` |
| `GET /parylene` | `render_log_files('Paralyne', 'uploads')` |
| `GET /pecvd` | `render_machine_data('PECVD', [])` |
| `GET /denton635` | `render_log_files('Denton635', 'uploads')` |
| `GET /denton18` | `render_machine_data('Denton18', [])` |
| `GET /drie` | `render_machine_data('DRIE', [])` |
| `GET /isotropic` | `render_machine_data('Isotropic', [])` |
| `GET /plasmalab` | `render_machine_data('Plasmalab', [])` |
| `GET /plasmatherm` | `render_machine_data('PlasmaTherm', [])` |
| `GET /technics` | `render_machine_data('Technics', [])` |
| `GET /cleanox` | `render_machine_data('CleanOx', [])` |
| `GET /dopedox` | `render_machine_data('DopedOx', [])` |
| `GET /lto` | `render_machine_data('LTO', [])` |
| `GET /nitride` | `render_machine_data('Nitride', [])` |
| `GET /poly` | `render_machine_data('Poly', [])` |
| `GET /allwin` | `render_machine_data('Allwin', [])` |

`render_machine_data` reads `HSCDATA/small_<machine>_DataCollection.csv`, builds an HTML table (`data_service.csv_to_html_table`) and Chart.js datasets (`data_service.prepare_graph_data`), and renders `machine_data.html`. Missing CSV → `csv_to_html_table` raises; surfaces as a 500.

### Log-file listing pages
| Route | Handler call |
|-------|--------------|
| `GET /aldlog/rfdata` | `render_log_files('ALD','RF')` |
| `GET /aldlog/pressuredata` | `render_log_files('ALD','Pressure')` |
| `GET /paralyneuploads` | `render_log_files('Paralyne','uploads')` |

`render_log_files` lists `LogData/<machine>/<datatype>/`, sorts via `data_service.sort_files_by_time` with a per-machine `date_format`, renders `log_files.html`.

### `GET /download/<path:filepath>` — Login
- **Behavior**: `unquote` the path; canonicalize with `os.path.realpath`; support a legacy `Desktop/Logs/` prefix by re-rooting under `LOG_DATA_DIR`; then enforce `actual_path.startswith(log_dir + os.sep)`.
- **Responses**: `200` file (as attachment) if it exists; `403 {"error":"Access denied"}` if outside `LOG_DATA_DIR`; `404 {"error":"File not found"}` if missing.

### `GET /graph/<path:filepath>` — Login
- **Behavior**: same path-safety check; chooses graph columns based on URL parts (`ALD/RF` → For/Refl Pwr; `ALD/Pressure` → Pressure; `Paralyne/analog` → Vacuum pressure); `data_service.prepare_graph_data`; renders `graph.html` with JSON.
- **Responses**: `200` HTML; `403` access denied; `400 {"error":...}` on processing error.

### `POST /submitALDData` — Login
- **Form**: `material`, `depmode`, `temp`.
- **Behavior**: `data_service.calculate_ald_deposition_rate` (pandas filter; rate = thickness/cycles). Renders `ald_graph.html` with a Chart.js dataset.
- **Responses**: `200` HTML if data found; `404 {"error":"Data not found"}` otherwise.

## 5.6 API blueprint — `app/blueprints/api.py` (no prefix)

All routes are `Device` (no auth). Intended for private-network devices and desktop tools.

### `POST /sdsanalog` — Device
- **Headers**: `Content-Type: text/csv`; `X-Session-ID`, `X-Batch-Number`, `X-Total-Batches` (all required); `X-Is-Final-Batch` (optional, `"true"`).
- **Body**: raw CSV text (one batch).
- **Behavior**: writes the batch to `LogData/Paralyne/temp/<session>/batch_NNNN.csv`; writes `start_time.txt` on first batch; when received-count == total or final flag, calls `combine_csv_batches_final(session, cleanup=False)`.
- **Responses**: `200 {"status":"success","message":"Batch n/m received","session_id":...}`; `400` missing headers / wrong content-type; `500` on error.

### `POST /sdsanalogfinished` — Device
- **Input**: `session_id` from JSON body or `X-Session-ID` header.
- **Behavior**: `combine_csv_batches_final(session)` (cleanup=True default) → writes `LogData/Paralyne/analog/<ts>_SDSLOG_combined_<session>.csv`, removes temp dir.
- **Responses**: `200 {"status":"session_finalized",...}`; `500` on error.

### `POST /denton18pump` — Device
- **JSON body**: `{ "pressure": <raw ADC int> }`.
- **Behavior**: if `LogData/denton18/pumpdata/current_run.txt` exists, append to the referenced CSV; else create `<ts>_DENTON18PUMPLOG.csv` (+ header) and record its path. Converts pressure: `raw/65535*3.3*3.0/0.009`. Appends `[timestamp, pressure]`.
- **Responses**: `200 {"status":"success"}`; `500` on error.

### `POST /denton18pumpfinished` — Device
- **Behavior**: deletes `current_run.txt`.
- **Responses**: `200 {"status":"file closed"}`; `400 {"status":"no file to close"}`.

### `GET /api/paralyne/analog/list` — Device
- **Behavior**: lists `*.csv` in `LogData/Paralyne/analog/` with `filename`, `size`, `modified` (ISO), `download_url`; sorted newest-first.
- **Responses**: `200 {"status":"success","files":[...],"count":N}`; `404 {"error":"Directory not found"}`; `500`.

### `GET /api/paralyne/analog/download/<filename>` — Device
- **Behavior**: rejects names containing `..`, `/`, `\`; requires `.csv`; serves from the analog dir as attachment.
- **Responses**: `200` file; `400 {"error":"Invalid filename"}`; `404 {"error":"File not found"}`; `500`.

### `POST /particle-data` — Device
- **JSON body** (required keys): `room_name`, `sensor_number`, `timestamp` (Unix number or ISO string). Optional nested: `raw_measurements`, `converted_values.{number_concentrations_ft3, differential_bins_ft3, mass_concentrations_ug_m3}`.
- **Behavior**: append a row to `LogData/particle_sensors/<id>_historical.csv`; upsert the `(room,sensor)` row in `particle_sensor_data` (unique constraint).
- **Responses**: `200 {"status":"success","message":...,"sensor_id":...,"timestamp":...}`; `400` non-JSON / missing field; `500` on error (rolls back DB).

### `GET /particle-data` — Device
- **Query**: optional `room_name`, `sensor_number`.
- **Behavior**: if **both** provided → returns historical CSV data (`get_historical_csv_data`). Otherwise returns current DB rows, optionally filtered by either param.
- **Responses (current)**: `200 {"status":"success","count":N,"sensors":[to_dict...]}`.
- **Responses (historical)**: `200 {"status":"success","room_name":...,"sensor_number":...,"data_source":"historical_csv","record_count":N,"historical_data":[...]}`; `404` if no CSV; `500`.

### `POST /sensor-data` — Device
- **JSON body** (`get_json(force=True)`): `room_name`, `sensor_number` (required); optional `timestamp`, `temperature_c`, `humidity_pct`, `raw_measurements`, `converted_values`.
- **Behavior**: if `raw` present → `log_historical_particle_data` (→ `particle_sensors/`) and upsert `particle_sensor_data` (incl. temp/humidity). If temp+humidity present → append `LogData/env_sensors/<id>_historical.csv`.
- **Responses**: `200 {"status":"success"}`; `400` no body / missing room/sensor; `500` (rolls back).
- **Note**: does **not** write to `LogData/sensors/` — see GET below.

### `GET /sensor-data` — Device
- **Query**: `room_name`, `sensor_number` (both required).
- **Behavior**: reads `LogData/sensors/<room>_<sensor>_combined.csv` via `_sensor_csv_path`.
- **Responses**: `200 {"status":"success",...,"count":N,"data":[...]}`; `400` missing params; `404` if file absent; `500`.
- **Known issue**: the POST never writes that file, so this returns 404 in practice. See the separate known-issues file.

### `POST /env-data` — Device
- **JSON body** (all required): `room_name`, `sensor_number`, `timestamp`, `temperature_c`, `humidity_pct`.
- **Behavior**: appends `LogData/env_sensors/<id>_historical.csv` (header on first write).
- **Responses**: `200 {"status":"success",...}`; `400` non-JSON / missing field; `500`.

### `GET /env-data` — Device
- **Query**: `room_name`, `sensor_number` (both required).
- **Behavior**: reads `LogData/env_sensors/<id>_historical.csv`; coerces `temperature_c`, `humidity_pct`, `timestamp` to float.
- **Responses**: `200 {"status":"success",...,"record_count":N,"data":[...]}`; `400` missing params; `404` no file; `500`.

## 5.7 Chemical inventory blueprint — `app/blueprints/chem_inventory.py` (prefix `/chem`)

All routes are effectively **Public** — `login_required` is imported but never applied. (Security implication noted in `07` and the known-issues file.)

> **Auth note (since 2026-06-25):** the entire `/chem` blueprint is gated by a `before_request` hook — every route below requires `session['chem_authed']`, set only by `/chem/enter` after it validates a time-limited HMAC-signed link from the WordPress staff-tools page (secret `CHEM_SSO_SECRET`). Unauthenticated requests redirect to the staff-tools URL. The per-route labels below read **Chem session**; they were "Public" before the gate. Separate from Flask-Login.

### `GET /chem/` and `GET /chem/inventory` — Chem session (WordPress SSO)
- **Query**: `q` (search), `limit` (default 500), `show_removed` (`"1"` to include removed).
- **Behavior**: `search_inventory(q, limit, show_removed)`; renders `chem/inventory.html`.

### `GET /chem/inventory/print` — Chem session (WordPress SSO)
- **Query**: `q`, `limit` (default 5000). Renders `chem/inventory_print.html`.

### `GET /chem/inventory/export.csv` — Chem session (WordPress SSO)
- **Query**: `q`, `limit` (default 500000).
- **Behavior**: `export_inventory_csv` (includes removed). Returns `text/csv` with `Content-Disposition: attachment; filename=cheminventory_export.csv`.

### `GET|POST /chem/add` — Chem session (WordPress SSO)
- **GET**: renders `chem/add.html`.
- **POST form** (selected): `name` (required), `vendor`, `catalog`, `state`, `size`, `unit`, `system`, `lot_number`, `qty` (clamped 1–500), location fields (`area_class`, `room_no`, `room_name`, `room_desc`, `storage_location`, `storage_sublocation`, `storage_device`), dates (`entry`, `manuf_date`, `expire`), `choice`, `nmr`, `nmr_exp`, `owner`, `added_by`, `notes`.
- **Behavior**: `add_containers(data)` (atomic upsert of vendor/category/room/item + N containers + transactions). Redirects to barcode queue with `preselect` of new barcodes.
- **Responses**: 302 to `/chem/barcodes/queue?preselect=...` on success; 302 back to `/chem/add` on error or missing name.

### `GET /chem/report` — Chem session (WordPress SSO)
- **Behavior**: runs ten aggregations (`report_totals/expiring/expired/nmr_due/by_room/by_vendor/by_system/by_owner`, `get_scan_reports`, `get_inventory_scan_coverage`) plus scanned/unscanned tallies; renders `chem/report.html`.

### `GET|POST /chem/upload-scans` — Chem session (WordPress SSO)
- **GET**: renders `chem/upload_scans.html`.
- **POST form**: `user`, `report_name`, `location`, `barcode_text` (newline list), optional file `file` (`.txt`). De-dupes preserving order.
- **Behavior**: `import_scans(...)` creates a cycle, inserts `scan_raw` per code, `container_scans` + `last_scan_at` for matches, updates cycle counts, logs a `SCAN_UPLOAD` transaction.
- **Responses**: 302 to `/chem/report` (success) or `/chem/upload-scans` (no barcodes).

### `GET /chem/barcodes/queue` — Chem session (WordPress SSO)
- **Query**: `q`, `only_unprinted` (default `"1"`), `limit` (default 500), `preselect` (CSV of barcodes). `get_barcode_queue`; renders `chem/barcode_queue.html`.

### `GET /chem/barcodes/print` — Chem session (WordPress SSO)
- **Query**: `q`, `copies` (≥1). `get_barcode_labels`; paginates 30/page; renders `chem/barcode_print.html`.

### `POST /chem/barcodes/mark-printed` — Chem session (WordPress SSO)
- **Form**: `barcode` (multi). `mark_barcodes_printed`; flash; 302 to queue.

### `POST /chem/barcodes/print-selected` — Chem session (WordPress SSO)
- **Form**: `barcode` (multi). 302 to `/chem/barcodes/print?barcodes=<csv>`.

### `GET|POST /chem/remove` — Chem session (WordPress SSO)
- **GET**: renders `chem/remove.html`.
- **POST form**: `barcode` (one or many; comma/newline/tab separated), `performed_by`, `reason`, `notes`.
- **Behavior**: `remove_containers_by_barcodes` → soft-delete (`status='REMOVED'`), appends a removal note, logs `REMOVE`. Flashes counts + not-found.
- **Responses**: 302 to `/chem/remove`.

### `GET|POST /chem/move` — Chem session (WordPress SSO)
- **GET**: renders `chem/move.html`.
- **POST form**: `barcode` (required), `room_no`, `room_desc`, `area_class`, `storage_location`, `storage_sublocation`, `storage_device`; actor = `current_user.username` if authenticated else `performed_by`.
- **Behavior**: `move_container(...)` (resolve room, COALESCE-update location, log `MOVE`).
- **Responses**: 302 to `/chem/inventory?q=<barcode>` (success) or `/chem/move` (error).

### `POST /chem/move-bulk` — Chem session (WordPress SSO)
- **Form**: `bulk_barcodes` (many), destination fields, `performed_by`.
- **Behavior**: `bulk_move_by_barcodes(...)` (one resolved room, per-barcode COALESCE update, log `BULK_MOVE`). Flashes moved/requested + unmatched.
- **Responses**: 302 to `/chem/move`.

### `GET /chem/edit` — Chem session (WordPress SSO)
- Renders `chem/edit.html` (lookup form; populated client-side via `/chem/api/container_lookup`).

### `POST /chem/edit-container` — Chem session (WordPress SSO)
- **Form**: `container_id` (required int) plus editable fields (`item_name`, `description`, `catalog_number`, `physical_state`, `size`, `unit`, `system`, `vendor_name`, room fields, storage fields, dates, `lot_number`, `choice`, `nmr`, `nmr_expiry`, `owner`, `notes`, `added_by`).
- **Behavior**: `update_container(container_id, data)` (rename item if provided, resolve room, keep-or-update each field, log `EDIT`).
- **Responses**: 302 to `/chem/edit`; flashes errors for missing/invalid `container_id`.

### `GET /chem/transactions` — Chem session (WordPress SSO)
- **Query**: `q`. `get_transactions(q, limit=1000)`; renders `chem/transactions.html`.

### `GET /chem/api/inventory_json` — Chem session (WordPress SSO)
- **Query**: `q`, `limit` (default 500). Returns `{"rows":[...]}`.

### `GET /chem/api/suggest` — Chem session (WordPress SSO)
- **Query**: `field`, `q`, `limit` (default 10). Returns `{"results":[...]}`.
- **Note**: `suggest` is a **stub** returning `[]`; this endpoint always responds with an empty list. (Known issue.)

### `GET /chem/api/autofill` — Chem session (WordPress SSO)
- **Query**: `catalog`, `name`. Returns `{"data":{...}}`.
- **Note**: `autofill` is a **stub** returning `{}`; this endpoint always responds with an empty object. (Known issue.)

### `GET /chem/api/container_lookup` — Chem session (WordPress SSO)
- **Query**: `barcode`.
- **Behavior**: inline SQL join over containers/items/vendors/rooms. Returns `{"data": {...} | null}`.

## 5.8 Particle demo blueprint — `app/blueprints/particle_demo_will.py` (prefix `/particle-demo`)

### `GET /particle-demo/` — Public
- Serves `app/templates/particle-demoWill/UtahNanofabParticleCounterDemo.html`; `404` if missing.

### `GET /particle-demo/<path:filename>` — Public
- Serves an asset from the demo dir; rejects `..` or leading `/` with `400`; `404` if missing.

## 5.9 Inline routes — `app/__init__.py`

| Route | Auth | Behavior |
|-------|------|----------|
| `GET /js/<path:filename>` | Public | `send_static_file('js/<filename>')` |
| `GET /css/<path:filename>` | Public | `send_static_file('css/<filename>')` |
| `GET /favicon.ico` | Public | serves repo-root `favicon.ico` or `404` |

## 5.10 Route count

79 registered live routes: auth 4, tasks 6, admin 4, machines 27, api 12, chem 21, particle-demo 2, inline 3. `app/blueprints/chem_inventory_remote.py` defines duplicate `/chem/*` routes but is not imported or registered, so it is excluded.

Continue to 06-service-layer-reference.md (repo path: documentation/UNanofabTools/flaskserver/06-service-layer-reference.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/06-service-layer-reference.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 06 — Service Layer Reference

The `app/services/` package contains the business logic and persistence. Blueprints call these functions; the functions own the database/file access. This document lists every public function with its signature, parameters, return value, behavior, and error handling.

General conventions across services:
- Most functions wrap their work in `try/except` and return a sentinel (`None`, `False`, `[]`) on error, logging via `current_app.logger` or `print`.
- `auth_service`/`admin_service` use the Flask-SQLAlchemy ORM. `task_service` uses raw `sqlite3`. `chem_service` uses SQLAlchemy Core. `data_service` uses `csv`/`pandas`.

---

## 6.1 `auth_service.py`

Imports: `bcrypt`, `uuid`, `asyncio`, `duo_client`, `current_app`, `datetime/timedelta`, and `db, User, Session` from models.

### `hash_password(password) -> bytes`
bcrypt-hashes `password` (`bcrypt.hashpw(password.encode(), bcrypt.gensalt())`). Returns the hash bytes.

### `verify_password(password, password_hash) -> bool`
`bcrypt.checkpw(password.encode(), password_hash)`. Returns match boolean.

### `create_user(username, password, unid) -> User | None`
Hashes the password, constructs `User`, commits. Returns the `User` on success; on exception rolls back, logs, returns `None`.

### `verify_user_credentials(username, password) -> User | None`
Looks up by `username`; if found and password verifies, returns the `User`; else `None`. (Skips bcrypt when the user doesn't exist — minor timing oracle.)

### `verify_user_unid(username, unid) -> bool`
Returns whether a row exists matching both `username` and `unid`. Used by password reset.

### `update_user_password(username, new_password) -> bool`
Re-hashes and saves a new password for `username`. Returns `True`/`False`; rolls back and logs on error.

### `create_user_session(username) -> str`
Generates a UUID4, inserts a `Session` row, commits, returns the `session_id` string.

### `get_user_from_session(session_id) -> str | None`
Returns the `username` for a session row, or `None`.

### `delete_old_sessions(minutes=120) -> None`
Deletes `Session` rows older than `minutes`. **Not auto-scheduled**; call from a cron/admin task.

### `is_user_admin(username) -> bool`
Returns the user's `is_admin` flag, or `False` if not found.

### `can_user_assign(username) -> bool`
Returns the user's `can_assign` flag, or `False` if not found.

### `async duo_authenticate(unid) -> bool`
Builds `duo_client.Auth(ikey, skey, host)` from config; calls `auth_api.auth(username=unid, factor='push', device='auto')` via `asyncio.to_thread` (the duo_client call is blocking). Returns `response['result'] == 'allow'`. On exception logs and returns `False`. Invoked from blueprints with `asyncio.run(...)`.

### `sanitize_input(input_str, max_length=255) -> str`
`.strip()` → truncate to `max_length` → `html.escape(...)`. Defense-in-depth for XSS; not SQL-injection defense (parameterized queries handle that).

---

## 6.2 `admin_service.py`

Imports `current_app`, `db, User`.

### `get_all_users() -> list[User]`
`User.query.all()`.

### `delete_user(unid) -> bool`
Finds by `unid`, deletes, commits. `True`/`False`; rollback+log on error.

### `toggle_admin_status(unid) -> bool`
Flips `is_admin` for the user; commits. `True`/`False`.

### `toggle_assign_privilege(unid) -> bool`
Flips `can_assign`; commits. `True`/`False`.

---

## 6.3 `task_service.py`

Uses raw `sqlite3` (not the ORM). Imports `os`, `sqlite3`, `datetime`, `current_app`, `werkzeug.utils.secure_filename`.

### `_get_db_path(db_name='tasks.db') -> str`
Returns `instance/<db_name>` if `instance/` exists, else `<db_name>`. Private helper.

### `create_task(title, description, due_date, priority, assigner, assignees) -> int | None`
Inserts a `tasks` row (status `'Pending'`, `task_assign_date = now`), then one `assignees` row per name. Returns `lastrowid` (new task id) or `None` on error. `due_date` is a `datetime` or `None` (formatted `%Y-%m-%d`). Uses parameterized SQL.

### `get_user_tasks(username) -> list[tuple]`
Tasks where `task_assigner == username` OR the user is an assignee. SQL uses `LEFT JOIN assignees` + `GROUP_CONCAT(assignee_name)` grouped by `task_id`. Each returned tuple is the task columns + concatenated assignees + a trailing tuple of file rows (from a per-task `task_files` query). `[]` on error.

### `get_all_tasks() -> list[tuple]`
As above without the WHERE filter.

### `get_unfinished_tasks() -> list[tuple]`
As above with `WHERE task_status != 'Completed'`.

### `get_task_by_id(task_id) -> tuple | None`
Single task by id (with concatenated assignees). `None` if missing/error.

### `update_task_status(task_id, status='Completed') -> bool`
`UPDATE tasks SET task_status=? WHERE task_id=?`. `True`/`False`.

### `claim_task(task_id, username) -> bool`
Inserts an `assignees` row unless the user is already assigned (returns `False` in that case). `True` on insert.

### `upload_task_file(task_id, file) -> bool`
If `allowed_file(file.filename)`: `secure_filename` + timestamp suffix, save under `UPLOAD_FOLDER` (created if missing), insert a `task_files` row. `True`/`False`.

### `allowed_file(filename) -> bool`
Extension allow-list `{txt,pdf,png,jpg,jpeg,gif,doc,docx,xls,xlsx,csv}` (hardcoded; note it differs from `config.ALLOWED_EXTENSIONS`).

### `get_task_files(task_id) -> list[tuple]`
`SELECT file_path FROM task_files WHERE task_id=?`. `[]` on error.

---

## 6.4 `data_service.py`

CSV/pandas processing for the machines blueprint. Imports `csv`, `os`, `re`, `random`, `pandas`, `datetime`, `current_app`.

### `csv_to_html_table(csv_file) -> str`
Reads a CSV and returns an HTML `<table id='sortableTable'>`. **Does not HTML-escape cell values** (trusted-input assumption).

### `prepare_graph_data(file_path, y_axes) -> dict`
Dispatches by extension: `.csv` → `graph_csv`, `.txt` → `graph_txt`; raises `ValueError` for others. `y_axes` is a list of column names.

### `graph_csv(csv_file, y_axes) -> dict`
`csv.DictReader`; x-axis = first column; one y-series per `y_axes` entry; non-numeric → `0` (logged warning). Returns `create_graph_data(...)`.

### `graph_txt(txt_file, y_axes) -> dict`
Tab-delimited equivalent of `graph_csv`.

### `create_graph_data(labels, data, y_axes) -> dict`
Builds the Chart.js structure `{labels, datasets:[{label, data, borderColor, backgroundColor}]}` with random RGBA colors per series. `{}` on error.

### `sort_files_by_time(files, date_format) -> list[str]`
Parses a run number (`Event_Log_Run#(\d+)`) and a timestamp per `date_format` (0: `%m_%d_%Y_%I-%M %p`; 1: `%Y%m%d%H%M%S`; 2: embedded `.dat <date>`), sorts newest/highest-run first. `[]` on `ValueError`.

### `get_machine_data(machine) -> DataFrame | None`
Reads `HSCDATA/small_<machine>_DataCollection.csv` into pandas. `None` if file missing.

### `calculate_ald_deposition_rate(material, depmode, chuck_temp) -> list[float] | None`
Loads ALD CSV, filters by `Film Deposited == material`, `Deposition Mode == depmode`, `Chuck Temperature (C) == int(chuck_temp)`; computes `Measured Thickness (nm) / Number of Cycles` (NaN→0); returns the list, or `None` if no data.

---

## 6.5 `chem_service.py`

PostgreSQL access via SQLAlchemy Core. The module exposes `get_chem_engine()` and the `ChemInventoryService` class.

### `get_chem_engine() -> Engine`
Lazily builds and caches a module-global engine. Prefers `current_app.config['CHEM_*']`; falls back (outside app context) to env vars. URL: `postgresql+psycopg2://user:pwd@host:port/db`. Engine options: `pool_pre_ping=True, pool_size=5, max_overflow=10, future=True`.

### `ChemInventoryService.__init__(self)`
Sets `self.engine = get_chem_engine()`.

### Helpers

- **`_upsert(self, conn, table, key_col, value, id_col=None) -> id | None`** — return existing id for `value` in `table.key_col`, else INSERT and return new id; `None` for blank value. `id_col` inferred from a table→PK map.
- **`_next_barcode(self, conn) -> str`** — `nextval('seq_barcode')` as string.
- **`_resolve_room(self, conn, room_no, room_desc, area_class, room_name=None)`** — thin wrapper over `resolve_room_id` (passes `room_desc or room_name`).
- **`resolve_room_id(self, conn, room_no=None, room_desc=None, area_class=None) -> id | None`** — layered room resolution: match by `room_no` (and backfill desc/area via COALESCE-update); else by `room_desc`; else by `room_name`; else upsert by `room_no` (`ON CONFLICT (room_no)`); else create a room without `room_no`. Returns a `room_id` or `None` if all inputs blank.

> Note: `resolve_room_id` and `_resolve_room` contain `print(...)` debug statements (e.g. "USING resolve_room_id"). These write to stdout/logs on every call.

### Read operations

- **`search_inventory(self, query="", limit=500, show_removed=False) -> list[Mapping]`** — joined SELECT over containers/items/vendors/rooms. Excludes `status='REMOVED'` unless `show_removed`. When `query` set, `ILIKE` across name, catalog, vendor, barcode, lot, owner, system, storage_*, room_no/name, notes. Ordered by item name then barcode. Returns dict-like rows. **References `c.last_scan_at`** (must exist in DB).
- **`export_inventory_csv(self, query="", limit=500000) -> str`** — `search_inventory(show_removed=True)` → CSV string via `csv.DictWriter`. `"No data"` if empty.
- **`get_barcode_queue(self, query="", only_unprinted="1", limit=500) -> list[Mapping]`** — containers joined to items/rooms; filter `label_printed=FALSE` when `only_unprinted=="1"`; optional `ILIKE`. Newest first.
- **`get_barcode_labels(self, query="", copies=1, limit=1000) -> list[dict]`** — label rows `{item_name, lot_number, barcode_number}`, repeated `copies` times each.
- **`get_transactions(self, q="", limit=500) -> list[Mapping]`** — joins `transactions` to containers/items/rooms; extracts `reason`/`notes` from the JSON `details` (`details::json->>'...'`); optional `ILIKE`; newest first.
- **`get_scan_reports(self, limit=200) -> list[Mapping]`** — recent `inventory_cycles` with COALESCE'd report fields and counts.
- **`get_inventory_scan_coverage(self, limit=5000) -> list[Mapping]`** — active containers with `scan_status` = `'SCANNED'`/`'UNSCANNED'` based on `last_scan_at`; unscanned first.
- **Report rollups** (each returns `list[Mapping]` of active containers unless noted):
  - `report_totals()` → single row: `total_containers`, `unique_materials`, `expiring_30`, `expired`.
  - `report_expiring()` → expiry within 30 days (future).
  - `report_expired()` → expiry before today.
  - `report_nmr_due()` → `nmr_expiry` within 30 days.
  - `report_by_room()` / `report_by_vendor()` / `report_by_system()` / `report_by_owner()` → grouped counts.

### Write operations (each opens its own `engine.begin()` transaction)

- **`add_containers(self, data) -> list[str]`** — ensures `categories('Chemicals')`, upserts vendor/room/item (`ON CONFLICT (name)`), then loops `data['qty']` times: next barcode → INSERT container (barcode == container_code) → `log_transaction('ADD')`. Returns the new barcodes.
- **`import_scans(self, barcodes, filename=None, performed_by=None, report_name=None, location=None) -> dict`** — INSERT `inventory_cycles` (with extended columns); per cleaned barcode INSERT `scan_raw`; if matched, INSERT `container_scans('FOUND','UPLOAD')` and `UPDATE containers.last_scan_at=NOW()`. Updates cycle `matched_count`/`unmatched_count`; logs `SCAN_UPLOAD`. Returns `{cycle_id, total, matched, unmatched}`.
- **`remove_container(self, barcode, removed_by=None, reason=None, notes=None) -> bool`** — soft-delete: set `status='REMOVED'`, append a removal note to `notes`, log `REMOVE`. `False` if barcode not found / already removed.
- **`remove_containers_by_barcodes(self, raw_barcodes, removed_by=None, reason=None, notes=None) -> dict`** — parses many barcodes (comma/tab/newline, de-duped), calls `remove_container` per barcode. Returns `{requested_count, removed_count, removed, not_found}`.
- **`move_container(self, barcode, room_no, room_desc, area_class, storage_location, storage_sublocation, storage_device, moved_by=None) -> bool`** — resolve room; COALESCE-update room/area/storage; log `MOVE` with from/to detail. `False` if not found.
- **`bulk_move_by_barcodes(self, raw_barcodes, room_no=None, ..., performed_by=None) -> dict`** — parse many barcodes; resolve one destination room; per barcode COALESCE-update + log `BULK_MOVE`. Returns `{requested_count, matched_count, moved_count, unmatched}`. Returns zeros if no barcodes or no destination provided. Contains `print(...)` debug output.
- **`update_container(self, container_id, data) -> None`** — rename item (if a name provided), resolve room, "keep-or-update" each field (blank input keeps existing value), UPDATE container, log `EDIT`. Raises `ValueError` if the container id is not found.
- **`mark_barcodes_printed(self, barcodes) -> int`** — `UPDATE containers SET label_printed=TRUE, label_printed_at=NOW() WHERE barcode = ANY(:bcs)`. Returns affected row count.
- **`log_transaction(self, conn, action, container_id=None, barcode=None, item_id=None, room_id=None, details=None, performed_by=None) -> None`** — INSERT into `transactions` with `details = json.dumps(details or {})` and `created_at = NOW()`. Must be called within an existing transaction (`conn`).

### Stubs (not implemented)

- **`suggest(self, field, q, limit=10) -> list`** — returns `[]` (stub). The `/chem/api/suggest` endpoint therefore always returns an empty list.
- **`autofill(self, catalog="", name="") -> dict`** — returns `{}` (stub). The `/chem/api/autofill` endpoint therefore always returns an empty object.

> Also note: `get_reports(self)` exists in the module but is **not** used by the live `/chem/report` route, which calls the individual `report_*` methods instead.

Continue to 07-authentication-and-authorization.md (repo path: documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md).
