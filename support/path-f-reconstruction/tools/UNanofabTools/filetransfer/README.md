# Path F Tool Reconstruction: 03 - UNanofabTools / File Transfer Scripts

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## Folder Layout

- `README.md`: tool-level reconstruction contract and source index.
- `source-files/`: one reconstruction page per source file covered by this tool.
- `rehearsals/`: tool-local reconstruction drill instructions and any generated overflow pass files for this tool.

## Files Covered

| Source file | Reconstruction page | Dirty | Untracked |
|---|---|---:|---:|
| `UNanofabTools/ALDTransfer.ps1` | [`source-files/001-ALDTransfer.ps1.md`](source-files/001-ALDTransfer.ps1.md) | no | no |
| `UNanofabTools/CTRFurnaceTransfer.bat` | [`source-files/002-CTRFurnaceTransfer.bat.md`](source-files/002-CTRFurnaceTransfer.bat.md) | no | no |
| `UNanofabTools/CTRFurnaceTransfer.ps1` | [`source-files/003-CTRFurnaceTransfer.ps1.md`](source-files/003-CTRFurnaceTransfer.ps1.md) | no | no |
| `UNanofabTools/Dent635Transfer.ps1` | [`source-files/004-Dent635Transfer.ps1.md`](source-files/004-Dent635Transfer.ps1.md) | no | no |
| `UNanofabTools/FileTransferSetup.md` | [`source-files/005-FileTransferSetup.md.md`](source-files/005-FileTransferSetup.md.md) | no | no |
| `UNanofabTools/FileTransferTemplate.ps1` | [`source-files/006-FileTransferTemplate.ps1.md`](source-files/006-FileTransferTemplate.ps1.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
