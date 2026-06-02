# Path E Weekly Rollout Plan

This plan breaks the verbatim script pack into a long handoff that can run across weeks or months. Do not treat the week labels as deadlines. Treat them as dependency order.

## Session Rules

Every session starts the same way.

READ ALOUD:

"We are continuing the Path E maintainer handoff. Before we resume, we will check the notes from the prior session, confirm what evidence was still missing, and restate the safety rules. We do not show secrets. We do not edit production casually. In tmux, we detach with `Ctrl-b d`. If docs, source, and live state disagree, we write down the disagreement."

DO:

1. Open the current handoff notes.
2. Review unresolved questions.
3. Confirm the documentation repo branch and source repo availability.
4. Confirm whether live server access is needed for this session.
5. Run `bash support/audit.sh` if documentation changed since the prior session.

Every session ends the same way.

READ ALOUD:

"Before we stop, we will write down what was proven, what was not proven, what homework is due, and whether any documentation or known-issues file needs an update."

DO:

1. Update the notes file.
2. Assign homework.
3. Record any missing evidence.
4. If files changed, run `bash support/audit.sh` and `git diff --check`.
5. Schedule the next session.

## Week 1 - Orientation And Access

Run:

- [`00-operator-protocol.md`](00-operator-protocol.md)
- [`module-00-set-the-contract.md`](module-00-set-the-contract.md)
- [`module-01-big-picture.md`](module-01-big-picture.md)
- [`module-02-live-server.md`](module-02-live-server.md)
- [`module-03-server-access.md`](module-03-server-access.md)

Expected outcome:

- The maintainer can draw the system map.
- The maintainer knows the IT/Nanofab boundary.
- The maintainer knows the production install path.
- The maintainer understands tmux safety.
- The maintainer has either practiced safe attach/detach or has a scheduled supervised practice session.

Homework:

- Read `presentation/UNanofabTools/flaskserver/README.md`.
- Read `presentation/UNanofabTools/liveserver/README.md`.
- Read `documentation/UNanofabTools/serveraccess/README.md`.
- Write a one-page summary of `nfhistory`, data producers, data stores, and owner boundaries.

## Week 2 - Flask Internals And Access Control

Run:

- [`module-04-flask-startup.md`](module-04-flask-startup.md)
- [`module-05-configuration-local-dev.md`](module-05-configuration-local-dev.md)
- [`module-06-auth-admin.md`](module-06-auth-admin.md)

Expected outcome:

- The maintainer can trace startup from `run.py` through app factory and blueprints.
- The maintainer can compare env-var docs to `config.py`.
- The maintainer understands secret boundaries.
- The maintainer can identify auth/admin guards in source.

Homework:

- Read `documentation/UNanofabTools/flaskserver/01-architecture.md`.
- Read `documentation/UNanofabTools/flaskserver/03-configuration-reference.md`.
- Read `documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md`.
- Pick one auth or admin route and write a source-to-docs trace.

## Week 3 - User Workflows And Data Flow

Run:

- [`module-07-tasks.md`](module-07-tasks.md)
- [`module-08-machines-logs.md`](module-08-machines-logs.md)
- [`module-09-device-apis.md`](module-09-device-apis.md)

Expected outcome:

- The maintainer can trace a task route.
- The maintainer can distinguish `HSCDATA`, `LogData`, and uploads.
- The maintainer can explain Pico/device API payloads and risks.
- The maintainer knows NanofabToolkit is canonical for PicoHelperTools and ParticleSensor.

Homework:

- Audit one task endpoint.
- Audit one machine/log endpoint.
- Audit one device endpoint against NanofabToolkit source.

## Week 4 - Chemical Inventory And Endpoint Drift

Run:

- [`module-10-chemical-inventory.md`](module-10-chemical-inventory.md)
- [`module-11-request-lifecycle-endpoints.md`](module-11-request-lifecycle-endpoints.md)

Expected outcome:

- The maintainer understands local PostgreSQL.
- The maintainer can explain chemical inventory entities and write risks.
- The maintainer can run an endpoint drift check.

Homework:

- Read `documentation/UNanofabTools/flaskserver/04-database-schema.md`.
- Read `documentation/UNanofabTools/flaskserver/05-http-api-reference.md`.
- Write a drift-check note for one chemical inventory endpoint.

## Week 5 - Security And Data Supply

Run:

- [`module-12-security-model.md`](module-12-security-model.md)
- [`module-13-hscdownloader.md`](module-13-hscdownloader.md)
- [`module-14-file-transfers.md`](module-14-file-transfers.md)

Expected outcome:

- The maintainer can classify security work by owner.
- The maintainer can explain downloader freshness.
- The maintainer can distinguish CORES data from machine-control-PC logs.
- The maintainer understands personal-account upload risk.

Homework:

- Produce a security punch list grouped by Nanofab-actionable, IT-ticket, and needs-evidence.
- Check whether data freshness monitoring exists or needs a known-issues entry.

## Week 6 - Firmware, Desktop Tools, And Legacy Context

Run:

- [`module-15-pico-particle.md`](module-15-pico-particle.md)
- [`module-16-other-tools.md`](module-16-other-tools.md)
- [`module-17-legacy-server.md`](module-17-legacy-server.md)

Expected outcome:

- The maintainer can identify canonical vs historical code.
- The maintainer can name every smaller tool and its purpose.
- The maintainer understands that `hscdisplayerserver` is deprecated.

Homework:

- Choose two smaller tools and summarize their source location, purpose, and maintenance priority.
- Confirm no first-priority plan depends on improving deprecated `hscdisplayerserver`.

## Week 7 - Triage And Evidence Audit

Run:

- [`module-18-known-issues-triage.md`](module-18-known-issues-triage.md)
- [`module-19-path-d-audit-practice.md`](module-19-path-d-audit-practice.md)

Expected outcome:

- The maintainer has a written maintenance plan.
- The maintainer has practiced a mechanical audit.
- The maintainer has performed at least one docs-to-source drift check.
- The maintainer understands how to handle context-check hits.

Homework:

- Produce next 7 days, next 30 days, next quarter, and IT-ticket lists.
- Run a second endpoint drift check independently.

## Week 8 Or Later - Scenario Rehearsal And Exit

Run:

- [`module-20-operational-scenarios.md`](module-20-operational-scenarios.md)
- [`module-21-final-no-contact-check.md`](module-21-final-no-contact-check.md)

Expected outcome:

- The maintainer can handle common failure scenarios without Faith.
- The maintainer has access, notes, source repo locations, known issues, and a maintenance plan.
- The no-contact check passes.

If the no-contact check fails:

- Do not call the handoff complete.
- Write down the missing evidence.
- Schedule another session.
- Update docs or known issues before trying again.
