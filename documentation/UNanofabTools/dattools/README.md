# DAT Tools — Developer Documentation

Formal reference for `DATfixer.py` and `DATgrapher.py`: two standalone command-line utilities that decode and plot Denton 635 sputter-system event logs. Assumes Python familiarity. Bugs and tech debt are tracked separately in `known-issues/UNanofabTools/dattools.md`.

## 1. Overview

| Tool | Input | Output | Purpose |
|------|-------|--------|---------|
| `DATfixer.py` | Denton 635 binary `.DAT` log | cleaned `.txt` (+ optional `.png`) | Decode the proprietary binary log into human/CSV-readable text |
| `DATgrapher.py` | cleaned `.txt` (DATfixer output) | on-screen graph and/or `.png` | Plot pressure vs. time from a cleaned log |

Both are invoked from the shell (PowerShell on the lab Windows hosts), operate on local files, and are independent of the Flask server. Typical pipeline: `DATfixer raw.DAT → cleaned.txt → DATgrapher cleaned.txt → graph`. `DATfixer --graph` short-circuits this by graphing directly.

## 2. Dependencies

- Python 3.x
- `matplotlib` (plotting)
- `numpy` (imported in both files; only incidentally used — see known-issues)
- Standard library: `os`, `pathlib`, `argparse`, `re`, `struct`, `datetime`

Install: `pip install matplotlib numpy`.

## 3. `DATfixer.py`

### 3.1 Entry points

- `clean_event_log(input_file, output_file=None, preserve_formatting=True, pretty_format=True, add_commas=True, create_graph=False) -> bool`
- `main()` — `DATfixer.py` argparse CLI wrapper.

### 3.2 The `.DAT` binary format (reverse-engineered)

`clean_event_log` reads the file as raw bytes and walks it once, recognizing two byte patterns:

1. **Measurement value** — the 2-byte marker `0x05 0x00` followed by an 8-byte little-endian IEEE-754 double:
   ```python
   pattern = b'\x05\x00'
   double_value = struct.unpack('<d', double_bytes)[0]
   modified_content.extend(pattern)
   modified_content.extend(f" [{double_value:.12f}]".encode('ascii'))
   ```
   The decoded double is emitted in brackets with 12 decimal places, e.g. `[0.000000486000]`. This bracketed value is the chamber pressure that downstream graphing extracts.

2. **Field delimiter** — the 4-byte pattern `0x08 0x00 0xXX 0x00` (any third byte) is replaced with a comma:
   ```python
   elif (cleaned_content[position]   == 0x08 and
         cleaned_content[position+1] == 0x00 and
         cleaned_content[position+3] == 0x00):
       modified_content.extend(b',')
       position += 4
   ```

Bytes matching neither pattern are copied through.

> These magic-byte assumptions are the brittle core of the tool; they are not validated against any header or version. See known-issues.

### 3.3 Processing pipeline (order matters)

1. **Decode pass** — the byte walk above (values → brackets, delimiters → commas).
2. **Control-character strip** — remove bytes `< 32` and `127` (DEL), *except* those in `preserve_chars`. With `preserve_formatting=True` (default) the preserved set is `[9, 10, 13]` (tab, LF, CR); `--strict` empties it.
3. **Pretty formatting** (`pretty_format`, default on) — a regex inserts a newline before each `HH:MM:SS` timestamp not already at line start:
   ```python
   time_pattern = re.compile(br'(\d{2}:\d{2}:\d{2})')
   ```
4. **Comma insertion** (`add_commas`, default on) — the content is decoded to ASCII (`errors='replace'`) and tokenized with a named-group regex into `timestamp | bracketed | word | number | whitespace | other`. The tokens are re-joined with commas inserted after `timestamp/bracketed/word/number` tokens (with guards to avoid double commas and to skip the `number` + `.` case). Final `replace(',,', ',')` cleanup.
5. **Optional graph** (`create_graph`) — see §3.4.
6. **Write** — the result is written as bytes to `output_file`, and a summary (bytes removed, percentage) is printed.

### 3.4 Optional graphing (`--graph`)

If `create_graph=True`, the cleaned text is parsed line-by-line:
- `time_regex = (\d{2}:\d{2}:\d{2})` extracts a timestamp; the first timestamp becomes `base_time`.
- `pressure_regex = \[([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\]` extracts the first bracketed value as pressure.
- `time_delta = (time_obj - base_time).total_seconds()`; a `+ 24*60*60` correction handles a single midnight rollover.
- matplotlib renders pressure vs. seconds-since-start, saved as `<output>.png` (scientific y-axis notation, grid on). A warning prints if `< 10` points were found.

