# 04 — Database Schema Reference

The server uses five databases: four SQLite files (managed via Flask-SQLAlchemy ORM and Alembic) and one PostgreSQL database (managed via raw SQL through SQLAlchemy Core). This document is the authoritative schema reference.

## 4.1 Database inventory

| Database | Engine | Location | Bind key | Managed by |
|----------|--------|----------|----------|------------|
| Users | SQLite | `instance/signininfo.db` | (default) | Flask-SQLAlchemy ORM + Alembic |
| Sessions | SQLite | `instance/sessioninfo.db` | `sessions` | ORM + Alembic |
| Tasks | SQLite | `instance/tasks.db` | `tasks` | ORM (DDL) + raw `sqlite3` (DML) |
| Particle sensors | SQLite | `instance/particle_sensors.db` | `particle_sensors` | ORM + Alembic |
| Chemical inventory | PostgreSQL | **local** `cheminventory` (postgresql@17-main on `127.0.0.1:5432`, same host as the Flask app — confirmed by the live-server survey in [`../liveserver/README.md`](../liveserver/README.md) §10) | `chem_inventory` (declared but unused at runtime) | `init_chem_db.py` + SQL files + ad-hoc DDL |

## 4.2 SQLite models (`app/models/__init__.py` and `app/models/particle_sensor.py`)

All SQLite tables are defined as Flask-SQLAlchemy models. `db.create_all()` (called in `create_app`) creates any missing tables on boot.

### 4.2.1 `User` → table `signininfo`

```python
class User(UserMixin, db.Model):
    __tablename__ = 'signininfo'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False, name='passwordHash')
    unid = db.Column(db.String(255), unique=True, nullable=False, name='uNID')
    is_admin = db.Column(db.Boolean, default=False, name='isAdmin')
    can_assign = db.Column(db.Boolean, default=False, name='canAssign')
```

| Column (DB) | Python attr | Type | Constraints | Notes |
|-------------|-------------|------|-------------|-------|
| `id` | `id` | INTEGER | PK | Auto-increment. Stored in the Flask-Login cookie. |
| `username` | `username` | VARCHAR(255) | unique, not null | Login identifier. |
| `passwordHash` | `password_hash` | VARCHAR(255) | not null | bcrypt hash (never plaintext). Column name is camelCase (legacy). |
| `uNID` | `unid` | VARCHAR(255) | unique, not null | University ID; used as Duo username and password-reset secret. |
| `isAdmin` | `is_admin` | BOOLEAN | default False | Grants admin panel. |
| `canAssign` | `can_assign` | BOOLEAN | default False | Grants task creation/assignment. |

`UserMixin` supplies Flask-Login's `is_authenticated`, `get_id()`, etc. There is no auto-created admin; bootstrap by editing the row directly (see `02` §2.4).

### 4.2.2 `Session` → table `sessioninfo` (bind `sessions`)

```python
class Session(db.Model):
    __tablename__ = 'sessioninfo'
    __bind_key__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PK | |
| `session_id` | VARCHAR(255) | unique, not null | UUID4 string stored server-side and in the Flask cookie. |
| `username` | VARCHAR(255) | not null | Owner of the session. |
| `created_at` | DATETIME | default `utcnow` | Used by `delete_old_sessions` to purge stale rows. |

This is a server-side session record, separate from Flask's signed-cookie session. See `07` §7.4 for the relationship between the two.

### 4.2.3 `Task` → table `tasks` (bind `tasks`)

```python
class Task(db.Model):
    __tablename__ = 'tasks'
    __bind_key__ = 'tasks'
    task_id = db.Column(db.Integer, primary_key=True)
    task_title = db.Column(db.String(255), nullable=False)
    task_description = db.Column(db.Text)
    task_assign_date = db.Column(db.DateTime, default=datetime.utcnow)
    task_due_date = db.Column(db.DateTime)
    task_priority = db.Column(db.String(50))
    task_assigner = db.Column(db.String(255))
    task_status = db.Column(db.String(50), default='Pending')
    assignees = db.relationship('TaskAssignee', backref='task', lazy=True, cascade='all, delete-orphan')
    files = db.relationship('TaskFile', backref='task', lazy=True, cascade='all, delete-orphan')
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `task_id` | INTEGER | PK | |
| `task_title` | VARCHAR(255) | not null | |
| `task_description` | TEXT | | |
| `task_assign_date` | DATETIME | default `utcnow` | When created. |
| `task_due_date` | DATETIME | | Optional. |
| `task_priority` | VARCHAR(50) | | Free-text priority. |
| `task_assigner` | VARCHAR(255) | | Username of creator. |
| `task_status` | VARCHAR(50) | default `'Pending'` | `task_service.update_task_status` sets `'Completed'`. |

