# Module 21 - Final No-Contact Check

## Goal

Confirm that the maintainer can continue without Faith. This is the final exit exam and leave-behind checklist.

## Required Screen

SHOW:

- [`../../START-HERE.md`](../../START-HERE.md)
- [`../PRESENTATION-GUIDE.md`](../PRESENTATION-GUIDE.md)
- [`README.md`](README.md)
- current handoff notes
- current known-issues tree
- current maintenance plan

## Verbatim Script

READ ALOUD:

"This is the final no-contact check. The purpose is not to prove that you remember every detail. The purpose is to prove that you know where truth lives, how to verify it, what is safe to change, what is not yours to change, and how to turn uncertainty into written evidence."

"If you can answer these questions from docs, source, and live state, then you do not need Faith. If you cannot, we write down the missing fact before the handoff ends."

## Ownership Questions

ASK:

- Who owns the VM?
- Who owns root?
- Who owns `/home/phelan/`?
- Who owns app code?
- Who owns off-box backups?
- Who can create UNIX users?
- What is the Nanofab maintainer's UNIX account reality?
- What is the difference between an app admin and UNIX root?

REQUIRE:

The maintainer answers with clear Nanofab-vs-IT ownership.

## Runtime Questions

ASK:

- What serves the public site?
- What does nginx proxy to?
- What process writes `HSCDATA`?
- What are the two required tmux sessions today?
- What is the production install path?
- What should replace tmux long term?
- How do you safely inspect tmux?
- How do you detach?

REQUIRE:

The maintainer gives exact names: `flaskserver`, `downloader`, `/home/phelan/server/UNanofabTools/`, and `Ctrl-b d`.

## Data Questions

ASK:

- Which data is SQLite?
- Which data is PostgreSQL?
- Which data is CSV or log files?
- Which data comes from devices?
- Which data comes from CORES?
- Which data comes from machine-control PCs?
- Which data must be backed up?
- What backup coverage must be confirmed with IT?

REQUIRE:

The maintainer distinguishes databases from file trees and data producers.

## Code Questions

ASK:

- Where is the app factory?
- Where are blueprints?
- Where is auth?
- Where is admin behavior?
- Where is chem DB access?
- Where is `HSCDownloader.py`?
- Which repo is canonical for Pico firmware?
- Which repo is canonical for ParticleSensor?
- Which code is deprecated?

REQUIRE:

The maintainer identifies canonical source locations and historical copies.

## Security Questions

ASK:

- Where should secrets live?
- Which secrets were historically hard-coded?
- Which routes are unauthenticated?
- Which writes are highest-risk?
- What is Nanofab-owned vs IT-owned?
- What does root SSH from `iceolate` mean?
- What should happen if a secret is exposed?

REQUIRE:

The maintainer can classify security work into Nanofab, IT, and needs-evidence.

## Maintenance Questions

ASK:

- What are the first three Nanofab fixes?
- What are the first three IT tickets?
- How do you run the documentation audit?
- How do you close a known issue?
- How do you update the live-server snapshot?
- How do you verify docs against source?
- How do you verify docs against live state?
- What do you do if source and docs disagree?

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
