# Path F Tool Reconstruction: 00 - UNanofabTools / Repo Overview And Entrypoints

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## Folder Layout

- `README.md`: tool-level reconstruction contract and source index.
- `source-files/`: one reconstruction page per source file covered by this tool.
- `rehearsals/`: tool-local reconstruction drill instructions and any generated overflow pass files for this tool.

## Files Covered

| Source file | Reconstruction page | Dirty | Untracked |
|---|---|---:|---:|
| `UNanofabTools/.gitignore` | [`source-files/001-.gitignore.md`](source-files/001-.gitignore.md) | no | no |
| `UNanofabTools/INTEGRATION_SUMMARY.md` | [`source-files/002-INTEGRATION_SUMMARY.md.md`](source-files/002-INTEGRATION_SUMMARY.md.md) | no | no |
| `UNanofabTools/QUICK_START.md` | [`source-files/003-QUICK_START.md.md`](source-files/003-QUICK_START.md.md) | no | no |
| `UNanofabTools/REFACTORING_SUMMARY.md` | [`source-files/004-REFACTORING_SUMMARY.md.md`](source-files/004-REFACTORING_SUMMARY.md.md) | no | no |
| `UNanofabTools/SETUP_GUIDE.md` | [`source-files/005-SETUP_GUIDE.md.md`](source-files/005-SETUP_GUIDE.md.md) | no | no |
| `UNanofabTools/START_HERE.md` | [`source-files/006-START_HERE.md.md`](source-files/006-START_HERE.md.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
