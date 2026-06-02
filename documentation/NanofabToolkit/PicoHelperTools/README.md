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

- **Consumer:** the [`ParticleSensor`](../ParticleSensor/README.md) desktop viewer reads the same `(room, sensor)` keys these Picos populate.
- **Server side:** see `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` §8.2–§8.4 for the matching endpoints.
- **Older versions:** `UNanofabTools/Particle_sensor.py` (and similar) are earlier copies retained for historical reference. The NanofabToolkit files are the ones to flash today.

See the layman guide at `presentation/NanofabToolkit/PicoHelperTools/README.md`.
