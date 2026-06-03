# Path F Tool Reconstruction: 02 - UNanofabTools / HSC Downloader

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this when machine pages stop updating, service IDs change, CORES changes payloads, or HSCDATA CSVs need to be recreated.

## What This Tool Does

CORES n8n data downloader that writes HSCDATA CSVs consumed by the machine portal.

## Rebuild Focus

Preserve the bearer-authenticated CORES calls, machine-to-service-ID mapping, per-machine CSV transforms, scheduler loop, and HSCDATA output file names.

## External Inputs You Must Supply

- CORES bearer token from secure storage
- CORES service IDs
- HSCDATA directory permissions
- network access to n8n

## Proof That The Rebuild Works

- A test CORES response can be normalized into the expected full and `small_` CSV files.
- Every active `save<Machine>()` path writes the expected columns.
- The Flask machines page can read the recreated `small_` files.

## Common Ways To Get Lost

- A rotated token looks like stale machine data.
- Changing CSV columns can silently break graph rendering.

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
| `UNanofabTools/HSCDownloader.py` | [`source-files/001-HSCDownloader.py.md`](source-files/001-HSCDownloader.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
