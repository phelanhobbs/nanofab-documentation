# Path F Tool Reconstruction: 01 - UNanofabTools / Flask Server

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this first for any server rebuild, browser bug, route behavior, database schema, auth, task, machine-data, chem-inventory, or particle API question.

## What This Tool Does

Modern Flask web application, including auth, tasks, machine pages, particle-data API, chemical inventory, templates, static assets, config, and migrations.

## Rebuild Focus

Recreate the Flask app package, routes, templates, services, models, config loading, SQLite files, local PostgreSQL chem schema, HSCDATA readers, and deployment entrypoint.

## External Inputs You Must Supply

- .env values for Flask secret, Duo, database, and production host behavior
- local SQLite instance files or migrations
- local PostgreSQL chem database credentials
- HSCDATA and LogData directory contents
- nginx/TLS/service configuration from live server docs

## Proof That The Rebuild Works

- A clean virtualenv can install requirements and import `app` plus `run.py` without missing local modules.
- A local Flask instance serves login, tasks, machines, and chem pages with the expected templates.
- Particle POST and GET contracts match the firmware and desktop viewers.
- Chem inventory operations use local PostgreSQL assumptions and preserve barcode, transaction, and scan flows.
- Route inventory and configuration names match the source and the formal developer docs.

## Common Ways To Get Lost

- Chem PostgreSQL is local to the VM, not an external database server.
- Device ingest routes have different auth expectations than browser routes.
- Templates and JavaScript rely on exact route names and field names.

## Folder Layout

- `README.md`: tool-level reconstruction contract and source index.
- `source-files/`: one reconstruction page per source file covered by this tool.
- `rehearsals/`: tool-local reconstruction drill instructions and any generated overflow pass files for this tool.

## Recommended Reading Order

1. Read this README and write a one-paragraph contract for the tool.
2. Open only the source-file pages needed for that contract.
3. For each edited or recreated file, complete the file's edge-case matrix.
4. Run the proof checks above before declaring the tool rebuilt.

## Files Covered

