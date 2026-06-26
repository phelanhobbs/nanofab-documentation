# Verbose Maximal Path E - Module 10: Chemical Inventory

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-10-chemical-inventory.md

# Module 10 - Chemical Inventory And PostgreSQL

## Goal

The maintainer understands the chemical inventory as the largest and most database-sensitive feature: local PostgreSQL, schema shape, routes, service layer, barcode behavior, reports, transactions, and security concerns.

## Required Screen

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx)
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx)
- `presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md` (repo path: presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md)
- `documentation/UNanofabTools/flaskserver/04-database-schema.md` (repo path: documentation/UNanofabTools/flaskserver/04-database-schema.md)
- `known-issues/UNanofabTools/flaskserver.md` (repo path: known-issues/UNanofabTools/flaskserver.md)

## Verbatim Script

READ ALOUD:

"The chemical inventory is one of the most important features to understand deeply. It is larger than a simple CRUD page. It has its own PostgreSQL schema, rooms, vendors, items, containers, barcodes, scans, reports, transaction history, moves, removals, and exports."

SHOW:

Open `09-Chemical-Inventory.pptx`.

READ ALOUD:

"The chemical inventory answers operational questions: what chemical exists, where it is, who owns it, what container it is in, whether it has been removed, and what history is attached to it. Because this is operational inventory data, correctness matters. A bug here can affect compliance, safety, or lab operations."

SHOW:

Open `10-Database-Models.pptx`.

READ ALOUD:

"This is where the database distinction matters. The main app uses several SQLite databases for smaller app concerns. The chemical inventory uses local PostgreSQL on `nfhistory`. Earlier documentation was corrected to remove stale external-database framing. The correct live fact is local PostgreSQL bound to `127.0.0.1:5432`."

## Source Demo

DO:

Show:

```text
../UNanofabTools/app/blueprints/chem_inventory.py
../UNanofabTools/app/services/chem_inventory_service.py
../UNanofabTools/config/config.py
```

DO:

Run:

```sh
rg -n "CHEM_|psycopg|containers|transactions|barcode|inventory|room|vendor|REMOVE|MOVE|BULK_MOVE" ../UNanofabTools/app ../UNanofabTools/config
```

READ ALOUD:

"This search connects configuration, routes, service functions, and schema concepts. The maintainer should be able to find where a barcode is created, where inventory is searched, where a container is moved, where a container is removed, and where transactions are logged."

SHOW:

Open `documentation/UNanofabTools/flaskserver/04-database-schema.md` (repo path: documentation/UNanofabTools/flaskserver/04-database-schema.md).

READ ALOUD:

"The schema doc should be treated as operational reference. If the live PostgreSQL schema drifts from this doc, that is high-impact documentation drift. The maintainer should know how to compare docs against live schema or a schema dump before making changes."

## Live Demo If Safe

If database access is safe and credentials are not exposed:

DO:

Show only service status or schema names, not passwords.

```sh
systemctl status postgresql@17-main
ss -ltnp | grep 5432
```

READ ALOUD:

"This confirms local PostgreSQL service and listener shape without showing credentials. We are not dumping secret values."

## Security Frame

READ ALOUD:

"The known-issues file calls out chemical inventory risks. The big one — the chem pages being unauthenticated — was resolved on 2026-06-25: the whole `/chem` blueprint is now gated by a WordPress signed-token `before_request` check (`CHEM_SSO_SECRET`, entry via `/chem/enter`), so read and write are both behind that gate. Remaining focus: schema drift, missing migration discipline, and backup/restore coverage. Chemical inventory changes should be approached as data integrity work, not just UI work."

SHOW:

Open `known-issues/UNanofabTools/flaskserver.md` (repo path: known-issues/UNanofabTools/flaskserver.md).

READ ALOUD:

"Known issues are where the maintainer decides what to fix first. High-severity chemical inventory findings belong near the top because they affect real operational data."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Is chemical PostgreSQL local or external? | Local on `nfhistory`, not an external database server. |
| What host and port does the live deployment use? | `127.0.0.1:5432`. |
| Which config variables control chemical database access? | The `CHEM_*` PostgreSQL settings documented in the config reference, such as host, port, database, user, and password variables. |
| What are the main chemical inventory entities? | Rooms, vendors, items, containers, barcodes, scans, transactions, reports, moves, and removals. |
| What is a soft delete in this context? | Marking a container removed/inactive while preserving the row and history instead of physically deleting it. |
| Why is transaction history important? | It preserves auditability for moves, removals, inventory changes, reports, and compliance-style review. |
| What should be checked before changing barcode or move behavior? | Schema, service functions, route guards, transaction logging, reports/exports, tests/sample data, and live backup/restore coverage. |
| What backup coverage is needed for chemical inventory? | Local PostgreSQL data plus relevant app config, schema evidence, and any related files needed to restore inventory behavior. |

REQUIRE:

The maintainer can explain the chemical inventory's route, service, database, and backup concerns without calling it "just another page."

## Stop Point

STOP POINT:

Stop here if the maintainer says or implies that chemical PostgreSQL is external. Correct that immediately and revisit the live-server and schema docs.


# Expanded Module 10: Chemical Inventory

READ ALOUD:

This expanded section revisits Module 10, Chemical Inventory. The focus is local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 10

READ ALOUD:

We are now doing the orientation pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 10

READ ALOUD:

We are now doing the evidence pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Source-code pass for Module 10

READ ALOUD:

We are now doing the source-code pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Live-state pass for Module 10

READ ALOUD:

We are now doing the live-state pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Failure-mode pass for Module 10

READ ALOUD:

We are now doing the failure-mode pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Maintenance-planning pass for Module 10

READ ALOUD:

We are now doing the maintenance-planning pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Security pass for Module 10

READ ALOUD:

We are now doing the security pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Recovery pass for Module 10

READ ALOUD:

We are now doing the recovery pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Documentation-drift pass for Module 10

READ ALOUD:

We are now doing the documentation-drift pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Teach-back pass for Module 10

READ ALOUD:

We are now doing the teach-back pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Homework-review pass for Module 10

READ ALOUD:

We are now doing the homework-review pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Quarterly-audit pass for Module 10

READ ALOUD:

We are now doing the quarterly-audit pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Backup-and-restore pass for Module 10

READ ALOUD:

We are now doing the backup-and-restore pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Ownership-boundary pass for Module 10

READ ALOUD:

We are now doing the ownership-boundary pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## No-contact rehearsal pass for Module 10

READ ALOUD:

We are now doing the no-contact rehearsal pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Operator-error pass for Module 10

READ ALOUD:

We are now doing the operator-error pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Data-integrity pass for Module 10

READ ALOUD:

We are now doing the data-integrity pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Final-repetition pass for Module 10

READ ALOUD:

We are now doing the final-repetition pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`
- `presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`
- `documentation/UNanofabTools/flaskserver/04-database-schema.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/04-database-schema.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 04 — Database Schema Reference

The server uses five databases: four SQLite files (managed via Flask-SQLAlchemy ORM and Alembic) and one PostgreSQL database (managed via raw SQL through SQLAlchemy Core). This document is the authoritative schema reference.

## 4.1 Database inventory

| Database | Engine | Location | Bind key | Managed by |
|----------|--------|----------|----------|------------|
| Users | SQLite | `instance/signininfo.db` | (default) | Flask-SQLAlchemy ORM + Alembic |
| Sessions | SQLite | `instance/sessioninfo.db` | `sessions` | ORM + Alembic |
| Tasks | SQLite | `instance/tasks.db` | `tasks` | ORM (DDL) + raw `sqlite3` (DML) |
| Particle sensors | SQLite | `instance/particle_sensors.db` | `particle_sensors` | ORM + Alembic |
| Chemical inventory | PostgreSQL | **local** `cheminventory` (postgresql@17-main on `127.0.0.1:5432`, same host as the Flask app — confirmed by the live-server survey in `documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md) §10) | `chem_inventory` (declared but unused at runtime) | `init_chem_db.py` + SQL files + ad-hoc DDL |

## 4.2 SQLite models (`app/models/__init__.py` and `app/models/particle_sensor.py`)

All SQLite tables are defined as Flask-SQLAlchemy models. `db.create_all()` (called in `create_app`) creates any missing tables on boot.

### 4.2.1 `User` → table `signininfo`

```python
class User(UserMixin, db.Model):
    __tablename__ = 'signininfo'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False, name='passwordHash')
    unid = db.Column(db.String(255), unique=True, nullable=False, name='uNID')
    is_admin = db.Column(db.Boolean, default=False, name='isAdmin')
    can_assign = db.Column(db.Boolean, default=False, name='canAssign')
