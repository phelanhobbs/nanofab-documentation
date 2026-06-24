# Live Server — Known Issues & Findings from Snapshot

Issues surfaced by the read-only surveys of `nfhistory` on **2026-05-29** as `root` ([`documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_root_2026-05-29.txt`](../../documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_root_2026-05-29.txt)) and **2026-06-01** as `phelan` ([`documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_2026-06-01.txt`](../../documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_2026-06-01.txt)).

Severity: **High** = breaks functionality, security exposure, or operational silent-failure · **Medium** = correctness / maintainability problem · **Low** = cleanup / cosmetic.

Where an item also appears in `serveraccess.md` (the more general access-and-ops issues list), it's noted; the entries here add the specific evidence from this snapshot.

---

### 1. Nanofab-side backups (IT already handles the base layer) — Low / future option
- **Status:** the survey didn't find any locally-installed backup tooling (`borg`, `restic`, `duplicity`, `rsnapshot`) or cron jobs, but **the base backup is run by university IT off the box**. The Nanofab team has visibility into what IT backs up via the IT relationship; it's not a Nanofab-managed pipeline. So the existential-loss scenario is already mitigated — this finding is no longer a "High" because the survey can't see what IT runs from outside.
- **What IT covers (to confirm with IT):** the VM-level backup snapshots the cleanroom data trees (`~/server/UNanofabTools/instance/`, `uploads/`, `LogData/`, `HSCDATA/`) and the local PostgreSQL data directory along with the rest of the filesystem.
- **What the Nanofab team could add later (optional):** a Nanofab-owned secondary tier so a restore doesn't depend solely on opening a ticket with IT. Examples: a nightly `pg_dump cheminventory` into `/home/phelan/backups/` (also covered by IT's snapshot), plus a periodic `restic`/`borg` push to a Nanofab-owned destination. Worth doing only if the loss tolerance for a restore window matters.
- **Action:** confirm the IT backup scope with the IT contact, write the answer into `documentation/UNanofabTools/liveserver/README.md` §13 so the next maintainer doesn't re-flag this, and decide whether the Nanofab-side secondary tier is worth building.

### 2. Service supervision for the Flask app or HSCDownloader — ✅ RESOLVED (2026-06-18) *(was High)*
- **Resolution:** both now run as **user-level systemd** services (`~/.config/systemd/user/{flaskserver,hscdownloader}.service`) with `Restart=on-failure`; lingering is enabled (`loginctl enable-linger`) so they start at boot. Verified `active`/`enabled`, `NRestarts=0`, `Linger=yes`, port 5000 listening, local and public `302`.
- **Original finding:** a `systemctl list-unit-files` grep for `flask|…|gunicorn` returned nothing; the Flask process ran as bare `python` (PID 2665755 on `127.0.0.1:5000`), same for the downloader — so a crash left the tmux pane at a prompt with the service silently down, and a reboot lost both.
- **Residual (optional, Low):** still the Flask dev server, not gunicorn. To upgrade: `.venv/bin/python -m pip install gunicorn`, set `ExecStart=…/.venv/bin/python -m gunicorn -w 4 -b 127.0.0.1:5000 run:app`, then `systemctl --user daemon-reload && systemctl --user restart flaskserver`.
- **Note:** these are *user* units (the account has passwordless sudo for `systemctl` only, not for writing `/etc`); a root `/etc/systemd/system` unit would need IT, but user-unit + linger is equivalent for uptime.

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
- **Fix:** simplest path is `msmtp` + a `from` set to an alias the team can monitor. More robust: a tiny `curl`-based Slack/Teams webhook sender invoked from cron and from systemd's `OnFailure=`. Now that finding #2's systemd units exist (2026-06-18), wire `OnFailure=` to the notification path.

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
- **Fix:** schedule a maintenance window. Finding #2 (systemd-managed Flask + downloader) is now in place (2026-06-18) with linger enabled, so a controlled reboot brings the services back automatically.

### 16. `wtmpdb` history starts 2026-05-08 — Low
- **Where:** `wtmpdb begins Fri May 8 13:15:36 2026`. Earlier login history isn't available.
- **Risk:** if a forensic question ever comes up about who was on the box before May 2026, the answer is "we don't know."
- **Fix:** consider raising `wtmpdb`'s retention (in `/etc/logrotate.d/wtmpdb`; currently `yearly … rotate 4` so up to 4 years should be kept once enough data accumulates). Low priority unless required for compliance.

### 17. Survey path mismatch — partially captured — Low (snapshot completeness; script now patched)
- **History:** the first survey ran as root and missed the `phelan`-side files. The second ran as `phelan` (2026-06-01) but **still** missed venvs / `.env` / SQLite tables / data trees because the script hardcoded the pre-correction home-level install path whereas the actual install is at `~/server/UNanofabTools/` (discovered via tmux `cwd` in that same snapshot).
- **Status:** the script has been patched to auto-discover `INSTALL_ROOT` from the live `~/server/UNanofabTools` path and the `/opt`/`/srv` deployment candidates. The next `phelan`-side run will populate the gaps.
- **Fix:** re-run the patched script as `phelan` (no sudo), save to `documentation/UNanofabTools/liveserver/snapshots/nfhistory_survey_phelan_<date>.txt`, and fold the new venv/`.env`/SQLite/chem-DB/data-tree sections into [`documentation/UNanofabTools/liveserver/README.md`](../../documentation/UNanofabTools/liveserver/README.md) §10, §11, §13.

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

1. **#2** — ✅ done (2026-06-18): Flask + HSCDownloader now under user-systemd with linger. The single biggest reliability win, shipped. *(Optional follow-up: migrate `python run.py` → gunicorn.)*
2. **#7** — add the HTTP→HTTPS redirect on `:80` (one-line nginx change via `sudo`).
3. **#11** — wire up an outbound notification path so future failures find a human.
4. **#17** — re-run the patched survey as `phelan` and finish populating the live-server doc.
5. **#8, #9, #12, #13, #14, #16, #19, #20, #21, #22** — cleanup, audit, key hygiene, and the stale vim. Bundle into one or two `sudo`-friendly maintenance windows.

Items that need IT (open a ticket):
- **#4** — request `chmod 600 /root/.ssh/authorized_keys` from IT.
- **#5** — request that IT enable `unattended-upgrades` (they may already do equivalent patching out-of-band).
- **#15** — coordinate a controlled reboot with IT for a fresh kernel; only do this AFTER #2 is in place so the services come back automatically.
- **#1** — confirm exactly what IT's backup covers (and decide whether the Nanofab team wants a secondary tier).
