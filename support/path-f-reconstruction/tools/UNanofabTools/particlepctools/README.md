# Path F Tool Reconstruction: 05 - UNanofabTools / Particle PC Tools

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this for historical desktop viewer behavior, test particle-data generation, or comparison with NanofabToolkit/ParticleSensor.

## What This Tool Does

Older PC-side particle data viewer and synthetic particle-data generator.

## Rebuild Focus

Preserve API URLs, JSON parsing, room map behavior, historical charting, and safe test-data generation behavior.

## External Inputs You Must Supply

- Particle API URL
- TLS behavior
- test server target
- room naming convention

## Proof That The Rebuild Works

- The viewer can fetch current and historical particle data from a test server.
- Room labels color correctly from API `room_name` and `sensor_number` values.
- The generator can target localhost without accidentally writing to production.

## Common Ways To Get Lost

- Canonical maintained viewer behavior is in NanofabToolkit/ParticleSensor.
- Timezone conversion has known drift risk.

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
| `UNanofabTools/curl_for_particle.md` | [`source-files/001-curl_for_particle.md.md`](source-files/001-curl_for_particle.md.md) | no | no |
| `UNanofabTools/generate_test_particle_data.py` | [`source-files/002-generate_test_particle_data.py.md`](source-files/002-generate_test_particle_data.py.md) | no | no |
| `UNanofabTools/particle_data_viewer.py` | [`source-files/003-particle_data_viewer.py.md`](source-files/003-particle_data_viewer.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
