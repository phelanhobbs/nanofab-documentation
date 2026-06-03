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

## Pick your path

| If you are… | Go to | Time |
|------|-------|------|
| **A live in-person handoff session(s)** between me (Faith) and the next maintainer | [Path A](#path-a-live-multi-session-handoff) | 4–5 sessions of ~60–90 min each |
| **Presenting to lab management or non-technical stakeholders** (advisor, lab director, the rest of the team) | [Path B](#path-b-lab-management-non-technical-stakeholders) | 45 min, one session |
| **A solo successor** walking in after I've left, reading at your own pace | [Path C](#path-c-solo-successor-self-paced) | Multi-week, self-paced |
| **The long-term maintainer** who needs to own, audit, extend, or rescue the system without contacting me | [Path D](#path-d-long-term-maintainer-deep-dive) | 1-2 focused weeks, repeatable as an audit |
| **Faith presenting an unlimited, all-encompassing live walkthrough** with slides on a screen | [Path E](#path-e-presentation-guide) | No fixed limit; prefer too long over too short |
| **A future maintainer rebuilding the server/tools from documentation alone** with no source tree available | [Path F](#path-f-ultra-deep-reconstruction-manual) | 3.6M+ words, split by tool folder |

Each path orders the materials so they tell the story in the right sequence. If you're not sure, **Path A is the canonical full handoff** — if you're going to do this in person, do it that way. If there is no person left to ask and the system has to be maintained independently, use **Path D**. If Faith is presenting the complete slide-driven handoff live, use **Path E**. If the maintainer needs a reconstruction-grade manual that explains the repos deeply enough to recreate them from sanitized documentation, use **Path F**.

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
| 6 | Walk [`known-issues/NanofabToolkit/README.md`](known-issues/NanofabToolkit/README.md) | The sibling repo punch list. Do this before ending the handoff because it includes high-severity client/firmware items such as CORES-token handling and WiFi credential exposure. |
| 7 | [`HSC-Displayer-Server-Legacy.pptx`](presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx) (briefly) | The legacy monolithic server. **Deprecated.** Show it so they recognize it if they ever stumble across it; the directive is "leave it alone, ship to the Flask app." |

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

This is the no-human-context path.

Use it when the maintainer is not just trying to understand the system, but must own it, audit it, extend it, recover it, or decide what to fix next without contacting Faith.

Path C is a reading path. Path D is an evidence path. Do not just read the docs. Confirm the docs against the source repos, the live server, the current known-issues files, and the operational boundary with University IT.


## What Path D Is For

Use Path D when any of these are true:

- Faith is unavailable.
- The system is going to change materially.
- A new maintainer needs to become the long-term owner.
- The docs may be stale and need to be revalidated.
- The live server has drifted from the documented deployment.
- Management needs a maintenance plan, not just a handoff.
- You need to decide what to fix, what to leave alone, and what requires IT.

Do not use Path D for a quick overview. Use Path A, B, or C for that.

## Expected Time

Budget 1-2 focused weeks.

Minimum useful pass:

- 2-3 days if you already have server access, know Flask, and only need a drift check.

Full ownership pass:

- 1 week for a technically strong maintainer.
- 2 weeks if access setup, source recovery, local environment setup, and IT boundary cleanup all have to happen at the same time.

Repeat cadence:

- Quarterly for a maintenance audit.
- Immediately after major deployment, schema, access, or infrastructure changes.
- Immediately after an outage or suspected data-integrity issue.

## Final Outputs

Path D is complete only when these artifacts exist and are current:

- A current live-server survey snapshot under `documentation/UNanofabTools/liveserver/snapshots/`.
- A doc/code drift report listing every mismatch found, even if already fixed.
- An updated `known-issues/` tree with obsolete items removed and new findings added.
- A maintenance plan with next 7 days, next 30 days, and next quarter.
- A list of Nanofab-actionable items vs University IT tickets.
- A short decision log recording the assumptions the next maintainer should inherit.
- A clean git status in the documentation repo after edits are committed.

Do not declare Path D done because you finished reading. It is done when the next maintainer can recover, operate, and change the system using written evidence.

## Source Of Truth Order

When two things disagree, use this order:

1. Live production state observed directly on `nfhistory`.
2. Current source code in the active production checkout.
3. Current source code in the canonical Git repos.
4. Database schemas, migrations, and live database introspection.
5. Current developer documentation.
6. Current layman documentation and slides.
7. Historical snapshots.
8. Memory, assumptions, old chat notes, or "what someone remembers."

If a lower source disagrees with a higher source, update the lower source or write a known-issues item explaining why it is intentionally different.

## Required Workspace Shape

This GitHub repository is the documentation bundle. It intentionally does not include the application source trees.

For a real Path D audit, arrange the working directory like this:

```text
work/
  nanofab-documentation/
  UNanofabTools/
  NanofabToolkit/
```

The source repos may already exist locally. If they do not, recover `UNanofabTools` from GitHub, the handoff archive, or the production server checkout at `/home/phelan/server/UNanofabTools/`. Recover `NanofabToolkit` from GitHub, the handoff archive, or another preserved source copy.

Do not continue into source-code verification until you have the source repos. If the source repos cannot be found, make that the first high-severity finding: the docs are not enough to maintain the system safely without source.

## Non-Negotiable Facts To Preserve

These facts are load-bearing. Every doc, slide, issue file, and runbook should be consistent with them unless the live system has changed and the change is documented.

| Fact | Why it matters |
|------|----------------|
| The live Flask app install path is `/home/phelan/server/UNanofabTools/`. | Recovery commands and survey scripts must use the real production path. |
| `HSCDownloader.py` lives in the same install directory as `run.py`. | There is no separate production home-level HSCDownloader checkout to restart. |
| The chem PostgreSQL database is local to `nfhistory` on `127.0.0.1:5432`. | Architecture, backup, restore, and firewall assumptions depend on this. |
| The Flask app and HSCDownloader currently run in tmux sessions, not systemd. | This is the top Nanofab-owned reliability risk. |
| University IT owns the VM, root, root SSH, base patching, and off-box backups. | Do not assign IT-owned fixes to the Nanofab maintainer. |
| The Nanofab maintainer has `sudo` as `phelan`, not root, and cannot create UNIX users. | Per-user UNIX accounts and root-owned changes are IT tickets. |
| Nanofab owns the Flask app, HSCDownloader, local chem DB, data trees, and `/home/phelan/`. | These are the areas the maintainer can actually fix. |
| `NanofabToolkit` is canonical for PicoHelperTools and ParticleSensor. | Do not patch older copies in `UNanofabTools` unless preserving history. |
| `hscdisplayerserver` is deprecated. | Do not spend major effort improving it unless the live deployment has reverted. |

## Phase 0 - Prepare The Audit

Goal: start from a clean, reproducible workspace.

### Inputs

- This documentation repo.
- The `UNanofabTools` source repo.
- The `NanofabToolkit` source repo.
- Access to `nfhistory`, or a recorded reason why access is unavailable.
- Permission boundaries: Nanofab vs University IT.

### Actions

1. Confirm the docs repo branch:

   ```sh
   cd nanofab-documentation
   git status --short --branch
   git branch -vv
   ```

2. Confirm source repo state:

   ```sh
   git -C ../UNanofabTools status --short --branch
   git -C ../UNanofabTools remote -v
   git -C ../UNanofabTools log -1 --oneline

   git -C ../NanofabToolkit status --short --branch
   git -C ../NanofabToolkit remote -v
   git -C ../NanofabToolkit log -1 --oneline
   ```

3. If any repo is dirty, decide whether the dirty changes belong to the audit. Do not overwrite them. Record:

   - repo
   - branch
   - commit
   - dirty files
   - whether the changes are yours, another maintainer's, or unknown

4. Create an audit notes file outside the committed docs first:

   ```sh
   mkdir -p /tmp/nanofab-path-d
   touch /tmp/nanofab-path-d/audit-notes.md
   ```

5. Use this header:

   ```md
   # Path D Audit Notes - YYYY-MM-DD

   ## Repos
   - nanofab-documentation:
   - UNanofabTools:
   - NanofabToolkit:

   ## Live Server Access
   - Access available:
   - User used:
   - Survey snapshot:

   ## Findings
   - None yet.
   ```

### Exit Criteria

- You know which branch and commit each repo is on.
- You know whether local dirty work exists.
- You know whether you have live server access.
- You have an evidence log started.

## Phase 1 - Build The System Map

Goal: understand the whole system before touching implementation details.

### Read First

1. `START-HERE.md`
2. `README.md`
3. `support/REDACTION-NOTE.md`
4. `presentation/UNanofabTools/README.md`
5. `documentation/UNanofabTools/README.md`
6. `known-issues/UNanofabTools/README.md`
7. `presentation/NanofabToolkit/README.md`
8. `documentation/NanofabToolkit/README.md`
9. `known-issues/NanofabToolkit/README.md`

### Write Down

Create a one-page system map with these headings:

- Public website and users.
- Flask app.
- Authentication and Duo.
- SQLite databases.
- Chem PostgreSQL database.
- HSCDownloader and CORES data.
- File-transfer scripts from tool PCs.
- Pico sensor firmware.
- ParticleSensor desktop viewer.
- Other desktop tools.
- Deprecated legacy server.
- University IT-owned infrastructure.
- Nanofab-owned operational surface.

### Questions You Must Be Able To Answer

- What does `nfhistory` provide to cleanroom users?
- Which data comes from CORES?
- Which data comes from machine control PCs?
- Which data comes from Pico devices?
- Which databases are SQLite?
- Which database is PostgreSQL?
- Which parts can Nanofab fix without IT?
- Which parts require an IT ticket?
- Which code copies are canonical?
- Which code copies are historical only?

### Exit Criteria

- You can explain the system in 10 minutes without opening a file.
- You can draw the data flow from producers to website.
- You can identify the operational owner for each major component.

## Phase 2 - Run The Mechanical Documentation Audit

Goal: catch missing files, broken links, and stale wording before doing deeper judgment work.

### Actions

From the documentation repo:

```sh
bash support/audit.sh
```

Read all output. Do not treat the script as authoritative; it is a starter report.

Important: because this GitHub repo is documentation-only, source repos may not be inside the docs repo. For source-code checks, use sibling directories `../UNanofabTools` and `../NanofabToolkit`.

### Check Specifically

- Missing layman READMEs.
- Missing slide decks.
- Missing developer docs.
- Missing known-issues files.
- Broken markdown links.
- Stale `~/UNanofabTools` references.
- Stale home-level HSCDownloader path references.
- Wording that incorrectly describes chem PostgreSQL as off-host.
- Backup-missing wording without University IT context.
- Per-user server-account wording without IT-ticket context.
- Root SSH recommendations assigned to Nanofab instead of IT.

### Exit Criteria

- Every mechanical finding is either fixed or listed in the drift report.
- You understand which hits are real issues and which are acceptable historical context.

## Phase 3 - Verify Access And Live State

Goal: compare documentation to production reality.

### Read First

1. `documentation/UNanofabTools/serveraccess/README.md`
2. `presentation/UNanofabTools/serveraccess/README.md`
3. `documentation/UNanofabTools/liveserver/README.md`
4. `known-issues/UNanofabTools/serveraccess.md`
5. `known-issues/UNanofabTools/liveserver.md`

### Safe Access Rules

- Use the documented two-hop SSH path through CADE.
- Attach to tmux only when needed.
- Detach with `Ctrl-b d`.
- Do not type `exit` inside the live service pane.
- Do not press `Ctrl-c` inside the live service pane.
- Do not edit `.env`, database files, nginx config, systemd units, or SSH keys during an audit unless the task is explicitly a maintenance change.

### Live Checks

On `nfhistory`, verify:

- Hostname and OS.
- IP address.
- nginx status and listener.
- TLS certificate path and renewal mechanism.
- tmux sessions `flaskserver` and `downloader`.
- Flask process command.
- HSCDownloader process command.
- Production install path.
- Python venv path.
- `.env` key names, not secret values.
- SQLite database files in `instance/`.
- PostgreSQL service and local listener.
- Data-tree freshness for `HSCDATA/`, `LogData/`, and `uploads/`.
- Disk usage.
- Cleanroom-specific cron entries.
- Backup assumptions and what IT covers.

### Survey Snapshot

Run the survey script using the documented procedure:

```sh
bash ~/survey_nfhistory.sh | tee /tmp/nfhistory_survey_$(date +%F).txt
```

Copy the result into:

```text
documentation/UNanofabTools/liveserver/snapshots/
```

Before committing any snapshot, inspect it for secrets. Redact secret values. Keep key names, paths, service names, and non-secret operational facts.

### Exit Criteria

- The live-server doc matches the current survey or has clear notes where it differs.
- The known-issues live-server list matches current reality.
- Anything that changed since the last snapshot is documented.

## Phase 4 - Reconstruct The Runtime Architecture

Goal: know how a request or data update travels through the system.

### Build This Diagram

Write or update a plain-text diagram with these nodes:

```text
Browser/user
  -> DNS/TLS/nginx
  -> Flask app on 127.0.0.1:5000
  -> auth/session/Duo
  -> blueprints/routes
  -> SQLite databases
  -> local PostgreSQL chem database
  -> HSCDATA/LogData/uploads

CORES/n8n
  -> HSCDownloader.py
  -> HSCDATA/*.csv
  -> Flask machine pages

Tool control PCs
  -> file-transfer scripts
  -> LogData/
  -> Flask data displays

Pico devices
  -> unauthenticated IoT API routes
  -> sensor storage/views

NanofabToolkit desktop tools
  -> local files or nfhistory APIs, depending on tool
```

### Validate Against Docs

Compare:

- `presentation/UNanofabTools/flaskserver/README.md`
- `documentation/UNanofabTools/flaskserver/01-architecture.md`
- `documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md`
- `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`
- `documentation/UNanofabTools/liveserver/README.md`

### Exit Criteria

- You know every producer of data.
- You know every persistent data store.
- You know every long-running process.
- You know what nginx does and does not do.
- You know which components are current vs deprecated.

## Phase 5 - Audit The Flask App Against The Docs

Goal: prove that the developer docs describe the code that actually exists.

### Commands

From the documentation repo:

```sh
rg -n "Blueprint|@.*route|route\\(" ../UNanofabTools
rg -n "login_required|session|Duo|duo|auth" ../UNanofabTools
rg -n "CHEM_|SQLALCHEMY|DATABASE|SECRET|FLASK_" ../UNanofabTools
rg -n "sqlite|postgres|psycopg|SQLAlchemy|create_engine" ../UNanofabTools
rg -n "HSCDATA|LogData|uploads|instance" ../UNanofabTools
```

### Compare To Docs

Check these pairs line by line:

| Code area | Documentation |
|-----------|---------------|
| app factory and startup | `documentation/UNanofabTools/flaskserver/01-architecture.md`, `02-getting-started.md` |
| env vars and config classes | `03-configuration-reference.md` |
| SQLite and chem schema | `04-database-schema.md` |
| HTTP routes | `05-http-api-reference.md` |
| service/helper functions | `06-service-layer-reference.md` |
| auth and Duo | `07-authentication-and-authorization.md` |
| external/internal integrations | `08-integrations-and-data-contracts.md` |
| deployment and operations | `09-deployment-and-operations.md` |
| dev workflow | `10-development-guide.md` |

### Route Audit

For every documented route, confirm:

- URL rule.
- HTTP methods.
- blueprint or module.
- login requirement.
- request payload.
- response shape.
- template rendered or file returned.
- database or filesystem side effect.
- whether the route is user-facing, admin-facing, or device-facing.

For every actual route in code, confirm it appears in the docs or is intentionally omitted with a reason.

### Configuration Audit

For every documented env var, confirm:

- exact spelling
- default value behavior
- production requirement
- whether it is safe to omit in development
- whether it is a secret
- where it is consumed in code

For every env var consumed in code, confirm it appears in the docs.

### Exit Criteria

- No undocumented production route remains unless explicitly explained.
- No documented route points to dead code.
- Env-var docs match code exactly.
- Startup docs match `run.py` and the production tmux state.

## Phase 6 - Audit Databases And Data Durability

Goal: know what data exists, where it lives, how it is backed up, and how it can be restored.

### SQLite

Check:

- Which SQLite databases exist under `instance/`.
- Which code modules open each one.
- Whether schemas are created automatically or manually.
- Whether migrations exist.
- Whether tables are documented.
- Whether backups include them.

### Chem PostgreSQL

Check:

- live service unit: `postgresql@17-main.service`
- listener: `127.0.0.1:5432`
- database name
- application user
- schema files in `UNanofabTools`
- live schema vs committed schema
- whether `chem_schema.sql` and `chem_schema_migration_v2.sql` are current
- whether `init_chem_db.py` is complete or only partial
- whether app write routes are authenticated

Do not paste database passwords into docs. Record key names and access path only.

### File Trees

Check:

- `HSCDATA/`
- `LogData/`
- `uploads/`
- particle sensor data storage
- machine log directories
- generated files
- whether each is authoritative, cache-like, or derived

### Backup Questions

Answer these in writing:

- What does University IT back up?
- Does the backup include `/home/phelan/`?
- Does it include the PostgreSQL data directory?
- Does it include `/etc/letsencrypt/`?
- What is the restore path if the VM is lost?
- What can Nanofab restore without IT?
- Is there a local `pg_dump` schedule?
- Are there unbacked-up data trees?

### Exit Criteria

- A maintainer can name every durable data store.
- A maintainer can describe how to back up and restore each one.
- Any unknown backup boundary is filed as an IT question, not guessed.

## Phase 7 - Audit Security And Identity

Goal: understand who can get in, what secrets exist, and what should be hardened first.

### Areas To Review

- CADE access path.
- `phelan` shared UNIX account.
- `/home/phelan/.ssh/authorized_keys` management.
- root SSH as University IT's access path.
- sudo rights available to Nanofab.
- Flask login flow.
- Duo integration.
- Flask session settings.
- admin authorization checks.
- chem write routes.
- unauthenticated device API routes.
- hard-coded secrets in source.
- `.env` secret handling.
- WiFi credentials in Pico firmware.
- CORES bearer token handling.
- GitHub documentation redactions.

### Secret Handling Rules

- Do not commit live secret values.
- Do not paste `.env` values into markdown.
- Do not paste bearer tokens, WiFi passwords, Duo keys, private SSH keys, or database passwords.
- It is acceptable to document secret key names, rotation procedures, where secrets are read, and where they should live.
- If a secret was ever committed to source, assume it must be rotated.

### Triage

For each security item, classify:

- High: exploitable access, unauthenticated write, live secret, data exposure.
- Medium: weak operational control, personal-account dependency, missing audit trail.
- Low: cleanup, clarity, hardening with low immediate risk.
- IT ticket: root, VM, network, backups, OS patching, per-user UNIX accounts.
- Nanofab-actionable: app code, `.env`, `/home/phelan/`, tmux, HSCDownloader, chem DB app permissions, docs.

### Exit Criteria

- Every secret exposure is listed with rotation guidance.
- Every identity/access recommendation is assigned to Nanofab or IT.
- The maintainer knows what not to touch without IT.

## Phase 8 - Audit Integrations And Tool Ecosystem

Goal: know every thing outside Flask that feeds, reads, or depends on the system.

### UNanofabTools Components

Audit these:

- `hscdownloader`
- `filetransfer`
- `dattools`
- `utilities`
- `picofirmware` older copies
- `particlepctools` older copy
- `hscdisplayerserver` deprecated server

For each component, record:

- purpose
- source path
- production status
- canonical vs historical status
- inputs
- outputs
- external systems
- secrets
- known issues
- what "healthy" looks like
- how to test without touching production

### NanofabToolkit Components

Audit these:

- `PicoHelperTools`
- `ParticleSensor`
- `ParalyneReader`
- `ALDPeakCounter`
- `DentonDecoder`
- `PreciousMetalReader`

For each, record:

- canonical source path
- supported operating system or hardware
- input file/device format
- output file/API behavior
- relation to `nfhistory`
- whether the docs describe the current implementation
- whether the presentation deck is accurate enough for non-coders

### Canonical Copy Rule

If the same concept exists in both repos:

- Treat `NanofabToolkit/PicoHelperTools` as canonical for Pico firmware.
- Treat `NanofabToolkit/ParticleSensor` as canonical for the particle desktop viewer.
- Treat `UNanofabTools/picofirmware` and `UNanofabTools/particlepctools` as historical unless live evidence proves otherwise.

### Exit Criteria

- A maintainer knows which repo to patch for each tool.
- Deprecated tools are clearly marked.
- No integration depends on an undocumented secret or undocumented path.

## Phase 9 - Triage Known Issues

Goal: convert the punch list into a maintenance plan.

### Read

1. `known-issues/UNanofabTools/README.md`
2. `known-issues/UNanofabTools/liveserver.md`
3. `known-issues/UNanofabTools/serveraccess.md`
4. `known-issues/UNanofabTools/flaskserver.md`
5. every remaining `known-issues/UNanofabTools/*.md`
6. every `known-issues/NanofabToolkit/*.md`

### For Each Issue

Confirm:

- still exists
- severity is correct
- owner is Nanofab, IT, or both
- suggested fix is feasible
- code path still exists
- doc references still point to real files
- any secret named there is redacted or represented by placeholder

### Priority Rules

Fix first:

1. active security exposures
2. unauthenticated writes or unsafe device endpoints
3. data-loss risks
4. production reliability risks
5. schema drift that blocks recovery
6. personal-account dependencies
7. doc/code mismatches that could cause bad operations
8. deprecated-code cleanup
9. cosmetic cleanup

### Exit Criteria

- Every issue has an owner.
- Every issue has a current status.
- No fixed issue remains as if it were still broken.
- No active high-severity finding is buried in a low-priority file.

## Phase 10 - Build The Maintenance Plan

Goal: leave a concrete next-action plan, not a pile of observations.

### Next 7 Days

This section should include urgent work only:

- restore or confirm access
- verify tmux sessions
- close obviously stale editor sessions
- rotate exposed secrets
- document current `.env` key names without values
- confirm backups with IT
- add any missing high-severity known issue

### Next 30 Days

This section should include material improvements:

- move Flask app and HSCDownloader under systemd or another supervisor
- reconcile chem schema and migrations
- authenticate or otherwise protect chem write routes
- remove production-targeting defaults from test tools
- replace personal-account file-transfer dependency
- create a local `pg_dump` routine if appropriate
- update docs after every accepted fix

### Next Quarter

This section should include structural work:

- test restore procedures
- retire the legacy server if confirmed unused
- reduce shared-account dependence with IT if policy allows
- review all secrets and rotation procedures
- repeat Path D mechanical audit
- refresh live-server snapshot
- review dependency versions and OS patch status with IT

### Exit Criteria

- A manager can see what will be fixed when.
- A maintainer can start the next task without asking for priority context.
- IT tickets are separated from Nanofab-owned engineering work.

## Phase 11 - Write Decision Records

Goal: prevent future maintainers from rediscovering why the system is shaped this way.

Create a short decision log in the audit notes. Commit a cleaned version if it is useful and contains no secrets.

Use this template:

```md
## Decision: <short name>

- Date:
- Status: active / superseded / needs review
- Context:
- Decision:
- Consequences:
- Owner:
- Related docs:
- Related known issues:
```

Recommended decisions to record:

- Why `nfhistory` is jointly owned by University IT and Nanofab.
- Why Nanofab uses shared UNIX account `phelan`.
- Why root access is not a Nanofab maintenance path.
- Why the app currently runs in tmux.
- Whether and when to migrate to systemd.
- Why chem PostgreSQL is local.
- Which source repo is canonical for Pico firmware.
- Which source repo is canonical for ParticleSensor.
- Why `hscdisplayerserver` is deprecated.
- Which backup responsibilities are IT-owned.

### Exit Criteria

- Future maintainers inherit reasons, not just commands.
- Any uncomfortable operational compromise is documented honestly.

## Phase 12 - Practice Operational Scenarios

Goal: prove the maintainer can operate the system without undocumented help.

Do these as dry runs unless there is an actual incident.

### Website Is Down

Answer:

- Is nginx running?
- Is port 443 listening?
- Is nginx proxying to `127.0.0.1:5000`?
- Is the Flask process alive?
- Is the `flaskserver` tmux session alive?
- Are there recent tracebacks?
- Is disk full?
- Did `.env` or the venv change?
- Can you restart safely using the documented tmux procedure?

### New CORES Data Is Missing

Answer:

- Is `downloader` tmux alive?
- Is `python3 HSCDownloader.py` running?
- Is there a stale editor pane that confused the operator?
- Are new files appearing in `HSCDATA/`?
- Did the CORES/n8n endpoint or token change?
- Are errors logged?
- Is this a source issue, secret issue, or external CORES issue?

### Chem Pages Fail

Answer:

- Is PostgreSQL running locally?
- Is it listening on `127.0.0.1:5432`?
- Are `CHEM_*` env vars present?
- Does the live schema match the code?
- Is a migration missing?
- Are write routes protected?
- Is the issue limited to chem or app-wide?

### A Maintainer Needs Access

Answer:

- Do they have a CADE account?
- Do they have a public key?
- Who is allowed to append it to `/home/phelan/.ssh/authorized_keys`?
- How is the key labeled?
- How is access revoked?
- What requires IT?

### The VM Is Lost

Answer:

- Who opens the IT restore ticket?
- What backup does IT restore?
- How do you verify `/home/phelan/` returned?
- How do you verify PostgreSQL returned?
- How do you verify TLS certs returned?
- How do you restart Flask and HSCDownloader?
- What data may be missing?

### Exit Criteria

- The maintainer can talk through each scenario without guessing.
- Any guessed step becomes a doc update or known issue.

## Phase 13 - No-Contact Exit Exam

Goal: prove the handoff is independent of Faith.

The maintainer should be able to answer every question below from docs, source, live state, or IT tickets.

### System Ownership

- Who owns the VM?
- Who owns root?
- Who owns `/home/phelan/`?
- Who owns the Flask app?
- Who owns the local chem PostgreSQL database?
- Who owns off-box backups?
- Who is allowed to create per-user server accounts?
- Which tasks need IT?
- Which tasks can Nanofab do alone?

### Runtime

- What process serves the Flask app today?
- What process writes `HSCDATA/`?
- What is nginx proxying to?
- What tmux sessions must stay alive?
- What is the production install path?
- What command restarts Flask in the current setup?
- What command restarts the downloader in the current setup?
- What should replace tmux long term?

### Data

- Which data is in SQLite?
- Which data is in PostgreSQL?
- Which data is in CSV files?
- Which data is uploaded from tool PCs?
- Which data is posted by Pico devices?
- Which data is derived vs authoritative?
- What has to be backed up?
- What restore procedure has actually been tested?

### Code

- Where is the Flask app source?
- Where are the Flask routes?
- Where is config loaded?
- Where are auth and Duo handled?
- Where is chem DB access implemented?
- Where is HSCDownloader?
- Which repo has canonical Pico firmware?
- Which repo has canonical ParticleSensor?
- Which code is deprecated?

### Security

- Where are secrets supposed to live?
- Which secrets were historically hard-coded?
- Which secrets must be rotated if exposed?
- Which routes accept unauthenticated device data?
- Which routes perform writes?
- Which auth checks protect admin behavior?
- How is SSH access granted and revoked?
- What should never be committed?

### Maintenance

- What are the top three Nanofab-actionable fixes?
- What are the top three IT tickets?
- What is the quarterly maintenance checklist?
- How do docs get updated after a fix?
- How do known-issues files get closed?
- What evidence is required before deleting a known issue?

If any answer depends on "ask Faith," Path D is not complete. Replace that dependency with documentation, source evidence, or an IT ticket.

## Phase 14 - Close The Audit

Goal: leave the repo better than you found it.

### Required Cleanup

- Update changed docs.
- Update known-issues.
- Add or update live-server snapshot.
- Remove any accidental secret values.
- Run the support audit (`bash support/audit.sh`).
- Run `git diff --check`.
- Review `git diff`.
- Commit documentation changes.
- Push the branch if this is a GitHub-maintained doc set.

### Final Report Template

Use this structure:

```md
# Path D Audit Report - YYYY-MM-DD

## Verdict

## Repos And Commits

## Live State Verified

## Drift Found

## Changes Made

## Remaining Nanofab-Actionable Work

## IT Tickets Needed

## Security Follow-Up

## Backup And Restore Status

## Next 7 Days

## Next 30 Days

## Next Quarter
```

### Done Criteria

Path D is complete when all are true:

- `START-HERE.md` still points to real files.
- The docs reflect the current source code or explicitly note drift.
- The docs reflect the current live server or explicitly note drift.
- Every high-severity known issue is visible in the master known-issues index.
- Every IT-bound item is labeled as an IT ticket.
- Every Nanofab-actionable item has a plausible next step.
- No secret values were committed.
- The next maintainer can answer the exit-exam questions from written materials.

## Appendix A - Useful Search Commands

Run from `nanofab-documentation/`.

```sh
rg -n "~/(UNanofabTools|HSCDownloader)|external.*Postgres(SQL)?|external.*chem" .
rg -n "no backup(s)?|nothing.*backs.*up|backup coverage missing" .
rg -n "create (UNIX|per-person)|u[s]eradd|root[ -]SSH|PermitRootLogin|ice[o]late" .
rg -n "CHEM_|FLASK_|SECRET|DUO|DATABASE|SQLALCHEMY" ../UNanofabTools
rg -n "@.*route|Blueprint|login_required|session" ../UNanofabTools
rg -n "HSCDATA|LogData|uploads|instance|postgres|sqlite" ../UNanofabTools
rg -n "wifi|password|token|bearer|secret|key" ../UNanofabTools ../NanofabToolkit
```

## Appendix B - Sensitive Output Rules

Before committing any audit output:

- Replace bearer tokens with `<redacted-bearer-token>`.
- Replace WiFi passwords with `<redacted-wifi-password>`.
- Replace database passwords with `<redacted-db-password>`.
- Replace Duo secret values with `<redacted-duo-secret>`.
- Replace private key material with `<redacted-private-key>`.
- Keep key names, file paths, command names, usernames, service names, and timestamps.
- For SSH public keys, record owner labels and fingerprints instead of full key bodies unless policy allows the full public key.

## Appendix C - Quarterly Maintenance Checklist

Do this every quarter:

- Run `bash support/audit.sh`.
- Refresh the live-server survey snapshot.
- Confirm both tmux sessions or their replacement supervisor are healthy.
- Confirm HSCDownloader is writing fresh `HSCDATA/`.
- Confirm PostgreSQL is running locally and is backed up.
- Confirm SQLite/data trees are covered by backup.
- Confirm TLS renewal is healthy.
- Review disk usage.
- Review `known-issues/` and close fixed items with evidence.
- Re-scan source for secrets.
- Review IT-ticket items and follow up.
- Confirm `START-HERE.md` still matches the repo layout.
- Confirm canonical-copy notes for PicoHelperTools and ParticleSensor are still true.

## Appendix D - What Not To Spend Time On First

Do not start here unless live evidence changes the priority:

- Polishing deprecated `hscdisplayerserver`.
- Rewriting all desktop tools.
- Reorganizing documentation style.
- Creating per-user UNIX accounts without IT.
- Moving root SSH configuration without IT.
- Making broad refactors before chem schema, supervision, access, and secrets are understood.

The first maintainer-hours should go to reliability, recoverability, security, and removing person-specific operational dependencies.

---

# Path E: Presentation guide

Use Path E when Faith is presenting the exhaustive maintainer handoff live with slides on a screen. Path E is not a separate audit path; it is the speaker-run version of the handoff. It tells the presenter what deck to show, what to say, what docs or source files to open, when to pause for live demonstrations, and what the future maintainer must be able to explain back before moving on.

Start here before opening any module:

- [`support/path-e-script/OPERATOR-CHECKLIST.md`](support/path-e-script/OPERATOR-CHECKLIST.md) — the short before/during/after checklist and tier chooser
- [`support/PRESENTATION-GUIDE.md`](support/PRESENTATION-GUIDE.md)
- [`support/path-e-script/README.md`](support/path-e-script/README.md)
- [`support/path-e-script/TIMING.md`](support/path-e-script/TIMING.md) — estimated read-aloud and real presentation time by version, week, and module

Choose one script tier:

| Tier | Start file | Use when | Words |
|---|---|---|---:|
| Practical modular pack | [`support/path-e-script/OPERATOR-CHECKLIST.md`](support/path-e-script/OPERATOR-CHECKLIST.md) | You want the human-sized Path E script with one file per module. | 17,108 |
| Minimum generated full Path E | [`support/path-e-script-minimum/scripts/00-operator-and-session-plan.md`](support/path-e-script-minimum/scripts/00-operator-and-session-plan.md) | You need the smallest generated full tier that still clears the 50k-word floor. | 88,794 |
| Medium generated full Path E | [`support/path-e-script-medium/scripts/00-operator-and-session-plan.md`](support/path-e-script-medium/scripts/00-operator-and-session-plan.md) | You want a deeper generated script while staying below the 250k ceiling. | 229,239 |
| Verbose generated full Path E | [`support/path-e-script-verbose/scripts/00-operator-and-session-plan.md`](support/path-e-script-verbose/scripts/00-operator-and-session-plan.md) | There is no time limit and maximal coverage is preferred. | 314,105 |

For the practical modular pack, read `support/path-e-script/OPERATOR-CHECKLIST.md`, then `00-operator-protocol.md`, then `module-00-set-the-contract.md` through `module-21-final-no-contact-check.md` in filename order.

For the generated tiers, read the files under the tier's `scripts/` directory in filename order. Each generated tier also has its own README and word-count manifest:

- [`support/path-e-script-minimum/README.md`](support/path-e-script-minimum/README.md) and [`WORDCOUNT.md`](support/path-e-script-minimum/WORDCOUNT.md)
- [`support/path-e-script-medium/README.md`](support/path-e-script-medium/README.md) and [`WORDCOUNT.md`](support/path-e-script-medium/WORDCOUNT.md)
- [`support/path-e-script-verbose/README.md`](support/path-e-script-verbose/README.md) and [`WORDCOUNT.md`](support/path-e-script-verbose/WORDCOUNT.md)

Use Path E when there is no time limit and the goal is complete maintainer independence. Prefer too much coverage over too little. If the live presentation uncovers missing context, update this `START-HERE.md`, the relevant developer docs, or the relevant `known-issues/` file before the handoff is considered complete.

---

# Path F: Ultra-deep reconstruction manual

Use Path F when the goal is not just handoff, audit, or presentation, but reconstruction: a future maintainer should be able to recreate a functionally equivalent server and tool ecosystem from written materials and sanitized code excerpts alone.

Path F is generated from the current working-tree source state of the sibling repos and is intentionally much larger than Path E:

- [`support/path-f-reconstruction/README.md`](support/path-f-reconstruction/README.md) — start here
- [`support/path-f-reconstruction/MAINTAINER-FIRST-HOUR.md`](support/path-f-reconstruction/MAINTAINER-FIRST-HOUR.md) — one-hour orientation path for a new or stressed maintainer
- [`support/path-f-reconstruction/NAVIGATOR.md`](support/path-f-reconstruction/NAVIGATOR.md) — first file to open when choosing the right reconstruction folder
- [`support/path-f-reconstruction/TROUBLESHOOTING-ROUTES.md`](support/path-f-reconstruction/TROUBLESHOOTING-ROUTES.md) — symptom-to-folder routing table with ownership and proof checks
- [`support/path-f-reconstruction/GLOSSARY.md`](support/path-f-reconstruction/GLOSSARY.md) — names, acronyms, accounts, hosts, tools, and data paths
- [`support/path-f-reconstruction/RECONSTRUCTION-CHECKLIST.md`](support/path-f-reconstruction/RECONSTRUCTION-CHECKLIST.md) — proof gates for deciding whether a rebuild is complete
- [`support/path-f-reconstruction/REBUILD-EVIDENCE-TEMPLATE.md`](support/path-f-reconstruction/REBUILD-EVIDENCE-TEMPLATE.md) — copyable evidence log for rebuilds, repairs, and blocked work
- [`support/path-f-reconstruction/FIXTURE-AND-EVIDENCE-INDEX.md`](support/path-f-reconstruction/FIXTURE-AND-EVIDENCE-INDEX.md) — fixture/sample/evidence registry for known inputs, expected outputs, hashes, and acceptable substitutes
- [`support/path-f-reconstruction/WORDCOUNT.md`](support/path-f-reconstruction/WORDCOUNT.md) — tool-folder and file word-count manifest
- [`support/path-f-reconstruction/SOURCE-MANIFEST.json`](support/path-f-reconstruction/SOURCE-MANIFEST.json) — source files included, dirty/untracked state, and total count metadata
- [`support/path-f-reconstruction/tools/INDEX.md`](support/path-f-reconstruction/tools/INDEX.md) — compact index of every reconstruction folder
- [`support/path-f-reconstruction/tools/`](support/path-f-reconstruction/tools/) — per-tool reconstruction folders
- [`support/path-f-tools/build_path_f.py`](support/path-f-tools/build_path_f.py) — reproducible generator

Current generated size:

| Path | Words | Source files | Tool folders |
|---|---:|---:|---:|
| Path F ultra-deep reconstruction manual | 3,663,176 | 159 | 17 |

Start with `MAINTAINER-FIRST-HOUR.md` if you are new or responding under stress. Otherwise start with `NAVIGATOR.md`, use `TROUBLESHOOTING-ROUTES.md` when you have a symptom, and use `GLOSSARY.md` when a name or acronym is unclear. Before declaring work complete, use `RECONSTRUCTION-CHECKLIST.md`, consult `FIXTURE-AND-EVIDENCE-INDEX.md`, and fill out `REBUILD-EVIDENCE-TEMPLATE.md`. After that, read `tools/INDEX.md`, `tools/00-system-map/README.md`, and the specific per-tool folder under `tools/UNanofabTools/` or `tools/NanofabToolkit/`. Inside each tool folder, read `README.md`, then `source-files/`, then any drill notes or pass files in `rehearsals/`. Every generated source-file page has breadcrumbs back to the navigator, checklist, glossary, fixture index, evidence template, tool index, system map, and owning tool README.

Important limits:

- Path F intentionally redacts secret-looking literal values. It explains where secrets belong, but it is not a secret store.
- Path F records dirty/untracked source files at generation time. If either source repo changes, regenerate Path F and inspect the diff. If Path F was generated from dirty sibling repos, exact regeneration requires either the same working-tree diffs or a clean committed replacement.
- Path F is not a substitute for live-state verification. If the manual disagrees with production, production wins and the manual must be regenerated or corrected.

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
- Punch list: [`known-issues/NanofabToolkit/PicoHelperTools.md`](known-issues/NanofabToolkit/PicoHelperTools.md)

### `ParticleSensor` (canonical) — desktop particle viewer
- Layman: [`presentation/NanofabToolkit/ParticleSensor/README.md`](presentation/NanofabToolkit/ParticleSensor/README.md)
- Slides: [`ParticleSensor.pptx`](presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx)
- Developer reference: [`documentation/NanofabToolkit/ParticleSensor/README.md`](documentation/NanofabToolkit/ParticleSensor/README.md)
- Punch list: [`known-issues/NanofabToolkit/ParticleSensor.md`](known-issues/NanofabToolkit/ParticleSensor.md)

### `ParalyneReader` — desktop tool for Parylene analog logs
- Layman + slides + developer reference: under [`presentation/NanofabToolkit/ParalyneReader/`](presentation/NanofabToolkit/ParalyneReader/) and [`documentation/NanofabToolkit/ParalyneReader/`](documentation/NanofabToolkit/ParalyneReader/)
- Punch list: [`known-issues/NanofabToolkit/ParalyneReader.md`](known-issues/NanofabToolkit/ParalyneReader.md)

### `ALDPeakCounter`, `DentonDecoder`, `PreciousMetalReader`
- Each has its own folder under both `presentation/NanofabToolkit/` and `documentation/NanofabToolkit/`
- Punch lists: [`known-issues/NanofabToolkit/`](known-issues/NanofabToolkit/)

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
