# Minimum Acceptable Full Path E - Module 15: Pico And Particle

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Expanded Module 15: Pico And Particle

READ ALOUD:

This expanded section revisits Module 15, Pico And Particle. The focus is canonical NanofabToolkit firmware/viewer source and sensor identity. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 15

READ ALOUD:

We are now doing the orientation pass for Pico And Particle. The maintainer should connect this module to canonical NanofabToolkit firmware/viewer source and sensor identity. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention canonical NanofabToolkit firmware/viewer source and sensor identity. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 15

READ ALOUD:

We are now doing the evidence pass for Pico And Particle. The maintainer should connect this module to canonical NanofabToolkit firmware/viewer source and sensor identity. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention canonical NanofabToolkit firmware/viewer source and sensor identity. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: documentation/NanofabToolkit/PicoHelperTools/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# PicoHelperTools — Developer Documentation

Canonical reference for the MicroPython firmware running on the cleanroom's Raspberry Pi Pico W boards. The NanofabToolkit copies are the **current** versions; older copies in `UNanofabTools/Particle_sensor.py` etc. are kept for reference and should be considered superseded.

Bugs/tech debt: `known-issues/NanofabToolkit/PicoHelperTools.md`. Server-side endpoints documented in `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md`.

## 1. Files

| File | Sensor(s) | Endpoint | Notes |
|------|-----------|----------|-------|
| `Particle_sensor.py` | SPS30 (I²C, addr `0x69`) | `POST /particle-data` | Single-sensor production firmware |
| `DHT22_sensor.py` | DHT22/AM2302 (1-wire on `Pin(DATA_PIN)`) | `POST /env-data` | Temperature/humidity only |
| `sensor_combined.py` | SPS30 + DHT22 | `POST /sensor-data` | Newest pattern — both sensors, one POST per cycle |

All three are written to be **headless-friendly**: they don't require a USB serial host, recover from common failure modes, and use a watchdog so a wedged loop self-resets.

Target hardware: Raspberry Pi Pico W (RP2040 + CYW43 WiFi). MicroPython runtime.

## 2. Common patterns (read once, applies to all three)

### 2.1 `safe_print` / `log_error`
```python
def safe_print(*args, **kwargs):
    try:
        print(*args, **kwargs)
    except Exception:
        pass  # USB serial not connected — discard
```
`safe_print` swallows any exception from `print` so a missing USB host can't crash the program. `log_error(msg)` appends to `error_log.txt` (`error_log_dht.txt` for the DHT-only firmware), capping the file at ~4 KB by reopening in `"w"` mode once it exceeds that size — prevents flash exhaustion on a long-running headless deploy.

### 2.2 `sleep_with_wdt(total_s, step_s=1)` *(DHT and combined)*
Sleeps in `step_s` chunks, calling `_wdt.feed()` between chunks so the watchdog doesn't fire during a legitimate long wait (the next scheduled send, for instance). `Particle_sensor.py` uses a slightly different inline pattern with the same effect.

### 2.3 Scheduled sending
- `SCHEDULED_SENDING = True` (default): use `calculate_next_send_time()` to align with the wall clock at `SEND_INTERVAL_MINUTES` boundaries (default 15) — every Pico fires at `:00`, `:15`, `:30`, `:45`.
- `False`: free-running on `MEASUREMENT_PERIOD_S`.

### 2.4 Clock sync
- `TIME_SYNC_ENABLED = True`, `TIME_SYNC_INTERVAL_HOURS = 6`.
- NTP servers (in order): `time.google.com`, `pool.ntp.org`, `time.nist.gov`.
- Server expects Unix epoch. The RP2040 epoch is `2000-01-01`, so payloads add `MICROPYTHON_TO_UNIX_EPOCH = 946684800` before sending.
- `UTC_OFFSET_HOURS = -7` (MST). **This is not DST-aware** — flip to `-6` for daylight time.

