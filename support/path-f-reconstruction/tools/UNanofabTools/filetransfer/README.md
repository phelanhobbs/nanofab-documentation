# Path F Tool Reconstruction: 03 - UNanofabTools / File Transfer Scripts

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this when a machine control PC stops uploading logs or a transfer path/account/key needs replacement.

## What This Tool Does

Windows and shell transfer scripts that move machine-controller files to the server.

## Rebuild Focus

Preserve source directories, destination paths, SSH/SCP behavior, Windows quoting, retry/error output, and account boundaries.

## External Inputs You Must Supply

- Machine control PC paths
- SSH key or service account approved for transfer
- server destination path
- network reachability

## Proof That The Rebuild Works

- A dry run or test file transfer reaches the expected server directory.
- Paths with spaces and missing source directories fail visibly.
- The recreated script does not depend on undocumented personal credentials.

## Common Ways To Get Lost

- Personal-account dependencies are not a long-term operational model.
- Windows quoting failures can look like authentication failures.

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
| `UNanofabTools/ALDTransfer.ps1` | [`source-files/001-ALDTransfer.ps1.md`](source-files/001-ALDTransfer.ps1.md) | no | no |
| `UNanofabTools/CTRFurnaceTransfer.bat` | [`source-files/002-CTRFurnaceTransfer.bat.md`](source-files/002-CTRFurnaceTransfer.bat.md) | no | no |
| `UNanofabTools/CTRFurnaceTransfer.ps1` | [`source-files/003-CTRFurnaceTransfer.ps1.md`](source-files/003-CTRFurnaceTransfer.ps1.md) | no | no |
| `UNanofabTools/Dent635Transfer.ps1` | [`source-files/004-Dent635Transfer.ps1.md`](source-files/004-Dent635Transfer.ps1.md) | no | no |
| `UNanofabTools/FileTransferSetup.md` | [`source-files/005-FileTransferSetup.md.md`](source-files/005-FileTransferSetup.md.md) | no | no |
| `UNanofabTools/FileTransferTemplate.ps1` | [`source-files/006-FileTransferTemplate.ps1.md`](source-files/006-FileTransferTemplate.ps1.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
