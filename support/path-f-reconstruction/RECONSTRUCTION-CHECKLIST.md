# Path F Reconstruction Checklist

Use this checklist to decide whether a rebuild is actually complete. The source-file pages explain line-level behavior; this file defines the proof gates that prevent a maintainer from getting buried in detail without finishing the system.

## Universal Completion Gates

1. **Scope gate**: name the exact tool folder, source files, external inputs, and live systems involved.
2. **Recreate gate**: rebuild the files, commands, routes, templates, schemas, or firmware behavior from the sanitized excerpts and notes.
3. **Edge-case gate**: test the universal edge cases that apply: empty input, malformed input, missing file, permission denied, stale credential, schema drift, partial write, concurrent request, wrong working directory, wrong user account, IT boundary, and production-vs-development configuration.
4. **Evidence gate**: save command output, screenshots, generated files, database diffs, logs, or written observations that prove the rebuilt behavior matches the documented contract.
5. **Handoff gate**: write down any deliberate compatibility break, unresolved live-state difference, redacted value location, or IT ticket.

## Source-Of-Truth Order

1. Live production evidence wins over generated documentation for operational reality.
2. If sibling source repos are present, current source can reveal drift; record that drift before overriding this manual.
3. If the source tree is unavailable, generated Path F source excerpts win over memory and guesses.
4. Historical notes explain why something exists, but they do not override current source or live state.
5. Dirty/untracked source listed in `SOURCE-MANIFEST.json` must be acknowledged before claiming exact regeneration.

## Fixture And Evidence Rule

Every proof check that mentions a known input, representative file, expected output, screenshot, live response, or hardware observation must be tied to [`FIXTURE-AND-EVIDENCE-INDEX.md`](FIXTURE-AND-EVIDENCE-INDEX.md). If no fixture exists yet, record an acceptable substitute and mark the proof as partial rather than silently passing it.

## Secret And Configuration Rule

Every redacted value must be supplied through approved configuration, a local `.env`, secure firmware provisioning, University IT, or another approved secret channel. Never reconstruct a live secret by guessing from placeholder length, surrounding prose, old screenshots, generated excerpts, or shell history.

## Per-Tool Proof Checklist

### `UNanofabTools/repo-overview-and-entrypoints`

- Folder: [`tools/UNanofabTools/repo-overview-and-entrypoints/README.md`](tools/UNanofabTools/repo-overview-and-entrypoints/README.md)
- Source files covered: `6`
- Role: Repository-level orientation, setup notes, migration summaries, and legacy handoff context.
- External inputs to identify before rebuilding:
  - Adjacent repo location
  - Python environment
  - production host facts from live verification
- Proof checks:
  - A new maintainer can explain which code is modern, which code is historical, and where each tool lives.
  - The recreated repo has the same top-level entrypoint and setup expectations.
  - No repo-level note contradicts the current Path F navigator or source manifest.
- Drift traps to check:
  - Old README claims may predate the Flask refactor.
  - Treat live production as stronger evidence than historical migration notes.

### `UNanofabTools/flaskserver`

- Folder: [`tools/UNanofabTools/flaskserver/README.md`](tools/UNanofabTools/flaskserver/README.md)
- Source files covered: `79`
- Role: Modern Flask web application, including auth, tasks, machine pages, particle-data API, chemical inventory, templates, static assets, config, and migrations.
- External inputs to identify before rebuilding:
  - .env values for Flask secret, Duo, database, and production host behavior
  - local SQLite instance files or migrations
  - local PostgreSQL chem database credentials
  - HSCDATA and LogData directory contents
  - nginx/TLS/service configuration from live server docs
- Proof checks:
  - A clean virtualenv can install requirements and import `app` plus `run.py` without missing local modules.
  - A local Flask instance serves login, tasks, machines, and chem pages with the expected templates.
  - Particle POST and GET contracts match the firmware and desktop viewers.
  - Chem inventory operations use local PostgreSQL assumptions and preserve barcode, transaction, and scan flows.
  - Route inventory and configuration names match the source and the formal developer docs.
- Drift traps to check:
  - Chem PostgreSQL is local to the VM, not an external database server.
  - Device ingest routes have different auth expectations than browser routes.
  - Templates and JavaScript rely on exact route names and field names.

### `UNanofabTools/hscdownloader`

- Folder: [`tools/UNanofabTools/hscdownloader/README.md`](tools/UNanofabTools/hscdownloader/README.md)
- Source files covered: `1`
- Role: CORES n8n data downloader that writes HSCDATA CSVs consumed by the machine portal.
- External inputs to identify before rebuilding:
  - CORES bearer token from secure storage
  - CORES service IDs
  - HSCDATA directory permissions
  - network access to n8n
- Proof checks:
  - A test CORES response can be normalized into the expected full and `small_` CSV files.
  - Every active `save<Machine>()` path writes the expected columns.
  - The Flask machines page can read the recreated `small_` files.
