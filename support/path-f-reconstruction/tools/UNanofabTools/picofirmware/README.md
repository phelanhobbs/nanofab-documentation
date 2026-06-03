# Path F Tool Reconstruction: 04 - UNanofabTools / Pico Firmware

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this for historical Pico code, unique unfinished scripts, WiFi diagnostics, or comparison against the canonical NanofabToolkit PicoHelperTools folder.

## What This Tool Does

Older UNanofabTools copies of Pico firmware and Pico diagnostics.

## Rebuild Focus

Preserve MicroPython imports, sensor read loops, WiFi handling, HTTP POST payload shape, endpoint URLs, and diagnostic LED behavior.

## External Inputs You Must Supply

- WiFi SSID and password from secure local config
- Pico MAC/device identity
- server endpoint URL
- sensor wiring

## Proof That The Rebuild Works

- A Pico can boot the recreated firmware without import errors.
- WiFi diagnostics succeed or fail with clear output.
- Sensor payloads match the Flask particle or machine API contracts.

## Common Ways To Get Lost

- Canonical Pico firmware lives in NanofabToolkit/PicoHelperTools.
- Some UNanofabTools Pico scripts are incomplete or historical.

## Fixture And Validation Gap

Do not treat the proof checks above as complete until [`../../../FIXTURE-AND-EVIDENCE-INDEX.md`](../../../FIXTURE-AND-EVIDENCE-INDEX.md) or the rebuild evidence template names the sample inputs, hashes, expected outputs, screenshots, API responses, or acceptable substitutes used for this tool. If no canonical fixture exists, mark the proof partial and create one as part of the maintenance work.

## Bootability Warning

This folder contains older or historical Pico copies. Some files may be incomplete or non-bootable as written. Before deploying, identify the specific firmware file, required constants, sensor wiring, MicroPython version, endpoint URL, and serial-console acceptance output.

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
| `UNanofabTools/ParticleSensor.py` | [`source-files/001-ParticleSensor.py.md`](source-files/001-ParticleSensor.py.md) | no | no |
| `UNanofabTools/Particle_sensor.py` | [`source-files/002-Particle_sensor.py.md`](source-files/002-Particle_sensor.py.md) | no | no |
| `UNanofabTools/PicoConnect.py` | [`source-files/003-PicoConnect.py.md`](source-files/003-PicoConnect.py.md) | no | no |
| `UNanofabTools/PicoDenton18.py` | [`source-files/004-PicoDenton18.py.md`](source-files/004-PicoDenton18.py.md) | no | no |
| `UNanofabTools/PicoParylene.py` | [`source-files/005-PicoParylene.py.md`](source-files/005-PicoParylene.py.md) | no | no |
| `UNanofabTools/VGC083C_Monitor.py` | [`source-files/006-VGC083C_Monitor.py.md`](source-files/006-VGC083C_Monitor.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
