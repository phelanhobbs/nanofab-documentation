# Minimum Acceptable Full Path E - Module 19: Path D Audit Practice

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-19-path-d-audit-practice.md

# Module 19 - Path D Audit Practice

## Goal

The maintainer practices the evidence-based audit process that they will use after Faith is unavailable.

## Required Screen

SHOW:

- `START-HERE.md` (repo path: START-HERE.md#path-d-long-term-maintainer-deep-dive)
- `support/EVALUATE.md` (repo path: support/EVALUATE.md)
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

Pick one route from `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (repo path: documentation/UNanofabTools/flaskserver/05-http-api-reference.md).

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

| Question | Expected answer |
|---|---|
| What does `audit.sh` check? | Deliverable coverage, broken internal links, stale strings, snapshot presence, and limited source/doc spot checks. |
| What does `audit.sh` not check? | Full factual correctness, all route behavior, all source drift, live server truth, security design, and human judgment/context. |
| How do you verify a route against source? | Compare endpoint docs to the actual route decorator, guard, inputs, service calls, side effects, response, and known issues. |
| How do you verify live server facts? | Use safe live commands, survey snapshots, service status, tmux state, listener checks, and IT confirmation where needed. |
| What do you do when docs and source disagree? | Treat source as stronger evidence, update docs or create a known-issues/drift finding. |
| What do you do when docs and live state disagree? | Treat live state as current operational truth, update docs/snapshots/known issues or mark docs as target-state only. |

REQUIRE:

The maintainer performs at least one documented drift check.

## Stop Point

STOP POINT:

Stop here if the maintainer has not produced written audit notes. Path D practice must leave evidence.


# Expanded Module 19: Path D Audit Practice

READ ALOUD:

This expanded section revisits Module 19, Path D Audit Practice. The focus is mechanical audit, source drift, live drift, and evidence notes. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 19

READ ALOUD:

We are now doing the orientation pass for Path D Audit Practice. The maintainer should connect this module to mechanical audit, source drift, live drift, and evidence notes. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `START-HERE.md#path-d-long-term-maintainer-deep-dive`
- `support/EVALUATE.md`
- `support/audit.sh`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention mechanical audit, source drift, live drift, and evidence notes. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 19

READ ALOUD:

We are now doing the evidence pass for Path D Audit Practice. The maintainer should connect this module to mechanical audit, source drift, live drift, and evidence notes. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `START-HERE.md#path-d-long-term-maintainer-deep-dive`
- `support/EVALUATE.md`
- `support/audit.sh`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention mechanical audit, source drift, live drift, and evidence notes. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: support/EVALUATE.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# LLM Evaluation Prompt — UNanofabTools / NanofabToolkit Handoff Materials

You are evaluating a body of documentation, presentations, and known-issues files produced for a handoff of two related repositories. Your job is to **assess the deliverables for completeness, internal consistency, factual correctness, and quality of cross-referencing**. You will produce a structured evaluation report.

You have **no prior context** beyond this repository. Read this prompt fully, then run the suggested checks from the repository root, then read whatever files you need to substantiate your findings.

This GitHub repository is the documentation bundle. It intentionally excludes the application source repos. Source-code checks require sibling checkouts named `../UNanofabTools/` and `../NanofabToolkit/`, or equivalent recovered source trees.

---

## 1. What's being evaluated

The repository root contains the documentation bundle:

| Path | What it is |
|------|-----------|
| `START-HERE.md` | The umbrella orchestrator. Lists every deliverable, includes Paths A-F, and contains the full Path D no-human-context audit playbook plus Path E presentation and Path F reconstruction routes. **Read this first.** |
| `support/PRESENTATION-GUIDE.md` | Path E speaker script for presenting the exhaustive maintainer walkthrough with the slide decks. |
| `support/path-e-script/` | Expanded Path E read-aloud script pack, with one script per module plus operator protocol. |
| `support/path-e-script-minimum/`, `support/path-e-script-medium/`, `support/path-e-script-verbose/` | Generated Path E script tiers targeting 50k-100k, 100k-250k, and 250k+ words. |
| `support/path-f-reconstruction/` | Generated Path F reconstruction manual, split by tool folder, with sanitized source excerpts, navigator, troubleshooting routes, glossary, checklist, and evidence template. |
| `support/path-f-tools/build_path_f.py` | Generator for the Path F reconstruction manual. |
| `presentation/UNanofabTools/<tool>/` | Plain-English "layman" READMEs + slide decks (`.pptx`) for each tool in the UNanofabTools repo |
| `documentation/UNanofabTools/<tool>/` | Formal developer reference for each UNanofabTools tool |
| `known-issues/UNanofabTools/<tool>.md` | Bugs / tech debt / recommended fixes for each UNanofabTools tool |
| `presentation/NanofabToolkit/<tool>/` | Same layman + slides structure for the sibling NanofabToolkit repo |
| `documentation/NanofabToolkit/<tool>/` | Developer reference for NanofabToolkit |
| `known-issues/NanofabToolkit/<tool>.md` | Bugs / tech debt / recommended fixes for each NanofabToolkit tool |
| `support/audit.sh` | Mechanical-check script. Run it first; it produces a starter report. |

For source-code comparison, use sibling source repos:

| Path | What it is |
|------|-----------|
| `../UNanofabTools/` | The actual source code of the Flask web app |
| `../NanofabToolkit/` | The actual source code of the desktop tools and Pico firmware |

The handoff is **for a successor** to a Flask-based cleanroom server system at the University of Utah Nanofab. The server is named `nfhistory`. There are also several desktop tools, Raspberry Pi firmware, and data pipelines tied to it.

---

## 2. Key facts the documentation is supposed to reflect

These were established late in the documentation process. Earlier revisions of some files got them wrong; later revisions should be consistent. **A correct deliverable set will reflect all of these everywhere they're relevant; an incorrect one will have stale references.**

| Fact | Why it matters |
|------|---------------|
| **The Flask app is installed at `/home/phelan/server/UNanofabTools/`** | Earlier docs said `~/UNanofabTools/`. Anything still saying that without the `/server/` prefix is stale. |
| **`HSCDownloader.py` lives in that same install directory** (no separate `~/HSCDownloader/`) | Earlier docs implied a separate folder. References to `~/HSCDownloader/` or `cd ~/HSCDownloader` are stale. |
| **The chem PostgreSQL database is local on the same VM** (bound to `127.0.0.1:5432`, runs as `postgresql@17-main`) | Earlier docs called it "external." References to "external PostgreSQL" or "separate PostgreSQL database" (in a way that implies different machine) are stale. |
| **Backups are run off-box by University IT, not by the Nanofab team** | Any finding still saying "no backups exist" without the IT-handled context is stale. |
| **The Nanofab admin has `sudo` as `phelan` but does not have `root`, and cannot `useradd`** | Any recommendation to "create per-person UNIX accounts" without flagging it as an IT ticket is stale. |
| **Root SSH on `nfhistory` is IT's access path** (key from `root@iceolate.eng.utah.edu`, IP `155.98.110.9`) | Any finding still treating root SSH as a Nanofab to-do or suggesting `chmod 600 /root/.ssh/authorized_keys` as a Nanofab fix (rather than an IT ticket) is stale. |
| **`nfhistory` is at `155.98.11.8`, Debian 13 (trixie), kernel 6.12** | Live state captured by two snapshots under `documentation/UNanofabTools/liveserver/snapshots/`. |
| **TLS cert is Let's Encrypt, auto-renewed by `certbot.timer`** | Cert lifetime is 90 days; renewal cron is `/etc/cron.d/certbot`. |
| **The Flask app and HSCDownloader run inside tmux sessions named `flaskserver` and `downloader`**, NOT under systemd | The most consequential reliability finding — they should be supervised, currently aren't. |

---

## 3. Coverage you should verify

Every tool in each repo is expected to have **four deliverables**:

1. A layman README at `presentation/<repo>/<tool>/README.md`
2. A slide deck at `presentation/<repo>/<tool>/slides/<Name>.pptx`
3. A developer README (or numbered docs) at `documentation/<repo>/<tool>/`
4. A known-issues file at `known-issues/<repo>/<tool>.md`

Tools you should expect to find for UNanofabTools:

- `flaskserver` (the main web app — has 10 numbered docs + 16 decks)
- `serveraccess` (how to log in)
- `liveserver` (what's running on `nfhistory`)
- `hscdownloader`
- `filetransfer`
- `dattools`
- `utilities`
- `picofirmware` (older copies — canonical lives in NanofabToolkit)
- `particlepctools` (older copy — canonical lives in NanofabToolkit)
- `hscdisplayerserver` (deprecated; kept for historical reference)

Tools you should expect to find for NanofabToolkit:

- `PicoHelperTools` (canonical firmware — UNanofabTools/picofirmware is the older copy)
- `ParticleSensor` (canonical desktop viewer — UNanofabTools/particlepctools is the older copy)
- `ParalyneReader`
- `ALDPeakCounter`
- `DentonDecoder`
- `PreciousMetalReader`

Master indexes you should find:

- `presentation/UNanofabTools/README.md`
- `documentation/UNanofabTools/README.md`
- `known-issues/UNanofabTools/README.md`
- `presentation/NanofabToolkit/README.md`
- `documentation/NanofabToolkit/README.md`
- `known-issues/NanofabToolkit/README.md`

Path F indexes you should find:

- `support/path-f-reconstruction/README.md`
- `support/path-f-reconstruction/MAINTAINER-FIRST-HOUR.md`
- `support/path-f-reconstruction/NAVIGATOR.md`
- `support/path-f-reconstruction/TROUBLESHOOTING-ROUTES.md`
- `support/path-f-reconstruction/GLOSSARY.md`
- `support/path-f-reconstruction/RECONSTRUCTION-CHECKLIST.md`
- `support/path-f-reconstruction/REBUILD-EVIDENCE-TEMPLATE.md`
- `support/path-f-reconstruction/FIXTURE-AND-EVIDENCE-INDEX.md`
- `support/path-f-reconstruction/WORDCOUNT.md`
- `support/path-f-reconstruction/SOURCE-MANIFEST.json`
- `support/path-f-reconstruction/tools/INDEX.md`

---

## 4. Tasks for you

Run these tasks in order.

### Task 1 — Run the mechanical audit

```sh
bash support/audit.sh
```

This prints a starter report covering: missing deliverables, broken internal links, stale string references. **Read its output before doing anything else** — many of your findings will start from rows it surfaced.

### Task 2 — Coverage verification

For each tool in §3 above, confirm the four deliverables exist. **Note any missing ones** in your report.

### Task 3 — Fact propagation check

For each "key fact" in §2, search the docs to confirm the fact is reflected everywhere it should be. Examples:

```sh
# Stale install paths
grep -rn '~/UNanofabTools/' documentation/ presentation/ known-issues/ START-HERE.md
grep -rn '~/HSCDownloader' documentation/ presentation/ known-issues/ START-HERE.md

# Stale chem-external references
grep -rn 'external PostgreSQL\|external chem\|external server' documentation/UNanofabTools/flaskserver/

# Stale "no backups" without IT-handled context
grep -rln 'no backup\|No backups\|nothing backs up' documentation/ presentation/ known-issues/

# Stale "create UNIX users" without IT-ticket context
grep -rn 'create UNIX\|create per-person\|useradd' documentation/ presentation/ known-issues/

# Stale root-SSH-as-finding
grep -rn 'PermitRootLogin\|iceolate' documentation/ presentation/ known-issues/
```

For each hit, **read the surrounding context** and judge whether the reference is correctly framed (IT-handled, IT-owned, IT-ticket) or stale (still presenting it as a Nanofab to-do).

### Task 4 — Cross-document consistency

For each pair below, read both and confirm they agree on the facts:

| Pair | What to check |
|------|--------------|
| `presentation/UNanofabTools/flaskserver/README.md` ↔ `documentation/UNanofabTools/flaskserver/01-architecture.md` | Same architecture story (number of databases, where each lives) |
| `documentation/UNanofabTools/serveraccess/README.md` ↔ `documentation/UNanofabTools/liveserver/README.md` | Operational boundary, recovery commands, paths |
| `documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_2026-06-01.txt` ↔ `documentation/UNanofabTools/liveserver/README.md` | Every value claimed in the doc should be in the snapshot |
| `known-issues/UNanofabTools/liveserver.md` ↔ `documentation/UNanofabTools/liveserver/README.md` | The findings list at the top of the doc (§0) should match the entries in the known-issues file |
| `presentation/UNanofabTools/<tool>/README.md` ↔ `documentation/UNanofabTools/<tool>/README.md` (any tool) | Layman should be the same story, written for non-coders. No factual contradictions. |
| `START-HERE.md` ↔ everything else | Every file path it references should exist; every claim about what's in a deck/doc should be true. |

### Task 5 — Source code vs. documentation

The source code is expected in sibling directories `../UNanofabTools/` and `../NanofabToolkit/`. If those repos are missing, report that source-code verification could not be completed and treat it as a handoff risk. Spot-check:

- Does the env-var schema in `documentation/UNanofabTools/flaskserver/03-configuration-reference.md` match `../UNanofabTools/config/config.py`?
- Do the HTTP routes in `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` match the actual `@app.route(...)` decorators in `../UNanofabTools/app/blueprints/`?
- Do the chem env-var names (`CHEM_PGHOST` etc.) match in the docs and `../UNanofabTools/config/config.py`?
- Are any "canonical lives in NanofabToolkit" claims accurate? Check that `../NanofabToolkit/PicoHelperTools/` and `../NanofabToolkit/ParticleSensor/` exist and have substantive content (not stub README pointers).

### Task 6 — Find contradictions

Read enough to surface internal contradictions. Examples of the kind of thing to look for:

- One doc claims a service is supervised by systemd, another says it runs only in tmux.
- One doc says X is auto-rotated, another says X is unbounded.
- One file lists 7 SSH keys, another says 1.
- The slide notes contradict the slide body.
- Recovery commands in different files use different paths.

### Task 7 — START-HERE.md integrity

`START-HERE.md` is the entry point. Verify:

- Every file path it links to **exists** at that path.
- Every path A → presented order (Sessions 1–5) names decks/docs that actually exist with those filenames.
- Path B (45-min talk), Path C (solo successor reading order), Path D (deep-dive maintainer playbook), and Path E (presentation guide) reference real files.
- The "Quick reference" section at the bottom is accurate.

### Task 8 — Stylistic / quality assessment

Briefly judge:

- Are the layman READMEs actually layman-friendly? (Jargon flagged when introduced, no Python code in body text, etc.)
- Are the developer docs concrete enough to act on? (Real file paths, real env-var names, real command examples?)
- Are the known-issues files honest? (Severity tagged, fixes proposed, IT-vs-Nanofab boundary called out?)
- Is the slide deck text appropriate length for slides? (Bullets, not paragraphs?)

---

## 5. Output format

Produce a single markdown report with these sections, in this order:

````
# Evaluation Report — UNanofabTools / NanofabToolkit Handoff

## Executive summary
[3–5 sentences. Overall verdict: thorough / acceptable / weak / failed. The single most important finding.]

## Coverage matrix
| Repo | Tool | Layman | Slides | Dev docs | Known-issues |
|------|------|--------|--------|----------|--------------|
| ... | ... | ✓ / missing / partial | ... | ... | ... |

## Fact propagation
For each "key fact" from §2 of the prompt:
- **Install path (`~/server/UNanofabTools/`)** — [VERIFIED / PARTIAL / STALE references remain at file:line, file:line]
- **Chem PostgreSQL is local** — [...]
- **Backups are IT-handled** — [...]
- **Nanofab has sudo not root, can't useradd** — [...]
- **Root SSH = IT's path** — [...]
- (others)

## Contradictions found
Numbered list. Each item:
- **What contradicts what** (file A:line says X; file B:line says Y)
- **Severity**: High / Medium / Low
- **Suggested fix**

## Broken or missing references
- Broken links inside START-HERE.md or any other master index
- Files claimed to exist but don't
- Decks that don't match their advertised slide count

## Source code vs documentation
Brief judgment per spot-check from §4 Task 5. Concrete file:line cites for any drift.

## Stylistic quality
2–4 paragraphs covering: appropriateness of layman vs developer voice; concreteness of dev docs; honesty of known-issues; deck content density.

## Numbered findings (severity-tagged)
Final consolidated punch list. Each entry:
- **#N. [Finding title]** — Severity
  - Where: `<file>:<line>` (or section reference)
  - Evidence: short quote or paraphrase
  - Suggested fix: 1–2 sentences

## Overall recommendation
What the author should do next, if anything, to improve the deliverable set.
````

---

## 6. Calibration: what "good" looks like

To help calibrate severity, here are illustrative examples for each level:

- **High** — A documented fact actively contradicts another documented fact (e.g., one doc says chem Postgres is external, another says local, and the reader can't tell which is right). Or: a recovery command references a path that doesn't exist on the live server. Or: a security claim that's materially wrong.
- **Medium** — A stale reference that's not actively misleading because the corrected version appears elsewhere, but if a reader landed on the stale one first they'd be confused.
- **Low** — Cosmetic inconsistency (e.g. one file calls it "the chem database," another "the chemical inventory database"). Worth noting but not blocking.

Aim for surgical findings, not bulk complaints. Quote the exact contradictory text.

---

## 7. Reproducibility note

When the original author reads your report, they'll want to verify each finding themselves. Always cite **file paths and line numbers** rather than "somewhere in the docs." When you quote, quote exactly. When you summarize, say so.

If something is genuinely good, say so — this is an evaluation, not a takedown. The goal is an honest read-out of where the work succeeded and where it didn't.

---

## 8. Stop here

Once you have your report, output it. Do not edit any files in this repository — your job is to evaluate, not to fix. If you find issues important enough to fix, your report's "Suggested fix" entries are the deliverable.
