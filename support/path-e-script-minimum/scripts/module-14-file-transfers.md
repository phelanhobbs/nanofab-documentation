# Minimum Acceptable Full Path E - Module 14: File Transfers

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-14-file-transfers.md

# Module 14 - File Transfers From Machine PCs

## Goal

The maintainer understands how machine-control-PC scripts upload logs, why personal-account dependencies matter, and what a safer long-term upload model would look like.

## Required Screen

SHOW:

- `presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx` (repo path: presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx)
- `presentation/UNanofabTools/filetransfer/README.md` (repo path: presentation/UNanofabTools/filetransfer/README.md)
- `documentation/UNanofabTools/filetransfer/README.md` (repo path: documentation/UNanofabTools/filetransfer/README.md)
- `known-issues/UNanofabTools/filetransfer.md` (repo path: known-issues/UNanofabTools/filetransfer.md)

## Verbatim Script

READ ALOUD:

"The file-transfer scripts are the bridge from machine-control PCs to the `LogData` tree on `nfhistory`. This is not the same as CORES data. CORES data comes through `HSCDownloader.py` into `HSCDATA`. Machine-control-PC logs come through transfer scripts into `LogData`."

SHOW:

Open `File-Transfer-Scripts.pptx`.

READ ALOUD:

"These scripts matter because the website's machine log views are only as good as the uploaded files. If the scripts stop running, authenticate as the wrong account, write to the wrong path, or fail silently, the website can look alive while the underlying logs are stale."

"There is also an account-dependency issue. Some transfer workflows depend on a personal CADE account or personal setup. That is fragile for a handoff. A better Nanofab-side fix is a purpose-bound SSH key that authenticates as the shared `phelan` server account and is limited to the upload purpose. A cleaner long-term dedicated UNIX service account would require University IT because Nanofab cannot create UNIX accounts."

## Source Demo

DO:

Run:

```sh
rg -n "scp|ssh|phelan|CADE|LogData|mutex|powershell|bat" ../UNanofabTools documentation/UNanofabTools/filetransfer known-issues/UNanofabTools/filetransfer.md
```

READ ALOUD:

"This search finds upload mechanics, account names, target paths, and script types. The maintainer should know which scripts live on control PCs, which code lives in the repo, and which parts are not automatically visible from the server."

SHOW:

Open `known-issues/UNanofabTools/filetransfer.md` (repo path: known-issues/UNanofabTools/filetransfer.md).

READ ALOUD:

"Known issues here should focus on reliability, account independence, safe key management, upload path correctness, and observability. It is not enough that a script worked on one person's workstation. The successor needs a repeatable operational model."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What data tree do file-transfer scripts write? | `LogData`. |
| How is `LogData` different from `HSCDATA`? | `LogData` is uploaded machine-control-PC logs; `HSCDATA` is CORES-derived CSV data written by `HSCDownloader.py`. |
| Why are personal-account dependencies risky? | Uploads can break when a person's CADE account, key, workstation, permissions, or employment status changes. |
| What is the Nanofab-side fix? | Use a purpose-bound SSH key authenticating as `phelan` for upload workflows, with documented controls. |
| What would require University IT? | A dedicated UNIX service account or per-machine/per-user UNIX accounts on `nfhistory`. |
| How would you tell whether uploads are fresh? | Check recent modification times, expected files per machine, transfer logs/output, and website data freshness. |
| What should be documented for each machine-control PC? | Script location, schedule/trigger, source path, target path, account/key used, expected files, failure signs, and owner. |

REQUIRE:

The maintainer can distinguish CORES downloader data from machine-control-PC uploaded logs and can describe the account-dependency risk.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot identify the difference between `HSCDATA` and `LogData`.


# Expanded Module 14: File Transfers

READ ALOUD:

This expanded section revisits Module 14, File Transfers. The focus is machine-control-PC upload scripts, LogData, and account dependencies. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 14

