# 08 — Integrations & Data Contracts

The server integrates with device/desktop tools over HTTP, plus two backend services (Duo and the local PostgreSQL chem database). This document specifies the **data contracts** so a maintainer can change either side without breaking the other. The canonical, currently-maintained device/desktop clients live in the sibling `NanofabToolkit` repository — see [`documentation/NanofabToolkit/PicoHelperTools/`](../../NanofabToolkit/PicoHelperTools/README.md) (the producers) and [`documentation/NanofabToolkit/ParticleSensor/`](../../NanofabToolkit/ParticleSensor/README.md) (the desktop viewer). Older copies retained in *this* repository are documented at `documentation/UNanofabTools/picofirmware/` and `documentation/UNanofabTools/particlepctools/` for historical reference.

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

Continue to [09-deployment-and-operations.md](09-deployment-and-operations.md).
