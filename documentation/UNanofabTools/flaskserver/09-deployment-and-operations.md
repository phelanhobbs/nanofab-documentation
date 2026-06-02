# 09 — Deployment & Operations

A production runbook for hosting, operating, and maintaining the server. nginx and systemd configs are **not** in the repository; the templates below are documented recommendations consistent with the codebase's stated deployment model (`run.py` docstring, `config.py` comments). Adapt paths/users to your host.

## 9.1 Deployment model

Current intended model:

```
Internet/LAN ──443/HTTPS──► nginx (TLS termination, static, proxy)
                                  │ proxy_pass http://127.0.0.1:5000
                                  ▼
                            gunicorn (WSGI) ──► Flask app (run:app)
                                  │
                     ┌────────────┼─────────────┐
                     ▼            ▼              ▼
              SQLite (instance/) PostgreSQL   LogData/ HSCDATA/ uploads/
```

- Flask binds `127.0.0.1:5000` (config defaults). It is never directly exposed.
- gunicorn runs the WSGI callable `run:app`.
- nginx owns TLS and forwards to gunicorn.

> **Live-state note:** as of the 2026-06-01 `nfhistory` survey, the production box has not yet been migrated to this target shape. The live Flask process is `python run.py` inside the `flaskserver` tmux session, and there is no systemd unit for Flask or HSCDownloader yet. Treat the gunicorn/systemd material below as the recommended migration target, not a description of the current live service. See [`../liveserver/README.md`](../liveserver/README.md) §6.5.

**Legacy alternative (still referenced by `setup.sh`/`.env.example`):** gunicorn binding `0.0.0.0:443` directly with `--certfile/--keyfile`, no nginx:

```bash
gunicorn -w 4 -b 0.0.0.0:443 --certfile=cert.pem --keyfile=key.pem run:app
```

Prefer the nginx model for new deployments (better TLS handling, static serving, and process isolation). The rest of this document assumes nginx + gunicorn.

## 9.2 Host prerequisites

- Linux host with Python 3.10+ and `python3-venv`.
- nginx.
- PostgreSQL 12+. On the live `nfhistory` deployment, Postgres runs **locally on the same VM** (see [`../liveserver/README.md`](../liveserver/README.md) §10); a fresh deployment can do the same or point at a reachable remote Postgres via `CHEM_PGHOST`.
- A TLS certificate + key. Live deployment uses **Let's Encrypt + certbot** with the `certbot.timer` systemd unit handling auto-renewal (see [`../liveserver/README.md`](../liveserver/README.md) §4).
- A UNIX account to own the process and files. On `nfhistory`, this is the shared `phelan` account (the Nanofab team cannot create new UNIX users — IT does — see `../serveraccess/README.md` §5.5). On a greenfield install, you can either reuse a shared account or — if you have root — create a dedicated `untools` service user.

## 9.3 Application install

```bash
# as the service user, in the deploy directory
git clone <repo> UNanofabTools && cd UNanofabTools
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn          # not in requirements.txt; install explicitly
cp .env.example .env          # then edit per 03 §3.4 (production values)
mkdir -p logs                 # REQUIRED: ProductionConfig logging writes logs/untools.log
```

Set in `.env` for production:
- `FLASK_ENV=production`
- `DEBUG_MODE=False`
- a strong `SECRET_KEY`
- real `DUO_*` credentials
- `CHEM_*` credentials (if using chem)
- leave `HOST`/`PORT` at defaults (`127.0.0.1:5000`) for the nginx model — remove the `155.98.11.6`/`443` lines from `.env.example`.

## 9.4 Database provisioning

### SQLite
Created automatically by `db.create_all()` at first boot under `instance/`. To use migrations explicitly:

```bash
export FLASK_APP=run.py
flask db upgrade
```

Ensure the service user can write to `instance/` (and the working directory).

### PostgreSQL (chem)

```bash
# create DB + user
sudo -u postgres createdb cheminventory
sudo -u postgres psql -c "CREATE USER untools WITH PASSWORD '<strong>';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cheminventory TO untools;"

# provision schema
python init_chem_db.py
psql "postgresql://untools:<strong>@localhost/cheminventory" -f chem_schema_migration_v2.sql
```

