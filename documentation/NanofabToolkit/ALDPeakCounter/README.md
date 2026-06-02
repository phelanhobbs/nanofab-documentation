# ALDPeakCounter — Developer Documentation

Reference for the `ALDPeakCounter` desktop app. Tkinter GUI wrapping a SciPy-based peak counter, with per-file time alignment and box-zoom interaction. Bugs/tech debt: `known-issues/NanofabToolkit/ALDPeakCounter.md`.

## 1. Overview

| File | Role |
|------|------|
| `main.py` | Entry point. Sets a global exception hook that shows a scrollable error dialog with environment info; otherwise instantiates and runs the GUI. |
| `src/gui.py` | `PeakCounterGUI` — the Tkinter app: file picker, parameter inputs, results text, matplotlib canvas, time-alignment controls, box zoom. |
| `src/peakCount.py` | `count_peaks(...)` + `multi_file_plot(...)`. The same algorithm as `UNanofabTools/peakCount.py`. |
| `src/hook-matplotlib.py` | PyInstaller hook for bundling matplotlib backends. |
| `src/assets/icon.ico`, `icon.py` | Windowed icon (used by PyInstaller spec). |

Dependencies: `numpy`, `scipy.signal.find_peaks`, `matplotlib` (Tk-Agg backend), `tkinter` (stdlib).

Packaged with PyInstaller; the `hook-matplotlib.py` hook and `src/assets/` ship the matplotlib runtime and an `.ico` for the windowed executable.

## 2. `main.py`

- `show_error_dialog(title, message)` — opens a fresh `Tk()` window containing a scrolled, read-only text area with the supplied error/traceback and a close button. Centers the window and `sys.exit(1)` on close.
- `show_error(exc_type, exc_value, exc_tb)` — global `sys.excepthook`; formats and displays an unhandled exception in the dialog.
- `main()` — gathers Python/NumPy/SciPy/matplotlib version info into `env_info`, then `from src.gui import PeakCounterGUI; PeakCounterGUI().run()`. Any exception falls back to the dialog with the environment info attached — useful when shipped as a frozen executable to a non-technical user.

## 3. `src/gui.py` — `PeakCounterGUI`

### 3.1 State
- `self.selected_files` — list of absolute paths the user added.
- `self.results` — `[(file_path, peak_count, pressure_times, pressures, peaks), ...]` populated by `process_files`.
- `self.time_offsets[file_path]` — per-file horizontal shift applied in `update_plot`.
- Parameter `tk.Variable`s: `height_var`, `prominence_var` (default 0.01), `distance_var` (default 10), `width_var`.
- Box-zoom state: `zoom_rect`, `zooming`.

### 3.2 UI layout (`_create_widgets`)
- Top **control frame**: file `Add` / `Clear` buttons; `param_frame` with the four entry widgets; a `Process Files` button.
- **Files frame**: `Listbox` of basenames + `Text` results panel.
- **Time Alignment Controls** `LabelFrame`: dynamically populated when files are processed.
- **Plot frame** with matplotlib `FigureCanvasTkAgg`; instruction label + `Reset Zoom`; bound to `button_press/release/motion_notify` for box zoom.

### 3.3 Key methods
- `add_files()` — `filedialog.askopenfilenames` (`.txt` filter); de-dupes against the current list; initializes the file's entry in `time_offsets` to 0.
- `clear_files()` — empties all state and the plot.
- `create_offset_controls()` — per file, creates a row with: a label (basename), an `Entry` bound to a `DoubleVar` (the live offset), a horizontal `Scale` from `-50` to `+50`, **Apply** (commits the entry/slider value into `self.time_offsets`), and **Zero** (resets that file).
- `apply_offset(fp, var)` / `zero_offset(fp, var)` / `reset_offsets()` — manage `self.time_offsets` and call `update_plot()`.
- `process_files()` — pulls the four params (treating `0` as `None` for `height`/`width`), calls `count_peaks(file_path, **params, plot=False, quiet=True)` for each file, records results, prints `"<basename>: <N> peaks"` plus peak times into the results text area, builds offset controls, then `update_plot()`.
- `update_plot()` — clears the figure, iterates `self.results`, applies each file's offset (`adjusted_times = pressure_times + offset`), plots the pressure curve and marker-overlays the peaks. Colors cycle through `cm.tab10`; markers cycle through 10 shapes.
- `on_mouse_press` / `_release` / `_move` + `apply_zoom()` — implement a simple click-drag box zoom by setting `xlim`/`ylim` on release; `reset_zoom()` calls `autoscale()`.
- `run()` — `self.root.mainloop()`.

### 3.4 Input format
Tab-delimited text with a header row; column 0 = time (float), column 1 = pressure (float). Empty lines and non-numeric rows are skipped (in `count_peaks`).

## 4. `src/peakCount.py`

Functionally identical to `UNanofabTools/peakCount.py` (same `count_peaks` + end-peak heuristic + `multi_file_plot`). See `documentation/UNanofabTools/utilities/README.md` §2 for the algorithm details. Keep the two copies in sync (see known-issues).

## 5. Packaging
- `src/hook-matplotlib.py` ensures matplotlib's backend / data files are included by PyInstaller.
- `src/assets/icon.ico` is the windowed executable's icon.
- Build with the project's PyInstaller spec (not shown here) referencing `main.py` as the entry.

## 6. Maintenance notes
- **Duplicate peak-counter logic** with UNanofabTools — consider a shared package or one canonical copy.
- **Tab-delimited input is a hard assumption**; document the expected file format in the GUI itself.
- **The `Min Distance` parameter is in samples, not seconds** — labeling makes this clearer for users.
- The box-zoom implementation is custom; matplotlib's built-in `NavigationToolbar2Tk` would give standard zoom/pan/save buttons for free if simplification is desired.

See the layman guide at `presentation/NanofabToolkit/ALDPeakCounter/README.md` and the related `UNanofabTools/utilities` docs for the shared peak-count algorithm.
