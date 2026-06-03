# Minimum Acceptable Full Path E - Module 00: Set The Contract

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-00-set-the-contract.md

# Module 0 - Set The Contract

## Goal

The maintainer understands what this handoff is, how the documentation repo is organized, where source repos must live, what evidence outranks what, and what safety rules apply before any live system is touched.

## Required Screen

SHOW:

- `START-HERE.md` (repo path: START-HERE.md), especially Path E and Path D.
- `support/PRESENTATION-GUIDE.md` (repo path: support/PRESENTATION-GUIDE.md).
- `00-operator-protocol.md` (repo path: support/path-e-script/00-operator-protocol.md).

## Verbatim Script

READ ALOUD:

"This is the full maintainer handoff. It is not a quick overview and it is not a slide tour. The goal is that, after this process, you can operate, audit, recover, and extend the system without needing to contact Faith."

"I am going to over-explain. That is intentional. This system is a website, a live server, a set of data pipelines, a chemical inventory system, a collection of desktop tools, Pico firmware, shared-account access, and a boundary with University IT. A shallow handoff would make the pieces feel familiar but would not make you operationally independent."

"We will use slides, but the slides are not the source of truth. They are a map. The truth comes from the documentation, the source code, the live server, database state when needed, known-issues files, and recorded evidence."

"This documentation repository is a documentation bundle. It intentionally does not contain the full application source trees. For source-code verification, the source repositories must sit beside it as sibling directories named `../UNanofabTools` and `../NanofabToolkit`. If those repos are missing, that is a high-severity handoff risk. The docs alone are not enough to safely maintain the system."

SHOW:

The directory table at the top of `START-HERE.md` (repo path: START-HERE.md).

READ ALOUD:

"There are three main documentation trees. `presentation/` contains plain-English READMEs and slide decks. `documentation/` contains developer references and runbooks. `known-issues/` contains bugs, risks, tech debt, and recommended fixes. The source repos live beside this documentation repo, not inside it."

"The handoff has several paths. Path A is a normal live multi-session handoff. Path B is a management presentation. Path C is a solo successor reading path. Path D is the no-human-context evidence audit. Path E is what we are doing now: a complete, slide-supported, live presentation designed to make the maintainer independent."

SHOW:

Path D in `START-HERE.md` (repo path: START-HERE.md#path-d-long-term-maintainer-deep-dive).

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

End the first mini-session here if setup was difficult, source repos were missing, or the maintainer needs time to read `START-HERE.md` (repo path: START-HERE.md).

Homework:

- Read `START-HERE.md` (repo path: START-HERE.md) through Path E.
- Skim `support/PRESENTATION-GUIDE.md` (repo path: support/PRESENTATION-GUIDE.md).
- Confirm local access to `../UNanofabTools` and `../NanofabToolkit`.


# Expanded Module 00: Set The Contract

READ ALOUD:

This expanded section revisits Module 00, Set The Contract. The focus is workspace, source-of-truth order, safety, and documentation layout. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 00

READ ALOUD:

We are now doing the orientation pass for Set The Contract. The maintainer should connect this module to workspace, source-of-truth order, safety, and documentation layout. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `START-HERE.md`
- `support/PRESENTATION-GUIDE.md`
- `support/path-e-script/00-operator-protocol.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

- `START-HERE.md`
- `support/PRESENTATION-GUIDE.md`
- `support/path-e-script/00-operator-protocol.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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



# Read-Aloud Documentation Corpus: support/REDACTION-NOTE.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Redaction Note

This GitHub documentation copy redacts literal credential values that were present in the local documentation:

- CORES bearer token value.
- Lab WiFi password value.

The surrounding known-issues text is preserved so maintainers still know those secrets exist in source and should be moved to protected storage and rotated.

`support/path-f-reconstruction/` also contains sanitized source excerpts generated from the sibling source repos. Secret-looking literal values in those excerpts are replaced with placeholders such as `<redacted-secret-value>`, `<redacted-bearer-token>`, or `<redacted-long-token>`. Those placeholders document where a value exists; they are not recoverable credentials.
