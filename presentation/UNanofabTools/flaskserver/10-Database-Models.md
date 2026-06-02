# 10 — Database Models

This document explains the database "tables" — what's stored where and how they relate. Most of the tables are defined as SQLAlchemy model classes in `app/models/`. The chemical inventory's PostgreSQL tables are *also* described as model classes (`app/models/chem_inventory.py`), but the chemical inventory blueprint and service mostly use raw SQL through SQLAlchemy's `text()` instead of the ORM. They still serve as documentation of the table shape, though.

## Where each table lives

The application uses **four** SQLite databases plus **one** PostgreSQL database. The four SQLite ones are bound by `__bind_key__` on each model class:

| Database file | Bind key | Tables |
|--------------|----------|--------|
| `signininfo.db` | (default, no bind key) | `signininfo` (User) |
| `sessioninfo.db` | `'sessions'` | `sessioninfo` (Session) |
| `tasks.db` | `'tasks'` | `tasks`, `assignees`, `task_files` |
| `particle_sensors.db` | `'particle_sensors'` | `particle_sensor_data` |
| Postgres `cheminventory` | `'chem_inventory'` (but mostly raw SQL) | `categories`, `vendors`, `rooms`, `items`, `containers`, `inventory_cycles`, `scan_raw`, `container_scans`, `transactions` |

Splitting users / sessions / tasks / sensors across four SQLite files is a legacy choice from the older server; you'd normally keep them all in one. It works fine, just adds a little bookkeeping.

## The User model

```python
class User(UserMixin, db.Model):
    """User model for authentication and authorization"""
    __tablename__ = 'signininfo'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False, name='passwordHash')
    unid = db.Column(db.String(255), unique=True, nullable=False, name='uNID')
    is_admin = db.Column(db.Boolean, default=False, name='isAdmin')
    can_assign = db.Column(db.Boolean, default=False, name='canAssign')

    def __repr__(self):
        return f'<User {self.username}>'
```

Annotated:

- **`UserMixin`** — from Flask-Login. Gives the class methods like `is_authenticated`, `get_id()` etc. that Flask-Login expects. Without it, you'd have to define those by hand.
- **`__tablename__ = 'signininfo'`** — the SQL table name. SQLAlchemy would have guessed `user`; we override it to match the legacy database.
- **`id`** — the primary key. SQLite auto-increments it.
- **`username`** — string, unique, required.
- **`password_hash`** — bcrypt hash. `name='passwordHash'` makes the underlying column name camelCase to match the legacy schema while the Python attribute is snake_case.
- **`unid`** — University ID. Used for Duo and for the password-reset flow.
- **`is_admin` and `can_assign`** — booleans defaulted to false. They're the only permission bits in the system.

## The Session model

```python
class Session(db.Model):
    """Session model for managing user sessions"""
    __tablename__ = 'sessioninfo'
    __bind_key__ = 'sessions'

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

- `__bind_key__ = 'sessions'` says: this table lives in the database mapped to `'sessions'` in `SQLALCHEMY_BINDS`.
- Each row is a (random UUID, username, timestamp) tuple. Compared to Flask's signed-cookie session, this gives us a server-side record that can be cleaned up via `delete_old_sessions` or inspected by admins.

## The Task model

```python
class Task(db.Model):
    """Task model for task management"""
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

    # Relationships
    assignees = db.relationship('TaskAssignee', backref='task', lazy=True, cascade='all, delete-orphan')
    files = db.relationship('TaskFile', backref='task', lazy=True, cascade='all, delete-orphan')
```

- **`db.relationship(...)`** declares two related lists:
  - `task.assignees` → all `TaskAssignee` rows pointing at this task.
  - `task.files` → all `TaskFile` rows for this task.
- **`cascade='all, delete-orphan'`** — if you delete a task, its assignees and file rows go with it. "Orphan" rows (an assignee whose task disappears) are automatically deleted too.
- **`lazy=True`** — the related rows are loaded on first access, not on every Task fetch. Standard SQLAlchemy lazy loading.

> Note from the tasks doc: although the model is defined, the live task code in `task_service.py` uses raw `sqlite3` queries rather than this ORM. The model is mainly documentation and a hook for `db.create_all()` to keep the table shape correct.

## TaskAssignee and TaskFile

```python
class TaskAssignee(db.Model):
    __tablename__ = 'assignees'
    __bind_key__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'), nullable=False)
    assignee_name = db.Column(db.String(255), nullable=False)


