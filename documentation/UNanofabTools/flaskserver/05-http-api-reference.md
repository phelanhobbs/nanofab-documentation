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

Continue to [06-service-layer-reference.md](06-service-layer-reference.md).
