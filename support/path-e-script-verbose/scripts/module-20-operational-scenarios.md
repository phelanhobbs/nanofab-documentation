# Verbose Maximal Path E - Module 20: Operational Scenarios

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-20-operational-scenarios.md

# Module 20 - Operational Scenarios

## Goal

The maintainer rehearses real maintenance scenarios: website down, stale data, database trouble, access revocation, secret exposure, backup verification, and documentation drift.

## Required Screen

SHOW:

- `documentation/UNanofabTools/serveraccess/README.md` (repo path: documentation/UNanofabTools/serveraccess/README.md)
- `documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md)
- `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md` (repo path: documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md)
- `known-issues/UNanofabTools/README.md` (repo path: known-issues/UNanofabTools/README.md)

## Verbatim Script

READ ALOUD:

"This module is scenario rehearsal. A maintainer is not ready just because they understand files. They need to know what to do under pressure without guessing."

## Scenario 1 - Website Appears Down

READ ALOUD:

"Scenario one: someone says the website is down. Do not start by editing code. Start with evidence."

ASK:

| Question | Expected answer |
|---|---|
| Can DNS resolve? | Check `nfhistory.nanofab.utah.edu` resolves to the expected host/IP or identify DNS as the failure layer. |
| Is nginx running? | Use `systemctl status nginx`; it should be active for public HTTPS service. |
| Is TLS valid? | Check the browser/certbot/certificate status; Let's Encrypt cert should be valid and renewal should be healthy. |
| Is Flask listening behind nginx? | Check loopback listener/process state, expected `127.0.0.1:5000` style service, and proxy config. |
| Is the `flaskserver` tmux session alive? | `tmux ls` should show `flaskserver`; if missing, use the documented recovery path. |
| Is the Python process inside it alive? | Inspect process list or tmux pane safely; tmux existing alone does not prove Flask is serving. |
| Are there recent errors? | Check visible tmux output/logs/app output without exposing secrets. |
| Can you restart safely using the documented procedure? | Yes, by following the serveraccess runbook, recreating tmux only if needed, using the right path, and detaching with `Ctrl-b d`. |

REQUIRE:

The maintainer states the checks in order and identifies which are safe read-only checks.

## Scenario 2 - Machine Data Is Stale

READ ALOUD:

"Scenario two: the website loads, but machine data is stale. That is a data freshness problem, not necessarily a web outage."

ASK:

| Question | Expected answer |
|---|---|
| Is `downloader` tmux alive? | `tmux ls` should show `downloader`; if not, follow the downloader recovery runbook. |
| Is `HSCDownloader.py` running? | Verify the Python process, not just the tmux session. |
| When did `HSCDATA` last change? | Check file modification times in `HSCDATA` and compare them to expected downloader cadence. |
| Is CORES or n8n reachable? | Verify upstream availability or recent downloader errors without exposing credentials. |
| Are machine-control-PC logs separate from CORES data? | Yes. Control-PC logs go to `LogData`; CORES-derived data goes to `HSCDATA`. |
| Which known-issues file covers downloader risk? | `known-issues/UNanofabTools/hscdownloader.md`, plus live-server/serveraccess issues for supervision. |

REQUIRE:

The maintainer distinguishes `HSCDATA` freshness from website uptime.

## Scenario 3 - Chemical Inventory Error

READ ALOUD:

"Scenario three: chemical inventory pages fail or writes behave incorrectly. Treat this as a data-integrity issue."

ASK:

| Question | Expected answer |
|---|---|
| Is PostgreSQL running locally? | `postgresql@17-main` or the documented local PostgreSQL service should be active on `nfhistory`. |
| Is it listening on `127.0.0.1:5432`? | Yes, that is the documented live local listener shape. |
| Are chemical DB env-var names correct? | Compare `CHEM_*` config docs to `config.py` and production key names, without showing secret values. |
| Did schema drift occur? | Compare documented schema to live schema/introspection or current source assumptions. |
| Which routes write chemical inventory? | Chem inventory create/update/move/remove/import/write routes in `chem_inventory.py`, as documented in endpoint docs. |
| Are write routes properly guarded? | Confirm route decorators/guards and known-issues status; do not assume from UI alone. |
| Is backup coverage known before making changes? | It must be confirmed for local PostgreSQL and app data before risky schema/data changes. |

REQUIRE:

The maintainer does not change schema casually and knows to verify backup/restore assumptions.

## Scenario 4 - Access Must Be Revoked

READ ALOUD:

"Scenario four: a maintainer leaves and access must be revoked."

ASK:

| Question | Expected answer |
|---|---|
| Which account do Nanofab users SSH as? | The shared `phelan` UNIX account. |
| Where are per-person SSH keys represented? | In `/home/phelan/.ssh/authorized_keys` entries/labels, not separate UNIX accounts. |
| Who can create or remove UNIX accounts? | University IT. |
| What requires IT? | UNIX account creation/removal, root-owned access changes, `/root/`, root SSH, and VM-level access policy. |
| What app-level accounts or admin privileges also need review? | Flask app users, admin flags, assignment privileges, and any application-level credentials. |

REQUIRE:

The maintainer separates SSH access, app account access, admin privileges, and IT-owned UNIX account work.

## Scenario 5 - Secret Exposure

READ ALOUD:

"Scenario five: a token, password, or key is found in source or docs. The fix is not just deletion. The secret must be removed from inappropriate storage, moved to protected configuration, and rotated if exposure is possible."

ASK:

| Question | Expected answer |
|---|---|
| What kind of secret is it? | Identify whether it is a bearer token, WiFi password, DB password, Duo secret, private key, session secret, or other credential. |
| Where was it exposed? | Source file, docs file, Git history, terminal output, screenshot, notes, or deployed config. |
| Is it in Git history? | Check history if exposure was committed; deletion from the current file is not enough. |
| Who owns rotation? | The owner of the underlying service/credential, with Nanofab or IT depending on the secret. |
| Which docs or known-issues files need updating? | The relevant tool known-issues file, redaction note if documentation is affected, and any docs that describe secret handling. |
| What scan verifies the documentation bundle is clean? | A literal scan for known exposed values plus broader secret scans where appropriate, run without projecting secrets. |

REQUIRE:

The maintainer can describe rotation, not just redaction.

## Scenario 6 - Docs And Live State Disagree

READ ALOUD:

"Scenario six: docs and live state disagree. The live state wins for current operations. The docs must be updated or must clearly say they describe a target state."

ASK:

| Question | Expected answer |
|---|---|
| What was observed live? | Record the exact command/snapshot/output summary and date. |
| Which doc disagrees? | Name the specific Markdown file/section or slide note that conflicts with live state. |
| Is the disagreement dangerous? | Classify severity based on whether it affects recovery, security, data integrity, or operational decisions. |
| Does known issues need a new entry? | Yes if the drift reflects unresolved risk or live behavior that docs cannot immediately correct. |
| What evidence should be committed? | Updated docs, known-issues entry, sanitized survey snapshot, and/or a concise drift report with no secrets. |

REQUIRE:

The maintainer writes a short drift finding.

## Stop Point

STOP POINT:

Stop here only after the maintainer can walk through every scenario without relying on Faith.


# Expanded Module 20: Operational Scenarios

READ ALOUD:

This expanded section revisits Module 20, Operational Scenarios. The focus is outage, stale data, chem DB, access, secrets, and docs/live drift. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 20

READ ALOUD:

We are now doing the orientation pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 20

READ ALOUD:

We are now doing the evidence pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Source-code pass for Module 20

READ ALOUD:

We are now doing the source-code pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Live-state pass for Module 20

READ ALOUD:

We are now doing the live-state pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Failure-mode pass for Module 20

READ ALOUD:

We are now doing the failure-mode pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Maintenance-planning pass for Module 20

READ ALOUD:

We are now doing the maintenance-planning pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Security pass for Module 20

READ ALOUD:

We are now doing the security pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Recovery pass for Module 20

READ ALOUD:

We are now doing the recovery pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Documentation-drift pass for Module 20

READ ALOUD:

We are now doing the documentation-drift pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Teach-back pass for Module 20

READ ALOUD:

We are now doing the teach-back pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Homework-review pass for Module 20

READ ALOUD:

We are now doing the homework-review pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Quarterly-audit pass for Module 20

READ ALOUD:

We are now doing the quarterly-audit pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Backup-and-restore pass for Module 20

READ ALOUD:

We are now doing the backup-and-restore pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Ownership-boundary pass for Module 20

READ ALOUD:

We are now doing the ownership-boundary pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## No-contact rehearsal pass for Module 20

READ ALOUD:

We are now doing the no-contact rehearsal pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Operator-error pass for Module 20

READ ALOUD:

We are now doing the operator-error pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Data-integrity pass for Module 20

READ ALOUD:

We are now doing the data-integrity pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Final-repetition pass for Module 20

READ ALOUD:

We are now doing the final-repetition pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-20-operational-scenarios.md`
- `documentation/UNanofabTools/liveserver/README.md`
- `known-issues/UNanofabTools/liveserver.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

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

> **Live-state note:** as of the 2026-06-01 `nfhistory` survey, the production box has not yet been migrated to this target shape. The live Flask process is `python run.py` inside the `flaskserver` tmux session, and there is no systemd unit for Flask or HSCDownloader yet. Treat the gunicorn/systemd material below as the recommended migration target, not a description of the current live service. See `documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md) §6.5.

