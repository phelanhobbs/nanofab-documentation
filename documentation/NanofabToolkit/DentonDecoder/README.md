# DentonDecoder — Developer Documentation

Reference for the `DentonDecoder` desktop app. Tkinter GUI that accepts Denton `.dat` files or already-converted CSV logs, converts `.dat` inputs to CSV, and charts a chosen column against time using matplotlib. Bugs/tech debt: `known-issues/NanofabToolkit/DentonDecoder.md`.

> **Not to be confused with `UNanofabTools/dattools`.** Both toolsets can touch Denton `.DAT`-style data, but their workflows differ. DentonDecoder is a desktop GUI that converts a selected `.dat` to a temporary CSV and plots arbitrary columns; `UNanofabTools/dattools` is a pair of command-line utilities focused on cleaning Denton 635 event logs and plotting pressure.

## 1. Overview

| File | Role |
|------|------|
| `main.py` | Entry point. Sets `matplotlib.use('TkAgg')` early. Global exception hook surfaces unhandled errors in a scrollable Tk dialog with environment info. |
| `src/DentonDecoder.py` | `convertFile(filePath)` — converts Denton `.dat` files to a temporary CSV in the user's temp directory, reading 128-byte chunks and decoding string/double/int records. |
| `src/DentonGrapher.py` | `create_graph(input_file, column_name="Chamber Pressure (Torr)", output_file=None, show_graph=True, log_scale=False, return_data=False)` — the core parsing + plotting routine. |
| `src/gui.py` (`DentonGUI`) | Tkinter app: multi-file picker for `.dat`/`.csv`, background `.dat` conversion, column selector, log-scale toggle, time-alignment controls, plot canvas, save. |
| `src/assets/icon.ico` | Windowed executable icon. |
| `pyinstaller/hooks/hook-runtime.py` | PyInstaller hook used during packaging. |

Dependencies: `numpy`, `matplotlib` (TkAgg backend), `csv` (stdlib), `datetime`, `tkinter`.

## 2. `main.py`

- Forces `matplotlib.use('TkAgg')` before any matplotlib import to avoid backend mismatches when frozen.
- `show_error_dialog(title, message)` opens a fresh `Tk()` with a scrolled, read-only text area + close button; centers and `sys.exit(1)` on close.
- `show_error(...)` global `sys.excepthook` formats unhandled tracebacks into the dialog.
- `main()` collects Python/NumPy/matplotlib version info, adjusts `sys.path` to include `.` and `./src`, then `from src.gui import DentonGUI; DentonGUI().mainloop()`. Any failure during import or run lands in the error dialog.

## 3. `src/DentonDecoder.py`

`convertFile(filePath)` is the `.dat` conversion path used by the GUI:

1. Validates that the input exists and is readable.
2. Reads the file as bytes.
3. Walks the data in 128-byte chunks, decoding known record forms:
   - `0x08 0x00 <len> 0x00` → ASCII text field.
   - `0x05 0x00` + 8 bytes → little-endian double.
   - `0x03 0x00` + 4 bytes → little-endian unsigned int.
4. Treats the first 27 decoded values as headers and groups the rest into 27-column rows.
5. Writes `<input-stem>.csv` under `tempfile.gettempdir()` and returns that path.

The converter is intentionally separate from the graphing routine: `.csv` inputs bypass it, while `.dat` inputs run through it before column detection and plotting.

## 4. `src/DentonGrapher.py`

### 4.1 `create_graph(...)`

Signature:
```python
create_graph(input_file,
             column_name="Chamber Pressure (Torr)",
             output_file=None,
             show_graph=True,
             log_scale=False,
             return_data=False)
```

Behavior:
1. Opens the CSV with `errors='replace'`; `csv.reader` reads the header row to find `headers.index(column_name)` (prints available columns and returns `False`/`([], [])` if not found).
2. Treats `time_col = 0` (always the first column).
3. Iterates rows: parses each timestamp with `datetime.strptime(time_str, "%H:%M:%S")`; first valid row becomes `base_time`; subsequent rows produce `time_delta = (time_obj - base_time).total_seconds()`. A single midnight rollover is patched (`+86400` if negative).
4. Attempts `float(row[data_col])`; rows with bad time or value are skipped.
5. If `return_data` → returns `(times, values)` (lists).
6. Otherwise plots with matplotlib: title `f'{column_name} vs Time - {Path(input_file).stem}'`, scientific-notation y-axis unless `log_scale` (then `ax.set_yscale('log')`), grid on; saves to `output_file` if provided; `plt.show()` (if `show_graph`) else `plt.close(fig)`. Warns when fewer than 10 points were found.

### 4.2 Data contract
- First column = timestamp `HH:MM:SS`.
- Header row required (to look up `column_name`).
- All other columns are arbitrary; user picks one to plot.

## 5. `src/gui.py` — `DentonGUI`

(Behavior from the live source.) Wraps conversion + plotting as follows:
- File picker (`filedialog.askopenfilenames`) accepts `.dat`, `.csv`, or all files.
- `.dat` files are converted in a background thread with `convertFile`; `.csv` files are loaded directly.
- Reads the header row from each ready CSV and populates a common-column `Combobox`.
- Includes log-scale and auto-zoom toggles.
- Embeds a `FigureCanvasTkAgg`, custom box zoom, and a standard `NavigationToolbar2Tk`.
- Supports per-file time offsets so multiple runs can be aligned before plotting.

Confirm the exact widget set against the live source when extending.

## 6. Packaging

PyInstaller-friendly: `matplotlib.use('TkAgg')` is set early, `sys.path` is extended for the frozen layout, and `pyinstaller/hooks/hook-runtime.py` participates in the build. The bundled `.ico` is the executable icon.

## 7. Maintenance notes

- **Timestamp depth**: timestamps are `HH:MM:SS` only (no date); multi-day runs aren't supported beyond the single +86400 midnight patch.
- **Hard-coded default column** (`"Chamber Pressure (Torr)"`): tolerant — the GUI lets users pick any column — but ensure the dropdown drives `create_graph` rather than relying on the default.
- **`ax = plt.gca()` after `plt.figure(figsize=...)`**: the line `fig, ax = plt.figure(figsize=(10, 6)), plt.gca()` is unusual but works; it relies on `plt.figure` setting the current figure so `gca()` returns its axes. Consider replacing with `fig, ax = plt.subplots(figsize=(10, 6))` for clarity.
- **No tests**: a small fixture CSV + golden plot data would lock in the time/value parsing.
- **Don't mix up with UNanofabTools' DAT tools**: DentonDecoder has a GUI conversion path plus arbitrary-column plotting; the UNanofabTools tools are command-line cleaning/pressure-plot helpers. Document the distinction prominently if you ever consolidate.

See the layman guide at `presentation/NanofabToolkit/DentonDecoder/README.md`.
