# UNanofabTools — Layperson Presentations

Plain-English guides and slide decks for every tool in the UNanofabTools repository. Each folder below contains a `README.md` (the layman guide) and a `slides/` subfolder (with one or more `.pptx` files plus a `_build/` source that lets the decks be regenerated).

The companion developer documentation lives in a parallel tree at `../documentation/UNanofabTools/`. Bugs and tech debt for each tool are kept separately in `../known-issues/UNanofabTools/` so the handoff materials stay clean.

## What's in each folder

| Folder | What it is | Status |
|--------|------------|--------|
| [`flaskserver/`](flaskserver/README.md) | The current website's server — auth, tasks, machine pages, sensor API, chemical inventory. The largest module; 16 layman docs + 16 decks. | **Active** |
| [`hscdownloader/`](hscdownloader/README.md) | The supply line that pulls each machine's run data from CORES and writes the spreadsheets the website displays. | **Active** |
| [`picofirmware/`](picofirmware/README.md) | The small programs running on the Raspberry Pi sensors (particles, vacuum gauges, Parylene streams) that feed the server. | **Active** — Pico firmware *(older copies; canonical: NanofabToolkit/PicoHelperTools)* |
| [`particlepctools/`](particlepctools/README.md) | The desktop particle-data viewer and the test-data generator. | **Active** — viewer is the older copy *(canonical: NanofabToolkit/ParticleSensor)*; generator is canonical here |
| [`filetransfer/`](filetransfer/README.md) | The per-machine PowerShell/batch scripts that ship each tool's logs up to the server. | **Active** |
| [`dattools/`](dattools/README.md) | DATfixer + DATgrapher: convert the Denton 635's binary logs into readable text and pressure-vs-time charts. | **Active** |
| [`utilities/`](utilities/README.md) | A handful of small helpers — peak counter, certificate converter, chem-DB setup, a developer file fetcher, and one unfinished stub. | **Active** (mixed) |
| [`serveraccess/`](serveraccess/README.md) | How to actually log in to the server — the two-hop SSH route through CADE, the shared `phelan` account, and how to use the `flaskserver` / `downloader` tmux sessions safely. | **Active** |
| [`liveserver/`](liveserver/README.md) | What's actually running on `nfhistory` right now — a plain-English tour from a real read-only survey: TLS certs, services, what's healthy, what's weird. | **Active** |
| [`hscdisplayerserver/`](hscdisplayerserver/README.md) | The original all-in-one server from before the modern site existed. | **Deprecated — kept for historical reference** |

## How the materials fit together

For each tool you get three things:

1. **A layman guide** in this tree (`presentation/UNanofabTools/<tool>/README.md`) — the plain-English version, for non-coders.
2. **A slide deck** (`presentation/UNanofabTools/<tool>/slides/*.pptx`) — the same material as slides with full speaker notes, suitable for presenting.
3. **Developer documentation** in the parallel tree (`documentation/UNanofabTools/<tool>/`) — the formal reference for whoever maintains the code.

A separate `known-issues/UNanofabTools/<tool>.md` file lists bugs and tech debt for each tool, kept out of the docs so a successor sees a clean handoff and a maintainer sees a tidy to-do list.

## Where to start

- New to the system? Open [`flaskserver/README.md`](flaskserver/README.md) and the **Start Here** deck in `flaskserver/slides/`.
- Looking for a specific tool? Jump straight to its folder above.
- Maintaining the code? Use the developer documentation tree instead.
