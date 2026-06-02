# Module 0 - Set The Contract

## Goal

The maintainer understands what this handoff is, how the documentation repo is organized, where source repos must live, what evidence outranks what, and what safety rules apply before any live system is touched.

## Required Screen

SHOW:

- [`../../START-HERE.md`](../../START-HERE.md), especially Path E and Path D.
- [`../PRESENTATION-GUIDE.md`](../PRESENTATION-GUIDE.md).
- [`00-operator-protocol.md`](00-operator-protocol.md).

## Verbatim Script

READ ALOUD:

"This is the full maintainer handoff. It is not a quick overview and it is not a slide tour. The goal is that, after this process, you can operate, audit, recover, and extend the system without needing to contact Faith."

"I am going to over-explain. That is intentional. This system is a website, a live server, a set of data pipelines, a chemical inventory system, a collection of desktop tools, Pico firmware, shared-account access, and a boundary with University IT. A shallow handoff would make the pieces feel familiar but would not make you operationally independent."

"We will use slides, but the slides are not the source of truth. They are a map. The truth comes from the documentation, the source code, the live server, database state when needed, known-issues files, and recorded evidence."

"This documentation repository is a documentation bundle. It intentionally does not contain the full application source trees. For source-code verification, the source repositories must sit beside it as sibling directories named `../UNanofabTools` and `../NanofabToolkit`. If those repos are missing, that is a high-severity handoff risk. The docs alone are not enough to safely maintain the system."

SHOW:

The directory table at the top of [`../../START-HERE.md`](../../START-HERE.md).

READ ALOUD:

"There are three main documentation trees. `presentation/` contains plain-English READMEs and slide decks. `documentation/` contains developer references and runbooks. `known-issues/` contains bugs, risks, tech debt, and recommended fixes. The source repos live beside this documentation repo, not inside it."

"The handoff has several paths. Path A is a normal live multi-session handoff. Path B is a management presentation. Path C is a solo successor reading path. Path D is the no-human-context evidence audit. Path E is what we are doing now: a complete, slide-supported, live presentation designed to make the maintainer independent."

SHOW:

Path D in [`../../START-HERE.md`](../../START-HERE.md#path-d-long-term-maintainer-deep-dive).

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

- What are the three main documentation trees?
- Where are the two source repos expected to live?
- What is the difference between Path C, Path D, and Path E?
- What is the source-of-truth order when docs, source, and live state disagree?
- What should happen if a command might reveal secrets?

REQUIRE:

The maintainer can explain that this is a documentation-only GitHub repo and that source-code verification requires sibling source repos.

## Stop Point

STOP POINT:

End the first mini-session here if setup was difficult, source repos were missing, or the maintainer needs time to read [`../../START-HERE.md`](../../START-HERE.md).

Homework:

- Read [`../../START-HERE.md`](../../START-HERE.md) through Path E.
- Skim [`../PRESENTATION-GUIDE.md`](../PRESENTATION-GUIDE.md).
- Confirm local access to `../UNanofabTools` and `../NanofabToolkit`.
