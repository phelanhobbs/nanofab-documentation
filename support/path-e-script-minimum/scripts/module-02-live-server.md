# Minimum Acceptable Full Path E - Module 02: Live Server

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-02-live-server.md

# Module 2 - What Is Actually Running On `nfhistory`

## Goal

The maintainer understands the difference between the ideal deployment and the verified live deployment on `nfhistory`.

## Required Screen

SHOW:

- `presentation/UNanofabTools/liveserver/slides/Live-Server.pptx` (repo path: presentation/UNanofabTools/liveserver/slides/Live-Server.pptx)
- `presentation/UNanofabTools/liveserver/README.md` (repo path: presentation/UNanofabTools/liveserver/README.md)
- `documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md)
- `known-issues/UNanofabTools/liveserver.md` (repo path: known-issues/UNanofabTools/liveserver.md)

## Verbatim Script

READ ALOUD:

"Now we move from the conceptual system to the live server. This distinction matters. Documentation often describes a desired shape. Production is the verified shape. When the two disagree, production wins and the docs must either be updated or must explicitly say they are describing a migration target."

SHOW:

Open `Live-Server.pptx`.

READ ALOUD:

"The live server is named `nfhistory`. The documented live-state snapshot says it is at IP `155.98.11.8`, running Debian 13, with kernel 6.12. nginx handles public HTTPS. TLS is Let's Encrypt and auto-renewed by certbot. The chemical PostgreSQL database is local on the same VM, listening on `127.0.0.1:5432`. The Flask app and `HSCDownloader.py` currently run inside tmux sessions named `flaskserver` and `downloader`. They are not systemd services yet."

"That last point is one of the most important operational facts in the whole handoff. A tmux session can keep a process alive after logout, but tmux is not a supervisor. If the process crashes, tmux may keep the shell open while the service is down. If the server reboots, the sessions do not automatically come back. Moving Flask and the downloader under systemd is a major reliability improvement that the Nanofab team can own."

SHOW:

Open `documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md).

READ ALOUD:

"The live-server developer document is a populated inventory. It should contain exact service names, paths, listener facts, snapshots, and findings. The top findings here intentionally mirror the known-issues file. That is important: a maintainer should not need to hunt through three places to discover the same serious risk."

SHOW:

Open `known-issues/UNanofabTools/liveserver.md` (repo path: known-issues/UNanofabTools/liveserver.md).

READ ALOUD:

"The known-issues file is the maintenance list. It is not an apology. It is the honest state of the system. Notice that some items are Nanofab-actionable and some are IT-bound. Root SSH, root-owned files, base patching, VM-level backup, and UNIX account creation are University IT territory. The Flask app, downloader, docs, chemical inventory application behavior, and data trees under `/home/phelan/` are Nanofab territory."

## Optional Live Demo

If live access is available and safe:

DO:

```sh
hostname
uname -a
tmux ls
ss -tulpn
systemctl status nginx
systemctl status postgresql@17-main
```

READ ALOUD:

"This demo is read-only. We are not changing production. We are using commands that show host identity, kernel, tmux sessions, network listeners, and service status. We are not opening secret-bearing files."

If live access is not available:

READ ALOUD:

"We are not running the live demo because live access is not available or not safe in this session. That is acceptable, but we must record it. A maintainer who has never verified live state should not claim full operational readiness."

LOG:

Record whether live access was available.

## Key Facts To Repeat

READ ALOUD:

"Repeat these facts until they are boring. The live Flask app install path is `/home/phelan/server/UNanofabTools/`. `HSCDownloader.py` lives in that same directory. The chem PostgreSQL database is local, not external. Backups are handled off-box by University IT, but backup coverage should be confirmed with IT. The Flask app and downloader are in tmux, not systemd. Nanofab has `sudo` as `phelan`, not root."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What is the live server name? | `nfhistory`. |
| What does nginx do on the live server? | It terminates public HTTPS/TLS and proxies to the Flask app behind it. |
| What process serves Flask today? | The live docs show `python run.py` running in the `flaskserver` tmux session, not a systemd unit. |
| What process writes `HSCDATA` today? | `HSCDownloader.py`, running from the `downloader` tmux session. |
| Why is tmux-only supervision a reliability risk? | tmux keeps a terminal alive but does not restart crashed services or bring them back after reboot. |
| Where is the live Flask app installed? | `/home/phelan/server/UNanofabTools/`. |
| Is chem PostgreSQL local or external? | Local on `nfhistory`, bound to `127.0.0.1:5432`. |
| Which live-server findings are Nanofab-actionable? | App/downloader supervision, app config, docs, health checks, app-level security, data freshness checks, and work under `/home/phelan/`. |
| Which findings require University IT? | Root-owned files, root SSH, VM backup/patching, UNIX accounts, and other root/VM infrastructure changes. |

REQUIRE:

The maintainer can say: "The app and downloader currently run in tmux. Moving them to systemd is a Nanofab-owned reliability improvement. Root, root SSH, VM-level backup, and UNIX account creation are IT-owned."

## Stop Point

STOP POINT:

Stop here if the maintainer confuses tmux with systemd, local PostgreSQL with external PostgreSQL, or Nanofab-owned work with IT-owned work.


# Expanded Module 02: Live Server

READ ALOUD:

This expanded section revisits Module 02, Live Server. The focus is verified production state, tmux, nginx, PostgreSQL, and IT ownership. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 02

READ ALOUD:

We are now doing the orientation pass for Live Server. The maintainer should connect this module to verified production state, tmux, nginx, PostgreSQL, and IT ownership. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/liveserver/slides/Live-Server.pptx`
- `presentation/UNanofabTools/liveserver/README.md`
- `documentation/UNanofabTools/liveserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention verified production state, tmux, nginx, PostgreSQL, and IT ownership. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 02

READ ALOUD:

We are now doing the evidence pass for Live Server. The maintainer should connect this module to verified production state, tmux, nginx, PostgreSQL, and IT ownership. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/liveserver/slides/Live-Server.pptx`
- `presentation/UNanofabTools/liveserver/README.md`
- `documentation/UNanofabTools/liveserver/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention verified production state, tmux, nginx, PostgreSQL, and IT ownership. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: presentation/UNanofabTools/liveserver/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# What's Actually Running on the Server — A Plain-English Guide

This guide is a tour of the **live cleanroom server** (`nfhistory`) — what's on it, what it's doing, how it's kept healthy, and what bits of it would surprise a future maintainer. Written for a non-coder; terms are defined as they appear.

If `serveraccess/` answers *"how do I log in?"*, this answers *"once you're in, what's actually there?"*

Everything below comes from real read-only surveys of the server on **May 29, 2026** (root-side system view) and **June 1, 2026** (`phelan`-side user view). The raw snapshots live in `documentation/UNanofabTools/liveserver/snapshots/` (repo path: documentation/UNanofabTools/liveserver/snapshots) for reference.

## The server in 30 seconds

| Thing | What's there |
|------|---------------|
| Operating system | Debian 13 ("Trixie"), a clean modern Linux |
| CPU | One Intel Xeon Gold core |
| Memory | 5.8 GB total; less than 1 GB used; plenty of headroom |
| Disk | 29 GB total, 19 GB free (only ~31% used) |
| Uptime | 290 days — it has been running since August 2025 without a reboot |
| Public web address | `https://nfhistory.nanofab.utah.edu` |
| Internal IP | 155.98.11.8 |

For what it does — a website, a chemical inventory, a sensor data API — that's a very small machine, and it's coping fine.

## What's listening on the network

Servers "listen" on numbered ports for incoming connections. Five things are listening here:

| Port | What runs there | Who can reach it |
|------|------------------|-------------------|
| 22 | SSH (sshd) | the outside world |
| 80 | nginx (plain HTTP) | the outside world |
| 443 | nginx (HTTPS — the secure website) | the outside world |
| 5000 | the Flask web app (Python) | **localhost only** — outside traffic can't touch it |
| 5432 | PostgreSQL (the database for chemical inventory) | **localhost only** |

The pattern is the standard "reverse proxy" setup: nginx is the only thing the outside world talks to. It takes secure HTTPS requests on port 443, terminates the encryption, and forwards them to the Flask app on the internal port 5000. The Flask app, in turn, talks to PostgreSQL on port 5432 — also internal.

### Surprise #1: the chemical-inventory database lives on this same machine.

The earlier documentation suggested the chemical inventory's PostgreSQL database was on a separate server. It isn't — it's right here on `nfhistory`, listening on `127.0.0.1:5432`. That's a meaningful clarification: backing up `nfhistory` and backing up the chem database are the same task, not two.

## The locked door (firewall)

