# Path F Tool Reconstruction: 12 - NanofabToolkit / Particle Sensor

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this for maintained particle desktop GUI behavior, API processing, packaging, or current-vs-historical particle data workflows.

## What This Tool Does

Canonical desktop particle sensor viewer and API client.

## Rebuild Focus

Preserve GUI layout, API client behavior, data processing, room map semantics, package entrypoint, and environment data display.

## External Inputs You Must Supply

- Particle API URL
- TLS/certificate behavior
- PyQt/matplotlib dependencies
- packaging assets

## Proof That The Rebuild Works

- The GUI launches from a clean environment.
- Current and historical API responses render with the expected rooms, tables, and charts.
- Packaging inputs still produce an executable with the expected assets.

## Common Ways To Get Lost

- Keep API processing and GUI copies synchronized.
- Timezone handling is a known risk area.

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
| `NanofabToolkit/ParticleSensor/INTEGRATION_SUMMARY.md` | [`source-files/001-ParticleSensor__INTEGRATION_SUMMARY.md.md`](source-files/001-ParticleSensor__INTEGRATION_SUMMARY.md.md) | no | no |
| `NanofabToolkit/ParticleSensor/ParticleSensor.spec` | [`source-files/002-ParticleSensor__ParticleSensor.spec.md`](source-files/002-ParticleSensor__ParticleSensor.spec.md) | no | no |
| `NanofabToolkit/ParticleSensor/main.py` | [`source-files/003-ParticleSensor__main.py.md`](source-files/003-ParticleSensor__main.py.md) | no | no |
| `NanofabToolkit/ParticleSensor/requirements.txt` | [`source-files/004-ParticleSensor__requirements.txt.md`](source-files/004-ParticleSensor__requirements.txt.md) | no | no |
| `NanofabToolkit/ParticleSensor/src/ParticleSensor.py` | [`source-files/005-ParticleSensor__src__ParticleSensor.py.md`](source-files/005-ParticleSensor__src__ParticleSensor.py.md) | no | no |
| `NanofabToolkit/ParticleSensor/src/assets/icon.py` | [`source-files/006-ParticleSensor__src__assets__icon.py.md`](source-files/006-ParticleSensor__src__assets__icon.py.md) | no | no |
| `NanofabToolkit/ParticleSensor/src/gui.py` | [`source-files/007-ParticleSensor__src__gui.py.md`](source-files/007-ParticleSensor__src__gui.py.md) | yes | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
