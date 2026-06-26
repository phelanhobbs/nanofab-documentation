# Minimum Acceptable Full Path E - Module 18: Known Issues Triage

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-18-known-issues-triage.md

# Module 18 - Known Issues And Maintenance Triage

## Goal

The maintainer can turn known-issues files into a prioritized maintenance plan that separates Nanofab-actionable work from University IT tickets.

## Required Screen

SHOW:

- `known-issues/UNanofabTools/README.md` (repo path: known-issues/UNanofabTools/README.md)
- `known-issues/UNanofabTools/liveserver.md` (repo path: known-issues/UNanofabTools/liveserver.md)
- `known-issues/UNanofabTools/serveraccess.md` (repo path: known-issues/UNanofabTools/serveraccess.md)
- `known-issues/UNanofabTools/flaskserver.md` (repo path: known-issues/UNanofabTools/flaskserver.md)
- `known-issues/NanofabToolkit/README.md` (repo path: known-issues/NanofabToolkit/README.md)

## Verbatim Script

READ ALOUD:

"Known issues are the real maintenance queue. They are not separate from the handoff. A maintainer who ignores known issues will rediscover the same problems slowly and may fix lower-priority work first."

SHOW:

Open the UNanofabTools known-issues index.

READ ALOUD:

"The master known-issues index should summarize cross-cutting themes: secrets in source, tmux-only supervision, chemical inventory risks, personal-account dependencies, IT-bound items, and deprecated or historical code. High-severity issues should be visible here."

SHOW:

Open `liveserver.md`, `serveraccess.md`, and `flaskserver.md`.

READ ALOUD:

"These three files are the starting point for a real maintainer. Live server issues tell us what is fragile in production. Server access issues tell us what is fragile about getting in and inspecting safely. Flask server issues tell us what is risky in the application itself."

## Triage Exercise

DO:

Create a table in the notes file:

```md
| Issue | Severity | Owner | Evidence | Next Step | Due |
|---|---|---|---|---|---|
```

READ ALOUD:

"Every issue needs an owner category. Use `Nanofab-actionable`, `IT ticket`, or `needs evidence`. Do not put an IT-owned item into the Nanofab action list as if the app maintainer can just do it. Do not hide a Nanofab-owned issue behind IT if it is actually app code, docs, tmux/systemd migration, route hardening, or secret cleanup."

DO:

Build:

```md
## Next 7 Days
## Next 30 Days
## Next Quarter
## IT Tickets
## Evidence Still Missing
```

READ ALOUD:

"The first seven days should focus on reliability, recoverability, security, and evidence. The next thirty days can include larger fixes. The next quarter can include cleanup, refactors, and recurring audits. This prioritization prevents cosmetic work from displacing operational risk."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What are the top three Nanofab-actionable fixes? | Expected examples: move Flask/downloader toward supervised services, address app/security/secret risks, and fix high-severity Flask/chem/data freshness issues. The exact list should come from current known issues. |
| What are the top three IT tickets? | Expected examples: root-owned file/SSH items, UNIX account/service-account requests, backup/patching confirmation. The exact list should come from current IT-bound findings. |
| What evidence supports each top issue? | Known-issues entry, live-server snapshot, source code, audit output, or live command output. |
| Which issues should not be worked first? | Cosmetic refactors, deprecated legacy-server polish, broad rewrites, or small-tool cleanup before reliability/security/recoverability work. |
| What issue would you close only after live evidence? | Any live-server or backup/access/service-state issue that requires a new survey, command output, or IT confirmation. |
| How do you update docs after fixing an issue? | Update the relevant developer/layman docs, remove or close the known issue with evidence, refresh snapshots if needed, run the audit, and commit changes. |

REQUIRE:

The maintainer can produce a 7-day and 30-day maintenance plan with owners.

## Stop Point

STOP POINT:

Stop here until the maintainer has produced a written maintenance plan. Do not proceed to final operational scenarios without it.


# Expanded Module 18: Known Issues Triage

READ ALOUD:

This expanded section revisits Module 18, Known Issues Triage. The focus is maintenance plan, severity, evidence, owners, and IT tickets. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 18

READ ALOUD:

We are now doing the orientation pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention maintenance plan, severity, evidence, owners, and IT tickets. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 18

READ ALOUD:

We are now doing the evidence pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention maintenance plan, severity, evidence, owners, and IT tickets. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# UNanofabTools — Known Issues & Technical Debt

Private working list of bugs, gaps, security concerns, and tech debt for every tool in the repository. Kept deliberately outside the layman presentation and the successor documentation trees so the handoff materials stay clean — this is the to-do list for whoever maintains the code, not part of what gets handed to a new audience.

