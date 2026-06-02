# 02 — Getting Started (Local Development)

This document gets a new developer from a fresh clone to a running development server. Production deployment is covered separately in [09-deployment-and-operations.md](09-deployment-and-operations.md).

## 2.1 Prerequisites

| Requirement | Notes |
|-------------|-------|
| Python 3.10+ | The repo's virtualenvs use 3.14; any modern 3.x works. `python3 --version` to check. |
| `pip` + `venv` | Standard library; bundled with CPython. |
| PostgreSQL 12+ | Required **only** for the chemical-inventory module. The rest of the app runs without it. The production deployment on `nfhistory` runs Postgres **locally on the same VM** (see [`../liveserver/README.md`](../liveserver/README.md) §10). A development install can point at any reachable Postgres via the `CHEM_PGHOST` env var; local is the simplest. |
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

`DEBUG_MODE=True` is what makes local development practical: it bypasses Duo 2FA and enables Flask's reloader and verbose error pages. Every key in `.env` is documented in [03-configuration-reference.md](03-configuration-reference.md).

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

There is no automated test suite in the repository at present. Verification is manual. When adding tests, see [10-development-guide.md](10-development-guide.md) §10.7 for the recommended approach (pytest + the application factory with a test config).

## 2.6 Common first-run issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| `OperationalError: unable to open database file` | Working directory not writable, or `instance/` missing | Run from the repo root; ensure write permission |
| Chem pages 500 with connection refused | PostgreSQL not running or `.env` chem vars wrong | Start Postgres / fix `CHEM_*` vars, or avoid `/chem/*` |
| Login always fails in dev | The app is not using `DevelopmentConfig`, so Duo runs and there are no Duo creds | Confirm `FLASK_ENV=development` (or unset it); `DevelopmentConfig` hardcodes `DEBUG_MODE=True` |
| Cookies not persisting over HTTP | `SESSION_COOKIE_SECURE=True` while testing on `http://` | Use `DevelopmentConfig` (sets it `False`) or set the env var |
| Static JS/CSS 404 | Files not under `app/static/js` or `app/static/css` | Confirm the static layout (`02.3 Step 4`) |

Continue to [03-configuration-reference.md](03-configuration-reference.md).
