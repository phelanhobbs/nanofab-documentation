# Live Server — `nfhistory` Inventory & Maintenance

Formal reference for **what is currently running on the cleanroom server**, as opposed to what the source code says *should* be there. Companion to:

- the access procedure: [`../serveraccess/README.md`](../serveraccess/README.md)
- the layman version of this doc: [`../../../presentation/UNanofabTools/liveserver/README.md`](../../../presentation/UNanofabTools/liveserver/README.md)
- the deployment intent: [`../flaskserver/09-deployment-and-operations.md`](../flaskserver/09-deployment-and-operations.md)
- the maintenance to-do list surfaced by this snapshot: [`../../../known-issues/UNanofabTools/liveserver.md`](../../../known-issues/UNanofabTools/liveserver.md)

The values below combine two real survey captures by [`survey_nfhistory.sh`](survey_nfhistory.sh): a **2026-05-29** run as `root` ([`snapshots/nfhistory_survey_root_2026-05-29.txt`](snapshots/nfhistory_survey_root_2026-05-29.txt)) and a **2026-06-01** run as `phelan` ([`snapshots/nfhistory_survey_phelan_2026-06-01.txt`](snapshots/nfhistory_survey_phelan_2026-06-01.txt)). Use the raw outputs to re-check any populated table.

> **Caveat about the current snapshots.** The root run could not inspect `phelan`'s home. The 2026-06-01 `phelan` run discovered the live install path and tmux state, but still missed the venv / `.env` / SQLite / data-tree sections because the script still had the older install path baked in. The script has since been patched; re-run it as `phelan` and fold the missing sections into this doc — see §11 and §17 below.

## 0. Findings at the top

A condensed mirror of [`known-issues/UNanofabTools/liveserver.md`](../../../known-issues/UNanofabTools/liveserver.md). The numbers below intentionally match that file so cross-references stay stable.

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
16. **`wtmpdb` *login* history starts only in May 2026.** The *reboot* scan in §1 goes back further (Jan 7 2026); the two scans have different retention windows. Low-priority retention note.
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
| Last reboots visible in `wtmpdb` | reboot scan: `wtmpdb begins Wed Jan 7 13:59:11 2026` — older history not retained. (The *login* scan in §9.2 begins later, May 8 2026; the two scans have different windows.) |

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
| `downloader` | Wed Aug 27 2025 16:38:22 | pane 1 → `vim` (pane pid 48177); pane 2 → `python3` running `HSCDownloader.py` (pane pid 48188) | `/home/phelan/server/UNanofabTools` |

The actual listener processes (live `ps` output filtered to `phelan`):

| pid | uptime | command | what |
|-----|--------|---------|------|
| `2665755` | 13d 21h | `python run.py` | The Flask app — bound to `127.0.0.1:5000`. This is what nginx proxies to. |
| `323636` | 187d 17h | `python3 HSCDownloader.py` | The downloader. Note: uses `python3`, not `python`. |
| `71953` | 257d 22h | `vim HSCDownloader.py` | Stale editor session in the `downloader` tmux — see known-issues #19. |

The pids differ between the two tables because they come from two different scans: the tmux table reports *pane* pids (the pane's root process), while the `ps` table reports the long-running processes themselves. For `flaskserver`, the listener (2665755) doesn't match the pane pid (319076) because the running Flask process predates the current pane's shell — a previous tmux pane that's since been replaced started it. For `downloader`, the same applies to the stale editor: the pane pid is 48177 while `ps` shows the `vim HSCDownloader.py` process as 71953. Functionally, the website is alive; structurally, this is normal for a long-running tmux-supervised setup. Once the services are under systemd (finding #2), this kind of pid drift goes away.

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

Login scan: `wtmpdb begins Fri May 8 13:15:36 2026`, so older *login* history is not retained. (The *reboot* scan in §1 begins earlier, Jan 7 2026 — the two scans have different retention windows.) Consider raising the retention if forensic timeline ever matters.

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

- Access procedure: [`../serveraccess/README.md`](../serveraccess/README.md)
- Layman version: [`../../../presentation/UNanofabTools/liveserver/README.md`](../../../presentation/UNanofabTools/liveserver/README.md)
- Findings to fix: [`../../../known-issues/UNanofabTools/liveserver.md`](../../../known-issues/UNanofabTools/liveserver.md)
- The script that produces these snapshots: [`survey_nfhistory.sh`](survey_nfhistory.sh)
- Raw snapshots used here: [`snapshots/nfhistory_survey_root_2026-05-29.txt`](snapshots/nfhistory_survey_root_2026-05-29.txt) and [`snapshots/nfhistory_survey_phelan_2026-06-01.txt`](snapshots/nfhistory_survey_phelan_2026-06-01.txt)