One file per tool, mirroring the per-tool folders in `../presentation/UNanofabTools/` and `../documentation/UNanofabTools/`.

## Files

| File | Tool | Highest-severity item |
|------|------|------------------------|
| `flaskserver.md` (repo path: known-issues/UNanofabTools/flaskserver.md) | The current Flask website | Chem-inventory schema drift (chem auth resolved 2026-06-25 — WordPress SSO gate) |
| `hscdownloader.md` (repo path: known-issues/UNanofabTools/hscdownloader.md) | CORES → HSCDATA ETL | CORES Bearer token de-sourced to `.env` (2026-06-22); **rotation still pending** |
| `picofirmware.md` (repo path: known-issues/UNanofabTools/picofirmware.md) | Raspberry Pi firmware *(older copies — canonical: `NanofabToolkit/PicoHelperTools`)* | WiFi credentials hard-coded; two unique scripts non-functional as written |
| `particlepctools.md` (repo path: known-issues/UNanofabTools/particlepctools.md) | Desktop particle viewer *(older copy — canonical: `NanofabToolkit/ParticleSensor`)* + test generator | Generator can accidentally target production |
| `filetransfer.md` (repo path: known-issues/UNanofabTools/filetransfer.md) | Per-machine log uploaders | Transfers depend on a personal SSH account |
| `dattools.md` (repo path: known-issues/UNanofabTools/dattools.md) | DATfixer + DATgrapher | Binary `.DAT` format parsed by magic bytes with no validation |
| `utilities.md` (repo path: known-issues/UNanofabTools/utilities.md) | Standalone helpers | `init_chem_db.py` doesn't build a complete chem database |
| `serveraccess.md` (repo path: known-issues/UNanofabTools/serveraccess.md) | SSH access + tmux sessions | tmux supervisor replaced by user-systemd (2026-06-18); shared `phelan` is a structural constraint (IT controls user creation); hard-coded IP |
| `liveserver.md` (repo path: known-issues/UNanofabTools/liveserver.md) | Findings from the live `nfhistory` surveys | Flask/downloader now under user-systemd (2026-06-18); chem Postgres verified local on `nfhistory`; a handful of IT-bound items (root `authorized_keys` mode, optional unattended-upgrades) |
| `hscdisplayerserver.md` (repo path: known-issues/UNanofabTools/hscdisplayerserver.md) | Legacy monolithic server | Run-in-parallel with the Flask app; deprecate and retire |

## How to use this folder

Each file lists items with severity (High / Medium / Low), a brief description, the risk, and a suggested fix — plus a priority order at the bottom. Nothing in these files has been changed in the code yet; they're recommendations, not changelogs.

For new items, or when rewriting an existing item before implementation, use this closeable format:

- **Owner:** Nanofab / University IT / CORES / facilities-network / mixed.
- **Evidence or reproduction:** exact source path, live snapshot, command output, UI workflow, or hardware observation that proves the issue exists.
- **Remediation:** what should change, including the file, config, ticket, or operational procedure.
- **Validation / proof of fix:** command, screenshot, test input/output, live check, or documentation diff that proves the item can be closed.
- **Dependencies:** required secret, live access, hardware, CORES change, or IT ticket.

Older items may still use a shorter `Where/Risk/Fix` format. Before closing one of those, add the missing owner/evidence/validation details so the next maintainer can audit the closure without asking the original author.

A few items recur across tools and may be worth treating as cross-cutting initiatives:

- **Secrets in source.** Hard-coded WiFi passwords (`picofirmware`), a CORES Bearer token (`hscdownloader`, now read from `.env` — **rotation still pending**), and Duo keys imported from a Python module (`hscdisplayerserver`) all belong in environment variables / a protected store, with the secrets themselves rotated.
- **The chem-database schema drift.** The committed `.sql` files are behind the live database; `init_chem_db.py` (in `utilities`) doesn't produce a complete database from scratch; the `flaskserver` issues list enumerates the missing columns/tables. Reconciling this is one project, not several.
- **Personal-account / individual-developer dependencies.** The `filetransfer` scripts log in as a personal CADE account; `fetch_ssh.py` in `utilities` is a personal dev tool. The Nanofab-side fix is a purpose-bound SSH key authenticating as the shared `phelan` server account (no IT involvement). A cleaner long-term fix — a dedicated UNIX service account — has to come from University IT, since the Nanofab team has `sudo` as `phelan` but cannot `useradd`.
- **The IT / Nanofab operational boundary.** Several findings (root SSH from `iceolate`, per-user UNIX accounts, the off-host backup, `unattended-upgrades`, kernel patching) sit on **University IT's** side of the line. The Nanofab admin's tools are `sudo` as `phelan` plus an IT ticket; nothing under `/root/` and no `useradd` is available. Each known-issues file tags items "Nanofab-actionable" vs "IT ticket" so the punch list is honest about who has to do what.
- **The legacy server.** `hscdisplayerserver` is documented for reference but should be retired in favor of the Flask app. Which server is live is settled by evidence: the 2026-06-01 survey shows the Flask app (`python run.py`) in production and no legacy process running — patch the Flask app. Re-confirm with each quarterly survey until the legacy code is removed.

