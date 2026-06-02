# Pico Firmware — Developer Documentation

Reference for the MicroPython firmware that runs on the Raspberry Pi Pico W boards feeding the server. Assumes Python familiarity. Bugs/tech debt: `known-issues/UNanofabTools/picofirmware.md`.

> **Heads-up — these files have a newer home.** The canonical, currently-maintained versions of this firmware live in `NanofabToolkit/PicoHelperTools/` and are documented at [`documentation/NanofabToolkit/PicoHelperTools/`](../../NanofabToolkit/PicoHelperTools/README.md). The files in this folder are older copies retained for historical reference; new work should target the NanofabToolkit copies. Cross-cutting bugs (e.g. cleartext WiFi credentials) are tracked primarily at [`known-issues/NanofabToolkit/PicoHelperTools.md`](../../../known-issues/NanofabToolkit/PicoHelperTools.md).

## 1. Overview

| File | Role | Sensor / interface | Server endpoint | Status |
|------|------|--------------------|-----------------|--------|
| `Particle_sensor.py` | Production particle sender | SPS30 over I2C | `POST /particle-data` | Active |
| `PicoParylene.py` | Parylene analog streamer | 3× ADC (pressure/vapor/temp) | `POST /sdsanalog` (+`finished`) | Active |
| `PicoDenton18.py` | Denton 18 pump logger | 2× ADC (cap + ion gauge) | `POST /denton18pump` (+`finished`) | **Incomplete** (undefined constants) |
| `VGC083C_Monitor.py` | VGC gauge monitor | UART to VGC083C controller | `POST /api/VGC/pressureupload` | **Broken** (missing `read_pressure`; endpoint absent server-side) |
| `ParticleSensor.py` | Bench readout | SPS30 over I2C | none (prints to console) | Test utility |
| `PicoConnect.py` | WiFi connectivity test | none | none | Diagnostic |

Runtime: MicroPython on RP2040 (Pico W). All networked units join SSID `ULink`. Endpoints and payload contracts are the consumer side of the server's `api` blueprint — see `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md`.

> **Secret exposure:** WiFi credentials are hard-coded in plaintext in several files (`Particle_sensor.py`: `WIFI_PASSWORD = "<redacted-wifi-password>"`; `PicoParylene.py` similar). `PicoConnect.py` / `VGC083C_Monitor.py` import the password from a `picopass` module instead. Standardize on the latter. See known-issues.

## 2. `Particle_sensor.py` (the reference implementation)

The most complete firmware; treat it as the template for new sensors.

### 2.1 Configuration (top of file)
- `WIFI_SSID = "ULink"`, `WIFI_PASSWORD = "..."` (hard-coded).
- `API_URL = "https://nfhistory.nanofab.utah.edu/particle-data"`.
- `ROOM_NAME = "LTDirtyTest"`, `SENSOR_NUMBER = "006"` — baked per-device identity.
- Scheduled-send constants (15-minute cadence aligned to the wall clock), NTP servers, MicroPython→Unix epoch offset (`946684800`).

### 2.2 SPS30 driver (`class SPS30`)
I2C (addr `0x69`). Command pointers: start-measurement (float mode), stop, data-ready, read-values. CRC-8 (poly `0x31`, init `0xFF`) over each 2-byte word; `read_measured_values_float()` returns 10 big-endian floats: `[mass_PM1, mass_PM2_5, mass_PM4, mass_PM10, num_PM0_5, num_PM1, num_PM2_5, num_PM4, num_PM10, typical_particle_size_um]`.

### 2.3 Helpers
- Diagnostics: `scan_i2c_devices`, `test_i2c_connection`, `test_dns_resolution`, `test_network_connectivity`, `configure_dns`.
- Time: `calculate_next_send_time` (aligns to the 15-min boundary), `format_local_time` (applies UTC offset; adds the epoch correction).
- `connect_wifi()` — joins `ULink`, returns success.
- LED status: `blink_led_startup`, `led_error_code(error_type)`.