```

| Column (DB) | Python attr | Type | Constraints | Notes |
|-------------|-------------|------|-------------|-------|
| `id` | `id` | INTEGER | PK | Auto-increment. Stored in the Flask-Login cookie. |
| `username` | `username` | VARCHAR(255) | unique, not null | Login identifier. |
| `passwordHash` | `password_hash` | VARCHAR(255) | not null | bcrypt hash (never plaintext). Column name is camelCase (legacy). |
| `uNID` | `unid` | VARCHAR(255) | unique, not null | University ID; used as Duo username and password-reset secret. |
| `isAdmin` | `is_admin` | BOOLEAN | default False | Grants admin panel. |
| `canAssign` | `can_assign` | BOOLEAN | default False | Grants task creation/assignment. |

`UserMixin` supplies Flask-Login's `is_authenticated`, `get_id()`, etc. There is no auto-created admin; bootstrap by editing the row directly (see `02` §2.4).

### 4.2.2 `Session` → table `sessioninfo` (bind `sessions`)

```python
class Session(db.Model):
    __tablename__ = 'sessioninfo'
    __bind_key__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PK | |
| `session_id` | VARCHAR(255) | unique, not null | UUID4 string stored server-side and in the Flask cookie. |
| `username` | VARCHAR(255) | not null | Owner of the session. |
| `created_at` | DATETIME | default `utcnow` | Used by `delete_old_sessions` to purge stale rows. |

This is a server-side session record, separate from Flask's signed-cookie session. See `07` §7.4 for the relationship between the two.

### 4.2.3 `Task` → table `tasks` (bind `tasks`)

```python
class Task(db.Model):
    __tablename__ = 'tasks'
    __bind_key__ = 'tasks'
    task_id = db.Column(db.Integer, primary_key=True)
    task_title = db.Column(db.String(255), nullable=False)
    task_description = db.Column(db.Text)
    task_assign_date = db.Column(db.DateTime, default=datetime.utcnow)
    task_due_date = db.Column(db.DateTime)
    task_priority = db.Column(db.String(50))
    task_assigner = db.Column(db.String(255))
    task_status = db.Column(db.String(50), default='Pending')
    assignees = db.relationship('TaskAssignee', backref='task', lazy=True, cascade='all, delete-orphan')
    files = db.relationship('TaskFile', backref='task', lazy=True, cascade='all, delete-orphan')
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `task_id` | INTEGER | PK | |
| `task_title` | VARCHAR(255) | not null | |
| `task_description` | TEXT | | |
| `task_assign_date` | DATETIME | default `utcnow` | When created. |
| `task_due_date` | DATETIME | | Optional. |
| `task_priority` | VARCHAR(50) | | Free-text priority. |
| `task_assigner` | VARCHAR(255) | | Username of creator. |
| `task_status` | VARCHAR(50) | default `'Pending'` | `task_service.update_task_status` sets `'Completed'`. |

> **Runtime caveat:** `task_service.py` accesses `tasks.db` via the `sqlite3` standard library, not via these ORM relationships. The ORM models exist so `db.create_all()` builds the tables, but reads/writes at runtime are raw SQL. The relationships (`assignees`, `files`) are not used at runtime; the service joins manually.

### 4.2.4 `TaskAssignee` → table `assignees` (bind `tasks`)

```python
class TaskAssignee(db.Model):
    __tablename__ = 'assignees'
    __bind_key__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'), nullable=False)
    assignee_name = db.Column(db.String(255), nullable=False)
```

Many-to-many bridge between tasks and usernames. One row per (task, assignee).

### 4.2.5 `TaskFile` → table `task_files` (bind `tasks`)

```python
class TaskFile(db.Model):
    __tablename__ = 'task_files'
    __bind_key__ = 'tasks'
    file_id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'), nullable=False)
    file_path = db.Column(db.String(512), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
```

Records attachment file paths (the bytes live in `UPLOAD_FOLDER`). One row per uploaded file.

### 4.2.6 `ParticleSensorData` → table `particle_sensor_data` (bind `particle_sensors`)

Defined in `app/models/particle_sensor.py`. Stores only the **most recent** reading per (room, sensor); time series lives in CSV.

```python
class ParticleSensorData(db.Model):
    __tablename__ = 'particle_sensor_data'
    __bind_key__ = 'particle_sensors'
    id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String(255), nullable=False)
    sensor_number = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    # raw measurements, converted ft³ values, differential bins,
    # mass concentrations, and optional temperature_c / humidity_pct
    __table_args__ = (
        db.UniqueConstraint('room_name', 'sensor_number', name='unique_sensor_location'),
    )
```

Column groups (all `Float` unless noted):

| Group | Columns |
|-------|---------|
| Identity | `id` (PK INT), `room_name` (str, NN), `sensor_number` (str, NN), `timestamp` (DateTime, NN), `last_updated` (DateTime) |
| Raw SPS30 | `mass_pm1`, `mass_pm2_5`, `mass_pm4`, `mass_pm10`, `num_pm0_5`, `num_pm1`, `num_pm2_5`, `num_pm4`, `num_pm10`, `typical_particle_size_um` |
| Converted (#/ft³) | `num_pm0_5_ft3`, `num_pm1_ft3`, `num_pm2_5_ft3`, `num_pm4_ft3`, `num_pm10_ft3` |
| Differential bins (ft³) | `bin_0_3_to_0_5`, `bin_0_5_to_1_0`, `bin_1_0_to_2_5`, `bin_2_5_to_4_0`, `bin_4_0_to_10` |
| Mass conc. (µg/m³) | `mass_pm1_ug_m3`, `mass_pm2_5_ug_m3`, `mass_pm4_ug_m3`, `mass_pm10_ug_m3` |
| Environmental (optional) | `temperature_c` (nullable), `humidity_pct` (nullable) |

**Unique constraint** `unique_sensor_location` on `(room_name, sensor_number)` enforces one row per sensor; the `api` blueprint upserts against it.

`to_dict()` serializes the row into the same nested JSON shape that devices POST (see `08` §8.2), enabling symmetric round-trips.

## 4.3 SQLite migrations (Alembic / Flask-Migrate)

The `migrations/` directory is a standard Flask-Migrate setup (`alembic.ini`, `env.py`, `script.py.mako`, `versions/`). One revision is present:

```
migrations/versions/01bdbfe91bd5_create_particle_sensor_tables.py
```

Workflow:

```bash
export FLASK_APP=run.py
flask db migrate -m "describe change"   # autogenerate a revision from model diffs
flask db upgrade                        # apply
flask db downgrade                      # revert one revision
```

> Because `create_app` also calls `db.create_all()`, brand-new tables get created at boot even without a migration — but **column changes to existing tables require a migration**. Prefer migrations for any schema change so environments stay reproducible. Note that `db.create_all()` and Alembic can drift apart if you rely on the former; treat Alembic as the source of truth.

## 4.4 PostgreSQL chemical-inventory schema

The chem database is provisioned by `init_chem_db.py` (which executes `chem_schema.sql`), then extended by `chem_schema_migration_v2.sql`. At runtime `chem_service.py` uses SQLAlchemy Core (`engine.begin()` + `text()`), not the ORM.

There are declarative model classes in `app/models/chem_inventory.py` (Category, Vendor, Room, Item, Container, InventoryCycle, ScanRaw, ContainerScan), but they are **parity/documentation artifacts** — the runtime path does not use them.

### 4.4.1 Sequence

```sql
CREATE SEQUENCE IF NOT EXISTS seq_barcode
  START WITH 100001 INCREMENT BY 1 NO MINVALUE NO MAXVALUE;
```

`chem_service._next_barcode` calls `nextval('seq_barcode')` for each new container, guaranteeing unique 6-digit barcodes under concurrency.

### 4.4.2 Lookup tables

```sql
categories (category_id SERIAL PK, name TEXT NOT NULL UNIQUE)
vendors    (vendor_id SERIAL PK, vendor_name TEXT NOT NULL UNIQUE)
rooms      (room_id SERIAL PK, room_no TEXT, room_name TEXT, room_desc TEXT,
            area_class TEXT, building TEXT, lab_code TEXT)
```

`rooms.room_no` has a unique index (`idx_rooms_room_no_unique`) because `chem_service.resolve_room_id` upserts rooms with `ON CONFLICT (room_no)`. `room_no/room_name/room_desc/area_class` are added by the v2 migration on older databases.

### 4.4.3 `items` (chemical product definitions)

```sql
items (
  item_id SERIAL PK,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  catalog_number TEXT,
  physical_state TEXT,
  volume_size TEXT,
  category_id INTEGER NOT NULL REFERENCES categories(category_id)
              ON UPDATE CASCADE ON DELETE RESTRICT,
  vendor_id INTEGER REFERENCES vendors(vendor_id)
            ON UPDATE CASCADE ON DELETE SET NULL
)
```

One row per chemical product (not per bottle). Unique by `name`; `chem_service.add_containers` upserts via `ON CONFLICT (name)`.

### 4.4.4 `containers` (physical bottles)

```sql
containers (
  container_id BIGSERIAL PK,
  item_id INTEGER NOT NULL REFERENCES items(item_id) ON UPDATE CASCADE ON DELETE CASCADE,
  barcode TEXT NOT NULL UNIQUE,
  container_code TEXT NOT NULL UNIQUE,
  room_id INTEGER REFERENCES rooms(room_id) ON UPDATE CASCADE ON DELETE SET NULL,
  entry_date DATE, manuf_date DATE, expiry_date DATE,
  area_class TEXT, storage_location TEXT, storage_sublocation TEXT, storage_device TEXT,
  system TEXT, lot_number TEXT, choice TEXT, nmr TEXT, nmr_expiry DATE,
  owner TEXT, notes TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  size TEXT, unit TEXT, legacy_inventory_no TEXT,
  added_by TEXT,                          -- v2
  created_at TIMESTAMPTZ DEFAULT NOW(),   -- v2
  label_printed BOOLEAN DEFAULT FALSE,    -- v2
  label_printed_at TIMESTAMPTZ            -- v2
)
-- indexes: idx_containers_item, idx_containers_room,
--          idx_containers_status, idx_containers_label_printed
```

The central table. `status` drives soft-delete (`'REMOVED'`). Note that `add_containers` inserts `barcode` and `container_code` with the **same** value (the sequence number).

> **Runtime-only columns not in committed SQL:** `chem_service` also reads/writes `containers.last_scan_at` (set on scan import; read by inventory search and coverage). This column is absent from both committed `.sql` files and must exist in the live DB. See the separate known-issues file.

### 4.4.5 Scan/audit tables

```sql
inventory_cycles (cycle_id SERIAL PK, started_at TIMESTAMPTZ DEFAULT now(),
                  ended_at TIMESTAMPTZ, created_by TEXT)

