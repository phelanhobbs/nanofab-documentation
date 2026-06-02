# Pico Firmware — Known Issues & Technical Debt

Working list for the Raspberry Pi Pico firmware copies in this repository. Kept separate from the successor docs. Nothing here has been changed in the code.

> **Heads-up:** the canonical, currently-maintained versions of this firmware live in `NanofabToolkit/PicoHelperTools/`. Their issues list at [`known-issues/NanofabToolkit/PicoHelperTools.md`](../NanofabToolkit/PicoHelperTools.md) is the **primary** place to track cross-cutting items (cleartext WiFi credentials, DST handling, watchdog default, driver duplication). The items below apply to the older copies retained here for historical reference; fix in the NanofabToolkit copies first.

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
