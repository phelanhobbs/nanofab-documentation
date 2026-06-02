# 10 — Development Guide

How to extend and modify the server, plus the conventions the codebase follows. Read `01` (architecture) first; this document is task-oriented recipes.

## 10.1 Project conventions

- **Three layers.** Blueprints (HTTP) → services (logic + persistence) → models (tables). Keep SQL/file I/O in services; keep request parsing and response building in blueprints. (Two legacy exceptions exist: `tasks.get_users` and `chem_inventory.container_lookup` run SQL inline.)
- **One blueprint per domain**, registered in `app/__init__.py` inside `create_app` (deferred import to avoid cycles).
- **Persistence is mixed by design:**
  - Users/sessions/particle cache → Flask-SQLAlchemy ORM.
  - Tasks → raw `sqlite3` in `task_service`.
  - Chem → SQLAlchemy Core (`engine.begin()` + `text()`), parameterized.
- **Parameterized SQL always.** Use `?` (sqlite3) or `:name` (SQLAlchemy `text`). Never f-string user input into SQL.
- **Services return sentinels on error** (`None`/`False`/`[]`) and log; blueprints translate to flashes or JSON status. Keep this pattern for consistency.
- **Config via env vars** only (`config.py` + `.env`); never hardcode secrets.
- **Templates** live in `app/templates/` (chem templates under `app/templates/chem/`); static assets in `app/static/{js,css}`.

## 10.2 Add a new route to an existing blueprint

1. Open the blueprint (e.g. `app/blueprints/machines.py`).
2. Add a view with the `@<bp>.route(...)` decorator and appropriate auth decorators:

```python
@machines_bp.route('/newtool')
@login_required
def newtool():
    data = data_service.get_machine_data('NewTool')
    return render_template('machine_data.html', machine='NewTool', ...)
```

3. Put any logic/DB/file work in the relevant service, not the view.
4. Add a template if it renders HTML.

## 10.3 Add a new blueprint

1. Create `app/blueprints/mymodule.py`:

```python
from flask import Blueprint, render_template
from flask_login import login_required

mymodule_bp = Blueprint('mymodule', __name__, url_prefix='/mymodule')

@mymodule_bp.route('/')
@login_required
def index():
    return render_template('mymodule/index.html')
```

2. Register it in `app/__init__.py` inside `create_app` (with the other imports/registrations):

```python
from app.blueprints.mymodule import mymodule_bp
app.register_blueprint(mymodule_bp)
```

3. Add a matching service module under `app/services/` for its logic.
4. Add templates under `app/templates/mymodule/`.

## 10.4 Add a new SQLite model + migration

1. Define the model in `app/models/__init__.py` (or a new module imported there). Set `__bind_key__` if it belongs to a non-default database:

```python
class Widget(db.Model):
    __tablename__ = 'widgets'
    __bind_key__ = 'tasks'         # or omit for the default users DB
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
```

2. Generate and apply a migration:

```bash
export FLASK_APP=run.py
flask db migrate -m "add widgets table"
flask db upgrade
```

`db.create_all()` will also create brand-new tables at boot, but **column changes to existing tables require a migration** — always migrate so environments stay in sync. Treat Alembic as the source of truth.

3. If you add a new bind (a new SQLite file), register it in `config.py` under `SQLALCHEMY_BINDS`.

## 10.5 Work with the chem (PostgreSQL) layer

The chem layer does not use the ORM at runtime. To add an operation:

1. Add a method to `ChemInventoryService` in `chem_service.py`:

```python
def my_query(self, q=""):
    from sqlalchemy import text
    with self.engine.begin() as conn:
        rows = conn.execute(
            text("SELECT ... WHERE col ILIKE :q"),
            {"q": f"%{q}%"}
        ).mappings().all()
    return rows
```

2. Use `engine.begin()` for transactional writes (auto commit/rollback). Use `.mappings()` to get dict-like rows.
3. Call `self.log_transaction(conn, action=..., ...)` inside the same transaction for any mutation, to keep the audit trail complete.
4. For schema changes, update `chem_schema.sql` AND write the corresponding `ALTER TABLE`/migration, and apply it to existing databases (there is no Alembic for Postgres here — manage it with versioned `.sql` files like `chem_schema_migration_v2.sql`). Keeping the committed SQL in sync with the live DB is important (see `04` and the known-issues file).

## 10.6 Add a device ingestion endpoint

