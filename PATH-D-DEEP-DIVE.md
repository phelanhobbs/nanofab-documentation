# Path D Deep Dive - Long-Term Maintainer Playbook

This is the no-human-context path.

Use it when the maintainer is not just trying to understand the system, but must own it, audit it, extend it, recover it, or decide what to fix next without contacting Faith.

Path C is a reading path. Path D is an evidence path. Do not just read the docs. Confirm the docs against the source repos, the live server, the current known-issues files, and the operational boundary with University IT.

If Faith is presenting this path live with the slide decks on a screen, use [SUPER-IN-DEPTH-PRESENTER-GUIDE.md](SUPER-IN-DEPTH-PRESENTER-GUIDE.md) as the speaker script.

## What Path D Is For

Use Path D when any of these are true:

- Faith is unavailable.
- The system is going to change materially.
- A new maintainer needs to become the long-term owner.
- The docs may be stale and need to be revalidated.
- The live server has drifted from the documented deployment.
- Management needs a maintenance plan, not just a handoff.
- You need to decide what to fix, what to leave alone, and what requires IT.

Do not use Path D for a quick overview. Use Path A, B, or C for that.

## Expected Time

Budget 1-2 focused weeks.

Minimum useful pass:

- 2-3 days if you already have server access, know Flask, and only need a drift check.

Full ownership pass:

- 1 week for a technically strong maintainer.
- 2 weeks if access setup, source recovery, local environment setup, and IT boundary cleanup all have to happen at the same time.

Repeat cadence:

- Quarterly for a maintenance audit.
- Immediately after major deployment, schema, access, or infrastructure changes.
- Immediately after an outage or suspected data-integrity issue.

## Final Outputs

Path D is complete only when these artifacts exist and are current:

- A current live-server survey snapshot under `documentation/UNanofabTools/liveserver/snapshots/`.
- A doc/code drift report listing every mismatch found, even if already fixed.
- An updated `known-issues/` tree with obsolete items removed and new findings added.
- A maintenance plan with next 7 days, next 30 days, and next quarter.
- A list of Nanofab-actionable items vs University IT tickets.
- A short decision log recording the assumptions the next maintainer should inherit.
- A clean git status in the documentation repo after edits are committed.

Do not declare Path D done because you finished reading. It is done when the next maintainer can recover, operate, and change the system using written evidence.

## Source Of Truth Order

When two things disagree, use this order:

1. Live production state observed directly on `nfhistory`.
2. Current source code in the active production checkout.
3. Current source code in the canonical Git repos.
4. Database schemas, migrations, and live database introspection.
5. Current developer documentation.
6. Current layman documentation and slides.
7. Historical snapshots.
8. Memory, assumptions, old chat notes, or "what someone remembers."

If a lower source disagrees with a higher source, update the lower source or write a known-issues item explaining why it is intentionally different.

## Required Workspace Shape

This GitHub repository is the documentation bundle. It intentionally does not include the application source trees.

For a real Path D audit, arrange the working directory like this:

```text
work/
  nanofab-documentation/
  UNanofabTools/
  NanofabToolkit/
```

The source repos may already exist locally. If they do not, recover `UNanofabTools` from GitHub, the handoff archive, or the production server checkout at `/home/phelan/server/UNanofabTools/`. Recover `NanofabToolkit` from GitHub, the handoff archive, or another preserved source copy.

Do not continue into source-code verification until you have the source repos. If the source repos cannot be found, make that the first high-severity finding: the docs are not enough to maintain the system safely without source.

## Non-Negotiable Facts To Preserve

These facts are load-bearing. Every doc, slide, issue file, and runbook should be consistent with them unless the live system has changed and the change is documented.

| Fact | Why it matters |
|------|----------------|
| The live Flask app install path is `/home/phelan/server/UNanofabTools/`. | Recovery commands and survey scripts must use the real production path. |
| `HSCDownloader.py` lives in the same install directory as `run.py`. | There is no separate production `~/HSCDownloader/` checkout to restart. |
| The chem PostgreSQL database is local to `nfhistory` on `127.0.0.1:5432`. | Architecture, backup, restore, and firewall assumptions depend on this. |
| The Flask app and HSCDownloader currently run in tmux sessions, not systemd. | This is the top Nanofab-owned reliability risk. |
| University IT owns the VM, root, root SSH, base patching, and off-box backups. | Do not assign IT-owned fixes to the Nanofab maintainer. |
| The Nanofab maintainer has `sudo` as `phelan`, not root, and cannot create UNIX users. | Per-user UNIX accounts and root-owned changes are IT tickets. |
| Nanofab owns the Flask app, HSCDownloader, local chem DB, data trees, and `/home/phelan/`. | These are the areas the maintainer can actually fix. |
| `NanofabToolkit` is canonical for PicoHelperTools and ParticleSensor. | Do not patch older copies in `UNanofabTools` unless preserving history. |
| `hscdisplayerserver` is deprecated. | Do not spend major effort improving it unless the live deployment has reverted. |

