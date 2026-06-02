# Module 8 - Machines, Logs, And The File-Based Data Model

## Goal

The maintainer understands how machine pages, downloaded CORES data, uploaded machine logs, file browsing, downloads, and graphs depend on file trees as much as on databases.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx`](../../presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx)
- [`../../presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md`](../../presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md)
- [`../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md`](../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- [`../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md`](../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md)

## Verbatim Script

READ ALOUD:

"Not all important data lives in a relational database. Machine pages and log views rely heavily on file trees. That makes backup, path correctness, naming conventions, and upload freshness operationally important."

SHOW:

Open `07-Machines-and-Logs.pptx`.

READ ALOUD:

"The machine pages are where cleanroom users expect to see useful historical machine data. Some of that data comes from `HSCDATA`, written by `HSCDownloader.py`. Some comes from `LogData`, written by machine-control-PC transfer scripts. Some views provide file browsing, downloads, and graphing. If a file tree is missing or stale, the website may still run but display incomplete or outdated information."

## Source Demo

DO:

Show:

```text
../UNanofabTools/app/blueprints/machines.py
../UNanofabTools/HSCDATA
../UNanofabTools/LogData
```

If local source does not contain live data trees, read this instead:

READ ALOUD:

"The local source checkout may not contain production data trees. That is normal. Production data trees live on `nfhistory`, under the production install. We still use the source to understand route behavior and docs to understand live layout."

DO:

Run:

```sh
rg -n "HSCDATA|LogData|download|graph|machine|csv|send_file|safe_join" ../UNanofabTools/app
```

READ ALOUD:

"This search highlights file-based behavior. For any file-serving route, inspect path joining and sanitization. For any graphing route, identify the expected input file shape. For any download route, confirm it does not allow arbitrary file access."

## Data Durability Frame

READ ALOUD:

"File data creates a different durability problem from database data. A SQL backup alone is not enough if `HSCDATA`, `LogData`, or `uploads` are missing. The documentation says University IT handles off-box backups, but the Nanofab maintainer should confirm that the VM-level backup covers the app instance, uploads, logs, `HSCDATA`, `LogData`, and local PostgreSQL data."

SHOW:

Open live-server docs where backup and data trees are discussed.

READ ALOUD:

"Do not casually say there are no backups. The correct statement is that backups are IT-handled and coverage should be confirmed, especially for operational data trees and local PostgreSQL."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What is `HSCDATA`? | The file tree of CORES-derived machine usage CSV data used by machine pages. |
| What writes `HSCDATA`? | `HSCDownloader.py`. |
| What is `LogData`? | The file tree of uploaded machine-control-PC logs and related log data. |
| What writes `LogData`? | File-transfer scripts from machine-control PCs, plus app/device flows where documented. |
| Why can the website be up while machine data is stale? | Flask/nginx may be healthy while downloader or file-transfer data pipelines have stopped or stopped writing fresh files. |
| Which file trees must be backed up? | `HSCDATA`, `LogData`, `uploads`, `instance/`, sensor/log file directories, and related production data paths. |
| What should a maintainer inspect before changing file download routes? | Path construction/sanitization, `safe_join` or equivalent protections, allowed directories, auth guards, and arbitrary-file-read risk. |

REQUIRE:

The maintainer can explain the difference between app uptime and data freshness.

## Stop Point

STOP POINT:

Stop here if the maintainer treats database backup as sufficient without file-tree backup.
