# UNanofabTools — Developer Documentation

Formal reference for every component in the UNanofabTools repository, organized per tool. Each folder below contains the developer docs for one tool group. The matching layman guides and slide decks are in the parallel tree at `../presentation/UNanofabTools/`. Bugs and tech debt are tracked separately in `../known-issues/UNanofabTools/` so the handoff documentation stays clean.

## Tools

| Folder | Component | Status |
|--------|-----------|--------|
| [`flaskserver/`](flaskserver/README.md) | The current Flask web application — auth, tasks, machine portal, sensor API, chemical inventory. Detailed multi-document set (architecture, getting started, configuration reference, schema, HTTP/service references, security, deployment, dev guide). | **Active — primary** |
| [`hscdownloader/`](hscdownloader/README.md) | Scheduled ETL: pulls per-machine run forms from the CORES n8n webhook and writes the `HSCDATA` summary CSVs the Flask machines portal reads. | **Active** |
| [`picofirmware/`](picofirmware/README.md) | MicroPython firmware for the Raspberry Pi Pico W boards (SPS30 particle sensors, Parylene/Denton ADC streamers, plus diagnostics). | **Older copies** *(canonical: [`NanofabToolkit/PicoHelperTools`](../NanofabToolkit/PicoHelperTools/README.md))*; two unique scripts (`PicoDenton18.py`, `VGC083C_Monitor.py`) are incomplete |
| [`particlepctools/`](particlepctools/README.md) | The PyQt desktop viewer and a synthetic-data generator. | Viewer is the **older copy** *(canonical: [`NanofabToolkit/ParticleSensor`](../NanofabToolkit/ParticleSensor/README.md))*; generator is canonical here |
| [`filetransfer/`](filetransfer/README.md) | PowerShell / batch scripts running on each tool's Windows control PC; push log files to the server over SSH via `pscp`. | **Active** |
| [`dattools/`](dattools/README.md) | `DATfixer.py` (Denton 635 binary `.DAT` → cleaned text) and `DATgrapher.py` (pressure-vs-time charts from cleaned files). | **Active** |
| [`utilities/`](utilities/README.md) | Standalone helpers: `peakCount.py`, `gencert.py`, `init_chem_db.py`, `fetch_ssh.py`, `NMonStore.py`. Mixed status. | **Active** (one unfinished stub) |
| [`serveraccess/`](serveraccess/README.md) | The SSH access pattern (laptop → CADE → `nfhistory`), the shared `phelan` account model, and the `flaskserver` / `downloader` tmux sessions: attach, detach, recover. Includes both user procedure and admin runbook. | **Active** |
| [`liveserver/`](liveserver/README.md) | Populated inventory of the live `nfhistory` server (OS, network, certs, services, packages, data trees), plus the `survey_nfhistory.sh` script that produces the snapshots and a folder of captured snapshots. | **Active** |
| [`hscdisplayerserver/`](hscdisplayerserver/README.md) | The original monolithic server (Python `http.server`-based) that predates the Flask rewrite. Documented for historical reference; not maintained. | **Deprecated** |

## How the tree is laid out

For each tool you'll find:

- This tree (`documentation/UNanofabTools/<tool>/`): one or more `.md` files of formal reference material.
- The parallel layman tree (`../presentation/UNanofabTools/<tool>/`): a plain-English README and a presentable slide deck with speaker notes.
- A single bugs / tech-debt file in `../known-issues/UNanofabTools/<tool>.md`.

The Flask server is the most elaborate set (an 11-file reference plus architecture, ops, dev guide). Smaller tools have a single thorough `README.md` and, where useful, a focused companion file (for example `hscdisplayerserver/` has a separate `ROUTES.md`).

## Conventions

- All file paths are relative to the repository root unless otherwise noted.
- Code is quoted verbatim from the source so identifiers are searchable.
- Cross-tool references use folder paths (e.g. `documentation/UNanofabTools/hscdownloader/`) so they keep working as the tree moves.
- Known issues are *not* mixed into the docs — see the parallel `known-issues/` tree.