## Phase 0 - Prepare The Audit

Goal: start from a clean, reproducible workspace.

### Inputs

- This documentation repo.
- The `UNanofabTools` source repo.
- The `NanofabToolkit` source repo.
- Access to `nfhistory`, or a recorded reason why access is unavailable.
- Permission boundaries: Nanofab vs University IT.

### Actions

1. Confirm the docs repo branch:

   ```sh
   cd nanofab-documentation
   git status --short --branch
   git branch -vv
   ```

2. Confirm source repo state:

   ```sh
   git -C ../UNanofabTools status --short --branch
   git -C ../UNanofabTools remote -v
   git -C ../UNanofabTools log -1 --oneline

   git -C ../NanofabToolkit status --short --branch
   git -C ../NanofabToolkit remote -v
   git -C ../NanofabToolkit log -1 --oneline
   ```

3. If any repo is dirty, decide whether the dirty changes belong to the audit. Do not overwrite them. Record:

   - repo
   - branch
   - commit
   - dirty files
   - whether the changes are yours, another maintainer's, or unknown

4. Create an audit notes file outside the committed docs first:

   ```sh
   mkdir -p /tmp/nanofab-path-d
   touch /tmp/nanofab-path-d/audit-notes.md
   ```

5. Use this header:

   ```md
   # Path D Audit Notes - YYYY-MM-DD

   ## Repos
   - nanofab-documentation:
   - UNanofabTools:
   - NanofabToolkit:

   ## Live Server Access
   - Access available:
   - User used:
   - Survey snapshot:

   ## Findings
   - None yet.
   ```

### Exit Criteria

- You know which branch and commit each repo is on.
- You know whether local dirty work exists.
- You know whether you have live server access.
- You have an evidence log started.

## Phase 1 - Build The System Map

Goal: understand the whole system before touching implementation details.

### Read First

1. `START-HERE.md`
2. `README.md`
3. `REDACTION-NOTE.md`
4. `presentation/UNanofabTools/README.md`
5. `documentation/UNanofabTools/README.md`
6. `known-issues/UNanofabTools/README.md`
7. `presentation/NanofabToolkit/README.md`
8. `documentation/NanofabToolkit/README.md`
9. `known-issues/NanofabToolkit/README.md`

### Write Down

Create a one-page system map with these headings:

- Public website and users.
- Flask app.
- Authentication and Duo.
- SQLite databases.
- Chem PostgreSQL database.
- HSCDownloader and CORES data.
- File-transfer scripts from tool PCs.
- Pico sensor firmware.
- ParticleSensor desktop viewer.
- Other desktop tools.
- Deprecated legacy server.
- University IT-owned infrastructure.
- Nanofab-owned operational surface.

### Questions You Must Be Able To Answer

- What does `nfhistory` provide to cleanroom users?
- Which data comes from CORES?
- Which data comes from machine control PCs?
- Which data comes from Pico devices?
- Which databases are SQLite?
- Which database is PostgreSQL?
- Which parts can Nanofab fix without IT?
- Which parts require an IT ticket?
- Which code copies are canonical?
- Which code copies are historical only?

### Exit Criteria

- You can explain the system in 10 minutes without opening a file.
- You can draw the data flow from producers to website.
- You can identify the operational owner for each major component.

## Phase 2 - Run The Mechanical Documentation Audit

Goal: catch missing files, broken links, and stale wording before doing deeper judgment work.

### Actions

From the documentation repo:

```sh
bash audit.sh
```

Read all output. Do not treat the script as authoritative; it is a starter report.

Important: because this GitHub repo is documentation-only, source repos may not be inside the docs repo. For source-code checks, use sibling directories `../UNanofabTools` and `../NanofabToolkit`.

### Check Specifically

