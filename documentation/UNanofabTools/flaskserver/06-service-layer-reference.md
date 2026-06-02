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

Continue to [07-authentication-and-authorization.md](07-authentication-and-authorization.md).
