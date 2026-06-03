# Minimum Acceptable Full Path E - Module 08: Machines And Logs

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-08-machines-logs.md

# Module 8 - Machines, Logs, And The File-Based Data Model

## Goal

The maintainer understands how machine pages, downloaded CORES data, uploaded machine logs, file browsing, downloads, and graphs depend on file trees as much as on databases.

## Required Screen

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx)
- `presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md` (repo path: presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md)
- `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (repo path: documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` (repo path: documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md)

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


# Expanded Module 08: Machines And Logs

READ ALOUD:

This expanded section revisits Module 08, Machines And Logs. The focus is HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 08

READ ALOUD:

We are now doing the orientation pass for Machines And Logs. The maintainer should connect this module to HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx`
- `presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md`
- `documentation/UNanofabTools/liveserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 08

READ ALOUD:

We are now doing the evidence pass for Machines And Logs. The maintainer should connect this module to HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx`
- `presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md`
- `documentation/UNanofabTools/liveserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

