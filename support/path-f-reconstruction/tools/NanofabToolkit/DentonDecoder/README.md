# Path F Tool Reconstruction: 14 - NanofabToolkit / Denton Decoder

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this for GUI Denton conversion/viewing workflows distinct from command-line DATfixer/DATgrapher.

## What This Tool Does

Desktop Denton decoder and graphing tool.

## Rebuild Focus

Preserve decoder behavior, graphing behavior, GUI actions, package entrypoint, and PyInstaller hooks.

## External Inputs You Must Supply

- Representative Denton logs
- GUI dependencies
- packaging hooks/assets

## Proof That The Rebuild Works

- Known Denton input converts to the expected readable output.
- Graphs render without blocking or missing dependencies.
- The GUI and packaged executable launch successfully.

## Common Ways To Get Lost

- Do not confuse this GUI workflow with UNanofabTools command-line DAT tools.

## Fixture And Validation Gap

Do not treat the proof checks above as complete until [`../../../FIXTURE-AND-EVIDENCE-INDEX.md`](../../../FIXTURE-AND-EVIDENCE-INDEX.md) or the rebuild evidence template names the sample inputs, hashes, expected outputs, screenshots, API responses, or acceptable substitutes used for this tool. If no canonical fixture exists, mark the proof partial and create one as part of the maintenance work.

## Denton Input Contract Required

Record the byte/chunk assumptions, output column count, timestamp rollover behavior, and expected cleaned CSV shape for at least one representative `.dat` file.

## Folder Layout

- `README.md`: tool-level reconstruction contract and source index.
- `source-files/`: one reconstruction page per source file covered by this tool.
- `rehearsals/`: tool-local reconstruction drill instructions and any generated overflow pass files for this tool.

## Recommended Reading Order

1. Read this README and write a one-paragraph contract for the tool.
2. Open only the source-file pages needed for that contract.
3. For each edited or recreated file, complete the file's edge-case matrix.
4. Run the proof checks above before declaring the tool rebuilt.

## Files Covered

| Source file | Reconstruction page | Dirty | Untracked |
|---|---|---:|---:|
| `NanofabToolkit/DentonDecoder/DentonDecoder.spec` | [`source-files/001-DentonDecoder__DentonDecoder.spec.md`](source-files/001-DentonDecoder__DentonDecoder.spec.md) | no | no |
| `NanofabToolkit/DentonDecoder/main.py` | [`source-files/002-DentonDecoder__main.py.md`](source-files/002-DentonDecoder__main.py.md) | no | no |
| `NanofabToolkit/DentonDecoder/pyinstaller/hooks/hook-runtime.py` | [`source-files/003-DentonDecoder__pyinstaller__hooks__hook-runtime.py.md`](source-files/003-DentonDecoder__pyinstaller__hooks__hook-runtime.py.md) | no | no |
| `NanofabToolkit/DentonDecoder/requirements.txt` | [`source-files/004-DentonDecoder__requirements.txt.md`](source-files/004-DentonDecoder__requirements.txt.md) | no | no |
| `NanofabToolkit/DentonDecoder/src/DentonDecoder.py` | [`source-files/005-DentonDecoder__src__DentonDecoder.py.md`](source-files/005-DentonDecoder__src__DentonDecoder.py.md) | no | no |
| `NanofabToolkit/DentonDecoder/src/DentonGrapher.py` | [`source-files/006-DentonDecoder__src__DentonGrapher.py.md`](source-files/006-DentonDecoder__src__DentonGrapher.py.md) | no | no |
| `NanofabToolkit/DentonDecoder/src/gui.py` | [`source-files/007-DentonDecoder__src__gui.py.md`](source-files/007-DentonDecoder__src__gui.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
