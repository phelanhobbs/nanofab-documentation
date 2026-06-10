# Evaluation Report — UNanofabTools / NanofabToolkit Handoff

*Evaluator's note on method: findings below were produced by running `audit.sh`, then reading the orchestrator, the live-server inventory and its two raw snapshots, the flaskserver architecture/config/API docs, the serveraccess reference, representative layman docs, the known-issues files, and the Flask source under `UNanofabTools/app/`. Every cite is `file:line` against the tree as delivered. Where I paraphrase rather than quote, I say so.*

## Executive summary

This is a **thorough** deliverable set — among the most internally consistent handoff packages I'd expect to see. Coverage is complete: all 16 tools across both repos carry their full complement of layman README, slide deck, developer reference, and (for UNanofabTools) known-issues file, plus all five master indexes; NanofabToolkit even ships known-issues files the spec said it could omit. The single most important result is a **negative** one: the eight "late-established" key facts (the `/server/` install path, chem-Postgres-is-local, IT-handled backups, sudo-not-root, root-SSH-is-IT's, tmux-not-systemd, etc.) are propagated correctly *everywhere they appear* — the mechanical sweep found zero stale references, and every IT/Nanofab-boundary hit is correctly framed. No High- or Medium-severity contradiction survives; the classic traps (chem DB location, systemd-vs-tmux, root-vs-phelan key counts) are each handled cleanly and cross-referenced. The only defects are six **Low-severity** polish items: a mischaracterized punch-list summary and a case-mismatched filename in `START-HERE.md`, two unreconciled-but-individually-correct value wrinkles in the live-server doc (`wtmpdb` dates; a downloader PID table that mixes its source columns), one typo, and one stale illustrative `tmux ls` example.

## Resolution status (updated 2026-06-02)

All findings were fixed in the documentation, and a full developer-doc-vs-source validation pass was then run across **both** repos. The executive summary above is preserved as the original as-evaluated snapshot; current status:

- **#1 `wtmpdb` dual dates** — ✅ Fixed. §1 and §9.2 now label the two scans (reboot scan begins Jan 7; login scan begins May 8) and finding #16 is reworded as *login* history.
- **#2 §6.5 PID-table source-mixing** — ✅ Fixed. The `downloader` vim row now uses the snapshot's pane pid `48177`; the drift note explains both sessions.
- **#3 START-HERE "only entry: retire it"** — ✅ Fixed → "headline item: retire it; plus 10 secondary tech-debt notes."
- **#4 Case-mismatched deck link** — ✅ Fixed → `02-How-It-Starts.pptx`.
- **#5 "PrecioiusMetalReader" typo** — ✅ Fixed → "PreciousMetalReader".
- **#6 Stale `tmux ls` sample** — ✅ Fixed → `flaskserver: 2 windows`.
- **#7 "16 layman section docs" overcount** — ✅ Fixed → "15".
- **#8 filetransfer remote path** (found during the full source validation) — ✅ Fixed. The doc now shows the literal `C:\Users\phelanh\Desktop\Logs\MACHINE` the template uses, instead of a normalized Unix-style path.

**Source-vs-documentation validation (both repos).** The developer docs are accurate against the code: the app factory (7 registered blueprints, `chem_inventory_remote` excluded, `fmtdate`, inline static routes, `db.create_all`, `user_loader`); `config.py` (HOST/PORT, binds, the five `CHEM_*` vars, the `FLASK_ENV`→config-class mapping); the "79 routes / chem 21" count (correctly excluding the commented decorator and the unregistered duplicate blueprint); every SQLite model column; the chem schema including the honestly-flagged runtime-only `transactions` table and `last_scan_at` column; dependency versions; all 12 device API routes; and every UNanofabTools and NanofabToolkit tool's documented filenames, functions, signatures, and data contracts (even the "this endpoint doesn't exist server-side" notes for `/api/VGC/pressureupload` and ParalyneReader's `/return/`). Two **source-side** issues (not doc errors) surfaced:

