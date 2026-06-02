# Medium Full Path E - Module 00: Set The Contract

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-00-set-the-contract.md

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

## Source-code pass for Module 00

READ ALOUD:

We are now doing the source-code pass for Set The Contract. The maintainer should connect this module to workspace, source-of-truth order, safety, and documentation layout. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Live-state pass for Module 00

READ ALOUD:

We are now doing the live-state pass for Set The Contract. The maintainer should connect this module to workspace, source-of-truth order, safety, and documentation layout. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Failure-mode pass for Module 00

READ ALOUD:

We are now doing the failure-mode pass for Set The Contract. The maintainer should connect this module to workspace, source-of-truth order, safety, and documentation layout. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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



# Module Documentation Corpus



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
- `support/path-e-script/TIMING.md` (reference path: support/path-e-script/TIMING.md) — estimated read-aloud and real presentation time by version, week, and module
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

For a literal read-aloud version with one script per module, use `path-e-script/README.md` (reference path: path-e-script/README.md). That pack is written for a presenter with no private context and includes operator notes, stop points, demo prompts, and explain-back checks. Timing estimates are in `path-e-script/TIMING.md` (reference path: path-e-script/TIMING.md).

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


# Read-Aloud Documentation Corpus: support/REDACTION-NOTE.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Redaction Note

This GitHub documentation copy redacts literal credential values that were present in the local documentation:

- CORES bearer token value.
- Lab WiFi password value.

The surrounding known-issues text is preserved so maintainers still know those secrets exist in source and should be moved to protected storage and rotated.
