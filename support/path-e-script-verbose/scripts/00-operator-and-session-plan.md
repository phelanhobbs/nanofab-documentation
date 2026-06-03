# Verbose Maximal Path E - Operator And Session Plan

This file starts the tier. It is generated from the existing Path E script pack and tier settings. Read it before the module files.

Target word count: 250000 words minimum.



# Existing Operator Protocol

# Path E Operator Protocol

Use this protocol for every module in this script pack.

## Roles

Presenter means the person reading the script and driving slides, terminals, and documents.

Maintainer means the future maintainer receiving the handoff.

Robot means a presenter with no private context. If you are a human with private context, still follow the robot rules. They prevent accidental omissions.

## Script Markers

`READ ALOUD` means read the text verbatim or as close to verbatim as possible.

`SHOW` means switch the visible screen to the named deck, document, source file, web page, or terminal.

`DO` means perform the command or action. If it is unsafe, read the instruction and explain why you are skipping it.

`PAUSE` means stop talking long enough for the maintainer to inspect, write notes, or ask a question.

`ASK` means ask the question and wait for the maintainer to answer in their own words.

`REQUIRE` means do not move on until the maintainer can perform or explain the item.

`LOG` means write down the answer, confusion, or finding in an audit notes file.

`STOP POINT` means the module can end there. Assign homework and schedule the next session.

## Global Safety Rules

READ ALOUD:

"Before we begin, I am going to state the safety rules that apply to every session. We do not show secret values on screen. We do not paste bearer tokens, WiFi passwords, database passwords, Duo secrets, or private keys. We do not edit production files during a handoff unless this has explicitly become a maintenance session. If we enter tmux on the live server, we detach with `Ctrl-b d`. We do not press `Ctrl-c` inside a live service pane. We do not type `exit` inside a live service pane unless we intentionally want to terminate that shell or process."

"If a command might expose secrets, we either do not run it on the projected screen, or we run a safer command that shows only key names, filenames, process names, or service names. The goal is evidence without disclosure."

## Workspace Setup

SHOW:

- `START-HERE.md` (repo path: START-HERE.md)
- `support/PRESENTATION-GUIDE.md` (repo path: support/PRESENTATION-GUIDE.md)
- this script pack

DO:

Open terminals in:

```sh
cd nanofab-documentation
cd ../UNanofabTools
cd ../NanofabToolkit
```

If a source repo is missing, stop the source-code portions of the handoff and log that as a handoff risk.

DO:

From the documentation repo, run:

```sh
git status --short --branch
bash support/audit.sh
```

READ ALOUD:

"The documentation repo is not the application source. It is the handoff bundle. The source repos are expected beside it as sibling directories. Whenever we verify code, we use `../UNanofabTools` and `../NanofabToolkit`. If those are missing, the documentation cannot be fully verified."

## Evidence Log

DO:

Create or open a notes file for this handoff. A temporary file is acceptable at first:

```sh
mkdir -p /tmp/nanofab-path-e
touch /tmp/nanofab-path-e/handoff-notes.md
```

Use this structure:

```md
# Path E Handoff Notes - YYYY-MM-DD

## Participants
- Presenter:
- Maintainer:

## Repos
- nanofab-documentation:
- UNanofabTools:
- NanofabToolkit:

## Live Server Access
- Access available:
- User used:
- Survey snapshot:

## Questions That Need Documentation
- None yet.

## Findings
- None yet.
```

READ ALOUD:

"Any answer that depends on memory gets written down. Any confusion that lasts more than a minute becomes either a documentation update, a known-issues item, or an explicit open question. A good handoff removes dependence on Faith, including dependence on vague recollection."

## Source Of Truth Order

READ ALOUD:

"When two things disagree, we use this source-of-truth order. First is live production state observed directly on `nfhistory`. Second is current source code in the active production checkout. Third is current source code in the canonical Git repos. Fourth is database schemas, migrations, and live database introspection. Fifth is current developer documentation. Sixth is layman documentation and slides. Seventh is historical snapshots. Last is memory, assumptions, old chat notes, or what someone remembers."

"If a lower source disagrees with a higher source, we update the lower source or write a known-issues item explaining why it is intentionally different."

## Explain-Back Standard

At the end of every module, the maintainer must explain the module in their own words. The presenter must not rescue the answer too early.

ASK:

| Question | Expected answer |
|---|---|
| What did this module establish? | The maintainer should summarize the module's core fact, workflow, or decision rule in their own words, not quote the slide title. |
| What file or live evidence proves it? | They should name the specific deck, README, developer doc, source file, audit output, live command, or snapshot used as evidence. |
| What part is Nanofab-owned? | App code, docs, known-issues updates, `HSCDownloader.py`, the Flask app, chem DB usage, data trees, and work under `/home/phelan/` when applicable. |
| What part is University IT-owned? | VM infrastructure, root, `/root/`, root SSH, UNIX account creation, VM-level backup, base patching, and firewall-level infrastructure when applicable. |
| What should be checked again later? | Any source/live drift, missing evidence, unresolved question, backup coverage, access state, or known issue that was not fully verified during the module. |

