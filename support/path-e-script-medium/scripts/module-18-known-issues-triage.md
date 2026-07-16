# Medium Full Path E - Module 18: Known Issues Triage

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

## Source-code pass for Module 18

READ ALOUD:

We are now doing the source-code pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Live-state pass for Module 18

READ ALOUD:

We are now doing the live-state pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Failure-mode pass for Module 18

READ ALOUD:

We are now doing the failure-mode pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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
| `flaskserver.md` (repo path: known-issues/UNanofabTools/flaskserver.md) | The current Flask website | Top items resolved — chem auth (2026-06-25), chem schema drift (2026-06-29, `313e495`), edit-container data-loss (2026-06-30, `11fd3e4`), `GET /sensor-data` 404 (2026-07-01, `5cc5174`); **no High items open** — next: `suggest`/`autofill` stubs + CORS (Medium) |
| `hscdownloader.md` (repo path: known-issues/UNanofabTools/hscdownloader.md) | CORES → HSCDATA ETL | CORES Bearer token de-sourced (2026-06-22) + **rotated 2026-06-29** ✅ (old token now 403); next-highest open item: no staleness alerting (Medium) |
| `picofirmware.md` (repo path: known-issues/UNanofabTools/picofirmware.md) | Raspberry Pi firmware *(older copies — canonical: `NanofabToolkit/PicoHelperTools`)* | WiFi credentials hard-coded; two unique scripts non-functional as written |
| `particlepctools.md` (repo path: known-issues/UNanofabTools/particlepctools.md) | Desktop particle viewer *(older copy — canonical: `NanofabToolkit/ParticleSensor`)* + test generator | Generator can accidentally target production |
| `filetransfer.md` (repo path: known-issues/UNanofabTools/filetransfer.md) | Per-machine log uploaders | Transfers depend on a personal SSH account |
| `dattools.md` (repo path: known-issues/UNanofabTools/dattools.md) | DATfixer + DATgrapher | Binary `.DAT` format parsed by magic bytes with no validation |
| `utilities.md` (repo path: known-issues/UNanofabTools/utilities.md) | Standalone helpers | `init_chem_db.py` fully fixed ✅ — applies v1→v2→v3 (2026-06-29, `313e495`) + hardened SQL splitter (2026-06-30, `11fd3e4`); next: `gencert.py` writes an unencrypted TLS key (Medium) |
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

