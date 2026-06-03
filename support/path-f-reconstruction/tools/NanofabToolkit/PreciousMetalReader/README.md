# Path F Tool Reconstruction: 16 - NanofabToolkit / Precious Metal Reader

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this for precious metal monthly retrieval, CORES-style data access, GUI behavior, or packaging reconstruction.

## What This Tool Does

Desktop tool for retrieving and presenting precious metal usage data.

## Rebuild Focus

Preserve month retrieval behavior, API contracts, CSV/table output, GUI controls, and packaging entrypoints.

## External Inputs You Must Supply

- Approved data endpoint credentials
- month/date inputs
- GUI dependencies
- packaging assets

## Proof That The Rebuild Works

- A test retrieval returns the expected month data shape.
- The GUI presents results without blocking or crashing on empty months.
- Packaging includes required dependencies and assets.

## Common Ways To Get Lost

- Network/API failures need visible operator feedback.
- Do not embed tokens in source.

## Fixture And Validation Gap

Do not treat the proof checks above as complete until [`../../../FIXTURE-AND-EVIDENCE-INDEX.md`](../../../FIXTURE-AND-EVIDENCE-INDEX.md) or the rebuild evidence template names the sample inputs, hashes, expected outputs, screenshots, API responses, or acceptable substitutes used for this tool. If no canonical fixture exists, mark the proof partial and create one as part of the maintenance work.

## CORES Credential Contract Required

`auth.py`/`HSCCode` must be replaced by a documented external secret source before this tool is considered reconstructable. Record service IDs, request timeout policy, response shape, and expected CSV columns for one month.

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
| `NanofabToolkit/PreciousMetalReader/PreciousMetalReader.spec` | [`source-files/001-PreciousMetalReader__PreciousMetalReader.spec.md`](source-files/001-PreciousMetalReader__PreciousMetalReader.spec.md) | no | no |
| `NanofabToolkit/PreciousMetalReader/main.py` | [`source-files/002-PreciousMetalReader__main.py.md`](source-files/002-PreciousMetalReader__main.py.md) | no | no |
| `NanofabToolkit/PreciousMetalReader/requirements.txt` | [`source-files/003-PreciousMetalReader__requirements.txt.md`](source-files/003-PreciousMetalReader__requirements.txt.md) | no | no |
| `NanofabToolkit/PreciousMetalReader/src/RetrieveMonthsMetals.py` | [`source-files/004-PreciousMetalReader__src__RetrieveMonthsMetals.py.md`](source-files/004-PreciousMetalReader__src__RetrieveMonthsMetals.py.md) | no | no |
| `NanofabToolkit/PreciousMetalReader/src/gui.py` | [`source-files/005-PreciousMetalReader__src__gui.py.md`](source-files/005-PreciousMetalReader__src__gui.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