- Missing layman READMEs.
- Missing slide decks.
- Missing developer docs.
- Missing known-issues files.
- Broken markdown links.
- Stale `~/UNanofabTools` references.
- Stale `~/HSCDownloader` references.
- Stale "external PostgreSQL" wording.
- "No backups" wording without University IT context.
- "Create UNIX users" wording without IT-ticket context.
- Root SSH recommendations assigned to Nanofab instead of IT.

### Exit Criteria

- Every mechanical finding is either fixed or listed in the drift report.
- You understand which hits are real issues and which are acceptable historical context.

## Phase 3 - Verify Access And Live State

Goal: compare documentation to production reality.

### Read First

1. `documentation/UNanofabTools/serveraccess/README.md`
2. `presentation/UNanofabTools/serveraccess/README.md`
3. `documentation/UNanofabTools/liveserver/README.md`
4. `known-issues/UNanofabTools/serveraccess.md`
5. `known-issues/UNanofabTools/liveserver.md`

### Safe Access Rules

- Use the documented two-hop SSH path through CADE.
- Attach to tmux only when needed.
- Detach with `Ctrl-b d`.
- Do not type `exit` inside the live service pane.
- Do not press `Ctrl-c` inside the live service pane.
- Do not edit `.env`, database files, nginx config, systemd units, or SSH keys during an audit unless the task is explicitly a maintenance change.

### Live Checks

On `nfhistory`, verify:

- Hostname and OS.
- IP address.
- nginx status and listener.
- TLS certificate path and renewal mechanism.
- tmux sessions `flaskserver` and `downloader`.
- Flask process command.
- HSCDownloader process command.
- Production install path.
- Python venv path.
- `.env` key names, not secret values.
- SQLite database files in `instance/`.
- PostgreSQL service and local listener.
- Data-tree freshness for `HSCDATA/`, `LogData/`, and `uploads/`.
- Disk usage.
- Cleanroom-specific cron entries.
- Backup assumptions and what IT covers.

### Survey Snapshot

Run the survey script using the documented procedure:

```sh
bash ~/survey_nfhistory.sh | tee /tmp/nfhistory_survey_$(date +%F).txt
```

Copy the result into:

```text
documentation/UNanofabTools/liveserver/snapshots/
```

Before committing any snapshot, inspect it for secrets. Redact secret values. Keep key names, paths, service names, and non-secret operational facts.

### Exit Criteria

- The live-server doc matches the current survey or has clear notes where it differs.
- The known-issues live-server list matches current reality.
- Anything that changed since the last snapshot is documented.

## Phase 4 - Reconstruct The Runtime Architecture

Goal: know how a request or data update travels through the system.

### Build This Diagram

Write or update a plain-text diagram with these nodes:

```text
Browser/user
  -> DNS/TLS/nginx
  -> Flask app on 127.0.0.1:5000
  -> auth/session/Duo
  -> blueprints/routes
  -> SQLite databases
  -> local PostgreSQL chem database
  -> HSCDATA/LogData/uploads

CORES/n8n
  -> HSCDownloader.py
  -> HSCDATA/*.csv
  -> Flask machine pages

Tool control PCs
  -> file-transfer scripts
  -> LogData/
  -> Flask data displays

Pico devices
  -> unauthenticated IoT API routes
  -> sensor storage/views

NanofabToolkit desktop tools
  -> local files or nfhistory APIs, depending on tool
```

### Validate Against Docs

Compare:

- `presentation/UNanofabTools/flaskserver/README.md`
- `documentation/UNanofabTools/flaskserver/01-architecture.md`
- `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md`
- `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`
- `documentation/UNanofabTools/liveserver/README.md`

### Exit Criteria

- You know every producer of data.
- You know every persistent data store.
- You know every long-running process.
- You know what nginx does and does not do.
- You know which components are current vs deprecated.

## Phase 5 - Audit The Flask App Against The Docs

Goal: prove that the developer docs describe the code that actually exists.

### Commands

From the documentation repo:

```sh
rg -n "Blueprint|@.*route|route\\(" ../UNanofabTools
rg -n "login_required|session|Duo|duo|auth" ../UNanofabTools
rg -n "CHEM_|SQLALCHEMY|DATABASE|SECRET|FLASK_" ../UNanofabTools
rg -n "sqlite|postgres|psycopg|SQLAlchemy|create_engine" ../UNanofabTools
rg -n "HSCDATA|LogData|uploads|instance" ../UNanofabTools
```