scan_raw (raw_id BIGSERIAL PK,
          cycle_id INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id) ON DELETE CASCADE,
          raw_code TEXT NOT NULL, import_ts TIMESTAMPTZ DEFAULT now(),
          matched_container_id BIGINT REFERENCES containers(container_id) ON DELETE SET NULL)

container_scans (scan_id BIGSERIAL PK,
                 cycle_id INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id) ON DELETE CASCADE,
                 container_id BIGINT NOT NULL REFERENCES containers(container_id) ON DELETE CASCADE,
                 scan_ts TIMESTAMPTZ DEFAULT now(), source TEXT,
                 status TEXT NOT NULL CHECK (status IN ('FOUND','NEW')),
                 UNIQUE (cycle_id, container_id))
```

> **Runtime-only objects not in committed SQL:** `chem_service.import_scans` inserts into `inventory_cycles` columns `filename, performed_by, report_name, location, total_scanned, matched_count, unmatched_count`, and into `scan_raw`/`container_scans` a `barcode` column. None of these are in the committed `.sql`. Likewise the `transactions` audit table (below) is created out-of-band. The live database has these; a fresh build from the committed files does not.

### 4.4.6 `transactions` (audit trail) — runtime-only

Not in the committed schema files, but written by `chem_service.log_transaction` and read by `get_transactions`. Inferred shape from the SQL:

```sql
transactions (
  transaction_id  <serial> PK,
  action          TEXT,        -- 'ADD' | 'MOVE' | 'BULK_MOVE' | 'EDIT' | 'REMOVE' | 'SCAN_UPLOAD'
  container_id    BIGINT,
  barcode         TEXT,
  item_id         INTEGER,
  room_id         INTEGER,
  details         JSON/JSONB,  -- json.dumps(details dict); queried via details::json->>'key'
  performed_by    TEXT,
  created_at      TIMESTAMP    -- set to NOW()
)
```

`details` is serialized with `json.dumps` and queried with `t.details::json->>'reason'` etc., so the column must be castable to `json` (TEXT or JSON/JSONB).

### 4.4.7 Views

Defined in `chem_schema.sql` (and refreshed in the v2 migration):

- **`inventory_view`** — denormalized container × item × vendor × room × category. Intended for list/search, though `chem_service.search_inventory` currently queries the base tables directly with its own joins.
- **`v_all_containers`** — a lighter denormalized container view.
- **`v_cycle_report`** — per-cycle FOUND/NEW/MISSING counts.

### 4.4.8 Foreign-key / cascade behavior

| Relationship | ON DELETE | Effect |
|--------------|-----------|--------|
| `items.category_id → categories` | RESTRICT | Can't delete a category with items. |
| `items.vendor_id → vendors` | SET NULL | Deleting a vendor nulls the item link; item survives. |
| `containers.item_id → items` | CASCADE | Deleting an item deletes its containers. |
| `containers.room_id → rooms` | SET NULL | Deleting a room nulls container location; container survives. |
| `scan_raw.cycle_id`, `container_scans.cycle_id → inventory_cycles` | CASCADE | Deleting a cycle deletes its scans. |
| `scan_raw.matched_container_id → containers` | SET NULL | Deleting a container nulls raw-scan matches. |
| `container_scans.container_id → containers` | CASCADE | Deleting a container deletes its matched scans. |

Note: the application uses **soft delete** (`status='REMOVED'`) rather than `DELETE`, so these cascades rarely fire in normal operation.

## 4.5 Entity-relationship summary (chem)

```
categories 1───N items 1───N containers N───1 rooms
                   │                  │
                   └──N───1 vendors   └──1───N container_scans N───1 inventory_cycles
                                                                          │
                                       scan_raw N──────────────────1 ────┘
   transactions  ── references container_id / item_id / room_id (loose, no enforced FK in runtime usage)
```

## 4.6 On-disk CSV data (not a database, but authoritative)

Several features persist to CSV under `LOG_DATA_DIR` (`LogData/`). These are documented fully in `09` §9.7; summary:

| Path | Written by | Content |
|------|-----------|---------|
| `LogData/particle_sensors/<room>_<sensor>_historical.csv` | `api.log_historical_particle_data` | Particle time series (append-only) |
| `LogData/env_sensors/<room>_<sensor>_historical.csv` | `api` env/sensor handlers | Temp/humidity time series |
| `LogData/sensors/<room>_<sensor>_combined.csv` | (read by GET /sensor-data; **not currently written** — see known-issues) | Combined series |
| `LogData/Paralyne/temp/<session>/batch_NNNN.csv` | `api.handle_csv_batch` | In-flight Parylene batches |
| `LogData/Paralyne/analog/<ts>_SDSLOG_combined_<session>.csv` | `api.combine_csv_batches_final` | Finalized Parylene runs |
| `LogData/denton18/pumpdata/<ts>_DENTON18PUMPLOG.csv` | `api.denton18_pump` | Denton 18 vacuum log per run |
| `HSCDATA/small_<Machine>_DataCollection.csv` | `HSCDownloader.py` (pulls from CORES n8n on a schedule) — see `documentation/UNanofabTools/hscdownloader/` | Per-machine summary tables |
| `LogData/<MACHINE>/...` (raw machine logs) | per-machine transfer scripts on the tool's PC — see `documentation/UNanofabTools/filetransfer/` | Raw run-log files pushed via `pscp` over SSH |

Continue to 05-http-api-reference.md (repo path: documentation/UNanofabTools/flaskserver/05-http-api-reference.md).


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 09 — Chemical Inventory

The chemical inventory is the largest single feature on the server. It tracks every chemical container ("bottle") in the lab — what's inside, who owns it, where it lives, when it expires, when it was last seen during a scan, and a paper-trail of every move/edit/scan/removal.

Two files:

- `app/blueprints/chem_inventory.py` — the URL routes (`/chem/...`).
- `app/services/chem_service.py` — the database logic (the biggest service in the codebase, ~1600 lines).

And a database schema file `chem_schema.sql` that describes the PostgreSQL tables.

This document covers:

1. The domain model (categories, vendors, rooms, items, containers, scans, cycles, transactions).
2. The URL routes and what users do on each page.
3. Highlights from the service layer.
4. How barcode generation and scan imports work.

A separate look at the raw schema is in this same document at the end — there's no separate `10-Schema.md`; the schema is small enough to live here.

## The mental model

Take a moment to absorb the entity diagram before reading code:

```
   ┌──────────────┐ 1     N ┌────────────┐
   │  categories  │─────────│   items    │            "Chemicals" → many bottles types
   └──────────────┘         │ (chemicals)│            Item = "Acetone, ACS grade"
                            └──────┬─────┘            unique by name
                                   │ 1
                            ┌──────┴─────┐
                            │            │ N
                            ▼            ▼
                       ┌──────────┐ ┌────────────────┐
                       │ vendors  │ │  containers    │  ← individual bottles!
                       │ (1 each) │ │  (the bottle)  │     each has its own barcode
                       └──────────┘ └────┬───────────┘
                                         │ N
                                         │
                                         ▼
                                  ┌──────────────────┐
                                  │ container_scans  │   ← "this bottle was seen on this date"
                                  └────────┬─────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │ inventory_cycles │   ← a scan-day / scan-event
                                  └──────────────────┘

   ┌──────────────┐ N      1 ┌────────────────┐
   │   rooms      │──────────│  containers    │       a bottle lives in one room
   └──────────────┘          └────────────────┘
