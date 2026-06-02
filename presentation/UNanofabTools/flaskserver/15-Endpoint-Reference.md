# 15 — Endpoint Reference

A flat, complete list of every URL the server answers, grouped by blueprint, with the HTTP method(s), whether login is required, and a one-line description. Use this as a quick lookup or as a slide appendix.

**Auth column legend:**

- **Public** — no login needed.
- **Login** — requires `@login_required`.
- **Admin** — requires `@login_required` + `@admin_required`.
- **Assign** — requires login plus the `can_assign` permission (checked inline).
- **None (device)** — no auth; intended for machines on the private network.

## Auth blueprint (`auth.py`) — no URL prefix

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET, POST | `/login` | Public | Show login form (GET); verify credentials + Duo, create session (POST) |
| GET, POST | `/signup` | Public | Show signup form (GET); Duo-verify + create user (POST) |
| GET | `/logout` | Login | Clear the session and redirect to login |
| GET, POST | `/resetpassword` | Public | Show reset form (GET); reset password by username+uNID (POST) |

## Tasks blueprint (`tasks.py`) — no URL prefix

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/tasks` | Login | The task dashboard (your tasks, unfinished, all) |
| GET, POST | `/createtasks` | Assign | Show create form (GET); create a task (POST) |
| POST | `/changestatus` | Login | Mark a task complete (JSON body `{taskId}`) |
| POST | `/claimTask` | Login | Add yourself as an assignee (JSON body `{taskId}`) |
| POST | `/uploadtaskfile` | Login | Attach a file to a task (multipart form) |
| GET | `/users` | Login | JSON list of all usernames (for the assignee dropdown) |

## Admin blueprint (`admin.py`) — no URL prefix

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/adminpanel` | Admin | User-management page |
| POST | `/deleteUser` | Admin | Delete a user (JSON body `{uNID}`) |
| POST | `/toggleAdminStatus` | Admin | Flip a user's `is_admin` flag |
| POST | `/toggleAssign` | Admin | Flip a user's `can_assign` flag |

## Machines blueprint (`machines.py`) — no URL prefix

Every route here requires login.

### Index pages

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/` | Login | Site root / machines index |
| GET | `/machines` | Login | All-machines page |
| GET | `/logfiles` | Login | All-log-files index |

### Per-machine data pages

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/ald` | Login | ALD data + chuck/precursor temp graph |
| GET | `/ebeam` | Login | E-beam data |
| GET | `/mocvd` | Login | MOCVD data |
| GET | `/parylene` | Login | Parylene log files (uploads) |
| GET | `/pecvd` | Login | PECVD data |
| GET | `/denton635` | Login | Denton 635 log files |
| GET | `/denton18` | Login | Denton 18 data |
| GET | `/drie` | Login | DRIE data |
| GET | `/isotropic` | Login | Isotropic etch data |
| GET | `/plasmalab` | Login | PlasmaLab data |
| GET | `/plasmatherm` | Login | PlasmaTherm data |
| GET | `/technics` | Login | Technics data |
| GET | `/cleanox` | Login | CleanOx furnace data |
| GET | `/dopedox` | Login | DopedOx furnace data |
| GET | `/lto` | Login | LTO furnace data |
| GET | `/nitride` | Login | Nitride furnace data |
| GET | `/poly` | Login | Poly furnace data |
| GET | `/allwin` | Login | Allwin data |

### Log files, downloads, graphing

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/aldlog/rfdata` | Login | ALD RF log file list |
| GET | `/aldlog/pressuredata` | Login | ALD pressure log file list |
| GET | `/paralyneuploads` | Login | Parylene uploads list |
| GET | `/download/<path:filepath>` | Login | Download a log file (path-traversal protected) |
| GET | `/graph/<path:filepath>` | Login | Graph a log file's contents (path-traversal protected) |
| POST | `/submitALDData` | Login | ALD deposition-rate calculator (form: material, depmode, temp) |

## API blueprint (`api.py`) — no URL prefix

None of these require login; they are for devices on the private network.

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/sdsanalog` | None (device) | Receive a Parylene CSV batch (headers identify the batch) |
| POST | `/sdsanalogfinished` | None (device) | Combine all batches for a Parylene session |
| POST | `/denton18pump` | None (device) | Append one Denton 18 vacuum-pressure sample |
| POST | `/denton18pumpfinished` | None (device) | Close the current Denton 18 run file |
| GET | `/api/paralyne/analog/list` | None (device) | List combined Parylene CSVs (used by ParalyneReader) |
| GET | `/api/paralyne/analog/download/<filename>` | None (device) | Download one Parylene CSV |
| POST | `/particle-data` | None (device) | Receive an SPS30 particle reading; upsert DB + append CSV |
| GET | `/particle-data` | None (device) | Current readings (no params) or historical CSV (room+sensor params) |
| POST | `/sensor-data` | None (device) | Receive combined SPS30 + DHT22 reading |
| GET | `/sensor-data` | None (device) | Historical combined CSV (room+sensor params required) |
| POST | `/env-data` | None (device) | Receive a DHT22 temperature/humidity reading |
| GET | `/env-data` | None (device) | Historical env CSV (room+sensor params required) |