The server uses **nftables** (a modern Linux firewall) with a "deny by default" policy. The only ports open from the outside are 22 (SSH), 80 (HTTP), and 443 (HTTPS). Everything else is dropped silently. Internal traffic between the Flask app and PostgreSQL is allowed because both sides live on the same machine. That's a clean and conservative setup.

## TLS certificates — the part that needs maintenance

The website uses a free TLS certificate from **Let's Encrypt** so browsers see a green padlock. Let's Encrypt certificates only last 90 days, so they have to be renewed automatically by a tool called **certbot**.

Here's what the snapshot showed:

- **Current certificate** for `nfhistory.nanofab.utah.edu` expires **June 23, 2026** — about **24 days** away as of the survey.
- **certbot is set up to auto-renew it** twice a day (a "timer" runs at noon and midnight). It runs whether or not the cert actually needs renewing; Let's Encrypt only issues a new one when the existing one is within 30 days of expiry.
- The last renewal check happened just over an hour before the survey. Healthy.

You shouldn't have to touch this. But if something ever breaks the renewal (a network change, a misconfigured nginx, an expired Let's Encrypt account), the website starts throwing scary browser warnings 30 days later. Worth checking the expiry date once a month as a habit.

The server also has old, expired copies of previous certificates stored in `/etc/letsencrypt/archive/`. That's normal — Let's Encrypt's tooling keeps an archive — and isn't a problem.

## What's auto-managed

Lots of small things just *happen* on this server without anyone watching:

