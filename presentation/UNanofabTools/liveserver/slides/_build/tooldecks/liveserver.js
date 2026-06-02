const M = require("../meta");

module.exports = {
  filename: "Live-Server.pptx",
  title: "What's Actually on nfhistory",
  build(d) {
    d.title_slide({
      kicker: "UNANOFABTOOLS · TOOL",
      title: "What's Actually on nfhistory",
      subtitle:
        "A read-only tour of the live cleanroom server —\n" +
        "what's running, what's healthy, and what's weird.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session walks through the live state of the cleanroom server as captured by a read-only survey on May 29, 2026. We'll cover the " +
        "shape of the machine, what's listening on the network, the TLS certificate situation, what's auto-managed versus not, and the " +
        "specific 'weirdness' a future maintainer should know about. The point is to make the operational picture honest and current, not " +
        "aspirational. No coding background required.",
    });

    d.stats({
      title: "The server in 30 seconds",
      stats: [
        { big: "1",   label: "vCPU\nIntel Xeon Gold @ 3 GHz" },
        { big: "5.8", label: "GiB memory\n~1 GiB used" },
        { big: "29",  label: "GB disk\n31% used" },
        { big: "290", label: "days uptime\nDebian 13" },
      ],
      notes:
        "Small, lightly-loaded Debian 13 box. Single CPU, less than 1 GiB of memory in use out of 5.8, 31% of a 29 GB disk used, and it's been " +
        "running for 290 days without a reboot. For what it does — a website, a chemical inventory, a sensor API — this is plenty. The big " +
        "headroom is reassuring; the 290-day uptime is less so because kernel patches haven't been applied since.",
    });

    d.table({
      title: "What's listening on the network",
      headers: ["Port", "Process", "Reachable from"],
      rows: [
        ["22",   "sshd (OpenSSH 10.0)",      "anywhere"],
        ["80",   "nginx 1.26.3",             "anywhere"],
        ["443",  "nginx 1.26.3 (TLS)",       "anywhere"],
        ["5000", "python (the Flask app)",   "localhost only"],
        ["5432", "postgres 17.9 (chem DB)",  "localhost only"],
      ],
      colW: [1.2, 5.3, 5.4],
      notes:
        "Five things listening. SSH on 22, nginx on 80 and 443 publicly. Then two internal services bound to 127.0.0.1: the Flask app on 5000 " +
        "and PostgreSQL on 5432. Two things to call out. First, the Flask app is correctly hidden behind nginx — outside traffic can only " +
        "reach it via the reverse proxy. Second — and this is a real surprise — PostgreSQL is RIGHT HERE on this machine, not on a separate " +
        "server like the architecture docs suggested. That changes the backup story significantly.",
    });

    d.bullets({
      title: "Surprise: chem PostgreSQL is local",
      bullets: [
        "The chem database is PostgreSQL on this same VM.",
        "postgresql@17-main is bound to 127.0.0.1.",
        "That means: backing up nfhistory and backing up the chem DB are ONE task.",
        "The flaskserver architecture docs now show this live topology.",
      ],
      notes:
        "First and most consequential finding. The survey shows postgresql@17-main running locally and bound to 127.0.0.1:5432. So this " +
        "changes how we should think about backups, failure domains, and the deployment story. The architecture diagrams have been updated " +
        "to match reality. The code itself was already aligned with this, since the Flask config defaults to localhost.",
    });

    d.steps({
      title: "TLS certificates: the maintenance story",
      steps: [
        { h: "Current cert", d: "expires Jun 23, 2026 — about 24 days from the snapshot." },
        { h: "Auto-renewal", d: "certbot.timer runs twice daily; last ran 1h 13m before snapshot." },
        { h: "Issuer", d: "Let's Encrypt CN=E7. Standard 90-day cert." },
        { h: "Verdict", d: "Healthy. No human action needed unless certbot.timer ever stops." },
      ],
      notes:
        "TLS health. The current certificate is well within its 90-day window, with 24 days remaining at the time of capture. The certbot " +
        "systemd timer is firing twice a day exactly as it should and ran successfully about an hour before our snapshot. So this part of " +
        "the system is auto-healing. The thing to watch for is if certbot.timer ever becomes inactive — then renewals stop and 30 days later " +
        "the website starts throwing browser warnings.",
    });

    d.twocol({
      title: "Auto-managed vs. not",
      left: {
        heading: "Working unattended",
        items: [
          "TLS cert renewal (certbot.timer)",
          "Log rotation (nginx, postgres, certbot, php)",
          "Daily apt package-list refresh",
          "Filesystem checks (e2scrub, fstrim)",
          "Time sync (NTP)",
          "VM-level backup (run off-box by IT)",
        ],
      },
      right: {
        heading: "Gaps the Nanofab team can close",
        items: [
          "Service supervision for Flask / downloader",
          "Outbound failure notifications",
          "HTTP → HTTPS redirect on :80",
          "apache2 ghost, php-fpm leftover",
        ],
      },
      notes:
        "Quick health table. Left side: things that just work — including the VM-level backup, which runs off the box and is operated by " +
        "University IT, not the Nanofab team. Cert renewal, log rotation, apt's daily update check, filesystem maintenance, NTP. All quiet, " +
        "all on schedule. Right side: the gaps the Nanofab team can actually close on its own. The Flask app and the downloader have no " +
        "supervisor. There's no path for the box to alert anyone when something fails. Bare HTTP doesn't redirect to HTTPS. And there are " +
        "small cleanups. Each is fixable with sudo from the Nanofab side; together they're most of the operational risk on this box.",
    });

    d.bullets({
      title: "Backups: handled by IT (off the box)",
      intro: "Original backup-gap finding was wrong — the survey can't see what runs outside the VM.",
      bullets: [
        "University IT runs a VM-level backup off nfhistory.",
        "The Nanofab team has visibility but doesn't operate it.",
        "Catastrophic loss = open an IT ticket for a restore.",
        "To-do: confirm IT's scope (what's included, retention, SLA) and write it in §13.",
        "Optional later: a Nanofab-owned secondary tier if IT's restore window isn't fast enough.",
      ],
      notes:
        "Important correction. The first read of the survey missed the backup layer because the survey can only see what's running ON " +
        "the box, and the actual backup happens OFF the box, run by University IT. The catastrophic-loss scenario is already mitigated. " +
        "The to-do for the Nanofab team is to confirm with IT exactly what their snapshot covers — at minimum we want the home directory, " +
        "the SQLite databases, the data trees, and the PostgreSQL data dir — and to write that into the live-server doc so the next " +
        "maintainer doesn't have to ask. A second-tier Nanofab-owned backup (e.g. a nightly pg_dump or a restic push) is optional and only " +
        "worth building if IT's restore SLA isn't fast enough for the team's tolerance.",
    });

    d.bullets({
      title: "Root SSH = IT's access path",
      intro: "The 'surprise root SSH' finding turned out to be intentional.",
      bullets: [
        "sshd config: 'PermitRootLogin without-password' (key-only).",
        "Live key in /root/.ssh/authorized_keys from root@iceolate.eng.utah.edu.",
        "iceolate is University IT's administrative host.",
        "Root access is required by IT for kernel patching + the backup pipeline.",
        "Nanofab team: do NOT touch /root/. If file mode is wrong (664), open a ticket.",
      ],
      notes:
        "Another correction. The first read flagged the root SSH key as a finding to fix. The reality is that the key belongs to " +
        "University IT — iceolate.eng.utah.edu is their administrative host — and root SSH is enabled on nfhistory because they need it " +
        "for the maintenance they own. The Nanofab team should NOT modify /root/.ssh/authorized_keys or change PermitRootLogin; doing so " +
        "would lock IT out and break their patching and backup pipelines. The one residual concern is that authorized_keys is mode 664 " +
        "(world-readable) instead of 600 — that's worth a polite IT ticket asking them to chmod it, not a Nanofab fix.",
    });

    d.bullets({
      title: "Smaller weirdness",
      bullets: [
        "Failed apache2.service — phantom unit, not installed; should be cleaned up.",
        "php8.4-fpm running — nothing on the site needs PHP; leftover from install.",
        "wpa_supplicant running — server doesn't need Wi-Fi.",
        "Hand-installed python3.12 in /usr/local/bin — why is it there?",
        "wtmpdb only goes back to May 8, 2026 — earlier login history is lost.",
      ],
      notes:
        "These don't break anything but a future maintainer will want to know. Apache2 shows up as 'failed' in systemctl even though the " +
        "package isn't installed — a leftover unit reference. PHP-FPM is running and consuming a small amount of memory for a site that " +
        "has no PHP. wpa_supplicant is running on a wired server. There's a hand-compiled Python 3.12 in /usr/local/bin alongside the " +
        "Debian-packaged 3.13s, with no obvious caller. And the login history database only goes back about three weeks. Each is a quick " +
        "cleanup item; bundle them into one maintenance window.",
    });

    d.bullets({
      title: "What's genuinely healthy",
      bullets: [
        "OS current (Debian 13 'trixie', kernel 6.12).",
        "Firewall: nftables, default-deny inbound, only 22/80/443 open.",
        "TLS cert auto-renewing on schedule.",
        "nginx and PostgreSQL clean — no recent errors in logs.",
        "SSH password auth disabled. Key-only.",
        "Disk is 31% full. Memory is mostly free.",
      ],
      notes:
        "Don't let the long weirdness list make this look worse than it is. The boring infrastructure is in good shape. OS is current. " +
        "Firewall is conservative and configured correctly. TLS renewal is automatic and the timer is firing as expected. Web server and " +
        "database have clean recent logs. SSH is key-only — no password brute force possible. Disk and memory have plenty of headroom. " +
        "The gaps are operational — backups, supervision, alerting — not 'the server is on fire'.",
    });

    d.bullets({
      title: "Surprise: install lives at ~/server/UNanofabTools",
      bullets: [
        "Earlier docs assumed a home-level UNanofabTools directory. It's actually ~/server/UNanofabTools.",
        "HSCDownloader.py lives in the SAME directory — not a separate HSCDownloader install.",
        "Both tmux sessions (flaskserver + downloader) confirmed alive 7+ months.",
        "Recovery commands and the survey script have been corrected.",
        "Found a stale 'vim HSCDownloader.py' that's been open 257 days — close it.",
      ],
      notes:
        "The 2026-06-01 phelan-side survey discovered the install path. The Flask app and the downloader both run from " +
        "/home/phelan/server/UNanofabTools — not from the home-level path the original docs assumed, and HSCDownloader.py sits right next " +
        "to run.py rather than in a separate HSCDownloader folder. The recovery procedures and the survey script have been patched. " +
        "One amusing detail: the downloader tmux session has a vim editor open on HSCDownloader.py that's been running for 257 days — " +
        "someone forgot to close it. Not breaking anything, but worth :q'ing next time you attach.",
    });

    d.twocol({
      title: "Top recommendations",
      left: {
        heading: "Nanofab-side (sudo as phelan)",
        items: [
          "1. Move Flask + downloader to systemd (auto-restart).",
          "2. Add HTTP→HTTPS redirect on :80.",
          "3. Wire OnFailure= notifications.",
          "4. Re-run the patched phelan-side survey.",
          "5. Cleanup: apache2 ghost, php-fpm, wpa_supplicant.",
        ],
      },
      right: {
        heading: "Open a ticket with IT",
        items: [
          "chmod 600 /root/.ssh/authorized_keys.",
          "Confirm backup scope + restore SLA.",
          "(Optional) per-person UNIX accounts.",
          "(Optional) DNS A record for nfhistory.",
          "Coordinate reboot for fresh kernel (after #1).",
        ],
      },
      notes:
        "Final recommendation list, split by who can do what. The Nanofab team has sudo as phelan but not root, and can't create UNIX " +
        "accounts. So the left column is the Nanofab punch list: systemd supervision is the biggest reliability win, then the docs fix " +
        "for the HTTP redirect, notifications, one patched phelan-side survey refresh, and a small cleanup pass. The right column is what needs IT — tightening " +
        "the root key file mode, confirming the backup scope, and the two optional asks for per-person accounts or a DNS name. If you can " +
        "only do one thing from the left column, do systemd; it eliminates the silent-failure mode for the website in one move.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Small Debian 13 box, well within its resource budget.",
        "Public surface: nginx on 80/443, SSH on 22. Internal: Flask + Postgres.",
        "Cert auto-renews. Backup runs off-box, managed by IT.",
        "Biggest Nanofab-side gap: nothing supervises Flask / downloader. Fix is systemd.",
        "Action items are tracked in known-issues/UNanofabTools/liveserver.md.",
      ],
      notes:
        "Wrap up. nfhistory is a small, well-configured Debian server doing its job. The boring infrastructure is solid. The base backup is " +
        "run off-box by University IT, so the catastrophic-loss scenario is already mitigated. The biggest Nanofab-side gap is process " +
        "supervision for the Flask app and the downloader — fix that with systemd and most silent-failure modes go away. The rest is " +
        "smaller cleanups plus a few IT tickets for items that need root or new UNIX accounts. Everything is tracked in the known-issues " +
        "file, with each item tagged Nanofab-actionable or IT-bound. Questions welcome.",
    });
  },
};
