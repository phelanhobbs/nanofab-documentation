# DAT Tools — Known Issues & Technical Debt

Private working list for `DATfixer.py` and `DATgrapher.py`. Kept separate from the successor documentation so the handoff stays clean. Nothing here has been changed in the code — it's a to-do list.

Severity: **High** = breaks functionality / data correctness · **Medium** = maintainability or robustness · **Low** = cleanup.

---

### 1. Graphing logic is duplicated across both files — Medium
- **Where:** `DATfixer.py` `create_graph` block (§3.4) and `DATgrapher.py` `create_pressure_graph` are near-identical (same time/pressure regexes, same base-time + midnight logic, same matplotlib calls).
- **Risk:** fixes/improvements must be made in two places; they will drift.
- **Fix:** extract a shared `plot_pressure(times, pressures, ...)` (and the line-parsing) into one module imported by both.

### 2. Binary format is hard-coded magic bytes with no validation — High
- **Where:** `DATfixer.py` — `0x05 0x00` + 8-byte double, and `0x08 0x00 0xXX 0x00` delimiter.
- **Risk:** if Denton firmware changes the log format, decoding silently produces garbage with no error. There's no signature/version check that the input is even a Denton `.DAT`.
- **Fix:** validate a known header/signature before decoding; fail fast with a clear message; consider documenting the format spec.

### 3. `plt.show()` blocks and needs a display — Medium
- **Where:** `DATgrapher.py` (`show_graph=True` default); also `DATfixer --graph` uses matplotlib.
- **Risk:** on a headless machine (no GUI), this errors or hangs.
- **Fix:** call `matplotlib.use("Agg")` when not displaying; document that interactive display needs a desktop session.

### 4. ASCII-only decode can corrupt data — Medium
- **Where:** both tools use `decode('ascii', errors='replace')`.
- **Risk:** any non-ASCII byte becomes a replacement char, which can mangle a line and throw off downstream parsing.
- **Fix:** consider latin-1 (lossless byte→char) for the text pass, or handle bytes directly.

### 5. Midnight/multi-day handling is a hack — Medium
- **Where:** both tools — timestamps are parsed as `%H:%M:%S` (no date); a single `+24h` correction patches one rollover.
- **Risk:** runs longer than 24h, or crossing more than one midnight, produce wrong time axes.
- **Fix:** carry the date if available, or detect multiple rollovers.

### 6. Comma-insertion tokenizer is heuristic and complex — Low/Medium
- **Where:** `DATfixer.py` `add_commas` block.
- **Risk:** edge cases can place commas oddly; the logic is hard to follow and untested.
- **Fix:** add unit tests with representative lines; simplify if possible.

### 7. "First bracketed value is pressure" assumption — Low
- **Where:** both graphers take the first `[...]` per line as pressure.
- **Risk:** if a line ever contains another bracketed value first, the wrong number is plotted.
- **Fix:** tag the pressure value explicitly during decode, or anchor the regex to its expected position.

### 8. `numpy` imported but effectively unused — Low
- **Where:** both files `import numpy as np` but do no real numpy work.
- **Fix:** drop the dependency, or use it where it would actually help.

### 9. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** add a tiny fixture `.DAT` with known measurements and a golden cleaned-text/graph output to lock in the decode and parsing.

---

## Suggested priority order
1. #2 format validation (prevents silent garbage) — High
2. #1 de-duplicate graphing — Medium
3. #3 headless-safe plotting — Medium
4. #9 add tests around the binary decode — Medium
5. Cleanup: #4, #5, #6, #7, #8 — Low/Medium
