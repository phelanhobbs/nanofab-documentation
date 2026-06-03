# Minimum Acceptable Full Path E - Module 13: HSCDownloader

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-13-hscdownloader.md

# Module 13 - HSCDownloader And CORES Data

## Goal

The maintainer understands `HSCDownloader.py`, where it lives, what it pulls, what it writes, how it runs today, and what risks belong in the maintenance plan.

## Required Screen

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx` (repo path: presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx)
- `presentation/UNanofabTools/hscdownloader/README.md` (repo path: presentation/UNanofabTools/hscdownloader/README.md)
- `documentation/UNanofabTools/hscdownloader/README.md` (repo path: documentation/UNanofabTools/hscdownloader/README.md)
- `known-issues/UNanofabTools/hscdownloader.md` (repo path: known-issues/UNanofabTools/hscdownloader.md)

## Verbatim Script

READ ALOUD:

"`HSCDownloader.py` is the CORES to `HSCDATA` supply line. It pulls machine usage data from the CORES/n8n side and writes CSV files that the website displays. If the downloader stops, the website may still be up, but machine data can become stale."

SHOW:

Open `HSC-Downloader.pptx`.

READ ALOUD:

"The first fact to preserve is location. The production downloader is not in a separate `~/HSCDownloader` directory. `HSCDownloader.py` lives in the same production install directory as `run.py`: `/home/phelan/server/UNanofabTools/`. Any instruction saying to `cd ~/HSCDownloader` is stale."

"The second fact is supervision. The downloader currently runs inside the `downloader` tmux session, not systemd. That means it has the same silent-failure and reboot risks as the Flask app."

## Source Demo

DO:

Show:

```text
../UNanofabTools/HSCDownloader.py
documentation/UNanofabTools/hscdownloader/README.md
known-issues/UNanofabTools/hscdownloader.md
```

DO:

Run:

```sh
rg -n "save|CORES|HSCDATA|requests|Bearer|time|schedule|while" ../UNanofabTools/HSCDownloader.py documentation/UNanofabTools/hscdownloader/README.md known-issues/UNanofabTools/hscdownloader.md
```

READ ALOUD:

"This search connects downloader behavior to docs and known issues. It should reveal where requests are made, where data is saved, how time or scheduling is handled, and whether any secret-bearing patterns need attention."

## Risk Frame

READ ALOUD:

"The downloader risks are operational and security-related. Operationally, it should be supervised, logged, monitored, and checked for freshness. Security-wise, any token or credential used to call CORES or n8n must not be hard-coded in source long term. It should live in protected configuration and be rotated if exposed."

"A maintainer should know how to answer: Is the downloader running? When did it last write `HSCDATA`? What happens if CORES is down? Where are errors logged? Is the credential protected? How would we restart it? How would we migrate it to systemd?"

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What does `HSCDownloader.py` do? | Pulls CORES/n8n machine usage data and writes CSV outputs used by the website. |
| Where does it live in production? | `/home/phelan/server/UNanofabTools/`, beside `run.py`. |
| What tmux session owns it today? | `downloader`. |
| What data tree does it write? | `HSCDATA`. |
| Why can the website be up while CORES data is stale? | nginx/Flask can be healthy while the downloader has stopped, errored, or stopped writing fresh CSVs. |
| What is the reliability improvement for the downloader? | Move it from tmux-only operation to a supervised service with restart/logging/health checks, such as systemd. |
| What is the secret-handling improvement for the downloader? | Move credentials/tokens out of source into protected config and rotate any exposed values. |

REQUIRE:

The maintainer can locate `HSCDownloader.py`, explain its data product, and describe how to check whether data is fresh.

## Stop Point

STOP POINT:

Stop here if the maintainer says there is a separate production `~/HSCDownloader` install. Correct the path and revisit the live-server facts.


# Expanded Module 13: HSCDownloader

READ ALOUD:

This expanded section revisits Module 13, HSCDownloader. The focus is CORES ingestion, HSCDATA freshness, credentials, and supervision. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 13

READ ALOUD:

We are now doing the orientation pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention CORES ingestion, HSCDATA freshness, credentials, and supervision. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 13

READ ALOUD:

We are now doing the evidence pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention CORES ingestion, HSCDATA freshness, credentials, and supervision. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Module Documentation Corpus



# Read-Aloud Documentation Corpus: documentation/UNanofabTools/hscdownloader/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

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
AUTH     = 'Bearer <redacted-cores-bearer-token>'        # CORES API token (hard-coded — see known-issues)
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

- **Move the Bearer token out of source** into an environment variable / `.env` (it's currently committed in cleartext). See known-issues.
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


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/hscdownloader.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# HSC Downloader — Known Issues & Technical Debt

Working list for `HSCDownloader.py`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = security / data correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. CORES API token hard-coded in source — High (security)
- **Where:** `AUTH = 'Bearer <redacted-cores-bearer-token>'`.
- **Risk:** a live credential to the university records system is committed in cleartext; anyone with repo access has it.
- **Fix:** move it to an environment variable / `.env`; rotate the token.

### 2. Minimal error handling on downloads — Medium
- **Where:** `downloadFile` does `json.loads(requests.get(...).text)` with no status check, timeout, or retry.
- **Risk:** a CORES outage, slow response, or token rotation throws or yields empty data; machine pages silently go stale.
- **Fix:** check HTTP status, add timeouts + retries, and log/alert on failure.

### 3. No staleness detection / alerting — Medium
- **Where:** the scheduled `save()` loop.
- **Risk:** if downloads start failing, nobody is notified; the website quietly shows old data.
- **Fix:** record last-successful-update per machine; alert if a machine hasn't updated in N cycles.

### 4. Machine→service_id map is brittle and buried — Medium
- **Where:** `retrieveData` is a long if/elif mapping names to numeric IDs (`761`…`845`).
- **Risk:** if CORES renumbers a service, that machine silently stops updating; the mapping is hard to audit.
- **Fix:** lift it into a documented dict/table; validate IDs at startup.

### 5. Heavy per-machine duplication — Medium
- **Where:** ~19 `save<Machine>()` functions repeat the same download/reshape/write structure.
- **Risk:** changes must be made many times; easy to let machines drift apart.
- **Fix:** drive formatting from a per-machine column spec; collapse to one generic save routine.

### 6. Output columns coupled to the portal with no contract test — Medium
- **Where:** `small_<Machine>_DataCollection.csv` columns must match what `data_service.py` / the machine pages expect.
- **Risk:** editing a `save<Machine>()` function can silently break a machine page's table or graph.
- **Fix:** a small test asserting each `small_` CSV has the columns the portal graphs.

### 7. `changedData()` is an unfinished TODO — Low
- **Where:** stubbed with `#TODO`.
- **Risk:** no incremental/change-aware updates; every cycle re-pulls and rewrites everything.
- **Fix:** finish it (compare new vs. existing) or remove it.

### 8. `breakLoop` / loop-control leftovers — Low
- **Where:** module-level `breakLoop = 0` and related control flow.
- **Fix:** clean up unused control variables; rely on the signal-based `graceful_exit`.

### 9. Some machines flagged "CURRENTLY HAS NO DATA" — Low (context)
- **Where:** comments in `retrieveData` (e.g. service IDs `844`, `845`).
- **Note:** expected empty sources, not bugs; revisit if those tools start producing data.

### 10. `savePECVD()` is implemented but not scheduled — Low/Medium
- **Where:** `savePECVD()` exists, but the `save()` orchestrator comments out the call.
- **Risk:** maintainers may assume PECVD is refreshed because the function and service-id mapping exist, while the scheduled loop never writes `small_PECVD_DataCollection.csv`.
- **Fix:** confirm whether PECVD should be active. If yes, re-enable the call and add a portal-column contract check; if no, keep it documented as intentionally disabled.

---

## Suggested priority order
1. #1 move the CORES token out of source + rotate — High
2. #2 + #3 robust downloads + staleness alerting — Medium
3. #4 + #5 centralize the machine map and de-duplicate save functions — Medium
4. #6 add a portal-column contract test — Medium
5. #7, #8, #9, #10 cleanup / activation decision — Low
