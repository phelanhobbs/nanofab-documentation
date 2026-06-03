# Verbose Maximal Path E - Module 13: HSCDownloader

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-13-hscdownloader.md

# Module 13 - HSCDownloader And CORES Data

## Goal

The maintainer understands `HSCDownloader.py`, where it lives, what it pulls, what it writes, how it runs today, and what risks belong in the maintenance plan.

## Required Screen

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx` (repo path: presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx)
- `presentation/UNanofabTools/hscdownloader/README.md` (repo path: presentation/UNanofabTools/hscdownloader/README.md)
- `documentation/UNanofabTools/hscdownloader/README.md` (repo path: documentation/UNanofabTools/hscdownloader/README.md)
- `known-issues/UNanofabTools/hscdownloader.md` (repo path: known-issues/UNanofabTools/hscdownloader.md)

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
documentation/UNanofabTools/hscdownloader/README.md
known-issues/UNanofabTools/hscdownloader.md
```

DO:

Run:

```sh
rg -n "save|CORES|HSCDATA|requests|Bearer|time|schedule|while" ../UNanofabTools/HSCDownloader.py documentation/UNanofabTools/hscdownloader/README.md known-issues/UNanofabTools/hscdownloader.md
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


# Expanded Module 13: HSCDownloader

READ ALOUD:

This expanded section revisits Module 13, HSCDownloader. The focus is CORES ingestion, HSCDATA freshness, credentials, and supervision. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 13

READ ALOUD:

We are now doing the orientation pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Source-code pass for Module 13

READ ALOUD:

We are now doing the source-code pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Live-state pass for Module 13

READ ALOUD:

We are now doing the live-state pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Failure-mode pass for Module 13

READ ALOUD:

We are now doing the failure-mode pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Maintenance-planning pass for Module 13

READ ALOUD:

We are now doing the maintenance-planning pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Security pass for Module 13

READ ALOUD:

We are now doing the security pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Recovery pass for Module 13

READ ALOUD:

We are now doing the recovery pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Documentation-drift pass for Module 13

READ ALOUD:

We are now doing the documentation-drift pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Teach-back pass for Module 13

READ ALOUD:

We are now doing the teach-back pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Homework-review pass for Module 13

READ ALOUD:

We are now doing the homework-review pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Quarterly-audit pass for Module 13

READ ALOUD:

We are now doing the quarterly-audit pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Backup-and-restore pass for Module 13

READ ALOUD:

We are now doing the backup-and-restore pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Ownership-boundary pass for Module 13

READ ALOUD:

We are now doing the ownership-boundary pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## No-contact rehearsal pass for Module 13

READ ALOUD:

We are now doing the no-contact rehearsal pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Operator-error pass for Module 13

READ ALOUD:

We are now doing the operator-error pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Data-integrity pass for Module 13

READ ALOUD:

We are now doing the data-integrity pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

## Final-repetition pass for Module 13

READ ALOUD:

We are now doing the final-repetition pass for HSCDownloader. The maintainer should connect this module to CORES ingestion, HSCDATA freshness, credentials, and supervision. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx`
- `presentation/UNanofabTools/hscdownloader/README.md`
- `documentation/UNanofabTools/hscdownloader/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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



# Module Documentation Corpus



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


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/hscdownloader/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# HSC Downloader — A Plain-English Guide

This guide explains `HSCDownloader.py`, the program that fetches machine usage data and prepares the spreadsheets the website displays. Written for a non-coder; terms are defined as they appear.

## What it does, in one sentence

HSCDownloader is the program that **regularly downloads each machine's run data from the university's records system and saves it as spreadsheets**, so the website's machine pages have something to show.

## Why it exists

When someone uses a cleanroom tool, they fill out a digital form recording the run (what was deposited, the settings, the results, and so on). Those forms are stored in a university system called **CORES** (the Center for Research Equipment & Services), behind a web service called n8n.

That data isn't directly usable by our website — it lives in CORES, in CORES's format. HSCDownloader bridges the gap:

1. It asks CORES for each machine's form data.
2. It tidies and reshapes that data into clean spreadsheets.
3. It saves those spreadsheets where the website can read them.

Think of it as the **supply line**: CORES is the warehouse, HSCDownloader is the delivery truck, and the website is the store shelf. (This is the same CORES system the "Precious Metal Reader" uses — a different part of the same warehouse.)

## How it works

HSCDownloader runs continuously and, on a schedule, does the following for each machine:

1. **Download.** It calls CORES's web service for that machine, using a secret access token to prove it's allowed.
2. **Reshape.** It takes the raw data and turns it into a neat table (using the data-handling library *pandas*).
3. **Save two versions.** For each machine it writes a full spreadsheet and a trimmed-down "small" version. The website's machine pages read the "small" versions.

It does this for essentially every tool in the cleanroom — deposition tools (ALD, E-beam, MOCVD, Parylene, the Dentons), dry-etch tools (DRIE, Isotropic, PlasmaLab, PlasmaTherm, Technics), and furnaces (CleanOx, DopedOx, LTO, Nitride, Poly, Allwin), among others. A PECVD recipe exists in the code, but the scheduled loop currently leaves it disabled.

Each machine has its own "recipe" function inside the program (for example, `saveALD`, `saveEbeam`, `saveDenton635`) that knows which columns matter for that tool and how to format them.

## Where it fits in the bigger picture

```
   CORES (n8n)  ──►  HSCDownloader  ──►  HSCDATA spreadsheets  ──►  the website's
   (the records)     (this program)     (small_<Machine>.csv)       machine pages
