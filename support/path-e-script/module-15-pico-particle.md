# Module 15 - Pico Firmware And Particle Sensor Ecosystem

## Goal

The maintainer understands the Pico firmware and ParticleSensor ecosystem, especially the canonical-source rule: NanofabToolkit is canonical for PicoHelperTools and ParticleSensor.

## Required Screen

SHOW:

- [`../../presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx`](../../presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx)
- [`../../presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx`](../../presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx)
- [`../../presentation/UNanofabTools/picofirmware/slides/Pico-Firmware.pptx`](../../presentation/UNanofabTools/picofirmware/slides/Pico-Firmware.pptx)
- [`../../presentation/UNanofabTools/particlepctools/slides/Particle-PC-Tools.pptx`](../../presentation/UNanofabTools/particlepctools/slides/Particle-PC-Tools.pptx)
- [`../../documentation/NanofabToolkit/PicoHelperTools/README.md`](../../documentation/NanofabToolkit/PicoHelperTools/README.md)
- [`../../documentation/NanofabToolkit/ParticleSensor/README.md`](../../documentation/NanofabToolkit/ParticleSensor/README.md)

## Verbatim Script

READ ALOUD:

"This module is about source-code ownership and data contracts. Pico devices produce sensor data. ParticleSensor is a desktop viewer. The important repository rule is that NanofabToolkit is canonical for PicoHelperTools and ParticleSensor. UNanofabTools contains older copies for historical context."

SHOW:

Open `PicoHelperTools.pptx`.

READ ALOUD:

"PicoHelperTools is the canonical firmware area. If you need to update the firmware or understand what payload a Pico sends, start in NanofabToolkit. Do not patch an older copy in UNanofabTools and assume you changed the real firmware."

SHOW:

Open `ParticleSensor.pptx`.

READ ALOUD:

"ParticleSensor is the canonical desktop viewer. It depends on room labels, sensor numbers, server data contracts, and expected response shapes. If room names or sensor numbers drift between firmware, server, and desktop viewer, the system can silently stop matching data."

SHOW:

Open the older-copy decks for `picofirmware` and `particlepctools`.

READ ALOUD:

"These older UNanofabTools copies are included so a maintainer recognizes them. They are historical context unless live evidence shows they are still in use. The correct default is to update canonical NanofabToolkit versions."

## Source Demo

DO:

Run:

```sh
find ../NanofabToolkit/PicoHelperTools ../NanofabToolkit/ParticleSensor -maxdepth 2 -type f | sort
rg -n "room_name|sensor_number|sensor-data|env-data|requests|wifi|password|SSID" ../NanofabToolkit ../UNanofabTools
```

READ ALOUD:

"The first command proves substantive canonical content exists. The second connects firmware, desktop viewer, and server data-contract names. If secret-like strings appear in source, do not project their values. The point is to identify risk and where secrets should move, not to expose them."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Which repo is canonical for PicoHelperTools? | `NanofabToolkit`. |
| Which repo is canonical for ParticleSensor? | `NanofabToolkit`. |
| Why do older copies exist in UNanofabTools? | Historical context/reference; they should not be treated as canonical unless live evidence proves otherwise. |
| What fields identify a sensor? | `room_name` and `sensor_number`. |
| What can break if room labels drift? | Server matching, map coloring, viewer display, and data lookup can silently fail or mislabel sensors. |
| Where should firmware changes be made? | `../NanofabToolkit/PicoHelperTools/`. |
| Where should desktop viewer changes be made? | `../NanofabToolkit/ParticleSensor/`. |

REQUIRE:

The maintainer can state the canonical-copy rule without hesitation.

## Stop Point

STOP POINT:

Stop here if the maintainer wants to patch the older UNanofabTools copies first. Revisit the canonical-source rule.
