# Module 2 - What Is Actually Running On `nfhistory`

## Goal

The maintainer understands the difference between the ideal deployment and the verified live deployment on `nfhistory`.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/liveserver/slides/Live-Server.pptx`](../../presentation/UNanofabTools/liveserver/slides/Live-Server.pptx)
- [`../../presentation/UNanofabTools/liveserver/README.md`](../../presentation/UNanofabTools/liveserver/README.md)
- [`../../documentation/UNanofabTools/liveserver/README.md`](../../documentation/UNanofabTools/liveserver/README.md)
- [`../../known-issues/UNanofabTools/liveserver.md`](../../known-issues/UNanofabTools/liveserver.md)

## Verbatim Script

READ ALOUD:

"Now we move from the conceptual system to the live server. This distinction matters. Documentation often describes a desired shape. Production is the verified shape. When the two disagree, production wins and the docs must either be updated or must explicitly say they are describing a migration target."

SHOW:

Open `Live-Server.pptx`.

READ ALOUD:

"The live server is named `nfhistory`. The documented live-state snapshot says it is at IP `155.98.11.8`, running Debian 13, with kernel 6.12. nginx handles public HTTPS. TLS is Let's Encrypt and auto-renewed by certbot. The chemical PostgreSQL database is local on the same VM, listening on `127.0.0.1:5432`. The Flask app and `HSCDownloader.py` currently run inside tmux sessions named `flaskserver` and `downloader`. They are not systemd services yet."

"That last point is one of the most important operational facts in the whole handoff. A tmux session can keep a process alive after logout, but tmux is not a supervisor. If the process crashes, tmux may keep the shell open while the service is down. If the server reboots, the sessions do not automatically come back. Moving Flask and the downloader under systemd is a major reliability improvement that the Nanofab team can own."

SHOW:

Open [`../../documentation/UNanofabTools/liveserver/README.md`](../../documentation/UNanofabTools/liveserver/README.md).

READ ALOUD:

"The live-server developer document is a populated inventory. It should contain exact service names, paths, listener facts, snapshots, and findings. The top findings here intentionally mirror the known-issues file. That is important: a maintainer should not need to hunt through three places to discover the same serious risk."

SHOW:

Open [`../../known-issues/UNanofabTools/liveserver.md`](../../known-issues/UNanofabTools/liveserver.md).

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

- What is the live server name?
- What does nginx do on the live server?
- What process serves Flask today?
- What process writes `HSCDATA` today?
- Why is tmux-only supervision a reliability risk?
- Where is the live Flask app installed?
- Is chem PostgreSQL local or external?
- Which live-server findings are Nanofab-actionable?
- Which findings require University IT?

REQUIRE:

The maintainer can say: "The app and downloader currently run in tmux. Moving them to systemd is a Nanofab-owned reliability improvement. Root, root SSH, VM-level backup, and UNIX account creation are IT-owned."

## Stop Point

STOP POINT:

Stop here if the maintainer confuses tmux with systemd, local PostgreSQL with external PostgreSQL, or Nanofab-owned work with IT-owned work.
