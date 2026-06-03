# Path F Tool Reconstruction: 07 - UNanofabTools / Utilities

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## Folder Layout

- `README.md`: tool-level reconstruction contract and source index.
- `source-files/`: one reconstruction page per source file covered by this tool.
- `rehearsals/`: tool-local reconstruction drill instructions and any generated overflow pass files for this tool.

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
