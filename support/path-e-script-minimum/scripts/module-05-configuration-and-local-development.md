# Minimum Acceptable Full Path E - Module 05: Configuration And Local Development

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Expanded Module 05: Configuration And Local Development

READ ALOUD:

This expanded section revisits Module 05, Configuration And Local Development. The focus is environment variables, secret handling, paths, and local setup. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 05

READ ALOUD:

We are now doing the orientation pass for Configuration And Local Development. The maintainer should connect this module to environment variables, secret handling, paths, and local setup. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

The answer must mention environment variables, secret handling, paths, and local setup. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 05

READ ALOUD:

We are now doing the evidence pass for Configuration And Local Development. The maintainer should connect this module to environment variables, secret handling, paths, and local setup. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

The answer must mention environment variables, secret handling, paths, and local setup. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/02-getting-started.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 02 — Getting Started (Local Development)

This document gets a new developer from a fresh clone to a running development server. Production deployment is covered separately in 09-deployment-and-operations.md (reference path: 09-deployment-and-operations.md).

## 2.1 Prerequisites

| Requirement | Notes |
|-------------|-------|
| Python 3.10+ | The repo's virtualenvs use 3.14; any modern 3.x works. `python3 --version` to check. |
| `pip` + `venv` | Standard library; bundled with CPython. |
| PostgreSQL 12+ | Required **only** for the chemical-inventory module. The rest of the app runs without it. The production deployment on `nfhistory` runs Postgres **locally on the same VM** (see `../liveserver/README.md` (reference path: ../liveserver/README.md) §10). A development install can point at any reachable Postgres via the `CHEM_PGHOST` env var; local is the simplest. |
| Build headers for `psycopg2` (optional) | `requirements.txt` pins `psycopg2-binary`, which ships wheels, so no compiler is normally needed. |
| Duo account (optional) | Only needed to exercise real 2FA. In development you run with `DEBUG_MODE=True`, which bypasses Duo entirely. |

The SQLite databases need no server — they are files created automatically.

## 2.2 Quick start (scripted)

The repo ships `setup.sh` (and `quick_setup.sh`) which automate most of the below:

```bash
./setup.sh
```

`setup.sh` will:

1. Verify Python 3 is installed.
2. Create a `venv/` virtualenv if absent and activate it.
3. `pip install -r requirements.txt`.
4. Copy `.env.example` → `.env` (if `.env` is absent) and pause for you to edit it.
5. Create required directories: `app/templates`, `app/static/{js,css}`, `uploads`, `HSCDATA`, `LogData/ALD/{RF,Pressure}`, `LogData/Paralyne/analog`, `LogData/denton18/pumpdata`, `logs`.

> Note: `setup.sh` also prints legacy migration instructions (moving `*.html` into `app/templates/`, etc.). Those steps are already done in the current repo — they were one-time migration steps from the old monolith. Ignore them on an existing checkout.

The manual equivalent is below; use it if you want to understand each step or the script fails.

## 2.3 Manual setup

### Step 1 — Virtual environment

```bash
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
```

### Step 2 — Dependencies

```bash
pip install -r requirements.txt
```

### Step 3 — Environment file

```bash
cp .env.example .env
```

Then edit `.env`. The minimum to run locally:

```ini
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=any-non-empty-dev-value
DEBUG_MODE=True
```

`DEBUG_MODE=True` is what makes local development practical: it bypasses Duo 2FA and enables Flask's reloader and verbose error pages. Every key in `.env` is documented in 03-configuration-reference.md (reference path: 03-configuration-reference.md).

> The committed `.env.example` sets `HOST=155.98.11.6` and `PORT=443` (a legacy production-direct configuration). For local development, either remove those lines (so the `127.0.0.1:5000` defaults apply) or set `HOST=127.0.0.1` and `PORT=5000` explicitly.

### Step 4 — Required directories

If you didn't run `setup.sh`, create the data directories the app expects. The config's `init_app` will `os.makedirs(..., exist_ok=True)` the `UPLOAD_FOLDER`, `DATA_DIR`, and `LOG_DATA_DIR` automatically at startup, so the strictly required manual step is just ensuring you have write permission in the working directory. For completeness:

