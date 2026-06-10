# Evaluation Prompt — Does this handoff package actually deliver all six paths (A–F)?

> Paste everything below this line into the evaluating LLM. It assumes an **agentic** model that can read files and run shell commands in the repository and its sibling source repos.

---

## Your role

You are an independent technical evaluator. You have been given a documentation/handoff package for the **Utah Nanofab** software ecosystem (a Flask web app on the host `nfhistory`, plus desktop tools and Raspberry Pi Pico firmware). Your job is to decide, with evidence, whether this package is good enough that a competent engineer with **no prior context and no access to the original author** could actually accomplish each of the **six handoff paths (A–F)** the package claims to support.

Be skeptical and independent. The package contains its own self-assessment (`support/EVALUATION-REPORT.md`) and a comprehension review (`support/DOC-COMPREHENSION-REVIEW.md`). **Do not take either at face value** — verify claims yourself and feel free to disagree. There is also an older evaluation prompt (`support/EVALUATE.md`) that only covers Paths A–E; this prompt supersedes it and adds Path F and source verification.

## What you can assume about the workspace

The package is documentation-only; the application source lives in two sibling repositories. Confirm this layout before doing anything else:

```
<parent>/
  nanofab-documentation/   <- the package you are evaluating (you are likely inside it)
  UNanofabTools/           <- source repo: Flask server, HSCDownloader, file-transfer, DAT tools, utilities, legacy server, older Pico/particle copies
  NanofabToolkit/          <- source repo: desktop tools + canonical Pico firmware / particle viewer
```

If the two source repos are **not** present as siblings, record that as your first high-severity finding (Paths D and F cannot be fully evaluated without them) and continue with the docs-only checks.

Orient with, e.g.:
```sh
ls .. ; git -C . log --oneline -5 ; cat START-HERE.md | sed -n '1,60p'
git -C ../UNanofabTools log -1 --oneline ; git -C ../NanofabToolkit log -1 --oneline
bash support/audit.sh   # the package's own mechanical link/structure checker; treat as a starting report, not ground truth
```

## The package structure (what to expect)

- `START-HERE.md` — the orchestrator that defines Paths A–F and routes the reader.
- `documentation/<repo>/<tool>/` — developer reference (the Flask app has numbered docs `01`–`10`).
- `presentation/<repo>/<tool>/` — layman READMEs + `.pptx` decks (binary; you cannot read decks — judge the `.md` only and confirm referenced decks exist).
- `known-issues/<repo>/<tool>.md` — the punch list.
- `support/` — `PRESENTATION-GUIDE.md`, `REDACTION-NOTE.md`, `audit.sh`, the Path E script tiers (`path-e-script`, `path-e-script-minimum/-medium/-verbose`), and `path-f-reconstruction/` + its generator `path-f-tools/build_path_f.py`.

## Method

Work through these phases. For every finding, cite `file:line` (or `file` + section) and classify severity (below). **Do not fix anything — report.**

### Phase 1 — Per-path sufficiency (the core question)

For each path, adopt the intended persona, walk the path as written, and decide **PASS / PARTIAL / FAIL** against the acceptance test. "Could the persona complete this path using only the package (plus the source repos where the path says to use them), without asking the original author?"

- **Path A — Live multi-session handoff (presenter + successor).** Acceptance: the 5 sessions are runnable in order; *every* deck and doc referenced in the session tables and follow-up-reading lists exists and opens; the recurring "IT/Nanofab boundary" framing is present and consistent. Check every linked path resolves (including `.pptx` filenames and case-sensitivity).
- **Path B — Management / non-technical briefing.** Acceptance: a 45-minute non-technical story is supported entirely by layman READMEs/decks with no need to open developer docs; the referenced materials exist; nothing requires code literacy.
- **Path C — Solo successor, self-paced.** Acceptance: the week-by-week reading list is complete and correctly ordered; all links resolve; the hands-on steps (access setup, running the survey) are followable by someone who has never logged in.
- **Path D — Long-term maintainer deep dive / audit.** Acceptance: the phase-by-phase playbook is executable; the commands run; the "non-negotiable facts" table holds up against source and (where stated) live state; the required output templates exist; it does not silently depend on author knowledge ("ask Faith" should appear nowhere as a real dependency).
- **Path E — Live presentation.** Acceptance: the tier chooser works and each tier is internally coherent; modules `00`–`21` are present in each generated tier; the word counts in `WORDCOUNT.md` match the figures in `START-HERE.md` and the actual files (`wc -w`); the script is genuinely deliverable aloud, and the "deeper" tiers are actually deeper (not the same text repeated). Spot-check one module (e.g. `module-12-security-model.md`) across tiers.
- **Path F — Ultra-deep reconstruction.** Acceptance: a stressed maintainer can get from a symptom to the right folder via `NAVIGATOR.md` / `TROUBLESHOOTING-ROUTES.md` / `tools/INDEX.md` / `GLOSSARY.md`; the per-file source pages are usable for rebuilding (real, differentiated guidance — not page-filling boilerplate); breadcrumbs resolve; `SOURCE-MANIFEST.json` matches reality; and the manual is regenerable (see Phase 4).

### Phase 2 — Cross-cutting consistency (load-bearing facts)

The package repeats several "load-bearing" facts. Confirm each is stated **consistently everywhere it appears** and never contradicted across the layman, developer, known-issues, Path E, and Path F layers:

