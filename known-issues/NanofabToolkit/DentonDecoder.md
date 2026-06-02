# DentonDecoder — Known Issues & Technical Debt

Working list for `NanofabToolkit/DentonDecoder`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Multi-day handling is limited to one midnight rollover — Medium
- **Where:** `DentonGrapher.create_graph` — `if time_delta < 0: time_delta += 24*60*60`.
- **Risk:** runs spanning more than one full day, or multiple midnight crossings, produce incorrect time axes.
- **Fix:** carry the date alongside the time (or use the file's modification date as a base) so multi-day runs work.

### 2. ASCII-replace decode masks bad data — Low
- **Where:** `open(input_file, 'r', errors='replace')`.
- **Risk:** stray non-ASCII bytes silently become replacement chars; a corrupted CSV can render without warning.
- **Fix:** open as UTF-8 (or auto-detect); log a warning when replacements occur.

### 3. Unusual `plt.figure` + `plt.gca()` pattern — Low
- **Where:** `fig, ax = plt.figure(figsize=(10, 6)), plt.gca()`.
- **Risk:** correctness depends on `plt.figure` having set the current figure; clearer with `plt.subplots`.
- **Fix:** replace with `fig, ax = plt.subplots(figsize=(10, 6))`.

### 4. Hard-coded default column `"Chamber Pressure (Torr)"` — Low
- **Where:** `create_graph` default arg.
- **Risk:** a Denton software/firmware update could rename the column; CLI usage without overriding would silently fail (and print available columns).
- **Fix:** keep the default for convenience, but ensure the GUI's column dropdown always drives the call rather than relying on the default.

### 5. Easily confused with UNanofabTools' DAT tools — Low (UX)
- **Where:** name and audience overlap with `UNanofabTools/dattools`; both workflows can involve Denton `.dat` files, but DentonDecoder is a GUI converter/viewer while DATfixer/DATgrapher are command-line cleaning and pressure-plot tools.
- **Risk:** users (or future maintainers) pick the wrong workflow or assume fixes in one tool affect the other.
- **Fix:** make the distinction explicit in the app title/About: "Denton GUI converter/viewer; DATfixer/DATgrapher are command-line pressure-log tools."

### 6. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** a small fixture CSV with known timestamps/values + a parsing test would lock in the time/value extraction and the midnight patch.

### 7. PyInstaller spec/build steps undocumented — Low
- **Where:** `pyinstaller/hooks/hook-runtime.py` exists, but the build command isn't in the repo README.
- **Fix:** document the PyInstaller build (entry point, hook path, asset inclusion) so a successor can rebuild the .exe.

---

## Suggested priority order
1. #1 multi-day timestamp handling — Medium
2. #6 add tests around the CSV parser — Medium
3. #5 make the dattools distinction obvious — Low (UX)
4. #2, #3, #4, #7 — Low
