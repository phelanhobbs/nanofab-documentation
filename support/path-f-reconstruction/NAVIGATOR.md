# Path F Navigator

This is the first file to open when Path F feels too large. Path F is intentionally exhaustive, but it is not meant to be read like a novel. Choose the failing system, open the matching tool README, then use the source-file pages only as evidence.

## Do Not Get Lost Rules

1. Do not start with `source-files/` unless a tool README points you there.
2. Do not read the Flask folder linearly unless you are rebuilding the entire server.
3. Do not treat redacted values as recoverable secrets; supply them from approved local configuration.
4. Do not treat Path F as live-state truth; production and fresh surveys can override generated documentation.
5. Use `TROUBLESHOOTING-ROUTES.md` when you have a symptom but not a tool name.
6. Do not close a rebuild until the proof checks in `RECONSTRUCTION-CHECKLIST.md` are complete and `REBUILD-EVIDENCE-TEMPLATE.md` is filled in.

## Fast Route Chooser

| Need | Open | Done when |
|---|---|---|
| Rebuild or debug the production web app | [`UNanofabTools/flaskserver`](tools/UNanofabTools/flaskserver/README.md) plus [`tools/00-system-map`](tools/00-system-map/README.md) | Local Flask import/run succeeds; route, template, database, API, and config contracts match the source pages. |
| Machine pages stopped updating | [`UNanofabTools/hscdownloader`](tools/UNanofabTools/hscdownloader/README.md) then [`UNanofabTools/flaskserver`](tools/UNanofabTools/flaskserver/README.md) | CORES data becomes full and `small_` HSCDATA CSVs; Flask machine pages read and graph the expected columns. |
| Particle sensors or particle GUI need rebuilding | [`NanofabToolkit/PicoHelperTools`](tools/NanofabToolkit/PicoHelperTools/README.md) then [`UNanofabTools/flaskserver`](tools/UNanofabTools/flaskserver/README.md) then [`NanofabToolkit/ParticleSensor`](tools/NanofabToolkit/ParticleSensor/README.md) | Pico payloads are accepted by the API; desktop GUI renders current and historical data. |
| Machine control PC upload broke | [`UNanofabTools/filetransfer`](tools/UNanofabTools/filetransfer/README.md) plus [`../../documentation/UNanofabTools/liveserver/README.md`](../../documentation/UNanofabTools/liveserver/README.md) | A test file transfers from the control PC path to the expected server destination with visible failure modes. |
| Denton raw logs need decoding | [`UNanofabTools/dattools`](tools/UNanofabTools/dattools/README.md) for CLI flow or [`NanofabToolkit/DentonDecoder`](tools/NanofabToolkit/DentonDecoder/README.md) for GUI flow | Known Denton input produces the expected cleaned output and graph behavior. |
| ALD peak counting needs rebuilding | [`NanofabToolkit/ALDPeakCounter`](tools/NanofabToolkit/ALDPeakCounter/README.md) and [`UNanofabTools/utilities`](tools/UNanofabTools/utilities/README.md) | Known pressure files return the same peak counts in CLI and GUI contexts. |
| Parylene logs need a desktop reader | [`NanofabToolkit/ParalyneReader`](tools/NanofabToolkit/ParalyneReader/README.md) | Known Parylene logs load, parse, and plot; malformed logs produce clear errors. |
| Precious metal data retrieval needs rebuilding | [`NanofabToolkit/PreciousMetalReader`](tools/NanofabToolkit/PreciousMetalReader/README.md) | Known month/date inputs return the expected table shape without embedded credentials. |
| Packaging, hooks, or GitHub Actions broke | [`NanofabToolkit/packaging-root`](tools/NanofabToolkit/packaging-root/README.md) | PyInstaller hooks and workflow paths match the tool entrypoints and assets. |
| You found historical server behavior | [`UNanofabTools/hscdisplayerserver`](tools/UNanofabTools/hscdisplayerserver/README.md) | The legacy behavior is mapped to modern Flask behavior or explicitly isolated as historical. |

## Required Reading Sequence

1. Read [`MAINTAINER-FIRST-HOUR.md`](MAINTAINER-FIRST-HOUR.md) if you are new or responding under stress.
2. Read this navigator.
3. Read [`TROUBLESHOOTING-ROUTES.md`](TROUBLESHOOTING-ROUTES.md) if you have a symptom.
4. Read [`GLOSSARY.md`](GLOSSARY.md) for unfamiliar terms before guessing.
5. Read [`RECONSTRUCTION-CHECKLIST.md`](RECONSTRUCTION-CHECKLIST.md).
6. Read [`tools/INDEX.md`](tools/INDEX.md) if your target is not obvious from the route chooser.
7. Read [`tools/00-system-map/README.md`](tools/00-system-map/README.md) to understand source-of-truth and edge-case rules.
8. Read one tool `README.md` at a time.
9. Open source-file pages only when implementing or verifying that specific file; use their breadcrumbs to climb back out.

## Tool Map

