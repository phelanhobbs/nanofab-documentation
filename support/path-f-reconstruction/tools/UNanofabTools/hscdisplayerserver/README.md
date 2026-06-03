# Path F Tool Reconstruction: 08 - UNanofabTools / HSC Displayer Server Legacy

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this when you find old server behavior that predates the Flask app or need to compare a legacy route to the modern implementation.

## What This Tool Does

Legacy monolithic HSC displayer server retained for historical reference.

## Rebuild Focus

Preserve only enough behavior to understand migration history unless an explicit legacy rescue is required.

## External Inputs You Must Supply

- Historical HSCDATA files
- legacy server host assumptions

## Proof That The Rebuild Works

- A maintainer can identify which behavior moved to the Flask server.
- Any recreated legacy behavior is isolated from the production Flask path.

## Common Ways To Get Lost

- Do not revive legacy server code as the primary path without a written migration reason.

## Fixture And Validation Gap

Do not treat the proof checks above as complete until [`../../../FIXTURE-AND-EVIDENCE-INDEX.md`](../../../FIXTURE-AND-EVIDENCE-INDEX.md) or the rebuild evidence template names the sample inputs, hashes, expected outputs, screenshots, API responses, or acceptable substitutes used for this tool. If no canonical fixture exists, mark the proof partial and create one as part of the maintenance work.

## Legacy Reconstruction Limit

This is legacy context. Do not revive it as production without first proving which behavior is absent from Flask and writing a migration reason. If redaction removes behavior-critical password or reset logic, treat that section as non-reconstructable from Path F alone and use source/live evidence if available.

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
| `UNanofabTools/HSCDisplayerServer.py` | [`source-files/001-HSCDisplayerServer.py.md`](source-files/001-HSCDisplayerServer.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
