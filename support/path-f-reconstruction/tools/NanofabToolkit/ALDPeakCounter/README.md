# Path F Tool Reconstruction: 13 - NanofabToolkit / ALD Peak Counter

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this when ALD pressure files need a GUI workflow or the shared peak-count algorithm must be rebuilt.

## What This Tool Does

Desktop GUI for ALD pressure peak counting.

## Rebuild Focus

Preserve file parsing, peak detection parameters, end-peak heuristic, plotting, GUI controls, and packaging behavior.

## External Inputs You Must Supply

- Representative ALD data files
- PyQt/matplotlib/scipy stack
- packaging icon/assets

## Proof That The Rebuild Works

- Known ALD data returns the same peak count.
- The GUI can load one file and multiple files.
- Packaged app includes required plotting hooks and assets.

## Common Ways To Get Lost

- The peak algorithm overlaps UNanofabTools/peakCount.py.
- Boundary peaks are easy to miss.

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
| `NanofabToolkit/ALDPeakCounter/ALDPeakCounter.spec` | [`source-files/001-ALDPeakCounter__ALDPeakCounter.spec.md`](source-files/001-ALDPeakCounter__ALDPeakCounter.spec.md) | no | no |
| `NanofabToolkit/ALDPeakCounter/main.py` | [`source-files/002-ALDPeakCounter__main.py.md`](source-files/002-ALDPeakCounter__main.py.md) | no | no |
| `NanofabToolkit/ALDPeakCounter/requirements.txt` | [`source-files/003-ALDPeakCounter__requirements.txt.md`](source-files/003-ALDPeakCounter__requirements.txt.md) | no | no |
| `NanofabToolkit/ALDPeakCounter/src/assets/icon.py` | [`source-files/004-ALDPeakCounter__src__assets__icon.py.md`](source-files/004-ALDPeakCounter__src__assets__icon.py.md) | no | no |
| `NanofabToolkit/ALDPeakCounter/src/gui.py` | [`source-files/005-ALDPeakCounter__src__gui.py.md`](source-files/005-ALDPeakCounter__src__gui.py.md) | no | no |
| `NanofabToolkit/ALDPeakCounter/src/hook-matplotlib.py` | [`source-files/006-ALDPeakCounter__src__hook-matplotlib.py.md`](source-files/006-ALDPeakCounter__src__hook-matplotlib.py.md) | no | no |
| `NanofabToolkit/ALDPeakCounter/src/peakCount.py` | [`source-files/007-ALDPeakCounter__src__peakCount.py.md`](source-files/007-ALDPeakCounter__src__peakCount.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