> **Runtime caveat:** `task_service.py` accesses `tasks.db` via the `sqlite3` standard library, not via these ORM relationships. The ORM models exist so `db.create_all()` builds the tables, but reads/writes at runtime are raw SQL. The relationships (`assignees`, `files`) are not used at runtime; the service joins manually.

### 4.2.4 `TaskAssignee` → table `assignees` (bind `tasks`)

```python
class TaskAssignee(db.Model):
    __tablename__ = 'assignees'
    __bind_key__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'), nullable=False)
    assignee_name = db.Column(db.String(255), nullable=False)
```

Many-to-many bridge between tasks and usernames. One row per (task, assignee).

### 4.2.5 `TaskFile` → table `task_files` (bind `tasks`)

```python
class TaskFile(db.Model):
    __tablename__ = 'task_files'
    __bind_key__ = 'tasks'
    file_id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'), nullable=False)
    file_path = db.Column(db.String(512), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
```

Records attachment file paths (the bytes live in `UPLOAD_FOLDER`). One row per uploaded file.

### 4.2.6 `ParticleSensorData` → table `particle_sensor_data` (bind `particle_sensors`)

Defined in `app/models/particle_sensor.py`. Stores only the **most recent** reading per (room, sensor); time series lives in CSV.

```python
class ParticleSensorData(db.Model):
    __tablename__ = 'particle_sensor_data'
    __bind_key__ = 'particle_sensors'
    id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String(255), nullable=False)
    sensor_number = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    # raw measurements, converted ft³ values, differential bins,
    # mass concentrations, and optional temperature_c / humidity_pct
    __table_args__ = (
        db.UniqueConstraint('room_name', 'sensor_number', name='unique_sensor_location'),
    )
```

Column groups (all `Float` unless noted):