### 2.5 WiFi / network
- `WIFI_SSID = "ULink"`, `WIFI_PASSWORD = "<redacted-wifi-password>"` — **hard-coded in cleartext in each file**. See known-issues; prefer the `from picopass import passWD` pattern used by `UNanofabTools/PicoConnect.py`.
- `connect_wifi()` builds a `network.WLAN(STA_IF)`, retries with status reporting, returns a boolean.
- Combined and DHT firmware additionally include `reset_wifi()` that disconnects, deactivates, reactivates, and reconnects; if reconnect fails, calls `machine.reset()`.

### 2.6 Per-board identity
`ROOM_NAME` and `SENSOR_NUMBER` (and `DEVICE_ID` in the combined firmware) are baked into each file before flashing. They travel in every payload as the server's key for `(room, sensor)`. Sample values committed: Particle `("HEADLESS", "009")`, DHT `("DHT", "010")`, Combined `("COMBINED", "011")` — change per board.

### 2.7 LED & error codes
Onboard LED (`Pin("LED", Pin.OUT)`) blinks status. The Particle and combined firmware include `led_error_code(error_type)` patterns for distinct fault classes (WiFi, sensor, send).

## 3. `Particle_sensor.py` — SPS30 → `/particle-data`

### 3.1 Driver

`class SPS30` with I²C command pointers from the datasheet:

| Pointer | Action |
|---------|--------|
| `PTR_START_MEAS = 0x0010` | Start measurement; write `[0x03, 0x00, CRC]` for big-endian IEEE-754 float output |
| `PTR_STOP_MEAS = 0x0104` | Stop measurement |
| `PTR_DATA_RDY = 0x0202` | Read 3 bytes (2 data + CRC); flag at byte[1] |
| `PTR_READ_VALUES = 0x0300` | Read 60 bytes — 10 floats × (2 + CRC + 2 + CRC) |

`_crc8_word(b0, b1)` implements the Sensirion CRC-8 (poly `0x31`, init `0xFF`). `read_measured_values_float()` returns 10 floats in this order: `mass_PM1, mass_PM2_5, mass_PM4, mass_PM10, num_PM0_5, num_PM1, num_PM2_5, num_PM4, num_PM10, typical_particle_size_um`.

### 3.2 Diagnostics
`scan_i2c_devices(i2c)`, `test_i2c_connection(i2c, addr)`, `test_dns_resolution()`, `test_network_connectivity()`, `configure_dns()` — boot-time self-tests that surface the most common failure modes via `safe_print` and LED codes.

### 3.3 Payload (`send_to_api`)
Computes converted `#/ft³` (`CM3_TO_FT3 = 28316.8`) and the differential-bin breakdown, then builds:
```json
{
  "room_name": "...",
  "sensor_number": "...",
  "timestamp": <Unix epoch float>,
  "raw_measurements": { "mass_pm1": ..., "mass_pm2_5": ..., ... ,
                        "num_pm0_5": ..., ..., "typical_particle_size_um": ... },
  "converted_values": {
    "number_concentrations_ft3": { "pm0_5": ..., "pm1": ..., ..., "pm10": ... },
    "differential_bins_ft3":     { "bin_0_3_to_0_5": ..., ..., "bin_4_0_to_10": ... },
    "mass_concentrations_ug_m3": { "pm1": ..., ..., "pm10": ... }
  }
}
```
This is exactly what the server's `api.receive_particle_data` expects. The function has fallback URLs (HTTP/IP/local) commented out for testing.

### 3.4 `main()`
Boot self-tests → `connect_wifi` → NTP sync → loop forever: at the next scheduled time, `read_measured_values_float()` → `send_to_api(vals)` → handle errors with LED codes; fatal failures call `machine.reset()`.

## 4. `DHT22_sensor.py` — DHT22 → `/env-data`

### 4.1 Wiring
DHT22 pin 2 (data) → `Pin(DATA_PIN)` with a 4.7 kΩ pull-up to 3V3. `DATA_PIN = 2` (GP2) by default.

