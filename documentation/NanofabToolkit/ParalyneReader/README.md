# ParalyneReader — Developer Documentation

Reference for the `ParalyneReader` desktop app: a Tkinter GUI that lists, downloads, and visualizes Parylene-coater run files served by the cleanroom Flask server. Bugs/tech debt: `known-issues/NanofabToolkit/ParalyneReader.md`.

## 1. Overview

| File | Role |
|------|------|
| `main.py` | Entry point. Configures logging, builds the Tk root, instantiates `ParalyneReaderApp`, registers a clean-shutdown handler, runs the event loop. Imports `gui.ParalyneReaderApp` from `src/`. |
| `src/ParalyneReader.py` | API client: `list_files()`, `download_file(filename)`, `return_selected(filename)` against `https://nfhistory.nanofab.utah.edu/api/paralyne/analog`. |
| `src/gui.py` (`ParalyneReaderApp`) | The Tk app: list/select/download UI, threaded downloads (`thread_pool`), matplotlib chart, smoothing/normalization/time-alignment controls. |
| `src/assets/icon.ico` | Windowed executable icon. |

Dependencies: `requests`, `numpy`, `scipy`, `matplotlib`, `tkinter` (stdlib), `logging`. `main.check_dependencies()` checks for these at startup.

## 2. Server contract

Talks to the Flask app's `api` blueprint (Parylene routes):

- `GET /api/paralyne/analog/list` → `{status, count, files:[{filename, size, modified, download_url}, ...]}`. Newest-first ordering is enforced server-side.
- `GET /api/paralyne/analog/download/<filename>` → raw CSV bytes (as attachment). Server rejects names containing `..`, `/`, `\`, or non-`.csv` extensions.

`requests` calls use `verify=False` (internal CA), with `requests.packages.urllib3.disable_warnings()` to silence noise.

See `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` §5.6 for the server side.

## 3. `main.py`

- `setup_logging()` writes to `logs/paralyne_reader.log` (creating the folder if missing) and also to stdout.
- `main()`: extends `sys.path` to include `src/`, imports `gui.ParalyneReaderApp`, builds `tk.Tk()`, sets icon (best-effort), centers the window, registers a `WM_DELETE_WINDOW` handler that shuts down `app.thread_pool` if present and destroys the root.
- `check_dependencies()`: returns False if any of `tkinter`, `requests`, `matplotlib`, `numpy`, `scipy` are missing.
- Catches `ImportError` and generic exceptions, surfaces them via `messagebox.showerror` with guidance to `pip install -r requirements.txt`.

## 4. `src/ParalyneReader.py`

```python
base_url = "https://nfhistory.nanofab.utah.edu/api/paralyne/analog"

def list_files():
    response = requests.get(f"{base_url}/list", verify=False)
    if response.status_code == 200:
        return response.json()['files']
    raise Exception(...)

def download_file(filename):
    response = requests.get(f"{base_url}/download/{filename}", verify=False)
    if response.status_code == 200:
        file_path = os.path.abspath(filename)
        with open(file_path, 'wb') as f: f.write(response.content)
        return file_path
    raise Exception(...)

def return_selected(filename):
    response = requests.get(f"{base_url}/return/{filename}", verify=False)
    ...
```

- `list_files()` returns the `files` list directly.
- `download_file(filename)` saves to the CWD with the given name and returns the absolute path.
- `return_selected(filename)` calls `/api/paralyne/analog/return/<filename>` — **this server endpoint does not exist** in the current Flask app or the legacy server. The function is dead. See known-issues.

## 5. `src/gui.py` — `ParalyneReaderApp`

(Inferred behavior from `main.py` and the dependency list.) Provides:

- A **file list** populated by `list_files()` (newest first), with size and modified date columns.
- **Download** action that submits work to a `ThreadPoolExecutor` (`self.thread_pool`) so the UI stays responsive; downloaded files are loaded into memory for plotting.
- A matplotlib `FigureCanvasTkAgg` showing each loaded run as a series.
- **Smoothing** options (likely SciPy filters such as a Savitzky–Golay or moving-average; the code lists `scipy` as required for this).
- **Normalization** to overlay runs at different baselines.
- **Time-alignment** to shift one run vs. another (cf. `ALDPeakCounter`'s offset pattern).

The exact widget set may evolve — confirm against the live source before extending.

## 6. Operational notes

- Logs to `logs/paralyne_reader.log` next to the executable / module.
- Downloads write to the **current working directory**, which is the executable's folder when frozen — confirm permissions before deploying.
- Skipping certificate verification is the standard internal-cert tradeoff; encrypted in transit, just unverified.

## 7. Maintenance / recommendations

- **Delete or implement `return_selected`** (`/return/<filename>` doesn't exist server-side).
- **Make the download directory configurable** rather than CWD (or default to a `Downloads/` subfolder).
- **Switch to verified TLS** once the internal CA is in the executable's trust store.
- **Document the build** — there's a PyInstaller setup; capture the spec/command in the repo README so a successor can rebuild the .exe.
- **Add a "Refresh List" action** with timeout + retry, and surface clear errors when the server is unreachable.

See the layman guide at `presentation/NanofabToolkit/ParalyneReader/README.md` and the server-side endpoints documented under `documentation/UNanofabTools/flaskserver/`.