```bash
mkdir -p uploads HSCDATA logs \
         LogData/ALD/RF LogData/ALD/Pressure \
         LogData/Paralyne/analog LogData/denton18/pumpdata \
         LogData/particle_sensors LogData/env_sensors LogData/sensors
```

### Step 5 — SQLite databases

No action required. On first boot, `create_app` runs `db.create_all()`, which creates `signininfo.db`, `sessioninfo.db`, `tasks.db`, and `particle_sensors.db`. By default Flask-SQLAlchemy places these under the `instance/` folder.

If you want to apply Alembic migrations explicitly instead of relying on `create_all()`:

```bash
export FLASK_APP=run.py
flask db upgrade
```

There is currently one migration revision (`01bdbfe91bd5_create_particle_sensor_tables`).

### Step 6 — (Optional) PostgreSQL for chemical inventory

The chem module needs a PostgreSQL database. To set it up locally:

1. Create the database and a user:

   ```bash
   createdb cheminventory
   # or: psql -c "CREATE DATABASE cheminventory;"
   ```

2. Add the connection settings to `.env`:

   ```ini
   CHEM_PGHOST=localhost
   CHEM_PGPORT=5432
   CHEM_POSTGRES_DB=cheminventory
   CHEM_POSTGRES_USER=postgres
   CHEM_POSTGRES_PASSWORD=your-local-password
   ```

3. Provision the schema:

   ```bash
   python init_chem_db.py
   ```

   This reads `chem_schema.sql` and creates the base tables, views, and the `seq_barcode` sequence.

4. Apply the v2 additive migration (adds barcode-printing columns, `room_name`, `added_by`, etc.):

   ```bash
   psql -d cheminventory -f chem_schema_migration_v2.sql
   ```

> Important: the live `chem_service.py` references additional columns and a `transactions` table that are **not** in either committed `.sql` file (the production database has drifted ahead of the committed schema). A fresh database provisioned only from the committed files will be missing those, and several chem features will error until the missing objects are added. See the separate known-issues file for the exact list. If you only need the non-chem parts of the app, skip this entire step — the chem engine is created lazily and won't be touched until a `/chem/*` route is hit.

## 2.4 Running the development server

```bash
export FLASK_ENV=development     # or set in .env
python run.py
```