Severity labels follow a shared convention: **High** = breaks functionality or is a real security exposure · **Medium** = correctness / maintainability problem · **Low** = cosmetic / cleanup. Items that depend on IT cooperation are tagged in-place so they don't muddy the Nanofab-side priority order.


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/flaskserver.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# UNanofabTools Server — Known Issues & Technical Debt

Private working list for Faith. This file is intentionally **separate** from the `documentation/` folder so the successor handoff docs stay clean. It records bugs, gaps, and tech debt found while reading the code, with severity and suggested fixes. Nothing here has been changed in the code — it's a to-do list.

Severity legend: **High** = breaks functionality or is a real security exposure · **Medium** = correctness/maintainability problem · **Low** = cosmetic/cleanup.

---

## Functional bugs

### 1. `GET /sensor-data` reads a directory that `POST /sensor-data` never writes — High
- **Where:** `app/blueprints/api.py` — `sensor_data_get` reads `LogData/sensors/<room>_<sensor>_combined.csv` via `_sensor_csv_path`, but `sensor_data_post` only writes to `LogData/particle_sensors/` (via `log_historical_particle_data`) and `LogData/env_sensors/`. Nothing writes to `LogData/sensors/`.
- **Effect:** `GET /sensor-data` returns 404 for every sensor, even ones actively posting via `/sensor-data`.
- **Fix options:** (a) point `_sensor_csv_path` at `particle_sensors/`; or (b) have `sensor_data_post` also append a combined CSV to `sensors/`. Option (b) preserves the intended "combined" semantics.

### 2. `suggest()` and `autofill()` are stubs — Medium
- **Where:** `app/services/chem_service.py` — `suggest(self, field, q, limit=10)` returns `[]`; `autofill(self, catalog="", name="")` returns `{}`.
- **Effect:** `/chem/api/suggest` always returns `{"results": []}` and `/chem/api/autofill` always returns `{"data": {}}`. The Add/Edit type-ahead and catalog auto-fill UI features are dead.
- **Fix:** implement `suggest` as a `SELECT DISTINCT <field> ... WHERE <field> ILIKE :q LIMIT :n` (whitelist `field` to valid column names to avoid injection via identifier), and `autofill` as a lookup by catalog number / name returning the item's vendor/state/size/etc.

### 3. `ParalyneReader` calls a non-existent endpoint — Low
- **Where:** `NanofabToolkit/ParalyneReader/src/ParalyneReader.py` — `return_selected()` GETs `/api/paralyne/analog/return/<filename>`, which the server does not implement.
- **Effect:** that client function errors if called (the live `list`/`download` paths work).
- **Fix:** either implement a `/return/<filename>` route or remove the dead client function.

---

## Schema drift (committed SQL behind the live database)

### 4. Runtime uses columns/tables not in the committed schema files — High
- **Where:** `chem_service.py` vs `chem_schema.sql` + `chem_schema_migration_v2.sql`.
- **Missing from committed SQL but used at runtime:**
  - `containers.last_scan_at` — set in `import_scans`; read by `search_inventory` and `get_inventory_scan_coverage`.
  - `inventory_cycles` extended columns: `filename`, `performed_by`, `report_name`, `location`, `total_scanned`, `matched_count`, `unmatched_count` — written by `import_scans`; read by `get_scan_reports`.
  - `scan_raw.barcode` and `container_scans.barcode` — written by `import_scans`.
  - The entire `transactions` table (`transaction_id`, `action`, `container_id`, `barcode`, `item_id`, `room_id`, `details` JSON, `performed_by`, `created_at`) — written by `log_transaction`; read by `get_transactions`.
- **Effect:** a database built only from the committed `.sql` files is missing these; chem add/scan/report/transaction features will error on a fresh deploy. Production works only because columns were added ad-hoc over time.
- **Fix:** write a `chem_schema_migration_v3.sql` (and fold into `chem_schema.sql`) that creates all of the above, so a fresh database matches production. Suggested DDL to reconcile:
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
  (Verify column types against the live DB before applying.)

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