| Tool folder | Source files | Words | Open when |
|---|---:|---:|---|
| [`UNanofabTools/repo-overview-and-entrypoints`](tools/UNanofabTools/repo-overview-and-entrypoints/README.md) | 6 | 156,839 | Open this when you need the original repo story before choosing a specific tool folder. |
| [`UNanofabTools/flaskserver`](tools/UNanofabTools/flaskserver/README.md) | 79 | 1,432,872 | Open this first for any server rebuild, browser bug, route behavior, database schema, auth, task, machine-data, chem-inventory, or particle API question. |
| [`UNanofabTools/hscdownloader`](tools/UNanofabTools/hscdownloader/README.md) | 1 | 110,914 | Open this when machine pages stop updating, service IDs change, CORES changes payloads, or HSCDATA CSVs need to be recreated. |
| [`UNanofabTools/filetransfer`](tools/UNanofabTools/filetransfer/README.md) | 6 | 65,898 | Open this when a machine control PC stops uploading logs or a transfer path/account/key needs replacement. |
| [`UNanofabTools/picofirmware`](tools/UNanofabTools/picofirmware/README.md) | 6 | 184,333 | Open this for historical Pico code, unique unfinished scripts, WiFi diagnostics, or comparison against the canonical NanofabToolkit PicoHelperTools folder. |
| [`UNanofabTools/particlepctools`](tools/UNanofabTools/particlepctools/README.md) | 3 | 171,233 | Open this for historical desktop viewer behavior, test particle-data generation, or comparison with NanofabToolkit/ParticleSensor. |
| [`UNanofabTools/dattools`](tools/UNanofabTools/dattools/README.md) | 3 | 58,329 | Open this when a raw Denton `.DAT` log needs decoding or a cleaned log needs a pressure graph. |
| [`UNanofabTools/utilities`](tools/UNanofabTools/utilities/README.md) | 6 | 53,629 | Open this for one-off helper rebuilds or to decide whether a helper should be retained, replaced, or retired. |
| [`UNanofabTools/hscdisplayerserver`](tools/UNanofabTools/hscdisplayerserver/README.md) | 1 | 282,847 | Open this when you find old server behavior that predates the Flask app or need to compare a legacy route to the modern implementation. |
| [`NanofabToolkit/PicoHelperTools`](tools/NanofabToolkit/PicoHelperTools/README.md) | 8 | 281,744 | Open this first for Pico firmware rebuilds, sensor device setup, MAC discovery, network diagnostics, and MicroPython deployment. |
| [`NanofabToolkit/ParticleSensor`](tools/NanofabToolkit/ParticleSensor/README.md) | 7 | 238,076 | Open this for maintained particle desktop GUI behavior, API processing, packaging, or current-vs-historical particle data workflows. |
| [`NanofabToolkit/ALDPeakCounter`](tools/NanofabToolkit/ALDPeakCounter/README.md) | 7 | 87,305 | Open this when ALD pressure files need a GUI workflow or the shared peak-count algorithm must be rebuilt. |
| [`NanofabToolkit/DentonDecoder`](tools/NanofabToolkit/DentonDecoder/README.md) | 7 | 154,807 | Open this for GUI Denton conversion/viewing workflows distinct from command-line DATfixer/DATgrapher. |
| [`NanofabToolkit/ParalyneReader`](tools/NanofabToolkit/ParalyneReader/README.md) | 6 | 193,231 | Open this for Parylene log viewing, time-series parsing, GUI behavior, or packaging reconstruction. |
| [`NanofabToolkit/PreciousMetalReader`](tools/NanofabToolkit/PreciousMetalReader/README.md) | 5 | 123,490 | Open this for precious metal monthly retrieval, CORES-style data access, GUI behavior, or packaging reconstruction. |
| [`NanofabToolkit/packaging-root`](tools/NanofabToolkit/packaging-root/README.md) | 8 | 57,063 | Open this when rebuilding packaging infrastructure, GitHub Actions, PyInstaller hooks, or repo-level metadata. |

## External Inputs That Path F Cannot Invent

- Live secret values: Flask secret, Duo values, CORES bearer token, WiFi password, SSH keys, certificate passwords, and endpoint credentials.
- Live server state: active tmux sessions, nginx state, TLS renewal state, PostgreSQL state, SQLite instance files, HSCDATA contents, and IT-managed backup status.
- Hardware state: Pico wiring, machine control PC paths, cleanroom network reachability, sensor identity, and representative log files.
- University IT decisions: root access, VM patching, root-owned SSH keys, off-box backups, firewall changes, and UNIX account creation.

## Fresh-Consumer Test

Use this test whenever the documentation has changed substantially:

```sh
bash support/audit.sh
sed -n '1,220p' support/path-f-reconstruction/NAVIGATOR.md
sed -n '1,220p' support/path-f-reconstruction/TROUBLESHOOTING-ROUTES.md
sed -n '1,180p' support/path-f-reconstruction/MAINTAINER-FIRST-HOUR.md
sed -n '1,220p' support/path-f-reconstruction/RECONSTRUCTION-CHECKLIST.md
sed -n '1,160p' support/path-f-reconstruction/GLOSSARY.md
sed -n '1,120p' support/path-f-reconstruction/tools/INDEX.md
```

A fresh consumer should be able to choose a folder for their task without opening `WORDCOUNT.md` or browsing every generated source page.
