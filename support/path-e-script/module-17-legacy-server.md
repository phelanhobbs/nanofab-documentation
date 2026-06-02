# Module 17 - Legacy Server

## Goal

The maintainer recognizes deprecated `hscdisplayerserver`, understands why it exists in the docs, and does not spend major effort improving it unless live evidence proves it has become relevant again.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx`](../../presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx)
- [`../../presentation/UNanofabTools/hscdisplayerserver/README.md`](../../presentation/UNanofabTools/hscdisplayerserver/README.md)
- [`../../documentation/UNanofabTools/hscdisplayerserver/README.md`](../../documentation/UNanofabTools/hscdisplayerserver/README.md)
- [`../../documentation/UNanofabTools/hscdisplayerserver/ROUTES.md`](../../documentation/UNanofabTools/hscdisplayerserver/ROUTES.md)
- [`../../known-issues/UNanofabTools/hscdisplayerserver.md`](../../known-issues/UNanofabTools/hscdisplayerserver.md)

## Verbatim Script

READ ALOUD:

"This module is intentionally short but important. `hscdisplayerserver` is deprecated legacy context. It is included so a maintainer recognizes it if they encounter it. The default instruction is not to improve it. The default instruction is to preserve context and ship work to the Flask app."

SHOW:

Open `HSC-Displayer-Server-Legacy.pptx`.

READ ALOUD:

"A legacy system can be dangerous because it looks like a project that wants maintenance. Before spending time on it, ask whether it is live, whether users depend on it, whether the current Flask app replaced it, and whether known issues say to retire it."

SHOW:

Open [`../../known-issues/UNanofabTools/hscdisplayerserver.md`](../../known-issues/UNanofabTools/hscdisplayerserver.md).

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