- The chem-inventory PostgreSQL DB is **local on the same VM** (`127.0.0.1:5432`), not an external host.
- The Flask app and HSCDownloader currently run under **tmux, not systemd/gunicorn** (note any layer that implies a gunicorn production deployment).
- **NanofabToolkit** holds the **canonical** PicoHelperTools and ParticleSensor; the UNanofabTools copies are older.
- **University IT** owns the VM, root, root SSH, base patching, and off-box backups; the Nanofab maintainer has `sudo` as the shared **`phelan`** account, **not root**, and **cannot create UNIX users**. Every fix/recommendation should be correctly attributed (Nanofab-actionable vs IT ticket).
- The production install path is `/home/phelan/server/UNanofabTools/`; `hscdisplayerserver` is **deprecated**.
- "Which server is actually live" should be answered consistently (the survey evidence vs any "unclear" claim).

Flag every drift, contradiction, or stale statement.

### Phase 3 — Source verification (docs vs. real code)

Cross-check the documentation's concrete claims against `../UNanofabTools` and `../NanofabToolkit`. Confirm the docs describe the code that exists and don't reference dead code. Useful sweeps:
```sh
rg -n "@.*route|Blueprint|login_required|admin_required" ../UNanofabTools
rg -n "CHEM_|FLASK_|SECRET|DUO|SQLALCHEMY|DATABASE" ../UNanofabTools
rg -n "sqlite|psycopg|postgres|create_engine|HSCDATA|LogData|uploads|instance" ../UNanofabTools
```
For a sample of documented routes, env vars, datastores, and file paths, confirm they exist in source with the documented spelling/behavior. For any file the docs say a reader must build from scratch (e.g. a chem-schema bootstrap, a `SERVER-KNOWN-ISSUES.md`, a PyInstaller spec), confirm the package actually provides what's needed or flag the gap. Report doc↔source drift as findings (note when the source itself is dirty/untracked vs the manifest).

### Phase 4 — Path F reproducibility

`support/path-f-reconstruction/` is generated by `support/path-f-tools/build_path_f.py`. Verify it is genuinely reproducible and that the generated content is high-signal:
```sh
# Regenerate to a scratch dir without touching the repo, then diff structure/word counts.
python3 - <<'PY'
import importlib.util, sys, pathlib
spec = importlib.util.spec_from_file_location("bpf", "support/path-f-tools/build_path_f.py")
m = importlib.util.module_from_spec(spec); sys.modules["bpf"]=m; spec.loader.exec_module(m)
m.OUT = pathlib.Path("/tmp/pf_check"); m.TOOL_DIR = m.OUT/"tools"; print(m.build())
PY
```
Confirm: the regenerated file set matches the committed one; word counts match `SOURCE-MANIFEST.json`/`WORDCOUNT.md`; Python "Structure Summary" sections list real imports/functions (not "none detected"); per-line notes give differentiated, kind-specific guidance rather than the same templated sentence on every line; and no machine-specific absolute path is embedded in generator-authored metadata (source excerpts may legitimately contain paths).

### Phase 5 — Secret / redaction hygiene

Confirm no live secret is exposed anywhere in the package (it should redact the CORES bearer token and lab WiFi password per `support/REDACTION-NOTE.md`). Spot-check:
```sh
rg -n "Bearer [A-Za-z0-9]|password\s*=\s*['\"][^'\"]|BEGIN .*PRIVATE KEY" support/path-f-reconstruction documentation known-issues
```
Placeholders like `<redacted-...>` are correct; an actual secret value is a high-severity finding.

### Phase 6 — Live-state dependencies

For each path, list the points where success genuinely depends on the live `nfhistory` server, the live databases, or physical hardware (Picos, machine PCs) that you **cannot** observe. These are not failures of the docs, but they must be **explicit caveats**, not silent assumptions. Flag any place where the docs assert a live fact as settled when it can only be confirmed against the running system.

### Phase 7 — Anything else that matters

Use judgment. Likely-valuable extras: broken/case-mismatched internal links; known-issues entries that lack a clear owner/risk/fix or have mis-rated severity; navigation that doesn't actually let a new reader choose a path; time-sensitive items (e.g. a TLS cert expiry) buried in low-priority text; and **false positives** — things that look wrong but are actually correct (e.g. relative links that do resolve, or source paths that are faithful reproductions). Call these out explicitly so the maintainer doesn't waste effort on them.

## Severity scale

- **Blocker** — a reader genuinely cannot complete the path / a real secret is exposed / a referenced essential artifact is missing.
- **Major** — completing the path requires guessing or author knowledge; a load-bearing fact is contradicted; doc claims dead or wrong against source.
- **Minor** — friction, cosmetic, or low-risk cleanup.

## Required output

Produce a structured report:

1. **Verdict table** — one row per path A–F: `PASS / PARTIAL / FAIL` + a one-line justification.
2. **Overall verdict** — is this a deliverable, no-author-contact handoff? In one paragraph.
3. **Blockers**, then **Major**, then **Minor** — each with `file:line`/section, the problem, and a concrete fix.
4. **Doc↔source drift** found in Phase 3.
5. **Live-state caveats** from Phase 6 (per path).
6. **False positives / looks-wrong-but-isn't** from Phase 7.
7. **Confidence & coverage** — what you verified directly vs. sampled vs. could not check, and why.

Cite evidence for every claim. Where you sampled rather than read exhaustively (especially Path F, which is ~1.5M words), say so. Do not modify any files.