### Compare To Docs

Check these pairs line by line:

| Code area | Documentation |
|-----------|---------------|
| app factory and startup | `documentation/UNanofabTools/flaskserver/01-architecture.md`, `02-getting-started.md` |
| env vars and config classes | `03-configuration-reference.md` |
| SQLite and chem schema | `04-database-schema.md` |
| HTTP routes | `05-http-api-reference.md` |
| service/helper functions | `06-service-layer-reference.md` |
| auth and Duo | `07-authentication-and-authorization.md` |
| external/internal integrations | `08-integrations-and-data-contracts.md` |
| deployment and operations | `09-deployment-and-operations.md` |
| dev workflow | `10-development-guide.md` |

### Route Audit

For every documented route, confirm:

- URL rule.
- HTTP methods.
- blueprint or module.
- login requirement.
- request payload.
- response shape.
- template rendered or file returned.
- database or filesystem side effect.
- whether the route is user-facing, admin-facing, or device-facing.

For every actual route in code, confirm it appears in the docs or is intentionally omitted with a reason.

### Configuration Audit

For every documented env var, confirm:

- exact spelling
- default value behavior
- production requirement
- whether it is safe to omit in development
- whether it is a secret
- where it is consumed in code

For every env var consumed in code, confirm it appears in the docs.

### Exit Criteria

- No undocumented production route remains unless explicitly explained.
- No documented route points to dead code.
- Env-var docs match code exactly.
- Startup docs match `run.py` and the production tmux state.

## Phase 6 - Audit Databases And Data Durability

Goal: know what data exists, where it lives, how it is backed up, and how it can be restored.

### SQLite

Check:

- Which SQLite databases exist under `instance/`.
- Which code modules open each one.
- Whether schemas are created automatically or manually.
- Whether migrations exist.
- Whether tables are documented.
- Whether backups include them.

### Chem PostgreSQL

Check:

- live service unit: `postgresql@17-main.service`
- listener: `127.0.0.1:5432`
- database name
- application user
- schema files in `UNanofabTools`
- live schema vs committed schema
- whether `chem_schema.sql` and `chem_schema_migration_v2.sql` are current
- whether `init_chem_db.py` is complete or only partial
- whether app write routes are authenticated

Do not paste database passwords into docs. Record key names and access path only.

### File Trees

Check:

- `HSCDATA/`
- `LogData/`
- `uploads/`
- particle sensor data storage
- machine log directories
- generated files
- whether each is authoritative, cache-like, or derived

### Backup Questions

Answer these in writing:

- What does University IT back up?
- Does the backup include `/home/phelan/`?
- Does it include the PostgreSQL data directory?
- Does it include `/etc/letsencrypt/`?
- What is the restore path if the VM is lost?
- What can Nanofab restore without IT?
- Is there a local `pg_dump` schedule?
- Are there unbacked-up data trees?

### Exit Criteria

- A maintainer can name every durable data store.
- A maintainer can describe how to back up and restore each one.
- Any unknown backup boundary is filed as an IT question, not guessed.

## Phase 7 - Audit Security And Identity

Goal: understand who can get in, what secrets exist, and what should be hardened first.

### Areas To Review

- CADE access path.
- `phelan` shared UNIX account.
- `/home/phelan/.ssh/authorized_keys` management.
- root SSH as University IT's access path.
- sudo rights available to Nanofab.
- Flask login flow.
- Duo integration.
- Flask session settings.
- admin authorization checks.
- chem write routes.
- unauthenticated device API routes.
- hard-coded secrets in source.
- `.env` secret handling.
- WiFi credentials in Pico firmware.
- CORES bearer token handling.
- GitHub documentation redactions.

### Secret Handling Rules

- Do not commit live secret values.
- Do not paste `.env` values into markdown.
- Do not paste bearer tokens, WiFi passwords, Duo keys, private SSH keys, or database passwords.
- It is acceptable to document secret key names, rotation procedures, where secrets are read, and where they should live.
- If a secret was ever committed to source, assume it must be rotated.

### Triage

For each security item, classify:

