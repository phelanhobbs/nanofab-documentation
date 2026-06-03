# Medium Full Path E - Module 09: Device APIs

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-09-device-apis.md

# Module 9 - Device APIs And Sensor Data

## Goal

The maintainer understands device-facing routes, Pico sensor data flow, unauthenticated endpoint exposure, expected payloads, and known data-contract gaps.

## Required Screen

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx)
- `presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx)
- `presentation/UNanofabTools/flaskserver/08-IoT-API-Endpoints.md` (repo path: presentation/UNanofabTools/flaskserver/08-IoT-API-Endpoints.md)
- `presentation/UNanofabTools/flaskserver/12-Consumers-NanofabToolkit.md` (repo path: presentation/UNanofabTools/flaskserver/12-Consumers-NanofabToolkit.md)
- `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` (repo path: documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md)

## Verbatim Script

READ ALOUD:

"Device APIs are different from normal browser pages. Browser pages usually assume a logged-in human. Device endpoints may be called by Pico devices or other small clients. That means the maintainer must understand payload shape, validation, storage side effects, and whether the endpoint is authenticated."

SHOW:

Open `08-IoT-API-Endpoints.pptx`.

READ ALOUD:

"The most important conceptual split is people versus devices. People authenticate through the web app. Devices post structured data. If device routes are unauthenticated, that may be a practical choice for embedded devices, but it is still a security and data-integrity risk. The docs and known-issues files should say so clearly."

SHOW:

Open `12-Consumers-NanofabToolkit.pptx`.

READ ALOUD:

"The Pico firmware and desktop tools are consumers or producers around the Flask app. This is why canonical source matters. For PicoHelperTools and ParticleSensor, the canonical code lives in NanofabToolkit, not the older copies under UNanofabTools."

## Source Demo

DO:

Run:

```sh
rg -n "sensor-data|env-data|particle|room_name|sensor_number|raw_measurements|converted_values" ../UNanofabTools/app ../NanofabToolkit
```

READ ALOUD:

"This search connects endpoint names to source code and client code. If a Pico sends `room_name` and `sensor_number`, the server docs, firmware docs, and desktop viewer docs should all agree about those names. If a room label changes in one place but not another, the system can silently stop matching data."

SHOW:

Open `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` (repo path: documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md).

READ ALOUD:

"A data contract is the agreement between producer and consumer. It includes endpoint path, method, required fields, optional fields, units, storage side effects, and response shape. A future maintainer should update the contract whenever firmware, server routes, or desktop tools change."

## Known Gap Frame

READ ALOUD:

"The docs call out data-contract gaps where relevant. For example, if a POST writes one storage location but a GET reads another, that is not just a code curiosity. It means a user or tool can get a 404 even though data was posted. These mismatches belong in known issues until fixed."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Which endpoints receive device data? | Device API routes such as `/sensor-data` and `/env-data`, as documented in the endpoint/integration docs. |
| Which fields identify a sensor? | `room_name` and `sensor_number`. |
| Why are unauthenticated device routes risky? | Anyone who can reach them may submit false, malformed, or abusive data unless other controls exist. |
| Where is canonical Pico firmware? | `../NanofabToolkit/PicoHelperTools/`. |
| Where is canonical ParticleSensor code? | `../NanofabToolkit/ParticleSensor/`. |
| What can break if room names or sensor numbers drift? | Server storage, map coloring, viewer lookups, and device-data matching can silently fail or mislabel data. |
| How would you audit a server endpoint against firmware? | Compare server route path/method/fields to firmware POST code, payload names, units, response handling, and docs. |

REQUIRE:

The maintainer can explain one device data flow from Pico payload to server route to stored data to viewer.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot identify canonical NanofabToolkit code for PicoHelperTools and ParticleSensor.


# Expanded Module 09: Device APIs

READ ALOUD:

This expanded section revisits Module 09, Device APIs. The focus is Pico/device payloads, unauthenticated routes, and data contracts. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 09

READ ALOUD:

We are now doing the orientation pass for Device APIs. The maintainer should connect this module to Pico/device payloads, unauthenticated routes, and data contracts. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx`
- `presentation/UNanofabTools/flaskserver/slides/11-Particle-Demo.pptx`
- `presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention Pico/device payloads, unauthenticated routes, and data contracts. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 09

READ ALOUD:

We are now doing the evidence pass for Device APIs. The maintainer should connect this module to Pico/device payloads, unauthenticated routes, and data contracts. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx`
- `presentation/UNanofabTools/flaskserver/slides/11-Particle-Demo.pptx`
- `presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention Pico/device payloads, unauthenticated routes, and data contracts. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Source-code pass for Module 09

READ ALOUD:

We are now doing the source-code pass for Device APIs. The maintainer should connect this module to Pico/device payloads, unauthenticated routes, and data contracts. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx`
- `presentation/UNanofabTools/flaskserver/slides/11-Particle-Demo.pptx`
- `presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention Pico/device payloads, unauthenticated routes, and data contracts. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Live-state pass for Module 09

READ ALOUD:

We are now doing the live-state pass for Device APIs. The maintainer should connect this module to Pico/device payloads, unauthenticated routes, and data contracts. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx`
- `presentation/UNanofabTools/flaskserver/slides/11-Particle-Demo.pptx`
- `presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention Pico/device payloads, unauthenticated routes, and data contracts. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Failure-mode pass for Module 09

READ ALOUD:

We are now doing the failure-mode pass for Device APIs. The maintainer should connect this module to Pico/device payloads, unauthenticated routes, and data contracts. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx`
- `presentation/UNanofabTools/flaskserver/slides/11-Particle-Demo.pptx`
- `presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention Pico/device payloads, unauthenticated routes, and data contracts. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Module Documentation Corpus



# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 08 — Integrations & Data Contracts

The server integrates with device/desktop tools over HTTP, plus two backend services (Duo and the local PostgreSQL chem database). This document specifies the **data contracts** so a maintainer can change either side without breaking the other. The canonical, currently-maintained device/desktop clients live in the sibling `NanofabToolkit` repository — see `documentation/NanofabToolkit/PicoHelperTools/` (repo path: documentation/NanofabToolkit/PicoHelperTools/README.md) (the producers) and `documentation/NanofabToolkit/ParticleSensor/` (repo path: documentation/NanofabToolkit/ParticleSensor/README.md) (the desktop viewer). Older copies retained in *this* repository are documented at `documentation/UNanofabTools/picofirmware/` and `documentation/UNanofabTools/particlepctools/` for historical reference.

## 8.1 Integration map

| Direction | Counterpart | Endpoint(s) | Transport |
|-----------|-------------|-------------|-----------|
| Inbound | SPS30 particle Pico (`Particle_sensor.py`) | `POST /particle-data` | JSON/HTTPS |
| Inbound | DHT22 env Pico (`DHT22_sensor.py`) | `POST /env-data` | JSON/HTTPS |
| Inbound | Combined Pico (`sensor_combined.py`) | `POST /sensor-data` | JSON/HTTPS |
| Inbound | Parylene Pi (on-tool script) | `POST /sdsanalog`, `POST /sdsanalogfinished` | CSV/HTTPS + headers |
| Inbound | Denton 18 Pi (on-tool script) | `POST /denton18pump`, `POST /denton18pumpfinished` | JSON/HTTPS |
| Outbound (server serves) | ParticleSensor desktop GUI (`gui.py`) | `GET /particle-data`, `GET /env-data` | JSON/HTTPS |
| Outbound | ParalyneReader desktop (`ParalyneReader.py`) | `GET /api/paralyne/analog/{list,download/<f>}` | JSON+file/HTTPS |
| Backend | Duo Security | duo-client → Duo API | HTTPS |
| Backend | PostgreSQL | psycopg2 → `cheminventory` | TCP |

> Not an integration with this server: `PreciousMetalReader` in NanofabToolkit calls `n8n.cores.utah.edu`, a separate Utah CORES service. Don't look for a route here for it.

All device clients connect with `verify=False` (TLS without certificate validation) because the server uses an internal certificate not in their trust stores, and the devices sit on a private SSID (`ULink`, hardcoded in firmware). This is perimeter trust, not authenticated requests.

## 8.2 Particle sensor contract (`POST /particle-data`)

**Producer:** `NanofabToolkit/PicoHelperTools/Particle_sensor.py` (MicroPython on a Pico W with an SPS30).

**Required top-level keys:** `room_name` (str), `sensor_number` (str), `timestamp` (Unix seconds as number, or ISO 8601 string).

**Payload shape:**

```json
{
  "room_name": "HEADLESS",
  "sensor_number": "009",
  "timestamp": 1747876800.0,
  "raw_measurements": {
    "mass_pm1": 0.0, "mass_pm2_5": 0.0, "mass_pm4": 0.0, "mass_pm10": 0.0,
    "num_pm0_5": 0.0, "num_pm1": 0.0, "num_pm2_5": 0.0, "num_pm4": 0.0, "num_pm10": 0.0,
    "typical_particle_size_um": 0.0
  },
  "converted_values": {
    "number_concentrations_ft3": { "pm0_5": 0.0, "pm1": 0.0, "pm2_5": 0.0, "pm4": 0.0, "pm10": 0.0 },
    "differential_bins_ft3":     { "bin_0_3_to_0_5": 0.0, "bin_0_5_to_1_0": 0.0, "bin_1_0_to_2_5": 0.0, "bin_2_5_to_4_0": 0.0, "bin_4_0_to_10": 0.0 },
    "mass_concentrations_ug_m3": { "pm1": 0.0, "pm2_5": 0.0, "pm4": 0.0, "pm10": 0.0 }
  }
}
```

**Server actions:** append a row to `LogData/particle_sensors/<room>_<sensor>_historical.csv`; upsert the latest reading into `particle_sensor_data` (unique on `(room_name, sensor_number)`).

**Timestamp note:** the Pico's RP2040 epoch is 2000-01-01; firmware adds `946684800` (`MICROPYTHON_TO_UNIX_EPOCH`) before sending so the server receives Unix-epoch seconds. It also applies a local UTC offset. If you change timestamp handling server-side, account for this.

**Response:** `200 {"status":"success","message":...,"sensor_id":"<room>/<sensor>","timestamp":<iso>}`.

The GET side returns the same nested structure (`ParticleSensorData.to_dict()`), making POST and GET symmetric.

## 8.3 Environmental sensor contract (`POST /env-data`)

**Producer:** `PicoHelperTools/DHT22_sensor.py`.

**Required keys (all):** `room_name`, `sensor_number`, `timestamp`, `temperature_c`, `humidity_pct`.

```json
{ "room_name": "Bay C", "sensor_number": "003", "timestamp": 1747876800.0,
  "temperature_c": 21.4, "humidity_pct": 38.2 }
