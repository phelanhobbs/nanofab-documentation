# Path E Verbatim Handoff Script Pack

This directory contains a read-aloud script set for Path E: the exhaustive, slide-supported handoff to a future maintainer.

The shorter guide at [`../PRESENTATION-GUIDE.md`](../PRESENTATION-GUIDE.md) tells a human presenter how to think about the handoff. This script pack is more literal. It is written so a presenter with no private context can open the files in order and run the handoff over several weeks or months.

## How To Use This Pack

Start with [`OPERATOR-CHECKLIST.md`](OPERATOR-CHECKLIST.md) if you need the short before/during/after checklist or need to choose between the practical, minimum, medium, and verbose Path E versions.

Read [`00-operator-protocol.md`](00-operator-protocol.md) before presenting anything. It defines the rules for reading, pausing, demos, safety, evidence logging, and explain-back checks.

Use [`TIMING.md`](TIMING.md) for read-aloud and real presentation-time estimates by version, week, and module.

Use [`weekly-rollout-plan.md`](weekly-rollout-plan.md) to spread the modules across weeks or months.

Longer generated tiers are available beside this directory:

- [`../path-e-script-minimum/README.md`](../path-e-script-minimum/README.md) — 88,794-word tier, split under `scripts/`.
- [`../path-e-script-medium/README.md`](../path-e-script-medium/README.md) — 229,239-word tier, split under `scripts/`.
- [`../path-e-script-verbose/README.md`](../path-e-script-verbose/README.md) — 314,105-word tier, split under `scripts/`.

Then run the module scripts in order:

| Module | Script | Primary Outcome |
|---|---|---|
| 0 | [`module-00-set-the-contract.md`](module-00-set-the-contract.md) | Establish the handoff contract, workspace, source-of-truth order, and safety rules. |
| 1 | [`module-01-big-picture.md`](module-01-big-picture.md) | Build the full system map before discussing code. |
| 2 | [`module-02-live-server.md`](module-02-live-server.md) | Explain what is actually running on `nfhistory`. |
| 3 | [`module-03-server-access.md`](module-03-server-access.md) | Teach safe SSH and tmux inspection without killing live services. |
| 4 | [`module-04-flask-startup.md`](module-04-flask-startup.md) | Explain `run.py`, app factory startup, config, extensions, and blueprints. |
| 5 | [`module-05-configuration-local-dev.md`](module-05-configuration-local-dev.md) | Explain configuration, environment variables, local development, and secret boundaries. |
| 6 | [`module-06-auth-admin.md`](module-06-auth-admin.md) | Explain login, sessions, Duo, admin powers, and auth risks. |
| 7 | [`module-07-tasks.md`](module-07-tasks.md) | Walk through the task tracker as a normal user-facing feature. |
| 8 | [`module-08-machines-logs.md`](module-08-machines-logs.md) | Explain machine pages, `HSCDATA`, `LogData`, file browsing, graphs, and data durability. |
| 9 | [`module-09-device-apis.md`](module-09-device-apis.md) | Explain Pico/device endpoints, sensor storage, and unauthenticated API risks. |
| 10 | [`module-10-chemical-inventory.md`](module-10-chemical-inventory.md) | Explain the chemical inventory feature and local PostgreSQL dependency. |
| 11 | [`module-11-request-lifecycle-endpoints.md`](module-11-request-lifecycle-endpoints.md) | Trace requests end to end and teach endpoint drift audits. |
| 12 | [`module-12-security-model.md`](module-12-security-model.md) | Explain security strengths, known gaps, and Nanofab-vs-IT responsibility. |
| 13 | [`module-13-hscdownloader.md`](module-13-hscdownloader.md) | Explain CORES data ingestion and `HSCDownloader.py`. |
| 14 | [`module-14-file-transfers.md`](module-14-file-transfers.md) | Explain machine-control-PC upload scripts and account dependencies. |
| 15 | [`module-15-pico-particle.md`](module-15-pico-particle.md) | Explain canonical Pico firmware and ParticleSensor code. |
| 16 | [`module-16-other-tools.md`](module-16-other-tools.md) | Explain remaining desktop/data tools and how deeply to maintain each. |
| 17 | [`module-17-legacy-server.md`](module-17-legacy-server.md) | Explain deprecated `hscdisplayerserver` without reviving it. |
| 18 | [`module-18-known-issues-triage.md`](module-18-known-issues-triage.md) | Turn known issues into a maintenance plan. |
| 19 | [`module-19-path-d-audit-practice.md`](module-19-path-d-audit-practice.md) | Practice a real Path D evidence audit. |
| 20 | [`module-20-operational-scenarios.md`](module-20-operational-scenarios.md) | Rehearse outage, drift, restore, access, and security scenarios. |
| 21 | [`module-21-final-no-contact-check.md`](module-21-final-no-contact-check.md) | Verify the maintainer can continue without Faith. |

## Scheduling Guidance

Do not compress this into a single sitting unless there is no other option. A stronger handoff is spread across many sessions with homework between them.

Recommended pacing:

- Week 1: Modules 0-3. Orientation, live server, and access.
- Week 2: Modules 4-6. Flask startup, config, auth, and admin.
- Week 3: Modules 7-11. Main user workflows, device APIs, chem inventory, request lifecycle.
- Week 4: Modules 12-16. Security, data pipelines, firmware, desktop tools.
- Week 5: Modules 17-19. Legacy context, known issues, and audit practice.
- Week 6 or later: Modules 20-21. Operational scenario rehearsals and final no-contact check.

The schedule is not a promise. If a module reveals missing knowledge, stop and document it before moving on.

## Non-Negotiable Completion Rule

Path E is not complete because every file was read. Path E is complete only when the maintainer can:

- explain the system without Faith;
- access and inspect the live server safely;
- distinguish Nanofab-owned work from University IT work;
- identify canonical source code vs historical copies;
- audit documentation against source and live state;
- create a maintenance plan with evidence;
- recover from common operational failures using written runbooks.

If the maintainer cannot do one of those things, keep presenting, practicing, or documenting.
