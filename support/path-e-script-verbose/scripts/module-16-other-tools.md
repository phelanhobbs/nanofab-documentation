# Verbose Maximal Path E - Module 16: Other Tools

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-16-other-tools.md

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

## Source-code pass for Module 16

READ ALOUD:

We are now doing the source-code pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Live-state pass for Module 16

READ ALOUD:

We are now doing the live-state pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Failure-mode pass for Module 16

READ ALOUD:

We are now doing the failure-mode pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Maintenance-planning pass for Module 16

READ ALOUD:

We are now doing the maintenance-planning pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Security pass for Module 16

READ ALOUD:

We are now doing the security pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Recovery pass for Module 16

READ ALOUD:

We are now doing the recovery pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Documentation-drift pass for Module 16

READ ALOUD:

We are now doing the documentation-drift pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Teach-back pass for Module 16

READ ALOUD:

We are now doing the teach-back pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Homework-review pass for Module 16

READ ALOUD:

We are now doing the homework-review pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Quarterly-audit pass for Module 16

READ ALOUD:

We are now doing the quarterly-audit pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Backup-and-restore pass for Module 16

READ ALOUD:

We are now doing the backup-and-restore pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Ownership-boundary pass for Module 16

READ ALOUD:

We are now doing the ownership-boundary pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## No-contact rehearsal pass for Module 16

READ ALOUD:

We are now doing the no-contact rehearsal pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Operator-error pass for Module 16

READ ALOUD:

We are now doing the operator-error pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Data-integrity pass for Module 16

READ ALOUD:

We are now doing the data-integrity pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Final-repetition pass for Module 16

READ ALOUD:

We are now doing the final-repetition pass for Other Tools. The maintainer should connect this module to desktop utilities, data tools, priority, and maintenance scope. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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



# Module Documentation Corpus



# Read-Aloud Documentation Corpus: documentation/NanofabToolkit/ALDPeakCounter/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# ALDPeakCounter — Developer Documentation

Reference for the `ALDPeakCounter` desktop app. Tkinter GUI wrapping a SciPy-based peak counter, with per-file time alignment and box-zoom interaction. Bugs/tech debt: `known-issues/NanofabToolkit/ALDPeakCounter.md`.

## 1. Overview

| File | Role |
|------|------|
| `main.py` | Entry point. Sets a global exception hook that shows a scrollable error dialog with environment info; otherwise instantiates and runs the GUI. |
| `src/gui.py` | `PeakCounterGUI` — the Tkinter app: file picker, parameter inputs, results text, matplotlib canvas, time-alignment controls, box zoom. |
| `src/peakCount.py` | `count_peaks(...)` + `multi_file_plot(...)`. The same algorithm as `UNanofabTools/peakCount.py`. |
| `src/hook-matplotlib.py` | PyInstaller hook for bundling matplotlib backends. |
| `src/assets/icon.ico`, `icon.py` | Windowed icon (used by PyInstaller spec). |

Dependencies: `numpy`, `scipy.signal.find_peaks`, `matplotlib` (Tk-Agg backend), `tkinter` (stdlib).

Packaged with PyInstaller; the `hook-matplotlib.py` hook and `src/assets/` ship the matplotlib runtime and an `.ico` for the windowed executable.

## 2. `main.py`

- `show_error_dialog(title, message)` — opens a fresh `Tk()` window containing a scrolled, read-only text area with the supplied error/traceback and a close button. Centers the window and `sys.exit(1)` on close.
- `show_error(exc_type, exc_value, exc_tb)` — global `sys.excepthook`; formats and displays an unhandled exception in the dialog.
- `main()` — gathers Python/NumPy/SciPy/matplotlib version info into `env_info`, then `from src.gui import PeakCounterGUI; PeakCounterGUI().run()`. Any exception falls back to the dialog with the environment info attached — useful when shipped as a frozen executable to a non-technical user.

## 3. `src/gui.py` — `PeakCounterGUI`

### 3.1 State
- `self.selected_files` — list of absolute paths the user added.
- `self.results` — `[(file_path, peak_count, pressure_times, pressures, peaks), ...]` populated by `process_files`.
- `self.time_offsets[file_path]` — per-file horizontal shift applied in `update_plot`.
- Parameter `tk.Variable`s: `height_var`, `prominence_var` (default 0.01), `distance_var` (default 10), `width_var`.
- Box-zoom state: `zoom_rect`, `zooming`.

### 3.2 UI layout (`_create_widgets`)
- Top **control frame**: file `Add` / `Clear` buttons; `param_frame` with the four entry widgets; a `Process Files` button.
- **Files frame**: `Listbox` of basenames + `Text` results panel.
- **Time Alignment Controls** `LabelFrame`: dynamically populated when files are processed.
- **Plot frame** with matplotlib `FigureCanvasTkAgg`; instruction label + `Reset Zoom`; bound to `button_press/release/motion_notify` for box zoom.

### 3.3 Key methods
- `add_files()` — `filedialog.askopenfilenames` (`.txt` filter); de-dupes against the current list; initializes the file's entry in `time_offsets` to 0.
- `clear_files()` — empties all state and the plot.
- `create_offset_controls()` — per file, creates a row with: a label (basename), an `Entry` bound to a `DoubleVar` (the live offset), a horizontal `Scale` from `-50` to `+50`, **Apply** (commits the entry/slider value into `self.time_offsets`), and **Zero** (resets that file).
- `apply_offset(fp, var)` / `zero_offset(fp, var)` / `reset_offsets()` — manage `self.time_offsets` and call `update_plot()`.
- `process_files()` — pulls the four params (treating `0` as `None` for `height`/`width`), calls `count_peaks(file_path, **params, plot=False, quiet=True)` for each file, records results, prints `"<basename>: <N> peaks"` plus peak times into the results text area, builds offset controls, then `update_plot()`.
- `update_plot()` — clears the figure, iterates `self.results`, applies each file's offset (`adjusted_times = pressure_times + offset`), plots the pressure curve and marker-overlays the peaks. Colors cycle through `cm.tab10`; markers cycle through 10 shapes.
- `on_mouse_press` / `_release` / `_move` + `apply_zoom()` — implement a simple click-drag box zoom by setting `xlim`/`ylim` on release; `reset_zoom()` calls `autoscale()`.
- `run()` — `self.root.mainloop()`.

### 3.4 Input format
Tab-delimited text with a header row; column 0 = time (float), column 1 = pressure (float). Empty lines and non-numeric rows are skipped (in `count_peaks`).

## 4. `src/peakCount.py`

Functionally identical to `UNanofabTools/peakCount.py` (same `count_peaks` + end-peak heuristic + `multi_file_plot`). See `documentation/UNanofabTools/utilities/README.md` §2 for the algorithm details. Keep the two copies in sync (see known-issues).

## 5. Packaging
- `src/hook-matplotlib.py` ensures matplotlib's backend / data files are included by PyInstaller.
- `src/assets/icon.ico` is the windowed executable's icon.
- Build with the project's PyInstaller spec (not shown here) referencing `main.py` as the entry.

## 6. Maintenance notes
- **Duplicate peak-counter logic** with UNanofabTools — consider a shared package or one canonical copy.
- **Tab-delimited input is a hard assumption**; document the expected file format in the GUI itself.
- **The `Min Distance` parameter is in samples, not seconds** — labeling makes this clearer for users.
- The box-zoom implementation is custom; matplotlib's built-in `NavigationToolbar2Tk` would give standard zoom/pan/save buttons for free if simplification is desired.

See the layman guide at `presentation/NanofabToolkit/ALDPeakCounter/README.md` and the related `UNanofabTools/utilities` docs for the shared peak-count algorithm.


# Read-Aloud Documentation Corpus: documentation/NanofabToolkit/DentonDecoder/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# DentonDecoder — Developer Documentation

Reference for the `DentonDecoder` desktop app. Tkinter GUI that accepts Denton `.dat` files or already-converted CSV logs, converts `.dat` inputs to CSV, and charts a chosen column against time using matplotlib. Bugs/tech debt: `known-issues/NanofabToolkit/DentonDecoder.md`.

> **Not to be confused with `UNanofabTools/dattools`.** Both toolsets can touch Denton `.DAT`-style data, but their workflows differ. DentonDecoder is a desktop GUI that converts a selected `.dat` to a temporary CSV and plots arbitrary columns; `UNanofabTools/dattools` is a pair of command-line utilities focused on cleaning Denton 635 event logs and plotting pressure.

## 1. Overview

| File | Role |
|------|------|
| `main.py` | Entry point. Sets `matplotlib.use('TkAgg')` early. Global exception hook surfaces unhandled errors in a scrollable Tk dialog with environment info. |
| `src/DentonDecoder.py` | `convertFile(filePath)` — converts Denton `.dat` files to a temporary CSV in the user's temp directory, reading 128-byte chunks and decoding string/double/int records. |
| `src/DentonGrapher.py` | `create_graph(input_file, column_name="Chamber Pressure (Torr)", output_file=None, show_graph=True, log_scale=False, return_data=False)` — the core parsing + plotting routine. |
| `src/gui.py` (`DentonGUI`) | Tkinter app: multi-file picker for `.dat`/`.csv`, background `.dat` conversion, column selector, log-scale toggle, time-alignment controls, plot canvas, save. |
| `src/assets/icon.ico` | Windowed executable icon. |
| `pyinstaller/hooks/hook-runtime.py` | PyInstaller hook used during packaging. |

Dependencies: `numpy`, `matplotlib` (TkAgg backend), `csv` (stdlib), `datetime`, `tkinter`.

## 2. `main.py`

- Forces `matplotlib.use('TkAgg')` before any matplotlib import to avoid backend mismatches when frozen.
- `show_error_dialog(title, message)` opens a fresh `Tk()` with a scrolled, read-only text area + close button; centers and `sys.exit(1)` on close.
- `show_error(...)` global `sys.excepthook` formats unhandled tracebacks into the dialog.
- `main()` collects Python/NumPy/matplotlib version info, adjusts `sys.path` to include `.` and `./src`, then `from src.gui import DentonGUI; DentonGUI().mainloop()`. Any failure during import or run lands in the error dialog.

## 3. `src/DentonDecoder.py`

`convertFile(filePath)` is the `.dat` conversion path used by the GUI:

1. Validates that the input exists and is readable.
2. Reads the file as bytes.
3. Walks the data in 128-byte chunks, decoding known record forms:
   - `0x08 0x00 <len> 0x00` → ASCII text field.
   - `0x05 0x00` + 8 bytes → little-endian double.
   - `0x03 0x00` + 4 bytes → little-endian unsigned int.
4. Treats the first 27 decoded values as headers and groups the rest into 27-column rows.
5. Writes `<input-stem>.csv` under `tempfile.gettempdir()` and returns that path.

The converter is intentionally separate from the graphing routine: `.csv` inputs bypass it, while `.dat` inputs run through it before column detection and plotting.

## 4. `src/DentonGrapher.py`

### 4.1 `create_graph(...)`

Signature:
```python
create_graph(input_file,
             column_name="Chamber Pressure (Torr)",
             output_file=None,
             show_graph=True,
             log_scale=False,
             return_data=False)
```

Behavior:
1. Opens the CSV with `errors='replace'`; `csv.reader` reads the header row to find `headers.index(column_name)` (prints available columns and returns `False`/`([], [])` if not found).
2. Treats `time_col = 0` (always the first column).
3. Iterates rows: parses each timestamp with `datetime.strptime(time_str, "%H:%M:%S")`; first valid row becomes `base_time`; subsequent rows produce `time_delta = (time_obj - base_time).total_seconds()`. A single midnight rollover is patched (`+86400` if negative).
4. Attempts `float(row[data_col])`; rows with bad time or value are skipped.
5. If `return_data` → returns `(times, values)` (lists).
6. Otherwise plots with matplotlib: title `f'{column_name} vs Time - {Path(input_file).stem}'`, scientific-notation y-axis unless `log_scale` (then `ax.set_yscale('log')`), grid on; saves to `output_file` if provided; `plt.show()` (if `show_graph`) else `plt.close(fig)`. Warns when fewer than 10 points were found.

### 4.2 Data contract
- First column = timestamp `HH:MM:SS`.
- Header row required (to look up `column_name`).
- All other columns are arbitrary; user picks one to plot.

## 5. `src/gui.py` — `DentonGUI`

(Behavior from the live source.) Wraps conversion + plotting as follows:
- File picker (`filedialog.askopenfilenames`) accepts `.dat`, `.csv`, or all files.
- `.dat` files are converted in a background thread with `convertFile`; `.csv` files are loaded directly.
- Reads the header row from each ready CSV and populates a common-column `Combobox`.
- Includes log-scale and auto-zoom toggles.
- Embeds a `FigureCanvasTkAgg`, custom box zoom, and a standard `NavigationToolbar2Tk`.
- Supports per-file time offsets so multiple runs can be aligned before plotting.

Confirm the exact widget set against the live source when extending.

## 6. Packaging

PyInstaller-friendly: `matplotlib.use('TkAgg')` is set early, `sys.path` is extended for the frozen layout, and `pyinstaller/hooks/hook-runtime.py` participates in the build. The bundled `.ico` is the executable icon.

## 7. Maintenance notes

- **Timestamp depth**: timestamps are `HH:MM:SS` only (no date); multi-day runs aren't supported beyond the single +86400 midnight patch.
- **Hard-coded default column** (`"Chamber Pressure (Torr)"`): tolerant — the GUI lets users pick any column — but ensure the dropdown drives `create_graph` rather than relying on the default.
- **`ax = plt.gca()` after `plt.figure(figsize=...)`**: the line `fig, ax = plt.figure(figsize=(10, 6)), plt.gca()` is unusual but works; it relies on `plt.figure` setting the current figure so `gca()` returns its axes. Consider replacing with `fig, ax = plt.subplots(figsize=(10, 6))` for clarity.
- **No tests**: a small fixture CSV + golden plot data would lock in the time/value parsing.
- **Don't mix up with UNanofabTools' DAT tools**: DentonDecoder has a GUI conversion path plus arbitrary-column plotting; the UNanofabTools tools are command-line cleaning/pressure-plot helpers. Document the distinction prominently if you ever consolidate.

See the layman guide at `presentation/NanofabToolkit/DentonDecoder/README.md`.


# Read-Aloud Documentation Corpus: documentation/NanofabToolkit/ParalyneReader/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# ParalyneReader — Developer Documentation

Reference for the `ParalyneReader` desktop app: a Tkinter GUI that lists, downloads, and visualizes Parylene-coater run files served by the cleanroom Flask server. Bugs/tech debt: `known-issues/NanofabToolkit/ParalyneReader.md`.

## 1. Overview

| File | Role |
|------|------|
| `main.py` | Entry point. Configures logging, builds the Tk root, instantiates `ParalyneReaderApp`, registers a clean-shutdown handler, runs the event loop. Imports `gui.ParalyneReaderApp` from `src/`. |
| `src/ParalyneReader.py` | API client: `list_files()`, `download_file(filename)`, `return_selected(filename)` against `https://nfhistory.nanofab.utah.edu/api/paralyne/analog`. |
| `src/gui.py` (`ParalyneReaderApp`) | The Tk app: list/select/download UI, threaded downloads (`thread_pool`), matplotlib chart, smoothing/normalization/time-alignment controls. |
| `src/assets/icon.ico` | Windowed executable icon. |

Dependencies: `requests`, `numpy`, `scipy`, `matplotlib`, `tkinter` (stdlib), `logging`. `main.check_dependencies()` checks for these at startup.

## 2. Server contract

Talks to the Flask app's `api` blueprint (Parylene routes):

- `GET /api/paralyne/analog/list` → `{status, count, files:[{filename, size, modified, download_url}, ...]}`. Newest-first ordering is enforced server-side.
- `GET /api/paralyne/analog/download/<filename>` → raw CSV bytes (as attachment). Server rejects names containing `..`, `/`, `\`, or non-`.csv` extensions.

`requests` calls use `verify=False` (internal CA), with `requests.packages.urllib3.disable_warnings()` to silence noise.

See `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` §5.6 for the server side.

## 3. `main.py`

- `setup_logging()` writes to `logs/paralyne_reader.log` (creating the folder if missing) and also to stdout.
- `main()`: extends `sys.path` to include `src/`, imports `gui.ParalyneReaderApp`, builds `tk.Tk()`, sets icon (best-effort), centers the window, registers a `WM_DELETE_WINDOW` handler that shuts down `app.thread_pool` if present and destroys the root.
- `check_dependencies()`: returns False if any of `tkinter`, `requests`, `matplotlib`, `numpy`, `scipy` are missing.
- Catches `ImportError` and generic exceptions, surfaces them via `messagebox.showerror` with guidance to `pip install -r requirements.txt`.

## 4. `src/ParalyneReader.py`

```python
base_url = "https://nfhistory.nanofab.utah.edu/api/paralyne/analog"

def list_files():
    response = requests.get(f"{base_url}/list", verify=False)
    if response.status_code == 200:
        return response.json()['files']
    raise Exception(...)

def download_file(filename):
    response = requests.get(f"{base_url}/download/{filename}", verify=False)
    if response.status_code == 200:
        file_path = os.path.abspath(filename)
        with open(file_path, 'wb') as f: f.write(response.content)
        return file_path
    raise Exception(...)

def return_selected(filename):
    response = requests.get(f"{base_url}/return/{filename}", verify=False)
    ...
