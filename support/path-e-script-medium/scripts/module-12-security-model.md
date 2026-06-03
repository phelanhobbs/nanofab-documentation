# Medium Full Path E - Module 12: Security Model

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-12-security-model.md

# Module 12 - Security Model

## Goal

The maintainer understands the system's security strengths, known gaps, secret-handling requirements, and the distinction between Nanofab-owned fixes and University IT tickets.

## Required Screen

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx)
- `presentation/UNanofabTools/flaskserver/14-Security-Model.md` (repo path: presentation/UNanofabTools/flaskserver/14-Security-Model.md)
- `documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md` (repo path: documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md)
- `known-issues/UNanofabTools/README.md` (repo path: known-issues/UNanofabTools/README.md)

## Verbatim Script

READ ALOUD:

"Security here is not one feature. It includes TLS, nginx, authentication, sessions, Duo, admin checks, device endpoints, secret storage, database permissions, file serving, server access, backups, and the University IT boundary."

SHOW:

Open `14-Security-Model.pptx`.

READ ALOUD:

"The security story should be honest. There are good things: HTTPS through nginx, password hashing, session-based login, Duo where configured, admin checks in code, local PostgreSQL not exposed publicly, and a documented operational boundary. There are also risks: hard-coded or historically hard-coded secrets, unauthenticated device routes, possible chem write-route exposure, tmux-only supervision, shared UNIX account constraints, and IT-owned root access that Nanofab must not change casually."

SHOW:

Open `known-issues/UNanofabTools/README.md` (repo path: known-issues/UNanofabTools/README.md).

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

| Question | Expected answer |
|---|---|
| What are the major security strengths? | HTTPS/nginx, password hashing, session login, Duo where configured, admin checks, local-only PostgreSQL, and explicit IT/Nanofab boundary docs. |
| What are the major security gaps? | Historical hard-coded secrets, unauthenticated device routes, risky write routes, shared-account constraints, tmux-only supervision, and incomplete monitoring/rotation patterns. |
| Which secrets must never be shown? | Bearer tokens, WiFi passwords, database passwords, Duo secrets, private keys, session cookies, and plaintext passwords. |
| Which security fixes are Nanofab-owned? | App-level auth/authorization, validation, secret relocation in app config, docs, known issues, service supervision, and code fixes under Nanofab control. |
| Which security fixes are IT tickets? | Root SSH, `/root/`, UNIX accounts, VM backup/patching, firewall/root-level infrastructure, and root-owned file permissions. |
| Why are unauthenticated device endpoints risky? | They can accept spoofed or malformed data from anyone who can reach them unless other controls exist. |
| Why is root SSH not a Nanofab setting to casually change? | It is University IT's administrative path; changing it could lock IT out or break IT-owned maintenance/backup workflows. |
| Where do security findings belong? | In the relevant known-issues file and master known-issues index, with severity, evidence, owner, and suggested fix. |

REQUIRE:

The maintainer can classify security findings into Nanofab-actionable, IT-ticket, and needs-more-evidence.

## Stop Point

STOP POINT:

Stop here if the maintainer treats root-owned changes as Nanofab-owned or does not understand secret redaction rules.


# Expanded Module 12: Security Model

READ ALOUD:

This expanded section revisits Module 12, Security Model. The focus is strengths, gaps, secrets, route risks, and IT/Nanofab security split. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 12

READ ALOUD:

We are now doing the orientation pass for Security Model. The maintainer should connect this module to strengths, gaps, secrets, route risks, and IT/Nanofab security split. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx`
- `presentation/UNanofabTools/flaskserver/14-Security-Model.md`
- `support/REDACTION-NOTE.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention strengths, gaps, secrets, route risks, and IT/Nanofab security split. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 12

READ ALOUD:

We are now doing the evidence pass for Security Model. The maintainer should connect this module to strengths, gaps, secrets, route risks, and IT/Nanofab security split. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx`
- `presentation/UNanofabTools/flaskserver/14-Security-Model.md`
- `support/REDACTION-NOTE.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention strengths, gaps, secrets, route risks, and IT/Nanofab security split. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Source-code pass for Module 12

READ ALOUD:

We are now doing the source-code pass for Security Model. The maintainer should connect this module to strengths, gaps, secrets, route risks, and IT/Nanofab security split. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx`
- `presentation/UNanofabTools/flaskserver/14-Security-Model.md`
- `support/REDACTION-NOTE.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention strengths, gaps, secrets, route risks, and IT/Nanofab security split. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Live-state pass for Module 12

READ ALOUD:

We are now doing the live-state pass for Security Model. The maintainer should connect this module to strengths, gaps, secrets, route risks, and IT/Nanofab security split. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx`
- `presentation/UNanofabTools/flaskserver/14-Security-Model.md`
- `support/REDACTION-NOTE.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention strengths, gaps, secrets, route risks, and IT/Nanofab security split. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Failure-mode pass for Module 12

READ ALOUD:

We are now doing the failure-mode pass for Security Model. The maintainer should connect this module to strengths, gaps, secrets, route risks, and IT/Nanofab security split. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx`
- `presentation/UNanofabTools/flaskserver/14-Security-Model.md`
- `support/REDACTION-NOTE.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention strengths, gaps, secrets, route risks, and IT/Nanofab security split. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

