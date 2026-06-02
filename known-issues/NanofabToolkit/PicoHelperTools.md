# PicoHelperTools — Known Issues & Technical Debt

Working list for the canonical Pico firmware in `NanofabToolkit/PicoHelperTools/`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = breaks functionality or real security exposure · **Medium** = robustness / maintainability · **Low** = cleanup.

---

### 1. WiFi credentials hard-coded in cleartext — High (security)
- **Where:** all three files — `WIFI_SSID = "ULink"`, `WIFI_PASSWORD = "<redacted-wifi-password>"`.
- **Risk:** the lab WiFi password is committed to the repo and shipped on every flashed Pico.
- **Fix:** standardize on `from picopass import passWD` (the pattern from `UNanofabTools/PicoConnect.py`); keep `picopass.py` outside version control; rotate the WiFi password after cleanup.

### 2. UTC offset is not DST-aware — Medium
- **Where:** all three files — `UTC_OFFSET_HOURS = -7` (MST only).
- **Risk:** during Mountain *Daylight* Time the offset is off by one hour; timestamps drift by an hour between standard and daylight time.
- **Fix:** preferred: store UTC end-to-end and convert at display time (server-side change). Lightweight fix: detect DST on the Pico from the NTP-synced clock and toggle the offset accordingly.

### 3. `ENABLE_WATCHDOG = False` by default in the combined firmware — Medium
- **Where:** `sensor_combined.py`.
- **Risk:** the watchdog is the main protection against a wedged loop on a headless board. Shipping it off makes recovery slower than it should be.
- **Fix:** flip the default to `True` for production; document the override for bench testing.

### 4. `Particle_sensor.py` driver/payload duplication across files — Medium
- **Where:** SPS30 class and conversion math repeat between `Particle_sensor.py` and `sensor_combined.py`.
- **Risk:** a fix in one (e.g. CRC handling, bin math) silently fails to land in the other.
- **Fix:** extract a shared module (e.g. `sps30.py`) imported by both. Same for the DHT22 read helper and the scheduled-send/clock-sync utilities.

### 5. DHT22 `/env-data` endpoint dependency — Low (cross-system)
- **Where:** `DHT22_sensor.py` `API_URL = ".../env-data"`.
- **Note:** the server endpoint exists today (added to `app/blueprints/api.py`); the comment in the file noting it "must be added" predates that. Update the file's comment to reflect current reality.

### 6. `sensor_combined` POST + GET asymmetry (server side) — Medium (cross-system)
- **Where:** `sensor_combined.py` POSTs to `/sensor-data`; the matching `GET /sensor-data` reads `LogData/sensors/<id>_combined.csv`, which nothing writes.
- **Risk:** historical lookups via `GET /sensor-data` return 404 in practice. Surfaces as a viewer/tool issue, not a firmware one.
- **Fix:** server-side (tracked under `known-issues/UNanofabTools/flaskserver.md` #1). No change here.

### 7. Cleartext per-board identity is easy to miss-edit — Low (process)
- **Where:** `ROOM_NAME`, `SENSOR_NUMBER` (and `DEVICE_ID` in combined) are bare assignments at the top of each file.
- **Risk:** a freshly flashed board can silently inherit the previous board's labels.
- **Fix:** consider deriving identity from `machine.unique_id()` mapped to a registry on the server, or at minimum add a startup self-report so mislabels are visible quickly.

### 8. No automated tests / hardware fixtures — Medium
- **Where:** none of the firmware has tests.
- **Risk:** behavior drift over time goes unnoticed until a board misbehaves.
- **Fix:** at minimum, mock-based tests of the payload shape against the server contract; ideally a small CI-runnable simulator.

### 9. ASCII-only constants and a few magic numbers — Low
- **Where:** scattered constants (`CM3_TO_FT3 = 28316.8`, bin edges, etc.) are clear but uncommented.
- **Fix:** brief comments tying constants to the SPS30 datasheet sections.

---

## Suggested priority order
1. #1 remove cleartext WiFi credentials — High (security)
2. #3 enable the watchdog by default in the combined firmware — Medium
3. #2 stop the DST drift — Medium
4. #4 de-duplicate the driver / scheduling helpers — Medium
5. #8 add tests against the payload contract — Medium
6. #5, #6, #7, #9 — Low / context

## Relationship to UNanofabTools
The older copies of this firmware in `UNanofabTools/` are not maintained; treat NanofabToolkit as canonical and refer to `known-issues/UNanofabTools/picofirmware.md` only for historical context. Cross-cutting items (e.g. WiFi credential hygiene) appear in both lists; fix here first.
