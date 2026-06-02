# LLM Evaluation Prompt — UNanofabTools / NanofabToolkit Handoff Materials

You are evaluating a body of documentation, presentations, and known-issues files produced for a handoff of two related repositories. Your job is to **assess the deliverables for completeness, internal consistency, factual correctness, and quality of cross-referencing**. You will produce a structured evaluation report.

You have **no prior context** beyond what's in this directory. Read this prompt fully, then run the suggested checks, then read whatever files you need to substantiate your findings.

This GitHub repository is the documentation bundle. It intentionally excludes the application source repos. Source-code checks require sibling checkouts named `../UNanofabTools/` and `../NanofabToolkit/`, or equivalent recovered source trees.

---

## 1. What's being evaluated

The directory you're in contains the documentation bundle:

| Path | What it is |
|------|-----------|
| `START-HERE.md` | The umbrella orchestrator. Lists every deliverable, includes Paths A-E, and contains the full Path D no-human-context audit playbook. **Read this first.** |
| `PRESENTATION-GUIDE.md` | Path E speaker script for presenting the exhaustive maintainer walkthrough with the slide decks. |
| `presentation/UNanofabTools/<tool>/` | Plain-English "layman" READMEs + slide decks (`.pptx`) for each tool in the UNanofabTools repo |
| `documentation/UNanofabTools/<tool>/` | Formal developer reference for each UNanofabTools tool |
| `known-issues/UNanofabTools/<tool>.md` | Bugs / tech debt / recommended fixes for each UNanofabTools tool |
| `presentation/NanofabToolkit/<tool>/` | Same layman + slides structure for the sibling NanofabToolkit repo |
| `documentation/NanofabToolkit/<tool>/` | Developer reference for NanofabToolkit |
| `audit.sh` | Mechanical-check script. Run it first; it produces a starter report. |

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
4. A known-issues file at `known-issues/<repo>/<tool>.md` *(UNanofabTools only — NanofabToolkit is client-side and may not need known-issues)*

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

---

## 4. Tasks for you

Run these tasks in order.

### Task 1 — Run the mechanical audit

```sh
bash audit.sh
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

Once you have your report, output it. Do not edit any files in this directory — your job is to evaluate, not to fix. If you find issues important enough to fix, your report's "Suggested fix" entries are the deliverable.
