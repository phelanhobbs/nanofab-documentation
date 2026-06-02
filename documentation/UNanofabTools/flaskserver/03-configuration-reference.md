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

Continue to [04-database-schema.md](04-database-schema.md).