- **`Flask-Migrate` was missing from `requirements.txt`** though `app/__init__.py` imports it at startup — ✅ Fixed: pinned `Flask-Migrate==4.1.0` (the version in the repo venv); architecture §1.2 version cell updated from "—" to `4.1.0`. Alembic remains transitive; gunicorn intentionally stays out per `09-deployment-and-operations.md`.
- **The filetransfer template's literal `C:\…` remote path** aimed at a Debian host is a likely latent script bug — ⚠ flagged for the author; source left unchanged.

## Coverage matrix

All four deliverables present for every tool. (`✓` = present and substantive.)

| Repo | Tool | Layman | Slides | Dev docs | Known-issues |
|------|------|--------|--------|----------|--------------|
| UNanofabTools | flaskserver | ✓ (README + 15 section docs) | ✓ (16 decks, `00`–`15`) | ✓ (10 numbered + README) | ✓ |
| UNanofabTools | serveraccess | ✓ | ✓ (17 slides) | ✓ | ✓ |
| UNanofabTools | liveserver | ✓ | ✓ (13 slides) | ✓ (+ survey script + 2 snapshots) | ✓ |
| UNanofabTools | hscdownloader | ✓ | ✓ | ✓ | ✓ |
| UNanofabTools | filetransfer | ✓ | ✓ | ✓ | ✓ |
| UNanofabTools | dattools | ✓ | ✓ | ✓ | ✓ |
| UNanofabTools | utilities | ✓ | ✓ | ✓ | ✓ |
| UNanofabTools | picofirmware | ✓ | ✓ | ✓ | ✓ |
| UNanofabTools | particlepctools | ✓ | ✓ | ✓ | ✓ |
| UNanofabTools | hscdisplayerserver | ✓ | ✓ | ✓ (README + ROUTES.md) | ✓ |
| NanofabToolkit | PicoHelperTools | ✓ | ✓ | ✓ | ✓ (exceeds spec) |
| NanofabToolkit | ParticleSensor | ✓ | ✓ | ✓ | ✓ (exceeds spec) |
| NanofabToolkit | ParalyneReader | ✓ | ✓ | ✓ | ✓ (exceeds spec) |
| NanofabToolkit | ALDPeakCounter | ✓ | ✓ | ✓ | ✓ (exceeds spec) |
| NanofabToolkit | DentonDecoder | ✓ | ✓ | ✓ | ✓ (exceeds spec) |
| NanofabToolkit | PreciousMetalReader | ✓ | ✓ | ✓ | ✓ (exceeds spec) |

Master indexes: all five present (`presentation/UNanofabTools/README.md`, `documentation/UNanofabTools/README.md`, `known-issues/UNanofabTools/README.md`, `presentation/NanofabToolkit/README.md`, `documentation/NanofabToolkit/README.md`). Totals: 31 `.pptx` decks; no tool is missing any deliverable.

## Fact propagation

Each key fact from §2 of the prompt, with verdict and evidence.

- **Install path `/home/phelan/server/UNanofabTools/`** — **VERIFIED.** Zero stale `~/UNanofabTools/` hits (audit §2). The `/server/` path is used consistently in `documentation/UNanofabTools/serveraccess/README.md:132`, `:162`, `:297`, in `documentation/UNanofabTools/liveserver/README.md:261` and `:402-404`, and is the live value in `snapshots/nfhistory_survey_phelan_2026-06-01.txt:389-393`. The §17 snapshot row (`liveserver/README.md:498`) explicitly logs the discovery: *"**Discovered install path**: `/home/phelan/server/UNanofabTools/`, not the previously assumed home-level path."*

- **`HSCDownloader.py` co-located (no separate `~/HSCDownloader/`)** — **VERIFIED.** Zero stale `~/HSCDownloader` hits. Stated explicitly: `serveraccess/README.md:133` *"same install — `HSCDownloader.py` lives next to `run.py`"* and `liveserver/README.md:402` *"There is no separate HSCDownloader install directory."*