```

**Server action:** append to `LogData/env_sensors/<room>_<sensor>_historical.csv` (header written on first row). `temperature_c`/`humidity_pct` are coerced to float (a non-numeric value raises and yields a 500).

## 8.4 Combined sensor contract (`POST /sensor-data`)

**Producer:** `PicoHelperTools/sensor_combined.py` (SPS30 + DHT22 in one payload).

**Required:** `room_name`, `sensor_number`. **Optional:** `timestamp`, `temperature_c`, `humidity_pct`, and the same `raw_measurements`/`converted_values` blocks as `/particle-data`.

**Server actions:**
- If `raw_measurements` present → `log_historical_particle_data` (→ `particle_sensors/` CSV) and upsert `particle_sensor_data` (including temp/humidity columns).
- If `temperature_c` and `humidity_pct` present → append `env_sensors/<id>_historical.csv`.

This endpoint is the recommended target for new sensors (it subsumes `/particle-data` and `/env-data`). The decoupled writes mean a failed DHT22 read still records particle data and vice-versa.

> Contract caveat: `GET /sensor-data` reads `LogData/sensors/<id>_combined.csv`, which this POST never writes. To retrieve combined history today, use `GET /particle-data?room_name=…&sensor_number=…` and `GET /env-data?…`. (See known-issues.)

## 8.5 Parylene analog batch contract (`POST /sdsanalog`)

**Producer:** the Parylene tool's Raspberry Pi (on-device script; not in NanofabToolkit).

**Content-Type:** `text/csv`. **Headers:**
- `X-Session-ID` — unique per run (required).
- `X-Batch-Number` — 1-based integer (required).
- `X-Total-Batches` — integer (required).
- `X-Is-Final-Batch` — `"true"` to force finalize (optional).

**Body:** raw CSV rows. The combined output uses header `timestamp,pressure,vapor,temp`.

**Lifecycle:**
1. Each batch → `LogData/Paralyne/temp/<session>/batch_NNNN.csv` (4-digit zero-padded).
2. First batch also writes `start_time.txt`.
3. When received count == total (or final flag), the server combines into `LogData/Paralyne/analog/<starttime>_SDSLOG_combined_<session>.csv`.
4. `POST /sdsanalogfinished` (with `session_id` in JSON body or `X-Session-ID` header) forces the combine and deletes the temp dir.

**Consumer:** `ParalyneReader.py` later retrieves combined files via `GET /api/paralyne/analog/list` and `/download/<filename>`.

## 8.6 Denton 18 pump contract (`POST /denton18pump`)

**Producer:** Denton 18 Pi (on-device script).

**Body:** `{ "pressure": <raw ADC integer> }`.

**Conversion (server):** `pressure = raw / 65535.0 * 3.3 * 3.0 / 0.009` — 16-bit ADC full-scale 65535, 3.3 V reference, ×3 divider, 9 mV/unit transducer. If you change probe hardware, update this formula in `api.denton18_pump`.

**Lifecycle:** a sentinel `LogData/denton18/pumpdata/current_run.txt` points at the active CSV; samples append to it; `POST /denton18pumpfinished` deletes the sentinel so the next sample starts a fresh `<ts>_DENTON18PUMPLOG.csv`.

## 8.7 Desktop consumer contracts (outbound GETs)

### ParticleSensor GUI (`ParticleSensor/src/gui.py`)
- `GET /particle-data` (no params) → current snapshot of all sensors (renders the cleanroom map).
- `GET /particle-data?room_name=…&sensor_number=…` → historical CSV for one sensor (drill-down).
- `GET /env-data?room_name=…&sensor_number=…` → env history (optional overlay).

Room labels in the GUI (`"Bay A\n2025N"`, etc.) must correspond to the `room_name` values the Picos send for correlation to work.

### ParalyneReader (`ParalyneReader/src/ParalyneReader.py`)
- `GET /api/paralyne/analog/list` → `{files:[{filename,size,modified,download_url}], count}`.
- `GET /api/paralyne/analog/download/<filename>` → file bytes (attachment).
- (`return_selected` in the client calls `/return/<filename>`, which the server does **not** implement; that client function is dead.)

## 8.8 Duo integration

- Library: `duo-client` 5.3.0.
- Config: `DUO_IKEY`, `DUO_SKEY`, `DUO_HOST`.
- Call: `duo_client.Auth(...).auth(username=<unid>, factor='push', device='auto')`; success = `result == 'allow'`.
- Invoked from login and signup (skipped when `DEBUG_MODE`). See `07` §7.7.

## 8.9 PostgreSQL integration

- Driver: `psycopg2-binary`; access via SQLAlchemy Core engine (`chem_service.get_chem_engine`).
- Pooling: `pool_pre_ping=True, pool_size=5, max_overflow=10` (≤15 concurrent connections).
- Lazy: the engine is created on first `/chem/*` use, so the app boots fine without Postgres if chem is unused.
- Provisioning: `init_chem_db.py` + `chem_schema.sql` + `chem_schema_migration_v2.sql` (plus the runtime-only objects noted in `04` §4.4).

## 8.10 End-to-end example (particle data round trip)

```
Pico SPS30 read
  → JSON payload (8.2)
  → POST https://nfhistory.nanofab.utah.edu/particle-data
  → nginx TLS → Flask 127.0.0.1:5000 → api.receive_particle_data
       → append particle_sensors/<id>_historical.csv
       → upsert particle_sensor_data
  → 200

ParticleSensor GUI
  → GET /particle-data            → all current readings (map)
  → GET /particle-data?room&sensor → historical CSV (chart)
```

## 8.11 Versioning & change guidance

There is no explicit API versioning. To evolve a contract safely:
- **Additive changes** (new optional JSON keys) are safe; handlers use `.get(...)` with defaults.
- **Renaming/removing keys** breaks firmware already flashed in the field — coordinate a firmware update or accept both shapes for a transition period.
- **CSV header changes** affect both the on-disk historical files and the desktop readers; migrate existing files or version the filename.
- When adding a new device type, prefer a new endpoint + its own CSV/table over overloading an existing one.

Continue to 09-deployment-and-operations.md (repo path: documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md).


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/08-IoT-API-Endpoints.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 08 — IoT API Endpoints

The file `app/blueprints/api.py` is the server's "back door" for machines: it accepts data pushed by Raspberry Pi Picos and PCs sitting next to lab equipment, and it serves that data back out to consumers in JSON or CSV form. None of these routes require a login — the clients are devices, not humans. Authenticity here relies on the network being locked down (the Picos sit on a private campus SSID), and on the URLs being known only internally.

The endpoints fall into five categories:

| Category | Endpoints | What it does |
|----------|-----------|---------------|
| Parylene SDS analog stream | `/sdsanalog`, `/sdsanalogfinished`, `/api/paralyne/analog/list`, `/api/paralyne/analog/download/<name>` | Accept CSV batches from the Parylene Pi, combine them, expose for download |
| Denton 18 pump | `/denton18pump`, `/denton18pumpfinished` | Record vacuum-pressure samples and finalize the file when a run ends |
| Particle sensors (legacy single-purpose) | `/particle-data` (POST and GET) | Receive SPS30 readings, store latest in DB + history in CSV; retrieve current or historical readings |
| Combined particle+environment sensors | `/sensor-data` (POST and GET) | Receive a combined SPS30 + DHT22 payload, write both to per-sensor CSV and the DB |
| Standalone environmental sensors | `/env-data` (POST and GET) | Receive bare DHT22 temperature/humidity, log to CSV, return historical |

This document walks through them in turn.

## Parylene SDS analog streaming

The Parylene tool has a Raspberry Pi sampling its pressure/vapor/temperature analog lines several times a second. Rather than POST every sample individually, the Pi accumulates rows into CSV "batches" and POSTs each batch with headers identifying it. The server stores each batch as a separate file, then concatenates them at the end of a session.

### POST `/sdsanalog`

```python
@api_bp.route('/sdsanalog', methods=['POST'])
def sds_analog():
    """Handle SDS analog data from Raspberry Pi (Parylene machine)"""
    content_type = request.headers.get('Content-Type', '')

    if content_type == 'text/csv':
        return handle_csv_batch()
    else:
        return jsonify({'status': 'error', 'message': 'Unsupported content type'}), 400
```

A tiny dispatcher: only accepts `Content-Type: text/csv`. Calls the heavy helper `handle_csv_batch()`.

### `handle_csv_batch()`

```python
def handle_csv_batch():
    """Handle CSV batch data from Raspberry Pi"""
    try:
        csv_content = request.data.decode('utf-8')

        # Get batch information from headers
        session_id = request.headers.get('X-Session-ID')
        batch_number = request.headers.get('X-Batch-Number')
        total_batches = request.headers.get('X-Total-Batches')
        is_final_batch = request.headers.get('X-Is-Final-Batch', 'false').lower() == 'true'

        if not session_id or not batch_number or not total_batches:
            return jsonify({'status': 'error', 'message': 'Missing headers'}), 400

        batch_number = int(batch_number)
        total_batches = int(total_batches)

        # Write directly to disk
        temp_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'temp', session_id)
        os.makedirs(temp_dir, exist_ok=True)

        batch_file = os.path.join(temp_dir, f'batch_{batch_number:04d}.csv')
        start_time_file = os.path.join(temp_dir, 'start_time.txt')
        if not os.path.exists(start_time_file):
            with open(start_time_file, 'w') as f:
                f.write(datetime.now().strftime('%Y%m%d%H%M%S'))

        with open(batch_file, 'w', encoding='utf-8') as f:
            f.write(csv_content)

        # Check if all batches received
        received_batches = len([f for f in os.listdir(temp_dir) if f.startswith('batch_')])

        if received_batches == total_batches or is_final_batch:
            current_app.logger.info(f"Session {session_id} complete: {received_batches}/{total_batches} batches")
            combine_csv_batches_final(session_id, cleanup=False)

        return jsonify({
            'status': 'success',
            'message': f'Batch {batch_number}/{total_batches} received',
            'session_id': session_id
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error processing CSV batch: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

A handful of important details:

- **Three required headers** identify the batch: `X-Session-ID` (random ID for this run), `X-Batch-Number`, `X-Total-Batches`. Optional `X-Is-Final-Batch` short-circuits the count check if the Pi knows the run is done.
- Each session gets its own temp folder under `LogData/Paralyne/temp/<session>/`.
- The first batch also writes `start_time.txt` — this is the timestamp used in the eventual combined filename.
- Each batch is stored as `batch_NNNN.csv` with a 4-digit zero-padded number so simple lexicographic sort gives chronological order.
- After writing, the server counts files; if we've received every batch (or the Pi flagged this as the final batch), it kicks off `combine_csv_batches_final`.

### POST `/sdsanalogfinished`

```python
@api_bp.route('/sdsanalogfinished', methods=['POST'])
def sds_analog_finished():
    """Handle session finalization and combine all batches"""
    try:
        # Get session ID from request
        if request.content_length and request.content_length > 0:
            data = request.get_json()
            session_id = data.get('session_id') if data else None
        else:
            session_id = None

        if not session_id:
            session_id = request.headers.get('X-Session-ID')

        current_app.logger.info(f"Finalizing session: {session_id}")

        if session_id:
            current_app.logger.info(f"Finalizing session: {session_id}")
            combine_csv_batches_final(session_id)
            message = f"Session {session_id} finalized"
        else:
            message = "No session ID provided"

        return jsonify({'status': 'session_finalized', 'message': message}), 200
    ...
```

An explicit "we're done, please combine now" trigger. It accepts the session ID either in a JSON body or in the `X-Session-ID` header — whichever the Pi sends.

### `combine_csv_batches_final`

```python
def combine_csv_batches_final(session_id, cleanup=True):
    """Combine all CSV batches for a session from disk"""
    try:
        temp_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'Paralyne', 'temp', session_id)
        if not os.path.exists(temp_dir):
            return

        batches = sorted([f for f in os.listdir(temp_dir) if f.startswith('batch_')])

        if not batches:
            return

        # Determine timestamp
        start_time_file = os.path.join(temp_dir, 'start_time.txt')
        if os.path.exists(start_time_file):
            with open(start_time_file, 'r') as f:
                timestamp = f.read().strip()
        else:
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')

        # Create combined filename
        combined_filename = f"{timestamp}_SDSLOG_combined_{session_id}.csv"
        combined_filepath = os.path.join(
            current_app.config['LOG_DATA_DIR'],
            'Paralyne',
            'analog',
            combined_filename
        )

        os.makedirs(os.path.dirname(combined_filepath), exist_ok=True)

        # Write combined file
        with open(combined_filepath, 'w', newline='', encoding='utf-8') as combined_file:
            combined_file.write("timestamp,pressure,vapor,temp\n")

            for batch_filename in batches:
                batch_filepath = os.path.join(temp_dir, batch_filename)
                with open(batch_filepath, 'r', encoding='utf-8') as f:
                    batch_content = f.read()

                lines = batch_content.strip().split('\n')

                # Skip header if present
                if lines and lines[0].startswith('timestamp,pressure,vapor,temp'):
                    lines = lines[1:]

                for line in lines:
                    if line.strip():
                        combined_file.write(line.strip() + '\n')

        current_app.logger.info(f"Combined CSV created: {combined_filepath}")

        # Clean up if requested
        if cleanup and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

    except Exception as e:
        current_app.logger.error(f"Error combining CSV batches: {e}")
```

Step by step:

1. Find the session's temp folder.
2. List the batch files (already named so they sort chronologically).
3. Read the start time from `start_time.txt`.
4. Construct the final filename `<timestamp>_SDSLOG_combined_<session_id>.csv`.
5. Write a single combined CSV: header row first, then every batch's contents minus its own header.
6. Optionally delete the temp folder.

This means a finished Parylene run shows up as one neat CSV in `LogData/Paralyne/analog/`, which the log-file browser (covered in `07`) can list and graph.

### GET `/api/paralyne/analog/list` and `/api/paralyne/analog/download/<name>`

```python
@api_bp.route('/api/paralyne/analog/list', methods=['GET'])
def list_paralyne_files():
    """List Parylene analog files (unauthenticated endpoint)"""
    ...
    files = [f for f in os.listdir(directory_path) if f.endswith('.csv')]

    file_info = []
    for file in files:
        file_path = os.path.join(directory_path, file)
        stat = os.stat(file_path)
        file_info.append({
            'filename': file,
            'size': stat.st_size,
            'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
            'download_url': f'/api/paralyne/analog/download/{file}'
        })

    file_info.sort(key=lambda x: x['modified'], reverse=True)
    ...
```

```python
@api_bp.route('/api/paralyne/analog/download/<filename>', methods=['GET'])
def download_paralyne_file(filename):
    """Download a Parylene analog file (unauthenticated endpoint)"""
    if '..' in filename or '/' in filename or '\\' in filename:
        return jsonify({'error': 'Invalid filename'}), 400
    if not filename.endswith('.csv'):
        return jsonify({'error': 'File not found'}), 404
    ...
    return send_from_directory(directory_path, filename, as_attachment=True)
```

Two simple endpoints used by the NanofabToolkit `ParalyneReader` desktop app:

- `list` returns a JSON array of every combined CSV in the analog folder, with size and modified time.
- `download/<filename>` returns the file. The route uses `<filename>` (no path separator allowed by Flask's default converter), and additionally rejects any filename containing `..`, `/`, or `\` to prevent traversal. Only `.csv` files are served.

## Denton 18 vacuum pump logging

The Denton 18 evaporator's Pi posts pressure samples (a raw ADC reading, which the server converts to pressure) one at a time. Multiple samples accumulate in a single file across a session.

### POST `/denton18pump`

```python
@api_bp.route('/denton18pump', methods=['POST'])
def denton18_pump():
    """Handle Denton 18 pump data from Raspberry Pi"""
    try:
        data = request.get_json()
        pressure_val = data.get('pressure')

        state_dir = os.path.join(current_app.config['LOG_DATA_DIR'], 'denton18', 'pumpdata')
        os.makedirs(state_dir, exist_ok=True)
        state_file = os.path.join(state_dir, 'current_run.txt')

        if os.path.exists(state_file):
            with open(state_file, 'r') as f:
                denton18_log_file_location = f.read().strip()
        else:
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            filename = f"{timestamp}_DENTON18PUMPLOG.csv"
            denton18_log_file_location = os.path.join(state_dir, filename)

            with open(state_file, 'w') as f:
                f.write(denton18_log_file_location)

            with open(denton18_log_file_location, 'w', newline='') as f:
                writer = csv.writer(f)
                writer.writerow(['Timestamp', 'Vacuum pressure'])

        # Write data
        running_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        pressure_val = pressure_val / 65535.0 * 3.3 * 3.0 / 0.009

        with open(denton18_log_file_location, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([running_timestamp, pressure_val])

        return jsonify({'status': 'success'}), 200

    except Exception as e:
        current_app.logger.error(f"Error processing Denton18 pump data: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
```

The interesting bits:

- **`current_run.txt` is a sentinel file** indicating "we're in the middle of a run; here's the CSV path." If it exists, append to that CSV; if not, create a new timestamped CSV and write the header row, and record its path in `current_run.txt`.
- **The pressure conversion** is `raw / 65535 * 3.3 * 3.0 / 0.009`. Decoded: the Pico has a 16-bit ADC (max value 65535) reading a 0–3.3V analog input. The probe is on a 3× divider (× 3.0) and outputs 9 mV per unit pressure (÷ 0.009). The result is the actual pressure value.
- Each sample is appended to the same CSV until `denton18pumpfinished` is called.

### POST `/denton18pumpfinished`

```python
@api_bp.route('/denton18pumpfinished', methods=['POST'])
def denton18_pump_finished():
    """Handle Denton 18 pump data completion"""
    state_file = os.path.join(current_app.config['LOG_DATA_DIR'], 'denton18', 'pumpdata', 'current_run.txt')
    if os.path.exists(state_file):
        os.remove(state_file)
        return jsonify({'status': 'file closed'}), 200
    else:
        return jsonify({'status': 'no file to close'}), 400
```

Just deletes `current_run.txt`. The next pressure sample will create a new CSV.

## Particle sensors

Particles in cleanroom air are tracked by Sensirion SPS30 sensors wired to Raspberry Pi Picos sitting in various rooms. Each Pico:

- Reads the SPS30 every ~minute.
- Builds a JSON payload with raw mass concentrations + converted number concentrations (per ft³).
- POSTs it to the server.

### Helper: log to per-sensor CSV

```python
def log_historical_particle_data(room_name, sensor_number, timestamp, raw_measurements, converted_values):
    """Log particle sensor data to CSV file for historical tracking"""
    try:
        # Create sensor-specific filename
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
        filename = f"{sensor_id}_historical.csv"
        filepath = os.path.join(current_app.config['LOG_DATA_DIR'], 'particle_sensors', filename)

        # Ensure directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        # Check if file exists to determine if we need to write headers
        file_exists = os.path.exists(filepath)

        with open(filepath, 'a', newline='') as f:
            writer = csv.writer(f)

            # Write headers if file is new
            if not file_exists:
                headers = [
                    'timestamp', 'timestamp_iso', 'room_name', 'sensor_number',
                    'mass_pm1', 'mass_pm2_5', 'mass_pm4', 'mass_pm10',
                    'num_pm0_5_ft3', 'num_pm1_ft3', 'num_pm2_5_ft3', 'num_pm4_ft3', 'num_pm10_ft3',
                    'typical_particle_size_um',
                    'num_pm0_5_ft3_dup', 'num_pm1_ft3_dup', 'num_pm2_5_ft3_dup', 'num_pm4_ft3_dup', 'num_pm10_ft3_dup',
                    'bin_0_3_to_0_5', 'bin_0_5_to_1_0', 'bin_1_0_to_2_5', 'bin_2_5_to_4_0', 'bin_4_0_to_10',
                    'mass_pm1_ug_m3', 'mass_pm2_5_ug_m3', 'mass_pm4_ug_m3', 'mass_pm10_ug_m3'
                ]
                writer.writerow(headers)

            # Extract data with defaults
            number_concentrations = converted_values.get('number_concentrations_ft3', {})
            differential_bins = converted_values.get('differential_bins_ft3', {})
            mass_concentrations = converted_values.get('mass_concentrations_ug_m3', {})

            # Write data row
            row_data = [
                timestamp.timestamp(),  # Unix timestamp
                timestamp.isoformat(),  # ISO format timestamp
                room_name, sensor_number,
                raw_measurements.get('mass_pm1'),
                ...
```

(Truncated — the full function packs every metric into one row.)

The key design choice: **one CSV per sensor**, named `<room>_<sensor>_historical.csv`. The first POST creates the file with a header row; subsequent POSTs just append. This makes "show me the history of this sensor" a simple file read.

The header set includes some duplicate columns (`num_pm0_5_ft3` and `num_pm0_5_ft3_dup`) — a backwards-compatibility quirk: legacy consumers expected the raw cm³ counts in one set of columns and the ft³ counts in another, but since the unconverted raw counts looked unrealistic, both were replaced with the ft³ values.

### POST `/particle-data`

```python
@api_bp.route('/particle-data', methods=['POST'])
def receive_particle_data():
    """Receive particle sensor data from Pico sensors and store the most recent values"""
    try:
        # Get JSON data from request
        if not request.is_json:
            return jsonify({...}), 400

        data = request.get_json()

        # Validate required fields
        required_fields = ['room_name', 'sensor_number', 'timestamp']
        for field in required_fields:
            if field not in data:
                return jsonify({...}), 400

        # Extract room name and sensor number
        room_name = data['room_name']
        sensor_number = data['sensor_number']

        # Parse timestamp (could be Unix timestamp or ISO string)
        timestamp_value = data['timestamp']
        if isinstance(timestamp_value, (int, float)):
            sensor_timestamp = datetime.fromtimestamp(timestamp_value)
        else:
            try:
                sensor_timestamp = datetime.fromisoformat(timestamp_value.replace('Z', '+00:00'))
            except:
                sensor_timestamp = datetime.utcnow()
```

Pre-flight checks:

- Must be JSON.
- Must have `room_name`, `sensor_number`, `timestamp`.
- Timestamp can come in as a number (Unix seconds) or an ISO 8601 string; both are parsed.

```python
        # Extract measurement data with defaults
        raw_measurements = data.get('raw_measurements', {})
        converted_values = data.get('converted_values', {})
        number_concentrations = converted_values.get('number_concentrations_ft3', {})
        differential_bins = converted_values.get('differential_bins_ft3', {})
        mass_concentrations = converted_values.get('mass_concentrations_ug_m3', {})

        # CSV Historical Data Logging
        log_historical_particle_data(room_name, sensor_number, sensor_timestamp,
                                   raw_measurements, converted_values)
```

Pull the nested dictionaries with safe defaults, then log to CSV.

```python
        # Check if we already have data for this sensor
        existing_record = ParticleSensorData.query.filter_by(
            room_name=room_name,
            sensor_number=sensor_number
        ).first()

        if existing_record:
            # Update existing record
            existing_record.timestamp = sensor_timestamp
            existing_record.last_updated = datetime.utcnow()
            ...all field assignments...
        else:
            # Create new record
            new_record = ParticleSensorData(...)
            db.session.add(new_record)

        db.session.commit()
```

The database table `particle_sensor_data` only stores the **latest** reading per (room, sensor) pair — there's a unique constraint enforcing one row per sensor location. Old readings are only preserved in the per-sensor historical CSV.

This is an "upsert": if a row for this (room, sensor) exists, update it in place; otherwise insert. The historical CSV is the source of truth for time series; the DB is just for "show me what's happening right now."

### GET `/particle-data`

```python
@api_bp.route('/particle-data', methods=['GET'])
def get_particle_data():
    """Get current particle sensor data for all sensors or a specific sensor.
    If both room_name and sensor_number are provided, returns historical CSV data."""
    try:
        # Optional query parameters
        room_name = request.args.get('room_name')
        sensor_number = request.args.get('sensor_number')

        # If both room_name and sensor_number are provided, return historical CSV data
        if room_name and sensor_number:
            return get_historical_csv_data(room_name, sensor_number)

        # Build query for current data
        query = ParticleSensorData.query

        if room_name:
            query = query.filter_by(room_name=room_name)

        if sensor_number:
            query = query.filter_by(sensor_number=sensor_number)

        # Get results
        sensors = query.all()

        # Convert to JSON-serializable format
        sensor_data = [sensor.to_dict() for sensor in sensors]

        return jsonify({
            'status': 'success',
            'count': len(sensor_data),
            'sensors': sensor_data
        }), 200
        ...
```

Three behaviors depending on the query string:

- **No params** → return every sensor's current reading.
- **Only `room_name`** → all sensors in that room.
- **Only `sensor_number`** → all sensors with that number (across rooms).
- **Both** → switch to historical CSV mode and return the full time series.

This "one URL, multiple shapes" is unusual; a separate `/particle-data/history` endpoint would be cleaner. As it stands, the consumer must remember which query keys trigger which response shape.

```python
def get_historical_csv_data(room_name, sensor_number):
    """Return historical CSV data for a specific sensor"""
    try:
        # Construct the CSV filename
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
        filename = f"{sensor_id}_historical.csv"
        filepath = os.path.join(current_app.config['LOG_DATA_DIR'], 'particle_sensors', filename)

        # Check if file exists
        if not os.path.exists(filepath):
            return jsonify({...}), 404

        # Read and parse CSV file
        historical_data = []
        with open(filepath, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Convert numeric values from strings
                processed_row = {}
                for key, value in row.items():
                    if value == '' or value is None:
                        processed_row[key] = None
                    elif key in ['timestamp', 'timestamp_iso', 'room_name', 'sensor_number']:
                        processed_row[key] = value
                    else:
                        try:
                            processed_row[key] = float(value)
                        except (ValueError, TypeError):
                            processed_row[key] = value
                historical_data.append(processed_row)

        return jsonify({
            'status': 'success',
            'room_name': room_name,
            'sensor_number': sensor_number,
            'data_source': 'historical_csv',
            'record_count': len(historical_data),
            'historical_data': historical_data
        }), 200
```

Reads the per-sensor CSV, parses every numeric column to `float`, returns a JSON array. Empty cells become `None`.

## Combined particle + environment endpoint: `/sensor-data`

Newer Picos report both SPS30 particle data and DHT22 temperature/humidity data in a single payload. The `/sensor-data` route accepts that combined shape.

### POST `/sensor-data`

```python
@api_bp.route('/sensor-data', methods=['POST'])
def sensor_data_post():
    """Accept combined particle + environmental sensor data and append to CSV."""
    try:
        data = request.get_json(force=True)
        if not data:
            return jsonify({'error': 'No JSON body'}), 400

        room_name = data.get('room_name')
        sensor_number = data.get('sensor_number')
        if not room_name or not sensor_number:
            return jsonify({'error': 'room_name and sensor_number required'}), 400

        # Timestamp — accept from device or default to server time
        timestamp = data.get('timestamp')
        if timestamp:
            ts_str = datetime.fromtimestamp(float(timestamp)).strftime('%Y-%m-%d %H:%M:%S')
        else:
            ts_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Environmental values (may be absent if DHT22 read failed)
        temperature_c = data.get('temperature_c', '')
        humidity_pct = data.get('humidity_pct', '')

        # Particle values (nested dicts from the Pico)
        raw = data.get('raw_measurements', {})
        converted = data.get('converted_values', {})
        conc_ft3 = converted.get('number_concentrations_ft3', {})
        ...
```

The function does **three** writes:

1. **`log_historical_particle_data`** if `raw` is non-empty — writes to the same per-sensor `particle_sensors/` CSV that the legacy endpoint uses, so the GUI's "historical" lookup keeps working.
2. **A dedicated environmental CSV** under `env_sensors/<sensor_id>_historical.csv` if both temperature and humidity were present.
3. **An upsert into `ParticleSensorData`** if `raw` is non-empty, just like `/particle-data` does, including the new `temperature_c` and `humidity_pct` columns added to that table.

The decoupling here is intentional: a Pico that fails to read the DHT22 still gets its particle readings recorded; a Pico without an SPS30 (or with one that's broken) still gets its env data recorded.

### GET `/sensor-data`

```python
@api_bp.route('/sensor-data', methods=['GET'])
def sensor_data_get():
    """Return historical combined sensor data as JSON.
    Query params: room_name, sensor_number (both required)."""
    room_name = request.args.get('room_name')
    sensor_number = request.args.get('sensor_number')

    if not room_name or not sensor_number:
        return jsonify({'error': 'room_name and sensor_number query params required'}), 400

    csv_path = _sensor_csv_path(room_name, sensor_number)

    if not os.path.exists(csv_path):
        return jsonify({'error': 'No data found for this sensor'}), 404

    try:
        rows = []
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(row)

        return jsonify({...rows...})
```

Reads `sensors/<room>_<sensor>_combined.csv` (note: a different directory from `particle_sensors/`). Returns the full history as a JSON array, with values still as strings.

> **Heads-up — a latent bug.** The GET reads from `LogData/sensors/` (via the `_sensor_csv_path` helper), but the matching `POST /sensor-data` handler never writes to that folder — it writes particle data to `particle_sensors/` and environmental data to `env_sensors/`. Nothing in the codebase populates `sensors/`. As a result, `GET /sensor-data` will return a 404 ("No data found for this sensor") for every sensor, even ones that have posted data. The historical data does exist — it's just under `particle_sensors/` and `env_sensors/`, reachable via `GET /particle-data?...` and `GET /env-data?...`. If you want `GET /sensor-data` to work, either point `_sensor_csv_path` at `particle_sensors/`, or have the POST also write a combined CSV to `sensors/`. This is worth flagging in the presentation as a known rough edge.

## Standalone environmental endpoint: `/env-data`

For Picos that only have a DHT22 (no SPS30), there's a dedicated environmental endpoint.

### POST `/env-data`

```python
@api_bp.route('/env-data', methods=['POST'])
def receive_env_data():
    """Receive temperature/humidity data from DHT22 sensors on Pico W."""
    try:
        if not request.is_json:
            return jsonify({...}), 400

        data = request.get_json()

        for field in ('room_name', 'sensor_number', 'timestamp', 'temperature_c', 'humidity_pct'):
            if field not in data:
                return jsonify({...}), 400

        room_name     = data['room_name']
        sensor_number = data['sensor_number']
        temperature_c = float(data['temperature_c'])
        humidity_pct  = float(data['humidity_pct'])

        ts = data['timestamp']
        if isinstance(ts, (int, float)):
            sensor_timestamp = datetime.fromtimestamp(ts)
        else:
            try:
                sensor_timestamp = datetime.fromisoformat(str(ts).replace('Z', '+00:00'))
            except Exception:
                sensor_timestamp = datetime.utcnow()

        # Append to a per-sensor CSV for historical tracking
        sensor_id = f"{room_name}_{sensor_number}".replace(' ', '_').replace('/', '_')
        filepath  = os.path.join(current_app.config['LOG_DATA_DIR'], 'env_sensors',
                                 f"{sensor_id}_historical.csv")
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        file_exists = os.path.exists(filepath)
        with open(filepath, 'a', newline='') as f:
            import csv as _csv
            writer = _csv.writer(f)
            if not file_exists:
                writer.writerow(['timestamp', 'timestamp_iso', 'room_name',
                                 'sensor_number', 'temperature_c', 'humidity_pct'])
            writer.writerow([sensor_timestamp.timestamp(), sensor_timestamp.isoformat(),
                             room_name, sensor_number, temperature_c, humidity_pct])

        current_app.logger.info(
            f"env-data: {room_name}/{sensor_number} "
            f"temp={temperature_c:.1f}°C  humidity={humidity_pct:.1f}%"
        )

        return jsonify({...success payload...}), 200
```

Strict validation: all five required fields must be present. The temperature and humidity are coerced to floats (which will raise an exception if the values can't be parsed; the outer try/except catches that).

The historical CSV under `env_sensors/` is appended to, same one used by the combined `/sensor-data` endpoint when DHT22 values were present. Both paths converge on the same file — so a sensor that switches from sending env data via `/env-data` to sending combined data via `/sensor-data` ends up with one continuous CSV.

### GET `/env-data`

Mirror of the GET for `/particle-data` historical mode: reads `env_sensors/<sensor_id>_historical.csv`, converts numeric columns to float, returns as JSON.

## Two summary diagrams

### Where each kind of sensor data ends up

```
Particle POST  →  /particle-data
                ├─ LogData/particle_sensors/<id>_historical.csv  (append)
                └─ particle_sensor_data table                    (upsert latest)

Combined POST  →  /sensor-data
                ├─ LogData/particle_sensors/<id>_historical.csv  (append, if raw present)
                ├─ LogData/env_sensors/<id>_historical.csv       (append, if env present)
                └─ particle_sensor_data table                    (upsert latest)

Env POST       →  /env-data
                └─ LogData/env_sensors/<id>_historical.csv       (append)
```

### Where Parylene and Denton18 data ends up

```
Parylene batches POST  →  /sdsanalog
                          └─ LogData/Paralyne/temp/<session>/batch_NNNN.csv

Parylene done POST     →  /sdsanalogfinished  (or auto-trigger when last batch arrives)
                          └─ LogData/Paralyne/analog/<timestamp>_SDSLOG_combined_<session>.csv
                                                                                    (final combined file)

Denton 18 POST         →  /denton18pump
                          └─ LogData/denton18/pumpdata/<timestamp>_DENTON18PUMPLOG.csv
                                                       (one file per run; sentinel current_run.txt)

Denton 18 done POST    →  /denton18pumpfinished
                          └─ removes current_run.txt; next sample starts a new file
```

## A note on authentication

None of these endpoints are behind `@login_required`. The trust model is:

- The Picos and PCs sit on a private SSID (`ULink`, hard-coded into the firmware).
- The endpoints aren't publicly advertised (they're called only from internal scripts and firmware).
- The data isn't *sensitive* in the cryptographic sense — it's pressure readings and particle counts.

This is "perimeter security" rather than authenticated requests. It's fine for an internal lab tool; it would be unsuitable for anything internet-facing or holding personal data.

Next: `09-Chemical-Inventory.md`.


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/11-Particle-Demo.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 11 — Particle Demo

The `particle_demo_will` blueprint is the smallest blueprint in the codebase: about 30 lines. It exists to serve a standalone HTML demo page (and its assets) for the particle counter, used for outreach and visitor demos. It is decoupled from the rest of the app — no login, no database, no template engine. Just static files.

## The full file

```python
import os
from flask import Blueprint, send_file, abort

particle_demo_will_bp = Blueprint(
    "particle_demo_will",
    __name__,
    url_prefix="/particle-demo"
)

# Use absolute path to the templates directory
DEMO_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "templates", "particle-demoWill")

@particle_demo_will_bp.route("/", methods=["GET"])
def index():
    # If the user hits the bare root, serve the default demo
    default_file = os.path.join(DEMO_DIR, "UtahNanofabParticleCounterDemo.html")
    if os.path.exists(default_file):
        return send_file(default_file)
    abort(404)

@particle_demo_will_bp.route("/<path:filename>", methods=["GET"])
def assets(filename: str):
    # Protect against directory traversal
    if ".." in filename or filename.startswith("/"):
        abort(400)

    file_path = os.path.join(DEMO_DIR, filename)
    if os.path.exists(file_path):
        return send_file(file_path)

    abort(404)
```

## Walking through it

### The blueprint setup

```python
particle_demo_will_bp = Blueprint(
    "particle_demo_will",
    __name__,
    url_prefix="/particle-demo"
)
```

Blueprint with `url_prefix="/particle-demo"`. So `@route("/")` becomes `GET /particle-demo/` and `@route("/<path:filename>")` becomes `GET /particle-demo/<anything>`.

### Locating the demo folder

```python
DEMO_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "templates",
    "particle-demoWill"
)
```

Reading this from the inside out:

- `os.path.abspath(__file__)` — the absolute path to this file (`particle_demo_will.py`).
- `os.path.dirname(...)` once — the directory containing this file (`app/blueprints/`).
- `os.path.dirname(...)` again — one level up (`app/`).
- Then append `"templates"` and `"particle-demoWill"`.

Net result: `<repo>/app/templates/particle-demoWill/`. The demo HTML and its assets live there.

### The root route

```python
@particle_demo_will_bp.route("/", methods=["GET"])
def index():
    # If the user hits the bare root, serve the default demo
    default_file = os.path.join(DEMO_DIR, "UtahNanofabParticleCounterDemo.html")
    if os.path.exists(default_file):
        return send_file(default_file)
    abort(404)
```

Hitting `/particle-demo/` returns the file `UtahNanofabParticleCounterDemo.html`. If that file is missing for some reason, `abort(404)` returns a generic Flask 404 page.

### The asset route

```python
@particle_demo_will_bp.route("/<path:filename>", methods=["GET"])
def assets(filename: str):
    # Protect against directory traversal
    if ".." in filename or filename.startswith("/"):
        abort(400)

    file_path = os.path.join(DEMO_DIR, filename)
    if os.path.exists(file_path):
        return send_file(file_path)

    abort(404)
```

Hitting any other path under `/particle-demo/` — like `/particle-demo/styles.css` or `/particle-demo/images/banner.png` — falls through to this route.

The traversal guard:

- **`if ".." in filename`** — blocks `../../something` attempts to escape the demo folder.
- **`if filename.startswith("/")`** — blocks absolute paths.

These two checks together mean the user can only reach files under `DEMO_DIR`. (Compare with the more thorough `realpath` + prefix check in `machines.py`'s `/download` route, which handles symlinks too. Here the simpler check is fine because the demo folder has no symlinks.)

If the file exists, it's served via `send_file`. Otherwise, 404.

## Why this exists

The demo page is a single HTML file with JavaScript that fetches from the live `/particle-data` endpoint and renders a real-time visualization. It's designed to be self-contained — show on a kiosk at an event, demo for visitors, etc. It doesn't need login because:

- It only fetches public-readable particle data.
- It needs to work without anyone signed in (visitors won't have accounts).

Routing it through a dedicated blueprint also keeps the demo's URL stable (`/particle-demo/`) and visually separates it from the rest of the app.

## Summary

This is the kind of route you write when "I have one specific HTML page I need to serve, plus a folder of supporting files, and nothing else." Three things to remember:

- Files are pulled from `app/templates/particle-demoWill/`.
- Traversal protection is simple string-based, sufficient for this use case.
- No login required.

Next: `12-Consumers-NanofabToolkit.md`.


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/12-Consumers-NanofabToolkit.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 12 — Consumers (NanofabToolkit and Pico Firmware)

The server doesn't do much on its own — its job is to receive data and serve it back. The clients that drive it live in a sibling repository called **NanofabToolkit**. This document maps every server endpoint to its real-world consumer, so you can see what calls what.

There are three categories of consumer:

1. **Pico firmware** — MicroPython programs that run on Raspberry Pi Pico W boards mounted in or near machines. These POST sensor readings.
2. **Desktop apps** — Python (mostly PyQt5) programs that lab staff run on Windows machines. These GET data and visualize it.
3. **The Precious Metal Reader** — a separate tool that calls a different system (n8n on `cores.utah.edu`), not our server. Included here for completeness.

## Pico firmware (the data producers)

### `PicoHelperTools/Particle_sensor.py`

This is the firmware running on Picos that have a Sensirion SPS30 particle sensor but no environmental sensor. Reads from the SPS30 every minute or so, packages data into a JSON payload, POSTs to:

```python
API_URL = "https://nfhistory.nanofab.utah.edu/particle-data"
```

That's the legacy single-purpose `POST /particle-data` endpoint. The payload shape:

```python
data = {
    "room_name": ROOM_NAME,
    "sensor_number": SENSOR_NUMBER,
    "timestamp": local_timestamp,
    "raw_measurements": {
        "mass_pm1": ..., "mass_pm2_5": ..., "mass_pm4": ..., "mass_pm10": ...,
        "num_pm0_5": ..., "num_pm1": ..., "num_pm2_5": ..., "num_pm4": ..., "num_pm10": ...,
        "typical_particle_size_um": ...
    },
    "converted_values": {
        "number_concentrations_ft3": { "pm0_5": ..., "pm1": ..., "pm2_5": ..., "pm4": ..., "pm10": ... },
        "differential_bins_ft3":     { "bin_0_3_to_0_5": ..., ..., "bin_4_0_to_10": ... },
        "mass_concentrations_ug_m3": { "pm1": ..., "pm2_5": ..., "pm4": ..., "pm10": ... }
    }
}
```

This is exactly the shape that `app/blueprints/api.py::receive_particle_data` parses. Each `room_name` and `sensor_number` is hard-coded into the firmware before it's flashed onto the Pico.

The Pico also handles WiFi reconnection, NTP time sync, scheduled sending at the top of every 15-minute interval, and a watchdog reset for stability. The server doesn't care about any of that; from its perspective, the Pico just shows up every 15 minutes with a JSON payload.

### `PicoHelperTools/DHT22_sensor.py`

A separate firmware for Picos that only have a DHT22 (temperature + humidity) — no particle sensor. POSTs to:

```python
API_URL = "https://nfhistory.nanofab.utah.edu/env-data"
```

That's `POST /env-data`. The payload:

```python
payload = {
    "room_name":     ROOM_NAME,
    "sensor_number": SENSOR_NUMBER,
    "timestamp":     utc_timestamp,
    "temperature_c": temperature_c,
    "humidity_pct":  humidity_pct,
}
```

Five fields, all required. The server stores this in `LogData/env_sensors/<sensor_id>_historical.csv`.

### `PicoHelperTools/sensor_combined.py`

The newest firmware: SPS30 + DHT22 together, single payload, single POST to:

```python
API_URL = "https://nfhistory.nanofab.utah.edu/sensor-data"
```

That's `POST /sensor-data`. The payload combines the two earlier shapes — includes `raw_measurements`, `converted_values`, plus top-level `temperature_c` and `humidity_pct`. The server intelligently routes each section to the right CSV (particle data goes to `particle_sensors/`, env data goes to `env_sensors/`) and upserts the combined record into the database.

This unifies the two earlier endpoints. If you're standing up a new sensor today, this is the one you'd write firmware against.

### Parylene Pi (`fetch_ssh.py` and various local scripts in UNanofabTools)

The Parylene tool's Raspberry Pi runs a script (not in the NanofabToolkit repo — it lives on the Pi itself) that samples analog pressure/vapor/temperature lines several times per second, batches them into CSVs every few seconds, and POSTs them as `text/csv` to:

```
https://nfhistory.nanofab.utah.edu/sdsanalog
```

That's `POST /sdsanalog`, the batched CSV endpoint. Required headers:

- `X-Session-ID: <unique id for this run>`
- `X-Batch-Number: 1`, `2`, `3`, ...
- `X-Total-Batches: <expected total>`
- Optional `X-Is-Final-Batch: true`

When the run is over, the Pi POSTs to `/sdsanalogfinished` to trigger the final combine. The server then produces one CSV in `LogData/Paralyne/analog/` per Parylene run.

### Denton 18 Pi

A second Pi setup, reading an analog vacuum-pressure transducer on the Denton 18 evaporator. POSTs each sample to:

```
https://nfhistory.nanofab.utah.edu/denton18pump
```

with body `{"pressure": <raw ADC value>}`. The server converts the ADC value to engineering units and appends to a per-run CSV. When the run is over, the Pi POSTs `/denton18pumpfinished` to close the file.

## Desktop apps (the data consumers)

### `ParticleSensor/src/gui.py` — Particle Data Viewer

A PyQt5 desktop app that visualizes current and historical particle data. Renders a cleanroom layout map on the left and a sortable table on the right. Calls:

```python
self.api_url = "https://nfhistory.nanofab.utah.edu/particle-data"
...
response = requests.get(self.api_url, verify=False, timeout=5)
```

→ `GET /particle-data` (no params) — fetch the current reading for every sensor.

When the user drills into one sensor:

```python
url = f"https://nfhistory.nanofab.utah.edu/particle-data?room_name={room}&sensor_number={sn}"
response = requests.get(url, verify=False, timeout=10)
```

→ `GET /particle-data?room_name=...&sensor_number=...` — returns the **historical** CSV data for that sensor. (Recall the dual behavior of that endpoint described in `08`.)

Optionally fetches environmental history too:

```python
env_url = "https://nfhistory.nanofab.utah.edu/env-data?room_name=...&sensor_number=..."
env_resp = requests.get(env_url, verify=False, timeout=10)
```

→ `GET /env-data?...` — temperature/humidity history.

The room names hardcoded in the GUI (`"Bay A\n2025N"`, `"Lab B\n2008N"`, etc.) match what the Picos send up. The app correlates the two so you can see which physical bay a reading came from.

Note `verify=False` — this disables HTTPS certificate verification. That's because the server uses an internal certificate that isn't in standard trust stores. It's not great practice on the open internet, but for an internal tool it's reasonable.

### `ParalyneReader/src/ParalyneReader.py`

A simpler app that lets staff download Parylene log files for offline analysis. Three functions:

```python
base_url = "https://nfhistory.nanofab.utah.edu/api/paralyne/analog"

def list_files():
    response = requests.get(f"{base_url}/list", verify=False)
    ...

def download_file(filename):
    response = requests.get(f"{base_url}/download/{filename}", verify=False)
    ...
```

→ `GET /api/paralyne/analog/list` — list every combined Parylene CSV with size and modified time.
→ `GET /api/paralyne/analog/download/<filename>` — download one file by name.

There's also a `return_selected` function calling `/return/<filename>` which doesn't exist on the server — likely a leftover from an earlier version. The two endpoints that do exist are `list` and `download`.

### `DentonDecoder/src/DentonGrapher.py`

A local-only app for decoding Denton 18 evaporator `.dat` log files. Doesn't talk to the server at all — it reads files the user has already downloaded. Listed here for completeness, so you know it exists in the toolkit even though it has no server connection.

### `ALDPeakCounter/main.py` and friends

Also entirely local. Helps a user count peaks in ALD log files. No server interaction.

## The outlier: PreciousMetalReader

`PreciousMetalReader/src/RetrieveMonthsMetals.py` does *not* call our server. It calls a separate workflow at `https://n8n.cores.utah.edu/webhook/...` which is a Utah CORES (Center for Research Equipment) endpoint, completely separate from this server. Mentioning it here so you don't go hunting for a route in `api.py` that doesn't exist.

```python
BaseURL = 'https://n8n.cores.utah.edu/webhook/line_item_batch_pull?service_ids='
...
response = requests.get(constructedURL, headers=header)
```

So even though it ships in the NanofabToolkit repo, it has nothing to do with the UNanofabTools server.

## Mapping table — endpoint to consumer

| Server endpoint | Direction | Consumer | What flows |
|-----------------|-----------|----------|-------------|
| `POST /particle-data` | inbound | `PicoHelperTools/Particle_sensor.py` (Pico firmware) | SPS30 readings every 15 minutes |
| `GET /particle-data` | outbound | `ParticleSensor/src/gui.py` (desktop) | Current snapshot of every sensor |
| `GET /particle-data?room_name=...&sensor_number=...` | outbound | `ParticleSensor/src/gui.py` (desktop) | Historical time series for one sensor |
| `POST /env-data` | inbound | `PicoHelperTools/DHT22_sensor.py` (Pico firmware) | Temperature/humidity readings |
| `GET /env-data?...` | outbound | `ParticleSensor/src/gui.py` (desktop) | Historical env time series |
| `POST /sensor-data` | inbound | `PicoHelperTools/sensor_combined.py` (Pico firmware) | Combined SPS30 + DHT22 readings |
| `GET /sensor-data?...` | outbound | (unused by NanofabToolkit so far) | Historical combined data |
| `POST /sdsanalog` | inbound | Parylene Pi local script | CSV batches of analog pressure data |
| `POST /sdsanalogfinished` | inbound | Parylene Pi local script | "Combine my batches now" trigger |
| `GET /api/paralyne/analog/list` | outbound | `ParalyneReader/src/ParalyneReader.py` (desktop) | Index of combined Parylene CSVs |
| `GET /api/paralyne/analog/download/<f>` | outbound | `ParalyneReader/src/ParalyneReader.py` (desktop) | Download one CSV |
| `POST /denton18pump` | inbound | Denton 18 Pi local script | Vacuum pressure samples |
| `POST /denton18pumpfinished` | inbound | Denton 18 Pi local script | "Close this run's file" trigger |
| The browser-facing UI routes (`/login`, `/tasks`, `/chem/*`, etc.) | inbound | Web browsers | Standard HTML pages |

## How an entire data round-trip looks

Let's trace one full path for clarity — a Pico reading particle data and a user viewing it in the desktop app.

```
1. Pico's SPS30 takes a measurement.
2. Pico builds a JSON payload (room_name, sensor_number, timestamp, measurements).
3. Pico POSTs to https://nfhistory.nanofab.utah.edu/particle-data.
4. nginx terminates TLS and proxies the request to Flask at 127.0.0.1:5000.
5. Flask routes the request to api.py::receive_particle_data.
6. The handler:
   - Validates required fields.
   - Calls log_historical_particle_data() to APPEND to LogData/particle_sensors/<id>_historical.csv.
   - Upserts the latest reading into the particle_sensor_data SQLite table.
   - Returns 200.

Hours later, a user opens the Particle Data Viewer app.

7. App calls GET /particle-data (no params).
8. Flask routes to api.py::get_particle_data.
9. The handler queries the particle_sensor_data table and returns every sensor's latest reading as JSON.
10. App renders the JSON into the table and color-codes the cleanroom map.
11. User double-clicks a room.
12. App calls GET /particle-data?room_name=X&sensor_number=Y.
13. Flask routes to api.py::get_particle_data → which switches to historical mode → reads the CSV → returns rows.
14. App plots them.
```

That's the full loop. The Pico fills the database and CSV; the desktop GUI reads from them. The server is the well-known meeting point.

## Why this matters

If you wanted to add a new sensor or build a new visualization, the design tells you exactly where to plug in:

- **New sensor type?** Define a new POST endpoint in `api.py` that writes to its own CSV and/or DB table.
- **New visualization?** Add a GET endpoint that reads from those, and write a desktop app (or browser page) that calls it.
- **New machine that produces log files?** Drop the files in `LogData/<machine>/<datatype>/` and use the existing `machines.py` log-browser machinery; no new endpoint needed.

The point is: the server is a tidy hub, and the toolkit is the spokes. The contract between them is just JSON over HTTPS. You can replace either side independently as long as you preserve that contract.

Next: `13-Request-Lifecycle-Walkthrough.md`.