```

In English: a **container** (one physical bottle) belongs to an **item** (the chemical it holds, like "Sulfuric Acid 98%"), comes from a **vendor**, and sits in a **room**. Every time someone walks around with a scanner, those scans are grouped into an **inventory cycle**, and each successful match becomes a **container_scan** row tied back to a specific container.

Everything else — barcode printing, expiration reports, transactions log — hangs off this skeleton.

## The PostgreSQL schema in plain English

The schema lives in `chem_schema.sql`. (There's a v2 migration too, `chem_schema_migration_v2.sql`, that adds fields like `label_printed`.)

### Tables

| Table | What it stores | Notes |
|-------|----------------|-------|
| `categories` | High-level chemical group: "Chemicals", "Acids", "Solvents" | A small lookup table |
| `vendors` | Sigma, VWR, Avantor, etc. | Unique by `vendor_name` |
| `rooms` | Each storage room: number, name, description, area-classification | Multiple containers per room |
| `items` | One row per chemical product (not per bottle) | Unique by `name`; references `categories` and optionally `vendors` |
| `containers` | One row per physical bottle | The big table; references `items` and `rooms`; has barcode, dates, location, lot, owner, etc. |
| `inventory_cycles` | One row per scan session ("audit") | Has a start time, end time, and the user who created it |
| `scan_raw` | Every raw barcode scanned during a cycle | Lets you trace "this label was seen" even if no container matched |
| `container_scans` | Resolved scans (raw + matched container) with `'FOUND'` or `'NEW'` status | Unique on (cycle, container) so a bottle can't double-count in one cycle |
| `transactions` (added later) | Every ADD/MOVE/EDIT/REMOVE/SCAN_UPLOAD action | The paper trail. Columns: action, container_id, barcode, item_id, room_id, details (JSON), performed_by, created_at |

### The "sequence" for barcodes

```sql
CREATE SEQUENCE IF NOT EXISTS seq_barcode
  START WITH 100001 INCREMENT BY 1 NO MINVALUE NO MAXVALUE;
```

A Postgres sequence — a thread-safe ever-incrementing counter. Each new container's barcode is just the next sequence value. Starting at 100001 keeps every barcode 6 digits.

### Views

Two important views are defined:

- **`inventory_view`** — denormalized join of containers + items + vendors + rooms + categories. Most "list / search inventory" queries point at this so templates don't have to re-write the join every time.
- **`v_cycle_report`** — per-cycle counts of FOUND, NEW, and MISSING containers.

### A caveat: the committed schema is behind the live database

Worth knowing if you ever rebuild this database from scratch: the live code in `chem_service.py` reads and writes several columns and one whole table that are **not** present in either committed `.sql` file (`chem_schema.sql` or `chem_schema_migration_v2.sql`). Examples the code relies on but the committed schema doesn't define:

- `containers.last_scan_at` (set during scan imports, read by inventory search)
- `containers.removed_at`, `removed_by`, `remove_reason`, `remove_notes` (used by the soft-delete remove flow)
- The extended `inventory_cycles` columns: `filename`, `performed_by`, `report_name`, `location`, `total_scanned`, `matched_count`, `unmatched_count`
- A `barcode` column on `scan_raw` and on `container_scans`
- The entire `transactions` audit table

In other words, the production Postgres database has had columns added over time (via ad-hoc `ALTER TABLE` statements that were never committed back to the `.sql` files). The committed schema captures the original v1 + v2 shape; the live database is a few steps ahead. If someone tried to stand up a fresh database using only the committed `.sql` files, several features would fail until those missing columns/tables were added. This is a maintenance gap worth closing by writing the missing migrations.

### Foreign-key behavior

A few interesting `ON DELETE` clauses:

- Deleting an **item** cascades to its **containers** (`ON DELETE CASCADE`).
- Deleting a **vendor** just nullifies the link on `items.vendor_id` (`ON DELETE SET NULL`) — the item survives.
- Deleting a **room** just nullifies the link on `containers.room_id` — the bottle survives (it just has no current room).
- `ON DELETE RESTRICT` on the items.category_id link prevents deleting a category that still has items.

These choices reflect what's destructive in the real world: deleting a chemical product really does mean the bottles are gone; deleting a room or vendor record shouldn't lose the bottles.

## The routes — `chem_inventory.py`

The blueprint is registered with `url_prefix='/chem'`, so every route below is under `/chem`.

```python
chem_bp = Blueprint('chem', __name__, url_prefix='/chem')
```

I'll group the routes by purpose.

### View / search inventory

```python
@chem_bp.route('/')
@chem_bp.route("/inventory")
def inventory():
    service = ChemInventoryService()
    q = request.args.get("q", "").strip()
    limit = int(request.args.get("limit", 500))
    show_removed = request.args.get("show_removed", "0") == "1"

    rows = service.search_inventory(q, limit, show_removed=show_removed)

    return render_template(
        "chem/inventory.html",
        rows=rows,
        q=q,
        limit=limit,
        show_removed=show_removed,
    )
```

The main inventory page. Three URL params:

- **`q`** — search query (matches against many fields; see `search_inventory` below).
- **`limit`** — how many rows to show (default 500).
- **`show_removed`** — if `1`, include removed containers in the list. By default, removed containers are hidden.

Note this route carries no `@login_required` decorator, but as of 2026-06-25 the **entire `/chem` blueprint is gated by a `before_request` hook**: every chem page (this one included) requires a session granted via `/chem/enter`, which validates a signed link from the WordPress staff-tools page. Inventory views are no longer public — read and write are both behind the WordPress SSO gate (separate from the site's Duo login).

### Print-friendly view

```python
@chem_bp.route('/inventory/print')
def inventory_print():
    """Print-friendly inventory view"""
    q = request.args.get("q", "").strip()
    limit = request.args.get("limit", type=int, default=5000)

    service = ChemInventoryService()
    rows = service.search_inventory(q, limit)

    return render_template("chem/inventory_print.html", rows=rows, q=q, limit=limit)
```

A version of the same data styled for a printer (no buttons, larger limit).

### CSV export

```python
@chem_bp.route("/inventory/export.csv")
def inventory_export_csv():
    q = request.args.get("q", "").strip()
    limit = request.args.get("limit", type=int, default=500000)

    service = ChemInventoryService()
    csv_text = service.export_inventory_csv(q, limit)

    return Response(
        csv_text,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=cheminventory_export.csv"},
    )
```

Builds the entire (possibly filtered) inventory as a CSV string and returns it with `Content-Disposition: attachment` so the browser saves it as `cheminventory_export.csv`.

### Add containers

```python
@chem_bp.route('/add', methods=["GET", "POST"])
def add():
    """Add new chemical containers"""
    if request.method == "POST":
        data = {
            # Material
            'name': (request.form.get("name") or "").strip(),
            'vendor_name': (request.form.get("vendor") or "").strip(),
            'catalog': (request.form.get("catalog") or "").strip(),
            'state': (request.form.get("state") or "").strip(),
            'size': (request.form.get("size") or "").strip(),
            'unit': (request.form.get("unit") or "").strip(),
            'system': (request.form.get("system") or "").strip(),
            'lot_number': (request.form.get("lot_number") or "").strip(),

            # Quantity
            'qty': max(1, min(int(request.form.get("qty") or "1"), 500)),

            # Location
            'area_class': (request.form.get("area_class") or "").strip(),
            ...
        }

        if not data['name']:
            flash("Material Name is required.", "warning")
            return redirect(url_for("chem.add"))

        try:
            service = ChemInventoryService()
            new_barcodes = service.add_containers(data)
            flash(f"Added {len(new_barcodes)} container(s). Unique barcodes assigned.", "success")
            return redirect(url_for("chem.barcode_queue", preselect=",".join(new_barcodes)))
        except Exception as e:
            flash(f"Error adding containers: {str(e)}", "error")
            return redirect(url_for("chem.add"))

    return render_template("chem/add.html")
```

What's happening:

- The form is large — material info, location info, dates, ownership, plus a `qty` that lets you add **N** containers in one submission (capped to 500 via the `max(1, min(qty, 500))` clamp).
- After insert, the user is redirected to the **barcode queue** page with the new barcodes preselected, so they can print labels immediately.
- The hard requirement is just `name`. Everything else is optional.

`service.add_containers` (covered below) handles inserting all the linked rows (vendor, room, item, container) atomically.

### Bulk move / individual move

```python
@chem_bp.route("/move", methods=["GET", "POST"])
def move_material():
    if request.method == "POST":
        barcode = (request.form.get("barcode") or "").strip()

        room_no = (request.form.get("room_no") or "").strip()
        room_desc = (request.form.get("room_desc") or "").strip()
        area_class = (request.form.get("area_class") or "").strip()

        storage_location = (request.form.get("storage_location") or "").strip()
        storage_sublocation = (request.form.get("storage_sublocation") or "").strip()
        storage_device = (request.form.get("storage_device") or "").strip()

        user = None
        if current_user.is_authenticated:
            user = current_user.username
        else:
            user = (request.form.get("performed_by") or "").strip() or None

        if not barcode:
            flash("Barcode is required.", "warning")
            return redirect(url_for("chem.move_material"))

        try:
            service = ChemInventoryService()
            service.move_container(
                barcode=barcode,
                room_no=room_no,
                room_desc=room_desc,
                area_class=area_class,
                storage_location=storage_location,
                storage_sublocation=storage_sublocation,
                storage_device=storage_device,
                moved_by=user,
            )
            flash(f"Moved {barcode}.", "success")
            return redirect(url_for("chem.inventory", q=barcode))
        ...
