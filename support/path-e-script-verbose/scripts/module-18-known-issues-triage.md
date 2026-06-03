# Verbose Maximal Path E - Module 18: Known Issues Triage

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-18-known-issues-triage.md

# Module 18 - Known Issues And Maintenance Triage

## Goal

The maintainer can turn known-issues files into a prioritized maintenance plan that separates Nanofab-actionable work from University IT tickets.

## Required Screen

SHOW:

- `known-issues/UNanofabTools/README.md` (repo path: known-issues/UNanofabTools/README.md)
- `known-issues/UNanofabTools/liveserver.md` (repo path: known-issues/UNanofabTools/liveserver.md)
- `known-issues/UNanofabTools/serveraccess.md` (repo path: known-issues/UNanofabTools/serveraccess.md)
- `known-issues/UNanofabTools/flaskserver.md` (repo path: known-issues/UNanofabTools/flaskserver.md)
- `known-issues/NanofabToolkit/README.md` (repo path: known-issues/NanofabToolkit/README.md)

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


# Expanded Module 18: Known Issues Triage

READ ALOUD:

This expanded section revisits Module 18, Known Issues Triage. The focus is maintenance plan, severity, evidence, owners, and IT tickets. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 18

READ ALOUD:

We are now doing the orientation pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Source-code pass for Module 18

READ ALOUD:

We are now doing the source-code pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Live-state pass for Module 18

READ ALOUD:

We are now doing the live-state pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Failure-mode pass for Module 18

READ ALOUD:

We are now doing the failure-mode pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Maintenance-planning pass for Module 18

READ ALOUD:

We are now doing the maintenance-planning pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Security pass for Module 18

READ ALOUD:

We are now doing the security pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Recovery pass for Module 18

READ ALOUD:

We are now doing the recovery pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Documentation-drift pass for Module 18

READ ALOUD:

We are now doing the documentation-drift pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Teach-back pass for Module 18

READ ALOUD:

We are now doing the teach-back pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Homework-review pass for Module 18

READ ALOUD:

We are now doing the homework-review pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Quarterly-audit pass for Module 18

READ ALOUD:

We are now doing the quarterly-audit pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Backup-and-restore pass for Module 18

READ ALOUD:

We are now doing the backup-and-restore pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Ownership-boundary pass for Module 18

READ ALOUD:

We are now doing the ownership-boundary pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## No-contact rehearsal pass for Module 18

READ ALOUD:

We are now doing the no-contact rehearsal pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Operator-error pass for Module 18

READ ALOUD:

We are now doing the operator-error pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Data-integrity pass for Module 18

READ ALOUD:

We are now doing the data-integrity pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Final-repetition pass for Module 18

READ ALOUD:

