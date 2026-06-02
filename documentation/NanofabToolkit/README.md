# NanofabToolkit — Developer Documentation

Formal reference for the desktop tools and Pico firmware that live in the `NanofabToolkit` repository. Each folder below contains the developer docs for one tool group. The matching layman guides and slide decks are in the parallel tree at `../presentation/NanofabToolkit/`. Bugs and tech debt are tracked separately in `../known-issues/NanofabToolkit/`.

## Tools

| Folder | Component | Notes |
|--------|-----------|-------|
| [`ALDPeakCounter/`](ALDPeakCounter/README.md) | Tkinter GUI wrapping a SciPy peak counter; per-file time alignment, box zoom. | **Active** |
| [`DentonDecoder/`](DentonDecoder/README.md) | Tkinter GUI that accepts Denton `.dat` or CSV logs, converts `.dat` to temporary CSV, and plots any column against time (log-scale option). Distinct from UNanofabTools' command-line DAT tools. | **Active** |
| [`ParalyneReader/`](ParalyneReader/README.md) | Tkinter GUI client of the Flask app's `GET /api/paralyne/analog/...` endpoints; background downloads, smoothing/normalization/alignment. | **Active** |
| [`PreciousMetalReader/`](PreciousMetalReader/README.md) | Tkinter GUI that downloads month-of precious-metal usage records from the CORES `n8n` webhook and writes summarized CSVs. **Talks to CORES, not to the cleanroom server.** | **Active** |
| [`PicoHelperTools/`](PicoHelperTools/README.md) | MicroPython firmware (SPS30 / DHT22 / combined). The current, canonical copies. Older copies exist in `UNanofabTools/`. | **Active — canonical** |
| [`ParticleSensor/`](ParticleSensor/README.md) | PyQt desktop particle-data viewer with env-data sub-boxes and the standard matplotlib toolbar. The current, canonical copy. Older copy exists in `UNanofabTools/`. | **Active — canonical** |

## How the tree is laid out

For each tool you'll find:

- This tree (`documentation/NanofabToolkit/<tool>/`): one or more `.md` files of formal reference material — full docs for the four standalone tools, pointer files for the two that overlap with UNanofabTools.
- The parallel layman tree (`../presentation/NanofabToolkit/<tool>/`): a plain-English README and, for the four standalone tools, a slide deck with speaker notes.
- A single bugs / tech-debt file in `../known-issues/NanofabToolkit/<tool>.md`.

## Conventions

- All file paths are relative to the repository root unless otherwise noted.
- Code is quoted verbatim from the source so identifiers are searchable.
- Cross-tool references use folder paths (e.g. `documentation/UNanofabTools/picofirmware/`) so they keep working as the tree moves.
- For the two tools that also exist in `UNanofabTools/` (`PicoHelperTools` and `ParticleSensor`), this folder is canonical. The UNanofabTools-side docs now link back here.

## See also

The sibling `UNanofabTools` repository is documented in parallel at `../UNanofabTools/` (this tree), `../../presentation/UNanofabTools/`, and `../../known-issues/UNanofabTools/`. Cross-references run between the two for shared firmware, the particle viewer, and the CORES integrations.
