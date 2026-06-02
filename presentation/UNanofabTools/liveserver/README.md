# What's Actually Running on the Server — A Plain-English Guide

This guide is a tour of the **live cleanroom server** (`nfhistory`) — what's on it, what it's doing, how it's kept healthy, and what bits of it would surprise a future maintainer. Written for a non-coder; terms are defined as they appear.

If `serveraccess/` answers *"how do I log in?"*, this answers *"once you're in, what's actually there?"*

Everything below comes from real read-only surveys of the server on **May 29, 2026** (root-side system view) and **June 1, 2026** (`phelan`-side user view). The raw snapshots live in [`../../../documentation/UNanofabTools/liveserver/snapshots/`](../../../documentation/UNanofabTools/liveserver/snapshots/) for reference.

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