`run.py` reads `FLASK_ENV`, builds the app, and (because it's executed directly) calls `app.run(host, port, debug, use_reloader=debug)`. With the development config you'll get:

- Binding to `127.0.0.1:5000` (unless overridden by `HOST`/`PORT`).
- Debug mode on (auto-reload, interactive traceback).
- `SESSION_COOKIE_SECURE=False` (so cookies work over plain HTTP).

Open `http://127.0.0.1:5000/login`.

To create your first user, go to `/signup`. With `DEBUG_MODE=True`, Duo is skipped and the account is created immediately. To grant yourself admin or task-assignment rights, flip `isAdmin` / `canAssign` directly in `signininfo.db` (e.g. with the `sqlite3` CLI) since there is no bootstrap admin:

```bash
sqlite3 instance/signininfo.db \
  "UPDATE signininfo SET isAdmin=1, canAssign=1 WHERE username='yourname';"
```

## 2.5 Running tests

There is no automated test suite in the repository at present. Verification is manual. When adding tests, see 10-development-guide.md (reference path: 10-development-guide.md) §10.7 for the recommended approach (pytest + the application factory with a test config).

## 2.6 Common first-run issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| `OperationalError: unable to open database file` | Working directory not writable, or `instance/` missing | Run from the repo root; ensure write permission |
| Chem pages 500 with connection refused | PostgreSQL not running or `.env` chem vars wrong | Start Postgres / fix `CHEM_*` vars, or avoid `/chem/*` |
| Login always fails in dev | The app is not using `DevelopmentConfig`, so Duo runs and there are no Duo creds | Confirm `FLASK_ENV=development` (or unset it); `DevelopmentConfig` hardcodes `DEBUG_MODE=True` |
| Cookies not persisting over HTTP | `SESSION_COOKIE_SECURE=True` while testing on `http://` | Use `DevelopmentConfig` (sets it `False`) or set the env var |
| Static JS/CSS 404 | Files not under `app/static/js` or `app/static/css` | Confirm the static layout (`02.3 Step 4`) |

Continue to 03-configuration-reference.md (reference path: 03-configuration-reference.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/03-configuration-reference.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 03 — Configuration Reference

All configuration lives in `config/config.py` and is sourced from environment variables (loaded from `.env` via `python-dotenv`). This document is the authoritative reference for every key.

## 3.1 How configuration loads

1. `config/config.py` calls `load_dotenv()` at import time, populating `os.environ` from `.env` if present. `python-dotenv` does **not** override already-set process environment variables unless called with `override=True`; this code does not pass that flag.
2. `run.py` reads `FLASK_ENV` (default `development`) and passes it to `create_app`.
3. `create_app` does `app.config.from_object(config[config_name])`, copying every uppercase attribute of the chosen config class into `app.config`.
4. `create_app` then calls `config[config_name].init_app(app)` for per-environment setup.

The `config` dispatch dictionary:

```python
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
```

`FLASK_ENV=production` selects `ProductionConfig`; unset defaults to `development`; `development` and `default` select `DevelopmentConfig`. Any other non-empty value is a startup error because `create_app` indexes the dictionary directly.

## 3.2 Configuration keys

Each row lists the `app.config` key, the environment variable it reads, the default if unset, and its meaning. Booleans are parsed as `os.getenv(NAME, default).lower() == 'true'`.

### Flask core

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `SECRET_KEY` | `SECRET_KEY` | `'dev-secret-key-change-in-production'` | Signs session cookies. **Must** be a strong random value in production; if leaked, sessions can be forged. |
| `DEBUG_MODE` | `DEBUG_MODE` | `False` | App-level debug flag. Drives two behaviors: (1) bypasses Duo 2FA in `auth.py`; (2) passed to `app.run(debug=...)`. Subclasses override (dev `True`, prod `False`). |

### Server binding

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `HOST` | `HOST` | `'127.0.0.1'` | Interface Flask binds to. Loopback by design; nginx fronts it. |
| `PORT` | `PORT` | `5000` | Port Flask binds to. Cast to `int`. |

> The committed `.env.example` overrides these to `155.98.11.6:443`, reflecting a legacy "Flask serves TLS directly" deployment. The current intended model (per `run.py`'s docstring) is nginx on 443 → Flask on `127.0.0.1:5000`. See `09`.

### SSL (standalone only)

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `SSL_CERT_PATH` | `SSL_CERT_PATH` | `'cert.pem'` | TLS cert path; used only if Flask/gunicorn serves TLS directly (no nginx). |
| `SSL_KEY_PATH` | `SSL_KEY_PATH` | `'key.pem'` | TLS key path; same caveat. |

These keys are defined but not consumed by `run.py` (which never enables SSL). They exist for a gunicorn `--certfile/--keyfile` deployment.

### SQLite databases

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `SQLALCHEMY_DATABASE_URI` | `DATABASE_URI` | `'sqlite:///signininfo.db'` | Primary DB (users). |
| `SQLALCHEMY_BINDS['sessions']` | `SESSION_DATABASE_URI` | `'sqlite:///sessioninfo.db'` | Sessions DB. |
| `SQLALCHEMY_BINDS['tasks']` | `TASK_DATABASE_URI` | `'sqlite:///tasks.db'` | Tasks DB (note: `task_service` uses raw sqlite3, not this URI — see below). |
| `SQLALCHEMY_BINDS['particle_sensors']` | `PARTICLE_SENSOR_DATABASE_URI` | `'sqlite:///particle_sensors.db'` | Particle-sensor cache DB. |
| `SQLALCHEMY_TRACK_MODIFICATIONS` | — | `False` | Disables SQLAlchemy event tracking (memory overhead). |

> `sqlite:///name.db` is a **relative** URI; Flask-SQLAlchemy resolves it under the `instance/` folder. `task_service.py` independently looks for `instance/tasks.db` (falling back to `./tasks.db`) using its own `_get_db_path()`, so the `TASK_DATABASE_URI` value is effectively ignored by the task code. Keep them consistent if you change it.

### PostgreSQL (chemical inventory)

Each uses a nested default: the `CHEM_*` var first, then a generic Postgres var, then a hardcoded fallback.

| Key | Env var (then fallback) | Default | Meaning |
|-----|--------------------------|---------|---------|
| `CHEM_PGHOST` | `CHEM_PGHOST` → `PGHOST` | `'localhost'` | Postgres host. |
| `CHEM_PGPORT` | `CHEM_PGPORT` → `PGPORT` | `'5432'` | Postgres port (string). |
| `CHEM_POSTGRES_DB` | `CHEM_POSTGRES_DB` → `POSTGRES_DB` | `'cheminventory'` | Database name. |
| `CHEM_POSTGRES_USER` | `CHEM_POSTGRES_USER` → `POSTGRES_USER` | `'postgres'` | Username. |
| `CHEM_POSTGRES_PASSWORD` | `CHEM_POSTGRES_PASSWORD` → `POSTGRES_PASSWORD` | `'changeme'` | Password. **Override in production.** |

`chem_service.get_chem_engine()` assembles these into `postgresql+psycopg2://user:pwd@host:port/db` and creates a pooled engine (`pool_pre_ping=True, pool_size=5, max_overflow=10, future=True`). These keys are **not** present in `.env.example`; add them yourself when enabling chem.

### Duo 2FA

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `DUO_IKEY` | `DUO_IKEY` | `None` | Duo integration key. |
| `DUO_SKEY` | `DUO_SKEY` | `None` | Duo secret key. |
| `DUO_HOST` | `DUO_HOST` | `None` | Duo API hostname. |

Consumed by `auth_service.duo_authenticate`. If unset and `DEBUG_MODE` is `False`, Duo calls fail (and logins/signups are rejected). With `DEBUG_MODE=True`, Duo is skipped and these may be `None`.

### Session cookie policy

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `SESSION_COOKIE_SECURE` | `SESSION_COOKIE_SECURE` | `True` (dev overrides to `False`) | Cookie sent over HTTPS only. |
| `SESSION_COOKIE_HTTPONLY` | `SESSION_COOKIE_HTTPONLY` | `True` | Cookie inaccessible to JavaScript (XSS mitigation). |
| `SESSION_COOKIE_SAMESITE` | `SESSION_COOKIE_SAMESITE` | `'Lax'` | CSRF mitigation; cookie not sent on cross-site POSTs. |
| `PERMANENT_SESSION_LIFETIME` | `PERMANENT_SESSION_LIFETIME` | `7200` (seconds = 2h) | Lifetime for Flask sessions marked permanent. The current login flow does not set `flask_session.permanent = True`, so this setting does not by itself enforce a 2h login-cookie expiry. Cast to `int`. |

### File uploads

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `UPLOAD_FOLDER` | `UPLOAD_FOLDER` | `'uploads'` | Where task attachments are saved (resolved to absolute in `init_app`). |
| `MAX_CONTENT_LENGTH` | `MAX_CONTENT_LENGTH` | `16777216` (16 MB) | Max request body; larger requests are rejected by Flask before view code runs. |
| `ALLOWED_EXTENSIONS` | `ALLOWED_EXTENSIONS` | `txt,pdf,csv,png,jpg,jpeg,doc,docx,xls,xlsx` | Parsed into a `set`. **Note:** `task_service.allowed_file` uses its own hardcoded set (which also includes `gif`) and ignores this config value. |

### Data directories

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `DATA_DIR` | `DATA_DIR` | `'HSCDATA'` | Per-machine summary CSVs (`small_<Machine>_DataCollection.csv`). Resolved to absolute in `init_app`. |
| `LOG_DATA_DIR` | `LOG_DATA_DIR` | `'LogData'` | Machine logs and sensor CSVs. Resolved to absolute in `init_app`. |

## 3.3 The `init_app` hooks

### Base `Config.init_app`

```python
@staticmethod
def init_app(app):
    for key in ('UPLOAD_FOLDER', 'DATA_DIR', 'LOG_DATA_DIR'):
        app.config[key] = os.path.abspath(app.config[key])
        os.makedirs(app.config[key], exist_ok=True)
```

Converts the three data directories to absolute paths and ensures they exist. The absolute-path conversion is important: Flask's `send_file` resolves relative paths against `app.root_path` (not the process CWD), which previously caused downloads to look in the wrong directory.

### `DevelopmentConfig`

```python
class DevelopmentConfig(Config):
    DEBUG = True
    DEBUG_MODE = True
    SESSION_COOKIE_SECURE = False
```

Forces debug on and relaxes the secure-cookie flag for plain-HTTP local testing.

### `ProductionConfig`

```python
class ProductionConfig(Config):
    DEBUG = False
    DEBUG_MODE = False

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        import logging
        from logging.handlers import RotatingFileHandler
        if not app.debug:
            file_handler = RotatingFileHandler('logs/untools.log', maxBytes=10240000, backupCount=10)
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)
            app.logger.setLevel(logging.INFO)
            app.logger.info('UNanofabTools startup')
```

Disables debug and installs a rotating file log at `logs/untools.log` (10 MB × 10 backups). **The `logs/` directory must exist** or the handler creation raises — `setup.sh` creates it; ensure your deployment does too.

## 3.4 Complete `.env` template (annotated)

This expands `.env.example` with the chem and particle keys it omits. Use it as the production starting point.

```ini
# --- Flask core ---
FLASK_APP=run.py
FLASK_ENV=production                 # development | production
SECRET_KEY=<64+ random chars>        # REQUIRED in prod
DEBUG_MODE=False                     # NEVER True in prod (bypasses 2FA)

# --- Server binding (nginx model: leave defaults; Flask on loopback) ---
# HOST=127.0.0.1
# PORT=5000

# --- SQLite databases (relative → instance/) ---
DATABASE_URI=sqlite:///signininfo.db
SESSION_DATABASE_URI=sqlite:///sessioninfo.db
TASK_DATABASE_URI=sqlite:///tasks.db
PARTICLE_SENSOR_DATABASE_URI=sqlite:///particle_sensors.db

# --- PostgreSQL (chemical inventory) ---
CHEM_PGHOST=localhost
CHEM_PGPORT=5432
CHEM_POSTGRES_DB=cheminventory
CHEM_POSTGRES_USER=postgres
CHEM_POSTGRES_PASSWORD=<strong password>

# --- Duo 2FA (required when DEBUG_MODE=False) ---
DUO_IKEY=<integration key>
DUO_SKEY=<secret key>
DUO_HOST=<api-XXXXXXXX.duosecurity.com>

# --- Session cookies ---
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_HTTPONLY=True
SESSION_COOKIE_SAMESITE=Lax
PERMANENT_SESSION_LIFETIME=7200

# --- Uploads ---
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
ALLOWED_EXTENSIONS=txt,pdf,csv,png,jpg,jpeg,doc,docx,xls,xlsx

# --- Data directories ---
DATA_DIR=HSCDATA
LOG_DATA_DIR=LogData
```

## 3.5 Configuration precedence summary

```
hardcoded default in config.py
        ▼ overridden by
values loaded from .env for variables not already set
        ▼ overridden by
existing process environment variables
        ▼ selected by
FLASK_ENV → config class (Development/Production) class-attribute overrides
```

Note the subtlety: class-attribute overrides in `DevelopmentConfig`/`ProductionConfig` (e.g. `DEBUG_MODE = True`) take effect because `from_object` reads the class attributes *after* the base class computed them from env vars. So in development, `DEBUG_MODE` is `True` regardless of the `.env` value, because `DevelopmentConfig` hardcodes it. If you need env-var control of debug in a given environment, account for this.

Continue to 04-database-schema.md (reference path: 04-database-schema.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/10-development-guide.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

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

This concludes the developer documentation set. See the index in README.md (reference path: README.md). Known bugs and technical debt are tracked in a separate file outside this folder (`SERVER-KNOWN-ISSUES.md`).
