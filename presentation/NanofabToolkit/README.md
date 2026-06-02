# NanofabToolkit — Layperson Presentations

Plain-English guides and slide decks for the desktop tools and Pico firmware in the `NanofabToolkit` repository. Each folder below contains a `README.md` (the layman guide) and, where appropriate, a `slides/` subfolder with a `.pptx` deck.

The companion developer documentation lives at `../documentation/NanofabToolkit/`. Bugs and tech debt are tracked separately in `../known-issues/NanofabToolkit/`.

## What's in each folder

| Folder | What it is | Slides |
|--------|------------|--------|
| [`ALDPeakCounter/`](ALDPeakCounter/README.md) | Desktop GUI that counts pressure peaks in ALD log files, with per-file time alignment and a comparison chart. | yes |
| [`DentonDecoder/`](DentonDecoder/README.md) | Desktop GUI that opens Denton `.dat` or CSV logs and charts any column against time. | yes |
| [`ParalyneReader/`](ParalyneReader/README.md) | Desktop GUI that lists, downloads, and visualizes Parylene-coater run files from the cleanroom server. | yes |
| [`PreciousMetalReader/`](PreciousMetalReader/README.md) | Desktop GUI that pulls a month's precious-metal usage records from CORES and writes a CSV summary. | yes |
| [`PicoHelperTools/`](PicoHelperTools/README.md) | Pico firmware (particle / env / combined) — the current, canonical copies. Older copies exist in UNanofabTools. | yes |
| [`ParticleSensor/`](ParticleSensor/README.md) | PyQt desktop particle-data viewer with env-data sub-boxes — the current, canonical copy. Older copy exists in UNanofabTools. | yes |

## A note on the overlap with UNanofabTools

Both `PicoHelperTools/` (Pico firmware) and `ParticleSensor/` (the desktop particle viewer) also exist in the sibling `UNanofabTools` repository as **older copies**. The files in *this* tree are the current, canonical versions and the ones to extend going forward; the UNanofabTools copies are kept for historical reference only. Their docs in `documentation/UNanofabTools/picofirmware/` and `documentation/UNanofabTools/particlepctools/` now point at this folder.

## How the materials fit together

For each non-overlap tool you get three things:

1. **A layman guide** in this tree (`presentation/NanofabToolkit/<tool>/README.md`) — the plain-English version, for non-coders.
2. **A slide deck** (`presentation/NanofabToolkit/<tool>/slides/*.pptx`) — the same material as slides with full speaker notes.
3. **Developer documentation** in the parallel tree (`documentation/NanofabToolkit/<tool>/`) — the formal reference for whoever maintains the code.

A separate `known-issues/NanofabToolkit/<tool>.md` file lists bugs and tech debt for each tool, kept out of the docs so a successor sees a clean handoff and a maintainer sees a tidy to-do list.

## See also

The sibling UNanofabTools repository is documented in parallel at `../UNanofabTools/` (this tree), `../../documentation/UNanofabTools/`, and `../../known-issues/UNanofabTools/`. Cross-references between the two are used wherever a tool spans both repos (firmware, particle viewer, CORES integrations).
