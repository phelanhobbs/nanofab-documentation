# Documentation Comprehension Review — `super-in-depth` branch

**What this is:** Seven independent reviewer agents each read a slice of the `nanofab-documentation` bundle as *a programmer with no prior context being handed the docs cold*. Each was told to judge only what the docs say (not the source code) and report comprehension blockers, gaps, broken links, and open questions. Findings below are consolidated, de-duplicated, and prioritized; the highest-stakes claims were spot-verified against the files.

**Coverage**

| # | Area | Reviewer verdict |
|---|------|------------------|
| 1 | Orientation & navigation (START-HERE, README, support guides) | 4/5 |
| 2 | flaskserver developer reference (README + 01–10) | 4/5 |
| 3 | Other UNanofabTools tool docs (9 tools) | 5/5 |
| 4 | NanofabToolkit tool docs (6 tools) | 4/5 |
| 5 | Presentation / layman layer (READMEs + flaskserver chapters) | 4/5 |
| 6 | Known-issues punch lists (both repos) | 4/5 |
| 7 | Path E scripts / Path F reconstruction manual *(sampled)* | E 4/5 · F 3/5 |

## Bottom line

**Yes — a competent engineer with no context can understand and operate this system from the docs alone.** This is an unusually strong, internally consistent handoff set; reviewers could trace the architecture, get in, and triage work within hours. The issues below are real but mostly bounded. There is exactly **one true blocker** (rebuilding the chem database), a recurring **under-documentation of the `phelan` sudo scope**, a few **cross-layer inconsistencies**, and some **quality problems in the auto-generated Path E tiers / Path F line-notes**. Nothing found is unrecoverable.

---

## 1. The one true blocker (verified)

**Rebuilding the chemical-inventory PostgreSQL database is impossible from the docs.** Multiple places (`documentation/UNanofabTools/flaskserver/04-database-schema.md` §4.4.4–4.4.5, `09-deployment-and-operations.md` §9.4, `10-development-guide.md` final line) defer the list of production-only columns/tables — `containers.last_scan_at`, extended `inventory_cycles`, `scan_raw.barcode`, `container_scans.barcode`, the whole `transactions` table — to a file called **`SERVER-KNOWN-ISSUES.md`**. *Verified: that file does not exist anywhere in the bundle.* No executable DDL is provided, so a fresh chem DB will 500 on write/scan/report.

> **Fix:** create `SERVER-KNOWN-ISSUES.md` with the missing `ALTER/CREATE` DDL, or inline a "fresh-install supplement" block in `04` §4.4 and reference it from `09` §9.4.

---

## 2. Cross-cutting issues (raised independently by ≥2 reviewers)

