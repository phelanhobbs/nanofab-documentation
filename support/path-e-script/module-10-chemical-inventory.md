# Module 10 - Chemical Inventory And PostgreSQL

## Goal

The maintainer understands the chemical inventory as the largest and most database-sensitive feature: local PostgreSQL, schema shape, routes, service layer, barcode behavior, reports, transactions, and security concerns.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx`](../../presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx)
- [`../../presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx`](../../presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx)
- [`../../presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md`](../../presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md)
- [`../../documentation/UNanofabTools/flaskserver/04-database-schema.md`](../../documentation/UNanofabTools/flaskserver/04-database-schema.md)
- [`../../known-issues/UNanofabTools/flaskserver.md`](../../known-issues/UNanofabTools/flaskserver.md)

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

Open [`../../documentation/UNanofabTools/flaskserver/04-database-schema.md`](../../documentation/UNanofabTools/flaskserver/04-database-schema.md).

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

"The known-issues file calls out chemical inventory risks. Pay attention to unauthenticated or under-protected write routes if present, schema drift, missing migration discipline, and backup/restore coverage. Chemical inventory changes should be approached as data integrity work, not just UI work."

SHOW:

Open [`../../known-issues/UNanofabTools/flaskserver.md`](../../known-issues/UNanofabTools/flaskserver.md).

READ ALOUD:

"Known issues are where the maintainer decides what to fix first. High-severity chemical inventory findings belong near the top because they affect real operational data."

## Explain-Back

ASK:

- Is chemical PostgreSQL local or external?
- What host and port does the live deployment use?
- Which config variables control chemical database access?
- What are the main chemical inventory entities?
- What is a soft delete in this context?
- Why is transaction history important?
- What should be checked before changing barcode or move behavior?
- What backup coverage is needed for chemical inventory?

REQUIRE:

The maintainer can explain the chemical inventory's route, service, database, and backup concerns without calling it "just another page."

## Stop Point

STOP POINT:

Stop here if the maintainer says or implies that chemical PostgreSQL is external. Correct that immediately and revisit the live-server and schema docs.
