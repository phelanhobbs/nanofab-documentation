# Particle PC Tools — Developer Documentation

Reference for the two PC-side particle programs: a PyQt desktop viewer and a synthetic-data generator. Bugs/tech debt: `known-issues/UNanofabTools/particlepctools.md`.

> **Heads-up — the viewer has a newer home.** The canonical, currently-maintained version of `particle_data_viewer.py` lives in `NanofabToolkit/ParticleSensor/` (with env-data sub-boxes, the standard matplotlib navigation toolbar, and cleaner API/GUI separation) and is documented at [`documentation/NanofabToolkit/ParticleSensor/`](../../NanofabToolkit/ParticleSensor/README.md). The viewer in this folder is the older copy, retained for historical reference. The test-data generator (`generate_test_particle_data.py`) has no NanofabToolkit twin and remains documented here. Cross-cutting bugs are tracked primarily at [`known-issues/NanofabToolkit/ParticleSensor.md`](../../../known-issues/NanofabToolkit/ParticleSensor.md).

## 1. Overview

| File | Type | Direction | Talks to |
|------|------|-----------|----------|
| `particle_data_viewer.py` | PyQt5 desktop GUI (~1090 lines) | reads | `GET /particle-data` (current + historical) |
| `generate_test_particle_data.py` | CLI / script (~?? lines) | writes | `POST /particle-data` (default `localhost:5000`) |

Both speak the server's `api` blueprint contract for particle data — see `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` and `05-http-api-reference.md`.

## 2. `particle_data_viewer.py`

### 2.1 Structure
- `convert_to_mountain(dt)` — adds a fixed 7-hour offset to API datetimes (workaround for a stored-time discrepancy; see known-issues).
- `class RoomFrame(QFrame)` — one clickable, color-codeable cell in the cleanroom map.
- `class ParticleDataViewer(QMainWindow)` — the main window: builds the room-map grid + a data table, a Refresh button, and the fetch/populate logic. `self.api_url = "https://nfhistory.nanofab.utah.edu/particle-data"`.
- `class HistoricalDataWindow(QMainWindow)` — opened on drill-down; loads and charts one sensor's history (`self.historical_data`).
- `main()` — Qt application bootstrap.

### 2.2 Data flow
- On refresh, GETs `/particle-data` (no params) and parses the `{status, count, sensors:[...]}` response (`sensors` is the array; each entry is a `ParticleSensorData.to_dict()` shape).
- Builds a lookup of normalized API `room_name` → record and color-codes the matching `RoomFrame`s.
- Drill-down GETs `/particle-data?room_name=...&sensor_number=...` (historical CSV mode) and charts the series.

### 2.3 Notes
- The room layout (bay numbers, labs, gowning, etc.) is hard-coded as a grid in `init_ui`; the labels must match the `room_name` values the firmware sends for the map coloring to line up.
- This is closely related to `NanofabToolkit/ParticleSensor/src/gui.py`; the two have diverged. Decide which is canonical (see known-issues).
- Likely uses `verify=False` for the internal certificate (consistent with the other consumers).

## 3. `generate_test_particle_data.py`

### 3.1 Structure
- `class ParticleDataGenerator` — `__init__(self, api_url="http://localhost:5000/particle-data")`.
  - `self.sensors`: a dict of synthetic sensors, each with `room`, `sensor`, `base_pm2_5` (µg/m³ baseline), and `variation`. Defaults model a cleanroom (very low), a main lab, a fume-hood area, and an office (higher).
  - `self.sensor_states`: per-sensor trend state so values drift believably rather than jumping randomly.
- Generation logic builds a full nested payload (raw + converted values matching the server contract), adds time-correlated variation/trends, and POSTs it on an interval.
- Disables urllib3 InsecureRequestWarning (self-signed cert tolerance).

### 3.2 Usage
- Default target is `localhost:5000` (a dev server). Point it at a test instance, **not** production.
- Run it to populate the DB + CSV history with realistic data for developing/demoing the viewer, the website map, and any alerting.

## 4. Relationship to the rest of the system

```
generate_test_particle_data.py ──POST /particle-data──►  server  ──┐
real Pico firmware ────────────POST /particle-data──────►          │ stores CSV history + latest row
                                                                   ▼
particle_data_viewer.py ◄──GET /particle-data (current/historical)─┘
```

The generator is a stand-in for the firmware; the viewer is a richer alternative to the website's particle pages.

## 5. Maintenance

- **Time handling**: replace the +7h hack in `convert_to_mountain` with proper timezone-aware handling (the server stores naive timestamps; fix at the source or convert correctly with `pytz`/`zoneinfo`). See known-issues.
- **Canonical viewer**: reconcile this file with the NanofabToolkit GUI to avoid maintaining two diverging copies.
- **Config**: the production URL and the room-map layout are hard-coded; consider externalizing.
- **Generator safety**: add a guard / prominent flag so it can't accidentally be aimed at production.

See the layman guide at `presentation/UNanofabTools/particlepctools/README.md`.