We are now doing the final-repetition pass for Known Issues Triage. The maintainer should connect this module to maintenance plan, severity, evidence, owners, and IT tickets. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `known-issues/UNanofabTools/README.md`
- `known-issues/NanofabToolkit/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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



# Module Documentation Corpus



# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# UNanofabTools — Known Issues & Technical Debt

Private working list of bugs, gaps, security concerns, and tech debt for every tool in the repository. Kept deliberately outside the layman presentation and the successor documentation trees so the handoff materials stay clean — this is the to-do list for whoever maintains the code, not part of what gets handed to a new audience.

One file per tool, mirroring the per-tool folders in `../presentation/UNanofabTools/` and `../documentation/UNanofabTools/`.

## Files

| File | Tool | Highest-severity item |
|------|------|------------------------|
| `flaskserver.md` (repo path: known-issues/UNanofabTools/flaskserver.md) | The current Flask website | Chem-inventory schema drift; chem write routes unauthenticated |
| `hscdownloader.md` (repo path: known-issues/UNanofabTools/hscdownloader.md) | CORES → HSCDATA ETL | CORES Bearer token hard-coded in source |
| `picofirmware.md` (repo path: known-issues/UNanofabTools/picofirmware.md) | Raspberry Pi firmware *(older copies — canonical: `NanofabToolkit/PicoHelperTools`)* | WiFi credentials hard-coded; two unique scripts non-functional as written |
| `particlepctools.md` (repo path: known-issues/UNanofabTools/particlepctools.md) | Desktop particle viewer *(older copy — canonical: `NanofabToolkit/ParticleSensor`)* + test generator | Generator can accidentally target production |
| `filetransfer.md` (repo path: known-issues/UNanofabTools/filetransfer.md) | Per-machine log uploaders | Transfers depend on a personal SSH account |
| `dattools.md` (repo path: known-issues/UNanofabTools/dattools.md) | DATfixer + DATgrapher | Binary `.DAT` format parsed by magic bytes with no validation |
| `utilities.md` (repo path: known-issues/UNanofabTools/utilities.md) | Standalone helpers | `init_chem_db.py` doesn't build a complete chem database |
| `serveraccess.md` (repo path: known-issues/UNanofabTools/serveraccess.md) | SSH access + tmux sessions | tmux is the only supervisor; shared `phelan` is a structural constraint (IT controls user creation); hard-coded IP |
| `liveserver.md` (repo path: known-issues/UNanofabTools/liveserver.md) | Findings from the live `nfhistory` surveys | Flask/downloader not under systemd; chem Postgres verified local on `nfhistory`; a handful of IT-bound items (root `authorized_keys` mode, optional unattended-upgrades) |
| `hscdisplayerserver.md` (repo path: known-issues/UNanofabTools/hscdisplayerserver.md) | Legacy monolithic server | Run-in-parallel with the Flask app; deprecate and retire |

## How to use this folder

Each file lists items with severity (High / Medium / Low), a brief description, the risk, and a suggested fix — plus a priority order at the bottom. Nothing in these files has been changed in the code yet; they're recommendations, not changelogs.

For new items, or when rewriting an existing item before implementation, use this closeable format:

- **Owner:** Nanofab / University IT / CORES / facilities-network / mixed.
- **Evidence or reproduction:** exact source path, live snapshot, command output, UI workflow, or hardware observation that proves the issue exists.
- **Remediation:** what should change, including the file, config, ticket, or operational procedure.
- **Validation / proof of fix:** command, screenshot, test input/output, live check, or documentation diff that proves the item can be closed.
- **Dependencies:** required secret, live access, hardware, CORES change, or IT ticket.

Older items may still use a shorter `Where/Risk/Fix` format. Before closing one of those, add the missing owner/evidence/validation details so the next maintainer can audit the closure without asking the original author.

A few items recur across tools and may be worth treating as cross-cutting initiatives:

- **Secrets in source.** Hard-coded WiFi passwords (`picofirmware`), a CORES Bearer token (`hscdownloader`), and Duo keys imported from a Python module (`hscdisplayerserver`) all belong in environment variables / a protected store, with the secrets themselves rotated.
- **The chem-database schema drift.** The committed `.sql` files are behind the live database; `init_chem_db.py` (in `utilities`) doesn't produce a complete database from scratch; the `flaskserver` issues list enumerates the missing columns/tables. Reconciling this is one project, not several.
- **Personal-account / individual-developer dependencies.** The `filetransfer` scripts log in as a personal CADE account; `fetch_ssh.py` in `utilities` is a personal dev tool. The Nanofab-side fix is a purpose-bound SSH key authenticating as the shared `phelan` server account (no IT involvement). A cleaner long-term fix — a dedicated UNIX service account — has to come from University IT, since the Nanofab team has `sudo` as `phelan` but cannot `useradd`.
- **The IT / Nanofab operational boundary.** Several findings (root SSH from `iceolate`, per-user UNIX accounts, the off-host backup, `unattended-upgrades`, kernel patching) sit on **University IT's** side of the line. The Nanofab admin's tools are `sudo` as `phelan` plus an IT ticket; nothing under `/root/` and no `useradd` is available. Each known-issues file tags items "Nanofab-actionable" vs "IT ticket" so the punch list is honest about who has to do what.
- **The legacy server.** `hscdisplayerserver` is documented for reference but should be retired in favor of the Flask app; until then, confirm which server is actually live so patches go to the right place.

Severity labels follow a shared convention: **High** = breaks functionality or is a real security exposure · **Medium** = correctness / maintainability problem · **Low** = cosmetic / cleanup. Items that depend on IT cooperation are tagged in-place so they don't muddy the Nanofab-side priority order.


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


# Read-Aloud Documentation Corpus: known-issues/NanofabToolkit/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# NanofabToolkit — Known Issues & Technical Debt

Per-tool bug and tech-debt lists for `NanofabToolkit`. Separate from the layman presentations and the successor documentation trees so handoff materials stay clean.

One file per tool, mirroring the per-tool folders in `../presentation/NanofabToolkit/` and `../documentation/NanofabToolkit/`.

## Files

| File | Tool | Highest-severity item |
|------|------|------------------------|
| `ALDPeakCounter.md` (repo path: known-issues/NanofabToolkit/ALDPeakCounter.md) | ALD peak counter GUI | Duplicate peak-counter logic with UNanofabTools |
| `DentonDecoder.md` (repo path: known-issues/NanofabToolkit/DentonDecoder.md) | Denton `.dat`/CSV log viewer | Multi-day timestamp handling limited to one rollover |
| `ParalyneReader.md` (repo path: known-issues/NanofabToolkit/ParalyneReader.md) | Parylene file browser/viewer | Dead `return_selected` endpoint client; TLS verify disabled |
| `PreciousMetalReader.md` (repo path: known-issues/NanofabToolkit/PreciousMetalReader.md) | CORES precious-metal billing extractor | CORES credential depends on out-of-band local `auth.py` |
| `PicoHelperTools.md` (repo path: known-issues/NanofabToolkit/PicoHelperTools.md) | Pico firmware (canonical copies) | Cleartext WiFi credentials in source |
| `ParticleSensor.md` (repo path: known-issues/NanofabToolkit/ParticleSensor.md) | PyQt desktop viewer (canonical copy) | +7h timezone hack; duplicate `convert_to_mountain` in two modules |

## Recurring themes

A few items show up across more than one tool and are worth treating as cross-cutting initiatives:

- **Secrets and local credentials.** `PreciousMetalReader` imports `HSCCode` from a local `auth.py` that is required at runtime but absent from the adjacent source checkout reviewed here; document that setup contract and rotate if history or local evidence shows the token was ever exposed. `PicoHelperTools` firmware embeds WiFi credentials in cleartext. Same pattern as `UNanofabTools` — keep secrets out of source-controlled files.
- **Divergent copies of shared code.** The Pico firmware and the particle viewer each ship in both `NanofabToolkit/` and `UNanofabTools/`. The NanofabToolkit copies are now canonical (newer versions); the UNanofabTools docs point back here. Track cross-cutting fixes in this tree first.
- **PyInstaller builds undocumented.** All four desktop apps ship as Windows executables but the build commands aren't captured in repo READMEs. Add a one-page build note per tool.
- **No timeouts / retries on outbound HTTP.** `ParalyneReader` and `PreciousMetalReader` both call `requests.get` without `timeout=` and freeze the UI on slow servers. Standard fix.
- **No automated tests.** None of these tools has a test suite. A small mock-based contract test per tool would lock in the network/parsing behavior.

Severity follows the shared convention: **High** = breaks functionality or is a real security exposure · **Medium** = correctness / maintainability problem · **Low** = cosmetic / cleanup.

## Closeable issue format

For new items, or when rewriting an existing item before implementation, include:

- **Owner:** Nanofab / University IT / CORES / facilities-network / mixed.
- **Evidence or reproduction:** exact source path, sample input, command output, API response, UI workflow, or hardware observation.
- **Remediation:** what should change, including the file, config, credential storage, packaging step, or upstream ticket.
- **Validation / proof of fix:** command, screenshot, fixture output, packaged-app launch, mocked API test, or documentation diff that proves the item can be closed.
- **Dependencies:** required secret, live endpoint, sample file, Pico hardware, Windows build host, CORES change, or IT ticket.

Older items may still use a shorter `Where/Risk/Fix` format. Before closing one of those, add the missing owner/evidence/validation details so the next maintainer can audit the closure without asking the original author.

## See also

The sibling UNanofabTools issues list is at `known-issues/UNanofabTools/` (repo path: known-issues/UNanofabTools). Cross-cutting items (firmware credentials, divergent viewer copies, CORES token hygiene) appear in both lists with pointers between them.


# Read-Aloud Documentation Corpus: known-issues/NanofabToolkit/ALDPeakCounter.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# ALDPeakCounter — Known Issues & Technical Debt

Working list for `NanofabToolkit/ALDPeakCounter`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Duplicate `peakCount.py` with UNanofabTools — Medium
- **Where:** `src/peakCount.py` here is essentially the same as `UNanofabTools/peakCount.py`.
- **Risk:** fixes/algorithm tweaks must land in both; they will drift.
- **Fix:** make one copy canonical (or extract a shared package) and import from there.

### 2. Hard-coded tab-delimited input format — Medium
- **Where:** `count_peaks` parses lines with `line.split('\t')` and skips the first row as a header.
- **Risk:** comma-separated files (or files with no header) silently produce zero/garbage results; users get no clear error.
- **Fix:** detect the delimiter (csv sniffer), or document the expected format up front and validate the first row.

### 3. `Min Distance` is in samples, not seconds — Low (UX)
- **Where:** GUI label `"Min Distance:"`.
- **Risk:** users assume seconds and set tiny / huge values that don't behave as expected.
- **Fix:** label it `"Min Distance (samples)"` and/or expose seconds with a conversion.

### 4. Custom click-drag box zoom — Low
- **Where:** `on_mouse_press/release/move` + `apply_zoom`.
- **Risk:** missing pan/save/back-to-home affordances; minor visual artifacts (no rubber-band rectangle while dragging).
- **Fix:** drop in matplotlib's `NavigationToolbar2Tk` for standard zoom/pan/home/save.

### 5. End-peak heuristic is untested — Low
- **Where:** the "add a peak at the end" rule in `count_peaks` (same as UNanofabTools issue #8 for that copy).
- **Fix:** unit tests covering rising / plateau / elevated end cases.

### 6. No file-format validation feedback — Low
- **Where:** if a selected file lacks the expected columns, `count_peaks` quietly returns zero peaks.
- **Fix:** surface a per-file warning in the results panel when no valid time/pressure rows were found.

### 7. PyInstaller hook/build details aren't versioned with the GUI — Low
- **Where:** `src/hook-matplotlib.py`.
- **Note:** consider documenting the build command in the repo README so a successor can rebuild the executable.

---

## Suggested priority order
1. #1 de-duplicate `peakCount.py` between repos — Medium
2. #2 input-format detection / validation — Medium
3. #3 label `Min Distance` clearly — Low (cheap)
4. #4, #5, #6, #7 — Low


# Read-Aloud Documentation Corpus: known-issues/NanofabToolkit/DentonDecoder.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# DentonDecoder — Known Issues & Technical Debt

Working list for `NanofabToolkit/DentonDecoder`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Multi-day handling is limited to one midnight rollover — Medium
- **Where:** `DentonGrapher.create_graph` — `if time_delta < 0: time_delta += 24*60*60`.
- **Risk:** runs spanning more than one full day, or multiple midnight crossings, produce incorrect time axes.
- **Fix:** carry the date alongside the time (or use the file's modification date as a base) so multi-day runs work.

### 2. ASCII-replace decode masks bad data — Low
- **Where:** `open(input_file, 'r', errors='replace')`.
- **Risk:** stray non-ASCII bytes silently become replacement chars; a corrupted CSV can render without warning.
- **Fix:** open as UTF-8 (or auto-detect); log a warning when replacements occur.

### 3. Unusual `plt.figure` + `plt.gca()` pattern — Low
- **Where:** `fig, ax = plt.figure(figsize=(10, 6)), plt.gca()`.
- **Risk:** correctness depends on `plt.figure` having set the current figure; clearer with `plt.subplots`.
- **Fix:** replace with `fig, ax = plt.subplots(figsize=(10, 6))`.

### 4. Hard-coded default column `"Chamber Pressure (Torr)"` — Low
- **Where:** `create_graph` default arg.
- **Risk:** a Denton software/firmware update could rename the column; CLI usage without overriding would silently fail (and print available columns).
- **Fix:** keep the default for convenience, but ensure the GUI's column dropdown always drives the call rather than relying on the default.

### 5. Easily confused with UNanofabTools' DAT tools — Low (UX)
- **Where:** name and audience overlap with `UNanofabTools/dattools`; both workflows can involve Denton `.dat` files, but DentonDecoder is a GUI converter/viewer while DATfixer/DATgrapher are command-line cleaning and pressure-plot tools.
- **Risk:** users (or future maintainers) pick the wrong workflow or assume fixes in one tool affect the other.
- **Fix:** make the distinction explicit in the app title/About: "Denton GUI converter/viewer; DATfixer/DATgrapher are command-line pressure-log tools."

### 6. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** a small fixture CSV with known timestamps/values + a parsing test would lock in the time/value extraction and the midnight patch.

### 7. PyInstaller spec/build steps undocumented — Low
- **Where:** `pyinstaller/hooks/hook-runtime.py` exists, but the build command isn't in the repo README.
- **Fix:** document the PyInstaller build (entry point, hook path, asset inclusion) so a successor can rebuild the .exe.

---

## Suggested priority order
1. #1 multi-day timestamp handling — Medium
2. #6 add tests around the CSV parser — Medium
3. #5 make the dattools distinction obvious — Low (UX)
4. #2, #3, #4, #7 — Low


# Read-Aloud Documentation Corpus: known-issues/NanofabToolkit/ParalyneReader.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# ParalyneReader — Known Issues & Technical Debt

Working list for `NanofabToolkit/ParalyneReader`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = correctness/security · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. `return_selected` calls a non-existent server endpoint — Medium
- **Where:** `src/ParalyneReader.py` GETs `/api/paralyne/analog/return/<filename>`.
- **Risk:** any code path that uses it errors at runtime; the function is effectively dead code that misleads readers.
- **Fix:** implement `/return/<filename>` server-side (if needed), or remove the client function.

### 2. Certificate validation disabled (`verify=False`) — Medium
- **Where:** all `requests.get(...)` calls in `ParalyneReader.py`.
- **Risk:** standard internal-cert tradeoff (encrypted but unverified). On the internal network this is acceptable; off-network it's not.
- **Fix:** install the internal CA into the executable's trust store; re-enable verification.

### 3. Downloads land in the current working directory — Medium
- **Where:** `download_file(filename)` uses `os.path.abspath(filename)`.
- **Risk:** when run as a frozen executable, files drop next to the `.exe`; users lose track of them, and the folder may be read-only.
- **Fix:** default to a `Downloads/` subfolder; make the destination configurable.

### 4. No timeout / retry on API calls — Medium
- **Where:** `requests.get(...)` without `timeout`.
- **Risk:** a hung server makes the app appear frozen; first request after sleep can fail with no recovery.
- **Fix:** add `timeout=` and a simple retry-with-backoff for `list_files`/`download_file`.

### 5. Errors raise generic `Exception` — Low
- **Where:** `raise Exception(f"Error ...")` patterns.
- **Fix:** define a small custom exception (`ParalyneAPIError`) so callers can handle it specifically.

### 6. PyInstaller build steps undocumented — Low
- **Where:** packaging artifacts present, but no captured spec/command.
- **Fix:** add a one-page build note to the README so a successor can rebuild the .exe.

### 7. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** add tests that mock the HTTP responses to lock in the API contract and the filename/path handling.

### 8. `urllib3.disable_warnings()` globally suppresses noise — Low
- **Where:** module-level call.
- **Risk:** hides legitimate warnings unrelated to the internal cert.
- **Fix:** scope the suppression to the internal hostname, or remove once verification is restored (#2).

---

## Suggested priority order
1. #2 + #1 align with the server: re-enable TLS verify; drop the dead `return_selected` (or implement the endpoint) — Medium
2. #4 timeouts + retries — Medium
3. #3 configurable download directory — Medium
4. #7 add tests — Medium
5. #5, #6, #8 — Low


# Read-Aloud Documentation Corpus: known-issues/NanofabToolkit/PreciousMetalReader.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# PreciousMetalReader — Known Issues & Technical Debt

Working list for `NanofabToolkit/PreciousMetalReader`. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = security/correctness · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. CORES Bearer token handled through local `auth.py` — High (security)
- **Where:** `from auth import HSCCode` in `RetrieveMonthsMetals.py`.
- **Current repo status:** `src/auth.py` is required by the code but is not present in the adjacent source checkout used during documentation review. Treat this as a missing local-secret setup step unless history proves the file was committed earlier.
- **Risk:** the tool depends on an out-of-band CORES credential. If `auth.py` was ever committed or shared, rotate the token; if it only exists locally, document the setup contract so the app can run without putting the token in source.
- **Fix:** move the token to an environment variable, keychain entry, or a per-machine secrets file outside the repo; document the required variable/file name; rotate the token if there is any evidence it was committed or exposed.

### 2. Hard-coded service-ID list — Medium
- **Where:** the embedded list (`[768, 808, 809, ..., 818]`) inside `download_Metal("all", ...)`.
- **Risk:** if CORES renumbers a service, the corresponding metal silently goes missing from "all" downloads; the mapping is undocumented.
- **Fix:** lift this into a documented machine → metal → service_id table; validate IDs on startup.

### 3. No request timeout / retry — Medium
- **Where:** `requests.get(constructedURL, headers=header)` (no `timeout`).
- **Risk:** a slow or unreachable CORES freezes the UI; "all" mode could hang for minutes per endpoint with no recovery.
- **Fix:** add `timeout=` and a brief retry-with-backoff; report per-endpoint failures rather than aborting.

### 4. UI freezes during downloads — Medium
- **Where:** `download_Metal` runs synchronously on the Tk main thread.
- **Risk:** the window appears unresponsive (especially in "all" mode where ~12 endpoints are pulled).
- **Fix:** move downloads to a worker thread (cf. `ParalyneReader`) and post progress back to the UI.

### 5. Errors swallowed at endpoint granularity — Low/Medium
- **Where:** in "all" mode, individual endpoints are skipped if `status_code != 200`, but the user may not see which ones failed.
- **Fix:** collect per-endpoint statuses and present them at the end of the run.

### 6. Hard-coded month/year handling — Low
- **Where:** `daysinMonth` and the date-string building use plain integers without validation; an invalid year string would crash.
- **Fix:** validate user-entered year; clamp to a sensible range.

### 7. Frozen vs. dev path logic is fragile — Low
- **Where:** `download_Metal` walks three `dirname` levels to find the project dir in dev mode.
- **Risk:** breaks if the file is moved or the project is re-laid out.
- **Fix:** pass a project root explicitly (env var / settings), or use `pathlib.Path(__file__).resolve()` with a clear anchor.

### 8. Independent of the cleanroom server — Low (context)
- **Note:** this app talks to CORES, not to `nfhistory.nanofab.utah.edu`. Easy to miss; a successor may waste time looking for the API on our server.

### 9. PyInstaller build steps undocumented — Low
- **Where:** packaging artifacts present; no captured spec/command.
- **Fix:** add a one-page build note to the README.

### 10. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** mock-based tests around `download_Metal` (request shape, response parsing) and `summarize_metal_charges`.

---

## Suggested priority order
1. #1 + #2 document and externalize the CORES credential contract; centralize service IDs — High / Medium
2. #3 + #4 timeouts, retries, and a worker-thread download path — Medium
3. #10 + #5 add tests and surface per-endpoint failure detail — Medium
4. #6, #7, #8, #9 — Low


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/dattools.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# DAT Tools — Known Issues & Technical Debt

Private working list for `DATfixer.py` and `DATgrapher.py`. Kept separate from the successor documentation so the handoff stays clean. Nothing here has been changed in the code — it's a to-do list.

Severity: **High** = breaks functionality / data correctness · **Medium** = maintainability or robustness · **Low** = cleanup.

---

### 1. Graphing logic is duplicated across both files — Medium
- **Where:** `DATfixer.py` `create_graph` block (§3.4) and `DATgrapher.py` `create_pressure_graph` are near-identical (same time/pressure regexes, same base-time + midnight logic, same matplotlib calls).
- **Risk:** fixes/improvements must be made in two places; they will drift.
- **Fix:** extract a shared `plot_pressure(times, pressures, ...)` (and the line-parsing) into one module imported by both.

### 2. Binary format is hard-coded magic bytes with no validation — High
- **Where:** `DATfixer.py` — `0x05 0x00` + 8-byte double, and `0x08 0x00 0xXX 0x00` delimiter.
- **Risk:** if Denton firmware changes the log format, decoding silently produces garbage with no error. There's no signature/version check that the input is even a Denton `.DAT`.
- **Fix:** validate a known header/signature before decoding; fail fast with a clear message; consider documenting the format spec.

### 3. `plt.show()` blocks and needs a display — Medium
- **Where:** `DATgrapher.py` (`show_graph=True` default); also `DATfixer --graph` uses matplotlib.
- **Risk:** on a headless machine (no GUI), this errors or hangs.
- **Fix:** call `matplotlib.use("Agg")` when not displaying; document that interactive display needs a desktop session.

### 4. ASCII-only decode can corrupt data — Medium
- **Where:** both tools use `decode('ascii', errors='replace')`.
- **Risk:** any non-ASCII byte becomes a replacement char, which can mangle a line and throw off downstream parsing.
- **Fix:** consider latin-1 (lossless byte→char) for the text pass, or handle bytes directly.

### 5. Midnight/multi-day handling is a hack — Medium
- **Where:** both tools — timestamps are parsed as `%H:%M:%S` (no date); a single `+24h` correction patches one rollover.
- **Risk:** runs longer than 24h, or crossing more than one midnight, produce wrong time axes.
- **Fix:** carry the date if available, or detect multiple rollovers.

### 6. Comma-insertion tokenizer is heuristic and complex — Low/Medium
- **Where:** `DATfixer.py` `add_commas` block.
- **Risk:** edge cases can place commas oddly; the logic is hard to follow and untested.
- **Fix:** add unit tests with representative lines; simplify if possible.

### 7. "First bracketed value is pressure" assumption — Low
- **Where:** both graphers take the first `[...]` per line as pressure.
- **Risk:** if a line ever contains another bracketed value first, the wrong number is plotted.
- **Fix:** tag the pressure value explicitly during decode, or anchor the regex to its expected position.

### 8. `numpy` imported but effectively unused — Low
- **Where:** both files `import numpy as np` but do no real numpy work.
- **Fix:** drop the dependency, or use it where it would actually help.

### 9. No automated tests — Medium
- **Where:** entire tool.
- **Fix:** add a tiny fixture `.DAT` with known measurements and a golden cleaned-text/graph output to lock in the decode and parsing.

---

## Suggested priority order
1. #2 format validation (prevents silent garbage) — High
2. #1 de-duplicate graphing — Medium
3. #3 headless-safe plotting — Medium
4. #9 add tests around the binary decode — Medium
5. Cleanup: #4, #5, #6, #7, #8 — Low/Medium


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/utilities.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Utilities — Known Issues & Technical Debt

Working list for the standalone helper scripts. Separate from the successor docs. Nothing here has been changed in the code.

Severity: **High** = security / broken · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. `gencert.py` writes an unencrypted private key — Medium (security)
- **Where:** `key.private_bytes(..., encryption_algorithm=NoEncryption())`.
- **Risk:** the TLS private key sits on disk unprotected; if read, the cert can be impersonated.
- **Note/Fix:** this matches the nginx/standalone-TLS expectation, so encrypting it would require server-config changes. At minimum, lock down filesystem permissions and document where the key lives.

### 2. `gencert.py` has hard-coded Windows paths + unused imports — Low
- **Where:** input `.pfx` path and output `.pem` paths are literals; `http.server` imports are unused.
- **Fix:** take paths as arguments / read the PFX password from the environment; remove the dead HTTP-server import.

### 3. `init_chem_db.py` only applies the v1 schema — High
- **Where:** runs `chem_schema.sql` only.
- **Risk:** a fresh chem database is missing the v2 migration and the runtime-only objects (`containers.last_scan_at`, extended `inventory_cycles` columns, `scan_raw.barcode`, `container_scans.barcode`, the `transactions` table). Chem add/scan/report/transaction features will error on a clean install.
- **Fix:** extend the script to apply `chem_schema_migration_v2.sql` and the reconciliation DDL listed in `known-issues/UNanofabTools/flaskserver.md` (#4).

### 4. `init_chem_db.py` naive statement splitting — Low
- **Where:** splits the SQL on `;` and skips `BEGIN`/`COMMIT`.
- **Risk:** breaks if any statement legitimately contains a semicolon (e.g. inside a function body or string).
- **Fix:** execute the whole file via psql, or use a proper SQL parser.

### 5. `fetch_ssh.py` uses AutoAddPolicy and hard-coded identity — Medium
- **Where:** `set_missing_host_key_policy(AutoAddPolicy())`; hard-coded `phelanh`/`phelan`, jump host, and key path.
- **Risk:** auto-accepting unknown host keys is unsafe for anything automated; personal credentials make it non-portable.
- **Fix:** keep it strictly as a personal dev tool, or replace with a documented `scp`/CI step using verified host keys.

### 6. `fetch_ssh.py` produces the confusing `chem_inventory_remote.py` artifacts — Low
- **Where:** writes output to `chem_inventory_remote.py`; an empty file by that name and a dead blueprint copy exist in the tree.
- **Risk:** maintainers confuse the fetched copy / dead blueprint with live code.
- **Fix:** write to a clearly-named scratch path (e.g. `_fetched/`); delete the dead artifacts.

### 7. `NMonStore.py` is an unfinished stub — Medium
- **Where:** the whole file — counts to 5, writes to `VOLTDATA.txt`, `# Your code logic goes here`.
- **Risk:** dead/placeholder code in the repo; unclear intent.
- **Fix:** finish it (define the real monitor data source/format) or delete it.

### 8. `peakCount.py` end-peak heuristic is untested — Low/Medium
- **Where:** the custom "add a peak at the end" logic.
- **Risk:** heuristic thresholds (1% plateau tolerance, 5% elevation) may over/under-count on unusual data; no tests.
- **Fix:** add tests with known peak counts; document the heuristic's assumptions.

### 9. Overlapping pressure-file parsing — Low
- **Where:** `peakCount.py`, the DAT graphers, and the NanofabToolkit ALD counter all parse pressure/time files slightly differently.
- **Fix:** consider a shared parsing helper to avoid divergent behavior.

---

## Suggested priority order
1. #3 make `init_chem_db.py` produce a complete database — High
2. #1 protect the TLS private key — Medium (security)
3. #7 resolve the `NMonStore.py` stub — Medium
4. #5 tighten / scope `fetch_ssh.py` — Medium
5. #2, #4, #6, #8, #9 cleanup — Low