**A. The `phelan` sudo scope is never documented.** *(verified: no `sudo -l` / `NOPASSWD` / sudoers mention anywhere.)* The docs say "sudo as `phelan`, not root, can't `useradd`," but 10+ known-issues fixes (`liveserver.md` #5,#7,#8,#9,#11–13; `serveraccess.md` #3,#4) issue `apt`/`systemctl` commands whose success depends on the exact rule. A maintainer can't tell which "Nanofab-actionable" items they can actually run. *Fix: state the practical rule in `serveraccess` §5.5 (e.g. "`sudo -l` on first login; covers systemd/nginx/apt" or whatever is true).*

**B. "Which server is actually live?" is left ambiguous in two places** that contradict the evidence. `known-issues/.../hscdisplayerserver.md` #10 still says "unclear which server is in production (High)," and the layman `presentation/.../hscdisplayerserver/README.md` (lines 16–17) says the legacy monolith "or the new version" serves the site — yet `liveserver/README.md` already proves the Flask app (PID on `127.0.0.1:5000`) is live. *Fix: state plainly "Flask is live as of the 2026-06-01 survey; legacy is reference-only," downgrade the stale issue, and cross-link the survey.*

**C. Production runtime story is inconsistent: gunicorn vs `python run.py` under tmux.** The dev reference (`09` §9.5) and the **layman** chapter (`presentation/.../flaskserver/02-How-It-Starts.md`, lines 39/264) describe a gunicorn/uwsgi WSGI deployment, but `serveraccess`/`liveserver` confirm production today is `python run.py` inside a tmux session. Also `gunicorn` isn't in `requirements.txt` (only an inline comment in `09` §9.3 mentions installing it). A new maintainer forms the wrong mental model and/or hits `ModuleNotFoundError`. *Fix: add a "current reality vs. target" note in both layers; add gunicorn to a `requirements-prod.txt`.*

**D. Secret acquisition / rotation is undocumented across tools.** The CORES bearer token (`hscdownloader`), `auth.py` for PreciousMetalReader, `picopass.py` Wi-Fi creds, and `.env` keys are all described as "not committed / move to a vault," but **nowhere says how to obtain, format, or rotate them, or who administers CORES credentials.** *Fix: add a one-line "first-time setup / who owns this secret" to each.*

**E. The orchestrator uses undefined acronyms.** `START-HERE.md` never defines **CORES** (line 100), **n8n** (line 585), or **CADE** (line 67) even in passing, and tells a solo reader to "get a CADE account" with no URL/contact. *Fix: add a one-clause parenthetical on first use of each.*

**F. `.env.example` ships production-hostile defaults.** Per `02` §2.3 / `03` §3.2 it contains `HOST=155.98.11.6`, `PORT=443` (the live IP/TLS port); `cp .env.example .env && python run.py` would bind to production values. Warnings exist but are easy to miss. *Fix: comment those lines out in the example and bold the caveat.*

**G. The live-server survey is self-flagged incomplete.** `liveserver/README.md` §10–11 (and the layman version) note the `phelan`-side run never captured the venv path, `.env` key names, the SQLite/Postgres table inventories, or data-tree sizes. Several other findings ("see next survey") therefore can't be closed yet. *Fix: re-run the survey and fill, or date-stamp which sections are confirmed vs pending.*

**H. No build/run instructions for the desktop tools.** All five packaged NanofabToolkit tools admit a PyInstaller setup "not shown here," and none gives the `python main.py` dev path, Python version, or `requirements.txt` location. *Fix: add a short `## Build / Run` block per tool.*

---

## 3. Act-now / time-sensitive

- **TLS cert expires 2026-06-23** (`known-issues/.../liveserver.md` #10) — ~3 weeks out; sits in a Low/info item with no escalation path if `certbot.timer` fails. Spot-check renewal on the box now.
- **Chem write routes are unauthenticated** (`07` §7.11) but the route table `05` §5.7 just labels them "Public," reading like a design choice. Surface the flag where routes are consumed.
- **`GET /sensor-data` always returns 404** (documented in layman `08-IoT-API-Endpoints.md`) — real latent bug; not surfaced in the chapter's TOC entry.

---

## 4. Quick-win specific fixes (verified where noted)

- **Broken deck link (verified):** `START-HERE.md` line 83 links `02-How-it-Starts.pptx`; the file is `02-How-It-Starts.pptx` (capital I). Breaks on case-sensitive filesystems. → fix the link's case.
- **Session-2 recovery step** (`START-HERE.md` line 70) says `cd` with no target; should be `cd /home/phelan/server/UNanofabTools/`, and "activate venv" needs the actual path/command.
- **"three parallel trees"** (`START-HERE.md` line 5) — there are four top-level folders; `support/` is never introduced (first used silently at line 423). Add it to the intro table.
- **Typo + wrong example** in `presentation/.../flaskserver/01-Server-Overview.md` line 13: "PrecioiusMetalReader," and it says that tool "fetches reagent prices" — it fetches precious-metal *usage records* and talks to CORES, not this server. Pick a tool that actually calls the server for the analogy.
- **VGC083C firmware** (`picofirmware/README.md`) posts to `/api/VGC/...`, an endpoint that exists nowhere in the server docs. Note it's not implemented server-side.
- **known-issues hygiene:** `flaskserver.md` priority list omits items #3/#5/#10/#12; `liveserver.md` #22 tells you to read a `§9.4` that doesn't exist yet; the dead `return_selected` endpoint is rated **Low** server-side but **Medium** client-side (`ParalyneReader.md` #1) — reconcile and cross-link.

---

## 5. False positive caught (do **not** action)

Reviewer 5 (presentation) reported the NanofabToolkit "See also" links to `../../documentation/` and `../../known-issues/` as broken, claiming those folders "don't exist." **They do exist** (verified: `documentation/UNanofabTools/README.md` and `known-issues/UNanofabTools/README.md` are present), and the relative paths resolve correctly. This was a Glob-scoping error by the agent. Likewise, the Path F "empty page" finding refers to the *untracked duplicate* `060-chem_inventory_remote.py.md` (65 lines); the live blueprint copy `017-app__blueprints__chem_inventory_remote.py.md` is fully captured (4,780 lines).

---

## 6. Path E / Path F specifics (sampled, not exhaustive)

The Path F **navigation layer** (NAVIGATOR, MAINTAINER-FIRST-HOUR, TROUBLESHOOTING-ROUTES, GLOSSARY, checklists) is genuinely excellent and stress-ready. The problems are in generated content:

- **Path E "deeper" tiers are padded, not deeper.** In `path-e-script-medium` (5 passes) and `-verbose` (18 passes), each module's expanded passes are identical `SHOW`/`DO`/`EXPECTED`/`STOP` blocks differing only by the heading word. The medium tier's session plan (`scripts/00-operator-and-session-plan.md`) repeats the same session block 12×. So 229k/314k words are largely boilerplate. *Fix: give each named pass distinct content, or drop the tiers in favor of the practical pack.*
- **Path F structure summaries are unreliable.** Source-file pages report `Imports/Classes/Functions: none detected` even when the excerpt clearly contains them (confirmed on `HSCDownloader.py` and `auth.py`). A maintainer orienting from the summary gets a false "empty" picture. *Fix: re-run extraction via AST.*
- **Path F line-by-line notes carry no insight** — every line (including blanks and license headers) gets the same templated sentence. Volume without value. *Fix: differentiate notes for imports/config/secret assignments/routes; collapse comment/blank lines.*
- **Generator leaks an absolute local path** (`/Users/phe/code/work/UNanofabTools`) into `tools/00-system-map/README.md` — won't resolve elsewhere.

---

## 7. What a no-context maintainer still couldn't answer without you

These are the recurring "I'd have to ask Faith" gaps — closing them would make the handoff truly self-sufficient:

1. What exactly does `sudo as phelan` permit? (gates half the punch list)
2. How does a new person get their first SSH key into `/home/phelan/.ssh/authorized_keys` — self-service or IT ticket? How do you get a CADE account (URL/contact)?
3. Where is the canonical GitHub repo for these docs (so a successor can clone it)?
4. Who operates the CORES/n8n side, and who do you contact if the endpoint or token changes?
5. Where do the secrets come from / how are they formatted and rotated (CORES token, `auth.py`, `picopass.py`, `.env`)?
6. Is the legacy `HSCDisplayerServer` running in any capacity right now (the survey never ran `ps | grep HSCDisplayer`)?
7. Which per-machine file-transfer scripts are actually deployed and reaching `nfhistory` today?
8. For desktop tools: Python version, dev-run command, and where each `requirements.txt`/`.spec` lives.