## Chemical inventory blueprint (`chem_inventory.py`) — URL prefix `/chem`

None of these apply `@login_required` (the import exists but is never used). All are effectively **Public**. This is flagged as a gap in `14-Security-Model.md` — the write routes especially should be gated.

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/chem/` and `/chem/inventory` | Public | Search/browse inventory |
| GET | `/chem/inventory/print` | Public | Print-friendly inventory |
| GET | `/chem/inventory/export.csv` | Public | Download inventory as CSV |
| GET, POST | `/chem/add` | Public | Add new containers (also generates barcodes) |
| GET | `/chem/report` | Public | Reports dashboard (10 aggregations + scan coverage) |
| GET, POST | `/chem/upload-scans` | Public | Import scanned barcodes into a cycle |
| GET | `/chem/barcodes/queue` | Public | List barcodes pending printing |
| GET | `/chem/barcodes/print` | Public | Printable label sheets (30/page) |
| POST | `/chem/barcodes/mark-printed` | Public | Mark barcodes as printed |
| POST | `/chem/barcodes/print-selected` | Public | Redirect selected barcodes to print page |
| GET, POST | `/chem/remove` | Public | Soft-delete containers by barcode |
| GET, POST | `/chem/move` | Public | Move one container to a new location |
| POST | `/chem/move-bulk` | Public | Move many containers at once |
| GET | `/chem/edit` | Public | Edit-container lookup page |
| POST | `/chem/edit-container` | Public | Save container edits |
| GET | `/chem/transactions` | Public | Audit-trail / transactions log |
| GET | `/chem/api/inventory_json` | Public | Inventory data as JSON |
| GET | `/chem/api/suggest` | Public | Type-ahead suggestions (field + partial query) |
| GET | `/chem/api/autofill` | Public | Auto-fill item fields by catalog/name |
| GET | `/chem/api/container_lookup` | Public | Full container record by barcode (JSON) |

## Particle demo blueprint (`particle_demo_will.py`) — URL prefix `/particle-demo`

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/particle-demo/` | Public | Serve the default demo HTML page |
| GET | `/particle-demo/<path:filename>` | Public | Serve a demo asset (traversal-guarded) |

## Inline routes (registered directly in `app/__init__.py`)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/js/<path:filename>` | Public | Serve a JavaScript file from static |
| GET | `/css/<path:filename>` | Public | Serve a CSS file from static |
| GET | `/favicon.ico` | Public | Serve the browser-tab icon (or 404) |

## A note on dead code

The file `app/blueprints/chem_inventory_remote.py` defines a near-duplicate set of `/chem/*` routes, but it is **not** registered in `app/__init__.py` — only `chem_inventory.py` is imported and registered. So `chem_inventory_remote.py` is effectively dead code; its routes never run. Don't be confused if you see the same URL defined twice in the repository; the live one is `chem_inventory.py`.

Similarly, `app/blueprints/particle_demo_will.py` is live, but a few one-off Python files at the repo root (`chem_inventory_remote.py` at the top level, which is empty, plus various `*.py` machine scripts) are not part of the Flask app.

## Quick counts

- **4** auth routes
- **6** task routes
- **4** admin routes
- **~32** machine routes (3 index + 18 machine pages + 3 log lists + download + graph + ALD calc)
- **12** API/device routes
- **20** chemical inventory routes
- **2** particle demo routes
- **3** inline static routes

That's roughly **83** live URLs in total.

This is the end of the documentation set. Return to `README.md` for the table of contents, or `01-Server-Overview.md` to start from the top.
