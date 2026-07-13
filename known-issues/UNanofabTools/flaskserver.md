# UNanofabTools Server — Known Issues & Technical Debt

Private working list for Faith. This file is intentionally **separate** from the `documentation/` folder so the successor handoff docs stay clean. It records bugs, gaps, and tech debt found while reading the code, with severity and suggested fixes. It's a to-do list; closed items are marked inline and/or moved to the ✅ Resolved / Closed section at the bottom.

Severity legend: **High** = breaks functionality or is a real security exposure · **Medium** = correctness/maintainability problem · **Low** = cosmetic/cleanup.

---

## Functional bugs

### 1. `GET /sensor-data` reads a directory that `POST /sensor-data` never writes — ✅ RESOLVED (2026-07-01, commit `5cc5174`; GET capped 2026-07-07, commit `8712b49`)
- **Was:** `sensor_data_get` read `LogData/sensors/<room>_<sensor>_combined.csv` via `_sensor_csv_path`, but `sensor_data_post` only wrote to `LogData/particle_sensors/` (via `log_historical_particle_data`) and `LogData/env_sensors/` — nothing wrote `LogData/sensors/`, so `GET /sensor-data` returned 404 for every sensor, even ones actively posting.
- **Resolution (Option b — preserves the intended "combined" semantics):** `sensor_data_post` now also appends the combined per-sensor CSV to `LogData/sensors/` via `_sensor_csv_path`, writing columns in `SENSOR_CSV_HEADER` order (commit `5cc5174`). A follow-up (commit `8712b49`) caps `GET /sensor-data` with an optional `?limit` (default 500 most-recent rows) so large histories don't return everything at once.
- **Validation:** POST a combined reading, then `GET /sensor-data?room_name=…&sensor_number=…` → 200 with the row(s).

### 2. `suggest()` and `autofill()` are stubs — Medium
- **Where:** `app/services/chem_service.py` — `suggest(self, field, q, limit=10)` returns `[]`; `autofill(self, catalog="", name="")` returns `{}`.
- **Effect:** `/chem/api/suggest` always returns `{"results": []}` and `/chem/api/autofill` always returns `{"data": {}}`. The Add/Edit type-ahead and catalog auto-fill UI features are dead.
- **Fix:** implement `suggest` as a `SELECT DISTINCT <field> ... WHERE <field> ILIKE :q LIMIT :n` (whitelist `field` to valid column names to avoid injection via identifier), and `autofill` as a lookup by catalog number / name returning the item's vendor/state/size/etc.

### 3. `ParalyneReader` calls a non-existent endpoint — Low
- **Where:** `NanofabToolkit/ParalyneReader/src/ParalyneReader.py` — `return_selected()` GETs `/api/paralyne/analog/return/<filename>`, which the server does not implement.
- **Effect:** that client function errors if called (the live `list`/`download` paths work).
- **Fix:** either implement a `/return/<filename>` route or remove the dead client function.

---

## Schema management (chem reconciliation ✅ + SQLite/Alembic)

### 4. Runtime uses columns/tables not in the committed schema files — ✅ RESOLVED (2026-06-29, commit `313e495`)
- **Where:** `chem_service.py` vs `chem_schema.sql` + `chem_schema_migration_v2.sql`.
- **Missing from committed SQL but used at runtime:**
  - `containers.last_scan_at` — set in `import_scans`; read by `search_inventory` and `get_inventory_scan_coverage`.
  - `inventory_cycles` extended columns: `filename`, `performed_by`, `report_name`, `location`, `total_scanned`, `matched_count`, `unmatched_count` — written by `import_scans`; read by `get_scan_reports`.
  - `scan_raw.barcode` and `container_scans.barcode` — written by `import_scans`.
  - The entire `transactions` table (`transaction_id`, `action`, `container_id`, `barcode`, `item_id`, `room_id`, `details` JSON, `performed_by`, `created_at`) — written by `log_transaction`; read by `get_transactions`.
