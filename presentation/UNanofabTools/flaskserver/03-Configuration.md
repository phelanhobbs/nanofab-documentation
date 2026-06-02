# 03 — Configuration

The file `config/config.py` answers a single question: **"where does the server get its settings from?"** Most things — passwords, database addresses, debug flags, file upload limits — should *not* be hard-coded into the source. Instead they live in environment variables, with safe defaults baked in for development.

## The big idea: `.env` plus dataclasses

The setup uses two pieces:

1. A `.env` file on the server's disk (not in source control) holds the real secrets and connection strings. There's a `.env.example` in the repo that shows the names of all the variables you can set.
2. `config/config.py` defines Python classes (`Config`, `DevelopmentConfig`, `ProductionConfig`) whose class attributes pull values from the environment using `os.getenv(NAME, DEFAULT)`. The default is used if the variable is missing.

When Flask starts, it reads the appropriate class. The pattern lets you:

- Run the same code in dev, staging, and production without changing the source.
- Keep secrets out of git.
- See defaults at a glance in the source.

## Walking through `config/config.py`

```python
"""
Configuration module for Flask application
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
```

`load_dotenv()` is from the `python-dotenv` package. It reads the file named `.env` in the current directory (if present) and copies values into the process environment only for variables that are not already set. A real process environment variable wins over the `.env` value.

In production you might not even have a `.env` file — the environment variables can be set directly by the system service that launches the app. `load_dotenv()` is harmless either way: it does nothing if no file is found.

### The base `Config` class

```python
class Config:
    """Base configuration"""

    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
```

`SECRET_KEY` is the cryptographic key Flask uses to sign session cookies. If an attacker knows this key, they can forge logged-in sessions. The default `'dev-secret-key-change-in-production'` is intentionally awful — you must override it in production via the `.env`.

```python
    # Debug Mode
    DEBUG_MODE = os.getenv('DEBUG_MODE', 'False').lower() == 'true'
```

A boolean read from a string. `DEBUG_MODE=True` (any capitalization) becomes Python `True`; anything else becomes `False`. Debug mode does two things in this codebase:

- It skips Duo 2FA in `auth.py` (so you can log in without your phone during local development).
- It feeds `debug=True` into Flask's `app.run()` so you get auto-reload and richer error pages.

```python
    # Server Configuration
    # Flask always binds to localhost:5000 — nginx handles external SSL on 443.
    # Override HOST/PORT via env vars only if you know what you're doing.
    HOST = os.getenv('HOST', '127.0.0.1')
    PORT = int(os.getenv('PORT', 5000))
```

The IP and port Flask listens on. `127.0.0.1` (loopback) means external machines cannot connect to Flask directly; they must go through nginx. `int(...)` converts the port from a string into a number.

```python
    # SSL Configuration (only used if running Flask standalone without nginx)
    SSL_CERT_PATH = os.getenv('SSL_CERT_PATH', 'cert.pem')
    SSL_KEY_PATH = os.getenv('SSL_KEY_PATH', 'key.pem')
```

These paths only matter if you ever decide to skip nginx and have Flask itself handle HTTPS — which isn't the recommended setup but is occasionally useful for testing.

### Database URLs

```python
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///signininfo.db')
    SQLALCHEMY_BINDS = {
        'sessions': os.getenv('SESSION_DATABASE_URI', 'sqlite:///sessioninfo.db'),
        'tasks': os.getenv('TASK_DATABASE_URI', 'sqlite:///tasks.db'),
        'particle_sensors': os.getenv('PARTICLE_SENSOR_DATABASE_URI', 'sqlite:///particle_sensors.db')
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False
```

SQLAlchemy supports having multiple databases attached to one application. The main one is `SQLALCHEMY_DATABASE_URI`; the rest live under `SQLALCHEMY_BINDS` with a key name.

In our case, the main database holds the **users** (`signininfo.db`), and three side databases hold:

- **`sessions`** — currently-logged-in user sessions (`sessioninfo.db`)
- **`tasks`** — the task tracker (`tasks.db`)
- **`particle_sensors`** — the latest reading from each Pico particle sensor (`particle_sensors.db`)

Each model class declares which database it belongs to via `__bind_key__`. See `10-Database-Models.md`.

`SQLALCHEMY_TRACK_MODIFICATIONS = False` disables a memory-eating debugging feature that we don't use.

```python
    # Chemical Inventory PostgreSQL Configuration
    CHEM_PGHOST = os.getenv('CHEM_PGHOST', os.getenv('PGHOST', 'localhost'))
    CHEM_PGPORT = os.getenv('CHEM_PGPORT', os.getenv('PGPORT', '5432'))
    CHEM_POSTGRES_DB = os.getenv('CHEM_POSTGRES_DB', os.getenv('POSTGRES_DB', 'cheminventory'))
    CHEM_POSTGRES_USER = os.getenv('CHEM_POSTGRES_USER', os.getenv('POSTGRES_USER', 'postgres'))
    CHEM_POSTGRES_PASSWORD = os.getenv('CHEM_POSTGRES_PASSWORD', os.getenv('POSTGRES_PASSWORD', 'changeme'))
```

The chemical inventory is on PostgreSQL, not SQLite. These five settings tell SQLAlchemy how to connect to it. Each uses a *nested default*: if `CHEM_PGHOST` isn't set, fall back to `PGHOST`, and if that's not set either, fall back to `localhost`. This nesting is a polite gesture toward shared-environment users who might have set generic Postgres variables already.

Notice the password default of `'changeme'`. Like `SECRET_KEY`, this exists only so the app can boot in development without crashing on a missing variable. Change it.

### Duo and sessions