```

- `list_files()` returns the `files` list directly.
- `download_file(filename)` saves to the CWD with the given name and returns the absolute path.
- `return_selected(filename)` calls `/api/paralyne/analog/return/<filename>` — **this server endpoint does not exist** in the current Flask app or the legacy server. The function is dead. See known-issues.

## 5. `src/gui.py` — `ParalyneReaderApp`

(Inferred behavior from `main.py` and the dependency list.) Provides:

- A **file list** populated by `list_files()` (newest first), with size and modified date columns.
- **Download** action that submits work to a `ThreadPoolExecutor` (`self.thread_pool`) so the UI stays responsive; downloaded files are loaded into memory for plotting.
- A matplotlib `FigureCanvasTkAgg` showing each loaded run as a series.
- **Smoothing** options (likely SciPy filters such as a Savitzky–Golay or moving-average; the code lists `scipy` as required for this).
- **Normalization** to overlay runs at different baselines.
- **Time-alignment** to shift one run vs. another (cf. `ALDPeakCounter`'s offset pattern).

The exact widget set may evolve — confirm against the live source before extending.

## 6. Operational notes

- Logs to `logs/paralyne_reader.log` next to the executable / module.
- Downloads write to the **current working directory**, which is the executable's folder when frozen — confirm permissions before deploying.
- Skipping certificate verification is the standard internal-cert tradeoff; encrypted in transit, just unverified.

## 7. Maintenance / recommendations

- **Delete or implement `return_selected`** (`/return/<filename>` doesn't exist server-side).
- **Make the download directory configurable** rather than CWD (or default to a `Downloads/` subfolder).
- **Switch to verified TLS** once the internal CA is in the executable's trust store.
- **Document the build** — there's a PyInstaller setup; capture the spec/command in the repo README so a successor can rebuild the .exe.
- **Add a "Refresh List" action** with timeout + retry, and surface clear errors when the server is unreachable.

See the layman guide at `presentation/NanofabToolkit/ParalyneReader/README.md` and the server-side endpoints documented under `documentation/UNanofabTools/flaskserver/`.


# Read-Aloud Documentation Corpus: documentation/NanofabToolkit/PreciousMetalReader/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# PreciousMetalReader — Developer Documentation

Reference for the `PreciousMetalReader` desktop app: a Tkinter GUI that downloads month-of precious-metal usage records from the CORES `n8n` webhook and writes summarized CSVs. **Talks to CORES, not to the cleanroom server.** Bugs/tech debt: `known-issues/NanofabToolkit/PreciousMetalReader.md`.

## 1. Overview

| File | Role |
|------|------|
| `main.py` | Entry point. Configures logging (file + stdout), extends `sys.path` with `.` and `./src`, imports `PreciousMetalReaderGui`, builds a Tk root, runs the event loop with a top-level try/except surfacing errors via `messagebox`. |
| `src/RetrieveMonthsMetals.py` | `download_Metal(endpoint, month, year)` plus helpers (`daysinMonth`, `summarize_metal_charges`, `save_summary_to_csv`). Calls the CORES n8n webhook. |
| `src/gui.py` (`PreciousMetalReaderGui`) | The Tk UI: month/year picker, mode (specific vs all), machine + metal dropdowns, download action, progress/results text. |
| `src/assets/icon.ico` | Windowed executable icon. |
| `src/auth.py` (referenced as `from auth import HSCCode`) | Holds the CORES Bearer token. |

Dependencies: `requests`, `tkinter` (stdlib), `csv` (stdlib), `collections.defaultdict`, `logging`. Frozen with PyInstaller.

## 2. Upstream service

```
URL:  https://n8n.cores.utah.edu/webhook/line_item_batch_pull?service_ids=<id>&start_date=<YYYY-MM-DD>&end_date=<YYYY-MM-DD>
Auth: Authorization: Bearer <HSCCode>
Verb: GET; response is JSON
```

`HSCCode` is imported from `auth.py` (not committed). This is the **same n8n endpoint family** that `UNanofabTools/HSCDownloader.py` uses, but a different webhook path (`line_item_batch_pull` vs. `custom_form_data_dump`) and different service IDs.

`download_Metal("all", month, year)` iterates a hard-coded list of service IDs covering precious-metal charges across Denton 635 / Denton 18 / TMV (observed IDs roughly `768, 808–818`); `download_Metal(<id>, month, year)` pulls a single endpoint.

## 3. `main.py`

- `setup_logging()` resolves a base directory (uses `sys._MEIPASS`-aware logic for frozen executables), creates `logs/`, configures root logging with both a `FileHandler` (`precious_metal_reader.log`) and a `StreamHandler`.
- Extends `sys.path` for `.` and `./src` so frozen + dev runs both find `src/`.
- `from src.gui import PreciousMetalReaderGui` (with logged ImportError fallback).
- `main()` creates `tk.Tk()`, instantiates the GUI, enters `mainloop()`. Unhandled exceptions are logged and shown via `messagebox.showerror`.

## 4. `src/RetrieveMonthsMetals.py`

### 4.1 `daysinMonth(month, year) -> int`
Leap-year-aware day count for the requested month.

### 4.2 `download_Metal(endpoint, month, year) -> str | None`
- Resolves a download directory:
  - Frozen (`sys.frozen` and `sys._MEIPASS`): `os.path.dirname(sys.executable) / "downloads"`.
  - Dev mode: walks two levels up from `__file__` and uses `<project>/downloads/`.
- `endpoint == "all"`: iterates the embedded `[768, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818]` list, builds a `Bearer`-authed GET per ID with `start_date=YYYY-MM-01` and `end_date=YYYY-MM-<days>`, collects `response.json()` per endpoint, then concatenates (skipping endpoints that returned no data).
- Otherwise, calls a single endpoint with the same date span and writes a CSV named per (endpoint, month, year).
- Logs each request URL and status code.

### 4.3 `summarize_metal_charges(json_data)`, `save_summary_to_csv(...)`
Group the raw line items by metal/tool, sum charges, and write a CSV alongside the raw download.

## 5. `src/gui.py` — `PreciousMetalReaderGui`

- `root = tk.Tk(); title="Precious Metal Reader"; 800×600`.
- Top row: `Month` (Combobox of month names, derived from `calendar.month_name[1:]`), `Year` (text entry, defaults to current year).
- `download_option` radio: `"specific"` or `"all"`; `toggle_selection_mode()` enables/disables the machine and metal dropdowns.
- `machine_combo`: `("Denton635", "Denton18", "TMV")`; selecting one triggers `update_metal_options()` which populates `metal_combo` with the allowed metals for that machine.
- Download button invokes `download_Metal(...)`, then `summarize_metal_charges` and `save_summary_to_csv`. Logs and surfaces results.

(Confirm the precise widget set / event bindings against the live source when extending.)

## 6. Operational notes

- Logs to `logs/precious_metal_reader.log` (frozen) or `src/logs/...` (dev).
- Downloaded CSVs land in `downloads/` adjacent to the app.
- Internet access required; CORES authentication uses a Bearer token from `auth.py`.
- The app is read-only against CORES.

## 7. Maintenance / recommendations
- **Move `HSCCode`/Bearer out of `auth.py`** into env / OS keychain; rotate the token. It's a real credential.
- **Hard-coded service-ID map**: lift the `[768, 808…818]` list into a documented config / table (machine → metal → service_id) so re-numbering at CORES is one place to update.
- **Retry + timeout on `requests.get`**: today there's no `timeout=`, so a slow CORES can hang the UI.
- **Progress reporting for "all"**: looping ~12 endpoints can take a while; surface per-endpoint progress in the UI.
- **Document the PyInstaller build command** so a successor can rebuild the .exe.
- **Tests**: mock-based tests around `download_Metal` and the summarizer would lock in the CORES contract.

See the layman guide at `presentation/NanofabToolkit/PreciousMetalReader/README.md`. Related: `documentation/UNanofabTools/hscdownloader/README.md` (also a CORES n8n consumer, different webhook).


# Read-Aloud Documentation Corpus: documentation/NanofabToolkit/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# NanofabToolkit — Developer Documentation

Formal reference for the desktop tools and Pico firmware that live in the `NanofabToolkit` repository. Each folder below contains the developer docs for one tool group. The matching layman guides and slide decks are in the parallel tree at `../presentation/NanofabToolkit/`. Bugs and tech debt are tracked separately in `../known-issues/NanofabToolkit/`.

## Tools

| Folder | Component | Notes |
|--------|-----------|-------|
| `ALDPeakCounter/` (reference path: ALDPeakCounter/README.md) | Tkinter GUI wrapping a SciPy peak counter; per-file time alignment, box zoom. | **Active** |
| `DentonDecoder/` (reference path: DentonDecoder/README.md) | Tkinter GUI that accepts Denton `.dat` or CSV logs, converts `.dat` to temporary CSV, and plots any column against time (log-scale option). Distinct from UNanofabTools' command-line DAT tools. | **Active** |
| `ParalyneReader/` (reference path: ParalyneReader/README.md) | Tkinter GUI client of the Flask app's `GET /api/paralyne/analog/...` endpoints; background downloads, smoothing/normalization/alignment. | **Active** |
| `PreciousMetalReader/` (reference path: PreciousMetalReader/README.md) | Tkinter GUI that downloads month-of precious-metal usage records from the CORES `n8n` webhook and writes summarized CSVs. **Talks to CORES, not to the cleanroom server.** | **Active** |
| `PicoHelperTools/` (reference path: PicoHelperTools/README.md) | MicroPython firmware (SPS30 / DHT22 / combined). The current, canonical copies. Older copies exist in `UNanofabTools/`. | **Active — canonical** |
| `ParticleSensor/` (reference path: ParticleSensor/README.md) | PyQt desktop particle-data viewer with env-data sub-boxes and the standard matplotlib toolbar. The current, canonical copy. Older copy exists in `UNanofabTools/`. | **Active — canonical** |

## How the tree is laid out

For each tool you'll find:

- This tree (`documentation/NanofabToolkit/<tool>/`): one or more `.md` files of formal reference material — full docs for the four standalone tools, pointer files for the two that overlap with UNanofabTools.
- The parallel layman tree (`../presentation/NanofabToolkit/<tool>/`): a plain-English README and, for the four standalone tools, a slide deck with speaker notes.
- A single bugs / tech-debt file in `../known-issues/NanofabToolkit/<tool>.md`.

## Conventions

- All file paths are relative to the repository root unless otherwise noted.
- Code is quoted verbatim from the source so identifiers are searchable.
- Cross-tool references use folder paths (e.g. `documentation/UNanofabTools/picofirmware/`) so they keep working as the tree moves.
- For the two tools that also exist in `UNanofabTools/` (`PicoHelperTools` and `ParticleSensor`), this folder is canonical. The UNanofabTools-side docs now link back here.

## See also

The sibling `UNanofabTools` repository is documented in parallel at `../UNanofabTools/` (this tree), `../../presentation/UNanofabTools/`, and `../../known-issues/UNanofabTools/`. Cross-references run between the two for shared firmware, the particle viewer, and the CORES integrations.


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# UNanofabTools — Developer Documentation

Formal reference for every component in the UNanofabTools repository, organized per tool. Each folder below contains the developer docs for one tool group. The matching layman guides and slide decks are in the parallel tree at `../presentation/UNanofabTools/`. Bugs and tech debt are tracked separately in `../known-issues/UNanofabTools/` so the handoff documentation stays clean.

## Tools

| Folder | Component | Status |
|--------|-----------|--------|
| `flaskserver/` (reference path: flaskserver/README.md) | The current Flask web application — auth, tasks, machine portal, sensor API, chemical inventory. Detailed multi-document set (architecture, getting started, configuration reference, schema, HTTP/service references, security, deployment, dev guide). | **Active — primary** |
| `hscdownloader/` (reference path: hscdownloader/README.md) | Scheduled ETL: pulls per-machine run forms from the CORES n8n webhook and writes the `HSCDATA` summary CSVs the Flask machines portal reads. | **Active** |
| `picofirmware/` (reference path: picofirmware/README.md) | MicroPython firmware for the Raspberry Pi Pico W boards (SPS30 particle sensors, Parylene/Denton ADC streamers, plus diagnostics). | **Older copies** *(canonical: `NanofabToolkit/PicoHelperTools` (reference path: ../NanofabToolkit/PicoHelperTools/README.md))*; two unique scripts (`PicoDenton18.py`, `VGC083C_Monitor.py`) are incomplete |
| `particlepctools/` (reference path: particlepctools/README.md) | The PyQt desktop viewer and a synthetic-data generator. | Viewer is the **older copy** *(canonical: `NanofabToolkit/ParticleSensor` (reference path: ../NanofabToolkit/ParticleSensor/README.md))*; generator is canonical here |
| `filetransfer/` (reference path: filetransfer/README.md) | PowerShell / batch scripts running on each tool's Windows control PC; push log files to the server over SSH via `pscp`. | **Active** |
| `dattools/` (reference path: dattools/README.md) | `DATfixer.py` (Denton 635 binary `.DAT` → cleaned text) and `DATgrapher.py` (pressure-vs-time charts from cleaned files). | **Active** |
| `utilities/` (reference path: utilities/README.md) | Standalone helpers: `peakCount.py`, `gencert.py`, `init_chem_db.py`, `fetch_ssh.py`, `NMonStore.py`. Mixed status. | **Active** (one unfinished stub) |
| `serveraccess/` (reference path: serveraccess/README.md) | The SSH access pattern (laptop → CADE → `nfhistory`), the shared `phelan` account model, and the `flaskserver` / `downloader` tmux sessions: attach, detach, recover. Includes both user procedure and admin runbook. | **Active** |
| `liveserver/` (reference path: liveserver/README.md) | Populated inventory of the live `nfhistory` server (OS, network, certs, services, packages, data trees), plus the `survey_nfhistory.sh` script that produces the snapshots and a folder of captured snapshots. | **Active** |
| `hscdisplayerserver/` (reference path: hscdisplayerserver/README.md) | The original monolithic server (Python `http.server`-based) that predates the Flask rewrite. Documented for historical reference; not maintained. | **Deprecated** |

## How the tree is laid out

For each tool you'll find:

- This tree (`documentation/UNanofabTools/<tool>/`): one or more `.md` files of formal reference material.
- The parallel layman tree (`../presentation/UNanofabTools/<tool>/`): a plain-English README and a presentable slide deck with speaker notes.
- A single bugs / tech-debt file in `../known-issues/UNanofabTools/<tool>.md`.

The Flask server is the most elaborate set (an 11-file reference plus architecture, ops, dev guide). Smaller tools have a single thorough `README.md` and, where useful, a focused companion file (for example `hscdisplayerserver/` has a separate `ROUTES.md`).

## Conventions

- All file paths are relative to the repository root unless otherwise noted.
- Code is quoted verbatim from the source so identifiers are searchable.
- Cross-tool references use folder paths (e.g. `documentation/UNanofabTools/hscdownloader/`) so they keep working as the tree moves.
- Known issues are *not* mixed into the docs — see the parallel `known-issues/` tree.


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/dattools/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# DAT Tools — Developer Documentation

Formal reference for `DATfixer.py` and `DATgrapher.py`: two standalone command-line utilities that decode and plot Denton 635 sputter-system event logs. Assumes Python familiarity. Bugs and tech debt are tracked separately in `known-issues/UNanofabTools/dattools.md`.

## 1. Overview

| Tool | Input | Output | Purpose |
|------|-------|--------|---------|
| `DATfixer.py` | Denton 635 binary `.DAT` log | cleaned `.txt` (+ optional `.png`) | Decode the proprietary binary log into human/CSV-readable text |
| `DATgrapher.py` | cleaned `.txt` (DATfixer output) | on-screen graph and/or `.png` | Plot pressure vs. time from a cleaned log |

Both are invoked from the shell (PowerShell on the lab Windows hosts), operate on local files, and are independent of the Flask server. Typical pipeline: `DATfixer raw.DAT → cleaned.txt → DATgrapher cleaned.txt → graph`. `DATfixer --graph` short-circuits this by graphing directly.

## 2. Dependencies

- Python 3.x
- `matplotlib` (plotting)
- `numpy` (imported in both files; only incidentally used — see known-issues)
- Standard library: `os`, `pathlib`, `argparse`, `re`, `struct`, `datetime`

Install: `pip install matplotlib numpy`.

## 3. `DATfixer.py`

### 3.1 Entry points

- `clean_event_log(input_file, output_file=None, preserve_formatting=True, pretty_format=True, add_commas=True, create_graph=False) -> bool`
- `main()` — `DATfixer.py` argparse CLI wrapper.

### 3.2 The `.DAT` binary format (reverse-engineered)

`clean_event_log` reads the file as raw bytes and walks it once, recognizing two byte patterns:

1. **Measurement value** — the 2-byte marker `0x05 0x00` followed by an 8-byte little-endian IEEE-754 double:
   ```python
   pattern = b'\x05\x00'
   double_value = struct.unpack('<d', double_bytes)[0]
   modified_content.extend(pattern)
   modified_content.extend(f" [{double_value:.12f}]".encode('ascii'))
   ```
   The decoded double is emitted in brackets with 12 decimal places, e.g. `[0.000000486000]`. This bracketed value is the chamber pressure that downstream graphing extracts.

2. **Field delimiter** — the 4-byte pattern `0x08 0x00 0xXX 0x00` (any third byte) is replaced with a comma:
   ```python
   elif (cleaned_content[position]   == 0x08 and
         cleaned_content[position+1] == 0x00 and
         cleaned_content[position+3] == 0x00):
       modified_content.extend(b',')
       position += 4
   ```

Bytes matching neither pattern are copied through.

> These magic-byte assumptions are the brittle core of the tool; they are not validated against any header or version. See known-issues.

### 3.3 Processing pipeline (order matters)

1. **Decode pass** — the byte walk above (values → brackets, delimiters → commas).
2. **Control-character strip** — remove bytes `< 32` and `127` (DEL), *except* those in `preserve_chars`. With `preserve_formatting=True` (default) the preserved set is `[9, 10, 13]` (tab, LF, CR); `--strict` empties it.
3. **Pretty formatting** (`pretty_format`, default on) — a regex inserts a newline before each `HH:MM:SS` timestamp not already at line start:
   ```python
   time_pattern = re.compile(br'(\d{2}:\d{2}:\d{2})')
   ```
4. **Comma insertion** (`add_commas`, default on) — the content is decoded to ASCII (`errors='replace'`) and tokenized with a named-group regex into `timestamp | bracketed | word | number | whitespace | other`. The tokens are re-joined with commas inserted after `timestamp/bracketed/word/number` tokens (with guards to avoid double commas and to skip the `number` + `.` case). Final `replace(',,', ',')` cleanup.
5. **Optional graph** (`create_graph`) — see §3.4.
6. **Write** — the result is written as bytes to `output_file`, and a summary (bytes removed, percentage) is printed.

### 3.4 Optional graphing (`--graph`)

If `create_graph=True`, the cleaned text is parsed line-by-line:
- `time_regex = (\d{2}:\d{2}:\d{2})` extracts a timestamp; the first timestamp becomes `base_time`.
- `pressure_regex = \[([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\]` extracts the first bracketed value as pressure.
- `time_delta = (time_obj - base_time).total_seconds()`; a `+ 24*60*60` correction handles a single midnight rollover.
- matplotlib renders pressure vs. seconds-since-start, saved as `<output>.png` (scientific y-axis notation, grid on). A warning prints if `< 10` points were found.

**This graphing block is duplicated almost verbatim in `DATgrapher.py`** (see known-issues #1).

### 3.5 Output naming

If `output_file` is omitted: `input.with_stem(f"{stem}_cleaned").with_suffix('.txt')` → `Foo.DAT` becomes `Foo_cleaned.txt`.

### 3.6 CLI reference

```
python DATfixer.py [-h] [-o OUTPUT] [--strict] [--raw] [--no-commas] [--graph] input_file
```

| Flag | Maps to | Effect |
|------|---------|--------|
| `input_file` | `input_file` | Required. Path to the `.DAT`. |
| `-o, --output` | `output_file` | Output path override. |
| `--strict` | `preserve_formatting=False` | Strip newlines/tabs too. |
| `--raw` | `pretty_format=False` | Skip timestamp-newline formatting. |
| `--no-commas` | `add_commas=False` | Skip comma insertion. |
| `--graph` | `create_graph=True` | Also emit a `.png` graph. |

Returns `True` on success, `False` on exception (errors are caught and printed, not raised).

## 4. `DATgrapher.py`

### 4.1 Entry points

- `create_pressure_graph(input_file, output_file=None, show_graph=True, log_scale=False) -> bool`
- `main()` — `DATgrapher.py` argparse CLI wrapper.

### 4.2 Behavior

Reads a cleaned text file (`errors='replace'`) and applies the same time/pressure regex extraction as §3.4:
- Timestamp `(\d{2}:\d{2}:\d{2})`, first becomes `base_time`.
- Pressure `\[([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\]`, first bracketed value per line.
- Builds `times` (seconds since start, with midnight rollover correction) and `pressures`.

Renders with matplotlib:
- Title includes the input stem.
- `--log` → `ax.set_yscale('log')`; otherwise scientific-notation y-axis.
- `show_graph=True` → `plt.show()` (blocking, needs a display); else `plt.close()`.
- Saves to `output_file` if provided.
- Returns `False` (and prints) if no valid data; warns if `< 10` points.

### 4.3 CLI reference

```
python DATgrapher.py [-h] [-o OUTPUT] [--no-display] [--log] input_file
```

| Flag | Maps to | Effect |
|------|---------|--------|
| `input_file` | `input_file` | Required. Path to the cleaned `.txt`. |
| `-o, --output` | `output_file` | Save graph to this path. |
| `--no-display` | `show_graph=False` | Don't open a window. If no `-o`, defaults output to `input.with_suffix('.png')`. |
| `--log` | `log_scale=True` | Logarithmic pressure axis. |

## 5. Data contract between the two tools

`DATgrapher` depends on `DATfixer`'s output shape — specifically that each data line contains a `HH:MM:SS` timestamp and that the **first** `[...]` bracketed value on the line is the pressure. Any change to DATfixer's bracket emission (§3.2) or pretty-formatting (§3.3) can silently break DATgrapher's extraction. Keep these two regexes in sync:

```
time:     (\d{2}:\d{2}:\d{2})
pressure: \[([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\]
```

## 6. Extending / maintaining

- **Shared graphing**: factor §3.4 / §4.2 into a single module imported by both tools (eliminates the duplication in known-issues #1).
- **Format robustness**: add a guard that the input begins with the expected Denton signature before decoding; fail fast with a clear message otherwise.
- **Headless safety**: prefer `matplotlib.use("Agg")` when `--no-display`/`--graph` to avoid display-backend errors on servers.
- **Multi-day runs**: the `+24h` single-rollover hack (§3.4) won't handle runs > 24h or multiple midnights; carry a full date if that's ever needed.
- **Testing**: there are no tests. A small fixture `.DAT` (a few known measurements) plus golden cleaned-text output would lock in the binary decode.

## 7. File map

```
DATfixer.py        decode .DAT → .txt (+ optional .png)
DATgrapher.py      cleaned .txt → graph
DATInstructions.md original end-user instructions (in the repo root)
```

See also the layman guide at `presentation/UNanofabTools/dattools/README.md` and the issues list at `known-issues/UNanofabTools/dattools.md`.


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/utilities/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Utilities — Developer Documentation

Reference for the standalone helper scripts that don't belong to a larger tool. Bugs/tech debt: `known-issues/UNanofabTools/utilities.md`.

## 1. Overview

| File | Purpose | Run as | Deps |
|------|---------|--------|------|
| `peakCount.py` | Count peaks in pressure data | CLI (`argparse`) | numpy, scipy, matplotlib |
| `gencert.py` | Convert `.pfx` → `cert.pem` + `key.pem` | one-off script | cryptography |
| `init_chem_db.py` | Provision the PostgreSQL chem schema | one-off script | SQLAlchemy, dotenv, psycopg2 |
| `fetch_ssh.py` | Pull a file off the server via SSH proxy | dev helper | paramiko |
| `NMonStore.py` | Intended monitor data store | **stub, non-functional** | stdlib |

## 2. `peakCount.py`

CLI peak counter over tab-delimited pressure files.

- `count_peaks(file_path, height, prominence, distance, width, plot, quiet) -> (count, times, pressures, peaks)`:
  - Reads the file, skips the header, parses `values[0]` (time) and `values[1]` (pressure) from tab-split lines, ignoring non-numeric rows.
  - Uses `scipy.signal.find_peaks(pressures, height, prominence, distance, width)`.
  - **End-peak heuristic:** for series > 10 points, inspects the last 10 samples; if they are rising / plateauing / elevated and no peak already sits near the end, appends a synthetic end peak (subject to height/distance checks). This catches a final peak that `find_peaks` misses at the array boundary.
  - Prints results (or just the count in `--quiet`); plots if `--plot` and single-file.
- `multi_file_plot(results, plot)`: overlays multiple files on one chart with distinct colors/markers.
- `main()`: `argparse` — `file_paths` (1+), `--height`, `--prominence` (default 0.01), `--distance` (default 10), `--width`, `--plot`, `--quiet`. Sets `count_peaks.multiple_files` to suppress per-file plots when several files are passed.

Input format: tab-delimited, header line skipped, columns `[time, pressure, ...]`. Companion notes: `peakCount.md`. A GUI sibling exists in `NanofabToolkit/ALDPeakCounter`.

## 3. `gencert.py`

One-off PKCS12→PEM converter for the server's TLS cert.

- Hard-coded paths: reads `C:\ProgramData\certify\assets\nfhistory.nanofab.utah.edu\<...>.pfx`; writes `C:\Users\phelanh\Desktop\Work\cert.pem` and `key.pem`.
- Uses `cryptography.hazmat.primitives.serialization.pkcs12.load_key_and_certificates` (password `None`).
- Writes the cert PEM and the **private key with `NoEncryption()`** (unencrypted) in TraditionalOpenSSL format.
- Run by hand on certificate renewal. The unencrypted key matches the nginx/standalone-TLS setup expectations but must be filesystem-protected. (Note: an unused `HTTPServer/SimpleHTTPRequestHandler` import is present — leftover.) See known-issues.

## 4. `init_chem_db.py`

Provisions the chem PostgreSQL schema.

- `get_db_url()`: builds `postgresql+psycopg2://...` from `CHEM_*`/`PG*` env vars (same precedence as the Flask config).
- `read_schema_sql()`: loads `chem_schema.sql` from the script dir.
- `init_database()`: creates an engine and executes the schema statement-by-statement (splitting on `;`, skipping `BEGIN`/`COMMIT`).
- `__main__` runs `init_database()`.

> Important: this applies only `chem_schema.sql` (v1). It does **not** apply `chem_schema_migration_v2.sql` or the runtime-only columns/tables the live `chem_service` uses (`last_scan_at`, extended `inventory_cycles` columns, `scan_raw.barcode`, `container_scans.barcode`, the `transactions` table). A fresh DB built only with this script will be missing those — see the flaskserver known-issues (#4) and `known-issues/UNanofabTools/utilities.md`.

## 5. `fetch_ssh.py`

Developer convenience to retrieve the live `chem_inventory.py` from the server.

- Connects via a `paramiko.ProxyCommand` jump (`phelanh@lab1-10.eng.utah.edu` using `~/.ssh/CADE`) to host `nfhistory`, user `phelan`.
- `AutoAddPolicy()` for host keys (accepts unknown hosts — fine for a personal tool, not for automation).
- Runs `cat ~/server/UNanofabTools/app/blueprints/chem_inventory.py` and writes the bytes to local `chem_inventory_remote.py` (this is the origin of the empty/duplicate `chem_inventory_remote.py` artifacts in the tree).
- Personal/dev only; hard-coded usernames, hosts, and paths.

## 6. `NMonStore.py` — stub

Non-functional placeholder. Ensures `VOLTDATA.txt` exists, then loops incrementing `loopNumber`, appending it to the file, with a `# Your code logic goes here` comment, breaking at 5. `rstVolt` truncation branch is dead (constant 0). Intended as a "neutral monitor" data store; never completed.

- **Action:** finish (define the real data source/format) or remove. See known-issues.

## 7. Maintenance notes
- `peakCount.py`: behavior overlaps the NanofabToolkit ALD peak counter and the DAT graphers' parsing — consider consolidating the pressure-file parsing.
- `gencert.py`: parameterize paths and read the PFX password from the environment; drop the unused HTTP-server import.
- `init_chem_db.py`: extend to apply all migrations so a fresh DB matches production.
- `fetch_ssh.py`: keep as a personal tool or replace with a documented `scp`/CI step; don't use `AutoAddPolicy` in anything automated.
- `NMonStore.py`: resolve (finish or delete).

See the layman guide at `presentation/UNanofabTools/utilities/README.md`.


# Read-Aloud Documentation Corpus: presentation/NanofabToolkit/ALDPeakCounter/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# ALDPeakCounter — A Plain-English Guide

This guide explains the **ALDPeakCounter** desktop app from the NanofabToolkit. Written for a non-coder; terms are defined as they appear.

## What it does

ALDPeakCounter is a small Windows desktop app that **counts and visualizes peaks in pressure-vs-time data files**. In an ALD (atomic layer deposition) run, the chamber pressure rises and falls in a regular pattern; each rise-and-fall is a deposition cycle, so counting the peaks is one way to count the cycles in a run.

You open one or several data files, the app draws the pressure curves and marks the detected peaks, and you can adjust the detection rules and the time alignment between files to compare them side by side.

## What you see when you open it

A single window with four areas:

1. **File controls** at the top — buttons to add files and clear the list.
2. **Peak-detection parameters** — four numbers that control how sensitive the peak detector is.
3. **Time alignment controls** — once files are loaded, a row per file with a slider and number so you can shift each file forward or backward in time to overlay them.
4. **A live chart at the bottom** — each file in its own color, with detected peaks marked. You can click-and-drag a box to zoom in, and there's a "Reset Zoom" button.

## How you use it

A typical session looks like this:

1. Click **Add Files** and pick one or more text data files. Each file's first column is the time, the second column is the pressure.
2. (Optional) Tweak the **detection parameters** — see below for what each one does.
3. Click **Process Files**. The app reads each file, counts the peaks, lists the totals in the text area, and draws the chart with peaks marked.
4. (Optional) Use the **time alignment** sliders to nudge files in time so their cycles line up — useful when comparing two runs that started at different moments.
5. Click-and-drag on the chart to zoom; click **Reset Zoom** to return to the full view.

## The four detection parameters

These control "what counts as a peak":

- **Min Height** — peaks must reach at least this pressure. Leave at 0 to disable.
- **Prominence** — how much a peak must stand out from the curve around it. The default (0.01) is usually a good starting point.
- **Min Distance** — peaks must be at least this many samples apart. The default (10) avoids counting noise wiggles.
- **Min Width** — peaks must be at least this wide. Leave at 0 to disable.

Tighten the parameters if you're seeing too many peaks; loosen them if it's missing real ones.

## Time alignment

Each loaded file gets its own row of controls. The slider goes from -50 to +50 (you can also type a number into the box). Click **Apply** to shift that file by that amount, **Zero** to reset just that file, or the master **Reset All Offsets** button to zero everything. This is purely a visual aid for comparing runs — it doesn't change the underlying files.

## Good to know

- The app only **reads** files; it never changes the originals.
- It expects plain text files with a header row and tab-separated columns; the first two columns are time and pressure.
- The peak detector uses a standard, well-tested algorithm, with a small extra rule to catch a peak right at the end of a run that simple methods miss.
- It runs locally on your machine; no internet connection is needed.
- If something goes wrong on startup, a windowed error dialog opens with a detailed message you can copy and send to a developer.

In short: a focused desktop tool for counting cycles in an ALD log and visually comparing multiple runs together.


# Read-Aloud Documentation Corpus: presentation/NanofabToolkit/DentonDecoder/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# DentonDecoder — A Plain-English Guide

This guide explains **DentonDecoder**, a desktop app from the NanofabToolkit that reads Denton evaporator `.dat` files or already-converted CSV logs and lets you chart any column over time. Written for a non-coder.

## What it does

A Denton evaporator's control software produces run logs with dozens of fields — chamber pressure, temperatures, power levels, flow rates, and so on. DentonDecoder can convert the machine's `.dat` file into a temporary CSV behind the scenes, or it can open an already-converted CSV directly. Looking at the raw table is hard; what you usually want is a chart of *one specific column* against time.

DentonDecoder is exactly that: a small desktop app where you pick one or more log files, choose which column to chart, and immediately see the graph. You can optionally switch to a logarithmic scale (helpful for vacuum-pressure data, which spans many orders of magnitude) and align multiple runs in time.

It is **not** the same as the DAT tools in UNanofabTools. DentonDecoder is a desktop GUI that can convert a selected `.dat` file and then graph arbitrary columns. The UNanofabTools DAT tools are command-line helpers focused on cleaning Denton 635 event logs and making pressure plots.

## How you use it

1. Launch the app and pick one or more Denton `.dat` or CSV log files.
2. Choose which column to chart from a dropdown (it lists every column the file contains).
3. The chart appears, showing that column over time.
4. Optionally tick a "log scale" box for pressure data, align multiple files in time, or save the chart as an image.

The default column when you first open a file is "Chamber Pressure (Torr)" — usually the most interesting one.

## What the chart shows

- The **x-axis** is time in seconds since the run started. Each row's timestamp (in `HH:MM:SS` form) is converted to "seconds since the first row."
- The **y-axis** is whatever column you picked.
- Crossing midnight is handled (one rollover correction).

## Good to know

- DentonDecoder only reads original files; `.dat` inputs are converted to temporary CSV files.
- The plotted CSV data needs a header row and `HH:MM:SS` timestamps in the first column.
- It runs locally — no internet required.
- The packaged Windows executable opens like any other program; no Python installation needed.
- If the app fails to start, a windowed error dialog appears with detailed diagnostics you can copy and send to a developer.

In short: a one-click way to turn Denton run logs into charts, with column selection, multi-file alignment, and a log-scale option for vacuum data.


# Read-Aloud Documentation Corpus: presentation/NanofabToolkit/ParalyneReader/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# ParalyneReader — A Plain-English Guide

This guide explains **ParalyneReader**, a NanofabToolkit desktop app for downloading and viewing Parylene-coater run data. Written for a non-coder.

## What it does

The Parylene coater has a Raspberry Pi that streams its analog readings (pressure, vapor, temperature) up to the cleanroom server during every run. The server stitches those streams into one CSV file per completed run and keeps them in a folder.

ParalyneReader is the app you open when you want to **see those runs from your desk**. It:

- Asks the server what Parylene run files are available.
- Lets you pick one (or several) and download them.
- Loads the data and plots it as a chart you can interact with.
- Applies smoothing if you ask, so trends are easier to see through the noise.
- Lets you nudge runs in time to overlay and compare them.

It is the desk-side counterpart to the coater's automatic uploads — the coater pushes data; this app pulls it back out.

## What you see when you open it

A single window with file controls and a chart area. Pressing a "List Files" button populates the list with what's currently on the server (newest first), shown with size and modified date. Pick the runs you care about, download them, and the chart fills in.

You'll also see options to:

- **Smooth** the data (moving averages, low-pass filtering — useful when the raw analog signal is jittery).
- **Normalize** between runs so different scales can be compared.
- **Shift one run in time** to align it with another.

## How a typical session goes

1. Open the app — it logs to a file in `logs/` so a developer can diagnose problems later.
2. Click to list the server's Parylene files. They appear newest-first with file sizes.
3. Pick one or more files and download them. The app uses background workers so the window stays responsive even on slow connections.
4. The chart shows each run's data, one color per run.
5. Smooth, normalize, or time-align as needed to make patterns visible.

## Good to know

- The app **only reads** server files; it never deletes or alters them.
- Downloads happen in the background — the app stays responsive.
- All connections are encrypted, though the app skips certificate verification (the internal certificate isn't in the standard trust store).
- A log file under `logs/paralyne_reader.log` records what the app did, which helps if something goes wrong.
- It connects to the same `/api/paralyne/analog/...` server endpoints documented under the flask server's sensor API session.

In short: a friendly desktop tool to browse, download, and compare Parylene coater run data without leaving your desk.


# Read-Aloud Documentation Corpus: presentation/NanofabToolkit/PreciousMetalReader/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# PreciousMetalReader — A Plain-English Guide

This guide explains **PreciousMetalReader**, a NanofabToolkit desktop app that pulls precious-metal usage records from the university system for a given month and produces a tidy summary. Written for a non-coder.

## What it does

When someone uses a Denton evaporator, the Center for Research Equipment & Services (CORES) records the precious metals consumed (gold, platinum, etc.). For billing and bookkeeping, the lab needs to pull those records out of CORES for a given month and reformat them.

PreciousMetalReader is the desktop app that does this. You pick a month and year, choose either a specific tool/metal combination or "all of them," and the app:

1. Connects to the CORES system over the internet.
2. Downloads the matching usage records for that month.
3. Summarizes them into a clean CSV file you can open in Excel.

It is **not** connected to the cleanroom's `nfhistory` server — it talks directly to CORES, which is a separate university system. (It happens to use the same CORES system as `HSCDownloader.py`, which we documented under UNanofabTools, but for a different kind of data.)

## What you see when you open it

A window with:

- A **date picker** at the top — choose a month from a dropdown and type a year.
- A **mode toggle** — "Specific Tool/Metal" or "All Tools/Metals."
- In "specific" mode, a **machine dropdown** (Denton 635, Denton 18, TMV) and a **metal dropdown** (the options update when you pick the machine).
- A **Download** button.
- Status and result information.

## How a session goes

1. Pick a month (e.g. March) and a year.
2. Choose **Specific** if you want a single tool/metal, or **All** to pull everything.
3. If specific, choose the machine, and then the metal from the list that appears.
4. Click **Download**. The app talks to CORES and saves the results as a CSV in a `downloads/` folder next to the app.
5. Open the CSV in Excel (or any spreadsheet) to see the summary.

## Good to know

- The app **only reads** from CORES; it never changes anything there.
- It needs an **internet connection** and a valid access token (the token is built into the app for now).
- All connections are encrypted.
- A log file records what the app did, which helps if downloads fail.
- The downloads end up in a `downloads/` folder next to the app — that's where to look for the resulting CSVs.

## Where it fits

```
   CORES (the records)
        │  download
        ▼
   PreciousMetalReader (this app)
        │  summarize
        ▼
   downloads/<month>_<metal>.csv  → open in Excel
```

In short: a one-button way to pull a month's precious-metal usage from CORES and turn it into a spreadsheet you can hand to billing.


# Read-Aloud Documentation Corpus: presentation/NanofabToolkit/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# NanofabToolkit — Layperson Presentations

Plain-English guides and slide decks for the desktop tools and Pico firmware in the `NanofabToolkit` repository. Each folder below contains a `README.md` (the layman guide) and, where appropriate, a `slides/` subfolder with a `.pptx` deck.

The companion developer documentation lives at `../documentation/NanofabToolkit/`. Bugs and tech debt are tracked separately in `../known-issues/NanofabToolkit/`.

## What's in each folder

| Folder | What it is | Slides |
|--------|------------|--------|
| `ALDPeakCounter/` (reference path: ALDPeakCounter/README.md) | Desktop GUI that counts pressure peaks in ALD log files, with per-file time alignment and a comparison chart. | yes |
| `DentonDecoder/` (reference path: DentonDecoder/README.md) | Desktop GUI that opens Denton `.dat` or CSV logs and charts any column against time. | yes |
| `ParalyneReader/` (reference path: ParalyneReader/README.md) | Desktop GUI that lists, downloads, and visualizes Parylene-coater run files from the cleanroom server. | yes |
| `PreciousMetalReader/` (reference path: PreciousMetalReader/README.md) | Desktop GUI that pulls a month's precious-metal usage records from CORES and writes a CSV summary. | yes |
| `PicoHelperTools/` (reference path: PicoHelperTools/README.md) | Pico firmware (particle / env / combined) — the current, canonical copies. Older copies exist in UNanofabTools. | yes |
| `ParticleSensor/` (reference path: ParticleSensor/README.md) | PyQt desktop particle-data viewer with env-data sub-boxes — the current, canonical copy. Older copy exists in UNanofabTools. | yes |

## A note on the overlap with UNanofabTools

Both `PicoHelperTools/` (Pico firmware) and `ParticleSensor/` (the desktop particle viewer) also exist in the sibling `UNanofabTools` repository as **older copies**. The files in *this* tree are the current, canonical versions and the ones to extend going forward; the UNanofabTools copies are kept for historical reference only. Their docs in `documentation/UNanofabTools/picofirmware/` and `documentation/UNanofabTools/particlepctools/` now point at this folder.

## How the materials fit together

For each non-overlap tool you get three things:

1. **A layman guide** in this tree (`presentation/NanofabToolkit/<tool>/README.md`) — the plain-English version, for non-coders.
2. **A slide deck** (`presentation/NanofabToolkit/<tool>/slides/*.pptx`) — the same material as slides with full speaker notes.
3. **Developer documentation** in the parallel tree (`documentation/NanofabToolkit/<tool>/`) — the formal reference for whoever maintains the code.

A separate `known-issues/NanofabToolkit/<tool>.md` file lists bugs and tech debt for each tool, kept out of the docs so a successor sees a clean handoff and a maintainer sees a tidy to-do list.

## See also

The sibling UNanofabTools repository is documented in parallel at `../UNanofabTools/` (this tree), `../../documentation/UNanofabTools/`, and `../../known-issues/UNanofabTools/`. Cross-references between the two are used wherever a tool spans both repos (firmware, particle viewer, CORES integrations).


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# UNanofabTools — Layperson Presentations

Plain-English guides and slide decks for every tool in the UNanofabTools repository. Each folder below contains a `README.md` (the layman guide) and a `slides/` subfolder (with one or more `.pptx` files plus a `_build/` source that lets the decks be regenerated).

The companion developer documentation lives in a parallel tree at `../documentation/UNanofabTools/`. Bugs and tech debt for each tool are kept separately in `../known-issues/UNanofabTools/` so the handoff materials stay clean.

## What's in each folder

| Folder | What it is | Status |
|--------|------------|--------|
| `flaskserver/` (reference path: flaskserver/README.md) | The current website's server — auth, tasks, machine pages, sensor API, chemical inventory. The largest module; 16 layman docs + 16 decks. | **Active** |
| `hscdownloader/` (reference path: hscdownloader/README.md) | The supply line that pulls each machine's run data from CORES and writes the spreadsheets the website displays. | **Active** |
| `picofirmware/` (reference path: picofirmware/README.md) | The small programs running on the Raspberry Pi sensors (particles, vacuum gauges, Parylene streams) that feed the server. | **Active** — Pico firmware *(older copies; canonical: NanofabToolkit/PicoHelperTools)* |
| `particlepctools/` (reference path: particlepctools/README.md) | The desktop particle-data viewer and the test-data generator. | **Active** — viewer is the older copy *(canonical: NanofabToolkit/ParticleSensor)*; generator is canonical here |
| `filetransfer/` (reference path: filetransfer/README.md) | The per-machine PowerShell/batch scripts that ship each tool's logs up to the server. | **Active** |
| `dattools/` (reference path: dattools/README.md) | DATfixer + DATgrapher: convert the Denton 635's binary logs into readable text and pressure-vs-time charts. | **Active** |
| `utilities/` (reference path: utilities/README.md) | A handful of small helpers — peak counter, certificate converter, chem-DB setup, a developer file fetcher, and one unfinished stub. | **Active** (mixed) |
| `serveraccess/` (reference path: serveraccess/README.md) | How to actually log in to the server — the two-hop SSH route through CADE, the shared `phelan` account, and how to use the `flaskserver` / `downloader` tmux sessions safely. | **Active** |
| `liveserver/` (reference path: liveserver/README.md) | What's actually running on `nfhistory` right now — a plain-English tour from a real read-only survey: TLS certs, services, what's healthy, what's weird. | **Active** |
| `hscdisplayerserver/` (reference path: hscdisplayerserver/README.md) | The original all-in-one server from before the modern site existed. | **Deprecated — kept for historical reference** |

## How the materials fit together

For each tool you get three things:

1. **A layman guide** in this tree (`presentation/UNanofabTools/<tool>/README.md`) — the plain-English version, for non-coders.
2. **A slide deck** (`presentation/UNanofabTools/<tool>/slides/*.pptx`) — the same material as slides with full speaker notes, suitable for presenting.
3. **Developer documentation** in the parallel tree (`documentation/UNanofabTools/<tool>/`) — the formal reference for whoever maintains the code.

A separate `known-issues/UNanofabTools/<tool>.md` file lists bugs and tech debt for each tool, kept out of the docs so a successor sees a clean handoff and a maintainer sees a tidy to-do list.

## Where to start

- New to the system? Open `flaskserver/README.md` (reference path: flaskserver/README.md) and the **Start Here** deck in `flaskserver/slides/`.
- Looking for a specific tool? Jump straight to its folder above.
- Maintaining the code? Use the developer documentation tree instead.


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/dattools/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# DAT Tools — A Plain-English Guide

This guide explains two small programs in the UNanofabTools repository: **DATfixer** and **DATgrapher**. It's written for someone without a coding background. If a term is unfamiliar, it's defined the first time it appears.

## What problem do these tools solve?

The **Denton 635** is an automated sputter-deposition system in the cleanroom. Every time it runs, it writes a log of what happened — timestamps, pressures, and machine events — into a file ending in `.DAT`.

The catch: that `.DAT` file is written in the machine's own **binary format**. "Binary" here means it's not plain text — if you open it in Notepad, you see a jumble of unreadable symbols, because the numbers and control codes are stored as raw bytes rather than as letters you can read. The useful information (like the chamber pressure at each moment) is in there, but it's encoded.

These two tools turn that jumble into something a human can use:

- **DATfixer** reads a raw `.DAT` file and writes out a clean, readable `.txt` file — and can optionally draw a graph.
- **DATgrapher** takes a cleaned `.txt` file and draws a pressure-versus-time graph you can look at or save.

Think of DATfixer as the *translator* and DATgrapher as the *chart maker*. You usually run DATfixer first, then DATgrapher on its output (though DATfixer can also make a graph directly).

## Where they run

These are **command-line tools** — you run them by typing a command, not by clicking an icon. They're meant to be run on a Windows machine (the same one that has the `.DAT` file) from PowerShell, which is Windows' built-in command window. They are not part of the website/server; they're standalone helpers a person runs by hand when they need to read a Denton log.

They rely on two common add-on libraries — **matplotlib** (for drawing graphs) and **numpy** (for number handling) — which need to be installed once on the machine.

## DATfixer: the translator

### What it does, step by step

1. It opens the raw `.DAT` file and reads all the bytes.
2. It looks for a specific marker the Denton uses to mark a measurement, and decodes the eight bytes after it into a real number (a pressure reading). It writes that number in square brackets, like `[0.000000486000]`.
3. It looks for another marker the Denton uses to separate pieces of information, and replaces it with a comma.
4. It strips out the leftover invisible "control characters" that made the file unreadable (while keeping useful ones like line breaks and tabs).
5. It tidies the result: it puts each timestamp on its own line and adds commas between items so the data lines up neatly.
6. It saves the cleaned result as a `.txt` file. By default the new file has the same name as the original with `_cleaned` added.

The result is a text file where each line looks roughly like a timestamp followed by readings and machine states, separated by commas — something you can open, read, search, or paste into a spreadsheet.

### How to run it

In PowerShell, navigate to the folder containing the program and your `.DAT` file, then type:

```
python.exe .\DATfixer.py YourLogFile.DAT
```

That's the minimum — it produces `YourLogFile_cleaned.txt` next to the original.

### The options

You can add any of these to change the behavior:

- `-o NAME` (or `--output NAME`) — save the cleaned file somewhere else, or under a different name.
- `--strict` — remove *all* invisible characters, including line breaks and tabs. Produces a denser, less readable file; rarely needed.
- `--raw` — skip the "make it pretty" formatting. You get the decoded data without the timestamp-per-line and tidy spacing.
- `--no-commas` — don't insert commas between items.
- `--graph` — in addition to the text file, draw a pressure-vs-time graph and save it as a `.png` image with the same name.
- `-h` (or `--help`) — print a help message listing all of these.

So a common "give me the text and a graph" command is:

```
python.exe .\DATfixer.py YourLogFile.DAT --graph
```

## DATgrapher: the chart maker

### What it does

DATgrapher reads a *cleaned* text file (the kind DATfixer produces) and makes a pressure-versus-time chart. It scans each line for a timestamp and a bracketed pressure value, converts the timestamps into "seconds since the run started," and plots pressure over time. By default it pops the chart up on screen; you can also save it to an image file.

### How to run it

```
python.exe .\DATgrapher.py YourLogFile_cleaned.txt
```

This opens a window showing the graph.

### The options

- `-o NAME` (or `--output NAME`) — save the graph to an image file at this path.
- `--no-display` — don't pop up a window; just save the image (useful when running on a machine with no screen). If you use this without `-o`, it saves a `.png` next to the input.
- `--log` — use a logarithmic scale for the pressure axis. This is helpful because vacuum pressures span a huge range (from near atmospheric down to very tiny numbers); a log scale makes the whole pump-down visible at once instead of squashing the small numbers flat.
- `-h` (or `--help`) — print the help message.

## Which tool should I use?

- Just want to *read* a Denton log? Run **DATfixer** and open the resulting `.txt`.
- Want a *quick graph*? Run **DATfixer** with `--graph`, or run **DATgrapher** on an already-cleaned file.
- Already have cleaned files and want to *re-plot* them (e.g. with a log scale)? Use **DATgrapher**.

## Good to know

- These tools only read your files; they don't change the original `.DAT`. The original is always preserved.
- DATgrapher expects DATfixer's *cleaned* output, not a raw `.DAT`. Point it at the `.txt`, not the `.DAT`.
- A run that crosses midnight is handled with a small correction, but logs spanning more than one full day aren't something these tools were designed for.
- If only a few data points are found, the tools print a warning — usually a sign the input wasn't the expected format.

That's the whole story: one tool to translate the Denton's binary logs into readable text, and one to chart the pressure over time.


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/utilities/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Utilities — A Plain-English Guide

This guide covers a handful of small, standalone helper programs in the repository that don't belong to any larger tool. Written for a non-coder; terms are defined as they appear.

These are odds-and-ends: a peak counter, a certificate converter, a database setup script, a remote-file fetcher, and one unfinished placeholder. They share nothing except being small, single-purpose helpers.

## peakCount.py — counting peaks in pressure data

When a vacuum or deposition process runs, the pressure rises and falls, producing "peaks" in the data. Counting those peaks is sometimes how you count cycles or events in a run.

`peakCount.py` is a command-line tool that reads a data file of pressure readings and counts the peaks for you. You can:

- give it one file or several at once,
- tune how big or distinct a bump must be to count as a peak,
- and optionally show a graph with the detected peaks marked.

It uses well-established math (a standard peak-finding algorithm) plus a little extra logic to catch a peak right at the end of a run, which simple algorithms often miss. There's a companion notes file (`peakCount.md`) and a fuller graphical version of this idea in the separate NanofabToolkit (the "ALD Peak Counter").

## gencert.py — preparing the website's security certificate

A secure website needs a **certificate** (the thing that gives you the padlock in the browser). Certificates often arrive in one combined file format (`.pfx`), but the server software needs them split into two separate files (a public `cert.pem` and a private `key.pem`).

`gencert.py` does that one-time conversion: it reads the combined `.pfx` file and writes out the two `.pem` files the server expects. It's run by hand whenever the certificate is renewed. (It writes the private key without a passphrase, which is what the server's setup expects — but that means the key file must be kept somewhere safe.)

## init_chem_db.py — setting up the chemical database

The chemical inventory (covered in the server sessions) lives in a PostgreSQL database. Before that database can be used, its tables have to be created.

`init_chem_db.py` does exactly that: it connects to the PostgreSQL database and runs the setup script (`chem_schema.sql`) that creates all the inventory tables and views. You run it once when first setting up the inventory on a new server. (Note: the live inventory has gained a few extra pieces over time that aren't in that setup script yet — the server's developer notes cover this.)

## fetch_ssh.py — grabbing a file off the server

This is a small **developer convenience**, not something normal users touch. It logs in to the server (through the university's secure gateway) and copies one specific file — the chemical-inventory code — down to the developer's machine, so it can be compared against the local copy.

It's the kind of personal helper a developer writes for themselves. It has the developer's own usernames and paths baked in, so it isn't meant for general use.

## NMonStore.py — an unfinished placeholder

This file is a **stub** — a skeleton that was started but never finished. As written, it just counts to five while writing numbers to a text file, with a comment literally saying "Your code logic goes here." It doesn't do anything useful yet. It appears to be the beginning of a "neutral monitor" data-storing program that was never completed. A future maintainer should either finish it or remove it.

## Summary

| File | One-line purpose | Status |
|------|------------------|--------|
| `peakCount.py` | Count peaks in pressure data files | Working |
| `gencert.py` | Convert a `.pfx` certificate into `.pem` files | Working (run by hand) |
| `init_chem_db.py` | Create the chemical-inventory database tables | Working (run once) |
| `fetch_ssh.py` | Developer helper to pull a file off the server | Personal/dev only |
| `NMonStore.py` | Intended data-storing monitor | Unfinished stub |

These are the workshop drawer of the project — small tools kept around for specific occasional jobs.


# Module Slide Note Corpus



## Slide Notes From presentation/NanofabToolkit/ALDPeakCounter/slides/_build/build_tool.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); const fs = require(
- ); const { Deck } = require(
- ); const M = require(
- ); const modPath = process.argv[2]; if (!modPath) { console.error(
- ); process.exit(1); } const OUT = process.env.OUT || path.join(__dirname,
- ); fs.mkdirSync(OUT, { recursive: true }); (async () => { const mod = require(path.join(__dirname, modPath)); const repo = mod.repo ||
- ; const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter, footer: repo +
- + mod.title }); mod.build(d); const outPath = path.join(OUT, mod.filename); await d.save(outPath); console.log(


## Slide Notes From presentation/NanofabToolkit/ALDPeakCounter/slides/_build/deckkit.js

READ ALOUD OR USE AS SPEAKER NOTES:

- . */ const pptxgen = require(
- ); // ---- Palette ---- const C = { crimson:
- , // U of U primary crimsonDk:
- , // darker crimson for bands/title ink:
- , // near-black body text gray:
- , // muted text grayLt:
- , // light panel / code box background panelLine:
- , // panel border codeInk:
- , // code text white:
- , }; const FONT_H =
- ; // headers — has personality, professional const FONT_B =
- ; // body const FONT_M =
- ; // monospace for code const PW = 13.33, PH = 7.5; // page size (LAYOUT_WIDE) const MX = 0.7; // left/right margin const CONTENT_W = PW - MX * 2; function makeShadow() { return { type:
- , blur: 5, offset: 2, angle: 135, opacity: 0.12 }; } class Deck { constructor({ title, subtitle, author, footer }) { const p = new pptxgen(); p.layout =
- ; p.author = author ||
- ; p.title = title; this.p = p; this.shortTitle = title; this.footer = footer ||
- ; this.n = 0; } // crimson footer band + slide number; consistent motif on content slides _footer(slide) { slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: PH - 0.32, w: PW, h: 0.32, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(this.footer, { x: MX, y: PH - 0.32, w: 8, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); slide.addText(String(this.n), { x: PW - 1.2, y: PH - 0.32, w: 0.5, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); } // small crimson square motif + title at top of content slides _header(slide, title) { slide.addShape(this.p.shapes.RECTANGLE, { x: MX, y: 0.55, w: 0.18, h: 0.36, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(title, { x: MX + 0.32, y: 0.42, w: CONTENT_W - 0.32, h: 0.7, margin: 0, fontFace: FONT_H, fontSize: 26, bold: true, color: C.ink, align:
- , }); } _content(title) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; this._header(slide, title); this._footer(slide); return slide; } _notes(slide, notes) { if (notes) slide.addNotes(notes); } // ---------- TITLE SLIDE ---------- title_slide({ kicker, title, subtitle, presenter, role, dept, date, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; // left crimson band motif slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: PH, fill: { color: C.crimson }, line: { type:
- }, }); // kicker (topic number / series) slide.addText(kicker ||
- , { x: 1.0, y: 1.5, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color: C.crimson, charSpacing: 2, align:
- , }); // main title slide.addText(title, { x: 1.0, y: 2.0, w: PW - 2, h: 1.7, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.ink, align:
- , }); // subtitle slide.addText(subtitle ||
- , { x: 1.0, y: 3.75, w: PW - 2.2, h: 0.8, margin: 0, fontFace: FONT_B, fontSize: 17, color: C.gray, align:
- , }); // presenter block const block = [ { text: presenter ||
- , options: { bold: true, color: C.ink, fontSize: 14, breakLine: true } }, ]; if (role) block.push({ text: role, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (dept) block.push({ text: dept, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (date) block.push({ text: date, options: { color: C.grayLt, fontSize: 11 } }); slide.addText(block, { x: 1.0, y: 5.5, w: PW - 2, h: 1.4, margin: 0, fontFace: FONT_B, align:
- , lineSpacingMultiple: 1.15, }); this._notes(slide, notes); return slide; } // ---------- SECTION DIVIDER ---------- section_slide({ label, title, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.crimsonDk }; slide.addText(label ||
- , { x: 1.0, y: 2.7, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color:
- , charSpacing: 2, }); slide.addText(title, { x: 1.0, y: 3.2, w: PW - 2, h: 1.6, margin: 0, fontFace: FONT_H, fontSize: 34, bold: true, color: C.white, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- BULLETS ---------- bullets({ title, intro, bullets, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const items = bullets.map((b, i) => { if (typeof b ===
- ) { return { text: b, options: { bullet: { code:
- , indent: 18 }, color: C.ink, fontSize: 15, paraSpaceAfter: 10, breakLine: true } }; } // {t, sub:true} return { text: b.t, options: { bullet: { code:
- , indent: 18 }, indentLevel: 1, color: C.gray, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true } }; }); slide.addText(items, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: PH - y - 0.6, margin: 0, fontFace: FONT_B, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- CODE / MONO CALLOUT ---------- code({ title, intro, code, caption, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, color: C.ink, valign:
- , }); y += 0.65; } const boxH = PH - y - (caption ? 1.0 : 0.6); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: boxH, rectRadius: 0.06, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(code, { x: MX + 0.5, y: y + 0.12, w: CONTENT_W - 0.7, h: boxH - 0.24, margin: 0, fontFace: FONT_M, fontSize: 12.5, color: C.codeInk, align:
- , }); if (caption) { slide.addText(caption, { x: MX + 0.32, y: y + boxH + 0.1, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 12, italic: true, color: C.gray, valign:
- , }); } this._notes(slide, notes); return slide; } // ---------- TWO COLUMN ---------- twocol({ title, left, right, notes }) { const slide = this._content(title); const y = 1.45, colW = (CONTENT_W - 0.5) / 2, h = PH - y - 0.6; const colX = [MX, MX + colW + 0.5]; [left, right].forEach((col, idx) => { const x = colX[idx]; // header chip slide.addText(col.heading, { x, y, w: colW, h: 0.45, margin: 0, fontFace: FONT_H, fontSize: 16, bold: true, color: C.crimson, valign:
- , }); const items = col.items.map((b) => ({ text: typeof b ===
- ? b : b.t, options: { bullet: { code:
- , indent: 16 }, color: C.ink, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true }, })); slide.addText(items, { x, y: y + 0.5, w: colW, h: h - 0.5, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- TABLE ---------- table({ title, intro, headers, rows, colW, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, italic: true, color: C.gray, valign:
- , }); y += 0.55; } const head = headers.map((htext) => ({ text: htext, options: { fill: { color: C.crimson }, color: C.white, bold: true, fontSize: 12.5, valign:
- }, })); const body = rows.map((r, ri) => r.map((cell) => ({ text: String(cell), options: { fill: { color: ri % 2 === 0 ? C.white : C.panel }, color: C.ink, fontSize: 11.5, valign:
- , }, })) ); slide.addTable([head, ...body], { x: MX + 0.32, y, w: CONTENT_W - 0.32, colW: colW || undefined, border: { type:
- , pt: 0.5, color: C.panelLine }, align:
- , fontFace: FONT_B, rowH: 0.3, autoPage: false, }); this._notes(slide, notes); return slide; } // ---------- NUMBERED STEPS / PROCESS ---------- steps({ title, intro, steps, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.6; } const n = steps.length; const avail = PH - y - 0.6; const rowH = Math.min(0.95, avail / n); steps.forEach((s, i) => { const ry = y + i * rowH; // number circle slide.addShape(this.p.shapes.OVAL, { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(String(i + 1), { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, margin: 0, fontFace: FONT_B, fontSize: 15, bold: true, color: C.white, align:
- , }); const parts = [{ text: s.h +
- , options: { bold: true, color: C.ink, fontSize: 14 } }]; if (s.d) parts.push({ text: s.d, options: { color: C.gray, fontSize: 13 } }); slide.addText(parts, { x: MX + 0.95, y: ry - 0.12, w: CONTENT_W - 0.95, h: 0.69, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- BIG STAT CALLOUTS (grid of numbers) ---------- stats({ title, intro, stats, notes }) { const slide = this._content(title); let y = 1.5; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const n = stats.length; const gap = 0.4; const cardW = (CONTENT_W - gap * (n - 1)) / n; const cardH = 2.4; stats.forEach((s, i) => { const x = MX + i * (cardW + gap); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(s.big, { x, y: y + 0.3, w: cardW, h: 1.1, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.crimson, align:
- , }); slide.addText(s.label, { x: x + 0.15, y: y + 1.45, w: cardW - 0.3, h: 0.85, margin: 0, fontFace: FONT_B, fontSize: 13, color: C.ink, align:


## Slide Notes From presentation/NanofabToolkit/ALDPeakCounter/slides/_build/meta.js

READ ALOUD OR USE AS SPEAKER NOTES:

- Utah Nanofab · University of Utah
- UNanofabTools Server — A Plain-English Guide


## Slide Notes From presentation/NanofabToolkit/ALDPeakCounter/slides/_build/tooldecks/aldpeakcounter.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); module.exports = { filename:
- , build(d) { d.title_slide({ kicker:
- Count cycles in an ALD run and compare runs side by side. A plain-English walkthrough.
- This session covers ALDPeakCounter — a desktop app that counts and visualizes pressure peaks in ALD log files. Each peak corresponds
- to a deposition cycle, so counting them is one way to count cycles. We'll cover what it does, the four detection knobs, the time
- alignment feature for comparing runs, and the chart interactions. No coding background needed.
- What it does, in one breath
- Opens one or more pressure-vs-time data files.
- Detects peaks (= deposition cycles) in each.
- Plots them together, each file in its own color, peaks marked.
- Lets you shift files in time to overlay and compare them.
- Set the scope. The app loads ALD pressure log files, finds the peaks (each peak is roughly one deposition cycle), and overlays the
- curves with peaks marked. The standout feature: per-file time sliders so two runs that started at different moments can be aligned
- for visual comparison. It's a focused, single-purpose tool.
- , steps: [ { h:
- pick one or several text data files.
- set what counts as a peak.
- the app counts and plots; totals appear in the results panel.
- use per-file sliders to overlay runs.
- click-and-drag a box on the chart; Reset Zoom to return.
- Walk a typical session. Open files, tweak parameters if needed, click Process Files, optionally use the per-file time-offset sliders
- to line runs up, and box-zoom on the chart. The results panel lists each file's peak count and the times of the detected peaks.
- Peaks must reach at least this pressure (0 = ignore)
- How much a peak must stand out from its surroundings
- Minimum samples between peaks — avoids noise being counted
- Peaks must be at least this wide (0 = ignore)
- Cover the knobs. Min Height ignores peaks below a pressure threshold. Prominence is how much a bump stands out from the curve around
- it — the default of 0.01 is usually a good starting point. Min Distance is in samples (not seconds) and stops the detector from
- calling every wiggle a peak. Min Width filters out anything too narrow. Tighten to count fewer peaks; loosen to catch more.
- Time alignment, the secret weapon
- Each loaded file gets its own row of controls.
- Slider (-50 to +50) or type a number; Apply commits, Zero resets that file.
- Reset All Offsets zeros everything at once.
- Purely visual — the underlying files are never changed.
- Emphasize the time alignment, the feature that sets this app apart. After processing, each file has a row with a slider and a number
- box. Slide or type to shift that file forward or backward in time, click Apply, and the chart redraws. Zero clears just that file;
- Reset All clears everyone. This is purely a display offset — the files on disk aren't modified. Great for comparing two runs that
- What an input file looks like
- Plain text, header row, tab-separated; first two columns are time and pressure:
- time pressure (other columns ignored)
- Non-numeric rows are skipped; everything else is just data.
- Show the expected file shape so people know what to feed in. A header row, then tab-separated columns: the first is time, the second
- is pressure. Anything else in the file is ignored. Non-numeric rows are skipped without complaint. If the app reports zero peaks on
- a file that should have many, this format is the first thing to check.
- Legend shows the filename, peak count, and any time offset.
- Click and drag a box on the chart to zoom in.
- Reset Zoom returns to the full view.
- Cover the chart UX. Files get distinct colors and marker shapes so you can tell them apart. The legend lists each file's name, peak
- count, and any applied time offset. To zoom, click and drag a rectangle; Reset Zoom returns to the full view. It's straightforward
- and doesn't require menu diving.
- Uses a standard, well-tested algorithm (SciPy's find_peaks).
- Adds a small extra rule to catch a peak right at the end of a run.
- The detector is the same code used by UNanofabTools' peakCount.py.
- Returns peak count, peak times, and peak pressures — shown in the results panel.
- Reassure on the math. The detector is SciPy's well-trusted find_peaks, with a tailored extra rule for the end of a run (since
- boundary peaks are easy to miss). The same code is used by the command-line peakCount in UNanofabTools — this GUI is the friendly
- wrapper. For each file you get the count, the times, and the pressures at each peak.
- Runs locally; no network connection needed.
- If startup fails, a windowed error dialog shows full diagnostics.
- Packaged as a Windows executable via PyInstaller for non-developer users.
- Practical points. The app only reads files, never modifies them. It runs entirely on your computer with no network. On any startup
- error it pops up a detailed, copyable dialog — handy when shipped to a non-developer. It's packaged as a single Windows executable
- by PyInstaller so users don't need Python installed.
- Four detection knobs let you tune sensitivity.
- Per-file time alignment overlays runs without altering files.
- Same detection logic as UNanofabTools' peakCount.py.
- Wrap up. ALDPeakCounter is a small, focused, well-bounded tool: count cycles, compare runs visually, with one really useful feature
- (time alignment) and a clean chart UI. Questions welcome.


## Slide Notes From presentation/NanofabToolkit/DentonDecoder/slides/_build/build_tool.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); const fs = require(
- ); const { Deck } = require(
- ); const M = require(
- ); const modPath = process.argv[2]; if (!modPath) { console.error(
- ); process.exit(1); } const OUT = process.env.OUT || path.join(__dirname,
- ); fs.mkdirSync(OUT, { recursive: true }); (async () => { const mod = require(path.join(__dirname, modPath)); const repo = mod.repo ||
- ; const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter, footer: repo +
- + mod.title }); mod.build(d); const outPath = path.join(OUT, mod.filename); await d.save(outPath); console.log(


## Slide Notes From presentation/NanofabToolkit/DentonDecoder/slides/_build/deckkit.js

READ ALOUD OR USE AS SPEAKER NOTES:

- . */ const pptxgen = require(
- ); // ---- Palette ---- const C = { crimson:
- , // U of U primary crimsonDk:
- , // darker crimson for bands/title ink:
- , // near-black body text gray:
- , // muted text grayLt:
- , // light panel / code box background panelLine:
- , // panel border codeInk:
- , // code text white:
- , }; const FONT_H =
- ; // headers — has personality, professional const FONT_B =
- ; // body const FONT_M =
- ; // monospace for code const PW = 13.33, PH = 7.5; // page size (LAYOUT_WIDE) const MX = 0.7; // left/right margin const CONTENT_W = PW - MX * 2; function makeShadow() { return { type:
- , blur: 5, offset: 2, angle: 135, opacity: 0.12 }; } class Deck { constructor({ title, subtitle, author, footer }) { const p = new pptxgen(); p.layout =
- ; p.author = author ||
- ; p.title = title; this.p = p; this.shortTitle = title; this.footer = footer ||
- ; this.n = 0; } // crimson footer band + slide number; consistent motif on content slides _footer(slide) { slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: PH - 0.32, w: PW, h: 0.32, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(this.footer, { x: MX, y: PH - 0.32, w: 8, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); slide.addText(String(this.n), { x: PW - 1.2, y: PH - 0.32, w: 0.5, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); } // small crimson square motif + title at top of content slides _header(slide, title) { slide.addShape(this.p.shapes.RECTANGLE, { x: MX, y: 0.55, w: 0.18, h: 0.36, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(title, { x: MX + 0.32, y: 0.42, w: CONTENT_W - 0.32, h: 0.7, margin: 0, fontFace: FONT_H, fontSize: 26, bold: true, color: C.ink, align:
- , }); } _content(title) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; this._header(slide, title); this._footer(slide); return slide; } _notes(slide, notes) { if (notes) slide.addNotes(notes); } // ---------- TITLE SLIDE ---------- title_slide({ kicker, title, subtitle, presenter, role, dept, date, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; // left crimson band motif slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: PH, fill: { color: C.crimson }, line: { type:
- }, }); // kicker (topic number / series) slide.addText(kicker ||
- , { x: 1.0, y: 1.5, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color: C.crimson, charSpacing: 2, align:
- , }); // main title slide.addText(title, { x: 1.0, y: 2.0, w: PW - 2, h: 1.7, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.ink, align:
- , }); // subtitle slide.addText(subtitle ||
- , { x: 1.0, y: 3.75, w: PW - 2.2, h: 0.8, margin: 0, fontFace: FONT_B, fontSize: 17, color: C.gray, align:
- , }); // presenter block const block = [ { text: presenter ||
- , options: { bold: true, color: C.ink, fontSize: 14, breakLine: true } }, ]; if (role) block.push({ text: role, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (dept) block.push({ text: dept, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (date) block.push({ text: date, options: { color: C.grayLt, fontSize: 11 } }); slide.addText(block, { x: 1.0, y: 5.5, w: PW - 2, h: 1.4, margin: 0, fontFace: FONT_B, align:
- , lineSpacingMultiple: 1.15, }); this._notes(slide, notes); return slide; } // ---------- SECTION DIVIDER ---------- section_slide({ label, title, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.crimsonDk }; slide.addText(label ||
- , { x: 1.0, y: 2.7, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color:
- , charSpacing: 2, }); slide.addText(title, { x: 1.0, y: 3.2, w: PW - 2, h: 1.6, margin: 0, fontFace: FONT_H, fontSize: 34, bold: true, color: C.white, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- BULLETS ---------- bullets({ title, intro, bullets, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const items = bullets.map((b, i) => { if (typeof b ===
- ) { return { text: b, options: { bullet: { code:
- , indent: 18 }, color: C.ink, fontSize: 15, paraSpaceAfter: 10, breakLine: true } }; } // {t, sub:true} return { text: b.t, options: { bullet: { code:
- , indent: 18 }, indentLevel: 1, color: C.gray, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true } }; }); slide.addText(items, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: PH - y - 0.6, margin: 0, fontFace: FONT_B, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- CODE / MONO CALLOUT ---------- code({ title, intro, code, caption, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, color: C.ink, valign:
- , }); y += 0.65; } const boxH = PH - y - (caption ? 1.0 : 0.6); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: boxH, rectRadius: 0.06, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(code, { x: MX + 0.5, y: y + 0.12, w: CONTENT_W - 0.7, h: boxH - 0.24, margin: 0, fontFace: FONT_M, fontSize: 12.5, color: C.codeInk, align:
- , }); if (caption) { slide.addText(caption, { x: MX + 0.32, y: y + boxH + 0.1, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 12, italic: true, color: C.gray, valign:
- , }); } this._notes(slide, notes); return slide; } // ---------- TWO COLUMN ---------- twocol({ title, left, right, notes }) { const slide = this._content(title); const y = 1.45, colW = (CONTENT_W - 0.5) / 2, h = PH - y - 0.6; const colX = [MX, MX + colW + 0.5]; [left, right].forEach((col, idx) => { const x = colX[idx]; // header chip slide.addText(col.heading, { x, y, w: colW, h: 0.45, margin: 0, fontFace: FONT_H, fontSize: 16, bold: true, color: C.crimson, valign:
- , }); const items = col.items.map((b) => ({ text: typeof b ===
- ? b : b.t, options: { bullet: { code:
- , indent: 16 }, color: C.ink, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true }, })); slide.addText(items, { x, y: y + 0.5, w: colW, h: h - 0.5, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- TABLE ---------- table({ title, intro, headers, rows, colW, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, italic: true, color: C.gray, valign:
- , }); y += 0.55; } const head = headers.map((htext) => ({ text: htext, options: { fill: { color: C.crimson }, color: C.white, bold: true, fontSize: 12.5, valign:
- }, })); const body = rows.map((r, ri) => r.map((cell) => ({ text: String(cell), options: { fill: { color: ri % 2 === 0 ? C.white : C.panel }, color: C.ink, fontSize: 11.5, valign:
- , }, })) ); slide.addTable([head, ...body], { x: MX + 0.32, y, w: CONTENT_W - 0.32, colW: colW || undefined, border: { type:
- , pt: 0.5, color: C.panelLine }, align:
- , fontFace: FONT_B, rowH: 0.3, autoPage: false, }); this._notes(slide, notes); return slide; } // ---------- NUMBERED STEPS / PROCESS ---------- steps({ title, intro, steps, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.6; } const n = steps.length; const avail = PH - y - 0.6; const rowH = Math.min(0.95, avail / n); steps.forEach((s, i) => { const ry = y + i * rowH; // number circle slide.addShape(this.p.shapes.OVAL, { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(String(i + 1), { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, margin: 0, fontFace: FONT_B, fontSize: 15, bold: true, color: C.white, align:
- , }); const parts = [{ text: s.h +
- , options: { bold: true, color: C.ink, fontSize: 14 } }]; if (s.d) parts.push({ text: s.d, options: { color: C.gray, fontSize: 13 } }); slide.addText(parts, { x: MX + 0.95, y: ry - 0.12, w: CONTENT_W - 0.95, h: 0.69, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- BIG STAT CALLOUTS (grid of numbers) ---------- stats({ title, intro, stats, notes }) { const slide = this._content(title); let y = 1.5; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const n = stats.length; const gap = 0.4; const cardW = (CONTENT_W - gap * (n - 1)) / n; const cardH = 2.4; stats.forEach((s, i) => { const x = MX + i * (cardW + gap); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(s.big, { x, y: y + 0.3, w: cardW, h: 1.1, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.crimson, align:
- , }); slide.addText(s.label, { x: x + 0.15, y: y + 1.45, w: cardW - 0.3, h: 0.85, margin: 0, fontFace: FONT_B, fontSize: 13, color: C.ink, align:


## Slide Notes From presentation/NanofabToolkit/DentonDecoder/slides/_build/meta.js

READ ALOUD OR USE AS SPEAKER NOTES:

- Utah Nanofab · University of Utah
- UNanofabTools Server — A Plain-English Guide


## Slide Notes From presentation/NanofabToolkit/DentonDecoder/slides/_build/tooldecks/dentondecoder.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); module.exports = { filename:
- , build(d) { d.title_slide({ kicker:
- Chart any column of a Denton .dat or CSV log against time. A plain-English walkthrough.
- This session covers DentonDecoder, a small desktop app that reads Denton evaporator .dat files or CSV logs and lets you chart any column over time.
- Useful for inspecting a single run's pressure, temperature, power, or any other recorded value. No coding background needed. We'll
- also clarify what makes it different from the DAT tools in UNanofabTools.
- Denton runs produce logs with dozens of fields — hard to read raw.
- The app can convert .dat inputs to temporary CSV, or open CSV directly.
- Usually you only care about one column over time (pressure, temp, etc.).
- DentonDecoder lets you pick a column and instantly see the chart.
- Optional log scale makes vacuum data readable across many orders of magnitude.
- Set up the why. A Denton run produces data with many columns and many rows — useful, but not easy to scan. DentonDecoder can convert
- .dat inputs into a temporary CSV or open a CSV directly. The common need is a chart of just one column over time. The log
- scale option is genuinely useful for vacuum pressure, which spans many orders of magnitude.
- Not the same as DATfixer/DATgrapher
- Works on Denton .dat and CSV logs.
- GUI conversion to temporary CSV.
- Pick any column to chart.
- Focused on pressure event logs.
- Specifically the Denton 635 event logs.
- Important clarification, because they sound similar. DentonDecoder is the desktop GUI workflow: choose .dat or CSV files, convert when
- needed, and graph arbitrary columns. The DAT tools in UNanofabTools are command-line helpers focused on cleaning Denton 635 event logs
- and pressure plots. They overlap in audience, not in workflow.
- , steps: [ { h:
- and pick one or more Denton .dat or CSV log files.
- from a dropdown — the app reads the file's header to list options.
- rendered immediately; switch columns at will.
- useful for pressure; align files or save the chart as an image.
- Walk through. Open .dat or CSV files. The app converts .dat files, reads the header row, and offers every common column in a dropdown.
- Pick one and the chart appears. Switch columns freely. Toggle log scale for pressure or other huge-range data. Save the chart if needed.
- The default starting column is Chamber Pressure (Torr) — usually the most interesting one.
- Each row's HH:MM:SS timestamp becomes 'seconds since the first row':
- Row 1: 14:23:05 → t = 0
- Row 2: 14:23:10 → t = 5
- Row 3: 14:23:15 → t = 10
- Crossing midnight is auto-corrected (one rollover).
- The x-axis is elapsed time since the run started.
- Explain the time math briefly. Each timestamp is HH:MM:SS only (no date). The first row's time becomes the zero point, and every
- later row is plotted as seconds since that point. If the run crosses midnight, the app adds 24 hours automatically — for one
- rollover. Runs longer than a day or with multiple midnights aren't supported and are flagged in the developer notes.
- Why a log scale matters
- Vacuum pressure can span from atmospheric to 1e-7 — that's 9 orders of magnitude.
- On a regular y-axis the small numbers all sit near zero.
- On a log axis you can see the whole pump-down curve clearly.
- One checkbox; toggle it as needed.
- Make the log-scale option's value concrete. Vacuum pressure during a pump-down spans many orders of magnitude. On a linear scale,
- everything small looks like zero — the early high-pressure portion crushes the rest flat. A logarithmic y-axis spreads the orders
- out evenly so the whole curve is visible. One checkbox toggles it. Most pressure-vs-time inspections want this on.
- What the input file needs to look like
- .dat input convertible by the app, or CSV with a header row.
- First column = timestamp in HH:MM:SS form.
- Any number of other columns, with their names in the header.
- Rows the app can't parse are quietly skipped.
- Set expectations on input. .dat files are converted to temporary CSV first. The plotted CSV must have a header row (so the app can list
- column names) and HH:MM:SS timestamps in the first column. Other columns can be anything. Bad rows (non-numeric values, missing fields)
- are skipped without complaint. If a column the app says it found produces only a few points, that's the file format being not quite
- .dat conversion writes a temporary CSV.
- Runs locally; no internet needed.
- If startup fails, a windowed error dialog shows full diagnostics.
- Packaged as a Windows executable via PyInstaller — no Python install needed.
- Practical points. Like its sibling tools, it only reads, never modifies source files; .dat conversion writes a temporary CSV. Runs entirely on your computer. The error-dialog
- fallback on startup is genuinely useful — when the app fails for a non-developer, they get a copyable message instead of a silent
- crash. Packaged with PyInstaller, so it's a single .exe to run.
- Optional log scale, file alignment, and save-as-image.
- Different from the UNanofabTools DAT command-line workflow.
- Wrap up. DentonDecoder is a GUI visualizer for Denton .dat or CSV logs. It complements the DAT tools, not duplicates them. Simple
- input, simple output, useful log-scale option. Questions welcome.


## Slide Notes From presentation/NanofabToolkit/ParalyneReader/slides/_build/build_tool.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); const fs = require(
- ); const { Deck } = require(
- ); const M = require(
- ); const modPath = process.argv[2]; if (!modPath) { console.error(
- ); process.exit(1); } const OUT = process.env.OUT || path.join(__dirname,
- ); fs.mkdirSync(OUT, { recursive: true }); (async () => { const mod = require(path.join(__dirname, modPath)); const repo = mod.repo ||
- ; const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter, footer: repo +
- + mod.title }); mod.build(d); const outPath = path.join(OUT, mod.filename); await d.save(outPath); console.log(


## Slide Notes From presentation/NanofabToolkit/ParalyneReader/slides/_build/deckkit.js

READ ALOUD OR USE AS SPEAKER NOTES:

- . */ const pptxgen = require(
- ); // ---- Palette ---- const C = { crimson:
- , // U of U primary crimsonDk:
- , // darker crimson for bands/title ink:
- , // near-black body text gray:
- , // muted text grayLt:
- , // light panel / code box background panelLine:
- , // panel border codeInk:
- , // code text white:
- , }; const FONT_H =
- ; // headers — has personality, professional const FONT_B =
- ; // body const FONT_M =
- ; // monospace for code const PW = 13.33, PH = 7.5; // page size (LAYOUT_WIDE) const MX = 0.7; // left/right margin const CONTENT_W = PW - MX * 2; function makeShadow() { return { type:
- , blur: 5, offset: 2, angle: 135, opacity: 0.12 }; } class Deck { constructor({ title, subtitle, author, footer }) { const p = new pptxgen(); p.layout =
- ; p.author = author ||
- ; p.title = title; this.p = p; this.shortTitle = title; this.footer = footer ||
- ; this.n = 0; } // crimson footer band + slide number; consistent motif on content slides _footer(slide) { slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: PH - 0.32, w: PW, h: 0.32, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(this.footer, { x: MX, y: PH - 0.32, w: 8, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); slide.addText(String(this.n), { x: PW - 1.2, y: PH - 0.32, w: 0.5, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); } // small crimson square motif + title at top of content slides _header(slide, title) { slide.addShape(this.p.shapes.RECTANGLE, { x: MX, y: 0.55, w: 0.18, h: 0.36, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(title, { x: MX + 0.32, y: 0.42, w: CONTENT_W - 0.32, h: 0.7, margin: 0, fontFace: FONT_H, fontSize: 26, bold: true, color: C.ink, align:
- , }); } _content(title) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; this._header(slide, title); this._footer(slide); return slide; } _notes(slide, notes) { if (notes) slide.addNotes(notes); } // ---------- TITLE SLIDE ---------- title_slide({ kicker, title, subtitle, presenter, role, dept, date, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; // left crimson band motif slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: PH, fill: { color: C.crimson }, line: { type:
- }, }); // kicker (topic number / series) slide.addText(kicker ||
- , { x: 1.0, y: 1.5, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color: C.crimson, charSpacing: 2, align:
- , }); // main title slide.addText(title, { x: 1.0, y: 2.0, w: PW - 2, h: 1.7, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.ink, align:
- , }); // subtitle slide.addText(subtitle ||
- , { x: 1.0, y: 3.75, w: PW - 2.2, h: 0.8, margin: 0, fontFace: FONT_B, fontSize: 17, color: C.gray, align:
- , }); // presenter block const block = [ { text: presenter ||
- , options: { bold: true, color: C.ink, fontSize: 14, breakLine: true } }, ]; if (role) block.push({ text: role, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (dept) block.push({ text: dept, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (date) block.push({ text: date, options: { color: C.grayLt, fontSize: 11 } }); slide.addText(block, { x: 1.0, y: 5.5, w: PW - 2, h: 1.4, margin: 0, fontFace: FONT_B, align:
- , lineSpacingMultiple: 1.15, }); this._notes(slide, notes); return slide; } // ---------- SECTION DIVIDER ---------- section_slide({ label, title, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.crimsonDk }; slide.addText(label ||
- , { x: 1.0, y: 2.7, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color:
- , charSpacing: 2, }); slide.addText(title, { x: 1.0, y: 3.2, w: PW - 2, h: 1.6, margin: 0, fontFace: FONT_H, fontSize: 34, bold: true, color: C.white, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- BULLETS ---------- bullets({ title, intro, bullets, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const items = bullets.map((b, i) => { if (typeof b ===
- ) { return { text: b, options: { bullet: { code:
- , indent: 18 }, color: C.ink, fontSize: 15, paraSpaceAfter: 10, breakLine: true } }; } // {t, sub:true} return { text: b.t, options: { bullet: { code:
- , indent: 18 }, indentLevel: 1, color: C.gray, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true } }; }); slide.addText(items, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: PH - y - 0.6, margin: 0, fontFace: FONT_B, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- CODE / MONO CALLOUT ---------- code({ title, intro, code, caption, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, color: C.ink, valign:
- , }); y += 0.65; } const boxH = PH - y - (caption ? 1.0 : 0.6); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: boxH, rectRadius: 0.06, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(code, { x: MX + 0.5, y: y + 0.12, w: CONTENT_W - 0.7, h: boxH - 0.24, margin: 0, fontFace: FONT_M, fontSize: 12.5, color: C.codeInk, align:
- , }); if (caption) { slide.addText(caption, { x: MX + 0.32, y: y + boxH + 0.1, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 12, italic: true, color: C.gray, valign:
- , }); } this._notes(slide, notes); return slide; } // ---------- TWO COLUMN ---------- twocol({ title, left, right, notes }) { const slide = this._content(title); const y = 1.45, colW = (CONTENT_W - 0.5) / 2, h = PH - y - 0.6; const colX = [MX, MX + colW + 0.5]; [left, right].forEach((col, idx) => { const x = colX[idx]; // header chip slide.addText(col.heading, { x, y, w: colW, h: 0.45, margin: 0, fontFace: FONT_H, fontSize: 16, bold: true, color: C.crimson, valign:
- , }); const items = col.items.map((b) => ({ text: typeof b ===
- ? b : b.t, options: { bullet: { code:
- , indent: 16 }, color: C.ink, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true }, })); slide.addText(items, { x, y: y + 0.5, w: colW, h: h - 0.5, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- TABLE ---------- table({ title, intro, headers, rows, colW, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, italic: true, color: C.gray, valign:
- , }); y += 0.55; } const head = headers.map((htext) => ({ text: htext, options: { fill: { color: C.crimson }, color: C.white, bold: true, fontSize: 12.5, valign:
- }, })); const body = rows.map((r, ri) => r.map((cell) => ({ text: String(cell), options: { fill: { color: ri % 2 === 0 ? C.white : C.panel }, color: C.ink, fontSize: 11.5, valign:
- , }, })) ); slide.addTable([head, ...body], { x: MX + 0.32, y, w: CONTENT_W - 0.32, colW: colW || undefined, border: { type:
- , pt: 0.5, color: C.panelLine }, align:
- , fontFace: FONT_B, rowH: 0.3, autoPage: false, }); this._notes(slide, notes); return slide; } // ---------- NUMBERED STEPS / PROCESS ---------- steps({ title, intro, steps, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.6; } const n = steps.length; const avail = PH - y - 0.6; const rowH = Math.min(0.95, avail / n); steps.forEach((s, i) => { const ry = y + i * rowH; // number circle slide.addShape(this.p.shapes.OVAL, { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(String(i + 1), { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, margin: 0, fontFace: FONT_B, fontSize: 15, bold: true, color: C.white, align:
- , }); const parts = [{ text: s.h +
- , options: { bold: true, color: C.ink, fontSize: 14 } }]; if (s.d) parts.push({ text: s.d, options: { color: C.gray, fontSize: 13 } }); slide.addText(parts, { x: MX + 0.95, y: ry - 0.12, w: CONTENT_W - 0.95, h: 0.69, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- BIG STAT CALLOUTS (grid of numbers) ---------- stats({ title, intro, stats, notes }) { const slide = this._content(title); let y = 1.5; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const n = stats.length; const gap = 0.4; const cardW = (CONTENT_W - gap * (n - 1)) / n; const cardH = 2.4; stats.forEach((s, i) => { const x = MX + i * (cardW + gap); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(s.big, { x, y: y + 0.3, w: cardW, h: 1.1, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.crimson, align:
- , }); slide.addText(s.label, { x: x + 0.15, y: y + 1.45, w: cardW - 0.3, h: 0.85, margin: 0, fontFace: FONT_B, fontSize: 13, color: C.ink, align:


## Slide Notes From presentation/NanofabToolkit/ParalyneReader/slides/_build/meta.js

READ ALOUD OR USE AS SPEAKER NOTES:

- Utah Nanofab · University of Utah
- UNanofabTools Server — A Plain-English Guide


## Slide Notes From presentation/NanofabToolkit/ParalyneReader/slides/_build/tooldecks/paralynereader.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); module.exports = { filename:
- , build(d) { d.title_slide({ kicker:
- Browse, download, and compare Parylene coater run data from your desk. A plain-English walkthrough.
- This session covers ParalyneReader, the desktop app that pulls Parylene coater run data back off the server so you can look at it.
- It's the desk-side counterpart to the coater's automatic uploads. No coding background needed. We'll cover what it does, where the
- data comes from, the workflow, and a few practical notes.
- Where the data comes from
- The Parylene coater's Raspberry Pi streams analog readings up to the server during each run.
- The server stitches those streams into one CSV file per completed run.
- Those run files live in a folder on the server.
- ParalyneReader is the desktop app for browsing and downloading them.
- Frame the pipeline. During every coating run, a Pi by the Parylene tool streams analog readings (pressure, vapor, temperature) up to
- the server. The server combines those streams into one CSV per finished run and keeps them in a folder. ParalyneReader is what you
- open at your desk to pull those files back out.
- , steps: [ { h:
- and ask the server what Parylene files are available.
- Pick the runs you care about
- in the background — the window stays responsive.
- smooth, normalize, or time-align as needed.
- Walk a typical session. The app fetches the list of Parylene runs from the server (newest first, with size and date). You select one
- or more, click download, and the app fetches them in the background using worker threads so the UI doesn't freeze. The downloaded
- data plots in the chart, where you can smooth, normalize, or align runs for comparison.
- What it talks to (server side)
- Two addresses on the cleanroom server, under /api/paralyne/analog/...
- 'list' returns the available files with size and modified date.
- 'download/<filename>' returns the bytes of one file.
- Same addresses documented in the flask server's sensor-API session.
- Tie it to the server. ParalyneReader uses two of the sensor-API addresses we covered in the flaskserver sessions: list and download.
- These exist exactly so desktop tools like this one can grab run files programmatically rather than someone having to SCP them. The
- app is read-only — it never deletes or alters files on the server.
- Background downloads keep the UI responsive
- Each download runs in a worker thread (a thread pool).
- The window stays clickable while files come down.
- Large or slow downloads don't appear to freeze the app.
- A clean shutdown waits for any in-flight transfers.
- Explain the responsiveness story. Naive download code would block the window until each file finishes — annoying on big files or
- slow connections. ParalyneReader uses a thread pool so downloads happen in the background and the UI stays responsive. When you
- close the app, the shutdown handler tells the thread pool to stop accepting new work and exits cleanly.
- Smoothing, normalization, and time alignment
- Smoothing helps you see trends through noisy analog signals.
- Normalization puts runs on the same scale for comparison.
- Time alignment lets you slide one run forward or back to overlay another.
- Useful when comparing the shape of two runs, not their absolute values.
- Cover the analysis features. Analog signals can be noisy; smoothing reduces that noise so trends are visible. Normalization rescales
- runs so they overlay cleanly even if absolute values differ. Time alignment is the same idea as in ALDPeakCounter — slide a run in
- time so its features line up with another. The combination makes side-by-side comparison practical.
- Every action is recorded in a log file under logs/paralyne_reader.log.
- Dependency check at startup tells you exactly what's missing if anything is.
- Shutdown is graceful: worker threads are stopped first.
- A startup error appears as a friendly message box, not a silent crash.
- Operational details. The app keeps a log file so problems can be diagnosed after the fact. At startup it checks for required
- libraries (tkinter, requests, matplotlib, numpy, scipy) and tells you what's missing if anything. Shutdown stops background workers
- first. And startup failures show a clear dialog rather than vanishing without trace — useful when shipped to non-developers.
- Connections are encrypted; certificate validation is currently off (internal cert).
- Downloads save next to the executable by default.
- Same data set the server's machines portal references for Parylene runs.
- Practical notes. The app never modifies the server. Connections are encrypted, but with the internal certificate the app doesn't
- verify the certificate chain — the developer notes flag this. Downloads currently land in the executable's folder; that's worth
- knowing if you don't see your files. The runs you pull are the same ones the website's machines portal would link to for Parylene.
- Server is the source of truth; the app is a viewer.
- Background downloads + smoothing + alignment make comparison easy.
- Wrap up. ParalyneReader is a focused desk-side tool: ask the server for runs, download what you want, and visualize/compare them
- with sensible analysis options. It does one job well. Questions welcome.


## Slide Notes From presentation/NanofabToolkit/PreciousMetalReader/slides/_build/build_tool.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); const fs = require(
- ); const { Deck } = require(
- ); const M = require(
- ); const modPath = process.argv[2]; if (!modPath) { console.error(
- ); process.exit(1); } const OUT = process.env.OUT || path.join(__dirname,
- ); fs.mkdirSync(OUT, { recursive: true }); (async () => { const mod = require(path.join(__dirname, modPath)); const repo = mod.repo ||
- ; const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter, footer: repo +
- + mod.title }); mod.build(d); const outPath = path.join(OUT, mod.filename); await d.save(outPath); console.log(


## Slide Notes From presentation/NanofabToolkit/PreciousMetalReader/slides/_build/deckkit.js

READ ALOUD OR USE AS SPEAKER NOTES:

- . */ const pptxgen = require(
- ); // ---- Palette ---- const C = { crimson:
- , // U of U primary crimsonDk:
- , // darker crimson for bands/title ink:
- , // near-black body text gray:
- , // muted text grayLt:
- , // light panel / code box background panelLine:
- , // panel border codeInk:
- , // code text white:
- , }; const FONT_H =
- ; // headers — has personality, professional const FONT_B =
- ; // body const FONT_M =
- ; // monospace for code const PW = 13.33, PH = 7.5; // page size (LAYOUT_WIDE) const MX = 0.7; // left/right margin const CONTENT_W = PW - MX * 2; function makeShadow() { return { type:
- , blur: 5, offset: 2, angle: 135, opacity: 0.12 }; } class Deck { constructor({ title, subtitle, author, footer }) { const p = new pptxgen(); p.layout =
- ; p.author = author ||
- ; p.title = title; this.p = p; this.shortTitle = title; this.footer = footer ||
- ; this.n = 0; } // crimson footer band + slide number; consistent motif on content slides _footer(slide) { slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: PH - 0.32, w: PW, h: 0.32, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(this.footer, { x: MX, y: PH - 0.32, w: 8, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); slide.addText(String(this.n), { x: PW - 1.2, y: PH - 0.32, w: 0.5, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); } // small crimson square motif + title at top of content slides _header(slide, title) { slide.addShape(this.p.shapes.RECTANGLE, { x: MX, y: 0.55, w: 0.18, h: 0.36, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(title, { x: MX + 0.32, y: 0.42, w: CONTENT_W - 0.32, h: 0.7, margin: 0, fontFace: FONT_H, fontSize: 26, bold: true, color: C.ink, align:
- , }); } _content(title) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; this._header(slide, title); this._footer(slide); return slide; } _notes(slide, notes) { if (notes) slide.addNotes(notes); } // ---------- TITLE SLIDE ---------- title_slide({ kicker, title, subtitle, presenter, role, dept, date, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; // left crimson band motif slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: PH, fill: { color: C.crimson }, line: { type:
- }, }); // kicker (topic number / series) slide.addText(kicker ||
- , { x: 1.0, y: 1.5, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color: C.crimson, charSpacing: 2, align:
- , }); // main title slide.addText(title, { x: 1.0, y: 2.0, w: PW - 2, h: 1.7, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.ink, align:
- , }); // subtitle slide.addText(subtitle ||
- , { x: 1.0, y: 3.75, w: PW - 2.2, h: 0.8, margin: 0, fontFace: FONT_B, fontSize: 17, color: C.gray, align:
- , }); // presenter block const block = [ { text: presenter ||
- , options: { bold: true, color: C.ink, fontSize: 14, breakLine: true } }, ]; if (role) block.push({ text: role, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (dept) block.push({ text: dept, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (date) block.push({ text: date, options: { color: C.grayLt, fontSize: 11 } }); slide.addText(block, { x: 1.0, y: 5.5, w: PW - 2, h: 1.4, margin: 0, fontFace: FONT_B, align:
- , lineSpacingMultiple: 1.15, }); this._notes(slide, notes); return slide; } // ---------- SECTION DIVIDER ---------- section_slide({ label, title, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.crimsonDk }; slide.addText(label ||
- , { x: 1.0, y: 2.7, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color:
- , charSpacing: 2, }); slide.addText(title, { x: 1.0, y: 3.2, w: PW - 2, h: 1.6, margin: 0, fontFace: FONT_H, fontSize: 34, bold: true, color: C.white, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- BULLETS ---------- bullets({ title, intro, bullets, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const items = bullets.map((b, i) => { if (typeof b ===
- ) { return { text: b, options: { bullet: { code:
- , indent: 18 }, color: C.ink, fontSize: 15, paraSpaceAfter: 10, breakLine: true } }; } // {t, sub:true} return { text: b.t, options: { bullet: { code:
- , indent: 18 }, indentLevel: 1, color: C.gray, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true } }; }); slide.addText(items, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: PH - y - 0.6, margin: 0, fontFace: FONT_B, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- CODE / MONO CALLOUT ---------- code({ title, intro, code, caption, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, color: C.ink, valign:
- , }); y += 0.65; } const boxH = PH - y - (caption ? 1.0 : 0.6); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: boxH, rectRadius: 0.06, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(code, { x: MX + 0.5, y: y + 0.12, w: CONTENT_W - 0.7, h: boxH - 0.24, margin: 0, fontFace: FONT_M, fontSize: 12.5, color: C.codeInk, align:
- , }); if (caption) { slide.addText(caption, { x: MX + 0.32, y: y + boxH + 0.1, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 12, italic: true, color: C.gray, valign:
- , }); } this._notes(slide, notes); return slide; } // ---------- TWO COLUMN ---------- twocol({ title, left, right, notes }) { const slide = this._content(title); const y = 1.45, colW = (CONTENT_W - 0.5) / 2, h = PH - y - 0.6; const colX = [MX, MX + colW + 0.5]; [left, right].forEach((col, idx) => { const x = colX[idx]; // header chip slide.addText(col.heading, { x, y, w: colW, h: 0.45, margin: 0, fontFace: FONT_H, fontSize: 16, bold: true, color: C.crimson, valign:
- , }); const items = col.items.map((b) => ({ text: typeof b ===
- ? b : b.t, options: { bullet: { code:
- , indent: 16 }, color: C.ink, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true }, })); slide.addText(items, { x, y: y + 0.5, w: colW, h: h - 0.5, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- TABLE ---------- table({ title, intro, headers, rows, colW, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, italic: true, color: C.gray, valign:
- , }); y += 0.55; } const head = headers.map((htext) => ({ text: htext, options: { fill: { color: C.crimson }, color: C.white, bold: true, fontSize: 12.5, valign:
- }, })); const body = rows.map((r, ri) => r.map((cell) => ({ text: String(cell), options: { fill: { color: ri % 2 === 0 ? C.white : C.panel }, color: C.ink, fontSize: 11.5, valign:
- , }, })) ); slide.addTable([head, ...body], { x: MX + 0.32, y, w: CONTENT_W - 0.32, colW: colW || undefined, border: { type:
- , pt: 0.5, color: C.panelLine }, align:
- , fontFace: FONT_B, rowH: 0.3, autoPage: false, }); this._notes(slide, notes); return slide; } // ---------- NUMBERED STEPS / PROCESS ---------- steps({ title, intro, steps, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.6; } const n = steps.length; const avail = PH - y - 0.6; const rowH = Math.min(0.95, avail / n); steps.forEach((s, i) => { const ry = y + i * rowH; // number circle slide.addShape(this.p.shapes.OVAL, { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(String(i + 1), { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, margin: 0, fontFace: FONT_B, fontSize: 15, bold: true, color: C.white, align:
- , }); const parts = [{ text: s.h +
- , options: { bold: true, color: C.ink, fontSize: 14 } }]; if (s.d) parts.push({ text: s.d, options: { color: C.gray, fontSize: 13 } }); slide.addText(parts, { x: MX + 0.95, y: ry - 0.12, w: CONTENT_W - 0.95, h: 0.69, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- BIG STAT CALLOUTS (grid of numbers) ---------- stats({ title, intro, stats, notes }) { const slide = this._content(title); let y = 1.5; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const n = stats.length; const gap = 0.4; const cardW = (CONTENT_W - gap * (n - 1)) / n; const cardH = 2.4; stats.forEach((s, i) => { const x = MX + i * (cardW + gap); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(s.big, { x, y: y + 0.3, w: cardW, h: 1.1, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.crimson, align:
- , }); slide.addText(s.label, { x: x + 0.15, y: y + 1.45, w: cardW - 0.3, h: 0.85, margin: 0, fontFace: FONT_B, fontSize: 13, color: C.ink, align:


## Slide Notes From presentation/NanofabToolkit/PreciousMetalReader/slides/_build/meta.js

READ ALOUD OR USE AS SPEAKER NOTES:

- Utah Nanofab · University of Utah
- UNanofabTools Server — A Plain-English Guide


## Slide Notes From presentation/NanofabToolkit/PreciousMetalReader/slides/_build/tooldecks/preciousmetalreader.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); module.exports = { filename:
- , build(d) { d.title_slide({ kicker:
- Pull a month's precious-metal usage from CORES and turn it into a spreadsheet. A plain-English walkthrough.
- This session covers PreciousMetalReader, a small desktop app that downloads precious-metal usage records from the university's CORES
- system for a given month and produces a tidy CSV summary. Useful for billing and bookkeeping. No coding background needed. We'll also
- clarify what makes this app distinct from the other CORES tool, HSCDownloader.
- CORES (the university's records system) logs each charge.
- For billing each month, the lab needs that data in a spreadsheet.
- This app downloads it and formats it without any manual web clicking.
- Set up the why. When someone runs a Denton evaporator, CORES records the precious metals used. For billing and bookkeeping, the lab
- needs that data, by month, in a spreadsheet. Doing this through the CORES website would be slow and click-heavy; this app turns it
- Not from our server — from a different university system:
- CORES (university records, via 'n8n' webhook)
- │ summarize, save as CSV
- downloads/<month>_<metal>.csv → open in Excel
- CORES holds the records; this app downloads and formats them. Our server isn't involved.
- Make the data path explicit. The app talks directly to CORES (specifically a service called n8n that exposes CORES's data). It does
- NOT go through the cleanroom's nfhistory server. The data flows: CORES → this app → a CSV in your downloads folder. Don't go looking
- for these records on the nfhistory server; they live in CORES.
- On-demand, run by a person.
- Also talks to CORES n8n.
- Acknowledge the cousin. Both apps fetch from the same CORES n8n system, but they pull different datasets and serve different purposes.
- PreciousMetalReader is human-driven (you pick a month and run it once); HSCDownloader runs continuously to keep the website's machine
- pages fresh. Same warehouse, different shipments.
- , steps: [ { h:
- month from a dropdown; year typed in.
- one tool/metal, or every tool/metal at once.
- If specific, pick the machine + metal
- the metal list updates per machine.
- the app fetches from CORES and writes a CSV.
- in Excel for the summary.
- Walk a session. Choose a month and year. Choose specific or all. If specific, choose the machine (Denton 635, Denton 18, TMV) — the
- metal list updates automatically — then choose the metal. Click Download. The app talks to CORES and saves a CSV in a downloads
- folder next to the app, ready to open in a spreadsheet. That's the whole flow.
- What the app does behind the scenes
- Computes the correct date range for that month (leap years included).
- Calls one CORES web service (specific) or several (all).
- Parses each response and combines the records.
- Summarizes line items per metal and writes a CSV.
- Demystify the work. It computes the right date range (e.g. February in a leap year is 29 days). For 'specific' it calls one CORES
- endpoint; for 'all' it loops over the dozen or so endpoints covering every metal/tool combination, combining responses and skipping
- any that returned no data. It then groups the line items by metal, sums the charges, and writes the result as CSV. The raw downloads
- are also kept in case you need them.
- CORES requires a secret token to prove the app is allowed to read.
- The token is currently written into the app itself.
- Standard expectation: move it into a protected setting and rotate it.
- On the to-fix list — it's a real credential.
- Be candid about the security caveat. CORES needs a bearer token to authorize the request. Right now the token is in a Python file
- shipped with the app, which is a credential leak risk — anyone with a copy of the app has the token. The recommendation in the
- developer notes is to move it out into a protected setting and rotate it. Same recommendation applies to HSCDownloader.
- Diagnostics and where files land
- Every action goes into a log file in a logs/ folder.
- Downloaded CSVs land in a downloads/ folder next to the app.
- On startup errors, a friendly message box appears.
- Packaged as a Windows executable (PyInstaller); no Python install required.
- Practical pointers. The app keeps a log file with what it did; downloads land in a 'downloads' folder next to the executable. If
- something goes wrong on startup, you get a clear message rather than a silent crash. It's a single .exe to run, which makes life
- Output is a CSV — open in Excel or any spreadsheet.
- Operational summary. Read-only with respect to CORES. Internet required. Encrypted. Output is CSV, so any spreadsheet can open it.
- There's no special server-side software involved — just CORES on one end and the app on your computer on the other.
- Talks to CORES, not our cleanroom server.
- Cousin of HSCDownloader; same source, different data.
- Watch the embedded access token — move it out for safety.
- Wrap up. PreciousMetalReader is a one-button monthly billing helper that talks to CORES directly. Don't confuse it with HSCDownloader
- (same source, different data, different purpose). The headline maintenance item is the embedded token. Questions welcome.


## Slide Notes From presentation/UNanofabTools/dattools/slides/_build/build_tool.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); const fs = require(
- ); const { Deck } = require(
- ); const M = require(
- ); const modPath = process.argv[2]; if (!modPath) { console.error(
- ); process.exit(1); } const OUT = process.env.OUT || path.join(__dirname,
- ); fs.mkdirSync(OUT, { recursive: true }); (async () => { const mod = require(path.join(__dirname, modPath)); const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter, footer:
- + mod.title }); mod.build(d); const outPath = path.join(OUT, mod.filename); await d.save(outPath); console.log(


## Slide Notes From presentation/UNanofabTools/dattools/slides/_build/deckkit.js

READ ALOUD OR USE AS SPEAKER NOTES:

- . */ const pptxgen = require(
- ); // ---- Palette ---- const C = { crimson:
- , // U of U primary crimsonDk:
- , // darker crimson for bands/title ink:
- , // near-black body text gray:
- , // muted text grayLt:
- , // light panel / code box background panelLine:
- , // panel border codeInk:
- , // code text white:
- , }; const FONT_H =
- ; // headers — has personality, professional const FONT_B =
- ; // body const FONT_M =
- ; // monospace for code const PW = 13.33, PH = 7.5; // page size (LAYOUT_WIDE) const MX = 0.7; // left/right margin const CONTENT_W = PW - MX * 2; function makeShadow() { return { type:
- , blur: 5, offset: 2, angle: 135, opacity: 0.12 }; } class Deck { constructor({ title, subtitle, author, footer }) { const p = new pptxgen(); p.layout =
- ; p.author = author ||
- ; p.title = title; this.p = p; this.shortTitle = title; this.footer = footer ||
- ; this.n = 0; } // crimson footer band + slide number; consistent motif on content slides _footer(slide) { slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: PH - 0.32, w: PW, h: 0.32, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(this.footer, { x: MX, y: PH - 0.32, w: 8, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); slide.addText(String(this.n), { x: PW - 1.2, y: PH - 0.32, w: 0.5, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); } // small crimson square motif + title at top of content slides _header(slide, title) { slide.addShape(this.p.shapes.RECTANGLE, { x: MX, y: 0.55, w: 0.18, h: 0.36, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(title, { x: MX + 0.32, y: 0.42, w: CONTENT_W - 0.32, h: 0.7, margin: 0, fontFace: FONT_H, fontSize: 26, bold: true, color: C.ink, align:
- , }); } _content(title) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; this._header(slide, title); this._footer(slide); return slide; } _notes(slide, notes) { if (notes) slide.addNotes(notes); } // ---------- TITLE SLIDE ---------- title_slide({ kicker, title, subtitle, presenter, role, dept, date, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; // left crimson band motif slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: PH, fill: { color: C.crimson }, line: { type:
- }, }); // kicker (topic number / series) slide.addText(kicker ||
- , { x: 1.0, y: 1.5, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color: C.crimson, charSpacing: 2, align:
- , }); // main title slide.addText(title, { x: 1.0, y: 2.0, w: PW - 2, h: 1.7, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.ink, align:
- , }); // subtitle slide.addText(subtitle ||
- , { x: 1.0, y: 3.75, w: PW - 2.2, h: 0.8, margin: 0, fontFace: FONT_B, fontSize: 17, color: C.gray, align:
- , }); // presenter block const block = [ { text: presenter ||
- , options: { bold: true, color: C.ink, fontSize: 14, breakLine: true } }, ]; if (role) block.push({ text: role, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (dept) block.push({ text: dept, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (date) block.push({ text: date, options: { color: C.grayLt, fontSize: 11 } }); slide.addText(block, { x: 1.0, y: 5.5, w: PW - 2, h: 1.4, margin: 0, fontFace: FONT_B, align:
- , lineSpacingMultiple: 1.15, }); this._notes(slide, notes); return slide; } // ---------- SECTION DIVIDER ---------- section_slide({ label, title, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.crimsonDk }; slide.addText(label ||
- , { x: 1.0, y: 2.7, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color:
- , charSpacing: 2, }); slide.addText(title, { x: 1.0, y: 3.2, w: PW - 2, h: 1.6, margin: 0, fontFace: FONT_H, fontSize: 34, bold: true, color: C.white, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- BULLETS ---------- bullets({ title, intro, bullets, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const items = bullets.map((b, i) => { if (typeof b ===
- ) { return { text: b, options: { bullet: { code:
- , indent: 18 }, color: C.ink, fontSize: 15, paraSpaceAfter: 10, breakLine: true } }; } // {t, sub:true} return { text: b.t, options: { bullet: { code:
- , indent: 18 }, indentLevel: 1, color: C.gray, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true } }; }); slide.addText(items, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: PH - y - 0.6, margin: 0, fontFace: FONT_B, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- CODE / MONO CALLOUT ---------- code({ title, intro, code, caption, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, color: C.ink, valign:
- , }); y += 0.65; } const boxH = PH - y - (caption ? 1.0 : 0.6); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: boxH, rectRadius: 0.06, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(code, { x: MX + 0.5, y: y + 0.12, w: CONTENT_W - 0.7, h: boxH - 0.24, margin: 0, fontFace: FONT_M, fontSize: 12.5, color: C.codeInk, align:
- , }); if (caption) { slide.addText(caption, { x: MX + 0.32, y: y + boxH + 0.1, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 12, italic: true, color: C.gray, valign:
- , }); } this._notes(slide, notes); return slide; } // ---------- TWO COLUMN ---------- twocol({ title, left, right, notes }) { const slide = this._content(title); const y = 1.45, colW = (CONTENT_W - 0.5) / 2, h = PH - y - 0.6; const colX = [MX, MX + colW + 0.5]; [left, right].forEach((col, idx) => { const x = colX[idx]; // header chip slide.addText(col.heading, { x, y, w: colW, h: 0.45, margin: 0, fontFace: FONT_H, fontSize: 16, bold: true, color: C.crimson, valign:
- , }); const items = col.items.map((b) => ({ text: typeof b ===
- ? b : b.t, options: { bullet: { code:
- , indent: 16 }, color: C.ink, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true }, })); slide.addText(items, { x, y: y + 0.5, w: colW, h: h - 0.5, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- TABLE ---------- table({ title, intro, headers, rows, colW, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, italic: true, color: C.gray, valign:
- , }); y += 0.55; } const head = headers.map((htext) => ({ text: htext, options: { fill: { color: C.crimson }, color: C.white, bold: true, fontSize: 12.5, valign:
- }, })); const body = rows.map((r, ri) => r.map((cell) => ({ text: String(cell), options: { fill: { color: ri % 2 === 0 ? C.white : C.panel }, color: C.ink, fontSize: 11.5, valign:
- , }, })) ); slide.addTable([head, ...body], { x: MX + 0.32, y, w: CONTENT_W - 0.32, colW: colW || undefined, border: { type:
- , pt: 0.5, color: C.panelLine }, align:
- , fontFace: FONT_B, rowH: 0.3, autoPage: false, }); this._notes(slide, notes); return slide; } // ---------- NUMBERED STEPS / PROCESS ---------- steps({ title, intro, steps, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.6; } const n = steps.length; const avail = PH - y - 0.6; const rowH = Math.min(0.95, avail / n); steps.forEach((s, i) => { const ry = y + i * rowH; // number circle slide.addShape(this.p.shapes.OVAL, { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(String(i + 1), { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, margin: 0, fontFace: FONT_B, fontSize: 15, bold: true, color: C.white, align:
- , }); const parts = [{ text: s.h +
- , options: { bold: true, color: C.ink, fontSize: 14 } }]; if (s.d) parts.push({ text: s.d, options: { color: C.gray, fontSize: 13 } }); slide.addText(parts, { x: MX + 0.95, y: ry - 0.12, w: CONTENT_W - 0.95, h: 0.69, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- BIG STAT CALLOUTS (grid of numbers) ---------- stats({ title, intro, stats, notes }) { const slide = this._content(title); let y = 1.5; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const n = stats.length; const gap = 0.4; const cardW = (CONTENT_W - gap * (n - 1)) / n; const cardH = 2.4; stats.forEach((s, i) => { const x = MX + i * (cardW + gap); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(s.big, { x, y: y + 0.3, w: cardW, h: 1.1, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.crimson, align:
- , }); slide.addText(s.label, { x: x + 0.15, y: y + 1.45, w: cardW - 0.3, h: 0.85, margin: 0, fontFace: FONT_B, fontSize: 13, color: C.ink, align:


## Slide Notes From presentation/UNanofabTools/dattools/slides/_build/meta.js

READ ALOUD OR USE AS SPEAKER NOTES:

- Utah Nanofab · University of Utah
- UNanofabTools Server — A Plain-English Guide


## Slide Notes From presentation/UNanofabTools/dattools/slides/_build/tooldecks/dattools.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); module.exports = { filename:
- , build(d) { d.title_slide({ kicker:
- DATfixer & DATgrapher — reading the Denton 635's logs. A plain-English walkthrough.
- This is a short, self-contained session on two small command-line utilities: DATfixer and DATgrapher. They exist to make the Denton
- 635 sputter system's log files readable. No coding background needed. By the end you'll know what problem they solve, how to run
- them, and which one to reach for. It's a good example of a 'small but real' tool in the repository.
- The problem: unreadable machine logs
- The Denton 635 writes its logs in its own binary format.
- Every run, the Denton 635 saves a log file ending in .DAT.
- That file is 'binary' — raw bytes, not letters; open it and you see gibberish.
- The useful data (pressures, timestamps, events) is in there, just encoded.
- We need a way to translate it into something a person can read.
- Set up the why. The Denton 635 is an automated sputter-deposition system. Each run it writes a .DAT log in its own binary format —
- meaning it stores numbers and control codes as raw bytes, not readable text. Open it in Notepad and it's a jumble. But the real data
- is in there: chamber pressure over time, timestamps, machine states. These tools exist to decode that.
- Writes a clean, readable .txt file.
- Can also draw a graph directly.
- DATgrapher — the chart maker
- Reads a cleaned .txt file.
- Shows it on screen or saves an image.
- Frame the pair simply. DATfixer is the translator: raw binary in, readable text out. DATgrapher is the chart maker: cleaned text in,
- a pressure-over-time graph out. You usually run DATfixer first, then DATgrapher on its output — though DATfixer can also produce a
- graph itself in one step. Translator then chart maker.
- on the same Windows machine as the tools.
- translate the .DAT into a readable _cleaned.txt.
- open the text, or run DATgrapher on it for a chart.
- Walk the normal path. Find the .DAT on the machine, run DATfixer to get a cleaned text file (named the same with '_cleaned' added),
- then either read that text directly or feed it to DATgrapher for a chart. Mention these are command-line tools run from PowerShell on
- Windows, on the same machine that holds the file — they're not part of the website.
- What's inside a .DAT file
- DATfixer recognizes the Denton's byte markers and decodes them:
- raw bytes: 05 00 [8 bytes] 08 00 .. 00 ...
- │ │ └─ field separator → a comma
- │ └─ an 8-byte number → a pressure value
- └─ 'a measurement follows' marker
- becomes: 15:14:33), [0.000000486000], Auto, ...
- Markers and raw numbers in → readable, comma-separated text out.
- Give a peek under the hood without requiring code skills. DATfixer walks the file looking for the Denton's markers. A specific 2-byte
- marker means 'a measurement follows,' and the next 8 bytes are a number — the chamber pressure — which it writes in brackets. Another
- marker means 'separate these,' which it turns into a comma. It also strips the invisible junk characters and lines up timestamps. The
- result is a tidy, comma-separated, human-readable line. The exact byte values were reverse-engineered from the machine's output.
- turn the byte markers into bracketed pressure numbers.
- turn delimiter markers into commas.
- put each timestamp on its own line; align the data.
- write the result as a .txt next to the original.
- This is the detailed 'what DATfixer does' slide. In order: decode the measurement markers into bracketed numbers; convert delimiter
- markers to commas; remove the invisible control characters that made it unreadable (keeping line breaks and tabs); tidy the layout so
- each timestamp starts a line and items are comma-separated; and finally save a .txt. The original .DAT is never modified.
- Save the cleaned file somewhere else / under a new name
- Also draw a pressure-vs-time graph as a .png
- Remove even line breaks and tabs (denser, rarely needed)
- Skip the 'make it pretty' formatting
- Don't insert commas between items
- Show the command and the options. The bare command produces YourLog_cleaned.txt. The most common addition is --graph, which also saves
- a PNG chart. The others are situational: -o to redirect output, --strict/--raw/--no-commas to change formatting. -h prints all of
- them. Don't read every row aloud; point out the bare command and --graph as the two people will use most.
- Reads a cleaned text file and finds each timestamp and pressure.
- Converts timestamps to 'seconds since the run started.'
- Plots pressure over time — on screen by default.
- A log scale option makes the huge range of vacuum pressures readable.
- Explain DATgrapher. It scans a cleaned file for timestamps and bracketed pressure values, turns the times into seconds-from-start,
- and plots pressure over time, popping up a window by default. The --log option is genuinely useful: vacuum pressures span many orders
- of magnitude during a pump-down, and a logarithmic scale shows the whole curve instead of squashing the small numbers flat.
- Save the graph to an image file
- Don't pop up a window; just save the image
- Use a logarithmic scale for the pressure axis
- The DATgrapher command and options. Point it at the cleaned .txt, not the raw .DAT. By default it shows the graph; --no-display saves
- without a window (useful on a machine with no screen), and --log switches to the logarithmic pressure axis. Simpler than DATfixer —
- For a quick graph in one step (--graph).
- To re-plot with a log scale.
- A quick decision aid. Reach for DATfixer to turn a raw log into readable text, or to get a fast graph in a single command. Reach for
- DATgrapher when you already have cleaned files and want to chart them — especially to re-plot with a log scale. If in doubt: DATfixer
- Good to know (and a few rough edges)
- The tools never change your original .DAT — they only read it.
- Point DATgrapher at the cleaned .txt, not the raw .DAT.
- Runs longer than a day aren't fully handled (a midnight-only correction exists).
- If only a few data points are found, you'll get a warning — usually a wrong-format input.
- Set honest expectations. Originals are safe — read-only. A common mistake is pointing DATgrapher at the raw .DAT; use the cleaned
- text. The time handling assumes a run within a day with at most one midnight crossing. And a 'few data points' warning almost always
- means the input wasn't the expected format. These rough edges are documented in the developer notes for whoever maintains the tools.
- DATfixer translates them into clean text (and can graph).
- DATgrapher charts pressure vs. time from cleaned text.
- Both are command-line tools run on Windows; originals stay untouched.
- Wrap up. Two small, focused tools: one translates the Denton's binary logs to readable text, the other charts the pressure. Run them
- from PowerShell, originals are never modified. That's the whole story — a clean example of a small utility doing one job well. Open


## Slide Notes From presentation/UNanofabTools/utilities/slides/_build/build_tool.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); const fs = require(
- ); const { Deck } = require(
- ); const M = require(
- ); const modPath = process.argv[2]; if (!modPath) { console.error(
- ); process.exit(1); } const OUT = process.env.OUT || path.join(__dirname,
- ); fs.mkdirSync(OUT, { recursive: true }); (async () => { const mod = require(path.join(__dirname, modPath)); const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter, footer:
- + mod.title }); mod.build(d); const outPath = path.join(OUT, mod.filename); await d.save(outPath); console.log(


## Slide Notes From presentation/UNanofabTools/utilities/slides/_build/deckkit.js

READ ALOUD OR USE AS SPEAKER NOTES:

- . */ const pptxgen = require(
- ); // ---- Palette ---- const C = { crimson:
- , // U of U primary crimsonDk:
- , // darker crimson for bands/title ink:
- , // near-black body text gray:
- , // muted text grayLt:
- , // light panel / code box background panelLine:
- , // panel border codeInk:
- , // code text white:
- , }; const FONT_H =
- ; // headers — has personality, professional const FONT_B =
- ; // body const FONT_M =
- ; // monospace for code const PW = 13.33, PH = 7.5; // page size (LAYOUT_WIDE) const MX = 0.7; // left/right margin const CONTENT_W = PW - MX * 2; function makeShadow() { return { type:
- , blur: 5, offset: 2, angle: 135, opacity: 0.12 }; } class Deck { constructor({ title, subtitle, author, footer }) { const p = new pptxgen(); p.layout =
- ; p.author = author ||
- ; p.title = title; this.p = p; this.shortTitle = title; this.footer = footer ||
- ; this.n = 0; } // crimson footer band + slide number; consistent motif on content slides _footer(slide) { slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: PH - 0.32, w: PW, h: 0.32, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(this.footer, { x: MX, y: PH - 0.32, w: 8, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); slide.addText(String(this.n), { x: PW - 1.2, y: PH - 0.32, w: 0.5, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); } // small crimson square motif + title at top of content slides _header(slide, title) { slide.addShape(this.p.shapes.RECTANGLE, { x: MX, y: 0.55, w: 0.18, h: 0.36, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(title, { x: MX + 0.32, y: 0.42, w: CONTENT_W - 0.32, h: 0.7, margin: 0, fontFace: FONT_H, fontSize: 26, bold: true, color: C.ink, align:
- , }); } _content(title) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; this._header(slide, title); this._footer(slide); return slide; } _notes(slide, notes) { if (notes) slide.addNotes(notes); } // ---------- TITLE SLIDE ---------- title_slide({ kicker, title, subtitle, presenter, role, dept, date, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; // left crimson band motif slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: PH, fill: { color: C.crimson }, line: { type:
- }, }); // kicker (topic number / series) slide.addText(kicker ||
- , { x: 1.0, y: 1.5, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color: C.crimson, charSpacing: 2, align:
- , }); // main title slide.addText(title, { x: 1.0, y: 2.0, w: PW - 2, h: 1.7, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.ink, align:
- , }); // subtitle slide.addText(subtitle ||
- , { x: 1.0, y: 3.75, w: PW - 2.2, h: 0.8, margin: 0, fontFace: FONT_B, fontSize: 17, color: C.gray, align:
- , }); // presenter block const block = [ { text: presenter ||
- , options: { bold: true, color: C.ink, fontSize: 14, breakLine: true } }, ]; if (role) block.push({ text: role, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (dept) block.push({ text: dept, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (date) block.push({ text: date, options: { color: C.grayLt, fontSize: 11 } }); slide.addText(block, { x: 1.0, y: 5.5, w: PW - 2, h: 1.4, margin: 0, fontFace: FONT_B, align:
- , lineSpacingMultiple: 1.15, }); this._notes(slide, notes); return slide; } // ---------- SECTION DIVIDER ---------- section_slide({ label, title, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.crimsonDk }; slide.addText(label ||
- , { x: 1.0, y: 2.7, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color:
- , charSpacing: 2, }); slide.addText(title, { x: 1.0, y: 3.2, w: PW - 2, h: 1.6, margin: 0, fontFace: FONT_H, fontSize: 34, bold: true, color: C.white, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- BULLETS ---------- bullets({ title, intro, bullets, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const items = bullets.map((b, i) => { if (typeof b ===
- ) { return { text: b, options: { bullet: { code:
- , indent: 18 }, color: C.ink, fontSize: 15, paraSpaceAfter: 10, breakLine: true } }; } // {t, sub:true} return { text: b.t, options: { bullet: { code:
- , indent: 18 }, indentLevel: 1, color: C.gray, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true } }; }); slide.addText(items, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: PH - y - 0.6, margin: 0, fontFace: FONT_B, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- CODE / MONO CALLOUT ---------- code({ title, intro, code, caption, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, color: C.ink, valign:
- , }); y += 0.65; } const boxH = PH - y - (caption ? 1.0 : 0.6); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: boxH, rectRadius: 0.06, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(code, { x: MX + 0.5, y: y + 0.12, w: CONTENT_W - 0.7, h: boxH - 0.24, margin: 0, fontFace: FONT_M, fontSize: 12.5, color: C.codeInk, align:
- , }); if (caption) { slide.addText(caption, { x: MX + 0.32, y: y + boxH + 0.1, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 12, italic: true, color: C.gray, valign:
- , }); } this._notes(slide, notes); return slide; } // ---------- TWO COLUMN ---------- twocol({ title, left, right, notes }) { const slide = this._content(title); const y = 1.45, colW = (CONTENT_W - 0.5) / 2, h = PH - y - 0.6; const colX = [MX, MX + colW + 0.5]; [left, right].forEach((col, idx) => { const x = colX[idx]; // header chip slide.addText(col.heading, { x, y, w: colW, h: 0.45, margin: 0, fontFace: FONT_H, fontSize: 16, bold: true, color: C.crimson, valign:
- , }); const items = col.items.map((b) => ({ text: typeof b ===
- ? b : b.t, options: { bullet: { code:
- , indent: 16 }, color: C.ink, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true }, })); slide.addText(items, { x, y: y + 0.5, w: colW, h: h - 0.5, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- TABLE ---------- table({ title, intro, headers, rows, colW, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, italic: true, color: C.gray, valign:
- , }); y += 0.55; } const head = headers.map((htext) => ({ text: htext, options: { fill: { color: C.crimson }, color: C.white, bold: true, fontSize: 12.5, valign:
- }, })); const body = rows.map((r, ri) => r.map((cell) => ({ text: String(cell), options: { fill: { color: ri % 2 === 0 ? C.white : C.panel }, color: C.ink, fontSize: 11.5, valign:
- , }, })) ); slide.addTable([head, ...body], { x: MX + 0.32, y, w: CONTENT_W - 0.32, colW: colW || undefined, border: { type:
- , pt: 0.5, color: C.panelLine }, align:
- , fontFace: FONT_B, rowH: 0.3, autoPage: false, }); this._notes(slide, notes); return slide; } // ---------- NUMBERED STEPS / PROCESS ---------- steps({ title, intro, steps, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.6; } const n = steps.length; const avail = PH - y - 0.6; const rowH = Math.min(0.95, avail / n); steps.forEach((s, i) => { const ry = y + i * rowH; // number circle slide.addShape(this.p.shapes.OVAL, { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(String(i + 1), { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, margin: 0, fontFace: FONT_B, fontSize: 15, bold: true, color: C.white, align:
- , }); const parts = [{ text: s.h +
- , options: { bold: true, color: C.ink, fontSize: 14 } }]; if (s.d) parts.push({ text: s.d, options: { color: C.gray, fontSize: 13 } }); slide.addText(parts, { x: MX + 0.95, y: ry - 0.12, w: CONTENT_W - 0.95, h: 0.69, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- BIG STAT CALLOUTS (grid of numbers) ---------- stats({ title, intro, stats, notes }) { const slide = this._content(title); let y = 1.5; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const n = stats.length; const gap = 0.4; const cardW = (CONTENT_W - gap * (n - 1)) / n; const cardH = 2.4; stats.forEach((s, i) => { const x = MX + i * (cardW + gap); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(s.big, { x, y: y + 0.3, w: cardW, h: 1.1, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.crimson, align:
- , }); slide.addText(s.label, { x: x + 0.15, y: y + 1.45, w: cardW - 0.3, h: 0.85, margin: 0, fontFace: FONT_B, fontSize: 13, color: C.ink, align:


## Slide Notes From presentation/UNanofabTools/utilities/slides/_build/meta.js

READ ALOUD OR USE AS SPEAKER NOTES:

- Utah Nanofab · University of Utah
- UNanofabTools Server — A Plain-English Guide


## Slide Notes From presentation/UNanofabTools/utilities/slides/_build/tooldecks/utilities.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); module.exports = { filename:
- , build(d) { d.title_slide({ kicker:
- The workshop drawer: small helper programs for specific jobs. A plain-English walkthrough.
- This session covers a handful of small, standalone helper programs that don't belong to any larger tool — a peak counter, a
- certificate converter, a database setup script, a remote-file fetcher, and one unfinished stub. They share nothing except being
- small, single-purpose helpers. Think of them as the project's workshop drawer. No coding background needed.
- The five utilities at a glance
- Count peaks in pressure data
- Convert a certificate file for the server
- Developer helper to pull a file off the server
- ], ], colW: [3.2, 5.7, 3.0], notes:
- placeholder. We'll take them one at a time. The 'Status' column matters: not everything in a repository is finished or meant for
- general use, and it's important documentation says so plainly.
- Process pressures rise and fall, making 'peaks' in the data.
- Counting peaks can mean counting cycles or events in a run.
- This reads a data file (or several) and counts the peaks for you.
- You can tune the sensitivity and optionally show a graph.
- Explain peakCount. During a process the pressure goes up and down, and counting those peaks is sometimes how you count cycles or
- events. This command-line tool reads pressure data files and counts the peaks, with options to tune how big a bump must be to count
- and to show a graph with the peaks marked. It uses a standard peak-finding algorithm plus extra logic to catch a peak right at the
- end of a run, which simple methods miss. There's a fuller graphical version in the NanofabToolkit.
- gencert.py — the website's certificate
- A secure site needs a certificate — the browser padlock.
- Certificates often arrive as one combined file (.pfx).
- The server needs it split into two files (cert + key).
- This script does that one-time conversion at renewal time.
- Explain gencert. The padlock in a browser comes from a certificate. They often arrive as a single combined .pfx file, but the server
- needs it as two separate .pem files. This script does that conversion, run by hand whenever the certificate is renewed. It writes the
- private key without a passphrase — which the server setup expects — so that key file must be kept somewhere protected.
- init_chem_db.py — first-time database setup
- The chemical inventory lives in a PostgreSQL database.
- Its tables must be created before first use.
- This script connects and runs the table-creation script.
- You run it once when setting up the inventory on a new server.
- Explain init_chem_db. The chemical inventory needs its database tables created before it can work. This script connects to PostgreSQL
- and runs the setup script that builds those tables and views. You run it once on a fresh server. Important caveat: the live inventory
- has gained extra columns and a table over time that this setup script doesn't yet create — so a brand-new database built from it
- alone would be missing a few pieces. The developer notes spell out the fix.
- The dev helper and the unfinished one
- Logs in to the server securely.
- Copies one file (the inventory code) down.
- A personal developer convenience, not for general use.
- A skeleton that was never completed.
- Just counts to five into a text file.
- Should be finished or removed.
- Two to be candid about. fetch_ssh.py is a personal developer tool that pulls one file off the server to compare against a local copy
- — useful to the developer, not meant for general use, with personal credentials baked in. NMonStore.py is an unfinished stub: it
- literally counts to five with a 'your code goes here' comment. It was the start of a monitor that was never completed; a future
- maintainer should finish or delete it. Documenting unfinished code honestly saves the next person from guessing.
- Why document the odds and ends?
- Every real project accumulates small helpers.
- Knowing what each does — and which are unfinished — saves time.
- It prevents a successor running a half-built script and trusting it.
- The status labels ('working', 'dev only', 'stub') are the key takeaway.
- Make the meta-point. Every project has a drawer of small scripts, and an undocumented drawer is a trap for whoever inherits it. The
- value of this section is less the individual tools and more the honest status on each: what's solid, what's personal, and what's
- unfinished. That's exactly what a successor needs to avoid wasting time or trusting something half-built.
- Three are working tools; one is dev-only; one is unfinished.
- init_chem_db doesn't yet build the full database — noted for fixing.
- Honest status labels matter as much as the tools themselves.
- Wrap up. These are the project's miscellaneous helpers. Most work and do one job well; one is a personal dev tool; one is an
- unfinished stub. The one functional gap worth fixing is that the database setup script doesn't yet produce a complete database. The
- broader lesson is the value of documenting the odds and ends honestly. Questions welcome.
