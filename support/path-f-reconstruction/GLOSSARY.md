# Path F Glossary

Use this when a maintainer sees a name, acronym, host, account, tool, or data path and needs to know what it means before reading source pages.

| Term | Meaning |
|---|---|
| `nfhistory` | Production VM/host for the Nanofab history web app and related data workflows. |
| `UNanofabTools` | Source repo for the Flask server, HSC downloader, file-transfer scripts, older Pico copies, DAT tools, utilities, and legacy server context. |
| `NanofabToolkit` | Sibling source repo for the maintained desktop tools and canonical Pico helper tools. |
| `Path F` | Ultra-deep generated reconstruction manual intended to support rebuilding behavior from sanitized documentation. |
| `Path E` | All-encompassing presentation/script path for live maintainer handoff, not a source reconstruction corpus. |
| `phelan` | Shared UNIX account used by Nanofab-side maintenance on nfhistory; not root. |
| `root` | University IT-owned administrative account on the VM. Nanofab maintainers should not modify root-owned paths. |
| `iceolate` | University IT administrative host referenced in root SSH context. |
| `CADE` | University access hop used in the documented SSH path to nfhistory. |
| `tmux` | Terminal multiplexer used to keep long-running server/downloader sessions alive. |
| `CORES` | Upstream system providing machine form data through n8n webhooks. |
| `n8n` | Webhook automation service used by CORES data exports. |
| `HSCDATA` | CSV data tree written by HSCDownloader and read by machine pages. |
| `small_ CSV` | Trimmed per-machine CSV variant consumed by the web portal tables and graphs. |
| `LogData` | Server-side data tree for logged cleanroom data, separate from generated documentation. |
| `Flask server` | Modern web app under `UNanofabTools/app` plus `run.py`, config, templates, services, and models. |
| `Blueprint` | Flask route grouping such as auth, tasks, machines, API, or chem inventory. |
| `Duo` | Two-factor authentication integration used by the Flask auth flow. |
| `SQLite instance files` | Local database files for users, sessions, tasks, and particle sensor data. |
| `local PostgreSQL chem database` | Chemical inventory database running locally on the VM, not an external PostgreSQL host. |
| `Particle API` | Flask API contract used by Pico firmware and particle desktop viewers. |
| `Pico` | Raspberry Pi Pico W device running MicroPython firmware for sensor workflows. |
| `PicoHelperTools` | Canonical NanofabToolkit folder for Pico firmware and setup helpers. |
| `ParticleSensor` | NanofabToolkit desktop particle data viewer/API client. |
| `DAT` | Denton binary or cleaned log data handled by DATfixer/DATgrapher and related desktop tools. |
| `DentonDecoder` | NanofabToolkit GUI workflow for Denton data conversion/viewing. |
| `ALDPeakCounter` | NanofabToolkit GUI for ALD pressure peak counting. |
| `ParalyneReader` | NanofabToolkit Parylene log reader; spelling follows existing repo naming. |
| `PreciousMetalReader` | NanofabToolkit tool for retrieving and presenting precious metal usage data. |
| `PyInstaller` | Packaging tool used for desktop app builds and hooks. |
| `redacted value` | A secret-looking value replaced with a placeholder in generated excerpts. It must come from secure configuration, never from guessing. |
| `IT boundary` | Responsibility line where root, VM patching, backups, firewall, and UNIX account creation belong to University IT. |