> The committed SQL does not create every object the runtime uses (`containers.last_scan_at`, extended `inventory_cycles` columns, `scan_raw.barcode`, `container_scans.barcode`, the `transactions` table). Until proper migrations exist, apply the additional DDL recorded in the separate known-issues file to a fresh database, or the chem write/scan/report features will error. An existing production database already has these.

## 9.5 Running under gunicorn

Manual smoke test:

```bash
source venv/bin/activate
export FLASK_ENV=production
gunicorn -w 4 -b 127.0.0.1:5000 run:app
```

`-w 4` = 4 worker processes (rule of thumb: `2 × CPU cores + 1`). The app is synchronous; the default sync worker is appropriate. Note Duo pushes block a worker for the duration of the user's approval (up to ~30s), so size workers with that in mind, or move Duo to an async worker class if push volume grows.

### systemd unit (template)

`/etc/systemd/system/untools.service`:

```ini
[Unit]
Description=UNanofabTools Flask (gunicorn)
After=network.target postgresql.service

[Service]
User=untools
Group=untools
WorkingDirectory=/opt/UNanofabTools
Environment="PATH=/opt/UNanofabTools/venv/bin"
EnvironmentFile=/opt/UNanofabTools/.env
ExecStart=/opt/UNanofabTools/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 run:app
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now untools
sudo systemctl status untools
```