class TaskFile(db.Model):
    __tablename__ = 'task_files'
    __bind_key__ = 'tasks'

    file_id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'), nullable=False)
    file_path = db.Column(db.String(512), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
```

Two small join tables. `assignees` is the many-to-many bridge (one task → many assignees, one user → many tasks). `task_files` records each file path linked to a task; the actual file content lives on disk in `UPLOAD_FOLDER`.

`db.ForeignKey('tasks.task_id')` declares the relationship at the DB level — if the tasks DB enforces foreign keys (SQLite has to be told to do so), it will refuse to insert a `TaskAssignee` whose `task_id` doesn't exist.

## The ParticleSensorData model

This one is interesting because the table has **many** columns and the model includes a custom `to_dict()` method for JSON serialization.

```python
class ParticleSensorData(db.Model):
    """Model for storing the most recent particle sensor data from each sensor"""
    __tablename__ = 'particle_sensor_data'
    __bind_key__ = 'particle_sensors'

    id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String(255), nullable=False)
    sensor_number = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    # Raw measurement data
    mass_pm1 = db.Column(db.Float)
    mass_pm2_5 = db.Column(db.Float)
    mass_pm4 = db.Column(db.Float)
    mass_pm10 = db.Column(db.Float)
    num_pm0_5 = db.Column(db.Float)
    num_pm1 = db.Column(db.Float)
    num_pm2_5 = db.Column(db.Float)
    num_pm4 = db.Column(db.Float)
    num_pm10 = db.Column(db.Float)
    typical_particle_size_um = db.Column(db.Float)

    # Converted values (ft³ measurements)
    num_pm0_5_ft3 = db.Column(db.Float)
    num_pm1_ft3 = db.Column(db.Float)
    num_pm2_5_ft3 = db.Column(db.Float)
    num_pm4_ft3 = db.Column(db.Float)
    num_pm10_ft3 = db.Column(db.Float)

    # Differential bins (ft³)
    bin_0_3_to_0_5 = db.Column(db.Float)
    bin_0_5_to_1_0 = db.Column(db.Float)
    bin_1_0_to_2_5 = db.Column(db.Float)
    bin_2_5_to_4_0 = db.Column(db.Float)
    bin_4_0_to_10 = db.Column(db.Float)

    # Mass concentrations (μg/m³)
    mass_pm1_ug_m3 = db.Column(db.Float)
    mass_pm2_5_ug_m3 = db.Column(db.Float)
    mass_pm4_ug_m3 = db.Column(db.Float)
    mass_pm10_ug_m3 = db.Column(db.Float)

    # Environmental data (from DHT22 sensor, optional)
    temperature_c = db.Column(db.Float, nullable=True)
    humidity_pct = db.Column(db.Float, nullable=True)

    # Create a unique constraint on room_name and sensor_number
    __table_args__ = (
        db.UniqueConstraint('room_name', 'sensor_number', name='unique_sensor_location'),
    )
```

The columns are grouped by what they measure:

- **Identification** — `room_name`, `sensor_number`, `timestamp`, `last_updated`.
- **Raw measurements from the SPS30** — particle mass and counts at PM0.5 / PM1 / PM2.5 / PM4 / PM10 size cutoffs, plus the typical particle size.
- **Converted number-concentration values in ft³** — the same number counts but in #/ft³ instead of #/cm³.
- **Differential bins in ft³** — particles falling between successive size cutoffs, useful for histograms.
- **Mass concentrations in μg/m³** — air-quality measure at four size cutoffs.
- **Environmental** — optional DHT22 temperature and humidity.

`__table_args__` adds a **unique constraint on (room_name, sensor_number)**. That's what makes the API's "upsert" pattern work: you can't have two rows for the same sensor location; instead the API updates the existing row. The "history" of readings lives in CSV files, not in this table.

### `to_dict()` for JSON output

```python
def to_dict(self):
    """Convert the model to a dictionary for JSON serialization"""
    return {
        'id': self.id,
        'room_name': self.room_name,
        'sensor_number': self.sensor_number,
        'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        'last_updated': self.last_updated.isoformat() if self.last_updated else None,
        'temperature_c': self.temperature_c,
        'humidity_pct': self.humidity_pct,
        'raw_measurements': {
            'mass_pm1': self.mass_pm1,
            ...
        },
        'converted_values': {
            'number_concentrations_ft3': {
                'pm0_5': self.num_pm0_5_ft3,
                ...
            },
            'differential_bins_ft3': {
                'bin_0_3_to_0_5': self.bin_0_3_to_0_5,
                ...
            },
            'mass_concentrations_ug_m3': {
                'pm1': self.mass_pm1_ug_m3,
                ...
            }
        }
    }
