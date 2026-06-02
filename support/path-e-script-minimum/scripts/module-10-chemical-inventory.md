# Minimum Acceptable Full Path E - Module 10: Chemical Inventory

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-10-chemical-inventory.md

# Module 10 - Chemical Inventory And PostgreSQL

## Goal

The maintainer understands the chemical inventory as the largest and most database-sensitive feature: local PostgreSQL, schema shape, routes, service layer, barcode behavior, reports, transactions, and security concerns.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx)
- `../../presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx)
- `../../presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md` (reference path: ../../presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md)
- `../../documentation/UNanofabTools/flaskserver/04-database-schema.md` (reference path: ../../documentation/UNanofabTools/flaskserver/04-database-schema.md)
- `../../known-issues/UNanofabTools/flaskserver.md` (reference path: ../../known-issues/UNanofabTools/flaskserver.md)

## Verbatim Script

READ ALOUD:

"The chemical inventory is one of the most important features to understand deeply. It is larger than a simple CRUD page. It has its own PostgreSQL schema, rooms, vendors, items, containers, barcodes, scans, reports, transaction history, moves, removals, and exports."

SHOW:

Open `09-Chemical-Inventory.pptx`.

READ ALOUD:

"The chemical inventory answers operational questions: what chemical exists, where it is, who owns it, what container it is in, whether it has been removed, and what history is attached to it. Because this is operational inventory data, correctness matters. A bug here can affect compliance, safety, or lab operations."

SHOW:

Open `10-Database-Models.pptx`.

READ ALOUD:

"This is where the database distinction matters. The main app uses several SQLite databases for smaller app concerns. The chemical inventory uses local PostgreSQL on `nfhistory`. Earlier documentation was corrected to remove stale external-database framing. The correct live fact is local PostgreSQL bound to `127.0.0.1:5432`."

## Source Demo

DO:

Show:

```text
../UNanofabTools/app/blueprints/chem_inventory.py
../UNanofabTools/app/services/chem_inventory_service.py
../UNanofabTools/config/config.py
```

DO:

Run:

```sh
rg -n "CHEM_|psycopg|containers|transactions|barcode|inventory|room|vendor|REMOVE|MOVE|BULK_MOVE" ../UNanofabTools/app ../UNanofabTools/config
```

READ ALOUD:

"This search connects configuration, routes, service functions, and schema concepts. The maintainer should be able to find where a barcode is created, where inventory is searched, where a container is moved, where a container is removed, and where transactions are logged."

SHOW:

Open `../../documentation/UNanofabTools/flaskserver/04-database-schema.md` (reference path: ../../documentation/UNanofabTools/flaskserver/04-database-schema.md).

READ ALOUD:

"The schema doc should be treated as operational reference. If the live PostgreSQL schema drifts from this doc, that is high-impact documentation drift. The maintainer should know how to compare docs against live schema or a schema dump before making changes."

## Live Demo If Safe

If database access is safe and credentials are not exposed:

DO:

Show only service status or schema names, not passwords.

```sh
systemctl status postgresql@17-main
ss -ltnp | grep 5432
```

READ ALOUD:

"This confirms local PostgreSQL service and listener shape without showing credentials. We are not dumping secret values."

## Security Frame

READ ALOUD:

"The known-issues file calls out chemical inventory risks. Pay attention to unauthenticated or under-protected write routes if present, schema drift, missing migration discipline, and backup/restore coverage. Chemical inventory changes should be approached as data integrity work, not just UI work."

SHOW:

Open `../../known-issues/UNanofabTools/flaskserver.md` (reference path: ../../known-issues/UNanofabTools/flaskserver.md).

READ ALOUD:

"Known issues are where the maintainer decides what to fix first. High-severity chemical inventory findings belong near the top because they affect real operational data."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Is chemical PostgreSQL local or external? | Local on `nfhistory`, not an external database server. |
| What host and port does the live deployment use? | `127.0.0.1:5432`. |
| Which config variables control chemical database access? | The `CHEM_*` PostgreSQL settings documented in the config reference, such as host, port, database, user, and password variables. |
| What are the main chemical inventory entities? | Rooms, vendors, items, containers, barcodes, scans, transactions, reports, moves, and removals. |
| What is a soft delete in this context? | Marking a container removed/inactive while preserving the row and history instead of physically deleting it. |
| Why is transaction history important? | It preserves auditability for moves, removals, inventory changes, reports, and compliance-style review. |
| What should be checked before changing barcode or move behavior? | Schema, service functions, route guards, transaction logging, reports/exports, tests/sample data, and live backup/restore coverage. |
| What backup coverage is needed for chemical inventory? | Local PostgreSQL data plus relevant app config, schema evidence, and any related files needed to restore inventory behavior. |

REQUIRE:

The maintainer can explain the chemical inventory's route, service, database, and backup concerns without calling it "just another page."

## Stop Point

STOP POINT:

Stop here if the maintainer says or implies that chemical PostgreSQL is external. Correct that immediately and revisit the live-server and schema docs.


# Expanded Module 10: Chemical Inventory

READ ALOUD:

This expanded section revisits Module 10, Chemical Inventory. The focus is local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 10

READ ALOUD:

We are now doing the orientation pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 10

READ ALOUD:

We are now doing the evidence pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/04-database-schema.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 04 — Database Schema Reference

The server uses five databases: four SQLite files (managed via Flask-SQLAlchemy ORM and Alembic) and one PostgreSQL database (managed via raw SQL through SQLAlchemy Core). This document is the authoritative schema reference.

## 4.1 Database inventory

| Database | Engine | Location | Bind key | Managed by |
|----------|--------|----------|----------|------------|
| Users | SQLite | `instance/signininfo.db` | (default) | Flask-SQLAlchemy ORM + Alembic |
| Sessions | SQLite | `instance/sessioninfo.db` | `sessions` | ORM + Alembic |
| Tasks | SQLite | `instance/tasks.db` | `tasks` | ORM (DDL) + raw `sqlite3` (DML) |
| Particle sensors | SQLite | `instance/particle_sensors.db` | `particle_sensors` | ORM + Alembic |
| Chemical inventory | PostgreSQL | **local** `cheminventory` (postgresql@17-main on `127.0.0.1:5432`, same host as the Flask app — confirmed by the live-server survey in `../liveserver/README.md` (reference path: ../liveserver/README.md) §10) | `chem_inventory` (declared but unused at runtime) | `init_chem_db.py` + SQL files + ad-hoc DDL |

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

Continue to 05-http-api-reference.md (reference path: 05-http-api-reference.md).
