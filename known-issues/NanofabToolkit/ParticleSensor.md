# ParticleSensor — Known Issues & Technical Debt

Working list for the canonical PyQt particle-data viewer in `NanofabToolkit/ParticleSensor/`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = correctness/data risk · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Timezone fixed with a +7h hack (in two places) — Medium
- **Where:** `src/ParticleSensor.py` `convert_to_mountain()` adds `timedelta(hours=7)`. `src/gui.py` has a copy of the same function.
- **Risk:** wrong by an hour during Mountain Daylight Time (offset should be -6, not -7); brittle around DST transitions; masks the real problem (server stores naive timestamps without timezone info).
- **Fix:** make timestamps timezone-aware end-to-end — store UTC server-side, convert with `pytz`/`zoneinfo` on display. Failing that, detect DST locally and adjust the offset. While there, factor `convert_to_mountain` into a single source of truth used by both modules.

### 2. Two copies of `convert_to_mountain` — Low/Medium
- **Where:** `src/ParticleSensor.py` and `src/gui.py`.
- **Risk:** fixes to one don't reach the other; subtle behavior drift.
- **Fix:** keep only the helper in `ParticleSensor.py`; have `gui.py` import it.

### 3. Production API URL is hard-coded — Low
- **Where:** `ParticleDataAPI.__init__(self, api_url="https://nfhistory.nanofab.utah.edu/particle-data")`.
- **Risk:** can't be redirected to a test server without a code edit or a constructor override every instantiation.
- **Fix:** read from an env var / settings file with the production URL as a fallback default.

### 4. Cleanroom-map layout is hard-coded in `gui.py` — Low/Medium
- **Where:** `init_ui` defines the bay/lab grid as literals; labels must match Pico `room_name` values exactly.
- **Risk:** a renamed room or a relabeled Pico silently breaks the map coloring.
- **Fix:** drive the layout/labels from a shared config (or from the server's known rooms).

### 5. Certificate validation disabled (`verify=False`) — Low/Medium
- **Where:** `requests.get(...)` calls in `ParticleSensor.py`.
- **Risk:** standard internal-cert tradeoff (encrypted but unverified). Fine on the private network; not acceptable if exposure widens.
- **Fix:** install the internal CA into the executable's trust store; re-enable verification.

### 6. The data key `(room_name, sensor_number)` is informal — Medium
- **Where:** matching readings to map cells is by `room_name` lookup in `self.room_frames` plus the sensor index in the table.
- **Risk:** a Pico mislabel (wrong room or wrong sensor number) silently mis-routes its data; the GUI can't tell.
- **Fix:** validate against a known registry on the server; surface unknown `(room, sensor)` keys as a warning in the GUI.

### 7. Exception messages lose the underlying transport detail — Low
- **Where:** `ParticleDataAPI.fetch_*` raises `Exception(f"Error fetching ...: {str(e)}")`.
- **Risk:** generic `Exception` makes targeted handling harder for any future caller.
- **Fix:** define a small `ParticleAPIError` (with the response status code where available) and raise that.

### 8. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** mock-based contract tests asserting `ParticleDataAPI` matches the server's response shape (and `ParticleDataProcessor` formats correctly).

### 9. PyInstaller build steps undocumented — Low
- **Where:** packaging artifacts (`src/assets/icon.ico`) are present; no captured spec/command in the repo README.
- **Fix:** add a one-page build note so a successor can rebuild the `.exe`.

### 10. Divergent older copy in UNanofabTools — Low (context)
- **Where:** `UNanofabTools/particle_data_viewer.py`.
- **Risk:** maintainers may unknowingly patch the older copy and assume changes shipped.
- **Fix:** treat the NanofabToolkit version as canonical (per these docs), and either retire the older copy or clearly mark it deprecated where it sits.

---

## Suggested priority order
1. #1 + #2 fix timezone handling properly and stop duplicating the helper — Medium
2. #6 add a `(room, sensor)` validation pass on refresh — Medium
3. #8 contract tests — Medium
4. #4 + #3 externalize layout and API URL — Low/Medium
5. #5 restore TLS verification once the CA is bundled — Low/Medium
6. #7, #9, #10 — Low

## Relationship to UNanofabTools
The older copy in `UNanofabTools/` is not maintained; treat NanofabToolkit as canonical and refer to `known-issues/UNanofabTools/particlepctools.md` only for historical context. Cross-cutting items (timezone, duplicate viewer) appear in both lists; fix here first.
