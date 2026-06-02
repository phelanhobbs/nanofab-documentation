# Module 12 - Security Model

## Goal

The maintainer understands the system's security strengths, known gaps, secret-handling requirements, and the distinction between Nanofab-owned fixes and University IT tickets.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx`](../../presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx)
- [`../../presentation/UNanofabTools/flaskserver/14-Security-Model.md`](../../presentation/UNanofabTools/flaskserver/14-Security-Model.md)
- [`../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md`](../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md)
- [`../../known-issues/UNanofabTools/README.md`](../../known-issues/UNanofabTools/README.md)

## Verbatim Script

READ ALOUD:

"Security here is not one feature. It includes TLS, nginx, authentication, sessions, Duo, admin checks, device endpoints, secret storage, database permissions, file serving, server access, backups, and the University IT boundary."

SHOW:

Open `14-Security-Model.pptx`.

READ ALOUD:

"The security story should be honest. There are good things: HTTPS through nginx, password hashing, session-based login, Duo where configured, admin checks in code, local PostgreSQL not exposed publicly, and a documented operational boundary. There are also risks: hard-coded or historically hard-coded secrets, unauthenticated device routes, possible chem write-route exposure, tmux-only supervision, shared UNIX account constraints, and IT-owned root access that Nanofab must not change casually."

SHOW:

Open [`../../known-issues/UNanofabTools/README.md`](../../known-issues/UNanofabTools/README.md).

READ ALOUD:

"The known-issues master index is where security risks become a work plan. A serious security issue should not live only in a slide note. It should be findable in known issues with severity, risk, and suggested fix."

## Secret Handling

READ ALOUD:

"The documentation bundle must not contain literal secret values. If source historically contains a token, password, or key, the docs can say that a secret exists and should be moved to protected storage and rotated. The docs should not reproduce the secret."

"Safe things to document include environment variable names, file paths, service names, route names, usernames when operationally relevant, and public hostnames. Unsafe things include bearer tokens, WiFi passwords, database passwords, Duo secrets, private key material, and live session cookies."

DO:

Run a literal-secret scan only from an unprojected terminal, using the locally known values from the redaction review. Do not put the literal secret values into this script, the projected screen, or committed notes.

READ ALOUD:

"A literal-secret scan checks that known exposed values are not in the documentation bundle. We do not write the secret values into the handoff script itself. A broader source secret audit is separate and should be done carefully."

## Boundary Frame

READ ALOUD:

"Do not assign IT-owned fixes to the Nanofab maintainer. Root SSH from `iceolate` is University IT's path. `/root/.ssh/authorized_keys` is IT-owned. Creating UNIX users is IT-owned. VM backup and base patching are IT-owned. Nanofab can file tickets and track them, but should not pretend those are app-code tasks."

"Nanofab-owned fixes include moving app secrets out of source, adding app-level authentication or authorization, improving route validation, creating systemd units for Flask and downloader, improving health checks, updating docs, and fixing app code."

## Explain-Back

ASK:

- What are the major security strengths?
- What are the major security gaps?
- Which secrets must never be shown?
- Which security fixes are Nanofab-owned?
- Which security fixes are IT tickets?
- Why are unauthenticated device endpoints risky?
- Why is root SSH not a Nanofab setting to casually change?
- Where do security findings belong?

REQUIRE:

The maintainer can classify security findings into Nanofab-actionable, IT-ticket, and needs-more-evidence.

## Stop Point

STOP POINT:

Stop here if the maintainer treats root-owned changes as Nanofab-owned or does not understand secret redaction rules.
