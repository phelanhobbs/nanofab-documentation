# Minimum Acceptable Full Path E Script

This file is generated from the existing Path E script pack, the handoff documentation corpus, and expanded presenter rehearsal sections. It is intended to be read aloud over many sessions. Do not treat the word count as a reason to skip demos, explain-back checks, or evidence logging.

Target word count: 50000 to 100000 words.



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



# Existing Path E v1 Script File: 00-operator-protocol.md

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

- `../../START-HERE.md` (reference path: ../../START-HERE.md)
- `../PRESENTATION-GUIDE.md` (reference path: ../PRESENTATION-GUIDE.md)
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


# Existing Path E v1 Script File: README.md

# Path E Verbatim Handoff Script Pack

This directory contains a read-aloud script set for Path E: the exhaustive, slide-supported handoff to a future maintainer.

The shorter guide at `../PRESENTATION-GUIDE.md` (reference path: ../PRESENTATION-GUIDE.md) tells a human presenter how to think about the handoff. This script pack is more literal. It is written so a presenter with no private context can open the files in order and run the handoff over several weeks or months.

## How To Use This Pack

Read `00-operator-protocol.md` (reference path: 00-operator-protocol.md) before presenting anything. It defines the rules for reading, pausing, demos, safety, evidence logging, and explain-back checks.

Use `weekly-rollout-plan.md` (reference path: weekly-rollout-plan.md) to spread the modules across weeks or months.

Longer generated tiers are available beside this directory:

- `../path-e-script-minimum/README.md` (reference path: ../path-e-script-minimum/README.md) — 50k-100k target tier.
- `../path-e-script-medium/README.md` (reference path: ../path-e-script-medium/README.md) — 100k-250k target tier.
- `../path-e-script-verbose/README.md` (reference path: ../path-e-script-verbose/README.md) — 250k+ target tier.

Then run the module scripts in order:

| Module | Script | Primary Outcome |
|---|---|---|
| 0 | `module-00-set-the-contract.md` (reference path: module-00-set-the-contract.md) | Establish the handoff contract, workspace, source-of-truth order, and safety rules. |
| 1 | `module-01-big-picture.md` (reference path: module-01-big-picture.md) | Build the full system map before discussing code. |
| 2 | `module-02-live-server.md` (reference path: module-02-live-server.md) | Explain what is actually running on `nfhistory`. |
| 3 | `module-03-server-access.md` (reference path: module-03-server-access.md) | Teach safe SSH and tmux inspection without killing live services. |
| 4 | `module-04-flask-startup.md` (reference path: module-04-flask-startup.md) | Explain `run.py`, app factory startup, config, extensions, and blueprints. |
| 5 | `module-05-configuration-local-dev.md` (reference path: module-05-configuration-local-dev.md) | Explain configuration, environment variables, local development, and secret boundaries. |
| 6 | `module-06-auth-admin.md` (reference path: module-06-auth-admin.md) | Explain login, sessions, Duo, admin powers, and auth risks. |
| 7 | `module-07-tasks.md` (reference path: module-07-tasks.md) | Walk through the task tracker as a normal user-facing feature. |
| 8 | `module-08-machines-logs.md` (reference path: module-08-machines-logs.md) | Explain machine pages, `HSCDATA`, `LogData`, file browsing, graphs, and data durability. |
| 9 | `module-09-device-apis.md` (reference path: module-09-device-apis.md) | Explain Pico/device endpoints, sensor storage, and unauthenticated API risks. |
| 10 | `module-10-chemical-inventory.md` (reference path: module-10-chemical-inventory.md) | Explain the chemical inventory feature and local PostgreSQL dependency. |
| 11 | `module-11-request-lifecycle-endpoints.md` (reference path: module-11-request-lifecycle-endpoints.md) | Trace requests end to end and teach endpoint drift audits. |
| 12 | `module-12-security-model.md` (reference path: module-12-security-model.md) | Explain security strengths, known gaps, and Nanofab-vs-IT responsibility. |
| 13 | `module-13-hscdownloader.md` (reference path: module-13-hscdownloader.md) | Explain CORES data ingestion and `HSCDownloader.py`. |
| 14 | `module-14-file-transfers.md` (reference path: module-14-file-transfers.md) | Explain machine-control-PC upload scripts and account dependencies. |
| 15 | `module-15-pico-particle.md` (reference path: module-15-pico-particle.md) | Explain canonical Pico firmware and ParticleSensor code. |
| 16 | `module-16-other-tools.md` (reference path: module-16-other-tools.md) | Explain remaining desktop/data tools and how deeply to maintain each. |
| 17 | `module-17-legacy-server.md` (reference path: module-17-legacy-server.md) | Explain deprecated `hscdisplayerserver` without reviving it. |
| 18 | `module-18-known-issues-triage.md` (reference path: module-18-known-issues-triage.md) | Turn known issues into a maintenance plan. |
| 19 | `module-19-path-d-audit-practice.md` (reference path: module-19-path-d-audit-practice.md) | Practice a real Path D evidence audit. |
| 20 | `module-20-operational-scenarios.md` (reference path: module-20-operational-scenarios.md) | Rehearse outage, drift, restore, access, and security scenarios. |
| 21 | `module-21-final-no-contact-check.md` (reference path: module-21-final-no-contact-check.md) | Verify the maintainer can continue without Faith. |

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


# Existing Path E v1 Script File: module-00-set-the-contract.md

# Module 0 - Set The Contract

## Goal

The maintainer understands what this handoff is, how the documentation repo is organized, where source repos must live, what evidence outranks what, and what safety rules apply before any live system is touched.

## Required Screen

SHOW:

- `../../START-HERE.md` (reference path: ../../START-HERE.md), especially Path E and Path D.
- `../PRESENTATION-GUIDE.md` (reference path: ../PRESENTATION-GUIDE.md).
- `00-operator-protocol.md` (reference path: 00-operator-protocol.md).

## Verbatim Script

READ ALOUD:

"This is the full maintainer handoff. It is not a quick overview and it is not a slide tour. The goal is that, after this process, you can operate, audit, recover, and extend the system without needing to contact Faith."

"I am going to over-explain. That is intentional. This system is a website, a live server, a set of data pipelines, a chemical inventory system, a collection of desktop tools, Pico firmware, shared-account access, and a boundary with University IT. A shallow handoff would make the pieces feel familiar but would not make you operationally independent."

"We will use slides, but the slides are not the source of truth. They are a map. The truth comes from the documentation, the source code, the live server, database state when needed, known-issues files, and recorded evidence."

"This documentation repository is a documentation bundle. It intentionally does not contain the full application source trees. For source-code verification, the source repositories must sit beside it as sibling directories named `../UNanofabTools` and `../NanofabToolkit`. If those repos are missing, that is a high-severity handoff risk. The docs alone are not enough to safely maintain the system."

SHOW:

The directory table at the top of `../../START-HERE.md` (reference path: ../../START-HERE.md).

READ ALOUD:

"There are three main documentation trees. `presentation/` contains plain-English READMEs and slide decks. `documentation/` contains developer references and runbooks. `known-issues/` contains bugs, risks, tech debt, and recommended fixes. The source repos live beside this documentation repo, not inside it."

"The handoff has several paths. Path A is a normal live multi-session handoff. Path B is a management presentation. Path C is a solo successor reading path. Path D is the no-human-context evidence audit. Path E is what we are doing now: a complete, slide-supported, live presentation designed to make the maintainer independent."

SHOW:

Path D in `../../START-HERE.md` (reference path: ../../START-HERE.md#path-d-long-term-maintainer-deep-dive).

READ ALOUD:

"Path E borrows Path D's standard of evidence. We do not just say the docs are true. We show how to verify them. We compare docs against source, source against live state, and live state against known-issues files. When something disagrees, we do not smooth it over. We write it down."

## Setup Demo

DO:

In the documentation repo:

```sh
git status --short --branch
bash support/audit.sh
```

READ ALOUD:

"This audit script is a mechanical first pass. It checks coverage, internal links, stale paths, and several known stale-fact patterns. It is not a substitute for judgment, but it prevents easy mistakes."

If the audit reports `create UNIX users` or `iceolate` references:

READ ALOUD:

"These are context-check hits. We read the surrounding text. The correct framing is that University IT owns root, root SSH, VM-level backup, and UNIX account creation. Nanofab has `sudo` as `phelan`, not root. Anything requiring `useradd` or `/root/` is an IT ticket, not a Nanofab-only task."

## Safety Contract

READ ALOUD:

"Before touching the live server, we agree to the safety contract. We never show secret values. We never paste bearer tokens, WiFi passwords, database passwords, Duo secrets, or private keys. If we need to discuss `.env`, we discuss key names only. If we attach to tmux, we detach with `Ctrl-b d`. We do not press `Ctrl-c` inside a service pane. We do not type `exit` inside a service pane. We do not edit production files during the handoff unless the session has explicitly become a maintenance session."

"If either of us is uncertain whether an action is safe, we stop. We write down what evidence is needed, and we do not improvise on production."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What are the three main documentation trees? | `presentation/`, `documentation/`, and `known-issues/`. |
| Where are the two source repos expected to live? | As sibling directories beside this docs repo: `../UNanofabTools` and `../NanofabToolkit`. |
| What is the difference between Path C, Path D, and Path E? | Path C is self-paced reading, Path D is evidence-based audit/ownership, and Path E is the full live presenter-led handoff using slides, demos, and explain-back checks. |
| What is the source-of-truth order when docs, source, and live state disagree? | Live production state first, then active production source, canonical repo source, live schemas/introspection, developer docs, layman docs/slides, snapshots, and finally memory or assumptions. |
| What should happen if a command might reveal secrets? | Stop or run it only in an unprojected/safe way; show key names or non-secret metadata only, never secret values. |

REQUIRE:

The maintainer can explain that this is a documentation-only GitHub repo and that source-code verification requires sibling source repos.

## Stop Point

STOP POINT:

End the first mini-session here if setup was difficult, source repos were missing, or the maintainer needs time to read `../../START-HERE.md` (reference path: ../../START-HERE.md).

Homework:

- Read `../../START-HERE.md` (reference path: ../../START-HERE.md) through Path E.
- Skim `../PRESENTATION-GUIDE.md` (reference path: ../PRESENTATION-GUIDE.md).
- Confirm local access to `../UNanofabTools` and `../NanofabToolkit`.


# Existing Path E v1 Script File: module-01-big-picture.md

# Module 1 - Big Picture Of The Server

## Goal

The maintainer can describe the whole system in plain English before seeing implementation detail: who uses it, what data enters it, what data leaves it, where it runs, and what the major ownership boundaries are.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/flaskserver/slides/00-Start-Here-Index.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/00-Start-Here-Index.pptx)
- `../../presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx)
- `../../presentation/UNanofabTools/flaskserver/README.md` (reference path: ../../presentation/UNanofabTools/flaskserver/README.md)
- `../../documentation/UNanofabTools/flaskserver/01-architecture.md` (reference path: ../../documentation/UNanofabTools/flaskserver/01-architecture.md)

## Verbatim Script

READ ALOUD:

"We start with the big picture because code is easier to understand after the system has a shape. `nfhistory` is not just a Flask app. It is the hub where cleanroom users, machine logs, CORES data, chemical inventory, sensor devices, desktop tools, and University IT-owned infrastructure meet."

SHOW:

Open `00-Start-Here-Index.pptx`.

READ ALOUD:

"This first deck tells us how the slide series is organized. Treat it as the table of contents. We are not trying to memorize every deck. We are learning where truth lives and how each deck maps to a specific part of the documentation and source code."

SHOW:

Open `01-Server-Overview.pptx`.

READ ALOUD:

"The user-facing story is simple. Cleanroom users open a website. They log in. They see tasks, machine pages, machine logs, chemical inventory, and sensor views. Some of that data is entered by people. Some is uploaded by devices. Some is copied from machine-control PCs. Some is pulled from CORES by `HSCDownloader.py`. Some is stored in SQLite. The chemical inventory uses a local PostgreSQL database. A lot of operational data is also stored as file trees: `HSCDATA`, `LogData`, and `uploads`."

"The technical story is that public HTTPS traffic reaches nginx on `nfhistory`. nginx terminates TLS and proxies to the Flask app on loopback. Flask routes requests through blueprints. User-facing routes use login and session checks. Device routes are different: some are intentionally unauthenticated because Pico devices post data to them. The app reads and writes databases and file trees. The result is a website that looks like one application but is actually a coordination point for several data sources."

SHOW:

Open `../../documentation/UNanofabTools/flaskserver/01-architecture.md` (reference path: ../../documentation/UNanofabTools/flaskserver/01-architecture.md).

READ ALOUD:

"This architecture document is the technical version of the overview deck. The deck is useful for presentation. This document is useful when something breaks. Notice that the docs should name real paths, real modules, real databases, and real dependencies. We want documentation that can be acted on, not just understood abstractly."

## System Map Exercise

DO:

On a whiteboard or notes file, write:

```text
Users and browsers
  -> nginx and TLS on nfhistory
  -> Flask app
  -> blueprints and services
  -> SQLite, local PostgreSQL, HSCDATA, LogData, uploads

CORES and n8n
  -> HSCDownloader.py
  -> HSCDATA
  -> machine pages

Machine control PCs
  -> file-transfer scripts
  -> LogData
  -> machine pages and plots

Pico devices
  -> device API routes
  -> sensor storage and views

NanofabToolkit desktop tools
  -> local files or nfhistory APIs, depending on tool
```

READ ALOUD:

"This map is intentionally plain. A future maintainer should be able to redraw it without the slides. If they cannot, they are not ready to debug the system. Most operational confusion comes from mixing up the website, the live server, the data pipelines, and the desktop tools."

## Ownership Frame

READ ALOUD:

"There are four boundaries we will repeat constantly. First, user-facing website versus background data supply. Second, application code versus live production state. Third, Nanofab-owned operational surface versus University IT-owned infrastructure. Fourth, current canonical code versus historical or deprecated code."

"University IT owns the VM, root, root SSH, OS-level backup, and base patching. Nanofab owns the Flask app, `HSCDownloader.py`, the chemical inventory's use of PostgreSQL, cleanroom data trees, and everything under `/home/phelan/`. The Nanofab admin has `sudo` as `phelan`, not root. Nanofab cannot create UNIX users. That fact matters because it changes what counts as a fix."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What does `nfhistory` do for a normal cleanroom user? | It provides the cleanroom website: login, tasks, machine pages/logs, chemical inventory, and sensor views. |
| What data comes from CORES? | Machine usage data pulled by `HSCDownloader.py` and written into `HSCDATA`. |
| What data comes from machine-control PCs? | Tool log files uploaded by file-transfer scripts into `LogData`. |
| What data comes from Pico devices? | Particle/environment sensor payloads posted to device API routes. |
| What is nginx doing? | It handles public HTTPS/TLS and proxies requests to the Flask app on loopback. |
| What is Flask doing? | It routes browser/device requests through blueprints, auth checks, services, templates, databases, and file trees. |
| Which data stores are databases? | Several SQLite databases plus the local PostgreSQL database used for chemical inventory. |
| Which data stores are file trees? | `HSCDATA`, `LogData`, `uploads`, and sensor/log file directories. |
| What does University IT own? | The VM, root, root SSH, base patching, VM-level/off-box backup, and UNIX account creation. |
| What does Nanofab own? | The Flask app, downloader, application docs, app/data behavior, chem DB usage, data trees, and `/home/phelan/` operational surface. |

REQUIRE:

The maintainer can draw the system map from memory and identify at least one data producer, one web-facing component, one database, one file tree, and one IT-owned component.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot explain the system map without looking. Assign them to reread the server overview README and architecture doc before the next session.


# Existing Path E v1 Script File: module-02-live-server.md

# Module 2 - What Is Actually Running On `nfhistory`

## Goal

The maintainer understands the difference between the ideal deployment and the verified live deployment on `nfhistory`.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/liveserver/slides/Live-Server.pptx` (reference path: ../../presentation/UNanofabTools/liveserver/slides/Live-Server.pptx)
- `../../presentation/UNanofabTools/liveserver/README.md` (reference path: ../../presentation/UNanofabTools/liveserver/README.md)
- `../../documentation/UNanofabTools/liveserver/README.md` (reference path: ../../documentation/UNanofabTools/liveserver/README.md)
- `../../known-issues/UNanofabTools/liveserver.md` (reference path: ../../known-issues/UNanofabTools/liveserver.md)

## Verbatim Script

READ ALOUD:

"Now we move from the conceptual system to the live server. This distinction matters. Documentation often describes a desired shape. Production is the verified shape. When the two disagree, production wins and the docs must either be updated or must explicitly say they are describing a migration target."

SHOW:

Open `Live-Server.pptx`.

READ ALOUD:

"The live server is named `nfhistory`. The documented live-state snapshot says it is at IP `155.98.11.8`, running Debian 13, with kernel 6.12. nginx handles public HTTPS. TLS is Let's Encrypt and auto-renewed by certbot. The chemical PostgreSQL database is local on the same VM, listening on `127.0.0.1:5432`. The Flask app and `HSCDownloader.py` currently run inside tmux sessions named `flaskserver` and `downloader`. They are not systemd services yet."

"That last point is one of the most important operational facts in the whole handoff. A tmux session can keep a process alive after logout, but tmux is not a supervisor. If the process crashes, tmux may keep the shell open while the service is down. If the server reboots, the sessions do not automatically come back. Moving Flask and the downloader under systemd is a major reliability improvement that the Nanofab team can own."

SHOW:

Open `../../documentation/UNanofabTools/liveserver/README.md` (reference path: ../../documentation/UNanofabTools/liveserver/README.md).

READ ALOUD:

"The live-server developer document is a populated inventory. It should contain exact service names, paths, listener facts, snapshots, and findings. The top findings here intentionally mirror the known-issues file. That is important: a maintainer should not need to hunt through three places to discover the same serious risk."

SHOW:

Open `../../known-issues/UNanofabTools/liveserver.md` (reference path: ../../known-issues/UNanofabTools/liveserver.md).

READ ALOUD:

"The known-issues file is the maintenance list. It is not an apology. It is the honest state of the system. Notice that some items are Nanofab-actionable and some are IT-bound. Root SSH, root-owned files, base patching, VM-level backup, and UNIX account creation are University IT territory. The Flask app, downloader, docs, chemical inventory application behavior, and data trees under `/home/phelan/` are Nanofab territory."

## Optional Live Demo

If live access is available and safe:

DO:

```sh
hostname
uname -a
tmux ls
ss -tulpn
systemctl status nginx
systemctl status postgresql@17-main
```

READ ALOUD:

"This demo is read-only. We are not changing production. We are using commands that show host identity, kernel, tmux sessions, network listeners, and service status. We are not opening secret-bearing files."

If live access is not available:

READ ALOUD:

"We are not running the live demo because live access is not available or not safe in this session. That is acceptable, but we must record it. A maintainer who has never verified live state should not claim full operational readiness."

LOG:

Record whether live access was available.

## Key Facts To Repeat

READ ALOUD:

"Repeat these facts until they are boring. The live Flask app install path is `/home/phelan/server/UNanofabTools/`. `HSCDownloader.py` lives in that same directory. The chem PostgreSQL database is local, not external. Backups are handled off-box by University IT, but backup coverage should be confirmed with IT. The Flask app and downloader are in tmux, not systemd. Nanofab has `sudo` as `phelan`, not root."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What is the live server name? | `nfhistory`. |
| What does nginx do on the live server? | It terminates public HTTPS/TLS and proxies to the Flask app behind it. |
| What process serves Flask today? | The live docs show `python run.py` running in the `flaskserver` tmux session, not a systemd unit. |
| What process writes `HSCDATA` today? | `HSCDownloader.py`, running from the `downloader` tmux session. |
| Why is tmux-only supervision a reliability risk? | tmux keeps a terminal alive but does not restart crashed services or bring them back after reboot. |
| Where is the live Flask app installed? | `/home/phelan/server/UNanofabTools/`. |
| Is chem PostgreSQL local or external? | Local on `nfhistory`, bound to `127.0.0.1:5432`. |
| Which live-server findings are Nanofab-actionable? | App/downloader supervision, app config, docs, health checks, app-level security, data freshness checks, and work under `/home/phelan/`. |
| Which findings require University IT? | Root-owned files, root SSH, VM backup/patching, UNIX accounts, and other root/VM infrastructure changes. |

REQUIRE:

The maintainer can say: "The app and downloader currently run in tmux. Moving them to systemd is a Nanofab-owned reliability improvement. Root, root SSH, VM-level backup, and UNIX account creation are IT-owned."

## Stop Point

STOP POINT:

Stop here if the maintainer confuses tmux with systemd, local PostgreSQL with external PostgreSQL, or Nanofab-owned work with IT-owned work.


# Existing Path E v1 Script File: module-03-server-access.md

# Module 3 - Server Access And Safe Inspection

## Goal

The maintainer can explain and perform safe server access: two-hop SSH, shared `phelan` UNIX account, tmux inspection, safe detach, and non-destructive survey collection.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx` (reference path: ../../presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx)
- `../../presentation/UNanofabTools/serveraccess/README.md` (reference path: ../../presentation/UNanofabTools/serveraccess/README.md)
- `../../documentation/UNanofabTools/serveraccess/README.md` (reference path: ../../documentation/UNanofabTools/serveraccess/README.md)
- `../../known-issues/UNanofabTools/serveraccess.md` (reference path: ../../known-issues/UNanofabTools/serveraccess.md)

## Verbatim Script

READ ALOUD:

"Access is one of the most important parts of the handoff because a maintainer can understand the architecture and still accidentally take the site down by mishandling tmux. We will go slowly."

SHOW:

Open `Server-Access.pptx`.

READ ALOUD:

"The access path is two-hop. First, the maintainer reaches CADE. Second, from CADE, they SSH to `nfhistory`. On `nfhistory`, the Nanofab-side login is the shared UNIX account `phelan`. That is not ideal as a long-term identity model, but it is the current operational boundary. Nanofab cannot create UNIX accounts. University IT controls root and `useradd`."

"Per-person identity exists as SSH keys or labels within the shared `phelan` access model. If the team wants per-person UNIX accounts on `nfhistory`, that is an IT ticket. It is not something the Nanofab maintainer can implement by editing app code."

SHOW:

The tmux slides in `Server-Access.pptx`.

READ ALOUD:

"The two sessions that matter are `flaskserver` and `downloader`. `flaskserver` hosts the website process. `downloader` hosts `HSCDownloader.py`, which pulls CORES data and writes `HSCDATA`. A tmux session is like a saved terminal. You can attach to look at it. You detach to leave it running."

"The safe ritual is: attach, look, detach with `Ctrl-b d`. Do not type `exit`. Do not press `Ctrl-c`. If you type `exit`, you may close the shell tmux is hosting. If you press `Ctrl-c`, you send an interrupt to the running process. Either mistake can stop the service."

## Live Demo

If safe and access is available:

DO:

1. SSH through the documented path.
2. Run:

```sh
tmux ls
```

3. Attach read-only if possible, or attach normally only for a controlled demo:

```sh
tmux attach -t flaskserver
```

4. Look. Do not type into the service.
5. Detach with `Ctrl-b d`.
6. Repeat for:

```sh
tmux attach -t downloader
```

7. Detach with `Ctrl-b d`.

READ ALOUD:

"I am detaching, not exiting. Detach means the program continues running. Exiting would close the shell. `Ctrl-c` would interrupt the process. This distinction is operationally important."

If live access is unavailable:

READ ALOUD:

"We are skipping the live attach because access is unavailable or unsafe. The maintainer still needs to practice this later. Until they have attached and detached safely, access training is not complete."

LOG:

Record whether the maintainer practiced attaching and detaching.

## Survey Script

READ ALOUD:

"The survey script is the read-only way to capture live-server facts. A survey snapshot is evidence. It lets future maintainers compare what the live server was doing at a specific time against what the docs claim."

DO IF SAFE:

```sh
bash ~/survey_nfhistory.sh | tee /tmp/nfhistory_survey_$(date +%F).txt
```

READ ALOUD:

"Before committing any snapshot, inspect it for secrets. Keep paths, key names, service names, package names, timestamps, and non-secret operational facts. Redact secret values."

## Recovery Frame

READ ALOUD:

"The current recovery shape is tmux-based. If `flaskserver` is gone, the documented stopgap is to recreate the tmux session, `cd` to `~/server/UNanofabTools`, activate the venv, run `python run.py`, and detach. If `downloader` is gone, the shape is similar, but the command is `python3 HSCDownloader.py`. This is a recovery procedure, not the ideal target. The ideal target is supervised services."

SHOW:

The recovery commands in `../../documentation/UNanofabTools/serveraccess/README.md` (reference path: ../../documentation/UNanofabTools/serveraccess/README.md).

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What are the two SSH hops? | Laptop/workstation to CADE, then CADE to `nfhistory`. |
| Why does the SSH config use `User phelan`? | Nanofab users currently access `nfhistory` through the shared `phelan` UNIX account because IT controls UNIX account creation. |
| What are the two important tmux sessions? | `flaskserver` for the website and `downloader` for `HSCDownloader.py`. |
| What exact keys detach from tmux? | `Ctrl-b` followed by `d`. |
| Why is `Ctrl-c` dangerous in a live service pane? | It sends SIGINT to the running service process and can stop it. |
| Why is `exit` dangerous in a live service pane? | It can terminate the shell hosted by tmux and stop the service session. |
| What is Nanofab allowed to change? | Nanofab-owned app code, docs, known issues, app config under its control, service processes, and operational files under `/home/phelan/`. |
| What access changes require IT? | Creating UNIX users, changing root-owned files, modifying `/root/`, root SSH, VM-level access policy, and other root-only changes. |

REQUIRE:

The maintainer can recite: "Attach, look, detach with `Ctrl-b d`; do not exit; do not `Ctrl-c`."

## Stop Point

STOP POINT:

Stop here if the maintainer has not practiced safe detach. Assign practice in a non-production tmux session or schedule a supervised production inspection.


# Existing Path E v1 Script File: module-04-flask-startup.md

# Module 4 - How The Flask App Starts

## Goal

The maintainer understands the startup path from `run.py` through the app factory, configuration, extension initialization, blueprint registration, and route handling.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx)
- `../../presentation/UNanofabTools/flaskserver/02-How-It-Starts.md` (reference path: ../../presentation/UNanofabTools/flaskserver/02-How-It-Starts.md)
- `../../documentation/UNanofabTools/flaskserver/01-architecture.md` (reference path: ../../documentation/UNanofabTools/flaskserver/01-architecture.md)
- `../../documentation/UNanofabTools/flaskserver/02-getting-started.md` (reference path: ../../documentation/UNanofabTools/flaskserver/02-getting-started.md)
- Source files in `../UNanofabTools`

## Verbatim Script

READ ALOUD:

"Now we move from the live server to the Flask application. The question is: when someone starts the app, what happens first, and how does that become a set of web pages and API routes?"

SHOW:

Open `02-How-It-Starts.pptx`.

READ ALOUD:

"The entry point is `run.py`. That file is the first place to look when the app does not start. It selects or loads configuration, creates the Flask app, and runs it. Inside the app factory, extensions are initialized, paths are configured, blueprints are registered, and route functions become reachable."

"Blueprints are the app's feature modules. If a page or endpoint exists, it is probably in a blueprint. Understanding blueprints prevents the maintainer from searching randomly. They can ask: which feature owns this route, and which blueprint implements that feature?"

## Source Demo

DO:

In `../UNanofabTools`, show:

```text
run.py
app/__init__.py
app/blueprints/
```

DO:

Run:

```sh
rg -n "def create_app|register_blueprint|app.run|FLASK_ENV" ../UNanofabTools
```

READ ALOUD:

"This search is not just for show. It demonstrates how a maintainer verifies the startup story. If the docs say there is an app factory, we find the app factory. If the docs say blueprints register, we find the registration. If the docs say `run.py` is the development-style live command today, we verify that against source and live-state docs."

SHOW:

Open `../../documentation/UNanofabTools/flaskserver/01-architecture.md` (reference path: ../../documentation/UNanofabTools/flaskserver/01-architecture.md).

READ ALOUD:

"The architecture doc should tell the same story as the source. If a route exists in code but not in docs, the endpoint docs need updating. If docs describe a route that no longer exists, that is documentation drift. Path D audits are built around catching exactly that kind of mismatch."

## Important Distinction

READ ALOUD:

"There are two startup ideas to keep separate. First is the current live state: the app is running as `python run.py` inside tmux. Second is the recommended production target: a supervised service, likely systemd and a WSGI server such as gunicorn. The deployment docs may show the target shape. The live-server docs show what is true now."

"When you debug a current outage, you use the live-state procedure. When you improve reliability, you use the target deployment runbook and known-issues guidance."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What file starts the Flask app? | `run.py`. |
| What is an app factory? | The function that creates/configures the Flask app, initializes extensions, registers blueprints, and returns the app object. |
| What is a blueprint? | A Flask feature module that groups related routes/views and is registered with the app. |
| Where would you look if a route existed in source but did not respond? | Check blueprint registration in the app factory, route decorators, nginx/proxy behavior, auth guards, and live process state. |
| What is the difference between the current tmux startup and the recommended supervised target? | Current live state is `python run.py` inside tmux; target state is a supervised service such as systemd/gunicorn that restarts and survives reboot. |
| Why is `db.create_all()` or any implicit schema creation worth noticing? | It may hide missing migrations/schema drift and can make production schema changes less controlled. |

REQUIRE:

The maintainer can explain: `run.py -> create_app -> config -> extensions -> blueprints -> routes`.

## Stop Point

STOP POINT:

Stop here if the source repo is missing or if the maintainer cannot identify `run.py`, the app factory, and the blueprint folder.


# Existing Path E v1 Script File: module-05-configuration-local-dev.md

# Module 5 - Configuration And Local Development

## Goal

The maintainer understands configuration as an operational contract: environment variables, paths, database settings, Duo settings, local development behavior, and secret handling.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/flaskserver/slides/03-Configuration.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/03-Configuration.pptx)
- `../../presentation/UNanofabTools/flaskserver/03-Configuration.md` (reference path: ../../presentation/UNanofabTools/flaskserver/03-Configuration.md)
- `../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md` (reference path: ../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md)
- `../../documentation/UNanofabTools/flaskserver/02-getting-started.md` (reference path: ../../documentation/UNanofabTools/flaskserver/02-getting-started.md)
- `../UNanofabTools/config/config.py`

## Verbatim Script

READ ALOUD:

"Configuration is not decoration. Configuration determines what database files are used, where uploads go, whether Duo is enabled, how sessions behave, how large uploads can be, and how the app finds operational data. A maintainer who does not understand configuration will misdiagnose failures."

SHOW:

Open `03-Configuration.pptx`.

READ ALOUD:

"The live app uses environment-backed settings. Some settings are safe to document as values, such as non-secret paths or hostnames. Some settings are secret and must never be shown on screen or committed. We document key names and behavior. We do not document secret values."

SHOW:

Open `../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md` (reference path: ../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md).

READ ALOUD:

"This configuration reference should match the source. It should mention every environment variable used by `config.py`. If source uses an environment variable that the docs omit, a future maintainer may miss a required production setting. If docs list a variable source no longer uses, that is stale documentation."

## Source Demo

DO:

Run:

```sh
rg -n "os.getenv|CHEM_|DUO|SECRET|SESSION|SQLALCHEMY|UPLOAD|DATA" ../UNanofabTools/config
```

READ ALOUD:

"This command searches for configuration inputs. We are not reading `.env` secret values. We are reading the code that names the keys. This is safe and it is exactly how to verify docs against source."

SHOW:

Compare `../UNanofabTools/config/config.py` with `../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md` (reference path: ../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md).

READ ALOUD:

"Pay special attention to `SECRET_KEY`, Duo settings, SQLAlchemy settings, upload/data paths, and chemical database settings. The chemical database is local on `nfhistory`, not an external database server. The relevant host is `127.0.0.1` in the live deployment. That fact affects firewall assumptions, backup assumptions, and restore planning."

## Local Development

READ ALOUD:

"Local development is a different environment from production. Development defaults are useful for getting started, but they are not a security model. A local app can use local files and development settings. Production must use strong secrets, correct database paths, correct Duo settings, and durable operational data paths."

SHOW:

Open `../../documentation/UNanofabTools/flaskserver/02-getting-started.md` (reference path: ../../documentation/UNanofabTools/flaskserver/02-getting-started.md).

READ ALOUD:

"The getting-started doc should let a maintainer create a local environment without guessing. If a step fails because dependencies changed or a file moved, that is documentation drift. The fix is not to memorize the workaround. The fix is to update the doc."

## Secret Boundary

READ ALOUD:

"When discussing `.env`, we show key names only. For example, it is acceptable to say there is a `SECRET_KEY` setting or a `CHEM_PGHOST` setting. It is not acceptable to show the secret value. For old hard-coded secrets found in source, the documentation should preserve the fact that the secret exists and should be rotated, but the GitHub documentation bundle must not contain the literal secret."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Which configuration values are secrets? | `SECRET_KEY`, Duo secrets/keys, database passwords, bearer tokens, WiFi passwords, private keys, and any credential-like value. |
| Which configuration values point to databases? | SQLAlchemy/SQLite settings plus chemical PostgreSQL settings such as `CHEM_*` variables. |
| Which values control session or login behavior? | `SECRET_KEY`, session/cookie settings, login/auth config, and Duo-related settings. |
| What breaks if chemical database settings are wrong? | Chemical inventory routes cannot connect correctly; reads/writes, barcode operations, reports, and inventory pages can fail or hit the wrong database. |
| Why is local PostgreSQL an important fact? | Backup, firewall, restore, service health, and troubleshooting assumptions depend on PostgreSQL running locally on `nfhistory`. |
| What can be safely shown from `.env`? | Key names and non-secret operational metadata, not values. |
| What must never be shown or committed? | Literal secret values, tokens, passwords, Duo secrets, private keys, session cookies, and database passwords. |

REQUIRE:

The maintainer can identify production-sensitive config without seeing secret values and can explain how to compare env-var docs against `config.py`.

## Stop Point

STOP POINT:

Stop here if source and docs disagree on configuration. Log the mismatch, update docs later, and do not proceed as if configuration is understood.


# Existing Path E v1 Script File: module-06-auth-admin.md

# Module 6 - Authentication, Authorization, And Admin

## Goal

The maintainer understands how users log in, how sessions work, where Duo fits, how admin powers are guarded, and which authentication or authorization gaps require careful maintenance.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx)
- `../../presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx)
- `../../presentation/UNanofabTools/flaskserver/04-Authentication-and-Login.md` (reference path: ../../presentation/UNanofabTools/flaskserver/04-Authentication-and-Login.md)
- `../../presentation/UNanofabTools/flaskserver/05-Admin-Panel.md` (reference path: ../../presentation/UNanofabTools/flaskserver/05-Admin-Panel.md)
- `../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md` (reference path: ../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md)

## Verbatim Script

READ ALOUD:

"Authentication answers who you are. Authorization answers what you are allowed to do. The system needs both. A login page alone is not a security model. Hidden buttons alone are not a security model. Sensitive routes must be checked server-side."

SHOW:

Open `04-Authentication-and-Login.pptx`.

READ ALOUD:

"The login system uses stored user identity, password verification, sessions, and Duo where configured. Passwords should be hashed, not stored as plaintext. Sessions let the app remember that a user has authenticated. Duo adds a second factor. Each of those pieces has configuration and failure modes."

"If login works locally but not in production, do not assume the route is broken. Check configuration, secret values, Duo settings, callback behavior, session settings, and whether the production environment is using the expected database."

SHOW:

Open `05-Admin-Panel.pptx`.

READ ALOUD:

"Admin behavior must be enforced on the server. If a non-admin cannot see a button, that is helpful UI, but it is not enough. The route must check that the user is an admin before performing admin actions."

## Source Demo

DO:

Show:

```text
../UNanofabTools/app/blueprints/auth.py
../UNanofabTools/app/blueprints/admin.py
../UNanofabTools/app/services/auth_service.py
../UNanofabTools/app/services/admin_service.py
```

DO:

Run:

```sh
rg -n "login_required|admin_required|session|duo|hash|verify|toggle|deleteUser" ../UNanofabTools/app
```

READ ALOUD:

"This search proves where authentication and authorization live. We are looking for route decorators, session writes, Duo integration, password hashing, and admin mutations. When auditing security, do not read only the docs. Read the actual guard conditions."

SHOW:

Open `../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md` (reference path: ../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md).

READ ALOUD:

"This developer doc should contain the authorization matrix. If a route mutates users, admin status, passwords, tasks, or chemical inventory, the maintainer should be able to answer who can call it and where the check is enforced."

## Risk Framing

READ ALOUD:

"The risks in this area are high because mistakes can grant access or allow unauthorized changes. Important questions are: Are admin checks server-side? Are passwords hashed? Are Duo secrets protected? Are session settings production-appropriate? Are admin actions auditable? Do route docs match the source?"

"Any route drift here matters more than a cosmetic docs mismatch. If source has a new admin route and the docs do not mention it, the maintainer may not audit it."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What is the difference between authentication and authorization? | Authentication proves who the user is; authorization decides what that authenticated user may do. |
| What is the difference between `login_required` and `admin_required`? | `login_required` requires a logged-in user; `admin_required` requires admin privileges in addition to login. |
| Where would you inspect password verification? | The auth blueprint and auth service, especially password hashing/checking logic. |
| Where would you inspect admin route guards? | `app/blueprints/admin.py`, admin decorators/helpers, and admin service calls. |
| What does Duo add? | A second authentication factor beyond the password. |
| What should never be stored or shown in plaintext? | Passwords, Duo secrets, session secrets, bearer tokens, database passwords, and private keys. |
| What would you inspect if admin buttons disappeared but routes still worked? | Templates/UI conditions first, then server-side admin route guards to confirm authorization is still enforced. |
| What would you inspect if login worked locally but not in production? | Production config, `.env` key names/values off-screen, Duo settings, session/cookie settings, database path, and deployed source/live process state. |

REQUIRE:

The maintainer can identify the login route, admin route, service-layer auth helpers, and authorization documentation.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot explain why UI-only admin hiding is insufficient or cannot find the server-side admin checks.


# Existing Path E v1 Script File: module-07-tasks.md

# Module 7 - Tasks And Everyday User Workflows

## Goal

The maintainer understands the task tracker as a complete example of a normal user-facing Flask feature: route, template, login guard, service function, database model, file upload, and known risks.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx)
- `../../presentation/UNanofabTools/flaskserver/06-Tasks.md` (reference path: ../../presentation/UNanofabTools/flaskserver/06-Tasks.md)
- `../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (reference path: ../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- `../../documentation/UNanofabTools/flaskserver/06-service-layer-reference.md` (reference path: ../../documentation/UNanofabTools/flaskserver/06-service-layer-reference.md)

## Verbatim Script

READ ALOUD:

"The task tracker is a good first feature to trace because it is ordinary. It is not the most exotic part of the system. It uses routes, templates, login checks, SQLite, service helpers, assignment logic, status changes, and file uploads. Once you understand tasks, other feature modules become less mysterious."

SHOW:

Open `06-Tasks.pptx`.

READ ALOUD:

"From the user's perspective, tasks are a work queue. Users view tasks, create tasks if allowed, claim tasks, change status, and upload files. From the maintainer's perspective, each of those actions maps to a route, some validation, service-layer behavior, database changes, and sometimes filesystem writes."

## Source Demo

DO:

Show:

```text
../UNanofabTools/app/blueprints/tasks.py
../UNanofabTools/app/services/task_service.py
../UNanofabTools/app/templates/
```

DO:

Run:

```sh
rg -n "tasks|createtasks|changestatus|claimTask|uploadtaskfile|TaskAssignee|TaskFile" ../UNanofabTools/app
```

READ ALOUD:

"This search demonstrates the maintenance pattern. Start at the route. Identify the service function. Identify the database model or file write. Then compare the route behavior to the HTTP API reference and service-layer docs."

SHOW:

Open the task routes in `../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (reference path: ../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md).

READ ALOUD:

"The endpoint reference should state method, path, guard, input, behavior, and response. It should also mention known behavioral risks. For example, if a route allows any logged-in user to complete any task, that must be documented as a known issue or intentional design."

## File Upload Note

READ ALOUD:

"File uploads are always worth extra attention. A maintainer should ask where uploaded files are stored, how names are sanitized, whether allowed extensions are restricted, whether size limits exist, and whether backup coverage includes the upload path."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Which blueprint owns tasks? | The tasks blueprint, typically `app/blueprints/tasks.py`. |
| Which service file contains task behavior? | `app/services/task_service.py`. |
| Which database stores task data? | The task-related SQLite database/tables documented for the Flask app. |
| Which task routes mutate state? | Create/update/status/claim/upload routes such as task creation, `/changestatus`, `/claimTask`, and `/uploadtaskfile`. |
| Which task routes accept JSON? | JSON routes include task status/claim style endpoints documented with JSON bodies, such as `/changestatus` and `/claimTask`. |
| Which task routes accept form or file data? | Task creation forms and multipart upload routes such as `/uploadtaskfile`. |
| What is the security implication of a logged-in user changing task status? | If only login is required, any logged-in user may be able to change task state unless ownership/admin checks are added. |
| How would you verify docs against source for one task endpoint? | Compare the endpoint reference to the route decorator, guard, input parsing, service call, side effect, response, and known-issues entry. |

REQUIRE:

The maintainer can trace one task action from browser route to service code to data side effect.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot trace one task workflow end to end. Assign them to audit a single task route and report back with route, guard, input, service call, and side effect.


# Existing Path E v1 Script File: module-08-machines-logs.md

# Module 8 - Machines, Logs, And The File-Based Data Model

## Goal

The maintainer understands how machine pages, downloaded CORES data, uploaded machine logs, file browsing, downloads, and graphs depend on file trees as much as on databases.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx)
- `../../presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md` (reference path: ../../presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md)
- `../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (reference path: ../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- `../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` (reference path: ../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md)

## Verbatim Script

READ ALOUD:

"Not all important data lives in a relational database. Machine pages and log views rely heavily on file trees. That makes backup, path correctness, naming conventions, and upload freshness operationally important."

SHOW:

Open `07-Machines-and-Logs.pptx`.

READ ALOUD:

"The machine pages are where cleanroom users expect to see useful historical machine data. Some of that data comes from `HSCDATA`, written by `HSCDownloader.py`. Some comes from `LogData`, written by machine-control-PC transfer scripts. Some views provide file browsing, downloads, and graphing. If a file tree is missing or stale, the website may still run but display incomplete or outdated information."

## Source Demo

DO:

Show:

```text
../UNanofabTools/app/blueprints/machines.py
../UNanofabTools/HSCDATA
../UNanofabTools/LogData
```

If local source does not contain live data trees, read this instead:

READ ALOUD:

"The local source checkout may not contain production data trees. That is normal. Production data trees live on `nfhistory`, under the production install. We still use the source to understand route behavior and docs to understand live layout."

DO:

Run:

```sh
rg -n "HSCDATA|LogData|download|graph|machine|csv|send_file|safe_join" ../UNanofabTools/app
```

READ ALOUD:

"This search highlights file-based behavior. For any file-serving route, inspect path joining and sanitization. For any graphing route, identify the expected input file shape. For any download route, confirm it does not allow arbitrary file access."

## Data Durability Frame

READ ALOUD:

"File data creates a different durability problem from database data. A SQL backup alone is not enough if `HSCDATA`, `LogData`, or `uploads` are missing. The documentation says University IT handles off-box backups, but the Nanofab maintainer should confirm that the VM-level backup covers the app instance, uploads, logs, `HSCDATA`, `LogData`, and local PostgreSQL data."

SHOW:

Open live-server docs where backup and data trees are discussed.

READ ALOUD:

"Do not casually say there are no backups. The correct statement is that backups are IT-handled and coverage should be confirmed, especially for operational data trees and local PostgreSQL."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What is `HSCDATA`? | The file tree of CORES-derived machine usage CSV data used by machine pages. |
| What writes `HSCDATA`? | `HSCDownloader.py`. |
| What is `LogData`? | The file tree of uploaded machine-control-PC logs and related log data. |
| What writes `LogData`? | File-transfer scripts from machine-control PCs, plus app/device flows where documented. |
| Why can the website be up while machine data is stale? | Flask/nginx may be healthy while downloader or file-transfer data pipelines have stopped or stopped writing fresh files. |
| Which file trees must be backed up? | `HSCDATA`, `LogData`, `uploads`, `instance/`, sensor/log file directories, and related production data paths. |
| What should a maintainer inspect before changing file download routes? | Path construction/sanitization, `safe_join` or equivalent protections, allowed directories, auth guards, and arbitrary-file-read risk. |

REQUIRE:

The maintainer can explain the difference between app uptime and data freshness.

## Stop Point

STOP POINT:

Stop here if the maintainer treats database backup as sufficient without file-tree backup.


# Existing Path E v1 Script File: module-09-device-apis.md

# Module 9 - Device APIs And Sensor Data

## Goal

The maintainer understands device-facing routes, Pico sensor data flow, unauthenticated endpoint exposure, expected payloads, and known data-contract gaps.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx)
- `../../presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx)
- `../../presentation/UNanofabTools/flaskserver/08-IoT-API-Endpoints.md` (reference path: ../../presentation/UNanofabTools/flaskserver/08-IoT-API-Endpoints.md)
- `../../presentation/UNanofabTools/flaskserver/12-Consumers-NanofabToolkit.md` (reference path: ../../presentation/UNanofabTools/flaskserver/12-Consumers-NanofabToolkit.md)
- `../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` (reference path: ../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md)

## Verbatim Script

READ ALOUD:

"Device APIs are different from normal browser pages. Browser pages usually assume a logged-in human. Device endpoints may be called by Pico devices or other small clients. That means the maintainer must understand payload shape, validation, storage side effects, and whether the endpoint is authenticated."

SHOW:

Open `08-IoT-API-Endpoints.pptx`.

READ ALOUD:

"The most important conceptual split is people versus devices. People authenticate through the web app. Devices post structured data. If device routes are unauthenticated, that may be a practical choice for embedded devices, but it is still a security and data-integrity risk. The docs and known-issues files should say so clearly."

SHOW:

Open `12-Consumers-NanofabToolkit.pptx`.

READ ALOUD:

"The Pico firmware and desktop tools are consumers or producers around the Flask app. This is why canonical source matters. For PicoHelperTools and ParticleSensor, the canonical code lives in NanofabToolkit, not the older copies under UNanofabTools."

## Source Demo

DO:

Run:

```sh
rg -n "sensor-data|env-data|particle|room_name|sensor_number|raw_measurements|converted_values" ../UNanofabTools/app ../NanofabToolkit
```

READ ALOUD:

"This search connects endpoint names to source code and client code. If a Pico sends `room_name` and `sensor_number`, the server docs, firmware docs, and desktop viewer docs should all agree about those names. If a room label changes in one place but not another, the system can silently stop matching data."

SHOW:

Open `../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` (reference path: ../../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md).

READ ALOUD:

"A data contract is the agreement between producer and consumer. It includes endpoint path, method, required fields, optional fields, units, storage side effects, and response shape. A future maintainer should update the contract whenever firmware, server routes, or desktop tools change."

## Known Gap Frame

READ ALOUD:

"The docs call out data-contract gaps where relevant. For example, if a POST writes one storage location but a GET reads another, that is not just a code curiosity. It means a user or tool can get a 404 even though data was posted. These mismatches belong in known issues until fixed."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Which endpoints receive device data? | Device API routes such as `/sensor-data` and `/env-data`, as documented in the endpoint/integration docs. |
| Which fields identify a sensor? | `room_name` and `sensor_number`. |
| Why are unauthenticated device routes risky? | Anyone who can reach them may submit false, malformed, or abusive data unless other controls exist. |
| Where is canonical Pico firmware? | `../NanofabToolkit/PicoHelperTools/`. |
| Where is canonical ParticleSensor code? | `../NanofabToolkit/ParticleSensor/`. |
| What can break if room names or sensor numbers drift? | Server storage, map coloring, viewer lookups, and device-data matching can silently fail or mislabel data. |
| How would you audit a server endpoint against firmware? | Compare server route path/method/fields to firmware POST code, payload names, units, response handling, and docs. |

REQUIRE:

The maintainer can explain one device data flow from Pico payload to server route to stored data to viewer.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot identify canonical NanofabToolkit code for PicoHelperTools and ParticleSensor.


# Existing Path E v1 Script File: module-10-chemical-inventory.md

# Module 10 - Chemical Inventory And PostgreSQL

## Goal

The maintainer understands the chemical inventory as the largest and most database-sensitive feature: local PostgreSQL, schema shape, routes, service layer, barcode behavior, reports, transactions, and security concerns.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx)
- `../../presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx)
- `../../presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md` (reference path: ../../presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md)
- `../../documentation/UNanofabTools/flaskserver/04-database-schema.md` (reference path: ../../documentation/UNanofabTools/flaskserver/04-database-schema.md)
- `../../known-issues/UNanofabTools/flaskserver.md` (reference path: ../../known-issues/UNanofabTools/flaskserver.md)

## Verbatim Script

READ ALOUD:

"The chemical inventory is one of the most important features to understand deeply. It is larger than a simple CRUD page. It has its own PostgreSQL schema, rooms, vendors, items, containers, barcodes, scans, reports, transaction history, moves, removals, and exports."

SHOW:

Open `09-Chemical-Inventory.pptx`.

READ ALOUD:

"The chemical inventory answers operational questions: what chemical exists, where it is, who owns it, what container it is in, whether it has been removed, and what history is attached to it. Because this is operational inventory data, correctness matters. A bug here can affect compliance, safety, or lab operations."

SHOW:

Open `10-Database-Models.pptx`.

READ ALOUD:

"This is where the database distinction matters. The main app uses several SQLite databases for smaller app concerns. The chemical inventory uses local PostgreSQL on `nfhistory`. Earlier documentation was corrected to remove stale external-database framing. The correct live fact is local PostgreSQL bound to `127.0.0.1:5432`."

## Source Demo

DO:

Show:

```text
../UNanofabTools/app/blueprints/chem_inventory.py
../UNanofabTools/app/services/chem_inventory_service.py
../UNanofabTools/config/config.py
```

DO:

Run:

```sh
rg -n "CHEM_|psycopg|containers|transactions|barcode|inventory|room|vendor|REMOVE|MOVE|BULK_MOVE" ../UNanofabTools/app ../UNanofabTools/config
```

READ ALOUD:

"This search connects configuration, routes, service functions, and schema concepts. The maintainer should be able to find where a barcode is created, where inventory is searched, where a container is moved, where a container is removed, and where transactions are logged."

SHOW:

Open `../../documentation/UNanofabTools/flaskserver/04-database-schema.md` (reference path: ../../documentation/UNanofabTools/flaskserver/04-database-schema.md).

READ ALOUD:

"The schema doc should be treated as operational reference. If the live PostgreSQL schema drifts from this doc, that is high-impact documentation drift. The maintainer should know how to compare docs against live schema or a schema dump before making changes."

## Live Demo If Safe

If database access is safe and credentials are not exposed:

DO:

Show only service status or schema names, not passwords.

```sh
systemctl status postgresql@17-main
ss -ltnp | grep 5432
```

READ ALOUD:

"This confirms local PostgreSQL service and listener shape without showing credentials. We are not dumping secret values."

## Security Frame

READ ALOUD:

"The known-issues file calls out chemical inventory risks. Pay attention to unauthenticated or under-protected write routes if present, schema drift, missing migration discipline, and backup/restore coverage. Chemical inventory changes should be approached as data integrity work, not just UI work."

SHOW:

Open `../../known-issues/UNanofabTools/flaskserver.md` (reference path: ../../known-issues/UNanofabTools/flaskserver.md).

READ ALOUD:

"Known issues are where the maintainer decides what to fix first. High-severity chemical inventory findings belong near the top because they affect real operational data."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Is chemical PostgreSQL local or external? | Local on `nfhistory`, not an external database server. |
| What host and port does the live deployment use? | `127.0.0.1:5432`. |
| Which config variables control chemical database access? | The `CHEM_*` PostgreSQL settings documented in the config reference, such as host, port, database, user, and password variables. |
| What are the main chemical inventory entities? | Rooms, vendors, items, containers, barcodes, scans, transactions, reports, moves, and removals. |
| What is a soft delete in this context? | Marking a container removed/inactive while preserving the row and history instead of physically deleting it. |
| Why is transaction history important? | It preserves auditability for moves, removals, inventory changes, reports, and compliance-style review. |
| What should be checked before changing barcode or move behavior? | Schema, service functions, route guards, transaction logging, reports/exports, tests/sample data, and live backup/restore coverage. |
| What backup coverage is needed for chemical inventory? | Local PostgreSQL data plus relevant app config, schema evidence, and any related files needed to restore inventory behavior. |

REQUIRE:

The maintainer can explain the chemical inventory's route, service, database, and backup concerns without calling it "just another page."

## Stop Point

STOP POINT:

Stop here if the maintainer says or implies that chemical PostgreSQL is external. Correct that immediately and revisit the live-server and schema docs.


# Existing Path E v1 Script File: module-11-request-lifecycle-endpoints.md

# Module 11 - Request Lifecycle And Endpoint Reference

## Goal

The maintainer can trace one request from browser or device to nginx, Flask, blueprint, service code, persistence, response, and documentation, then use that skill to audit route drift.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx)
- `../../presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx)
- `../../presentation/UNanofabTools/flaskserver/13-Request-Lifecycle-Walkthrough.md` (reference path: ../../presentation/UNanofabTools/flaskserver/13-Request-Lifecycle-Walkthrough.md)
- `../../presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md` (reference path: ../../presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md)
- `../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (reference path: ../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md)

## Verbatim Script

READ ALOUD:

"This module ties together everything we have covered so far. A request is not magic. It enters through a network path, reaches Flask, passes through routing and guards, calls code, touches data, and returns a response."

SHOW:

Open `13-Request-Lifecycle-Walkthrough.pptx`.

READ ALOUD:

"For a browser request, the public user talks to `nfhistory` over HTTPS. nginx receives the request and proxies to Flask. Flask matches a route. Decorators and route logic enforce login or admin requirements where applicable. The route calls service functions or direct helpers. The app reads or writes SQLite, PostgreSQL, or file trees. Then Flask returns HTML, JSON, a redirect, a file, or an error."

"For a device request, the shape is similar but the guard model may differ. Device endpoints can be unauthenticated. That makes payload validation and network exposure especially important."

SHOW:

Open `15-Endpoint-Reference.pptx`.

READ ALOUD:

"The endpoint reference exists so a maintainer can audit what the app exposes. For each route family, we want method, path, guard, inputs, behavior, response, and known risks. If source changes, this reference must change."

## Source Demo

DO:

Run:

```sh
rg -n "@.*route|Blueprint|login_required|admin_required" ../UNanofabTools/app/blueprints
```

READ ALOUD:

"This command finds route decorators and guards. The source is the starting point for a route drift audit."

DO:

Pick one endpoint from `../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (reference path: ../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md). For that endpoint, identify:

```text
method
path
guard
source file
function name
input
service calls
data side effects
response
known issue, if any
```

READ ALOUD:

"This is the basic endpoint audit pattern. If you can do this for one endpoint, you can do it for all endpoints. This is how future route changes stay documented."

## Drift Rule

READ ALOUD:

"If an endpoint exists in source but not in docs, docs are incomplete. If an endpoint exists in docs but not source, docs are stale. If the docs say a route requires login but the source has no guard, that is potentially high severity. If the docs say an endpoint writes one data store but source writes another, that can be a data-integrity finding."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What are the stages in a browser request? | Browser to HTTPS/nginx, proxy to Flask, route/blueprint match, auth guard, service/data work, response. |
| What are the stages in a device request? | Device POST/GET to API endpoint, Flask route, validation, storage or lookup, JSON response; auth may differ from browser routes. |
| How do you find all route decorators? | Run `rg -n "@.*route|Blueprint|login_required|admin_required" ../UNanofabTools/app/blueprints`. |
| What does the endpoint reference need to say for each route? | Method, path, guard, inputs, behavior, side effects, response, and known risks/issues. |
| What is route drift? | A mismatch between documented endpoints and actual source behavior. |
| Which route-drift cases are high severity? | Missing auth in source, undocumented write routes, docs claiming wrong guards, source writing different data stores, or recovery/security commands pointing to wrong paths. |

REQUIRE:

The maintainer can audit one endpoint from docs to source to data side effects.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot perform one route audit. Assign a second endpoint as homework.


# Existing Path E v1 Script File: module-12-security-model.md

# Module 12 - Security Model

## Goal

The maintainer understands the system's security strengths, known gaps, secret-handling requirements, and the distinction between Nanofab-owned fixes and University IT tickets.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx` (reference path: ../../presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx)
- `../../presentation/UNanofabTools/flaskserver/14-Security-Model.md` (reference path: ../../presentation/UNanofabTools/flaskserver/14-Security-Model.md)
- `../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md` (reference path: ../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md)
- `../../known-issues/UNanofabTools/README.md` (reference path: ../../known-issues/UNanofabTools/README.md)

## Verbatim Script

READ ALOUD:

"Security here is not one feature. It includes TLS, nginx, authentication, sessions, Duo, admin checks, device endpoints, secret storage, database permissions, file serving, server access, backups, and the University IT boundary."

SHOW:

Open `14-Security-Model.pptx`.

READ ALOUD:

"The security story should be honest. There are good things: HTTPS through nginx, password hashing, session-based login, Duo where configured, admin checks in code, local PostgreSQL not exposed publicly, and a documented operational boundary. There are also risks: hard-coded or historically hard-coded secrets, unauthenticated device routes, possible chem write-route exposure, tmux-only supervision, shared UNIX account constraints, and IT-owned root access that Nanofab must not change casually."

SHOW:

Open `../../known-issues/UNanofabTools/README.md` (reference path: ../../known-issues/UNanofabTools/README.md).

READ ALOUD:

"The known-issues master index is where security risks become a work plan. A serious security issue should not live only in a slide note. It should be findable in known issues with severity, risk, and suggested fix."

## Secret Handling

READ ALOUD:

"The documentation bundle must not contain literal secret values. If source historically contains a token, password, or key, the docs can say that a secret exists and should be moved to protected storage and rotated. The docs should not reproduce the secret."

"Safe things to document include environment variable names, file paths, service names, route names, usernames when operationally relevant, and public hostnames. Unsafe things include bearer tokens, WiFi passwords, database passwords, Duo secrets, private key material, and live session cookies."

DO:

Run a literal-secret scan only from an unprojected terminal, using the locally known values from the redaction review. Do not put the literal secret values into this script, the projected screen, or committed notes.

READ ALOUD:

"A literal-secret scan checks that known exposed values are not in the documentation bundle. We do not write the secret values into the handoff script itself. A broader source secret audit is separate and should be done carefully."

## Boundary Frame

READ ALOUD:

"Do not assign IT-owned fixes to the Nanofab maintainer. Root SSH from `iceolate` is University IT's path. `/root/.ssh/authorized_keys` is IT-owned. Creating UNIX users is IT-owned. VM backup and base patching are IT-owned. Nanofab can file tickets and track them, but should not pretend those are app-code tasks."

"Nanofab-owned fixes include moving app secrets out of source, adding app-level authentication or authorization, improving route validation, creating systemd units for Flask and downloader, improving health checks, updating docs, and fixing app code."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What are the major security strengths? | HTTPS/nginx, password hashing, session login, Duo where configured, admin checks, local-only PostgreSQL, and explicit IT/Nanofab boundary docs. |
| What are the major security gaps? | Historical hard-coded secrets, unauthenticated device routes, risky write routes, shared-account constraints, tmux-only supervision, and incomplete monitoring/rotation patterns. |
| Which secrets must never be shown? | Bearer tokens, WiFi passwords, database passwords, Duo secrets, private keys, session cookies, and plaintext passwords. |
| Which security fixes are Nanofab-owned? | App-level auth/authorization, validation, secret relocation in app config, docs, known issues, service supervision, and code fixes under Nanofab control. |
| Which security fixes are IT tickets? | Root SSH, `/root/`, UNIX accounts, VM backup/patching, firewall/root-level infrastructure, and root-owned file permissions. |
| Why are unauthenticated device endpoints risky? | They can accept spoofed or malformed data from anyone who can reach them unless other controls exist. |
| Why is root SSH not a Nanofab setting to casually change? | It is University IT's administrative path; changing it could lock IT out or break IT-owned maintenance/backup workflows. |
| Where do security findings belong? | In the relevant known-issues file and master known-issues index, with severity, evidence, owner, and suggested fix. |

REQUIRE:

The maintainer can classify security findings into Nanofab-actionable, IT-ticket, and needs-more-evidence.

## Stop Point

STOP POINT:

Stop here if the maintainer treats root-owned changes as Nanofab-owned or does not understand secret redaction rules.


# Existing Path E v1 Script File: module-13-hscdownloader.md

# Module 13 - HSCDownloader And CORES Data

## Goal

The maintainer understands `HSCDownloader.py`, where it lives, what it pulls, what it writes, how it runs today, and what risks belong in the maintenance plan.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx` (reference path: ../../presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx)
- `../../presentation/UNanofabTools/hscdownloader/README.md` (reference path: ../../presentation/UNanofabTools/hscdownloader/README.md)
- `../../documentation/UNanofabTools/hscdownloader/README.md` (reference path: ../../documentation/UNanofabTools/hscdownloader/README.md)
- `../../known-issues/UNanofabTools/hscdownloader.md` (reference path: ../../known-issues/UNanofabTools/hscdownloader.md)

## Verbatim Script

READ ALOUD:

"`HSCDownloader.py` is the CORES to `HSCDATA` supply line. It pulls machine usage data from the CORES/n8n side and writes CSV files that the website displays. If the downloader stops, the website may still be up, but machine data can become stale."

SHOW:

Open `HSC-Downloader.pptx`.

READ ALOUD:

"The first fact to preserve is location. The production downloader is not in a separate `~/HSCDownloader` directory. `HSCDownloader.py` lives in the same production install directory as `run.py`: `/home/phelan/server/UNanofabTools/`. Any instruction saying to `cd ~/HSCDownloader` is stale."

"The second fact is supervision. The downloader currently runs inside the `downloader` tmux session, not systemd. That means it has the same silent-failure and reboot risks as the Flask app."

## Source Demo

DO:

Show:

```text
../UNanofabTools/HSCDownloader.py
../../documentation/UNanofabTools/hscdownloader/README.md
../../known-issues/UNanofabTools/hscdownloader.md
```

DO:

Run:

```sh
rg -n "save|CORES|HSCDATA|requests|Bearer|time|schedule|while" ../UNanofabTools/HSCDownloader.py ../../documentation/UNanofabTools/hscdownloader/README.md ../../known-issues/UNanofabTools/hscdownloader.md
```

READ ALOUD:

"This search connects downloader behavior to docs and known issues. It should reveal where requests are made, where data is saved, how time or scheduling is handled, and whether any secret-bearing patterns need attention."

## Risk Frame

READ ALOUD:

"The downloader risks are operational and security-related. Operationally, it should be supervised, logged, monitored, and checked for freshness. Security-wise, any token or credential used to call CORES or n8n must not be hard-coded in source long term. It should live in protected configuration and be rotated if exposed."

"A maintainer should know how to answer: Is the downloader running? When did it last write `HSCDATA`? What happens if CORES is down? Where are errors logged? Is the credential protected? How would we restart it? How would we migrate it to systemd?"

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What does `HSCDownloader.py` do? | Pulls CORES/n8n machine usage data and writes CSV outputs used by the website. |
| Where does it live in production? | `/home/phelan/server/UNanofabTools/`, beside `run.py`. |
| What tmux session owns it today? | `downloader`. |
| What data tree does it write? | `HSCDATA`. |
| Why can the website be up while CORES data is stale? | nginx/Flask can be healthy while the downloader has stopped, errored, or stopped writing fresh CSVs. |
| What is the reliability improvement for the downloader? | Move it from tmux-only operation to a supervised service with restart/logging/health checks, such as systemd. |
| What is the secret-handling improvement for the downloader? | Move credentials/tokens out of source into protected config and rotate any exposed values. |

REQUIRE:

The maintainer can locate `HSCDownloader.py`, explain its data product, and describe how to check whether data is fresh.

## Stop Point

STOP POINT:

Stop here if the maintainer says there is a separate production `~/HSCDownloader` install. Correct the path and revisit the live-server facts.


# Existing Path E v1 Script File: module-14-file-transfers.md

# Module 14 - File Transfers From Machine PCs

## Goal

The maintainer understands how machine-control-PC scripts upload logs, why personal-account dependencies matter, and what a safer long-term upload model would look like.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx` (reference path: ../../presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx)
- `../../presentation/UNanofabTools/filetransfer/README.md` (reference path: ../../presentation/UNanofabTools/filetransfer/README.md)
- `../../documentation/UNanofabTools/filetransfer/README.md` (reference path: ../../documentation/UNanofabTools/filetransfer/README.md)
- `../../known-issues/UNanofabTools/filetransfer.md` (reference path: ../../known-issues/UNanofabTools/filetransfer.md)

## Verbatim Script

READ ALOUD:

"The file-transfer scripts are the bridge from machine-control PCs to the `LogData` tree on `nfhistory`. This is not the same as CORES data. CORES data comes through `HSCDownloader.py` into `HSCDATA`. Machine-control-PC logs come through transfer scripts into `LogData`."

SHOW:

Open `File-Transfer-Scripts.pptx`.

READ ALOUD:

"These scripts matter because the website's machine log views are only as good as the uploaded files. If the scripts stop running, authenticate as the wrong account, write to the wrong path, or fail silently, the website can look alive while the underlying logs are stale."

"There is also an account-dependency issue. Some transfer workflows depend on a personal CADE account or personal setup. That is fragile for a handoff. A better Nanofab-side fix is a purpose-bound SSH key that authenticates as the shared `phelan` server account and is limited to the upload purpose. A cleaner long-term dedicated UNIX service account would require University IT because Nanofab cannot create UNIX accounts."

## Source Demo

DO:

Run:

```sh
rg -n "scp|ssh|phelan|CADE|LogData|mutex|powershell|bat" ../UNanofabTools ../../documentation/UNanofabTools/filetransfer ../../known-issues/UNanofabTools/filetransfer.md
```

READ ALOUD:

"This search finds upload mechanics, account names, target paths, and script types. The maintainer should know which scripts live on control PCs, which code lives in the repo, and which parts are not automatically visible from the server."

SHOW:

Open `../../known-issues/UNanofabTools/filetransfer.md` (reference path: ../../known-issues/UNanofabTools/filetransfer.md).

READ ALOUD:

"Known issues here should focus on reliability, account independence, safe key management, upload path correctness, and observability. It is not enough that a script worked on one person's workstation. The successor needs a repeatable operational model."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What data tree do file-transfer scripts write? | `LogData`. |
| How is `LogData` different from `HSCDATA`? | `LogData` is uploaded machine-control-PC logs; `HSCDATA` is CORES-derived CSV data written by `HSCDownloader.py`. |
| Why are personal-account dependencies risky? | Uploads can break when a person's CADE account, key, workstation, permissions, or employment status changes. |
| What is the Nanofab-side fix? | Use a purpose-bound SSH key authenticating as `phelan` for upload workflows, with documented controls. |
| What would require University IT? | A dedicated UNIX service account or per-machine/per-user UNIX accounts on `nfhistory`. |
| How would you tell whether uploads are fresh? | Check recent modification times, expected files per machine, transfer logs/output, and website data freshness. |
| What should be documented for each machine-control PC? | Script location, schedule/trigger, source path, target path, account/key used, expected files, failure signs, and owner. |

REQUIRE:

The maintainer can distinguish CORES downloader data from machine-control-PC uploaded logs and can describe the account-dependency risk.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot identify the difference between `HSCDATA` and `LogData`.


# Existing Path E v1 Script File: module-15-pico-particle.md

# Module 15 - Pico Firmware And Particle Sensor Ecosystem

## Goal

The maintainer understands the Pico firmware and ParticleSensor ecosystem, especially the canonical-source rule: NanofabToolkit is canonical for PicoHelperTools and ParticleSensor.

## Required Screen

SHOW:

- `../../presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx` (reference path: ../../presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx)
- `../../presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx` (reference path: ../../presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx)
- `../../presentation/UNanofabTools/picofirmware/slides/Pico-Firmware.pptx` (reference path: ../../presentation/UNanofabTools/picofirmware/slides/Pico-Firmware.pptx)
- `../../presentation/UNanofabTools/particlepctools/slides/Particle-PC-Tools.pptx` (reference path: ../../presentation/UNanofabTools/particlepctools/slides/Particle-PC-Tools.pptx)
- `../../documentation/NanofabToolkit/PicoHelperTools/README.md` (reference path: ../../documentation/NanofabToolkit/PicoHelperTools/README.md)
- `../../documentation/NanofabToolkit/ParticleSensor/README.md` (reference path: ../../documentation/NanofabToolkit/ParticleSensor/README.md)

## Verbatim Script

READ ALOUD:

"This module is about source-code ownership and data contracts. Pico devices produce sensor data. ParticleSensor is a desktop viewer. The important repository rule is that NanofabToolkit is canonical for PicoHelperTools and ParticleSensor. UNanofabTools contains older copies for historical context."

SHOW:

Open `PicoHelperTools.pptx`.

READ ALOUD:

"PicoHelperTools is the canonical firmware area. If you need to update the firmware or understand what payload a Pico sends, start in NanofabToolkit. Do not patch an older copy in UNanofabTools and assume you changed the real firmware."

SHOW:

Open `ParticleSensor.pptx`.

READ ALOUD:

"ParticleSensor is the canonical desktop viewer. It depends on room labels, sensor numbers, server data contracts, and expected response shapes. If room names or sensor numbers drift between firmware, server, and desktop viewer, the system can silently stop matching data."

SHOW:

Open the older-copy decks for `picofirmware` and `particlepctools`.

READ ALOUD:

"These older UNanofabTools copies are included so a maintainer recognizes them. They are historical context unless live evidence shows they are still in use. The correct default is to update canonical NanofabToolkit versions."

## Source Demo

DO:

Run:

```sh
find ../NanofabToolkit/PicoHelperTools ../NanofabToolkit/ParticleSensor -maxdepth 2 -type f | sort
rg -n "room_name|sensor_number|sensor-data|env-data|requests|wifi|password|SSID" ../NanofabToolkit ../UNanofabTools
```

READ ALOUD:

"The first command proves substantive canonical content exists. The second connects firmware, desktop viewer, and server data-contract names. If secret-like strings appear in source, do not project their values. The point is to identify risk and where secrets should move, not to expose them."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Which repo is canonical for PicoHelperTools? | `NanofabToolkit`. |
| Which repo is canonical for ParticleSensor? | `NanofabToolkit`. |
| Why do older copies exist in UNanofabTools? | Historical context/reference; they should not be treated as canonical unless live evidence proves otherwise. |
| What fields identify a sensor? | `room_name` and `sensor_number`. |
| What can break if room labels drift? | Server matching, map coloring, viewer display, and data lookup can silently fail or mislabel sensors. |
| Where should firmware changes be made? | `../NanofabToolkit/PicoHelperTools/`. |
| Where should desktop viewer changes be made? | `../NanofabToolkit/ParticleSensor/`. |

REQUIRE:

The maintainer can state the canonical-copy rule without hesitation.

## Stop Point

STOP POINT:

Stop here if the maintainer wants to patch the older UNanofabTools copies first. Revisit the canonical-source rule.


# Existing Path E v1 Script File: module-16-other-tools.md

# Module 16 - Other Desktop And Data Tools

## Goal

The maintainer can identify each remaining desktop/data tool, explain its purpose, decide how much maintenance attention it deserves, and avoid confusing small utilities with the live server.

## Required Screen

SHOW:

- `../../presentation/NanofabToolkit/ParalyneReader/slides/ParalyneReader.pptx` (reference path: ../../presentation/NanofabToolkit/ParalyneReader/slides/ParalyneReader.pptx)
- `../../presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx` (reference path: ../../presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx)
- `../../presentation/NanofabToolkit/DentonDecoder/slides/DentonDecoder.pptx` (reference path: ../../presentation/NanofabToolkit/DentonDecoder/slides/DentonDecoder.pptx)
- `../../presentation/NanofabToolkit/ALDPeakCounter/slides/ALDPeakCounter.pptx` (reference path: ../../presentation/NanofabToolkit/ALDPeakCounter/slides/ALDPeakCounter.pptx)
- `../../presentation/NanofabToolkit/PreciousMetalReader/slides/PreciousMetalReader.pptx` (reference path: ../../presentation/NanofabToolkit/PreciousMetalReader/slides/PreciousMetalReader.pptx)
- `../../presentation/UNanofabTools/utilities/slides/Utilities.pptx` (reference path: ../../presentation/UNanofabTools/utilities/slides/Utilities.pptx)

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


# Existing Path E v1 Script File: module-17-legacy-server.md

# Module 17 - Legacy Server

## Goal

The maintainer recognizes deprecated `hscdisplayerserver`, understands why it exists in the docs, and does not spend major effort improving it unless live evidence proves it has become relevant again.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx` (reference path: ../../presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx)
- `../../presentation/UNanofabTools/hscdisplayerserver/README.md` (reference path: ../../presentation/UNanofabTools/hscdisplayerserver/README.md)
- `../../documentation/UNanofabTools/hscdisplayerserver/README.md` (reference path: ../../documentation/UNanofabTools/hscdisplayerserver/README.md)
- `../../documentation/UNanofabTools/hscdisplayerserver/ROUTES.md` (reference path: ../../documentation/UNanofabTools/hscdisplayerserver/ROUTES.md)
- `../../known-issues/UNanofabTools/hscdisplayerserver.md` (reference path: ../../known-issues/UNanofabTools/hscdisplayerserver.md)

## Verbatim Script

READ ALOUD:

"This module is intentionally short but important. `hscdisplayerserver` is deprecated legacy context. It is included so a maintainer recognizes it if they encounter it. The default instruction is not to improve it. The default instruction is to preserve context and ship work to the Flask app."

SHOW:

Open `HSC-Displayer-Server-Legacy.pptx`.

READ ALOUD:

"A legacy system can be dangerous because it looks like a project that wants maintenance. Before spending time on it, ask whether it is live, whether users depend on it, whether the current Flask app replaced it, and whether known issues say to retire it."

SHOW:

Open `../../known-issues/UNanofabTools/hscdisplayerserver.md` (reference path: ../../known-issues/UNanofabTools/hscdisplayerserver.md).

READ ALOUD:

"The known-issues file should be clear: this is not a normal enhancement backlog. The expected direction is retirement unless live evidence changes the priority."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What is `hscdisplayerserver`? | The legacy monolithic/predecessor server documented for historical recognition. |
| Is it current or deprecated? | Deprecated. |
| Why is it documented? | So maintainers recognize it and understand why not to revive it by default. |
| What should you do before spending time improving it? | Verify live use and known-issues priority; otherwise defer/retire it. |
| Where should new web-app work normally go? | The current Flask app in UNanofabTools, not the deprecated legacy server. |

REQUIRE:

The maintainer can say: "`hscdisplayerserver` is deprecated; recognize it, do not revive it without evidence."

## Stop Point

STOP POINT:

Stop here if the maintainer treats legacy-server improvement as a first priority.


# Existing Path E v1 Script File: module-18-known-issues-triage.md

# Module 18 - Known Issues And Maintenance Triage

## Goal

The maintainer can turn known-issues files into a prioritized maintenance plan that separates Nanofab-actionable work from University IT tickets.

## Required Screen

SHOW:

- `../../known-issues/UNanofabTools/README.md` (reference path: ../../known-issues/UNanofabTools/README.md)
- `../../known-issues/UNanofabTools/liveserver.md` (reference path: ../../known-issues/UNanofabTools/liveserver.md)
- `../../known-issues/UNanofabTools/serveraccess.md` (reference path: ../../known-issues/UNanofabTools/serveraccess.md)
- `../../known-issues/UNanofabTools/flaskserver.md` (reference path: ../../known-issues/UNanofabTools/flaskserver.md)
- `../../known-issues/NanofabToolkit/README.md` (reference path: ../../known-issues/NanofabToolkit/README.md)

## Verbatim Script

READ ALOUD:

"Known issues are the real maintenance queue. They are not separate from the handoff. A maintainer who ignores known issues will rediscover the same problems slowly and may fix lower-priority work first."

SHOW:

Open the UNanofabTools known-issues index.

READ ALOUD:

"The master known-issues index should summarize cross-cutting themes: secrets in source, tmux-only supervision, chemical inventory risks, personal-account dependencies, IT-bound items, and deprecated or historical code. High-severity issues should be visible here."

SHOW:

Open `liveserver.md`, `serveraccess.md`, and `flaskserver.md`.

READ ALOUD:

"These three files are the starting point for a real maintainer. Live server issues tell us what is fragile in production. Server access issues tell us what is fragile about getting in and inspecting safely. Flask server issues tell us what is risky in the application itself."

## Triage Exercise

DO:

Create a table in the notes file:

```md
| Issue | Severity | Owner | Evidence | Next Step | Due |
|---|---|---|---|---|---|
```

READ ALOUD:

"Every issue needs an owner category. Use `Nanofab-actionable`, `IT ticket`, or `needs evidence`. Do not put an IT-owned item into the Nanofab action list as if the app maintainer can just do it. Do not hide a Nanofab-owned issue behind IT if it is actually app code, docs, tmux/systemd migration, route hardening, or secret cleanup."

DO:

Build:

```md
## Next 7 Days
## Next 30 Days
## Next Quarter
## IT Tickets
## Evidence Still Missing
```

READ ALOUD:

"The first seven days should focus on reliability, recoverability, security, and evidence. The next thirty days can include larger fixes. The next quarter can include cleanup, refactors, and recurring audits. This prioritization prevents cosmetic work from displacing operational risk."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What are the top three Nanofab-actionable fixes? | Expected examples: move Flask/downloader toward supervised services, address app/security/secret risks, and fix high-severity Flask/chem/data freshness issues. The exact list should come from current known issues. |
| What are the top three IT tickets? | Expected examples: root-owned file/SSH items, UNIX account/service-account requests, backup/patching confirmation. The exact list should come from current IT-bound findings. |
| What evidence supports each top issue? | Known-issues entry, live-server snapshot, source code, audit output, or live command output. |
| Which issues should not be worked first? | Cosmetic refactors, deprecated legacy-server polish, broad rewrites, or small-tool cleanup before reliability/security/recoverability work. |
| What issue would you close only after live evidence? | Any live-server or backup/access/service-state issue that requires a new survey, command output, or IT confirmation. |
| How do you update docs after fixing an issue? | Update the relevant developer/layman docs, remove or close the known issue with evidence, refresh snapshots if needed, run the audit, and commit changes. |

REQUIRE:

The maintainer can produce a 7-day and 30-day maintenance plan with owners.

## Stop Point

STOP POINT:

Stop here until the maintainer has produced a written maintenance plan. Do not proceed to final operational scenarios without it.


# Existing Path E v1 Script File: module-19-path-d-audit-practice.md

# Module 19 - Path D Audit Practice

## Goal

The maintainer practices the evidence-based audit process that they will use after Faith is unavailable.

## Required Screen

SHOW:

- `../../START-HERE.md` (reference path: ../../START-HERE.md#path-d-long-term-maintainer-deep-dive)
- `../EVALUATE.md` (reference path: ../EVALUATE.md)
- the support audit script, run from the repository root as `bash support/audit.sh`

## Verbatim Script

READ ALOUD:

"This module turns the handoff from listening into ownership. Path D is the no-human-context audit. If you inherit the system after Faith is gone, Path D is how you verify what is true."

SHOW:

Open Path D in `START-HERE.md`.

READ ALOUD:

"Path D is an evidence path, not a reading path. It asks you to confirm docs against source repos, live server state, known issues, and the IT boundary. You do not declare Path D complete because you read every file. You declare it complete when the system can be operated, recovered, audited, and changed from written evidence."

## Mechanical Audit

DO:

Run:

```sh
bash support/audit.sh
```

READ ALOUD:

"Read the audit output by section. Coverage matrix tells us whether deliverables exist. Stale-string checks tell us whether corrected facts propagated. Broken link checks catch moved files. Source spot-checks compare some docs to source. The audit is a starter, not the final judgment."

If the audit reports context hits:

READ ALOUD:

"Context hits require reading surrounding text. A hit for `create UNIX users` is acceptable if it says only IT can do that. A hit for `iceolate` is acceptable if it says this is University IT's administrative host. The audit script cannot fully understand context, so the maintainer must."

## Drift Practice

DO:

Pick one route from `../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (reference path: ../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md).

Find it in source:

```sh
rg -n "route-name-or-path" ../UNanofabTools/app/blueprints
```

Record:

```md
## Endpoint Drift Check
- Doc path:
- Source path:
- Method:
- Guard:
- Inputs:
- Behavior:
- Side effects:
- Match status:
- Finding:
```

READ ALOUD:

"This is the unit test of documentation maintenance. If you can do this for one route, you can do it for a whole blueprint."

## Live-State Practice

If live access is available:

DO:

Run a read-only check such as:

```sh
tmux ls
systemctl status nginx
systemctl status postgresql@17-main
```

READ ALOUD:

"Now compare live state to the docs. If docs say the app is in tmux and tmux shows `flaskserver`, that matches. If docs say PostgreSQL is local and `ss` shows loopback port 5432, that matches. If live state has changed, update docs or known issues."

If live access is not available:

LOG:

Record live verification as incomplete.

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What does `audit.sh` check? | Deliverable coverage, broken internal links, stale strings, snapshot presence, and limited source/doc spot checks. |
| What does `audit.sh` not check? | Full factual correctness, all route behavior, all source drift, live server truth, security design, and human judgment/context. |
| How do you verify a route against source? | Compare endpoint docs to the actual route decorator, guard, inputs, service calls, side effects, response, and known issues. |
| How do you verify live server facts? | Use safe live commands, survey snapshots, service status, tmux state, listener checks, and IT confirmation where needed. |
| What do you do when docs and source disagree? | Treat source as stronger evidence, update docs or create a known-issues/drift finding. |
| What do you do when docs and live state disagree? | Treat live state as current operational truth, update docs/snapshots/known issues or mark docs as target-state only. |

REQUIRE:

The maintainer performs at least one documented drift check.

## Stop Point

STOP POINT:

Stop here if the maintainer has not produced written audit notes. Path D practice must leave evidence.


# Existing Path E v1 Script File: module-20-operational-scenarios.md

# Module 20 - Operational Scenarios

## Goal

The maintainer rehearses real maintenance scenarios: website down, stale data, database trouble, access revocation, secret exposure, backup verification, and documentation drift.

## Required Screen

SHOW:

- `../../documentation/UNanofabTools/serveraccess/README.md` (reference path: ../../documentation/UNanofabTools/serveraccess/README.md)
- `../../documentation/UNanofabTools/liveserver/README.md` (reference path: ../../documentation/UNanofabTools/liveserver/README.md)
- `../../documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md` (reference path: ../../documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md)
- `../../known-issues/UNanofabTools/README.md` (reference path: ../../known-issues/UNanofabTools/README.md)

## Verbatim Script

READ ALOUD:

"This module is scenario rehearsal. A maintainer is not ready just because they understand files. They need to know what to do under pressure without guessing."

## Scenario 1 - Website Appears Down

READ ALOUD:

"Scenario one: someone says the website is down. Do not start by editing code. Start with evidence."

ASK:

| Question | Expected answer |
|---|---|
| Can DNS resolve? | Check `nfhistory.nanofab.utah.edu` resolves to the expected host/IP or identify DNS as the failure layer. |
| Is nginx running? | Use `systemctl status nginx`; it should be active for public HTTPS service. |
| Is TLS valid? | Check the browser/certbot/certificate status; Let's Encrypt cert should be valid and renewal should be healthy. |
| Is Flask listening behind nginx? | Check loopback listener/process state, expected `127.0.0.1:5000` style service, and proxy config. |
| Is the `flaskserver` tmux session alive? | `tmux ls` should show `flaskserver`; if missing, use the documented recovery path. |
| Is the Python process inside it alive? | Inspect process list or tmux pane safely; tmux existing alone does not prove Flask is serving. |
| Are there recent errors? | Check visible tmux output/logs/app output without exposing secrets. |
| Can you restart safely using the documented procedure? | Yes, by following the serveraccess runbook, recreating tmux only if needed, using the right path, and detaching with `Ctrl-b d`. |

REQUIRE:

The maintainer states the checks in order and identifies which are safe read-only checks.

## Scenario 2 - Machine Data Is Stale

READ ALOUD:

"Scenario two: the website loads, but machine data is stale. That is a data freshness problem, not necessarily a web outage."

ASK:

| Question | Expected answer |
|---|---|
| Is `downloader` tmux alive? | `tmux ls` should show `downloader`; if not, follow the downloader recovery runbook. |
| Is `HSCDownloader.py` running? | Verify the Python process, not just the tmux session. |
| When did `HSCDATA` last change? | Check file modification times in `HSCDATA` and compare them to expected downloader cadence. |
| Is CORES or n8n reachable? | Verify upstream availability or recent downloader errors without exposing credentials. |
| Are machine-control-PC logs separate from CORES data? | Yes. Control-PC logs go to `LogData`; CORES-derived data goes to `HSCDATA`. |
| Which known-issues file covers downloader risk? | `known-issues/UNanofabTools/hscdownloader.md`, plus live-server/serveraccess issues for supervision. |

REQUIRE:

The maintainer distinguishes `HSCDATA` freshness from website uptime.

## Scenario 3 - Chemical Inventory Error

READ ALOUD:

"Scenario three: chemical inventory pages fail or writes behave incorrectly. Treat this as a data-integrity issue."

ASK:

| Question | Expected answer |
|---|---|
| Is PostgreSQL running locally? | `postgresql@17-main` or the documented local PostgreSQL service should be active on `nfhistory`. |
| Is it listening on `127.0.0.1:5432`? | Yes, that is the documented live local listener shape. |
| Are chemical DB env-var names correct? | Compare `CHEM_*` config docs to `config.py` and production key names, without showing secret values. |
| Did schema drift occur? | Compare documented schema to live schema/introspection or current source assumptions. |
| Which routes write chemical inventory? | Chem inventory create/update/move/remove/import/write routes in `chem_inventory.py`, as documented in endpoint docs. |
| Are write routes properly guarded? | Confirm route decorators/guards and known-issues status; do not assume from UI alone. |
| Is backup coverage known before making changes? | It must be confirmed for local PostgreSQL and app data before risky schema/data changes. |

REQUIRE:

The maintainer does not change schema casually and knows to verify backup/restore assumptions.

## Scenario 4 - Access Must Be Revoked

READ ALOUD:

"Scenario four: a maintainer leaves and access must be revoked."

ASK:

| Question | Expected answer |
|---|---|
| Which account do Nanofab users SSH as? | The shared `phelan` UNIX account. |
| Where are per-person SSH keys represented? | In `/home/phelan/.ssh/authorized_keys` entries/labels, not separate UNIX accounts. |
| Who can create or remove UNIX accounts? | University IT. |
| What requires IT? | UNIX account creation/removal, root-owned access changes, `/root/`, root SSH, and VM-level access policy. |
| What app-level accounts or admin privileges also need review? | Flask app users, admin flags, assignment privileges, and any application-level credentials. |

REQUIRE:

The maintainer separates SSH access, app account access, admin privileges, and IT-owned UNIX account work.

## Scenario 5 - Secret Exposure

READ ALOUD:

"Scenario five: a token, password, or key is found in source or docs. The fix is not just deletion. The secret must be removed from inappropriate storage, moved to protected configuration, and rotated if exposure is possible."

ASK:

| Question | Expected answer |
|---|---|
| What kind of secret is it? | Identify whether it is a bearer token, WiFi password, DB password, Duo secret, private key, session secret, or other credential. |
| Where was it exposed? | Source file, docs file, Git history, terminal output, screenshot, notes, or deployed config. |
| Is it in Git history? | Check history if exposure was committed; deletion from the current file is not enough. |
| Who owns rotation? | The owner of the underlying service/credential, with Nanofab or IT depending on the secret. |
| Which docs or known-issues files need updating? | The relevant tool known-issues file, redaction note if documentation is affected, and any docs that describe secret handling. |
| What scan verifies the documentation bundle is clean? | A literal scan for known exposed values plus broader secret scans where appropriate, run without projecting secrets. |

REQUIRE:

The maintainer can describe rotation, not just redaction.

## Scenario 6 - Docs And Live State Disagree

READ ALOUD:

"Scenario six: docs and live state disagree. The live state wins for current operations. The docs must be updated or must clearly say they describe a target state."

ASK:

| Question | Expected answer |
|---|---|
| What was observed live? | Record the exact command/snapshot/output summary and date. |
| Which doc disagrees? | Name the specific Markdown file/section or slide note that conflicts with live state. |
| Is the disagreement dangerous? | Classify severity based on whether it affects recovery, security, data integrity, or operational decisions. |
| Does known issues need a new entry? | Yes if the drift reflects unresolved risk or live behavior that docs cannot immediately correct. |
| What evidence should be committed? | Updated docs, known-issues entry, sanitized survey snapshot, and/or a concise drift report with no secrets. |

REQUIRE:

The maintainer writes a short drift finding.

## Stop Point

STOP POINT:

Stop here only after the maintainer can walk through every scenario without relying on Faith.


# Existing Path E v1 Script File: module-21-final-no-contact-check.md

# Module 21 - Final No-Contact Check

## Goal

Confirm that the maintainer can continue without Faith. This is the final exit exam and leave-behind checklist.

## Required Screen

SHOW:

- `../../START-HERE.md` (reference path: ../../START-HERE.md)
- `../PRESENTATION-GUIDE.md` (reference path: ../PRESENTATION-GUIDE.md)
- `README.md` (reference path: README.md)
- current handoff notes
- current known-issues tree
- current maintenance plan

## Verbatim Script

READ ALOUD:

"This is the final no-contact check. The purpose is not to prove that you remember every detail. The purpose is to prove that you know where truth lives, how to verify it, what is safe to change, what is not yours to change, and how to turn uncertainty into written evidence."

"If you can answer these questions from docs, source, and live state, then you do not need Faith. If you cannot, we write down the missing fact before the handoff ends."

## Ownership Questions

ASK:

| Question | Expected answer |
|---|---|
| Who owns the VM? | University IT. |
| Who owns root? | University IT. |
| Who owns `/home/phelan/`? | Nanofab operationally owns the app/data surface there, within IT's VM boundary. |
| Who owns app code? | Nanofab/the software maintainer. |
| Who owns off-box backups? | University IT, with Nanofab responsible for confirming coverage assumptions. |
| Who can create UNIX users? | University IT, not Nanofab. |
| What is the Nanofab maintainer's UNIX account reality? | They use `phelan` with `sudo`, not root, under the current shared-account model. |
| What is the difference between an app admin and UNIX root? | App admin controls Flask application features; UNIX root controls the operating system and IT-owned infrastructure. |

REQUIRE:

The maintainer answers with clear Nanofab-vs-IT ownership.

## Runtime Questions

ASK:

| Question | Expected answer |
|---|---|
| What serves the public site? | nginx handles public HTTPS and proxies to Flask. |
| What does nginx proxy to? | The Flask app on loopback, documented around `127.0.0.1:5000` live state. |
| What process writes `HSCDATA`? | `HSCDownloader.py`. |
| What are the two required tmux sessions today? | `flaskserver` and `downloader`. |
| What is the production install path? | `/home/phelan/server/UNanofabTools/`. |
| What should replace tmux long term? | Supervised services such as systemd units with restart/logging. |
| How do you safely inspect tmux? | Attach only to look, avoid typing into live processes, and follow the runbook. |
| How do you detach? | `Ctrl-b` then `d`. |

REQUIRE:

The maintainer gives exact names: `flaskserver`, `downloader`, `/home/phelan/server/UNanofabTools/`, and `Ctrl-b d`.

## Data Questions

ASK:

| Question | Expected answer |
|---|---|
| Which data is SQLite? | Smaller Flask app databases such as users/tasks/app-specific SQLite stores documented under `instance/`. |
| Which data is PostgreSQL? | Chemical inventory data. |
| Which data is CSV or log files? | `HSCDATA`, `LogData`, uploads, sensor history files, and machine logs. |
| Which data comes from devices? | Pico/particle/environment sensor payloads posted to device API routes. |
| Which data comes from CORES? | Machine usage data pulled by `HSCDownloader.py`; PreciousMetalReader also uses CORES-related data for its own workflow. |
| Which data comes from machine-control PCs? | Uploaded tool logs into `LogData`. |
| Which data must be backed up? | SQLite DBs, local PostgreSQL, `HSCDATA`, `LogData`, `uploads`, config needed for restore, and relevant sensor/log files. |
| What backup coverage must be confirmed with IT? | VM/off-box backup coverage for app data trees, local PostgreSQL data, instance DBs, uploads, and production install state. |

REQUIRE:

The maintainer distinguishes databases from file trees and data producers.

## Code Questions

ASK:

| Question | Expected answer |
|---|---|
| Where is the app factory? | In `../UNanofabTools/app/__init__.py` or the documented `create_app` location. |
| Where are blueprints? | `../UNanofabTools/app/blueprints/`. |
| Where is auth? | Auth blueprint/service files such as `app/blueprints/auth.py` and `app/services/auth_service.py`. |
| Where is admin behavior? | Admin blueprint/service files such as `app/blueprints/admin.py` and `app/services/admin_service.py`. |
| Where is chem DB access? | Chemical inventory blueprint/service and config, especially `chem_inventory.py`, chem service code, and `CHEM_*` config. |
| Where is `HSCDownloader.py`? | In the UNanofabTools production/source root beside `run.py`. |
| Which repo is canonical for Pico firmware? | `NanofabToolkit`. |
| Which repo is canonical for ParticleSensor? | `NanofabToolkit`. |
| Which code is deprecated? | `hscdisplayerserver`, unless live evidence changes its status. |

REQUIRE:

The maintainer identifies canonical source locations and historical copies.

## Security Questions

ASK:

| Question | Expected answer |
|---|---|
| Where should secrets live? | Protected configuration/secret storage, not committed source or documentation. |
| Which secrets were historically hard-coded? | Known examples include CORES/n8n bearer-token style credentials and WiFi/password-style credentials documented as redacted risks. |
| Which routes are unauthenticated? | Device/API routes documented as unauthenticated, plus any route source audit identifies without login guards. |
| Which writes are highest-risk? | Chemical inventory writes, admin/user writes, task mutations, uploads/file writes, and device-data ingestion. |
| What is Nanofab-owned vs IT-owned? | Nanofab owns app/code/docs/data behavior; IT owns VM/root/root SSH/UNIX accounts/backups/base patching. |
| What does root SSH from `iceolate` mean? | It is University IT's administrative access path and should not be changed casually by Nanofab. |
| What should happen if a secret is exposed? | Redact/remove from inappropriate storage, rotate the secret, inspect history/scope, update known issues/docs, and verify clean scans. |

REQUIRE:

The maintainer can classify security work into Nanofab, IT, and needs-evidence.

## Maintenance Questions

ASK:

| Question | Expected answer |
|---|---|
| What are the first three Nanofab fixes? | Expected from current triage: supervise Flask/downloader, address high-risk app/security/secret issues, and fix top Flask/chem/data freshness issues. |
| What are the first three IT tickets? | Expected from current triage: root/SSH/root-owned file items, UNIX/service-account requests, and backup/patching coverage confirmations. |
| How do you run the documentation audit? | From repo root: `bash support/audit.sh`. |
| How do you close a known issue? | Fix or verify it, document evidence, update/remove the known-issues entry, update affected docs, run audit/checks, and commit. |
| How do you update the live-server snapshot? | Run the documented survey safely on `nfhistory`, inspect/redact output, copy it into snapshots, and update live-server docs if facts changed. |
| How do you verify docs against source? | Compare documented claims to current files/routes/config in `../UNanofabTools` and `../NanofabToolkit`. |
| How do you verify docs against live state? | Use safe live commands, survey snapshots, service/process/listener checks, and IT confirmation for IT-owned facts. |
| What do you do if source and docs disagree? | Treat source as stronger evidence, update docs or known issues, and record the drift with file/line evidence. |

REQUIRE:

The maintainer has a written plan for next 7 days, next 30 days, next quarter, and IT tickets.

## Leave-Behind Checklist

DO:

Confirm the maintainer has:

- access to the private documentation repo;
- the current handoff branch and commit;
- source repo locations and commits;
- the current live-server survey snapshot or a logged reason it was not refreshed;
- their access status and revocation procedure;
- a current known-issues tree;
- a 7-day, 30-day, and quarterly maintenance plan;
- a list of open IT tickets or IT questions;
- this script pack for replaying the handoff.

READ ALOUD:

"The handoff is complete only if the next action does not require asking Faith. If a future action still depends on Faith, then we have found missing documentation. We will write it down now."

## Final Stop

STOP POINT:

End Path E only when the maintainer can answer the final questions and the leave-behind checklist is complete.

If any item is incomplete:

LOG:

Record the missing item, owner, evidence needed, and next session date.


# Existing Path E v1 Script File: weekly-rollout-plan.md

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

- `00-operator-protocol.md` (reference path: 00-operator-protocol.md)
- `module-00-set-the-contract.md` (reference path: module-00-set-the-contract.md)
- `module-01-big-picture.md` (reference path: module-01-big-picture.md)
- `module-02-live-server.md` (reference path: module-02-live-server.md)
- `module-03-server-access.md` (reference path: module-03-server-access.md)

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

- `module-04-flask-startup.md` (reference path: module-04-flask-startup.md)
- `module-05-configuration-local-dev.md` (reference path: module-05-configuration-local-dev.md)
- `module-06-auth-admin.md` (reference path: module-06-auth-admin.md)

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

- `module-07-tasks.md` (reference path: module-07-tasks.md)
- `module-08-machines-logs.md` (reference path: module-08-machines-logs.md)
- `module-09-device-apis.md` (reference path: module-09-device-apis.md)

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

- `module-10-chemical-inventory.md` (reference path: module-10-chemical-inventory.md)
- `module-11-request-lifecycle-endpoints.md` (reference path: module-11-request-lifecycle-endpoints.md)

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

- `module-12-security-model.md` (reference path: module-12-security-model.md)
- `module-13-hscdownloader.md` (reference path: module-13-hscdownloader.md)
- `module-14-file-transfers.md` (reference path: module-14-file-transfers.md)

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

- `module-15-pico-particle.md` (reference path: module-15-pico-particle.md)
- `module-16-other-tools.md` (reference path: module-16-other-tools.md)
- `module-17-legacy-server.md` (reference path: module-17-legacy-server.md)

Expected outcome:

- The maintainer can identify canonical vs historical code.
- The maintainer can name every smaller tool and its purpose.
- The maintainer understands that `hscdisplayerserver` is deprecated.

Homework:

- Choose two smaller tools and summarize their source location, purpose, and maintenance priority.
- Confirm no first-priority plan depends on improving deprecated `hscdisplayerserver`.

## Week 7 - Triage And Evidence Audit

Run:

- `module-18-known-issues-triage.md` (reference path: module-18-known-issues-triage.md)
- `module-19-path-d-audit-practice.md` (reference path: module-19-path-d-audit-practice.md)

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

- `module-20-operational-scenarios.md` (reference path: module-20-operational-scenarios.md)
- `module-21-final-no-contact-check.md` (reference path: module-21-final-no-contact-check.md)

Expected outcome:

- The maintainer can handle common failure scenarios without Faith.
- The maintainer has access, notes, source repo locations, known issues, and a maintenance plan.
- The no-contact check passes.

If the no-contact check fails:

- Do not call the handoff complete.
- Write down the missing evidence.
- Schedule another session.
- Update docs or known issues before trying again.


# Expanded Module 00: Set The Contract

READ ALOUD:

This expanded section revisits Module 00, Set The Contract. The focus is workspace, source-of-truth order, safety, and documentation layout. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 00

READ ALOUD:

We are now doing the orientation pass for Set The Contract. The maintainer should connect this module to workspace, source-of-truth order, safety, and documentation layout. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention workspace, source-of-truth order, safety, and documentation layout. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 00

READ ALOUD:

We are now doing the evidence pass for Set The Contract. The maintainer should connect this module to workspace, source-of-truth order, safety, and documentation layout. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention workspace, source-of-truth order, safety, and documentation layout. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 01: Big Picture Of The Server

READ ALOUD:

This expanded section revisits Module 01, Big Picture Of The Server. The focus is the system map, data producers, and ownership boundaries. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 01

READ ALOUD:

We are now doing the orientation pass for Big Picture Of The Server. The maintainer should connect this module to the system map, data producers, and ownership boundaries. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention the system map, data producers, and ownership boundaries. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 01

READ ALOUD:

We are now doing the evidence pass for Big Picture Of The Server. The maintainer should connect this module to the system map, data producers, and ownership boundaries. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention the system map, data producers, and ownership boundaries. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 02: Live Server

READ ALOUD:

This expanded section revisits Module 02, Live Server. The focus is verified production state, tmux, nginx, PostgreSQL, and IT ownership. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 02

READ ALOUD:

We are now doing the orientation pass for Live Server. The maintainer should connect this module to verified production state, tmux, nginx, PostgreSQL, and IT ownership. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention verified production state, tmux, nginx, PostgreSQL, and IT ownership. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 02

READ ALOUD:

We are now doing the evidence pass for Live Server. The maintainer should connect this module to verified production state, tmux, nginx, PostgreSQL, and IT ownership. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention verified production state, tmux, nginx, PostgreSQL, and IT ownership. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 03: Server Access

READ ALOUD:

This expanded section revisits Module 03, Server Access. The focus is two-hop SSH, shared phelan account, tmux safety, and survey snapshots. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 03

READ ALOUD:

We are now doing the orientation pass for Server Access. The maintainer should connect this module to two-hop SSH, shared phelan account, tmux safety, and survey snapshots. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention two-hop SSH, shared phelan account, tmux safety, and survey snapshots. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 03

READ ALOUD:

We are now doing the evidence pass for Server Access. The maintainer should connect this module to two-hop SSH, shared phelan account, tmux safety, and survey snapshots. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention two-hop SSH, shared phelan account, tmux safety, and survey snapshots. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 04: Flask Startup

READ ALOUD:

This expanded section revisits Module 04, Flask Startup. The focus is run.py, app factory, extensions, blueprints, and startup drift. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 04

READ ALOUD:

We are now doing the orientation pass for Flask Startup. The maintainer should connect this module to run.py, app factory, extensions, blueprints, and startup drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention run.py, app factory, extensions, blueprints, and startup drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 04

READ ALOUD:

We are now doing the evidence pass for Flask Startup. The maintainer should connect this module to run.py, app factory, extensions, blueprints, and startup drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention run.py, app factory, extensions, blueprints, and startup drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 05: Configuration And Local Development

READ ALOUD:

This expanded section revisits Module 05, Configuration And Local Development. The focus is environment variables, secret handling, paths, and local setup. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 05

READ ALOUD:

We are now doing the orientation pass for Configuration And Local Development. The maintainer should connect this module to environment variables, secret handling, paths, and local setup. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention environment variables, secret handling, paths, and local setup. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 05

READ ALOUD:

We are now doing the evidence pass for Configuration And Local Development. The maintainer should connect this module to environment variables, secret handling, paths, and local setup. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention environment variables, secret handling, paths, and local setup. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 06: Authentication And Admin

READ ALOUD:

This expanded section revisits Module 06, Authentication And Admin. The focus is login, authorization, Duo, admin guards, and password handling. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 06

READ ALOUD:

We are now doing the orientation pass for Authentication And Admin. The maintainer should connect this module to login, authorization, Duo, admin guards, and password handling. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention login, authorization, Duo, admin guards, and password handling. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 06

READ ALOUD:

We are now doing the evidence pass for Authentication And Admin. The maintainer should connect this module to login, authorization, Duo, admin guards, and password handling. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention login, authorization, Duo, admin guards, and password handling. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 07: Tasks

READ ALOUD:

This expanded section revisits Module 07, Tasks. The focus is normal user workflows, task routes, services, database writes, and uploads. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 07

READ ALOUD:

We are now doing the orientation pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention normal user workflows, task routes, services, database writes, and uploads. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 07

READ ALOUD:

We are now doing the evidence pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention normal user workflows, task routes, services, database writes, and uploads. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 08: Machines And Logs

READ ALOUD:

This expanded section revisits Module 08, Machines And Logs. The focus is HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 08

READ ALOUD:

We are now doing the orientation pass for Machines And Logs. The maintainer should connect this module to HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 08

READ ALOUD:

We are now doing the evidence pass for Machines And Logs. The maintainer should connect this module to HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention HSCDATA, LogData, uploads, downloads, graphs, and file-tree durability. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 09: Device APIs

READ ALOUD:

This expanded section revisits Module 09, Device APIs. The focus is Pico/device payloads, unauthenticated routes, and data contracts. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 09

READ ALOUD:

We are now doing the orientation pass for Device APIs. The maintainer should connect this module to Pico/device payloads, unauthenticated routes, and data contracts. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention Pico/device payloads, unauthenticated routes, and data contracts. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 09

READ ALOUD:

We are now doing the evidence pass for Device APIs. The maintainer should connect this module to Pico/device payloads, unauthenticated routes, and data contracts. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention Pico/device payloads, unauthenticated routes, and data contracts. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 10: Chemical Inventory

READ ALOUD:

This expanded section revisits Module 10, Chemical Inventory. The focus is local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 10

READ ALOUD:

We are now doing the orientation pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 10

READ ALOUD:

We are now doing the evidence pass for Chemical Inventory. The maintainer should connect this module to local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention local PostgreSQL, schema, routes, barcodes, moves, removals, and reports. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 11: Request Lifecycle And Endpoints

READ ALOUD:

This expanded section revisits Module 11, Request Lifecycle And Endpoints. The focus is browser/device request flow and route drift audits. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 11

READ ALOUD:

We are now doing the orientation pass for Request Lifecycle And Endpoints. The maintainer should connect this module to browser/device request flow and route drift audits. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention browser/device request flow and route drift audits. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 11

READ ALOUD:

We are now doing the evidence pass for Request Lifecycle And Endpoints. The maintainer should connect this module to browser/device request flow and route drift audits. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention browser/device request flow and route drift audits. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 12: Security Model

READ ALOUD:

This expanded section revisits Module 12, Security Model. The focus is strengths, gaps, secrets, route risks, and IT/Nanofab security split. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 12

READ ALOUD:

We are now doing the orientation pass for Security Model. The maintainer should connect this module to strengths, gaps, secrets, route risks, and IT/Nanofab security split. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention strengths, gaps, secrets, route risks, and IT/Nanofab security split. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 12

READ ALOUD:

We are now doing the evidence pass for Security Model. The maintainer should connect this module to strengths, gaps, secrets, route risks, and IT/Nanofab security split. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention strengths, gaps, secrets, route risks, and IT/Nanofab security split. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 13: HSCDownloader

READ ALOUD:

This expanded section revisits Module 13, HSCDownloader. The focus is CORES ingestion, HSCDATA freshness, credentials, and supervision. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 13

READ ALOUD:

We are now doing the orientation pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention CORES ingestion, HSCDATA freshness, credentials, and supervision. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 13

READ ALOUD:

We are now doing the evidence pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention CORES ingestion, HSCDATA freshness, credentials, and supervision. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 14: File Transfers

READ ALOUD:

This expanded section revisits Module 14, File Transfers. The focus is machine-control-PC upload scripts, LogData, and account dependencies. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 14

READ ALOUD:

We are now doing the orientation pass for File Transfers. The maintainer should connect this module to machine-control-PC upload scripts, LogData, and account dependencies. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention machine-control-PC upload scripts, LogData, and account dependencies. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 14

READ ALOUD:

We are now doing the evidence pass for File Transfers. The maintainer should connect this module to machine-control-PC upload scripts, LogData, and account dependencies. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention machine-control-PC upload scripts, LogData, and account dependencies. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 15: Pico And Particle

READ ALOUD:

This expanded section revisits Module 15, Pico And Particle. The focus is canonical NanofabToolkit firmware/viewer source and sensor identity. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 15

READ ALOUD:

We are now doing the orientation pass for Pico And Particle. The maintainer should connect this module to canonical NanofabToolkit firmware/viewer source and sensor identity. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention canonical NanofabToolkit firmware/viewer source and sensor identity. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 15

READ ALOUD:

We are now doing the evidence pass for Pico And Particle. The maintainer should connect this module to canonical NanofabToolkit firmware/viewer source and sensor identity. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention canonical NanofabToolkit firmware/viewer source and sensor identity. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 16: Other Tools

READ ALOUD:

This expanded section revisits Module 16, Other Tools. The focus is desktop utilities, data tools, priority, and maintenance scope. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 16

READ ALOUD:

We are now doing the orientation pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention desktop utilities, data tools, priority, and maintenance scope. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 16

READ ALOUD:

We are now doing the evidence pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention desktop utilities, data tools, priority, and maintenance scope. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 17: Legacy Server

READ ALOUD:

This expanded section revisits Module 17, Legacy Server. The focus is deprecated hscdisplayerserver context and retirement posture. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 17

READ ALOUD:

We are now doing the orientation pass for Legacy Server. The maintainer should connect this module to deprecated hscdisplayerserver context and retirement posture. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention deprecated hscdisplayerserver context and retirement posture. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 17

READ ALOUD:

We are now doing the evidence pass for Legacy Server. The maintainer should connect this module to deprecated hscdisplayerserver context and retirement posture. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention deprecated hscdisplayerserver context and retirement posture. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 18: Known Issues Triage

READ ALOUD:

This expanded section revisits Module 18, Known Issues Triage. The focus is maintenance plan, severity, evidence, owners, and IT tickets. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 18

READ ALOUD:

We are now doing the orientation pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention maintenance plan, severity, evidence, owners, and IT tickets. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 18

READ ALOUD:

We are now doing the evidence pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention maintenance plan, severity, evidence, owners, and IT tickets. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 19: Path D Audit Practice

READ ALOUD:

This expanded section revisits Module 19, Path D Audit Practice. The focus is mechanical audit, source drift, live drift, and evidence notes. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 19

READ ALOUD:

We are now doing the orientation pass for Path D Audit Practice. The maintainer should connect this module to mechanical audit, source drift, live drift, and evidence notes. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention mechanical audit, source drift, live drift, and evidence notes. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 19

READ ALOUD:

We are now doing the evidence pass for Path D Audit Practice. The maintainer should connect this module to mechanical audit, source drift, live drift, and evidence notes. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention mechanical audit, source drift, live drift, and evidence notes. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 20: Operational Scenarios

READ ALOUD:

This expanded section revisits Module 20, Operational Scenarios. The focus is outage, stale data, chem DB, access, secrets, and docs/live drift. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 20

READ ALOUD:

We are now doing the orientation pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 20

READ ALOUD:

We are now doing the evidence pass for Operational Scenarios. The maintainer should connect this module to outage, stale data, chem DB, access, secrets, and docs/live drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention outage, stale data, chem DB, access, secrets, and docs/live drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Expanded Module 21: Final No-Contact Check

READ ALOUD:

This expanded section revisits Module 21, Final No-Contact Check. The focus is exit exam, leave-behind artifacts, and independence criteria. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 21

READ ALOUD:

We are now doing the orientation pass for Final No-Contact Check. The maintainer should connect this module to exit exam, leave-behind artifacts, and independence criteria. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention exit exam, leave-behind artifacts, and independence criteria. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 21

READ ALOUD:

We are now doing the evidence pass for Final No-Contact Check. The maintainer should connect this module to exit exam, leave-behind artifacts, and independence criteria. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention exit exam, leave-behind artifacts, and independence criteria. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.



# Read-Aloud Documentation Corpus: START-HERE.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# START HERE — UNanofabTools & NanofabToolkit Handoff

**You're the person reading this so I can hand it off.** This file is the orchestrator over everything in this folder. It says, *for your situation*, which materials to open in which order so you don't waste time wandering.

This documentation bundle lives in three parallel trees. For any development work or Path D audit, keep the two source repos next to this folder in the same parent directory:

| Folder | What it is |
|--------|-----------|
| `presentation/` | Plain-English READMEs + slide decks (`.pptx`) for every tool. For people who don't need to read code. |
| `documentation/` | Formal developer reference for every tool. For the next maintainer. |
| `known-issues/` | The to-do list — bugs, tech debt, security concerns, recommended fixes. Kept out of the docs so the docs stay clean. |
| `../UNanofabTools/` | The actual Flask web app's source code. Not stored in this GitHub documentation bundle; clone or locate it adjacent to this folder before auditing code. |
| `../NanofabToolkit/` | Sibling repo with the desktop tools and Pico firmware that talk to the Flask app. Not stored in this GitHub documentation bundle; clone or locate it adjacent to this folder before auditing code. |

Both repos have a master `README.md` in each tree (`presentation/UNanofabTools/README.md`, `documentation/NanofabToolkit/README.md`, etc.) listing every tool with one-line descriptions. Once you know which tool you care about, the per-tool folder always has the same shape:

```
presentation/<repo>/<tool>/
  ├── README.md            ← layman guide
  └── slides/<Tool>.pptx   ← presentable deck with speaker notes
documentation/<repo>/<tool>/
  └── README.md (or numbered docs/)  ← developer reference
known-issues/<repo>/<tool>.md          ← punch list for that tool
```

## Pick your path

| If you are… | Go to | Time |
|------|-------|------|
| **A live in-person handoff session(s)** between me (Faith) and the next maintainer | Path A (reference path: #path-a-live-multi-session-handoff) | 4–5 sessions of ~60–90 min each |
| **Presenting to lab management or non-technical stakeholders** (advisor, lab director, the rest of the team) | Path B (reference path: #path-b-lab-management--non-technical-stakeholders) | 45 min, one session |
| **A solo successor** walking in after I've left, reading at your own pace | Path C (reference path: #path-c-solo-successor-self-paced) | Multi-week, self-paced |
| **The long-term maintainer** who needs to own, audit, extend, or rescue the system without contacting me | Path D (reference path: #path-d-long-term-maintainer-deep-dive) | 1-2 focused weeks, repeatable as an audit |
| **Faith presenting an unlimited, all-encompassing live walkthrough** with slides on a screen | Path E (reference path: #path-e-presentation-guide) | No fixed limit; prefer too long over too short |

Each path orders the materials so they tell the story in the right sequence. If you're not sure, **Path A is the canonical full handoff** — if you're going to do this in person, do it that way. If there is no person left to ask and the system has to be maintained independently, use **Path D**. If Faith is presenting the complete slide-driven handoff live, use **Path E**.

---

# Path A: Live multi-session handoff

Five sessions, ~60–90 minutes each, in this order. Each session has a "show this deck" deliverable and a "read this in the gap before next session" follow-up. Estimated total: ~7 hours of presenter time + ~6 hours of follow-up reading.

> **Critical framing to set in Session 1 and keep returning to:** `nfhistory` is jointly operated. University IT owns the VM, `root`, the backup pipeline, base patching, and the SSH key in `/root/.ssh/authorized_keys`. The Nanofab team owns the Flask app, the HSCDownloader, the local PostgreSQL chem DB, and everything under `/home/phelan/`. The Nanofab admin has `sudo` as `phelan` but **not** `root`, and **cannot** create UNIX users. Several known-issues items that look like Nanofab to-dos are actually IT tickets — they're tagged that way throughout.

## Session 1 — Orient: what this thing is and where it lives (~75 min)

The goal: by the end of this session, the next maintainer can describe in one paragraph what the cleanroom system does, what `nfhistory` is, and where the IT/Nanofab boundary runs.

| # | Show | Why |
|---|------|-----|
| 1 | `presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx` (reference path: presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx) | The "what does this whole thing do" deck. Sets the scope — auth, tasks, machine pages, sensor API, chem inventory — without diving into code. |
| 2 | `presentation/UNanofabTools/liveserver/slides/Live-Server.pptx` (reference path: presentation/UNanofabTools/liveserver/slides/Live-Server.pptx) | What's actually on `nfhistory` today: OS, services, certs, the IT/Nanofab boundary, the punch list. This is where the boundary frame gets introduced. |
| 3 | (Optional, time-permitting) Browser demo | Pull up `https://nfhistory.nanofab.utah.edu` and click through a couple of pages — the machine portal, the chem inventory. Five minutes of "here's what users see." |

**Follow-up reading before Session 2:**
- `presentation/UNanofabTools/flaskserver/README.md` (reference path: presentation/UNanofabTools/flaskserver/README.md) — the layman overview of the whole Flask app
- `presentation/UNanofabTools/liveserver/README.md` (reference path: presentation/UNanofabTools/liveserver/README.md) — the layman version of the live-server tour

## Session 2 — Access: get in, look around, leave without breaking anything (~90 min)

The goal: the maintainer leaves this session having SSH'd in themselves, attached to both tmux sessions, detached cleanly, and run the read-only survey script.

| # | Show | Why |
|---|------|-----|
| 1 | `presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx` (reference path: presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx) | The full access procedure — two-hop SSH through CADE, the `User phelan` constraint, the tmux sessions, **the `Ctrl-b d` detach ritual**, and the "what goes through IT instead" slide. |
| 2 | Live demo: the two-hop login | You: open a terminal. Walk through the CADE hop, then `ssh nfhistory`, then `tmux ls`. Show both sessions are alive. Attach to `flaskserver`, scroll, **detach with `Ctrl-b d`** (do this twice so they see it). |
| 3 | Live demo: run the survey | Run `bash ~/survey_nfhistory.sh \| tee /tmp/nfhistory_survey_$(date +%F).txt`. Walk through the output sections. Show them where the snapshot lands in `documentation/UNanofabTools/liveserver/snapshots/`. |
| 4 | Recovery walkthrough (don't actually break it) | Talk through what happens if a session dies — `tmux new -s flaskserver`, `cd`, activate venv, `python run.py`, detach. Have them recite it back. |

**Follow-up reading before Session 3:**
- `documentation/UNanofabTools/serveraccess/README.md` (reference path: documentation/UNanofabTools/serveraccess/README.md) — the formal access reference with full admin procedures
- `documentation/UNanofabTools/liveserver/README.md` (reference path: documentation/UNanofabTools/liveserver/README.md) — the populated live-server inventory
- `known-issues/UNanofabTools/serveraccess.md` (reference path: known-issues/UNanofabTools/serveraccess.md) and `known-issues/UNanofabTools/liveserver.md` (reference path: known-issues/UNanofabTools/liveserver.md) — the punch lists for the server itself

## Session 3 — The Flask app, deep enough (~90 min)

The goal: the maintainer understands how the Flask app is laid out, how a request becomes a response, and where to look for the auth, tasks, chem inventory, and IoT pieces.

| # | Show | Why |
|---|------|-----|
| 1 | `02-How-it-Starts.pptx` (reference path: presentation/UNanofabTools/flaskserver/slides/02-How-it-Starts.pptx) | Application factory, blueprints, the entrypoint. Skip if they already know Flask deeply. |
| 2 | `03-Configuration.pptx` (reference path: presentation/UNanofabTools/flaskserver/slides/03-Configuration.pptx) | The `.env` keys, the config classes, what changes between dev and prod. |
| 3 | `04-Authentication-and-Login.pptx` (reference path: presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx) | Auth, sessions, Duo. The most security-sensitive part of the app. |
| 4 | `08-IoT-API-Endpoints.pptx` (reference path: presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx) | The unauthenticated device-data routes — where the Pico sensors POST to. The other half of the Nanofab story. |
| 5 | `09-Chemical-Inventory.pptx` (reference path: presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx) | The chem module. Note the **chem PostgreSQL is local on the same VM**; older remote-DB wording has been corrected throughout. |
| 6 | `13-Request-Lifecycle-Walkthrough.pptx` (reference path: presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx) | One slide deck that traces a request end-to-end. Ties it all together. |

**Follow-up reading before Session 4** (this is the heaviest reading week — give 2 weeks if needed):
- `documentation/UNanofabTools/flaskserver/01-architecture.md` (reference path: documentation/UNanofabTools/flaskserver/01-architecture.md) through `10-development-guide.md` — the full formal reference
- `known-issues/UNanofabTools/flaskserver.md` (reference path: known-issues/UNanofabTools/flaskserver.md) — the Flask app's punch list

## Session 4 — The ecosystem (data in, data out) (~75 min)

The goal: the maintainer can name every system that talks to `nfhistory`, where the source code lives, and which tools are old copies vs canonical.

| # | Show | Why |
|---|------|-----|
| 1 | `HSC-Downloader.pptx` (reference path: presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx) | The CORES → HSCDATA ETL. The supply line for machine-run data. |
| 2 | `File-Transfer-Scripts.pptx` (reference path: presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx) | The per-machine PowerShell scripts on each tool's control PC. Note the personal-account dependency and the two-option fix (IT service account vs. purpose-bound shared-account SSH key). |
| 3 | `PicoHelperTools.pptx` (reference path: presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx) | The Raspberry Pi Pico firmware (NanofabToolkit). The producers of the sensor data POSTs. Canonical version lives in NanofabToolkit. |
| 4 | `ParticleSensor.pptx` (reference path: presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx) | The desktop viewer for particle data. Canonical version is in NanofabToolkit; an older copy lives in UNanofabTools. |
| 5 | `ParalyneReader.pptx` (reference path: presentation/NanofabToolkit/ParalyneReader/slides/ParalyneReader.pptx) | The desktop tool for Parylene analog log review. |
| 6 | `DAT-Tools.pptx` (reference path: presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx) | DATfixer + DATgrapher for Denton 635 logs. |
| 7 | `ALDPeakCounter.pptx` (reference path: presentation/NanofabToolkit/ALDPeakCounter/slides/ALDPeakCounter.pptx), `DentonDecoder.pptx` (reference path: presentation/NanofabToolkit/DentonDecoder/slides/DentonDecoder.pptx), `PreciousMetalReader.pptx` (reference path: presentation/NanofabToolkit/PreciousMetalReader/slides/PreciousMetalReader.pptx) | Smaller NanofabToolkit tools. Show titles + one-line each unless they want depth. |
| 8 | `Utilities.pptx` (reference path: presentation/UNanofabTools/utilities/slides/Utilities.pptx) | The miscellaneous helpers. |

**Critical pointer to make explicit in this session:**

> NanofabToolkit holds the **canonical** versions of PicoHelperTools and ParticleSensor. UNanofabTools holds older copies for historical reference. If you need to update the firmware or the desktop viewer, work in NanofabToolkit. Every cross-reference in the docs already points there.

**Follow-up reading before Session 5:**
- Per-tool layman READMEs for the ones the maintainer is most likely to touch
- Each tool's `documentation/<repo>/<tool>/README.md` if depth is needed

## Session 5 — Maintenance and what's broken (~60 min)

The goal: the maintainer leaves with a clear punch list, knows which items they own and which are IT's, and understands the legacy server's status.

| # | Show | Why |
|---|------|-----|
| 1 | Walk `known-issues/UNanofabTools/README.md` (reference path: known-issues/UNanofabTools/README.md) | The master index of every punch list, with the cross-cutting themes (secrets in source, chem schema drift, personal-account dependencies, the IT/Nanofab boundary). |
| 2 | Read together: `known-issues/UNanofabTools/liveserver.md` (reference path: known-issues/UNanofabTools/liveserver.md) | The 22 findings, Nanofab-actionable vs IT-ticket split, priority order. |
| 3 | Read together: `known-issues/UNanofabTools/serveraccess.md` (reference path: known-issues/UNanofabTools/serveraccess.md) | The access pattern's tech debt. |
| 4 | Read together: `known-issues/UNanofabTools/flaskserver.md` (reference path: known-issues/UNanofabTools/flaskserver.md) | The Flask app's tech debt. The biggest items: chem schema drift, chem write routes unauthenticated. |
| 5 | Spot-check the other known-issues files | `filetransfer.md`, `hscdownloader.md`, `picofirmware.md`, `dattools.md`, `utilities.md`, `particlepctools.md`, `hscdisplayerserver.md`. Five minutes each, just so they know what's in there. |
| 6 | `HSC-Displayer-Server-Legacy.pptx` (reference path: presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx) (briefly) | The legacy monolithic server. **Deprecated.** Show it so they recognize it if they ever stumble across it; the directive is "leave it alone, ship to the Flask app." |

**End-of-handoff deliverables to the new maintainer:**
- Their own CADE account + nfhistory SSH key issued per `documentation/UNanofabTools/serveraccess/README.md` §5.1
- Walk-through-complete tick for each of the five sessions
- A clean copy of this START-HERE.md and the entire `presentation/` + `documentation/` + `known-issues/` trees

---

# Path B: Lab management / non-technical stakeholders

Single 45-minute presentation. Audience: advisor, lab director, the rest of the team — people who care about *what was built* and *what state it's in*, not how the Python is organized. **Use only layman READMEs and the layman slides. Don't open the developer docs.**

| Minutes | Show | Talking point |
|--------|------|--------------|
| 0–5 | Title slide of `01-Server-Overview.pptx` (reference path: presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx) | "Here's what this system does — a website that brings together auth, machine data, chemical inventory, and sensor monitoring. One small server runs all of it." |
| 5–15 | First half of `01-Server-Overview.pptx` + browser demo (if available) | Show the actual website. Click through the machine page, chem inventory, particle map. "This is what users see; everything else is plumbing." |
| 15–25 | `presentation/UNanofabTools/liveserver/slides/Live-Server.pptx` (reference path: presentation/UNanofabTools/liveserver/slides/Live-Server.pptx), select slides | The 30-second stats portrait. The listening-ports table. The TLS cert auto-renewal story. **Skip** the deep dives; this is about confidence that the boring infrastructure is solid. |
| 25–35 | Stay on Live-Server deck — the "Auto-managed vs. not" two-column + the IT-handled-backups slide | "Lots of things happen unattended and well — cert renewal, log rotation, the off-box VM backup IT runs. Here's what's not happening yet, that we'd like to fix." |
| 35–40 | The "Top recommendations" slide | Honest framing of the punch list, with the boundary made explicit: "These four items the Nanofab team can ship. These three need IT cooperation." |
| 40–45 | Q&A | Plus: where to find these materials again if anyone wants to drill in. |

**Materials to leave with this audience:**
- The 45-min deck (you've shown it)
- A PDF copy of `presentation/UNanofabTools/liveserver/README.md` (the layman live-server tour — quick read)
- A pointer to `START-HERE.md` (this file) for anyone who wants the full picture later

**Materials NOT to bring out for this audience:**
- The developer docs
- Any individual tool's deep-dive deck
- The detailed known-issues files (the recommendations slide is enough)

---

# Path C: Solo successor (self-paced)

You arrived after I left. There's no presenter. Open files in this order; estimated time per stop is included so you can pace yourself. Total: ~10–15 hours of focused reading, spread however you want.

## Week 1 — Orient (~3 hours)

1. **This file (`START-HERE.md`).** You're here. Read the rest of this section before continuing.
2. `presentation/UNanofabTools/README.md` (reference path: presentation/UNanofabTools/README.md) — the master index of every UNanofabTools tool with one-line descriptions. (5 min)
3. `presentation/UNanofabTools/flaskserver/README.md` (reference path: presentation/UNanofabTools/flaskserver/README.md) — the layman overview of the whole Flask app. (30 min)
4. `presentation/UNanofabTools/liveserver/README.md` (reference path: presentation/UNanofabTools/liveserver/README.md) — what's actually running on `nfhistory`, and **the IT/Nanofab boundary**. Read this twice; the boundary frame matters for everything downstream. (45 min)
5. `presentation/UNanofabTools/serveraccess/README.md` (reference path: presentation/UNanofabTools/serveraccess/README.md) — the layman access guide. (30 min)
6. `presentation/NanofabToolkit/README.md` (reference path: presentation/NanofabToolkit/README.md) — the NanofabToolkit index. (5 min)
7. Open `presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx` (reference path: presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx) and skim it with speaker notes visible. (~30 min)

By end of Week 1 you should be able to describe: what `nfhistory` is, what runs on it, how you'd log in, who owns root, where the data lives.

## Week 2 — Get in and look (~3 hours, includes hands-on)

8. `documentation/UNanofabTools/serveraccess/README.md` (reference path: documentation/UNanofabTools/serveraccess/README.md) — the formal access reference. Pay attention to §5 (admin procedure) and §7 (operational invariants). (45 min)
9. **Hands-on:** follow §3.1 to set up your own access. Get a CADE account, get an nfhistory key issued, place the `~/.ssh/config` block, hop in. Attach to a tmux session, **detach with `Ctrl-b d`**, hop out. (~60 min including waits)
10. `documentation/UNanofabTools/liveserver/README.md` (reference path: documentation/UNanofabTools/liveserver/README.md) — the populated live-server inventory. Walk through every section. (45 min)
11. **Hands-on:** run the survey script as `phelan` and check the result against §11 (the "things root couldn't see") to fill in the gaps in the existing snapshot. Save to `documentation/UNanofabTools/liveserver/snapshots/`. (30 min)

By end of Week 2 you've physically touched the server, you know how to attach and detach safely, and you have a current snapshot of what's there.

## Week 3 — The Flask app (~4 hours)

Read in order. The flaskserver docs are numbered for exactly this purpose.

12. `documentation/UNanofabTools/flaskserver/01-architecture.md` (reference path: documentation/UNanofabTools/flaskserver/01-architecture.md) (30 min)
13. `documentation/UNanofabTools/flaskserver/02-getting-started.md` (reference path: documentation/UNanofabTools/flaskserver/02-getting-started.md) — and follow it if you want a local dev environment (1–2 hours)
14. `documentation/UNanofabTools/flaskserver/03-configuration-reference.md` (reference path: documentation/UNanofabTools/flaskserver/03-configuration-reference.md) (20 min)
15. `documentation/UNanofabTools/flaskserver/04-database-schema.md` (reference path: documentation/UNanofabTools/flaskserver/04-database-schema.md) (45 min) — **note: chem PostgreSQL is local on this same VM**
16. `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (reference path: documentation/UNanofabTools/flaskserver/05-http-api-reference.md) (30 min)
17. `documentation/UNanofabTools/flaskserver/06-service-layer-reference.md` (reference path: documentation/UNanofabTools/flaskserver/06-service-layer-reference.md) (30 min)
18. `documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md` (reference path: documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md) (30 min)
19. `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` (reference path: documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md) (30 min)
20. `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md` (reference path: documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md) (30 min)
21. `documentation/UNanofabTools/flaskserver/10-development-guide.md` (reference path: documentation/UNanofabTools/flaskserver/10-development-guide.md) (20 min)

## Week 4 — The wider ecosystem (~3 hours)

For each tool, the developer README is the deep read; the layman one is a cheaper alternative if you only need the gist.

22. `documentation/UNanofabTools/hscdownloader/README.md` (reference path: documentation/UNanofabTools/hscdownloader/README.md) (20 min)
23. `documentation/UNanofabTools/filetransfer/README.md` (reference path: documentation/UNanofabTools/filetransfer/README.md) (20 min)
24. `documentation/NanofabToolkit/PicoHelperTools/README.md` (reference path: documentation/NanofabToolkit/PicoHelperTools/README.md) (30 min) — the canonical firmware
25. `documentation/NanofabToolkit/ParticleSensor/README.md` (reference path: documentation/NanofabToolkit/ParticleSensor/README.md) (20 min)
26. `documentation/NanofabToolkit/ParalyneReader/README.md` (reference path: documentation/NanofabToolkit/ParalyneReader/README.md) (15 min)
27. `documentation/UNanofabTools/dattools/README.md` (reference path: documentation/UNanofabTools/dattools/README.md) (15 min)
28. `documentation/UNanofabTools/utilities/README.md` (reference path: documentation/UNanofabTools/utilities/README.md) (15 min)
29. `documentation/NanofabToolkit/ALDPeakCounter/README.md` (reference path: documentation/NanofabToolkit/ALDPeakCounter/README.md), `DentonDecoder/README.md` (reference path: documentation/NanofabToolkit/DentonDecoder/README.md), `PreciousMetalReader/README.md` (reference path: documentation/NanofabToolkit/PreciousMetalReader/README.md) (10 min each)
30. `documentation/UNanofabTools/hscdisplayerserver/README.md` (reference path: documentation/UNanofabTools/hscdisplayerserver/README.md) (15 min) — **deprecated**, kept for historical reference only
31. `documentation/UNanofabTools/picofirmware/README.md` (reference path: documentation/UNanofabTools/picofirmware/README.md) and `particlepctools/README.md` (reference path: documentation/UNanofabTools/particlepctools/README.md) (10 min each) — older copies, canonical lives in NanofabToolkit

## Week 5 — What needs work (~2 hours)

The punch list. Open these in this order; severity is right at the top of each file.

32. `known-issues/UNanofabTools/README.md` (reference path: known-issues/UNanofabTools/README.md) — master index and cross-cutting themes (20 min)
33. `known-issues/UNanofabTools/liveserver.md` (reference path: known-issues/UNanofabTools/liveserver.md) — the live-server findings, with Nanofab-actionable vs IT-ticket split (20 min)
34. `known-issues/UNanofabTools/serveraccess.md` (reference path: known-issues/UNanofabTools/serveraccess.md) — access-pattern tech debt (15 min)
35. `known-issues/UNanofabTools/flaskserver.md` (reference path: known-issues/UNanofabTools/flaskserver.md) — Flask app punch list (30 min)
36. The remaining per-tool issues files (`filetransfer.md`, `hscdownloader.md`, `picofirmware.md`, `dattools.md`, `utilities.md`, `particlepctools.md`, `hscdisplayerserver.md`) — five minutes each
37. `known-issues/NanofabToolkit/` (reference path: known-issues/NanofabToolkit/) if it exists — any sibling-repo findings

## After Week 5

You're current. Re-run the live-server survey every quarter (or after any major change) and update `documentation/UNanofabTools/liveserver/README.md` §17 with the new snapshot. The script is at `documentation/UNanofabTools/liveserver/survey_nfhistory.sh` (reference path: documentation/UNanofabTools/liveserver/survey_nfhistory.sh).

When you find a bug, update the relevant `known-issues/UNanofabTools/<tool>.md` file. When you fix something, remove it from there and mention it in the next snapshot.

---

# Path D: Long-term maintainer deep dive

This is the no-human-context path.

Use it when the maintainer is not just trying to understand the system, but must own it, audit it, extend it, recover it, or decide what to fix next without contacting Faith.

Path C is a reading path. Path D is an evidence path. Do not just read the docs. Confirm the docs against the source repos, the live server, the current known-issues files, and the operational boundary with University IT.


## What Path D Is For

Use Path D when any of these are true:

- Faith is unavailable.
- The system is going to change materially.
- A new maintainer needs to become the long-term owner.
- The docs may be stale and need to be revalidated.
- The live server has drifted from the documented deployment.
- Management needs a maintenance plan, not just a handoff.
- You need to decide what to fix, what to leave alone, and what requires IT.

Do not use Path D for a quick overview. Use Path A, B, or C for that.

## Expected Time

Budget 1-2 focused weeks.

Minimum useful pass:

- 2-3 days if you already have server access, know Flask, and only need a drift check.

Full ownership pass:

- 1 week for a technically strong maintainer.
- 2 weeks if access setup, source recovery, local environment setup, and IT boundary cleanup all have to happen at the same time.

Repeat cadence:

- Quarterly for a maintenance audit.
- Immediately after major deployment, schema, access, or infrastructure changes.
- Immediately after an outage or suspected data-integrity issue.

## Final Outputs

Path D is complete only when these artifacts exist and are current:

- A current live-server survey snapshot under `documentation/UNanofabTools/liveserver/snapshots/`.
- A doc/code drift report listing every mismatch found, even if already fixed.
- An updated `known-issues/` tree with obsolete items removed and new findings added.
- A maintenance plan with next 7 days, next 30 days, and next quarter.
- A list of Nanofab-actionable items vs University IT tickets.
- A short decision log recording the assumptions the next maintainer should inherit.
- A clean git status in the documentation repo after edits are committed.

Do not declare Path D done because you finished reading. It is done when the next maintainer can recover, operate, and change the system using written evidence.

## Source Of Truth Order

When two things disagree, use this order:

1. Live production state observed directly on `nfhistory`.
2. Current source code in the active production checkout.
3. Current source code in the canonical Git repos.
4. Database schemas, migrations, and live database introspection.
5. Current developer documentation.
6. Current layman documentation and slides.
7. Historical snapshots.
8. Memory, assumptions, old chat notes, or "what someone remembers."

If a lower source disagrees with a higher source, update the lower source or write a known-issues item explaining why it is intentionally different.

## Required Workspace Shape

This GitHub repository is the documentation bundle. It intentionally does not include the application source trees.

For a real Path D audit, arrange the working directory like this:

```text
work/
  nanofab-documentation/
  UNanofabTools/
  NanofabToolkit/
```

The source repos may already exist locally. If they do not, recover `UNanofabTools` from GitHub, the handoff archive, or the production server checkout at `/home/phelan/server/UNanofabTools/`. Recover `NanofabToolkit` from GitHub, the handoff archive, or another preserved source copy.

Do not continue into source-code verification until you have the source repos. If the source repos cannot be found, make that the first high-severity finding: the docs are not enough to maintain the system safely without source.

## Non-Negotiable Facts To Preserve

These facts are load-bearing. Every doc, slide, issue file, and runbook should be consistent with them unless the live system has changed and the change is documented.

| Fact | Why it matters |
|------|----------------|
| The live Flask app install path is `/home/phelan/server/UNanofabTools/`. | Recovery commands and survey scripts must use the real production path. |
| `HSCDownloader.py` lives in the same install directory as `run.py`. | There is no separate production home-level HSCDownloader checkout to restart. |
| The chem PostgreSQL database is local to `nfhistory` on `127.0.0.1:5432`. | Architecture, backup, restore, and firewall assumptions depend on this. |
| The Flask app and HSCDownloader currently run in tmux sessions, not systemd. | This is the top Nanofab-owned reliability risk. |
| University IT owns the VM, root, root SSH, base patching, and off-box backups. | Do not assign IT-owned fixes to the Nanofab maintainer. |
| The Nanofab maintainer has `sudo` as `phelan`, not root, and cannot create UNIX users. | Per-user UNIX accounts and root-owned changes are IT tickets. |
| Nanofab owns the Flask app, HSCDownloader, local chem DB, data trees, and `/home/phelan/`. | These are the areas the maintainer can actually fix. |
| `NanofabToolkit` is canonical for PicoHelperTools and ParticleSensor. | Do not patch older copies in `UNanofabTools` unless preserving history. |
| `hscdisplayerserver` is deprecated. | Do not spend major effort improving it unless the live deployment has reverted. |

## Phase 0 - Prepare The Audit

Goal: start from a clean, reproducible workspace.

### Inputs

- This documentation repo.
- The `UNanofabTools` source repo.
- The `NanofabToolkit` source repo.
- Access to `nfhistory`, or a recorded reason why access is unavailable.
- Permission boundaries: Nanofab vs University IT.

### Actions

1. Confirm the docs repo branch:

   ```sh
   cd nanofab-documentation
   git status --short --branch
   git branch -vv
   ```

2. Confirm source repo state:

   ```sh
   git -C ../UNanofabTools status --short --branch
   git -C ../UNanofabTools remote -v
   git -C ../UNanofabTools log -1 --oneline

   git -C ../NanofabToolkit status --short --branch
   git -C ../NanofabToolkit remote -v
   git -C ../NanofabToolkit log -1 --oneline
   ```

3. If any repo is dirty, decide whether the dirty changes belong to the audit. Do not overwrite them. Record:

   - repo
   - branch
   - commit
   - dirty files
   - whether the changes are yours, another maintainer's, or unknown

4. Create an audit notes file outside the committed docs first:

   ```sh
   mkdir -p /tmp/nanofab-path-d
   touch /tmp/nanofab-path-d/audit-notes.md
   ```

5. Use this header:

   ```md
   # Path D Audit Notes - YYYY-MM-DD

   ## Repos
   - nanofab-documentation:
   - UNanofabTools:
   - NanofabToolkit:

   ## Live Server Access
   - Access available:
   - User used:
   - Survey snapshot:

   ## Findings
   - None yet.
   ```

### Exit Criteria

- You know which branch and commit each repo is on.
- You know whether local dirty work exists.
- You know whether you have live server access.
- You have an evidence log started.

## Phase 1 - Build The System Map

Goal: understand the whole system before touching implementation details.

### Read First

1. `START-HERE.md`
2. `README.md`
3. `support/REDACTION-NOTE.md`
4. `presentation/UNanofabTools/README.md`
5. `documentation/UNanofabTools/README.md`
6. `known-issues/UNanofabTools/README.md`
7. `presentation/NanofabToolkit/README.md`
8. `documentation/NanofabToolkit/README.md`
9. `known-issues/NanofabToolkit/README.md`

### Write Down

Create a one-page system map with these headings:

- Public website and users.
- Flask app.
- Authentication and Duo.
- SQLite databases.
- Chem PostgreSQL database.
- HSCDownloader and CORES data.
- File-transfer scripts from tool PCs.
- Pico sensor firmware.
- ParticleSensor desktop viewer.
- Other desktop tools.
- Deprecated legacy server.
- University IT-owned infrastructure.
- Nanofab-owned operational surface.

### Questions You Must Be Able To Answer

- What does `nfhistory` provide to cleanroom users?
- Which data comes from CORES?
- Which data comes from machine control PCs?
- Which data comes from Pico devices?
- Which databases are SQLite?
- Which database is PostgreSQL?
- Which parts can Nanofab fix without IT?
- Which parts require an IT ticket?
- Which code copies are canonical?
- Which code copies are historical only?

### Exit Criteria

- You can explain the system in 10 minutes without opening a file.
- You can draw the data flow from producers to website.
- You can identify the operational owner for each major component.

## Phase 2 - Run The Mechanical Documentation Audit

Goal: catch missing files, broken links, and stale wording before doing deeper judgment work.

### Actions

From the documentation repo:

```sh
bash support/audit.sh
```

Read all output. Do not treat the script as authoritative; it is a starter report.

Important: because this GitHub repo is documentation-only, source repos may not be inside the docs repo. For source-code checks, use sibling directories `../UNanofabTools` and `../NanofabToolkit`.

### Check Specifically

- Missing layman READMEs.
- Missing slide decks.
- Missing developer docs.
- Missing known-issues files.
- Broken markdown links.
- Stale `~/UNanofabTools` references.
- Stale home-level HSCDownloader path references.
- Wording that incorrectly describes chem PostgreSQL as off-host.
- Backup-missing wording without University IT context.
- Per-user server-account wording without IT-ticket context.
- Root SSH recommendations assigned to Nanofab instead of IT.

### Exit Criteria

- Every mechanical finding is either fixed or listed in the drift report.
- You understand which hits are real issues and which are acceptable historical context.

## Phase 3 - Verify Access And Live State

Goal: compare documentation to production reality.

### Read First

1. `documentation/UNanofabTools/serveraccess/README.md`
2. `presentation/UNanofabTools/serveraccess/README.md`
3. `documentation/UNanofabTools/liveserver/README.md`
4. `known-issues/UNanofabTools/serveraccess.md`
5. `known-issues/UNanofabTools/liveserver.md`

### Safe Access Rules

- Use the documented two-hop SSH path through CADE.
- Attach to tmux only when needed.
- Detach with `Ctrl-b d`.
- Do not type `exit` inside the live service pane.
- Do not press `Ctrl-c` inside the live service pane.
- Do not edit `.env`, database files, nginx config, systemd units, or SSH keys during an audit unless the task is explicitly a maintenance change.

### Live Checks

On `nfhistory`, verify:

- Hostname and OS.
- IP address.
- nginx status and listener.
- TLS certificate path and renewal mechanism.
- tmux sessions `flaskserver` and `downloader`.
- Flask process command.
- HSCDownloader process command.
- Production install path.
- Python venv path.
- `.env` key names, not secret values.
- SQLite database files in `instance/`.
- PostgreSQL service and local listener.
- Data-tree freshness for `HSCDATA/`, `LogData/`, and `uploads/`.
- Disk usage.
- Cleanroom-specific cron entries.
- Backup assumptions and what IT covers.

### Survey Snapshot

Run the survey script using the documented procedure:

```sh
bash ~/survey_nfhistory.sh | tee /tmp/nfhistory_survey_$(date +%F).txt
```

Copy the result into:

```text
documentation/UNanofabTools/liveserver/snapshots/
```

Before committing any snapshot, inspect it for secrets. Redact secret values. Keep key names, paths, service names, and non-secret operational facts.

### Exit Criteria

- The live-server doc matches the current survey or has clear notes where it differs.
- The known-issues live-server list matches current reality.
- Anything that changed since the last snapshot is documented.

## Phase 4 - Reconstruct The Runtime Architecture

Goal: know how a request or data update travels through the system.

### Build This Diagram

Write or update a plain-text diagram with these nodes:

```text
Browser/user
  -> DNS/TLS/nginx
  -> Flask app on 127.0.0.1:5000
  -> auth/session/Duo
  -> blueprints/routes
  -> SQLite databases
  -> local PostgreSQL chem database
  -> HSCDATA/LogData/uploads

CORES/n8n
  -> HSCDownloader.py
  -> HSCDATA/*.csv
  -> Flask machine pages

Tool control PCs
  -> file-transfer scripts
  -> LogData/
  -> Flask data displays

Pico devices
  -> unauthenticated IoT API routes
  -> sensor storage/views

NanofabToolkit desktop tools
  -> local files or nfhistory APIs, depending on tool
```

### Validate Against Docs

Compare:

- `presentation/UNanofabTools/flaskserver/README.md`
- `documentation/UNanofabTools/flaskserver/01-architecture.md`
- `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md`
- `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`
- `documentation/UNanofabTools/liveserver/README.md`

### Exit Criteria

- You know every producer of data.
- You know every persistent data store.
- You know every long-running process.
- You know what nginx does and does not do.
- You know which components are current vs deprecated.

## Phase 5 - Audit The Flask App Against The Docs

Goal: prove that the developer docs describe the code that actually exists.

### Commands

From the documentation repo:

```sh
rg -n "Blueprint|@.*route|route\\(" ../UNanofabTools
rg -n "login_required|session|Duo|duo|auth" ../UNanofabTools
rg -n "CHEM_|SQLALCHEMY|DATABASE|SECRET|FLASK_" ../UNanofabTools
rg -n "sqlite|postgres|psycopg|SQLAlchemy|create_engine" ../UNanofabTools
rg -n "HSCDATA|LogData|uploads|instance" ../UNanofabTools
```

### Compare To Docs

Check these pairs line by line:

| Code area | Documentation |
|-----------|---------------|
| app factory and startup | `documentation/UNanofabTools/flaskserver/01-architecture.md`, `02-getting-started.md` |
| env vars and config classes | `03-configuration-reference.md` |
| SQLite and chem schema | `04-database-schema.md` |
| HTTP routes | `05-http-api-reference.md` |
| service/helper functions | `06-service-layer-reference.md` |
| auth and Duo | `07-authentication-and-authorization.md` |
| external/internal integrations | `08-integrations-and-data-contracts.md` |
| deployment and operations | `09-deployment-and-operations.md` |
| dev workflow | `10-development-guide.md` |

### Route Audit

For every documented route, confirm:

- URL rule.
- HTTP methods.
- blueprint or module.
- login requirement.
- request payload.
- response shape.
- template rendered or file returned.
- database or filesystem side effect.
- whether the route is user-facing, admin-facing, or device-facing.

For every actual route in code, confirm it appears in the docs or is intentionally omitted with a reason.

### Configuration Audit

For every documented env var, confirm:

- exact spelling
- default value behavior
- production requirement
- whether it is safe to omit in development
- whether it is a secret
- where it is consumed in code

For every env var consumed in code, confirm it appears in the docs.

### Exit Criteria

- No undocumented production route remains unless explicitly explained.
- No documented route points to dead code.
- Env-var docs match code exactly.
- Startup docs match `run.py` and the production tmux state.

## Phase 6 - Audit Databases And Data Durability

Goal: know what data exists, where it lives, how it is backed up, and how it can be restored.

### SQLite

Check:

- Which SQLite databases exist under `instance/`.
- Which code modules open each one.
- Whether schemas are created automatically or manually.
- Whether migrations exist.
- Whether tables are documented.
- Whether backups include them.

### Chem PostgreSQL

Check:

- live service unit: `postgresql@17-main.service`
- listener: `127.0.0.1:5432`
- database name
- application user
- schema files in `UNanofabTools`
- live schema vs committed schema
- whether `chem_schema.sql` and `chem_schema_migration_v2.sql` are current
- whether `init_chem_db.py` is complete or only partial
- whether app write routes are authenticated

Do not paste database passwords into docs. Record key names and access path only.

### File Trees

Check:

- `HSCDATA/`
- `LogData/`
- `uploads/`
- particle sensor data storage
- machine log directories
- generated files
- whether each is authoritative, cache-like, or derived

### Backup Questions

Answer these in writing:

- What does University IT back up?
- Does the backup include `/home/phelan/`?
- Does it include the PostgreSQL data directory?
- Does it include `/etc/letsencrypt/`?
- What is the restore path if the VM is lost?
- What can Nanofab restore without IT?
- Is there a local `pg_dump` schedule?
- Are there unbacked-up data trees?

### Exit Criteria

- A maintainer can name every durable data store.
- A maintainer can describe how to back up and restore each one.
- Any unknown backup boundary is filed as an IT question, not guessed.

## Phase 7 - Audit Security And Identity

Goal: understand who can get in, what secrets exist, and what should be hardened first.

### Areas To Review

- CADE access path.
- `phelan` shared UNIX account.
- `/home/phelan/.ssh/authorized_keys` management.
- root SSH as University IT's access path.
- sudo rights available to Nanofab.
- Flask login flow.
- Duo integration.
- Flask session settings.
- admin authorization checks.
- chem write routes.
- unauthenticated device API routes.
- hard-coded secrets in source.
- `.env` secret handling.
- WiFi credentials in Pico firmware.
- CORES bearer token handling.
- GitHub documentation redactions.

### Secret Handling Rules

- Do not commit live secret values.
- Do not paste `.env` values into markdown.
- Do not paste bearer tokens, WiFi passwords, Duo keys, private SSH keys, or database passwords.
- It is acceptable to document secret key names, rotation procedures, where secrets are read, and where they should live.
- If a secret was ever committed to source, assume it must be rotated.

### Triage

For each security item, classify:

- High: exploitable access, unauthenticated write, live secret, data exposure.
- Medium: weak operational control, personal-account dependency, missing audit trail.
- Low: cleanup, clarity, hardening with low immediate risk.
- IT ticket: root, VM, network, backups, OS patching, per-user UNIX accounts.
- Nanofab-actionable: app code, `.env`, `/home/phelan/`, tmux, HSCDownloader, chem DB app permissions, docs.

### Exit Criteria

- Every secret exposure is listed with rotation guidance.
- Every identity/access recommendation is assigned to Nanofab or IT.
- The maintainer knows what not to touch without IT.

## Phase 8 - Audit Integrations And Tool Ecosystem

Goal: know every thing outside Flask that feeds, reads, or depends on the system.

### UNanofabTools Components

Audit these:

- `hscdownloader`
- `filetransfer`
- `dattools`
- `utilities`
- `picofirmware` older copies
- `particlepctools` older copy
- `hscdisplayerserver` deprecated server

For each component, record:

- purpose
- source path
- production status
- canonical vs historical status
- inputs
- outputs
- external systems
- secrets
- known issues
- what "healthy" looks like
- how to test without touching production

### NanofabToolkit Components

Audit these:

- `PicoHelperTools`
- `ParticleSensor`
- `ParalyneReader`
- `ALDPeakCounter`
- `DentonDecoder`
- `PreciousMetalReader`

For each, record:

- canonical source path
- supported operating system or hardware
- input file/device format
- output file/API behavior
- relation to `nfhistory`
- whether the docs describe the current implementation
- whether the presentation deck is accurate enough for non-coders

### Canonical Copy Rule

If the same concept exists in both repos:

- Treat `NanofabToolkit/PicoHelperTools` as canonical for Pico firmware.
- Treat `NanofabToolkit/ParticleSensor` as canonical for the particle desktop viewer.
- Treat `UNanofabTools/picofirmware` and `UNanofabTools/particlepctools` as historical unless live evidence proves otherwise.

### Exit Criteria

- A maintainer knows which repo to patch for each tool.
- Deprecated tools are clearly marked.
- No integration depends on an undocumented secret or undocumented path.

## Phase 9 - Triage Known Issues

Goal: convert the punch list into a maintenance plan.

### Read

1. `known-issues/UNanofabTools/README.md`
2. `known-issues/UNanofabTools/liveserver.md`
3. `known-issues/UNanofabTools/serveraccess.md`
4. `known-issues/UNanofabTools/flaskserver.md`
5. every remaining `known-issues/UNanofabTools/*.md`
6. every `known-issues/NanofabToolkit/*.md`

### For Each Issue

Confirm:

- still exists
- severity is correct
- owner is Nanofab, IT, or both
- suggested fix is feasible
- code path still exists
- doc references still point to real files
- any secret named there is redacted or represented by placeholder

### Priority Rules

Fix first:

1. active security exposures
2. unauthenticated writes or unsafe device endpoints
3. data-loss risks
4. production reliability risks
5. schema drift that blocks recovery
6. personal-account dependencies
7. doc/code mismatches that could cause bad operations
8. deprecated-code cleanup
9. cosmetic cleanup

### Exit Criteria

- Every issue has an owner.
- Every issue has a current status.
- No fixed issue remains as if it were still broken.
- No active high-severity finding is buried in a low-priority file.

## Phase 10 - Build The Maintenance Plan

Goal: leave a concrete next-action plan, not a pile of observations.

### Next 7 Days

This section should include urgent work only:

- restore or confirm access
- verify tmux sessions
- close obviously stale editor sessions
- rotate exposed secrets
- document current `.env` key names without values
- confirm backups with IT
- add any missing high-severity known issue

### Next 30 Days

This section should include material improvements:

- move Flask app and HSCDownloader under systemd or another supervisor
- reconcile chem schema and migrations
- authenticate or otherwise protect chem write routes
- remove production-targeting defaults from test tools
- replace personal-account file-transfer dependency
- create a local `pg_dump` routine if appropriate
- update docs after every accepted fix

### Next Quarter

This section should include structural work:

- test restore procedures
- retire the legacy server if confirmed unused
- reduce shared-account dependence with IT if policy allows
- review all secrets and rotation procedures
- repeat Path D mechanical audit
- refresh live-server snapshot
- review dependency versions and OS patch status with IT

### Exit Criteria

- A manager can see what will be fixed when.
- A maintainer can start the next task without asking for priority context.
- IT tickets are separated from Nanofab-owned engineering work.

## Phase 11 - Write Decision Records

Goal: prevent future maintainers from rediscovering why the system is shaped this way.

Create a short decision log in the audit notes. Commit a cleaned version if it is useful and contains no secrets.

Use this template:

```md
## Decision: <short name>

- Date:
- Status: active / superseded / needs review
- Context:
- Decision:
- Consequences:
- Owner:
- Related docs:
- Related known issues:
```

Recommended decisions to record:

- Why `nfhistory` is jointly owned by University IT and Nanofab.
- Why Nanofab uses shared UNIX account `phelan`.
- Why root access is not a Nanofab maintenance path.
- Why the app currently runs in tmux.
- Whether and when to migrate to systemd.
- Why chem PostgreSQL is local.
- Which source repo is canonical for Pico firmware.
- Which source repo is canonical for ParticleSensor.
- Why `hscdisplayerserver` is deprecated.
- Which backup responsibilities are IT-owned.

### Exit Criteria

- Future maintainers inherit reasons, not just commands.
- Any uncomfortable operational compromise is documented honestly.

## Phase 12 - Practice Operational Scenarios

Goal: prove the maintainer can operate the system without undocumented help.

Do these as dry runs unless there is an actual incident.

### Website Is Down

Answer:

- Is nginx running?
- Is port 443 listening?
- Is nginx proxying to `127.0.0.1:5000`?
- Is the Flask process alive?
- Is the `flaskserver` tmux session alive?
- Are there recent tracebacks?
- Is disk full?
- Did `.env` or the venv change?
- Can you restart safely using the documented tmux procedure?

### New CORES Data Is Missing

Answer:

- Is `downloader` tmux alive?
- Is `python3 HSCDownloader.py` running?
- Is there a stale editor pane that confused the operator?
- Are new files appearing in `HSCDATA/`?
- Did the CORES/n8n endpoint or token change?
- Are errors logged?
- Is this a source issue, secret issue, or external CORES issue?

### Chem Pages Fail

Answer:

- Is PostgreSQL running locally?
- Is it listening on `127.0.0.1:5432`?
- Are `CHEM_*` env vars present?
- Does the live schema match the code?
- Is a migration missing?
- Are write routes protected?
- Is the issue limited to chem or app-wide?

### A Maintainer Needs Access

Answer:

- Do they have a CADE account?
- Do they have a public key?
- Who is allowed to append it to `/home/phelan/.ssh/authorized_keys`?
- How is the key labeled?
- How is access revoked?
- What requires IT?

### The VM Is Lost

Answer:

- Who opens the IT restore ticket?
- What backup does IT restore?
- How do you verify `/home/phelan/` returned?
- How do you verify PostgreSQL returned?
- How do you verify TLS certs returned?
- How do you restart Flask and HSCDownloader?
- What data may be missing?

### Exit Criteria

- The maintainer can talk through each scenario without guessing.
- Any guessed step becomes a doc update or known issue.

## Phase 13 - No-Contact Exit Exam

Goal: prove the handoff is independent of Faith.

The maintainer should be able to answer every question below from docs, source, live state, or IT tickets.

### System Ownership

- Who owns the VM?
- Who owns root?
- Who owns `/home/phelan/`?
- Who owns the Flask app?
- Who owns the local chem PostgreSQL database?
- Who owns off-box backups?
- Who is allowed to create per-user server accounts?
- Which tasks need IT?
- Which tasks can Nanofab do alone?

### Runtime

- What process serves the Flask app today?
- What process writes `HSCDATA/`?
- What is nginx proxying to?
- What tmux sessions must stay alive?
- What is the production install path?
- What command restarts Flask in the current setup?
- What command restarts the downloader in the current setup?
- What should replace tmux long term?

### Data

- Which data is in SQLite?
- Which data is in PostgreSQL?
- Which data is in CSV files?
- Which data is uploaded from tool PCs?
- Which data is posted by Pico devices?
- Which data is derived vs authoritative?
- What has to be backed up?
- What restore procedure has actually been tested?

### Code

- Where is the Flask app source?
- Where are the Flask routes?
- Where is config loaded?
- Where are auth and Duo handled?
- Where is chem DB access implemented?
- Where is HSCDownloader?
- Which repo has canonical Pico firmware?
- Which repo has canonical ParticleSensor?
- Which code is deprecated?

### Security

- Where are secrets supposed to live?
- Which secrets were historically hard-coded?
- Which secrets must be rotated if exposed?
- Which routes accept unauthenticated device data?
- Which routes perform writes?
- Which auth checks protect admin behavior?
- How is SSH access granted and revoked?
- What should never be committed?

### Maintenance

- What are the top three Nanofab-actionable fixes?
- What are the top three IT tickets?
- What is the quarterly maintenance checklist?
- How do docs get updated after a fix?
- How do known-issues files get closed?
- What evidence is required before deleting a known issue?

If any answer depends on "ask Faith," Path D is not complete. Replace that dependency with documentation, source evidence, or an IT ticket.

## Phase 14 - Close The Audit

Goal: leave the repo better than you found it.

### Required Cleanup

- Update changed docs.
- Update known-issues.
- Add or update live-server snapshot.
- Remove any accidental secret values.
- Run the support audit (`bash support/audit.sh`).
- Run `git diff --check`.
- Review `git diff`.
- Commit documentation changes.
- Push the branch if this is a GitHub-maintained doc set.

### Final Report Template

Use this structure:

```md
# Path D Audit Report - YYYY-MM-DD

## Verdict

## Repos And Commits

## Live State Verified

## Drift Found

## Changes Made

## Remaining Nanofab-Actionable Work

## IT Tickets Needed

## Security Follow-Up

## Backup And Restore Status

## Next 7 Days

## Next 30 Days

## Next Quarter
```

### Done Criteria

Path D is complete when all are true:

- `START-HERE.md` still points to real files.
- The docs reflect the current source code or explicitly note drift.
- The docs reflect the current live server or explicitly note drift.
- Every high-severity known issue is visible in the master known-issues index.
- Every IT-bound item is labeled as an IT ticket.
- Every Nanofab-actionable item has a plausible next step.
- No secret values were committed.
- The next maintainer can answer the exit-exam questions from written materials.

## Appendix A - Useful Search Commands

Run from `nanofab-documentation/`.

```sh
rg -n "~/(UNanofabTools|HSCDownloader)|external.*Postgres(SQL)?|external.*chem" .
rg -n "no backup(s)?|nothing.*backs.*up|backup coverage missing" .
rg -n "create (UNIX|per-person)|u[s]eradd|root[ -]SSH|PermitRootLogin|ice[o]late" .
rg -n "CHEM_|FLASK_|SECRET|DUO|DATABASE|SQLALCHEMY" ../UNanofabTools
rg -n "@.*route|Blueprint|login_required|session" ../UNanofabTools
rg -n "HSCDATA|LogData|uploads|instance|postgres|sqlite" ../UNanofabTools
rg -n "wifi|password|token|bearer|secret|key" ../UNanofabTools ../NanofabToolkit
```

## Appendix B - Sensitive Output Rules

Before committing any audit output:

- Replace bearer tokens with `<redacted-bearer-token>`.
- Replace WiFi passwords with `<redacted-wifi-password>`.
- Replace database passwords with `<redacted-db-password>`.
- Replace Duo secret values with `<redacted-duo-secret>`.
- Replace private key material with `<redacted-private-key>`.
- Keep key names, file paths, command names, usernames, service names, and timestamps.
- For SSH public keys, record owner labels and fingerprints instead of full key bodies unless policy allows the full public key.

## Appendix C - Quarterly Maintenance Checklist

Do this every quarter:

- Run `bash support/audit.sh`.
- Refresh the live-server survey snapshot.
- Confirm both tmux sessions or their replacement supervisor are healthy.
- Confirm HSCDownloader is writing fresh `HSCDATA/`.
- Confirm PostgreSQL is running locally and is backed up.
- Confirm SQLite/data trees are covered by backup.
- Confirm TLS renewal is healthy.
- Review disk usage.
- Review `known-issues/` and close fixed items with evidence.
- Re-scan source for secrets.
- Review IT-ticket items and follow up.
- Confirm `START-HERE.md` still matches the repo layout.
- Confirm canonical-copy notes for PicoHelperTools and ParticleSensor are still true.

## Appendix D - What Not To Spend Time On First

Do not start here unless live evidence changes the priority:

- Polishing deprecated `hscdisplayerserver`.
- Rewriting all desktop tools.
- Reorganizing documentation style.
- Creating per-user UNIX accounts without IT.
- Moving root SSH configuration without IT.
- Making broad refactors before chem schema, supervision, access, and secrets are understood.

The first maintainer-hours should go to reliability, recoverability, security, and removing person-specific operational dependencies.

---

# Path E: Presentation guide

Use Path E when Faith is presenting the exhaustive maintainer handoff live with slides on a screen. Path E is not a separate audit path; it is the speaker-run version of the handoff. It tells the presenter what deck to show, what to say, what docs or source files to open, when to pause for live demonstrations, and what the future maintainer must be able to explain back before moving on.

The guide and verbatim script set are here:

- `support/PRESENTATION-GUIDE.md` (reference path: support/PRESENTATION-GUIDE.md)
- `support/path-e-script/README.md` (reference path: support/path-e-script/README.md)
- `support/path-e-script-minimum/README.md` (reference path: support/path-e-script-minimum/README.md) — 50k-100k target tier
- `support/path-e-script-medium/README.md` (reference path: support/path-e-script-medium/README.md) — 100k-250k target tier
- `support/path-e-script-verbose/README.md` (reference path: support/path-e-script-verbose/README.md) — 250k+ target tier

Use Path E when there is no time limit and the goal is complete maintainer independence. Prefer too much coverage over too little. If the live presentation uncovers missing context, update this `START-HERE.md`, the relevant developer docs, or the relevant `known-issues/` file before the handoff is considered complete.

---

# Quick reference: every deck, every doc, every issue file

Use this section to find anything by name.

## UNanofabTools

### `flaskserver` — the Flask web app (the main thing)
- Layman: `presentation/UNanofabTools/flaskserver/README.md` (reference path: presentation/UNanofabTools/flaskserver/README.md) (and 16 layman section docs in the same folder)
- Slides (16 decks): `presentation/UNanofabTools/flaskserver/slides/` (reference path: presentation/UNanofabTools/flaskserver/slides/)
- Developer reference (10 numbered docs): `documentation/UNanofabTools/flaskserver/` (reference path: documentation/UNanofabTools/flaskserver/)
- Punch list: `known-issues/UNanofabTools/flaskserver.md` (reference path: known-issues/UNanofabTools/flaskserver.md)

### `serveraccess` — how to log in
- Layman: `presentation/UNanofabTools/serveraccess/README.md` (reference path: presentation/UNanofabTools/serveraccess/README.md)
- Slides: `Server-Access.pptx` (reference path: presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx) (17 slides)
- Developer reference: `documentation/UNanofabTools/serveraccess/README.md` (reference path: documentation/UNanofabTools/serveraccess/README.md)
- Punch list: `known-issues/UNanofabTools/serveraccess.md` (reference path: known-issues/UNanofabTools/serveraccess.md)

### `liveserver` — what's actually running on `nfhistory`
- Layman: `presentation/UNanofabTools/liveserver/README.md` (reference path: presentation/UNanofabTools/liveserver/README.md)
- Slides: `Live-Server.pptx` (reference path: presentation/UNanofabTools/liveserver/slides/Live-Server.pptx) (13 slides)
- Developer reference (populated inventory): `documentation/UNanofabTools/liveserver/README.md` (reference path: documentation/UNanofabTools/liveserver/README.md)
- Survey script: `documentation/UNanofabTools/liveserver/survey_nfhistory.sh` (reference path: documentation/UNanofabTools/liveserver/survey_nfhistory.sh)
- Snapshots folder: `documentation/UNanofabTools/liveserver/snapshots/` (reference path: documentation/UNanofabTools/liveserver/snapshots/)
- Punch list: `known-issues/UNanofabTools/liveserver.md` (reference path: known-issues/UNanofabTools/liveserver.md)

### `hscdownloader` — the CORES → HSCDATA ETL
- Layman: `presentation/UNanofabTools/hscdownloader/README.md` (reference path: presentation/UNanofabTools/hscdownloader/README.md)
- Slides: `HSC-Downloader.pptx` (reference path: presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx)
- Developer reference: `documentation/UNanofabTools/hscdownloader/README.md` (reference path: documentation/UNanofabTools/hscdownloader/README.md)
- Punch list: `known-issues/UNanofabTools/hscdownloader.md` (reference path: known-issues/UNanofabTools/hscdownloader.md)

### `filetransfer` — the per-machine log uploaders
- Layman: `presentation/UNanofabTools/filetransfer/README.md` (reference path: presentation/UNanofabTools/filetransfer/README.md)
- Slides: `File-Transfer-Scripts.pptx` (reference path: presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx)
- Developer reference: `documentation/UNanofabTools/filetransfer/README.md` (reference path: documentation/UNanofabTools/filetransfer/README.md)
- Punch list: `known-issues/UNanofabTools/filetransfer.md` (reference path: known-issues/UNanofabTools/filetransfer.md)

### `dattools` — DATfixer + DATgrapher (Denton 635)
- Layman: `presentation/UNanofabTools/dattools/README.md` (reference path: presentation/UNanofabTools/dattools/README.md)
- Slides: `DAT-Tools.pptx` (reference path: presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx)
- Developer reference: `documentation/UNanofabTools/dattools/README.md` (reference path: documentation/UNanofabTools/dattools/README.md)
- Punch list: `known-issues/UNanofabTools/dattools.md` (reference path: known-issues/UNanofabTools/dattools.md)

### `utilities` — the miscellaneous helpers
- Layman: `presentation/UNanofabTools/utilities/README.md` (reference path: presentation/UNanofabTools/utilities/README.md)
- Slides: `Utilities.pptx` (reference path: presentation/UNanofabTools/utilities/slides/Utilities.pptx)
- Developer reference: `documentation/UNanofabTools/utilities/README.md` (reference path: documentation/UNanofabTools/utilities/README.md)
- Punch list: `known-issues/UNanofabTools/utilities.md` (reference path: known-issues/UNanofabTools/utilities.md)

### `picofirmware` (older copies) and `particlepctools` (older copy)
- Layman + developer: `presentation/UNanofabTools/picofirmware/` (reference path: presentation/UNanofabTools/picofirmware/) and `particlepctools/` (reference path: presentation/UNanofabTools/particlepctools/); same for `documentation/`
- **Canonical versions live in NanofabToolkit** — see below
- Punch lists: `known-issues/UNanofabTools/picofirmware.md` (reference path: known-issues/UNanofabTools/picofirmware.md), `particlepctools.md` (reference path: known-issues/UNanofabTools/particlepctools.md)

### `hscdisplayerserver` — the legacy server (deprecated)
- Layman: `presentation/UNanofabTools/hscdisplayerserver/README.md` (reference path: presentation/UNanofabTools/hscdisplayerserver/README.md)
- Slides: `HSC-Displayer-Server-Legacy.pptx` (reference path: presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx)
- Developer reference: `documentation/UNanofabTools/hscdisplayerserver/README.md` (reference path: documentation/UNanofabTools/hscdisplayerserver/README.md) (+ `ROUTES.md`)
- Punch list: `known-issues/UNanofabTools/hscdisplayerserver.md` (reference path: known-issues/UNanofabTools/hscdisplayerserver.md) — **only entry: retire it**

## NanofabToolkit

### `PicoHelperTools` (canonical) — Raspberry Pi Pico firmware
- Layman: `presentation/NanofabToolkit/PicoHelperTools/README.md` (reference path: presentation/NanofabToolkit/PicoHelperTools/README.md)
- Slides: `PicoHelperTools.pptx` (reference path: presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx)
- Developer reference: `documentation/NanofabToolkit/PicoHelperTools/README.md` (reference path: documentation/NanofabToolkit/PicoHelperTools/README.md)

### `ParticleSensor` (canonical) — desktop particle viewer
- Layman: `presentation/NanofabToolkit/ParticleSensor/README.md` (reference path: presentation/NanofabToolkit/ParticleSensor/README.md)
- Slides: `ParticleSensor.pptx` (reference path: presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx)
- Developer reference: `documentation/NanofabToolkit/ParticleSensor/README.md` (reference path: documentation/NanofabToolkit/ParticleSensor/README.md)

### `ParalyneReader` — desktop tool for Parylene analog logs
- Layman + slides + developer reference: under `presentation/NanofabToolkit/ParalyneReader/` (reference path: presentation/NanofabToolkit/ParalyneReader/) and `documentation/NanofabToolkit/ParalyneReader/` (reference path: documentation/NanofabToolkit/ParalyneReader/)

### `ALDPeakCounter`, `DentonDecoder`, `PreciousMetalReader`
- Each has its own folder under both `presentation/NanofabToolkit/` and `documentation/NanofabToolkit/`

## Cross-cutting / master indexes

- `presentation/UNanofabTools/README.md` (reference path: presentation/UNanofabTools/README.md) — every UNanofabTools tool, one-line each
- `documentation/UNanofabTools/README.md` (reference path: documentation/UNanofabTools/README.md) — same, for the developer side
- `known-issues/UNanofabTools/README.md` (reference path: known-issues/UNanofabTools/README.md) — every punch list, with cross-cutting themes
- `presentation/NanofabToolkit/README.md` (reference path: presentation/NanofabToolkit/README.md) — NanofabToolkit layman index
- `documentation/NanofabToolkit/README.md` (reference path: documentation/NanofabToolkit/README.md) — NanofabToolkit developer index

---

## A note from me

I tried to make these materials honest. Where things are weird (the IT/Nanofab boundary, the shared `phelan` account, the deprecated server kept around for context, the old copies of PicoHelperTools and ParticleSensor in the wrong repo), the docs call out the weirdness and explain why it is what it is. The known-issues files are the to-do list a real maintainer would keep — they're not a list of failures to apologize for. If something breaks, start with the relevant punch list; it probably knows.

Good luck. — Faith


# Read-Aloud Documentation Corpus: README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Nanofab Documentation

Private documentation bundle for the Utah Nanofab software/tooling handoff.

## Contents

- `START-HERE.md` — orientation, recommended reading order, and the full Path D deep-audit playbook.
- `support/` — presentation guide, Path E script packs, evaluation prompt, audit script, and redaction note.
- `documentation/` — developer-facing technical documentation.
- `presentation/` — plain-English guides and slide decks.
- `known-issues/` — known bugs, risks, and technical debt.

This repository intentionally excludes the application source trees (`UNanofabTools/` and `NanofabToolkit/`) except where the documentation already contains generated presentation artifacts or explanatory snippets.


# Read-Aloud Documentation Corpus: support/PRESENTATION-GUIDE.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Presentation Guide

This file tells Faith how to present the complete handoff to a future maintainer while showing the existing slide decks on a screen.

Use this when the goal is not a quick briefing. Use it when the next maintainer should leave able to operate, audit, recover, and extend the system without contacting Faith.

This is a presenter script, not another slide deck. Keep the slides visible, but use this file to decide what to emphasize, when to pause, what to demonstrate, and what the maintainer must explain back before moving on.

For a literal read-aloud version with one script per module, use `path-e-script/README.md` (reference path: path-e-script/README.md). That pack is written for a presenter with no private context and includes operator notes, stop points, demo prompts, and explain-back checks.

For longer generated tiers, use `path-e-script-minimum/README.md` (reference path: path-e-script-minimum/README.md), `path-e-script-medium/README.md` (reference path: path-e-script-medium/README.md), or `path-e-script-verbose/README.md` (reference path: path-e-script-verbose/README.md).

## Presentation Philosophy

Take longer than feels necessary.

The danger is not boring the maintainer. The danger is leaving them with a polished overview but no operational confidence. This system is a mixture of web application code, live-server state, data pipelines, desktop tools, sensor firmware, shared-account access, and University IT boundaries. A future maintainer needs the full mental model, not just a tour of files.

Use the decks as anchors:

- The slides give the visual story.
- The layman READMEs give the same story in prose.
- The developer docs give the exact procedures and code-level reference.
- The known-issues files give the honest maintenance plan.
- The live server and source repos prove whether the docs are still true.

For each section, follow this rhythm:

1. Show the relevant deck.
2. Explain the purpose in plain English.
3. Open the matching docs or source files.
4. Demonstrate the live or local evidence if safe.
5. Ask the maintainer to explain it back.
6. Record any confusion as a doc or known-issues update.

Do not move on because you finished the slides. Move on only when the future maintainer can answer the comprehension checks.

## Expected Length

There is no time limit. A good version of this presentation can take several long sessions.

Minimum serious version:

- 2 full days.

Better version:

- 4 to 6 half-day sessions.

Best version:

- Several sessions spread over 1 to 2 weeks, with the maintainer doing reading, source checks, and live-server practice between sessions.

If you have to choose between finishing the deck list and letting the maintainer practice, choose practice.

## Required Setup

Before starting, prepare:

- A screen with slides open in presenter mode if possible.
- This presentation guide open beside the slides.
- START-HERE.md (reference path: ../START-HERE.md) open, with Path D (reference path: ../START-HERE.md#path-d-long-term-maintainer-deep-dive) bookmarked.
- The documentation repo checked out on the current handoff branch.
- The source repos available as sibling directories: `../UNanofabTools` and `../NanofabToolkit`.
- A terminal in `nanofab-documentation/`.
- A terminal in `../UNanofabTools/`.
- A terminal in `../NanofabToolkit/`.
- Browser access to `https://nfhistory.nanofab.utah.edu` if appropriate.
- SSH access to `nfhistory` if this is an operational maintainer handoff.

Before any live demo:

- Never show secret values on screen.
- Never paste bearer tokens, WiFi passwords, database passwords, Duo secrets, or private keys.
- Do not edit production files during the presentation unless the session is explicitly a maintenance session.
- In tmux, detach with `Ctrl-b d`.
- Do not press `Ctrl-c` in a live service pane.
- Do not type `exit` inside a live service pane unless you intentionally want to terminate the shell or process.

## Core Story To Repeat

Repeat this through the entire presentation:

`nfhistory` is not just a website. It is the hub where cleanroom users, machine logs, CORES data, chemical inventory, sensor devices, desktop tools, and University IT-owned infrastructure meet.

The maintainer must understand four boundaries:

- User-facing website vs background data supply.
- Application code vs live production state.
- Nanofab-owned operational surface vs University IT-owned infrastructure.
- Current/canonical code vs historical/deprecated code.

The maintainer should hear these facts many times:

- The live Flask app is installed at `/home/phelan/server/UNanofabTools/`.
- `HSCDownloader.py` lives in that same production install directory.
- Chem PostgreSQL is local on `nfhistory`, listening on `127.0.0.1:5432`.
- The Flask app and HSCDownloader currently run in tmux, not systemd.
- University IT owns the VM, root, root SSH, OS-level backup, and base patching.
- Nanofab owns the Flask app, HSCDownloader, chem DB use, cleanroom data trees, and `/home/phelan/`.
- The Nanofab admin has `sudo` as `phelan`, not root, and cannot create UNIX users.
- `NanofabToolkit` is canonical for PicoHelperTools and ParticleSensor.
- `hscdisplayerserver` is deprecated and should not be improved unless live evidence says it is still in use.

## Presenter Ground Rules

Say these at the beginning:

1. "I am going to over-explain. That is intentional."
2. "If something sounds operationally weird, I will say that directly and explain the boundary."
3. "The slides are not the source of truth. They are a map to the docs, source code, live state, and known issues."
4. "I will ask you to explain things back. That is not a test of you; it is a test of whether the handoff is complete."
5. "Any answer that depends on asking me later gets turned into written documentation today."

## Screen Layout

Use this layout if possible:

- Main screen: slide deck.
- Presenter laptop left pane: this guide.
- Presenter laptop right pane: terminal or documentation.
- Browser tab group: website, GitHub repo, docs files.
- Terminal tab group: docs repo, `../UNanofabTools`, `../NanofabToolkit`, SSH to `nfhistory`.

Do not keep secret-bearing files open on the projected screen. If you need to discuss `.env`, show key names only or use the annotated template in the docs.

## Full Deck Order

Use this as the master order. It intentionally covers more than Path A.

| Order | Deck | Purpose |
|-------|------|---------|
| 1 | 00-Start-Here-Index.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/00-Start-Here-Index.pptx) | Explain the slide series and how to use it. |
| 2 | 01-Server-Overview.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx) | Establish the full server mental model. |
| 3 | Live-Server.pptx (reference path: ../presentation/UNanofabTools/liveserver/slides/Live-Server.pptx) | Explain what is actually running on `nfhistory`. |
| 4 | Server-Access.pptx (reference path: ../presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx) | Teach access, tmux, and safe inspection. |
| 5 | 02-How-It-Starts.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx) | Show startup, app factory, and blueprints. |
| 6 | 03-Configuration.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/03-Configuration.pptx) | Explain env vars, config classes, and data paths. |
| 7 | 04-Authentication-and-Login.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx) | Explain login, sessions, password hashing, and Duo. |
| 8 | 05-Admin-Panel.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx) | Explain admin permissions and user management. |
| 9 | 06-Tasks.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx) | Explain the internal task tracker. |
| 10 | 07-Machines-and-Logs.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx) | Explain machine pages, log browsing, downloads, and graphs. |
| 11 | 08-IoT-API-Endpoints.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx) | Explain device ingestion endpoints and data contracts. |
| 12 | 09-Chemical-Inventory.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx) | Explain the largest feature and the local PostgreSQL dependency. |
| 13 | 10-Database-Models.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx) | Explain SQLite, PostgreSQL, tables, and persistence. |
| 14 | 11-Particle-Demo.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/11-Particle-Demo.pptx) | Explain the standalone demo page. |
| 15 | 12-Consumers-NanofabToolkit.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx) | Explain producers and consumers outside the Flask app. |
| 16 | 13-Request-Lifecycle-Walkthrough.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx) | Tie requests, devices, nginx, auth, routes, and persistence together. |
| 17 | 14-Security-Model.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx) | Explain security strengths and gaps honestly. |
| 18 | 15-Endpoint-Reference.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx) | Explain every route family and how to audit route drift. |
| 19 | HSC-Downloader.pptx (reference path: ../presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx) | Explain the CORES to HSCDATA data supply line. |
| 20 | File-Transfer-Scripts.pptx (reference path: ../presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx) | Explain machine-control-PC uploads. |
| 21 | PicoHelperTools.pptx (reference path: ../presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx) | Explain canonical Pico firmware. |
| 22 | ParticleSensor.pptx (reference path: ../presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx) | Explain canonical desktop particle viewer. |
| 23 | Pico-Firmware.pptx (reference path: ../presentation/UNanofabTools/picofirmware/slides/Pico-Firmware.pptx) | Explain older firmware copies and historical context. |
| 24 | Particle-PC-Tools.pptx (reference path: ../presentation/UNanofabTools/particlepctools/slides/Particle-PC-Tools.pptx) | Explain older particle viewer/test generator copies. |
| 25 | ParalyneReader.pptx (reference path: ../presentation/NanofabToolkit/ParalyneReader/slides/ParalyneReader.pptx) | Explain Parylene desktop data review. |
| 26 | DAT-Tools.pptx (reference path: ../presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx) | Explain DATfixer and DATgrapher. |
| 27 | DentonDecoder.pptx (reference path: ../presentation/NanofabToolkit/DentonDecoder/slides/DentonDecoder.pptx) | Explain the separate Denton charting tool. |
| 28 | ALDPeakCounter.pptx (reference path: ../presentation/NanofabToolkit/ALDPeakCounter/slides/ALDPeakCounter.pptx) | Explain ALD cycle counting and run comparison. |
| 29 | PreciousMetalReader.pptx (reference path: ../presentation/NanofabToolkit/PreciousMetalReader/slides/PreciousMetalReader.pptx) | Explain monthly CORES metal-usage extraction. |
| 30 | Utilities.pptx (reference path: ../presentation/UNanofabTools/utilities/slides/Utilities.pptx) | Explain helper scripts and incomplete utilities. |
| 31 | HSC-Displayer-Server-Legacy.pptx (reference path: ../presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx) | Explain the deprecated predecessor and why to avoid improving it. |

## Module 0 - Set The Contract

### Show

- START-HERE.md (reference path: ../START-HERE.md), especially Path D (reference path: ../START-HERE.md#path-d-long-term-maintainer-deep-dive).
- This presentation guide.

### Say

"This handoff is not only about what files exist. It is about ownership. By the end, you should be able to operate the live server, explain the application architecture, identify what code is canonical, distinguish Nanofab tasks from IT tickets, audit the docs against the code, and create a maintenance plan."

"If you cannot answer something from the docs, source, or live state, we will write it down. The goal is to remove me as a dependency."

### Demonstrate

Open a terminal and run:

```sh
git status --short --branch
bash support/audit.sh
```

Do not dwell on every line yet. Use the audit output to prove the docs have a repeatable mechanical check.

### Ask The Maintainer

- What are the three documentation trees?
- Where are the source repos expected to live?
- What is the difference between Path C and Path D?
- What should happen if source, docs, and live state disagree?

### Do Not Move On Until

The maintainer can explain that this is a documentation-only GitHub repo and that code verification requires the sibling source repos.

## Module 1 - Big Picture Of The Server

### Show

- 00-Start-Here-Index.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/00-Start-Here-Index.pptx)
- 01-Server-Overview.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx)
- presentation/UNanofabTools/flaskserver/README.md (reference path: ../presentation/UNanofabTools/flaskserver/README.md)
- documentation/UNanofabTools/flaskserver/01-architecture.md (reference path: ../documentation/UNanofabTools/flaskserver/01-architecture.md)

### Presenter Intent

Give the maintainer the mental model before showing implementation details. They need to understand that the website is the visible part of a broader data system.

### Talk Track

Start with the user-facing story:

- Users open a cleanroom website.
- They log in.
- They see tasks, machine pages, logs, chemical inventory, and sensor views.
- Some data is entered by people.
- Some data is uploaded by devices.
- Some data is pulled from CORES by the downloader.
- Some data is stored in databases.
- Some data is stored as CSV/log files.

Then expand the system:

- Browser traffic comes through nginx and TLS.
- nginx proxies Flask on loopback.
- Flask routes requests through blueprints.
- Auth and sessions protect user-facing pages.
- Device endpoints are intentionally different from normal browser routes.
- SQLite handles several smaller app databases.
- PostgreSQL handles chemical inventory.
- `HSCDATA/`, `LogData/`, and `uploads/` matter for operational durability.

### Screen Choreography

While showing the overview deck, pause on:

- "What this server does."
- "Who and what uses it."
- "How it fits together."
- "Where each kind of data lives."
- "Why split nginx and Flask."

After those slides, switch to the architecture doc and point to the topology and persistence map. Do not read the whole doc on screen; use it to show that the slide story has a technical reference behind it.

### Ask The Maintainer

- What does `nfhistory` do for a normal cleanroom user?
- What does it do for sensors or machine data?
- Which requests come from people?
- Which requests come from devices?
- Where does nginx fit?
- Where does Flask fit?
- Which data stores are databases?
- Which data stores are file trees?

### Do Not Move On Until

The maintainer can draw the system as:

```text
browser/devices/CORES/tool PCs
  -> nfhistory
  -> nginx/TLS
  -> Flask
  -> SQLite/PostgreSQL/HSCDATA/LogData/uploads
```

## Module 2 - What Is Actually Running On `nfhistory`

### Show

- Live-Server.pptx (reference path: ../presentation/UNanofabTools/liveserver/slides/Live-Server.pptx)
- presentation/UNanofabTools/liveserver/README.md (reference path: ../presentation/UNanofabTools/liveserver/README.md)
- documentation/UNanofabTools/liveserver/README.md (reference path: ../documentation/UNanofabTools/liveserver/README.md)
- known-issues/UNanofabTools/liveserver.md (reference path: ../known-issues/UNanofabTools/liveserver.md)

### Presenter Intent

This is where the maintainer learns the difference between intended deployment and live deployment.

### Talk Track

"The production system is not exactly the ideal runbook. The ideal target is supervised services, but the live state is two tmux sessions. That is not just trivia. It determines how you inspect, restart, monitor, and recover the system."

Drive home:

- `nfhistory` is the live server.
- Debian 13, kernel 6.12, IP `155.98.11.8`.
- nginx handles public HTTPS.
- Flask listens behind nginx.
- PostgreSQL is local.
- TLS is Let's Encrypt and auto-renewed.
- Backups are handled off-box by University IT.
- Flask and HSCDownloader are not under systemd yet.
- University IT owns root, VM-level backup, base patching, and root SSH.
- Nanofab owns the app, downloader, chem DB use, and `/home/phelan/`.

### Screen Choreography

Show the Live Server deck slowly. Pause on:

- "The server in 30 seconds."
- "What's listening on the network."
- "Surprise: chem PostgreSQL is local."
- "Auto-managed vs. not."
- "Backups: handled by IT."
- "Root SSH = IT's access path."
- "Install lives at `~/server/UNanofabTools`."
- "Top recommendations."

Then open the live-server developer doc and show the findings list at the top. Explain that those findings intentionally mirror the known-issues file.

### Optional Live Demo

If live access is available and safe:

```sh
hostname
uname -a
tmux ls
ss -tulpn
systemctl status nginx
systemctl status postgresql@17-main
```

Do not expose secret files. If showing `.env`, show key names only.

### Ask The Maintainer

- What is healthy about the live server?
- What is the top reliability weakness?
- Why is local PostgreSQL important?
- What does University IT own?
- What does Nanofab own?
- What should not be changed by Nanofab?
- What is the real production install path?

### Do Not Move On Until

The maintainer can say: "The app and downloader currently live in tmux. Moving them to systemd is a Nanofab-owned reliability improvement. Root and VM-level backup are IT-owned."

## Module 3 - Server Access And Safe Inspection

### Show

- Server-Access.pptx (reference path: ../presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx)
- presentation/UNanofabTools/serveraccess/README.md (reference path: ../presentation/UNanofabTools/serveraccess/README.md)
- documentation/UNanofabTools/serveraccess/README.md (reference path: ../documentation/UNanofabTools/serveraccess/README.md)
- known-issues/UNanofabTools/serveraccess.md (reference path: ../known-issues/UNanofabTools/serveraccess.md)

### Presenter Intent

This is one of the most important sections. A maintainer who knows the architecture but kills the tmux session during inspection can take the system down.

### Talk Track

"Access is two-hop: laptop to CADE, then CADE to `nfhistory`. On `nfhistory`, the Nanofab maintainer is using the shared UNIX account `phelan`. That is not ideal as a general security model, but it is the current IT boundary. Nanofab cannot create UNIX users."

"The two live processes are in tmux. You can inspect them, but you must detach safely."

### Screen Choreography

Pause hard on these slides:

- "What you need before your first login."
- "Hop 1."
- "Hop 2."
- "On the server: two tmux sessions."
- "Leaving WITHOUT killing the program."
- "The safe inspection ritual."
- "Recovery: re-create flaskserver."
- "Recovery: re-create downloader."
- "Who does what."
- "What goes through IT instead."

Read the detach slide twice.

### Live Demo

If safe:

1. SSH through CADE.
2. Run `tmux ls`.
3. Attach to `flaskserver`.
4. Look only.
5. Detach with `Ctrl-b d`.
6. Attach to `downloader`.
7. Look only.
8. Detach with `Ctrl-b d`.

Then show the survey command:

```sh
bash ~/survey_nfhistory.sh | tee /tmp/nfhistory_survey_$(date +%F).txt
```

If you do not run it live, show where snapshots live:

- documentation/UNanofabTools/liveserver/snapshots/ (reference path: ../documentation/UNanofabTools/liveserver/snapshots/)

### Ask The Maintainer

- What are the two SSH hops?
- Why is `User phelan` in the config?
- What two tmux sessions matter?
- How do you inspect without killing a program?
- What exactly does `Ctrl-b d` do?
- What should you never press casually in a live service pane?
- Which access changes require IT?

### Do Not Move On Until

The maintainer can recite:

```text
attach, look, detach with Ctrl-b d, do not exit, do not Ctrl-c
```

## Module 4 - How The Flask App Starts

### Show

- 02-How-It-Starts.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx)
- presentation/UNanofabTools/flaskserver/02-How-It-Starts.md (reference path: ../presentation/UNanofabTools/flaskserver/02-How-It-Starts.md)
- documentation/UNanofabTools/flaskserver/01-architecture.md (reference path: ../documentation/UNanofabTools/flaskserver/01-architecture.md)
- documentation/UNanofabTools/flaskserver/02-getting-started.md (reference path: ../documentation/UNanofabTools/flaskserver/02-getting-started.md)

### Presenter Intent

Teach the boot sequence so the maintainer knows where startup failures come from.

### Talk Track

"The app starts from `run.py`. That file decides which config to use, creates the Flask app, and runs it. Inside the app factory, extensions initialize, paths get configured, blueprints register, and the databases are made available."

"Blueprints are the app's feature modules. If a page exists, it is probably inside one of the blueprints."

### Source Demo

Open the source repo and show:

```text
../UNanofabTools/run.py
../UNanofabTools/app/__init__.py
../UNanofabTools/app/blueprints/
```

Run:

```sh
rg -n "def create_app|register_blueprint|app.run|FLASK_ENV" ../UNanofabTools
```

### Ask The Maintainer

- What file starts the app?
- What is the app factory?
- What is a blueprint?
- Why is startup different in development vs production?
- What does `db.create_all()` imply about migrations?
- Where would you look if a route existed in code but never responded?

### Do Not Move On Until

The maintainer can explain `run.py -> create_app -> config -> extensions -> blueprints -> routes`.

## Module 5 - Configuration And Local Development

### Show

- 03-Configuration.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/03-Configuration.pptx)
- presentation/UNanofabTools/flaskserver/03-Configuration.md (reference path: ../presentation/UNanofabTools/flaskserver/03-Configuration.md)
- documentation/UNanofabTools/flaskserver/03-configuration-reference.md (reference path: ../documentation/UNanofabTools/flaskserver/03-configuration-reference.md)
- documentation/UNanofabTools/flaskserver/02-getting-started.md (reference path: ../documentation/UNanofabTools/flaskserver/02-getting-started.md)

### Presenter Intent

Make configuration concrete. The maintainer should know which settings are safe defaults, which are production secrets, and which paths matter.

### Talk Track

"Configuration is not decoration. It decides database paths, session behavior, Duo behavior, upload size, data directories, and whether the app behaves like development or production."

"The live app uses an `.env` file. Do not commit secret values. Do document key names."

### Source Demo

Show:

```text
../UNanofabTools/config/config.py
documentation/UNanofabTools/flaskserver/03-configuration-reference.md
```

Run:

```sh
rg -n "os.getenv|CHEM_|DUO|SECRET|SESSION|SQLALCHEMY|UPLOAD|DATA" ../UNanofabTools/config
```

Then compare with the docs.

### Explain These Carefully

- `SECRET_KEY` must be strong in production.
- Duo values are required when Duo is enabled.
- Chem DB settings point to local PostgreSQL on the live VM.
- SQLite paths resolve relative to `instance/`.
- `HSCDATA`, `LogData`, and `uploads` are operational data trees.
- Development defaults are not a security model.

### Ask The Maintainer

- Which env vars are secrets?
- Which env vars point to databases?
- Which config values affect cookie/session behavior?
- What breaks if `CHEM_*` values are wrong?
- What should be documented from `.env` and what should never be shown?

### Do Not Move On Until

The maintainer can identify production-sensitive config without seeing secret values.

## Module 6 - Authentication, Authorization, And Admin

### Show

- 04-Authentication-and-Login.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx)
- 05-Admin-Panel.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx)
- presentation/UNanofabTools/flaskserver/04-Authentication-and-Login.md (reference path: ../presentation/UNanofabTools/flaskserver/04-Authentication-and-Login.md)
- presentation/UNanofabTools/flaskserver/05-Admin-Panel.md (reference path: ../presentation/UNanofabTools/flaskserver/05-Admin-Panel.md)
- documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md (reference path: ../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md)

### Presenter Intent

Make the maintainer understand who can log in, how login is verified, how sessions work, where Duo fits, and how admin powers are guarded.

### Talk Track

"Authentication answers who you are. Authorization answers what you are allowed to do. The app uses both."

"Passwords are hashed, not stored as plaintext. Sessions let the app remember the user. Duo adds a second factor. The admin panel has server-side checks, not just hidden buttons."

### Source Demo

Show:

```text
../UNanofabTools/app/blueprints/auth.py
../UNanofabTools/app/blueprints/admin.py
../UNanofabTools/app/services/auth_service.py
../UNanofabTools/app/services/admin_service.py
```

Run:

```sh
rg -n "login_required|admin_required|session|duo|hash|verify|toggle|deleteUser" ../UNanofabTools/app
```

### Explain These Risks

- Admin checks must be enforced server-side.
- Password reset flows are sensitive.
- Duo settings are production-sensitive.
- Session lifetime and deletion behavior matter.
- Any admin route drift should be reflected in endpoint docs.

### Ask The Maintainer

- What is the difference between `login_required` and `admin_required`?
- Where is the first admin bootstrapped or assigned?
- How does the app avoid storing plaintext passwords?
- What does Duo add?
- What would you inspect if admin buttons disappeared but routes still worked?
- What would you inspect if login worked locally but not in production?

### Do Not Move On Until

The maintainer can identify the login route, admin route, service-layer auth helpers, and authorization matrix.

## Module 7 - Tasks And Everyday User Workflows

### Show

- 06-Tasks.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx)
- presentation/UNanofabTools/flaskserver/06-Tasks.md (reference path: ../presentation/UNanofabTools/flaskserver/06-Tasks.md)
- documentation/UNanofabTools/flaskserver/05-http-api-reference.md (reference path: ../documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- documentation/UNanofabTools/flaskserver/06-service-layer-reference.md (reference path: ../documentation/UNanofabTools/flaskserver/06-service-layer-reference.md)

### Presenter Intent

Use the task tracker as the first example of a normal user-facing Flask feature.

### Talk Track

"Tasks are a good first feature to understand because they use routes, templates, login checks, SQLite, service helpers, assignment logic, status changes, and file uploads."

### Source Demo

Show:

```text
../UNanofabTools/app/blueprints/tasks.py
../UNanofabTools/app/services/task_service.py
../UNanofabTools/app/templates/
```

Run:

```sh
rg -n "tasks|createtasks|changestatus|claimTask|uploadtaskfile|TaskAssignee|TaskFile" ../UNanofabTools/app
```

### Ask The Maintainer

- Which database stores tasks?
- What routes create or update tasks?
- What route uploads task files?
- What protects task pages?
- Why do assignees live separately from tasks?
- What would you check if task attachments stopped working?

### Do Not Move On Until

The maintainer can trace one task from creation to database row to dashboard display.

## Module 8 - Machines, Logs, And The File-Based Data Model

### Show

- 07-Machines-and-Logs.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx)
- presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md (reference path: ../presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md)
- documentation/UNanofabTools/flaskserver/05-http-api-reference.md (reference path: ../documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md (reference path: ../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md)

### Presenter Intent

Make the maintainer understand that not all important data is in a database.

### Talk Track

"Machine pages are powered by a mixture of code routes and file trees. Some files come from HSCDownloader. Some come from machine PCs. Some are logs. These directories are not optional; they are part of the production data model."

### Source Demo

Show:

```text
../UNanofabTools/app/blueprints/machines.py
../UNanofabTools/app/services/data_service.py
../UNanofabTools/HSCDATA/
../UNanofabTools/LogData/
```

Run:

```sh
rg -n "HSCDATA|LogData|download|graph|render_machine_data|render_log_files|submitALDData" ../UNanofabTools/app
```

### Explain These Carefully

- Safe downloads require path checks.
- Log graphing depends on file format assumptions.
- `HSCDATA` comes from HSCDownloader.
- `LogData` often comes from machine-control-PC transfers.
- File trees must be backed up, not just databases.

### Ask The Maintainer

- Which directories feed machine pages?
- What is the difference between `HSCDATA` and `LogData`?
- What makes file download routes dangerous if implemented carelessly?
- What would you check if a machine page is stale?
- What would you check if graphing fails for one log file?

### Do Not Move On Until

The maintainer can name the machine data path from external producer to web page.

## Module 9 - Device APIs And Sensor Data

### Show

- 08-IoT-API-Endpoints.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx)
- 12-Consumers-NanofabToolkit.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx)
- presentation/UNanofabTools/flaskserver/08-IoT-API-Endpoints.md (reference path: ../presentation/UNanofabTools/flaskserver/08-IoT-API-Endpoints.md)
- presentation/UNanofabTools/flaskserver/12-Consumers-NanofabToolkit.md (reference path: ../presentation/UNanofabTools/flaskserver/12-Consumers-NanofabToolkit.md)
- documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md (reference path: ../documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md)

### Presenter Intent

Make the maintainer understand device endpoints as a different trust model from normal user pages.

### Talk Track

"The app has routes for devices. They are not the same as browser pages. A Raspberry Pi or other device posts readings. The server validates shape, writes files or database rows, and returns simple responses."

"The unauthenticated device route model is an honest security trade-off. It should be understood, documented, and hardened deliberately."

### Source Demo

Show:

```text
../UNanofabTools/app/blueprints/api.py
../NanofabToolkit/PicoHelperTools/
../NanofabToolkit/ParticleSensor/
```

Run:

```sh
rg -n "particle-data|sensor-data|env-data|sdsanalog|denton18pump|POST|GET" ../UNanofabTools/app/blueprints/api.py
rg -n "particle-data|sensor-data|env-data|requests|urequests|room|sensor" ../NanofabToolkit/PicoHelperTools ../NanofabToolkit/ParticleSensor
```

### Explain These Data Contracts

- Particle readings.
- Environmental readings.
- Combined sensor readings.
- Parylene analog batches.
- Denton 18 pump logs.
- Desktop apps reading back data.

### Ask The Maintainer

- Which endpoints accept device data?
- Which endpoints are unauthenticated?
- What does a particle reading contain?
- Where does particle data get written?
- Which source repo is canonical for Pico firmware?
- Which source repo is canonical for the ParticleSensor desktop app?
- What should be hardened first if device writes become a concern?

### Do Not Move On Until

The maintainer can trace a Pico reading from firmware to Flask route to storage to viewer.

## Module 10 - Chemical Inventory And PostgreSQL

### Show

- 09-Chemical-Inventory.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx)
- 10-Database-Models.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx)
- presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md (reference path: ../presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md)
- presentation/UNanofabTools/flaskserver/10-Database-Models.md (reference path: ../presentation/UNanofabTools/flaskserver/10-Database-Models.md)
- documentation/UNanofabTools/flaskserver/04-database-schema.md (reference path: ../documentation/UNanofabTools/flaskserver/04-database-schema.md)
- known-issues/UNanofabTools/flaskserver.md (reference path: ../known-issues/UNanofabTools/flaskserver.md)

### Presenter Intent

This is one of the most important modules. The chem inventory is the biggest feature, uses PostgreSQL instead of SQLite, and has known schema/security issues that a maintainer must understand.

### Talk Track

"The chemical inventory is not just another page. It has its own PostgreSQL schema, barcode sequence, containers, items, rooms, cabinets, scan/audit tables, reports, and transaction history."

"The live chem database is local on `nfhistory`. Older external-database wording was corrected. If you see external-Postgres assumptions in future docs, treat that as drift."

### Source Demo

Show:

```text
../UNanofabTools/app/blueprints/chem_inventory.py
../UNanofabTools/app/services/chem_service.py
../UNanofabTools/chem_schema.sql
../UNanofabTools/chem_schema_migration_v2.sql
documentation/UNanofabTools/flaskserver/04-database-schema.md
```

Run:

```sh
rg -n "CHEM_|create_engine|postgres|containers|items|rooms|transactions|barcode|scan|report" ../UNanofabTools
```

### Live Demo If Safe

Show service existence and listener only:

```sh
systemctl status postgresql@17-main
ss -tulpn | rg "5432|postgres"
```

Do not show database passwords.

### Explain These Risks

- Committed schema can drift from live schema.
- `init_chem_db.py` is not a complete source of truth.
- Chem write routes need careful auth review.
- Database backups matter separately from source code.
- Room/cabinet/location schema assumptions affect inventory operations.

### Ask The Maintainer

- Why is chem PostgreSQL and not SQLite?
- Where does PostgreSQL run in production?
- Which env vars point Flask to it?
- Which files define or migrate schema?
- What is schema drift?
- What should be backed up?
- Which chem routes write data?
- Which known issues matter most for chem?

### Do Not Move On Until

The maintainer can explain the chem inventory's data model and why schema drift is a priority.

## Module 11 - Request Lifecycle And Endpoint Reference

### Show

- 13-Request-Lifecycle-Walkthrough.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx)
- 15-Endpoint-Reference.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx)
- presentation/UNanofabTools/flaskserver/13-Request-Lifecycle-Walkthrough.md (reference path: ../presentation/UNanofabTools/flaskserver/13-Request-Lifecycle-Walkthrough.md)
- presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md (reference path: ../presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md)
- documentation/UNanofabTools/flaskserver/05-http-api-reference.md (reference path: ../documentation/UNanofabTools/flaskserver/05-http-api-reference.md)

### Presenter Intent

Tie together everything they have learned so far. This is where the maintainer moves from "I know the pieces" to "I can trace behavior."

### Talk Track

"Every request has a life: client, DNS/TLS/nginx, Flask routing, decorators, handler, service/database/filesystem, response. Human browser requests and device POSTs differ in auth and payload, but they still move through the same basic pipeline."

### Source Demo

Run:

```sh
rg -n "^[[:space:]]*@[a-zA-Z_]+\\.route\\(|^[[:space:]]*@app\\.route\\(" ../UNanofabTools/app
```

Then compare to:

- documentation/UNanofabTools/flaskserver/05-http-api-reference.md (reference path: ../documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md (reference path: ../presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md)

### Practice Exercise

Pick three routes:

- One login-protected browser route.
- One admin route.
- One unauthenticated device route.

For each, have the maintainer identify:

- URL.
- method.
- blueprint.
- auth requirement.
- handler function.
- service function if any.
- data store touched.
- response.
- known risks.

### Ask The Maintainer

- How does a browser request differ from a device POST?
- Where does nginx stop and Flask begin?
- What do decorators do?
- Which endpoint families are highest risk?
- How would you detect route docs falling out of sync with code?

### Do Not Move On Until

The maintainer can audit one endpoint from docs to source to data side effects.

## Module 12 - Security Model

### Show

- 14-Security-Model.pptx (reference path: ../presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx)
- presentation/UNanofabTools/flaskserver/14-Security-Model.md (reference path: ../presentation/UNanofabTools/flaskserver/14-Security-Model.md)
- documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md (reference path: ../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md)
- known-issues/UNanofabTools/README.md (reference path: ../known-issues/UNanofabTools/README.md)

### Presenter Intent

Be direct and honest. The future maintainer needs to know what is protected, what is intentionally open, what is historically weak, and what to harden first.

### Talk Track

"Security here is layered, but not perfect. TLS is in place. Login and Duo exist. Admin checks exist. File safety checks exist. But device endpoints and chem write paths need careful attention, and some historical tools had hard-coded secrets."

"Do not hide uncomfortable facts. If a secret was ever hard-coded, assume rotation is needed. If a route writes without auth, treat that as a high-priority review."

### Discuss

- TLS and cert renewal.
- Password hashing.
- Duo.
- Sessions.
- Admin authorization.
- Input validation.
- File path safety.
- Device endpoint trust model.
- Secrets in source.
- Shared `phelan` account.
- IT-owned root path.
- Backup boundary.

### Ask The Maintainer

- Which secrets must never be committed?
- Which routes are deliberately unauthenticated?
- Which writes should be reviewed first?
- Why is shared `phelan` not solved by simply creating UNIX users?
- What is an IT security ticket vs a Nanofab code fix?
- What should be rotated if exposed?

### Do Not Move On Until

The maintainer can name the top security follow-ups without looking.

## Module 13 - HSCDownloader And CORES Data

### Show

- HSC-Downloader.pptx (reference path: ../presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx)
- presentation/UNanofabTools/hscdownloader/README.md (reference path: ../presentation/UNanofabTools/hscdownloader/README.md)
- documentation/UNanofabTools/hscdownloader/README.md (reference path: ../documentation/UNanofabTools/hscdownloader/README.md)
- known-issues/UNanofabTools/hscdownloader.md (reference path: ../known-issues/UNanofabTools/hscdownloader.md)

### Presenter Intent

Teach the data supply line that makes machine pages current.

### Talk Track

"HSCDownloader is the bridge from CORES/n8n data to the CSV files the website reads. If a machine page goes stale, this is one of the first places to inspect."

"The production downloader is not in a separate directory. `HSCDownloader.py` lives next to `run.py` in `/home/phelan/server/UNanofabTools/`."

### Source Demo

Show:

```text
../UNanofabTools/HSCDownloader.py
../UNanofabTools/HSCDATA/
```

Run:

```sh
rg -n "save|CORES|HSCDATA|requests|Bearer|time|schedule|while" ../UNanofabTools/HSCDownloader.py documentation/UNanofabTools/hscdownloader/README.md known-issues/UNanofabTools/hscdownloader.md
```

Do not reveal bearer token values.

### Ask The Maintainer

- What does HSCDownloader write?
- What reads those files?
- Where is it running in production?
- What tmux session owns it?
- What known secret issue exists?
- What would you check if machine data stopped updating?

### Do Not Move On Until

The maintainer can explain CORES to HSCDownloader to `HSCDATA` to machine pages.

## Module 14 - File Transfers From Machine PCs

### Show

- File-Transfer-Scripts.pptx (reference path: ../presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx)
- presentation/UNanofabTools/filetransfer/README.md (reference path: ../presentation/UNanofabTools/filetransfer/README.md)
- documentation/UNanofabTools/filetransfer/README.md (reference path: ../documentation/UNanofabTools/filetransfer/README.md)
- known-issues/UNanofabTools/filetransfer.md (reference path: ../known-issues/UNanofabTools/filetransfer.md)

### Presenter Intent

Show how machine-control PCs push local logs to the server, and make the personal-account dependency clear.

### Talk Track

"The server does not magically know everything a tool PC logs. Some files have to be copied from machine-control computers. These scripts are the couriers."

"The main operational issue is identity. Transfers depending on a personal account are fragile. A better Nanofab-side fix is a purpose-bound key into `phelan`; a cleaner service-account model requires IT."

### Source Demo

Run:

```sh
rg -n "scp|ssh|phelan|CADE|LogData|mutex|powershell|bat" ../UNanofabTools documentation/UNanofabTools/filetransfer known-issues/UNanofabTools/filetransfer.md
```

### Ask The Maintainer

- What does each file-transfer script move?
- Where does it put data?
- Why is a personal account dependency risky?
- What can Nanofab fix without IT?
- What would require IT?
- How would you test a transfer without overwriting production data?

### Do Not Move On Until

The maintainer can distinguish HSCDownloader data from tool-PC file-transfer data.

## Module 15 - Pico Firmware And Particle Sensor Ecosystem

### Show

- PicoHelperTools.pptx (reference path: ../presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx)
- ParticleSensor.pptx (reference path: ../presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx)
- Pico-Firmware.pptx (reference path: ../presentation/UNanofabTools/picofirmware/slides/Pico-Firmware.pptx)
- Particle-PC-Tools.pptx (reference path: ../presentation/UNanofabTools/particlepctools/slides/Particle-PC-Tools.pptx)
- documentation/NanofabToolkit/PicoHelperTools/README.md (reference path: ../documentation/NanofabToolkit/PicoHelperTools/README.md)
- documentation/NanofabToolkit/ParticleSensor/README.md (reference path: ../documentation/NanofabToolkit/ParticleSensor/README.md)
- known-issues/UNanofabTools/picofirmware.md (reference path: ../known-issues/UNanofabTools/picofirmware.md)
- known-issues/UNanofabTools/particlepctools.md (reference path: ../known-issues/UNanofabTools/particlepctools.md)
- known-issues/NanofabToolkit/ParticleSensor.md (reference path: ../known-issues/NanofabToolkit/ParticleSensor.md)

### Presenter Intent

Make the canonical-copy rule unmissable.

### Talk Track

"For Pico firmware and ParticleSensor, `NanofabToolkit` is canonical. The copies in `UNanofabTools` are older or historical. This matters because a future maintainer could waste time patching the wrong repo."

"The Pico devices produce data. The Flask app receives it. ParticleSensor reads and visualizes it."

### Source Demo

Show:

```text
../NanofabToolkit/PicoHelperTools/
../NanofabToolkit/ParticleSensor/
../UNanofabTools/picofirmware/
../UNanofabTools/particlepctools/
```

Run:

```sh
rg -n "room|sensor|particle-data|sensor-data|wifi|password|requests|urequests" ../NanofabToolkit/PicoHelperTools ../NanofabToolkit/ParticleSensor ../UNanofabTools
```

Do not show real WiFi passwords.

### Ask The Maintainer

- Which repo is canonical for Pico firmware?
- Which repo is canonical for ParticleSensor?
- What data does a Pico send?
- Which Flask endpoints receive it?
- What historical secret issue exists in firmware?
- What is the risk of a test generator targeting production?

### Do Not Move On Until

The maintainer can say which repo to modify and which repo to treat as historical.

## Module 16 - Other Desktop And Data Tools

### Show

- ParalyneReader.pptx (reference path: ../presentation/NanofabToolkit/ParalyneReader/slides/ParalyneReader.pptx)
- DAT-Tools.pptx (reference path: ../presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx)
- DentonDecoder.pptx (reference path: ../presentation/NanofabToolkit/DentonDecoder/slides/DentonDecoder.pptx)
- ALDPeakCounter.pptx (reference path: ../presentation/NanofabToolkit/ALDPeakCounter/slides/ALDPeakCounter.pptx)
- PreciousMetalReader.pptx (reference path: ../presentation/NanofabToolkit/PreciousMetalReader/slides/PreciousMetalReader.pptx)
- Utilities.pptx (reference path: ../presentation/UNanofabTools/utilities/slides/Utilities.pptx)
- the matching developer READMEs under `documentation/`.

### Presenter Intent

Give enough depth that the maintainer knows what each tool does, where it lives, what data it expects, and whether it affects the live website.

### Talk Track

"These tools are smaller, but they matter because they encode lab-specific workflows. The maintainer does not need to rewrite them today, but they must know which are live dependencies, which are user conveniences, and which have maintenance risks."

### Tool-By-Tool Emphasis

ParalyneReader:

- Desktop review of Parylene analog data.
- Talks to server-side data endpoints.
- Uses background downloads to keep UI responsive.
- Smoothing, normalization, and alignment are user-facing behavior.

DAT Tools:

- `DATfixer` and `DATgrapher` are Denton 635 helpers.
- They are not the same as DentonDecoder.
- Binary `.DAT` parsing by magic bytes is a maintenance risk.

DentonDecoder:

- Charts Denton `.dat` or CSV logs against time.
- It is a broader charting tool, not the same workflow as DATfixer/DATgrapher.

ALDPeakCounter:

- Counts ALD cycles.
- Supports time alignment across runs.
- Peak detection parameters matter.

PreciousMetalReader:

- Pulls monthly precious-metal usage from CORES.
- Similar external-token concerns apply conceptually to HSCDownloader.

Utilities:

- Helper scripts are uneven.
- `init_chem_db.py` is not a complete chem database solution.
- Some utilities are developer helpers, not production tools.

### Ask The Maintainer

- Which tools talk to `nfhistory`?
- Which tools are standalone?
- Which tools consume CORES?
- Which tools consume local log files?
- Which tools are user-facing conveniences vs live infrastructure?
- Which utility would you not trust as a complete production setup?

### Do Not Move On Until

The maintainer can group every tool by purpose, source repo, input, output, and operational importance.

## Module 17 - Legacy Server

### Show

- HSC-Displayer-Server-Legacy.pptx (reference path: ../presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx)
- presentation/UNanofabTools/hscdisplayerserver/README.md (reference path: ../presentation/UNanofabTools/hscdisplayerserver/README.md)
- documentation/UNanofabTools/hscdisplayerserver/README.md (reference path: ../documentation/UNanofabTools/hscdisplayerserver/README.md)
- documentation/UNanofabTools/hscdisplayerserver/ROUTES.md (reference path: ../documentation/UNanofabTools/hscdisplayerserver/ROUTES.md)
- known-issues/UNanofabTools/hscdisplayerserver.md (reference path: ../known-issues/UNanofabTools/hscdisplayerserver.md)

### Presenter Intent

Prevent future maintainers from mistaking the deprecated server for the active architecture.

### Talk Track

"This is documented so you recognize it, not because it should be improved. It is the older monolithic predecessor. The directive is to retire it in favor of the Flask app unless live evidence proves it is still serving something important."

### Ask The Maintainer

- Why is this documented?
- Why should it not be the first maintenance target?
- How would you confirm whether it is active?
- What should happen if it is still running?

### Do Not Move On Until

The maintainer can identify the legacy server and avoid patching it by accident.

## Module 18 - Known Issues And Maintenance Triage

### Show

- known-issues/UNanofabTools/README.md (reference path: ../known-issues/UNanofabTools/README.md)
- known-issues/UNanofabTools/liveserver.md (reference path: ../known-issues/UNanofabTools/liveserver.md)
- known-issues/UNanofabTools/serveraccess.md (reference path: ../known-issues/UNanofabTools/serveraccess.md)
- known-issues/UNanofabTools/flaskserver.md (reference path: ../known-issues/UNanofabTools/flaskserver.md)
- known-issues/NanofabToolkit/README.md (reference path: ../known-issues/NanofabToolkit/README.md)

Then open every remaining known-issues file briefly.

### Presenter Intent

Turn knowledge into action. The maintainer should leave with a priority model, not just a list of problems.

### Talk Track

"The known-issues tree is not an apology. It is the maintenance queue. It separates bugs, tech debt, security exposure, reliability gaps, and IT-bound work."

"The important split is not just high/medium/low. It is Nanofab-actionable vs IT-ticket."

### Triage Framework

Fix first:

1. Exposed secrets and required rotations.
2. Unauthenticated or weakly protected write routes.
3. Data-loss or backup uncertainty.
4. Production reliability issues like tmux-only supervision.
5. Chem schema drift and incomplete migrations.
6. Personal-account dependencies.
7. Doc/code drift that could cause bad operations.
8. Deprecated-code cleanup.
9. Cosmetic cleanup.

### Ask The Maintainer

- What are the top three Nanofab-owned fixes?
- What are the top three IT tickets?
- Which known issue would you handle first and why?
- Which issue looks scary but is actually IT-owned?
- Which issue is low priority because the code is deprecated?
- What evidence is needed before closing a known issue?

### Do Not Move On Until

The maintainer can produce a 7-day and 30-day maintenance plan.

## Module 19 - Path D Audit Practice

### Show

- START-HERE.md (reference path: ../START-HERE.md#path-d-long-term-maintainer-deep-dive)
- EVALUATE.md (reference path: EVALUATE.md)
- audit.sh (reference path: audit.sh)

### Presenter Intent

This section converts the presentation from listening into ownership.

### Exercise 1 - Run The Audit

Run:

```sh
bash support/audit.sh
```

Have the maintainer read:

- context
- coverage matrix
- stale-string checks
- broken-link check
- source vs docs spot-checks

Explain which warnings are expected context and which would be real problems.

### Exercise 2 - Verify One Route

Pick one route from documentation/UNanofabTools/flaskserver/05-http-api-reference.md (reference path: ../documentation/UNanofabTools/flaskserver/05-http-api-reference.md).

Have the maintainer find it in source:

```sh
rg -n "<route-name-or-path>" ../UNanofabTools/app
```

They must identify:

- code file
- route decorator
- methods
- auth
- handler function
- data touched
- doc match or drift

### Exercise 3 - Verify One Known Issue

Pick one known issue. Have the maintainer prove whether it still exists by checking:

- source code
- docs
- live server if applicable
- issue file

Then ask whether to keep, edit, close, or escalate the issue.

### Exercise 4 - Draft A Maintenance Plan

Have the maintainer write:

```md
## Next 7 Days

## Next 30 Days

## Next Quarter

## IT Tickets

## Evidence Still Missing
```

### Do Not Move On Until

The maintainer has performed at least one real doc/source verification without your step-by-step help.

## Module 20 - Operational Scenarios

### Presenter Intent

Make the maintainer practice incident thinking before they have a real incident.

### Scenario A - Website Is Down

Ask them to talk through:

- Is nginx running?
- Is TLS working?
- Is Flask listening on loopback?
- Is `flaskserver` tmux alive?
- Is disk full?
- Are there tracebacks?
- Did config or venv change?
- How do you restart safely?

### Scenario B - Machine Data Is Stale

Ask:

- Is `downloader` tmux alive?
- Is `HSCDownloader.py` running?
- Are files fresh in `HSCDATA/`?
- Did CORES/n8n/token behavior change?
- Is this downloader, external API, or website display?

### Scenario C - Chem Inventory Fails

Ask:

- Is PostgreSQL running locally?
- Is it listening on `127.0.0.1:5432`?
- Are `CHEM_*` vars present?
- Did schema drift break the route?
- Is this a read path or write path?
- What backups exist?

### Scenario D - A New Maintainer Needs Access

Ask:

- Do they have CADE?
- Where is their public key added?
- How is it labeled?
- How is access revoked?
- What requires IT?

### Scenario E - The VM Is Lost

Ask:

- Who opens the IT ticket?
- What does IT restore?
- How do you verify `/home/phelan/`?
- How do you verify PostgreSQL?
- How do you restart app and downloader?
- What data might be missing?

### Do Not Move On Until

The maintainer can handle each scenario without asking "what would Faith do?"

## Module 21 - Final No-Contact Check

Use this as the closing section. Do not treat it as optional.

### Ask These Questions

Ownership:

- Who owns the VM?
- Who owns root?
- Who owns `/home/phelan/`?
- Who owns app code?
- Who owns off-box backups?
- Who can create UNIX users?

Runtime:

- What serves the public site?
- What does nginx proxy to?
- What process writes `HSCDATA`?
- What are the two required tmux sessions?
- What is the production install path?
- What should replace tmux long term?

Data:

- Which data is SQLite?
- Which data is PostgreSQL?
- Which data is CSV/log files?
- Which data comes from devices?
- Which data comes from CORES?
- Which data must be backed up?

Code:

- Where is the app factory?
- Where are blueprints?
- Where is auth?
- Where is chem DB access?
- Where is HSCDownloader?
- Which repo is canonical for Pico firmware?
- Which repo is canonical for ParticleSensor?
- Which code is deprecated?

Security:

- Where should secrets live?
- Which secrets were historically hard-coded?
- Which routes are unauthenticated?
- Which writes are highest-risk?
- What is Nanofab-owned vs IT-owned?

Maintenance:

- What are the first three fixes?
- What are the first three IT tickets?
- How do you run the documentation audit?
- How do you close a known issue?
- How do you update the live-server snapshot?

### Final Statement To Make

"If you can answer these from the docs, source, and live state, then you do not need me. If you cannot, we write down the missing fact before this handoff ends."

## What To Leave With The Maintainer

Leave them with:

- The current handoff branch of this documentation repo.
- The START-HERE.md (reference path: ../START-HERE.md) entry point, with Path D (reference path: ../START-HERE.md#path-d-long-term-maintainer-deep-dive) marked for audit work.
- The PRESENTATION-GUIDE.md (reference path: PRESENTATION-GUIDE.md) script if they need to replay or repeat the handoff.
- Current source repo locations and commits.
- Current live-server survey snapshot.
- Their access status and revocation procedure.
- A current known-issues tree.
- A 7-day, 30-day, and quarterly maintenance plan.
- A list of open IT tickets or IT questions.

## If You Run Out Of Time

Do not skip these:

1. Live server boundary and tmux safety.
2. Source repo locations and canonical-copy rule.
3. Flask startup/config/auth basics.
4. Chem inventory and local PostgreSQL.
5. HSCDownloader and `HSCDATA`.
6. Device endpoints and sensor data.
7. Known issues and top priorities.
8. No-contact exit check.

If there is truly not enough time, assign the remaining decks as homework and schedule a follow-up where the maintainer explains them back.

## Presenter Checklist

Before the handoff:

- Confirm branch and commit.
- Confirm source repos are available.
- Confirm live access or document why it is unavailable.
- Confirm slides open.
- Confirm no secret files are projected.
- Run `bash support/audit.sh`.

During the handoff:

- Show slides.
- Open matching docs.
- Open source only when it proves the point.
- Ask the maintainer to explain back.
- Record every missing fact.
- Separate Nanofab tasks from IT tickets.

After the handoff:

- Update docs for any missing context.
- Update known issues for new findings.
- Commit and push documentation changes.
- Send the maintainer the final branch and commit.
- Confirm they can access the repo without you.

## Closing Principle

The goal is not for the future maintainer to remember every line. The goal is for them to know where truth lives, how to verify it, what is safe to change, what is not theirs to change, and how to turn uncertainty into documented evidence.


# Read-Aloud Documentation Corpus: support/EVALUATE.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# LLM Evaluation Prompt — UNanofabTools / NanofabToolkit Handoff Materials

You are evaluating a body of documentation, presentations, and known-issues files produced for a handoff of two related repositories. Your job is to **assess the deliverables for completeness, internal consistency, factual correctness, and quality of cross-referencing**. You will produce a structured evaluation report.

You have **no prior context** beyond this repository. Read this prompt fully, then run the suggested checks from the repository root, then read whatever files you need to substantiate your findings.

This GitHub repository is the documentation bundle. It intentionally excludes the application source repos. Source-code checks require sibling checkouts named `../UNanofabTools/` and `../NanofabToolkit/`, or equivalent recovered source trees.

---

## 1. What's being evaluated

The repository root contains the documentation bundle:

| Path | What it is |
|------|-----------|
| `START-HERE.md` | The umbrella orchestrator. Lists every deliverable, includes Paths A-E, and contains the full Path D no-human-context audit playbook. **Read this first.** |
| `support/PRESENTATION-GUIDE.md` | Path E speaker script for presenting the exhaustive maintainer walkthrough with the slide decks. |
| `support/path-e-script/` | Expanded Path E read-aloud script pack, with one script per module plus operator protocol. |
| `support/path-e-script-minimum/`, `support/path-e-script-medium/`, `support/path-e-script-verbose/` | Generated Path E script tiers targeting 50k-100k, 100k-250k, and 250k+ words. |
| `presentation/UNanofabTools/<tool>/` | Plain-English "layman" READMEs + slide decks (`.pptx`) for each tool in the UNanofabTools repo |
| `documentation/UNanofabTools/<tool>/` | Formal developer reference for each UNanofabTools tool |
| `known-issues/UNanofabTools/<tool>.md` | Bugs / tech debt / recommended fixes for each UNanofabTools tool |
| `presentation/NanofabToolkit/<tool>/` | Same layman + slides structure for the sibling NanofabToolkit repo |
| `documentation/NanofabToolkit/<tool>/` | Developer reference for NanofabToolkit |
| `support/audit.sh` | Mechanical-check script. Run it first; it produces a starter report. |

For source-code comparison, use sibling source repos:

| Path | What it is |
|------|-----------|
| `../UNanofabTools/` | The actual source code of the Flask web app |
| `../NanofabToolkit/` | The actual source code of the desktop tools and Pico firmware |

The handoff is **for a successor** to a Flask-based cleanroom server system at the University of Utah Nanofab. The server is named `nfhistory`. There are also several desktop tools, Raspberry Pi firmware, and data pipelines tied to it.

---

## 2. Key facts the documentation is supposed to reflect

These were established late in the documentation process. Earlier revisions of some files got them wrong; later revisions should be consistent. **A correct deliverable set will reflect all of these everywhere they're relevant; an incorrect one will have stale references.**

| Fact | Why it matters |
|------|---------------|
| **The Flask app is installed at `/home/phelan/server/UNanofabTools/`** | Earlier docs said `~/UNanofabTools/`. Anything still saying that without the `/server/` prefix is stale. |
| **`HSCDownloader.py` lives in that same install directory** (no separate `~/HSCDownloader/`) | Earlier docs implied a separate folder. References to `~/HSCDownloader/` or `cd ~/HSCDownloader` are stale. |
| **The chem PostgreSQL database is local on the same VM** (bound to `127.0.0.1:5432`, runs as `postgresql@17-main`) | Earlier docs called it "external." References to "external PostgreSQL" or "separate PostgreSQL database" (in a way that implies different machine) are stale. |
| **Backups are run off-box by University IT, not by the Nanofab team** | Any finding still saying "no backups exist" without the IT-handled context is stale. |
| **The Nanofab admin has `sudo` as `phelan` but does not have `root`, and cannot `useradd`** | Any recommendation to "create per-person UNIX accounts" without flagging it as an IT ticket is stale. |
| **Root SSH on `nfhistory` is IT's access path** (key from `root@iceolate.eng.utah.edu`, IP `155.98.110.9`) | Any finding still treating root SSH as a Nanofab to-do or suggesting `chmod 600 /root/.ssh/authorized_keys` as a Nanofab fix (rather than an IT ticket) is stale. |
| **`nfhistory` is at `155.98.11.8`, Debian 13 (trixie), kernel 6.12** | Live state captured by two snapshots under `documentation/UNanofabTools/liveserver/snapshots/`. |
| **TLS cert is Let's Encrypt, auto-renewed by `certbot.timer`** | Cert lifetime is 90 days; renewal cron is `/etc/cron.d/certbot`. |
| **The Flask app and HSCDownloader run inside tmux sessions named `flaskserver` and `downloader`**, NOT under systemd | The most consequential reliability finding — they should be supervised, currently aren't. |

---

## 3. Coverage you should verify

Every tool in each repo is expected to have **four deliverables**:

1. A layman README at `presentation/<repo>/<tool>/README.md`
2. A slide deck at `presentation/<repo>/<tool>/slides/<Name>.pptx`
3. A developer README (or numbered docs) at `documentation/<repo>/<tool>/`
4. A known-issues file at `known-issues/<repo>/<tool>.md` *(UNanofabTools only — NanofabToolkit is client-side and may not need known-issues)*

Tools you should expect to find for UNanofabTools:

- `flaskserver` (the main web app — has 10 numbered docs + 16 decks)
- `serveraccess` (how to log in)
- `liveserver` (what's running on `nfhistory`)
- `hscdownloader`
- `filetransfer`
- `dattools`
- `utilities`
- `picofirmware` (older copies — canonical lives in NanofabToolkit)
- `particlepctools` (older copy — canonical lives in NanofabToolkit)
- `hscdisplayerserver` (deprecated; kept for historical reference)

Tools you should expect to find for NanofabToolkit:

- `PicoHelperTools` (canonical firmware — UNanofabTools/picofirmware is the older copy)
- `ParticleSensor` (canonical desktop viewer — UNanofabTools/particlepctools is the older copy)
- `ParalyneReader`
- `ALDPeakCounter`
- `DentonDecoder`
- `PreciousMetalReader`

Master indexes you should find:

- `presentation/UNanofabTools/README.md`
- `documentation/UNanofabTools/README.md`
- `known-issues/UNanofabTools/README.md`
- `presentation/NanofabToolkit/README.md`
- `documentation/NanofabToolkit/README.md`

---

## 4. Tasks for you

Run these tasks in order.

### Task 1 — Run the mechanical audit

```sh
bash support/audit.sh
```

This prints a starter report covering: missing deliverables, broken internal links, stale string references. **Read its output before doing anything else** — many of your findings will start from rows it surfaced.

### Task 2 — Coverage verification

For each tool in §3 above, confirm the four deliverables exist. **Note any missing ones** in your report.

### Task 3 — Fact propagation check

For each "key fact" in §2, search the docs to confirm the fact is reflected everywhere it should be. Examples:

```sh
# Stale install paths
grep -rn '~/UNanofabTools/' documentation/ presentation/ known-issues/ START-HERE.md
grep -rn '~/HSCDownloader' documentation/ presentation/ known-issues/ START-HERE.md

# Stale chem-external references
grep -rn 'external PostgreSQL\|external chem\|external server' documentation/UNanofabTools/flaskserver/

# Stale "no backups" without IT-handled context
grep -rln 'no backup\|No backups\|nothing backs up' documentation/ presentation/ known-issues/

# Stale "create UNIX users" without IT-ticket context
grep -rn 'create UNIX\|create per-person\|useradd' documentation/ presentation/ known-issues/

# Stale root-SSH-as-finding
grep -rn 'PermitRootLogin\|iceolate' documentation/ presentation/ known-issues/
```

For each hit, **read the surrounding context** and judge whether the reference is correctly framed (IT-handled, IT-owned, IT-ticket) or stale (still presenting it as a Nanofab to-do).

### Task 4 — Cross-document consistency

For each pair below, read both and confirm they agree on the facts:

| Pair | What to check |
|------|--------------|
| `presentation/UNanofabTools/flaskserver/README.md` ↔ `documentation/UNanofabTools/flaskserver/01-architecture.md` | Same architecture story (number of databases, where each lives) |
| `documentation/UNanofabTools/serveraccess/README.md` ↔ `documentation/UNanofabTools/liveserver/README.md` | Operational boundary, recovery commands, paths |
| `documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_2026-06-01.txt` ↔ `documentation/UNanofabTools/liveserver/README.md` | Every value claimed in the doc should be in the snapshot |
| `known-issues/UNanofabTools/liveserver.md` ↔ `documentation/UNanofabTools/liveserver/README.md` | The findings list at the top of the doc (§0) should match the entries in the known-issues file |
| `presentation/UNanofabTools/<tool>/README.md` ↔ `documentation/UNanofabTools/<tool>/README.md` (any tool) | Layman should be the same story, written for non-coders. No factual contradictions. |
| `START-HERE.md` ↔ everything else | Every file path it references should exist; every claim about what's in a deck/doc should be true. |

### Task 5 — Source code vs. documentation

The source code is expected in sibling directories `../UNanofabTools/` and `../NanofabToolkit/`. If those repos are missing, report that source-code verification could not be completed and treat it as a handoff risk. Spot-check:

- Does the env-var schema in `documentation/UNanofabTools/flaskserver/03-configuration-reference.md` match `../UNanofabTools/config/config.py`?
- Do the HTTP routes in `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` match the actual `@app.route(...)` decorators in `../UNanofabTools/app/blueprints/`?
- Do the chem env-var names (`CHEM_PGHOST` etc.) match in the docs and `../UNanofabTools/config/config.py`?
- Are any "canonical lives in NanofabToolkit" claims accurate? Check that `../NanofabToolkit/PicoHelperTools/` and `../NanofabToolkit/ParticleSensor/` exist and have substantive content (not stub README pointers).

### Task 6 — Find contradictions

Read enough to surface internal contradictions. Examples of the kind of thing to look for:

- One doc claims a service is supervised by systemd, another says it runs only in tmux.
- One doc says X is auto-rotated, another says X is unbounded.
- One file lists 7 SSH keys, another says 1.
- The slide notes contradict the slide body.
- Recovery commands in different files use different paths.

### Task 7 — START-HERE.md integrity

`START-HERE.md` is the entry point. Verify:

- Every file path it links to **exists** at that path.
- Every path A → presented order (Sessions 1–5) names decks/docs that actually exist with those filenames.
- Path B (45-min talk), Path C (solo successor reading order), Path D (deep-dive maintainer playbook), and Path E (presentation guide) reference real files.
- The "Quick reference" section at the bottom is accurate.

### Task 8 — Stylistic / quality assessment

Briefly judge:

- Are the layman READMEs actually layman-friendly? (Jargon flagged when introduced, no Python code in body text, etc.)
- Are the developer docs concrete enough to act on? (Real file paths, real env-var names, real command examples?)
- Are the known-issues files honest? (Severity tagged, fixes proposed, IT-vs-Nanofab boundary called out?)
- Is the slide deck text appropriate length for slides? (Bullets, not paragraphs?)

---

## 5. Output format

Produce a single markdown report with these sections, in this order:

````
# Evaluation Report — UNanofabTools / NanofabToolkit Handoff

## Executive summary
[3–5 sentences. Overall verdict: thorough / acceptable / weak / failed. The single most important finding.]

## Coverage matrix
| Repo | Tool | Layman | Slides | Dev docs | Known-issues |
|------|------|--------|--------|----------|--------------|
| ... | ... | ✓ / missing / partial | ... | ... | ... |

## Fact propagation
For each "key fact" from §2 of the prompt:
- **Install path (`~/server/UNanofabTools/`)** — [VERIFIED / PARTIAL / STALE references remain at file:line, file:line]
- **Chem PostgreSQL is local** — [...]
- **Backups are IT-handled** — [...]
- **Nanofab has sudo not root, can't useradd** — [...]
- **Root SSH = IT's path** — [...]
- (others)

## Contradictions found
Numbered list. Each item:
- **What contradicts what** (file A:line says X; file B:line says Y)
- **Severity**: High / Medium / Low
- **Suggested fix**

## Broken or missing references
- Broken links inside START-HERE.md or any other master index
- Files claimed to exist but don't
- Decks that don't match their advertised slide count

## Source code vs documentation
Brief judgment per spot-check from §4 Task 5. Concrete file:line cites for any drift.

## Stylistic quality
2–4 paragraphs covering: appropriateness of layman vs developer voice; concreteness of dev docs; honesty of known-issues; deck content density.

## Numbered findings (severity-tagged)
Final consolidated punch list. Each entry:
- **#N. [Finding title]** — Severity
  - Where: `<file>:<line>` (or section reference)
  - Evidence: short quote or paraphrase
  - Suggested fix: 1–2 sentences

## Overall recommendation
What the author should do next, if anything, to improve the deliverable set.
````

---

## 6. Calibration: what "good" looks like

To help calibrate severity, here are illustrative examples for each level:

- **High** — A documented fact actively contradicts another documented fact (e.g., one doc says chem Postgres is external, another says local, and the reader can't tell which is right). Or: a recovery command references a path that doesn't exist on the live server. Or: a security claim that's materially wrong.
- **Medium** — A stale reference that's not actively misleading because the corrected version appears elsewhere, but if a reader landed on the stale one first they'd be confused.
- **Low** — Cosmetic inconsistency (e.g. one file calls it "the chem database," another "the chemical inventory database"). Worth noting but not blocking.

Aim for surgical findings, not bulk complaints. Quote the exact contradictory text.

---

## 7. Reproducibility note

When the original author reads your report, they'll want to verify each finding themselves. Always cite **file paths and line numbers** rather than "somewhere in the docs." When you quote, quote exactly. When you summarize, say so.

If something is genuinely good, say so — this is an evaluation, not a takedown. The goal is an honest read-out of where the work succeeded and where it didn't.

---

## 8. Stop here

Once you have your report, output it. Do not edit any files in this repository — your job is to evaluate, not to fix. If you find issues important enough to fix, your report's "Suggested fix" entries are the deliverable.


# Read-Aloud Documentation Corpus: support/REDACTION-NOTE.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Redaction Note

This GitHub documentation copy redacts literal credential values that were present in the local documentation:

- CORES bearer token value.
- Lab WiFi password value.

The surrounding known-issues text is preserved so maintainers still know those secrets exist in source and should be moved to protected storage and rotated.


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# UNanofabTools Server — A Plain-English Guide

This folder contains a thorough, layperson-friendly explanation of the UNanofabTools **server** code. It is intended to be the source material for a presentation, but it also stands on its own as documentation.

## What's in here

The server has been broken into focused topics so you can read in order, or jump to a specific area. Files are numbered to suggest a reading order, but you don't have to read them in sequence.

| # | File | What it covers |
|---|------|-----------------|
| 01 | `01-Server-Overview.md` | The big picture: what a "server" is, what *this* server does, and who uses it |
| 02 | `02-How-It-Starts.md` | What happens when the server boots: `run.py`, the application factory, blueprints |
| 03 | `03-Configuration.md` | Where the server reads its settings from: `config/config.py`, `.env`, database URLs |
| 04 | `04-Authentication-and-Login.md` | Logging in, signing up, password reset, and the two-factor (Duo) flow |
| 05 | `05-Admin-Panel.md` | Tools for admins: managing users, granting permissions |
| 06 | `06-Tasks.md` | The internal task list (assignments, due dates, file attachments) |
| 07 | `07-Machines-and-Logs.md` | Pages for every machine, plus log-file browsers and downloads |
| 08 | `08-IoT-API-Endpoints.md` | How the Raspberry Pi sensors and shop-floor tools push data to the server |
| 09 | `09-Chemical-Inventory.md` | The chemical inventory system: barcodes, containers, scans, reports |
| 10 | `10-Database-Models.md` | The "tables": Users, Sessions, Tasks, Particle Sensors |
| 11 | `11-Particle-Demo.md` | A small static-file route used for a particle counter demo page |
| 12 | `12-Consumers-NanofabToolkit.md` | How the NanofabToolkit desktop apps and Pico firmware talk to the server |
| 13 | `13-Request-Lifecycle-Walkthrough.md` | What happens, step by step, when a user clicks something or a sensor POSTs data |
| 14 | `14-Security-Model.md` | The security story in one place: sessions, login_required, CORS, Duo, hashing |
| 15 | `15-Endpoint-Reference.md` | A flat list of every URL the server handles, with a one-line description |

## Scope

These documents describe the **modern Flask server** that lives under `app/` plus its supporting files (`run.py`, `config/`, the `.sql` schema).

## How to read the code snippets

Each document quotes pieces of the actual server code. When something is non-obvious, the explanation goes line-by-line; otherwise the explanation describes the function as a whole. Code is shown exactly as it appears in the repository so you can find it back in the source tree.

## A note on terminology

The first document, `01-Server-Overview.md`, defines the key vocabulary: *server*, *client*, *request*, *response*, *endpoint*, *route*, *blueprint*, *database*, *model*, *service*, *template*. If a term in a later document feels unfamiliar, the overview is the place to look first.


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/01-Server-Overview.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 01 — Server Overview

Before we look at any code, let's make sure we're using the same vocabulary, then look at the system from 30,000 feet.

## What is a server, in one sentence?

A **server** is a program that sits running on a computer somewhere, waiting for other programs (called **clients**) to ask it for things over the network. Each "ask" is called a **request**, and the server answers with a **response**.

Almost everything you do on the internet works this way:

- You open `https://nfhistory.nanofab.utah.edu` in a browser → the browser is the client, your laptop sends a request, the server sends back an HTML page as the response, and the browser draws it.
- A Raspberry Pi out in the cleanroom takes a particle-sensor reading and POSTs it as JSON → the Pi is the client, our server is on the receiving end, and it stores the reading in a database.
- The PrecioiusMetalReader desktop app fetches the latest reagent prices → the desktop app is the client, an internal web service is the server.

The server is always-on; the clients come and go.

## What does *this* server do?

UNanofabTools is the Utah Nanofab cleanroom's internal web application. The server has several jobs all bundled into one program:

1. **Account management** — usernames, passwords, two-factor login via Duo, admin permissions.
2. **A task tracker** — staff can assign each other to-do items, attach files, mark things done.
3. **A machine portal** — one web page per tool in the cleanroom (ALD, MOCVD, PECVD, parylene, Denton evaporators, furnaces, dry etchers, etc.) that shows historical data tables, graphs, and downloadable log files.
4. **An IoT data sink** — Raspberry Pi Picos sitting next to machines POST their readings here. The Pico sensors include SPS30 particle counters and DHT22 temperature/humidity sensors. The Parylene tool's Pi streams CSV batches of analog pressure/temperature data. The Denton 18 evaporator's Pi posts vacuum-pressure readings.
5. **A chemical inventory** — every bottle in the lab has a barcode; the server tracks what is where, what's expired, who owns it, and produces printable labels and reports.
6. **A static demo viewer** — a small one-off route that serves a self-contained particle counter demo page for visitors / outreach.

All of those live behind the same login, in the same Flask app, in the same `app/` directory.

## What it looks like from the outside

Here is the layout you'd see if you sketched it on a whiteboard:

```
   ┌──────────────────────────┐
   │ Lab staff in a browser   │ ──── HTTPS ────┐
   └──────────────────────────┘                │
                                               │
   ┌──────────────────────────┐                │     ┌─────────────────────┐
   │ Raspberry Pi Picos       │ ──── HTTPS ────┼──── │  nginx (port 443)   │
   │  (particle, env, parylene│                │     │  handles SSL        │
   │   pressure, denton18)    │                │     └────────┬────────────┘
   └──────────────────────────┘                │              │ proxy to
                                               │              ▼ 127.0.0.1:5000
   ┌──────────────────────────┐                │     ┌─────────────────────┐
   │ NanofabToolkit desktop   │ ──── HTTPS ────┘     │  Flask app          │
   │ apps (ParalyneReader,    │                      │  (this codebase)    │
   │  ParticleSensor GUI,     │                      └────┬──────┬─────────┘
   │  PreciousMetalReader…)   │                           │      │
   └──────────────────────────┘                           ▼      ▼
                                                    ┌────────┐ ┌────────┐
                                                    │ SQLite │ │Postgres│
                                                    │ DBs    │ │chem DB │
                                                    └────────┘ └────────┘
```

A few things to notice:

- **SSL/HTTPS is handled by nginx, not by Flask.** Flask itself listens only on `127.0.0.1:5000` — i.e. only the same machine can reach it directly. Nginx is the front door on the public network at port 443. This is a common, sensible pattern: nginx is very good at TLS and serving static files; Flask is good at running Python application logic; you let each one do its job.
- **There are several databases** — not one. The user accounts, sessions, tasks, and particle-sensor cache each live in their own SQLite file. The chemical inventory is the odd one out: it uses a PostgreSQL database instead, because it needs more advanced features (sequences for barcode generation, complex JOINs, ON CONFLICT upserts). On the production server, that PostgreSQL instance runs on the **same machine** as the Flask app (bound to `127.0.0.1:5432`), so "different database engine" doesn't mean "different computer."
- **The server has two kinds of "users."** There are *humans* using a browser (with logins, sessions, cookies, Duo 2FA, HTML pages) and there are *machines* (Picos, desktop apps) that hit raw JSON endpoints without logging in. Both arrive at the same Flask process; the routing inside Flask sends them to different handlers.

## Vocabulary cheat sheet

You will see these words throughout the rest of the documents. Knowing them now will save you a lookup later.

| Term | What it means here |
|------|---------------------|
| **HTTP request** | A message a client sends to the server. Has a method (GET, POST, etc.), a URL path, headers, and sometimes a body of data. |
| **HTTP response** | What the server sends back. Has a status code (200 = OK, 404 = not found, 500 = server crashed, etc.), headers, and a body. |
| **GET** | "Give me this resource." Used for page loads and data fetches. No body. |
| **POST** | "Here is some new data — accept it." Used for form submissions and pushing sensor readings. Has a body. |
| **Endpoint** / **route** | A specific URL the server is willing to answer, e.g. `/login` or `/particle-data`. In Flask code this looks like `@some_blueprint.route('/login')`. |
| **Blueprint** | Flask's way of grouping related routes. We have one blueprint per major area (auth, tasks, machines, api, chem, etc.). Think of a blueprint as a "chapter" of the server. |
| **Template** | An HTML file with placeholders the server fills in (`{{ variable }}`). Flask uses the Jinja2 templating engine. |
| **Model** | A Python class that describes one table in the database. The library Flask-SQLAlchemy turns Python class definitions into real tables. |
| **Service** | A plain Python module that contains the actual *logic* (talking to the database, hashing passwords, parsing CSVs). Blueprints handle the URL stuff; services handle the work. This separation keeps each file shorter and easier to test. |
| **Session** | A short-lived record that says "user X is currently logged in from browser Y." A cookie in the browser carries an ID that points back at a session row in the database. |
| **Bcrypt** | A password-hashing algorithm. We never store plaintext passwords; we store the bcrypt hash. Bcrypt is intentionally slow, so guessing passwords is expensive. |
| **Duo / 2FA** | A second login factor. After your password is correct, Duo sends a push notification to your phone; you tap "approve" before you actually get in. |
| **CORS** | Cross-Origin Resource Sharing — a browser security rule. We enable CORS so that browser-based tools from other origins can call our JSON endpoints. |
| **JSON** | A simple text format for structured data. The IoT endpoints accept and return JSON. |
| **CSV** | Comma-separated values. Most machine log files are CSV. Many endpoints accept or return CSV. |

If you're new to all of this, the single most useful mental model is: **a server is a function that takes an HTTP request and returns an HTTP response. Everything else is bookkeeping around that function.**

## The directory layout you're about to see

When you look at the repository, the server code is organized like this. Everything else in the repo (`.ps1` PowerShell scripts, the `.zip` archives, machine-specific Python files) is **outside** this guide's scope.

```
UNanofabTools/
├── run.py                  ← starts the server (covered in 02)
├── requirements.txt        ← lists the Python packages we depend on
│
├── config/
│   └── config.py           ← settings, environment variables (covered in 03)
│
├── app/                    ← the actual Flask application
│   ├── __init__.py         ← application factory (covered in 02)
│   ├── models/             ← database table definitions (covered in 10)
│   ├── services/           ← business logic — talks to databases
│   ├── blueprints/         ← URL handlers grouped by topic
│   │   ├── auth.py
│   │   ├── admin.py
│   │   ├── tasks.py
│   │   ├── machines.py
│   │   ├── api.py
│   │   ├── chem_inventory.py
│   │   └── particle_demo_will.py
│   └── templates/          ← HTML files served to users
│
├── chem_schema.sql         ← the PostgreSQL schema for the chemical inventory
└── instance/               ← runtime data: the SQLite DB files live here
```

Read the next document, `02-How-It-Starts.md`, to see how Python turns these files into a running server.


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/liveserver/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# What's Actually Running on the Server — A Plain-English Guide

This guide is a tour of the **live cleanroom server** (`nfhistory`) — what's on it, what it's doing, how it's kept healthy, and what bits of it would surprise a future maintainer. Written for a non-coder; terms are defined as they appear.

If `serveraccess/` answers *"how do I log in?"*, this answers *"once you're in, what's actually there?"*

Everything below comes from real read-only surveys of the server on **May 29, 2026** (root-side system view) and **June 1, 2026** (`phelan`-side user view). The raw snapshots live in `../../../documentation/UNanofabTools/liveserver/snapshots/` (reference path: ../../../documentation/UNanofabTools/liveserver/snapshots/) for reference.

## The server in 30 seconds

| Thing | What's there |
|------|---------------|
| Operating system | Debian 13 ("Trixie"), a clean modern Linux |
| CPU | One Intel Xeon Gold core |
| Memory | 5.8 GB total; less than 1 GB used; plenty of headroom |
| Disk | 29 GB total, 19 GB free (only ~31% used) |
| Uptime | 290 days — it has been running since August 2025 without a reboot |
| Public web address | `https://nfhistory.nanofab.utah.edu` |
| Internal IP | 155.98.11.8 |

For what it does — a website, a chemical inventory, a sensor data API — that's a very small machine, and it's coping fine.

## What's listening on the network

Servers "listen" on numbered ports for incoming connections. Five things are listening here:

| Port | What runs there | Who can reach it |
|------|------------------|-------------------|
| 22 | SSH (sshd) | the outside world |
| 80 | nginx (plain HTTP) | the outside world |
| 443 | nginx (HTTPS — the secure website) | the outside world |
| 5000 | the Flask web app (Python) | **localhost only** — outside traffic can't touch it |
| 5432 | PostgreSQL (the database for chemical inventory) | **localhost only** |

The pattern is the standard "reverse proxy" setup: nginx is the only thing the outside world talks to. It takes secure HTTPS requests on port 443, terminates the encryption, and forwards them to the Flask app on the internal port 5000. The Flask app, in turn, talks to PostgreSQL on port 5432 — also internal.

### Surprise #1: the chemical-inventory database lives on this same machine.

The earlier documentation suggested the chemical inventory's PostgreSQL database was on a separate server. It isn't — it's right here on `nfhistory`, listening on `127.0.0.1:5432`. That's a meaningful clarification: backing up `nfhistory` and backing up the chem database are the same task, not two.

## The locked door (firewall)

The server uses **nftables** (a modern Linux firewall) with a "deny by default" policy. The only ports open from the outside are 22 (SSH), 80 (HTTP), and 443 (HTTPS). Everything else is dropped silently. Internal traffic between the Flask app and PostgreSQL is allowed because both sides live on the same machine. That's a clean and conservative setup.

## TLS certificates — the part that needs maintenance

The website uses a free TLS certificate from **Let's Encrypt** so browsers see a green padlock. Let's Encrypt certificates only last 90 days, so they have to be renewed automatically by a tool called **certbot**.

Here's what the snapshot showed:

- **Current certificate** for `nfhistory.nanofab.utah.edu` expires **June 23, 2026** — about **24 days** away as of the survey.
- **certbot is set up to auto-renew it** twice a day (a "timer" runs at noon and midnight). It runs whether or not the cert actually needs renewing; Let's Encrypt only issues a new one when the existing one is within 30 days of expiry.
- The last renewal check happened just over an hour before the survey. Healthy.

You shouldn't have to touch this. But if something ever breaks the renewal (a network change, a misconfigured nginx, an expired Let's Encrypt account), the website starts throwing scary browser warnings 30 days later. Worth checking the expiry date once a month as a habit.

The server also has old, expired copies of previous certificates stored in `/etc/letsencrypt/archive/`. That's normal — Let's Encrypt's tooling keeps an archive — and isn't a problem.

## What's auto-managed

Lots of small things just *happen* on this server without anyone watching:

- **Log files** (web traffic logs, certbot logs, PostgreSQL logs) are rotated daily or weekly, compressed, and old ones deleted, so the disk doesn't fill up.
- **Certificate renewal** runs twice a day, as above.
- **System statistics** are collected every 10 minutes for later inspection.
- **Apt** (Debian's package manager) checks for available updates daily — but **it doesn't apply them automatically on the box itself.** University IT runs base patching out-of-band; enabling an on-box layer too would be an IT conversation.
- **Filesystem maintenance** (`fstrim`, `e2scrub`) runs weekly to keep the disk healthy.

This is all stock Debian behavior. Whoever installed the server didn't have to set most of it up; it came with the OS.

## What's NOT auto-managed (the surprises)

Several things in the survey are missing in ways a future maintainer should know about.

### Surprise #2: the website and downloader aren't supervised.

The Flask web app and the HSCDownloader (the data-pulling script) are running, but **nothing is watching them.** They live inside tmux sessions, which are essentially "saved terminals." If either program crashes, tmux just leaves an idle prompt sitting there — the website goes down silently until someone notices. There is no automatic restart and no alert.

The fix would be to convert them to "systemd services," the same way nginx and PostgreSQL are managed. That's a small project that would eliminate most ways the site can break silently.

### Surprise #3: the backups are run by IT, not on the box itself.

The survey found no backup tools installed locally and no backup cron jobs *on `nfhistory`* — but the actual base backup runs **off** the box, managed by **university IT**. The Nanofab team has visibility into IT's backup scope but doesn't run the pipeline. So if the disk failed today, IT could restore the VM; you'd open a ticket, not type a restore command yourself.

This means three things in practice:
- The catastrophic-loss scenario is already mitigated. The original survey-time backup gap was wrong because the survey can't see what IT runs from outside.
- **You should confirm with IT exactly what's in the snapshot** — at minimum the four SQLite databases under `~/server/UNanofabTools/instance/`, the `uploads/`, `LogData/`, and `HSCDATA/` trees under that install, and the local PostgreSQL data directory. Once confirmed, write the answer into the live-server doc so the next maintainer doesn't have to ask again.
- A **Nanofab-owned secondary backup tier** — say, a nightly local `pg_dump` plus a `restic` push to a Nanofab-controlled destination — is a reasonable thing to consider later if IT's restore SLA isn't fast enough for the team's tolerance. Not urgent.

### Surprise #4: SSH lets root in — but that's IT's access path.

The server's SSH config allows the `root` account to log in remotely (with a key — not a password). There's an active root key from a machine called `iceolate.eng.utah.edu`.

The earlier `serveraccess` docs only described the Nanofab path (laptop → CADE → `phelan@nfhistory`); they didn't mention root because the Nanofab team doesn't use it. **`iceolate` is IT's administrative host**, and root SSH is there because IT needs it for the maintenance they own (kernel patching, the backup pipeline). It's intentional and shouldn't be modified by the Nanofab team — touching `/root/.ssh/authorized_keys` or changing `PermitRootLogin` would lock IT out.

There is one small thing worth flagging back: the file that lists which keys can log in as root is set to be readable by other users. It should be private. Since `/root/` is IT-owned, the right path is **open a ticket with IT** asking them to tighten the permissions, not to fix it yourself.

### Surprise #5: unattended security upgrades aren't configured on the box.

Debian has a built-in feature ("unattended-upgrades") that quietly installs security patches in the background. It isn't enabled *on `nfhistory` itself*. **IT does run security patching out-of-band**, so the box isn't unpatched in practice — but if you want a second layer or want to see the apply happen in `journalctl`, that's a conversation with IT, not a `sudo apt install unattended-upgrades` Nanofab-side fix-it-and-forget-it.

### Surprise #6: there's a leftover `apache2` ghost.

The systemd service manager shows one "failed" unit: `apache2`. Apache (a different web server) isn't actually installed anymore; what's failing is a leftover reference. It's harmless noise, but it muddies the "is everything healthy?" view.

### Surprise #7: PHP is running and probably shouldn't be.

A program called PHP-FPM is running. This is a tool for running PHP-language websites. Nothing on `nfhistory` is written in PHP. It's probably leftover from initial setup and could be removed to free up a small amount of memory.

### Surprise #8: plain HTTP doesn't redirect to HTTPS.

If someone types `http://nfhistory.nanofab.utah.edu` (without the "s"), they currently see the default Debian welcome page instead of being redirected to the real, secure site. That's a 30-second nginx config fix and worth doing.

## The healthy parts

The above list might look long, but quite a lot is in good shape:

- The OS is current (Debian 13 from 2025, kernel 6.12).
- The TLS cert chain is being renewed automatically and is well within its valid window.
- nginx, PostgreSQL, sshd are all running cleanly with no errors recently.
- Log rotation is working (nginx access logs are being archived daily, kept for 14 days).
- The firewall is conservative and correctly configured.
- SSH password authentication is disabled across the board (key-only). Root SSH is allowed by key for IT (`PermitRootLogin without-password`) but never by password.
- The disk is barely 31% full.
- No services have failed unexpectedly except the apache2 ghost.

So: the boring infrastructure is solid. The real gap that the Nanofab team can close on its own is service supervision — nothing watches the Flask app or the downloader. Backups, root SSH, and unattended-upgrades all sit on **IT's side of the line** (more on that below).

## Who owns what (the IT / Nanofab line)

`nfhistory` is jointly operated, and the boundary matters for everything in this doc:

- **University IT owns:** the VM itself, the `root` account, the off-host backup pipeline, security patching (out-of-band), the SSH key in `/root/.ssh/authorized_keys` from `iceolate.eng.utah.edu`. The Nanofab team does **not** have root and **cannot** create UNIX accounts.
- **The Nanofab team owns:** the Flask web app, the HSCDownloader, the local PostgreSQL chemical-inventory database, everything under `/home/phelan/` (including the data trees), and the nginx `untools` vhost. Admin tasks from the Nanofab side run as `phelan` with `sudo`.

That boundary is why "let me create per-person UNIX accounts" isn't an option — only IT can do that, so the shared `phelan` model isn't a fixable Nanofab finding, it's the structural reality. Likewise the root SSH access from `iceolate` is intentional and shouldn't be touched. Several earlier recommendations in this guide and elsewhere have been recast to reflect this.

## A note on this survey

The first script run was the `root`-side system view; the follow-up `phelan` run discovered the live install path and tmux sessions. Some `phelan`-owned details still need one more run with the patched survey script — the Flask app's virtual environment, `.env` key names, SQLite databases, and data-tree sizes. The matching successor doc explains how to re-run as `phelan` and fold those details in.

## In short

The cleanroom server is a small, lightly-loaded Debian box that does its job well. nginx handles the public side; PostgreSQL and the Flask app run privately on the same machine. The TLS cert is renewed automatically and is currently 24 days from rolling over. The base backup is run off the box by IT; the main Nanofab-side gap is that nothing supervises the Flask app, so a crash leaves the site dark until a human notices. A handful of small cleanups (PHP-FPM, apache2 ghost, HTTP→HTTPS redirect) round out the Nanofab punch list. Anything involving root, backup pipelines, or new UNIX accounts goes through IT.


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/serveraccess/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Accessing the Server — A Plain-English Guide

This guide explains how to actually log in to the cleanroom server (`nfhistory`) — the machine that runs the website and the HSCDownloader. Written for someone who has never used SSH before; terms are defined as they appear.

## The short version

You can't reach the server directly from outside the lab. To get to it you have to take **two hops**:

1. From your laptop, log in to a **CADE lab machine** (a generic Linux machine in the university's College of Engineering lab pool).
2. From the CADE machine, log in to **`nfhistory`** (the cleanroom server).

Once you're on `nfhistory`, the two long-running programs — the website (`flaskserver`) and the data downloader (`downloader`) — are each kept running inside a **tmux session**. You attach to a session to look at it, then detach without killing it.

This page walks through all of that. There is a strict, separate developer reference at `../../../documentation/UNanofabTools/serveraccess/` (reference path: ../../../documentation/UNanofabTools/serveraccess/README.md); use it once you've read this.

## Why two hops?

The server lives on a private network inside the university. A computer outside that network — including your laptop at home — cannot reach it directly. The CADE lab machines are on a network that *can* reach it, so they're used as a stepping-stone. This pattern is called a "jump host" or "bastion": you log into one machine, and from there log into the real one.

CADE (the "College of Engineering Lab" cluster) is a pool of identical Linux machines named `lab1-1`, `lab1-2`, … through `lab1-40`, and `lab2-1` through `lab2-35`. They're interchangeable — pick any one. If a particular machine is slow or offline, try another number.

## What you (the user) need before your first login

1. **A CADE account.** Sign up at <https://usertools.eng.utah.edu>. This is separate from your University ID; it has its own username and password.
2. **An SSH key for CADE.** A key is a small file that proves you're you, used instead of typing a password. (The CADE site walks through generating one and uploading the public half.) You keep the private half on your laptop, typically at `~/.ssh/CADE`.
3. **An SSH key for `nfhistory`** — a second key, used for the second hop. The server admin (the cleanroom team — see "What the admin must do" below) generates and installs this one for you.
4. **Your `nfhistory` username from the admin.** This is *not* your CADE username. (More on this in a moment.)

You only do steps 1–4 once.

## The two-hop login, step by step

### Hop 1 — your laptop → CADE

Open a terminal on your laptop and run:

```
ssh -i ~/.ssh/CADE <your-CADE-username>@lab1-10.eng.utah.edu
```

What each piece means:

- `ssh` — the secure-shell tool. It opens a remote command line on another computer.
- `-i ~/.ssh/CADE` — use the key file at `~/.ssh/CADE` to authenticate.
- `<your-CADE-username>` — the username from your CADE account (replace it with yours; e.g. `phelanh`).
- `lab1-10.eng.utah.edu` — the lab machine you're connecting to. You can use any of `lab1-1` through `lab1-40`, or `lab2-1` through `lab2-35`. They're equivalent — `lab1-10` is just a habit.

After this succeeds, your terminal is now on the CADE machine. You won't see anything fancy — just a different prompt — but every command you type now runs there, not on your laptop.

### Hop 2 — CADE → `nfhistory`

From the CADE machine, run:

```
ssh nfhistory
```

That's it. Just three words.

For this to work, you need a small configuration file on the CADE machine that tells SSH what `nfhistory` actually means. That file is `~/.ssh/config` on the CADE machine and contains:

```
Host nfhistory
  Hostname 155.98.11.8
  User phelan
  IdentityFile <path-to-your-nfhistory-key>
```

Each line:

- `Host nfhistory` — the nickname. This is what makes `ssh nfhistory` work.
- `Hostname 155.98.11.8` — the actual server address on the internal network.
- `User phelan` — the **server login name**. This is fixed: it must be `phelan`. (This is the shared cleanroom account on the server; everyone uses it. Your laptop or CADE name has nothing to do with it.)
- `IdentityFile …` — the path to the server key file the admin gave you, e.g. `~/.ssh/nfhistory`.

You create this `config` file once on your CADE home directory and never touch it again. After that, `ssh nfhistory` always works from any CADE machine you log into (your CADE home is shared between them).

## You're on the server — now what?

Once `ssh nfhistory` finishes you're at a Linux prompt on the cleanroom server. The two important programs are kept running inside two **tmux** sessions:

| Session name | What it runs |
|--------------|-------------|
| `flaskserver` | The website — the Flask app that serves `nfhistory.nanofab.utah.edu` |
| `downloader` | The HSCDownloader — the script that pulls per-machine run data from CORES and writes the spreadsheets the website displays |

A **tmux session** is just a "saved terminal" — a window with a program running in it that keeps going even after you disconnect. That's what lets the website and the downloader keep running 24/7 even when nobody is logged in.

### Looking at a session (attaching)

```
tmux attach -t flaskserver
```

…shows you the website's live console output. Substitute `downloader` to see the downloader instead.

### **Leaving a session WITHOUT killing it (detaching)**

This is the single most important thing on this page. **If you close the window or type `exit`, you will kill the program.** That will take down the website (or stop the downloader from collecting data) until someone notices and restarts it.

The correct way to leave is to **detach**:

> Press `Ctrl-b`, release it, then press `d`.

(That's "control-b followed by d" — two separate keystrokes, in that order. The `Ctrl-b` is tmux's "prefix" — a signal that the next key is meant for tmux instead of the program inside it. `d` is the detach command.)

After detaching you're back at the plain server prompt; the program inside the session is still running. From here, `exit` (or closing your laptop) is fine — the session stays alive on the server.

### A simple rule of thumb

- **`tmux attach -t <name>`** — go look.
- **`Ctrl-b` then `d`** — leave without breaking anything.
- **Don't type `exit` inside the session.** That ends the program.
- **Don't press `Ctrl-c` inside the session.** Same problem — that's the keyboard signal that says "stop the running program."

## If a session got killed by accident

It happens. If `tmux attach -t flaskserver` says "no session found" or similar, the program isn't running. Here's how to bring it back.

### Re-create the `flaskserver` session

```
tmux new -s flaskserver
cd ~/server/UNanofabTools
source venv/bin/activate
python run.py
```

Then detach with `Ctrl-b d` and walk away. The website is back.

### Re-create the `downloader` session

```
tmux new -s downloader
cd ~/server/UNanofabTools
source venv/bin/activate
python3 HSCDownloader.py
```

Then detach with `Ctrl-b d`. The downloader is back.

(If the exact folders or virtual-environment activation steps differ on your install, see the developer reference — but the *shape* is always the same: open a new tmux session named after the program, change into its folder, activate the Python environment, and run the script. Then **detach, don't exit**.)

## What the admin must do

Before any of the above works for a new user, the Nanofab admin has to do two things on the server side. (These are one-time per user.)

1. **Receive the user's CADE public key** and confirm the user can reach a CADE machine. (CADE accounts and keys are managed via <https://usertools.eng.utah.edu>; the admin doesn't do that part, but they do verify the user has CADE access before issuing the next key.)
2. **Issue an `nfhistory` SSH key**. The admin generates a key pair, installs the public half on `nfhistory` under the shared `phelan` account (`~/.ssh/authorized_keys`), and gives the user the private half plus a copy of the `~/.ssh/config` block above (with the right `IdentityFile` path filled in for that user). The user puts the private half on their CADE home directory and the config block in `~/.ssh/config` on CADE.

The admin should also know the basics of keeping the two sessions healthy:

- After a reboot or a session loss, **the admin** (or anyone with access) re-creates the two tmux sessions using the procedure in the previous section.
- The admin should keep a copy of the runbook — see the developer reference for the exact commands and paths.
- Onboarding a new user means generating one more key pair, no more.

### What the Nanofab admin *cannot* do (and what to ask IT for instead)

`nfhistory` is jointly operated. The Nanofab admin has `sudo` as `phelan` but does **not** have `root`. That means these things go through **University IT**, not the Nanofab admin:

- **Creating per-person UNIX accounts** on `nfhistory`. The shared `phelan` account is the only Nanofab-side login because IT controls user creation. (That's why everyone's `~/.ssh/config` says `User phelan`.)
- **Modifying anything under `/root/`** — including the root SSH key that IT uses for their own maintenance from `iceolate.eng.utah.edu`. Leave it alone.
- **The VM-level backup**. IT runs a backup off the box; the Nanofab team doesn't operate it. If you ever need a restore, it's a ticket to IT.
- **Rebuilding `nfhistory` from scratch.** That's an IT operation. If it ever happens, see the developer reference §5.3 for what the Nanofab admin should verify after IT returns the VM.

The right framing: the Nanofab admin owns everything under `/home/phelan/` (the Flask app, the downloader, the chemical-inventory database, the data trees) and the nginx `untools` config; IT owns the VM, root, backups, and base patching.

## Common confusions

- **"My CADE username and my `nfhistory` username are different."** Yes. Your CADE username is yours; the `nfhistory` username is always `phelan` (a shared cleanroom account). Don't try to use your CADE name in the second hop — it will fail.
- **"Which `lab1-X` should I use?"** Any of them. They're identical and they share your home directory, so your `~/.ssh/config` file is already there no matter which one you land on.
- **"I closed my laptop and the website went down."** Almost certainly you didn't detach properly. Read the "Leaving a session" box again — `Ctrl-b` then `d`.
- **"`ssh nfhistory` says 'permission denied' on CADE."** Either the key file isn't where `IdentityFile` points, or the `User` line isn't `phelan`, or the admin hasn't installed your public key on the server yet.
- **"`ssh nfhistory` says 'host not found' on my laptop."** That command only works *from CADE*. Hop 1 first, then Hop 2.

## In short

You hop from your laptop into a CADE lab machine, then from there into the cleanroom server. Two long-running programs live in two tmux sessions on the server. You look at them with `tmux attach`, you leave them by pressing `Ctrl-b` then `d`, and you only ever recreate a session if one was accidentally killed. The admin's job is to issue you the second key and tell you the path to put it.


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/01-architecture.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 01 — Architecture

## 1.1 Overview

UNanofabTools is a monolithic Flask web application that combines six functional domains behind a single process:

1. Authentication & account management (`auth`)
2. User administration (`admin`)
3. Internal task tracking (`tasks`)
4. Machine data & log-file portal (`machines`)
5. IoT/device data ingestion & retrieval (`api`)
6. Chemical inventory management (`chem`)

Plus a small static-file blueprint for a particle-counter demo (`particle_demo_will`).

The application is constructed via the **application-factory pattern** (`app/create_app`) and organized into three layers: **blueprints** (HTTP routing), **services** (business logic and persistence), and **models** (ORM table definitions). Persistence spans four SQLite databases, one PostgreSQL database, and a CSV-file tree on disk.

## 1.2 Technology stack

| Concern | Technology | Version (per `requirements.txt`) |
|---------|-----------|----------------------------------|
| Web framework | Flask | 3.0.0 |
| Auth/session | Flask-Login | 0.6.3 |
| ORM (SQLite) | Flask-SQLAlchemy | 3.1.1 |
| ORM core / engine (PostgreSQL) | SQLAlchemy | 2.0.25 |
| Password hashing | Flask-Bcrypt 1.0.1 / bcrypt 4.1.2 | — |
| Schema migrations | Flask-Migrate (Alembic) | — |
| CORS | Flask-CORS | 4.0.0 |
| 2FA | duo-client | 5.3.0 |
| PostgreSQL driver | psycopg2-binary | 2.9.9 |
| Data processing | pandas | 2.2.0 |
| Excel export | xlsxwriter | 3.2.0 |
| Env-var loading | python-dotenv | 1.0.0 |
| Timezones | pytz | 2024.1 |

Python target: 3.x (the development virtualenvs in the repo use 3.14; any 3.10+ is appropriate). Templating is Jinja2 (bundled with Flask). Front-end charts use Chart.js (loaded client-side in templates).

## 1.3 System topology

```
                          ┌─────────────────────────────┐
   Browsers ─────HTTPS───►│                             │
                          │   nginx  (:443, TLS term.)  │
   Pi devices ───HTTPS───►│   reverse proxy             │
                          │                             │
   Desktop apps ─HTTPS───►└──────────────┬──────────────┘
                                         │ HTTP proxy_pass
                                         ▼ 127.0.0.1:5000
                          ┌─────────────────────────────┐
                          │  Flask process               │
                          │  (python run.py today;       │
                          │   gunicorn is the target)    │
                          └───┬───────────────┬──────────┘
                              │               │ TCP 127.0.0.1:5432
              ┌───────────────┘               └─────────────────┐
              ▼                                                  ▼
   ┌──────────────────────┐                        ┌──────────────────────────┐
   │ SQLite (instance/)   │                        │ PostgreSQL (cheminventory)│
   │  signininfo.db       │                        │  LOCAL on this same VM,   │
   │  sessioninfo.db      │                        │  postgresql@17-main,      │
   │  tasks.db            │                        │  bound to 127.0.0.1:5432  │
   │  particle_sensors.db │                        │  (containers, items,      │
   └──────────────────────┘                        │   rooms, vendors, scans,  │
              │                                    │   cycles, transactions)   │
              │                                    └──────────────────────────┘
              ▼
   ┌──────────────────────────────────────┐
   │ CSV file tree on disk                 │
   │  LogData/  (machine logs, sensor CSV) │
   │  HSCDATA/  (per-machine summary CSV)  │
   │  uploads/  (task file attachments)    │
   └──────────────────────────────────────┘
```

All five datastores live on the same VM. Browsers, devices, and desktop apps reach the box only through nginx on `:443`; nginx forwards to Flask on `127.0.0.1:5000`; Flask talks to the SQLite files directly and to PostgreSQL over `127.0.0.1:5432`. This was confirmed by the live-server survey (`../liveserver/README.md` (reference path: ../liveserver/README.md) §3.1 and §10); older diagrams that placed chem PostgreSQL off-box have been corrected.

The diagram shows the live network shape and the intended production process boundary. The current `nfhistory` snapshot still has Flask running as `python run.py` inside tmux, not gunicorn/systemd; see the live-server inventory for that operational gap.

Key invariants:

- **Flask binds to `127.0.0.1:5000`** (see `config/config.py` `HOST`/`PORT`). It is not directly reachable from the network. nginx is the only ingress and performs TLS termination. (A legacy alternative — gunicorn binding `0.0.0.0:443` with `--certfile/--keyfile` — is described in `09-deployment-and-operations.md` but the nginx model is the current intent per `run.py`'s docstring.)
- **Two human-auth tiers and one device tier coexist.** Browser routes are gated by `@login_required` / `@admin_required`; device and chem routes are not (see `05` and `07`).
- **CSV files are an authoritative data store**, not just exports. Particle/environmental history and machine logs live only as CSV; the SQLite `particle_sensor_data` table caches only the latest reading per sensor.

## 1.4 The application-factory pattern

The app is built by `create_app(config_name)` in `app/__init__.py`. There is no module-level `app = Flask(...)`; instead extensions are instantiated at import time and bound to the app inside the factory.

```python
login_manager = LoginManager()
bcrypt = Bcrypt()
migrate = Migrate()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    CORS(app)
    db.init_app(app)
    login_manager.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    ...
    return app
```

Factory responsibilities, in order:

1. Instantiate `Flask(__name__)`.
2. Load config from the selected config class (`app.config.from_object`) and run its `init_app` hook (absolute-path resolution; production logging).
3. Enable CORS for all origins/routes.
4. Bind extensions: SQLAlchemy (`db`), Flask-Login, Bcrypt, Flask-Migrate.
5. Configure Flask-Login (`login_view = 'auth.login'`, messages).
6. Register the `fmtdate` Jinja filter (date formatting for chem templates).
7. Import and register all seven blueprints.
8. Register inline static routes: `/js/<path>`, `/css/<path>`, `/favicon.ico`.
9. Call `db.create_all()` within an app context to create any missing SQLite tables.

Blueprint imports are deferred to inside the factory to avoid circular imports (blueprints import from `app.services` and `app.models`, which import `db` from `app.models`).

The Flask-Login user loader is defined at module scope:

```python
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
```

### Consequence: `db.create_all()` vs. migrations

`db.create_all()` creates missing SQLite tables on every boot but never alters existing ones. Schema changes to SQLite-backed models therefore require an Alembic migration (`flask db migrate` / `flask db upgrade`), not just a model edit. The chem PostgreSQL schema is **not** managed by `db.create_all()` at all — it is provisioned separately (see `04` and `09`).

## 1.5 Layering

```
app/
├── __init__.py          ← application factory + user_loader
├── blueprints/          ← HTTP layer: routing, request parsing, response shaping
│   ├── auth.py
│   ├── admin.py
│   ├── tasks.py
│   ├── machines.py
│   ├── api.py
│   ├── chem_inventory.py
│   ├── particle_demo_will.py
│   └── chem_inventory_remote.py   ← NOT registered; inert (see note)
├── services/            ← business logic + persistence
│   ├── auth_service.py
│   ├── admin_service.py
│   ├── task_service.py        ← uses raw sqlite3 (not SQLAlchemy)
│   ├── data_service.py        ← CSV/pandas processing
│   └── chem_service.py        ← PostgreSQL via SQLAlchemy Core (text())
├── models/              ← ORM table definitions
│   ├── __init__.py            ← db, User, Session, Task, TaskAssignee, TaskFile
│   ├── particle_sensor.py     ← ParticleSensorData
│   ├── chem_inventory.py      ← chem tables (declarative; documentation/parity)
│   ├── session.py, task.py, user.py  ← EMPTY placeholder files
├── templates/           ← Jinja2 templates (top-level + chem/ subdir)
└── static/              ← css/inventory.css, js/{adminActions,graph,taskActions,tablesort}.js
```

**Layering rules observed by the codebase:**

- Blueprints handle HTTP concerns only (parse `request`, call services, return `render_template`/`jsonify`/`redirect`). They do not contain SQL except for two exceptions: `tasks.get_users` and `chem_inventory.container_lookup` execute queries inline.
- Services contain logic and persistence and do not import Flask request/response objects (they may use `current_app` for config and logging).
- Models define tables. Note three inconsistencies worth knowing:
  - `task_service.py` bypasses the ORM and uses the `sqlite3` standard library directly against `tasks.db`. The `Task`/`TaskAssignee`/`TaskFile` models exist but are used only by `db.create_all()` to create the tables.
  - `chem_service.py` uses **SQLAlchemy Core** (`engine`, `text()`), not the ORM session, and not the declarative models in `app/models/chem_inventory.py`. Those model classes are parity/documentation artifacts.
  - `app/models/session.py`, `task.py`, and `user.py` are empty (0 bytes); the real classes live in `app/models/__init__.py`.

### Note: `chem_inventory_remote.py`

`app/blueprints/chem_inventory_remote.py` defines a near-duplicate `chem_bp` with the same `/chem/*` routes. It is **not imported or registered** in `app/__init__.py`, so it never executes. Treat it as inert. Only `chem_inventory.py` is live.

## 1.6 Request flow

A request traverses these stages:

```
client → nginx (TLS) → WSGI → Flask routing → [decorators] → blueprint view → service(s) → datastore
                                                                    │
                                  response ◄── template/json/file ◄─┘
```

1. **nginx** terminates TLS and `proxy_pass`es to `127.0.0.1:5000`, forwarding headers and cookies.
2. **WSGI/Werkzeug** parses the HTTP request into a `request` object.
3. **Routing** matches the path+method to a blueprint view function.
4. **Decorators** run outermost-first: `@login_required` then `@admin_required` (where present). Unauthenticated requests to protected routes redirect to `auth.login`.
5. **View** parses inputs, invokes one or more **services**, and builds a response (`render_template`, `jsonify`, `send_file`, or `redirect`).
6. Response propagates back through WSGI and nginx (re-encrypted).

Detailed scenario walkthroughs (browser page, device POST, chem page) are in `05` and `08`.

## 1.7 Persistence map

| Datastore | Location | Owner | Access method |
|-----------|----------|-------|---------------|
| `signininfo.db` (users) | `instance/signininfo.db` | `auth_service`, `admin_service` | Flask-SQLAlchemy ORM (default bind) |
| `sessioninfo.db` (sessions) | `instance/sessioninfo.db` | `auth_service` | ORM (`sessions` bind) |
| `tasks.db` (tasks) | `instance/tasks.db` | `task_service` | **raw `sqlite3`** |
| `particle_sensors.db` | `instance/particle_sensors.db` | `api` blueprint | ORM (`particle_sensors` bind) |
| PostgreSQL `cheminventory` | **local on this same VM** (`postgresql@17-main`, bound to `127.0.0.1:5432`; see `../liveserver/README.md` (reference path: ../liveserver/README.md) §10) | `chem_service` | SQLAlchemy Core (`text()`) |
| `LogData/` tree | filesystem | `api`, `machines`, `data_service` (raw machine logs uploaded by the `filetransfer` scripts; sensor CSVs written by the `api` blueprint from posts originated by the `NanofabToolkit/PicoHelperTools` (reference path: ../../NanofabToolkit/PicoHelperTools/README.md) firmware) | direct file I/O |
| `HSCDATA/` | filesystem | `machines`, `data_service` (CSVs populated by the external `hscdownloader` tool pulling from CORES) | CSV via `csv`/pandas |
| `uploads/` | filesystem | `task_service` | direct file I/O |

The database bind keys (`sessions`, `tasks`, `particle_sensors`) are configured in `config.py` under `SQLALCHEMY_BINDS` and declared on each model via `__bind_key__`. See `04`.

## 1.8 Directory layout (repository root, server-relevant only)

```
UNanofabTools/
├── run.py                       ← WSGI entry point / dev launcher
├── requirements.txt
├── setup.sh / quick_setup.sh    ← bootstrap scripts
├── init_chem_db.py              ← provisions the PostgreSQL chem schema
├── chem_schema.sql              ← chem schema (v1 base)
├── chem_schema_migration_v2.sql ← chem schema (v2 additive migration)
├── .env.example                 ← environment-variable template
├── config/
│   └── config.py                ← configuration classes
├── app/                         ← the application package (see 1.5)
├── migrations/                  ← Alembic/Flask-Migrate (one revision present)
│   ├── alembic.ini, env.py, script.py.mako, README
│   └── versions/01bdbfe91bd5_create_particle_sensor_tables.py
└── instance/                    ← runtime SQLite databases
    ├── signininfo.db
    ├── sessioninfo.db
    ├── tasks.db
    └── particle_sensors.db
```

Everything else at the repo root (`*.ps1`, `*.zip`, standalone machine `.py` files, miscellaneous `.md` notes) is outside the Flask application and outside this documentation's scope.

Continue to 02-getting-started.md (reference path: 02-getting-started.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/02-getting-started.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 02 — Getting Started (Local Development)

This document gets a new developer from a fresh clone to a running development server. Production deployment is covered separately in 09-deployment-and-operations.md (reference path: 09-deployment-and-operations.md).

## 2.1 Prerequisites

| Requirement | Notes |
|-------------|-------|
| Python 3.10+ | The repo's virtualenvs use 3.14; any modern 3.x works. `python3 --version` to check. |
| `pip` + `venv` | Standard library; bundled with CPython. |
| PostgreSQL 12+ | Required **only** for the chemical-inventory module. The rest of the app runs without it. The production deployment on `nfhistory` runs Postgres **locally on the same VM** (see `../liveserver/README.md` (reference path: ../liveserver/README.md) §10). A development install can point at any reachable Postgres via the `CHEM_PGHOST` env var; local is the simplest. |
| Build headers for `psycopg2` (optional) | `requirements.txt` pins `psycopg2-binary`, which ships wheels, so no compiler is normally needed. |
| Duo account (optional) | Only needed to exercise real 2FA. In development you run with `DEBUG_MODE=True`, which bypasses Duo entirely. |

The SQLite databases need no server — they are files created automatically.

## 2.2 Quick start (scripted)

The repo ships `setup.sh` (and `quick_setup.sh`) which automate most of the below:

```bash
./setup.sh
```

`setup.sh` will:

1. Verify Python 3 is installed.
2. Create a `venv/` virtualenv if absent and activate it.
3. `pip install -r requirements.txt`.
4. Copy `.env.example` → `.env` (if `.env` is absent) and pause for you to edit it.
5. Create required directories: `app/templates`, `app/static/{js,css}`, `uploads`, `HSCDATA`, `LogData/ALD/{RF,Pressure}`, `LogData/Paralyne/analog`, `LogData/denton18/pumpdata`, `logs`.

> Note: `setup.sh` also prints legacy migration instructions (moving `*.html` into `app/templates/`, etc.). Those steps are already done in the current repo — they were one-time migration steps from the old monolith. Ignore them on an existing checkout.

The manual equivalent is below; use it if you want to understand each step or the script fails.

## 2.3 Manual setup

### Step 1 — Virtual environment

```bash
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
```

### Step 2 — Dependencies

```bash
pip install -r requirements.txt
```

### Step 3 — Environment file

```bash
cp .env.example .env
```

Then edit `.env`. The minimum to run locally:

```ini
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=any-non-empty-dev-value
DEBUG_MODE=True
```

`DEBUG_MODE=True` is what makes local development practical: it bypasses Duo 2FA and enables Flask's reloader and verbose error pages. Every key in `.env` is documented in 03-configuration-reference.md (reference path: 03-configuration-reference.md).

> The committed `.env.example` sets `HOST=155.98.11.6` and `PORT=443` (a legacy production-direct configuration). For local development, either remove those lines (so the `127.0.0.1:5000` defaults apply) or set `HOST=127.0.0.1` and `PORT=5000` explicitly.

### Step 4 — Required directories

If you didn't run `setup.sh`, create the data directories the app expects. The config's `init_app` will `os.makedirs(..., exist_ok=True)` the `UPLOAD_FOLDER`, `DATA_DIR`, and `LOG_DATA_DIR` automatically at startup, so the strictly required manual step is just ensuring you have write permission in the working directory. For completeness:

```bash
mkdir -p uploads HSCDATA logs \
         LogData/ALD/RF LogData/ALD/Pressure \
         LogData/Paralyne/analog LogData/denton18/pumpdata \
         LogData/particle_sensors LogData/env_sensors LogData/sensors
```

### Step 5 — SQLite databases

No action required. On first boot, `create_app` runs `db.create_all()`, which creates `signininfo.db`, `sessioninfo.db`, `tasks.db`, and `particle_sensors.db`. By default Flask-SQLAlchemy places these under the `instance/` folder.

If you want to apply Alembic migrations explicitly instead of relying on `create_all()`:

```bash
export FLASK_APP=run.py
flask db upgrade
```

There is currently one migration revision (`01bdbfe91bd5_create_particle_sensor_tables`).

### Step 6 — (Optional) PostgreSQL for chemical inventory

The chem module needs a PostgreSQL database. To set it up locally:

1. Create the database and a user:

   ```bash
   createdb cheminventory
   # or: psql -c "CREATE DATABASE cheminventory;"
   ```

2. Add the connection settings to `.env`:

   ```ini
   CHEM_PGHOST=localhost
   CHEM_PGPORT=5432
   CHEM_POSTGRES_DB=cheminventory
   CHEM_POSTGRES_USER=postgres
   CHEM_POSTGRES_PASSWORD=your-local-password
   ```

3. Provision the schema:

   ```bash
   python init_chem_db.py
   ```

   This reads `chem_schema.sql` and creates the base tables, views, and the `seq_barcode` sequence.

4. Apply the v2 additive migration (adds barcode-printing columns, `room_name`, `added_by`, etc.):

   ```bash
   psql -d cheminventory -f chem_schema_migration_v2.sql
   ```

> Important: the live `chem_service.py` references additional columns and a `transactions` table that are **not** in either committed `.sql` file (the production database has drifted ahead of the committed schema). A fresh database provisioned only from the committed files will be missing those, and several chem features will error until the missing objects are added. See the separate known-issues file for the exact list. If you only need the non-chem parts of the app, skip this entire step — the chem engine is created lazily and won't be touched until a `/chem/*` route is hit.

## 2.4 Running the development server

```bash
export FLASK_ENV=development     # or set in .env
python run.py
```

`run.py` reads `FLASK_ENV`, builds the app, and (because it's executed directly) calls `app.run(host, port, debug, use_reloader=debug)`. With the development config you'll get:

- Binding to `127.0.0.1:5000` (unless overridden by `HOST`/`PORT`).
- Debug mode on (auto-reload, interactive traceback).
- `SESSION_COOKIE_SECURE=False` (so cookies work over plain HTTP).

Open `http://127.0.0.1:5000/login`.

To create your first user, go to `/signup`. With `DEBUG_MODE=True`, Duo is skipped and the account is created immediately. To grant yourself admin or task-assignment rights, flip `isAdmin` / `canAssign` directly in `signininfo.db` (e.g. with the `sqlite3` CLI) since there is no bootstrap admin:

```bash
sqlite3 instance/signininfo.db \
  "UPDATE signininfo SET isAdmin=1, canAssign=1 WHERE username='yourname';"
```

## 2.5 Running tests

There is no automated test suite in the repository at present. Verification is manual. When adding tests, see 10-development-guide.md (reference path: 10-development-guide.md) §10.7 for the recommended approach (pytest + the application factory with a test config).

## 2.6 Common first-run issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| `OperationalError: unable to open database file` | Working directory not writable, or `instance/` missing | Run from the repo root; ensure write permission |
| Chem pages 500 with connection refused | PostgreSQL not running or `.env` chem vars wrong | Start Postgres / fix `CHEM_*` vars, or avoid `/chem/*` |
| Login always fails in dev | The app is not using `DevelopmentConfig`, so Duo runs and there are no Duo creds | Confirm `FLASK_ENV=development` (or unset it); `DevelopmentConfig` hardcodes `DEBUG_MODE=True` |
| Cookies not persisting over HTTP | `SESSION_COOKIE_SECURE=True` while testing on `http://` | Use `DevelopmentConfig` (sets it `False`) or set the env var |
| Static JS/CSS 404 | Files not under `app/static/js` or `app/static/css` | Confirm the static layout (`02.3 Step 4`) |

Continue to 03-configuration-reference.md (reference path: 03-configuration-reference.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/03-configuration-reference.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 03 — Configuration Reference

All configuration lives in `config/config.py` and is sourced from environment variables (loaded from `.env` via `python-dotenv`). This document is the authoritative reference for every key.

## 3.1 How configuration loads

1. `config/config.py` calls `load_dotenv()` at import time, populating `os.environ` from `.env` if present. `python-dotenv` does **not** override already-set process environment variables unless called with `override=True`; this code does not pass that flag.
2. `run.py` reads `FLASK_ENV` (default `development`) and passes it to `create_app`.
3. `create_app` does `app.config.from_object(config[config_name])`, copying every uppercase attribute of the chosen config class into `app.config`.
4. `create_app` then calls `config[config_name].init_app(app)` for per-environment setup.

The `config` dispatch dictionary:

```python
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
```

`FLASK_ENV=production` selects `ProductionConfig`; unset defaults to `development`; `development` and `default` select `DevelopmentConfig`. Any other non-empty value is a startup error because `create_app` indexes the dictionary directly.

## 3.2 Configuration keys

Each row lists the `app.config` key, the environment variable it reads, the default if unset, and its meaning. Booleans are parsed as `os.getenv(NAME, default).lower() == 'true'`.

### Flask core

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `SECRET_KEY` | `SECRET_KEY` | `'dev-secret-key-change-in-production'` | Signs session cookies. **Must** be a strong random value in production; if leaked, sessions can be forged. |
| `DEBUG_MODE` | `DEBUG_MODE` | `False` | App-level debug flag. Drives two behaviors: (1) bypasses Duo 2FA in `auth.py`; (2) passed to `app.run(debug=...)`. Subclasses override (dev `True`, prod `False`). |

### Server binding

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `HOST` | `HOST` | `'127.0.0.1'` | Interface Flask binds to. Loopback by design; nginx fronts it. |
| `PORT` | `PORT` | `5000` | Port Flask binds to. Cast to `int`. |

> The committed `.env.example` overrides these to `155.98.11.6:443`, reflecting a legacy "Flask serves TLS directly" deployment. The current intended model (per `run.py`'s docstring) is nginx on 443 → Flask on `127.0.0.1:5000`. See `09`.

### SSL (standalone only)

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `SSL_CERT_PATH` | `SSL_CERT_PATH` | `'cert.pem'` | TLS cert path; used only if Flask/gunicorn serves TLS directly (no nginx). |
| `SSL_KEY_PATH` | `SSL_KEY_PATH` | `'key.pem'` | TLS key path; same caveat. |

These keys are defined but not consumed by `run.py` (which never enables SSL). They exist for a gunicorn `--certfile/--keyfile` deployment.

### SQLite databases

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `SQLALCHEMY_DATABASE_URI` | `DATABASE_URI` | `'sqlite:///signininfo.db'` | Primary DB (users). |
| `SQLALCHEMY_BINDS['sessions']` | `SESSION_DATABASE_URI` | `'sqlite:///sessioninfo.db'` | Sessions DB. |
| `SQLALCHEMY_BINDS['tasks']` | `TASK_DATABASE_URI` | `'sqlite:///tasks.db'` | Tasks DB (note: `task_service` uses raw sqlite3, not this URI — see below). |
| `SQLALCHEMY_BINDS['particle_sensors']` | `PARTICLE_SENSOR_DATABASE_URI` | `'sqlite:///particle_sensors.db'` | Particle-sensor cache DB. |
| `SQLALCHEMY_TRACK_MODIFICATIONS` | — | `False` | Disables SQLAlchemy event tracking (memory overhead). |

> `sqlite:///name.db` is a **relative** URI; Flask-SQLAlchemy resolves it under the `instance/` folder. `task_service.py` independently looks for `instance/tasks.db` (falling back to `./tasks.db`) using its own `_get_db_path()`, so the `TASK_DATABASE_URI` value is effectively ignored by the task code. Keep them consistent if you change it.

### PostgreSQL (chemical inventory)

Each uses a nested default: the `CHEM_*` var first, then a generic Postgres var, then a hardcoded fallback.

| Key | Env var (then fallback) | Default | Meaning |
|-----|--------------------------|---------|---------|
| `CHEM_PGHOST` | `CHEM_PGHOST` → `PGHOST` | `'localhost'` | Postgres host. |
| `CHEM_PGPORT` | `CHEM_PGPORT` → `PGPORT` | `'5432'` | Postgres port (string). |
| `CHEM_POSTGRES_DB` | `CHEM_POSTGRES_DB` → `POSTGRES_DB` | `'cheminventory'` | Database name. |
| `CHEM_POSTGRES_USER` | `CHEM_POSTGRES_USER` → `POSTGRES_USER` | `'postgres'` | Username. |
| `CHEM_POSTGRES_PASSWORD` | `CHEM_POSTGRES_PASSWORD` → `POSTGRES_PASSWORD` | `'changeme'` | Password. **Override in production.** |

`chem_service.get_chem_engine()` assembles these into `postgresql+psycopg2://user:pwd@host:port/db` and creates a pooled engine (`pool_pre_ping=True, pool_size=5, max_overflow=10, future=True`). These keys are **not** present in `.env.example`; add them yourself when enabling chem.

### Duo 2FA

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `DUO_IKEY` | `DUO_IKEY` | `None` | Duo integration key. |
| `DUO_SKEY` | `DUO_SKEY` | `None` | Duo secret key. |
| `DUO_HOST` | `DUO_HOST` | `None` | Duo API hostname. |

Consumed by `auth_service.duo_authenticate`. If unset and `DEBUG_MODE` is `False`, Duo calls fail (and logins/signups are rejected). With `DEBUG_MODE=True`, Duo is skipped and these may be `None`.

### Session cookie policy

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `SESSION_COOKIE_SECURE` | `SESSION_COOKIE_SECURE` | `True` (dev overrides to `False`) | Cookie sent over HTTPS only. |
| `SESSION_COOKIE_HTTPONLY` | `SESSION_COOKIE_HTTPONLY` | `True` | Cookie inaccessible to JavaScript (XSS mitigation). |
| `SESSION_COOKIE_SAMESITE` | `SESSION_COOKIE_SAMESITE` | `'Lax'` | CSRF mitigation; cookie not sent on cross-site POSTs. |
| `PERMANENT_SESSION_LIFETIME` | `PERMANENT_SESSION_LIFETIME` | `7200` (seconds = 2h) | Lifetime for Flask sessions marked permanent. The current login flow does not set `flask_session.permanent = True`, so this setting does not by itself enforce a 2h login-cookie expiry. Cast to `int`. |

### File uploads

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `UPLOAD_FOLDER` | `UPLOAD_FOLDER` | `'uploads'` | Where task attachments are saved (resolved to absolute in `init_app`). |
| `MAX_CONTENT_LENGTH` | `MAX_CONTENT_LENGTH` | `16777216` (16 MB) | Max request body; larger requests are rejected by Flask before view code runs. |
| `ALLOWED_EXTENSIONS` | `ALLOWED_EXTENSIONS` | `txt,pdf,csv,png,jpg,jpeg,doc,docx,xls,xlsx` | Parsed into a `set`. **Note:** `task_service.allowed_file` uses its own hardcoded set (which also includes `gif`) and ignores this config value. |

### Data directories

| Key | Env var | Default | Meaning |
|-----|---------|---------|---------|
| `DATA_DIR` | `DATA_DIR` | `'HSCDATA'` | Per-machine summary CSVs (`small_<Machine>_DataCollection.csv`). Resolved to absolute in `init_app`. |
| `LOG_DATA_DIR` | `LOG_DATA_DIR` | `'LogData'` | Machine logs and sensor CSVs. Resolved to absolute in `init_app`. |

## 3.3 The `init_app` hooks

### Base `Config.init_app`

```python
@staticmethod
def init_app(app):
    for key in ('UPLOAD_FOLDER', 'DATA_DIR', 'LOG_DATA_DIR'):
        app.config[key] = os.path.abspath(app.config[key])
        os.makedirs(app.config[key], exist_ok=True)
```

Converts the three data directories to absolute paths and ensures they exist. The absolute-path conversion is important: Flask's `send_file` resolves relative paths against `app.root_path` (not the process CWD), which previously caused downloads to look in the wrong directory.

### `DevelopmentConfig`

```python
class DevelopmentConfig(Config):
    DEBUG = True
    DEBUG_MODE = True
    SESSION_COOKIE_SECURE = False
```

Forces debug on and relaxes the secure-cookie flag for plain-HTTP local testing.

### `ProductionConfig`

```python
class ProductionConfig(Config):
    DEBUG = False
    DEBUG_MODE = False

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        import logging
        from logging.handlers import RotatingFileHandler
        if not app.debug:
            file_handler = RotatingFileHandler('logs/untools.log', maxBytes=10240000, backupCount=10)
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)
            app.logger.setLevel(logging.INFO)
            app.logger.info('UNanofabTools startup')
```

Disables debug and installs a rotating file log at `logs/untools.log` (10 MB × 10 backups). **The `logs/` directory must exist** or the handler creation raises — `setup.sh` creates it; ensure your deployment does too.

## 3.4 Complete `.env` template (annotated)

This expands `.env.example` with the chem and particle keys it omits. Use it as the production starting point.

```ini
# --- Flask core ---
FLASK_APP=run.py
FLASK_ENV=production                 # development | production
SECRET_KEY=<64+ random chars>        # REQUIRED in prod
DEBUG_MODE=False                     # NEVER True in prod (bypasses 2FA)

# --- Server binding (nginx model: leave defaults; Flask on loopback) ---
# HOST=127.0.0.1
# PORT=5000

# --- SQLite databases (relative → instance/) ---
DATABASE_URI=sqlite:///signininfo.db
SESSION_DATABASE_URI=sqlite:///sessioninfo.db
TASK_DATABASE_URI=sqlite:///tasks.db
PARTICLE_SENSOR_DATABASE_URI=sqlite:///particle_sensors.db

# --- PostgreSQL (chemical inventory) ---
CHEM_PGHOST=localhost
CHEM_PGPORT=5432
CHEM_POSTGRES_DB=cheminventory
CHEM_POSTGRES_USER=postgres
CHEM_POSTGRES_PASSWORD=<strong password>

# --- Duo 2FA (required when DEBUG_MODE=False) ---
DUO_IKEY=<integration key>
DUO_SKEY=<secret key>
DUO_HOST=<api-XXXXXXXX.duosecurity.com>

# --- Session cookies ---
SESSION_COOKIE_SECURE=True
SESSION_COOKIE_HTTPONLY=True
SESSION_COOKIE_SAMESITE=Lax
PERMANENT_SESSION_LIFETIME=7200

# --- Uploads ---
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
ALLOWED_EXTENSIONS=txt,pdf,csv,png,jpg,jpeg,doc,docx,xls,xlsx

# --- Data directories ---
DATA_DIR=HSCDATA
LOG_DATA_DIR=LogData
```

## 3.5 Configuration precedence summary

```
hardcoded default in config.py
        ▼ overridden by
values loaded from .env for variables not already set
        ▼ overridden by
existing process environment variables
        ▼ selected by
FLASK_ENV → config class (Development/Production) class-attribute overrides
```

Note the subtlety: class-attribute overrides in `DevelopmentConfig`/`ProductionConfig` (e.g. `DEBUG_MODE = True`) take effect because `from_object` reads the class attributes *after* the base class computed them from env vars. So in development, `DEBUG_MODE` is `True` regardless of the `.env` value, because `DevelopmentConfig` hardcodes it. If you need env-var control of debug in a given environment, account for this.

Continue to 04-database-schema.md (reference path: 04-database-schema.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/04-database-schema.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 04 — Database Schema Reference

The server uses five databases: four SQLite files (managed via Flask-SQLAlchemy ORM and Alembic) and one PostgreSQL database (managed via raw SQL through SQLAlchemy Core). This document is the authoritative schema reference.

## 4.1 Database inventory

| Database | Engine | Location | Bind key | Managed by |
|----------|--------|----------|----------|------------|
| Users | SQLite | `instance/signininfo.db` | (default) | Flask-SQLAlchemy ORM + Alembic |
| Sessions | SQLite | `instance/sessioninfo.db` | `sessions` | ORM + Alembic |
| Tasks | SQLite | `instance/tasks.db` | `tasks` | ORM (DDL) + raw `sqlite3` (DML) |
| Particle sensors | SQLite | `instance/particle_sensors.db` | `particle_sensors` | ORM + Alembic |
| Chemical inventory | PostgreSQL | **local** `cheminventory` (postgresql@17-main on `127.0.0.1:5432`, same host as the Flask app — confirmed by the live-server survey in `../liveserver/README.md` (reference path: ../liveserver/README.md) §10) | `chem_inventory` (declared but unused at runtime) | `init_chem_db.py` + SQL files + ad-hoc DDL |

## 4.2 SQLite models (`app/models/__init__.py` and `app/models/particle_sensor.py`)

All SQLite tables are defined as Flask-SQLAlchemy models. `db.create_all()` (called in `create_app`) creates any missing tables on boot.

### 4.2.1 `User` → table `signininfo`

```python
class User(UserMixin, db.Model):
    __tablename__ = 'signininfo'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False, name='passwordHash')
    unid = db.Column(db.String(255), unique=True, nullable=False, name='uNID')
    is_admin = db.Column(db.Boolean, default=False, name='isAdmin')
    can_assign = db.Column(db.Boolean, default=False, name='canAssign')
```

| Column (DB) | Python attr | Type | Constraints | Notes |
|-------------|-------------|------|-------------|-------|
| `id` | `id` | INTEGER | PK | Auto-increment. Stored in the Flask-Login cookie. |
| `username` | `username` | VARCHAR(255) | unique, not null | Login identifier. |
| `passwordHash` | `password_hash` | VARCHAR(255) | not null | bcrypt hash (never plaintext). Column name is camelCase (legacy). |
| `uNID` | `unid` | VARCHAR(255) | unique, not null | University ID; used as Duo username and password-reset secret. |
| `isAdmin` | `is_admin` | BOOLEAN | default False | Grants admin panel. |
| `canAssign` | `can_assign` | BOOLEAN | default False | Grants task creation/assignment. |

`UserMixin` supplies Flask-Login's `is_authenticated`, `get_id()`, etc. There is no auto-created admin; bootstrap by editing the row directly (see `02` §2.4).

### 4.2.2 `Session` → table `sessioninfo` (bind `sessions`)

```python
class Session(db.Model):
    __tablename__ = 'sessioninfo'
    __bind_key__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INTEGER | PK | |
| `session_id` | VARCHAR(255) | unique, not null | UUID4 string stored server-side and in the Flask cookie. |
| `username` | VARCHAR(255) | not null | Owner of the session. |
| `created_at` | DATETIME | default `utcnow` | Used by `delete_old_sessions` to purge stale rows. |

This is a server-side session record, separate from Flask's signed-cookie session. See `07` §7.4 for the relationship between the two.

### 4.2.3 `Task` → table `tasks` (bind `tasks`)

```python
class Task(db.Model):
    __tablename__ = 'tasks'
    __bind_key__ = 'tasks'
    task_id = db.Column(db.Integer, primary_key=True)
    task_title = db.Column(db.String(255), nullable=False)
    task_description = db.Column(db.Text)
    task_assign_date = db.Column(db.DateTime, default=datetime.utcnow)
    task_due_date = db.Column(db.DateTime)
    task_priority = db.Column(db.String(50))
    task_assigner = db.Column(db.String(255))
    task_status = db.Column(db.String(50), default='Pending')
    assignees = db.relationship('TaskAssignee', backref='task', lazy=True, cascade='all, delete-orphan')
    files = db.relationship('TaskFile', backref='task', lazy=True, cascade='all, delete-orphan')
```

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `task_id` | INTEGER | PK | |
| `task_title` | VARCHAR(255) | not null | |
| `task_description` | TEXT | | |
| `task_assign_date` | DATETIME | default `utcnow` | When created. |
| `task_due_date` | DATETIME | | Optional. |
| `task_priority` | VARCHAR(50) | | Free-text priority. |
| `task_assigner` | VARCHAR(255) | | Username of creator. |
| `task_status` | VARCHAR(50) | default `'Pending'` | `task_service.update_task_status` sets `'Completed'`. |

> **Runtime caveat:** `task_service.py` accesses `tasks.db` via the `sqlite3` standard library, not via these ORM relationships. The ORM models exist so `db.create_all()` builds the tables, but reads/writes at runtime are raw SQL. The relationships (`assignees`, `files`) are not used at runtime; the service joins manually.

### 4.2.4 `TaskAssignee` → table `assignees` (bind `tasks`)

```python
class TaskAssignee(db.Model):
    __tablename__ = 'assignees'
    __bind_key__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'), nullable=False)
    assignee_name = db.Column(db.String(255), nullable=False)
```

Many-to-many bridge between tasks and usernames. One row per (task, assignee).

### 4.2.5 `TaskFile` → table `task_files` (bind `tasks`)

```python
class TaskFile(db.Model):
    __tablename__ = 'task_files'
    __bind_key__ = 'tasks'
    file_id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.task_id'), nullable=False)
    file_path = db.Column(db.String(512), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
```

Records attachment file paths (the bytes live in `UPLOAD_FOLDER`). One row per uploaded file.

### 4.2.6 `ParticleSensorData` → table `particle_sensor_data` (bind `particle_sensors`)

Defined in `app/models/particle_sensor.py`. Stores only the **most recent** reading per (room, sensor); time series lives in CSV.

```python
class ParticleSensorData(db.Model):
    __tablename__ = 'particle_sensor_data'
    __bind_key__ = 'particle_sensors'
    id = db.Column(db.Integer, primary_key=True)
    room_name = db.Column(db.String(255), nullable=False)
    sensor_number = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    # raw measurements, converted ft³ values, differential bins,
    # mass concentrations, and optional temperature_c / humidity_pct
    __table_args__ = (
        db.UniqueConstraint('room_name', 'sensor_number', name='unique_sensor_location'),
    )
```

Column groups (all `Float` unless noted):

| Group | Columns |
|-------|---------|
| Identity | `id` (PK INT), `room_name` (str, NN), `sensor_number` (str, NN), `timestamp` (DateTime, NN), `last_updated` (DateTime) |
| Raw SPS30 | `mass_pm1`, `mass_pm2_5`, `mass_pm4`, `mass_pm10`, `num_pm0_5`, `num_pm1`, `num_pm2_5`, `num_pm4`, `num_pm10`, `typical_particle_size_um` |
| Converted (#/ft³) | `num_pm0_5_ft3`, `num_pm1_ft3`, `num_pm2_5_ft3`, `num_pm4_ft3`, `num_pm10_ft3` |
| Differential bins (ft³) | `bin_0_3_to_0_5`, `bin_0_5_to_1_0`, `bin_1_0_to_2_5`, `bin_2_5_to_4_0`, `bin_4_0_to_10` |
| Mass conc. (µg/m³) | `mass_pm1_ug_m3`, `mass_pm2_5_ug_m3`, `mass_pm4_ug_m3`, `mass_pm10_ug_m3` |
| Environmental (optional) | `temperature_c` (nullable), `humidity_pct` (nullable) |

**Unique constraint** `unique_sensor_location` on `(room_name, sensor_number)` enforces one row per sensor; the `api` blueprint upserts against it.

`to_dict()` serializes the row into the same nested JSON shape that devices POST (see `08` §8.2), enabling symmetric round-trips.

## 4.3 SQLite migrations (Alembic / Flask-Migrate)

The `migrations/` directory is a standard Flask-Migrate setup (`alembic.ini`, `env.py`, `script.py.mako`, `versions/`). One revision is present:

```
migrations/versions/01bdbfe91bd5_create_particle_sensor_tables.py
```

Workflow:

```bash
export FLASK_APP=run.py
flask db migrate -m "describe change"   # autogenerate a revision from model diffs
flask db upgrade                        # apply
flask db downgrade                      # revert one revision
```

> Because `create_app` also calls `db.create_all()`, brand-new tables get created at boot even without a migration — but **column changes to existing tables require a migration**. Prefer migrations for any schema change so environments stay reproducible. Note that `db.create_all()` and Alembic can drift apart if you rely on the former; treat Alembic as the source of truth.

## 4.4 PostgreSQL chemical-inventory schema

The chem database is provisioned by `init_chem_db.py` (which executes `chem_schema.sql`), then extended by `chem_schema_migration_v2.sql`. At runtime `chem_service.py` uses SQLAlchemy Core (`engine.begin()` + `text()`), not the ORM.

There are declarative model classes in `app/models/chem_inventory.py` (Category, Vendor, Room, Item, Container, InventoryCycle, ScanRaw, ContainerScan), but they are **parity/documentation artifacts** — the runtime path does not use them.

### 4.4.1 Sequence

```sql
CREATE SEQUENCE IF NOT EXISTS seq_barcode
  START WITH 100001 INCREMENT BY 1 NO MINVALUE NO MAXVALUE;
```

`chem_service._next_barcode` calls `nextval('seq_barcode')` for each new container, guaranteeing unique 6-digit barcodes under concurrency.

### 4.4.2 Lookup tables

```sql
categories (category_id SERIAL PK, name TEXT NOT NULL UNIQUE)
vendors    (vendor_id SERIAL PK, vendor_name TEXT NOT NULL UNIQUE)
rooms      (room_id SERIAL PK, room_no TEXT, room_name TEXT, room_desc TEXT,
            area_class TEXT, building TEXT, lab_code TEXT)
```

`rooms.room_no` has a unique index (`idx_rooms_room_no_unique`) because `chem_service.resolve_room_id` upserts rooms with `ON CONFLICT (room_no)`. `room_no/room_name/room_desc/area_class` are added by the v2 migration on older databases.

### 4.4.3 `items` (chemical product definitions)

```sql
items (
  item_id SERIAL PK,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  catalog_number TEXT,
  physical_state TEXT,
  volume_size TEXT,
  category_id INTEGER NOT NULL REFERENCES categories(category_id)
              ON UPDATE CASCADE ON DELETE RESTRICT,
  vendor_id INTEGER REFERENCES vendors(vendor_id)
            ON UPDATE CASCADE ON DELETE SET NULL
)
```

One row per chemical product (not per bottle). Unique by `name`; `chem_service.add_containers` upserts via `ON CONFLICT (name)`.

### 4.4.4 `containers` (physical bottles)

```sql
containers (
  container_id BIGSERIAL PK,
  item_id INTEGER NOT NULL REFERENCES items(item_id) ON UPDATE CASCADE ON DELETE CASCADE,
  barcode TEXT NOT NULL UNIQUE,
  container_code TEXT NOT NULL UNIQUE,
  room_id INTEGER REFERENCES rooms(room_id) ON UPDATE CASCADE ON DELETE SET NULL,
  entry_date DATE, manuf_date DATE, expiry_date DATE,
  area_class TEXT, storage_location TEXT, storage_sublocation TEXT, storage_device TEXT,
  system TEXT, lot_number TEXT, choice TEXT, nmr TEXT, nmr_expiry DATE,
  owner TEXT, notes TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  size TEXT, unit TEXT, legacy_inventory_no TEXT,
  added_by TEXT,                          -- v2
  created_at TIMESTAMPTZ DEFAULT NOW(),   -- v2
  label_printed BOOLEAN DEFAULT FALSE,    -- v2
  label_printed_at TIMESTAMPTZ            -- v2
)
-- indexes: idx_containers_item, idx_containers_room,
--          idx_containers_status, idx_containers_label_printed
```

The central table. `status` drives soft-delete (`'REMOVED'`). Note that `add_containers` inserts `barcode` and `container_code` with the **same** value (the sequence number).

> **Runtime-only columns not in committed SQL:** `chem_service` also reads/writes `containers.last_scan_at` (set on scan import; read by inventory search and coverage). This column is absent from both committed `.sql` files and must exist in the live DB. See the separate known-issues file.

### 4.4.5 Scan/audit tables

```sql
inventory_cycles (cycle_id SERIAL PK, started_at TIMESTAMPTZ DEFAULT now(),
                  ended_at TIMESTAMPTZ, created_by TEXT)

scan_raw (raw_id BIGSERIAL PK,
          cycle_id INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id) ON DELETE CASCADE,
          raw_code TEXT NOT NULL, import_ts TIMESTAMPTZ DEFAULT now(),
          matched_container_id BIGINT REFERENCES containers(container_id) ON DELETE SET NULL)

container_scans (scan_id BIGSERIAL PK,
                 cycle_id INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id) ON DELETE CASCADE,
                 container_id BIGINT NOT NULL REFERENCES containers(container_id) ON DELETE CASCADE,
                 scan_ts TIMESTAMPTZ DEFAULT now(), source TEXT,
                 status TEXT NOT NULL CHECK (status IN ('FOUND','NEW')),
                 UNIQUE (cycle_id, container_id))
```

> **Runtime-only objects not in committed SQL:** `chem_service.import_scans` inserts into `inventory_cycles` columns `filename, performed_by, report_name, location, total_scanned, matched_count, unmatched_count`, and into `scan_raw`/`container_scans` a `barcode` column. None of these are in the committed `.sql`. Likewise the `transactions` audit table (below) is created out-of-band. The live database has these; a fresh build from the committed files does not.

### 4.4.6 `transactions` (audit trail) — runtime-only

Not in the committed schema files, but written by `chem_service.log_transaction` and read by `get_transactions`. Inferred shape from the SQL:

```sql
transactions (
  transaction_id  <serial> PK,
  action          TEXT,        -- 'ADD' | 'MOVE' | 'BULK_MOVE' | 'EDIT' | 'REMOVE' | 'SCAN_UPLOAD'
  container_id    BIGINT,
  barcode         TEXT,
  item_id         INTEGER,
  room_id         INTEGER,
  details         JSON/JSONB,  -- json.dumps(details dict); queried via details::json->>'key'
  performed_by    TEXT,
  created_at      TIMESTAMP    -- set to NOW()
)
```

`details` is serialized with `json.dumps` and queried with `t.details::json->>'reason'` etc., so the column must be castable to `json` (TEXT or JSON/JSONB).

### 4.4.7 Views

Defined in `chem_schema.sql` (and refreshed in the v2 migration):

- **`inventory_view`** — denormalized container × item × vendor × room × category. Intended for list/search, though `chem_service.search_inventory` currently queries the base tables directly with its own joins.
- **`v_all_containers`** — a lighter denormalized container view.
- **`v_cycle_report`** — per-cycle FOUND/NEW/MISSING counts.

### 4.4.8 Foreign-key / cascade behavior

| Relationship | ON DELETE | Effect |
|--------------|-----------|--------|
| `items.category_id → categories` | RESTRICT | Can't delete a category with items. |
| `items.vendor_id → vendors` | SET NULL | Deleting a vendor nulls the item link; item survives. |
| `containers.item_id → items` | CASCADE | Deleting an item deletes its containers. |
| `containers.room_id → rooms` | SET NULL | Deleting a room nulls container location; container survives. |
| `scan_raw.cycle_id`, `container_scans.cycle_id → inventory_cycles` | CASCADE | Deleting a cycle deletes its scans. |
| `scan_raw.matched_container_id → containers` | SET NULL | Deleting a container nulls raw-scan matches. |
| `container_scans.container_id → containers` | CASCADE | Deleting a container deletes its matched scans. |

Note: the application uses **soft delete** (`status='REMOVED'`) rather than `DELETE`, so these cascades rarely fire in normal operation.

## 4.5 Entity-relationship summary (chem)

```
categories 1───N items 1───N containers N───1 rooms
                   │                  │
                   └──N───1 vendors   └──1───N container_scans N───1 inventory_cycles
                                                                          │
                                       scan_raw N──────────────────1 ────┘
   transactions  ── references container_id / item_id / room_id (loose, no enforced FK in runtime usage)
```

## 4.6 On-disk CSV data (not a database, but authoritative)

Several features persist to CSV under `LOG_DATA_DIR` (`LogData/`). These are documented fully in `09` §9.7; summary:

| Path | Written by | Content |
|------|-----------|---------|
| `LogData/particle_sensors/<room>_<sensor>_historical.csv` | `api.log_historical_particle_data` | Particle time series (append-only) |
| `LogData/env_sensors/<room>_<sensor>_historical.csv` | `api` env/sensor handlers | Temp/humidity time series |
| `LogData/sensors/<room>_<sensor>_combined.csv` | (read by GET /sensor-data; **not currently written** — see known-issues) | Combined series |
| `LogData/Paralyne/temp/<session>/batch_NNNN.csv` | `api.handle_csv_batch` | In-flight Parylene batches |
| `LogData/Paralyne/analog/<ts>_SDSLOG_combined_<session>.csv` | `api.combine_csv_batches_final` | Finalized Parylene runs |
| `LogData/denton18/pumpdata/<ts>_DENTON18PUMPLOG.csv` | `api.denton18_pump` | Denton 18 vacuum log per run |
| `HSCDATA/small_<Machine>_DataCollection.csv` | `HSCDownloader.py` (pulls from CORES n8n on a schedule) — see `documentation/UNanofabTools/hscdownloader/` | Per-machine summary tables |
| `LogData/<MACHINE>/...` (raw machine logs) | per-machine transfer scripts on the tool's PC — see `documentation/UNanofabTools/filetransfer/` | Raw run-log files pushed via `pscp` over SSH |

Continue to 05-http-api-reference.md (reference path: 05-http-api-reference.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/05-http-api-reference.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 05 — HTTP API Reference

Complete reference for every route the server exposes. Routes are grouped by blueprint. For each: HTTP method(s), path, authentication, request inputs, response, status codes, and side effects.

## 5.1 Conventions

- **Auth** values: `Public` (no auth), `Login` (`@login_required`), `Admin` (`@login_required`+`@admin_required`), `Assign` (login + `can_assign` checked in-body), `Device` (no auth; intended for private-network devices).
- "Form" = `application/x-www-form-urlencoded` or `multipart/form-data`. "JSON" = `application/json` body. "Query" = URL query string.
- Blueprints with a URL prefix are noted; otherwise routes are at the site root.
- Unless stated, HTML routes return `text/html`; API routes return `application/json`.

## 5.2 Auth blueprint — `app/blueprints/auth.py` (no prefix)

### `GET|POST /login` — Public
- **GET**: renders `login.html`.
- **POST form**: `username`, `password`.
- **Behavior**: `sanitize_input` both fields → `verify_user_credentials`. If valid and `DEBUG_MODE`, create session + `login_user` + redirect `tasks.index`. If valid and not debug, run `duo_authenticate(user.unid)`; on `allow`, proceed; else flash `'2FA authentication failed'` and redirect to login. Invalid creds flash `'Invalid credentials'`.
- **Responses**: 302 redirect to `/tasks` on success; 302 back to `/login` on failure (with flash).

### `GET|POST /signup` — Public
- **GET**: renders `signup.html`.
- **POST form**: `username`, `password`, `unid`.
- **Behavior**: reject if username exists. If `DEBUG_MODE`, create user immediately; else `duo_authenticate(unid)` first. On success flash `'User created successfully'` and redirect to `/login`.
- **Responses**: 302 to `/login` (success) or `/signup` (failure).

### `GET /logout` — Login
- **Behavior**: `logout_user()`, flash, redirect to `/login`.
- **Responses**: 302 to `/login`.

### `GET|POST /resetpassword` — Public
- **GET**: renders `resetpassword.html`.
- **POST form**: `username`, `unid`, `password` (new).
- **Behavior**: `verify_user_unid(username, unid)`; if matched, `update_user_password`. Flash success/failure.
- **Responses**: 302 to `/login` (success) or `/resetpassword` (failure).
- **Note**: no Duo step; the uNID is the only secret.

## 5.3 Tasks blueprint — `app/blueprints/tasks.py` (no prefix)

### `GET /tasks` — Login
- **Behavior**: fetches `get_user_tasks(current_user.username)`, `get_unfinished_tasks()`, `get_all_tasks()`, and `can_user_assign(...)`; renders `tasks.html`.
- **Response**: 200 HTML.

### `GET|POST /createtasks` — Assign
- **Guard**: if `not can_user_assign(...)`, flash + redirect to `/tasks`.
- **GET**: renders `createTask.html`.
- **POST form**: `title`, `description`, `dueDate` (`YYYY-MM-DD`, optional), `priority`, `assignees` (multi-valued via `getlist`).
- **Behavior**: parse due date (flash on bad format), `task_service.create_task(...)`. Flash success/failure.
- **Responses**: 302 to `/tasks` (success) or `/createtasks` (failure).

### `POST /changestatus` — Login
- **JSON body**: `{ "taskId": <id> }`.
- **Behavior**: `update_task_status(task_id)` → defaults status to `'Completed'`.
- **Responses**: `200 {"status":"success"}` or `400 {"status":"error"}`.
- **Note**: no ownership check; any logged-in user may complete any task.

### `POST /claimTask` — Login
- **JSON body**: `{ "taskId": <id> }`.
- **Behavior**: `claim_task(task_id, current_user.username)` adds the user as an assignee unless already present.
- **Responses**: `200 {"status":"success","message":"Task claimed"}` or `400 {"status":"error","message":"Task already claimed or error occurred"}`.

### `POST /uploadtaskfile` — Login
- **Form (multipart)**: `task_id`, `file`.
- **Behavior**: validates presence + extension; `upload_task_file` saves with `secure_filename` + timestamp suffix and records the path.
- **Responses**: `200` success; `400` on missing/invalid file.

### `GET /users` — Login
- **Behavior**: opens `instance/signininfo.db` (or `./signininfo.db`) directly via `sqlite3`; returns sorted usernames.
- **Responses**: `200 ["alice","bob",...]`; `500 []` on error.

## 5.4 Admin blueprint — `app/blueprints/admin.py` (no prefix)

All routes are `Admin` (decorated `@login_required` + `@admin_required`). The guard redirects non-admins to `/tasks` with a flash.

### `GET /adminpanel` — Admin
- Renders `adminpanel.html` with `get_all_users()`.

### `POST /deleteUser` — Admin
- **JSON body**: `{ "uNID": "<unid>" }`. → `admin_service.delete_user`.
- **Responses**: `200 {"status":"success"}` or `400 {"status":"error"}`.

### `POST /toggleAdminStatus` — Admin
- **JSON body**: `{ "uNID": "<unid>" }`. → `toggle_admin_status`.
- **Responses**: `200`/`400` as above.

### `POST /toggleAssign` — Admin
- **JSON body**: `{ "uNID": "<unid>" }`. → `toggle_assign_privilege`.
- **Responses**: `200`/`400` as above.

## 5.5 Machines blueprint — `app/blueprints/machines.py` (no prefix)

All routes are `Login`. Three categories: index pages, per-machine pages, and file/graph utilities.

### Index pages
| Route | Renders |
|-------|---------|
| `GET /` | `index.html` (site root) |
| `GET /machines` | `machines.html` |
| `GET /logfiles` | `logFileIndex.html` |

### Per-machine data pages
Each calls `render_machine_data(machine, graph_columns)` (CSV table + optional graphs) or `render_log_files(machine, datatype)` (file listing).

| Route | Handler call |
|-------|--------------|
| `GET /ald` | `render_machine_data('ALD', [['Chuck Temperature (C)','Precursor Temperature (C)']])` |
| `GET /ebeam` | `render_machine_data('Ebeam', ['Base Pressure','Temperature 1','Temperature 2'])` |
| `GET /mocvd` | `render_machine_data('MOCVD', [])` |
| `GET /parylene` | `render_log_files('Paralyne', 'uploads')` |
| `GET /pecvd` | `render_machine_data('PECVD', [])` |
| `GET /denton635` | `render_log_files('Denton635', 'uploads')` |
| `GET /denton18` | `render_machine_data('Denton18', [])` |
| `GET /drie` | `render_machine_data('DRIE', [])` |
| `GET /isotropic` | `render_machine_data('Isotropic', [])` |
| `GET /plasmalab` | `render_machine_data('Plasmalab', [])` |
| `GET /plasmatherm` | `render_machine_data('PlasmaTherm', [])` |
| `GET /technics` | `render_machine_data('Technics', [])` |
| `GET /cleanox` | `render_machine_data('CleanOx', [])` |
| `GET /dopedox` | `render_machine_data('DopedOx', [])` |
| `GET /lto` | `render_machine_data('LTO', [])` |
| `GET /nitride` | `render_machine_data('Nitride', [])` |
| `GET /poly` | `render_machine_data('Poly', [])` |
| `GET /allwin` | `render_machine_data('Allwin', [])` |

`render_machine_data` reads `HSCDATA/small_<machine>_DataCollection.csv`, builds an HTML table (`data_service.csv_to_html_table`) and Chart.js datasets (`data_service.prepare_graph_data`), and renders `machine_data.html`. Missing CSV → `csv_to_html_table` raises; surfaces as a 500.

### Log-file listing pages
| Route | Handler call |
|-------|--------------|
| `GET /aldlog/rfdata` | `render_log_files('ALD','RF')` |
| `GET /aldlog/pressuredata` | `render_log_files('ALD','Pressure')` |
| `GET /paralyneuploads` | `render_log_files('Paralyne','uploads')` |

`render_log_files` lists `LogData/<machine>/<datatype>/`, sorts via `data_service.sort_files_by_time` with a per-machine `date_format`, renders `log_files.html`.

### `GET /download/<path:filepath>` — Login
- **Behavior**: `unquote` the path; canonicalize with `os.path.realpath`; support a legacy `Desktop/Logs/` prefix by re-rooting under `LOG_DATA_DIR`; then enforce `actual_path.startswith(log_dir + os.sep)`.
- **Responses**: `200` file (as attachment) if it exists; `403 {"error":"Access denied"}` if outside `LOG_DATA_DIR`; `404 {"error":"File not found"}` if missing.

### `GET /graph/<path:filepath>` — Login
- **Behavior**: same path-safety check; chooses graph columns based on URL parts (`ALD/RF` → For/Refl Pwr; `ALD/Pressure` → Pressure; `Paralyne/analog` → Vacuum pressure); `data_service.prepare_graph_data`; renders `graph.html` with JSON.
- **Responses**: `200` HTML; `403` access denied; `400 {"error":...}` on processing error.

### `POST /submitALDData` — Login
- **Form**: `material`, `depmode`, `temp`.
- **Behavior**: `data_service.calculate_ald_deposition_rate` (pandas filter; rate = thickness/cycles). Renders `ald_graph.html` with a Chart.js dataset.
- **Responses**: `200` HTML if data found; `404 {"error":"Data not found"}` otherwise.

## 5.6 API blueprint — `app/blueprints/api.py` (no prefix)

All routes are `Device` (no auth). Intended for private-network devices and desktop tools.

### `POST /sdsanalog` — Device
- **Headers**: `Content-Type: text/csv`; `X-Session-ID`, `X-Batch-Number`, `X-Total-Batches` (all required); `X-Is-Final-Batch` (optional, `"true"`).
- **Body**: raw CSV text (one batch).
- **Behavior**: writes the batch to `LogData/Paralyne/temp/<session>/batch_NNNN.csv`; writes `start_time.txt` on first batch; when received-count == total or final flag, calls `combine_csv_batches_final(session, cleanup=False)`.
- **Responses**: `200 {"status":"success","message":"Batch n/m received","session_id":...}`; `400` missing headers / wrong content-type; `500` on error.

### `POST /sdsanalogfinished` — Device
- **Input**: `session_id` from JSON body or `X-Session-ID` header.
- **Behavior**: `combine_csv_batches_final(session)` (cleanup=True default) → writes `LogData/Paralyne/analog/<ts>_SDSLOG_combined_<session>.csv`, removes temp dir.
- **Responses**: `200 {"status":"session_finalized",...}`; `500` on error.

### `POST /denton18pump` — Device
- **JSON body**: `{ "pressure": <raw ADC int> }`.
- **Behavior**: if `LogData/denton18/pumpdata/current_run.txt` exists, append to the referenced CSV; else create `<ts>_DENTON18PUMPLOG.csv` (+ header) and record its path. Converts pressure: `raw/65535*3.3*3.0/0.009`. Appends `[timestamp, pressure]`.
- **Responses**: `200 {"status":"success"}`; `500` on error.

### `POST /denton18pumpfinished` — Device
- **Behavior**: deletes `current_run.txt`.
- **Responses**: `200 {"status":"file closed"}`; `400 {"status":"no file to close"}`.

### `GET /api/paralyne/analog/list` — Device
- **Behavior**: lists `*.csv` in `LogData/Paralyne/analog/` with `filename`, `size`, `modified` (ISO), `download_url`; sorted newest-first.
- **Responses**: `200 {"status":"success","files":[...],"count":N}`; `404 {"error":"Directory not found"}`; `500`.

### `GET /api/paralyne/analog/download/<filename>` — Device
- **Behavior**: rejects names containing `..`, `/`, `\`; requires `.csv`; serves from the analog dir as attachment.
- **Responses**: `200` file; `400 {"error":"Invalid filename"}`; `404 {"error":"File not found"}`; `500`.

### `POST /particle-data` — Device
- **JSON body** (required keys): `room_name`, `sensor_number`, `timestamp` (Unix number or ISO string). Optional nested: `raw_measurements`, `converted_values.{number_concentrations_ft3, differential_bins_ft3, mass_concentrations_ug_m3}`.
- **Behavior**: append a row to `LogData/particle_sensors/<id>_historical.csv`; upsert the `(room,sensor)` row in `particle_sensor_data` (unique constraint).
- **Responses**: `200 {"status":"success","message":...,"sensor_id":...,"timestamp":...}`; `400` non-JSON / missing field; `500` on error (rolls back DB).

### `GET /particle-data` — Device
- **Query**: optional `room_name`, `sensor_number`.
- **Behavior**: if **both** provided → returns historical CSV data (`get_historical_csv_data`). Otherwise returns current DB rows, optionally filtered by either param.
- **Responses (current)**: `200 {"status":"success","count":N,"sensors":[to_dict...]}`.
- **Responses (historical)**: `200 {"status":"success","room_name":...,"sensor_number":...,"data_source":"historical_csv","record_count":N,"historical_data":[...]}`; `404` if no CSV; `500`.

### `POST /sensor-data` — Device
- **JSON body** (`get_json(force=True)`): `room_name`, `sensor_number` (required); optional `timestamp`, `temperature_c`, `humidity_pct`, `raw_measurements`, `converted_values`.
- **Behavior**: if `raw` present → `log_historical_particle_data` (→ `particle_sensors/`) and upsert `particle_sensor_data` (incl. temp/humidity). If temp+humidity present → append `LogData/env_sensors/<id>_historical.csv`.
- **Responses**: `200 {"status":"success"}`; `400` no body / missing room/sensor; `500` (rolls back).
- **Note**: does **not** write to `LogData/sensors/` — see GET below.

### `GET /sensor-data` — Device
- **Query**: `room_name`, `sensor_number` (both required).
- **Behavior**: reads `LogData/sensors/<room>_<sensor>_combined.csv` via `_sensor_csv_path`.
- **Responses**: `200 {"status":"success",...,"count":N,"data":[...]}`; `400` missing params; `404` if file absent; `500`.
- **Known issue**: the POST never writes that file, so this returns 404 in practice. See the separate known-issues file.

### `POST /env-data` — Device
- **JSON body** (all required): `room_name`, `sensor_number`, `timestamp`, `temperature_c`, `humidity_pct`.
- **Behavior**: appends `LogData/env_sensors/<id>_historical.csv` (header on first write).
- **Responses**: `200 {"status":"success",...}`; `400` non-JSON / missing field; `500`.

### `GET /env-data` — Device
- **Query**: `room_name`, `sensor_number` (both required).
- **Behavior**: reads `LogData/env_sensors/<id>_historical.csv`; coerces `temperature_c`, `humidity_pct`, `timestamp` to float.
- **Responses**: `200 {"status":"success",...,"record_count":N,"data":[...]}`; `400` missing params; `404` no file; `500`.

## 5.7 Chemical inventory blueprint — `app/blueprints/chem_inventory.py` (prefix `/chem`)

All routes are effectively **Public** — `login_required` is imported but never applied. (Security implication noted in `07` and the known-issues file.)

### `GET /chem/` and `GET /chem/inventory` — Public
- **Query**: `q` (search), `limit` (default 500), `show_removed` (`"1"` to include removed).
- **Behavior**: `search_inventory(q, limit, show_removed)`; renders `chem/inventory.html`.

### `GET /chem/inventory/print` — Public
- **Query**: `q`, `limit` (default 5000). Renders `chem/inventory_print.html`.

### `GET /chem/inventory/export.csv` — Public
- **Query**: `q`, `limit` (default 500000).
- **Behavior**: `export_inventory_csv` (includes removed). Returns `text/csv` with `Content-Disposition: attachment; filename=cheminventory_export.csv`.

### `GET|POST /chem/add` — Public
- **GET**: renders `chem/add.html`.
- **POST form** (selected): `name` (required), `vendor`, `catalog`, `state`, `size`, `unit`, `system`, `lot_number`, `qty` (clamped 1–500), location fields (`area_class`, `room_no`, `room_name`, `room_desc`, `storage_location`, `storage_sublocation`, `storage_device`), dates (`entry`, `manuf_date`, `expire`), `choice`, `nmr`, `nmr_exp`, `owner`, `added_by`, `notes`.
- **Behavior**: `add_containers(data)` (atomic upsert of vendor/category/room/item + N containers + transactions). Redirects to barcode queue with `preselect` of new barcodes.
- **Responses**: 302 to `/chem/barcodes/queue?preselect=...` on success; 302 back to `/chem/add` on error or missing name.

### `GET /chem/report` — Public
- **Behavior**: runs ten aggregations (`report_totals/expiring/expired/nmr_due/by_room/by_vendor/by_system/by_owner`, `get_scan_reports`, `get_inventory_scan_coverage`) plus scanned/unscanned tallies; renders `chem/report.html`.

### `GET|POST /chem/upload-scans` — Public
- **GET**: renders `chem/upload_scans.html`.
- **POST form**: `user`, `report_name`, `location`, `barcode_text` (newline list), optional file `file` (`.txt`). De-dupes preserving order.
- **Behavior**: `import_scans(...)` creates a cycle, inserts `scan_raw` per code, `container_scans` + `last_scan_at` for matches, updates cycle counts, logs a `SCAN_UPLOAD` transaction.
- **Responses**: 302 to `/chem/report` (success) or `/chem/upload-scans` (no barcodes).

### `GET /chem/barcodes/queue` — Public
- **Query**: `q`, `only_unprinted` (default `"1"`), `limit` (default 500), `preselect` (CSV of barcodes). `get_barcode_queue`; renders `chem/barcode_queue.html`.

### `GET /chem/barcodes/print` — Public
- **Query**: `q`, `copies` (≥1). `get_barcode_labels`; paginates 30/page; renders `chem/barcode_print.html`.

### `POST /chem/barcodes/mark-printed` — Public
- **Form**: `barcode` (multi). `mark_barcodes_printed`; flash; 302 to queue.

### `POST /chem/barcodes/print-selected` — Public
- **Form**: `barcode` (multi). 302 to `/chem/barcodes/print?barcodes=<csv>`.

### `GET|POST /chem/remove` — Public
- **GET**: renders `chem/remove.html`.
- **POST form**: `barcode` (one or many; comma/newline/tab separated), `performed_by`, `reason`, `notes`.
- **Behavior**: `remove_containers_by_barcodes` → soft-delete (`status='REMOVED'`), appends a removal note, logs `REMOVE`. Flashes counts + not-found.
- **Responses**: 302 to `/chem/remove`.

### `GET|POST /chem/move` — Public
- **GET**: renders `chem/move.html`.
- **POST form**: `barcode` (required), `room_no`, `room_desc`, `area_class`, `storage_location`, `storage_sublocation`, `storage_device`; actor = `current_user.username` if authenticated else `performed_by`.
- **Behavior**: `move_container(...)` (resolve room, COALESCE-update location, log `MOVE`).
- **Responses**: 302 to `/chem/inventory?q=<barcode>` (success) or `/chem/move` (error).

### `POST /chem/move-bulk` — Public
- **Form**: `bulk_barcodes` (many), destination fields, `performed_by`.
- **Behavior**: `bulk_move_by_barcodes(...)` (one resolved room, per-barcode COALESCE update, log `BULK_MOVE`). Flashes moved/requested + unmatched.
- **Responses**: 302 to `/chem/move`.

### `GET /chem/edit` — Public
- Renders `chem/edit.html` (lookup form; populated client-side via `/chem/api/container_lookup`).

### `POST /chem/edit-container` — Public
- **Form**: `container_id` (required int) plus editable fields (`item_name`, `description`, `catalog_number`, `physical_state`, `size`, `unit`, `system`, `vendor_name`, room fields, storage fields, dates, `lot_number`, `choice`, `nmr`, `nmr_expiry`, `owner`, `notes`, `added_by`).
- **Behavior**: `update_container(container_id, data)` (rename item if provided, resolve room, keep-or-update each field, log `EDIT`).
- **Responses**: 302 to `/chem/edit`; flashes errors for missing/invalid `container_id`.

### `GET /chem/transactions` — Public
- **Query**: `q`. `get_transactions(q, limit=1000)`; renders `chem/transactions.html`.

### `GET /chem/api/inventory_json` — Public
- **Query**: `q`, `limit` (default 500). Returns `{"rows":[...]}`.

### `GET /chem/api/suggest` — Public
- **Query**: `field`, `q`, `limit` (default 10). Returns `{"results":[...]}`.
- **Note**: `suggest` is a **stub** returning `[]`; this endpoint always responds with an empty list. (Known issue.)

### `GET /chem/api/autofill` — Public
- **Query**: `catalog`, `name`. Returns `{"data":{...}}`.
- **Note**: `autofill` is a **stub** returning `{}`; this endpoint always responds with an empty object. (Known issue.)

### `GET /chem/api/container_lookup` — Public
- **Query**: `barcode`.
- **Behavior**: inline SQL join over containers/items/vendors/rooms. Returns `{"data": {...} | null}`.

## 5.8 Particle demo blueprint — `app/blueprints/particle_demo_will.py` (prefix `/particle-demo`)

### `GET /particle-demo/` — Public
- Serves `app/templates/particle-demoWill/UtahNanofabParticleCounterDemo.html`; `404` if missing.

### `GET /particle-demo/<path:filename>` — Public
- Serves an asset from the demo dir; rejects `..` or leading `/` with `400`; `404` if missing.

## 5.9 Inline routes — `app/__init__.py`

| Route | Auth | Behavior |
|-------|------|----------|
| `GET /js/<path:filename>` | Public | `send_static_file('js/<filename>')` |
| `GET /css/<path:filename>` | Public | `send_static_file('css/<filename>')` |
| `GET /favicon.ico` | Public | serves repo-root `favicon.ico` or `404` |

## 5.10 Route count

79 registered live routes: auth 4, tasks 6, admin 4, machines 27, api 12, chem 21, particle-demo 2, inline 3. `app/blueprints/chem_inventory_remote.py` defines duplicate `/chem/*` routes but is not imported or registered, so it is excluded.

Continue to 06-service-layer-reference.md (reference path: 06-service-layer-reference.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/06-service-layer-reference.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 06 — Service Layer Reference

The `app/services/` package contains the business logic and persistence. Blueprints call these functions; the functions own the database/file access. This document lists every public function with its signature, parameters, return value, behavior, and error handling.

General conventions across services:
- Most functions wrap their work in `try/except` and return a sentinel (`None`, `False`, `[]`) on error, logging via `current_app.logger` or `print`.
- `auth_service`/`admin_service` use the Flask-SQLAlchemy ORM. `task_service` uses raw `sqlite3`. `chem_service` uses SQLAlchemy Core. `data_service` uses `csv`/`pandas`.

---

## 6.1 `auth_service.py`

Imports: `bcrypt`, `uuid`, `asyncio`, `duo_client`, `current_app`, `datetime/timedelta`, and `db, User, Session` from models.

### `hash_password(password) -> bytes`
bcrypt-hashes `password` (`bcrypt.hashpw(password.encode(), bcrypt.gensalt())`). Returns the hash bytes.

### `verify_password(password, password_hash) -> bool`
`bcrypt.checkpw(password.encode(), password_hash)`. Returns match boolean.

### `create_user(username, password, unid) -> User | None`
Hashes the password, constructs `User`, commits. Returns the `User` on success; on exception rolls back, logs, returns `None`.

### `verify_user_credentials(username, password) -> User | None`
Looks up by `username`; if found and password verifies, returns the `User`; else `None`. (Skips bcrypt when the user doesn't exist — minor timing oracle.)

### `verify_user_unid(username, unid) -> bool`
Returns whether a row exists matching both `username` and `unid`. Used by password reset.

### `update_user_password(username, new_password) -> bool`
Re-hashes and saves a new password for `username`. Returns `True`/`False`; rolls back and logs on error.

### `create_user_session(username) -> str`
Generates a UUID4, inserts a `Session` row, commits, returns the `session_id` string.

### `get_user_from_session(session_id) -> str | None`
Returns the `username` for a session row, or `None`.

### `delete_old_sessions(minutes=120) -> None`
Deletes `Session` rows older than `minutes`. **Not auto-scheduled**; call from a cron/admin task.

### `is_user_admin(username) -> bool`
Returns the user's `is_admin` flag, or `False` if not found.

### `can_user_assign(username) -> bool`
Returns the user's `can_assign` flag, or `False` if not found.

### `async duo_authenticate(unid) -> bool`
Builds `duo_client.Auth(ikey, skey, host)` from config; calls `auth_api.auth(username=unid, factor='push', device='auto')` via `asyncio.to_thread` (the duo_client call is blocking). Returns `response['result'] == 'allow'`. On exception logs and returns `False`. Invoked from blueprints with `asyncio.run(...)`.

### `sanitize_input(input_str, max_length=255) -> str`
`.strip()` → truncate to `max_length` → `html.escape(...)`. Defense-in-depth for XSS; not SQL-injection defense (parameterized queries handle that).

---

## 6.2 `admin_service.py`

Imports `current_app`, `db, User`.

### `get_all_users() -> list[User]`
`User.query.all()`.

### `delete_user(unid) -> bool`
Finds by `unid`, deletes, commits. `True`/`False`; rollback+log on error.

### `toggle_admin_status(unid) -> bool`
Flips `is_admin` for the user; commits. `True`/`False`.

### `toggle_assign_privilege(unid) -> bool`
Flips `can_assign`; commits. `True`/`False`.

---

## 6.3 `task_service.py`

Uses raw `sqlite3` (not the ORM). Imports `os`, `sqlite3`, `datetime`, `current_app`, `werkzeug.utils.secure_filename`.

### `_get_db_path(db_name='tasks.db') -> str`
Returns `instance/<db_name>` if `instance/` exists, else `<db_name>`. Private helper.

### `create_task(title, description, due_date, priority, assigner, assignees) -> int | None`
Inserts a `tasks` row (status `'Pending'`, `task_assign_date = now`), then one `assignees` row per name. Returns `lastrowid` (new task id) or `None` on error. `due_date` is a `datetime` or `None` (formatted `%Y-%m-%d`). Uses parameterized SQL.

### `get_user_tasks(username) -> list[tuple]`
Tasks where `task_assigner == username` OR the user is an assignee. SQL uses `LEFT JOIN assignees` + `GROUP_CONCAT(assignee_name)` grouped by `task_id`. Each returned tuple is the task columns + concatenated assignees + a trailing tuple of file rows (from a per-task `task_files` query). `[]` on error.

### `get_all_tasks() -> list[tuple]`
As above without the WHERE filter.

### `get_unfinished_tasks() -> list[tuple]`
As above with `WHERE task_status != 'Completed'`.

### `get_task_by_id(task_id) -> tuple | None`
Single task by id (with concatenated assignees). `None` if missing/error.

### `update_task_status(task_id, status='Completed') -> bool`
`UPDATE tasks SET task_status=? WHERE task_id=?`. `True`/`False`.

### `claim_task(task_id, username) -> bool`
Inserts an `assignees` row unless the user is already assigned (returns `False` in that case). `True` on insert.

### `upload_task_file(task_id, file) -> bool`
If `allowed_file(file.filename)`: `secure_filename` + timestamp suffix, save under `UPLOAD_FOLDER` (created if missing), insert a `task_files` row. `True`/`False`.

### `allowed_file(filename) -> bool`
Extension allow-list `{txt,pdf,png,jpg,jpeg,gif,doc,docx,xls,xlsx,csv}` (hardcoded; note it differs from `config.ALLOWED_EXTENSIONS`).

### `get_task_files(task_id) -> list[tuple]`
`SELECT file_path FROM task_files WHERE task_id=?`. `[]` on error.

---

## 6.4 `data_service.py`

CSV/pandas processing for the machines blueprint. Imports `csv`, `os`, `re`, `random`, `pandas`, `datetime`, `current_app`.

### `csv_to_html_table(csv_file) -> str`
Reads a CSV and returns an HTML `<table id='sortableTable'>`. **Does not HTML-escape cell values** (trusted-input assumption).

### `prepare_graph_data(file_path, y_axes) -> dict`
Dispatches by extension: `.csv` → `graph_csv`, `.txt` → `graph_txt`; raises `ValueError` for others. `y_axes` is a list of column names.

### `graph_csv(csv_file, y_axes) -> dict`
`csv.DictReader`; x-axis = first column; one y-series per `y_axes` entry; non-numeric → `0` (logged warning). Returns `create_graph_data(...)`.

### `graph_txt(txt_file, y_axes) -> dict`
Tab-delimited equivalent of `graph_csv`.

### `create_graph_data(labels, data, y_axes) -> dict`
Builds the Chart.js structure `{labels, datasets:[{label, data, borderColor, backgroundColor}]}` with random RGBA colors per series. `{}` on error.

### `sort_files_by_time(files, date_format) -> list[str]`
Parses a run number (`Event_Log_Run#(\d+)`) and a timestamp per `date_format` (0: `%m_%d_%Y_%I-%M %p`; 1: `%Y%m%d%H%M%S`; 2: embedded `.dat <date>`), sorts newest/highest-run first. `[]` on `ValueError`.

### `get_machine_data(machine) -> DataFrame | None`
Reads `HSCDATA/small_<machine>_DataCollection.csv` into pandas. `None` if file missing.

### `calculate_ald_deposition_rate(material, depmode, chuck_temp) -> list[float] | None`
Loads ALD CSV, filters by `Film Deposited == material`, `Deposition Mode == depmode`, `Chuck Temperature (C) == int(chuck_temp)`; computes `Measured Thickness (nm) / Number of Cycles` (NaN→0); returns the list, or `None` if no data.

---

## 6.5 `chem_service.py`

PostgreSQL access via SQLAlchemy Core. The module exposes `get_chem_engine()` and the `ChemInventoryService` class.

### `get_chem_engine() -> Engine`
Lazily builds and caches a module-global engine. Prefers `current_app.config['CHEM_*']`; falls back (outside app context) to env vars. URL: `postgresql+psycopg2://user:pwd@host:port/db`. Engine options: `pool_pre_ping=True, pool_size=5, max_overflow=10, future=True`.

### `ChemInventoryService.__init__(self)`
Sets `self.engine = get_chem_engine()`.

### Helpers

- **`_upsert(self, conn, table, key_col, value, id_col=None) -> id | None`** — return existing id for `value` in `table.key_col`, else INSERT and return new id; `None` for blank value. `id_col` inferred from a table→PK map.
- **`_next_barcode(self, conn) -> str`** — `nextval('seq_barcode')` as string.
- **`_resolve_room(self, conn, room_no, room_desc, area_class, room_name=None)`** — thin wrapper over `resolve_room_id` (passes `room_desc or room_name`).
- **`resolve_room_id(self, conn, room_no=None, room_desc=None, area_class=None) -> id | None`** — layered room resolution: match by `room_no` (and backfill desc/area via COALESCE-update); else by `room_desc`; else by `room_name`; else upsert by `room_no` (`ON CONFLICT (room_no)`); else create a room without `room_no`. Returns a `room_id` or `None` if all inputs blank.

> Note: `resolve_room_id` and `_resolve_room` contain `print(...)` debug statements (e.g. "USING resolve_room_id"). These write to stdout/logs on every call.

### Read operations

- **`search_inventory(self, query="", limit=500, show_removed=False) -> list[Mapping]`** — joined SELECT over containers/items/vendors/rooms. Excludes `status='REMOVED'` unless `show_removed`. When `query` set, `ILIKE` across name, catalog, vendor, barcode, lot, owner, system, storage_*, room_no/name, notes. Ordered by item name then barcode. Returns dict-like rows. **References `c.last_scan_at`** (must exist in DB).
- **`export_inventory_csv(self, query="", limit=500000) -> str`** — `search_inventory(show_removed=True)` → CSV string via `csv.DictWriter`. `"No data"` if empty.
- **`get_barcode_queue(self, query="", only_unprinted="1", limit=500) -> list[Mapping]`** — containers joined to items/rooms; filter `label_printed=FALSE` when `only_unprinted=="1"`; optional `ILIKE`. Newest first.
- **`get_barcode_labels(self, query="", copies=1, limit=1000) -> list[dict]`** — label rows `{item_name, lot_number, barcode_number}`, repeated `copies` times each.
- **`get_transactions(self, q="", limit=500) -> list[Mapping]`** — joins `transactions` to containers/items/rooms; extracts `reason`/`notes` from the JSON `details` (`details::json->>'...'`); optional `ILIKE`; newest first.
- **`get_scan_reports(self, limit=200) -> list[Mapping]`** — recent `inventory_cycles` with COALESCE'd report fields and counts.
- **`get_inventory_scan_coverage(self, limit=5000) -> list[Mapping]`** — active containers with `scan_status` = `'SCANNED'`/`'UNSCANNED'` based on `last_scan_at`; unscanned first.
- **Report rollups** (each returns `list[Mapping]` of active containers unless noted):
  - `report_totals()` → single row: `total_containers`, `unique_materials`, `expiring_30`, `expired`.
  - `report_expiring()` → expiry within 30 days (future).
  - `report_expired()` → expiry before today.
  - `report_nmr_due()` → `nmr_expiry` within 30 days.
  - `report_by_room()` / `report_by_vendor()` / `report_by_system()` / `report_by_owner()` → grouped counts.

### Write operations (each opens its own `engine.begin()` transaction)

- **`add_containers(self, data) -> list[str]`** — ensures `categories('Chemicals')`, upserts vendor/room/item (`ON CONFLICT (name)`), then loops `data['qty']` times: next barcode → INSERT container (barcode == container_code) → `log_transaction('ADD')`. Returns the new barcodes.
- **`import_scans(self, barcodes, filename=None, performed_by=None, report_name=None, location=None) -> dict`** — INSERT `inventory_cycles` (with extended columns); per cleaned barcode INSERT `scan_raw`; if matched, INSERT `container_scans('FOUND','UPLOAD')` and `UPDATE containers.last_scan_at=NOW()`. Updates cycle `matched_count`/`unmatched_count`; logs `SCAN_UPLOAD`. Returns `{cycle_id, total, matched, unmatched}`.
- **`remove_container(self, barcode, removed_by=None, reason=None, notes=None) -> bool`** — soft-delete: set `status='REMOVED'`, append a removal note to `notes`, log `REMOVE`. `False` if barcode not found / already removed.
- **`remove_containers_by_barcodes(self, raw_barcodes, removed_by=None, reason=None, notes=None) -> dict`** — parses many barcodes (comma/tab/newline, de-duped), calls `remove_container` per barcode. Returns `{requested_count, removed_count, removed, not_found}`.
- **`move_container(self, barcode, room_no, room_desc, area_class, storage_location, storage_sublocation, storage_device, moved_by=None) -> bool`** — resolve room; COALESCE-update room/area/storage; log `MOVE` with from/to detail. `False` if not found.
- **`bulk_move_by_barcodes(self, raw_barcodes, room_no=None, ..., performed_by=None) -> dict`** — parse many barcodes; resolve one destination room; per barcode COALESCE-update + log `BULK_MOVE`. Returns `{requested_count, matched_count, moved_count, unmatched}`. Returns zeros if no barcodes or no destination provided. Contains `print(...)` debug output.
- **`update_container(self, container_id, data) -> None`** — rename item (if a name provided), resolve room, "keep-or-update" each field (blank input keeps existing value), UPDATE container, log `EDIT`. Raises `ValueError` if the container id is not found.
- **`mark_barcodes_printed(self, barcodes) -> int`** — `UPDATE containers SET label_printed=TRUE, label_printed_at=NOW() WHERE barcode = ANY(:bcs)`. Returns affected row count.
- **`log_transaction(self, conn, action, container_id=None, barcode=None, item_id=None, room_id=None, details=None, performed_by=None) -> None`** — INSERT into `transactions` with `details = json.dumps(details or {})` and `created_at = NOW()`. Must be called within an existing transaction (`conn`).

### Stubs (not implemented)

- **`suggest(self, field, q, limit=10) -> list`** — returns `[]` (stub). The `/chem/api/suggest` endpoint therefore always returns an empty list.
- **`autofill(self, catalog="", name="") -> dict`** — returns `{}` (stub). The `/chem/api/autofill` endpoint therefore always returns an empty object.

> Also note: `get_reports(self)` exists in the module but is **not** used by the live `/chem/report` route, which calls the individual `report_*` methods instead.

Continue to 07-authentication-and-authorization.md (reference path: 07-authentication-and-authorization.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 07 — Authentication & Authorization

This document describes how identity and permissions work: the login/signup/reset flows, Duo 2FA, the dual session model, Flask-Login integration, the permission model, and the decorators. It is a behavioral spec; for function signatures see `06`, for routes see `05`.

## 7.1 Identity model

A user is a row in `signininfo` (`User` model) with:

- `username` — login identifier (unique).
- `password_hash` — bcrypt hash (column `passwordHash`).
- `unid` — University ID (unique); doubles as the Duo username and the password-reset secret.
- `is_admin`, `can_assign` — the two permission flags.

There is no role table and no per-resource ACL; authorization is entirely these two booleans plus "is authenticated."

## 7.2 Password handling

- Hashing: `bcrypt.hashpw(password.encode(), bcrypt.gensalt())` (default cost ≈ 12). Plaintext is never stored.
- Verification: `bcrypt.checkpw(...)`.
- All credential input is run through `auth_service.sanitize_input` (strip, truncate to 255, `html.escape`) before use.

## 7.3 Login flow (`POST /login`)

```
sanitize(username,password)
   └─ verify_user_credentials(username,password)   # username lookup + bcrypt
        ├─ None  → flash 'Invalid credentials' → redirect /login
        └─ User  → if DEBUG_MODE:
                       create_user_session → flask_session['session_id'] → login_user → redirect /tasks
                   else:
                       asyncio.run(duo_authenticate(user.unid))
                          ├─ True  → create_user_session → login_user → redirect /tasks
                          └─ False → flash '2FA authentication failed' → redirect /login
```

Two side effects on success: a `Session` row is created (server-side) and Flask-Login sets its signed cookie (client-side). See §7.4.

## 7.4 The dual session model

There are **two** independent session mechanisms in play:

1. **Flask-Login's signed cookie.** `login_user(user)` stores the user's `id` in Flask's session cookie (signed with `SECRET_KEY`). On each request, `@login_manager.user_loader` (`load_user`) reloads the `User` via `User.query.get(int(user_id))`, populating `current_user`. This is what `@login_required` and `current_user` rely on.

2. **The server-side `sessioninfo` table.** `create_user_session(username)` writes a UUID row, and the UUID is also stored in `flask_session['session_id']`. This provides an auditable server-side record and supports `delete_old_sessions`.

In the current code, **authorization decisions use mechanism #1** (Flask-Login). Mechanism #2 is recorded but not consulted for access control. If you build admin tooling to revoke sessions, note that deleting a `sessioninfo` row does **not** invalidate the Flask-Login cookie by itself; you would also need to rotate `SECRET_KEY` or add a check against `sessioninfo` in a `before_request` hook.

Session lifetime: `PERMANENT_SESSION_LIFETIME = 7200` seconds (2 hours) is configured, but Flask only applies it to sessions marked permanent. The current login flow does not set `flask_session.permanent = True`, so browser-session cookie behavior remains the effective default unless that is changed. `delete_old_sessions(minutes=120)` purges old `sessioninfo` rows but is not scheduled by default.

## 7.5 Signup flow (`POST /signup`)

```
sanitize(username,password,unid)
   └─ reject if username exists
   └─ if DEBUG_MODE: create_user → redirect /login
      else: duo_authenticate(unid) → if allow: create_user → /login ; else flash → /signup
```

Because Duo runs against the supplied `unid` before the account is created, you cannot register an account for a uNID unless that uNID's Duo device approves. Signup does not log the user in; they must subsequently `/login`.

## 7.6 Password reset (`POST /resetpassword`)

```
sanitize(username,unid,new_password)
   └─ verify_user_unid(username,unid)   # both must match an existing row
        ├─ True  → update_user_password → flash success → /login
        └─ False → flash 'Invalid username or UNID' → /resetpassword
```

There is **no Duo step** in reset — the uNID is the sole secret. (Flagged in the known-issues file as weaker than login.)

## 7.7 Duo 2FA integration

`auth_service.duo_authenticate(unid)` (async):

```python
auth_api = duo_client.Auth(ikey=cfg['DUO_IKEY'], skey=cfg['DUO_SKEY'], host=cfg['DUO_HOST'])
response = await asyncio.to_thread(auth_api.auth, username=unid, factor='push', device='auto')
return response['result'] == 'allow'
```

- Sends a **push** to the user's auto-selected Duo device.
- The blocking `duo_client` call runs in a worker thread via `asyncio.to_thread`; blueprints invoke the coroutine with `asyncio.run(...)`.
- Returns `True` only on explicit `'allow'`. Any exception (missing creds, network, denial, timeout) logs and returns `False`.
- Bypassed entirely when `DEBUG_MODE` is `True`.

Required config: `DUO_IKEY`, `DUO_SKEY`, `DUO_HOST` (see `03`).

## 7.8 Authorization: decorators and checks

### `@login_required` (Flask-Login)
Applied to all browser-facing routes that require a session (tasks, machines, admin, logout). Unauthenticated requests are redirected to `auth.login` (`login_manager.login_view`) with the flash message configured in `create_app`.

### `@admin_required` (custom, `admin.py`)
```python
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not auth_service.is_user_admin(current_user.username):
            flash('You do not have permission to access this page', 'error')
            return redirect(url_for('tasks.index'))
        return f(*args, **kwargs)
    return decorated_function
```
Stacked **below** `@login_required` on every admin route, so the effective requirement is "authenticated AND `is_admin`."

### `can_assign` (inline check, `tasks.create_task`)
Not a decorator; checked in the view body:
```python
if not auth_service.can_user_assign(current_user.username):
    flash('You do not have permission to create tasks', 'error')
    return redirect(url_for('tasks.index'))
```

### Decorator ordering
```python
@admin_bp.route('/adminpanel')
@login_required        # outermost: runs first
@admin_required        # runs second
def admin_panel(): ...
```
Order matters: `@login_required` must precede `@admin_required` so unauthenticated users are redirected before `current_user.username` is dereferenced (an anonymous `current_user` has no meaningful `username`).

## 7.9 Authorization matrix

| Area | Requirement | Enforcement |
|------|-------------|-------------|
| `/login`, `/signup`, `/resetpassword` | none | public |
| `/logout` | authenticated | `@login_required` |
| `/tasks`, task actions, `/users` | authenticated | `@login_required` |
| `/createtasks` | authenticated + `can_assign` | `@login_required` + inline check |
| All `/adminpanel`, `/deleteUser`, `/toggle*` | authenticated + `is_admin` | `@login_required` + `@admin_required` |
| All machine routes | authenticated | `@login_required` |
| All `/api/*` device routes | none | public (perimeter trust) |
| All `/chem/*` routes | none | **public** (`login_required` imported but unused) |
| `/particle-demo/*` | none | public |

## 7.10 Transport & cookie security (summary)

- TLS terminated by nginx; Flask binds loopback only (see `09`).
- Session cookie flags (config): `Secure` (prod), `HttpOnly`, `SameSite=Lax`.
- `SECRET_KEY` signs the Flask-Login cookie; protect it. The dev default is unusable in production.

## 7.11 Practical guidance for the maintainer

- **To require login on the chem module**, add `@login_required` to the routes in `chem_inventory.py` (the import is already present). Decide whether read routes stay public; the write routes (`add`, `move`, `move-bulk`, `remove`, `edit-container`, `upload-scans`, `mark-printed`) are the priority.
- **To add a new permission**, add a boolean column to `User` (via migration), a `can_X(username)` helper in `auth_service`, and either a decorator (mirror `admin_required`) or an inline check.
- **To enforce server-side session revocation**, add a `before_request` that verifies `flask_session['session_id']` still exists in `sessioninfo` and matches `current_user`; otherwise `logout_user()`.
- **Never set `DEBUG_MODE=True` in production** — it disables 2FA for both login and signup.

Continue to 08-integrations-and-data-contracts.md (reference path: 08-integrations-and-data-contracts.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 08 — Integrations & Data Contracts

The server integrates with device/desktop tools over HTTP, plus two backend services (Duo and the local PostgreSQL chem database). This document specifies the **data contracts** so a maintainer can change either side without breaking the other. The canonical, currently-maintained device/desktop clients live in the sibling `NanofabToolkit` repository — see `documentation/NanofabToolkit/PicoHelperTools/` (reference path: ../../NanofabToolkit/PicoHelperTools/README.md) (the producers) and `documentation/NanofabToolkit/ParticleSensor/` (reference path: ../../NanofabToolkit/ParticleSensor/README.md) (the desktop viewer). Older copies retained in *this* repository are documented at `documentation/UNanofabTools/picofirmware/` and `documentation/UNanofabTools/particlepctools/` for historical reference.

## 8.1 Integration map

| Direction | Counterpart | Endpoint(s) | Transport |
|-----------|-------------|-------------|-----------|
| Inbound | SPS30 particle Pico (`Particle_sensor.py`) | `POST /particle-data` | JSON/HTTPS |
| Inbound | DHT22 env Pico (`DHT22_sensor.py`) | `POST /env-data` | JSON/HTTPS |
| Inbound | Combined Pico (`sensor_combined.py`) | `POST /sensor-data` | JSON/HTTPS |
| Inbound | Parylene Pi (on-tool script) | `POST /sdsanalog`, `POST /sdsanalogfinished` | CSV/HTTPS + headers |
| Inbound | Denton 18 Pi (on-tool script) | `POST /denton18pump`, `POST /denton18pumpfinished` | JSON/HTTPS |
| Outbound (server serves) | ParticleSensor desktop GUI (`gui.py`) | `GET /particle-data`, `GET /env-data` | JSON/HTTPS |
| Outbound | ParalyneReader desktop (`ParalyneReader.py`) | `GET /api/paralyne/analog/{list,download/<f>}` | JSON+file/HTTPS |
| Backend | Duo Security | duo-client → Duo API | HTTPS |
| Backend | PostgreSQL | psycopg2 → `cheminventory` | TCP |

> Not an integration with this server: `PreciousMetalReader` in NanofabToolkit calls `n8n.cores.utah.edu`, a separate Utah CORES service. Don't look for a route here for it.

All device clients connect with `verify=False` (TLS without certificate validation) because the server uses an internal certificate not in their trust stores, and the devices sit on a private SSID (`ULink`, hardcoded in firmware). This is perimeter trust, not authenticated requests.

## 8.2 Particle sensor contract (`POST /particle-data`)

**Producer:** `NanofabToolkit/PicoHelperTools/Particle_sensor.py` (MicroPython on a Pico W with an SPS30).

**Required top-level keys:** `room_name` (str), `sensor_number` (str), `timestamp` (Unix seconds as number, or ISO 8601 string).

**Payload shape:**

```json
{
  "room_name": "HEADLESS",
  "sensor_number": "009",
  "timestamp": 1747876800.0,
  "raw_measurements": {
    "mass_pm1": 0.0, "mass_pm2_5": 0.0, "mass_pm4": 0.0, "mass_pm10": 0.0,
    "num_pm0_5": 0.0, "num_pm1": 0.0, "num_pm2_5": 0.0, "num_pm4": 0.0, "num_pm10": 0.0,
    "typical_particle_size_um": 0.0
  },
  "converted_values": {
    "number_concentrations_ft3": { "pm0_5": 0.0, "pm1": 0.0, "pm2_5": 0.0, "pm4": 0.0, "pm10": 0.0 },
    "differential_bins_ft3":     { "bin_0_3_to_0_5": 0.0, "bin_0_5_to_1_0": 0.0, "bin_1_0_to_2_5": 0.0, "bin_2_5_to_4_0": 0.0, "bin_4_0_to_10": 0.0 },
    "mass_concentrations_ug_m3": { "pm1": 0.0, "pm2_5": 0.0, "pm4": 0.0, "pm10": 0.0 }
  }
}
```

**Server actions:** append a row to `LogData/particle_sensors/<room>_<sensor>_historical.csv`; upsert the latest reading into `particle_sensor_data` (unique on `(room_name, sensor_number)`).

**Timestamp note:** the Pico's RP2040 epoch is 2000-01-01; firmware adds `946684800` (`MICROPYTHON_TO_UNIX_EPOCH`) before sending so the server receives Unix-epoch seconds. It also applies a local UTC offset. If you change timestamp handling server-side, account for this.

**Response:** `200 {"status":"success","message":...,"sensor_id":"<room>/<sensor>","timestamp":<iso>}`.

The GET side returns the same nested structure (`ParticleSensorData.to_dict()`), making POST and GET symmetric.

## 8.3 Environmental sensor contract (`POST /env-data`)

**Producer:** `PicoHelperTools/DHT22_sensor.py`.

**Required keys (all):** `room_name`, `sensor_number`, `timestamp`, `temperature_c`, `humidity_pct`.

```json
{ "room_name": "Bay C", "sensor_number": "003", "timestamp": 1747876800.0,
  "temperature_c": 21.4, "humidity_pct": 38.2 }
```

**Server action:** append to `LogData/env_sensors/<room>_<sensor>_historical.csv` (header written on first row). `temperature_c`/`humidity_pct` are coerced to float (a non-numeric value raises and yields a 500).

## 8.4 Combined sensor contract (`POST /sensor-data`)

**Producer:** `PicoHelperTools/sensor_combined.py` (SPS30 + DHT22 in one payload).

**Required:** `room_name`, `sensor_number`. **Optional:** `timestamp`, `temperature_c`, `humidity_pct`, and the same `raw_measurements`/`converted_values` blocks as `/particle-data`.

**Server actions:**
- If `raw_measurements` present → `log_historical_particle_data` (→ `particle_sensors/` CSV) and upsert `particle_sensor_data` (including temp/humidity columns).
- If `temperature_c` and `humidity_pct` present → append `env_sensors/<id>_historical.csv`.

This endpoint is the recommended target for new sensors (it subsumes `/particle-data` and `/env-data`). The decoupled writes mean a failed DHT22 read still records particle data and vice-versa.

> Contract caveat: `GET /sensor-data` reads `LogData/sensors/<id>_combined.csv`, which this POST never writes. To retrieve combined history today, use `GET /particle-data?room_name=…&sensor_number=…` and `GET /env-data?…`. (See known-issues.)

## 8.5 Parylene analog batch contract (`POST /sdsanalog`)

**Producer:** the Parylene tool's Raspberry Pi (on-device script; not in NanofabToolkit).

**Content-Type:** `text/csv`. **Headers:**
- `X-Session-ID` — unique per run (required).
- `X-Batch-Number` — 1-based integer (required).
- `X-Total-Batches` — integer (required).
- `X-Is-Final-Batch` — `"true"` to force finalize (optional).

**Body:** raw CSV rows. The combined output uses header `timestamp,pressure,vapor,temp`.

**Lifecycle:**
1. Each batch → `LogData/Paralyne/temp/<session>/batch_NNNN.csv` (4-digit zero-padded).
2. First batch also writes `start_time.txt`.
3. When received count == total (or final flag), the server combines into `LogData/Paralyne/analog/<starttime>_SDSLOG_combined_<session>.csv`.
4. `POST /sdsanalogfinished` (with `session_id` in JSON body or `X-Session-ID` header) forces the combine and deletes the temp dir.

**Consumer:** `ParalyneReader.py` later retrieves combined files via `GET /api/paralyne/analog/list` and `/download/<filename>`.

## 8.6 Denton 18 pump contract (`POST /denton18pump`)

**Producer:** Denton 18 Pi (on-device script).

**Body:** `{ "pressure": <raw ADC integer> }`.

**Conversion (server):** `pressure = raw / 65535.0 * 3.3 * 3.0 / 0.009` — 16-bit ADC full-scale 65535, 3.3 V reference, ×3 divider, 9 mV/unit transducer. If you change probe hardware, update this formula in `api.denton18_pump`.

**Lifecycle:** a sentinel `LogData/denton18/pumpdata/current_run.txt` points at the active CSV; samples append to it; `POST /denton18pumpfinished` deletes the sentinel so the next sample starts a fresh `<ts>_DENTON18PUMPLOG.csv`.

## 8.7 Desktop consumer contracts (outbound GETs)

### ParticleSensor GUI (`ParticleSensor/src/gui.py`)
- `GET /particle-data` (no params) → current snapshot of all sensors (renders the cleanroom map).
- `GET /particle-data?room_name=…&sensor_number=…` → historical CSV for one sensor (drill-down).
- `GET /env-data?room_name=…&sensor_number=…` → env history (optional overlay).

Room labels in the GUI (`"Bay A\n2025N"`, etc.) must correspond to the `room_name` values the Picos send for correlation to work.

### ParalyneReader (`ParalyneReader/src/ParalyneReader.py`)
- `GET /api/paralyne/analog/list` → `{files:[{filename,size,modified,download_url}], count}`.
- `GET /api/paralyne/analog/download/<filename>` → file bytes (attachment).
- (`return_selected` in the client calls `/return/<filename>`, which the server does **not** implement; that client function is dead.)

## 8.8 Duo integration

- Library: `duo-client` 5.3.0.
- Config: `DUO_IKEY`, `DUO_SKEY`, `DUO_HOST`.
- Call: `duo_client.Auth(...).auth(username=<unid>, factor='push', device='auto')`; success = `result == 'allow'`.
- Invoked from login and signup (skipped when `DEBUG_MODE`). See `07` §7.7.

## 8.9 PostgreSQL integration

- Driver: `psycopg2-binary`; access via SQLAlchemy Core engine (`chem_service.get_chem_engine`).
- Pooling: `pool_pre_ping=True, pool_size=5, max_overflow=10` (≤15 concurrent connections).
- Lazy: the engine is created on first `/chem/*` use, so the app boots fine without Postgres if chem is unused.
- Provisioning: `init_chem_db.py` + `chem_schema.sql` + `chem_schema_migration_v2.sql` (plus the runtime-only objects noted in `04` §4.4).

## 8.10 End-to-end example (particle data round trip)

```
Pico SPS30 read
  → JSON payload (8.2)
  → POST https://nfhistory.nanofab.utah.edu/particle-data
  → nginx TLS → Flask 127.0.0.1:5000 → api.receive_particle_data
       → append particle_sensors/<id>_historical.csv
       → upsert particle_sensor_data
  → 200

ParticleSensor GUI
  → GET /particle-data            → all current readings (map)
  → GET /particle-data?room&sensor → historical CSV (chart)
```

## 8.11 Versioning & change guidance

There is no explicit API versioning. To evolve a contract safely:
- **Additive changes** (new optional JSON keys) are safe; handlers use `.get(...)` with defaults.
- **Renaming/removing keys** breaks firmware already flashed in the field — coordinate a firmware update or accept both shapes for a transition period.
- **CSV header changes** affect both the on-disk historical files and the desktop readers; migrate existing files or version the filename.
- When adding a new device type, prefer a new endpoint + its own CSV/table over overloading an existing one.

Continue to 09-deployment-and-operations.md (reference path: 09-deployment-and-operations.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 09 — Deployment & Operations

A production runbook for hosting, operating, and maintaining the server. nginx and systemd configs are **not** in the repository; the templates below are documented recommendations consistent with the codebase's stated deployment model (`run.py` docstring, `config.py` comments). Adapt paths/users to your host.

## 9.1 Deployment model

Current intended model:

```
Internet/LAN ──443/HTTPS──► nginx (TLS termination, static, proxy)
                                  │ proxy_pass http://127.0.0.1:5000
                                  ▼
                            gunicorn (WSGI) ──► Flask app (run:app)
                                  │
                     ┌────────────┼─────────────┐
                     ▼            ▼              ▼
              SQLite (instance/) PostgreSQL   LogData/ HSCDATA/ uploads/
```

- Flask binds `127.0.0.1:5000` (config defaults). It is never directly exposed.
- gunicorn runs the WSGI callable `run:app`.
- nginx owns TLS and forwards to gunicorn.

> **Live-state note:** as of the 2026-06-01 `nfhistory` survey, the production box has not yet been migrated to this target shape. The live Flask process is `python run.py` inside the `flaskserver` tmux session, and there is no systemd unit for Flask or HSCDownloader yet. Treat the gunicorn/systemd material below as the recommended migration target, not a description of the current live service. See `../liveserver/README.md` (reference path: ../liveserver/README.md) §6.5.

**Legacy alternative (still referenced by `setup.sh`/`.env.example`):** gunicorn binding `0.0.0.0:443` directly with `--certfile/--keyfile`, no nginx:

```bash
gunicorn -w 4 -b 0.0.0.0:443 --certfile=cert.pem --keyfile=key.pem run:app
```

Prefer the nginx model for new deployments (better TLS handling, static serving, and process isolation). The rest of this document assumes nginx + gunicorn.

## 9.2 Host prerequisites

- Linux host with Python 3.10+ and `python3-venv`.
- nginx.
- PostgreSQL 12+. On the live `nfhistory` deployment, Postgres runs **locally on the same VM** (see `../liveserver/README.md` (reference path: ../liveserver/README.md) §10); a fresh deployment can do the same or point at a reachable remote Postgres via `CHEM_PGHOST`.
- A TLS certificate + key. Live deployment uses **Let's Encrypt + certbot** with the `certbot.timer` systemd unit handling auto-renewal (see `../liveserver/README.md` (reference path: ../liveserver/README.md) §4).
- A UNIX account to own the process and files. On `nfhistory`, this is the shared `phelan` account (the Nanofab team cannot create new UNIX users — IT does — see `../serveraccess/README.md` §5.5). On a greenfield install, you can either reuse a shared account or — if you have root — create a dedicated `untools` service user.

## 9.3 Application install

```bash
# as the service user, in the deploy directory
git clone <repo> UNanofabTools && cd UNanofabTools
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn          # not in requirements.txt; install explicitly
cp .env.example .env          # then edit per 03 §3.4 (production values)
mkdir -p logs                 # REQUIRED: ProductionConfig logging writes logs/untools.log
```

Set in `.env` for production:
- `FLASK_ENV=production`
- `DEBUG_MODE=False`
- a strong `SECRET_KEY`
- real `DUO_*` credentials
- `CHEM_*` credentials (if using chem)
- leave `HOST`/`PORT` at defaults (`127.0.0.1:5000`) for the nginx model — remove the `155.98.11.6`/`443` lines from `.env.example`.

## 9.4 Database provisioning

### SQLite
Created automatically by `db.create_all()` at first boot under `instance/`. To use migrations explicitly:

```bash
export FLASK_APP=run.py
flask db upgrade
```

Ensure the service user can write to `instance/` (and the working directory).

### PostgreSQL (chem)

```bash
# create DB + user
sudo -u postgres createdb cheminventory
sudo -u postgres psql -c "CREATE USER untools WITH PASSWORD '<strong>';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cheminventory TO untools;"

# provision schema
python init_chem_db.py
psql "postgresql://untools:<strong>@localhost/cheminventory" -f chem_schema_migration_v2.sql
```

> The committed SQL does not create every object the runtime uses (`containers.last_scan_at`, extended `inventory_cycles` columns, `scan_raw.barcode`, `container_scans.barcode`, the `transactions` table). Until proper migrations exist, apply the additional DDL recorded in the separate known-issues file to a fresh database, or the chem write/scan/report features will error. An existing production database already has these.

## 9.5 Running under gunicorn

Manual smoke test:

```bash
source venv/bin/activate
export FLASK_ENV=production
gunicorn -w 4 -b 127.0.0.1:5000 run:app
```

`-w 4` = 4 worker processes (rule of thumb: `2 × CPU cores + 1`). The app is synchronous; the default sync worker is appropriate. Note Duo pushes block a worker for the duration of the user's approval (up to ~30s), so size workers with that in mind, or move Duo to an async worker class if push volume grows.

### systemd unit (template)

`/etc/systemd/system/untools.service`:

```ini
[Unit]
Description=UNanofabTools Flask (gunicorn)
After=network.target postgresql.service

[Service]
User=untools
Group=untools
WorkingDirectory=/opt/UNanofabTools
Environment="PATH=/opt/UNanofabTools/venv/bin"
EnvironmentFile=/opt/UNanofabTools/.env
ExecStart=/opt/UNanofabTools/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 run:app
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now untools
sudo systemctl status untools
```

> `WorkingDirectory` matters: SQLite relative URIs, `instance/`, `logs/`, `LogData/`, `HSCDATA/`, and `uploads/` resolve relative to it (the config converts data dirs to absolute at startup, but the working directory is still where they're rooted on first resolution). Keep it at the repo root.

## 9.6 nginx reverse proxy (template)

`/etc/nginx/sites-available/untools`:

```nginx
server {
    listen 443 ssl;
    server_name nfhistory.nanofab.utah.edu;

    ssl_certificate     /etc/ssl/untools/fullchain.pem;
    ssl_certificate_key /etc/ssl/untools/privkey.pem;

    # Allow large-ish uploads (matches MAX_CONTENT_LENGTH = 16 MB)
    client_max_body_size 16m;

    # ACME http-01 challenge support (repo has .wellknown/acme-challenge/)
    location /.well-known/acme-challenge/ {
        root /opt/UNanofabTools;
    }

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;       # Duo pushes can be slow
    }
}

server {                              # redirect http→https
    listen 80;
    server_name nfhistory.nanofab.utah.edu;
    return 301 https://$host$request_uri;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/untools /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Notes:
- `client_max_body_size 16m` should match (or slightly exceed) `MAX_CONTENT_LENGTH`; otherwise nginx rejects uploads before Flask sees them.
- Optionally serve `/js/` and `/css/` directly from `app/static/` in nginx for performance; currently the app serves them.
- Device clients use `verify=False`, so an internal/self-signed cert is acceptable for them, but a real cert is recommended for browsers.

## 9.7 On-disk data layout

The server reads/writes a tree under the working directory. Back these up and monitor disk usage.

```
instance/                     SQLite databases (users, sessions, tasks, particle cache)
  signininfo.db
  sessioninfo.db
  tasks.db
  particle_sensors.db

uploads/                      task file attachments (timestamped, secure_filename)

HSCDATA/                      per-machine summary CSVs: small_<Machine>_DataCollection.csv
                              (written by HSCDownloader — see documentation/UNanofabTools/hscdownloader/)

LogData/                      machine logs + sensor histories
  ALD/RF/, ALD/Pressure/      ALD log files
  Paralyne/temp/<session>/    in-flight Parylene batches (transient)
  Paralyne/analog/            finalized Parylene CSVs (also served via /api/paralyne/...)
  denton18/pumpdata/          Denton 18 pump CSVs + current_run.txt sentinel
  particle_sensors/           <room>_<sensor>_historical.csv (particle time series)
  env_sensors/                <room>_<sensor>_historical.csv (temp/humidity time series)
  sensors/                    <room>_<sensor>_combined.csv (read by GET /sensor-data; see note)

logs/                         untools.log (rotating, production only)
```

Growth hot spots: `LogData/particle_sensors/` and `LogData/env_sensors/` grow unbounded (append per reading); `Paralyne/temp/` should self-clean on finalize but orphaned sessions can accumulate if a run never finalizes.

## 9.8 Logging

- **Production:** `ProductionConfig.init_app` installs a `RotatingFileHandler` at `logs/untools.log` (10 MB × 10 backups, level INFO). Ensure `logs/` exists and is writable, or startup fails.
- **gunicorn:** add `--access-logfile` / `--error-logfile` (or `-` for stdout, captured by journald under systemd).
- **nginx:** standard access/error logs.
- The application logs key events (sensor ingest, errors) via `current_app.logger`. Many service functions also `print(...)` (notably `chem_service` room/move/bulk debug lines) — these land in stdout/journald.

## 9.9 Backups

**On the production deployment, the base backup is run off the box by University IT** — a VM-level snapshot the Nanofab team does not operate (see `../liveserver/README.md` (reference path: ../liveserver/README.md) §13). Confirm IT's scope and SLA, then write the result there. The table below applies to any **secondary Nanofab-owned tier** (a Nanofab admin running their own backups in addition to IT's), or to a non-production deployment where IT isn't doing it.

| Data | How |
|------|-----|
| SQLite DBs | Stop writes or use `sqlite3 <db> ".backup"`; or copy `instance/*.db` during low traffic. They are small. |
| PostgreSQL (local on the same host — see `../liveserver/README.md` §10) | `pg_dump cheminventory > backup.sql` on a schedule (cron). |
| CSV tree | `tar`/`rsync` `LogData/`, `HSCDATA/`, `uploads/`. These are authoritative for sensor/machine history. |
| Config | Securely back up `.env` (contains secrets) separately. |

Test restores periodically. The CSV tree is the only copy of long-run sensor history (the DB caches only the latest reading), so it is as important as the databases.

## 9.10 Routine operations

- **Session cleanup:** `auth_service.delete_old_sessions()` is not scheduled. Add a cron/management hook to purge `sessioninfo` rows periodically, or accept unbounded growth (rows are tiny).
- **Parylene temp cleanup:** orphaned `LogData/Paralyne/temp/<session>/` dirs (runs that never finalized) can be safely deleted after confirming no active upload.
- **Deploys:** `git pull` → `pip install -r requirements.txt` (if changed) → `flask db upgrade` (if migrations added) → `sudo systemctl restart untools`.
- **Rotating SECRET_KEY:** invalidates all Flask-Login cookies (forces re-login). Do this if a key compromise is suspected.

## 9.11 Health checks & monitoring

There is no dedicated health endpoint. Practical checks:
- `GET /login` returns 200 (app + templating up).
- `GET /chem/inventory` returns 200 (Postgres reachable) — only if chem is in use.
- `systemctl is-active untools`, gunicorn worker count, nginx up.
- Disk usage on the `LogData/` volume.
Consider adding a lightweight `/healthz` route that pings each datastore.

## 9.12 Troubleshooting

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| 502 from nginx | gunicorn down or wrong bind | `systemctl status untools`; confirm `127.0.0.1:5000` |
| App won't start, logging error | `logs/` missing | `mkdir logs` and restart |
| All chem pages 500 | Postgres unreachable / creds wrong / missing runtime columns | check `CHEM_*`, Postgres up, apply missing DDL (known-issues) |
| Logins fail in prod | `DUO_*` unset/wrong or Duo unreachable | verify Duo creds/host; check logs for "Duo authentication error" |
| Uploads rejected (413) | nginx `client_max_body_size` < payload | raise it to ≥16m |
| Downloads 403 | path outside `LOG_DATA_DIR` (traversal guard) | confirm the file is under `LogData/` |
| `GET /sensor-data` always 404 | POST writes elsewhere than the GET reads | use `/particle-data` + `/env-data` history; see known-issues |
| Cookies dropped | `SESSION_COOKIE_SECURE=True` over HTTP | ensure TLS end-to-end in prod |

Continue to 10-development-guide.md (reference path: 10-development-guide.md).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/10-development-guide.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 10 — Development Guide

How to extend and modify the server, plus the conventions the codebase follows. Read `01` (architecture) first; this document is task-oriented recipes.

## 10.1 Project conventions

- **Three layers.** Blueprints (HTTP) → services (logic + persistence) → models (tables). Keep SQL/file I/O in services; keep request parsing and response building in blueprints. (Two legacy exceptions exist: `tasks.get_users` and `chem_inventory.container_lookup` run SQL inline.)
- **One blueprint per domain**, registered in `app/__init__.py` inside `create_app` (deferred import to avoid cycles).
- **Persistence is mixed by design:**
  - Users/sessions/particle cache → Flask-SQLAlchemy ORM.
  - Tasks → raw `sqlite3` in `task_service`.
  - Chem → SQLAlchemy Core (`engine.begin()` + `text()`), parameterized.
- **Parameterized SQL always.** Use `?` (sqlite3) or `:name` (SQLAlchemy `text`). Never f-string user input into SQL.
- **Services return sentinels on error** (`None`/`False`/`[]`) and log; blueprints translate to flashes or JSON status. Keep this pattern for consistency.
- **Config via env vars** only (`config.py` + `.env`); never hardcode secrets.
- **Templates** live in `app/templates/` (chem templates under `app/templates/chem/`); static assets in `app/static/{js,css}`.

## 10.2 Add a new route to an existing blueprint

1. Open the blueprint (e.g. `app/blueprints/machines.py`).
2. Add a view with the `@<bp>.route(...)` decorator and appropriate auth decorators:

```python
@machines_bp.route('/newtool')
@login_required
def newtool():
    data = data_service.get_machine_data('NewTool')
    return render_template('machine_data.html', machine='NewTool', ...)
```

3. Put any logic/DB/file work in the relevant service, not the view.
4. Add a template if it renders HTML.

## 10.3 Add a new blueprint

1. Create `app/blueprints/mymodule.py`:

```python
from flask import Blueprint, render_template
from flask_login import login_required

mymodule_bp = Blueprint('mymodule', __name__, url_prefix='/mymodule')

@mymodule_bp.route('/')
@login_required
def index():
    return render_template('mymodule/index.html')
```

2. Register it in `app/__init__.py` inside `create_app` (with the other imports/registrations):

```python
from app.blueprints.mymodule import mymodule_bp
app.register_blueprint(mymodule_bp)
```

3. Add a matching service module under `app/services/` for its logic.
4. Add templates under `app/templates/mymodule/`.

## 10.4 Add a new SQLite model + migration

1. Define the model in `app/models/__init__.py` (or a new module imported there). Set `__bind_key__` if it belongs to a non-default database:

```python
class Widget(db.Model):
    __tablename__ = 'widgets'
    __bind_key__ = 'tasks'         # or omit for the default users DB
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
```

2. Generate and apply a migration:

```bash
export FLASK_APP=run.py
flask db migrate -m "add widgets table"
flask db upgrade
```

`db.create_all()` will also create brand-new tables at boot, but **column changes to existing tables require a migration** — always migrate so environments stay in sync. Treat Alembic as the source of truth.

3. If you add a new bind (a new SQLite file), register it in `config.py` under `SQLALCHEMY_BINDS`.

## 10.5 Work with the chem (PostgreSQL) layer

The chem layer does not use the ORM at runtime. To add an operation:

1. Add a method to `ChemInventoryService` in `chem_service.py`:

```python
def my_query(self, q=""):
    from sqlalchemy import text
    with self.engine.begin() as conn:
        rows = conn.execute(
            text("SELECT ... WHERE col ILIKE :q"),
            {"q": f"%{q}%"}
        ).mappings().all()
    return rows
```

2. Use `engine.begin()` for transactional writes (auto commit/rollback). Use `.mappings()` to get dict-like rows.
3. Call `self.log_transaction(conn, action=..., ...)` inside the same transaction for any mutation, to keep the audit trail complete.
4. For schema changes, update `chem_schema.sql` AND write the corresponding `ALTER TABLE`/migration, and apply it to existing databases (there is no Alembic for Postgres here — manage it with versioned `.sql` files like `chem_schema_migration_v2.sql`). Keeping the committed SQL in sync with the live DB is important (see `04` and the known-issues file).

## 10.6 Add a device ingestion endpoint

Follow the `api.py` pattern:

1. Define `@api_bp.route('/my-data', methods=['POST'])` (no auth — device tier).
2. Validate `request.is_json` and required keys; return `400` with a JSON error on failure.
3. Persist: append a per-sensor CSV under `LOG_DATA_DIR` and/or upsert a model row. Wrap DB writes in try/except with `db.session.rollback()` on error.
4. Return `200` with a JSON status. Keep the response shape symmetric with any matching GET.
5. Document the payload contract in `08`.

## 10.7 Testing (recommended, not yet present)

There is no test suite. To add one:

1. `pip install pytest`.
2. Use the factory with a test config (in-memory SQLite, `DEBUG_MODE=True` to skip Duo):

```python
import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app('development')
    app.config.update(TESTING=True, WTF_CSRF_ENABLED=False)
    with app.test_client() as c:
        yield c

def test_login_page(client):
    assert client.get('/login').status_code == 200
```

3. For chem tests, point `CHEM_*` at a disposable test database, or mock `get_chem_engine`.
4. Prioritize: auth flows, the path-traversal guards in `machines.download_file`/`graph_file`, the device ingestion validators, and the chem write/transaction methods.

## 10.8 Front-end notes

- Templates are Jinja2. The `fmtdate` filter (`{{ value | fmtdate }}`) formats dates and renders missing values as `—`.
- Static JS: `adminActions.js` (admin table actions), `taskActions.js` (task actions), `graph.js` (Chart.js helpers), `tablesort.js` (sortable tables keyed off `id='sortableTable'`). CSS: `inventory.css`.
- `csv_to_html_table` emits `<table id='sortableTable'>` so `tablesort.js` can hook it. (It does not escape cell values — keep inputs trusted, or add escaping if you feed it user data.)

## 10.9 Gotchas and non-obvious behaviors

- **`DEBUG_MODE=True` disables Duo** for login and signup. Never enable in production.
- **`DevelopmentConfig`/`ProductionConfig` hardcode `DEBUG_MODE`**, overriding the env var per environment (see `03` §3.5).
- **`task_service` ignores `TASK_DATABASE_URI`** and locates `tasks.db` itself via `_get_db_path`. Keep them pointing at the same file if you change one.
- **`task_service.allowed_file` has its own extension set** (includes `gif`), separate from `config.ALLOWED_EXTENSIONS`.
- **`db.create_all()` runs every boot** but never alters existing tables — migrations are required for column changes.
- **`chem_inventory_remote.py` is dead code** (not registered). Don't edit it expecting effect.
- **`app/models/{session,task,user}.py` are empty** — the real models are in `app/models/__init__.py`.
- **`chem_service` prints debug lines** (`print("USING resolve_room_id")`, bulk-move dumps) to stdout on normal operation.
- **Path-traversal guards differ by endpoint** — `machines` uses `realpath`+prefix (strongest); `api` Parylene and `particle_demo_will` use string checks. Match the strength to the exposure when adding file routes.

## 10.10 Code style observations

- snake_case for Python identifiers; legacy DB columns are camelCase (`passwordHash`, `uNID`, `isAdmin`, `canAssign`) with `name=` overrides on the model.
- Inline dated comments mark changes (e.g. `# Updated 4/15/2026`). Not a changelog; treat as historical breadcrumbs.
- No formatter/linter config is committed; match surrounding style.

## 10.11 Where to make common changes (quick map)

| Want to change… | Edit |
|------------------|------|
| A config default or env var | `config/config.py` |
| Login/2FA/session behavior | `app/blueprints/auth.py` + `app/services/auth_service.py` |
| Permissions/decorators | `app/blueprints/admin.py` (decorator), `auth_service` (helpers) |
| A machine page or graph | `app/blueprints/machines.py` + `app/services/data_service.py` |
| A device endpoint | `app/blueprints/api.py` |
| Chem behavior/queries | `app/blueprints/chem_inventory.py` + `app/services/chem_service.py` |
| A SQLite table | `app/models/__init__.py` + a migration |
| The chem schema | `chem_schema*.sql` + apply DDL to the live DB |
| Startup/extension wiring | `app/__init__.py` |
| Templates/UI | `app/templates/**`, `app/static/**` |

This concludes the developer documentation set. See the index in README.md (reference path: README.md). Known bugs and technical debt are tracked in a separate file outside this folder (`SERVER-KNOWN-ISSUES.md`).


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/serveraccess/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Server Access — Developer / Admin Reference

Formal reference for logging into the cleanroom server `nfhistory` (155.98.11.8) and operating the two long-running tmux sessions that host the website and the HSCDownloader. The layman companion lives at `../../../presentation/UNanofabTools/serveraccess/README.md` (reference path: ../../../presentation/UNanofabTools/serveraccess/README.md). Known issues and recommended hardening are tracked in `../../../known-issues/UNanofabTools/serveraccess.md` (reference path: ../../../known-issues/UNanofabTools/serveraccess.md).

This document is the canonical step-by-step for both **end users** (new staff and developers who need to attach to a session and read logs) and the **admin** (the cleanroom team member responsible for onboarding new users, restarting the services, and rotating keys).

---

## 1. Topology

```
   user laptop ──ssh (key: ~/.ssh/CADE)──►  CADE lab machine
                                            (lab1-1..40 or lab2-1..35
                                             .eng.utah.edu)
                                                  │
                                                  │ ssh (key on CADE; alias 'nfhistory')
                                                  ▼
                                            nfhistory  (155.98.11.8, shared 'phelan' account)
                                                  │
                                                  ▼
                                   tmux sessions:  flaskserver, downloader
```

Two SSH hops are mandatory; `nfhistory` is not reachable from outside the College of Engineering network. CADE provides the bastion. On `nfhistory`, two persistent tmux sessions hold the only two long-running processes the system depends on.

| Hop | From | To | Auth |
|-----|------|----|------|
| 1 | user laptop | `lab1-X.eng.utah.edu` (X ∈ 1..40) **or** `lab2-Y.eng.utah.edu` (Y ∈ 1..35) | CADE SSH key + CADE username |
| 2 | CADE machine | `nfhistory` (`155.98.11.8`) | `nfhistory` SSH key + fixed user `phelan` |

The `lab1-N`/`lab2-N` machines share a single CADE home directory via NFS, so once you place your `~/.ssh/config` and key on any one of them, all of them see it.

---

## 2. Prerequisites

### 2.1 User prerequisites

1. **CADE account.** Created via the College of Engineering self-service portal at <https://usertools.eng.utah.edu>. Username is per-person; password is set during account creation. The portal is also where the user uploads the public half of their CADE SSH key.
2. **CADE SSH key pair.** Generated on the user's laptop:

   ```sh
   ssh-keygen -t ed25519 -f ~/.ssh/CADE -C "<your-CADE-username>@cade"
   ```

   Private half stays at `~/.ssh/CADE`; the corresponding `~/.ssh/CADE.pub` is uploaded to the CADE portal.
3. **`nfhistory` SSH key pair.** Generated by the admin (see §5.1) and delivered to the user along with the `~/.ssh/config` block to place on CADE.

### 2.2 Admin prerequisites

1. Shell access on `nfhistory` as the shared `phelan` user.
2. Permission to edit `/home/phelan/.ssh/authorized_keys` on `nfhistory`.
3. A copy of this runbook and of the `flaskserver` and `downloader` start commands (§4.3).

---

## 3. User procedure

### 3.1 First-time setup on the user's CADE home directory

Hop 1 once to land on a CADE machine (any `lab1-X` or `lab2-Y`):

```sh
ssh -i ~/.ssh/CADE <your-CADE-username>@lab1-10.eng.utah.edu
```

Replace `<your-CADE-username>` with the CADE account name (for example `phelanh`). `lab1-10` may be replaced by any of `lab1-1` … `lab1-40` or `lab2-1` … `lab2-35`; the machines are interchangeable.

On the CADE machine, install the `nfhistory` private key the admin issued you (suggested path `~/.ssh/nfhistory`) and create or append `~/.ssh/config`:

```
Host nfhistory
  Hostname 155.98.11.8
  User phelan
  IdentityFile ~/.ssh/nfhistory
```

Constraints:

- `User` **must** be `phelan`. `nfhistory` has no per-person accounts; everyone authenticates as the shared `phelan` user (distinguished only by which public key authorised the session).
- `Hostname` is the internal IP `155.98.11.8`. There is no public DNS entry — the address is fixed and must be hard-coded here.
- `IdentityFile` is the path to the private key file the admin gave you. Permissions on that file must be `600`:

  ```sh
  chmod 600 ~/.ssh/nfhistory
  chmod 700 ~/.ssh
  ```

  SSH will refuse to use a key file that is group- or world-readable.

### 3.2 Routine login

```sh
# Hop 1 — laptop → CADE
ssh -i ~/.ssh/CADE <your-CADE-username>@lab1-10.eng.utah.edu

# Hop 2 — CADE → server
ssh nfhistory
```

On success, the prompt becomes that of the `phelan` user on `nfhistory`.

### 3.3 Attaching to a session

```sh
tmux attach -t flaskserver   # the Flask web app
tmux attach -t downloader    # the HSCDownloader ETL
```

`tmux ls` lists all sessions currently running on the server.

### 3.4 Detaching (leave without killing)

> **Press `Ctrl-b`, release, then press `d`.**

`Ctrl-b` is tmux's default prefix; `d` is the detach command. Detaching returns you to the plain shell on `nfhistory` while leaving the program inside the session running.

**Do not** type `exit` inside the session — that terminates the shell tmux is hosting, which terminates the program. **Do not** press `Ctrl-c` — that delivers SIGINT to the running process, which also terminates it.

### 3.5 Logout

After detaching, two `exit`s walk the connection back: one closes the `nfhistory` shell, the next closes the CADE shell.

---

## 4. Operating the long-running sessions

### 4.1 Inventory

| Session | Working directory (typical) | Process | Purpose |
|---------|----------------------------|---------|---------|
| `flaskserver` | `~/server/UNanofabTools` | `python run.py` (confirmed by `ps`/tmux state in the 2026-06-01 snapshot) | Serves `nfhistory.nanofab.utah.edu` behind nginx |
| `downloader` | `~/server/UNanofabTools` (same install — `HSCDownloader.py` lives next to `run.py`) | `python3 HSCDownloader.py` | Polls CORES n8n webhook and writes `HSCDATA/*.csv` |

The paths above match the current install. If a future move changes them, update this table — the rest of the procedure is unchanged.

### 4.2 Health check (without restarting anything)

From `nfhistory`:

```sh
tmux ls
```

Expected output:

```
downloader: 1 windows (created …) [80x24]
flaskserver: 1 windows (created …) [80x24]
```

If either session is missing, the program is not running. Proceed to §4.3.

### 4.3 Recreating a session (recovery)

If a session has been accidentally killed (someone typed `exit`, the server rebooted, `Ctrl-c` was pressed inside the session), follow these procedures verbatim.

#### Recreate `flaskserver`

```sh
tmux new -s flaskserver
cd ~/server/UNanofabTools
source venv/bin/activate
python run.py
```

Then detach with `Ctrl-b` `d`. Verify the website is up by visiting `nfhistory.nanofab.utah.edu`.

> **Production note.** `python run.py` is the development invocation. If the deployment was migrated to `gunicorn` (see `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`), substitute the gunicorn command from that runbook. The shape — `tmux new -s flaskserver`, `cd`, activate, run, detach — is the same.

#### Recreate `downloader`

```sh
tmux new -s downloader
cd ~/server/UNanofabTools
source venv/bin/activate
python3 HSCDownloader.py
```

Then detach with `Ctrl-b` `d`. Confirm the next scheduled pull writes a fresh CSV under `HSCDATA/`.

#### Order if both are down

Bring the **downloader** up first (it has no dependency on the website) and then the **flaskserver**. Either order works, but this pattern ensures fresh CSVs are present before the website starts serving them.

### 4.4 Useful tmux subcommands

| Command | Effect |
|---------|--------|
| `tmux ls` | list sessions |
| `tmux attach -t <name>` | attach to a session |
| `tmux new -s <name>` | create a new session named `<name>` |
| `tmux kill-session -t <name>` | terminate a session (use deliberately) |
| `Ctrl-b d` (inside) | detach the current session |
| `Ctrl-b ` (inside) | enter scrollback mode; `q` to exit |
| `Ctrl-b PgUp` (inside) | enter scrollback at the top of recent output |

The scrollback shortcut is the main reason to attach in the first place — read the last few hundred lines of the website's or downloader's log, then `q`, then `Ctrl-b d`.

---

## 5. Admin procedure

> **Operational boundary.** The Nanofab admin works **as `phelan` with `sudo`**, not as `root`. University IT owns `root` on `nfhistory` and is the only party that can create UNIX accounts, modify `/root/`, change the firewall, or operate the VM-level backup. Several steps below explicitly call out which side of the line each action falls on.

### 5.1 Onboarding a new user (one-time per person, Nanofab-side)

1. **Verify the user has a CADE account.** Confirm via the portal at <https://usertools.eng.utah.edu> that the user can SSH into a CADE machine on their own. If they cannot, send them there first; CADE management is outside the cleanroom team's scope.
2. **Generate an `nfhistory` key pair** on a trusted workstation:

   ```sh
   ssh-keygen -t ed25519 -f ./nfhistory_<username> -C "<username>@nfhistory"
   ```

   This produces `nfhistory_<username>` (private) and `nfhistory_<username>.pub` (public).
3. **Install the public half on `nfhistory`** under the shared `phelan` account (no `sudo` needed — `phelan` owns its own `~/.ssh/`):

   ```sh
   # logged in as phelan@nfhistory
   cat nfhistory_<username>.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

   Annotate the line with the user's name in a comment so future revocation is straightforward.
4. **Deliver the private half** to the user via a secure channel (encrypted message, in-person USB; do not email). Include:
   - the private key file,
   - the `~/.ssh/config` block from §3.1 with `IdentityFile` filled in,
   - a pointer to the layman guide at `presentation/UNanofabTools/serveraccess/README.md`.
5. **Record the issuance** somewhere durable (a shared spreadsheet, a key-management note in the cleanroom binder, the lab password manager). At minimum: user name, fingerprint of issued public key, date issued. Because every Nanofab user shares the `phelan` UNIX account (see §5.5 below), this log is the **only** per-person identity layer — keep it accurate.

### 5.2 Offboarding a user (Nanofab-side)

1. Open `/home/phelan/.ssh/authorized_keys` on `nfhistory`.
2. Delete the line carrying that user's public key (identified by the trailing comment from §5.1.3).
3. Record the removal in the same log used during issuance.

Because all Nanofab users share the `phelan` account, key removal is the *only* form of access revocation available to the Nanofab admin. There is no per-user UNIX account to disable.

### 5.3 If `nfhistory` is ever rebuilt — *this is IT's job*

The Nanofab team **cannot** rebuild `nfhistory` from scratch — VM creation, OS install, user creation, and base configuration are all IT operations. If the VM is ever lost or reinstalled, the sequence is:

1. **Open a ticket with University IT** to restore `nfhistory` from their backup pipeline (see [`../liveserver/README.md` (reference path: ../liveserver/README.md) §13). Confirm with IT which point-in-time snapshot to restore.
2. After IT confirms the VM is back, the Nanofab admin logs in as `phelan` and verifies:
   - the four SQLite DBs in `~/server/UNanofabTools/instance/` are present,
   - `~/server/UNanofabTools/uploads/`, `LogData/`, `HSCDATA/` are present,
   - the local PostgreSQL data dir (typically `/var/lib/postgresql/17/main/`) was restored — confirm by `psql -h localhost -d cheminventory -c '\dt'`,
   - `/etc/letsencrypt/` was restored — if not, certbot will reissue on next run.
3. Recreate the two tmux sessions per §4.3 if they didn't come up automatically.
4. If `phelan`'s `~/.ssh/authorized_keys` was lost, reissue keys per §5.1 for every active user.

### 5.4 Routine admin checks (Nanofab-side)

| Cadence | Check |
|---------|-------|
| daily | `tmux ls` confirms both sessions are alive |
| weekly | tail the website log inside `flaskserver`; confirm no recurring tracebacks |
| weekly | confirm fresh CSVs land in `HSCDATA/` from the `downloader` |
| monthly | check current TLS cert expiry (`sudo openssl x509 -in /etc/letsencrypt/live/nfhistory.nanofab.utah.edu/fullchain.pem -noout -enddate`) |
| on demand | rotate keys for any user who has separated from the lab |

### 5.5 Why everyone shares the `phelan` account

The cleanroom team does **not** have the ability to create UNIX accounts on `nfhistory` — IT controls `root` and `useradd`. Every Nanofab user (admin or otherwise) authenticates as the shared `phelan` UNIX account; per-person identity exists only as a separate line in `/home/phelan/.ssh/authorized_keys`. If finer-grained per-user accounts ever become important, that's a ticket to IT, not a Nanofab implementation task. See `known-issues/UNanofabTools/serveraccess.md` #1.

---

## 6. Reference: full command summary

```sh
# === user, on laptop ===
ssh -i ~/.ssh/CADE <CADE-username>@lab1-10.eng.utah.edu

# === user, on any CADE machine, one-time setup ===
mkdir -p ~/.ssh && chmod 700 ~/.ssh
# place ~/.ssh/nfhistory (private key from admin), then:
chmod 600 ~/.ssh/nfhistory
cat >> ~/.ssh/config <<'EOF'
Host nfhistory
  Hostname 155.98.11.8
  User phelan
  IdentityFile ~/.ssh/nfhistory
EOF
chmod 600 ~/.ssh/config

# === user, on CADE, routine ===
ssh nfhistory

# === user, on nfhistory ===
tmux ls
tmux attach -t flaskserver       # or 'downloader'
# leave with Ctrl-b then d

# === recovery (either user or admin), on nfhistory ===
tmux new -s flaskserver
cd ~/server/UNanofabTools && source venv/bin/activate && python run.py
# Ctrl-b d

tmux new -s downloader
cd ~/server/UNanofabTools && source venv/bin/activate && python3 HSCDownloader.py
# Ctrl-b d
```

---

## 7. Operational invariants

- **`User phelan` is fixed.** Every Nanofab user authenticates as `phelan` on `nfhistory` because IT — not the Nanofab team — controls UNIX-account creation. Per-user identity is encoded only in *which key authorised the login*. Do not edit the `User` line in `~/.ssh/config` to anything else.
- **The Nanofab admin has `sudo` but not `root`.** University IT owns root. Anything that requires modifying `/root/`, creating UNIX users, changing the firewall, or operating the VM-level backup is an IT ticket.
- **`155.98.11.8` is fixed.** No DNS entry resolves to it from outside the lab. If the server is renumbered, every user's `~/.ssh/config` Hostname line must be updated; getting a DNS alias is an IT (Eng-DNS) ticket — see `known-issues/UNanofabTools/serveraccess.md` #2.
- **Both sessions must always be alive.** A missing `flaskserver` means the website is down; a missing `downloader` means new CORES data is not arriving. The §4.3 recovery procedure is the response in either case.
- **Detach, never exit.** `Ctrl-b d` is the only safe way to leave a session.
- **CADE homes are NFS-shared.** Whatever you put in `~/.ssh/config` and `~/.ssh/nfhistory` on `lab1-10` is visible on `lab2-23` and vice versa.
- **Root SSH access is IT's, from `iceolate.eng.utah.edu`.** Do not touch `/root/.ssh/authorized_keys` or change `PermitRootLogin` without coordinating with IT — see `../liveserver/README.md` §9.1.

---

## 8. Related documentation

- Layman companion: `presentation/UNanofabTools/serveraccess/README.md`.
- Known issues / tech debt: `known-issues/UNanofabTools/serveraccess.md`.
- **Live server inventory** (what is actually running on `nfhistory` right now — TLS certs, services, packages, what's surprising about the install): `../liveserver/` (reference path: ../liveserver/README.md). The survey script lives there too.
- The two services hosted in the tmux sessions: `documentation/UNanofabTools/flaskserver/` and `documentation/UNanofabTools/hscdownloader/`.
- Deployment runbook for `flaskserver` (gunicorn, nginx, env vars): `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`.


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/liveserver/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Live Server — `nfhistory` Inventory & Maintenance

Formal reference for **what is currently running on the cleanroom server**, as opposed to what the source code says *should* be there. Companion to:

- the access procedure: `../serveraccess/README.md` (reference path: ../serveraccess/README.md)
- the layman version of this doc: `../../../presentation/UNanofabTools/liveserver/README.md` (reference path: ../../../presentation/UNanofabTools/liveserver/README.md)
- the deployment intent: `../flaskserver/09-deployment-and-operations.md` (reference path: ../flaskserver/09-deployment-and-operations.md)
- the maintenance to-do list surfaced by this snapshot: `../../../known-issues/UNanofabTools/liveserver.md` (reference path: ../../../known-issues/UNanofabTools/liveserver.md)

The values below combine two real survey captures by `survey_nfhistory.sh` (reference path: survey_nfhistory.sh): a **2026-05-29** run as `root` (`snapshots/nfhistory_survey_root_2026-05-29.txt` (reference path: snapshots/nfhistory_survey_root_2026-05-29.txt)) and a **2026-06-01** run as `phelan` (`snapshots/nfhistory_survey_phelan_2026-06-01.txt` (reference path: snapshots/nfhistory_survey_phelan_2026-06-01.txt)). Use the raw outputs to re-check any populated table.

> **Caveat about the current snapshots.** The root run could not inspect `phelan`'s home. The 2026-06-01 `phelan` run discovered the live install path and tmux state, but still missed the venv / `.env` / SQLite / data-tree sections because the script still had the older install path baked in. The script has since been patched; re-run it as `phelan` and fold the missing sections into this doc — see §11 and §17 below.

## 0. Findings at the top

A condensed mirror of `known-issues/UNanofabTools/liveserver.md` (reference path: ../../../known-issues/UNanofabTools/liveserver.md). The numbers below intentionally match that file so cross-references stay stable.

> **Boundary of responsibility.** `nfhistory` is jointly operated. University IT owns the VM, root, the off-host backup pipeline, and unattended-upgrades-style patching. The Nanofab team owns the Flask app, the HSCDownloader, the local PostgreSQL chem database, the cleanroom data trees, and everything under `/home/phelan/`. Nanofab admin actions run as `phelan` with `sudo`; the Nanofab team **cannot** create UNIX accounts and **cannot** modify `/root/`. Several findings below land on IT's side of the line and are flagged that way — they're not Nanofab to-do items, they're IT tickets.

1. **Backups are IT-managed off the box.** No Nanofab-side backup tooling was found locally, but the base VM backup is run by University IT. Confirm IT's scope and document it in §13; a Nanofab-owned secondary tier is optional.
2. **Neither the Flask app nor HSCDownloader runs under a process supervisor.** Both live in tmux sessions (`flaskserver` and `downloader`), not systemd. This is the top Nanofab-owned reliability fix.
3. **Root SSH is IT's access path.** `PermitRootLogin without-password` is enabled with one active key from `root@iceolate.eng.utah.edu`; `iceolate` is IT's administrative host. Do not modify this path without IT.
4. **`/root/.ssh/authorized_keys` is mode `-rw-rw-r--`.** The Nanofab team does not own `/root/`; open an IT ticket asking for `chmod 600` and a deploying-umask check.
5. **No `unattended-upgrades` configuration is present on the box itself.** IT likely patches out-of-band; confirm whether they want an on-box unattended-upgrades layer too.
6. **The chem PostgreSQL database is local on this VM.** It is `postgresql@17-main` listening on `127.0.0.1:5432`; the core Flask docs now reflect this live state.
7. **Plain HTTP on `:80` does not redirect to HTTPS.** The default Debian welcome page is served instead. Nanofab can fix this with an nginx redirect.
8. **A phantom `apache2.service` is in failed state.** Apache is not installed; this is unit-file noise to clear.
9. **`php8.4-fpm` is running but unused.** Nothing on the cleanroom site appears to need PHP.
10. **The current TLS cert expires 2026-06-23 (24 days from the root snapshot).** certbot's timer is healthy; no action beyond normal monitoring.
11. **No outbound notification mechanism exists.** No MTA or webhook path is present, so future failures cannot alert a human automatically.
12. **`wpa_supplicant.service` is running on a wired server.** Low-priority cleanup.
13. **Vestigial desktop daemons are running.** Low-priority cleanup.
14. **A hand-installed `python3.12` exists in `/usr/local/bin`.** Trace ownership before removing or documenting it.
15. **Long uptime / no recent reboot.** Coordinate a controlled reboot with IT after #2 is fixed so services return automatically.
16. **`wtmpdb` history starts only in May 2026.** Low-priority retention note.
17. **Survey path mismatch left some `phelan`-side sections blank.** The script is patched; re-run it as `phelan` and fold in venv / `.env` / SQLite / data-tree details.
18. **Root SSH ingress from `155.98.110.9` is IT.** This matches `iceolate.eng.utah.edu`; no action.
19. **A stale `vim HSCDownloader.py` is open in the `downloader` tmux session.** Close it on the next attach.
20. **Multiple `phelan` authorized keys share the `u0911926@utah.edu` comment.** Clarify or prune during the next key audit.
21. **One `phelan` authorized key has the generic `rsa-key-20250917` comment.** Re-attribute it.
22. **`phelan` has an outbound SSH identity whose purpose is undocumented.** Trace and document what it is used for.

Highest Nanofab-owned priorities: #2, #7, #11, and #17. Batch cleanup/audit items #8, #9, #12, #13, #14, #16, and #19-#22. IT-bound/context items are #1, #3, #4, #5, #15, and #18. Items #6 and #10 are verified inventory facts to keep current.

## 1. Operating system & base

| Item | Value |
|------|-------|
| OS | Debian GNU/Linux 13 (trixie), point release 13.4 |
| Kernel | `Linux 6.12.38+deb13-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.12.38-1 (2025-07-16) x86_64` |
| Timezone | `America/Denver` (MDT, -0600) |
| NTP service | Active (`systemd-timesyncd`); system clock synchronized |
| Uptime at capture | 290 days, 23h 37m (so last boot: ~2025-08-12) |
| Last reboots visible in `wtmpdb` | `wtmpdb begins Wed Jan 7 13:59:11 2026` — older history not retained |

## 2. Hardware / resources

| Item | Value |
|------|-------|
| CPU | Intel Xeon Gold 5217 @ 3.00 GHz, x86_64, **1 vCPU** (single core, single thread) |
| Memory | 5.8 GiB total · 950 MiB used · 1.2 GiB free · 4.0 GiB buff/cache · 4.9 GiB available |
| Swap | 1.7 GiB total · effectively unused (268 KiB) |
| Root filesystem | `/dev/sda2` ext4, **29 GB total / 8.5 GB used (31%) / 19 GB free** |
| EFI partition | `/dev/sda1` vfat, 975 MB total, mounted at `/boot/efi` |

This is a small VM. Memory and CPU headroom are comfortable for the current load; disk has plenty of room for now.

## 3. Networking

| Item | Value |
|------|-------|
| Public interface | `ens33` |
| Public IPv4 | `155.98.11.8/25` |
| IPv6 | `fe80::250:56ff:febe:63a6/64` (link-local only) |
| Default gateway | `155.98.11.1` via `ens33` |
| DNS resolver | `155.98.111.144` (managed by NetworkManager) |
| hostname | `nfhistory` |
| hostname -f | `nfhistory.nanofab.utah.edu` |
| `/etc/hosts` | `155.98.11.8 nfhistory.nanofab.utah.edu nfhistory` |

### 3.1 Listening sockets (from `ss -tlnp`)

| Port | Bound to | Process | Notes |
|------|----------|---------|-------|
| 443/tcp | `0.0.0.0` | `nginx` (master pid 1432604, worker 2524390) | HTTPS — public |
| 80/tcp | `0.0.0.0` and `[::]` | `nginx` (same pids) | HTTP — public, **no redirect — see finding #7** |
| 22/tcp | `0.0.0.0` and `[::]` | `sshd` (pid 2263034) | OpenSSH — public |
| 5000/tcp | `127.0.0.1` | `python` (pid 2665755) | The Flask app — localhost only |
| 5432/tcp | `127.0.0.1` and `[::1]` | `postgres` (pid 1908562) | **Chem inventory DB — localhost only — see finding #6** |

### 3.2 Firewall (nftables)

`ufw`, `firewalld`, and `iptables` are all not installed. The active firewall is `nftables`:

```nft
table inet filter {
    chain input {
        type filter hook input priority filter; policy drop;
        iifname "lo" accept
        ct state established,related accept
        ct state invalid drop
        tcp dport 22 accept
        tcp dport 80 accept
        tcp dport 443 accept
    }
    chain forward { type filter hook forward priority filter; policy accept; }
    chain output  { type filter hook output  priority filter; policy accept; }
}
```

Clean default-deny inbound; loopback unrestricted; only 22/80/443 reachable from the network. This is exactly what should be there.

## 4. TLS / certificates ⚠ recurring maintenance

### 4.1 Live cert (what a browser sees)

```
subject:    CN=nfhistory.nanofab.utah.edu
issuer:     C=US, O=Let's Encrypt, CN=E7
notBefore:  Mar 25 02:33:02 2026 GMT
notAfter:   Jun 23 02:33:01 2026 GMT
```

That's **24 days remaining at snapshot time**. Standard 90-day Let's Encrypt cert.

### 4.2 Cert paths in use

From `/etc/nginx/sites-enabled/untools`:
- `ssl_certificate /etc/letsencrypt/live/nfhistory.nanofab.utah.edu/fullchain.pem;`
- `ssl_certificate_key /etc/letsencrypt/live/nfhistory.nanofab.utah.edu/privkey.pem;`

The `live/` directory is a symlink farm into `archive/`. Renewals create new `cert<N>.pem`/`fullchain<N>.pem` files and re-point the symlinks. Several older numbered copies are still in `archive/` — that's normal and not a problem.

### 4.3 Renewal automation

| Item | Value |
|------|-------|
| Mechanism | `certbot.timer` (systemd timer) + `/etc/cron.d/certbot` (no-op under systemd) |
| Cadence | Twice daily, randomized within the period |
| Next firing | `Fri 2026-05-29 12:54:51 MDT` (31 minutes after capture) |
| Last run | `Fri 2026-05-29 11:10:02 MDT` (1h 13m before capture) |
| certbot version | `4.0.0-2` (from dpkg) |
| Account | `acme-v02.api.letsencrypt.org` (production) + staging account exists |
| Renewal conf | `/etc/letsencrypt/renewal/nfhistory.nanofab.utah.edu.conf` |

No deploy/pre/post hooks are configured under `/etc/letsencrypt/renewal-hooks/`. nginx is not reloaded by a hook; it presumably picks up the new cert on its next scheduled reload, or `certbot` calls `systemctl reload nginx` directly via its packaged config. Worth verifying once.

## 5. nginx

| Item | Value |
|------|-------|
| Version | `nginx/1.26.3` (Debian `1.26.3-3+deb13u2`) |
| OpenSSL (build vs run) | built 3.5.4 / running 3.5.5 |
| Service status | Active (running) since `Tue 2026-02-24 12:09:20 MST` (3 months) |
| Worker model | `worker_processes auto; worker_connections 768;` |
| User | `www-data` |
| Logs | access at `/var/log/nginx/access.log`; error at `/var/log/nginx/error.log` |
| Rotation | daily, keep 14, compressed (see §7) |
| Error log tail | empty during capture window |
| Vhosts enabled | `/etc/nginx/sites-enabled/default` and `/etc/nginx/sites-enabled/untools` |
| TLS protocols allowed | `TLSv1.2 TLSv1.3` (SSLv3, TLSv1.0, TLSv1.1 dropped) |
| `server_tokens` | off (no version leak) |

### 5.1 The `untools` vhost

```nginx
server {
    listen 443 ssl;
    server_name nfhistory.nanofab.utah.edu;

    ssl_certificate     /etc/letsencrypt/live/nfhistory.nanofab.utah.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nfhistory.nanofab.utah.edu/privkey.pem;

    location = /chem {
        return 308 /chem/;
    }

    location ^~ /chem/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_redirect off;
    }
}
```

The `^~ /chem/` and root `/` both pass to `127.0.0.1:5000`. The split exists so a future change can route `/chem/*` to a different upstream without affecting the rest of the site.

### 5.2 The `default` vhost (problem)

The Debian stock `default` site is still enabled on port 80. It serves `/var/www/html/index.nginx-debian.html` (or returns 404). There is no `return 301 https://$host$request_uri;` block. Users typing `http://nfhistory.nanofab.utah.edu/` get the default Debian welcome page instead of being redirected to the real site. **Finding #7.**

### 5.3 Recent access-log volume

`/var/log/nginx/access.log` rotated copies range ~60 KB to ~260 KB per day compressed — light traffic. 14-day retention is plenty.

## 6. Systemd services

### 6.1 Running services (filtered)

| Service | Why it's there |
|---------|----------------|
| `nginx.service` | Reverse proxy |
| `postgresql@17-main.service` | Chemical inventory database (LOCAL — finding #6) |
| `ssh.service` | Remote access |
| `cron.service` | Scheduled jobs (certbot etc.) |
| `systemd-timesyncd.service` | NTP |
| `NetworkManager.service` | Networking |
| `php8.4-fpm.service` | **Unused — finding #9** |
| `wpa_supplicant.service` | Wi-Fi supplicant — likely vestigial on a server |
| `accounts-daemon`, `colord`, `polkit`, `power-profiles-daemon`, `udisks2`, `upower`, `switcheroo-control`, `rtkit-daemon`, `low-memory-monitor` | Stock desktop-environment-flavored leftovers from the Debian install; harmless, low memory |
| `dbus`, `systemd-journald`, `systemd-logind`, `systemd-udevd`, `systemd-timedated`, `user@1000.service` | Standard systemd plumbing |

23 services running total.

### 6.2 No cleanroom service units

A grep for `flask|nanofab|nfhistory|chem|hsc|downloader|gunicorn` against `systemctl list-unit-files` returned **no matches**. The Flask app and HSCDownloader are **not** managed by systemd — they live in tmux only. **Finding #2.**

### 6.3 Failed units

```
apache2.service  not-found  failed  failed  apache2.service
```

`apache2` is not installed; this is a stale unit reference. Clear with `systemctl disable --now apache2 2>/dev/null; systemctl reset-failed apache2`. **Finding #8.**

### 6.4 Timers

| Timer | Cadence | Last run | Activates |
|-------|---------|----------|-----------|
| `certbot.timer` | 2×/day | 2026-05-29 11:10:02 | Cert renewal |
| `apt-daily.timer` | daily | 2026-05-29 09:56:01 | apt update (no upgrade) |
| `apt-daily-upgrade.timer` | daily | 2026-05-29 06:26:30 | upgrade (no-op without unattended-upgrades config — finding #5) |
| `logrotate.timer` | daily | 2026-05-29 00:50:48 | Log rotation |
| `dpkg-db-backup.timer` | daily | 2026-05-29 00:00:07 | dpkg DB backup (not data backup) |
| `fwupd-refresh.timer` | every ~24h | 2026-05-29 11:35:37 | Firmware update DB refresh |
| `phpsessionclean.timer` | every 30m | 2026-05-29 12:09:02 | Old PHP-session cleanup (unused) |
| `anacron.timer` | hourly | 2026-05-29 11:33:12 | Catch missed cron jobs |
| `man-db.timer` | daily | 2026-05-29 09:31:21 | Rebuild man-page index |
| `systemd-tmpfiles-clean.timer` | daily | 2026-05-28 15:18:14 | `/tmp` cleanup |
| `e2scrub_all.timer` | weekly | 2026-05-24 03:11:02 | Filesystem health |
| `fstrim.timer` | weekly | 2026-05-25 01:10:41 | TRIM for SSD |

### 6.5 The non-systemd long-running services (from the 2026-06-01 phelan snapshot)

The Flask app and HSCDownloader are kept alive by tmux, not systemd. Confirmed live state:

| tmux session | Created | Panes / processes | Working dir |
|--------------|---------|-------------------|-------------|
| `flaskserver` | Tue Nov 4 2025 16:11:52 | pane 1 → `python` (pid 319076); pane 2 → `bash` (pid 2261577) | `/home/phelan/server/UNanofabTools` (pane 1); `/home/phelan` (pane 2) |
| `downloader` | Wed Aug 27 2025 16:38:22 | pane 1 → `vim HSCDownloader.py` (pid 71953); pane 2 → `python3` running `HSCDownloader.py` (pid 48188) | `/home/phelan/server/UNanofabTools` |

The actual listener processes (live `ps` output filtered to `phelan`):

| pid | uptime | command | what |
|-----|--------|---------|------|
| `2665755` | 13d 21h | `python run.py` | The Flask app — bound to `127.0.0.1:5000`. This is what nginx proxies to. |
| `323636` | 187d 17h | `python3 HSCDownloader.py` | The downloader. Note: uses `python3`, not `python`. |
| `71953` | 257d 22h | `vim HSCDownloader.py` | Stale editor session in the `downloader` tmux — see known-issues #19. |

The pid in the listener (2665755) doesn't match the tmux pane pid (319076) for `flaskserver` because the running Flask process predates the current pane's shell — a previous tmux pane that's since been replaced started it. Functionally, the website is alive; structurally, this is normal for a long-running tmux-supervised setup. Once the services are under systemd (finding #2), this kind of pid drift goes away.

## 7. Log rotation

`/etc/logrotate.d/` contents and per-package policy:

| Drop-in | Path(s) | Cadence | Keep | Compress |
|---------|---------|---------|------|----------|
| `nginx` | `/var/log/nginx/*.log` | daily | 14 | yes (delay) |
| `certbot` | `/var/log/letsencrypt/*.log` | weekly | 12 | yes |
| `postgresql-common` | `/var/log/postgresql/*.log` | weekly | 10 | yes (delay) |
| `php8.4-fpm` | `/var/log/php8.4-fpm.log` | weekly | 12 | yes (delay) |
| `apt` | `/var/log/apt/{term,history}.log` | monthly | 12 | yes |
| `alternatives`, `dpkg` | monthly | 12 | yes (delay) |
| `bootlog`, `sane-utils` | daily | 7 | yes |
| `btmp`, `wtmp`, `wtmpdb` | monthly/yearly | 1/4 | no |
| `ppp` | weekly | 4 | yes |

Global default in `/etc/logrotate.conf`: weekly, keep 4, no compression. Individual drop-ins override as above.

**There is no rotation entry for any Flask app log or HSCDownloader log.** If those programs log to a file (the survey couldn't see them from root), they will grow without bound. Address when re-running as `phelan`.

## 8. Patching

| Item | Value |
|------|-------|
| `apt-daily.timer` and `apt-daily-upgrade.timer` | active |
| `unattended-upgrades` config (`20auto-upgrades`) | **not present** on the box — finding #5 |
| `50unattended-upgrades` | **not present** on the box |
| `apt list --upgradable` at capture | empty (no pending) |
| `needrestart` | not installed |

apt is checking for updates but not installing them automatically *on the box itself*. **University IT runs patching out-of-band** (this is part of their VM management); the Nanofab team should confirm IT's scope and decide with them whether to also enable `unattended-upgrades` here. Kernel updates require a reboot after install; once finding #2 (systemd-managed Flask + downloader) is in place, a reboot is safe because the services come back automatically.

## 9. SSH posture

OpenSSH version: `OpenSSH_10.0p2 Debian-7+deb13u2, OpenSSL 3.5.5 27 Jan 2026`.

Effective `sshd -T` highlights:

| Setting | Value | Note |
|---------|-------|------|
| `port` | 22 | |
| `permitrootlogin` | `without-password` | **Finding #3** — IT-owned root key path |
| `passwordauthentication` | `no` | ✓ key-only |
| `pubkeyauthentication` | `yes` | ✓ |
| `kbdinteractiveauthentication` | `no` | ✓ |
| `permitemptypasswords` | `no` | ✓ |
| `x11forwarding` | `yes` | likely unused, low risk |
| `allowtcpforwarding`, `allowagentforwarding` | `yes` | defaults |
| `maxauthtries` | 6 | |
| `maxsessions` | 10 | |
| `usepam` | yes | |
| `clientaliveinterval` | 0 | no keepalive — sessions can linger |
| `usedns` | no | ✓ (faster auth) |

### 9.1 Root account's authorized keys — IT-owned

```
/root/.ssh/   (mode drwx------ root:root)
authorized_keys   mode -rw-rw-r--   (445 bytes, owner root:root)
  2048 SHA256:goTi8zTLdq6Pe8l/AMz/0kPCH28y7KMqT8m/LGloVbU root@iceolate.eng.utah.edu (RSA)
```

`iceolate.eng.utah.edu` is **university IT's administrative access host**. Root SSH on `nfhistory` is intentional and required for IT-side maintenance (kernel patching, the off-host backup pipeline). The key in `/root/.ssh/authorized_keys` belongs to IT — the Nanofab team **does not modify or revoke it**. If `iceolate` changes its key, IT will install the new one.

The file mode is `-rw-rw-r--` (world-readable), which is a small information leak (anyone with a shell can see which key authorizes root). Since `/root/` is IT-owned, the fix is to **open a ticket with IT** asking them to `chmod 600 /root/.ssh/authorized_keys` and to investigate the deploying tool's umask. **Finding #4.**

### 9.2 Recent logins

`last` output covers May 8 → May 29 2026. Pattern:

- `phelan` from `155.98.111.{59,89,125}` — CADE-pool addresses, consistent with the documented Nanofab access path (laptop → CADE → `nfhistory`).
- `root` from `155.98.110.9` — this is **IT's administrative host** (the same `iceolate.eng.utah.edu` per the key comment in §9.1). Routine IT maintenance, three sessions in May totaling under 40 minutes. Not unaccounted access.

`wtmpdb begins Fri May 8 13:15:36 2026`, so older login history is not retained. Consider raising the retention if forensic timeline ever matters.

### 9.3 `phelan`'s authorized keys (from the 2026-06-01 phelan snapshot)

```
/home/phelan/.ssh/   (mode drwxr-x--- phelan:phelan)
authorized_keys       mode -rw------- (1035 bytes, owner phelan:phelan)   ✓ correctly 600
id_ed25519            mode -rw------- (411 bytes)        ✓ correctly 600
id_ed25519.pub        mode -rw-r--r-- (99 bytes)
known_hosts           mode -rw------- (1562 bytes)
known_hosts.old       mode -rw-r--r-- (142 bytes)
```

Seven keys are trusted to log in as `phelan`:

| Fingerprint | Type | Comment |
|-------------|------|---------|
| `SHA256:f/THYYK14vhnmVJVzDVsi/kcshWuLEan4xKmXAPWBKI` | ED25519 | `u0911926@utah.edu` |
| `SHA256:Dxwbd+6cD4JH/beDahvEKagAb69ELr0CKdeKbEVEIkA` | ED25519 | `u0911926@utah.edu` |
| `SHA256:/AmVN0CiT8MJuyHEnu3KA31GRVzatv4YTzR8qUQBL1Q` | ED25519 | `u0911926@utah.edu` |
| `SHA256:hX4b47xntr725o3U5r9nPi8EaDvBTlXlSHpwpWUPvZk` | ED25519 | `cade-to-nfhistory` |
| `SHA256:ytvtvJV+1mkY48sQDvHp/9vU1tv/95rgeGuAQfQWrTM` | RSA 2048 | `rsa-key-20250917` |
| `SHA256:VmQRwiTuDsvWoK7kyCkBOvLVPcxdwe5hAsIbBM3QJQQ` | ED25519 | `u6048391@utah.edu` |
| `SHA256:CZb00Mvy/WdN0cJ2ULTGWBQtAXGsi4GrBdL2KmSjT70` | ED25519 | `cade-to-nfhistory` |

Three identities present:

- **`u0911926@utah.edu`** — three keys. Likely multiple devices or generations for one person; consider pruning to one when next-rotating.
- **`u6048391@utah.edu`** — one key, one person.
- **`cade-to-nfhistory`** — two generic-comment keys. These are the ones used for the documented CADE → `nfhistory` hop; both should be retained as long as `cade-to-nfhistory` is the access mechanism.
- **`rsa-key-20250917`** — one 2048-bit RSA key generated Sept 2025. Comment is generic; would benefit from clearer attribution.

`phelan` also has its own SSH **identity keypair** (`id_ed25519` / `id_ed25519.pub`) — meaning the box can SSH *out* to somewhere as well. Worth confirming what that's used for and documenting it. Likely candidates: pulling code from a git remote, or pushing data to a research-storage host.

`~/.ssh/known_hosts` is populated (1562 bytes) — consistent with outbound SSH having been used. `known_hosts.old` is a smaller (142 byte) backup from earlier.

## 10. PostgreSQL (chem inventory) — LOCAL

The survey **confirms** PostgreSQL is on this same machine:

| Item | Value |
|------|-------|
| Version | PostgreSQL 17.9 (Debian 17.9-0+deb13u1) |
| Service unit | `postgresql@17-main.service` (active) |
| Bind | `127.0.0.1:5432` and `[::1]:5432` (localhost only) |
| Listener PID | 1908562 |

Connection details from the Flask app's `.env` were not captured by either survey run yet. The root-side run couldn't read `phelan`'s home; the first phelan-side run looked for the pre-correction install path instead of `~/server/UNanofabTools/.env`. The script has been patched and the next `phelan`-side run will fill this in. The Flask config (`config/config.py`) defaults `CHEM_PGHOST` to `localhost`, which is consistent with what's bound.

**Live DB inventory (table list, sizes, row counts) was not captured** — re-run as `phelan` to populate. The known-issues file flags the schema-drift question against `chem_schema.sql` + `chem_schema_migration_v2.sql`.

## 11. Things the current snapshots still did not capture

The following sections are still blank or incomplete. The root run could not read `phelan`'s home; the first `phelan` run still looked for the pre-correction install path for some sections. Re-run the patched script as `phelan` to populate them:

- Python venv at `~/server/UNanofabTools/venv` (or `.venv`) and its `pip freeze`. There is no separate HSCDownloader install directory — `HSCDownloader.py` is co-located in the same directory as `run.py`.
- Drift between the live venv and the committed `requirements.txt`.
- Flask app file tree (`~/server/UNanofabTools/instance`, `~/server/UNanofabTools/.env` key names, recent app logs).
- SQLite databases (sizes, table lists, row counts).
- Live chem DB inventory (`\dt`, sizes — requires reading `.env`).
- Data trees: `LogData/`, `HSCDATA/`, `uploads/` sizes and freshness.
- tmux sessions for `phelan` (root sees `/tmp/tmux-0/`, phelan's are at `/tmp/tmux-1000/`).
- `phelan`'s `authorized_keys` (different from root's, listed in §9).

Next run: `ssh nfhistory` as `phelan`, then `bash ~/survey_nfhistory.sh | tee /tmp/nfhistory_survey_phelan_$(date +%F).txt`. Once it's in `snapshots/`, fold the new sections into §10 and the rest below.

## 12. Installed packages of interest

| Package | Version | Notes |
|---------|---------|-------|
| `nginx` / `nginx-common` | `1.26.3-3+deb13u2` | OK |
| `postgresql-17` / `postgresql-client-17` | `17.9-0+deb13u1` | OK |
| `python3` / `python3.13` | `3.13.5-1` / `3.13.5-2` | OK |
| `sqlite3` | `3.46.1-7+deb13u1` | OK |
| `tmux` | `3.5a-3` | OK |
| `certbot` / `python3-certbot` / `python3-acme` / `python3-josepy` | `4.0.0-2` | OK |
| `openssh-server` / `openssh-client` / `openssh-sftp-server` | `1:10.0p1-7+deb13u2` | OK |
| `cron` / `logrotate` | `3.0pl1-197` / `3.22.0-1` | OK |
| `python3-cryptography`, `python3-bcrypt`, `python3-cffi-backend` | misc | system-level; the Flask app likely uses its own venv copies |

Three Python interpreters are present:

```
python3      -> /usr/bin/python3       -> Python 3.13.5
python3.12   -> /usr/local/bin/python3.12 -> Python 3.12.0   ← built/installed by hand somewhere
python3.13   -> /usr/bin/python3.13    -> Python 3.13.5
```

The hand-installed `python3.12` under `/usr/local/bin` is worth a note — find out why it's there, whether anything depends on it, and document or remove.

## 13. Backups

**On-box: none. Off-box: handled by university IT.**

What the survey *can* see (nothing local):
- No `borg`, `restic`, `duplicity`, `rsnapshot`, `bacula`, `amanda`, `rdiff-backup` installed.
- No `rsync`/`scp` cron jobs.
- `/var/backups` contains only the Debian-stock backups of `alternatives`, `apt.extended_states`, and similar metadata. **Not data backups.**
- `dpkg-db-backup.timer` is firing daily — backs up the dpkg DB, not anything cleanroom.

What the survey *cannot* see (handled off-host by IT):
- University IT operates a VM-level backup of `nfhistory`. The Nanofab team does not run it and cannot see it from inside the VM. The catastrophic-loss scenario (disk fails or VM lost) is therefore already mitigated.
- **Action item for the next maintainer:** confirm the scope with IT and write it in here. Specifically:
  - cadence (likely nightly snapshot + weekly retention; verify)
  - retention window (how many days/weeks/months back you can request a restore for)
  - what's included — at minimum the Nanofab team wants confirmation that `/home/phelan/` (the SQLite DBs in `instance/`, `uploads/`, `LogData/`, `HSCDATA/`) **and** the local PostgreSQL data dir (typically `/var/lib/postgresql/17/main/`) **and** `/etc/letsencrypt/` are inside the snapshot.
  - restore procedure — who to call, how long the SLA is, whether file-level vs. whole-VM restore is possible.
- Once the above is confirmed, replace this list with the actual answers so a future maintainer doesn't have to ask again.

What the Nanofab team could add (optional second tier):
- A nightly `pg_dump cheminventory` into `/home/phelan/backups/` for a quick local restore that doesn't require an IT ticket.
- A Nanofab-owned `restic` or `borg` push to a Nanofab-controlled destination (research-storage NFS, a Nanofab-owned object store) for independence from IT's pipeline.
- Only worth building if the IT restore SLA is too slow for the Nanofab team's tolerance.

**Finding #1** (recast as Low / future option once IT scope is confirmed).

## 14. Outbound notifications / mail

No `sendmail`, `msmtp`, `postfix`, `exim`, `ssmtp` installed. `postfix` and `exim4` both reported `inactive` to `systemctl is-active`. There is no path for the box to email a human when something breaks. **Finding #11.**

## 15. Cron jobs

User crontab for `root`: empty.

`/etc/cron.d/` files inspected:
- `anacron` — daemon kick (under systemd this is a no-op)
- `certbot` — `0 */12 * * * root … certbot -q renew …` (no-op under systemd; `certbot.timer` is the live mechanism)
- `e2scrub_all` — filesystem checks
- `php` — old PHP-session cleanup (works against the `php8.4-fpm` install)
- `sysstat` — `5-55/10 * * * *` and `59 23 * * *` for `sa1`/`sa2` activity metrics

`/etc/cron.{hourly,daily,weekly,monthly}` contents are stock: `0anacron`, `apt-compat`, `dpkg`, `logrotate`, `man-db`, `sysstat`.

**No cleanroom-specific cron entries.** The Flask app and HSCDownloader don't have any scheduling — both rely on long-running loops inside their tmux sessions.

## 16. Performance baseline at snapshot

- Uptime: 290 days 23 hours
- Load average: 0.00 / 0.00 / 0.00 (idle)
- Memory: 950 MiB used of 5.8 GiB
- Disk: 8.5 GB used of 29 GB
- nginx process memory: 9.3 MiB (peak 94 MiB)
- nginx CPU time consumed since service start: 11min 26s

A very lightly-loaded box.

## 17. Snapshot history

| Date | Surveyor | As user | Headline |
|------|----------|---------|----------|
| 2026-05-29 | Faith | root | Initial capture. Confirmed Postgres is local and seeded the first live-server findings. Phelan-side follow-up still needed for user-owned paths. |
| 2026-06-01 | Faith | phelan (no sudo) | **Discovered install path**: `/home/phelan/server/UNanofabTools/`, not the previously assumed home-level path. Both tmux sessions alive (`flaskserver` 7 mo old, `downloader` 9 mo old). Both processes confirmed running (Flask 14d, downloader 187d). `phelan` has 7 authorized keys + outbound SSH identity. Surfaced stale 257-day `vim` in the downloader session. Script was patched after this snapshot — next run will pick up the venv / `.env` / SQLite / data tree sections. |

When re-running:

```sh
# as phelan, on nfhistory
bash ~/survey_nfhistory.sh | tee /tmp/nfhistory_survey_phelan_$(date +%F).txt

# back to laptop, then pull via CADE (mirror the snapshot-fetch command):
mkdir -p ~/code/work/documentation/UNanofabTools/liveserver/snapshots && \
ssh -i ~/.ssh/CADE phelanh@lab1-10.eng.utah.edu 'scp nfhistory:/tmp/nfhistory_survey_phelan_\*.txt ~/' && \
scp -i ~/.ssh/CADE 'phelanh@lab1-10.eng.utah.edu:~/nfhistory_survey_phelan_*.txt' \
    ~/code/work/documentation/UNanofabTools/liveserver/snapshots/
```

Then add a row to this table describing what changed.

---

## Related

- Access procedure: `../serveraccess/README.md` (reference path: ../serveraccess/README.md)
- Layman version: `../../../presentation/UNanofabTools/liveserver/README.md` (reference path: ../../../presentation/UNanofabTools/liveserver/README.md)
- Findings to fix: `../../../known-issues/UNanofabTools/liveserver.md` (reference path: ../../../known-issues/UNanofabTools/liveserver.md)
- The script that produces these snapshots: `survey_nfhistory.sh` (reference path: survey_nfhistory.sh)
- Raw snapshots used here: `snapshots/nfhistory_survey_root_2026-05-29.txt` (reference path: snapshots/nfhistory_survey_root_2026-05-29.txt) and `snapshots/nfhistory_survey_phelan_2026-06-01.txt` (reference path: snapshots/nfhistory_survey_phelan_2026-06-01.txt)


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/hscdownloader/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# HSC Downloader — Developer Documentation

Reference for `HSCDownloader.py`: the scheduled ETL that pulls per-machine form data from the CORES n8n webhook and writes the `HSCDATA` CSVs the machine portal renders. Bugs/tech debt: `known-issues/UNanofabTools/hscdownloader.md`.

## 1. Role in the system

```
CORES n8n webhook ──HTTP GET (Bearer token)──► HSCDownloader.py
   per service_id                                   │ pandas reshape
                                                    ▼
                              HSCDATA/<Machine>_DataCollection.csv  (full)
                              HSCDATA/small_<Machine>_DataCollection.csv  (trimmed)
                                                    │
                                                    ▼
                  Flask machines blueprint / legacy server read small_*.csv → tables + graphs
```

HSCDownloader is the **upstream feeder** for the machine pages. It does not touch the application database; its only outputs are CSV files in `DATA_DIR`.

## 2. Configuration (top of file)

```python
DATA_DIR = os.path.join(script_dir, 'HSCDATA')
AUTH     = 'Bearer <redacted-cores-bearer-token>'        # CORES API token (hard-coded — see known-issues)
URLBASE  = 'https://n8n.cores.utah.edu/webhook/custom_form_data_dump?service_ids='
```

Uses `requests`, `pandas`, `numpy`, `schedule`, plus `signal`/`sys` for graceful shutdown.

## 3. Core functions

- `downloadFile(url) -> DataFrame`
  GETs `URLBASE + <service_id>` with `Authorization: Bearer ...`, `json.loads` the response, and `pd.json_normalize`s it into a DataFrame.
- `ensureExists(fileName)`
  Guarantees both `HSCDATA/<fileName>` and `HSCDATA/small_<fileName>` exist (creates empty files if not).
- `retrieveData(deviceName) -> DataFrame`
  Maps a machine name to its CORES **service_id** and calls `downloadFile`. This is the master machine→ID table (e.g. ALD, Ebeam, MOCVD, Parylene, PECVD, Denton635, Denton18, TMV, DRIE, Isotropic, Plasmalab, PlasmaTherm, Technics, CleanOx, DopedOx, LTO, Nitride, Poly, Allwin → numeric IDs `761`…`845`). A couple are annotated `CURRENTLY HAS NO DATA`. A machine can be present in `retrieveData` without being called by the scheduled `save()` loop.
- `shortenStr(fullStr, val)`, `combineCells(cell1, cell2)`
  String/column helpers used while reshaping.
- `save<Machine>()` — one per implemented tool (`saveALD`, `saveEbeam`, `saveMOCVD`, `saveParylene`, `savePECVD`, `saveDenton635`, `saveDenton18`, `saveTMV`, `saveDRIE`, `saveIsotropic`, `savePlasmalab`, `savePlasmaTherm`, `saveTechnics`, `saveCleanOx`, `saveDopedOx`, `saveLTO`, `saveNitride`, `savePoly`, `saveAllwin`)
  Each: `retrieveData` → select/rename/format the columns relevant to that tool → write the full CSV and a `small_` CSV into `DATA_DIR`. The `small_<Machine>_DataCollection.csv` files are what the portal reads.
- `save()`
  Orchestrator that calls the active `save<Machine>()` functions. `savePECVD()` is defined but currently commented out in `save()`, so PECVD data is not refreshed by the scheduled loop unless that line is re-enabled.
- `graceful_exit(signum, frame)` + `runForever()`
  Signal-handled main loop using the `schedule` library to run `save()` periodically until terminated cleanly.

## 4. The machine → service_id map

The numeric `service_ids` in `retrieveData` are the contract with CORES. If CORES changes a tool's ID, that machine's data silently stops updating. Keep this map documented and in sync with CORES. (Service IDs observed in the source span ~`761`–`845`.)

## 5. Output contract with the portal

The portal expects `HSCDATA/small_<Machine>_DataCollection.csv` with the columns each machine page graphs (e.g. ALD: `Film Deposited`, `Deposition Mode`, `Chuck Temperature (C)`, `Measured Thickness (nm)`, `Number of Cycles`, plus the temperature columns the page plots). Changing a `save<Machine>()` function's output columns can break the corresponding machine page or its graphs — keep them aligned with `app/services/data_service.py` and the `machines` blueprint.

## 6. Operational notes

- Runs as a long-lived process (a service / scheduled host), driven by `schedule` + `runForever`.
- Designed to stop cleanly on signal (`graceful_exit`).
- Network/auth failures: `downloadFile` does minimal error handling — a CORES outage or token rotation will surface as exceptions / empty data. Add retry/alerting if reliability matters.
- It writes to the same `HSCDATA` directory the server reads; ensure both run with consistent paths/permissions.

## 7. Maintenance / recommendations

- **Move the Bearer token out of source** into an environment variable / `.env` (it's currently committed in cleartext). See known-issues.
- **Centralize the machine→service_id map** (a dict/table) instead of a long if/elif in `retrieveData`; document each ID.
- **Reduce per-machine duplication**: the `save<Machine>()` functions repeat a lot of structure; a config-driven approach (per-machine column spec) would shrink the file dramatically.
- **Add retries + logging/alerting** around `downloadFile` so silent data staleness is detected.
- **Finish `changedData()`** (marked `#TODO`) if change-detection/incremental updates are wanted.
- **Confirm whether PECVD should run**: `savePECVD()` exists, but `save()` currently comments it out. Re-enable only after checking the CORES response and expected portal columns.
- Keep output columns in lockstep with the portal's expectations (§5).

## 8. Relationship to other tools

- Feeds the **flaskserver** (and legacy **hscdisplayerserver**) machine pages via `HSCDATA`.
- Talks to the **same CORES n8n system** as `NanofabToolkit/PreciousMetalReader` (different webhook/service IDs).

See the layman guide at `presentation/UNanofabTools/hscdownloader/README.md`.


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/filetransfer/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# File-Transfer Scripts — Developer Documentation

Reference for the per-machine log-shipping scripts. They run on each tool's Windows control PC and push recently changed logs to the server over SSH via PuTTY's `pscp`. Bugs/tech debt: `known-issues/UNanofabTools/filetransfer.md`.

## 1. Overview

| File | Lang | Scheduling | Notes |
|------|------|-----------|-------|
| `FileTransferTemplate.ps1` | PowerShell | self-loop to midnight | Master template; copy + customize per machine |
| `ALDTransfer.ps1` | PowerShell | self-loop (next run ~daily) | ALD instance; refined relative-path handling |
| `Dent635Transfer.ps1` | PowerShell | self-loop | Denton 635 instance |
| `CTRFurnaceTransfer.ps1` | PowerShell | self-loop | Furnace instance |
| `CTRFurnaceTransfer.bat` | Batch (cmd) | Windows Task Scheduler (run-once) | Windows XP-compatible furnace version |

Destination: `pscp` over SSH (port 22) to `nfhistory.nanofab.utah.edu`, into `/Users/phelanh/Desktop/Logs/<MACHINE>`. The legacy server's `/download` route (and the Flask `machines` blueprint) read from a `LogData/`/`Desktop/Logs/` tree fed by these uploads.

## 2. Common structure (PowerShell template)

`FileTransferTemplate.ps1` defines the pattern; the per-machine files are edited copies.

### 2.1 Single-instance lock
```powershell
$mutexName = "Global\ALDTransferScriptMutex"
$mutex = New-Object System.Threading.Mutex($false, $mutexName)
if (-not $mutex.WaitOne(0, $false)) { ...exit... }
```
A named mutex prevents concurrent runs. **Note:** the template and ALD copy use `ALDTransferScriptMutex`; other machine copies have started diverging to machine-specific names. Keep new copies machine-specific so the name matches the script.

### 2.2 Per-machine configuration (edit these)
```powershell
$logFilePath    = "...\script\log.txt"      # this script's own log
$sshServer      = "nfhistory.nanofab.utah.edu"
$sshPort        = 22
$sshUsername    = "phelanh"                  # personal account (see known-issues)
$watcherPath    = "C:\...\Logfile"           # folder to watch
$pscpPath       = "C:\Program Files\PuTTY\pscp.exe"
$privateKeyPath = "C:\Users\...\.ssh\id_rsa.ppk"
$remotePath     = "/Users/phelanh/Desktop/Logs/<MACHINE>"
```

### 2.3 `Send-Files`
```powershell
$files = Get-ChildItem -Path $watcherPath -Recurse |
         Where-Object { $_.LastWriteTime -ge (Get-Date).AddDays(-1) }
foreach ($file in $files) {
    # compute relative path under $watcherPath, map "\" -> "/"
    $pscpArguments = "-P", $sshPort, "-i", "`"$privateKeyPath`"",
                     "`"$($file.FullName)`"",
                     "${sshUsername}@${sshServer}:`"$remotePathWithRelativePath`""
    Start-Process -FilePath $pscpPath -ArgumentList $pscpArguments -NoNewWindow -Wait
}
```
Selects files with `LastWriteTime` within the past 24h and `pscp`s each, preserving sub-directory structure under `$remotePath`.

> **Relative-path handling differs between files.** The template uses a simple `-replace [regex]::Escape($watcherPath)`; `ALDTransfer.ps1` uses a more careful `Substring(...).TrimStart('\')` + backslash→forward-slash conversion. The ALD version is the corrected one — fold its logic back into the template. See known-issues.

### 2.4 Scheduling loop
```powershell
Send-Files                              # run once at start
while ($true) {
    $next = [datetime]::Today.AddDays(1)   # midnight (ALD: guards if already past)
    Start-Sleep -Seconds ($next - (Get-Date)).TotalSeconds
    Send-Files
}
```
The script runs immediately, then sleeps until the next midnight and repeats. The `finally` block releases/disposes the mutex.

## 3. Batch version (`CTRFurnaceTransfer.bat`)

For Windows XP furnace PCs that can't run modern PowerShell. Differences:
- **Run-once** (no self-loop) — intended to be invoked by the Windows Task Scheduler on a schedule.
- Lock via a file in `%TEMP%\FurnTransferScript.lock` instead of a mutex.
- Walks the watched dir with `for /f ... in ('dir /s /b /a-d ...')` and `pscp`s each file (no 24-hour filter — it processes all files each run).
- Logs to `%logFilePath%`; checks `%ERRORLEVEL%` after each transfer.

Config block at the top mirrors the PowerShell variables (`watcherPath`, `pscpPath`, `privateKeyPath`, `remotePath`, `sshServer/Port/Username`).

## 4. Prerequisites on the machine PC
- PuTTY installed (`pscp.exe`).
- A PuTTY-format private key (`.ppk`) authorized for `phelanh@nfhistory`.
- The watched folder path correct for that tool.
- For `.bat`: a Windows Scheduled Task to invoke it.

(There is an end-user setup guide in the repo root: `FileTransferSetup.md`.)

## 5. Maintenance / recommendations
- **Remove the personal-account dependency**: replace the `phelanh` CADE login with either (a) a dedicated UNIX service account on `nfhistory` — this is an IT ticket because University IT controls account creation, or (b) a purpose-bound SSH key authenticating as the shared `phelan` server account (Nanofab-side only, no IT involvement; pair it with `command=` and `restrict` options in `authorized_keys` to limit it to the ingest path). Affects every file plus the server-side destination path. See `known-issues/UNanofabTools/filetransfer.md` #1 and `known-issues/UNanofabTools/serveraccess.md` #1 for the operational-boundary discussion.
- **Unify path logic**: backport `ALDTransfer.ps1`'s relative-path handling into the template and the other instances.
- **Prefer Task Scheduler over self-loops**: the `while($true)` loop is fragile (a crash stops uploads until someone notices); the `.bat`'s run-once + scheduler model is more robust. Consider converting the PowerShell ones similarly.
- **Mutex naming**: keep each machine's mutex name distinct, and update the template so new copies do not inherit the ALD name.
- **Error handling**: the PowerShell `Send-Files` doesn't check `pscp` exit codes (the `.bat` does) — add it.

See the layman guide at `presentation/UNanofabTools/filetransfer/README.md`.


# Read-Aloud Documentation Corpus: documentation/NanofabToolkit/PicoHelperTools/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# PicoHelperTools — Developer Documentation

Canonical reference for the MicroPython firmware running on the cleanroom's Raspberry Pi Pico W boards. The NanofabToolkit copies are the **current** versions; older copies in `UNanofabTools/Particle_sensor.py` etc. are kept for reference and should be considered superseded.

Bugs/tech debt: `known-issues/NanofabToolkit/PicoHelperTools.md`. Server-side endpoints documented in `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md`.

## 1. Files

| File | Sensor(s) | Endpoint | Notes |
|------|-----------|----------|-------|
| `Particle_sensor.py` | SPS30 (I²C, addr `0x69`) | `POST /particle-data` | Single-sensor production firmware |
| `DHT22_sensor.py` | DHT22/AM2302 (1-wire on `Pin(DATA_PIN)`) | `POST /env-data` | Temperature/humidity only |
| `sensor_combined.py` | SPS30 + DHT22 | `POST /sensor-data` | Newest pattern — both sensors, one POST per cycle |

All three are written to be **headless-friendly**: they don't require a USB serial host, recover from common failure modes, and use a watchdog so a wedged loop self-resets.

Target hardware: Raspberry Pi Pico W (RP2040 + CYW43 WiFi). MicroPython runtime.

## 2. Common patterns (read once, applies to all three)

### 2.1 `safe_print` / `log_error`
```python
def safe_print(*args, **kwargs):
    try:
        print(*args, **kwargs)
    except Exception:
        pass  # USB serial not connected — discard
```
`safe_print` swallows any exception from `print` so a missing USB host can't crash the program. `log_error(msg)` appends to `error_log.txt` (`error_log_dht.txt` for the DHT-only firmware), capping the file at ~4 KB by reopening in `"w"` mode once it exceeds that size — prevents flash exhaustion on a long-running headless deploy.

### 2.2 `sleep_with_wdt(total_s, step_s=1)` *(DHT and combined)*
Sleeps in `step_s` chunks, calling `_wdt.feed()` between chunks so the watchdog doesn't fire during a legitimate long wait (the next scheduled send, for instance). `Particle_sensor.py` uses a slightly different inline pattern with the same effect.

### 2.3 Scheduled sending
- `SCHEDULED_SENDING = True` (default): use `calculate_next_send_time()` to align with the wall clock at `SEND_INTERVAL_MINUTES` boundaries (default 15) — every Pico fires at `:00`, `:15`, `:30`, `:45`.
- `False`: free-running on `MEASUREMENT_PERIOD_S`.

### 2.4 Clock sync
- `TIME_SYNC_ENABLED = True`, `TIME_SYNC_INTERVAL_HOURS = 6`.
- NTP servers (in order): `time.google.com`, `pool.ntp.org`, `time.nist.gov`.
- Server expects Unix epoch. The RP2040 epoch is `2000-01-01`, so payloads add `MICROPYTHON_TO_UNIX_EPOCH = 946684800` before sending.
- `UTC_OFFSET_HOURS = -7` (MST). **This is not DST-aware** — flip to `-6` for daylight time.

### 2.5 WiFi / network
- `WIFI_SSID = "ULink"`, `WIFI_PASSWORD = "<redacted-wifi-password>"` — **hard-coded in cleartext in each file**. See known-issues; prefer the `from picopass import passWD` pattern used by `UNanofabTools/PicoConnect.py`.
- `connect_wifi()` builds a `network.WLAN(STA_IF)`, retries with status reporting, returns a boolean.
- Combined and DHT firmware additionally include `reset_wifi()` that disconnects, deactivates, reactivates, and reconnects; if reconnect fails, calls `machine.reset()`.

### 2.6 Per-board identity
`ROOM_NAME` and `SENSOR_NUMBER` (and `DEVICE_ID` in the combined firmware) are baked into each file before flashing. They travel in every payload as the server's key for `(room, sensor)`. Sample values committed: Particle `("HEADLESS", "009")`, DHT `("DHT", "010")`, Combined `("COMBINED", "011")` — change per board.

### 2.7 LED & error codes
Onboard LED (`Pin("LED", Pin.OUT)`) blinks status. The Particle and combined firmware include `led_error_code(error_type)` patterns for distinct fault classes (WiFi, sensor, send).

## 3. `Particle_sensor.py` — SPS30 → `/particle-data`

### 3.1 Driver

`class SPS30` with I²C command pointers from the datasheet:

| Pointer | Action |
|---------|--------|
| `PTR_START_MEAS = 0x0010` | Start measurement; write `[0x03, 0x00, CRC]` for big-endian IEEE-754 float output |
| `PTR_STOP_MEAS = 0x0104` | Stop measurement |
| `PTR_DATA_RDY = 0x0202` | Read 3 bytes (2 data + CRC); flag at byte[1] |
| `PTR_READ_VALUES = 0x0300` | Read 60 bytes — 10 floats × (2 + CRC + 2 + CRC) |

`_crc8_word(b0, b1)` implements the Sensirion CRC-8 (poly `0x31`, init `0xFF`). `read_measured_values_float()` returns 10 floats in this order: `mass_PM1, mass_PM2_5, mass_PM4, mass_PM10, num_PM0_5, num_PM1, num_PM2_5, num_PM4, num_PM10, typical_particle_size_um`.

### 3.2 Diagnostics
`scan_i2c_devices(i2c)`, `test_i2c_connection(i2c, addr)`, `test_dns_resolution()`, `test_network_connectivity()`, `configure_dns()` — boot-time self-tests that surface the most common failure modes via `safe_print` and LED codes.

### 3.3 Payload (`send_to_api`)
Computes converted `#/ft³` (`CM3_TO_FT3 = 28316.8`) and the differential-bin breakdown, then builds:
```json
{
  "room_name": "...",
  "sensor_number": "...",
  "timestamp": <Unix epoch float>,
  "raw_measurements": { "mass_pm1": ..., "mass_pm2_5": ..., ... ,
                        "num_pm0_5": ..., ..., "typical_particle_size_um": ... },
  "converted_values": {
    "number_concentrations_ft3": { "pm0_5": ..., "pm1": ..., ..., "pm10": ... },
    "differential_bins_ft3":     { "bin_0_3_to_0_5": ..., ..., "bin_4_0_to_10": ... },
    "mass_concentrations_ug_m3": { "pm1": ..., ..., "pm10": ... }
  }
}
```
This is exactly what the server's `api.receive_particle_data` expects. The function has fallback URLs (HTTP/IP/local) commented out for testing.

### 3.4 `main()`
Boot self-tests → `connect_wifi` → NTP sync → loop forever: at the next scheduled time, `read_measured_values_float()` → `send_to_api(vals)` → handle errors with LED codes; fatal failures call `machine.reset()`.

## 4. `DHT22_sensor.py` — DHT22 → `/env-data`

### 4.1 Wiring
DHT22 pin 2 (data) → `Pin(DATA_PIN)` with a 4.7 kΩ pull-up to 3V3. `DATA_PIN = 2` (GP2) by default.

### 4.2 Read
```python
def read_dht22(sensor):
    sensor.measure()
    return sensor.temperature(), sensor.humidity()
```
DHT22 needs ≥ 2 s between reads; `MEASUREMENT_PERIOD_S = 30` is safe.

### 4.3 Payload (`send_to_api`)
```json
{
  "room_name": "...",
  "sensor_number": "...",
  "timestamp": <Unix epoch float>,
  "temperature_c": 21.4,
  "humidity_pct": 38.2
}
```
All five fields are required by the server. Response 200 expected.

### 4.4 `main()`
Watchdog: `WDT(timeout=8300)`. Boot → `connect_wifi` (fatal → `machine.reset()`) → NTP sync (best effort) → loop: read every `MEASUREMENT_PERIOD_S`, send at the next scheduled boundary (`SCHEDULED_SENDING = True`), `sleep_with_wdt(...)` to wait. `reset_wifi()` is invoked on persistent failures.

## 5. `sensor_combined.py` — SPS30 + DHT22 → `/sensor-data`

The newest firmware; combines both sensors on one Pico, posts a single message per cycle. SPS30 driver and DHT helper are the same as the standalone files, with shared timing.

Defaults: `MAX_CONSECUTIVE_FAILURES = 5`, `WIFI_RESET_INTERVAL_MS = 24*3600*1000` (full WiFi cycle every 24 h), `HTTP_TIMEOUT_S = 5`, `HTTP_SEND_RETRIES = 2`, optional watchdog (`ENABLE_WATCHDOG = False` by default — flip on for production).

### 5.1 Payload
A combined `/sensor-data` payload (server: `api.sensor_data_post`):
```json
{
  "room_name": "...", "sensor_number": "...",
  "timestamp": <Unix epoch float>,
  "temperature_c": ..., "humidity_pct": ...,
  "raw_measurements": { ... },     // identical SPS30 shape
  "converted_values": { ... }      // identical SPS30 shape
}
```
The server writes particle history to `LogData/particle_sensors/<id>_historical.csv`, env history to `LogData/env_sensors/<id>_historical.csv`, and upserts the latest row in `particle_sensor_data`.

> Server-side gotcha: `GET /sensor-data` reads `LogData/sensors/<id>_combined.csv`, which the POST does **not** write. Historical lookups use `/particle-data?...` / `/env-data?...` instead. Tracked in the flaskserver issues file (#1).

## 6. Conventions & maintenance

- **Add a new sensor by copying the closest existing file** (`sensor_combined.py` is the modern template), changing the driver and the payload, updating the per-board identity, and adding a matching server endpoint if needed.
- **Don't add WiFi credentials to the firmware in clear text** — adopt `from picopass import passWD` so `picopass.py` can be `.gitignore`d. The lab WiFi password rotates separately from device rollouts.
- **Watchdog discipline**: every long wait should go through `sleep_with_wdt` (or its inline equivalent). Don't add blocking calls that bypass it.
- **Timestamps**: always add `MICROPYTHON_TO_UNIX_EPOCH` before sending. The server expects Unix epoch.
- **DST**: flip `UTC_OFFSET_HOURS` to `-6` in daylight time. A proper fix is server-side (store UTC, present in display layer).
- **Per-board identity** is the only field that should change between deployments — keep the rest in lockstep.

## 7. Relationship to other tools

- **Consumer:** the `ParticleSensor` (reference path: ../ParticleSensor/README.md) desktop viewer reads the same `(room, sensor)` keys these Picos populate.
- **Server side:** see `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md` §8.2–§8.4 for the matching endpoints.
- **Older versions:** `UNanofabTools/Particle_sensor.py` (and similar) are earlier copies retained for historical reference. The NanofabToolkit files are the ones to flash today.

See the layman guide at `presentation/NanofabToolkit/PicoHelperTools/README.md`.


# Read-Aloud Documentation Corpus: documentation/NanofabToolkit/ParticleSensor/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# ParticleSensor — Developer Documentation

Canonical reference for the PyQt5 desktop particle-data viewer in `NanofabToolkit/ParticleSensor/`. This is the **current** copy; an older copy in `UNanofabTools/particle_data_viewer.py` is retained for historical reference and should be considered superseded.

Bugs/tech debt: `known-issues/NanofabToolkit/ParticleSensor.md`. Server endpoints: `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` §5.6 and `08-integrations-and-data-contracts.md` §8.2–§8.4.

## 1. Files

| File | Role |
|------|------|
| `main.py` | Bootstraps the Qt application, instantiates `ParticleDataViewer`. |
| `src/gui.py` | Main window, cleanroom-map grid, data table, `RoomFrame` with env-data sub-boxes, `HistoricalDataWindow` drill-down. |
| `src/ParticleSensor.py` | Reusable API + processing classes — `ParticleDataAPI`, `ParticleDataProcessor`. |
| `src/assets/icon.ico` | Windowed executable icon. |

Dependencies: `PyQt5`, `requests`, `pytz`, `matplotlib` (Qt5Agg backend, including `NavigationToolbar2QT`). Frozen with PyInstaller.

## 2. Server contract

Reads from the Flask `api` blueprint:

- `GET /particle-data` → `{ status, count, sensors: [ParticleSensorData.to_dict()...] }` — the current snapshot used to populate the map + table.
- `GET /particle-data?room_name=X&sensor_number=Y` → historical CSV data for one sensor (the drill-down chart).
- `GET /env-data?room_name=X&sensor_number=Y` → historical temp/humidity for the corresponding env sensor.

All calls use `verify=False` (internal CA) with `warnings.filterwarnings('ignore', message='Unverified HTTPS request')` to silence noise.

## 3. `src/ParticleSensor.py` — reusable API/data helpers

### 3.1 `convert_to_mountain(dt)`
Adds a fixed **+7 h offset** to incoming server datetimes before localizing to `MOUNTAIN_TZ = pytz.timezone('US/Mountain')`. The comment notes this corrects a discrepancy observed in the API data. **This is a workaround** — the server stores naive timestamps without timezone info; the proper fix is server-side. See known-issues.

### 3.2 `class ParticleDataAPI`
```python
class ParticleDataAPI:
    def __init__(self, api_url="https://nfhistory.nanofab.utah.edu/particle-data"):
        self.api_url = api_url

    def fetch_current_data(self, timeout=5):
        response = requests.get(self.api_url, verify=False, timeout=timeout)
        response.raise_for_status()
        return response.json()

    def fetch_historical_data(self, room_name, sensor_number, timeout=10):
        url = f"{self.api_url}?room_name={room_name}&sensor_number={sensor_number}"
        response = requests.get(url, verify=False, timeout=timeout)
        response.raise_for_status()
        return response.json()
```
- Each method raises `Exception(f"Error fetching ... data: {str(e)}")` on transport failure and `Exception("Invalid JSON response from server")` on a parse error.
- Default API URL: production (`https://nfhistory.nanofab.utah.edu/particle-data`). Override in the constructor for testing.
- The pattern (small class, just two methods) makes the API reusable outside the GUI — e.g. from a script or future automation.

### 3.3 `class ParticleDataProcessor`
Static formatters; `format_timestamp(ts)` accepts an ISO string (handles `Z` → `+00:00`) or a Unix float, runs it through `convert_to_mountain`, and returns `'%Y-%m-%d %H:%M:%S %Z'`. Other static helpers normalize fields and compute room status (covered by `gui.py`).

## 4. `src/gui.py` — the main window

### 4.1 `convert_to_mountain` (mirrors the API helper)
Same +7 h workaround as §3.1. **Two copies exist** — keep them in sync (or factor to one place). Tracked in known-issues.

### 4.2 `class RoomFrame(QFrame)`
A custom widget that represents one cleanroom room/bay on the map.

- Outer `QFrame` whose background color reflects particle status: `"yellow"` (no data), `"red"` (alert), `"green"` (OK). Colors live in `self.colors`.
- Inside, a **top env strip** holding two small inner squares — `temp_frame` and a humidity frame — each with two `QLabel`s (name and value). Inner squares use one of:
  - `_ENV_YELLOW = "background-color: #FFFF99; ..."` (no env data yet)
  - `_ENV_HAS_DATA = "background-color: #A8D8A8; ..."` (env sensor is reporting)
- This sub-box design is **new in this canonical version** (the older UNanofabTools copy only colored the whole room).

### 4.3 `class ParticleDataViewer(QMainWindow)`
- Builds the room map as a grid of `RoomFrame`s (`room_name` → frame in `self.room_frames`).
- Builds the live `QTableWidget` for the latest reading per sensor; rows are filterable/sortable.
- A toolbar with **Refresh**, a date picker for historical drill-down, a **Save / Export** action that hands off to `QFileDialog` and writes CSV via `csv` stdlib.
- Refresh path: `ParticleDataAPI.fetch_current_data()` → iterate `response["sensors"]` → look up by normalized `room_name` → color the matching `RoomFrame` + update its env sub-boxes + populate the table row.
- Double-click row / sensor → opens `HistoricalDataWindow` for that `(room_name, sensor_number)`.

### 4.4 `class HistoricalDataWindow(QMainWindow)`
- Calls `ParticleDataAPI.fetch_historical_data(room, sensor)`; renders a matplotlib `FigureCanvas` embedded in the window.
- Crucially, includes the standard `NavigationToolbar2QT` (Home / Pan / Zoom / Subplots / Save). No custom mouse-zoom code; this replaces the click-and-drag implementation in the older UNanofabTools viewer.
- Optional env-data overlay if env history is present (`/env-data?...`).

## 5. Differences vs. `UNanofabTools/particle_data_viewer.py`

These are the meaningful changes; preserve them when porting any future patches:

- **Env-data sub-boxes inside each `RoomFrame`.** New; the older copy had a single-color room.
- **Real `pytz` timezone handling.** Newer; the older copy uses a hand-rolled `timedelta(hours=7)`.
- **Standard matplotlib `NavigationToolbar2QT`** in the historical window. Replaces the custom click-drag zoom in the older copy.
- **Cleaner separation** between API/processing (`ParticleSensor.py`) and the GUI (`gui.py`). The older copy mixed concerns.
- **Better exception messages** from `ParticleDataAPI` (includes the underlying transport error).

## 6. Operational notes

- **Production URL is hard-coded** (`https://nfhistory.nanofab.utah.edu/particle-data`). Override at instance construction if needed.
- **TLS verification is disabled** (internal CA); standard internal-network tradeoff. Re-enable once the CA ships with the executable's trust store.
- **No automated tests**; mock-based contract tests against `ParticleDataAPI` would lock in the server contract.
- **PyInstaller build**: capture the spec and command in the repo README so a successor can rebuild the .exe.

## 7. Conventions & maintenance

- **`(room_name, sensor_number)` is the data key** end-to-end. The map labels in `init_ui` must match the values the Picos send (see `PicoHelperTools`); a renamed room or relabeled board silently breaks coloring.
- **Drop the +7 h hack at the source.** Make server timestamps timezone-aware; this app and its UNanofabTools sibling can then convert correctly with `pytz`/`zoneinfo` alone.
- **Externalize the API URL and the cleanroom-map layout** (env var / settings file) so renames/relocations are a config change.
- **Pick a canonical copy** and retire the divergent UNanofabTools version, or extract a shared package.

## 8. Relationship to other tools

- **Producers:** `PicoHelperTools` (reference path: ../PicoHelperTools/README.md) — the Pico firmware that populates the data this viewer displays.
- **Server side:** `documentation/UNanofabTools/flaskserver/` — the Flask app that holds the data and serves the endpoints.
- **Older sibling:** `UNanofabTools/particle_data_viewer.py` — historical reference only.

See the layman guide at `presentation/NanofabToolkit/ParticleSensor/README.md`.


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# UNanofabTools — Known Issues & Technical Debt

Private working list of bugs, gaps, security concerns, and tech debt for every tool in the repository. Kept deliberately outside the layman presentation and the successor documentation trees so the handoff materials stay clean — this is the to-do list for whoever maintains the code, not part of what gets handed to a new audience.

One file per tool, mirroring the per-tool folders in `../presentation/UNanofabTools/` and `../documentation/UNanofabTools/`.

## Files

| File | Tool | Highest-severity item |
|------|------|------------------------|
| `flaskserver.md` (reference path: flaskserver.md) | The current Flask website | Chem-inventory schema drift; chem write routes unauthenticated |
| `hscdownloader.md` (reference path: hscdownloader.md) | CORES → HSCDATA ETL | CORES Bearer token hard-coded in source |
| `picofirmware.md` (reference path: picofirmware.md) | Raspberry Pi firmware *(older copies — canonical: `NanofabToolkit/PicoHelperTools`)* | WiFi credentials hard-coded; two unique scripts non-functional as written |
| `particlepctools.md` (reference path: particlepctools.md) | Desktop particle viewer *(older copy — canonical: `NanofabToolkit/ParticleSensor`)* + test generator | Generator can accidentally target production |
| `filetransfer.md` (reference path: filetransfer.md) | Per-machine log uploaders | Transfers depend on a personal SSH account |
| `dattools.md` (reference path: dattools.md) | DATfixer + DATgrapher | Binary `.DAT` format parsed by magic bytes with no validation |
| `utilities.md` (reference path: utilities.md) | Standalone helpers | `init_chem_db.py` doesn't build a complete chem database |
| `serveraccess.md` (reference path: serveraccess.md) | SSH access + tmux sessions | tmux is the only supervisor; shared `phelan` is a structural constraint (IT controls user creation); hard-coded IP |
| `liveserver.md` (reference path: liveserver.md) | Findings from the live `nfhistory` surveys | Flask/downloader not under systemd; chem Postgres verified local on `nfhistory`; a handful of IT-bound items (root `authorized_keys` mode, optional unattended-upgrades) |
| `hscdisplayerserver.md` (reference path: hscdisplayerserver.md) | Legacy monolithic server | Run-in-parallel with the Flask app; deprecate and retire |

## How to use this folder

Each file lists items with severity (High / Medium / Low), a brief description, the risk, and a suggested fix — plus a priority order at the bottom. Nothing in these files has been changed in the code yet; they're recommendations, not changelogs.

A few items recur across tools and may be worth treating as cross-cutting initiatives:

- **Secrets in source.** Hard-coded WiFi passwords (`picofirmware`), a CORES Bearer token (`hscdownloader`), and Duo keys imported from a Python module (`hscdisplayerserver`) all belong in environment variables / a protected store, with the secrets themselves rotated.
- **The chem-database schema drift.** The committed `.sql` files are behind the live database; `init_chem_db.py` (in `utilities`) doesn't produce a complete database from scratch; the `flaskserver` issues list enumerates the missing columns/tables. Reconciling this is one project, not several.
- **Personal-account / individual-developer dependencies.** The `filetransfer` scripts log in as a personal CADE account; `fetch_ssh.py` in `utilities` is a personal dev tool. The Nanofab-side fix is a purpose-bound SSH key authenticating as the shared `phelan` server account (no IT involvement). A cleaner long-term fix — a dedicated UNIX service account — has to come from University IT, since the Nanofab team has `sudo` as `phelan` but cannot `useradd`.
- **The IT / Nanofab operational boundary.** Several findings (root SSH from `iceolate`, per-user UNIX accounts, the off-host backup, `unattended-upgrades`, kernel patching) sit on **University IT's** side of the line. The Nanofab admin's tools are `sudo` as `phelan` plus an IT ticket; nothing under `/root/` and no `useradd` is available. Each known-issues file tags items "Nanofab-actionable" vs "IT ticket" so the punch list is honest about who has to do what.
- **The legacy server.** `hscdisplayerserver` is documented for reference but should be retired in favor of the Flask app; until then, confirm which server is actually live so patches go to the right place.

Severity labels follow a shared convention: **High** = breaks functionality or is a real security exposure · **Medium** = correctness / maintainability problem · **Low** = cosmetic / cleanup. Items that depend on IT cooperation are tagged in-place so they don't muddy the Nanofab-side priority order.


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/liveserver.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Live Server — Known Issues & Findings from Snapshot

Issues surfaced by the read-only surveys of `nfhistory` on **2026-05-29** as `root` (`documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_root_2026-05-29.txt` (reference path: ../../documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_root_2026-05-29.txt)) and **2026-06-01** as `phelan` (`documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_2026-06-01.txt` (reference path: ../../documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_2026-06-01.txt)).

Severity: **High** = breaks functionality, security exposure, or operational silent-failure · **Medium** = correctness / maintainability problem · **Low** = cleanup / cosmetic.

Where an item also appears in `serveraccess.md` (the more general access-and-ops issues list), it's noted; the entries here add the specific evidence from this snapshot.

---

### 1. Nanofab-side backups (IT already handles the base layer) — Low / future option
- **Status:** the survey didn't find any locally-installed backup tooling (`borg`, `restic`, `duplicity`, `rsnapshot`) or cron jobs, but **the base backup is run by university IT off the box**. The Nanofab team has visibility into what IT backs up via the IT relationship; it's not a Nanofab-managed pipeline. So the existential-loss scenario is already mitigated — this finding is no longer a "High" because the survey can't see what IT runs from outside.
- **What IT covers (to confirm with IT):** the VM-level backup snapshots the cleanroom data trees (`~/server/UNanofabTools/instance/`, `uploads/`, `LogData/`, `HSCDATA/`) and the local PostgreSQL data directory along with the rest of the filesystem.
- **What the Nanofab team could add later (optional):** a Nanofab-owned secondary tier so a restore doesn't depend solely on opening a ticket with IT. Examples: a nightly `pg_dump cheminventory` into `/home/phelan/backups/` (also covered by IT's snapshot), plus a periodic `restic`/`borg` push to a Nanofab-owned destination. Worth doing only if the loss tolerance for a restore window matters.
- **Action:** confirm the IT backup scope with the IT contact, write the answer into `documentation/UNanofabTools/liveserver/README.md` §13 so the next maintainer doesn't re-flag this, and decide whether the Nanofab-side secondary tier is worth building.

### 2. No service supervision for the Flask app or HSCDownloader — High
- **Where:** `systemctl list-unit-files | grep -iE '(flask|nanofab|nfhistory|chem|hsc|downloader|gunicorn)'` returned nothing. The Flask process (PID 2665755 listening on `127.0.0.1:5000`) is running as `python` directly, not as a systemd service. Same pattern for the downloader.
- **Risk:** if either process exits, the tmux pane returns to a prompt and the *service is silently down* until a human notices. A reboot loses both. There is no automatic restart and no logging through `journalctl` for either.
- **Fix:** add two systemd units, e.g. `flaskserver.service` and `hscdownloader.service`, with `Restart=on-failure`, `WantedBy=multi-user.target`, `User=phelan`, and `WorkingDirectory=/home/phelan/server/UNanofabTools`. For the current live layout, use `/home/phelan/server/UNanofabTools/venv/bin/python run.py` (or the gunicorn command from `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`) for Flask, and `/home/phelan/server/UNanofabTools/venv/bin/python3 HSCDownloader.py` for the downloader. `HSCDownloader.py` is co-located with `run.py`; there is no separate HSCDownloader install directory. Keep tmux around as a debugging convenience only.

### 3. Root SSH is IT's access path — Info (boundary of responsibility)
- **Where:** `sshd -T` shows `permitrootlogin without-password`. `/root/.ssh/authorized_keys` has one active 2048-bit RSA key from `root@iceolate.eng.utah.edu`.
- **Reality:** `iceolate.eng.utah.edu` is **university IT's administrative access host**. Root SSH is enabled on `nfhistory` because IT requires it for the maintenance they own (kernel patching, the off-host backup pipeline, etc.). The Nanofab team does not have root on `nfhistory`; admin tasks from the Nanofab side are done via `sudo` as `phelan`. The key in `/root/.ssh/authorized_keys` belongs to IT — **do not modify or revoke it without coordinating with IT** or you will lock IT out of the box.
- **Action:** document this boundary in the live-server doc (§9.1) so a future maintainer understands that the root-SSH "finding" is intentional, not a hole. Nothing to fix in the SSH config itself.

### 4. `/root/.ssh/authorized_keys` mode is `-rw-rw-r--` — Medium (ask IT)
- **Where:** snapshot shows `-rw-rw-r-- 1 root root 445 Aug 11 2025 authorized_keys`.
- **Risk:** OpenSSH tolerates `664` (it only refuses world-writable) but the file is world-readable, so any shell user on the box can see which key has root. Minor information leak.
- **Action:** the Nanofab team does not own `/root`. Open a ticket with IT asking them to `chmod 600 /root/.ssh/authorized_keys` and to investigate the umask of whatever deployment tool created it `664`. Track the request here until resolved.

### 5. No `unattended-upgrades` configured — High (security)
- **Where:** `/etc/apt/apt.conf.d/20auto-upgrades` and `/etc/apt/apt.conf.d/50unattended-upgrades` are both absent. `apt-daily.timer` runs and updates the package list, but nothing applies the upgrades.
- **Risk:** security patches for nginx, OpenSSL, OpenSSH, PostgreSQL accumulate until a human runs `apt upgrade`. At 290 days uptime, that "human" hasn't been around recently for kernel updates either.
- **Fix:**
  ```sh
  apt install unattended-upgrades apt-listchanges
  dpkg-reconfigure -plow unattended-upgrades   # answer Yes
  ```
  Then verify `/etc/apt/apt.conf.d/50unattended-upgrades` allows security upgrades, and consider enabling `Unattended-Upgrade::Automatic-Reboot "false";` (or set a time window) to avoid surprise reboots.

### 6. The chem PostgreSQL DB is local on this VM — Low/Info (verified; core docs corrected)
- **Where:** snapshot shows `postgresql@17-main.service` running, listening on `127.0.0.1:5432`. The Flask config's `CHEM_PGHOST` defaults to `localhost`. There is no remote DB connection.
- **Status:** the core Flask docs now reflect the live state: `documentation/UNanofabTools/flaskserver/01-architecture.md` shows PostgreSQL on the same VM and `documentation/UNanofabTools/flaskserver/04-database-schema.md` identifies `postgresql@17-main` bound to `127.0.0.1:5432`.
- **Risk:** future edits could regress to the older off-box database mental model, especially when adapting greenfield deployment templates that allow a remote Postgres via `CHEM_PGHOST`.
- **Action:** keep the live-server and flaskserver docs framed as **local Postgres on `nfhistory`**. Treat remote Postgres wording only as an option for non-production/greenfield deployments, not as a description of the live cleanroom server.

### 7. Plain HTTP `:80` does not redirect to HTTPS — Medium
- **Where:** `nginx -T` shows the Debian `default` site is still enabled on port 80 and serves `/var/www/html`. The `untools` vhost only listens on `:443`.
- **Risk:** `http://nfhistory.nanofab.utah.edu/` shows the default Debian welcome page, which looks broken. Bookmarks, hardcoded URLs in tools, and people who omit `https://` all see this.
- **Fix:** replace the contents of `/etc/nginx/sites-enabled/default` with a redirect-only server block:
  ```nginx
  server {
      listen 80 default_server;
      listen [::]:80 default_server;
      server_name _;
      return 301 https://$host$request_uri;
  }
  ```
  Reload nginx. Verify with `curl -I http://nfhistory.nanofab.utah.edu/`.

### 8. Phantom `apache2.service` in failed state — Low (noise)
- **Where:** `systemctl --failed` shows `apache2.service not-found failed`.
- **Risk:** muddies routine "is everything OK?" checks; an operator might miss a real failure in the noise.
- **Fix:** `systemctl disable --now apache2 2>/dev/null; systemctl reset-failed apache2`. If a unit file lingers, `apt purge apache2*` (carefully — nothing actually depends on it here).

### 9. `php8.4-fpm` running but unused — Low
- **Where:** `php8.4-fpm.service` is active running; `/etc/cron.d/php` purges PHP sessions every 30 minutes. Nothing in the cleanroom site is written in PHP.
- **Risk:** wastes a small amount of memory and a process slot; one more attack surface for no functional gain.
- **Fix:** confirm nothing depends on it (`grep -R fastcgi_pass /etc/nginx/`), then:
  ```sh
  systemctl disable --now php8.4-fpm
  apt purge php8.4-fpm php8.4-common
  ```
  Remove `/etc/cron.d/php` if apt leaves it behind.

### 10. Current TLS cert expires 2026-06-23 (24 days at snapshot) — Low/Info
- **Where:** live `:443` cert `notAfter=Jun 23 02:33:01 2026 GMT`.
- **Risk:** none today — `certbot.timer` is firing twice daily and the renewal account is in good standing. Flagged so the maintainer has a date to keep an eye on if they're auditing post-snapshot.
- **Fix:** none required. Tip: `certbot certificates` prints expiry and renewal config; check it after the next renewal to confirm a new `cert<N>.pem`/`fullchain<N>.pem` rotation actually happened.

### 11. No outbound notification path — Medium
- **Where:** no MTA installed; `postfix` and `exim4` both `inactive`. No webhook tooling.
- **Risk:** the server can detect that something is wrong (e.g. cert about to expire, disk filling, service failed) but has no way to tell a human.
- **Fix:** simplest path is `msmtp` + a `from` set to an alias the team can monitor. More robust: a tiny `curl`-based Slack/Teams webhook sender invoked from cron and from systemd's `OnFailure=`. Once the supervisor in finding #2 is in place, wire `OnFailure=` to it.

### 12. `wpa_supplicant.service` running on a server — Low
- **Where:** snapshot shows `wpa_supplicant.service active running`. A wired server has no need for a Wi-Fi supplicant.
- **Risk:** marginal — extra process, irrelevant unit.
- **Fix:** `systemctl disable --now wpa_supplicant.service`. Confirm `ens33` stays up afterwards (it should — NetworkManager handles wired).

### 13. Vestigial desktop daemons running — Low
- **Where:** snapshot shows `accounts-daemon`, `colord`, `polkit`, `power-profiles-daemon`, `udisks2`, `upower`, `switcheroo-control`, `rtkit-daemon`, `low-memory-monitor` — all desktop-environment plumbing.
- **Risk:** ~50–100 MiB of memory and a handful of process slots for nothing useful.
- **Fix:** safe to disable, one at a time, with `systemctl disable --now <unit>` and verify after each. Low priority — only worth it if you also clean up #9 and #12 in the same maintenance window.

### 14. Hand-installed `python3.12` in `/usr/local/bin` — Low
- **Where:** `python3.12 -> /usr/local/bin/python3.12 -> Python 3.12.0`. Not from apt.
- **Risk:** unknown — why was it installed, is anything depending on it, will it shadow `python3` in someone's PATH and surprise them?
- **Fix:** find out who put it there. If nothing uses it, remove (`make uninstall` from its build dir, or just delete). If something uses it, document it here.

### 15. 290-day uptime / no recent reboot — Low/Medium
- **Where:** `uptime`: 290 days. Kernel is `6.12.38` from 2025-07-16; Debian 13.4 will likely have shipped a newer kernel by now.
- **Risk:** running on an old kernel means missed CVE patches. A controlled reboot is needed to load a new one.
- **Fix:** schedule a maintenance window. Before rebooting, **first** put findings #2 (systemd-managed Flask + downloader) in place so the post-reboot service comes back automatically. Without #2, the reboot leaves the website down until a human re-attaches the tmux session.

### 16. `wtmpdb` history starts 2026-05-08 — Low
- **Where:** `wtmpdb begins Fri May 8 13:15:36 2026`. Earlier login history isn't available.
- **Risk:** if a forensic question ever comes up about who was on the box before May 2026, the answer is "we don't know."
- **Fix:** consider raising `wtmpdb`'s retention (in `/etc/logrotate.d/wtmpdb`; currently `yearly … rotate 4` so up to 4 years should be kept once enough data accumulates). Low priority unless required for compliance.

### 17. Survey path mismatch — partially captured — Low (snapshot completeness; script now patched)
- **History:** the first survey ran as root and missed the `phelan`-side files. The second ran as `phelan` (2026-06-01) but **still** missed venvs / `.env` / SQLite tables / data trees because the script hardcoded the pre-correction home-level install path whereas the actual install is at `~/server/UNanofabTools/` (discovered via tmux `cwd` in that same snapshot).
- **Status:** the script has been patched to auto-discover `INSTALL_ROOT` from the live `~/server/UNanofabTools` path and the `/opt`/`/srv` deployment candidates. The next `phelan`-side run will populate the gaps.
- **Fix:** re-run the patched script as `phelan` (no sudo), save to `documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_<date>.txt`, and fold the new venv/`.env`/SQLite/chem-DB/data-tree sections into `documentation/UNanofabTools/liveserver/README.md` (reference path: ../../documentation/UNanofabTools/liveserver/README.md) §10, §11, §13.

### 18. Root SSH ingress from 155.98.110.9 = IT — Info
- **Where:** `last` shows `root pts/0 155.98.110.9` three times in May 2026 (9 min, 25 min, 3 min sessions). The `phelan` logins come from `155.98.111.*` (CADE-pool); root logins come from a different subnet.
- **Reality:** `155.98.110.9` is the IP for IT's administrative host (`iceolate.eng.utah.edu`, matching the root key comment from #3). These root sessions are routine IT maintenance, not unaccounted access.
- **Action:** none. Documented as expected behavior in `documentation/UNanofabTools/liveserver/README.md` §9.2.

---

### 19. Stale `vim HSCDownloader.py` in the `downloader` tmux session — Low
- **Where:** `2026-06-01` phelan snapshot. `ps -u phelan` shows `vim HSCDownloader.py` (pid 71953) running for 257 days inside the `downloader` tmux session (pane 1). It's not the running service — the actual downloader is pid 323636 in pane 2.
- **Risk:** none functionally — vim is benign. But it consumes a process slot, locks the buffer's swap file, and is exactly the kind of "someone forgot to close this" artifact that confuses a future maintainer attaching for the first time.
- **Fix:** next time you attach to `downloader`, switch to pane 1 (`Ctrl-b q 1` or `Ctrl-b ;`) and `:q!` out of vim. Then detach with `Ctrl-b d` as usual. Nothing to do until the next attach.

### 20. Multiple keys with identical `u0911926@utah.edu` comment in `phelan`'s `authorized_keys` — Low
- **Where:** `2026-06-01` phelan snapshot, §9.3 of the live-server doc. Three ED25519 keys all carry the same `u0911926@utah.edu` comment.
- **Risk:** rotation hygiene. If those three are different generations of the same person's key, the older two should be pruned. If they're three different devices for the same person, the comments should be made specific (`u0911926@laptop`, `u0911926@desktop`, etc.) so removing one doesn't accidentally remove all.
- **Fix:** ask the person whose keys these are to confirm which are still needed and re-issue with distinguishing comments. Update the key-issuance log in lockstep.

### 21. Generic `rsa-key-20250917` comment in `phelan`'s `authorized_keys` — Low
- **Where:** `2026-06-01` phelan snapshot, §9.3. One 2048-bit RSA key with the placeholder comment PuTTYgen generates by default.
- **Risk:** if this key needs to be revoked, the comment doesn't tell you whose it is. Same offboarding-friction problem as the generic `cade-to-nfhistory` comments.
- **Fix:** trace who holds the matching private key (by fingerprint `SHA256:ytvtvJV+…`); reissue with a clearer comment; add to the issuance log.

### 22. `phelan` has an outbound SSH identity but its purpose isn't documented — Info
- **Where:** `~/.ssh/id_ed25519` + `id_ed25519.pub` + a non-trivial `known_hosts` exist in `phelan`'s home. Means the box SSHes *out* to one or more remotes.
- **Risk:** unclear ownership. If the destination ever moves or its key rotates, an outbound process will silently fail and someone has to remember what it was for. Likely uses: pulling from a git remote, pushing to research storage, the `fetch_ssh.py` dev tool.
- **Fix:** trace what uses `phelan`'s outbound SSH (grep cron, the Flask app code, `fetch_ssh.py`, the data-flow scripts), and add a §9.4 to the live-server doc describing the destinations and what they're for.

## Suggested priority order (Nanofab-owned items only)

The Nanofab team has `sudo` as `phelan` but does not have root, cannot create UNIX accounts, and does not own IT's backup / patching paths. Items #1, #3, #4, #5, #15, #18 are bounded by IT and are either already handled or require an IT ticket. Item #6 is retained as a verified live-state fact so future docs keep PostgreSQL on the same VM. The list below is what the Nanofab team can act on directly.

1. **#2** — put the Flask app and HSCDownloader under systemd. The single biggest reliability win the Nanofab team can ship on its own. Eliminates silent-failure mode for the website.
2. **#7** — add the HTTP→HTTPS redirect on `:80` (one-line nginx change via `sudo`).
3. **#11** — wire up an outbound notification path so future failures find a human.
4. **#17** — re-run the patched survey as `phelan` and finish populating the live-server doc.
5. **#8, #9, #12, #13, #14, #16, #19, #20, #21, #22** — cleanup, audit, key hygiene, and the stale vim. Bundle into one or two `sudo`-friendly maintenance windows.

Items that need IT (open a ticket):
- **#4** — request `chmod 600 /root/.ssh/authorized_keys` from IT.
- **#5** — request that IT enable `unattended-upgrades` (they may already do equivalent patching out-of-band).
- **#15** — coordinate a controlled reboot with IT for a fresh kernel; only do this AFTER #2 is in place so the services come back automatically.
- **#1** — confirm exactly what IT's backup covers (and decide whether the Nanofab team wants a secondary tier).


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/serveraccess.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Server Access — Known Issues & Technical Debt

Working list for the SSH access pattern and the two tmux sessions on `nfhistory`. Separate from the successor docs. Nothing here has been changed in the code or in the server's current setup.

Severity: **High** = operational/security risk · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Shared `phelan` account on `nfhistory` — Medium (structural constraint)
- **Where:** every Nanofab user authenticates as the same `phelan` UNIX user on the server. Per-user identity exists only as a distinct line in `/home/phelan/.ssh/authorized_keys`.
- **Reality:** **the Nanofab team cannot create UNIX accounts.** University IT owns `root` on `nfhistory`; the Nanofab admin has `sudo` as `phelan` but cannot `su` to root or `useradd` new users. The shared-account model is therefore a structural constraint imposed by IT's operational boundary, not a Nanofab implementation choice.
- **Risk (residual):** no per-user audit trail in `wtmp`/`last`/process accounting — every Nanofab action appears as `phelan`. Revocation requires editing `authorized_keys`. If a key isn't annotated with whose it is, offboarding becomes guesswork.
- **Mitigation (Nanofab-side):** keep a tightly-controlled key-issuance log in the lab binder or the Nanofab-shared password manager: name, fingerprint, date issued, date rotated, date revoked. The runbook (`§5.1` step 5) already calls for this.
- **Fix (if ever desired):** **open a ticket with University IT** asking them to create per-person UNIX accounts on `nfhistory` (e.g. `faithh`, etc.), each with `sudo` rights as needed, with `phelan` retained for the service processes. Until IT agrees, item #1 cannot be implemented from the Nanofab side.

### 2. Hard-coded server IP in every user's `~/.ssh/config` — High
- **Where:** `Hostname 155.98.11.8` in the `~/.ssh/config` block users place on CADE.
- **Risk:** if the server is renumbered (planned move, DHCP change, subnet renumber) every user's CADE config must be updated by hand. There is no DNS abstraction layer. The IP is also publicly documented now (here and in onboarding emails), which leaks an internal address.
- **Fix:** ask College of Engineering IT to register a DNS A record such as `nfhistory.eng.utah.edu` pointing at the internal IP, then change every user's config to use the name. Update this runbook in lockstep. Treat the IP itself as sensitive until the alias exists.

### 3. tmux sessions are the only process supervisor — High
- **Where:** the website (`flaskserver`) and HSCDownloader (`downloader`) run as plain `python` processes inside tmux. Nothing supervises them.
- **Risk:** if a process crashes (unhandled exception, OOM, transient bug), tmux keeps the shell open at a prompt — but the *service is down* until a human attaches and notices. A server reboot kills both sessions entirely. There is no automatic restart, no alerting, no health endpoint monitor.
- **Fix:** convert both services to `systemd` units (`flaskserver.service`, `hscdownloader.service`) with `Restart=on-failure` and a `WantedBy=multi-user.target` so they survive reboots. Keep tmux as a *debugging* convenience (attach to a `journalctl -fu flaskserver` window) rather than the supervisor of record. See `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md` for the gunicorn unit shape this should follow.

### 4. Accidental `exit` or `Ctrl-c` inside a session takes the service down — High (impact) / Low (likelihood once trained)
- **Where:** any attach. There is no guard, no `trap`, no read-only mode.
- **Risk:** a user attaches to look at logs, hits `Ctrl-c` reflexively, and silently kills the website. The layman README emphasizes `Ctrl-b d` precisely because of this.
- **Fix:** once #3 is done, this stops being a problem — killing the process triggers an automatic restart. As a stopgap, consider running the services under `tmux` with `set -g remain-on-exit on` so the pane stays visible after a crash and a watcher script can detect it. Also consider a read-only attach pattern for visitors (`tmux attach -r -t flaskserver`).

### 5. Two-hop access depends on CADE availability — Medium
- **Where:** every login flows through a CADE lab machine.
- **Risk:** if CADE is down for maintenance, the cleanroom server is unreachable, including for incident response. There is no out-of-band path documented.
- **Fix:** document a fallback (a second jump host inside the same network, or a maintenance VPN). At minimum, list which CADE machines have historically had the highest uptime so on-call staff don't burn through dead numbers.

### 6. No documented key rotation cadence — Medium
- **Where:** keys issued under §5.1 of the runbook have no expiry, no rotation policy, and no log of who holds what.
- **Risk:** an ex-employee's key remains valid until someone proactively removes it. With #1 in place, this is a single shared `authorized_keys` and tracking is on the honor system.
- **Fix:** adopt an annual rotation policy; keep a key-issuance log (name, fingerprint, date issued, date last rotated, date revoked). Use SSH certificate authority signing if/when CADE IT supports it — that gives expiring credentials automatically.

### 7. Production invocation likely differs from the documented `python run.py` — Medium
- **Where:** §4.3 of the runbook shows `python run.py` as the `flaskserver` recovery command. That is the Flask development server.
- **Risk:** if the live deployment is gunicorn (per `flaskserver/09-deployment-and-operations.md`) and a recovery uses `python run.py` instead, the server comes back up but in dev mode — single-threaded, debug-enabled, fewer workers, no proper signal handling. The site appears to work but degrades under load and exposes more in tracebacks.
- **Fix:** confirm which command the live `flaskserver` session currently runs (attach and look at process tree) and document *that* command exactly in §4.3. If it really is `python run.py`, treat that as a separate finding to migrate to gunicorn.

### 8. CADE NFS home is a single point of failure for the config — Low/Medium
- **Where:** every user's `~/.ssh/config` and `~/.ssh/nfhistory` lives in their NFS-mounted CADE home.
- **Risk:** if CADE NFS is degraded, the config can fail to load and `ssh nfhistory` will appear broken in ways unrelated to the cleanroom server. Confusing during incidents.
- **Fix:** mostly out-of-scope (CADE IT manages NFS) but worth noting in the user guide so people don't chase ghosts.

### 9. No documented "is the website actually responding?" check — Low
- **Where:** the runbook checks `tmux ls`; that confirms the *session* is alive, not that the *service* is responding.
- **Risk:** the Flask process may be wedged on a request, the gunicorn workers may be deadlocked, etc., while tmux is happy.
- **Fix:** add a `curl --max-time 5 https://nfhistory.nanofab.utah.edu/healthz` check to §4.2 (and add a `/healthz` route if it doesn't exist).

### 10. Private keys delivered out-of-band with no inventory — Low
- **Where:** §5.1 step 4 — "deliver private key via secure channel."
- **Risk:** "secure channel" is unspecified; a USB stick left in a drawer is technically secure but practically not. No record of *what* was delivered.
- **Fix:** standardize on a single delivery mechanism (e.g. age-encrypted file shared via lab password manager) and document it. Pair with the issuance log from #6.

### 11. The `Ctrl-b` prefix can clash with terminal shortcuts — Low
- **Where:** anyone attaching from a terminal that already uses `Ctrl-b`.
- **Risk:** confusing for new users; surprise key swallowing.
- **Fix:** consider standardizing on a less-conflicty prefix (e.g. `Ctrl-a`) via a server-wide `~/.tmux.conf`. Communicate the change in the runbook before doing it.

---

## Suggested priority order

Nanofab-actionable items only. Items the Nanofab team cannot resolve on its own (because they require IT) are listed separately below.

1. **#3** — put both services under `systemd`. Eliminates #4 and most of the operational fragility in one move. Doable with `sudo` from the Nanofab side.
2. **#7** — confirm the live `flaskserver` command and document the actual one.
3. **#6, #10** — formalize key issuance, rotation, and delivery (Nanofab can do this with a binder/password manager; no IT involvement needed).
4. **#5, #8, #9, #11** — robustness and cleanup.

Needs IT (open a ticket):
- **#1** — per-person UNIX accounts on `nfhistory`. Cannot be implemented from the Nanofab side; structural until IT agrees.
- **#2** — DNS A record `nfhistory.eng.utah.edu` → `155.98.11.8`. CADE IT / Eng IT controls DNS.


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/flaskserver.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# UNanofabTools Server — Known Issues & Technical Debt

Private working list for Faith. This file is intentionally **separate** from the `documentation/` folder so the successor handoff docs stay clean. It records bugs, gaps, and tech debt found while reading the code, with severity and suggested fixes. Nothing here has been changed in the code — it's a to-do list.

Severity legend: **High** = breaks functionality or is a real security exposure · **Medium** = correctness/maintainability problem · **Low** = cosmetic/cleanup.

---

## Functional bugs

### 1. `GET /sensor-data` reads a directory that `POST /sensor-data` never writes — High
- **Where:** `app/blueprints/api.py` — `sensor_data_get` reads `LogData/sensors/<room>_<sensor>_combined.csv` via `_sensor_csv_path`, but `sensor_data_post` only writes to `LogData/particle_sensors/` (via `log_historical_particle_data`) and `LogData/env_sensors/`. Nothing writes to `LogData/sensors/`.
- **Effect:** `GET /sensor-data` returns 404 for every sensor, even ones actively posting via `/sensor-data`.
- **Fix options:** (a) point `_sensor_csv_path` at `particle_sensors/`; or (b) have `sensor_data_post` also append a combined CSV to `sensors/`. Option (b) preserves the intended "combined" semantics.

### 2. `suggest()` and `autofill()` are stubs — Medium
- **Where:** `app/services/chem_service.py` — `suggest(self, field, q, limit=10)` returns `[]`; `autofill(self, catalog="", name="")` returns `{}`.
- **Effect:** `/chem/api/suggest` always returns `{"results": []}` and `/chem/api/autofill` always returns `{"data": {}}`. The Add/Edit type-ahead and catalog auto-fill UI features are dead.
- **Fix:** implement `suggest` as a `SELECT DISTINCT <field> ... WHERE <field> ILIKE :q LIMIT :n` (whitelist `field` to valid column names to avoid injection via identifier), and `autofill` as a lookup by catalog number / name returning the item's vendor/state/size/etc.

### 3. `ParalyneReader` calls a non-existent endpoint — Low
- **Where:** `NanofabToolkit/ParalyneReader/src/ParalyneReader.py` — `return_selected()` GETs `/api/paralyne/analog/return/<filename>`, which the server does not implement.
- **Effect:** that client function errors if called (the live `list`/`download` paths work).
- **Fix:** either implement a `/return/<filename>` route or remove the dead client function.

---

## Schema drift (committed SQL behind the live database)

### 4. Runtime uses columns/tables not in the committed schema files — High
- **Where:** `chem_service.py` vs `chem_schema.sql` + `chem_schema_migration_v2.sql`.
- **Missing from committed SQL but used at runtime:**
  - `containers.last_scan_at` — set in `import_scans`; read by `search_inventory` and `get_inventory_scan_coverage`.
  - `inventory_cycles` extended columns: `filename`, `performed_by`, `report_name`, `location`, `total_scanned`, `matched_count`, `unmatched_count` — written by `import_scans`; read by `get_scan_reports`.
  - `scan_raw.barcode` and `container_scans.barcode` — written by `import_scans`.
  - The entire `transactions` table (`transaction_id`, `action`, `container_id`, `barcode`, `item_id`, `room_id`, `details` JSON, `performed_by`, `created_at`) — written by `log_transaction`; read by `get_transactions`.
- **Effect:** a database built only from the committed `.sql` files is missing these; chem add/scan/report/transaction features will error on a fresh deploy. Production works only because columns were added ad-hoc over time.
- **Fix:** write a `chem_schema_migration_v3.sql` (and fold into `chem_schema.sql`) that creates all of the above, so a fresh database matches production. Suggested DDL to reconcile:
  ```sql
  ALTER TABLE containers      ADD COLUMN IF NOT EXISTS last_scan_at TIMESTAMPTZ;
  ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS filename TEXT,
                               ADD COLUMN IF NOT EXISTS performed_by TEXT,
                               ADD COLUMN IF NOT EXISTS report_name TEXT,
                               ADD COLUMN IF NOT EXISTS location TEXT,
                               ADD COLUMN IF NOT EXISTS total_scanned INTEGER,
                               ADD COLUMN IF NOT EXISTS matched_count INTEGER,
                               ADD COLUMN IF NOT EXISTS unmatched_count INTEGER;
	  ALTER TABLE scan_raw        ADD COLUMN IF NOT EXISTS barcode TEXT;
	  ALTER TABLE container_scans ADD COLUMN IF NOT EXISTS barcode TEXT;
  CREATE TABLE IF NOT EXISTS transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    action TEXT, container_id BIGINT, barcode TEXT,
    item_id INTEGER, room_id INTEGER,
    details JSONB, performed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
  (Verify column types against the live DB before applying.)

### 5. SQLite `db.create_all()` and Alembic can diverge — Medium
- **Where:** `app/__init__.py` calls `db.create_all()` every boot; `migrations/` has only one revision.
- **Effect:** new tables get created by `create_all()` without a migration, so the Alembic history doesn't fully describe the schema. Rebuilding from migrations alone may not match a running instance.
- **Fix:** treat Alembic as source of truth; generate migrations for all model changes and consider removing the reliance on `create_all()` in production.

---

## Security gaps (deliberate trade-offs for an internal tool, but worth closing)

### 6. Entire chemical inventory is unauthenticated — High
- **Where:** `app/blueprints/chem_inventory.py` imports `login_required` but never applies it to any route.
- **Effect:** anyone who can reach the server can search, add, move, edit, and remove chemical containers, and view the full audit trail.
- **Fix:** apply `@login_required` to at least the mutating routes (`add`, `move`, `move-bulk`, `remove`, `edit-container`, `upload-scans`, `barcodes/mark-printed`). Decide whether read routes stay public for kiosk use.

### 7. IoT/device endpoints are unauthenticated — Medium (acceptable on private net)
- **Where:** all of `api.py`.
- **Effect:** any host that can reach the server can POST sensor/machine data or read it. Trust is purely network-perimeter (private SSID).
- **Fix (if exposure increases):** require a shared API key header on device endpoints; reject without it.

### 8. CORS is wide open — Medium
- **Where:** `app/__init__.py` — `CORS(app)` with no origin restriction.
- **Effect:** any website's JS can call the JSON endpoints from a browser; combined with #6/#7 this widens the surface.
- **Fix:** restrict CORS to known internal origins, ideally only for the routes that need it.

### 9. Password reset uses uNID as sole secret — Medium
- **Where:** `auth.reset_password` / `auth_service.verify_user_unid`.
- **Effect:** anyone knowing a username + its uNID can reset the password; no Duo step. uNIDs are semi-public.
- **Fix:** add a Duo push (or email confirmation) to the reset flow before allowing the password change.

### 10. Login timing oracle (username enumeration) — Low
- **Where:** `auth_service.verify_user_credentials` skips bcrypt when the username is absent.
- **Effect:** non-existent usernames respond marginally faster, enabling enumeration.
- **Fix:** perform a dummy bcrypt compare on the no-user path to equalize timing.

### 11. `csv_to_html_table` does not escape cell values — Medium
- **Where:** `app/services/data_service.py`.
- **Effect:** if any machine CSV cell contained HTML/JS, it would render unescaped (stored XSS). Currently mitigated only by trusting machine-generated CSVs.
- **Fix:** `html.escape` each cell before interpolation.

---

## Inconsistencies / maintainability

### 12. Mixed persistence styles — Medium
- ORM (auth/admin/particle), raw `sqlite3` (tasks), SQLAlchemy Core (chem). Three patterns for the maintainer to learn.
- **Fix (optional):** migrate `task_service` to the ORM (the `Task`/`TaskAssignee`/`TaskFile` models already exist) for consistency.

### 13. `task_service` ignores `TASK_DATABASE_URI` — Low
- It locates `tasks.db` via its own `_get_db_path` instead of the configured URI. Changing the config var won't move the file.
- **Fix:** read the path from config, or document the coupling (done in the docs).

### 14. Duplicate `ALLOWED_EXTENSIONS` definitions — Low
- `config.ALLOWED_EXTENSIONS` vs the hardcoded set in `task_service.allowed_file` (which additionally allows `gif`). The config value is ignored by the uploader.
- **Fix:** have `allowed_file` read `current_app.config['ALLOWED_EXTENSIONS']`.

### 15. Dead code: `chem_inventory_remote.py` — Low
- Near-duplicate `chem_bp` not registered anywhere.
- **Fix:** delete it to avoid confusion (two definitions of the same `/chem/*` routes in the tree).

### 16. Empty model placeholder files — Low
- `app/models/session.py`, `task.py`, `user.py` are 0 bytes; real classes live in `app/models/__init__.py`.
- **Fix:** either split the models into these files or delete the placeholders.

### 17. Debug `print()` statements in `chem_service` — Low
- `resolve_room_id`/`_resolve_room`/`bulk_move_by_barcodes`/`container_lookup` print to stdout on normal operation (e.g. `"USING resolve_room_id"`, `"BULK MOVE FORM:"`, `"LOOKUP ROW:"`).
- **Fix:** remove or convert to `current_app.logger.debug`.

### 18. `get_reports()` in `chem_service` is unused — Low
- The `/chem/report` route calls the individual `report_*` methods; `get_reports()` is dead.
- **Fix:** remove `get_reports()` or wire the route to it.

### 19. No automated tests — Medium
- No test suite exists; all verification is manual.
- **Fix:** add pytest with the factory + a test config (see `documentation/10-development-guide.md` §10.7). Prioritize auth, path-traversal guards, device validators, chem write/transaction methods.

### 20. `delete_old_sessions` not scheduled — Low
- The cleanup function exists but nothing calls it; `sessioninfo` grows unbounded (rows are tiny).
- **Fix:** schedule via cron / a management command, or add a periodic task.

### 21. Server-side session table not consulted for auth — Low/Medium
- `sessioninfo` rows are created but access control uses the Flask-Login cookie only. Deleting a `sessioninfo` row does not log a user out.
- **Fix:** if you want server-side revocation, add a `before_request` check that the cookie's `session_id` still exists in `sessioninfo`.

---

## Suggested priority order

1. #4 schema drift (write migrations so fresh deploys work) — High
2. #6 gate chem write routes behind login — High
3. #1 fix `/sensor-data` GET/POST mismatch — High
4. #2 implement `suggest`/`autofill` — Medium
5. #8 tighten CORS, #9 strengthen password reset — Medium
6. #11 escape CSV cells — Medium
7. #19 add a test suite — Medium
8. Cleanup batch: #13–#18, #20, #21 — Low


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/hscdownloader.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# HSC Downloader — Known Issues & Technical Debt

Working list for `HSCDownloader.py`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = security / data correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. CORES API token hard-coded in source — High (security)
- **Where:** `AUTH = 'Bearer <redacted-cores-bearer-token>'`.
- **Risk:** a live credential to the university records system is committed in cleartext; anyone with repo access has it.
- **Fix:** move it to an environment variable / `.env`; rotate the token.

### 2. Minimal error handling on downloads — Medium
- **Where:** `downloadFile` does `json.loads(requests.get(...).text)` with no status check, timeout, or retry.
- **Risk:** a CORES outage, slow response, or token rotation throws or yields empty data; machine pages silently go stale.
- **Fix:** check HTTP status, add timeouts + retries, and log/alert on failure.

### 3. No staleness detection / alerting — Medium
- **Where:** the scheduled `save()` loop.
- **Risk:** if downloads start failing, nobody is notified; the website quietly shows old data.
- **Fix:** record last-successful-update per machine; alert if a machine hasn't updated in N cycles.

### 4. Machine→service_id map is brittle and buried — Medium
- **Where:** `retrieveData` is a long if/elif mapping names to numeric IDs (`761`…`845`).
- **Risk:** if CORES renumbers a service, that machine silently stops updating; the mapping is hard to audit.
- **Fix:** lift it into a documented dict/table; validate IDs at startup.

### 5. Heavy per-machine duplication — Medium
- **Where:** ~19 `save<Machine>()` functions repeat the same download/reshape/write structure.
- **Risk:** changes must be made many times; easy to let machines drift apart.
- **Fix:** drive formatting from a per-machine column spec; collapse to one generic save routine.

### 6. Output columns coupled to the portal with no contract test — Medium
- **Where:** `small_<Machine>_DataCollection.csv` columns must match what `data_service.py` / the machine pages expect.
- **Risk:** editing a `save<Machine>()` function can silently break a machine page's table or graph.
- **Fix:** a small test asserting each `small_` CSV has the columns the portal graphs.

### 7. `changedData()` is an unfinished TODO — Low
- **Where:** stubbed with `#TODO`.
- **Risk:** no incremental/change-aware updates; every cycle re-pulls and rewrites everything.
- **Fix:** finish it (compare new vs. existing) or remove it.

### 8. `breakLoop` / loop-control leftovers — Low
- **Where:** module-level `breakLoop = 0` and related control flow.
- **Fix:** clean up unused control variables; rely on the signal-based `graceful_exit`.

### 9. Some machines flagged "CURRENTLY HAS NO DATA" — Low (context)
- **Where:** comments in `retrieveData` (e.g. service IDs `844`, `845`).
- **Note:** expected empty sources, not bugs; revisit if those tools start producing data.

### 10. `savePECVD()` is implemented but not scheduled — Low/Medium
- **Where:** `savePECVD()` exists, but the `save()` orchestrator comments out the call.
- **Risk:** maintainers may assume PECVD is refreshed because the function and service-id mapping exist, while the scheduled loop never writes `small_PECVD_DataCollection.csv`.
- **Fix:** confirm whether PECVD should be active. If yes, re-enable the call and add a portal-column contract check; if no, keep it documented as intentionally disabled.

---

## Suggested priority order
1. #1 move the CORES token out of source + rotate — High
2. #2 + #3 robust downloads + staleness alerting — Medium
3. #4 + #5 centralize the machine map and de-duplicate save functions — Medium
4. #6 add a portal-column contract test — Medium
5. #7, #8, #9, #10 cleanup / activation decision — Low


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/filetransfer.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# File-Transfer Scripts — Known Issues & Technical Debt

Working list for the per-machine log-shipping scripts. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = operational/security risk · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Personal SSH account used for transfers — High
- **Where:** all files — `$sshUsername = "phelanh"`, destination `/Users/phelanh/Desktop/Logs/...`. (`phelanh` is the personal CADE account, not the `phelan` cleanroom account on `nfhistory`. The `/Users/` prefix suggests the destination was a macOS host — likely the legacy `hscdisplayerserver` — meaning the transfers have not been re-pointed at the Flask `nfhistory` deployment.)
- **Risk:** every machine's uploads depend on one person's CADE account; if it's disabled (staff turnover), all transfers silently stop and logs pile up locally. Compounded by the path possibly pointing at the deprecated server.
- **Fix:**
  - **Confirm where transfers currently land.** Inspect a recent run; if the destination is the legacy Mac server, that's its own urgent finding (the legacy server is documented as deprecated).
  - **For a non-personal authentication path**, the Nanofab team has two realistic options:
    - **Option A (IT ticket):** ask University IT to create a dedicated service account on `nfhistory` for ingest. Cleanest, but depends on IT — see `known-issues/UNanofabTools/serveraccess.md` #1 for the same dependency.
    - **Option B (Nanofab-side, no IT ticket):** keep authenticating as `phelan` on `nfhistory` but generate a dedicated *purpose-bound* SSH key (separate from any human's key), install its public half in `/home/phelan/.ssh/authorized_keys` with a `command=` restriction limiting it to scp into the ingest directory, and bake the private half into the per-machine PowerShell config. This eliminates the personal-account dependency without needing a new UNIX account, and rotation is just "issue a new key, push to each machine PC."
  - Update the username, the server-side destination path, and the server's read path in lockstep. Document whichever option was chosen.

### 2. Self-looping PowerShell is fragile — Medium
- **Where:** the `.ps1` files run `while ($true) { sleep until midnight; Send-Files }`.
- **Risk:** if the script crashes, reboots, or the window closes, uploads stop until a human notices. No auto-restart.
- **Fix:** convert to run-once + Windows Task Scheduler (as the `.bat` already does), which restarts reliably.

### 3. Relative-path logic differs between copies — Medium
- **Where:** `FileTransferTemplate.ps1` uses `-replace [regex]::Escape($watcherPath)`; `ALDTransfer.ps1` uses a corrected `Substring/TrimStart` + slash conversion.
- **Risk:** copies made from the template can mis-form remote paths (wrong sub-folders on the server).
- **Fix:** backport the ALD version's logic into the template and re-sync all instances.

### 4. PowerShell transfers don't check pscp success — Medium
- **Where:** `Send-Files` calls `Start-Process ... -Wait` but ignores the exit code (the `.bat` checks `%ERRORLEVEL%`).
- **Risk:** failed transfers are logged as if attempted but not flagged as failures; silent data gaps.
- **Fix:** capture and log the `pscp` exit code; alert on repeated failures.

### 5. Template / ALD mutex name still leaks into new copies — Low
- **Where:** `FileTransferTemplate.ps1` and `ALDTransfer.ps1` use `Global\ALDTransferScriptMutex`; other current copies have machine-specific names (`DentTransferScriptMutex`, `FurnTransferScriptMutex`).
- **Risk:** harmless today (they run on separate PCs) but misleading; a future copy made from the template can inherit the wrong machine name, and two scripts on one host would block each other unexpectedly.
- **Fix:** update the template to use a placeholder machine-specific mutex, or remove the mutex on single-purpose PCs.

### 6. 24-hour window can miss or duplicate edge files — Low/Medium
- **Where:** `.ps1` filters `LastWriteTime >= now-24h` and runs at midnight; the `.bat` sends *all* files every run.
- **Risk:** PowerShell version can miss a file written in a gap, or resend; batch version re-uploads everything (wasteful, but safe).
- **Fix:** track a high-water mark (last successful upload time) instead of a rolling 24h window.

### 7. Config edited by hand per machine — Low
- **Where:** paths/keys are literals near the top of each file, edited per deployment.
- **Risk:** easy to mis-edit; no validation that the watched folder or key exists.
- **Fix:** read config from a small per-machine file; validate paths at startup and log a clear error.

### 8. Windows XP dependency — Low (context)
- **Where:** `CTRFurnaceTransfer.bat` exists because some furnace PCs run Windows XP.
- **Risk:** XP is long unsupported; a security and maintenance liability beyond these scripts.
- **Note:** out of scope to fix here, but worth tracking at the facilities level.

---

## Suggested priority order
1. #1 — remove the personal-account dependency. Easiest Nanofab-side path is Option B (purpose-bound `phelan` key). Option A (a dedicated UNIX account) requires IT (see `serveraccess.md` #1).
2. #2 + #4 reliable scheduling + failure detection — Medium
3. #3 unify path logic across copies — Medium
4. #5, #6, #7 cleanup — Low/Medium


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/picofirmware.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Pico Firmware — Known Issues & Technical Debt

Working list for the Raspberry Pi Pico firmware copies in this repository. Kept separate from the successor docs. Nothing here has been changed in the code.

> **Heads-up:** the canonical, currently-maintained versions of this firmware live in `NanofabToolkit/PicoHelperTools/`. Their issues list at `known-issues/NanofabToolkit/PicoHelperTools.md` (reference path: ../NanofabToolkit/PicoHelperTools.md) is the **primary** place to track cross-cutting items (cleartext WiFi credentials, DST handling, watchdog default, driver duplication). The items below apply to the older copies retained here for historical reference; fix in the NanofabToolkit copies first.

Severity: **High** = doesn't work / security exposure · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. WiFi credentials hard-coded in plaintext — High (security)
- **Where:** `Particle_sensor.py` (`WIFI_PASSWORD = "<redacted-wifi-password>"`), `PicoParylene.py`, `PicoDenton18.py` (`PASSWORD = 'GENPASSWORD'` placeholder).
- **Risk:** the lab WiFi password is committed to the repo in cleartext.
- **Fix:** standardize on the `picopass` module pattern (`from picopass import passWD`) used by `PicoConnect.py` / `VGC083C_Monitor.py`; keep `picopass.py` out of version control.

### 2. `PicoDenton18.py` references undefined constants — High
- **Where:** main loop uses `CUTTOFFPOINT` and `SWITCHPOINT`, which are never defined → `NameError` on first iteration.
- **Risk:** the script cannot run as committed.
- **Fix:** define the threshold constants (the ADC values that select cap vs. ion gauge and the cutoff for "run over").

### 3. `PicoDenton18.py` `gathering` flag is ineffective — Medium
- **Where:** `send_data()` sets `gathering = True` as a *local*; the main loop's global `gathering` never changes, so the end-of-run `sendEndRequest()` branch behaves incorrectly.
- **Fix:** use `global gathering` (or restructure state) so the finished-signal logic works.

### 4. `PicoDenton18.py` uses http, not https — Medium
- **Where:** `SERVER_URL = 'http://nfhistory.nanofab.utah.edu/denton18pump'`.
- **Risk:** unencrypted on the network; inconsistent with the other firmware.
- **Fix:** use `https://`.

### 5. `VGC083C_Monitor.py` calls undefined `read_pressure()` — High
- **Where:** main loop calls `read_pressure()`, which is not defined anywhere in the file → `NameError`.
- **Fix:** implement `read_pressure()` (send `#RDIG\r` over UART, read and parse the controller's reply).

### 6. `VGC083C_Monitor.py` posts to a non-existent endpoint — High
- **Where:** `POST /api/VGC/pressureupload`. No such route exists in the Flask `api` blueprint or the legacy server.
- **Risk:** even with #5 fixed, readings have nowhere to land.
- **Fix:** add a `/api/VGC/...` endpoint server-side (mirroring `denton18pump`), or repoint at an existing endpoint.

### 7. Per-device identity is easy to mis-set — Medium
- **Where:** `ROOM_NAME` / `SENSOR_NUMBER` (and the Parylene session naming) are hand-edited before flashing.
- **Risk:** a mislabeled board files its data under the wrong room/sensor with no validation.
- **Fix:** consider deriving identity from `machine.unique_id()` mapped to a registry, or add a startup self-report so mislabels are visible.

### 8. Driver/payload code duplicated across files — Medium
- **Where:** the SPS30 driver + CRC logic appears in both `Particle_sensor.py` and `ParticleSensor.py` (and overlaps the NanofabToolkit copies); conversion math is repeated.
- **Fix:** factor a shared `sps30.py` module the firmwares import.

### 9. No central config / lots of magic numbers — Low
- ADC pins, thresholds, intervals, and URLs are scattered as literals across files.
- **Fix:** a small per-board `config.py` would make deployment and review easier.

---

## Suggested priority order
1. #1 remove hard-coded WiFi passwords — High (security)
2. #5 + #6 make `VGC083C_Monitor.py` functional (or retire it) — High
3. #2 + #3 + #4 finish/repair `PicoDenton18.py` — High/Medium
4. #8 de-duplicate the SPS30 driver — Medium
5. #7, #9 identity + config hygiene — Medium/Low


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/particlepctools.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Particle PC Tools — Known Issues & Technical Debt

Working list for `particle_data_viewer.py` (older copy) and `generate_test_particle_data.py`. Separate from the successor docs. Nothing here has been changed in the code.

> **Heads-up:** the canonical, currently-maintained version of the particle viewer lives in `NanofabToolkit/ParticleSensor/`. Its issues list at `known-issues/NanofabToolkit/ParticleSensor.md` (reference path: ../NanofabToolkit/ParticleSensor.md) is the **primary** place to track cross-cutting viewer items (the +7h timezone hack, the hard-coded layout/URL). The items below apply to the older viewer copy retained here and to the test-data generator (which has no NanofabToolkit twin). Fix viewer issues in the NanofabToolkit copy first.

Severity: **High** = correctness/data risk · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Timezone fixed with a +7h hack — Medium
- **Where:** `particle_data_viewer.py` `convert_to_mountain()` adds 7 hours to API datetimes.
- **Risk:** wrong by an hour during Mountain Daylight Time (offset is -6, not -7); brittle around DST transitions; masks the real problem (the server stores naive timestamps).
- **Fix:** make timestamps timezone-aware end-to-end (store UTC; convert with `zoneinfo`/`pytz` for display).

### 2. Two diverging copies of the viewer — Medium
- **Where:** `particle_data_viewer.py` here vs. `NanofabToolkit/ParticleSensor/src/gui.py`.
- **Risk:** fixes land in one and not the other; unclear which is canonical.
- **Fix:** pick one as the source of truth; delete or clearly mark the other.

### 3. Room-map layout is hard-coded — Low/Medium
- **Where:** `init_ui` defines the bay/lab grid as literals; labels must match firmware `room_name`s exactly.
- **Risk:** a renamed room or a relabeled Pico silently breaks the map coloring.
- **Fix:** drive the layout/labels from a shared config or from the server's known rooms.

### 4. Test generator can target production — Medium
- **Where:** `generate_test_particle_data.py` `api_url` is a constructor arg defaulting to localhost, but nothing prevents pointing it at production.
- **Risk:** running it against the real server injects fake readings into real data.
- **Fix:** require an explicit `--allow-production` flag (or refuse non-localhost by default).

### 5. Certificate validation disabled — Low
- **Where:** generator disables urllib3 warnings; viewer likely uses `verify=False`.
- **Risk:** standard internal-cert tradeoff; encrypted but unverified.
- **Fix:** trust the internal CA where feasible.

### 6. Hard-coded production URL in the viewer — Low
- **Where:** `self.api_url = "https://nfhistory.nanofab.utah.edu/particle-data"`.
- **Fix:** make it configurable (env var / settings file / CLI).

### 7. No tests — Medium
- Neither tool has automated tests; the generator's payload shape and the viewer's parsing could drift from the server contract unnoticed.
- **Fix:** a contract test asserting generator output matches what the viewer/server expect.

---

## Suggested priority order
1. #4 prevent the generator from hitting production — Medium
2. #1 fix timezone handling properly — Medium
3. #2 reconcile the duplicate viewers — Medium
4. #3, #6, #7 config + tests — Low/Medium


# Read-Aloud Documentation Corpus: known-issues/NanofabToolkit/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# NanofabToolkit — Known Issues & Technical Debt

Per-tool bug and tech-debt lists for `NanofabToolkit`. Separate from the layman presentations and the successor documentation trees so handoff materials stay clean.

One file per tool, mirroring the per-tool folders in `../presentation/NanofabToolkit/` and `../documentation/NanofabToolkit/`.

## Files

| File | Tool | Highest-severity item |
|------|------|------------------------|
| `ALDPeakCounter.md` (reference path: ALDPeakCounter.md) | ALD peak counter GUI | Duplicate peak-counter logic with UNanofabTools |
| `DentonDecoder.md` (reference path: DentonDecoder.md) | Denton `.dat`/CSV log viewer | Multi-day timestamp handling limited to one rollover |
| `ParalyneReader.md` (reference path: ParalyneReader.md) | Parylene file browser/viewer | Dead `return_selected` endpoint client; TLS verify disabled |
| `PreciousMetalReader.md` (reference path: PreciousMetalReader.md) | CORES precious-metal billing extractor | CORES Bearer token committed to source |
| `PicoHelperTools.md` (reference path: PicoHelperTools.md) | Pico firmware (canonical copies) | Cleartext WiFi credentials in source |
| `ParticleSensor.md` (reference path: ParticleSensor.md) | PyQt desktop viewer (canonical copy) | +7h timezone hack; duplicate `convert_to_mountain` in two modules |

## Recurring themes

A few items show up across more than one tool and are worth treating as cross-cutting initiatives:

- **Secrets in source.** `PreciousMetalReader/src/auth.py` holds the CORES Bearer token; `PicoHelperTools` firmware embeds WiFi credentials in cleartext. Same pattern as `UNanofabTools` — move secrets into env/keychain and rotate.
- **Divergent copies of shared code.** The Pico firmware and the particle viewer each ship in both `NanofabToolkit/` and `UNanofabTools/`. The NanofabToolkit copies are now canonical (newer versions); the UNanofabTools docs point back here. Track cross-cutting fixes in this tree first.
- **PyInstaller builds undocumented.** All four desktop apps ship as Windows executables but the build commands aren't captured in repo READMEs. Add a one-page build note per tool.
- **No timeouts / retries on outbound HTTP.** `ParalyneReader` and `PreciousMetalReader` both call `requests.get` without `timeout=` and freeze the UI on slow servers. Standard fix.
- **No automated tests.** None of these tools has a test suite. A small mock-based contract test per tool would lock in the network/parsing behavior.

Severity follows the shared convention: **High** = breaks functionality or is a real security exposure · **Medium** = correctness / maintainability problem · **Low** = cosmetic / cleanup.

## See also

The sibling UNanofabTools issues list is at `../UNanofabTools/` (reference path: ../UNanofabTools/). Cross-cutting items (firmware credentials, divergent viewer copies, CORES token hygiene) appear in both lists with pointers between them.