### 2.4 `send_to_api(vals)`
Computes converted number-concentrations (#/ft³) and differential bins from the raw SPS30 values, assembles the nested JSON payload (`room_name`, `sensor_number`, `timestamp`, `raw_measurements`, `converted_values.{number_concentrations_ft3, differential_bins_ft3, mass_concentrations_ug_m3}`), and `urequests.post`s it to `API_URL` with fallback URLs on failure. This payload matches `api.receive_particle_data` exactly.

### 2.5 `main()`
Boot self-tests → connect WiFi → NTP sync → loop: at each scheduled time, read the SPS30 and `send_to_api`; handle errors with LED codes and `machine.reset()` on fatal conditions.

## 3. `PicoParylene.py`

- 3 ADCs: `ADC_PIN_PRESSURE=26`, `ADC_PIN_VAPOR=27`, `ADC_PIN_TEMP=28`.
- `SERVER_URL = ".../sdsanalog"`.
- `SESSION_ID = ubinascii.hexlify(machine.unique_id())[:8]` — per-boot run identity.
- Batch pipeline: `add_data_to_csv()` accumulates rows; `send_csv_in_batches()` / `send_complete_csv()` POST CSV chunks with the `X-Session-ID` / batch headers the server expects; `check_auto_send()` triggers periodic flushes; `sendEndRequest()` POSTs `/sdsanalogfinished` to finalize.
- LED feedback via Morse helpers (`flash_morse_for_*`).
- `main_loop()` reads ADCs each tick, appends, and sends; `machine.reset()` after `RESET_DELAY_S` on fatal error.
- Server side: `api.handle_csv_batch` / `combine_csv_batches_final`. See the server's API reference.

## 4. `PicoDenton18.py` — incomplete

- 2 ADCs: `adc0` (pin 26, capacitance gauge), `adc1` (pin 27, ion gauge).
- `SERVER_URL = "http://.../denton18pump"` (note: **http**, not https).
- Main loop selects which gauge to send based on thresholds, posts via `send_data()`, and calls `sendEndRequest()` (→ `/denton18pumpfinished`) when done.
- **Not runnable as-is:** `CUTTOFFPOINT` and `SWITCHPOINT` are referenced but never defined (NameError at runtime); `PASSWORD = 'GENPASSWORD'` is a placeholder; the `gathering` flag is reassigned inside `send_data` as a local and never affects the loop's global. See known-issues.

## 5. `VGC083C_Monitor.py` — broken

- Reads an Inficon/Leybold VGC083C controller over UART (`baudrate=19200`), command `#RDIG\r` (ion gauge) or `#RDCG1/2\r` (convection gauges).
- `post_to_server(p)` → `POST /api/VGC/pressureupload`.
- **Two blockers:** the main loop calls `read_pressure()`, which is **never defined** in the file (NameError); and the server has **no** `/api/VGC/pressureupload` route (confirm against the Flask `api` blueprint and the legacy server — neither implements it). This firmware cannot currently function end-to-end. See known-issues.

## 6. `ParticleSensor.py` (bench readout)

Same SPS30 driver and CRC logic as §2.2, but `main()` prints differential and cumulative number-concentration bins (#/cm³) to the console at `PRINT_PERIOD_S` and does no networking. Use it to validate a sensor on the bench. Pins: `SDA=4`, `SCL=5`, addr `0x69`.

## 7. `PicoConnect.py` (diagnostic)

Joins `ULink` (password from `picopass.passWD`), prints the MAC and IP, and lights the onboard LED on success. ~30 lines. Use it to confirm a board's WiFi before debugging anything else.

## 8. Conventions & maintenance

- **Per-device identity** (`ROOM_NAME`/`SENSOR_NUMBER` or equivalent) is edited per board before flashing; it travels in every payload and drives the server's room/sensor keying.
- **Credentials**: prefer the `picopass` module pattern (`from picopass import passWD`) over hard-coded passwords; never commit real WiFi credentials.
- **Epoch**: RP2040 epoch is 2000-01-01; add `946684800` before sending Unix timestamps (see `Particle_sensor.py`).
- **Reliability**: production firmware should connect-with-retry, NTP-sync, watchdog/reset on fatal error, and give LED status — `Particle_sensor.py` is the model.
- **New sensor checklist**: copy `Particle_sensor.py`, swap the driver and payload, set identity, point at the right endpoint, document the contract in the server's integrations doc.

## 9. File map
```
Particle_sensor.py   SPS30 → /particle-data        (reference firmware)
PicoParylene.py      3×ADC → /sdsanalog            (batched)
PicoDenton18.py      2×ADC → /denton18pump         (incomplete)
VGC083C_Monitor.py   UART  → /api/VGC/...          (broken)
ParticleSensor.py    SPS30 → console               (bench test)
PicoConnect.py       WiFi check + LED              (diagnostic)
```
See the layman guide at `presentation/UNanofabTools/picofirmware/README.md`.