READ ALOUD:

We are now doing the orientation pass for File Transfers. The maintainer should connect this module to machine-control-PC upload scripts, LogData, and account dependencies. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx`
- `presentation/UNanofabTools/filetransfer/README.md`
- `documentation/UNanofabTools/filetransfer/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention machine-control-PC upload scripts, LogData, and account dependencies. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 14

READ ALOUD:

We are now doing the evidence pass for File Transfers. The maintainer should connect this module to machine-control-PC upload scripts, LogData, and account dependencies. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx`
- `presentation/UNanofabTools/filetransfer/README.md`
- `documentation/UNanofabTools/filetransfer/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention machine-control-PC upload scripts, LogData, and account dependencies. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: documentation/UNanofabTools/filetransfer/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# File-Transfer Scripts — Developer Documentation

Reference for the per-machine log-shipping scripts. They run on each tool's Windows control PC and push recently changed logs to the server over SSH via PuTTY's `pscp`. Bugs/tech debt: `known-issues/UNanofabTools/filetransfer.md`.

## 1. Overview

| File | Lang | Scheduling | Notes |
|------|------|-----------|-------|
| `FileTransferTemplate.ps1` | PowerShell | self-loop to midnight | Master template; copy + customize per machine |
| `ALDTransfer.ps1` | PowerShell | self-loop (next run ~daily) | ALD instance; refined relative-path handling |
| `Dent635Transfer.ps1` | PowerShell | self-loop | Denton 635 instance |
| `CTRFurnaceTransfer.ps1` | PowerShell | self-loop | Furnace instance |
| `CTRFurnaceTransfer.bat` | Batch (cmd) | Windows Task Scheduler (run-once) | Windows XP-compatible furnace version |

Destination as committed in the scripts: `pscp` over SSH (port 22) to `nfhistory.nanofab.utah.edu`, authenticating as `phelanh`, into `/Users/phelanh/Desktop/Logs/<MACHINE>`. That path/account pair looks like the older personal-account or legacy-host model, not the current documented `phelan`/VM service model.

**Production-truth warning:** do not assume these scripts are feeding the current Flask deployment until live evidence proves it. Start file-transfer maintenance by checking a recent control-PC run, the server-side destination directory, and the Flask machine-page read path. If current uploads still land under `phelanh` or `/Users/...`, treat that as the high-priority issue tracked in `known-issues/UNanofabTools/filetransfer.md` (repo path: known-issues/UNanofabTools/filetransfer.md) #1.

## 2. Common structure (PowerShell template)

`FileTransferTemplate.ps1` defines the pattern; the per-machine files are edited copies.

### 2.1 Single-instance lock
```powershell
$mutexName = "Global\ALDTransferScriptMutex"
$mutex = New-Object System.Threading.Mutex($false, $mutexName)
if (-not $mutex.WaitOne(0, $false)) { ...exit... }
```
A named mutex prevents concurrent runs. **Note:** the template and ALD copy use `ALDTransferScriptMutex`; other machine copies have started diverging to machine-specific names. Keep new copies machine-specific so the name matches the script.

### 2.2 Per-machine configuration (edit these)
```powershell
$logFilePath    = "...\script\log.txt"      # this script's own log
$sshServer      = "nfhistory.nanofab.utah.edu"
$sshPort        = 22
$sshUsername    = "phelanh"                  # personal account (see known-issues)
$watcherPath    = "C:\...\Logfile"           # folder to watch
$pscpPath       = "C:\Program Files\PuTTY\pscp.exe"
$privateKeyPath = "C:\Users\...\.ssh\id_rsa.ppk"
$remotePath     = "/Users/phelanh/Desktop/Logs/<MACHINE>"
```

