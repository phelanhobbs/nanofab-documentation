# Server Access — Known Issues & Technical Debt

Working list for the SSH access pattern and the two tmux sessions on `nfhistory`. Separate from the successor docs. Nothing here has been changed in the code or in the server's current setup.

Severity: **High** = operational/security risk · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Shared `phelan` account on `nfhistory` — Medium (structural constraint)
- **Where:** every Nanofab user authenticates as the same `phelan` UNIX user on the server. Per-user identity exists only as a distinct line in `/home/phelan/.ssh/authorized_keys`.
- **Reality:** **the Nanofab team cannot create UNIX accounts.** University IT owns `root` on `nfhistory`; the Nanofab admin has `sudo` as `phelan` but cannot `su` to root or `useradd` new users. The shared-account model is therefore a structural constraint imposed by IT's operational boundary, not a Nanofab implementation choice.
- **Risk (residual):** no per-user audit trail in `wtmp`/`last`/process accounting — every Nanofab action appears as `phelan`. Revocation requires editing `authorized_keys`. If a key isn't annotated with whose it is, offboarding becomes guesswork.
- **Mitigation (Nanofab-side):** keep a tightly-controlled key-issuance log in the lab binder or the Nanofab-shared password manager: name, fingerprint, date issued, date rotated, date revoked. The runbook (`§5.1` step 5) already calls for this.
- **Fix (if ever desired):** **open a ticket with University IT** asking them to create per-person UNIX accounts on `nfhistory` (e.g. `faithh`, etc.), each with `sudo` rights as needed, with `phelan` retained for the service processes. Until IT agrees, item #1 cannot be implemented from the Nanofab side.

### 2. Hard-coded server IP in every user's `~/.ssh/config` — High
- **Where:** `Hostname 155.98.11.8` in the `~/.ssh/config` block users place on CADE.
- **Risk:** if the server is renumbered (planned move, DHCP change, subnet renumber) every user's CADE config must be updated by hand. There is no DNS abstraction layer. The IP is also publicly documented now (here and in onboarding emails), which leaks an internal address.
- **Fix:** ask College of Engineering IT to register a DNS A record such as `nfhistory.eng.utah.edu` pointing at the internal IP, then change every user's config to use the name. Update this runbook in lockstep. Treat the IP itself as sensitive until the alias exists.