```

`/chem/move` handles one bottle at a time. There's also `/chem/move-bulk` that accepts a textbox full of barcodes and moves them all to the same destination.

Notice the user-attribution fallback: if the user is logged in, attribute the move to them; otherwise accept a `performed_by` text field. This makes the page usable without login but still records who did it.

### Remove containers

```python
@chem_bp.route("/remove", methods=["GET", "POST"])
def remove():
    service = ChemInventoryService()

    if request.method == "POST":
        raw_barcodes = (request.form.get("barcode") or "").strip()
        performed_by = (request.form.get("performed_by") or "").strip()
        reason = (request.form.get("reason") or "").strip()
        notes = (request.form.get("notes") or "").strip()

        if not raw_barcodes:
            flash("Please scan or enter at least one barcode.", "warning")
            return redirect(url_for("chem.remove"))

        result = service.remove_containers_by_barcodes(
            raw_barcodes=raw_barcodes,
            removed_by=performed_by or None,
            reason=reason or None,
            notes=notes or None,
        )
        ...
```

"Remove" doesn't physically delete the row — it marks the container as `status='REMOVED'`. By default, removed containers are filtered out of inventory views. This is **soft delete**, a common pattern when you want auditability — the data is still there for reports and historical exports.

The endpoint accepts one or many barcodes in one textarea (the service splits them by newline/comma).

### Edit a container

```python
@chem_bp.route("/edit", methods=["GET"])
def edit():
    return render_template("chem/edit.html")


@chem_bp.route("/edit-container", methods=["POST"])
def edit_container():
    container_id = request.form.get("container_id")
    ...
    data = {
        "item_name": request.form.get("item_name"),
        "description": request.form.get("description"),
        ...
    }

    service = ChemInventoryService()
    service.update_container(container_id, data)

    flash("Updated successfully", "success")
    return redirect(url_for("chem.edit"))
```

A two-step UX: the user looks up a barcode on `/chem/edit`, the page fetches its data via `/chem/api/container_lookup`, the user edits the fields and POSTs back to `/chem/edit-container`.

### Barcode queue / printing

```python
@chem_bp.route('/barcodes/queue')
def barcode_queue():
    ...
    rows = service.get_barcode_queue(q, only_unprinted, limit)
    ...
    return render_template("chem/barcode_queue.html", ...)


@chem_bp.route('/barcodes/print')
def barcode_print():
    """Print barcode labels"""
    ...
    copies = max(1, int(request.args.get('copies', 1)))
    ...
    labels = service.get_barcode_labels(q, copies, limit)
    pages = [labels[i:i+30] for i in range(0, len(labels), 30)] if labels else [[]]
    return render_template("chem/barcode_print.html", pages=pages, q=q, copies=copies)


@chem_bp.route('/barcodes/mark-printed', methods=['POST'])
def barcode_mark_printed():
    """Mark selected barcodes as printed"""
    barcodes = request.form.getlist('barcode')
    ...
    count = service.mark_barcodes_printed(barcodes)
    flash(f"Marked {count} barcode(s) as printed.", "success")
    return redirect(url_for('chem.barcode_queue'))
```

Three pieces:

- **`/barcodes/queue`** — list barcodes pending printing.
- **`/barcodes/print`** — render a printable HTML page laid out as 5×6 grids of labels (30 per page).
- **`/barcodes/mark-printed`** — toggle `label_printed=TRUE` on the selected containers.

The `print-selected` route is a small redirector that takes selected barcodes from the queue and feeds them into the print page.

### Scan upload

```python
@chem_bp.route("/upload-scans", methods=["GET", "POST"])
def upload_scans():
    if request.method == "POST":
        user = (request.form.get("user") or "").strip()
        report_name = (request.form.get("report_name") or "").strip()
        location = (request.form.get("location") or "").strip()
        barcode_text = (request.form.get("barcode_text") or "").strip()

        uploaded_file = request.files.get("file")

        lines = []

        # 1) Barcode textbox input
        if barcode_text:
            lines.extend(
                [line.strip() for line in barcode_text.splitlines() if line.strip()]
            )

        # 2) Optional txt file input
        filename = None
        if uploaded_file and uploaded_file.filename:
            filename = uploaded_file.filename
            file_text = uploaded_file.read().decode("utf-8", errors="ignore")
            lines.extend(
                [line.strip() for line in file_text.splitlines() if line.strip()]
            )

        # Remove duplicates while preserving order
        seen = set()
        barcodes = []
        for line in lines:
            if line not in seen:
                seen.add(line)
                barcodes.append(line)
        ...
        result = service.import_scans(
            barcodes=barcodes,
            filename=filename,
            performed_by=user or None,
            report_name=report_name,
            location=location or None,
        )
        ...
```

This is the page where a user uploads the barcodes they've just scanned in a room. Two input modes are accepted simultaneously:

- A textbox they can paste into.
- An optional `.txt` file from their handheld scanner.

The combined lines are de-duplicated *while preserving order* (the `seen` set trick). Empty lines are skipped.

The combined list goes to `service.import_scans`, which inserts an `inventory_cycle` row, then one `scan_raw` row per barcode, and (for matched barcodes) a `container_scans` row + an update of the container's `last_scan_at`.

### Reports

```python
@chem_bp.route("/report")
def report():
    service = ChemInventoryService()

    totals = service.report_totals()
    expiring = service.report_expiring()
    expired = service.report_expired()
    nmr_due = service.report_nmr_due()
    by_room = service.report_by_room()
    by_vendor = service.report_by_vendor()
    by_system = service.report_by_system()
    by_owner = service.report_by_owner()

    scan_reports = service.get_scan_reports()
    coverage_rows = service.get_inventory_scan_coverage()

    scanned_count = sum(1 for row in coverage_rows if row["scan_status"] == "SCANNED")
    unscanned_count = sum(1 for row in coverage_rows if row["scan_status"] == "UNSCANNED")
    total_count = len(coverage_rows)

    return render_template(
        "chem/report.html",
        ...
    )
```

A single dashboard route that fetches **ten** different aggregations and renders them all. Each aggregation is a separate SQL query inside the service. The page is heavy on the database — every visit re-runs all of these — but since the data is in Postgres with proper indexes, it stays fast enough for a small inventory.

The `scan_coverage` query is interesting: it returns one row per active container, with a `scan_status` of `'SCANNED'` or `'UNSCANNED'` based on whether it appears in the latest cycle. The Python then tallies how many fell into each bucket.

### Transactions log

```python
@chem_bp.route("/transactions")
def transactions():
    q = (request.args.get("q") or "").strip()
    limit = 1000
    service = ChemInventoryService()
    rows = service.get_transactions(q=q, limit=limit)
    return render_template("chem/transactions.html", rows=rows, q=q, limit=limit)
```

Shows the audit trail. Every ADD/MOVE/EDIT/REMOVE/SCAN_UPLOAD action recorded by `log_transaction` ends up in the `transactions` table and shows up here.

### Small API endpoints

```python
@chem_bp.route('/api/inventory_json')
def api_inventory():
    """API endpoint for inventory data"""
    q = request.args.get('q', '').strip()
    limit = request.args.get('limit', type=int) or 500

    service = ChemInventoryService()
    rows = service.search_inventory(q, limit)

    return jsonify({'rows': [dict(r) for r in rows]})


@chem_bp.route("/api/suggest")
def api_suggest():
    field = (request.args.get("field") or "").strip()
    q = (request.args.get("q") or "").strip()
    limit = request.args.get("limit", type=int, default=10)

    service = ChemInventoryService()
    results = service.suggest(field, q, limit)
    return jsonify({"results": results})


@chem_bp.route("/api/autofill")
def api_autofill():
    catalog = (request.args.get("catalog") or "").strip()
    name = (request.args.get("name") or "").strip()

    service = ChemInventoryService()
    data = service.autofill(catalog=catalog, name=name)
    return jsonify({"data": data})


@chem_bp.route("/api/container_lookup")
def container_lookup():
    barcode = (request.args.get("barcode") or "").strip()
    ...
    with service.engine.begin() as conn:
        row = conn.execute(text("""..."""), {"barcode": barcode}).mappings().first()

    return jsonify({"data": dict(row) if row else None})
```

Three small JSON endpoints used by the front-end JavaScript:

- **`/api/inventory_json`** — same data as the HTML inventory page, but as JSON.
- **`/api/suggest`** — intended for type-ahead lists (a `field` name plus a partial query). Note: the underlying `suggest` service method is currently a stub returning an empty list, so this endpoint always responds with `{"results": []}`.
- **`/api/autofill`** — intended to look up an item by catalog number or name and return its known fields so the **Add** page can auto-fill. Note: the underlying `autofill` service method is currently a stub returning an empty object, so this endpoint always responds with `{"data": {}}`.
- **`/api/container_lookup`** — given a barcode, returns the full denormalized record. Used by the **Edit** page.

The `container_lookup` SQL is a good example of the joins used throughout this module:

```sql
SELECT
    c.container_id, c.item_id, c.room_id, c.barcode, c.container_code,
    i.name AS item_name, i.description, i.catalog_number, i.physical_state,
    COALESCE(c.size, i.volume_size) AS size, c.unit, c.system,
    v.vendor_name,
    r.room_no, r.room_name, r.room_desc,
    COALESCE(c.area_class, r.area_class) AS area_class,
    c.storage_location, c.storage_sublocation, c.storage_device,
    c.manuf_date, c.expiry_date, c.lot_number, c.choice,
    c.nmr, c.nmr_expiry, c.owner, c.notes, c.added_by