- **Log files** (web traffic logs, certbot logs, PostgreSQL logs) are rotated daily or weekly, compressed, and old ones deleted, so the disk doesn't fill up.
- **Certificate renewal** runs twice a day, as above.
- **System statistics** are collected every 10 minutes for later inspection.
- **Apt** (Debian's package manager) checks for available updates daily — but **it doesn't apply them automatically on the box itself.** University IT runs base patching out-of-band; enabling an on-box layer too would be an IT conversation.
- **Filesystem maintenance** (`fstrim`, `e2scrub`) runs weekly to keep the disk healthy.

This is all stock Debian behavior. Whoever installed the server didn't have to set most of it up; it came with the OS.

## What's NOT auto-managed (the surprises)

Several things in the survey are missing in ways a future maintainer should know about.

### Surprise #2: the website and downloader aren't supervised.

The Flask web app and the HSCDownloader (the data-pulling script) are running, but **nothing is watching them.** They live inside tmux sessions, which are essentially "saved terminals." If either program crashes, tmux just leaves an idle prompt sitting there — the website goes down silently until someone notices. There is no automatic restart and no alert.

The fix would be to convert them to "systemd services," the same way nginx and PostgreSQL are managed. That's a small project that would eliminate most ways the site can break silently.

### Surprise #3: the backups are run by IT, not on the box itself.

The survey found no backup tools installed locally and no backup cron jobs *on `nfhistory`* — but the actual base backup runs **off** the box, managed by **university IT**. The Nanofab team has visibility into IT's backup scope but doesn't run the pipeline. So if the disk failed today, IT could restore the VM; you'd open a ticket, not type a restore command yourself.

This means three things in practice:
- The catastrophic-loss scenario is already mitigated. The original survey-time backup gap was wrong because the survey can't see what IT runs from outside.
- **You should confirm with IT exactly what's in the snapshot** — at minimum the four SQLite databases under `~/server/UNanofabTools/instance/`, the `uploads/`, `LogData/`, and `HSCDATA/` trees under that install, and the local PostgreSQL data directory. Once confirmed, write the answer into the live-server doc so the next maintainer doesn't have to ask again.
- A **Nanofab-owned secondary backup tier** — say, a nightly local `pg_dump` plus a `restic` push to a Nanofab-controlled destination — is a reasonable thing to consider later if IT's restore SLA isn't fast enough for the team's tolerance. Not urgent.

### Surprise #4: SSH lets root in — but that's IT's access path.

The server's SSH config allows the `root` account to log in remotely (with a key — not a password). There's an active root key from a machine called `iceolate.eng.utah.edu`.

The earlier `serveraccess` docs only described the Nanofab path (laptop → CADE → `phelan@nfhistory`); they didn't mention root because the Nanofab team doesn't use it. **`iceolate` is IT's administrative host**, and root SSH is there because IT needs it for the maintenance they own (kernel patching, the backup pipeline). It's intentional and shouldn't be modified by the Nanofab team — touching `/root/.ssh/authorized_keys` or changing `PermitRootLogin` would lock IT out.

There is one small thing worth flagging back: the file that lists which keys can log in as root is set to be readable by other users. It should be private. Since `/root/` is IT-owned, the right path is **open a ticket with IT** asking them to tighten the permissions, not to fix it yourself.

### Surprise #5: unattended security upgrades aren't configured on the box.

Debian has a built-in feature ("unattended-upgrades") that quietly installs security patches in the background. It isn't enabled *on `nfhistory` itself*. **IT does run security patching out-of-band**, so the box isn't unpatched in practice — but if you want a second layer or want to see the apply happen in `journalctl`, that's a conversation with IT, not a `sudo apt install unattended-upgrades` Nanofab-side fix-it-and-forget-it.

### Surprise #6: there's a leftover `apache2` ghost.

The systemd service manager shows one "failed" unit: `apache2`. Apache (a different web server) isn't actually installed anymore; what's failing is a leftover reference. It's harmless noise, but it muddies the "is everything healthy?" view.

### Surprise #7: PHP is running and probably shouldn't be.

A program called PHP-FPM is running. This is a tool for running PHP-language websites. Nothing on `nfhistory` is written in PHP. It's probably leftover from initial setup and could be removed to free up a small amount of memory.

### Surprise #8: plain HTTP doesn't redirect to HTTPS.

If someone types `http://nfhistory.nanofab.utah.edu` (without the "s"), they currently see the default Debian welcome page instead of being redirected to the real, secure site. That's a 30-second nginx config fix and worth doing.

## The healthy parts

The above list might look long, but quite a lot is in good shape:

- The OS is current (Debian 13 from 2025, kernel 6.12).
- The TLS cert chain is being renewed automatically and is well within its valid window.
- nginx, PostgreSQL, sshd are all running cleanly with no errors recently.
- Log rotation is working (nginx access logs are being archived daily, kept for 14 days).
- The firewall is conservative and correctly configured.
- SSH password authentication is disabled across the board (key-only). Root SSH is allowed by key for IT (`PermitRootLogin without-password`) but never by password.
- The disk is barely 31% full.
- No services have failed unexpectedly except the apache2 ghost.

So: the boring infrastructure is solid. The real gap that the Nanofab team can close on its own is service supervision — nothing watches the Flask app or the downloader. Backups, root SSH, and unattended-upgrades all sit on **IT's side of the line** (more on that below).

## Who owns what (the IT / Nanofab line)

`nfhistory` is jointly operated, and the boundary matters for everything in this doc:

- **University IT owns:** the VM itself, the `root` account, the off-host backup pipeline, security patching (out-of-band), the SSH key in `/root/.ssh/authorized_keys` from `iceolate.eng.utah.edu`. The Nanofab team does **not** have root and **cannot** create UNIX accounts.
- **The Nanofab team owns:** the Flask web app, the HSCDownloader, the local PostgreSQL chemical-inventory database, everything under `/home/phelan/` (including the data trees), and the nginx `untools` vhost. Admin tasks from the Nanofab side run as `phelan` with `sudo`.

That boundary is why "let me create per-person UNIX accounts" isn't an option — only IT can do that, so the shared `phelan` model isn't a fixable Nanofab finding, it's the structural reality. Likewise the root SSH access from `iceolate` is intentional and shouldn't be touched. Several earlier recommendations in this guide and elsewhere have been recast to reflect this.

## A note on this survey

The first script run was the `root`-side system view; the follow-up `phelan` run discovered the live install path and tmux sessions. Some `phelan`-owned details still need one more run with the patched survey script — the Flask app's virtual environment, `.env` key names, SQLite databases, and data-tree sizes. The matching successor doc explains how to re-run as `phelan` and fold those details in.

## In short

The cleanroom server is a small, lightly-loaded Debian box that does its job well. nginx handles the public side; PostgreSQL and the Flask app run privately on the same machine. The TLS cert is renewed automatically and is currently 24 days from rolling over. The base backup is run off the box by IT; the main Nanofab-side gap is that nothing supervises the Flask app, so a crash leaves the site dark until a human notices. A handful of small cleanups (PHP-FPM, apache2 ghost, HTTP→HTTPS redirect) round out the Nanofab punch list. Anything involving root, backup pipelines, or new UNIX accounts goes through IT.


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/liveserver/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Live Server — `nfhistory` Inventory & Maintenance

Formal reference for **what is currently running on the cleanroom server**, as opposed to what the source code says *should* be there. Companion to:

- the access procedure: `documentation/UNanofabTools/serveraccess/README.md` (repo path: documentation/UNanofabTools/serveraccess/README.md)
- the layman version of this doc: `presentation/UNanofabTools/liveserver/README.md` (repo path: presentation/UNanofabTools/liveserver/README.md)
- the deployment intent: `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md` (repo path: documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md)
- the maintenance to-do list surfaced by this snapshot: `known-issues/UNanofabTools/liveserver.md` (repo path: known-issues/UNanofabTools/liveserver.md)

The values below combine two real survey captures by `survey_nfhistory.sh` (repo path: documentation/UNanofabTools/liveserver/survey_nfhistory.sh): a **2026-05-29** run as `root` (`snapshots/nfhistory_survey_root_2026-05-29.txt` (repo path: documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_root_2026-05-29.txt)) and a **2026-06-01** run as `phelan` (`snapshots/nfhistory_survey_phelan_2026-06-01.txt` (repo path: documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_2026-06-01.txt)). Use the raw outputs to re-check any populated table.

> **Caveat about the current snapshots.** The root run could not inspect `phelan`'s home. The 2026-06-01 `phelan` run discovered the live install path and tmux state, but still missed the venv / `.env` / SQLite / data-tree sections because the script still had the older install path baked in. The script has since been patched; re-run it as `phelan` and fold the missing sections into this doc — see §11 and §17 below.

## 0. Findings at the top

A condensed mirror of `known-issues/UNanofabTools/liveserver.md` (repo path: known-issues/UNanofabTools/liveserver.md). The numbers below intentionally match that file so cross-references stay stable.

> **Boundary of responsibility.** `nfhistory` is jointly operated. University IT owns the VM, root, the off-host backup pipeline, and unattended-upgrades-style patching. The Nanofab team owns the Flask app, the HSCDownloader, the local PostgreSQL chem database, the cleanroom data trees, and everything under `/home/phelan/`. Nanofab admin actions run as `phelan` with `sudo`; the Nanofab team **cannot** create UNIX accounts and **cannot** modify `/root/`. Several findings below land on IT's side of the line and are flagged that way — they're not Nanofab to-do items, they're IT tickets.

1. **Backups are IT-managed off the box.** No Nanofab-side backup tooling was found locally, but the base VM backup is run by University IT. Confirm IT's scope and document it in §13; a Nanofab-owned secondary tier is optional.
2. **Neither the Flask app nor HSCDownloader runs under a process supervisor.** Both live in tmux sessions (`flaskserver` and `downloader`), not systemd. This is the top Nanofab-owned reliability fix.
3. **Root SSH is IT's access path.** `PermitRootLogin without-password` is enabled with one active key from `root@iceolate.eng.utah.edu`; `iceolate` is IT's administrative host. Do not modify this path without IT.
4. **`/root/.ssh/authorized_keys` is mode `-rw-rw-r--`.** The Nanofab team does not own `/root/`; open an IT ticket asking for `chmod 600` and a deploying-umask check.
5. **No `unattended-upgrades` configuration is present on the box itself.** IT likely patches out-of-band; confirm whether they want an on-box unattended-upgrades layer too.
6. **The chem PostgreSQL database is local on this VM.** It is `postgresql@17-main` listening on `127.0.0.1:5432`; the core Flask docs now reflect this live state.
7. **Plain HTTP on `:80` does not redirect to HTTPS.** The default Debian welcome page is served instead. Nanofab can fix this with an nginx redirect.
8. **A phantom `apache2.service` is in failed state.** Apache is not installed; this is unit-file noise to clear.
9. **`php8.4-fpm` is running but unused.** Nothing on the cleanroom site appears to need PHP.
10. **The current TLS cert expires 2026-06-23 (24 days from the root snapshot).** certbot's timer is healthy; no action beyond normal monitoring.
11. **No outbound notification mechanism exists.** No MTA or webhook path is present, so future failures cannot alert a human automatically.
12. **`wpa_supplicant.service` is running on a wired server.** Low-priority cleanup.
13. **Vestigial desktop daemons are running.** Low-priority cleanup.
14. **A hand-installed `python3.12` exists in `/usr/local/bin`.** Trace ownership before removing or documenting it.
15. **Long uptime / no recent reboot.** Coordinate a controlled reboot with IT after #2 is fixed so services return automatically.
16. **`wtmpdb` history starts only in May 2026.** Low-priority retention note.
17. **Survey path mismatch left some `phelan`-side sections blank.** The script is patched; re-run it as `phelan` and fold in venv / `.env` / SQLite / data-tree details.
18. **Root SSH ingress from `155.98.110.9` is IT.** This matches `iceolate.eng.utah.edu`; no action.
19. **A stale `vim HSCDownloader.py` is open in the `downloader` tmux session.** Close it on the next attach.
20. **Multiple `phelan` authorized keys share the `u0911926@utah.edu` comment.** Clarify or prune during the next key audit.
21. **One `phelan` authorized key has the generic `rsa-key-20250917` comment.** Re-attribute it.
22. **`phelan` has an outbound SSH identity whose purpose is undocumented.** Trace and document what it is used for.

Highest Nanofab-owned priorities: #2, #7, #11, and #17. Batch cleanup/audit items #8, #9, #12, #13, #14, #16, and #19-#22. IT-bound/context items are #1, #3, #4, #5, #15, and #18. Items #6 and #10 are verified inventory facts to keep current.

## 1. Operating system & base

| Item | Value |
|------|-------|
| OS | Debian GNU/Linux 13 (trixie), point release 13.4 |
| Kernel | `Linux 6.12.38+deb13-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.12.38-1 (2025-07-16) x86_64` |
| Timezone | `America/Denver` (MDT, -0600) |
| NTP service | Active (`systemd-timesyncd`); system clock synchronized |
| Uptime at capture | 290 days, 23h 37m (so last boot: ~2025-08-12) |
| Last reboots visible in `wtmpdb` | `wtmpdb begins Wed Jan 7 13:59:11 2026` — older history not retained |

## 2. Hardware / resources

| Item | Value |
|------|-------|
| CPU | Intel Xeon Gold 5217 @ 3.00 GHz, x86_64, **1 vCPU** (single core, single thread) |
| Memory | 5.8 GiB total · 950 MiB used · 1.2 GiB free · 4.0 GiB buff/cache · 4.9 GiB available |
| Swap | 1.7 GiB total · effectively unused (268 KiB) |
| Root filesystem | `/dev/sda2` ext4, **29 GB total / 8.5 GB used (31%) / 19 GB free** |
| EFI partition | `/dev/sda1` vfat, 975 MB total, mounted at `/boot/efi` |

This is a small VM. Memory and CPU headroom are comfortable for the current load; disk has plenty of room for now.

## 3. Networking

| Item | Value |
|------|-------|
| Public interface | `ens33` |
| Public IPv4 | `155.98.11.8/25` |
| IPv6 | `fe80::250:56ff:febe:63a6/64` (link-local only) |
| Default gateway | `155.98.11.1` via `ens33` |
| DNS resolver | `155.98.111.144` (managed by NetworkManager) |
| hostname | `nfhistory` |
| hostname -f | `nfhistory.nanofab.utah.edu` |
| `/etc/hosts` | `155.98.11.8 nfhistory.nanofab.utah.edu nfhistory` |

### 3.1 Listening sockets (from `ss -tlnp`)

| Port | Bound to | Process | Notes |
|------|----------|---------|-------|
| 443/tcp | `0.0.0.0` | `nginx` (master pid 1432604, worker 2524390) | HTTPS — public |
| 80/tcp | `0.0.0.0` and `[::]` | `nginx` (same pids) | HTTP — public, **no redirect — see finding #7** |
| 22/tcp | `0.0.0.0` and `[::]` | `sshd` (pid 2263034) | OpenSSH — public |
| 5000/tcp | `127.0.0.1` | `python` (pid 2665755) | The Flask app — localhost only |
| 5432/tcp | `127.0.0.1` and `[::1]` | `postgres` (pid 1908562) | **Chem inventory DB — localhost only — see finding #6** |

### 3.2 Firewall (nftables)

`ufw`, `firewalld`, and `iptables` are all not installed. The active firewall is `nftables`:

```nft
table inet filter {
    chain input {
        type filter hook input priority filter; policy drop;
        iifname "lo" accept
        ct state established,related accept
        ct state invalid drop
        tcp dport 22 accept
        tcp dport 80 accept
        tcp dport 443 accept
    }
    chain forward { type filter hook forward priority filter; policy accept; }
    chain output  { type filter hook output  priority filter; policy accept; }
}
```

Clean default-deny inbound; loopback unrestricted; only 22/80/443 reachable from the network. This is exactly what should be there.

## 4. TLS / certificates ⚠ recurring maintenance

### 4.1 Live cert (what a browser sees)

```
subject:    CN=nfhistory.nanofab.utah.edu
issuer:     C=US, O=Let's Encrypt, CN=E7
notBefore:  Mar 25 02:33:02 2026 GMT
notAfter:   Jun 23 02:33:01 2026 GMT
```

That's **24 days remaining at snapshot time**. Standard 90-day Let's Encrypt cert.

### 4.2 Cert paths in use

From `/etc/nginx/sites-enabled/untools`:
- `ssl_certificate /etc/letsencrypt/live/nfhistory.nanofab.utah.edu/fullchain.pem;`
- `ssl_certificate_key /etc/letsencrypt/live/nfhistory.nanofab.utah.edu/privkey.pem;`

The `live/` directory is a symlink farm into `archive/`. Renewals create new `cert<N>.pem`/`fullchain<N>.pem` files and re-point the symlinks. Several older numbered copies are still in `archive/` — that's normal and not a problem.

### 4.3 Renewal automation

| Item | Value |
|------|-------|
| Mechanism | `certbot.timer` (systemd timer) + `/etc/cron.d/certbot` (no-op under systemd) |
| Cadence | Twice daily, randomized within the period |
| Next firing | `Fri 2026-05-29 12:54:51 MDT` (31 minutes after capture) |
| Last run | `Fri 2026-05-29 11:10:02 MDT` (1h 13m before capture) |
| certbot version | `4.0.0-2` (from dpkg) |
| Account | `acme-v02.api.letsencrypt.org` (production) + staging account exists |
| Renewal conf | `/etc/letsencrypt/renewal/nfhistory.nanofab.utah.edu.conf` |

No deploy/pre/post hooks are configured under `/etc/letsencrypt/renewal-hooks/`. nginx is not reloaded by a hook; it presumably picks up the new cert on its next scheduled reload, or `certbot` calls `systemctl reload nginx` directly via its packaged config. Worth verifying once.

## 5. nginx

| Item | Value |
|------|-------|
| Version | `nginx/1.26.3` (Debian `1.26.3-3+deb13u2`) |
| OpenSSL (build vs run) | built 3.5.4 / running 3.5.5 |
| Service status | Active (running) since `Tue 2026-02-24 12:09:20 MST` (3 months) |
| Worker model | `worker_processes auto; worker_connections 768;` |
| User | `www-data` |
| Logs | access at `/var/log/nginx/access.log`; error at `/var/log/nginx/error.log` |
| Rotation | daily, keep 14, compressed (see §7) |
| Error log tail | empty during capture window |
| Vhosts enabled | `/etc/nginx/sites-enabled/default` and `/etc/nginx/sites-enabled/untools` |
| TLS protocols allowed | `TLSv1.2 TLSv1.3` (SSLv3, TLSv1.0, TLSv1.1 dropped) |
| `server_tokens` | off (no version leak) |

### 5.1 The `untools` vhost

```nginx
server {
    listen 443 ssl;
    server_name nfhistory.nanofab.utah.edu;

    ssl_certificate     /etc/letsencrypt/live/nfhistory.nanofab.utah.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nfhistory.nanofab.utah.edu/privkey.pem;

    location = /chem {
        return 308 /chem/;
    }

    location ^~ /chem/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_redirect off;
    }
}
```

The `^~ /chem/` and root `/` both pass to `127.0.0.1:5000`. The split exists so a future change can route `/chem/*` to a different upstream without affecting the rest of the site.

### 5.2 The `default` vhost (problem)

The Debian stock `default` site is still enabled on port 80. It serves `/var/www/html/index.nginx-debian.html` (or returns 404). There is no `return 301 https://$host$request_uri;` block. Users typing `http://nfhistory.nanofab.utah.edu/` get the default Debian welcome page instead of being redirected to the real site. **Finding #7.**

### 5.3 Recent access-log volume

`/var/log/nginx/access.log` rotated copies range ~60 KB to ~260 KB per day compressed — light traffic. 14-day retention is plenty.

## 6. Systemd services

### 6.1 Running services (filtered)

| Service | Why it's there |
|---------|----------------|
| `nginx.service` | Reverse proxy |
| `postgresql@17-main.service` | Chemical inventory database (LOCAL — finding #6) |
| `ssh.service` | Remote access |
| `cron.service` | Scheduled jobs (certbot etc.) |
| `systemd-timesyncd.service` | NTP |
| `NetworkManager.service` | Networking |
| `php8.4-fpm.service` | **Unused — finding #9** |
| `wpa_supplicant.service` | Wi-Fi supplicant — likely vestigial on a server |
| `accounts-daemon`, `colord`, `polkit`, `power-profiles-daemon`, `udisks2`, `upower`, `switcheroo-control`, `rtkit-daemon`, `low-memory-monitor` | Stock desktop-environment-flavored leftovers from the Debian install; harmless, low memory |
| `dbus`, `systemd-journald`, `systemd-logind`, `systemd-udevd`, `systemd-timedated`, `user@1000.service` | Standard systemd plumbing |

23 services running total.

### 6.2 No cleanroom service units

A grep for `flask|nanofab|nfhistory|chem|hsc|downloader|gunicorn` against `systemctl list-unit-files` returned **no matches**. The Flask app and HSCDownloader are **not** managed by systemd — they live in tmux only. **Finding #2.**

### 6.3 Failed units

```
apache2.service  not-found  failed  failed  apache2.service
```

`apache2` is not installed; this is a stale unit reference. Clear with `systemctl disable --now apache2 2>/dev/null; systemctl reset-failed apache2`. **Finding #8.**

### 6.4 Timers

| Timer | Cadence | Last run | Activates |
|-------|---------|----------|-----------|
| `certbot.timer` | 2×/day | 2026-05-29 11:10:02 | Cert renewal |
| `apt-daily.timer` | daily | 2026-05-29 09:56:01 | apt update (no upgrade) |
| `apt-daily-upgrade.timer` | daily | 2026-05-29 06:26:30 | upgrade (no-op without unattended-upgrades config — finding #5) |
| `logrotate.timer` | daily | 2026-05-29 00:50:48 | Log rotation |
| `dpkg-db-backup.timer` | daily | 2026-05-29 00:00:07 | dpkg DB backup (not data backup) |
| `fwupd-refresh.timer` | every ~24h | 2026-05-29 11:35:37 | Firmware update DB refresh |
| `phpsessionclean.timer` | every 30m | 2026-05-29 12:09:02 | Old PHP-session cleanup (unused) |
| `anacron.timer` | hourly | 2026-05-29 11:33:12 | Catch missed cron jobs |
| `man-db.timer` | daily | 2026-05-29 09:31:21 | Rebuild man-page index |
| `systemd-tmpfiles-clean.timer` | daily | 2026-05-28 15:18:14 | `/tmp` cleanup |
| `e2scrub_all.timer` | weekly | 2026-05-24 03:11:02 | Filesystem health |
| `fstrim.timer` | weekly | 2026-05-25 01:10:41 | TRIM for SSD |

### 6.5 The non-systemd long-running services (from the 2026-06-01 phelan snapshot)

The Flask app and HSCDownloader are kept alive by tmux, not systemd. Confirmed live state:

| tmux session | Created | Panes / processes | Working dir |
|--------------|---------|-------------------|-------------|
| `flaskserver` | Tue Nov 4 2025 16:11:52 | pane 1 → `python` (pid 319076); pane 2 → `bash` (pid 2261577) | `/home/phelan/server/UNanofabTools` (pane 1); `/home/phelan` (pane 2) |
| `downloader` | Wed Aug 27 2025 16:38:22 | pane 1 → `vim HSCDownloader.py` (pid 71953); pane 2 → `python3` running `HSCDownloader.py` (pid 48188) | `/home/phelan/server/UNanofabTools` |

The actual listener processes (live `ps` output filtered to `phelan`):

| pid | uptime | command | what |
|-----|--------|---------|------|
| `2665755` | 13d 21h | `python run.py` | The Flask app — bound to `127.0.0.1:5000`. This is what nginx proxies to. |
| `323636` | 187d 17h | `python3 HSCDownloader.py` | The downloader. Note: uses `python3`, not `python`. |
| `71953` | 257d 22h | `vim HSCDownloader.py` | Stale editor session in the `downloader` tmux — see known-issues #19. |

The pid in the listener (2665755) doesn't match the tmux pane pid (319076) for `flaskserver` because the running Flask process predates the current pane's shell — a previous tmux pane that's since been replaced started it. Functionally, the website is alive; structurally, this is normal for a long-running tmux-supervised setup. Once the services are under systemd (finding #2), this kind of pid drift goes away.

## 7. Log rotation

`/etc/logrotate.d/` contents and per-package policy:

| Drop-in | Path(s) | Cadence | Keep | Compress |
|---------|---------|---------|------|----------|
| `nginx` | `/var/log/nginx/*.log` | daily | 14 | yes (delay) |
| `certbot` | `/var/log/letsencrypt/*.log` | weekly | 12 | yes |
| `postgresql-common` | `/var/log/postgresql/*.log` | weekly | 10 | yes (delay) |
| `php8.4-fpm` | `/var/log/php8.4-fpm.log` | weekly | 12 | yes (delay) |
| `apt` | `/var/log/apt/{term,history}.log` | monthly | 12 | yes |
| `alternatives`, `dpkg` | monthly | 12 | yes (delay) |
| `bootlog`, `sane-utils` | daily | 7 | yes |
| `btmp`, `wtmp`, `wtmpdb` | monthly/yearly | 1/4 | no |
| `ppp` | weekly | 4 | yes |

Global default in `/etc/logrotate.conf`: weekly, keep 4, no compression. Individual drop-ins override as above.

**There is no rotation entry for any Flask app log or HSCDownloader log.** If those programs log to a file (the survey couldn't see them from root), they will grow without bound. Address when re-running as `phelan`.

## 8. Patching

| Item | Value |
|------|-------|
| `apt-daily.timer` and `apt-daily-upgrade.timer` | active |
| `unattended-upgrades` config (`20auto-upgrades`) | **not present** on the box — finding #5 |
| `50unattended-upgrades` | **not present** on the box |
| `apt list --upgradable` at capture | empty (no pending) |
| `needrestart` | not installed |

apt is checking for updates but not installing them automatically *on the box itself*. **University IT runs patching out-of-band** (this is part of their VM management); the Nanofab team should confirm IT's scope and decide with them whether to also enable `unattended-upgrades` here. Kernel updates require a reboot after install; once finding #2 (systemd-managed Flask + downloader) is in place, a reboot is safe because the services come back automatically.

## 9. SSH posture

OpenSSH version: `OpenSSH_10.0p2 Debian-7+deb13u2, OpenSSL 3.5.5 27 Jan 2026`.

Effective `sshd -T` highlights:

| Setting | Value | Note |
|---------|-------|------|
| `port` | 22 | |
| `permitrootlogin` | `without-password` | **Finding #3** — IT-owned root key path |
| `passwordauthentication` | `no` | ✓ key-only |
| `pubkeyauthentication` | `yes` | ✓ |
| `kbdinteractiveauthentication` | `no` | ✓ |
| `permitemptypasswords` | `no` | ✓ |
| `x11forwarding` | `yes` | likely unused, low risk |
| `allowtcpforwarding`, `allowagentforwarding` | `yes` | defaults |
| `maxauthtries` | 6 | |
| `maxsessions` | 10 | |
| `usepam` | yes | |
| `clientaliveinterval` | 0 | no keepalive — sessions can linger |
| `usedns` | no | ✓ (faster auth) |

### 9.1 Root account's authorized keys — IT-owned

```
/root/.ssh/   (mode drwx------ root:root)
authorized_keys   mode -rw-rw-r--   (445 bytes, owner root:root)
  2048 SHA256:goTi8zTLdq6Pe8l/AMz/0kPCH28y7KMqT8m/LGloVbU root@iceolate.eng.utah.edu (RSA)
```

`iceolate.eng.utah.edu` is **university IT's administrative access host**. Root SSH on `nfhistory` is intentional and required for IT-side maintenance (kernel patching, the off-host backup pipeline). The key in `/root/.ssh/authorized_keys` belongs to IT — the Nanofab team **does not modify or revoke it**. If `iceolate` changes its key, IT will install the new one.

The file mode is `-rw-rw-r--` (world-readable), which is a small information leak (anyone with a shell can see which key authorizes root). Since `/root/` is IT-owned, the fix is to **open a ticket with IT** asking them to `chmod 600 /root/.ssh/authorized_keys` and to investigate the deploying tool's umask. **Finding #4.**

### 9.2 Recent logins

`last` output covers May 8 → May 29 2026. Pattern:

- `phelan` from `155.98.111.{59,89,125}` — CADE-pool addresses, consistent with the documented Nanofab access path (laptop → CADE → `nfhistory`).
- `root` from `155.98.110.9` — this is **IT's administrative host** (the same `iceolate.eng.utah.edu` per the key comment in §9.1). Routine IT maintenance, three sessions in May totaling under 40 minutes. Not unaccounted access.

`wtmpdb begins Fri May 8 13:15:36 2026`, so older login history is not retained. Consider raising the retention if forensic timeline ever matters.

### 9.3 `phelan`'s authorized keys (from the 2026-06-01 phelan snapshot)

```
/home/phelan/.ssh/   (mode drwxr-x--- phelan:phelan)
authorized_keys       mode -rw------- (1035 bytes, owner phelan:phelan)   ✓ correctly 600
id_ed25519            mode -rw------- (411 bytes)        ✓ correctly 600
id_ed25519.pub        mode -rw-r--r-- (99 bytes)
known_hosts           mode -rw------- (1562 bytes)
known_hosts.old       mode -rw-r--r-- (142 bytes)
```

Seven keys are trusted to log in as `phelan`:

| Fingerprint | Type | Comment |
|-------------|------|---------|
| `SHA256:f/THYYK14vhnmVJVzDVsi/kcshWuLEan4xKmXAPWBKI` | ED25519 | `u0911926@utah.edu` |
| `SHA256:Dxwbd+6cD4JH/beDahvEKagAb69ELr0CKdeKbEVEIkA` | ED25519 | `u0911926@utah.edu` |
| `SHA256:/AmVN0CiT8MJuyHEnu3KA31GRVzatv4YTzR8qUQBL1Q` | ED25519 | `u0911926@utah.edu` |
| `SHA256:hX4b47xntr725o3U5r9nPi8EaDvBTlXlSHpwpWUPvZk` | ED25519 | `cade-to-nfhistory` |
| `SHA256:ytvtvJV+1mkY48sQDvHp/9vU1tv/95rgeGuAQfQWrTM` | RSA 2048 | `rsa-key-20250917` |
| `SHA256:VmQRwiTuDsvWoK7kyCkBOvLVPcxdwe5hAsIbBM3QJQQ` | ED25519 | `u6048391@utah.edu` |
| `SHA256:CZb00Mvy/WdN0cJ2ULTGWBQtAXGsi4GrBdL2KmSjT70` | ED25519 | `cade-to-nfhistory` |

Three identities present:

- **`u0911926@utah.edu`** — three keys. Likely multiple devices or generations for one person; consider pruning to one when next-rotating.
- **`u6048391@utah.edu`** — one key, one person.
- **`cade-to-nfhistory`** — two generic-comment keys. These are the ones used for the documented CADE → `nfhistory` hop; both should be retained as long as `cade-to-nfhistory` is the access mechanism.
- **`rsa-key-20250917`** — one 2048-bit RSA key generated Sept 2025. Comment is generic; would benefit from clearer attribution.

`phelan` also has its own SSH **identity keypair** (`id_ed25519` / `id_ed25519.pub`) — meaning the box can SSH *out* to somewhere as well. Worth confirming what that's used for and documenting it. Likely candidates: pulling code from a git remote, or pushing data to a research-storage host.

`~/.ssh/known_hosts` is populated (1562 bytes) — consistent with outbound SSH having been used. `known_hosts.old` is a smaller (142 byte) backup from earlier.

## 10. PostgreSQL (chem inventory) — LOCAL

The survey **confirms** PostgreSQL is on this same machine:

| Item | Value |
|------|-------|
| Version | PostgreSQL 17.9 (Debian 17.9-0+deb13u1) |
| Service unit | `postgresql@17-main.service` (active) |
| Bind | `127.0.0.1:5432` and `[::1]:5432` (localhost only) |
| Listener PID | 1908562 |

Connection details from the Flask app's `.env` were not captured by either survey run yet. The root-side run couldn't read `phelan`'s home; the first phelan-side run looked for the pre-correction install path instead of `~/server/UNanofabTools/.env`. The script has been patched and the next `phelan`-side run will fill this in. The Flask config (`config/config.py`) defaults `CHEM_PGHOST` to `localhost`, which is consistent with what's bound.

**Live DB inventory (table list, sizes, row counts) was not captured** — re-run as `phelan` to populate. The known-issues file flags the schema-drift question against `chem_schema.sql` + `chem_schema_migration_v2.sql`.

## 11. Things the current snapshots still did not capture

The following sections are still blank or incomplete. The root run could not read `phelan`'s home; the first `phelan` run still looked for the pre-correction install path for some sections. Re-run the patched script as `phelan` to populate them:

- Python venv at `~/server/UNanofabTools/venv` (or `.venv`) and its `pip freeze`. There is no separate HSCDownloader install directory — `HSCDownloader.py` is co-located in the same directory as `run.py`.
- Drift between the live venv and the committed `requirements.txt`.
- Flask app file tree (`~/server/UNanofabTools/instance`, `~/server/UNanofabTools/.env` key names, recent app logs).
- SQLite databases (sizes, table lists, row counts).
- Live chem DB inventory (`\dt`, sizes — requires reading `.env`).
- Data trees: `LogData/`, `HSCDATA/`, `uploads/` sizes and freshness.
- tmux sessions for `phelan` (root sees `/tmp/tmux-0/`, phelan's are at `/tmp/tmux-1000/`).
- `phelan`'s `authorized_keys` (different from root's, listed in §9).

Next run: `ssh nfhistory` as `phelan`, then `bash ~/survey_nfhistory.sh | tee /tmp/nfhistory_survey_phelan_$(date +%F).txt`. Once it's in `snapshots/`, fold the new sections into §10 and the rest below.

## 12. Installed packages of interest

| Package | Version | Notes |
|---------|---------|-------|
| `nginx` / `nginx-common` | `1.26.3-3+deb13u2` | OK |
| `postgresql-17` / `postgresql-client-17` | `17.9-0+deb13u1` | OK |
| `python3` / `python3.13` | `3.13.5-1` / `3.13.5-2` | OK |
| `sqlite3` | `3.46.1-7+deb13u1` | OK |
| `tmux` | `3.5a-3` | OK |
| `certbot` / `python3-certbot` / `python3-acme` / `python3-josepy` | `4.0.0-2` | OK |
| `openssh-server` / `openssh-client` / `openssh-sftp-server` | `1:10.0p1-7+deb13u2` | OK |
| `cron` / `logrotate` | `3.0pl1-197` / `3.22.0-1` | OK |
| `python3-cryptography`, `python3-bcrypt`, `python3-cffi-backend` | misc | system-level; the Flask app likely uses its own venv copies |

Three Python interpreters are present:

```
python3      -> /usr/bin/python3       -> Python 3.13.5
python3.12   -> /usr/local/bin/python3.12 -> Python 3.12.0   ← built/installed by hand somewhere
python3.13   -> /usr/bin/python3.13    -> Python 3.13.5
```

The hand-installed `python3.12` under `/usr/local/bin` is worth a note — find out why it's there, whether anything depends on it, and document or remove.

## 13. Backups

**On-box: none. Off-box: handled by university IT.**

What the survey *can* see (nothing local):
- No `borg`, `restic`, `duplicity`, `rsnapshot`, `bacula`, `amanda`, `rdiff-backup` installed.
- No `rsync`/`scp` cron jobs.
- `/var/backups` contains only the Debian-stock backups of `alternatives`, `apt.extended_states`, and similar metadata. **Not data backups.**
- `dpkg-db-backup.timer` is firing daily — backs up the dpkg DB, not anything cleanroom.

What the survey *cannot* see (handled off-host by IT):
- University IT operates a VM-level backup of `nfhistory`. The Nanofab team does not run it and cannot see it from inside the VM. The catastrophic-loss scenario (disk fails or VM lost) is therefore already mitigated.
- **Action item for the next maintainer:** confirm the scope with IT and write it in here. Specifically:
  - cadence (likely nightly snapshot + weekly retention; verify)
  - retention window (how many days/weeks/months back you can request a restore for)
  - what's included — at minimum the Nanofab team wants confirmation that `/home/phelan/` (the SQLite DBs in `instance/`, `uploads/`, `LogData/`, `HSCDATA/`) **and** the local PostgreSQL data dir (typically `/var/lib/postgresql/17/main/`) **and** `/etc/letsencrypt/` are inside the snapshot.
  - restore procedure — who to call, how long the SLA is, whether file-level vs. whole-VM restore is possible.
- Once the above is confirmed, replace this list with the actual answers so a future maintainer doesn't have to ask again.

What the Nanofab team could add (optional second tier):
- A nightly `pg_dump cheminventory` into `/home/phelan/backups/` for a quick local restore that doesn't require an IT ticket.
- A Nanofab-owned `restic` or `borg` push to a Nanofab-controlled destination (research-storage NFS, a Nanofab-owned object store) for independence from IT's pipeline.
- Only worth building if the IT restore SLA is too slow for the Nanofab team's tolerance.

**Finding #1** (recast as Low / future option once IT scope is confirmed).

## 14. Outbound notifications / mail

No `sendmail`, `msmtp`, `postfix`, `exim`, `ssmtp` installed. `postfix` and `exim4` both reported `inactive` to `systemctl is-active`. There is no path for the box to email a human when something breaks. **Finding #11.**

## 15. Cron jobs

User crontab for `root`: empty.

`/etc/cron.d/` files inspected:
- `anacron` — daemon kick (under systemd this is a no-op)
- `certbot` — `0 */12 * * * root … certbot -q renew …` (no-op under systemd; `certbot.timer` is the live mechanism)
- `e2scrub_all` — filesystem checks
- `php` — old PHP-session cleanup (works against the `php8.4-fpm` install)
- `sysstat` — `5-55/10 * * * *` and `59 23 * * *` for `sa1`/`sa2` activity metrics

`/etc/cron.{hourly,daily,weekly,monthly}` contents are stock: `0anacron`, `apt-compat`, `dpkg`, `logrotate`, `man-db`, `sysstat`.

**No cleanroom-specific cron entries.** The Flask app and HSCDownloader don't have any scheduling — both rely on long-running loops inside their tmux sessions.

## 16. Performance baseline at snapshot

- Uptime: 290 days 23 hours
- Load average: 0.00 / 0.00 / 0.00 (idle)
- Memory: 950 MiB used of 5.8 GiB
- Disk: 8.5 GB used of 29 GB
- nginx process memory: 9.3 MiB (peak 94 MiB)
- nginx CPU time consumed since service start: 11min 26s

A very lightly-loaded box.

## 17. Snapshot history

| Date | Surveyor | As user | Headline |
|------|----------|---------|----------|
| 2026-05-29 | Faith | root | Initial capture. Confirmed Postgres is local and seeded the first live-server findings. Phelan-side follow-up still needed for user-owned paths. |
| 2026-06-01 | Faith | phelan (no sudo) | **Discovered install path**: `/home/phelan/server/UNanofabTools/`, not the previously assumed home-level path. Both tmux sessions alive (`flaskserver` 7 mo old, `downloader` 9 mo old). Both processes confirmed running (Flask 14d, downloader 187d). `phelan` has 7 authorized keys + outbound SSH identity. Surfaced stale 257-day `vim` in the downloader session. Script was patched after this snapshot — next run will pick up the venv / `.env` / SQLite / data tree sections. |

When re-running:

```sh
# as phelan, on nfhistory
bash ~/survey_nfhistory.sh | tee /tmp/nfhistory_survey_phelan_$(date +%F).txt

# back to laptop, then pull via CADE (mirror the snapshot-fetch command):
mkdir -p ~/code/work/nanofab-documentation/documentation/UNanofabTools/liveserver/snapshots && \
ssh -i ~/.ssh/CADE phelanh@lab1-10.eng.utah.edu 'scp nfhistory:/tmp/nfhistory_survey_phelan_\*.txt ~/' && \
scp -i ~/.ssh/CADE 'phelanh@lab1-10.eng.utah.edu:~/nfhistory_survey_phelan_*.txt' \
    ~/code/work/nanofab-documentation/documentation/UNanofabTools/liveserver/snapshots/
```

Then add a row to this table describing what changed.

---

## Related

- Access procedure: `documentation/UNanofabTools/serveraccess/README.md` (repo path: documentation/UNanofabTools/serveraccess/README.md)
- Layman version: `presentation/UNanofabTools/liveserver/README.md` (repo path: presentation/UNanofabTools/liveserver/README.md)
- Findings to fix: `known-issues/UNanofabTools/liveserver.md` (repo path: known-issues/UNanofabTools/liveserver.md)
- The script that produces these snapshots: `survey_nfhistory.sh` (repo path: documentation/UNanofabTools/liveserver/survey_nfhistory.sh)
- Raw snapshots used here: `snapshots/nfhistory_survey_root_2026-05-29.txt` (repo path: documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_root_2026-05-29.txt) and `snapshots/nfhistory_survey_phelan_2026-06-01.txt` (repo path: documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_2026-06-01.txt)


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/liveserver.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Live Server — Known Issues & Findings from Snapshot

Issues surfaced by the read-only surveys of `nfhistory` on **2026-05-29** as `root` (`documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_root_2026-05-29.txt` (repo path: documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_root_2026-05-29.txt)) and **2026-06-01** as `phelan` (`documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_2026-06-01.txt` (repo path: documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_2026-06-01.txt)).

Severity: **High** = breaks functionality, security exposure, or operational silent-failure · **Medium** = correctness / maintainability problem · **Low** = cleanup / cosmetic.

Where an item also appears in `serveraccess.md` (the more general access-and-ops issues list), it's noted; the entries here add the specific evidence from this snapshot.

---

### 1. Nanofab-side backups (IT already handles the base layer) — Low / future option
- **Status:** the survey didn't find any locally-installed backup tooling (`borg`, `restic`, `duplicity`, `rsnapshot`) or cron jobs, but **the base backup is run by university IT off the box**. The Nanofab team has visibility into what IT backs up via the IT relationship; it's not a Nanofab-managed pipeline. So the existential-loss scenario is already mitigated — this finding is no longer a "High" because the survey can't see what IT runs from outside.
- **What IT covers (to confirm with IT):** the VM-level backup snapshots the cleanroom data trees (`~/server/UNanofabTools/instance/`, `uploads/`, `LogData/`, `HSCDATA/`) and the local PostgreSQL data directory along with the rest of the filesystem.
- **What the Nanofab team could add later (optional):** a Nanofab-owned secondary tier so a restore doesn't depend solely on opening a ticket with IT. Examples: a nightly `pg_dump cheminventory` into `/home/phelan/backups/` (also covered by IT's snapshot), plus a periodic `restic`/`borg` push to a Nanofab-owned destination. Worth doing only if the loss tolerance for a restore window matters.
- **Action:** confirm the IT backup scope with the IT contact, write the answer into `documentation/UNanofabTools/liveserver/README.md` §13 so the next maintainer doesn't re-flag this, and decide whether the Nanofab-side secondary tier is worth building.

### 2. No service supervision for the Flask app or HSCDownloader — High
- **Where:** `systemctl list-unit-files | grep -iE '(flask|nanofab|nfhistory|chem|hsc|downloader|gunicorn)'` returned nothing. The Flask process (PID 2665755 listening on `127.0.0.1:5000`) is running as `python` directly, not as a systemd service. Same pattern for the downloader.
- **Risk:** if either process exits, the tmux pane returns to a prompt and the *service is silently down* until a human notices. A reboot loses both. There is no automatic restart and no logging through `journalctl` for either.
- **Fix:** add two systemd units, e.g. `flaskserver.service` and `hscdownloader.service`, with `Restart=on-failure`, `WantedBy=multi-user.target`, `User=phelan`, and `WorkingDirectory=/home/phelan/server/UNanofabTools`. For the current live layout, use `/home/phelan/server/UNanofabTools/venv/bin/python run.py` (or the gunicorn command from `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`) for Flask, and `/home/phelan/server/UNanofabTools/venv/bin/python3 HSCDownloader.py` for the downloader. `HSCDownloader.py` is co-located with `run.py`; there is no separate HSCDownloader install directory. Keep tmux around as a debugging convenience only.

### 3. Root SSH is IT's access path — Info (boundary of responsibility)
- **Where:** `sshd -T` shows `permitrootlogin without-password`. `/root/.ssh/authorized_keys` has one active 2048-bit RSA key from `root@iceolate.eng.utah.edu`.
- **Reality:** `iceolate.eng.utah.edu` is **university IT's administrative access host**. Root SSH is enabled on `nfhistory` because IT requires it for the maintenance they own (kernel patching, the off-host backup pipeline, etc.). The Nanofab team does not have root on `nfhistory`; admin tasks from the Nanofab side are done via `sudo` as `phelan`. The key in `/root/.ssh/authorized_keys` belongs to IT — **do not modify or revoke it without coordinating with IT** or you will lock IT out of the box.
- **Action:** document this boundary in the live-server doc (§9.1) so a future maintainer understands that the root-SSH "finding" is intentional, not a hole. Nothing to fix in the SSH config itself.

### 4. `/root/.ssh/authorized_keys` mode is `-rw-rw-r--` — Medium (ask IT)
- **Where:** snapshot shows `-rw-rw-r-- 1 root root 445 Aug 11 2025 authorized_keys`.
- **Risk:** OpenSSH tolerates `664` (it only refuses world-writable) but the file is world-readable, so any shell user on the box can see which key has root. Minor information leak.
- **Action:** the Nanofab team does not own `/root`. Open a ticket with IT asking them to `chmod 600 /root/.ssh/authorized_keys` and to investigate the umask of whatever deployment tool created it `664`. Track the request here until resolved.

### 5. No `unattended-upgrades` configured — High (security)
- **Where:** `/etc/apt/apt.conf.d/20auto-upgrades` and `/etc/apt/apt.conf.d/50unattended-upgrades` are both absent. `apt-daily.timer` runs and updates the package list, but nothing applies the upgrades.
- **Risk:** security patches for nginx, OpenSSL, OpenSSH, PostgreSQL accumulate until a human runs `apt upgrade`. At 290 days uptime, that "human" hasn't been around recently for kernel updates either.
- **Fix:**
  ```sh
  apt install unattended-upgrades apt-listchanges
  dpkg-reconfigure -plow unattended-upgrades   # answer Yes
  ```
  Then verify `/etc/apt/apt.conf.d/50unattended-upgrades` allows security upgrades, and consider enabling `Unattended-Upgrade::Automatic-Reboot "false";` (or set a time window) to avoid surprise reboots.

### 6. The chem PostgreSQL DB is local on this VM — Low/Info (verified; core docs corrected)
- **Where:** snapshot shows `postgresql@17-main.service` running, listening on `127.0.0.1:5432`. The Flask config's `CHEM_PGHOST` defaults to `localhost`. There is no remote DB connection.
- **Status:** the core Flask docs now reflect the live state: `documentation/UNanofabTools/flaskserver/01-architecture.md` shows PostgreSQL on the same VM and `documentation/UNanofabTools/flaskserver/04-database-schema.md` identifies `postgresql@17-main` bound to `127.0.0.1:5432`.
- **Risk:** future edits could regress to the older off-box database mental model, especially when adapting greenfield deployment templates that allow a remote Postgres via `CHEM_PGHOST`.
- **Action:** keep the live-server and flaskserver docs framed as **local Postgres on `nfhistory`**. Treat remote Postgres wording only as an option for non-production/greenfield deployments, not as a description of the live cleanroom server.

### 7. Plain HTTP `:80` does not redirect to HTTPS — Medium
- **Where:** `nginx -T` shows the Debian `default` site is still enabled on port 80 and serves `/var/www/html`. The `untools` vhost only listens on `:443`.
- **Risk:** `http://nfhistory.nanofab.utah.edu/` shows the default Debian welcome page, which looks broken. Bookmarks, hardcoded URLs in tools, and people who omit `https://` all see this.
- **Fix:** replace the contents of `/etc/nginx/sites-enabled/default` with a redirect-only server block:
  ```nginx
  server {
      listen 80 default_server;
      listen [::]:80 default_server;
      server_name _;
      return 301 https://$host$request_uri;
  }
  ```
  Reload nginx. Verify with `curl -I http://nfhistory.nanofab.utah.edu/`.

### 8. Phantom `apache2.service` in failed state — Low (noise)
- **Where:** `systemctl --failed` shows `apache2.service not-found failed`.
- **Risk:** muddies routine "is everything OK?" checks; an operator might miss a real failure in the noise.
- **Fix:** `systemctl disable --now apache2 2>/dev/null; systemctl reset-failed apache2`. If a unit file lingers, `apt purge apache2*` (carefully — nothing actually depends on it here).

### 9. `php8.4-fpm` running but unused — Low
- **Where:** `php8.4-fpm.service` is active running; `/etc/cron.d/php` purges PHP sessions every 30 minutes. Nothing in the cleanroom site is written in PHP.
- **Risk:** wastes a small amount of memory and a process slot; one more attack surface for no functional gain.
- **Fix:** confirm nothing depends on it (`grep -R fastcgi_pass /etc/nginx/`), then:
  ```sh
  systemctl disable --now php8.4-fpm
  apt purge php8.4-fpm php8.4-common
  ```
  Remove `/etc/cron.d/php` if apt leaves it behind.

### 10. Current TLS cert expires 2026-06-23 (24 days at snapshot) — Low/Info
- **Where:** live `:443` cert `notAfter=Jun 23 02:33:01 2026 GMT`.
- **Risk:** none today — `certbot.timer` is firing twice daily and the renewal account is in good standing. Flagged so the maintainer has a date to keep an eye on if they're auditing post-snapshot.
- **Fix:** none required. Tip: `certbot certificates` prints expiry and renewal config; check it after the next renewal to confirm a new `cert<N>.pem`/`fullchain<N>.pem` rotation actually happened.

### 11. No outbound notification path — Medium
- **Where:** no MTA installed; `postfix` and `exim4` both `inactive`. No webhook tooling.
- **Risk:** the server can detect that something is wrong (e.g. cert about to expire, disk filling, service failed) but has no way to tell a human.
- **Fix:** simplest path is `msmtp` + a `from` set to an alias the team can monitor. More robust: a tiny `curl`-based Slack/Teams webhook sender invoked from cron and from systemd's `OnFailure=`. Once the supervisor in finding #2 is in place, wire `OnFailure=` to it.

### 12. `wpa_supplicant.service` running on a server — Low
- **Where:** snapshot shows `wpa_supplicant.service active running`. A wired server has no need for a Wi-Fi supplicant.
- **Risk:** marginal — extra process, irrelevant unit.
- **Fix:** `systemctl disable --now wpa_supplicant.service`. Confirm `ens33` stays up afterwards (it should — NetworkManager handles wired).

### 13. Vestigial desktop daemons running — Low
- **Where:** snapshot shows `accounts-daemon`, `colord`, `polkit`, `power-profiles-daemon`, `udisks2`, `upower`, `switcheroo-control`, `rtkit-daemon`, `low-memory-monitor` — all desktop-environment plumbing.
- **Risk:** ~50–100 MiB of memory and a handful of process slots for nothing useful.
- **Fix:** safe to disable, one at a time, with `systemctl disable --now <unit>` and verify after each. Low priority — only worth it if you also clean up #9 and #12 in the same maintenance window.

### 14. Hand-installed `python3.12` in `/usr/local/bin` — Low
- **Where:** `python3.12 -> /usr/local/bin/python3.12 -> Python 3.12.0`. Not from apt.
- **Risk:** unknown — why was it installed, is anything depending on it, will it shadow `python3` in someone's PATH and surprise them?
- **Fix:** find out who put it there. If nothing uses it, remove (`make uninstall` from its build dir, or just delete). If something uses it, document it here.

### 15. 290-day uptime / no recent reboot — Low/Medium
- **Where:** `uptime`: 290 days. Kernel is `6.12.38` from 2025-07-16; Debian 13.4 will likely have shipped a newer kernel by now.
- **Risk:** running on an old kernel means missed CVE patches. A controlled reboot is needed to load a new one.
- **Fix:** schedule a maintenance window. Before rebooting, **first** put findings #2 (systemd-managed Flask + downloader) in place so the post-reboot service comes back automatically. Without #2, the reboot leaves the website down until a human re-attaches the tmux session.

### 16. `wtmpdb` history starts 2026-05-08 — Low
- **Where:** `wtmpdb begins Fri May 8 13:15:36 2026`. Earlier login history isn't available.
- **Risk:** if a forensic question ever comes up about who was on the box before May 2026, the answer is "we don't know."
- **Fix:** consider raising `wtmpdb`'s retention (in `/etc/logrotate.d/wtmpdb`; currently `yearly … rotate 4` so up to 4 years should be kept once enough data accumulates). Low priority unless required for compliance.

### 17. Survey path mismatch — partially captured — Low (snapshot completeness; script now patched)
- **History:** the first survey ran as root and missed the `phelan`-side files. The second ran as `phelan` (2026-06-01) but **still** missed venvs / `.env` / SQLite tables / data trees because the script hardcoded the pre-correction home-level install path whereas the actual install is at `~/server/UNanofabTools/` (discovered via tmux `cwd` in that same snapshot).
- **Status:** the script has been patched to auto-discover `INSTALL_ROOT` from the live `~/server/UNanofabTools` path and the `/opt`/`/srv` deployment candidates. The next `phelan`-side run will populate the gaps.
- **Fix:** re-run the patched script as `phelan` (no sudo), save to `documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_<date>.txt`, and fold the new venv/`.env`/SQLite/chem-DB/data-tree sections into `documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md) §10, §11, §13.

### 18. Root SSH ingress from 155.98.110.9 = IT — Info
- **Where:** `last` shows `root pts/0 155.98.110.9` three times in May 2026 (9 min, 25 min, 3 min sessions). The `phelan` logins come from `155.98.111.*` (CADE-pool); root logins come from a different subnet.
- **Reality:** `155.98.110.9` is the IP for IT's administrative host (`iceolate.eng.utah.edu`, matching the root key comment from #3). These root sessions are routine IT maintenance, not unaccounted access.
- **Action:** none. Documented as expected behavior in `documentation/UNanofabTools/liveserver/README.md` §9.2.

---

### 19. Stale `vim HSCDownloader.py` in the `downloader` tmux session — Low
- **Where:** `2026-06-01` phelan snapshot. `ps -u phelan` shows `vim HSCDownloader.py` (pid 71953) running for 257 days inside the `downloader` tmux session (pane 1). It's not the running service — the actual downloader is pid 323636 in pane 2.
- **Risk:** none functionally — vim is benign. But it consumes a process slot, locks the buffer's swap file, and is exactly the kind of "someone forgot to close this" artifact that confuses a future maintainer attaching for the first time.
- **Fix:** next time you attach to `downloader`, switch to pane 1 (`Ctrl-b q 1` or `Ctrl-b ;`) and `:q!` out of vim. Then detach with `Ctrl-b d` as usual. Nothing to do until the next attach.

### 20. Multiple keys with identical `u0911926@utah.edu` comment in `phelan`'s `authorized_keys` — Low
- **Where:** `2026-06-01` phelan snapshot, §9.3 of the live-server doc. Three ED25519 keys all carry the same `u0911926@utah.edu` comment.
- **Risk:** rotation hygiene. If those three are different generations of the same person's key, the older two should be pruned. If they're three different devices for the same person, the comments should be made specific (`u0911926@laptop`, `u0911926@desktop`, etc.) so removing one doesn't accidentally remove all.
- **Fix:** ask the person whose keys these are to confirm which are still needed and re-issue with distinguishing comments. Update the key-issuance log in lockstep.

### 21. Generic `rsa-key-20250917` comment in `phelan`'s `authorized_keys` — Low
- **Where:** `2026-06-01` phelan snapshot, §9.3. One 2048-bit RSA key with the placeholder comment PuTTYgen generates by default.
- **Risk:** if this key needs to be revoked, the comment doesn't tell you whose it is. Same offboarding-friction problem as the generic `cade-to-nfhistory` comments.
- **Fix:** trace who holds the matching private key (by fingerprint `SHA256:ytvtvJV+…`); reissue with a clearer comment; add to the issuance log.

### 22. `phelan` has an outbound SSH identity but its purpose isn't documented — Info
- **Where:** `~/.ssh/id_ed25519` + `id_ed25519.pub` + a non-trivial `known_hosts` exist in `phelan`'s home. Means the box SSHes *out* to one or more remotes.
- **Risk:** unclear ownership. If the destination ever moves or its key rotates, an outbound process will silently fail and someone has to remember what it was for. Likely uses: pulling from a git remote, pushing to research storage, the `fetch_ssh.py` dev tool.
- **Fix:** trace what uses `phelan`'s outbound SSH (grep cron, the Flask app code, `fetch_ssh.py`, the data-flow scripts), and add a §9.4 to the live-server doc describing the destinations and what they're for.

## Suggested priority order (Nanofab-owned items only)

The Nanofab team has `sudo` as `phelan` but does not have root, cannot create UNIX accounts, and does not own IT's backup / patching paths. Items #1, #3, #4, #5, #15, #18 are bounded by IT and are either already handled or require an IT ticket. Item #6 is retained as a verified live-state fact so future docs keep PostgreSQL on the same VM. The list below is what the Nanofab team can act on directly.

1. **#2** — put the Flask app and HSCDownloader under systemd. The single biggest reliability win the Nanofab team can ship on its own. Eliminates silent-failure mode for the website.
2. **#7** — add the HTTP→HTTPS redirect on `:80` (one-line nginx change via `sudo`).
3. **#11** — wire up an outbound notification path so future failures find a human.
4. **#17** — re-run the patched survey as `phelan` and finish populating the live-server doc.
5. **#8, #9, #12, #13, #14, #16, #19, #20, #21, #22** — cleanup, audit, key hygiene, and the stale vim. Bundle into one or two `sudo`-friendly maintenance windows.

Items that need IT (open a ticket):
- **#4** — request `chmod 600 /root/.ssh/authorized_keys` from IT.
- **#5** — request that IT enable `unattended-upgrades` (they may already do equivalent patching out-of-band).
- **#15** — coordinate a controlled reboot with IT for a fresh kernel; only do this AFTER #2 is in place so the services come back automatically.
- **#1** — confirm exactly what IT's backup covers (and decide whether the Nanofab team wants a secondary tier).