### 2.3 `Send-Files`
```powershell
$files = Get-ChildItem -Path $watcherPath -Recurse |
         Where-Object { $_.LastWriteTime -ge (Get-Date).AddDays(-1) }
foreach ($file in $files) {
    # compute relative path under $watcherPath, map "\" -> "/"
    $pscpArguments = "-P", $sshPort, "-i", "`"$privateKeyPath`"",
                     "`"$($file.FullName)`"",
                     "${sshUsername}@${sshServer}:`"$remotePathWithRelativePath`""
    Start-Process -FilePath $pscpPath -ArgumentList $pscpArguments -NoNewWindow -Wait
}
```
Selects files with `LastWriteTime` within the past 24h and `pscp`s each, preserving sub-directory structure under `$remotePath`.

> **Relative-path handling differs between files.** The template uses a simple `-replace [regex]::Escape($watcherPath)`; `ALDTransfer.ps1` uses a more careful `Substring(...).TrimStart('\')` + backslash→forward-slash conversion. The ALD version is the corrected one — fold its logic back into the template. See known-issues.

### 2.4 Scheduling loop
```powershell
Send-Files                              # run once at start
while ($true) {
    $next = [datetime]::Today.AddDays(1)   # midnight (ALD: guards if already past)
    Start-Sleep -Seconds ($next - (Get-Date)).TotalSeconds
    Send-Files
}
```
The script runs immediately, then sleeps until the next midnight and repeats. The `finally` block releases/disposes the mutex.

## 3. Batch version (`CTRFurnaceTransfer.bat`)

For Windows XP furnace PCs that can't run modern PowerShell. Differences:
- **Run-once** (no self-loop) — intended to be invoked by the Windows Task Scheduler on a schedule.
- Lock via a file in `%TEMP%\FurnTransferScript.lock` instead of a mutex.
- Walks the watched dir with `for /f ... in ('dir /s /b /a-d ...')` and `pscp`s each file (no 24-hour filter — it processes all files each run).
- Logs to `%logFilePath%`; checks `%ERRORLEVEL%` after each transfer.

Config block at the top mirrors the PowerShell variables (`watcherPath`, `pscpPath`, `privateKeyPath`, `remotePath`, `sshServer/Port/Username`).

## 4. Prerequisites on the machine PC
- PuTTY installed (`pscp.exe`).
- A PuTTY-format private key (`.ppk`) authorized for `phelanh@nfhistory`.
- The watched folder path correct for that tool.
- For `.bat`: a Windows Scheduled Task to invoke it.

(There is an end-user setup guide in the repo root: `FileTransferSetup.md`.)

## 5. Maintenance / recommendations
- **Remove the personal-account dependency**: replace the `phelanh` CADE login with either (a) a dedicated UNIX service account on `nfhistory` — this is an IT ticket because University IT controls account creation, or (b) a purpose-bound SSH key authenticating as the shared `phelan` server account (Nanofab-side only, no IT involvement; pair it with `command=` and `restrict` options in `authorized_keys` to limit it to the ingest path). Affects every file plus the server-side destination path. See `known-issues/UNanofabTools/filetransfer.md` #1 and `known-issues/UNanofabTools/serveraccess.md` #1 for the operational-boundary discussion.
- **Unify path logic**: backport `ALDTransfer.ps1`'s relative-path handling into the template and the other instances.
- **Prefer Task Scheduler over self-loops**: the `while($true)` loop is fragile (a crash stops uploads until someone notices); the `.bat`'s run-once + scheduler model is more robust. Consider converting the PowerShell ones similarly.
- **Mutex naming**: keep each machine's mutex name distinct, and update the template so new copies do not inherit the ALD name.
- **Error handling**: the PowerShell `Send-Files` doesn't check `pscp` exit codes (the `.bat` does) — add it.

See the layman guide at `presentation/UNanofabTools/filetransfer/README.md`.


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/filetransfer.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# File-Transfer Scripts — Known Issues & Technical Debt

Working list for the per-machine log-shipping scripts. Separate from the successor docs. Nothing here has been changed in the code.

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