- **Chem PostgreSQL is local on the VM (`127.0.0.1:5432`, `postgresql@17-main`)** — **VERIFIED.** Zero stale "external" hits. Affirmed in the developer architecture (`flaskserver/01-architecture.md:16`, `:58-65`, `:75`, `:202`), the layman overview (`presentation/.../flaskserver/01-Server-Overview.md:60`: *"that PostgreSQL instance runs on the **same machine** … so 'different database engine' doesn't mean 'different computer'"*), and the live inventory (`liveserver/README.md:25`, §10 `:383-394`). Confirmed bound to `127.0.0.1:5432` in `snapshots/nfhistory_survey_phelan_2026-06-01.txt:102`.

- **Backups are IT-handled off-box** — **VERIFIED.** Zero stale "no backups" hits. `liveserver/README.md:439` *"On-box: none. Off-box: handled by university IT,"* with the catastrophic-loss scenario explicitly marked mitigated (`:448`) and finding #1 recast to Low (`:461`; `known-issues/.../liveserver.md:11`).

- **Nanofab has `sudo` as `phelan`, not root, can't `useradd`** — **VERIFIED.** All 16 "create UNIX users" hits are correctly framed as structural/IT-ticket, never as a Nanofab to-do (audit §2 review). Anchored in `serveraccess/README.md:204`, `:265`, §7 `:309-310`, and `liveserver/README.md:18`, `:133-136`.

- **Root SSH = IT's path (`root@iceolate.eng.utah.edu`, `155.98.110.9`)** — **VERIFIED.** Zero hits treating root-SSH tightening as a Nanofab fix. `liveserver/README.md:336` and finding #4 (`:338`) route the `chmod 600 /root/.ssh/authorized_keys` request to *"open a ticket with IT,"* never as a Nanofab action; `serveraccess/README.md:315` says *"Do not touch … without coordinating with IT."* IT ingress IP matches the key comment (`liveserver/README.md:345`, finding #18 `:37`).

- **`nfhistory` at `155.98.11.8`, Debian 13 (trixie), kernel 6.12** — **VERIFIED.** `liveserver/README.md:49-50`, `:73` match `snapshots/nfhistory_survey_phelan_2026-06-01.txt` and the access doc's IP (`serveraccess/README.md:18`, `:29`).

- **TLS = Let's Encrypt, auto-renewed by `certbot.timer`, 90-day** — **VERIFIED.** `liveserver/README.md:113-146` (issuer `E7`, `notAfter Jun 23 2026`, `certbot.timer` + `/etc/cron.d/certbot` no-op); cross-referenced from `flaskserver/09-deployment-and-operations.md:39`.

- **Flask app + HSCDownloader run in tmux (`flaskserver`, `downloader`), NOT systemd** — **VERIFIED, and correctly flagged as the top reliability gap.** `liveserver/README.md:228` (§6.2: a grep for service units *"returned **no matches**"*), §6.5 `:255-272`, finding #2. Crucially, the deployment runbook does **not** contradict this: `flaskserver/09-deployment-and-operations.md:24` carries a live-state note — *"the production box has not yet been migrated … Treat the gunicorn/systemd material below as the recommended migration target, not a description of the current live service."*

## Contradictions found

No High- or Medium-severity contradictions. The items below are all Low; each is internally explainable but would briefly confuse a reader who lands on one side first.

1. **`wtmpdb` start date differs between §1 and §9.2 of the live-server doc, and finding #16 reads as contradicting §1.**
   - `documentation/UNanofabTools/liveserver/README.md:54` (§1) says *"`wtmpdb begins Wed Jan 7 13:59:11 2026`"*; `:347` (§9.2) says *"`wtmpdb begins Fri May 8 13:15:36 2026`"*; finding #16 (`:35`) says *"`wtmpdb` history starts only in May 2026."*
   - Both dates are individually faithful to the root snapshot — the reboot listing begins Jan 7 (`snapshots/nfhistory_survey_root_2026-05-29.txt:43`) and the login listing begins May 8 (`:232`) — but the doc never states that one figure is reboot history and the other is login history, so #16's "starts only in May" appears to contradict §1's January date.
   - **Severity:** Low. **Suggested fix:** in §1 and #16, label the scope explicitly, e.g. "reboot history in `wtmpdb` begins Jan 7 2026; login history begins May 8 2026."

