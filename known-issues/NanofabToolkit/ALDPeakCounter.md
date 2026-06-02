# ALDPeakCounter — Known Issues & Technical Debt

Working list for `NanofabToolkit/ALDPeakCounter`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Duplicate `peakCount.py` with UNanofabTools — Medium
- **Where:** `src/peakCount.py` here is essentially the same as `UNanofabTools/peakCount.py`.
- **Risk:** fixes/algorithm tweaks must land in both; they will drift.
- **Fix:** make one copy canonical (or extract a shared package) and import from there.

### 2. Hard-coded tab-delimited input format — Medium
- **Where:** `count_peaks` parses lines with `line.split('\t')` and skips the first row as a header.
- **Risk:** comma-separated files (or files with no header) silently produce zero/garbage results; users get no clear error.
- **Fix:** detect the delimiter (csv sniffer), or document the expected format up front and validate the first row.

### 3. `Min Distance` is in samples, not seconds — Low (UX)
- **Where:** GUI label `"Min Distance:"`.
- **Risk:** users assume seconds and set tiny / huge values that don't behave as expected.
- **Fix:** label it `"Min Distance (samples)"` and/or expose seconds with a conversion.

### 4. Custom click-drag box zoom — Low
- **Where:** `on_mouse_press/release/move` + `apply_zoom`.
- **Risk:** missing pan/save/back-to-home affordances; minor visual artifacts (no rubber-band rectangle while dragging).
- **Fix:** drop in matplotlib's `NavigationToolbar2Tk` for standard zoom/pan/home/save.

### 5. End-peak heuristic is untested — Low
- **Where:** the "add a peak at the end" rule in `count_peaks` (same as UNanofabTools issue #8 for that copy).
- **Fix:** unit tests covering rising / plateau / elevated end cases.

### 6. No file-format validation feedback — Low
- **Where:** if a selected file lacks the expected columns, `count_peaks` quietly returns zero peaks.
- **Fix:** surface a per-file warning in the results panel when no valid time/pressure rows were found.

### 7. PyInstaller hook/build details aren't versioned with the GUI — Low
- **Where:** `src/hook-matplotlib.py`.
- **Note:** consider documenting the build command in the repo README so a successor can rebuild the executable.

---

## Suggested priority order
1. #1 de-duplicate `peakCount.py` between repos — Medium
2. #2 input-format detection / validation — Medium
3. #3 label `Min Distance` clearly — Low (cheap)
4. #4, #5, #6, #7 — Low
