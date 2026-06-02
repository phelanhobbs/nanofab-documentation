# PreciousMetalReader — Developer Documentation

Reference for the `PreciousMetalReader` desktop app: a Tkinter GUI that downloads month-of precious-metal usage records from the CORES `n8n` webhook and writes summarized CSVs. **Talks to CORES, not to the cleanroom server.** Bugs/tech debt: `known-issues/NanofabToolkit/PreciousMetalReader.md`.

## 1. Overview

| File | Role |
|------|------|
| `main.py` | Entry point. Configures logging (file + stdout), extends `sys.path` with `.` and `./src`, imports `PreciousMetalReaderGui`, builds a Tk root, runs the event loop with a top-level try/except surfacing errors via `messagebox`. |
| `src/RetrieveMonthsMetals.py` | `download_Metal(endpoint, month, year)` plus helpers (`daysinMonth`, `summarize_metal_charges`, `save_summary_to_csv`). Calls the CORES n8n webhook. |
| `src/gui.py` (`PreciousMetalReaderGui`) | The Tk UI: month/year picker, mode (specific vs all), machine + metal dropdowns, download action, progress/results text. |
| `src/assets/icon.ico` | Windowed executable icon. |
| `src/auth.py` (referenced as `from auth import HSCCode`) | Holds the CORES Bearer token. |

Dependencies: `requests`, `tkinter` (stdlib), `csv` (stdlib), `collections.defaultdict`, `logging`. Frozen with PyInstaller.

## 2. Upstream service

```
URL:  https://n8n.cores.utah.edu/webhook/line_item_batch_pull?service_ids=<id>&start_date=<YYYY-MM-DD>&end_date=<YYYY-MM-DD>
Auth: Authorization: Bearer <HSCCode>
Verb: GET; response is JSON
```

`HSCCode` is imported from `auth.py` (not committed). This is the **same n8n endpoint family** that `UNanofabTools/HSCDownloader.py` uses, but a different webhook path (`line_item_batch_pull` vs. `custom_form_data_dump`) and different service IDs.

`download_Metal("all", month, year)` iterates a hard-coded list of service IDs covering precious-metal charges across Denton 635 / Denton 18 / TMV (observed IDs roughly `768, 808–818`); `download_Metal(<id>, month, year)` pulls a single endpoint.

## 3. `main.py`

- `setup_logging()` resolves a base directory (uses `sys._MEIPASS`-aware logic for frozen executables), creates `logs/`, configures root logging with both a `FileHandler` (`precious_metal_reader.log`) and a `StreamHandler`.
- Extends `sys.path` for `.` and `./src` so frozen + dev runs both find `src/`.
- `from src.gui import PreciousMetalReaderGui` (with logged ImportError fallback).
- `main()` creates `tk.Tk()`, instantiates the GUI, enters `mainloop()`. Unhandled exceptions are logged and shown via `messagebox.showerror`.

## 4. `src/RetrieveMonthsMetals.py`

### 4.1 `daysinMonth(month, year) -> int`
Leap-year-aware day count for the requested month.

### 4.2 `download_Metal(endpoint, month, year) -> str | None`
- Resolves a download directory:
  - Frozen (`sys.frozen` and `sys._MEIPASS`): `os.path.dirname(sys.executable) / "downloads"`.
  - Dev mode: walks two levels up from `__file__` and uses `<project>/downloads/`.
- `endpoint == "all"`: iterates the embedded `[768, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818]` list, builds a `Bearer`-authed GET per ID with `start_date=YYYY-MM-01` and `end_date=YYYY-MM-<days>`, collects `response.json()` per endpoint, then concatenates (skipping endpoints that returned no data).
- Otherwise, calls a single endpoint with the same date span and writes a CSV named per (endpoint, month, year).
- Logs each request URL and status code.

### 4.3 `summarize_metal_charges(json_data)`, `save_summary_to_csv(...)`
Group the raw line items by metal/tool, sum charges, and write a CSV alongside the raw download.

## 5. `src/gui.py` — `PreciousMetalReaderGui`

- `root = tk.Tk(); title="Precious Metal Reader"; 800×600`.
- Top row: `Month` (Combobox of month names, derived from `calendar.month_name[1:]`), `Year` (text entry, defaults to current year).
- `download_option` radio: `"specific"` or `"all"`; `toggle_selection_mode()` enables/disables the machine and metal dropdowns.
- `machine_combo`: `("Denton635", "Denton18", "TMV")`; selecting one triggers `update_metal_options()` which populates `metal_combo` with the allowed metals for that machine.
- Download button invokes `download_Metal(...)`, then `summarize_metal_charges` and `save_summary_to_csv`. Logs and surfaces results.

(Confirm the precise widget set / event bindings against the live source when extending.)

## 6. Operational notes

- Logs to `logs/precious_metal_reader.log` (frozen) or `src/logs/...` (dev).
- Downloaded CSVs land in `downloads/` adjacent to the app.
- Internet access required; CORES authentication uses a Bearer token from `auth.py`.
- The app is read-only against CORES.

## 7. Maintenance / recommendations
- **Move `HSCCode`/Bearer out of `auth.py`** into env / OS keychain; rotate the token. It's a real credential.
- **Hard-coded service-ID map**: lift the `[768, 808…818]` list into a documented config / table (machine → metal → service_id) so re-numbering at CORES is one place to update.
- **Retry + timeout on `requests.get`**: today there's no `timeout=`, so a slow CORES can hang the UI.
- **Progress reporting for "all"**: looping ~12 endpoints can take a while; surface per-endpoint progress in the UI.
- **Document the PyInstaller build command** so a successor can rebuild the .exe.
- **Tests**: mock-based tests around `download_Metal` and the summarizer would lock in the CORES contract.

See the layman guide at `presentation/NanofabToolkit/PreciousMetalReader/README.md`. Related: `documentation/UNanofabTools/hscdownloader/README.md` (also a CORES n8n consumer, different webhook).