2. **The §6.5 downloader PID table mixes its tmux-pane and `ps` sources, and leaves the downloader's PID drift unexplained.**
   - `liveserver/README.md:262` lists the `downloader` session as *"pane 1 → `vim HSCDownloader.py` (pid 71953); pane 2 → `python3` … (pid 48188)."* But the snapshot's tmux-pane listing shows the vim pane at **48177** and python3 at **48188** (`snapshots/nfhistory_survey_phelan_2026-06-01.txt:389-390`), while `ps` shows vim at **71953** and python3 at **323636** (`:396-397`). So the table reports vim at its *ps* PID (71953) but python3 at its *pane* PID (48188).
   - The narrative at `:272` explains the analogous Flask drift (pane 319076 vs listener 2665755) but says nothing about the downloader's 48188↔323636 drift.
   - **Severity:** Low (the section is already flagged incomplete pending a re-run — finding #17). **Suggested fix:** populate the table from one source consistently (the tmux pane PIDs: vim 48177, python3 48188) and add a one-line note that the downloader shows the same pane-vs-listener PID drift as `flaskserver`.

3. **`START-HERE.md` calls the legacy-server punch list a single "retire it" entry; the file has an overarching note plus 10 detailed findings.**
   - `START-HERE.md:294`: *"Punch list: … `hscdisplayerserver.md` — **only entry: retire it**."* In fact `known-issues/UNanofabTools/hscdisplayerserver.md:5` is an *overarching* "migrate and retire" item, followed by 10 secondary findings (`### 1`–`### 10`, e.g. *"`addUser` defined twice,"* *"Duo keys imported from a module, not env"*).
   - **Severity:** Low (the directive — retire it — is right; "only entry" undercounts). **Suggested fix:** reword to "headline item: retire it; plus 10 secondary tech-debt notes."

## Broken or missing references

- **No missing files.** Every relative link target in `START-HERE.md` resolves on the delivered (case-insensitive) volume; the audit's link checker reports zero broken internal Markdown links, which I reproduced.
- **One case-mismatched filename (latent broken link on a case-sensitive copy).** `START-HERE.md:82` links to `presentation/UNanofabTools/flaskserver/slides/02-How-it-Starts.pptx`, but the file is `02-How-It-Starts.pptx` (capital *It*). This resolves on the author's macOS volume (and is why both the mechanical audit and a naïve existence check pass) but will 404 if the tree is copied to most Linux filesystems or a case-sensitive APFS volume. **Severity:** Low. **Fix:** change the link text and target to `02-How-It-Starts.pptx`.
- **Advertised slide counts are accurate.** `START-HERE.md:249` "Server-Access.pptx (17 slides)" and `:255` "Live-Server.pptx (13 slides)" both match the decks exactly; the flaskserver "16 decks" claim (`:243`) matches (`00`–`15`).
- **Minor wording overcount.** `START-HERE.md:242` says flaskserver has "16 layman section docs" in the folder; there are 15 numbered section docs (`01`–`15`) plus the index `README.md`. Cosmetic.

## Source code vs documentation

All four §4-Task-5 spot-checks pass, with no drift found.

- **Env-var schema (`config/config.py` ↔ `03-configuration-reference.md`)** — **matches.** The audit confirms every `config.py` env var appears in the docs. The chem block matches name-for-name: `CHEM_PGHOST`, `CHEM_PGPORT`, `CHEM_POSTGRES_DB`, `CHEM_POSTGRES_USER`, `CHEM_POSTGRES_PASSWORD` are present in both `UNanofabTools/config/config.py:39-43` and `documentation/UNanofabTools/flaskserver/03-configuration-reference.md:71-75` (and again at `:184-188`).
- **HTTP routes (`05-http-api-reference.md` ↔ `app/blueprints/`)** — **matches, and the count is exact.** `05-http-api-reference.md:316` claims *"79 registered live routes: auth 4, tasks 6, admin 4, machines 27, api 12, chem 21, particle-demo 2, inline 3,"* and correctly notes `chem_inventory_remote.py` *"is not imported or registered, so it is excluded."* Source confirms: blueprint decorators are auth 4, tasks 6, admin 4, machines 27, api 12, particle-demo 2, and chem **21** uncommented (`chem_inventory.py` has 22 `@chem_bp.route` lines but one is the commented-out `/api/container_lookup` at line 406), plus the 3 inline routes registered in `app/__init__.py` — totaling 79. The doc correctly excluded both the unregistered duplicate blueprint and the commented decorator.
- **Chem env-var names** — covered above; exact match.
- **Canonical content in NanofabToolkit** — **accurate.** `NanofabToolkit/PicoHelperTools/` (8 `.py`/`.md` files) and `NanofabToolkit/ParticleSensor/` (4 files) are substantive, not stub pointers (audit §5c). The "older copy lives in UNanofabTools" framing in `START-HERE.md:285-288` and `flaskserver/01-architecture.md:203` is consistent.
- **Bonus check — the "chem write routes are unauthenticated" security finding is true.** The chem blueprint's write routes (`/add`, `/remove`, `/move`, `/edit-container`, `/barcodes/mark-printed`, …) in `UNanofabTools/app/blueprints/chem_inventory.py` carry no `@login_required`/`@admin_required` decorator, matching the claim in `flaskserver/01-architecture.md:82` (*"device and chem routes are not [gated]"*) and the known-issues punch list. The honesty of that finding is corroborated by source.

## Stylistic quality

**Layman voice.** The top-level layman READMEs are genuinely written for non-coders. `presentation/UNanofabTools/flaskserver/01-Server-Overview.md` opens by defining *server/client/request/response* in one sentence each (`:5-15`), carries a vocabulary cheat-sheet (`:67-84`), and explains the chem-Postgres locality with a plain-English gloss rather than jargon (`:60`). One nuance worth flagging honestly: the flaskserver *section* docs (`02`–`15`) deliberately quote real Python ("Code is shown exactly as it appears in the repository," `presentation/.../flaskserver/README.md:33`), so they read as a semi-technical walkthrough rather than pure layman prose — which is consistent with how `START-HERE.md` routes audiences (Path B for non-technical stakeholders uses only the top-level layman READMEs and slides, not these section docs). It's a defensible design, not a defect, but a reader expecting "no code" everywhere should know the flaskserver track is the exception.

**Developer-doc concreteness.** The developer references are unusually actionable. They cite real paths (`/etc/nginx/sites-enabled/untools`), real env-var names, real commands, real live PIDs and uptimes, and real cross-references with section anchors (e.g. `01-architecture.md:202` pointing to `liveserver/README.md §10`). The architecture doc goes as far as documenting code smells precisely — `task_service.py` using raw `sqlite3`, the empty placeholder model files, the inert `chem_inventory_remote.py` (`01-architecture.md:166-173`) — which is exactly the kind of detail a successor needs.

**Known-issues honesty.** The punch lists are candid and well-structured: severity is tagged at each entry, fixes are proposed, and every item is sorted into Nanofab-actionable vs IT-ticket. Security problems are stated plainly rather than buried — hard-coded WiFi passwords, a CORES Bearer token in source, Duo keys imported from a module, and unauthenticated chem write routes are all surfaced (`known-issues/UNanofabTools/README.md:28-32`). The liveserver list explicitly recasts findings as IT scope is clarified (e.g. backups dropped from High to Low, `:11`), which reads as honest rather than self-justifying.

**Deck density.** Slide counts are slide-appropriate (8–17 per deck; the heaviest, `09-Chemical-Inventory.pptx`, at 16, and `01-Server-Overview.pptx` at 14, match their topic weight). I verified counts mechanically but did not open every deck's body/notes text, so per-slide bullet-vs-paragraph density is asserted only at the spot-check level; the counts themselves give no cause for concern.

## Numbered findings (severity-tagged)

- **#1. `wtmpdb` start date is stated two ways without reconciliation** — Low — ✅ RESOLVED
  - Where: `documentation/UNanofabTools/liveserver/README.md:54` vs `:347` and finding #16 `:35`.
  - Evidence: §1 "begins Wed Jan 7 … 2026"; §9.2 "begins Fri May 8 … 2026"; #16 "starts only in May 2026." Each traces to a different listing in `snapshots/nfhistory_survey_root_2026-05-29.txt` (`:43` reboots, `:232` logins).
  - Suggested fix: label the two scopes (reboot vs login history) so #16 no longer appears to contradict §1.

- **#2. §6.5 downloader PID table mixes pane and `ps` PIDs; downloader drift unexplained** — Low — ✅ RESOLVED
  - Where: `documentation/UNanofabTools/liveserver/README.md:262`, narrative `:272`.
  - Evidence: vim listed at PID 71953 (its `ps` PID) though the snapshot's tmux pane shows 48177; python3 listed at pane PID 48188 though `ps` shows 323636 (`snapshots/nfhistory_survey_phelan_2026-06-01.txt:389-397`).
  - Suggested fix: source the table from tmux-pane PIDs consistently and note the downloader shows the same drift as `flaskserver`.

- **#3. `START-HERE.md` mischaracterizes the legacy-server punch list** — Low — ✅ RESOLVED
  - Where: `START-HERE.md:294`.
  - Evidence: "only entry: retire it" vs `known-issues/UNanofabTools/hscdisplayerserver.md:5` (overarching retire item) + 10 secondary findings (`### 1`–`### 10`).
  - Suggested fix: "headline item: retire it; plus 10 secondary tech-debt notes."

- **#4. Case-mismatched deck link in `START-HERE.md`** — Low — ✅ RESOLVED
  - Where: `START-HERE.md:82`.
  - Evidence: links `…/slides/02-How-it-Starts.pptx`; actual file is `02-How-It-Starts.pptx`. Resolves on case-insensitive macOS; breaks on a case-sensitive copy (also why the mechanical link audit passes).
  - Suggested fix: correct the case to `02-How-It-Starts.pptx`.

- **#5. Typo: "PrecioiusMetalReader"** — Low — ✅ RESOLVED
  - Where: `presentation/UNanofabTools/flaskserver/01-Server-Overview.md:13`.
  - Evidence: "The PrecioiusMetalReader desktop app fetches the latest reagent prices."
  - Suggested fix: "PreciousMetalReader."

- **#6. Stale illustrative `tmux ls` output in the access doc** — Low — ✅ RESOLVED
  - Where: `documentation/UNanofabTools/serveraccess/README.md:149`.
  - Evidence: the §4.2 example shows `flaskserver: 1 windows`, but the live session has 2 windows (`snapshots/nfhistory_survey_phelan_2026-06-01.txt:385`; `liveserver/README.md:261`). It is explicitly an "Expected output" sample with placeholder timestamps, so it does not misstate live state — purely cosmetic.
  - Suggested fix: change the sample to "2 windows" (or annotate that window count is illustrative).

- **#7. Minor wording overcount of flaskserver layman docs** — Low — ✅ RESOLVED
  - Where: `START-HERE.md:242`.
  - Evidence: "16 layman section docs" vs 15 numbered docs + the `README.md` index.
  - Suggested fix: "15 layman section docs (plus this index)."

## Overall recommendation

_Updated 2026-06-02 — all seven findings plus the filetransfer item have been fixed in the docs, and `Flask-Migrate==4.1.0` was added to `requirements.txt`. The only item left open is the optional, source-side filetransfer remote-path bug. Original recommendation below._

Ship it. This package is in materially better shape than most handoff documentation — coverage is complete, the source-of-truth facts are propagated without a single stale reference, and the developer/known-issues docs are concrete and honest. None of the seven findings is blocking; all are Low-severity polish. Before final distribution, the author should make two ~five-minute passes: (1) fix the `START-HERE.md` items (#3 the "only entry" wording, #4 the `02-How-It-Starts.pptx` case, #7 the doc count) since the orchestrator is the first thing a successor reads and should be flawless; and (2) clean up the live-server doc's two value wrinkles (#1 `wtmpdb` scope labels, #2 the §6.5 PID table) — both are already destined for revision when the patched survey script is re-run as `phelan` (per finding #17), so they can be folded into that same edit. The typo (#5) and the illustrative `tmux ls` sample (#6) are trivial. No re-architecture, no factual corrections to the technical content, and no further source-vs-docs reconciliation are needed.
