# Path F Tool Reconstruction: 15 - NanofabToolkit / Paralyne Reader

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this for Parylene log viewing, time-series parsing, GUI behavior, or packaging reconstruction.

## What This Tool Does

Desktop Parylene analog log reader and plotting GUI.

## Rebuild Focus

Preserve log parsing, GUI state, plotting, file selection, error messages, and package assets.

## External Inputs You Must Supply

- Representative Parylene logs
- GUI dependencies
- packaging icon/assets

## Proof That The Rebuild Works

- Known Parylene logs load and plot correctly.
- Malformed logs produce useful errors.
- The GUI launches from source and packaged form.

## Common Ways To Get Lost

- Local logs and generated artifacts should not become source-of-truth documentation.

## Fixture And Validation Gap

Do not treat the proof checks above as complete until [`../../../FIXTURE-AND-EVIDENCE-INDEX.md`](../../../FIXTURE-AND-EVIDENCE-INDEX.md) or the rebuild evidence template names the sample inputs, hashes, expected outputs, screenshots, API responses, or acceptable substitutes used for this tool. If no canonical fixture exists, mark the proof partial and create one as part of the maintenance work.

## Network And GUI Contract Required

Record API availability, TLS policy, representative file list response, malformed-log behavior, GUI selection workflow, and expected plot state before accepting a rebuild.

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
| `NanofabToolkit/ParalyneReader/ParalyneReader.spec` | [`source-files/001-ParalyneReader__ParalyneReader.spec.md`](source-files/001-ParalyneReader__ParalyneReader.spec.md) | no | no |
| `NanofabToolkit/ParalyneReader/main.py` | [`source-files/002-ParalyneReader__main.py.md`](source-files/002-ParalyneReader__main.py.md) | no | no |
| `NanofabToolkit/ParalyneReader/requirements.txt` | [`source-files/003-ParalyneReader__requirements.txt.md`](source-files/003-ParalyneReader__requirements.txt.md) | no | no |
| `NanofabToolkit/ParalyneReader/src/ParalyneReader.py` | [`source-files/004-ParalyneReader__src__ParalyneReader.py.md`](source-files/004-ParalyneReader__src__ParalyneReader.py.md) | no | no |
| `NanofabToolkit/ParalyneReader/src/assets/icon.py` | [`source-files/005-ParalyneReader__src__assets__icon.py.md`](source-files/005-ParalyneReader__src__assets__icon.py.md) | no | no |
| `NanofabToolkit/ParalyneReader/src/gui.py` | [`source-files/006-ParalyneReader__src__gui.py.md`](source-files/006-ParalyneReader__src__gui.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