| Group | Columns |
|-------|---------|
| Identity | `id` (PK INT), `room_name` (str, NN), `sensor_number` (str, NN), `timestamp` (DateTime, NN), `last_updated` (DateTime) |
| Raw SPS30 | `mass_pm1`, `mass_pm2_5`, `mass_pm4`, `mass_pm10`, `num_pm0_5`, `num_pm1`, `num_pm2_5`, `num_pm4`, `num_pm10`, `typical_particle_size_um` |
| Converted (#/ft³) | `num_pm0_5_ft3`, `num_pm1_ft3`, `num_pm2_5_ft3`, `num_pm4_ft3`, `num_pm10_ft3` |
| Differential bins (ft³) | `bin_0_3_to_0_5`, `bin_0_5_to_1_0`, `bin_1_0_to_2_5`, `bin_2_5_to_4_0`, `bin_4_0_to_10` |
| Mass conc. (µg/m³) | `mass_pm1_ug_m3`, `mass_pm2_5_ug_m3`, `mass_pm4_ug_m3`, `mass_pm10_ug_m3` |
| Environmental (optional) | `temperature_c` (nullable), `humidity_pct` (nullable) |

**Unique constraint** `unique_sensor_location` on `(room_name, sensor_number)` enforces one row per sensor; the `api` blueprint upserts against it.

`to_dict()` serializes the row into the same nested JSON shape that devices POST (see `08` §8.2), enabling symmetric round-trips.

## 4.3 SQLite migrations (Alembic / Flask-Migrate)

The `migrations/` directory is a standard Flask-Migrate setup (`alembic.ini`, `env.py`, `script.py.mako`, `versions/`). One revision is present:

```
migrations/versions/01bdbfe91bd5_create_particle_sensor_tables.py
```

Workflow:

```bash
export FLASK_APP=run.py
flask db migrate -m "describe change"   # autogenerate a revision from model diffs
flask db upgrade                        # apply
flask db downgrade                      # revert one revision
```

> Because `create_app` also calls `db.create_all()`, brand-new tables get created at boot even without a migration — but **column changes to existing tables require a migration**. Prefer migrations for any schema change so environments stay reproducible. Note that `db.create_all()` and Alembic can drift apart if you rely on the former; treat Alembic as the source of truth.

## 4.4 PostgreSQL chemical-inventory schema

The chem database is provisioned by `init_chem_db.py` (which executes `chem_schema.sql`), then extended by `chem_schema_migration_v2.sql`. At runtime `chem_service.py` uses SQLAlchemy Core (`engine.begin()` + `text()`), not the ORM.

There are declarative model classes in `app/models/chem_inventory.py` (Category, Vendor, Room, Item, Container, InventoryCycle, ScanRaw, ContainerScan), but they are **parity/documentation artifacts** — the runtime path does not use them.

### 4.4.1 Sequence

```sql
CREATE SEQUENCE IF NOT EXISTS seq_barcode
  START WITH 100001 INCREMENT BY 1 NO MINVALUE NO MAXVALUE;
```

`chem_service._next_barcode` calls `nextval('seq_barcode')` for each new container, guaranteeing unique 6-digit barcodes under concurrency.

### 4.4.2 Lookup tables

```sql
categories (category_id SERIAL PK, name TEXT NOT NULL UNIQUE)
vendors    (vendor_id SERIAL PK, vendor_name TEXT NOT NULL UNIQUE)
rooms      (room_id SERIAL PK, room_no TEXT, room_name TEXT, room_desc TEXT,
            area_class TEXT, building TEXT, lab_code TEXT)
```

`rooms.room_no` has a unique index (`idx_rooms_room_no_unique`) because `chem_service.resolve_room_id` upserts rooms with `ON CONFLICT (room_no)`. `room_no/room_name/room_desc/area_class` are added by the v2 migration on older databases.

### 4.4.3 `items` (chemical product definitions)

```sql
items (
  item_id SERIAL PK,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  catalog_number TEXT,
  physical_state TEXT,
  volume_size TEXT,
  category_id INTEGER NOT NULL REFERENCES categories(category_id)
              ON UPDATE CASCADE ON DELETE RESTRICT,
  vendor_id INTEGER REFERENCES vendors(vendor_id)
            ON UPDATE CASCADE ON DELETE SET NULL
)
```

One row per chemical product (not per bottle). Unique by `name`; `chem_service.add_containers` upserts via `ON CONFLICT (name)`.

### 4.4.4 `containers` (physical bottles)

```sql
containers (
  container_id BIGSERIAL PK,
  item_id INTEGER NOT NULL REFERENCES items(item_id) ON UPDATE CASCADE ON DELETE CASCADE,
  barcode TEXT NOT NULL UNIQUE,
  container_code TEXT NOT NULL UNIQUE,
  room_id INTEGER REFERENCES rooms(room_id) ON UPDATE CASCADE ON DELETE SET NULL,
  entry_date DATE, manuf_date DATE, expiry_date DATE,
  area_class TEXT, storage_location TEXT, storage_sublocation TEXT, storage_device TEXT,
  system TEXT, lot_number TEXT, choice TEXT, nmr TEXT, nmr_expiry DATE,
  owner TEXT, notes TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  size TEXT, unit TEXT, legacy_inventory_no TEXT,
  added_by TEXT,                          -- v2
  created_at TIMESTAMPTZ DEFAULT NOW(),   -- v2
  label_printed BOOLEAN DEFAULT FALSE,    -- v2
  label_printed_at TIMESTAMPTZ            -- v2
)
-- indexes: idx_containers_item, idx_containers_room,
--          idx_containers_status, idx_containers_label_printed
```

The central table. `status` drives soft-delete (`'REMOVED'`). Note that `add_containers` inserts `barcode` and `container_code` with the **same** value (the sequence number).

> **Runtime-only columns not in committed SQL:** `chem_service` also reads/writes `containers.last_scan_at` (set on scan import; read by inventory search and coverage). This column is absent from both committed `.sql` files and must exist in the live DB. See the separate known-issues file.

### 4.4.5 Scan/audit tables

```sql
inventory_cycles (cycle_id SERIAL PK, started_at TIMESTAMPTZ DEFAULT now(),
                  ended_at TIMESTAMPTZ, created_by TEXT)

scan_raw (raw_id BIGSERIAL PK,
          cycle_id INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id) ON DELETE CASCADE,
          raw_code TEXT NOT NULL, import_ts TIMESTAMPTZ DEFAULT now(),
          matched_container_id BIGINT REFERENCES containers(container_id) ON DELETE SET NULL)

container_scans (scan_id BIGSERIAL PK,
                 cycle_id INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id) ON DELETE CASCADE,
                 container_id BIGINT NOT NULL REFERENCES containers(container_id) ON DELETE CASCADE,
                 scan_ts TIMESTAMPTZ DEFAULT now(), source TEXT,
                 status TEXT NOT NULL CHECK (status IN ('FOUND','NEW')),
                 UNIQUE (cycle_id, container_id))
```

> **Runtime-only objects not in committed SQL:** `chem_service.import_scans` inserts into `inventory_cycles` columns `filename, performed_by, report_name, location, total_scanned, matched_count, unmatched_count`, and into `scan_raw`/`container_scans` a `barcode` column. None of these are in the committed `.sql`. Likewise the `transactions` audit table (below) is created out-of-band. The live database has these; a fresh build from the committed files does not.

### 4.4.6 `transactions` (audit trail) — runtime-only

Not in the committed schema files, but written by `chem_service.log_transaction` and read by `get_transactions`. Inferred shape from the SQL:

```sql
transactions (
  transaction_id  <serial> PK,
  action          TEXT,        -- 'ADD' | 'MOVE' | 'BULK_MOVE' | 'EDIT' | 'REMOVE' | 'SCAN_UPLOAD'
  container_id    BIGINT,
  barcode         TEXT,
  item_id         INTEGER,
  room_id         INTEGER,
  details         JSON/JSONB,  -- json.dumps(details dict); queried via details::json->>'key'
  performed_by    TEXT,
  created_at      TIMESTAMP    -- set to NOW()
)
```

`details` is serialized with `json.dumps` and queried with `t.details::json->>'reason'` etc., so the column must be castable to `json` (TEXT or JSON/JSONB).

### 4.4.7 Views

Defined in `chem_schema.sql` (and refreshed in the v2 migration):

- **`inventory_view`** — denormalized container × item × vendor × room × category. Intended for list/search, though `chem_service.search_inventory` currently queries the base tables directly with its own joins.
- **`v_all_containers`** — a lighter denormalized container view.
- **`v_cycle_report`** — per-cycle FOUND/NEW/MISSING counts.

### 4.4.8 Foreign-key / cascade behavior

| Relationship | ON DELETE | Effect |
|--------------|-----------|--------|
| `items.category_id → categories` | RESTRICT | Can't delete a category with items. |
| `items.vendor_id → vendors` | SET NULL | Deleting a vendor nulls the item link; item survives. |
| `containers.item_id → items` | CASCADE | Deleting an item deletes its containers. |
| `containers.room_id → rooms` | SET NULL | Deleting a room nulls container location; container survives. |
| `scan_raw.cycle_id`, `container_scans.cycle_id → inventory_cycles` | CASCADE | Deleting a cycle deletes its scans. |
| `scan_raw.matched_container_id → containers` | SET NULL | Deleting a container nulls raw-scan matches. |
| `container_scans.container_id → containers` | CASCADE | Deleting a container deletes its matched scans. |

Note: the application uses **soft delete** (`status='REMOVED'`) rather than `DELETE`, so these cascades rarely fire in normal operation.

## 4.5 Entity-relationship summary (chem)

```
categories 1───N items 1───N containers N───1 rooms
                   │                  │
                   └──N───1 vendors   └──1───N container_scans N───1 inventory_cycles
                                                                          │
                                       scan_raw N──────────────────1 ────┘
   transactions  ── references container_id / item_id / room_id (loose, no enforced FK in runtime usage)
```

## 4.6 On-disk CSV data (not a database, but authoritative)

Several features persist to CSV under `LOG_DATA_DIR` (`LogData/`). These are documented fully in `09` §9.7; summary:

| Path | Written by | Content |
|------|-----------|---------|
| `LogData/particle_sensors/<room>_<sensor>_historical.csv` | `api.log_historical_particle_data` | Particle time series (append-only) |
| `LogData/env_sensors/<room>_<sensor>_historical.csv` | `api` env/sensor handlers | Temp/humidity time series |
| `LogData/sensors/<room>_<sensor>_combined.csv` | (read by GET /sensor-data; **not currently written** — see known-issues) | Combined series |
| `LogData/Paralyne/temp/<session>/batch_NNNN.csv` | `api.handle_csv_batch` | In-flight Parylene batches |
| `LogData/Paralyne/analog/<ts>_SDSLOG_combined_<session>.csv` | `api.combine_csv_batches_final` | Finalized Parylene runs |
| `LogData/denton18/pumpdata/<ts>_DENTON18PUMPLOG.csv` | `api.denton18_pump` | Denton 18 vacuum log per run |
| `HSCDATA/small_<Machine>_DataCollection.csv` | `HSCDownloader.py` (pulls from CORES n8n on a schedule) — see `documentation/UNanofabTools/hscdownloader/` | Per-machine summary tables |
| `LogData/<MACHINE>/...` (raw machine logs) | per-machine transfer scripts on the tool's PC — see `documentation/UNanofabTools/filetransfer/` | Raw run-log files pushed via `pscp` over SSH |

Continue to [05-http-api-reference.md](05-http-api-reference.md).
