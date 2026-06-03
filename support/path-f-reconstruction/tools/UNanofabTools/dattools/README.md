# Path F Tool Reconstruction: 06 - UNanofabTools / DAT Tools

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## Folder Layout

- `README.md`: tool-level reconstruction contract and source index.
- `source-files/`: one reconstruction page per source file covered by this tool.
- `rehearsals/`: tool-local reconstruction drill instructions and any generated overflow pass files for this tool.

## Files Covered

| Source file | Reconstruction page | Dirty | Untracked |
|---|---|---:|---:|
| `UNanofabTools/DATInstructions.md` | [`source-files/001-DATInstructions.md.md`](source-files/001-DATInstructions.md.md) | no | no |
| `UNanofabTools/DATfixer.py` | [`source-files/002-DATfixer.py.md`](source-files/002-DATfixer.py.md) | no | no |
| `UNanofabTools/DATgrapher.py` | [`source-files/003-DATgrapher.py.md`](source-files/003-DATgrapher.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
