# Minimum Acceptable Full Path E - Module 17: Legacy Server

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-17-legacy-server.md

# Module 17 - Legacy Server

## Goal

The maintainer recognizes deprecated `hscdisplayerserver`, understands why it exists in the docs, and does not spend major effort improving it unless live evidence proves it has become relevant again.

## Required Screen

SHOW:

- `presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx` (repo path: presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx)
- `presentation/UNanofabTools/hscdisplayerserver/README.md` (repo path: presentation/UNanofabTools/hscdisplayerserver/README.md)
- `documentation/UNanofabTools/hscdisplayerserver/README.md` (repo path: documentation/UNanofabTools/hscdisplayerserver/README.md)
- `documentation/UNanofabTools/hscdisplayerserver/ROUTES.md` (repo path: documentation/UNanofabTools/hscdisplayerserver/ROUTES.md)
- `known-issues/UNanofabTools/hscdisplayerserver.md` (repo path: known-issues/UNanofabTools/hscdisplayerserver.md)

## Verbatim Script

READ ALOUD:

"This module is intentionally short but important. `hscdisplayerserver` is deprecated legacy context. It is included so a maintainer recognizes it if they encounter it. The default instruction is not to improve it. The default instruction is to preserve context and ship work to the Flask app."

SHOW:

Open `HSC-Displayer-Server-Legacy.pptx`.

READ ALOUD:

"A legacy system can be dangerous because it looks like a project that wants maintenance. Before spending time on it, ask whether it is live, whether users depend on it, whether the current Flask app replaced it, and whether known issues say to retire it."

SHOW:

Open `known-issues/UNanofabTools/hscdisplayerserver.md` (repo path: known-issues/UNanofabTools/hscdisplayerserver.md).

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


# Expanded Module 17: Legacy Server

READ ALOUD:

This expanded section revisits Module 17, Legacy Server. The focus is deprecated hscdisplayerserver context and retirement posture. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 17

READ ALOUD:

We are now doing the orientation pass for Legacy Server. The maintainer should connect this module to deprecated hscdisplayerserver context and retirement posture. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx`
- `presentation/UNanofabTools/hscdisplayerserver/README.md`
- `documentation/UNanofabTools/hscdisplayerserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

- `presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx`
- `presentation/UNanofabTools/hscdisplayerserver/README.md`
- `documentation/UNanofabTools/hscdisplayerserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

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

