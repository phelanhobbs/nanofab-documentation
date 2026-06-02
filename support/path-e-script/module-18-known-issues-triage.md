# Module 18 - Known Issues And Maintenance Triage

## Goal

The maintainer can turn known-issues files into a prioritized maintenance plan that separates Nanofab-actionable work from University IT tickets.

## Required Screen

SHOW:

- [`../../known-issues/UNanofabTools/README.md`](../../known-issues/UNanofabTools/README.md)
- [`../../known-issues/UNanofabTools/liveserver.md`](../../known-issues/UNanofabTools/liveserver.md)
- [`../../known-issues/UNanofabTools/serveraccess.md`](../../known-issues/UNanofabTools/serveraccess.md)
- [`../../known-issues/UNanofabTools/flaskserver.md`](../../known-issues/UNanofabTools/flaskserver.md)
- [`../../known-issues/NanofabToolkit/README.md`](../../known-issues/NanofabToolkit/README.md)

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

- What are the top three Nanofab-actionable fixes?
- What are the top three IT tickets?
- What evidence supports each top issue?
- Which issues should not be worked first?
- What issue would you close only after live evidence?
- How do you update docs after fixing an issue?

REQUIRE:

The maintainer can produce a 7-day and 30-day maintenance plan with owners.

## Stop Point

STOP POINT:

Stop here until the maintainer has produced a written maintenance plan. Do not proceed to final operational scenarios without it.
