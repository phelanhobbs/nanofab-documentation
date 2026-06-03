# Path F Tool Reconstruction: 17 - NanofabToolkit / Packaging Root

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## When To Open This Folder

Open this when rebuilding packaging infrastructure, GitHub Actions, PyInstaller hooks, or repo-level metadata.

## What This Tool Does

NanofabToolkit root docs, shared packaging hooks, license, and CI workflow.

## Rebuild Focus

Preserve package workflow behavior, hook names, asset inclusion rules, license text, and root README expectations.

## External Inputs You Must Supply

- GitHub Actions environment
- PyInstaller dependency versions
- release artifact expectations

## Proof That The Rebuild Works

- Packaging hooks are discoverable by PyInstaller.
- The ParticleSensor build workflow still names the right paths.
- Root metadata matches the tool folders.

## Common Ways To Get Lost

- Packaging fixes can affect multiple desktop tools.
- Generated release artifacts are not source files.

## Fixture And Validation Gap

Do not treat the proof checks above as complete until [`../../../FIXTURE-AND-EVIDENCE-INDEX.md`](../../../FIXTURE-AND-EVIDENCE-INDEX.md) or the rebuild evidence template names the sample inputs, hashes, expected outputs, screenshots, API responses, or acceptable substitutes used for this tool. If no canonical fixture exists, mark the proof partial and create one as part of the maintenance work.

## Packaging Working Directory Rule

Before running PyInstaller, verify whether each spec assumes execution from the tool directory or repo root. If a spec uses `main.py`, `pathex=['.']`, or relative asset paths, run from that tool directory or adjust the spec deliberately. Record PyInstaller, NumPy, SciPy, Qt, and hook versions used.

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
| `NanofabToolkit/.github/workflows/build-particle-sensor.yml` | [`source-files/001-.github__workflows__build-particle-sensor.yml.md`](source-files/001-.github__workflows__build-particle-sensor.yml.md) | no | no |
| `NanofabToolkit/.gitignore` | [`source-files/002-.gitignore.md`](source-files/002-.gitignore.md) | no | no |
| `NanofabToolkit/LICENSE` | [`source-files/003-LICENSE.md`](source-files/003-LICENSE.md) | no | no |
| `NanofabToolkit/README.md` | [`source-files/004-README.md.md`](source-files/004-README.md.md) | no | no |
| `NanofabToolkit/pyinstaller/hooks/f2py_hook.py` | [`source-files/005-pyinstaller__hooks__f2py_hook.py.md`](source-files/005-pyinstaller__hooks__f2py_hook.py.md) | no | no |
| `NanofabToolkit/pyinstaller/hooks/hook-numpy.f2py.py` | [`source-files/006-pyinstaller__hooks__hook-numpy.f2py.py.md`](source-files/006-pyinstaller__hooks__hook-numpy.f2py.py.md) | no | no |
| `NanofabToolkit/pyinstaller/hooks/hook-runtime.py` | [`source-files/007-pyinstaller__hooks__hook-runtime.py.md`](source-files/007-pyinstaller__hooks__hook-runtime.py.md) | no | no |
| `NanofabToolkit/pyinstaller/hooks/hook-scipy.py` | [`source-files/008-pyinstaller__hooks__hook-scipy.py.md`](source-files/008-pyinstaller__hooks__hook-scipy.py.md) | no | no |

## Tool Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.