**Legacy alternative (still referenced by `setup.sh`/`.env.example`):** gunicorn binding `0.0.0.0:443` directly with `--certfile/--keyfile`, no nginx:

```bash
gunicorn -w 4 -b 0.0.0.0:443 --certfile=cert.pem --keyfile=key.pem run:app
```

Prefer the nginx model for new deployments (better TLS handling, static serving, and process isolation). The rest of this document assumes nginx + gunicorn.

## 9.2 Host prerequisites

- Linux host with Python 3.10+ and `python3-venv`.
- nginx.
- PostgreSQL 12+. On the live `nfhistory` deployment, Postgres runs **locally on the same VM** (see `documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md) §10); a fresh deployment can do the same or point at a reachable remote Postgres via `CHEM_PGHOST`.
- A TLS certificate + key. Live deployment uses **Let's Encrypt + certbot** with the `certbot.timer` systemd unit handling auto-renewal (see `documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md) §4).
- A UNIX account to own the process and files. On `nfhistory`, this is the shared `phelan` account (the Nanofab team cannot create new UNIX users — IT does — see `documentation/UNanofabTools/serveraccess/README.md` §5.5). On a greenfield install, you can either reuse a shared account or — if you have root — create a dedicated `untools` service user.

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

**On the production deployment, the base backup is run off the box by University IT** — a VM-level snapshot the Nanofab team does not operate (see `documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md) §13). Confirm IT's scope and SLA, then write the result there. The table below applies to any **secondary Nanofab-owned tier** (a Nanofab admin running their own backups in addition to IT's), or to a non-production deployment where IT isn't doing it.

| Data | How |
|------|-----|
| SQLite DBs | Stop writes or use `sqlite3 <db> ".backup"`; or copy `instance/*.db` during low traffic. They are small. |
| PostgreSQL (local on the same host — see `documentation/UNanofabTools/liveserver/README.md` §10) | `pg_dump cheminventory > backup.sql` on a schedule (cron). |
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

Continue to 10-development-guide.md (repo path: documentation/UNanofabTools/flaskserver/10-development-guide.md).
