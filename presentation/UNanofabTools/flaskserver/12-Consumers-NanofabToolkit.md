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