**This graphing block is duplicated almost verbatim in `DATgrapher.py`** (see known-issues #1).

### 3.5 Output naming

If `output_file` is omitted: `input.with_stem(f"{stem}_cleaned").with_suffix('.txt')` → `Foo.DAT` becomes `Foo_cleaned.txt`.

### 3.6 CLI reference

```
python DATfixer.py [-h] [-o OUTPUT] [--strict] [--raw] [--no-commas] [--graph] input_file
```

| Flag | Maps to | Effect |
|------|---------|--------|
| `input_file` | `input_file` | Required. Path to the `.DAT`. |
| `-o, --output` | `output_file` | Output path override. |
| `--strict` | `preserve_formatting=False` | Strip newlines/tabs too. |
| `--raw` | `pretty_format=False` | Skip timestamp-newline formatting. |
| `--no-commas` | `add_commas=False` | Skip comma insertion. |
| `--graph` | `create_graph=True` | Also emit a `.png` graph. |

Returns `True` on success, `False` on exception (errors are caught and printed, not raised).

## 4. `DATgrapher.py`

### 4.1 Entry points

- `create_pressure_graph(input_file, output_file=None, show_graph=True, log_scale=False) -> bool`
- `main()` — `DATgrapher.py` argparse CLI wrapper.

### 4.2 Behavior

Reads a cleaned text file (`errors='replace'`) and applies the same time/pressure regex extraction as §3.4:
- Timestamp `(\d{2}:\d{2}:\d{2})`, first becomes `base_time`.
- Pressure `\[([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\]`, first bracketed value per line.
- Builds `times` (seconds since start, with midnight rollover correction) and `pressures`.

Renders with matplotlib:
- Title includes the input stem.
- `--log` → `ax.set_yscale('log')`; otherwise scientific-notation y-axis.
- `show_graph=True` → `plt.show()` (blocking, needs a display); else `plt.close()`.
- Saves to `output_file` if provided.
- Returns `False` (and prints) if no valid data; warns if `< 10` points.

### 4.3 CLI reference

```
python DATgrapher.py [-h] [-o OUTPUT] [--no-display] [--log] input_file
```

| Flag | Maps to | Effect |
|------|---------|--------|
| `input_file` | `input_file` | Required. Path to the cleaned `.txt`. |
| `-o, --output` | `output_file` | Save graph to this path. |
| `--no-display` | `show_graph=False` | Don't open a window. If no `-o`, defaults output to `input.with_suffix('.png')`. |
| `--log` | `log_scale=True` | Logarithmic pressure axis. |

## 5. Data contract between the two tools

`DATgrapher` depends on `DATfixer`'s output shape — specifically that each data line contains a `HH:MM:SS` timestamp and that the **first** `[...]` bracketed value on the line is the pressure. Any change to DATfixer's bracket emission (§3.2) or pretty-formatting (§3.3) can silently break DATgrapher's extraction. Keep these two regexes in sync:

```
time:     (\d{2}:\d{2}:\d{2})
pressure: \[([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\]
```

## 6. Extending / maintaining

- **Shared graphing**: factor §3.4 / §4.2 into a single module imported by both tools (eliminates the duplication in known-issues #1).
- **Format robustness**: add a guard that the input begins with the expected Denton signature before decoding; fail fast with a clear message otherwise.
- **Headless safety**: prefer `matplotlib.use("Agg")` when `--no-display`/`--graph` to avoid display-backend errors on servers.
- **Multi-day runs**: the `+24h` single-rollover hack (§3.4) won't handle runs > 24h or multiple midnights; carry a full date if that's ever needed.
- **Testing**: there are no tests. A small fixture `.DAT` (a few known measurements) plus golden cleaned-text output would lock in the binary decode.

## 7. File map

```
DATfixer.py        decode .DAT → .txt (+ optional .png)
DATgrapher.py      cleaned .txt → graph
DATInstructions.md original end-user instructions (in the repo root)
```

See also the layman guide at `presentation/UNanofabTools/dattools/README.md` and the issues list at `known-issues/UNanofabTools/dattools.md`.