- High: exploitable access, unauthenticated write, live secret, data exposure.
- Medium: weak operational control, personal-account dependency, missing audit trail.
- Low: cleanup, clarity, hardening with low immediate risk.
- IT ticket: root, VM, network, backups, OS patching, per-user UNIX accounts.
- Nanofab-actionable: app code, `.env`, `/home/phelan/`, tmux, HSCDownloader, chem DB app permissions, docs.

### Exit Criteria

- Every secret exposure is listed with rotation guidance.
- Every identity/access recommendation is assigned to Nanofab or IT.
- The maintainer knows what not to touch without IT.

## Phase 8 - Audit Integrations And Tool Ecosystem

Goal: know every thing outside Flask that feeds, reads, or depends on the system.

### UNanofabTools Components

Audit these:

- `hscdownloader`
- `filetransfer`
- `dattools`
- `utilities`
- `picofirmware` older copies
- `particlepctools` older copy
- `hscdisplayerserver` deprecated server

For each component, record:

- purpose
- source path
- production status
- canonical vs historical status
- inputs
- outputs
- external systems
- secrets
- known issues
- what "healthy" looks like
- how to test without touching production

### NanofabToolkit Components

Audit these:

- `PicoHelperTools`
- `ParticleSensor`
- `ParalyneReader`
- `ALDPeakCounter`
- `DentonDecoder`
- `PreciousMetalReader`

For each, record:

- canonical source path
- supported operating system or hardware
- input file/device format
- output file/API behavior
- relation to `nfhistory`
- whether the docs describe the current implementation
- whether the presentation deck is accurate enough for non-coders

### Canonical Copy Rule

If the same concept exists in both repos:

- Treat `NanofabToolkit/PicoHelperTools` as canonical for Pico firmware.
- Treat `NanofabToolkit/ParticleSensor` as canonical for the particle desktop viewer.
- Treat `UNanofabTools/picofirmware` and `UNanofabTools/particlepctools` as historical unless live evidence proves otherwise.

### Exit Criteria

- A maintainer knows which repo to patch for each tool.
- Deprecated tools are clearly marked.
- No integration depends on an undocumented secret or undocumented path.

## Phase 9 - Triage Known Issues

Goal: convert the punch list into a maintenance plan.

### Read

1. `known-issues/UNanofabTools/README.md`
2. `known-issues/UNanofabTools/liveserver.md`
3. `known-issues/UNanofabTools/serveraccess.md`
4. `known-issues/UNanofabTools/flaskserver.md`
5. every remaining `known-issues/UNanofabTools/*.md`
6. every `known-issues/NanofabToolkit/*.md`

### For Each Issue

Confirm:

- still exists
- severity is correct
- owner is Nanofab, IT, or both
- suggested fix is feasible
- code path still exists
- doc references still point to real files
- any secret named there is redacted or represented by placeholder

### Priority Rules

Fix first:

1. active security exposures
2. unauthenticated writes or unsafe device endpoints
3. data-loss risks
4. production reliability risks
5. schema drift that blocks recovery
6. personal-account dependencies
7. doc/code mismatches that could cause bad operations
8. deprecated-code cleanup
9. cosmetic cleanup

### Exit Criteria

- Every issue has an owner.
- Every issue has a current status.
- No fixed issue remains as if it were still broken.
- No active high-severity finding is buried in a low-priority file.

## Phase 10 - Build The Maintenance Plan

Goal: leave a concrete next-action plan, not a pile of observations.

### Next 7 Days

This section should include urgent work only:

- restore or confirm access
- verify tmux sessions
- close obviously stale editor sessions
- rotate exposed secrets
- document current `.env` key names without values
- confirm backups with IT
- add any missing high-severity known issue

### Next 30 Days

This section should include material improvements:

- move Flask app and HSCDownloader under systemd or another supervisor
- reconcile chem schema and migrations
- authenticate or otherwise protect chem write routes
- remove production-targeting defaults from test tools
- replace personal-account file-transfer dependency
- create a local `pg_dump` routine if appropriate
- update docs after every accepted fix

### Next Quarter

This section should include structural work:

- test restore procedures
- retire the legacy server if confirmed unused
- reduce shared-account dependence with IT if policy allows
- review all secrets and rotation procedures
- repeat Path D mechanical audit
- refresh live-server snapshot
- review dependency versions and OS patch status with IT

### Exit Criteria

- A manager can see what will be fixed when.
- A maintainer can start the next task without asking for priority context.
- IT tickets are separated from Nanofab-owned engineering work.

## Phase 11 - Write Decision Records

