# Module 20 - Operational Scenarios

## Goal

The maintainer rehearses real maintenance scenarios: website down, stale data, database trouble, access revocation, secret exposure, backup verification, and documentation drift.

## Required Screen

SHOW:

- [`../../documentation/UNanofabTools/serveraccess/README.md`](../../documentation/UNanofabTools/serveraccess/README.md)
- [`../../documentation/UNanofabTools/liveserver/README.md`](../../documentation/UNanofabTools/liveserver/README.md)
- [`../../documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`](../../documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md)
- [`../../known-issues/UNanofabTools/README.md`](../../known-issues/UNanofabTools/README.md)

## Verbatim Script

READ ALOUD:

"This module is scenario rehearsal. A maintainer is not ready just because they understand files. They need to know what to do under pressure without guessing."

## Scenario 1 - Website Appears Down

READ ALOUD:

"Scenario one: someone says the website is down. Do not start by editing code. Start with evidence."

ASK:

- Can DNS resolve?
- Is nginx running?
- Is TLS valid?
- Is Flask listening behind nginx?
- Is the `flaskserver` tmux session alive?
- Is the Python process inside it alive?
- Are there recent errors?
- Can you restart safely using the documented procedure?

REQUIRE:

The maintainer states the checks in order and identifies which are safe read-only checks.

## Scenario 2 - Machine Data Is Stale

READ ALOUD:

"Scenario two: the website loads, but machine data is stale. That is a data freshness problem, not necessarily a web outage."

ASK:

- Is `downloader` tmux alive?
- Is `HSCDownloader.py` running?
- When did `HSCDATA` last change?
- Is CORES or n8n reachable?
- Are machine-control-PC logs separate from CORES data?
- Which known-issues file covers downloader risk?

REQUIRE:

The maintainer distinguishes `HSCDATA` freshness from website uptime.

## Scenario 3 - Chemical Inventory Error

READ ALOUD:

"Scenario three: chemical inventory pages fail or writes behave incorrectly. Treat this as a data-integrity issue."

ASK:

- Is PostgreSQL running locally?
- Is it listening on `127.0.0.1:5432`?
- Are chemical DB env-var names correct?
- Did schema drift occur?
- Which routes write chemical inventory?
- Are write routes properly guarded?
- Is backup coverage known before making changes?

REQUIRE:

The maintainer does not change schema casually and knows to verify backup/restore assumptions.

## Scenario 4 - Access Must Be Revoked

READ ALOUD:

"Scenario four: a maintainer leaves and access must be revoked."

ASK:

- Which account do Nanofab users SSH as?
- Where are per-person SSH keys represented?
- Who can create or remove UNIX accounts?
- What requires IT?
- What app-level accounts or admin privileges also need review?

REQUIRE:

The maintainer separates SSH access, app account access, admin privileges, and IT-owned UNIX account work.

## Scenario 5 - Secret Exposure

READ ALOUD:

"Scenario five: a token, password, or key is found in source or docs. The fix is not just deletion. The secret must be removed from inappropriate storage, moved to protected configuration, and rotated if exposure is possible."

ASK:

- What kind of secret is it?
- Where was it exposed?
- Is it in Git history?
- Who owns rotation?
- Which docs or known-issues files need updating?
- What scan verifies the documentation bundle is clean?

REQUIRE:

The maintainer can describe rotation, not just redaction.

## Scenario 6 - Docs And Live State Disagree

READ ALOUD:

"Scenario six: docs and live state disagree. The live state wins for current operations. The docs must be updated or must clearly say they describe a target state."

ASK:

- What was observed live?
- Which doc disagrees?
- Is the disagreement dangerous?
- Does known issues need a new entry?
- What evidence should be committed?

REQUIRE:

The maintainer writes a short drift finding.

## Stop Point

STOP POINT:

Stop here only after the maintainer can walk through every scenario without relying on Faith.
