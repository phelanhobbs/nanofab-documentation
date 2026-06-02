# Module 19 - Path D Audit Practice

## Goal

The maintainer practices the evidence-based audit process that they will use after Faith is unavailable.

## Required Screen

SHOW:

- [`../../START-HERE.md`](../../START-HERE.md#path-d-long-term-maintainer-deep-dive)
- [`../EVALUATE.md`](../EVALUATE.md)
- the support audit script, run from the repository root as `bash support/audit.sh`

## Verbatim Script

READ ALOUD:

"This module turns the handoff from listening into ownership. Path D is the no-human-context audit. If you inherit the system after Faith is gone, Path D is how you verify what is true."

SHOW:

Open Path D in `START-HERE.md`.

READ ALOUD:

"Path D is an evidence path, not a reading path. It asks you to confirm docs against source repos, live server state, known issues, and the IT boundary. You do not declare Path D complete because you read every file. You declare it complete when the system can be operated, recovered, audited, and changed from written evidence."

## Mechanical Audit

DO:

Run:

```sh
bash support/audit.sh
```

READ ALOUD:

"Read the audit output by section. Coverage matrix tells us whether deliverables exist. Stale-string checks tell us whether corrected facts propagated. Broken link checks catch moved files. Source spot-checks compare some docs to source. The audit is a starter, not the final judgment."

If the audit reports context hits:

READ ALOUD:

"Context hits require reading surrounding text. A hit for `create UNIX users` is acceptable if it says only IT can do that. A hit for `iceolate` is acceptable if it says this is University IT's administrative host. The audit script cannot fully understand context, so the maintainer must."

## Drift Practice

DO:

Pick one route from [`../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md`](../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md).

Find it in source:

```sh
rg -n "route-name-or-path" ../UNanofabTools/app/blueprints
```

Record:

```md
## Endpoint Drift Check
- Doc path:
- Source path:
- Method:
- Guard:
- Inputs:
- Behavior:
- Side effects:
- Match status:
- Finding:
```

READ ALOUD:

"This is the unit test of documentation maintenance. If you can do this for one route, you can do it for a whole blueprint."

## Live-State Practice

If live access is available:

DO:

Run a read-only check such as:

```sh
tmux ls
systemctl status nginx
systemctl status postgresql@17-main
```

READ ALOUD:

"Now compare live state to the docs. If docs say the app is in tmux and tmux shows `flaskserver`, that matches. If docs say PostgreSQL is local and `ss` shows loopback port 5432, that matches. If live state has changed, update docs or known issues."

If live access is not available:

LOG:

Record live verification as incomplete.

## Explain-Back

ASK:

- What does `audit.sh` check?
- What does `audit.sh` not check?
- How do you verify a route against source?
- How do you verify live server facts?
- What do you do when docs and source disagree?
- What do you do when docs and live state disagree?

REQUIRE:

The maintainer performs at least one documented drift check.

## Stop Point

STOP POINT:

Stop here if the maintainer has not produced written audit notes. Path D practice must leave evidence.
