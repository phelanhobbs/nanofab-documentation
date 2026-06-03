# Path F Tool Reconstruction: 17 - NanofabToolkit / Packaging Root

This folder is part of the Path F ultra-deep reconstruction manual. Its goal is to make this specific tool or source area reproducible from documentation alone. Read this tool README conceptually first, then use the source-file reconstruction pages as the line-level reference.

## Folder Layout

- `README.md`: tool-level reconstruction contract and source index.
- `source-files/`: one reconstruction page per source file covered by this tool.
- `rehearsals/`: tool-local reconstruction drill instructions and any generated overflow pass files for this tool.

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
