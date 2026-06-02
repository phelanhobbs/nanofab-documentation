# START HERE — UNanofabTools & NanofabToolkit Handoff

**You're the person reading this so I can hand it off.** This file is the orchestrator over everything in this folder. It says, *for your situation*, which materials to open in which order so you don't waste time wandering.

This documentation bundle lives in three parallel trees. For any development work or Path D audit, keep the two source repos next to this folder in the same parent directory:

| Folder | What it is |
|--------|-----------|
| `presentation/` | Plain-English READMEs + slide decks (`.pptx`) for every tool. For people who don't need to read code. |
| `documentation/` | Formal developer reference for every tool. For the next maintainer. |
| `known-issues/` | The to-do list — bugs, tech debt, security concerns, recommended fixes. Kept out of the docs so the docs stay clean. |
| `../UNanofabTools/` | The actual Flask web app's source code. Not stored in this GitHub documentation bundle; clone or locate it adjacent to this folder before auditing code. |
| `../NanofabToolkit/` | Sibling repo with the desktop tools and Pico firmware that talk to the Flask app. Not stored in this GitHub documentation bundle; clone or locate it adjacent to this folder before auditing code. |

Both repos have a master `README.md` in each tree (`presentation/UNanofabTools/README.md`, `documentation/NanofabToolkit/README.md`, etc.) listing every tool with one-line descriptions. Once you know which tool you care about, the per-tool folder always has the same shape:

```
presentation/<repo>/<tool>/
  ├── README.md            ← layman guide
  └── slides/<Tool>.pptx   ← presentable deck with speaker notes
documentation/<repo>/<tool>/
  └── README.md (or numbered docs/)  ← developer reference
known-issues/<repo>/<tool>.md          ← punch list for that tool
```

---

## Pick your path