- Drift traps to check:
  - A rotated token looks like stale machine data.
  - Changing CSV columns can silently break graph rendering.

### `UNanofabTools/filetransfer`

- Folder: [`tools/UNanofabTools/filetransfer/README.md`](tools/UNanofabTools/filetransfer/README.md)
- Source files covered: `6`
- Role: Windows and shell transfer scripts that move machine-controller files to the server.
- External inputs to identify before rebuilding:
  - Machine control PC paths
  - SSH key or service account approved for transfer
  - server destination path
  - network reachability
- Proof checks:
  - A dry run or test file transfer reaches the expected server directory.
  - Paths with spaces and missing source directories fail visibly.
  - The recreated script does not depend on undocumented personal credentials.
- Drift traps to check:
  - Personal-account dependencies are not a long-term operational model.
  - Windows quoting failures can look like authentication failures.

### `UNanofabTools/picofirmware`

- Folder: [`tools/UNanofabTools/picofirmware/README.md`](tools/UNanofabTools/picofirmware/README.md)
- Source files covered: `6`
- Role: Older UNanofabTools copies of Pico firmware and Pico diagnostics.
- External inputs to identify before rebuilding:
  - WiFi SSID and password from secure local config
  - Pico MAC/device identity
  - server endpoint URL
  - sensor wiring
- Proof checks:
  - A Pico can boot the recreated firmware without import errors.
  - WiFi diagnostics succeed or fail with clear output.
  - Sensor payloads match the Flask particle or machine API contracts.
- Drift traps to check:
  - Canonical Pico firmware lives in NanofabToolkit/PicoHelperTools.
  - Some UNanofabTools Pico scripts are incomplete or historical.

### `UNanofabTools/particlepctools`

- Folder: [`tools/UNanofabTools/particlepctools/README.md`](tools/UNanofabTools/particlepctools/README.md)
- Source files covered: `3`
- Role: Older PC-side particle data viewer and synthetic particle-data generator.
- External inputs to identify before rebuilding:
  - Particle API URL
  - TLS behavior
  - test server target
  - room naming convention
- Proof checks:
  - The viewer can fetch current and historical particle data from a test server.
  - Room labels color correctly from API `room_name` and `sensor_number` values.
  - The generator can target localhost without accidentally writing to production.
- Drift traps to check:
  - Canonical maintained viewer behavior is in NanofabToolkit/ParticleSensor.
  - Timezone conversion has known drift risk.

### `UNanofabTools/dattools`

- Folder: [`tools/UNanofabTools/dattools/README.md`](tools/UNanofabTools/dattools/README.md)
- Source files covered: `3`
- Role: DATfixer and DATgrapher command-line tools for Denton 635 log conversion and plotting.
- External inputs to identify before rebuilding:
  - Representative Denton `.DAT` logs
  - matplotlib backend
  - local filesystem write permission
- Proof checks:
  - A representative `.DAT` file produces the same cleaned text shape.
  - A cleaned text file produces the expected pressure/time plot.
  - Malformed or incomplete logs fail with a documented message.
- Drift traps to check:
  - DATfixer and DATgrapher duplicate parsing assumptions.
  - Graph display behavior differs on headless hosts.

### `UNanofabTools/utilities`

- Folder: [`tools/UNanofabTools/utilities/README.md`](tools/UNanofabTools/utilities/README.md)
- Source files covered: `6`
- Role: Standalone helpers including peak counting, certificate conversion, SSH fetch helper, chem DB init, and unfinished monitor storage.
- External inputs to identify before rebuilding:
  - Input data files
  - PFX/certificate password from secure storage
  - SSH host/key material
  - database credentials
- Proof checks:
  - Peak counting returns the same cycle count on known input.
  - Certificate conversion writes files in the expected format without exposing passwords.
  - SSH fetch behavior is either recreated as a personal dev helper or replaced by a documented safer flow.
- Drift traps to check:
  - Do not promote personal helper credentials to production.
  - Some files are intentionally stubs or one-off scripts.

### `UNanofabTools/hscdisplayerserver`

- Folder: [`tools/UNanofabTools/hscdisplayerserver/README.md`](tools/UNanofabTools/hscdisplayerserver/README.md)
- Source files covered: `1`
- Role: Legacy monolithic HSC displayer server retained for historical reference.
- External inputs to identify before rebuilding:
  - Historical HSCDATA files
  - legacy server host assumptions
- Proof checks:
  - A maintainer can identify which behavior moved to the Flask server.
  - Any recreated legacy behavior is isolated from the production Flask path.
- Drift traps to check:
  - Do not revive legacy server code as the primary path without a written migration reason.

### `NanofabToolkit/PicoHelperTools`

- Folder: [`tools/NanofabToolkit/PicoHelperTools/README.md`](tools/NanofabToolkit/PicoHelperTools/README.md)
- Source files covered: `8`
- Role: Canonical Pico firmware and helper scripts for sensor devices.
- External inputs to identify before rebuilding:
  - WiFi credentials from secure storage
  - Pico device identity
  - server URL
  - sensor wiring and power