```python
    # Duo Security Configuration
    DUO_IKEY = os.getenv('DUO_IKEY')
    DUO_SKEY = os.getenv('DUO_SKEY')
    DUO_HOST = os.getenv('DUO_HOST')
```

The three secrets needed to call Duo's 2FA API: integration key, secret key, API host. No defaults here — if they aren't set and `DEBUG_MODE` is `False`, Duo calls will fail. (In `DEBUG_MODE=True`, the auth code skips Duo entirely; see `04-Authentication-and-Login.md`.)

```python
    # Session Configuration
    SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE', 'True').lower() == 'true'
    SESSION_COOKIE_HTTPONLY = os.getenv('SESSION_COOKIE_HTTPONLY', 'True').lower() == 'true'
    SESSION_COOKIE_SAMESITE = os.getenv('SESSION_COOKIE_SAMESITE', 'Lax')
    PERMANENT_SESSION_LIFETIME = int(os.getenv('PERMANENT_SESSION_LIFETIME', 7200))
```

Four important security knobs for the login cookie:

- **`SECURE`** — only send the cookie over HTTPS. Always `True` in production. The dev config below overrides this to `False` so plain HTTP works for local testing.
- **`HTTPONLY`** — JavaScript in the browser cannot read the cookie. This is a big deal: it means an XSS bug (malicious JS injected into a page) cannot grab someone's login.
- **`SAMESITE='Lax'`** — the cookie isn't sent on cross-site form submissions, which protects against most CSRF attacks.
- **`PERMANENT_SESSION_LIFETIME = 7200`** — the lifetime Flask would apply to sessions marked permanent. The current login flow does not mark the cookie session permanent, so this is not an enforced two-hour logout by itself.

### Uploads and data folders

```python
    # File Upload Configuration
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB default
    ALLOWED_EXTENSIONS = set(os.getenv('ALLOWED_EXTENSIONS', 'txt,pdf,csv,png,jpg,jpeg,doc,docx,xls,xlsx').split(','))

    # Data Directories
    DATA_DIR = os.getenv('DATA_DIR', 'HSCDATA')
    LOG_DATA_DIR = os.getenv('LOG_DATA_DIR', 'LogData')
```

- **`UPLOAD_FOLDER`** — where task file attachments are saved.
- **`MAX_CONTENT_LENGTH`** — 16 megabytes of upload max. Bigger uploads are rejected by Flask before they even reach our code.
- **`ALLOWED_EXTENSIONS`** — a set of file extensions the task uploader will accept. Reading the comma-separated string and turning it into a Python set is done with `.split(',')`.
- **`DATA_DIR`** — the directory containing the CSV files that back the per-machine summary pages (covered in `07-Machines-and-Logs.md`).
- **`LOG_DATA_DIR`** — the directory containing raw machine log files that PowerShell transfer scripts and Raspberry Pis drop off.

### `init_app` — fixing paths

```python
    @staticmethod
    def init_app(app):
        """Initialize application with this configuration"""
        # Resolve data directories to absolute paths so behavior is independent
        # of process CWD and of Flask's `send_file` resolving relative paths
        # against `app.root_path` (which differs from CWD and caused downloads
        # to look in the wrong LogData directory).
        for key in ('UPLOAD_FOLDER', 'DATA_DIR', 'LOG_DATA_DIR'):
            app.config[key] = os.path.abspath(app.config[key])
            os.makedirs(app.config[key], exist_ok=True)
```

This is called from `create_app` after the config is loaded. It turns three potentially-relative paths into absolute paths and ensures the directories exist. The comment explains the bug it was fixing: Flask's `send_file` resolves relative paths against the application root, which is *different* from the current working directory. That mismatch caused downloads to look in the wrong folder; converting the paths to absolute at startup fixes it once and for all.

### Dev vs. production subclasses

```python
class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    DEBUG_MODE = True
    SESSION_COOKIE_SECURE = False  # Allow HTTP in development


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    DEBUG_MODE = False

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)

        # Production-specific initialization
        import logging
        from logging.handlers import RotatingFileHandler

        if not app.debug:
            file_handler = RotatingFileHandler('logs/untools.log', maxBytes=10240000, backupCount=10)
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
            ))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)

            app.logger.setLevel(logging.INFO)
            app.logger.info('UNanofabTools startup')
```

These two classes are *subclasses* of `Config`, so they inherit everything above and only need to spell out the differences:

- **`DevelopmentConfig`** flips `DEBUG_MODE` on and disables the secure-cookie flag (so the cookie still works on plain `http://localhost`).
- **`ProductionConfig`** disables debug and installs a rotating log file. `RotatingFileHandler('logs/untools.log', maxBytes=10240000, backupCount=10)` means: write to `logs/untools.log`; when it hits ~10MB, rename it and start fresh; keep the last 10 rolled files. So your disk never fills up with logs.

The log format string `'%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'` produces lines like:

```
2026-05-19 11:23:45,123 INFO: Particle data: HEADLESS/009 — temp=22.1 [in /opt/untools/app/blueprints/api.py:774]
```

— a timestamp, severity, message, source file, line number. Standard ops-friendly format.

### The config lookup table

```python
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
```

A small dictionary that `run.py` uses to pick a class by the `FLASK_ENV` string. If nothing is set, `run.py` defaults to `development`, which maps to `DevelopmentConfig`. `FLASK_ENV=production` maps to `ProductionConfig`; any other value must be one of the dictionary keys or startup fails.

## Summary

`config/config.py` is the only place to look when you want to know:

- What environment variables affect server behavior.
- Where each database lives.
- What the cookie security policy is.
- Where uploads and log files go on disk.
- What's different between dev and production.

Anything you'd want to change for a deployment — passwords, DB host, file size limits — is here and is sourced from environment variables, never hard-coded.

Next: `04-Authentication-and-Login.md`.
