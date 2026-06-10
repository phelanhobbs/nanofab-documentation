# File-Transfer Scripts — Known Issues & Technical Debt

Working list for the per-machine log-shipping scripts. Separate from the successor docs. One code change has been made (2026-06-10): `FileTransferTemplate.ps1`'s divergent Windows-style `$remotePath` placeholder was aligned with the Unix-style form every deployed per-machine script uses. Everything else here is unchanged in code.

Severity: **High** = operational/security risk · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Personal SSH account used for transfers — High
- **Where:** all files — `$sshUsername = "phelanh"`, destination `/Users/phelanh/Desktop/Logs/...`. (`phelanh` is the personal CADE account, not the `phelan` cleanroom account on `nfhistory`. The `/Users/` prefix suggests the destination was a macOS host — likely the legacy `hscdisplayerserver` — meaning the transfers have not been re-pointed at the Flask `nfhistory` deployment.)
- **Risk:** every machine's uploads depend on one person's CADE account; if it's disabled (staff turnover), all transfers silently stop and logs pile up locally. Compounded by the path possibly pointing at the deprecated server.
- **Fix:**
  - **Confirm where transfers currently land.** Inspect a recent run; if the destination is the legacy Mac server, that's its own urgent finding (the legacy server is documented as deprecated).
  - **For a non-personal authentication path**, the Nanofab team has two realistic options:
    - **Option A (IT ticket):** ask University IT to create a dedicated service account on `nfhistory` for ingest. Cleanest, but depends on IT — see `known-issues/UNanofabTools/serveraccess.md` #1 for the same dependency.
    - **Option B (Nanofab-side, no IT ticket):** keep authenticating as `phelan` on `nfhistory` but generate a dedicated *purpose-bound* SSH key (separate from any human's key), install its public half in `/home/phelan/.ssh/authorized_keys` with a `command=` restriction limiting it to scp into the ingest directory, and bake the private half into the per-machine PowerShell config. This eliminates the personal-account dependency without needing a new UNIX account, and rotation is just "issue a new key, push to each machine PC."
  - Update the username, the server-side destination path, and the server's read path in lockstep. Document whichever option was chosen.

### 2. Self-looping PowerShell is fragile — Medium
- **Where:** the `.ps1` files run `while ($true) { sleep until midnight; Send-Files }`.
- **Risk:** if the script crashes, reboots, or the window closes, uploads stop until a human notices. No auto-restart.
- **Fix:** convert to run-once + Windows Task Scheduler (as the `.bat` already does), which restarts reliably.

### 3. Relative-path logic differs between copies — Medium
- **Where:** `FileTransferTemplate.ps1` uses `-replace [regex]::Escape($watcherPath)`; `ALDTransfer.ps1` uses a corrected `Substring/TrimStart` + slash conversion.
- **Risk:** copies made from the template can mis-form remote paths (wrong sub-folders on the server).
- **Fix:** backport the ALD version's logic into the template and re-sync all instances.

### 4. PowerShell transfers don't check pscp success — Medium
- **Where:** `Send-Files` calls `Start-Process ... -Wait` but ignores the exit code (the `.bat` checks `%ERRORLEVEL%`).
- **Risk:** failed transfers are logged as if attempted but not flagged as failures; silent data gaps.
- **Fix:** capture and log the `pscp` exit code; alert on repeated failures.

### 5. Template / ALD mutex name still leaks into new copies — Low
- **Where:** `FileTransferTemplate.ps1` and `ALDTransfer.ps1` use `Global\ALDTransferScriptMutex`; other current copies have machine-specific names (`DentTransferScriptMutex`, `FurnTransferScriptMutex`).
- **Risk:** harmless today (they run on separate PCs) but misleading; a future copy made from the template can inherit the wrong machine name, and two scripts on one host would block each other unexpectedly.
- **Fix:** update the template to use a placeholder machine-specific mutex, or remove the mutex on single-purpose PCs.

### 6. 24-hour window can miss or duplicate edge files — Low/Medium
- **Where:** `.ps1` filters `LastWriteTime >= now-24h` and runs at midnight; the `.bat` sends *all* files every run.
- **Risk:** PowerShell version can miss a file written in a gap, or resend; batch version re-uploads everything (wasteful, but safe).
- **Fix:** track a high-water mark (last successful upload time) instead of a rolling 24h window.

### 7. Config edited by hand per machine — Low
- **Where:** paths/keys are literals near the top of each file, edited per deployment.
- **Risk:** easy to mis-edit; no validation that the watched folder or key exists.
- **Fix:** read config from a small per-machine file; validate paths at startup and log a clear error.

### 8. Windows XP dependency — Low (context)
- **Where:** `CTRFurnaceTransfer.bat` exists because some furnace PCs run Windows XP.
- **Risk:** XP is long unsupported; a security and maintenance liability beyond these scripts.
- **Note:** out of scope to fix here, but worth tracking at the facilities level.

---

## Suggested priority order
1. #1 — remove the personal-account dependency. Easiest Nanofab-side path is Option B (purpose-bound `phelan` key). Option A (a dedicated UNIX account) requires IT (see `serveraccess.md` #1).
2. #2 + #4 reliable scheduling + failure detection — Medium
3. #3 unify path logic across copies — Medium
4. #5, #6, #7 cleanup — Low/Medium
