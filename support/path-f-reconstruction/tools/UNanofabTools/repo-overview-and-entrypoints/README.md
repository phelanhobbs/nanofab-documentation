# Path F Tool Reconstruction: 00 - UNanofabTools / Repo Overview And Entrypoints

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this when you need the original repo story before choosing a specific tool folder.

## What This Tool Does

Repository-level orientation, setup notes, migration summaries, and legacy handoff context.

## Rebuild Focus

Preserve the setup sequence, repo-level assumptions, migration history, and relationship between old and modern server code.

## External Inputs You Must Supply

- Adjacent repo location
- Python environment
- production host facts from live verification

## Proof That The Rebuild Works

- A new maintainer can explain which code is modern, which code is historical, and where each tool lives.
- The recreated repo has the same top-level entrypoint and setup expectations.
- No repo-level note contradicts the current Path F navigator or source manifest.

## Common Ways To Get Lost

- Old README claims may predate the Flask refactor.
- Treat live production as stronger evidence than historical migration notes.

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
| `UNanofabTools/.gitignore` | [`source-files/001-.gitignore.md`](source-files/001-.gitignore.md) | no | no |
| `UNanofabTools/INTEGRATION_SUMMARY.md` | [`source-files/002-INTEGRATION_SUMMARY.md.md`](source-files/002-INTEGRATION_SUMMARY.md.md) | no | no |
| `UNanofabTools/QUICK_START.md` | [`source-files/003-QUICK_START.md.md`](source-files/003-QUICK_START.md.md) | no | no |
| `UNanofabTools/REFACTORING_SUMMARY.md` | [`source-files/004-REFACTORING_SUMMARY.md.md`](source-files/004-REFACTORING_SUMMARY.md.md) | no | no |
| `UNanofabTools/SETUP_GUIDE.md` | [`source-files/005-SETUP_GUIDE.md.md`](source-files/005-SETUP_GUIDE.md.md) | no | no |
| `UNanofabTools/START_HERE.md` | [`source-files/006-START_HERE.md.md`](source-files/006-START_HERE.md.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
