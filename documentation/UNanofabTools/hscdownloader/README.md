# HSC Downloader — Developer Documentation

Reference for `HSCDownloader.py`: the scheduled ETL that pulls per-machine form data from the CORES n8n webhook and writes the `HSCDATA` CSVs the machine portal renders. Bugs/tech debt: `known-issues/UNanofabTools/hscdownloader.md`.

## 1. Role in the system

```
CORES n8n webhook ──HTTP GET (Bearer token)──► HSCDownloader.py
   per service_id                                   │ pandas reshape
                                                    ▼
                              HSCDATA/<Machine>_DataCollection.csv  (full)
                              HSCDATA/small_<Machine>_DataCollection.csv  (trimmed)
                                                    │
                                                    ▼
                  Flask machines blueprint / legacy server read small_*.csv → tables + graphs
```

HSCDownloader is the **upstream feeder** for the machine pages. It does not touch the application database; its only outputs are CSV files in `DATA_DIR`.

## 2. Configuration (top of file)

```python
DATA_DIR = os.path.join(script_dir, 'HSCDATA')
AUTH     = 'Bearer ' + os.environ['CORES_TOKEN']   # CORES API token — read from .env since 2026-06-22 (commit 4175995); see known-issues
URLBASE  = 'https://n8n.cores.utah.edu/webhook/custom_form_data_dump?service_ids='
```

Uses `requests`, `pandas`, `numpy`, `schedule`, plus `signal`/`sys` for graceful shutdown.

## 3. Core functions

- `downloadFile(url) -> DataFrame`
  GETs `URLBASE + <service_id>` with `Authorization: Bearer ...`, `json.loads` the response, and `pd.json_normalize`s it into a DataFrame.
- `ensureExists(fileName)`
  Guarantees both `HSCDATA/<fileName>` and `HSCDATA/small_<fileName>` exist (creates empty files if not).
- `retrieveData(deviceName) -> DataFrame`
  Maps a machine name to its CORES **service_id** and calls `downloadFile`. This is the master machine→ID table (e.g. ALD, Ebeam, MOCVD, Parylene, PECVD, Denton635, Denton18, TMV, DRIE, Isotropic, Plasmalab, PlasmaTherm, Technics, CleanOx, DopedOx, LTO, Nitride, Poly, Allwin → numeric IDs `761`…`845`). A couple are annotated `CURRENTLY HAS NO DATA`. A machine can be present in `retrieveData` without being called by the scheduled `save()` loop.
- `shortenStr(fullStr, val)`, `combineCells(cell1, cell2)`
  String/column helpers used while reshaping.
- `save<Machine>()` — one per implemented tool (`saveALD`, `saveEbeam`, `saveMOCVD`, `saveParylene`, `savePECVD`, `saveDenton635`, `saveDenton18`, `saveTMV`, `saveDRIE`, `saveIsotropic`, `savePlasmalab`, `savePlasmaTherm`, `saveTechnics`, `saveCleanOx`, `saveDopedOx`, `saveLTO`, `saveNitride`, `savePoly`, `saveAllwin`)
  Each: `retrieveData` → select/rename/format the columns relevant to that tool → write the full CSV and a `small_` CSV into `DATA_DIR`. The `small_<Machine>_DataCollection.csv` files are what the portal reads.
- `save()`
  Orchestrator that calls the active `save<Machine>()` functions. `savePECVD()` is defined but currently commented out in `save()`, so PECVD data is not refreshed by the scheduled loop unless that line is re-enabled.
- `graceful_exit(signum, frame)` + `runForever()`
  Signal-handled main loop using the `schedule` library to run `save()` periodically until terminated cleanly.

## 4. The machine → service_id map

The numeric `service_ids` in `retrieveData` are the contract with CORES. If CORES changes a tool's ID, that machine's data silently stops updating. Keep this map documented and in sync with CORES. (Service IDs observed in the source span ~`761`–`845`.)

## 5. Output contract with the portal

The portal expects `HSCDATA/small_<Machine>_DataCollection.csv` with the columns each machine page graphs (e.g. ALD: `Film Deposited`, `Deposition Mode`, `Chuck Temperature (C)`, `Measured Thickness (nm)`, `Number of Cycles`, plus the temperature columns the page plots). Changing a `save<Machine>()` function's output columns can break the corresponding machine page or its graphs — keep them aligned with `app/services/data_service.py` and the `machines` blueprint.

## 6. Operational notes

- Runs as a long-lived process (a service / scheduled host), driven by `schedule` + `runForever`.
- Designed to stop cleanly on signal (`graceful_exit`).
- Network/auth failures: `downloadFile` does minimal error handling — a CORES outage or token rotation will surface as exceptions / empty data. Add retry/alerting if reliability matters.
- It writes to the same `HSCDATA` directory the server reads; ensure both run with consistent paths/permissions.

## 7. Maintenance / recommendations

- **Rotate the Bearer token.** It was moved out of source into `.env` / `os.environ['CORES_TOKEN']` (2026-06-22, commit `4175995`), but the old value is unchanged and still in git history, so rotation with the CORES admin is still required. See known-issues.
- **Centralize the machine→service_id map** (a dict/table) instead of a long if/elif in `retrieveData`; document each ID.
- **Reduce per-machine duplication**: the `save<Machine>()` functions repeat a lot of structure; a config-driven approach (per-machine column spec) would shrink the file dramatically.
- **Add retries + logging/alerting** around `downloadFile` so silent data staleness is detected.
- **Finish `changedData()`** (marked `#TODO`) if change-detection/incremental updates are wanted.
- **Confirm whether PECVD should run**: `savePECVD()` exists, but `save()` currently comments it out. Re-enable only after checking the CORES response and expected portal columns.
- Keep output columns in lockstep with the portal's expectations (§5).

## 8. Relationship to other tools

- Feeds the **flaskserver** (and legacy **hscdisplayerserver**) machine pages via `HSCDATA`.
- Talks to the **same CORES n8n system** as `NanofabToolkit/PreciousMetalReader` (different webhook/service IDs).

See the layman guide at `presentation/UNanofabTools/hscdownloader/README.md`.
