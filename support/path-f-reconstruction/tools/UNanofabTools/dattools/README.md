# Path F Tool Reconstruction: 06 - UNanofabTools / DAT Tools

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this when a raw Denton `.DAT` log needs decoding or a cleaned log needs a pressure graph.

## What This Tool Does

DATfixer and DATgrapher command-line tools for Denton 635 log conversion and plotting.

## Rebuild Focus

Preserve binary marker parsing, cleaned text format, timestamp extraction, pressure extraction, graph options, and CLI flags.

## External Inputs You Must Supply

- Representative Denton `.DAT` logs
- matplotlib backend
- local filesystem write permission

## Proof That The Rebuild Works

- A representative `.DAT` file produces the same cleaned text shape.
- A cleaned text file produces the expected pressure/time plot.
- Malformed or incomplete logs fail with a documented message.

## Common Ways To Get Lost

- DATfixer and DATgrapher duplicate parsing assumptions.
- Graph display behavior differs on headless hosts.

## Fixture And Validation Gap

Do not treat the proof checks above as complete until [`../../../FIXTURE-AND-EVIDENCE-INDEX.md`](../../../FIXTURE-AND-EVIDENCE-INDEX.md) or the rebuild evidence template names the sample inputs, hashes, expected outputs, screenshots, API responses, or acceptable substitutes used for this tool. If no canonical fixture exists, mark the proof partial and create one as part of the maintenance work.

## File-Format Evidence Required

A DAT rebuild needs representative raw and cleaned files. Record magic-byte assumptions, empty-file behavior, malformed-record behavior, and graph backend expectations before changing parser code.

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
| `UNanofabTools/DATInstructions.md` | [`source-files/001-DATInstructions.md.md`](source-files/001-DATInstructions.md.md) | no | no |
| `UNanofabTools/DATfixer.py` | [`source-files/002-DATfixer.py.md`](source-files/002-DATfixer.py.md) | no | no |
| `UNanofabTools/DATgrapher.py` | [`source-files/003-DATgrapher.py.md`](source-files/003-DATgrapher.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