### 4.2 Read
```python
def read_dht22(sensor):
    sensor.measure()
    return sensor.temperature(), sensor.humidity()
```
DHT22 needs ≥ 2 s between reads; `MEASUREMENT_PERIOD_S = 30` is safe.

### 4.3 Payload (`send_to_api`)
```json
{
  "room_name": "...",
  "sensor_number": "...",
  "timestamp": <Unix epoch float>,
  "temperature_c": 21.4,
  "humidity_pct": 38.2
}
```
All five fields are required by the server. Response 200 expected.

### 4.4 `main()`
Watchdog: `WDT(timeout=8300)`. Boot → `connect_wifi` (fatal → `machine.reset()`) → NTP sync (best effort) → loop: read every `MEASUREMENT_PERIOD_S`, send at the next scheduled boundary (`SCHEDULED_SENDING = True`), `sleep_with_wdt(...)` to wait. `reset_wifi()` is invoked on persistent failures.

## 5. `sensor_combined.py` — SPS30 + DHT22 → `/sensor-data`

The newest firmware; combines both sensors on one Pico, posts a single message per cycle. SPS30 driver and DHT helper are the same as the standalone files, with shared timing.

Defaults: `MAX_CONSECUTIVE_FAILURES = 5`, `WIFI_RESET_INTERVAL_MS = 24*3600*1000` (full WiFi cycle every 24 h), `HTTP_TIMEOUT_S = 5`, `HTTP_SEND_RETRIES = 2`, optional watchdog (`ENABLE_WATCHDOG = False` by default — flip on for production).

### 5.1 Payload
A combined `/sensor-data` payload (server: `api.sensor_data_post`):
```json
{
  "room_name": "...", "sensor_number": "...",
  "timestamp": <Unix epoch float>,
  "temperature_c": ..., "humidity_pct": ...,
  "raw_measurements": { ... },     // identical SPS30 shape
  "converted_values": { ... }      // identical SPS30 shape
}
```
The server writes particle history to `LogData/particle_sensors/<id>_historical.csv`, env history to `LogData/env_sensors/<id>_historical.csv`, and upserts the latest row in `particle_sensor_data`.