FROM containers c
LEFT JOIN items i   ON c.item_id   = i.item_id
LEFT JOIN vendors v ON i.vendor_id = v.vendor_id
LEFT JOIN rooms r   ON c.room_id   = r.room_id
WHERE c.barcode = :barcode
LIMIT 1
```

Two things to notice:

- **`COALESCE(c.size, i.volume_size)`** — the container can override the item's default size, but if it doesn't, fall back to the item's value. Same trick for area_class.
- **The placeholder `:barcode`** is bound separately, never spliced into the string. SQL injection-proof.

## The service — `chem_service.py`

The service is one big class, `ChemInventoryService`. It stores a SQLAlchemy `Engine` (created lazily) and exposes one method per operation. Below are highlights — there's too much code to cover every method, but the patterns repeat.

### Engine setup with fallback

```python
def get_chem_engine():
    """Create or return the global chemical database engine"""
    global _chem_engine
    if _chem_engine is None:
        try:
            host = current_app.config.get("CHEM_PGHOST", "localhost")
            ...
        except RuntimeError:
            load_dotenv()
            host = os.getenv("CHEM_PGHOST", os.getenv("PGHOST", "localhost"))
            ...

        url = f"postgresql+psycopg2://{user}:{pwd}@{host}:{port}/{db}"
        _chem_engine = create_engine(url, pool_pre_ping=True, pool_size=5, max_overflow=10, future=True)

    return _chem_engine
```

The engine is a process-wide global. The first call creates it; subsequent calls reuse the same one. `pool_pre_ping=True` makes the pool gracefully recover from a dropped DB connection. `pool_size=5, max_overflow=10` permits up to 15 concurrent connections.

The `except RuntimeError` is for situations where the chemical service is used from a standalone Python script (e.g. a one-off migration tool) outside of a Flask app context. In that case, fall back to reading env vars directly.

### Tiny helpers

```python
def _upsert(self, conn, table, key_col, value, id_col=None):
    """Insert or get existing record by unique column"""
    if value is None or str(value).strip() == "":
        return None

    if id_col is None:
        id_map = {
            "categories": "category_id",
            "vendors": "vendor_id",
            ...
        }
        id_col = id_map.get(table, f"{table[:-1]}_id")

    val = str(value).strip()
    row = conn.execute(
        text(f"SELECT {id_col} FROM {table} WHERE {key_col}=:v"),
        {"v": val}
    ).fetchone()

    if row:
        return row[0]

    return conn.execute(
        text(f"INSERT INTO {table}({key_col}) VALUES (:v) RETURNING {id_col}"),
        {"v": val}
    ).scalar()
```

A general-purpose "make sure this lookup row exists, return its ID" helper. Used everywhere to upsert vendor and category names.

```python
def _next_barcode(self, conn):
    """Generate next barcode from sequence"""
    return str(conn.execute(text("SELECT nextval('seq_barcode')")).scalar())
```

One line — calls Postgres's `nextval('seq_barcode')`, which atomically increments the sequence and returns the new value. **This is why barcodes are unique even under concurrent inserts**: Postgres guarantees it at the DB level.

### Room resolution

The function `resolve_room_id` is the most-touched piece of logic — it gets called by every `add_containers` and `move_container`. The rules are layered to handle messy real-world input:

1. If `room_no` is given, look up by it; if found, update missing fields from the form and return the ID.
2. Else try `room_desc` (description).
3. Else try `room_name`.
4. Else create a new room with whatever we have.

The full code is in lines 94–220 of `chem_service.py`. The pattern: try several lookup strategies in order; only create a new row if nothing matched. This avoids duplicate room records when users type a known room slightly differently.

### Searching inventory — `search_inventory`

```python
def search_inventory(self, query="", limit=500, show_removed=False):
    q = (query or "").strip()
    like = f"%{q}%"

    sql = """
        SELECT
            c.container_id, c.item_id, c.room_id,
            c.area_class, c.storage_location, ...
            c.barcode, c.size, c.unit, c.system, c.status,
            c.created_at, c.last_scan_at AS scan_date,
            i.name, i.catalog_number, i.physical_state,
            v.vendor_name AS vendor,
            r.room_no, r.room_name
        FROM containers c
        LEFT JOIN items i   ON c.item_id   = i.item_id
        LEFT JOIN vendors v ON i.vendor_id = v.vendor_id
        LEFT JOIN rooms r   ON c.room_id   = r.room_id
        WHERE 1=1
    """

    params = {"limit": limit}

    if not show_removed:
        sql += " AND COALESCE(c.status, 'ACTIVE') != 'REMOVED' "

    if q:
        sql += """
            AND (
                COALESCE(i.name, '') ILIKE :like
                OR COALESCE(i.catalog_number, '') ILIKE :like
                OR COALESCE(v.vendor_name, '') ILIKE :like
                OR COALESCE(c.barcode, '') ILIKE :like
                OR COALESCE(c.lot_number, '') ILIKE :like
                ...
            )
        """
        params["like"] = like

    sql += " ORDER BY i.name NULLS LAST, c.barcode NULLS LAST LIMIT :limit"

    with self.engine.begin() as conn:
        rows = conn.execute(text(sql), params).mappings().all()

    return rows
```

Three things make this worth annotating:

- **`WHERE 1=1`** is a trick that lets you append `AND ...` conditionally without worrying about the first one needing `WHERE` instead. Always true, no overhead.
- **`ILIKE`** is Postgres's case-insensitive LIKE. `'%q%'` matches anywhere in the string.
- **The `OR ... OR ... OR ...`** lets a single search box query against many columns. Slow on huge tables; fine for a few thousand containers.
- **`.mappings().all()`** returns rows as dictionaries instead of tuples, which the template uses by key.

### Adding containers — `add_containers`

```python
def add_containers(self, data):
    """Add new chemical containers - returns list of new barcodes"""
    with self.engine.begin() as conn:
        cat_id = self._upsert(conn, "categories", "name", "Chemicals")
        vendor_id = self._upsert(conn, "vendors", "vendor_name", data['vendor_name']) if data['vendor_name'] else None

        room_id = self.resolve_room_id(
            conn,
            data.get("room_no"),
            data.get("room_desc") or data.get("room_name"),
            data.get("area_class"),
        )

        item_id = conn.execute(text("""
            INSERT INTO items(name, description, catalog_number, physical_state, volume_size, vendor_id, category_id)
            VALUES (:n, :n, :c, :s, :sz, :vid, :cat)
            ON CONFLICT (name) DO UPDATE
                SET vendor_id      = COALESCE(items.vendor_id,      EXCLUDED.vendor_id),
                    category_id    = COALESCE(items.category_id,    EXCLUDED.category_id),
                    catalog_number = COALESCE(items.catalog_number, EXCLUDED.catalog_number),
                    physical_state = COALESCE(items.physical_state, EXCLUDED.physical_state),
                    volume_size    = COALESCE(items.volume_size,    EXCLUDED.volume_size)
            RETURNING item_id
        """), {...}).scalar()

        # Create N containers with unique barcodes
        qty = data.get('qty', 1)
        new_barcodes = []

        for _ in range(qty):
            bc = self._next_barcode(conn)
            new_barcodes.append(bc)

            result = conn.execute(text("""
                INSERT INTO containers(...) VALUES (...)
                RETURNING container_id
            """), {...})

            container_id = result.scalar()

            self.log_transaction(...)

        return new_barcodes