| If you are… | Go to | Time |
|------|-------|------|
| **A live in-person handoff session(s)** between me (Faith) and the next maintainer | [Path A](#path-a-live-multi-session-handoff) | 4–5 sessions of ~60–90 min each |
| **Presenting to lab management or non-technical stakeholders** (advisor, lab director, the rest of the team) | [Path B](#path-b-lab-management--non-technical-stakeholders) | 45 min, one session |
| **A solo successor** walking in after I've left, reading at your own pace | [Path C](#path-c-solo-successor-self-paced) | Multi-week, self-paced |
| **The long-term maintainer** who needs to own, audit, extend, or rescue the system without contacting me | [Path D](#path-d-long-term-maintainer-deep-dive) | 1-2 focused weeks, repeatable as an audit |

Each path orders the materials so they tell the story in the right sequence. If you're not sure, **Path A is the canonical full handoff** — if you're going to do this in person, do it that way. If there is no person left to ask and the system has to be maintained independently, use **Path D**.

---

# Path A: Live multi-session handoff

Five sessions, ~60–90 minutes each, in this order. Each session has a "show this deck" deliverable and a "read this in the gap before next session" follow-up. Estimated total: ~7 hours of presenter time + ~6 hours of follow-up reading.

> **Critical framing to set in Session 1 and keep returning to:** `nfhistory` is jointly operated. University IT owns the VM, `root`, the backup pipeline, base patching, and the SSH key in `/root/.ssh/authorized_keys`. The Nanofab team owns the Flask app, the HSCDownloader, the local PostgreSQL chem DB, and everything under `/home/phelan/`. The Nanofab admin has `sudo` as `phelan` but **not** `root`, and **cannot** create UNIX users. Several known-issues items that look like Nanofab to-dos are actually IT tickets — they're tagged that way throughout.

## Session 1 — Orient: what this thing is and where it lives (~75 min)

The goal: by the end of this session, the next maintainer can describe in one paragraph what the cleanroom system does, what `nfhistory` is, and where the IT/Nanofab boundary runs.

| # | Show | Why |
|---|------|-----|
| 1 | [`presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx`](presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx) | The "what does this whole thing do" deck. Sets the scope — auth, tasks, machine pages, sensor API, chem inventory — without diving into code. |
| 2 | [`presentation/UNanofabTools/liveserver/slides/Live-Server.pptx`](presentation/UNanofabTools/liveserver/slides/Live-Server.pptx) | What's actually on `nfhistory` today: OS, services, certs, the IT/Nanofab boundary, the punch list. This is where the boundary frame gets introduced. |
| 3 | (Optional, time-permitting) Browser demo | Pull up `https://nfhistory.nanofab.utah.edu` and click through a couple of pages — the machine portal, the chem inventory. Five minutes of "here's what users see." |

**Follow-up reading before Session 2:**
- [`presentation/UNanofabTools/flaskserver/README.md`](presentation/UNanofabTools/flaskserver/README.md) — the layman overview of the whole Flask app
- [`presentation/UNanofabTools/liveserver/README.md`](presentation/UNanofabTools/liveserver/README.md) — the layman version of the live-server tour

## Session 2 — Access: get in, look around, leave without breaking anything (~90 min)

The goal: the maintainer leaves this session having SSH'd in themselves, attached to both tmux sessions, detached cleanly, and run the read-only survey script.

| # | Show | Why |
|---|------|-----|
| 1 | [`presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx`](presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx) | The full access procedure — two-hop SSH through CADE, the `User phelan` constraint, the tmux sessions, **the `Ctrl-b d` detach ritual**, and the "what goes through IT instead" slide. |
| 2 | Live demo: the two-hop login | You: open a terminal. Walk through the CADE hop, then `ssh nfhistory`, then `tmux ls`. Show both sessions are alive. Attach to `flaskserver`, scroll, **detach with `Ctrl-b d`** (do this twice so they see it). |
| 3 | Live demo: run the survey | Run `bash ~/survey_nfhistory.sh \| tee /tmp/nfhistory_survey_$(date +%F).txt`. Walk through the output sections. Show them where the snapshot lands in `documentation/UNanofabTools/liveserver/snapshots/`. |
| 4 | Recovery walkthrough (don't actually break it) | Talk through what happens if a session dies — `tmux new -s flaskserver`, `cd`, activate venv, `python run.py`, detach. Have them recite it back. |

**Follow-up reading before Session 3:**
- [`documentation/UNanofabTools/serveraccess/README.md`](documentation/UNanofabTools/serveraccess/README.md) — the formal access reference with full admin procedures
- [`documentation/UNanofabTools/liveserver/README.md`](documentation/UNanofabTools/liveserver/README.md) — the populated live-server inventory
- [`known-issues/UNanofabTools/serveraccess.md`](known-issues/UNanofabTools/serveraccess.md) and [`known-issues/UNanofabTools/liveserver.md`](known-issues/UNanofabTools/liveserver.md) — the punch lists for the server itself

## Session 3 — The Flask app, deep enough (~90 min)

The goal: the maintainer understands how the Flask app is laid out, how a request becomes a response, and where to look for the auth, tasks, chem inventory, and IoT pieces.

| # | Show | Why |
|---|------|-----|
| 1 | [`02-How-it-Starts.pptx`](presentation/UNanofabTools/flaskserver/slides/02-How-it-Starts.pptx) | Application factory, blueprints, the entrypoint. Skip if they already know Flask deeply. |
| 2 | [`03-Configuration.pptx`](presentation/UNanofabTools/flaskserver/slides/03-Configuration.pptx) | The `.env` keys, the config classes, what changes between dev and prod. |
| 3 | [`04-Authentication-and-Login.pptx`](presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx) | Auth, sessions, Duo. The most security-sensitive part of the app. |
| 4 | [`08-IoT-API-Endpoints.pptx`](presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx) | The unauthenticated device-data routes — where the Pico sensors POST to. The other half of the Nanofab story. |
| 5 | [`09-Chemical-Inventory.pptx`](presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx) | The chem module. Note the **chem PostgreSQL is local on the same VM**; older remote-DB wording has been corrected throughout. |
| 6 | [`13-Request-Lifecycle-Walkthrough.pptx`](presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx) | One slide deck that traces a request end-to-end. Ties it all together. |

**Follow-up reading before Session 4** (this is the heaviest reading week — give 2 weeks if needed):
- [`documentation/UNanofabTools/flaskserver/01-architecture.md`](documentation/UNanofabTools/flaskserver/01-architecture.md) through `10-development-guide.md` — the full formal reference
- [`known-issues/UNanofabTools/flaskserver.md`](known-issues/UNanofabTools/flaskserver.md) — the Flask app's punch list

## Session 4 — The ecosystem (data in, data out) (~75 min)

The goal: the maintainer can name every system that talks to `nfhistory`, where the source code lives, and which tools are old copies vs canonical.

| # | Show | Why |
|---|------|-----|
| 1 | [`HSC-Downloader.pptx`](presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx) | The CORES → HSCDATA ETL. The supply line for machine-run data. |
| 2 | [`File-Transfer-Scripts.pptx`](presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx) | The per-machine PowerShell scripts on each tool's control PC. Note the personal-account dependency and the two-option fix (IT service account vs. purpose-bound shared-account SSH key). |
| 3 | [`PicoHelperTools.pptx`](presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx) | The Raspberry Pi Pico firmware (NanofabToolkit). The producers of the sensor data POSTs. Canonical version lives in NanofabToolkit. |
| 4 | [`ParticleSensor.pptx`](presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx) | The desktop viewer for particle data. Canonical version is in NanofabToolkit; an older copy lives in UNanofabTools. |
| 5 | [`ParalyneReader.pptx`](presentation/NanofabToolkit/ParalyneReader/slides/ParalyneReader.pptx) | The desktop tool for Parylene analog log review. |
| 6 | [`DAT-Tools.pptx`](presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx) | DATfixer + DATgrapher for Denton 635 logs. |
| 7 | [`ALDPeakCounter.pptx`](presentation/NanofabToolkit/ALDPeakCounter/slides/ALDPeakCounter.pptx), [`DentonDecoder.pptx`](presentation/NanofabToolkit/DentonDecoder/slides/DentonDecoder.pptx), [`PreciousMetalReader.pptx`](presentation/NanofabToolkit/PreciousMetalReader/slides/PreciousMetalReader.pptx) | Smaller NanofabToolkit tools. Show titles + one-line each unless they want depth. |
| 8 | [`Utilities.pptx`](presentation/UNanofabTools/utilities/slides/Utilities.pptx) | The miscellaneous helpers. |

**Critical pointer to make explicit in this session:**

> NanofabToolkit holds the **canonical** versions of PicoHelperTools and ParticleSensor. UNanofabTools holds older copies for historical reference. If you need to update the firmware or the desktop viewer, work in NanofabToolkit. Every cross-reference in the docs already points there.

**Follow-up reading before Session 5:**
- Per-tool layman READMEs for the ones the maintainer is most likely to touch
- Each tool's `documentation/<repo>/<tool>/README.md` if depth is needed

## Session 5 — Maintenance and what's broken (~60 min)

The goal: the maintainer leaves with a clear punch list, knows which items they own and which are IT's, and understands the legacy server's status.

| # | Show | Why |
|---|------|-----|
| 1 | Walk [`known-issues/UNanofabTools/README.md`](known-issues/UNanofabTools/README.md) | The master index of every punch list, with the cross-cutting themes (secrets in source, chem schema drift, personal-account dependencies, the IT/Nanofab boundary). |
| 2 | Read together: [`known-issues/UNanofabTools/liveserver.md`](known-issues/UNanofabTools/liveserver.md) | The 22 findings, Nanofab-actionable vs IT-ticket split, priority order. |
| 3 | Read together: [`known-issues/UNanofabTools/serveraccess.md`](known-issues/UNanofabTools/serveraccess.md) | The access pattern's tech debt. |
| 4 | Read together: [`known-issues/UNanofabTools/flaskserver.md`](known-issues/UNanofabTools/flaskserver.md) | The Flask app's tech debt. The biggest items: chem schema drift, chem write routes unauthenticated. |
| 5 | Spot-check the other known-issues files | `filetransfer.md`, `hscdownloader.md`, `picofirmware.md`, `dattools.md`, `utilities.md`, `particlepctools.md`, `hscdisplayerserver.md`. Five minutes each, just so they know what's in there. |
| 6 | [`HSC-Displayer-Server-Legacy.pptx`](presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx) (briefly) | The legacy monolithic server. **Deprecated.** Show it so they recognize it if they ever stumble across it; the directive is "leave it alone, ship to the Flask app." |

**End-of-handoff deliverables to the new maintainer:**
- Their own CADE account + nfhistory SSH key issued per `documentation/UNanofabTools/serveraccess/README.md` §5.1
- Walk-through-complete tick for each of the five sessions
- A clean copy of this START-HERE.md and the entire `presentation/` + `documentation/` + `known-issues/` trees

---

# Path B: Lab management / non-technical stakeholders

Single 45-minute presentation. Audience: advisor, lab director, the rest of the team — people who care about *what was built* and *what state it's in*, not how the Python is organized. **Use only layman READMEs and the layman slides. Don't open the developer docs.**

| Minutes | Show | Talking point |
|--------|------|--------------|
| 0–5 | Title slide of [`01-Server-Overview.pptx`](presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx) | "Here's what this system does — a website that brings together auth, machine data, chemical inventory, and sensor monitoring. One small server runs all of it." |
| 5–15 | First half of `01-Server-Overview.pptx` + browser demo (if available) | Show the actual website. Click through the machine page, chem inventory, particle map. "This is what users see; everything else is plumbing." |
| 15–25 | [`presentation/UNanofabTools/liveserver/slides/Live-Server.pptx`](presentation/UNanofabTools/liveserver/slides/Live-Server.pptx), select slides | The 30-second stats portrait. The listening-ports table. The TLS cert auto-renewal story. **Skip** the deep dives; this is about confidence that the boring infrastructure is solid. |
| 25–35 | Stay on Live-Server deck — the "Auto-managed vs. not" two-column + the IT-handled-backups slide | "Lots of things happen unattended and well — cert renewal, log rotation, the off-box VM backup IT runs. Here's what's not happening yet, that we'd like to fix." |
| 35–40 | The "Top recommendations" slide | Honest framing of the punch list, with the boundary made explicit: "These four items the Nanofab team can ship. These three need IT cooperation." |
| 40–45 | Q&A | Plus: where to find these materials again if anyone wants to drill in. |

**Materials to leave with this audience:**
- The 45-min deck (you've shown it)
- A PDF copy of `presentation/UNanofabTools/liveserver/README.md` (the layman live-server tour — quick read)
- A pointer to `START-HERE.md` (this file) for anyone who wants the full picture later

**Materials NOT to bring out for this audience:**
- The developer docs
- Any individual tool's deep-dive deck
- The detailed known-issues files (the recommendations slide is enough)

---

# Path C: Solo successor (self-paced)

You arrived after I left. There's no presenter. Open files in this order; estimated time per stop is included so you can pace yourself. Total: ~10–15 hours of focused reading, spread however you want.

## Week 1 — Orient (~3 hours)

1. **This file (`START-HERE.md`).** You're here. Read the rest of this section before continuing.
2. [`presentation/UNanofabTools/README.md`](presentation/UNanofabTools/README.md) — the master index of every UNanofabTools tool with one-line descriptions. (5 min)
3. [`presentation/UNanofabTools/flaskserver/README.md`](presentation/UNanofabTools/flaskserver/README.md) — the layman overview of the whole Flask app. (30 min)
4. [`presentation/UNanofabTools/liveserver/README.md`](presentation/UNanofabTools/liveserver/README.md) — what's actually running on `nfhistory`, and **the IT/Nanofab boundary**. Read this twice; the boundary frame matters for everything downstream. (45 min)
5. [`presentation/UNanofabTools/serveraccess/README.md`](presentation/UNanofabTools/serveraccess/README.md) — the layman access guide. (30 min)
6. [`presentation/NanofabToolkit/README.md`](presentation/NanofabToolkit/README.md) — the NanofabToolkit index. (5 min)
7. Open [`presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx`](presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx) and skim it with speaker notes visible. (~30 min)

By end of Week 1 you should be able to describe: what `nfhistory` is, what runs on it, how you'd log in, who owns root, where the data lives.

## Week 2 — Get in and look (~3 hours, includes hands-on)

8. [`documentation/UNanofabTools/serveraccess/README.md`](documentation/UNanofabTools/serveraccess/README.md) — the formal access reference. Pay attention to §5 (admin procedure) and §7 (operational invariants). (45 min)
9. **Hands-on:** follow §3.1 to set up your own access. Get a CADE account, get an nfhistory key issued, place the `~/.ssh/config` block, hop in. Attach to a tmux session, **detach with `Ctrl-b d`**, hop out. (~60 min including waits)
10. [`documentation/UNanofabTools/liveserver/README.md`](documentation/UNanofabTools/liveserver/README.md) — the populated live-server inventory. Walk through every section. (45 min)
11. **Hands-on:** run the survey script as `phelan` and check the result against §11 (the "things root couldn't see") to fill in the gaps in the existing snapshot. Save to `documentation/UNanofabTools/liveserver/snapshots/`. (30 min)

By end of Week 2 you've physically touched the server, you know how to attach and detach safely, and you have a current snapshot of what's there.

## Week 3 — The Flask app (~4 hours)

Read in order. The flaskserver docs are numbered for exactly this purpose.

12. [`documentation/UNanofabTools/flaskserver/01-architecture.md`](documentation/UNanofabTools/flaskserver/01-architecture.md) (30 min)
13. [`documentation/UNanofabTools/flaskserver/02-getting-started.md`](documentation/UNanofabTools/flaskserver/02-getting-started.md) — and follow it if you want a local dev environment (1–2 hours)
14. [`documentation/UNanofabTools/flaskserver/03-configuration-reference.md`](documentation/UNanofabTools/flaskserver/03-configuration-reference.md) (20 min)
15. [`documentation/UNanofabTools/flaskserver/04-database-schema.md`](documentation/UNanofabTools/flaskserver/04-database-schema.md) (45 min) — **note: chem PostgreSQL is local on this same VM**
16. [`documentation/UNanofabTools/flaskserver/05-http-api-reference.md`](documentation/UNanofabTools/flaskserver/05-http-api-reference.md) (30 min)
17. [`documentation/UNanofabTools/flaskserver/06-service-layer-reference.md`](documentation/UNanofabTools/flaskserver/06-service-layer-reference.md) (30 min)
18. [`documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md`](documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md) (30 min)
19. [`documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md`](documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md) (30 min)
20. [`documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`](documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md) (30 min)
21. [`documentation/UNanofabTools/flaskserver/10-development-guide.md`](documentation/UNanofabTools/flaskserver/10-development-guide.md) (20 min)

## Week 4 — The wider ecosystem (~3 hours)

For each tool, the developer README is the deep read; the layman one is a cheaper alternative if you only need the gist.

22. [`documentation/UNanofabTools/hscdownloader/README.md`](documentation/UNanofabTools/hscdownloader/README.md) (20 min)
23. [`documentation/UNanofabTools/filetransfer/README.md`](documentation/UNanofabTools/filetransfer/README.md) (20 min)
24. [`documentation/NanofabToolkit/PicoHelperTools/README.md`](documentation/NanofabToolkit/PicoHelperTools/README.md) (30 min) — the canonical firmware
25. [`documentation/NanofabToolkit/ParticleSensor/README.md`](documentation/NanofabToolkit/ParticleSensor/README.md) (20 min)
26. [`documentation/NanofabToolkit/ParalyneReader/README.md`](documentation/NanofabToolkit/ParalyneReader/README.md) (15 min)
27. [`documentation/UNanofabTools/dattools/README.md`](documentation/UNanofabTools/dattools/README.md) (15 min)
28. [`documentation/UNanofabTools/utilities/README.md`](documentation/UNanofabTools/utilities/README.md) (15 min)
29. [`documentation/NanofabToolkit/ALDPeakCounter/README.md`](documentation/NanofabToolkit/ALDPeakCounter/README.md), [`DentonDecoder/README.md`](documentation/NanofabToolkit/DentonDecoder/README.md), [`PreciousMetalReader/README.md`](documentation/NanofabToolkit/PreciousMetalReader/README.md) (10 min each)
30. [`documentation/UNanofabTools/hscdisplayerserver/README.md`](documentation/UNanofabTools/hscdisplayerserver/README.md) (15 min) — **deprecated**, kept for historical reference only
31. [`documentation/UNanofabTools/picofirmware/README.md`](documentation/UNanofabTools/picofirmware/README.md) and [`particlepctools/README.md`](documentation/UNanofabTools/particlepctools/README.md) (10 min each) — older copies, canonical lives in NanofabToolkit

## Week 5 — What needs work (~2 hours)

The punch list. Open these in this order; severity is right at the top of each file.

32. [`known-issues/UNanofabTools/README.md`](known-issues/UNanofabTools/README.md) — master index and cross-cutting themes (20 min)
33. [`known-issues/UNanofabTools/liveserver.md`](known-issues/UNanofabTools/liveserver.md) — the live-server findings, with Nanofab-actionable vs IT-ticket split (20 min)
34. [`known-issues/UNanofabTools/serveraccess.md`](known-issues/UNanofabTools/serveraccess.md) — access-pattern tech debt (15 min)
35. [`known-issues/UNanofabTools/flaskserver.md`](known-issues/UNanofabTools/flaskserver.md) — Flask app punch list (30 min)
36. The remaining per-tool issues files (`filetransfer.md`, `hscdownloader.md`, `picofirmware.md`, `dattools.md`, `utilities.md`, `particlepctools.md`, `hscdisplayerserver.md`) — five minutes each
37. [`known-issues/NanofabToolkit/`](known-issues/NanofabToolkit/) if it exists — any sibling-repo findings

## After Week 5

You're current. Re-run the live-server survey every quarter (or after any major change) and update `documentation/UNanofabTools/liveserver/README.md` §17 with the new snapshot. The script is at [`documentation/UNanofabTools/liveserver/survey_nfhistory.sh`](documentation/UNanofabTools/liveserver/survey_nfhistory.sh).

When you find a bug, update the relevant `known-issues/UNanofabTools/<tool>.md` file. When you fix something, remove it from there and mention it in the next snapshot.

---

# Path D: Long-term maintainer deep dive

Use Path D when the goal is not just onboarding, but independent ownership. This is the route for a future maintainer who must be able to answer "what is this, where is the truth, what is safe to change, what is broken, and what do I do next?" without contacting Faith.

The full playbook is here:

- [`PATH-D-DEEP-DIVE.md`](PATH-D-DEEP-DIVE.md)
- [`SUPER-IN-DEPTH-PRESENTER-GUIDE.md`](SUPER-IN-DEPTH-PRESENTER-GUIDE.md) — if Faith is presenting Path D live with slides on a screen

Path D deliberately goes beyond Path C. It is evidence-based, not just reading-based: clone or locate both source repos, compare the docs against the current code, refresh the live-server snapshot, rerun the mechanical audit, triage every known issue, and leave behind an updated decision trail for the next maintainer. If this happens live, use the presenter guide to drive the exhaustive slide walkthrough.

Expected outputs:

- A current live-server survey snapshot.
- An updated `known-issues/` tree with obsolete items removed and new findings added.
- A short written maintenance plan: next 7 days, next 30 days, next quarter.
- A list of IT tickets needed vs Nanofab-actionable fixes.
- A doc/code drift report for anything discovered during the audit.

Completion rule: Path D is done only when a maintainer can explain the system from source code, live state, and documentation, and can safely make or defer the next change without needing undocumented context.

---

# Quick reference: every deck, every doc, every issue file

Use this section to find anything by name.

## UNanofabTools

### `flaskserver` — the Flask web app (the main thing)
- Layman: [`presentation/UNanofabTools/flaskserver/README.md`](presentation/UNanofabTools/flaskserver/README.md) (and 16 layman section docs in the same folder)
- Slides (16 decks): [`presentation/UNanofabTools/flaskserver/slides/`](presentation/UNanofabTools/flaskserver/slides/)
- Developer reference (10 numbered docs): [`documentation/UNanofabTools/flaskserver/`](documentation/UNanofabTools/flaskserver/)
- Punch list: [`known-issues/UNanofabTools/flaskserver.md`](known-issues/UNanofabTools/flaskserver.md)

### `serveraccess` — how to log in
- Layman: [`presentation/UNanofabTools/serveraccess/README.md`](presentation/UNanofabTools/serveraccess/README.md)
- Slides: [`Server-Access.pptx`](presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx) (17 slides)
- Developer reference: [`documentation/UNanofabTools/serveraccess/README.md`](documentation/UNanofabTools/serveraccess/README.md)
- Punch list: [`known-issues/UNanofabTools/serveraccess.md`](known-issues/UNanofabTools/serveraccess.md)

### `liveserver` — what's actually running on `nfhistory`
- Layman: [`presentation/UNanofabTools/liveserver/README.md`](presentation/UNanofabTools/liveserver/README.md)
- Slides: [`Live-Server.pptx`](presentation/UNanofabTools/liveserver/slides/Live-Server.pptx) (13 slides)
- Developer reference (populated inventory): [`documentation/UNanofabTools/liveserver/README.md`](documentation/UNanofabTools/liveserver/README.md)
- Survey script: [`documentation/UNanofabTools/liveserver/survey_nfhistory.sh`](documentation/UNanofabTools/liveserver/survey_nfhistory.sh)
- Snapshots folder: [`documentation/UNanofabTools/liveserver/snapshots/`](documentation/UNanofabTools/liveserver/snapshots/)
- Punch list: [`known-issues/UNanofabTools/liveserver.md`](known-issues/UNanofabTools/liveserver.md)

### `hscdownloader` — the CORES → HSCDATA ETL
- Layman: [`presentation/UNanofabTools/hscdownloader/README.md`](presentation/UNanofabTools/hscdownloader/README.md)
- Slides: [`HSC-Downloader.pptx`](presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx)
- Developer reference: [`documentation/UNanofabTools/hscdownloader/README.md`](documentation/UNanofabTools/hscdownloader/README.md)
- Punch list: [`known-issues/UNanofabTools/hscdownloader.md`](known-issues/UNanofabTools/hscdownloader.md)

### `filetransfer` — the per-machine log uploaders
- Layman: [`presentation/UNanofabTools/filetransfer/README.md`](presentation/UNanofabTools/filetransfer/README.md)
- Slides: [`File-Transfer-Scripts.pptx`](presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx)
- Developer reference: [`documentation/UNanofabTools/filetransfer/README.md`](documentation/UNanofabTools/filetransfer/README.md)
- Punch list: [`known-issues/UNanofabTools/filetransfer.md`](known-issues/UNanofabTools/filetransfer.md)

### `dattools` — DATfixer + DATgrapher (Denton 635)
- Layman: [`presentation/UNanofabTools/dattools/README.md`](presentation/UNanofabTools/dattools/README.md)
- Slides: [`DAT-Tools.pptx`](presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx)
- Developer reference: [`documentation/UNanofabTools/dattools/README.md`](documentation/UNanofabTools/dattools/README.md)
- Punch list: [`known-issues/UNanofabTools/dattools.md`](known-issues/UNanofabTools/dattools.md)

### `utilities` — the miscellaneous helpers
- Layman: [`presentation/UNanofabTools/utilities/README.md`](presentation/UNanofabTools/utilities/README.md)
- Slides: [`Utilities.pptx`](presentation/UNanofabTools/utilities/slides/Utilities.pptx)
- Developer reference: [`documentation/UNanofabTools/utilities/README.md`](documentation/UNanofabTools/utilities/README.md)
- Punch list: [`known-issues/UNanofabTools/utilities.md`](known-issues/UNanofabTools/utilities.md)

### `picofirmware` (older copies) and `particlepctools` (older copy)
- Layman + developer: [`presentation/UNanofabTools/picofirmware/`](presentation/UNanofabTools/picofirmware/) and [`particlepctools/`](presentation/UNanofabTools/particlepctools/); same for `documentation/`
- **Canonical versions live in NanofabToolkit** — see below
- Punch lists: [`known-issues/UNanofabTools/picofirmware.md`](known-issues/UNanofabTools/picofirmware.md), [`particlepctools.md`](known-issues/UNanofabTools/particlepctools.md)

### `hscdisplayerserver` — the legacy server (deprecated)
- Layman: [`presentation/UNanofabTools/hscdisplayerserver/README.md`](presentation/UNanofabTools/hscdisplayerserver/README.md)
- Slides: [`HSC-Displayer-Server-Legacy.pptx`](presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx)
- Developer reference: [`documentation/UNanofabTools/hscdisplayerserver/README.md`](documentation/UNanofabTools/hscdisplayerserver/README.md) (+ `ROUTES.md`)
- Punch list: [`known-issues/UNanofabTools/hscdisplayerserver.md`](known-issues/UNanofabTools/hscdisplayerserver.md) — **only entry: retire it**

## NanofabToolkit

### `PicoHelperTools` (canonical) — Raspberry Pi Pico firmware
- Layman: [`presentation/NanofabToolkit/PicoHelperTools/README.md`](presentation/NanofabToolkit/PicoHelperTools/README.md)
- Slides: [`PicoHelperTools.pptx`](presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx)
- Developer reference: [`documentation/NanofabToolkit/PicoHelperTools/README.md`](documentation/NanofabToolkit/PicoHelperTools/README.md)

### `ParticleSensor` (canonical) — desktop particle viewer
- Layman: [`presentation/NanofabToolkit/ParticleSensor/README.md`](presentation/NanofabToolkit/ParticleSensor/README.md)
- Slides: [`ParticleSensor.pptx`](presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx)
- Developer reference: [`documentation/NanofabToolkit/ParticleSensor/README.md`](documentation/NanofabToolkit/ParticleSensor/README.md)

### `ParalyneReader` — desktop tool for Parylene analog logs
- Layman + slides + developer reference: under [`presentation/NanofabToolkit/ParalyneReader/`](presentation/NanofabToolkit/ParalyneReader/) and [`documentation/NanofabToolkit/ParalyneReader/`](documentation/NanofabToolkit/ParalyneReader/)

### `ALDPeakCounter`, `DentonDecoder`, `PreciousMetalReader`
- Each has its own folder under both `presentation/NanofabToolkit/` and `documentation/NanofabToolkit/`

## Cross-cutting / master indexes

- [`presentation/UNanofabTools/README.md`](presentation/UNanofabTools/README.md) — every UNanofabTools tool, one-line each
- [`documentation/UNanofabTools/README.md`](documentation/UNanofabTools/README.md) — same, for the developer side
- [`known-issues/UNanofabTools/README.md`](known-issues/UNanofabTools/README.md) — every punch list, with cross-cutting themes
- [`presentation/NanofabToolkit/README.md`](presentation/NanofabToolkit/README.md) — NanofabToolkit layman index
- [`documentation/NanofabToolkit/README.md`](documentation/NanofabToolkit/README.md) — NanofabToolkit developer index

---

## A note from me

I tried to make these materials honest. Where things are weird (the IT/Nanofab boundary, the shared `phelan` account, the deprecated server kept around for context, the old copies of PicoHelperTools and ParticleSensor in the wrong repo), the docs call out the weirdness and explain why it is what it is. The known-issues files are the to-do list a real maintainer would keep — they're not a list of failures to apologize for. If something breaks, start with the relevant punch list; it probably knows.

Good luck. — Faith
