# Path F Fixture And Evidence Index

Use this file before accepting any proof check that depends on a `known`, `representative`, or `expected` input. Path F includes sanitized source excerpts, not a complete fixture corpus. A maintainer must either point to an approved sample/evidence artifact or explicitly document the substitute used.

## Required Fields For Every Fixture

| Field | Required content |
|---|---|
| Fixture ID | Stable name such as `ALD-pressure-sample-001` or `flask-login-flow-2026-06-03`. |
| Owner | Nanofab / University IT / CORES / hardware owner / mixed. |
| Storage location | Repository path, secure storage path, live snapshot path, or reason it cannot be stored here. |
| Hash or identifier | SHA-256 for files, API request/response ID, screenshot filename, database snapshot ID, or hardware serial/MAC. |
| Expected result | Exact count, CSV shape, route status, rendered page, GUI state, log line, or hardware observation. |
| Secret handling | Confirm no secret value is stored in the fixture; if redacted, name the approved source. |
| Last verified | Date, maintainer, and command or workflow used. |

## Current Fixture Status

No binary/sample fixture files are stored in this documentation repo by default. The table below records the fixture class each tool needs before its proof checks can be considered complete.

| Tool | Needed fixtures or evidence | Acceptable substitute when fixture is unavailable |
|---|---|---|
| [`UNanofabTools/repo-overview-and-entrypoints`](tools/UNanofabTools/repo-overview-and-entrypoints/README.md) | Adjacent repo location; Python environment; production host facts from live verification | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`UNanofabTools/flaskserver`](tools/UNanofabTools/flaskserver/README.md) | .env values for Flask secret, Duo, database, and production host behavior; local SQLite instance files or migrations; local PostgreSQL chem database credentials; HSCDATA and LogData directory contents; nginx/TLS/service configuration from live server docs | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`UNanofabTools/hscdownloader`](tools/UNanofabTools/hscdownloader/README.md) | CORES bearer token from secure storage; CORES service IDs; HSCDATA directory permissions; network access to n8n | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`UNanofabTools/filetransfer`](tools/UNanofabTools/filetransfer/README.md) | Machine control PC paths; SSH key or service account approved for transfer; server destination path; network reachability | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`UNanofabTools/picofirmware`](tools/UNanofabTools/picofirmware/README.md) | WiFi SSID and password from secure local config; Pico MAC/device identity; server endpoint URL; sensor wiring | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`UNanofabTools/particlepctools`](tools/UNanofabTools/particlepctools/README.md) | Particle API URL; TLS behavior; test server target; room naming convention | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`UNanofabTools/dattools`](tools/UNanofabTools/dattools/README.md) | Representative Denton `.DAT` logs; matplotlib backend; local filesystem write permission | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`UNanofabTools/utilities`](tools/UNanofabTools/utilities/README.md) | Input data files; PFX/certificate password from secure storage; SSH host/key material; database credentials | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`UNanofabTools/hscdisplayerserver`](tools/UNanofabTools/hscdisplayerserver/README.md) | Historical HSCDATA files; legacy server host assumptions | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`NanofabToolkit/PicoHelperTools`](tools/NanofabToolkit/PicoHelperTools/README.md) | WiFi credentials from secure storage; Pico device identity; server URL; sensor wiring and power | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`NanofabToolkit/ParticleSensor`](tools/NanofabToolkit/ParticleSensor/README.md) | Particle API URL; TLS/certificate behavior; PyQt/matplotlib dependencies; packaging assets | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`NanofabToolkit/ALDPeakCounter`](tools/NanofabToolkit/ALDPeakCounter/README.md) | Representative ALD data files; PyQt/matplotlib/scipy stack; packaging icon/assets | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`NanofabToolkit/DentonDecoder`](tools/NanofabToolkit/DentonDecoder/README.md) | Representative Denton logs; GUI dependencies; packaging hooks/assets | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`NanofabToolkit/ParalyneReader`](tools/NanofabToolkit/ParalyneReader/README.md) | Representative Parylene logs; GUI dependencies; packaging icon/assets | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`NanofabToolkit/PreciousMetalReader`](tools/NanofabToolkit/PreciousMetalReader/README.md) | Approved data endpoint credentials; month/date inputs; GUI dependencies; packaging assets | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |
| [`NanofabToolkit/packaging-root`](tools/NanofabToolkit/packaging-root/README.md) | GitHub Actions environment; PyInstaller dependency versions; release artifact expectations | Written evidence in `REBUILD-EVIDENCE-TEMPLATE.md` naming why the fixture is unavailable, what live/sample evidence was used instead, and what risk remains. |

## Closure Rule

If a proof check says `known input`, `representative file`, `expected output`, `sample response`, or `hardware observation`, do not close the task until this file or the rebuild evidence template names the exact artifact used. If the artifact contains secrets or regulated data, store only a redacted derivative, hash, owner, and retrieval procedure here.