1. #4 schema drift (write migrations so fresh deploys work) — High
2. #6 gate chem write routes behind login — High
3. #1 fix `/sensor-data` GET/POST mismatch — High
4. #2 implement `suggest`/`autofill` — Medium
5. #8 tighten CORS, #9 strengthen password reset — Medium
6. #11 escape CSV cells — Medium
7. #19 add a test suite — Medium
8. Cleanup batch: #13–#18, #20, #21 — Low

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


# Read-Aloud Documentation Corpus: known-issues/NanofabToolkit/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# NanofabToolkit — Known Issues & Technical Debt

Per-tool bug and tech-debt lists for `NanofabToolkit`. Separate from the layman presentations and the successor documentation trees so handoff materials stay clean.

One file per tool, mirroring the per-tool folders in `../presentation/NanofabToolkit/` and `../documentation/NanofabToolkit/`.

## Files

| File | Tool | Highest-severity item |
|------|------|------------------------|
| `ALDPeakCounter.md` (repo path: known-issues/NanofabToolkit/ALDPeakCounter.md) | ALD peak counter GUI | Duplicate peak-counter logic with UNanofabTools |
| `DentonDecoder.md` (repo path: known-issues/NanofabToolkit/DentonDecoder.md) | Denton `.dat`/CSV log viewer | Multi-day timestamp handling limited to one rollover |
| `ParalyneReader.md` (repo path: known-issues/NanofabToolkit/ParalyneReader.md) | Parylene file browser/viewer | Dead `return_selected` endpoint client; TLS verify disabled |
| `PreciousMetalReader.md` (repo path: known-issues/NanofabToolkit/PreciousMetalReader.md) | CORES precious-metal billing extractor | CORES creds: env-var preference added (2026-06-22), `auth.py` never committed; rollout + rotation deferred |
| `PicoHelperTools.md` (repo path: known-issues/NanofabToolkit/PicoHelperTools.md) | Pico firmware (canonical copies) | Cleartext WiFi credentials in source |
| `ParticleSensor.md` (repo path: known-issues/NanofabToolkit/ParticleSensor.md) | PyQt desktop viewer (canonical copy) | +7h timezone hack; duplicate `convert_to_mountain` in two modules |

## Recurring themes

A few items show up across more than one tool and are worth treating as cross-cutting initiatives:

- **Secrets and local credentials.** `PreciousMetalReader` now prefers the `CORES_TOKEN` env var (falling back to a local `auth.py`); `auth.py` was verified **never committed**, so there's no history leak — finishing the rollout (set the env var, delete `auth.py`, rebuild) and rotating the token are owner-deferred. `PicoHelperTools` firmware embeds WiFi credentials in cleartext. Same pattern as `UNanofabTools` — keep secrets out of source-controlled files.
- **Divergent copies of shared code.** The Pico firmware and the particle viewer each ship in both `NanofabToolkit/` and `UNanofabTools/`. The NanofabToolkit copies are now canonical (newer versions); the UNanofabTools docs point back here. Track cross-cutting fixes in this tree first.
- **PyInstaller builds undocumented.** All four desktop apps ship as Windows executables but the build commands aren't captured in repo READMEs. Add a one-page build note per tool.
- **No timeouts / retries on outbound HTTP.** `ParalyneReader` and `PreciousMetalReader` both call `requests.get` without `timeout=` and freeze the UI on slow servers. Standard fix.
- **No automated tests.** None of these tools has a test suite. A small mock-based contract test per tool would lock in the network/parsing behavior.

Severity follows the shared convention: **High** = breaks functionality or is a real security exposure · **Medium** = correctness / maintainability problem · **Low** = cosmetic / cleanup.

## Closeable issue format

For new items, or when rewriting an existing item before implementation, include:

- **Owner:** Nanofab / University IT / CORES / facilities-network / mixed.
- **Evidence or reproduction:** exact source path, sample input, command output, API response, UI workflow, or hardware observation.
- **Remediation:** what should change, including the file, config, credential storage, packaging step, or upstream ticket.
- **Validation / proof of fix:** command, screenshot, fixture output, packaged-app launch, mocked API test, or documentation diff that proves the item can be closed.
- **Dependencies:** required secret, live endpoint, sample file, Pico hardware, Windows build host, CORES change, or IT ticket.

Older items may still use a shorter `Where/Risk/Fix` format. Before closing one of those, add the missing owner/evidence/validation details so the next maintainer can audit the closure without asking the original author.

## See also

The sibling UNanofabTools issues list is at `known-issues/UNanofabTools/` (repo path: known-issues/UNanofabTools). Cross-cutting items (firmware credentials, divergent viewer copies, CORES token hygiene) appear in both lists with pointers between them.
