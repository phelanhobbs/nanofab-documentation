# Path F Tool Index

Use this file as the table of contents for the reconstruction body. It exists so a maintainer can choose a tool folder directly instead of opening the 3.6M-word corpus linearly.

## How To Use This Index

1. Find the behavior, failure, or rebuild target in the table.
2. Open that tool folder's `README.md` first.
3. Open only the source-file pages named by that tool README.
4. Return to `../RECONSTRUCTION-CHECKLIST.md` before declaring the rebuild complete.

## Tool Folders

| Tool folder | Role | Source files | Words | Open when |
|---|---|---:|---:|---|
| [`UNanofabTools/repo-overview-and-entrypoints`](UNanofabTools/repo-overview-and-entrypoints/README.md) | Repository-level orientation, setup notes, migration summaries, and legacy handoff context. | 6 | 156,839 | Open this when you need the original repo story before choosing a specific tool folder. |
| [`UNanofabTools/flaskserver`](UNanofabTools/flaskserver/README.md) | Modern Flask web application, including auth, tasks, machine pages, particle-data API, chemical inventory, templates, static assets, config, and migrations. | 79 | 1,432,872 | Open this first for any server rebuild, browser bug, route behavior, database schema, auth, task, machine-data, chem-inventory, or particle API question. |
| [`UNanofabTools/hscdownloader`](UNanofabTools/hscdownloader/README.md) | CORES n8n data downloader that writes HSCDATA CSVs consumed by the machine portal. | 1 | 110,914 | Open this when machine pages stop updating, service IDs change, CORES changes payloads, or HSCDATA CSVs need to be recreated. |
| [`UNanofabTools/filetransfer`](UNanofabTools/filetransfer/README.md) | Windows and shell transfer scripts that move machine-controller files to the server. | 6 | 65,898 | Open this when a machine control PC stops uploading logs or a transfer path/account/key needs replacement. |
| [`UNanofabTools/picofirmware`](UNanofabTools/picofirmware/README.md) | Older UNanofabTools copies of Pico firmware and Pico diagnostics. | 6 | 184,333 | Open this for historical Pico code, unique unfinished scripts, WiFi diagnostics, or comparison against the canonical NanofabToolkit PicoHelperTools folder. |
| [`UNanofabTools/particlepctools`](UNanofabTools/particlepctools/README.md) | Older PC-side particle data viewer and synthetic particle-data generator. | 3 | 171,233 | Open this for historical desktop viewer behavior, test particle-data generation, or comparison with NanofabToolkit/ParticleSensor. |
| [`UNanofabTools/dattools`](UNanofabTools/dattools/README.md) | DATfixer and DATgrapher command-line tools for Denton 635 log conversion and plotting. | 3 | 58,329 | Open this when a raw Denton `.DAT` log needs decoding or a cleaned log needs a pressure graph. |
| [`UNanofabTools/utilities`](UNanofabTools/utilities/README.md) | Standalone helpers including peak counting, certificate conversion, SSH fetch helper, chem DB init, and unfinished monitor storage. | 6 | 53,629 | Open this for one-off helper rebuilds or to decide whether a helper should be retained, replaced, or retired. |
| [`UNanofabTools/hscdisplayerserver`](UNanofabTools/hscdisplayerserver/README.md) | Legacy monolithic HSC displayer server retained for historical reference. | 1 | 282,847 | Open this when you find old server behavior that predates the Flask app or need to compare a legacy route to the modern implementation. |
| [`NanofabToolkit/PicoHelperTools`](NanofabToolkit/PicoHelperTools/README.md) | Canonical Pico firmware and helper scripts for sensor devices. | 8 | 281,744 | Open this first for Pico firmware rebuilds, sensor device setup, MAC discovery, network diagnostics, and MicroPython deployment. |
| [`NanofabToolkit/ParticleSensor`](NanofabToolkit/ParticleSensor/README.md) | Canonical desktop particle sensor viewer and API client. | 7 | 238,076 | Open this for maintained particle desktop GUI behavior, API processing, packaging, or current-vs-historical particle data workflows. |
| [`NanofabToolkit/ALDPeakCounter`](NanofabToolkit/ALDPeakCounter/README.md) | Desktop GUI for ALD pressure peak counting. | 7 | 87,305 | Open this when ALD pressure files need a GUI workflow or the shared peak-count algorithm must be rebuilt. |
| [`NanofabToolkit/DentonDecoder`](NanofabToolkit/DentonDecoder/README.md) | Desktop Denton decoder and graphing tool. | 7 | 154,807 | Open this for GUI Denton conversion/viewing workflows distinct from command-line DATfixer/DATgrapher. |
| [`NanofabToolkit/ParalyneReader`](NanofabToolkit/ParalyneReader/README.md) | Desktop Parylene analog log reader and plotting GUI. | 6 | 193,231 | Open this for Parylene log viewing, time-series parsing, GUI behavior, or packaging reconstruction. |
| [`NanofabToolkit/PreciousMetalReader`](NanofabToolkit/PreciousMetalReader/README.md) | Desktop tool for retrieving and presenting precious metal usage data. | 5 | 123,490 | Open this for precious metal monthly retrieval, CORES-style data access, GUI behavior, or packaging reconstruction. |
| [`NanofabToolkit/packaging-root`](NanofabToolkit/packaging-root/README.md) | NanofabToolkit root docs, shared packaging hooks, license, and CI workflow. | 8 | 57,063 | Open this when rebuilding packaging infrastructure, GitHub Actions, PyInstaller hooks, or repo-level metadata. |