```

So when you open a machine's page on the website and see a table of recent runs, those numbers were fetched and formatted by HSCDownloader. If a machine page looks stale or empty, HSCDownloader is the first place to look.

## Good to know

- It **only reads** from CORES and **writes** spreadsheets locally; it never changes the original records in CORES.
- It runs on a **schedule**, automatically and unattended, and is designed to shut down cleanly when asked.
- It uses a **secret access token** to talk to CORES. That token is currently written into the program itself, which the developer notes flag as something to move into a protected setting.
- Each machine's formatting lives in its own function, so adding or adjusting a machine is a localized change.
- A couple of machines are noted in the code as "currently has no data" — expected gaps, not bugs.

In short: HSCDownloader is the quiet supply line that keeps the website's machine data current by pulling it from CORES and laying it out as spreadsheets the site can display.


# Module Slide Note Corpus



## Slide Notes From presentation/UNanofabTools/hscdownloader/slides/_build/build_tool.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); const fs = require(
- ); const { Deck } = require(
- ); const M = require(
- ); const modPath = process.argv[2]; if (!modPath) { console.error(
- ); process.exit(1); } const OUT = process.env.OUT || path.join(__dirname,
- ); fs.mkdirSync(OUT, { recursive: true }); (async () => { const mod = require(path.join(__dirname, modPath)); const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter, footer:
- + mod.title }); mod.build(d); const outPath = path.join(OUT, mod.filename); await d.save(outPath); console.log(


## Slide Notes From presentation/UNanofabTools/hscdownloader/slides/_build/deckkit.js

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


## Slide Notes From presentation/UNanofabTools/hscdownloader/slides/_build/meta.js

READ ALOUD OR USE AS SPEAKER NOTES:

- Utah Nanofab · University of Utah
- UNanofabTools Server — A Plain-English Guide


## Slide Notes From presentation/UNanofabTools/hscdownloader/slides/_build/tooldecks/hscdownloader.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); module.exports = { filename:
- , build(d) { d.title_slide({ kicker:
- The supply line that keeps the website's machine data current. A plain-English walkthrough.
- This session covers HSCDownloader — the program that regularly pulls each machine's run data from the university's records system and
- saves it as spreadsheets the website can display. It's the supply line behind every machine page. No coding background needed. We'll
- cover why it exists, how it works, where it fits, and a couple of things to watch.
- Those forms live in the university's CORES records system.
- That data isn't in a form our website can use directly.
- HSCDownloader bridges the gap — it fetches and reformats it.
- Set up the why. Every tool use is recorded in a digital form stored in CORES, the university's equipment records system. Our website
- can't read CORES data directly, so HSCDownloader fetches it, reshapes it into clean spreadsheets, and saves them where the website
- can read them. Without it, the machine pages would have nothing to show.
- The supply line, end to end:
- CORES is the warehouse; HSCDownloader is the truck; the website is the shelf.
- Trace the flow. CORES holds the records. HSCDownloader downloads them, reshapes them with a data-handling library, and writes
- spreadsheets into the HSCDATA folder. The website's machine pages then read those spreadsheets. So the numbers you see on a machine
- page came through this pipeline. If a page looks stale, HSCDownloader is the first suspect.
- What it does, on a schedule
- ask CORES for a machine's form data, using a secret token.
- turn the raw data into a neat table.
- a full spreadsheet and a trimmed 'small' one for the website.
- do this for every machine, automatically, on a schedule.
- Walk the cycle. For each machine it downloads the form data (proving it's allowed with a secret token), reshapes it into a table, and
- writes two spreadsheets — a full one and a trimmed 'small' one that the website actually reads. It repeats this for each active tool,
- automatically and unattended, and shuts down cleanly when asked.
- Each tool has its own function: saveALD, saveEbeam, saveDenton635, ...
- Each knows which columns matter for that tool and how to format them.
- Covers deposition tools, dry-etch tools, and furnaces.
- So adjusting one machine is a small, localized change.
- Explain the structure. Inside the program, each machine has its own 'recipe' function — saveALD, saveEbeam, and so on — that knows
- that tool's important columns and formatting. It covers essentially every active major tool: deposition, dry etch, and furnaces. Because
- each machine is its own function, changing one tool's output is a contained edit. (The flip side: there's a lot of near-duplicate
- code across them, which the developer notes suggest consolidating.)
- What you see on a machine page came from here
- Open a tool's page → the table of recent runs is from HSCDownloader.
- The graphs are drawn from the same downloaded spreadsheets.
- Stale or empty machine page? Check HSCDownloader first.
- It only reads from CORES — it never changes the original records.
- Make the connection concrete. The table and graphs on any machine page trace directly back to the spreadsheets this program writes.
- So if a page is stale or blank, the question is usually 'is HSCDownloader running and reaching CORES?' Reassure that it's read-only
- with respect to CORES — it never alters the source records, only copies and reformats them.
- It stores the digital run forms staff fill out for each tool.
- HSCDownloader reads from it through a web service called n8n.
- It's the same system the Precious Metal Reader uses — a different part of it.
- Define CORES so the source is clear. CORES is the university's equipment-records system; staff log each tool run there via a digital
- form. HSCDownloader pulls that data through a CORES web service (n8n). Worth noting it's the same system another tool — the Precious
- Metal Reader — talks to, just a different dataset, so people don't confuse the two.
- It covers nearly every tool
- ALD, E-beam, MOCVD, Parylene, Denton 635/18
- DRIE, Isotropic, PlasmaLab, PlasmaTherm, Technics
- CleanOx, DopedOx, LTO, Nitride, Poly, Allwin
- Show the breadth. HSCDownloader has a recipe for essentially every major active tool, grouped as deposition, dry etch, and furnaces.
- PECVD has code in the file but is currently disabled in the scheduled save loop. The point isn't the list; it's that one program keeps
- most machine-page data current. Each machine maps to a CORES ID number behind the scenes.
- When a machine page goes stale
- if it stopped, no spreadsheets get updated.
- an outage or a changed token blocks downloads.
- Did the machine's ID change?
- a renumbered CORES ID silently breaks that one tool.
- Give a practical diagnostic. If a machine page looks stale, work down this list: is the downloader process running at all; can it reach
- CORES (outage or an expired/rotated token); and did that machine's CORES ID change (which silently breaks just that tool). There's no
- automatic alert today, so staleness is usually noticed by eye — which is itself on the fix list.
- If CORES is down or the token changes, pages quietly go stale (no alert today).
- Each machine maps to a CORES ID; if an ID changes, that machine stops updating.
- A couple of machines are marked 'no data yet' — expected, not bugs.
- Cover the watch-items honestly. The secret token is currently embedded in the code and should be moved into a protected setting and
- rotated. There's no alerting, so a CORES outage or token change shows up only as stale machine pages — adding failure alerts is
- recommended. Each machine is tied to a CORES ID number; if CORES renumbers one, that machine silently stops updating. And a few
- machines are noted as having no data yet, which is expected. All of this is in the developer notes and issues list.
- Those spreadsheets are what the website's machine pages display.
- It runs on a schedule, one recipe per machine, read-only on CORES.
- Watch the embedded token and the lack of failure alerts.
- Wrap up. HSCDownloader is the quiet supply line keeping machine data current: download from CORES, reshape, save, repeat. It's
- essential but low-profile. The two things to improve are moving the access token into a protected setting and adding alerts so silent
- staleness gets noticed. Questions welcome.