```

This method shapes the row into the same nested structure that the Picos *send* — symmetric in and out. So a consumer calling `GET /particle-data` and a Pico calling `POST /particle-data` see the same field names and nesting. This is good API design: easy to predict, easy to round-trip.

## Chemical Inventory models

These are declared in `app/models/chem_inventory.py` using SQLAlchemy's modern `declarative_base()`. As mentioned, they mainly serve as living documentation of the Postgres tables — the live chem inventory blueprint and service interact with the database via raw SQL. The model file is still useful when you need to look up a column name or relationship.

The key classes:

| Class | Table | Notes |
|-------|-------|-------|
| `Category` | `categories` | Lookup; usually just contains "Chemicals" |
| `Vendor` | `vendors` | Sigma, VWR, etc. |
| `Room` | `rooms` | Has `room_no`, `room_name`, `room_desc`, `area_class`, `building`, `lab_code` |
| `Item` | `items` | One row per chemical product, unique by `name` |
| `Container` | `containers` | One row per bottle. Big table. |
| `InventoryCycle` | `inventory_cycles` | One row per scan session |
| `ScanRaw` | `scan_raw` | Every barcode seen during a cycle |
| `ContainerScan` | `container_scans` | Matched scan = one row per (cycle, container) pair |

Notice the use of `Sequence`:

```python
barcode_sequence = Sequence('seq_barcode', start=100001, increment=1)
```

This is the Python-side declaration of the Postgres sequence used to generate barcodes. The actual `nextval('seq_barcode')` call happens in raw SQL in `chem_service.py`.

Cascade rules in the chem models match the SQL schema:

- Deleting an item cascades to its containers (`ondelete='CASCADE'`).
- Deleting a vendor sets the item's vendor link to null (`ondelete='SET NULL'`).
- Deleting a category is restricted if items reference it (`ondelete='RESTRICT'`).

The `__table_args__` on `ContainerScan` enforces:

```python
__table_args__ = (
    UniqueConstraint('cycle_id', 'container_id', name='uq_cycle_container'),
    CheckConstraint("status IN ('FOUND','NEW')", name='ck_status'),
)
```

- One row per (cycle, container) pair — so a container can't be scan-marked twice in the same audit.
- `status` is constrained to either `'FOUND'` or `'NEW'`.

## Empty model files

You may have noticed:

```
app/models/session.py    (empty)
app/models/task.py       (empty)
app/models/user.py       (empty)
```

These are placeholders. The actual model classes are bundled into `app/models/__init__.py` rather than split into separate files. The empty files exist either as documentation of an intended (but unfinished) split or as leftovers from an aborted refactor — they have no effect on behavior.

## Summary table

If you remember nothing else from this document, take this table away:

| Table | DB | Purpose |
|-------|----|---------|
| `signininfo` | SQLite `signininfo.db` | Usernames + bcrypt passwords + uNID + permission flags |
| `sessioninfo` | SQLite `sessioninfo.db` | Currently-logged-in sessions (UUID ↔ username) |
| `tasks`, `assignees`, `task_files` | SQLite `tasks.db` | The task tracker |
| `particle_sensor_data` | SQLite `particle_sensors.db` | Most-recent reading from each particle sensor (one row per sensor, upsert) |
| `categories`, `vendors`, `rooms`, `items`, `containers` | Postgres `cheminventory` | Chemical inventory entity model |
| `inventory_cycles`, `scan_raw`, `container_scans` | Postgres `cheminventory` | Audit scans linked to containers |
| `transactions` | Postgres `cheminventory` | Full audit trail of every chemical inventory action |

Next: `11-Particle-Demo.md`.