> `WorkingDirectory` matters: SQLite relative URIs, `instance/`, `logs/`, `LogData/`, `HSCDATA/`, and `uploads/` resolve relative to it (the config converts data dirs to absolute at startup, but the working directory is still where they're rooted on first resolution). Keep it at the repo root.

## 9.6 nginx reverse proxy (template)

`/etc/nginx/sites-available/untools`:

```nginx
server {
    listen 443 ssl;
    server_name nfhistory.nanofab.utah.edu;

    ssl_certificate     /etc/ssl/untools/fullchain.pem;
    ssl_certificate_key /etc/ssl/untools/privkey.pem;

    # Allow large-ish uploads (matches MAX_CONTENT_LENGTH = 16 MB)
    client_max_body_size 16m;

    # ACME http-01 challenge support (repo has .wellknown/acme-challenge/)
    location /.well-known/acme-challenge/ {
        root /opt/UNanofabTools;
    }

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;       # Duo pushes can be slow
    }
}

server {                              # redirect http→https
    listen 80;
    server_name nfhistory.nanofab.utah.edu;
    return 301 https://$host$request_uri;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/untools /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Notes:
- `client_max_body_size 16m` should match (or slightly exceed) `MAX_CONTENT_LENGTH`; otherwise nginx rejects uploads before Flask sees them.
- Optionally serve `/js/` and `/css/` directly from `app/static/` in nginx for performance; currently the app serves them.
- Device clients use `verify=False`, so an internal/self-signed cert is acceptable for them, but a real cert is recommended for browsers.

## 9.7 On-disk data layout

The server reads/writes a tree under the working directory. Back these up and monitor disk usage.

```
instance/                     SQLite databases (users, sessions, tasks, particle cache)
  signininfo.db
  sessioninfo.db
  tasks.db
  particle_sensors.db

uploads/                      task file attachments (timestamped, secure_filename)

HSCDATA/                      per-machine summary CSVs: small_<Machine>_DataCollection.csv
                              (written by HSCDownloader — see documentation/UNanofabTools/hscdownloader/)

LogData/                      machine logs + sensor histories
  ALD/RF/, ALD/Pressure/      ALD log files
  Paralyne/temp/<session>/    in-flight Parylene batches (transient)
  Paralyne/analog/            finalized Parylene CSVs (also served via /api/paralyne/...)
  denton18/pumpdata/          Denton 18 pump CSVs + current_run.txt sentinel
  particle_sensors/           <room>_<sensor>_historical.csv (particle time series)
  env_sensors/                <room>_<sensor>_historical.csv (temp/humidity time series)
  sensors/                    <room>_<sensor>_combined.csv (read by GET /sensor-data; see note)

logs/                         untools.log (rotating, production only)
```

Growth hot spots: `LogData/particle_sensors/` and `LogData/env_sensors/` grow unbounded (append per reading); `Paralyne/temp/` should self-clean on finalize but orphaned sessions can accumulate if a run never finalizes.

## 9.8 Logging

- **Production:** `ProductionConfig.init_app` installs a `RotatingFileHandler` at `logs/untools.log` (10 MB × 10 backups, level INFO). Ensure `logs/` exists and is writable, or startup fails.
- **gunicorn:** add `--access-logfile` / `--error-logfile` (or `-` for stdout, captured by journald under systemd).
- **nginx:** standard access/error logs.
- The application logs key events (sensor ingest, errors) via `current_app.logger`. Many service functions also `print(...)` (notably `chem_service` room/move/bulk debug lines) — these land in stdout/journald.

## 9.9 Backups

**On the production deployment, the base backup is run off the box by University IT** — a VM-level snapshot the Nanofab team does not operate (see [`../liveserver/README.md`](../liveserver/README.md) §13). Confirm IT's scope and SLA, then write the result there. The table below applies to any **secondary Nanofab-owned tier** (a Nanofab admin running their own backups in addition to IT's), or to a non-production deployment where IT isn't doing it.

| Data | How |
|------|-----|
| SQLite DBs | Stop writes or use `sqlite3 <db> ".backup"`; or copy `instance/*.db` during low traffic. They are small. |
| PostgreSQL (local on the same host — see `../liveserver/README.md` §10) | `pg_dump cheminventory > backup.sql` on a schedule (cron). |
| CSV tree | `tar`/`rsync` `LogData/`, `HSCDATA/`, `uploads/`. These are authoritative for sensor/machine history. |
| Config | Securely back up `.env` (contains secrets) separately. |

Test restores periodically. The CSV tree is the only copy of long-run sensor history (the DB caches only the latest reading), so it is as important as the databases.

## 9.10 Routine operations

- **Session cleanup:** `auth_service.delete_old_sessions()` is not scheduled. Add a cron/management hook to purge `sessioninfo` rows periodically, or accept unbounded growth (rows are tiny).
- **Parylene temp cleanup:** orphaned `LogData/Paralyne/temp/<session>/` dirs (runs that never finalized) can be safely deleted after confirming no active upload.
- **Deploys:** `git pull` → `pip install -r requirements.txt` (if changed) → `flask db upgrade` (if migrations added) → `sudo systemctl restart untools`.
- **Rotating SECRET_KEY:** invalidates all Flask-Login cookies (forces re-login). Do this if a key compromise is suspected.

## 9.11 Health checks & monitoring

There is no dedicated health endpoint. Practical checks:
- `GET /login` returns 200 (app + templating up).
- `GET /chem/inventory` returns 200 (Postgres reachable) — only if chem is in use.
- `systemctl is-active untools`, gunicorn worker count, nginx up.
- Disk usage on the `LogData/` volume.
Consider adding a lightweight `/healthz` route that pings each datastore.

## 9.12 Troubleshooting

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| 502 from nginx | gunicorn down or wrong bind | `systemctl status untools`; confirm `127.0.0.1:5000` |
| App won't start, logging error | `logs/` missing | `mkdir logs` and restart |
| All chem pages 500 | Postgres unreachable / creds wrong / missing runtime columns | check `CHEM_*`, Postgres up, apply missing DDL (known-issues) |
| Logins fail in prod | `DUO_*` unset/wrong or Duo unreachable | verify Duo creds/host; check logs for "Duo authentication error" |
| Uploads rejected (413) | nginx `client_max_body_size` < payload | raise it to ≥16m |
| Downloads 403 | path outside `LOG_DATA_DIR` (traversal guard) | confirm the file is under `LogData/` |
| `GET /sensor-data` always 404 | POST writes elsewhere than the GET reads | use `/particle-data` + `/env-data` history; see known-issues |
| Cookies dropped | `SESSION_COOKIE_SECURE=True` over HTTP | ensure TLS end-to-end in prod |

Continue to [10-development-guide.md](10-development-guide.md).