- **Secrets in source.** Still open: hard-coded WiFi passwords (`picofirmware`) and Duo keys imported from a Python module (`hscdisplayerserver`) — both belong in environment variables / a protected store, with the secrets rotated. **Resolved:** the CORES Bearer token (`hscdownloader`) was moved to `.env` (2026-06-22) and **rotated 2026-06-29** (old value now returns 403; an optional git-history scrub remains). Because the same CORES token is shared by `PreciousMetalReader`, that tool's local `auth.py` now holds the revoked value — finishing its env rollout is required to keep it working (see `known-issues/NanofabToolkit/PreciousMetalReader.md`).
- **The chem-database schema drift — ✅ resolved (2026-06-29, commit `313e495`).** `chem_schema_migration_v3.sql` reconciles the committed schema to the live database column-for-column (idempotent; `transactions.details` confirmed `TEXT`, not JSONB), and `init_chem_db.py` now applies `chem_schema.sql` → v2 → v3 so a fresh build matches production. The `.gitignore` was also fixed (`!chem_schema*.sql`) so the schema files are tracked. (This was the standing "one project, not several" item; the per-item detail is in `flaskserver.md` #4 and `utilities.md` #3.)
- **Personal-account / individual-developer dependencies.** The `filetransfer` scripts log in as a personal CADE account; `fetch_ssh.py` in `utilities` is a personal dev tool. The Nanofab-side fix is a purpose-bound SSH key authenticating as the shared `phelan` server account (no IT involvement). A cleaner long-term fix — a dedicated UNIX service account — has to come from University IT, since the Nanofab team has `sudo` as `phelan` but cannot `useradd`.
- **The IT / Nanofab operational boundary.** Several findings (root SSH from `iceolate`, per-user UNIX accounts, the off-host backup, `unattended-upgrades`, kernel patching) sit on **University IT's** side of the line. The Nanofab admin's tools are `sudo` as `phelan` plus an IT ticket; nothing under `/root/` and no `useradd` is available. Each known-issues file tags items "Nanofab-actionable" vs "IT ticket" so the punch list is honest about who has to do what.
- **The legacy server.** `hscdisplayerserver` is documented for reference but should be retired in favor of the Flask app. Which server is live is settled by evidence: the 2026-06-01 survey shows the Flask app (`python run.py`) in production and no legacy process running — patch the Flask app. Re-confirm with each quarterly survey until the legacy code is removed.

Severity labels follow a shared convention: **High** = breaks functionality or is a real security exposure · **Medium** = correctness / maintainability problem · **Low** = cosmetic / cleanup. Items that depend on IT cooperation are tagged in-place so they don't muddy the Nanofab-side priority order.


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/flaskserver.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# UNanofabTools Server — Known Issues & Technical Debt

Private working list for Faith. This file is intentionally **separate** from the `documentation/` folder so the successor handoff docs stay clean. It records bugs, gaps, and tech debt found while reading the code, with severity and suggested fixes. It's a to-do list; closed items are marked inline and/or moved to the ✅ Resolved / Closed section at the bottom.

Severity legend: **High** = breaks functionality or is a real security exposure · **Medium** = correctness/maintainability problem · **Low** = cosmetic/cleanup.

---

## Functional bugs

### 1. `GET /sensor-data` reads a directory that `POST /sensor-data` never writes — ✅ RESOLVED (2026-07-01, commit `5cc5174`; GET capped 2026-07-07, commit `8712b49`)
- **Was:** `sensor_data_get` read `LogData/sensors/<room>_<sensor>_combined.csv` via `_sensor_csv_path`, but `sensor_data_post` only wrote to `LogData/particle_sensors/` (via `log_historical_particle_data`) and `LogData/env_sensors/` — nothing wrote `LogData/sensors/`, so `GET /sensor-data` returned 404 for every sensor, even ones actively posting.
- **Resolution (Option b — preserves the intended "combined" semantics):** `sensor_data_post` now also appends the combined per-sensor CSV to `LogData/sensors/` via `_sensor_csv_path`, writing columns in `SENSOR_CSV_HEADER` order (commit `5cc5174`). A follow-up (commit `8712b49`) caps `GET /sensor-data` with an optional `?limit` (default 500 most-recent rows) so large histories don't return everything at once.
- **Validation:** POST a combined reading, then `GET /sensor-data?room_name=…&sensor_number=…` → 200 with the row(s).

### 2. `suggest()` and `autofill()` are stubs — ✅ RESOLVED (2026-07-13, commit `c3da4a2`)
- **Was:** `app/services/chem_service.py` — `suggest` returned `[]` and `autofill` returned `{}`, so the chem Add/Edit forms' name/vendor/location **type-ahead** and **catalog auto-fill** silently did nothing.
- **Resolution:** implemented `suggest(field, q, limit)` — `field` **whitelisted** to a fixed `(table, column)` map (identifier can't be injected), value matched case-insensitively (`ILIKE %q%`), `DISTINCT` + capped limit; and `autofill(catalog|name)` — looks up the item (by catalog #, else name), joins its vendor and its newest container, returns `{name, vendor, state, size, unit, system, catalog}` (empty values dropped). The front-end already called these endpoints, so no template change. **Validated (2026-07-13)** against an ephemeral Postgres (16 checks): substring suggestions across the whitelisted fields, a non-whitelisted `field` returns `[]` with no query built (injection-safe), autofill by catalog and by name, newest-container-wins, and no-match / no-input → `{}`.

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

### 10. Login timing oracle (username enumeration) — ✅ RESOLVED (2026-07-13, commit `8f048ed`)
- **Was:** `auth_service.verify_user_credentials` skipped bcrypt when the username was absent, so non-existent usernames responded measurably faster (enumeration).
- **Resolution:** it now always runs a bcrypt compare — against a precomputed `_DUMMY_PASSWORD_HASH` on the no-user path — so timing is equalized (validated: no-user 245 ms vs real-user 246 ms, was ~microseconds), and it's wrapped in try/except so a malformed stored hash can't 500 the login.

### 11. `csv_to_html_table` does not escape cell values — ✅ RESOLVED (2026-07-08, commit `f177140`)
- **Was:** `app/services/data_service.py` interpolated each header/data cell straight into `<th>/<td>` — if any machine CSV cell contained HTML/JS it rendered unescaped (stored XSS), mitigated only by trusting machine-generated CSVs.
- **Resolution:** every header/data cell now passes through `html.escape()` (validated: `<script>`, `<img onerror=…>`, and `& < >` all neutralized, table structure intact). The same commit also fixed the related **missing-CSV 500**: `render_machine_data` guards `os.path.exists(csv_file)` and renders a "No data available yet" page instead of 500'ing. Both became fully effective once the machine templates (R7) were restored.

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

### 15. Dead code: `chem_inventory_remote.py` — ✅ RESOLVED (2026-07-13, commit `8f048ed`)
- Near-duplicate `chem_bp` (524 lines) not registered anywhere; confirmed unimported and **removed** (`git rm`).

### 16. Empty model placeholder files — ✅ RESOLVED (2026-07-13, commit `8f048ed`)
- `app/models/session.py`, `task.py`, `user.py` were 0 bytes (real classes live in `app/models/__init__.py`); confirmed unimported and **removed** (`git rm`).

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

1. #8 tighten CORS, #9 strengthen password reset — Medium
2. #19 add a test suite — Medium
3. Cleanup batch: #13, #14, #17, #18, #20, #21 — Low

*(Resolved and removed from this list: #1 `/sensor-data` 404 — ✅ 2026-07-01 / 07-07, commits `5cc5174` + `8712b49`; #4 chem schema drift — ✅ 2026-06-29, commit `313e495`; #6 chem-inventory auth — ✅ 2026-06-25, commit `f604818`; #11 CSV-cell XSS — ✅ 2026-07-08, commit `f177140`. No High-severity items remain open.)*

---

## ✅ Resolved / Closed

Verified fixed or confirmed non-issues during the 2026-06-17/18 live checks. Move items here as they're closed.

### R1. Dev-mode auth bypass — was CRITICAL — CLOSED
- **Original concern:** if `FLASK_ENV` were unset/`development`, auth would skip Duo 2FA, `app.run(debug=True)` would expose the Werkzeug debugger, and `SESSION_COOKIE_SECURE` would be `False`.
- **Why closed:** the live `.env` sets `FLASK_ENV=production`, `DEBUG_MODE=False`, `SESSION_COOKIE_SECURE=True`; `load_dotenv()` runs before `run.py` reads `FLASK_ENV`, so `ProductionConfig` loads — Duo 2FA active, debugger off, cookies Secure (verified 2026-06-17).

### R2. Weak default `SECRET_KEY` — was High — CLOSED
- **Original concern:** `config.py` falls back to a public default, making session cookies forgeable if the env var is unset.
- **Why closed:** `SECRET_KEY` is present in the live `.env` (verified) — not the default.
- **Hardening now in place:** `ProductionConfig.init_app` **raises at startup if `SECRET_KEY` is unset or the public default** (fail-closed), and `run.py` defaults `FLASK_ENV` to `production`, so a fresh/misconfigured deploy can't silently run with a forgeable key or in dev mode. Residual (Low): the `'changeme'` DB-password default still exists in `config.py`.

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

### R8. Stored XSS in `csv_to_html_table` + machine pages 500 on a missing CSV — were Medium — CLOSED (2026-07-08, commit `f177140`)
- See #11 above (marked resolved in place). Every CSV cell now runs through `html.escape()`, and `render_machine_data` guards `os.path.exists(csv_file)` and renders a "No data available yet" page instead of 500'ing. Both effective once the machine templates (R7) were restored.

### R9. Parylene log page empty + graph blank — CLOSED (2026-07-08, commits `66b83f8` + `f83caed`)
- **Empty listing:** the route read `LogData/Paralyne/uploads`, but the data lives in `Paralyne/analog/` → datatype corrected to `analog`. Also hardened `sort_files_by_time` so a single unparseable filename no longer throws and returns `[]` (which had blanked the whole directory) — the bad file is kept and sorted last.
- **Blank graph:** `graph_file` chose the plot column by splitting the raw URL, which the `Desktop/Logs/` prefix shifted by one → no column matched → empty datasets → blank chart. It now derives machine/type from the path **relative to** `log_dir`. And the Parylene column was hardcoded `'Vacuum pressure'` while the real CSV header is `timestamp,pressure,vapor,temp` → now plots `pressure`/`vapor`/`temp` (validated against the real format). Listing, download, and chart all confirmed working live.

### R10. `suggest()` / `autofill()` were dead stubs (no chem type-ahead) — was Medium — CLOSED (2026-07-13, commit `c3da4a2`)
- See #2 above (marked resolved in place). `suggest` is now a whitelisted-field `ILIKE` DISTINCT query (injection-safe) and `autofill` looks up an item by catalog #/name and returns its vendor/state/size/etc.; validated against an ephemeral Postgres (16 checks). No template change — the front-end already called the endpoints.

### R11. Small safe-fixes batch — CLOSED (2026-07-13, commit `8f048ed`)
- **`sds_analog` exact Content-Type (new finding):** the Parylene batch upload accepted only a bare `text/csv`; it now normalizes `content_type.split(';')[0].strip().lower() == 'text/csv'`, so `text/csv; charset=utf-8` (and any casing) is accepted and a client/library adding a charset can't 400 it. Validated across 8 header variants.
- **#10 login-timing / username enumeration** — resolved in place above (dummy bcrypt compare on the no-user path).
- **#15 dead `chem_inventory_remote.py` blueprint** and **#16 empty model placeholders** — confirmed unimported and removed (`git rm`); resolved in place above.
- Deployed 2026-07-13.


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
| `PreciousMetalReader.md` (repo path: known-issues/NanofabToolkit/PreciousMetalReader.md) | CORES precious-metal billing extractor | CORES creds: env-var preference added (2026-06-22); shared CORES token **rotated 2026-06-29** → local `auth.py` now 403, so the env rollout is **now required** to restore the tool (`auth.py` never committed) |
| `PicoHelperTools.md` (repo path: known-issues/NanofabToolkit/PicoHelperTools.md) | Pico firmware (canonical copies) | Cleartext WiFi credentials in source |
| `ParticleSensor.md` (repo path: known-issues/NanofabToolkit/ParticleSensor.md) | PyQt desktop viewer (canonical copy) | +7h timezone hack; duplicate `convert_to_mountain` in two modules |

## Recurring themes

A few items show up across more than one tool and are worth treating as cross-cutting initiatives:

- **Secrets and local credentials.** `PreciousMetalReader` now prefers the `CORES_TOKEN` env var (falling back to a local `auth.py`); `auth.py` was verified **never committed**, so there's no history leak. The shared CORES token was **rotated 2026-06-29** (see `UNanofabTools/hscdownloader`), which revoked the value in each machine's local `auth.py` (now 403) — so finishing the rollout (set the new `CORES_TOKEN`, delete `auth.py`, rebuild the `.exe`) is **now required** to keep the tool working, not optional. `PicoHelperTools` firmware embeds WiFi credentials in cleartext. Same pattern as `UNanofabTools` — keep secrets out of source-controlled files.
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


# Read-Aloud Documentation Corpus: known-issues/NanofabToolkit/ALDPeakCounter.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# ALDPeakCounter — Known Issues & Technical Debt

Working list for `NanofabToolkit/ALDPeakCounter`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Duplicate `peakCount.py` with UNanofabTools — Medium
- **Where:** `src/peakCount.py` here is essentially the same as `UNanofabTools/peakCount.py`.
- **Risk:** fixes/algorithm tweaks must land in both; they will drift.
- **Fix:** make one copy canonical (or extract a shared package) and import from there.

### 2. Hard-coded tab-delimited input format — Medium
- **Where:** `count_peaks` parses lines with `line.split('\t')` and skips the first row as a header.
- **Risk:** comma-separated files (or files with no header) silently produce zero/garbage results; users get no clear error.
- **Fix:** detect the delimiter (csv sniffer), or document the expected format up front and validate the first row.

### 3. `Min Distance` is in samples, not seconds — Low (UX)
- **Where:** GUI label `"Min Distance:"`.
- **Risk:** users assume seconds and set tiny / huge values that don't behave as expected.
- **Fix:** label it `"Min Distance (samples)"` and/or expose seconds with a conversion.

### 4. Custom click-drag box zoom — Low
- **Where:** `on_mouse_press/release/move` + `apply_zoom`.
- **Risk:** missing pan/save/back-to-home affordances; minor visual artifacts (no rubber-band rectangle while dragging).
- **Fix:** drop in matplotlib's `NavigationToolbar2Tk` for standard zoom/pan/home/save.

### 5. End-peak heuristic is untested — Low
- **Where:** the "add a peak at the end" rule in `count_peaks` (same as UNanofabTools issue #8 for that copy).
- **Fix:** unit tests covering rising / plateau / elevated end cases.

### 6. No file-format validation feedback — Low
- **Where:** if a selected file lacks the expected columns, `count_peaks` quietly returns zero peaks.
- **Fix:** surface a per-file warning in the results panel when no valid time/pressure rows were found.

### 7. PyInstaller hook/build details aren't versioned with the GUI — Low
- **Where:** `src/hook-matplotlib.py`.
- **Note:** consider documenting the build command in the repo README so a successor can rebuild the executable.

---

## Suggested priority order
1. #1 de-duplicate `peakCount.py` between repos — Medium
2. #2 input-format detection / validation — Medium
3. #3 label `Min Distance` clearly — Low (cheap)
4. #4, #5, #6, #7 — Low


# Read-Aloud Documentation Corpus: known-issues/NanofabToolkit/DentonDecoder.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# DentonDecoder — Known Issues & Technical Debt

Working list for `NanofabToolkit/DentonDecoder`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Multi-day handling is limited to one midnight rollover — Medium
- **Where:** `DentonGrapher.create_graph` — `if time_delta < 0: time_delta += 24*60*60`.
- **Risk:** runs spanning more than one full day, or multiple midnight crossings, produce incorrect time axes.
- **Fix:** carry the date alongside the time (or use the file's modification date as a base) so multi-day runs work.

### 2. ASCII-replace decode masks bad data — Low
- **Where:** `open(input_file, 'r', errors='replace')`.
- **Risk:** stray non-ASCII bytes silently become replacement chars; a corrupted CSV can render without warning.
- **Fix:** open as UTF-8 (or auto-detect); log a warning when replacements occur.

### 3. Unusual `plt.figure` + `plt.gca()` pattern — Low
- **Where:** `fig, ax = plt.figure(figsize=(10, 6)), plt.gca()`.
- **Risk:** correctness depends on `plt.figure` having set the current figure; clearer with `plt.subplots`.
- **Fix:** replace with `fig, ax = plt.subplots(figsize=(10, 6))`.

### 4. Hard-coded default column `"Chamber Pressure (Torr)"` — Low
- **Where:** `create_graph` default arg.
- **Risk:** a Denton software/firmware update could rename the column; CLI usage without overriding would silently fail (and print available columns).
- **Fix:** keep the default for convenience, but ensure the GUI's column dropdown always drives the call rather than relying on the default.

### 5. Easily confused with UNanofabTools' DAT tools — Low (UX)
- **Where:** name and audience overlap with `UNanofabTools/dattools`; both workflows can involve Denton `.dat` files, but DentonDecoder is a GUI converter/viewer while DATfixer/DATgrapher are command-line cleaning and pressure-plot tools.
- **Risk:** users (or future maintainers) pick the wrong workflow or assume fixes in one tool affect the other.
- **Fix:** make the distinction explicit in the app title/About: "Denton GUI converter/viewer; DATfixer/DATgrapher are command-line pressure-log tools."

### 6. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** a small fixture CSV with known timestamps/values + a parsing test would lock in the time/value extraction and the midnight patch.

### 7. PyInstaller spec/build steps undocumented — Low
- **Where:** `pyinstaller/hooks/hook-runtime.py` exists, but the build command isn't in the repo README.
- **Fix:** document the PyInstaller build (entry point, hook path, asset inclusion) so a successor can rebuild the .exe.

---

## Suggested priority order
1. #1 multi-day timestamp handling — Medium
2. #6 add tests around the CSV parser — Medium
3. #5 make the dattools distinction obvious — Low (UX)
4. #2, #3, #4, #7 — Low


# Read-Aloud Documentation Corpus: known-issues/NanofabToolkit/ParalyneReader.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# ParalyneReader — Known Issues & Technical Debt

Working list for `NanofabToolkit/ParalyneReader`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = correctness/security · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. `return_selected` calls a non-existent server endpoint — Medium
- **Where:** `src/ParalyneReader.py` GETs `/api/paralyne/analog/return/<filename>`.
- **Risk:** any code path that uses it errors at runtime; the function is effectively dead code that misleads readers.
- **Fix:** implement `/return/<filename>` server-side (if needed), or remove the client function.

### 2. Certificate validation disabled (`verify=False`) — Medium
- **Where:** all `requests.get(...)` calls in `ParalyneReader.py`.
- **Risk:** standard internal-cert tradeoff (encrypted but unverified). On the internal network this is acceptable; off-network it's not.
- **Fix:** install the internal CA into the executable's trust store; re-enable verification.

### 3. Downloads land in the current working directory — Medium
- **Where:** `download_file(filename)` uses `os.path.abspath(filename)`.
- **Risk:** when run as a frozen executable, files drop next to the `.exe`; users lose track of them, and the folder may be read-only.
- **Fix:** default to a `Downloads/` subfolder; make the destination configurable.

### 4. No timeout / retry on API calls — Medium
- **Where:** `requests.get(...)` without `timeout`.
- **Risk:** a hung server makes the app appear frozen; first request after sleep can fail with no recovery.
- **Fix:** add `timeout=` and a simple retry-with-backoff for `list_files`/`download_file`.

### 5. Errors raise generic `Exception` — Low
- **Where:** `raise Exception(f"Error ...")` patterns.
- **Fix:** define a small custom exception (`ParalyneAPIError`) so callers can handle it specifically.

### 6. PyInstaller build steps undocumented — Low
- **Where:** packaging artifacts present, but no captured spec/command.
- **Fix:** add a one-page build note to the README so a successor can rebuild the .exe.

### 7. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** add tests that mock the HTTP responses to lock in the API contract and the filename/path handling.

### 8. `urllib3.disable_warnings()` globally suppresses noise — Low
- **Where:** module-level call.
- **Risk:** hides legitimate warnings unrelated to the internal cert.
- **Fix:** scope the suppression to the internal hostname, or remove once verification is restored (#2).

---

## Suggested priority order
1. #2 + #1 align with the server: re-enable TLS verify; drop the dead `return_selected` (or implement the endpoint) — Medium
2. #4 timeouts + retries — Medium
3. #3 configurable download directory — Medium
4. #7 add tests — Medium
5. #5, #6, #8 — Low


# Read-Aloud Documentation Corpus: known-issues/NanofabToolkit/PreciousMetalReader.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# PreciousMetalReader — Known Issues & Technical Debt

Working list for `NanofabToolkit/PreciousMetalReader`. Separate from the successor docs. Mostly recommendations; where code or credentials have already changed it's noted inline.

Severity: **High** = security/correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. CORES Bearer token via local `auth.py` — High *(token rotated 2026-06-29 → local `auth.py` value now 403; rollout required to restore the tool)*
- **Status:** ✅ *env-var preference added 2026-06-22* — `RetrieveMonthsMetals.py` prefers the `CORES_TOKEN` environment variable (`HSCCode = 'Bearer ' + os.environ['CORES_TOKEN']`), falling back to the legacy local `auth.py` only if it's unset. ⚠️ **Now required (was owner-deferred):** the shared CORES token was **rotated 2026-06-29** (see `known-issues/UNanofabTools/hscdownloader.md` #1), so the value baked into each machine's local `auth.py` is now **revoked (403)** — the tool will fail to download until operators set the new `CORES_TOKEN`, rebuild the `.exe`, and delete `auth.py`. `auth.py` was verified **never committed** (`git log -- '*auth.py'`), so there is no git-history leak (unlike the HSCDownloader token).
- **Where:** `from auth import HSCCode` fallback in `RetrieveMonthsMetals.py`, used as the `Authorization` header; `src/auth.py` is gitignored and local-only.
- **Risk:** until the new token is rolled out, **the tool is non-functional** (CORES returns 403 to the old `auth.py` value); the credential also still lives in a loose local `auth.py` on each machine. The setup contract must be documented so a successor can run it.
- **Fix (remaining):** on each machine, set `CORES_TOKEN` to the **new** token, delete the local `auth.py`, and rebuild the `.exe`; document the `CORES_TOKEN` env var in the README. The shared CORES token has already been rotated (see `known-issues/UNanofabTools/hscdownloader.md` #1), so this rollout is what restores the tool.

### 2. Hard-coded service-ID list — Medium
- **Where:** the embedded list (`[768, 808, 809, ..., 818]`) inside `download_Metal("all", ...)`.
- **Risk:** if CORES renumbers a service, the corresponding metal silently goes missing from "all" downloads; the mapping is undocumented.
- **Fix:** lift this into a documented machine → metal → service_id table; validate IDs on startup.

### 3. No request timeout / retry — Medium
- **Where:** `requests.get(constructedURL, headers=header)` (no `timeout`).
- **Risk:** a slow or unreachable CORES freezes the UI; "all" mode could hang for minutes per endpoint with no recovery.
- **Fix:** add `timeout=` and a brief retry-with-backoff; report per-endpoint failures rather than aborting.

### 4. UI freezes during downloads — Medium
- **Where:** `download_Metal` runs synchronously on the Tk main thread.
- **Risk:** the window appears unresponsive (especially in "all" mode where ~12 endpoints are pulled).
- **Fix:** move downloads to a worker thread (cf. `ParalyneReader`) and post progress back to the UI.

### 5. Errors swallowed at endpoint granularity — Low/Medium
- **Where:** in "all" mode, individual endpoints are skipped if `status_code != 200`, but the user may not see which ones failed.
- **Fix:** collect per-endpoint statuses and present them at the end of the run.

### 6. Hard-coded month/year handling — Low
- **Where:** `daysinMonth` and the date-string building use plain integers without validation; an invalid year string would crash.
- **Fix:** validate user-entered year; clamp to a sensible range.

### 7. Frozen vs. dev path logic is fragile — Low
- **Where:** `download_Metal` walks three `dirname` levels to find the project dir in dev mode.
- **Risk:** breaks if the file is moved or the project is re-laid out.
- **Fix:** pass a project root explicitly (env var / settings), or use `pathlib.Path(__file__).resolve()` with a clear anchor.

### 8. Independent of the cleanroom server — Low (context)
- **Note:** this app talks to CORES, not to `nfhistory.nanofab.utah.edu`. Easy to miss; a successor may waste time looking for the API on our server.

### 9. PyInstaller build steps undocumented — Low
- **Where:** packaging artifacts present; no captured spec/command.
- **Fix:** add a one-page build note to the README.

### 10. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** mock-based tests around `download_Metal` (request shape, response parsing) and `summarize_metal_charges`.

---

## Suggested priority order
1. #1 **finish the CORES env rollout — now required** (token rotated 2026-06-29; set the new `CORES_TOKEN`, delete `auth.py`, rebuild the `.exe`) — High; then #2 centralize service IDs — Medium
2. #3 + #4 timeouts, retries, and a worker-thread download path — Medium
3. #10 + #5 add tests and surface per-endpoint failure detail — Medium
4. #6, #7, #8, #9 — Low


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/dattools.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# DAT Tools — Known Issues & Technical Debt

Private working list for `DATfixer.py` and `DATgrapher.py`. Kept separate from the successor documentation so the handoff stays clean. Nothing here has been changed in the code — it's a to-do list.

Severity: **High** = breaks functionality / data correctness · **Medium** = maintainability or robustness · **Low** = cleanup.

---

### 1. Graphing logic is duplicated across both files — Medium
- **Where:** `DATfixer.py` `create_graph` block (§3.4) and `DATgrapher.py` `create_pressure_graph` are near-identical (same time/pressure regexes, same base-time + midnight logic, same matplotlib calls).
- **Risk:** fixes/improvements must be made in two places; they will drift.
- **Fix:** extract a shared `plot_pressure(times, pressures, ...)` (and the line-parsing) into one module imported by both.

### 2. Binary format is hard-coded magic bytes with no validation — High
- **Where:** `DATfixer.py` — `0x05 0x00` + 8-byte double, and `0x08 0x00 0xXX 0x00` delimiter.
- **Risk:** if Denton firmware changes the log format, decoding silently produces garbage with no error. There's no signature/version check that the input is even a Denton `.DAT`.
- **Fix:** validate a known header/signature before decoding; fail fast with a clear message; consider documenting the format spec.

### 3. `plt.show()` blocks and needs a display — Medium
- **Where:** `DATgrapher.py` (`show_graph=True` default); also `DATfixer --graph` uses matplotlib.
- **Risk:** on a headless machine (no GUI), this errors or hangs.
- **Fix:** call `matplotlib.use("Agg")` when not displaying; document that interactive display needs a desktop session.

### 4. ASCII-only decode can corrupt data — Medium
- **Where:** both tools use `decode('ascii', errors='replace')`.
- **Risk:** any non-ASCII byte becomes a replacement char, which can mangle a line and throw off downstream parsing.
- **Fix:** consider latin-1 (lossless byte→char) for the text pass, or handle bytes directly.

### 5. Midnight/multi-day handling is a hack — Medium
- **Where:** both tools — timestamps are parsed as `%H:%M:%S` (no date); a single `+24h` correction patches one rollover.
- **Risk:** runs longer than 24h, or crossing more than one midnight, produce wrong time axes.
- **Fix:** carry the date if available, or detect multiple rollovers.

### 6. Comma-insertion tokenizer is heuristic and complex — Low/Medium
- **Where:** `DATfixer.py` `add_commas` block.
- **Risk:** edge cases can place commas oddly; the logic is hard to follow and untested.
- **Fix:** add unit tests with representative lines; simplify if possible.

### 7. "First bracketed value is pressure" assumption — Low
- **Where:** both graphers take the first `[...]` per line as pressure.
- **Risk:** if a line ever contains another bracketed value first, the wrong number is plotted.
- **Fix:** tag the pressure value explicitly during decode, or anchor the regex to its expected position.

### 8. `numpy` imported but effectively unused — Low
- **Where:** both files `import numpy as np` but do no real numpy work.
- **Fix:** drop the dependency, or use it where it would actually help.

### 9. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** add a tiny fixture `.DAT` with known measurements and a golden cleaned-text/graph output to lock in the decode and parsing.

---

## Suggested priority order
1. #2 format validation (prevents silent garbage) — High
2. #1 de-duplicate graphing — Medium
3. #3 headless-safe plotting — Medium
4. #9 add tests around the binary decode — Medium
5. Cleanup: #4, #5, #6, #7, #8 — Low/Medium


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/utilities.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Utilities — Known Issues & Technical Debt

Working list for the standalone helper scripts. Separate from the successor docs. Closed items are marked inline.

Severity: **High** = security / broken · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. `gencert.py` writes an unencrypted private key — Medium (security)
- **Where:** `key.private_bytes(..., encryption_algorithm=NoEncryption())`.
- **Risk:** the TLS private key sits on disk unprotected; if read, the cert can be impersonated.
- **Note/Fix:** this matches the nginx/standalone-TLS expectation, so encrypting it would require server-config changes. At minimum, lock down filesystem permissions and document where the key lives.

### 2. `gencert.py` has hard-coded Windows paths + unused imports — Low
- **Where:** input `.pfx` path and output `.pem` paths are literals; `http.server` imports are unused.
- **Fix:** take paths as arguments / read the PFX password from the environment; remove the dead HTTP-server import.

### 3. `init_chem_db.py` only applies the v1 schema — ✅ RESOLVED (2026-06-29, commit `313e495`)
- **Was:** the script ran `chem_schema.sql` (v1) only, so a fresh chem database was missing the v2 migration and the v3 runtime-only objects (`containers.last_scan_at`, extended `inventory_cycles` columns, `scan_raw.barcode`, `container_scans.barcode`, the `transactions` table). Chem add/scan/report/transaction features would error on a clean install while the success message claimed the DB was ready.
- **Resolution (commit `313e495`):** rewrote it around an `apply_sql_file()` helper that applies `chem_schema.sql` → `chem_schema_migration_v2.sql` → `chem_schema_migration_v3.sql` in order (the migrations are idempotent, so re-running is safe). Validated: the full v1→v2→v3 sequence on an empty Postgres reproduces the production chem tables (cols + types). See `known-issues/UNanofabTools/flaskserver.md` #4 for the matching schema reconciliation. (The naive `;`-split nit — #4 below — was also hardened in commit `11fd3e4`.)

### 4. `init_chem_db.py` naive statement splitting — ✅ RESOLVED (2026-06-30, commit `11fd3e4`)
- **Was:** split the SQL on `;` and skipped `BEGIN`/`COMMIT` — fragile if a statement contained a semicolon inside a `--` comment (the chem schema had none, so it worked, but it was brittle).
- **Resolution:** the splitter now strips `--` line comments before splitting on `;` (still skipping `BEGIN`/`COMMIT`), so a semicolon inside a comment can't terminate a statement. A `;` inside a string literal / function body would still need care, but the chem schema has none.

### 5. `fetch_ssh.py` uses AutoAddPolicy and hard-coded identity — Medium
- **Where:** `set_missing_host_key_policy(AutoAddPolicy())`; hard-coded `phelanh`/`phelan`, jump host, and key path.
- **Risk:** auto-accepting unknown host keys is unsafe for anything automated; personal credentials make it non-portable.
- **Fix:** keep it strictly as a personal dev tool, or replace with a documented `scp`/CI step using verified host keys.

### 6. `fetch_ssh.py` produces the confusing `chem_inventory_remote.py` artifacts — Low
- **Where:** writes output to `chem_inventory_remote.py`; an empty file by that name and a dead blueprint copy exist in the tree.
- **Risk:** maintainers confuse the fetched copy / dead blueprint with live code.
- **Fix:** write to a clearly-named scratch path (e.g. `_fetched/`); delete the dead artifacts.

### 7. `NMonStore.py` is an unfinished stub — Medium
- **Where:** the whole file — counts to 5, writes to `VOLTDATA.txt`, `# Your code logic goes here`.
- **Risk:** dead/placeholder code in the repo; unclear intent.
- **Fix:** finish it (define the real monitor data source/format) or delete it.

### 8. `peakCount.py` end-peak heuristic is untested — Low/Medium
- **Where:** the custom "add a peak at the end" logic.
- **Risk:** heuristic thresholds (1% plateau tolerance, 5% elevation) may over/under-count on unusual data; no tests.
- **Fix:** add tests with known peak counts; document the heuristic's assumptions.

### 9. Overlapping pressure-file parsing — Low
- **Where:** `peakCount.py`, the DAT graphers, and the NanofabToolkit ALD counter all parse pressure/time files slightly differently.
- **Fix:** consider a shared parsing helper to avoid divergent behavior.

---

## Suggested priority order
1. #1 protect the TLS private key — Medium (security)
2. #7 resolve the `NMonStore.py` stub — Medium
3. #5 tighten / scope `fetch_ssh.py` — Medium
4. #2, #6, #8, #9 cleanup — Low

*(Resolved: #3 `init_chem_db.py` completeness — ✅ 2026-06-29, commit `313e495`; #4 SQL-splitter fragility — ✅ 2026-06-30, commit `11fd3e4`.)*
