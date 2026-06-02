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

- **Producers:** [`PicoHelperTools`](../PicoHelperTools/README.md) — the Pico firmware that populates the data this viewer displays.
- **Server side:** `documentation/UNanofabTools/flaskserver/` — the Flask app that holds the data and serves the endpoints.
- **Older sibling:** `UNanofabTools/particle_data_viewer.py` — historical reference only.

See the layman guide at `presentation/NanofabToolkit/ParticleSensor/README.md`.
