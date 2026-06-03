# Minimum Acceptable Full Path E - Module 21: Final No-Contact Check

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-21-final-no-contact-check.md

# Module 21 - Final No-Contact Check

## Goal

Confirm that the maintainer can continue without Faith. This is the final exit exam and leave-behind checklist.

## Required Screen

SHOW:

- `START-HERE.md` (repo path: START-HERE.md)
- `support/PRESENTATION-GUIDE.md` (repo path: support/PRESENTATION-GUIDE.md)
- `README.md` (repo path: support/path-e-script/README.md)
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


# Expanded Module 21: Final No-Contact Check

READ ALOUD:

This expanded section revisits Module 21, Final No-Contact Check. The focus is exit exam, leave-behind artifacts, and independence criteria. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 21

READ ALOUD:

We are now doing the orientation pass for Final No-Contact Check. The maintainer should connect this module to exit exam, leave-behind artifacts, and independence criteria. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `support/path-e-script/module-21-final-no-contact-check.md`
- `START-HERE.md`
- `support/path-e-script/OPERATOR-CHECKLIST.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

- `support/path-e-script/module-21-final-no-contact-check.md`
- `START-HERE.md`
- `support/path-e-script/OPERATOR-CHECKLIST.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

