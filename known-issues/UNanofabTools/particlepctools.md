# Particle PC Tools — Known Issues & Technical Debt

Working list for `particle_data_viewer.py` (older copy) and `generate_test_particle_data.py`. Separate from the successor docs. Nothing here has been changed in the code.

> **Heads-up:** the canonical, currently-maintained version of the particle viewer lives in `NanofabToolkit/ParticleSensor/`. Its issues list at [`known-issues/NanofabToolkit/ParticleSensor.md`](../NanofabToolkit/ParticleSensor.md) is the **primary** place to track cross-cutting viewer items (the +7h timezone hack, the hard-coded layout/URL). The items below apply to the older viewer copy retained here and to the test-data generator (which has no NanofabToolkit twin). Fix viewer issues in the NanofabToolkit copy first.

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