```

This is the canonical example of how the service stays atomic:

- **`with self.engine.begin() as conn`** — opens a transaction. Everything inside runs as one unit; if anything raises, the whole block rolls back.
- Upsert categories, vendors, rooms, items. None of those duplicate.
- The `ON CONFLICT (name) DO UPDATE` clause is Postgres's UPSERT. If a row with that item name already exists, the columns that were `NULL` get filled in from the form. Existing non-null values are preserved (thanks to `COALESCE`).
- Then loop `qty` times: pull the next barcode from the sequence, insert a container, log a transaction. Each barcode is its own DB call but it's all in one transaction.

If anything in this whole block fails halfway through, you don't get half-written containers. Good design.

### Scan import — `import_scans`

```python
def import_scans(self, barcodes, filename=None, performed_by=None, report_name=None, location=None):
    cleaned = [b.strip() for b in barcodes if b and b.strip()]
    total = len(cleaned)

    with self.engine.begin() as conn:
        cycle_row = conn.execute(text("""
            INSERT INTO inventory_cycles (
                filename, performed_by, report_name, location, total_scanned
            )
            VALUES (
                :filename, :performed_by, :report_name, :location, :total_scanned
            )
            RETURNING cycle_id
        """), {...}).fetchone()

        cycle_id = cycle_row[0]

        matched = 0
        unmatched = 0

        for barcode in cleaned:
            container = conn.execute(text("""
                SELECT container_id FROM containers WHERE barcode = :barcode LIMIT 1
            """), {"barcode": barcode}).fetchone()

            matched_container_id = container[0] if container else None

            conn.execute(text("""
                INSERT INTO scan_raw (cycle_id, raw_code, barcode, matched_container_id)
                VALUES (:cycle_id, :raw_code, :barcode, :matched_container_id)
            """), {...})

            if matched_container_id:
                matched += 1
                conn.execute(text("""
                    INSERT INTO container_scans (
                        container_id, cycle_id, barcode, source, status
                    )
                    VALUES (
                        :container_id, :cycle_id, :barcode, 'UPLOAD', 'FOUND'
                    )
                """), {...})

                conn.execute(text("""
                    UPDATE containers SET last_scan_at = NOW() WHERE container_id = :container_id
                """), {...})
            else:
                unmatched += 1

        conn.execute(text("""
            UPDATE inventory_cycles
            SET matched_count = :matched, unmatched_count = :unmatched
            WHERE cycle_id = :cycle_id
        """), {...})

        self.log_transaction(conn, action="SCAN_UPLOAD", performed_by=performed_by, details={...})

    return {
        "cycle_id": cycle_id,
        "total": total,
        "matched": matched,
        "unmatched": unmatched,
    }
```

The logic for each barcode:

1. Look up the matching container by barcode.
2. Insert a `scan_raw` row (even if no container matched — so unknown labels are still recorded).
3. If matched, insert a `container_scans` row and bump the container's `last_scan_at` to now.
4. If not matched, the `unmatched` counter goes up.

At the end, the cycle's counts are updated, and one summary entry is added to the transactions log.

This whole thing is again in one transaction — if the database dies halfway, the whole scan import is rolled back rather than leaving a half-imported cycle.

### Soft-delete: `remove_containers_by_barcodes`

```python
def remove_containers_by_barcodes(self, raw_barcodes, removed_by=None, reason=None, notes=None):
    ...
    with self.engine.begin() as conn:
        # parse comma/newline-separated barcodes
        bclist = ...

        not_found = []
        removed_count = 0
        for bc in bclist:
            row = conn.execute(text("SELECT container_id FROM containers WHERE barcode = :b"), {"b": bc}).fetchone()
            if not row:
                not_found.append(bc)
                continue

            conn.execute(text("""
                UPDATE containers
                SET status = 'REMOVED',
                    removed_at = NOW(),
                    removed_by = :u,
                    remove_reason = :r,
                    remove_notes = :n
                WHERE container_id = :id
            """), {...})
            self.log_transaction(conn, action="REMOVE", container_id=row[0], barcode=bc,
                                 performed_by=removed_by, details={"reason": reason, "notes": notes})
            removed_count += 1

    return {"removed_count": removed_count, "not_found": not_found}
```

Again: soft delete (`status='REMOVED'`) rather than `DELETE FROM containers`, plus a transaction-log entry. The function returns counts so the route can display "Removed N containers, M not found."

### Many small report methods

The remaining ~20 methods are each a single SQL query that returns a different report shape:

- `report_totals()` — counts of active, expired, etc.
- `report_expiring()` — bottles expiring soon.
- `report_expired()` — bottles already expired.
- `report_nmr_due()` — bottles whose NMR check is overdue.
- `report_by_room()`, `report_by_vendor()`, `report_by_system()`, `report_by_owner()` — groupings.
- `get_scan_reports()`, `get_inventory_scan_coverage()` — cycle/coverage rollups.
- `suggest(field, q, limit)` — currently a stub that returns an empty list (the type-ahead feature is not implemented).
- `autofill(catalog, name)` — currently a stub that returns an empty object (the catalog auto-fill feature is not implemented).
- `log_transaction(...)` — INSERTs into `transactions` (the audit table). It serializes the `details` argument to JSON and records the action, container, barcode, item, room, who did it, and a `NOW()` timestamp.

Each is essentially "SQL + return rows". The pattern stays consistent.

## Summary

The chemical inventory is built around five core ideas:

1. **Separate items from containers.** "Acetone" is one item; the 17 bottles of acetone are 17 containers.
2. **Barcodes from a Postgres sequence.** That's how uniqueness is guaranteed under any number of concurrent inserts.
3. **Scans are linked to cycles.** Every audit gets a cycle ID, and every scan is anchored to its cycle.
4. **Soft delete with an audit trail.** Containers are never physically removed; they get `status='REMOVED'`, and every action goes into the `transactions` table.
5. **Atomic operations via SQLAlchemy transactions.** `with self.engine.begin()` blocks make multi-step writes all-or-nothing.

The volume of code is large (~1600 lines in the service), but most of it is small SQL queries. Once you grasp the entity model and the upsert/transaction pattern, the rest reads like a long list of variations on the same theme.

Next: `10-Database-Models.md`.


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/10-Database-Models.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 10 — Database Models

This document explains the database "tables" — what's stored where and how they relate. Most of the tables are defined as SQLAlchemy model classes in `app/models/`. The chemical inventory's PostgreSQL tables are *also* described as model classes (`app/models/chem_inventory.py`), but the chemical inventory blueprint and service mostly use raw SQL through SQLAlchemy's `text()` instead of the ORM. They still serve as documentation of the table shape, though.

## Where each table lives

The application uses **four** SQLite databases plus **one** PostgreSQL database. The four SQLite ones are bound by `__bind_key__` on each model class:

| Database file | Bind key | Tables |
|--------------|----------|--------|
| `signininfo.db` | (default, no bind key) | `signininfo` (User) |
| `sessioninfo.db` | `'sessions'` | `sessioninfo` (Session) |
| `tasks.db` | `'tasks'` | `tasks`, `assignees`, `task_files` |
| `particle_sensors.db` | `'particle_sensors'` | `particle_sensor_data` |
| Postgres `cheminventory` | `'chem_inventory'` (but mostly raw SQL) | `categories`, `vendors`, `rooms`, `items`, `containers`, `inventory_cycles`, `scan_raw`, `container_scans`, `transactions` |

Splitting users / sessions / tasks / sensors across four SQLite files is a legacy choice from the older server; you'd normally keep them all in one. It works fine, just adds a little bookkeeping.

## The User model

```python
class User(UserMixin, db.Model):
    """User model for authentication and authorization"""
    __tablename__ = 'signininfo'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False, name='passwordHash')
    unid = db.Column(db.String(255), unique=True, nullable=False, name='uNID')
    is_admin = db.Column(db.Boolean, default=False, name='isAdmin')
    can_assign = db.Column(db.Boolean, default=False, name='canAssign')

    def __repr__(self):
        return f'<User {self.username}>'
```

Annotated:

- **`UserMixin`** — from Flask-Login. Gives the class methods like `is_authenticated`, `get_id()` etc. that Flask-Login expects. Without it, you'd have to define those by hand.
- **`__tablename__ = 'signininfo'`** — the SQL table name. SQLAlchemy would have guessed `user`; we override it to match the legacy database.
- **`id`** — the primary key. SQLite auto-increments it.
- **`username`** — string, unique, required.
- **`password_hash`** — bcrypt hash. `name='passwordHash'` makes the underlying column name camelCase to match the legacy schema while the Python attribute is snake_case.
- **`unid`** — University ID. Used for Duo and for the password-reset flow.
- **`is_admin` and `can_assign`** — booleans defaulted to false. They're the only permission bits in the system.

## The Session model

```python
class Session(db.Model):
    """Session model for managing user sessions"""
    __tablename__ = 'sessioninfo'
    __bind_key__ = 'sessions'

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

- `__bind_key__ = 'sessions'` says: this table lives in the database mapped to `'sessions'` in `SQLALCHEMY_BINDS`.
- Each row is a (random UUID, username, timestamp) tuple. Compared to Flask's signed-cookie session, this gives us a server-side record that can be cleaned up via `delete_old_sessions` or inspected by admins.

## The Task model

```python
class Task(db.Model):
    """Task model for task management"""
    __tablename__ = 'tasks'
    __bind_key__ = 'tasks'

    task_id = db.Column(db.Integer, primary_key=True)
    task_title = db.Column(db.String(255), nullable=False)
    task_description = db.Column(db.Text)
    task_assign_date = db.Column(db.DateTime, default=datetime.utcnow)
    task_due_date = db.Column(db.DateTime)
    task_priority = db.Column(db.String(50))
    task_assigner = db.Column(db.String(255))
    task_status = db.Column(db.String(50), default='Pending')

    # Relationships
    assignees = db.relationship('TaskAssignee', backref='task', lazy=True, cascade='all, delete-orphan')
    files = db.relationship('TaskFile', backref='task', lazy=True, cascade='all, delete-orphan')
```

