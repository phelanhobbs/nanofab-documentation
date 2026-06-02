# Path E Timing Estimates

These estimates answer two different questions:

- **Read-aloud time**: how long the words take if read straight through at about 120 words per minute.
- **Presentation time**: how long the handoff usually takes when the presenter also changes slides, opens docs/source, runs demos, waits for explain-back answers, records notes, assigns homework, and stops when evidence is missing.

Use presentation time for scheduling. Use read-aloud time only as a lower bound.

## Version Totals

| Version | File(s) | Words | Read-aloud time | Real presentation time |
|---|---:|---:|---:|---:|
| Modular script pack | operator protocol, Modules 0-21, and weekly rollout plan; excludes this timing guide | 17,249 | ~2.4 hours | ~15-23 hours |
| Minimum full Path E | `support/path-e-script-minimum/scripts/*.md` | 88,581 | ~12.3 hours | ~30-50 hours |
| Medium full Path E | `support/path-e-script-medium/scripts/*.md` | 229,026 | ~31.8 hours | ~75-120 hours |
| Verbose maximal Path E | `support/path-e-script-verbose/scripts/*.md` | 313,892 | ~43.6 hours | ~105-165 hours |

The verbose tier is the best match when there is truly no time limit and the handoff can run for months. The modular script pack is the practical minimum for a live human handoff. The generated minimum, medium, and verbose tiers are split into module files under their `scripts/` directories.

## Weekly Rollout Estimates

| Rollout portion | Files | Words | Read-aloud time | Real presentation time |
|---|---|---:|---:|---:|
| Week 1 - Orientation and access | operator protocol + Modules 0-3 | 4,384 | ~37 min | ~2.5-4.5 hours |
| Week 2 - Flask internals and access control | Modules 4-6 | 1,940 | ~16 min | ~1.75-2.75 hours |
| Week 3 - User workflows and data flow | Modules 7-9 | 1,622 | ~14 min | ~1.5-2.5 hours |
| Week 4 - Chemical inventory and endpoint drift | Modules 10-11 | 1,259 | ~10 min | ~1.5-2.25 hours |
| Week 5 - Security and data supply | Modules 12-14 | 1,680 | ~14 min | ~1.75-3.0 hours |
| Week 6 - Firmware, desktop tools, and legacy context | Modules 15-17 | 1,284 | ~11 min | ~1.25-2.25 hours |
| Week 7 - Triage and evidence audit | Modules 18-19 | 1,155 | ~10 min | ~1.75-2.75 hours |
| Week 8 or later - Scenarios and exit | Modules 20-21 | 2,433 | ~20 min | ~2.5-4.0 hours |

These weekly estimates are for the modular script pack. The generated minimum, medium, and verbose tiers should be scheduled as longer multi-session versions of the same module order.

## Module Estimates

| Module | Words | Read-aloud time | Real presentation time |
|---|---:|---:|---:|
| Operator protocol | 1,047 | ~9 min | ~25-35 min |
| Module 0 - Set the contract | 860 | ~7 min | ~25-35 min |
| Module 1 - Big picture of the server | 886 | ~7 min | ~35-50 min |
| Module 2 - Live server | 783 | ~7 min | ~35-55 min |
| Module 3 - Server access and safe inspection | 808 | ~7 min | ~45-75 min |
| Module 4 - Flask startup | 614 | ~5 min | ~30-45 min |
| Module 5 - Configuration and local development | 686 | ~6 min | ~35-55 min |
| Module 6 - Authentication, authorization, and admin | 640 | ~5 min | ~40-60 min |
| Module 7 - Tasks | 542 | ~5 min | ~25-40 min |
| Module 8 - Machines and logs | 541 | ~5 min | ~30-45 min |
| Module 9 - Device APIs and sensor data | 539 | ~4 min | ~35-55 min |
| Module 10 - Chemical inventory and PostgreSQL | 677 | ~6 min | ~50-80 min |
| Module 11 - Request lifecycle and endpoint reference | 582 | ~5 min | ~40-60 min |
| Module 12 - Security model | 686 | ~6 min | ~40-70 min |
| Module 13 - HSCDownloader and CORES data | 502 | ~4 min | ~30-50 min |
| Module 14 - File transfers from machine PCs | 492 | ~4 min | ~30-50 min |
| Module 15 - Pico firmware and ParticleSensor | 434 | ~4 min | ~30-50 min |
| Module 16 - Other desktop and data tools | 541 | ~5 min | ~35-55 min |
| Module 17 - Legacy server | 309 | ~3 min | ~15-25 min |
| Module 18 - Known issues and maintenance triage | 541 | ~5 min | ~45-75 min |
| Module 19 - Path D audit practice | 614 | ~5 min | ~60-90 min |
| Module 20 - Operational scenarios | 1,150 | ~10 min | ~75-120 min |
| Module 21 - Final no-contact check | 1,283 | ~11 min | ~75-120 min |
| Weekly rollout plan | 815 | ~7 min | ~15-25 min |

## How To Interpret The Estimates

The real presentation time is much longer than the read-aloud time because the script is not meant to be a monologue. The presenter is expected to:

- change slides and wait while the maintainer reads them;
- open matching docs and source files;
- run read-only checks;
- pause when live access is unavailable;
- ask every explain-back question;
- compare the maintainer's answer to the expected answer table;
- record missing evidence;
- stop instead of guessing when facts disagree.

If the maintainer already knows Flask, SSH, tmux, and the codebase, the presentation can land near the low end. If the maintainer is new to the system or needs live practice, use the high end or split the module across multiple sessions.
