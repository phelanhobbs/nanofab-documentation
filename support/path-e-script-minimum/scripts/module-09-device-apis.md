# Minimum Acceptable Full Path E - Module 09: Device APIs

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
