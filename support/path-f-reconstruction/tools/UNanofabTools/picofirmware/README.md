# Path F Tool Reconstruction: 04 - UNanofabTools / Pico Firmware

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## Folder Layout

- `README.md`: tool-level reconstruction contract and source index.
- `source-files/`: one reconstruction page per source file covered by this tool.
- `rehearsals/`: tool-local reconstruction drill instructions and any generated overflow pass files for this tool.

## Files Covered

| Source file | Reconstruction page | Dirty | Untracked |
|---|---|---:|---:|
| `UNanofabTools/ParticleSensor.py` | [`source-files/001-ParticleSensor.py.md`](source-files/001-ParticleSensor.py.md) | no | no |
| `UNanofabTools/Particle_sensor.py` | [`source-files/002-Particle_sensor.py.md`](source-files/002-Particle_sensor.py.md) | no | no |
| `UNanofabTools/PicoConnect.py` | [`source-files/003-PicoConnect.py.md`](source-files/003-PicoConnect.py.md) | no | no |
| `UNanofabTools/PicoDenton18.py` | [`source-files/004-PicoDenton18.py.md`](source-files/004-PicoDenton18.py.md) | no | no |
| `UNanofabTools/PicoParylene.py` | [`source-files/005-PicoParylene.py.md`](source-files/005-PicoParylene.py.md) | no | no |
| `UNanofabTools/VGC083C_Monitor.py` | [`source-files/006-VGC083C_Monitor.py.md`](source-files/006-VGC083C_Monitor.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
