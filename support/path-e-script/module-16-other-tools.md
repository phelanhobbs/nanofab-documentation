# Module 16 - Other Desktop And Data Tools

## Goal

The maintainer can identify each remaining desktop/data tool, explain its purpose, decide how much maintenance attention it deserves, and avoid confusing small utilities with the live server.

## Required Screen

SHOW:

- [`../../presentation/NanofabToolkit/ParalyneReader/slides/ParalyneReader.pptx`](../../presentation/NanofabToolkit/ParalyneReader/slides/ParalyneReader.pptx)
- [`../../presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx`](../../presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx)
- [`../../presentation/NanofabToolkit/DentonDecoder/slides/DentonDecoder.pptx`](../../presentation/NanofabToolkit/DentonDecoder/slides/DentonDecoder.pptx)
- [`../../presentation/NanofabToolkit/ALDPeakCounter/slides/ALDPeakCounter.pptx`](../../presentation/NanofabToolkit/ALDPeakCounter/slides/ALDPeakCounter.pptx)
- [`../../presentation/NanofabToolkit/PreciousMetalReader/slides/PreciousMetalReader.pptx`](../../presentation/NanofabToolkit/PreciousMetalReader/slides/PreciousMetalReader.pptx)
- [`../../presentation/UNanofabTools/utilities/slides/Utilities.pptx`](../../presentation/UNanofabTools/utilities/slides/Utilities.pptx)

## Verbatim Script

READ ALOUD:

"This module covers the smaller tools. They matter, but they do not all matter equally. A future maintainer needs to know what each tool is for, where its source lives, whether it talks to `nfhistory`, and whether it is business-critical or occasional."

SHOW:

Open `ParalyneReader.pptx`.

READ ALOUD:

"ParalyneReader is a desktop data-review tool for Parylene analog logs. The maintainer should know what file formats it reads, what output it produces, and whether users depend on it for routine work."

SHOW:

Open `DAT-Tools.pptx`.

READ ALOUD:

"DAT tools include DATfixer and DATgrapher for Denton 635 logs. The developer README explains reverse-engineered binary assumptions and duplicated graphing logic. The maintainer should treat those assumptions as fragile and preserve test files if available."

SHOW:

Open `DentonDecoder.pptx`.

READ ALOUD:

"DentonDecoder is a separate Denton charting or decoding tool. Do not assume it is the same as DATfixer just because both are Denton-related. Use the per-tool docs."

SHOW:

Open `ALDPeakCounter.pptx`.

READ ALOUD:

"ALDPeakCounter supports cycle counting and run comparison. Maintenance concerns include input data assumptions, plotting behavior, and whether it has representative sample data."

SHOW:

Open `PreciousMetalReader.pptx`.

READ ALOUD:

"PreciousMetalReader extracts monthly CORES metal-usage data. It is related to CORES, but it is not the same pipeline as `HSCDownloader.py`. It may use the same endpoint family but a different webhook path or service ID."

SHOW:

Open `Utilities.pptx`.

READ ALOUD:

"Utilities are miscellaneous helpers. Some may be incomplete or personal-development tools. Do not elevate a utility into core infrastructure without verifying live use and known issues."

## Maintenance Prioritization

READ ALOUD:

"The rule for smaller tools is: understand purpose first, verify canonical location second, inspect known issues third, and only then decide maintenance priority. Do not spend the first maintainer-hours rewriting small tools while the live server still needs supervision, secret cleanup, route review, backup confirmation, and chemical inventory attention."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Which tools are desktop-only? | NanofabToolkit tools such as ParalyneReader, ALDPeakCounter, DentonDecoder, PreciousMetalReader, ParticleSensor, and similar local analysis/viewer tools unless docs say otherwise. |
| Which tools talk to CORES? | `HSCDownloader.py` and PreciousMetalReader use CORES-related endpoints/data, but for different purposes. |
| Which tools are tied to Denton data? | DATfixer/DATgrapher and DentonDecoder. |
| Which tool handles Parylene analog logs? | ParalyneReader. |
| Which tool handles ALD cycle counting? | ALDPeakCounter. |
| Which utilities look incomplete or personal? | Utilities flagged in the utilities docs/known issues, such as personal helper scripts or unfinished utilities. |
| How do you decide whether to maintain or defer a small tool? | Verify usage, canonical source, user impact, known issues, and whether higher-priority live-server/security/reliability work should come first. |

REQUIRE:

The maintainer can name each smaller tool and say whether it is live-server-critical, data-analysis support, or miscellaneous.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot distinguish smaller desktop tools from the production Flask server.