| Source file | Reconstruction page | Dirty | Untracked |
|---|---|---:|---:|
| `UNanofabTools/.env.example` | [`source-files/001-.env.example.md`](source-files/001-.env.example.md) | no | no |
| `UNanofabTools/ALD_chart.html` | [`source-files/002-ALD_chart.html.md`](source-files/002-ALD_chart.html.md) | no | no |
| `UNanofabTools/CHEM_INVENTORY_README.md` | [`source-files/003-CHEM_INVENTORY_README.md.md`](source-files/003-CHEM_INVENTORY_README.md.md) | no | no |
| `UNanofabTools/CHEM_INVENTORY_SETUP.md` | [`source-files/004-CHEM_INVENTORY_SETUP.md.md`](source-files/004-CHEM_INVENTORY_SETUP.md.md) | no | no |
| `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md` | [`source-files/005-CHEM_INVENTORY_V2_QUICK_REF.md.md`](source-files/005-CHEM_INVENTORY_V2_QUICK_REF.md.md) | no | no |
| `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md` | [`source-files/006-CHEM_INVENTORY_V2_UPGRADE.md.md`](source-files/006-CHEM_INVENTORY_V2_UPGRADE.md.md) | no | no |
| `UNanofabTools/FLASK_MIGRATION.md` | [`source-files/007-FLASK_MIGRATION.md.md`](source-files/007-FLASK_MIGRATION.md.md) | no | no |
| `UNanofabTools/HSCDATA/js/adminActions.js` | [`source-files/008-HSCDATA__js__adminActions.js.md`](source-files/008-HSCDATA__js__adminActions.js.md) | no | no |
| `UNanofabTools/HSCDATA/js/graph.js` | [`source-files/009-HSCDATA__js__graph.js.md`](source-files/009-HSCDATA__js__graph.js.md) | no | no |
| `UNanofabTools/HSCDATA/js/tablesort.js` | [`source-files/010-HSCDATA__js__tablesort.js.md`](source-files/010-HSCDATA__js__tablesort.js.md) | no | no |
| `UNanofabTools/HSCDATA/js/taskActions.js` | [`source-files/011-HSCDATA__js__taskActions.js.md`](source-files/011-HSCDATA__js__taskActions.js.md) | no | no |
| `UNanofabTools/app/__init__.py` | [`source-files/012-app____init__.py.md`](source-files/012-app____init__.py.md) | no | no |
| `UNanofabTools/app/blueprints/admin.py` | [`source-files/013-app__blueprints__admin.py.md`](source-files/013-app__blueprints__admin.py.md) | no | no |
| `UNanofabTools/app/blueprints/api.py` | [`source-files/014-app__blueprints__api.py.md`](source-files/014-app__blueprints__api.py.md) | no | no |
| `UNanofabTools/app/blueprints/auth.py` | [`source-files/015-app__blueprints__auth.py.md`](source-files/015-app__blueprints__auth.py.md) | no | no |
| `UNanofabTools/app/blueprints/chem_inventory.py` | [`source-files/016-app__blueprints__chem_inventory.py.md`](source-files/016-app__blueprints__chem_inventory.py.md) | no | no |
| `UNanofabTools/app/blueprints/chem_inventory_remote.py` | [`source-files/017-app__blueprints__chem_inventory_remote.py.md`](source-files/017-app__blueprints__chem_inventory_remote.py.md) | no | no |
| `UNanofabTools/app/blueprints/machines.py` | [`source-files/018-app__blueprints__machines.py.md`](source-files/018-app__blueprints__machines.py.md) | no | no |
| `UNanofabTools/app/blueprints/particle_demo_will.py` | [`source-files/019-app__blueprints__particle_demo_will.py.md`](source-files/019-app__blueprints__particle_demo_will.py.md) | no | no |
| `UNanofabTools/app/blueprints/tasks.py` | [`source-files/020-app__blueprints__tasks.py.md`](source-files/020-app__blueprints__tasks.py.md) | no | no |
| `UNanofabTools/app/models/__init__.py` | [`source-files/021-app__models____init__.py.md`](source-files/021-app__models____init__.py.md) | no | no |
| `UNanofabTools/app/models/chem_inventory.py` | [`source-files/022-app__models__chem_inventory.py.md`](source-files/022-app__models__chem_inventory.py.md) | no | no |
| `UNanofabTools/app/models/particle_sensor.py` | [`source-files/023-app__models__particle_sensor.py.md`](source-files/023-app__models__particle_sensor.py.md) | no | no |
| `UNanofabTools/app/models/session.py` | [`source-files/024-app__models__session.py.md`](source-files/024-app__models__session.py.md) | no | no |
| `UNanofabTools/app/models/task.py` | [`source-files/025-app__models__task.py.md`](source-files/025-app__models__task.py.md) | no | no |
| `UNanofabTools/app/models/user.py` | [`source-files/026-app__models__user.py.md`](source-files/026-app__models__user.py.md) | no | no |
| `UNanofabTools/app/services/admin_service.py` | [`source-files/027-app__services__admin_service.py.md`](source-files/027-app__services__admin_service.py.md) | no | no |
| `UNanofabTools/app/services/auth_service.py` | [`source-files/028-app__services__auth_service.py.md`](source-files/028-app__services__auth_service.py.md) | no | no |
| `UNanofabTools/app/services/chem_service.py` | [`source-files/029-app__services__chem_service.py.md`](source-files/029-app__services__chem_service.py.md) | no | no |
| `UNanofabTools/app/services/data_service.py` | [`source-files/030-app__services__data_service.py.md`](source-files/030-app__services__data_service.py.md) | no | no |
| `UNanofabTools/app/services/task_service.py` | [`source-files/031-app__services__task_service.py.md`](source-files/031-app__services__task_service.py.md) | no | no |
| `UNanofabTools/app/static/css/inventory.css` | [`source-files/032-app__static__css__inventory.css.md`](source-files/032-app__static__css__inventory.css.md) | no | no |
| `UNanofabTools/app/static/js/adminActions.js` | [`source-files/033-app__static__js__adminActions.js.md`](source-files/033-app__static__js__adminActions.js.md) | no | no |
| `UNanofabTools/app/static/js/graph.js` | [`source-files/034-app__static__js__graph.js.md`](source-files/034-app__static__js__graph.js.md) | no | no |
| `UNanofabTools/app/static/js/tablesort.js` | [`source-files/035-app__static__js__tablesort.js.md`](source-files/035-app__static__js__tablesort.js.md) | no | no |
| `UNanofabTools/app/static/js/taskActions.js` | [`source-files/036-app__static__js__taskActions.js.md`](source-files/036-app__static__js__taskActions.js.md) | no | no |
| `UNanofabTools/app/templates/base.html` | [`source-files/037-app__templates__base.html.md`](source-files/037-app__templates__base.html.md) | no | no |
| `UNanofabTools/app/templates/chem/OLDbcq.html` | [`source-files/038-app__templates__chem__OLDbcq.html.md`](source-files/038-app__templates__chem__OLDbcq.html.md) | no | no |
| `UNanofabTools/app/templates/chem/add.html` | [`source-files/039-app__templates__chem__add.html.md`](source-files/039-app__templates__chem__add.html.md) | no | no |
| `UNanofabTools/app/templates/chem/barcode_print.html` | [`source-files/040-app__templates__chem__barcode_print.html.md`](source-files/040-app__templates__chem__barcode_print.html.md) | no | no |
| `UNanofabTools/app/templates/chem/barcode_queue.html` | [`source-files/041-app__templates__chem__barcode_queue.html.md`](source-files/041-app__templates__chem__barcode_queue.html.md) | no | no |
| `UNanofabTools/app/templates/chem/base.html` | [`source-files/042-app__templates__chem__base.html.md`](source-files/042-app__templates__chem__base.html.md) | no | no |
| `UNanofabTools/app/templates/chem/edit.html` | [`source-files/043-app__templates__chem__edit.html.md`](source-files/043-app__templates__chem__edit.html.md) | no | no |
| `UNanofabTools/app/templates/chem/inventory.html` | [`source-files/044-app__templates__chem__inventory.html.md`](source-files/044-app__templates__chem__inventory.html.md) | no | no |
| `UNanofabTools/app/templates/chem/inventory_print.html` | [`source-files/045-app__templates__chem__inventory_print.html.md`](source-files/045-app__templates__chem__inventory_print.html.md) | no | no |
| `UNanofabTools/app/templates/chem/move.html` | [`source-files/046-app__templates__chem__move.html.md`](source-files/046-app__templates__chem__move.html.md) | no | no |
| `UNanofabTools/app/templates/chem/remove.html` | [`source-files/047-app__templates__chem__remove.html.md`](source-files/047-app__templates__chem__remove.html.md) | no | no |
| `UNanofabTools/app/templates/chem/report.html` | [`source-files/048-app__templates__chem__report.html.md`](source-files/048-app__templates__chem__report.html.md) | no | no |
| `UNanofabTools/app/templates/chem/transactions.html` | [`source-files/049-app__templates__chem__transactions.html.md`](source-files/049-app__templates__chem__transactions.html.md) | no | no |
| `UNanofabTools/app/templates/chem/upload_scans.html` | [`source-files/050-app__templates__chem__upload_scans.html.md`](source-files/050-app__templates__chem__upload_scans.html.md) | no | no |
| `UNanofabTools/app/templates/createTask.html` | [`source-files/051-app__templates__createTask.html.md`](source-files/051-app__templates__createTask.html.md) | no | no |
| `UNanofabTools/app/templates/index.html` | [`source-files/052-app__templates__index.html.md`](source-files/052-app__templates__index.html.md) | no | no |
| `UNanofabTools/app/templates/logFileIndex.html` | [`source-files/053-app__templates__logFileIndex.html.md`](source-files/053-app__templates__logFileIndex.html.md) | no | no |
| `UNanofabTools/app/templates/login.html` | [`source-files/054-app__templates__login.html.md`](source-files/054-app__templates__login.html.md) | no | no |
| `UNanofabTools/app/templates/login_example.html` | [`source-files/055-app__templates__login_example.html.md`](source-files/055-app__templates__login_example.html.md) | no | no |
| `UNanofabTools/app/templates/machines.html` | [`source-files/056-app__templates__machines.html.md`](source-files/056-app__templates__machines.html.md) | no | no |
| `UNanofabTools/app/templates/resetpassword.html` | [`source-files/057-app__templates__resetpassword.html.md`](source-files/057-app__templates__resetpassword.html.md) | no | no |
| `UNanofabTools/app/templates/signup.html` | [`source-files/058-app__templates__signup.html.md`](source-files/058-app__templates__signup.html.md) | no | no |
| `UNanofabTools/app/templates/tasks.html` | [`source-files/059-app__templates__tasks.html.md`](source-files/059-app__templates__tasks.html.md) | no | no |
| `UNanofabTools/chem_inventory_remote.py` | [`source-files/060-chem_inventory_remote.py.md`](source-files/060-chem_inventory_remote.py.md) | yes | yes |
| `UNanofabTools/chem_schema.sql` | [`source-files/061-chem_schema.sql.md`](source-files/061-chem_schema.sql.md) | yes | no |
| `UNanofabTools/chem_schema_migration_v2.sql` | [`source-files/062-chem_schema_migration_v2.sql.md`](source-files/062-chem_schema_migration_v2.sql.md) | yes | no |
| `UNanofabTools/config/config.py` | [`source-files/063-config__config.py.md`](source-files/063-config__config.py.md) | no | no |
| `UNanofabTools/createTask.html` | [`source-files/064-createTask.html.md`](source-files/064-createTask.html.md) | no | no |
| `UNanofabTools/index.html` | [`source-files/065-index.html.md`](source-files/065-index.html.md) | no | no |
| `UNanofabTools/logFileIndex.html` | [`source-files/066-logFileIndex.html.md`](source-files/066-logFileIndex.html.md) | no | no |
| `UNanofabTools/login.html` | [`source-files/067-login.html.md`](source-files/067-login.html.md) | no | no |
| `UNanofabTools/machines.html` | [`source-files/068-machines.html.md`](source-files/068-machines.html.md) | no | no |
| `UNanofabTools/migrations/README` | [`source-files/069-migrations__README.md`](source-files/069-migrations__README.md) | no | no |
| `UNanofabTools/migrations/alembic.ini` | [`source-files/070-migrations__alembic.ini.md`](source-files/070-migrations__alembic.ini.md) | no | no |
| `UNanofabTools/migrations/env.py` | [`source-files/071-migrations__env.py.md`](source-files/071-migrations__env.py.md) | no | no |
| `UNanofabTools/migrations/script.py.mako` | [`source-files/072-migrations__script.py.mako.md`](source-files/072-migrations__script.py.mako.md) | no | no |
| `UNanofabTools/migrations/versions/01bdbfe91bd5_create_particle_sensor_tables.py` | [`source-files/073-migrations__versions__01bdbfe91bd5_create_particle_sensor_tables.py.md`](source-files/073-migrations__versions__01bdbfe91bd5_create_particle_sensor_tables.py.md) | no | no |
| `UNanofabTools/quick_setup.sh` | [`source-files/074-quick_setup.sh.md`](source-files/074-quick_setup.sh.md) | no | no |
| `UNanofabTools/requirements.txt` | [`source-files/075-requirements.txt.md`](source-files/075-requirements.txt.md) | yes | no |
| `UNanofabTools/resetpassword.html` | [`source-files/076-resetpassword.html.md`](source-files/076-resetpassword.html.md) | no | no |
| `UNanofabTools/run.py` | [`source-files/077-run.py.md`](source-files/077-run.py.md) | no | no |
| `UNanofabTools/setup.sh` | [`source-files/078-setup.sh.md`](source-files/078-setup.sh.md) | no | no |
| `UNanofabTools/signup.html` | [`source-files/079-signup.html.md`](source-files/079-signup.html.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
