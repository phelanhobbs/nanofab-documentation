# Path F Tool Reconstruction: 11 - NanofabToolkit / Pico Helper Tools

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this first for Pico firmware rebuilds, sensor device setup, MAC discovery, network diagnostics, and MicroPython deployment.

## What This Tool Does

Canonical Pico firmware and helper scripts for sensor devices.

## Rebuild Focus

Preserve MicroPython boot behavior, sensor drivers, WiFi setup, payload schemas, endpoint URLs, and device setup instructions.

## External Inputs You Must Supply

- WiFi credentials from secure storage
- Pico device identity
- server URL
- sensor wiring and power

## Proof That The Rebuild Works

- A Pico can run the recreated boot and sensor script without missing modules.
- Network check and MAC discovery work on hardware.
- Payloads accepted by the Flask API are byte-for-byte compatible in field names and units.

## Common Ways To Get Lost

- Hard-coded secrets must be replaced by approved configuration.
- Hardware failures can masquerade as firmware failures.

## Fixture And Validation Gap

Do not treat the proof checks above as complete until [`../../../FIXTURE-AND-EVIDENCE-INDEX.md`](../../../FIXTURE-AND-EVIDENCE-INDEX.md) or the rebuild evidence template names the sample inputs, hashes, expected outputs, screenshots, API responses, or acceptable substitutes used for this tool. If no canonical fixture exists, mark the proof partial and create one as part of the maintenance work.

## Hardware Provisioning Contract Required

A Pico rebuild needs a bill of materials, MicroPython version, upload method, secret provisioning method, MAC/device identity, wiring notes, endpoint URL, and serial-console pass/fail output. Do not accept `change the password in source` as a production provisioning method.

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
| `NanofabToolkit/PicoHelperTools/DHT22_sensor.py` | [`source-files/001-PicoHelperTools__DHT22_sensor.py.md`](source-files/001-PicoHelperTools__DHT22_sensor.py.md) | no | no |
| `NanofabToolkit/PicoHelperTools/GetPicoMAC.py` | [`source-files/002-PicoHelperTools__GetPicoMAC.py.md`](source-files/002-PicoHelperTools__GetPicoMAC.py.md) | no | no |
| `NanofabToolkit/PicoHelperTools/Particle_sensor.py` | [`source-files/003-PicoHelperTools__Particle_sensor.py.md`](source-files/003-PicoHelperTools__Particle_sensor.py.md) | no | no |
| `NanofabToolkit/PicoHelperTools/PicoNetworkCheck.py` | [`source-files/004-PicoHelperTools__PicoNetworkCheck.py.md`](source-files/004-PicoHelperTools__PicoNetworkCheck.py.md) | no | no |
| `NanofabToolkit/PicoHelperTools/PicoSetupInstructions.md` | [`source-files/005-PicoHelperTools__PicoSetupInstructions.md.md`](source-files/005-PicoHelperTools__PicoSetupInstructions.md.md) | no | no |
| `NanofabToolkit/PicoHelperTools/boot.py` | [`source-files/006-PicoHelperTools__boot.py.md`](source-files/006-PicoHelperTools__boot.py.md) | no | no |
| `NanofabToolkit/PicoHelperTools/picopass.py` | [`source-files/007-PicoHelperTools__picopass.py.md`](source-files/007-PicoHelperTools__picopass.py.md) | no | no |
| `NanofabToolkit/PicoHelperTools/sensor_combined.py` | [`source-files/008-PicoHelperTools__sensor_combined.py.md`](source-files/008-PicoHelperTools__sensor_combined.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