> Server-side gotcha: `GET /sensor-data` reads `LogData/sensors/<id>_combined.csv`, which the POST does **not** write. Historical lookups use `/particle-data?...` / `/env-data?...` instead. Tracked in the flaskserver issues file (#1).

## 6. Conventions & maintenance

- **Add a new sensor by copying the closest existing file** (`sensor_combined.py` is the modern template), changing the driver and the payload, updating the per-board identity, and adding a matching server endpoint if needed.
- **Don't add WiFi credentials to the firmware in clear text** — adopt `from picopass import passWD` so `picopass.py` can be `.gitignore`d. The lab WiFi password rotates separately from device rollouts.
- **Watchdog discipline**: every long wait should go through `sleep_with_wdt` (or its inline equivalent). Don't add blocking calls that bypass it.
- **Timestamps**: always add `MICROPYTHON_TO_UNIX_EPOCH` before sending. The server expects Unix epoch.
- **DST**: flip `UTC_OFFSET_HOURS` to `-6` in daylight time. A proper fix is server-side (store UTC, present in display layer).
- **Per-board identity** is the only field that should change between deployments — keep the rest in lockstep.

## 7. Relationship to other tools

- **Consumer:** the `ParticleSensor` (reference path: ../ParticleSensor/README.md) desktop viewer reads the same `(room, sensor)` keys these Picos populate.
- **Server side:** see `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` §8.2–§8.4 for the matching endpoints.
- **Older versions:** `UNanofabTools/Particle_sensor.py` (and similar) are earlier copies retained for historical reference. The NanofabToolkit files are the ones to flash today.

See the layman guide at `presentation/NanofabToolkit/PicoHelperTools/README.md`.


# Read-Aloud Documentation Corpus: documentation/NanofabToolkit/ParticleSensor/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# ParticleSensor — Developer Documentation

Canonical reference for the PyQt5 desktop particle-data viewer in `NanofabToolkit/ParticleSensor/`. This is the **current** copy; an older copy in `UNanofabTools/particle_data_viewer.py` is retained for historical reference and should be considered superseded.

Bugs/tech debt: `known-issues/NanofabToolkit/ParticleSensor.md`. Server endpoints: `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` §5.6 and `08-integrations-and-data-contracts.md` §8.2–§8.4.

## 1. Files

| File | Role |
|------|------|
| `main.py` | Bootstraps the Qt application, instantiates `ParticleDataViewer`. |
| `src/gui.py` | Main window, cleanroom-map grid, data table, `RoomFrame` with env-data sub-boxes, `HistoricalDataWindow` drill-down. |
| `src/ParticleSensor.py` | Reusable API + processing classes — `ParticleDataAPI`, `ParticleDataProcessor`. |
| `src/assets/icon.ico` | Windowed executable icon. |

Dependencies: `PyQt5`, `requests`, `pytz`, `matplotlib` (Qt5Agg backend, including `NavigationToolbar2QT`). Frozen with PyInstaller.

## 2. Server contract

Reads from the Flask `api` blueprint:

- `GET /particle-data` → `{ status, count, sensors: [ParticleSensorData.to_dict()...] }` — the current snapshot used to populate the map + table.
- `GET /particle-data?room_name=X&sensor_number=Y` → historical CSV data for one sensor (the drill-down chart).
- `GET /env-data?room_name=X&sensor_number=Y` → historical temp/humidity for the corresponding env sensor.

All calls use `verify=False` (internal CA) with `warnings.filterwarnings('ignore', message='Unverified HTTPS request')` to silence noise.

## 3. `src/ParticleSensor.py` — reusable API/data helpers

### 3.1 `convert_to_mountain(dt)`
Adds a fixed **+7 h offset** to incoming server datetimes before localizing to `MOUNTAIN_TZ = pytz.timezone('US/Mountain')`. The comment notes this corrects a discrepancy observed in the API data. **This is a workaround** — the server stores naive timestamps without timezone info; the proper fix is server-side. See known-issues.

### 3.2 `class ParticleDataAPI`
```python
class ParticleDataAPI:
    def __init__(self, api_url="https://nfhistory.nanofab.utah.edu/particle-data"):
        self.api_url = api_url

    def fetch_current_data(self, timeout=5):
        response = requests.get(self.api_url, verify=False, timeout=timeout)
        response.raise_for_status()
        return response.json()

    def fetch_historical_data(self, room_name, sensor_number, timeout=10):
        url = f"{self.api_url}?room_name={room_name}&sensor_number={sensor_number}"
        response = requests.get(url, verify=False, timeout=timeout)
        response.raise_for_status()
        return response.json()
```
- Each method raises `Exception(f"Error fetching ... data: {str(e)}")` on transport failure and `Exception("Invalid JSON response from server")` on a parse error.
- Default API URL: production (`https://nfhistory.nanofab.utah.edu/particle-data`). Override in the constructor for testing.
- The pattern (small class, just two methods) makes the API reusable outside the GUI — e.g. from a script or future automation.

### 3.3 `class ParticleDataProcessor`
Static formatters; `format_timestamp(ts)` accepts an ISO string (handles `Z` → `+00:00`) or a Unix float, runs it through `convert_to_mountain`, and returns `'%Y-%m-%d %H:%M:%S %Z'`. Other static helpers normalize fields and compute room status (covered by `gui.py`).

## 4. `src/gui.py` — the main window

### 4.1 `convert_to_mountain` (mirrors the API helper)
Same +7 h workaround as §3.1. **Two copies exist** — keep them in sync (or factor to one place). Tracked in known-issues.

### 4.2 `class RoomFrame(QFrame)`
A custom widget that represents one cleanroom room/bay on the map.

- Outer `QFrame` whose background color reflects particle status: `"yellow"` (no data), `"red"` (alert), `"green"` (OK). Colors live in `self.colors`.
- Inside, a **top env strip** holding two small inner squares — `temp_frame` and a humidity frame — each with two `QLabel`s (name and value). Inner squares use one of:
  - `_ENV_YELLOW = "background-color: #FFFF99; ..."` (no env data yet)
  - `_ENV_HAS_DATA = "background-color: #A8D8A8; ..."` (env sensor is reporting)
- This sub-box design is **new in this canonical version** (the older UNanofabTools copy only colored the whole room).

### 4.3 `class ParticleDataViewer(QMainWindow)`
- Builds the room map as a grid of `RoomFrame`s (`room_name` → frame in `self.room_frames`).
- Builds the live `QTableWidget` for the latest reading per sensor; rows are filterable/sortable.
- A toolbar with **Refresh**, a date picker for historical drill-down, a **Save / Export** action that hands off to `QFileDialog` and writes CSV via `csv` stdlib.
- Refresh path: `ParticleDataAPI.fetch_current_data()` → iterate `response["sensors"]` → look up by normalized `room_name` → color the matching `RoomFrame` + update its env sub-boxes + populate the table row.
- Double-click row / sensor → opens `HistoricalDataWindow` for that `(room_name, sensor_number)`.

### 4.4 `class HistoricalDataWindow(QMainWindow)`
- Calls `ParticleDataAPI.fetch_historical_data(room, sensor)`; renders a matplotlib `FigureCanvas` embedded in the window.
- Crucially, includes the standard `NavigationToolbar2QT` (Home / Pan / Zoom / Subplots / Save). No custom mouse-zoom code; this replaces the click-and-drag implementation in the older UNanofabTools viewer.
- Optional env-data overlay if env history is present (`/env-data?...`).

## 5. Differences vs. `UNanofabTools/particle_data_viewer.py`

These are the meaningful changes; preserve them when porting any future patches:

- **Env-data sub-boxes inside each `RoomFrame`.** New; the older copy had a single-color room.
- **Real `pytz` timezone handling.** Newer; the older copy uses a hand-rolled `timedelta(hours=7)`.
- **Standard matplotlib `NavigationToolbar2QT`** in the historical window. Replaces the custom click-drag zoom in the older copy.
- **Cleaner separation** between API/processing (`ParticleSensor.py`) and the GUI (`gui.py`). The older copy mixed concerns.
- **Better exception messages** from `ParticleDataAPI` (includes the underlying transport error).

## 6. Operational notes

- **Production URL is hard-coded** (`https://nfhistory.nanofab.utah.edu/particle-data`). Override at instance construction if needed.
- **TLS verification is disabled** (internal CA); standard internal-network tradeoff. Re-enable once the CA ships with the executable's trust store.
- **No automated tests**; mock-based contract tests against `ParticleDataAPI` would lock in the server contract.
- **PyInstaller build**: capture the spec and command in the repo README so a successor can rebuild the .exe.

## 7. Conventions & maintenance

- **`(room_name, sensor_number)` is the data key** end-to-end. The map labels in `init_ui` must match the values the Picos send (see `PicoHelperTools`); a renamed room or relabeled board silently breaks coloring.
- **Drop the +7 h hack at the source.** Make server timestamps timezone-aware; this app and its UNanofabTools sibling can then convert correctly with `pytz`/`zoneinfo` alone.
- **Externalize the API URL and the cleanroom-map layout** (env var / settings file) so renames/relocations are a config change.
- **Pick a canonical copy** and retire the divergent UNanofabTools version, or extract a shared package.

## 8. Relationship to other tools

- **Producers:** `PicoHelperTools` (reference path: ../PicoHelperTools/README.md) — the Pico firmware that populates the data this viewer displays.
- **Server side:** `documentation/UNanofabTools/flaskserver/` — the Flask app that holds the data and serves the endpoints.
- **Older sibling:** `UNanofabTools/particle_data_viewer.py` — historical reference only.

See the layman guide at `presentation/NanofabToolkit/ParticleSensor/README.md`.


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/picofirmware.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Pico Firmware — Known Issues & Technical Debt

Working list for the Raspberry Pi Pico firmware copies in this repository. Kept separate from the successor docs. Nothing here has been changed in the code.

> **Heads-up:** the canonical, currently-maintained versions of this firmware live in `NanofabToolkit/PicoHelperTools/`. Their issues list at `known-issues/NanofabToolkit/PicoHelperTools.md` (reference path: ../NanofabToolkit/PicoHelperTools.md) is the **primary** place to track cross-cutting items (cleartext WiFi credentials, DST handling, watchdog default, driver duplication). The items below apply to the older copies retained here for historical reference; fix in the NanofabToolkit copies first.

Severity: **High** = doesn't work / security exposure · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. WiFi credentials hard-coded in plaintext — High (security)
- **Where:** `Particle_sensor.py` (`WIFI_PASSWORD = "<redacted-wifi-password>"`), `PicoParylene.py`, `PicoDenton18.py` (`PASSWORD = 'GENPASSWORD'` placeholder).
- **Risk:** the lab WiFi password is committed to the repo in cleartext.
- **Fix:** standardize on the `picopass` module pattern (`from picopass import passWD`) used by `PicoConnect.py` / `VGC083C_Monitor.py`; keep `picopass.py` out of version control.

### 2. `PicoDenton18.py` references undefined constants — High
- **Where:** main loop uses `CUTTOFFPOINT` and `SWITCHPOINT`, which are never defined → `NameError` on first iteration.
- **Risk:** the script cannot run as committed.
- **Fix:** define the threshold constants (the ADC values that select cap vs. ion gauge and the cutoff for "run over").

### 3. `PicoDenton18.py` `gathering` flag is ineffective — Medium
- **Where:** `send_data()` sets `gathering = True` as a *local*; the main loop's global `gathering` never changes, so the end-of-run `sendEndRequest()` branch behaves incorrectly.
- **Fix:** use `global gathering` (or restructure state) so the finished-signal logic works.

### 4. `PicoDenton18.py` uses http, not https — Medium
- **Where:** `SERVER_URL = 'http://nfhistory.nanofab.utah.edu/denton18pump'`.
- **Risk:** unencrypted on the network; inconsistent with the other firmware.
- **Fix:** use `https://`.

### 5. `VGC083C_Monitor.py` calls undefined `read_pressure()` — High
- **Where:** main loop calls `read_pressure()`, which is not defined anywhere in the file → `NameError`.
- **Fix:** implement `read_pressure()` (send `#RDIG\r` over UART, read and parse the controller's reply).

### 6. `VGC083C_Monitor.py` posts to a non-existent endpoint — High
- **Where:** `POST /api/VGC/pressureupload`. No such route exists in the Flask `api` blueprint or the legacy server.
- **Risk:** even with #5 fixed, readings have nowhere to land.
- **Fix:** add a `/api/VGC/...` endpoint server-side (mirroring `denton18pump`), or repoint at an existing endpoint.

### 7. Per-device identity is easy to mis-set — Medium
- **Where:** `ROOM_NAME` / `SENSOR_NUMBER` (and the Parylene session naming) are hand-edited before flashing.
- **Risk:** a mislabeled board files its data under the wrong room/sensor with no validation.
- **Fix:** consider deriving identity from `machine.unique_id()` mapped to a registry, or add a startup self-report so mislabels are visible.

### 8. Driver/payload code duplicated across files — Medium
- **Where:** the SPS30 driver + CRC logic appears in both `Particle_sensor.py` and `ParticleSensor.py` (and overlaps the NanofabToolkit copies); conversion math is repeated.
- **Fix:** factor a shared `sps30.py` module the firmwares import.

### 9. No central config / lots of magic numbers — Low
- ADC pins, thresholds, intervals, and URLs are scattered as literals across files.
- **Fix:** a small per-board `config.py` would make deployment and review easier.

---

## Suggested priority order
1. #1 remove hard-coded WiFi passwords — High (security)
2. #5 + #6 make `VGC083C_Monitor.py` functional (or retire it) — High
3. #2 + #3 + #4 finish/repair `PicoDenton18.py` — High/Medium
4. #8 de-duplicate the SPS30 driver — Medium
5. #7, #9 identity + config hygiene — Medium/Low


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/particlepctools.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Particle PC Tools — Known Issues & Technical Debt

Working list for `particle_data_viewer.py` (older copy) and `generate_test_particle_data.py`. Separate from the successor docs. Nothing here has been changed in the code.

> **Heads-up:** the canonical, currently-maintained version of the particle viewer lives in `NanofabToolkit/ParticleSensor/`. Its issues list at `known-issues/NanofabToolkit/ParticleSensor.md` (reference path: ../NanofabToolkit/ParticleSensor.md) is the **primary** place to track cross-cutting viewer items (the +7h timezone hack, the hard-coded layout/URL). The items below apply to the older viewer copy retained here and to the test-data generator (which has no NanofabToolkit twin). Fix viewer issues in the NanofabToolkit copy first.

Severity: **High** = correctness/data risk · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Timezone fixed with a +7h hack — Medium
- **Where:** `particle_data_viewer.py` `convert_to_mountain()` adds 7 hours to API datetimes.
- **Risk:** wrong by an hour during Mountain Daylight Time (offset is -6, not -7); brittle around DST transitions; masks the real problem (the server stores naive timestamps).
- **Fix:** make timestamps timezone-aware end-to-end (store UTC; convert with `zoneinfo`/`pytz` for display).

### 2. Two diverging copies of the viewer — Medium
- **Where:** `particle_data_viewer.py` here vs. `NanofabToolkit/ParticleSensor/src/gui.py`.
- **Risk:** fixes land in one and not the other; unclear which is canonical.
- **Fix:** pick one as the source of truth; delete or clearly mark the other.

### 3. Room-map layout is hard-coded — Low/Medium
- **Where:** `init_ui` defines the bay/lab grid as literals; labels must match firmware `room_name`s exactly.
- **Risk:** a renamed room or a relabeled Pico silently breaks the map coloring.
- **Fix:** drive the layout/labels from a shared config or from the server's known rooms.

### 4. Test generator can target production — Medium
- **Where:** `generate_test_particle_data.py` `api_url` is a constructor arg defaulting to localhost, but nothing prevents pointing it at production.
- **Risk:** running it against the real server injects fake readings into real data.
- **Fix:** require an explicit `--allow-production` flag (or refuse non-localhost by default).

### 5. Certificate validation disabled — Low
- **Where:** generator disables urllib3 warnings; viewer likely uses `verify=False`.
- **Risk:** standard internal-cert tradeoff; encrypted but unverified.
- **Fix:** trust the internal CA where feasible.

### 6. Hard-coded production URL in the viewer — Low
- **Where:** `self.api_url = "https://nfhistory.nanofab.utah.edu/particle-data"`.
- **Fix:** make it configurable (env var / settings file / CLI).

### 7. No tests — Medium
- Neither tool has automated tests; the generator's payload shape and the viewer's parsing could drift from the server contract unnoticed.
- **Fix:** a contract test asserting generator output matches what the viewer/server expect.

---

## Suggested priority order
1. #4 prevent the generator from hitting production — Medium
2. #1 fix timezone handling properly — Medium
3. #2 reconcile the duplicate viewers — Medium
4. #3, #6, #7 config + tests — Low/Medium
