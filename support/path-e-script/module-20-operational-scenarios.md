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

| Question | Expected answer |
|---|---|
| Can DNS resolve? | Check `nfhistory.nanofab.utah.edu` resolves to the expected host/IP or identify DNS as the failure layer. |
| Is nginx running? | Use `systemctl status nginx`; it should be active for public HTTPS service. |
| Is TLS valid? | Check the browser/certbot/certificate status; Let's Encrypt cert should be valid and renewal should be healthy. |
| Is Flask listening behind nginx? | Check loopback listener/process state, expected `127.0.0.1:5000` style service, and proxy config. |
| Is the `flaskserver` tmux session alive? | `tmux ls` should show `flaskserver`; if missing, use the documented recovery path. |
| Is the Python process inside it alive? | Inspect process list or tmux pane safely; tmux existing alone does not prove Flask is serving. |
| Are there recent errors? | Check visible tmux output/logs/app output without exposing secrets. |
| Can you restart safely using the documented procedure? | Yes, by following the serveraccess runbook, recreating tmux only if needed, using the right path, and detaching with `Ctrl-b d`. |

REQUIRE:

The maintainer states the checks in order and identifies which are safe read-only checks.

## Scenario 2 - Machine Data Is Stale

READ ALOUD:

"Scenario two: the website loads, but machine data is stale. That is a data freshness problem, not necessarily a web outage."

ASK:

| Question | Expected answer |
|---|---|
| Is `downloader` tmux alive? | `tmux ls` should show `downloader`; if not, follow the downloader recovery runbook. |
| Is `HSCDownloader.py` running? | Verify the Python process, not just the tmux session. |
| When did `HSCDATA` last change? | Check file modification times in `HSCDATA` and compare them to expected downloader cadence. |
| Is CORES or n8n reachable? | Verify upstream availability or recent downloader errors without exposing credentials. |
| Are machine-control-PC logs separate from CORES data? | Yes. Control-PC logs go to `LogData`; CORES-derived data goes to `HSCDATA`. |
| Which known-issues file covers downloader risk? | `known-issues/UNanofabTools/hscdownloader.md`, plus live-server/serveraccess issues for supervision. |

REQUIRE:

The maintainer distinguishes `HSCDATA` freshness from website uptime.

## Scenario 3 - Chemical Inventory Error

READ ALOUD:

"Scenario three: chemical inventory pages fail or writes behave incorrectly. Treat this as a data-integrity issue."

ASK:

| Question | Expected answer |
|---|---|
| Is PostgreSQL running locally? | `postgresql@17-main` or the documented local PostgreSQL service should be active on `nfhistory`. |
| Is it listening on `127.0.0.1:5432`? | Yes, that is the documented live local listener shape. |
| Are chemical DB env-var names correct? | Compare `CHEM_*` config docs to `config.py` and production key names, without showing secret values. |
| Did schema drift occur? | Compare documented schema to live schema/introspection or current source assumptions. |
| Which routes write chemical inventory? | Chem inventory create/update/move/remove/import/write routes in `chem_inventory.py`, as documented in endpoint docs. |
| Are write routes properly guarded? | Confirm route decorators/guards and known-issues status; do not assume from UI alone. |
| Is backup coverage known before making changes? | It must be confirmed for local PostgreSQL and app data before risky schema/data changes. |

REQUIRE:

The maintainer does not change schema casually and knows to verify backup/restore assumptions.

## Scenario 4 - Access Must Be Revoked

READ ALOUD:

"Scenario four: a maintainer leaves and access must be revoked."

ASK:

| Question | Expected answer |
|---|---|
| Which account do Nanofab users SSH as? | The shared `phelan` UNIX account. |
| Where are per-person SSH keys represented? | In `/home/phelan/.ssh/authorized_keys` entries/labels, not separate UNIX accounts. |
| Who can create or remove UNIX accounts? | University IT. |
| What requires IT? | UNIX account creation/removal, root-owned access changes, `/root/`, root SSH, and VM-level access policy. |
| What app-level accounts or admin privileges also need review? | Flask app users, admin flags, assignment privileges, and any application-level credentials. |

REQUIRE:

The maintainer separates SSH access, app account access, admin privileges, and IT-owned UNIX account work.

## Scenario 5 - Secret Exposure

READ ALOUD:

"Scenario five: a token, password, or key is found in source or docs. The fix is not just deletion. The secret must be removed from inappropriate storage, moved to protected configuration, and rotated if exposure is possible."

ASK:

| Question | Expected answer |
|---|---|
| What kind of secret is it? | Identify whether it is a bearer token, WiFi password, DB password, Duo secret, private key, session secret, or other credential. |
| Where was it exposed? | Source file, docs file, Git history, terminal output, screenshot, notes, or deployed config. |
| Is it in Git history? | Check history if exposure was committed; deletion from the current file is not enough. |
| Who owns rotation? | The owner of the underlying service/credential, with Nanofab or IT depending on the secret. |
| Which docs or known-issues files need updating? | The relevant tool known-issues file, redaction note if documentation is affected, and any docs that describe secret handling. |
| What scan verifies the documentation bundle is clean? | A literal scan for known exposed values plus broader secret scans where appropriate, run without projecting secrets. |

REQUIRE:

The maintainer can describe rotation, not just redaction.

## Scenario 6 - Docs And Live State Disagree

READ ALOUD:

"Scenario six: docs and live state disagree. The live state wins for current operations. The docs must be updated or must clearly say they describe a target state."

ASK:

| Question | Expected answer |
|---|---|
| What was observed live? | Record the exact command/snapshot/output summary and date. |
| Which doc disagrees? | Name the specific Markdown file/section or slide note that conflicts with live state. |
| Is the disagreement dangerous? | Classify severity based on whether it affects recovery, security, data integrity, or operational decisions. |
| Does known issues need a new entry? | Yes if the drift reflects unresolved risk or live behavior that docs cannot immediately correct. |
| What evidence should be committed? | Updated docs, known-issues entry, sanitized survey snapshot, and/or a concise drift report with no secrets. |

REQUIRE:

The maintainer writes a short drift finding.

## Stop Point

STOP POINT:

Stop here only after the maintainer can walk through every scenario without relying on Faith.