Goal: prevent future maintainers from rediscovering why the system is shaped this way.

Create a short decision log in the audit notes. Commit a cleaned version if it is useful and contains no secrets.

Use this template:

```md
## Decision: <short name>

- Date:
- Status: active / superseded / needs review
- Context:
- Decision:
- Consequences:
- Owner:
- Related docs:
- Related known issues:
```

Recommended decisions to record:

- Why `nfhistory` is jointly owned by University IT and Nanofab.
- Why Nanofab uses shared UNIX account `phelan`.
- Why root access is not a Nanofab maintenance path.
- Why the app currently runs in tmux.
- Whether and when to migrate to systemd.
- Why chem PostgreSQL is local.
- Which source repo is canonical for Pico firmware.
- Which source repo is canonical for ParticleSensor.
- Why `hscdisplayerserver` is deprecated.
- Which backup responsibilities are IT-owned.

### Exit Criteria

- Future maintainers inherit reasons, not just commands.
- Any uncomfortable operational compromise is documented honestly.

## Phase 12 - Practice Operational Scenarios

Goal: prove the maintainer can operate the system without undocumented help.

Do these as dry runs unless there is an actual incident.

### Website Is Down

Answer:

- Is nginx running?
- Is port 443 listening?
- Is nginx proxying to `127.0.0.1:5000`?
- Is the Flask process alive?
- Is the `flaskserver` tmux session alive?
- Are there recent tracebacks?
- Is disk full?
- Did `.env` or the venv change?
- Can you restart safely using the documented tmux procedure?

### New CORES Data Is Missing

Answer:

- Is `downloader` tmux alive?
- Is `python3 HSCDownloader.py` running?
- Is there a stale editor pane that confused the operator?
- Are new files appearing in `HSCDATA/`?
- Did the CORES/n8n endpoint or token change?
- Are errors logged?
- Is this a source issue, secret issue, or external CORES issue?

### Chem Pages Fail

Answer:

- Is PostgreSQL running locally?
- Is it listening on `127.0.0.1:5432`?
- Are `CHEM_*` env vars present?
- Does the live schema match the code?
- Is a migration missing?
- Are write routes protected?
- Is the issue limited to chem or app-wide?

### A Maintainer Needs Access

Answer:

- Do they have a CADE account?
- Do they have a public key?
- Who is allowed to append it to `/home/phelan/.ssh/authorized_keys`?
- How is the key labeled?
- How is access revoked?
- What requires IT?

### The VM Is Lost

Answer:

- Who opens the IT restore ticket?
- What backup does IT restore?
- How do you verify `/home/phelan/` returned?
- How do you verify PostgreSQL returned?
- How do you verify TLS certs returned?
- How do you restart Flask and HSCDownloader?
- What data may be missing?

### Exit Criteria

- The maintainer can talk through each scenario without guessing.
- Any guessed step becomes a doc update or known issue.

## Phase 13 - No-Contact Exit Exam

Goal: prove the handoff is independent of Faith.

The maintainer should be able to answer every question below from docs, source, live state, or IT tickets.

### System Ownership

- Who owns the VM?
- Who owns root?
- Who owns `/home/phelan/`?
- Who owns the Flask app?
- Who owns the local chem PostgreSQL database?
- Who owns off-box backups?
- Who can create UNIX users?
- Which tasks need IT?
- Which tasks can Nanofab do alone?

### Runtime

- What process serves the Flask app today?
- What process writes `HSCDATA/`?
- What is nginx proxying to?
- What tmux sessions must stay alive?
- What is the production install path?
- What command restarts Flask in the current setup?
- What command restarts the downloader in the current setup?
- What should replace tmux long term?

### Data

- Which data is in SQLite?
- Which data is in PostgreSQL?
- Which data is in CSV files?
- Which data is uploaded from tool PCs?
- Which data is posted by Pico devices?
- Which data is derived vs authoritative?
- What has to be backed up?
- What restore procedure has actually been tested?

### Code

- Where is the Flask app source?
- Where are the Flask routes?
- Where is config loaded?
- Where are auth and Duo handled?
- Where is chem DB access implemented?
- Where is HSCDownloader?
- Which repo has canonical Pico firmware?
- Which repo has canonical ParticleSensor?
- Which code is deprecated?

### Security