### 3. tmux sessions are the only process supervisor — ✅ RESOLVED (2026-06-18) *(was High)*
- **Resolution:** both services now run as **user-level systemd** units (`systemctl --user`, `Restart=on-failure`, linger enabled) rather than bare `python` in tmux, so a crash auto-restarts and a reboot brings them back. (Still `python run.py`, not gunicorn — optional follow-up per #7.)
- **Original finding:** the website (`flaskserver`) and HSCDownloader (`downloader`) ran as plain `python` inside tmux with nothing supervising them — a crash left the service down until a human noticed, and a reboot killed both sessions.
- **Note:** these are *user* units (passwordless sudo is scoped to `systemctl`, not `/etc`); a root unit would need IT, but user-unit + linger is equivalent for uptime.

### 4. Accidental `exit` or `Ctrl-c` inside a session takes the service down — High (impact) / Low (likelihood once trained)
- **Where:** any attach. There is no guard, no `trap`, no read-only mode.
- **Risk:** a user attaches to look at logs, hits `Ctrl-c` reflexively, and silently kills the website. The layman README emphasizes `Ctrl-b d` precisely because of this.
- **Fix:** with #3 now resolved (2026-06-18, systemd auto-restart), an accidental kill self-heals. A read-only attach pattern for visitors (`tmux attach -r -t flaskserver`) is still a good stopgap against fat-fingering an interactive pane.

### 5. Two-hop access depends on CADE availability — Medium
- **Where:** every login flows through a CADE lab machine.
- **Risk:** if CADE is down for maintenance, the cleanroom server is unreachable, including for incident response. There is no out-of-band path documented.
- **Fix:** document a fallback (a second jump host inside the same network, or a maintenance VPN). At minimum, list which CADE machines have historically had the highest uptime so on-call staff don't burn through dead numbers.

### 6. No documented key rotation cadence — Medium
- **Where:** keys issued under §5.1 of the runbook have no expiry, no rotation policy, and no log of who holds what.
- **Risk:** an ex-employee's key remains valid until someone proactively removes it. With #1 in place, this is a single shared `authorized_keys` and tracking is on the honor system.
- **Fix:** adopt an annual rotation policy; keep a key-issuance log (name, fingerprint, date issued, date last rotated, date revoked). Use SSH certificate authority signing if/when CADE IT supports it — that gives expiring credentials automatically.

### 7. Production invocation likely differs from the documented `python run.py` — Medium
- **Where:** §4.3 of the runbook shows `python run.py` as the `flaskserver` recovery command. That is the Flask development server.
- **Risk:** if the live deployment is gunicorn (per `flaskserver/09-deployment-and-operations.md`) and a recovery uses `python run.py` instead, the server comes back up but in dev mode — single-threaded, debug-enabled, fewer workers, no proper signal handling. The site appears to work but degrades under load and exposes more in tracebacks.
- **Fix:** confirm which command the live `flaskserver` session currently runs (attach and look at process tree) and document *that* command exactly in §4.3. If it really is `python run.py`, treat that as a separate finding to migrate to gunicorn.

### 8. CADE NFS home is a single point of failure for the config — Low/Medium
- **Where:** every user's `~/.ssh/config` and `~/.ssh/nfhistory` lives in their NFS-mounted CADE home.
- **Risk:** if CADE NFS is degraded, the config can fail to load and `ssh nfhistory` will appear broken in ways unrelated to the cleanroom server. Confusing during incidents.
- **Fix:** mostly out-of-scope (CADE IT manages NFS) but worth noting in the user guide so people don't chase ghosts.

### 9. No documented "is the website actually responding?" check — Low
- **Where:** the runbook checks `tmux ls`; that confirms the *session* is alive, not that the *service* is responding.
- **Risk:** the Flask process may be wedged on a request, the gunicorn workers may be deadlocked, etc., while tmux is happy.
- **Fix:** add a `curl --max-time 5 https://nfhistory.nanofab.utah.edu/healthz` check to §4.2 (and add a `/healthz` route if it doesn't exist).

### 10. Private keys delivered out-of-band with no inventory — Low
- **Where:** §5.1 step 4 — "deliver private key via secure channel."
- **Risk:** "secure channel" is unspecified; a USB stick left in a drawer is technically secure but practically not. No record of *what* was delivered.
- **Fix:** standardize on a single delivery mechanism (e.g. age-encrypted file shared via lab password manager) and document it. Pair with the issuance log from #6.

### 11. The `Ctrl-b` prefix can clash with terminal shortcuts — Low
- **Where:** anyone attaching from a terminal that already uses `Ctrl-b`.
- **Risk:** confusing for new users; surprise key swallowing.
- **Fix:** consider standardizing on a less-conflicty prefix (e.g. `Ctrl-a`) via a server-wide `~/.tmux.conf`. Communicate the change in the runbook before doing it.

---

## Suggested priority order

Nanofab-actionable items only. Items the Nanofab team cannot resolve on its own (because they require IT) are listed separately below.

1. **#3** — ✅ done (2026-06-18): both services under user-systemd (eliminated #4's silent-kill failure mode). *(Optional: migrate to gunicorn per #7.)*
2. **#7** — confirm the live `flaskserver` command and document the actual one.
3. **#6, #10** — formalize key issuance, rotation, and delivery (Nanofab can do this with a binder/password manager; no IT involvement needed).
4. **#5, #8, #9, #11** — robustness and cleanup.

Needs IT (open a ticket):
- **#1** — per-person UNIX accounts on `nfhistory`. Cannot be implemented from the Nanofab side; structural until IT agrees.
- **#2** — DNS A record `nfhistory.eng.utah.edu` → `155.98.11.8`. CADE IT / Eng IT controls DNS.