Follow the `api.py` pattern:

1. Define `@api_bp.route('/my-data', methods=['POST'])` (no auth — device tier).
2. Validate `request.is_json` and required keys; return `400` with a JSON error on failure.
3. Persist: append a per-sensor CSV under `LOG_DATA_DIR` and/or upsert a model row. Wrap DB writes in try/except with `db.session.rollback()` on error.
4. Return `200` with a JSON status. Keep the response shape symmetric with any matching GET.
5. Document the payload contract in `08`.

## 10.7 Testing (recommended, not yet present)

There is no test suite. To add one:

1. `pip install pytest`.
2. Use the factory with a test config (in-memory SQLite, `DEBUG_MODE=True` to skip Duo):

```python
import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app('development')
    app.config.update(TESTING=True, WTF_CSRF_ENABLED=False)
    with app.test_client() as c:
        yield c

def test_login_page(client):
    assert client.get('/login').status_code == 200
```

3. For chem tests, point `CHEM_*` at a disposable test database, or mock `get_chem_engine`.
4. Prioritize: auth flows, the path-traversal guards in `machines.download_file`/`graph_file`, the device ingestion validators, and the chem write/transaction methods.

## 10.8 Front-end notes

- Templates are Jinja2. The `fmtdate` filter (`{{ value | fmtdate }}`) formats dates and renders missing values as `—`.
- Static JS: `adminActions.js` (admin table actions), `taskActions.js` (task actions), `graph.js` (Chart.js helpers), `tablesort.js` (sortable tables keyed off `id='sortableTable'`). CSS: `inventory.css`.
- `csv_to_html_table` emits `<table id='sortableTable'>` so `tablesort.js` can hook it. (It does not escape cell values — keep inputs trusted, or add escaping if you feed it user data.)

## 10.9 Gotchas and non-obvious behaviors

- **`DEBUG_MODE=True` disables Duo** for login and signup. Never enable in production.
- **`DevelopmentConfig`/`ProductionConfig` hardcode `DEBUG_MODE`**, overriding the env var per environment (see `03` §3.5).
- **`task_service` ignores `TASK_DATABASE_URI`** and locates `tasks.db` itself via `_get_db_path`. Keep them pointing at the same file if you change one.
- **`task_service.allowed_file` has its own extension set** (includes `gif`), separate from `config.ALLOWED_EXTENSIONS`.
- **`db.create_all()` runs every boot** but never alters existing tables — migrations are required for column changes.
- **`chem_inventory_remote.py` is dead code** (not registered). Don't edit it expecting effect.
- **`app/models/{session,task,user}.py` are empty** — the real models are in `app/models/__init__.py`.
- **`chem_service` prints debug lines** (`print("USING resolve_room_id")`, bulk-move dumps) to stdout on normal operation.
- **Path-traversal guards differ by endpoint** — `machines` uses `realpath`+prefix (strongest); `api` Parylene and `particle_demo_will` use string checks. Match the strength to the exposure when adding file routes.

## 10.10 Code style observations

- snake_case for Python identifiers; legacy DB columns are camelCase (`passwordHash`, `uNID`, `isAdmin`, `canAssign`) with `name=` overrides on the model.
- Inline dated comments mark changes (e.g. `# Updated 4/15/2026`). Not a changelog; treat as historical breadcrumbs.
- No formatter/linter config is committed; match surrounding style.

## 10.11 Where to make common changes (quick map)

| Want to change… | Edit |
|------------------|------|
| A config default or env var | `config/config.py` |
| Login/2FA/session behavior | `app/blueprints/auth.py` + `app/services/auth_service.py` |
| Permissions/decorators | `app/blueprints/admin.py` (decorator), `auth_service` (helpers) |
| A machine page or graph | `app/blueprints/machines.py` + `app/services/data_service.py` |
| A device endpoint | `app/blueprints/api.py` |
| Chem behavior/queries | `app/blueprints/chem_inventory.py` + `app/services/chem_service.py` |
| A SQLite table | `app/models/__init__.py` + a migration |
| The chem schema | `chem_schema*.sql` + apply DDL to the live DB |
| Startup/extension wiring | `app/__init__.py` |
| Templates/UI | `app/templates/**`, `app/static/**` |

This concludes the developer documentation set. See the index in [README.md](README.md). Known bugs and technical debt are tracked in a separate file outside this folder (`SERVER-KNOWN-ISSUES.md`).