- **`db.relationship(...)`** declares two related lists:
  - `task.assignees` → all `TaskAssignee` rows pointing at this task.
  - `task.files` → all `TaskFile` rows for this task.
- **`cascade='all, delete-orphan'`** — if you delete a task, its assignees and file rows go with it. "Orphan" rows (an assignee whose task disappears) are automatically deleted too.
- **`lazy=True`** — the related rows are loaded on first access, not on every Task fetch. Standard SQLAlchemy lazy loading.

> Note from the tasks doc: although the model is defined, the live task code in `task_service.py` uses raw `sqlite3` queries rather than this ORM. The model is mainly documentation and a hook for `db.create_all()` to keep the table shape correct.

## TaskAssignee and TaskFile

```python
class TaskAssignee(db.Model):
    __tablename__ = 'assignees'
    __bind_key__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'), nullable=False)
    assignee_name = db.Column(db.String(255), nullable=False)


class TaskFile(db.Model):
    __tablename__ = 'task_files'
    __bind_key__ = 'tasks'

    file_id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'), nullable=False)
    file_path = db.Column(db.String(512), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
```

Two small join tables. `assignees` is the many-to-many bridge (one task → many assignees, one user → many tasks). `task_files` records each file path linked to a task; the actual file content lives on disk in `UPLOAD_FOLDER`.

`db.ForeignKey('tasks.task_id')` declares the relationship at the DB level — if the tasks DB enforces foreign keys (SQLite has to be told to do so), it will refuse to insert a `TaskAssignee` whose `task_id` doesn't exist.

## The ParticleSensorData model

This one is interesting because the table has **many** columns and the model includes a custom `to_dict()` method for JSON serialization.

```python
class ParticleSensorData(db.Model):
    """Model for storing the most recent particle sensor data from each sensor"""
    __tablename__ = 'particle_sensor_data'
    __bind_key__ = 'particle_sensors'

    id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String(255), nullable=False)
    sensor_number = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    # Raw measurement data
    mass_pm1 = db.Column(db.Float)
    mass_pm2_5 = db.Column(db.Float)
    mass_pm4 = db.Column(db.Float)
    mass_pm10 = db.Column(db.Float)
    num_pm0_5 = db.Column(db.Float)
    num_pm1 = db.Column(db.Float)
    num_pm2_5 = db.Column(db.Float)
    num_pm4 = db.Column(db.Float)
    num_pm10 = db.Column(db.Float)
    typical_particle_size_um = db.Column(db.Float)

    # Converted values (ft³ measurements)
    num_pm0_5_ft3 = db.Column(db.Float)
    num_pm1_ft3 = db.Column(db.Float)
    num_pm2_5_ft3 = db.Column(db.Float)
    num_pm4_ft3 = db.Column(db.Float)
    num_pm10_ft3 = db.Column(db.Float)

    # Differential bins (ft³)
    bin_0_3_to_0_5 = db.Column(db.Float)
    bin_0_5_to_1_0 = db.Column(db.Float)
    bin_1_0_to_2_5 = db.Column(db.Float)
    bin_2_5_to_4_0 = db.Column(db.Float)
    bin_4_0_to_10 = db.Column(db.Float)

    # Mass concentrations (μg/m³)
    mass_pm1_ug_m3 = db.Column(db.Float)
    mass_pm2_5_ug_m3 = db.Column(db.Float)
    mass_pm4_ug_m3 = db.Column(db.Float)
    mass_pm10_ug_m3 = db.Column(db.Float)

    # Environmental data (from DHT22 sensor, optional)
    temperature_c = db.Column(db.Float, nullable=True)
    humidity_pct = db.Column(db.Float, nullable=True)

    # Create a unique constraint on room_name and sensor_number
    __table_args__ = (
        db.UniqueConstraint('room_name', 'sensor_number', name='unique_sensor_location'),
    )
```

The columns are grouped by what they measure:

- **Identification** — `room_name`, `sensor_number`, `timestamp`, `last_updated`.
- **Raw measurements from the SPS30** — particle mass and counts at PM0.5 / PM1 / PM2.5 / PM4 / PM10 size cutoffs, plus the typical particle size.
- **Converted number-concentration values in ft³** — the same number counts but in #/ft³ instead of #/cm³.
- **Differential bins in ft³** — particles falling between successive size cutoffs, useful for histograms.
- **Mass concentrations in μg/m³** — air-quality measure at four size cutoffs.
- **Environmental** — optional DHT22 temperature and humidity.

`__table_args__` adds a **unique constraint on (room_name, sensor_number)**. That's what makes the API's "upsert" pattern work: you can't have two rows for the same sensor location; instead the API updates the existing row. The "history" of readings lives in CSV files, not in this table.

### `to_dict()` for JSON output

```python
def to_dict(self):
    """Convert the model to a dictionary for JSON serialization"""
    return {
        'id': self.id,
        'room_name': self.room_name,
        'sensor_number': self.sensor_number,
        'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        'last_updated': self.last_updated.isoformat() if self.last_updated else None,
        'temperature_c': self.temperature_c,
        'humidity_pct': self.humidity_pct,
        'raw_measurements': {
            'mass_pm1': self.mass_pm1,
            ...
        },
        'converted_values': {
            'number_concentrations_ft3': {
                'pm0_5': self.num_pm0_5_ft3,
                ...
            },
            'differential_bins_ft3': {
                'bin_0_3_to_0_5': self.bin_0_3_to_0_5,
                ...
            },
            'mass_concentrations_ug_m3': {
                'pm1': self.mass_pm1_ug_m3,
                ...
            }
        }
    }
```

This method shapes the row into the same nested structure that the Picos *send* — symmetric in and out. So a consumer calling `GET /particle-data` and a Pico calling `POST /particle-data` see the same field names and nesting. This is good API design: easy to predict, easy to round-trip.

## Chemical Inventory models

These are declared in `app/models/chem_inventory.py` using SQLAlchemy's modern `declarative_base()`. As mentioned, they mainly serve as living documentation of the Postgres tables — the live chem inventory blueprint and service interact with the database via raw SQL. The model file is still useful when you need to look up a column name or relationship.

The key classes:

| Class | Table | Notes |
|-------|-------|-------|
| `Category` | `categories` | Lookup; usually just contains "Chemicals" |
| `Vendor` | `vendors` | Sigma, VWR, etc. |
| `Room` | `rooms` | Has `room_no`, `room_name`, `room_desc`, `area_class`, `building`, `lab_code` |
| `Item` | `items` | One row per chemical product, unique by `name` |
| `Container` | `containers` | One row per bottle. Big table. |
| `InventoryCycle` | `inventory_cycles` | One row per scan session |
| `ScanRaw` | `scan_raw` | Every barcode seen during a cycle |
| `ContainerScan` | `container_scans` | Matched scan = one row per (cycle, container) pair |

Notice the use of `Sequence`:

```python
barcode_sequence = Sequence('seq_barcode', start=100001, increment=1)
```

This is the Python-side declaration of the Postgres sequence used to generate barcodes. The actual `nextval('seq_barcode')` call happens in raw SQL in `chem_service.py`.

Cascade rules in the chem models match the SQL schema:

- Deleting an item cascades to its containers (`ondelete='CASCADE'`).
- Deleting a vendor sets the item's vendor link to null (`ondelete='SET NULL'`).
- Deleting a category is restricted if items reference it (`ondelete='RESTRICT'`).

The `__table_args__` on `ContainerScan` enforces:

```python
__table_args__ = (
    UniqueConstraint('cycle_id', 'container_id', name='uq_cycle_container'),
    CheckConstraint("status IN ('FOUND','NEW')", name='ck_status'),
)
```

- One row per (cycle, container) pair — so a container can't be scan-marked twice in the same audit.
- `status` is constrained to either `'FOUND'` or `'NEW'`.

## Empty model files

You may have noticed:

```
app/models/session.py    (empty)
app/models/task.py       (empty)
app/models/user.py       (empty)
```

These are placeholders. The actual model classes are bundled into `app/models/__init__.py` rather than split into separate files. The empty files exist either as documentation of an intended (but unfinished) split or as leftovers from an aborted refactor — they have no effect on behavior.

## Summary table

If you remember nothing else from this document, take this table away:

| Table | DB | Purpose |
|-------|----|---------|
| `signininfo` | SQLite `signininfo.db` | Usernames + bcrypt passwords + uNID + permission flags |
| `sessioninfo` | SQLite `sessioninfo.db` | Currently-logged-in sessions (UUID ↔ username) |
| `tasks`, `assignees`, `task_files` | SQLite `tasks.db` | The task tracker |
| `particle_sensor_data` | SQLite `particle_sensors.db` | Most-recent reading from each particle sensor (one row per sensor, upsert) |
| `categories`, `vendors`, `rooms`, `items`, `containers` | Postgres `cheminventory` | Chemical inventory entity model |
| `inventory_cycles`, `scan_raw`, `container_scans` | Postgres `cheminventory` | Audit scans linked to containers |
| `transactions` | Postgres `cheminventory` | Full audit trail of every chemical inventory action |

Next: `11-Particle-Demo.md`.