REQUIRE:

The maintainer can answer without reading the script word for word. If they cannot, repeat the relevant section, open the referenced docs, and log what was unclear.

## Stop Conditions

Stop a module immediately if:

- a secret appears on screen;
- a live production command would be unsafe;
- a source repo is missing and the module depends on source inspection;
- the maintainer cannot explain a prerequisite module;
- a documented path or command appears stale;
- the presenter does not know whether an action is Nanofab-owned or IT-owned.

READ ALOUD:

"Stopping is not failure. Stopping is how we avoid inventing answers. When we stop, we write down what blocked us and decide what evidence would resolve it."

## End-Of-Session Closeout

At the end of each session:

DO:

1. Review the notes file.
2. List every unanswered question.
3. Assign reading or evidence collection for the next session.
4. Confirm no secrets were copied into notes.
5. If documentation was edited, run `bash support/audit.sh` and `git diff --check`.

READ ALOUD:

"The handoff is cumulative. We do not rely on remembering what happened last time. We leave each session with notes, homework, and a clear next step."


# Existing Weekly Rollout Plan

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

- `00-operator-protocol.md` (repo path: support/path-e-script/00-operator-protocol.md)
- `module-00-set-the-contract.md` (repo path: support/path-e-script/module-00-set-the-contract.md)
- `module-01-big-picture.md` (repo path: support/path-e-script/module-01-big-picture.md)
- `module-02-live-server.md` (repo path: support/path-e-script/module-02-live-server.md)
- `module-03-server-access.md` (repo path: support/path-e-script/module-03-server-access.md)

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

- `module-04-flask-startup.md` (repo path: support/path-e-script/module-04-flask-startup.md)
- `module-05-configuration-local-dev.md` (repo path: support/path-e-script/module-05-configuration-local-dev.md)
- `module-06-auth-admin.md` (repo path: support/path-e-script/module-06-auth-admin.md)

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

- `module-07-tasks.md` (repo path: support/path-e-script/module-07-tasks.md)
- `module-08-machines-logs.md` (repo path: support/path-e-script/module-08-machines-logs.md)
- `module-09-device-apis.md` (repo path: support/path-e-script/module-09-device-apis.md)

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

- `module-10-chemical-inventory.md` (repo path: support/path-e-script/module-10-chemical-inventory.md)
- `module-11-request-lifecycle-endpoints.md` (repo path: support/path-e-script/module-11-request-lifecycle-endpoints.md)

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

- `module-12-security-model.md` (repo path: support/path-e-script/module-12-security-model.md)
- `module-13-hscdownloader.md` (repo path: support/path-e-script/module-13-hscdownloader.md)
- `module-14-file-transfers.md` (repo path: support/path-e-script/module-14-file-transfers.md)

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

- `module-15-pico-particle.md` (repo path: support/path-e-script/module-15-pico-particle.md)
- `module-16-other-tools.md` (repo path: support/path-e-script/module-16-other-tools.md)
- `module-17-legacy-server.md` (repo path: support/path-e-script/module-17-legacy-server.md)

Expected outcome:

- The maintainer can identify canonical vs historical code.
- The maintainer can name every smaller tool and its purpose.
- The maintainer understands that `hscdisplayerserver` is deprecated.

Homework:

- Choose two smaller tools and summarize their source location, purpose, and maintenance priority.
- Confirm no first-priority plan depends on improving deprecated `hscdisplayerserver`.

## Week 7 - Triage And Evidence Audit

Run:

- `module-18-known-issues-triage.md` (repo path: support/path-e-script/module-18-known-issues-triage.md)
- `module-19-path-d-audit-practice.md` (repo path: support/path-e-script/module-19-path-d-audit-practice.md)

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

- `module-20-operational-scenarios.md` (repo path: support/path-e-script/module-20-operational-scenarios.md)
- `module-21-final-no-contact-check.md` (repo path: support/path-e-script/module-21-final-no-contact-check.md)

Expected outcome:

- The maintainer can handle common failure scenarios without Faith.
- The maintainer has access, notes, source repo locations, known issues, and a maintenance plan.
- The no-contact check passes.

If the no-contact check fails:

- Do not call the handoff complete.
- Write down the missing evidence.
- Schedule another session.
- Update docs or known issues before trying again.


# Tier Session Plan

## Session 1

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 2

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 3

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 4

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 5

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 6

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 7

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 8

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 9

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 10

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 11

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 12

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 13

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 14

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 15

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 16

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 17

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 18

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 19

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 20

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 21

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

## Session 22

READ ALOUD:

We begin this session by reviewing the prior notes, unresolved questions, and safety rules. We end by writing evidence, assigning homework, and checking whether any documentation or known-issues file must change before the next session.

DO:

- Confirm branch and source repo state.
- Confirm whether live access is needed.
- Confirm no secret-bearing screen is projected.
- Run the support audit if documentation changed.
- Ask for a teach-back from the prior session before adding new material.