- **Was:** a database built only from the committed `.sql` files was missing these, so chem add/scan/report/transaction features errored on a fresh deploy. Production worked only because columns were added ad-hoc over time.
- **Resolution (commit `313e495`):** added `chem_schema_migration_v3.sql` — idempotent (`IF NOT EXISTS`) DDL matched **column-for-column to a live `pg_dump`** — that creates all of the above, so a fresh database matches production. `init_chem_db.py` now applies `chem_schema.sql` → v2 → v3 (validated on an empty Postgres). A `.gitignore` `*.sql` rule had been hiding the new file — fixed with a `!chem_schema*.sql` exception. The DDL that landed is essentially the block below, **except `transactions.details` is `TEXT`, not the `JSONB` shown here** (confirmed against the live dump):
  ```sql
  ALTER TABLE containers      ADD COLUMN IF NOT EXISTS last_scan_at TIMESTAMPTZ;
  ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS filename TEXT,
                               ADD COLUMN IF NOT EXISTS performed_by TEXT,
                               ADD COLUMN IF NOT EXISTS report_name TEXT,
                               ADD COLUMN IF NOT EXISTS location TEXT,
                               ADD COLUMN IF NOT EXISTS total_scanned INTEGER,
                               ADD COLUMN IF NOT EXISTS matched_count INTEGER,
                               ADD COLUMN IF NOT EXISTS unmatched_count INTEGER;
	  ALTER TABLE scan_raw        ADD COLUMN IF NOT EXISTS barcode TEXT;
	  ALTER TABLE container_scans ADD COLUMN IF NOT EXISTS barcode TEXT;
  CREATE TABLE IF NOT EXISTS transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    action TEXT, container_id BIGINT, barcode TEXT,
    item_id INTEGER, room_id INTEGER,
    details JSONB, performed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
  (Types verified against the live `pg_dump`; `transactions.details` is `TEXT`. Re-running v3 on prod 2026-06-29 reported every object "already exists, skipping", zero errors, clean COMMIT — the committed schema now matches production object-for-object.)

### 5. SQLite `db.create_all()` and Alembic can diverge — Medium
- **Where:** `app/__init__.py` calls `db.create_all()` every boot; `migrations/` has only one revision.
- **Effect:** new tables get created by `create_all()` without a migration, so the Alembic history doesn't fully describe the schema. Rebuilding from migrations alone may not match a running instance.
- **Fix:** treat Alembic as source of truth; generate migrations for all model changes and consider removing the reliance on `create_all()` in production.

---

## Security gaps (deliberate trade-offs for an internal tool, but worth closing)

### 6. Entire chemical inventory is unauthenticated — ✅ RESOLVED (2026-06-25) *(was High; audit CRITICAL — the top open exposure)*
- **Resolution (commit `f604818`):** the whole `/chem` blueprint is now gated by a `before_request` hook (`_require_chem_token`). Any request without `session['chem_authed']` is redirected to the WordPress staff-tools page; the session is established only via `/chem/enter`, which validates a time-limited HMAC-signed link (`hmac(CHEM_SSO_SECRET, "chem-inventory|<exp>")` vs the `sig` query param). **Both read and write routes are now protected** — there is no public kiosk read anymore.
- **Note:** this is a WordPress single-sign-on path (the new `CHEM_SSO_SECRET` env var), **separate** from the app's Flask-Login/Duo auth. See R4 below and `07-authentication-and-authorization.md`.
- **Original finding:** `chem_inventory.py` imported `login_required` but applied it to no route, so anyone who could reach the server could search/add/move/edit/remove containers and read the transaction history.

### 7. IoT/device endpoints are unauthenticated — Medium (acceptable on private net)
- **Where:** all of `api.py`.
- **Effect:** any host that can reach the server can POST sensor/machine data or read it. Trust is purely network-perimeter (private SSID).
- **Fix (if exposure increases):** require a shared API key header on device endpoints; reject without it.

### 8. CORS is wide open — Medium
- **Where:** `app/__init__.py` — `CORS(app)` with no origin restriction.
- **Effect:** any website's JS can call the JSON endpoints from a browser; combined with #6/#7 this widens the surface.
- **Fix:** restrict CORS to known internal origins, ideally only for the routes that need it.

### 9. Password reset uses uNID as sole secret — Medium
- **Where:** `auth.reset_password` / `auth_service.verify_user_unid`.
- **Effect:** anyone knowing a username + its uNID can reset the password; no Duo step. uNIDs are semi-public.
- **Fix:** add a Duo push (or email confirmation) to the reset flow before allowing the password change.

### 10. Login timing oracle (username enumeration) — Low
- **Where:** `auth_service.verify_user_credentials` skips bcrypt when the username is absent.
- **Effect:** non-existent usernames respond marginally faster, enabling enumeration.
- **Fix:** perform a dummy bcrypt compare on the no-user path to equalize timing.

### 11. `csv_to_html_table` does not escape cell values — Medium
- **Where:** `app/services/data_service.py`.
- **Effect:** if any machine CSV cell contained HTML/JS, it would render unescaped (stored XSS). Currently mitigated only by trusting machine-generated CSVs.
- **Fix:** `html.escape` each cell before interpolation.

---

## Inconsistencies / maintainability

### 12. Mixed persistence styles — Medium
- ORM (auth/admin/particle), raw `sqlite3` (tasks), SQLAlchemy Core (chem). Three patterns for the maintainer to learn.
- **Fix (optional):** migrate `task_service` to the ORM (the `Task`/`TaskAssignee`/`TaskFile` models already exist) for consistency.

### 13. `task_service` ignores `TASK_DATABASE_URI` — Low
- It locates `tasks.db` via its own `_get_db_path` instead of the configured URI. Changing the config var won't move the file.
- **Fix:** read the path from config, or document the coupling (done in the docs).

### 14. Duplicate `ALLOWED_EXTENSIONS` definitions — Low
- `config.ALLOWED_EXTENSIONS` vs the hardcoded set in `task_service.allowed_file` (which additionally allows `gif`). The config value is ignored by the uploader.
- **Fix:** have `allowed_file` read `current_app.config['ALLOWED_EXTENSIONS']`.

### 15. Dead code: `chem_inventory_remote.py` — Low
- Near-duplicate `chem_bp` not registered anywhere.
- **Fix:** delete it to avoid confusion (two definitions of the same `/chem/*` routes in the tree).

### 16. Empty model placeholder files — Low
- `app/models/session.py`, `task.py`, `user.py` are 0 bytes; real classes live in `app/models/__init__.py`.
- **Fix:** either split the models into these files or delete the placeholders.

### 17. Debug `print()` statements in `chem_service` — Low
- `resolve_room_id`/`_resolve_room`/`bulk_move_by_barcodes`/`container_lookup` print to stdout on normal operation (e.g. `"USING resolve_room_id"`, `"BULK MOVE FORM:"`, `"LOOKUP ROW:"`).
- **Fix:** remove or convert to `current_app.logger.debug`.

### 18. `get_reports()` in `chem_service` is unused — Low
- The `/chem/report` route calls the individual `report_*` methods; `get_reports()` is dead.
- **Fix:** remove `get_reports()` or wire the route to it.

### 19. No automated tests — Medium
- No test suite exists; all verification is manual.
- **Fix:** add pytest with the factory + a test config (see `documentation/10-development-guide.md` §10.7). Prioritize auth, path-traversal guards, device validators, chem write/transaction methods.

### 20. `delete_old_sessions` not scheduled — Low
- The cleanup function exists but nothing calls it; `sessioninfo` grows unbounded (rows are tiny).
- **Fix:** schedule via cron / a management command, or add a periodic task.

### 21. Server-side session table not consulted for auth — Low/Medium
- `sessioninfo` rows are created but access control uses the Flask-Login cookie only. Deleting a `sessioninfo` row does not log a user out.
- **Fix:** if you want server-side revocation, add a `before_request` check that the cookie's `session_id` still exists in `sessioninfo`.

---

## Suggested priority order

1. #2 implement `suggest`/`autofill` — Medium
2. #8 tighten CORS, #9 strengthen password reset — Medium
3. #11 escape CSV cells — Medium
4. #19 add a test suite — Medium
5. Cleanup batch: #13–#18, #20, #21 — Low

*(Resolved and removed from this list: #1 `/sensor-data` 404 — ✅ 2026-07-01 / 07-07, commits `5cc5174` + `8712b49`; #4 chem schema drift — ✅ 2026-06-29, commit `313e495`; #6 chem-inventory auth — ✅ 2026-06-25, commit `f604818`. No High-severity items remain open.)*

---

## ✅ Resolved / Closed

Verified fixed or confirmed non-issues during the 2026-06-17/18 live checks. Move items here as they're closed.

### R1. Dev-mode auth bypass — was CRITICAL — CLOSED
- **Original concern:** if `FLASK_ENV` were unset/`development`, auth would skip Duo 2FA, `app.run(debug=True)` would expose the Werkzeug debugger, and `SESSION_COOKIE_SECURE` would be `False`.
- **Why closed:** the live `.env` sets `FLASK_ENV=production`, `DEBUG_MODE=False`, `SESSION_COOKIE_SECURE=True`; `load_dotenv()` runs before `run.py` reads `FLASK_ENV`, so `ProductionConfig` loads — Duo 2FA active, debugger off, cookies Secure (verified 2026-06-17).

### R2. Weak default `SECRET_KEY` — was High — CLOSED
- **Original concern:** `config.py` falls back to a public default, making session cookies forgeable if the env var is unset.
- **Why closed:** `SECRET_KEY` is present in the live `.env` (verified) — not the default.
- **Optional hardening:** make `ProductionConfig.init_app` raise if `SECRET_KEY` is unset; drop the `'changeme'` DB-password default; regenerate with `secrets.token_hex(32)` if short.

### R3. No service supervision (tmux only) — was High — CLOSED (2026-06-18)
- **Original concern:** Flask and HSCDownloader ran as bare `python run.py` / `python HSCDownloader.py` inside tmux — no auto-restart on crash, and a reboot killed both (silent outage).
- **Why closed:** both now run as **user-level systemd** services (`~/.config/systemd/user/{flaskserver,hscdownloader}.service`) with `Restart=on-failure`; lingering is enabled so they start at boot. Verified `active`/`enabled`, `NRestarts=0`, `Linger=yes`, port 5000 listening, local/public `302`. (Tracked in detail under `serveraccess.md` #3 and `liveserver.md` #2.)
- **Residual (optional, Low):** still the Flask dev server, not gunicorn — see `09-deployment-and-operations.md`.

### R4. Chemical inventory unauthenticated — was High (audit CRITICAL) — CLOSED (2026-06-25)
- **Original concern:** every `/chem/*` route was open; anyone who could reach the server could read and modify the chemical inventory.
- **Why closed:** commit `f604818` gates the entire `/chem` blueprint behind a `before_request` token check. Access requires a signed link from the WordPress staff-tools page (`/chem/enter` validates an HMAC over the new `CHEM_SSO_SECRET`, time-limited by `exp`), which sets `session['chem_authed']`; everything else redirects to the staff-tools URL. Read and write routes alike are now gated. (Detail at #6.)
- **Verify:** logged out / no chem session → `GET /chem/inventory` and `POST /chem/remove` both 302 to the staff-tools URL.

### R5. Edit-container silently discarded several fields — was High — CLOSED (2026-06-30, commit `11fd3e4`)
- **Original concern:** `edit_container()` POSTed a form dict that `update_container()` read with **mismatched keys** — `expiry_date`→`expire`, `nmr_expiry`→`nmr_exp`, `storage_sublocation`→`storage_subloc` (all silently dropped) — and never wrote `catalog_number`, `physical_state`, `vendor_name`, or the real `description` (the `items` UPDATE clobbered `description` with the item name). The UI flashed "Updated successfully" regardless, so corrected expiry dates / vendors silently vanished — dangerous for a chemical-safety record. (Found in the later source audit; it was never a numbered item in this file.)
- **Why closed:** corrected the three key lookups; reworked the `items` update to keep-or-update `name`, `description`, `catalog_number`, `physical_state`, and to resolve a submitted `vendor_name` to `items.vendor_id` via the existing `_upsert(conn, "vendors", …)`. The blueprint now wraps `update_container` in try/except and flashes a real error instead of a false success.
- **Validated (2026-06-30):** ran the real `update_container` against an ephemeral Postgres seeded with a container — all seven previously-dropped fields persist, and blank form fields are preserved (keep-or-update). The dev reference (`documentation/UNanofabTools/flaskserver/06-service-layer-reference.md`, `update_container`) already described this intended behavior, so it now matches the code.

### R6. Production Duo 2FA was never configured (placeholder credentials) — was High — CLOSED (2026-07-07)
- **Symptom:** main-app login (tasks/machines) failed at the 2FA step with **no Duo push**; the flaskserver log showed `Duo authentication error: [Errno -3] Temporary failure in name resolution`.
- **Root cause:** `DUO_IKEY` / `DUO_SKEY` / `DUO_HOST` in the server `.env` were still the **template placeholders** (`your-duo-integration-key`, etc.), so `duo_client.Auth` tried to resolve a non-existent host. General DNS was fine — only the fake Duo host failed. (Corrects R1, which confirmed the 2FA *code path* runs in production but not that Duo could complete. Chem inventory was unaffected — it uses the WordPress SSO gate and skips Duo.)
- **Why closed:** installed the real Auth-API integration key / secret / API hostname from the Duo Admin Panel into `.env` and restarted flaskserver. Verified `https://<DUO_HOST>/auth/v2/ping` → `stat: OK` and login now pushes. (This is a `.env`/ops change — no source commit; the real values live only in the server `.env`.)

### R7. Machine / graph / log / admin templates were never committed (all routes 500'd) — was High — CLOSED (2026-07-08, commit `d7efcb9` + follow-up)
- **What was wrong:** `machine_data.html`, `graph.html`, `ald_graph.html`, `log_files.html`, `adminpanel.html` were referenced by the code but existed nowhere — not in git, not on the laptop, not on the live server → `TemplateNotFound` 500s. All 16 machine pages were down (`GET /ald` → `TemplateNotFound: machine_data.html`), plus the graph/log/admin routes.
- **Why closed:** rebuilt all five from scratch, extending `base.html` — tables from `csv_to_html_table`, Chart.js graphs via `generateLineGraph`, log-file listings, and an admin user table with JSON toggle/delete actions; each validated through real Jinja2. Committed + deployed (`machine_data.html` = `d7efcb9`; the other four in a follow-up). Machine, admin, and log pages all confirmed rendering live. **The site is now reproducible from git** — no more server-only files.