- Proof checks:
  - A Pico can run the recreated boot and sensor script without missing modules.
  - Network check and MAC discovery work on hardware.
  - Payloads accepted by the Flask API are byte-for-byte compatible in field names and units.
- Drift traps to check:
  - Hard-coded secrets must be replaced by approved configuration.
  - Hardware failures can masquerade as firmware failures.

### `NanofabToolkit/ParticleSensor`

- Folder: [`tools/NanofabToolkit/ParticleSensor/README.md`](tools/NanofabToolkit/ParticleSensor/README.md)
- Source files covered: `7`
- Role: Canonical desktop particle sensor viewer and API client.
- External inputs to identify before rebuilding:
  - Particle API URL
  - TLS/certificate behavior
  - PyQt/matplotlib dependencies
  - packaging assets
- Proof checks:
  - The GUI launches from a clean environment.
  - Current and historical API responses render with the expected rooms, tables, and charts.
  - Packaging inputs still produce an executable with the expected assets.
- Drift traps to check:
  - Keep API processing and GUI copies synchronized.
  - Timezone handling is a known risk area.

### `NanofabToolkit/ALDPeakCounter`

- Folder: [`tools/NanofabToolkit/ALDPeakCounter/README.md`](tools/NanofabToolkit/ALDPeakCounter/README.md)
- Source files covered: `7`
- Role: Desktop GUI for ALD pressure peak counting.
- External inputs to identify before rebuilding:
  - Representative ALD data files
  - PyQt/matplotlib/scipy stack
  - packaging icon/assets
- Proof checks:
  - Known ALD data returns the same peak count.
  - The GUI can load one file and multiple files.
  - Packaged app includes required plotting hooks and assets.
- Drift traps to check:
  - The peak algorithm overlaps UNanofabTools/peakCount.py.
  - Boundary peaks are easy to miss.

### `NanofabToolkit/DentonDecoder`

- Folder: [`tools/NanofabToolkit/DentonDecoder/README.md`](tools/NanofabToolkit/DentonDecoder/README.md)
- Source files covered: `7`
- Role: Desktop Denton decoder and graphing tool.
- External inputs to identify before rebuilding:
  - Representative Denton logs
  - GUI dependencies
  - packaging hooks/assets
- Proof checks:
  - Known Denton input converts to the expected readable output.
  - Graphs render without blocking or missing dependencies.
  - The GUI and packaged executable launch successfully.
- Drift traps to check:
  - Do not confuse this GUI workflow with UNanofabTools command-line DAT tools.

### `NanofabToolkit/ParalyneReader`

- Folder: [`tools/NanofabToolkit/ParalyneReader/README.md`](tools/NanofabToolkit/ParalyneReader/README.md)
- Source files covered: `6`
- Role: Desktop Parylene analog log reader and plotting GUI.
- External inputs to identify before rebuilding:
  - Representative Parylene logs
  - GUI dependencies
  - packaging icon/assets
- Proof checks:
  - Known Parylene logs load and plot correctly.
  - Malformed logs produce useful errors.
  - The GUI launches from source and packaged form.
- Drift traps to check:
  - Local logs and generated artifacts should not become source-of-truth documentation.

### `NanofabToolkit/PreciousMetalReader`

- Folder: [`tools/NanofabToolkit/PreciousMetalReader/README.md`](tools/NanofabToolkit/PreciousMetalReader/README.md)
- Source files covered: `5`
- Role: Desktop tool for retrieving and presenting precious metal usage data.
- External inputs to identify before rebuilding:
  - Approved data endpoint credentials
  - month/date inputs
  - GUI dependencies
  - packaging assets
- Proof checks:
  - A test retrieval returns the expected month data shape.
  - The GUI presents results without blocking or crashing on empty months.
  - Packaging includes required dependencies and assets.
- Drift traps to check:
  - Network/API failures need visible operator feedback.
  - Do not embed tokens in source.

### `NanofabToolkit/packaging-root`

- Folder: [`tools/NanofabToolkit/packaging-root/README.md`](tools/NanofabToolkit/packaging-root/README.md)
- Source files covered: `8`
- Role: NanofabToolkit root docs, shared packaging hooks, license, and CI workflow.
- External inputs to identify before rebuilding:
  - GitHub Actions environment
  - PyInstaller dependency versions
  - release artifact expectations
- Proof checks:
  - Packaging hooks are discoverable by PyInstaller.
  - The ParticleSensor build workflow still names the right paths.
  - Root metadata matches the tool folders.
- Drift traps to check:
  - Packaging fixes can affect multiple desktop tools.
  - Generated release artifacts are not source files.

## Final No-Contact Test

A future maintainer passes Path F only when they can pick any one tool folder, state what it owns, identify what external values must come from outside the repo, rebuild or simulate the tool, run the proof checks, and explain whether remaining work belongs to Nanofab engineering or University IT.
