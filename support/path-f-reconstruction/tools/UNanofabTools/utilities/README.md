# Path F Tool Reconstruction: 07 - UNanofabTools / Utilities

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this for one-off helper rebuilds or to decide whether a helper should be retained, replaced, or retired.

## What This Tool Does

Standalone helpers including peak counting, certificate conversion, SSH fetch helper, chem DB init, and unfinished monitor storage.

## Rebuild Focus

Preserve CLI flags, file formats, certificate output expectations, SSH behavior, database bootstrap behavior, and explicit unfinished status.

## External Inputs You Must Supply

- Input data files
- PFX/certificate password from secure storage
- SSH host/key material
- database credentials

## Proof That The Rebuild Works

- Peak counting returns the same cycle count on known input.
- Certificate conversion writes files in the expected format without exposing passwords.
- SSH fetch behavior is either recreated as a personal dev helper or replaced by a documented safer flow.

## Common Ways To Get Lost

- Do not promote personal helper credentials to production.
- Some files are intentionally stubs or one-off scripts.

## Fixture And Validation Gap

Do not treat the proof checks above as complete until [`../../../FIXTURE-AND-EVIDENCE-INDEX.md`](../../../FIXTURE-AND-EVIDENCE-INDEX.md) or the rebuild evidence template names the sample inputs, hashes, expected outputs, screenshots, API responses, or acceptable substitutes used for this tool. If no canonical fixture exists, mark the proof partial and create one as part of the maintenance work.

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
| `UNanofabTools/NMonStore.py` | [`source-files/001-NMonStore.py.md`](source-files/001-NMonStore.py.md) | no | no |
| `UNanofabTools/fetch_ssh.py` | [`source-files/002-fetch_ssh.py.md`](source-files/002-fetch_ssh.py.md) | no | no |
| `UNanofabTools/gencert.py` | [`source-files/003-gencert.py.md`](source-files/003-gencert.py.md) | no | no |
| `UNanofabTools/init_chem_db.py` | [`source-files/004-init_chem_db.py.md`](source-files/004-init_chem_db.py.md) | no | no |
| `UNanofabTools/peakCount.md` | [`source-files/005-peakCount.md.md`](source-files/005-peakCount.md.md) | no | no |
| `UNanofabTools/peakCount.py` | [`source-files/006-peakCount.py.md`](source-files/006-peakCount.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