- Where are secrets supposed to live?
- Which secrets were historically hard-coded?
- Which secrets must be rotated if exposed?
- Which routes accept unauthenticated device data?
- Which routes perform writes?
- Which auth checks protect admin behavior?
- How is SSH access granted and revoked?
- What should never be committed?

### Maintenance

- What are the top three Nanofab-actionable fixes?
- What are the top three IT tickets?
- What is the quarterly maintenance checklist?
- How do docs get updated after a fix?
- How do known-issues files get closed?
- What evidence is required before deleting a known issue?

If any answer depends on "ask Faith," Path D is not complete. Replace that dependency with documentation, source evidence, or an IT ticket.

## Phase 14 - Close The Audit

Goal: leave the repo better than you found it.

### Required Cleanup

- Update changed docs.
- Update known-issues.
- Add or update live-server snapshot.
- Remove any accidental secret values.
- Run `bash audit.sh`.
- Run `git diff --check`.
- Review `git diff`.
- Commit documentation changes.
- Push the branch if this is a GitHub-maintained doc set.

### Final Report Template

Use this structure:

```md
# Path D Audit Report - YYYY-MM-DD

## Verdict

## Repos And Commits

## Live State Verified

## Drift Found

## Changes Made

## Remaining Nanofab-Actionable Work

## IT Tickets Needed

## Security Follow-Up

## Backup And Restore Status

## Next 7 Days

## Next 30 Days

## Next Quarter
```

### Done Criteria

Path D is complete when all are true:

- `START-HERE.md` still points to real files.
- The docs reflect the current source code or explicitly note drift.
- The docs reflect the current live server or explicitly note drift.
- Every high-severity known issue is visible in the master known-issues index.
- Every IT-bound item is labeled as an IT ticket.
- Every Nanofab-actionable item has a plausible next step.
- No secret values were committed.
- The next maintainer can answer the exit-exam questions from written materials.

## Appendix A - Useful Search Commands

Run from `nanofab-documentation/`.

```sh
rg -n "~/UNanofabTools|~/HSCDownloader|external PostgreSQL|external chem" .
rg -n "no backups|No backups|nothing backs up|backups are missing" .
rg -n "create UNIX|create per-person|useradd|root SSH|PermitRootLogin|iceolate" .
rg -n "CHEM_|FLASK_|SECRET|DUO|DATABASE|SQLALCHEMY" ../UNanofabTools
rg -n "@.*route|Blueprint|login_required|session" ../UNanofabTools
rg -n "HSCDATA|LogData|uploads|instance|postgres|sqlite" ../UNanofabTools
rg -n "wifi|password|token|bearer|secret|key" ../UNanofabTools ../NanofabToolkit
```

## Appendix B - Sensitive Output Rules

Before committing any audit output:

- Replace bearer tokens with `<redacted-bearer-token>`.
- Replace WiFi passwords with `<redacted-wifi-password>`.
- Replace database passwords with `<redacted-db-password>`.
- Replace Duo secret values with `<redacted-duo-secret>`.
- Replace private key material with `<redacted-private-key>`.
- Keep key names, file paths, command names, usernames, service names, and timestamps.
- For SSH public keys, record owner labels and fingerprints instead of full key bodies unless policy allows the full public key.

## Appendix C - Quarterly Maintenance Checklist

Do this every quarter:

- Run `bash audit.sh`.
- Refresh the live-server survey snapshot.
- Confirm both tmux sessions or their replacement supervisor are healthy.
- Confirm HSCDownloader is writing fresh `HSCDATA/`.
- Confirm PostgreSQL is running locally and is backed up.
- Confirm SQLite/data trees are covered by backup.
- Confirm TLS renewal is healthy.
- Review disk usage.
- Review `known-issues/` and close fixed items with evidence.
- Re-scan source for secrets.
- Review IT-ticket items and follow up.
- Confirm `START-HERE.md` still matches the repo layout.
- Confirm canonical-copy notes for PicoHelperTools and ParticleSensor are still true.

## Appendix D - What Not To Spend Time On First

Do not start here unless live evidence changes the priority:

- Polishing deprecated `hscdisplayerserver`.
- Rewriting all desktop tools.
- Reorganizing documentation style.
- Creating per-user UNIX accounts without IT.
- Moving root SSH configuration without IT.
- Making broad refactors before chem schema, supervision, access, and secrets are understood.

The first maintainer-hours should go to reliability, recoverability, security, and removing person-specific operational dependencies.
