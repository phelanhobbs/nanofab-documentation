# Medium Full Path E - Module 14: File Transfers

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-14-file-transfers.md

# Module 14 - File Transfers From Machine PCs

## Goal

The maintainer understands how machine-control-PC scripts upload logs, why personal-account dependencies matter, and what a safer long-term upload model would look like.

## Required Screen

SHOW:

- `../../presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx` (reference path: ../../presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx)
- `../../presentation/UNanofabTools/filetransfer/README.md` (reference path: ../../presentation/UNanofabTools/filetransfer/README.md)
- `../../documentation/UNanofabTools/filetransfer/README.md` (reference path: ../../documentation/UNanofabTools/filetransfer/README.md)
- `../../known-issues/UNanofabTools/filetransfer.md` (reference path: ../../known-issues/UNanofabTools/filetransfer.md)

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
rg -n "scp|ssh|phelan|CADE|LogData|mutex|powershell|bat" ../UNanofabTools ../../documentation/UNanofabTools/filetransfer ../../known-issues/UNanofabTools/filetransfer.md
```

READ ALOUD:

"This search finds upload mechanics, account names, target paths, and script types. The maintainer should know which scripts live on control PCs, which code lives in the repo, and which parts are not automatically visible from the server."

SHOW:

Open `../../known-issues/UNanofabTools/filetransfer.md` (reference path: ../../known-issues/UNanofabTools/filetransfer.md).

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

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

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

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

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

## Source-code pass for Module 14

READ ALOUD:

We are now doing the source-code pass for File Transfers. The maintainer should connect this module to machine-control-PC upload scripts, LogData, and account dependencies. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

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

## Live-state pass for Module 14

READ ALOUD:

We are now doing the live-state pass for File Transfers. The maintainer should connect this module to machine-control-PC upload scripts, LogData, and account dependencies. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

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

## Failure-mode pass for Module 14

READ ALOUD:

We are now doing the failure-mode pass for File Transfers. The maintainer should connect this module to machine-control-PC upload scripts, LogData, and account dependencies. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

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

Destination: `pscp` over SSH (port 22) to `nfhistory.nanofab.utah.edu`, into `/Users/phelanh/Desktop/Logs/<MACHINE>`. The legacy server's `/download` route (and the Flask `machines` blueprint) read from a `LogData/`/`Desktop/Logs/` tree fed by these uploads.

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


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/filetransfer/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# File-Transfer Scripts — A Plain-English Guide

This guide explains the small Windows scripts that automatically copy machine log files up to the server. Written for a non-coder; terms are defined as they appear.

## What problem do they solve?

Many cleanroom tools write their log files to the **Windows PC that controls the machine** — and those files just sit there locally. For the website to show a tool's data, those logs need to get from the machine's PC to the server.

These scripts are the **delivery service**: each one runs on a machine's control PC, watches that machine's log folder, and copies any recently changed files up to the server automatically — no one has to remember to do it by hand.

## The files in this group

| File | What it is |
|------|------------|
| `FileTransferTemplate.ps1` | The master template — a blank version you copy and customize per machine |
| `ALDTransfer.ps1` | The template filled in for the ALD tool |
| `Dent635Transfer.ps1` | Filled in for the Denton 635 |
| `CTRFurnaceTransfer.ps1` | Filled in for the furnace controller |
| `CTRFurnaceTransfer.bat` | An older-style version for very old furnace PCs (Windows XP) |

They're all variations on one idea. `FileTransferTemplate.ps1` is the original; the others are copies adjusted for a specific machine (different folder to watch, different label on the server).

## How they work

Each script does roughly this:

1. **Make sure only one copy is running.** It sets a "lock" so two copies can't run at once and trip over each other.
2. **Find recently changed files.** It looks in the machine's log folder for any file modified in the last 24 hours.
3. **Copy them to the server.** For each one, it securely copies the file up to the server using a tool called **pscp** (part of PuTTY, a common Windows tool for secure file transfer over SSH — an encrypted connection).
4. **Repeat on a schedule.** The PowerShell versions then wait until midnight and do it again, every day. The older batch version instead runs once and is launched by Windows' scheduler.

So once set up, each machine quietly ships its latest logs to the server every day without anyone touching it.

## "PowerShell" vs "batch"

- **PowerShell (`.ps1`)** is the modern Windows scripting language. The `.ps1` files are the current versions.
- **Batch (`.bat`)** is the old Windows scripting style. The one `.bat` file exists because some furnace control PCs still run Windows XP, which can't run modern PowerShell well. It does the same job in the older language and is run by the Windows Task Scheduler rather than looping on its own.

## Setting one up (the big picture)

To deploy one for a new machine, you copy the template and edit a handful of clearly marked values near the top:

- the folder to watch (where that machine writes its logs),
- where PuTTY's `pscp` tool lives on that PC,
- the secure key file used to log in to the server,
- the destination folder on the server,
- and a path for the script's own log.

After that, it's set to run automatically. (There's a separate setup guide in the repository with the exact steps.)

## Good to know

- They only **copy** files; they never delete or change the originals on the machine.
- Transfers are **encrypted** (over SSH), so logs aren't sent in the clear.
- They only send files changed in the **last 24 hours**, so they don't re-upload the entire history every day.
- Each must be **customized per machine** — the watched folder and server label differ for each tool.
- They currently log in to the server with a personal CADE account. The developer notes describe two ways to remove that dependency — either ask University IT for a dedicated service account (an IT ticket) or generate a purpose-bound SSH key that authenticates as the shared `phelan` server account (no IT involvement). Either way, the goal is that transfers survive if a person leaves.

In short: these are the unattended couriers that carry each machine's daily logs from its control PC up to the server, where the website can display them.


# Module Slide Note Corpus



## Slide Notes From presentation/UNanofabTools/filetransfer/slides/_build/build_tool.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); const fs = require(
- ); const { Deck } = require(
- ); const M = require(
- ); const modPath = process.argv[2]; if (!modPath) { console.error(
- ); process.exit(1); } const OUT = process.env.OUT || path.join(__dirname,
- ); fs.mkdirSync(OUT, { recursive: true }); (async () => { const mod = require(path.join(__dirname, modPath)); const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter, footer:
- + mod.title }); mod.build(d); const outPath = path.join(OUT, mod.filename); await d.save(outPath); console.log(


## Slide Notes From presentation/UNanofabTools/filetransfer/slides/_build/deckkit.js

READ ALOUD OR USE AS SPEAKER NOTES:

- . */ const pptxgen = require(
- ); // ---- Palette ---- const C = { crimson:
- , // U of U primary crimsonDk:
- , // darker crimson for bands/title ink:
- , // near-black body text gray:
- , // muted text grayLt:
- , // light panel / code box background panelLine:
- , // panel border codeInk:
- , // code text white:
- , }; const FONT_H =
- ; // headers — has personality, professional const FONT_B =
- ; // body const FONT_M =
- ; // monospace for code const PW = 13.33, PH = 7.5; // page size (LAYOUT_WIDE) const MX = 0.7; // left/right margin const CONTENT_W = PW - MX * 2; function makeShadow() { return { type:
- , blur: 5, offset: 2, angle: 135, opacity: 0.12 }; } class Deck { constructor({ title, subtitle, author, footer }) { const p = new pptxgen(); p.layout =
- ; p.author = author ||
- ; p.title = title; this.p = p; this.shortTitle = title; this.footer = footer ||
- ; this.n = 0; } // crimson footer band + slide number; consistent motif on content slides _footer(slide) { slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: PH - 0.32, w: PW, h: 0.32, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(this.footer, { x: MX, y: PH - 0.32, w: 8, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); slide.addText(String(this.n), { x: PW - 1.2, y: PH - 0.32, w: 0.5, h: 0.32, margin: 0, fontFace: FONT_B, fontSize: 9, color: C.white, align:
- , }); } // small crimson square motif + title at top of content slides _header(slide, title) { slide.addShape(this.p.shapes.RECTANGLE, { x: MX, y: 0.55, w: 0.18, h: 0.36, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(title, { x: MX + 0.32, y: 0.42, w: CONTENT_W - 0.32, h: 0.7, margin: 0, fontFace: FONT_H, fontSize: 26, bold: true, color: C.ink, align:
- , }); } _content(title) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; this._header(slide, title); this._footer(slide); return slide; } _notes(slide, notes) { if (notes) slide.addNotes(notes); } // ---------- TITLE SLIDE ---------- title_slide({ kicker, title, subtitle, presenter, role, dept, date, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.white }; // left crimson band motif slide.addShape(this.p.shapes.RECTANGLE, { x: 0, y: 0, w: 0.45, h: PH, fill: { color: C.crimson }, line: { type:
- }, }); // kicker (topic number / series) slide.addText(kicker ||
- , { x: 1.0, y: 1.5, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color: C.crimson, charSpacing: 2, align:
- , }); // main title slide.addText(title, { x: 1.0, y: 2.0, w: PW - 2, h: 1.7, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.ink, align:
- , }); // subtitle slide.addText(subtitle ||
- , { x: 1.0, y: 3.75, w: PW - 2.2, h: 0.8, margin: 0, fontFace: FONT_B, fontSize: 17, color: C.gray, align:
- , }); // presenter block const block = [ { text: presenter ||
- , options: { bold: true, color: C.ink, fontSize: 14, breakLine: true } }, ]; if (role) block.push({ text: role, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (dept) block.push({ text: dept, options: { color: C.gray, fontSize: 12, breakLine: true } }); if (date) block.push({ text: date, options: { color: C.grayLt, fontSize: 11 } }); slide.addText(block, { x: 1.0, y: 5.5, w: PW - 2, h: 1.4, margin: 0, fontFace: FONT_B, align:
- , lineSpacingMultiple: 1.15, }); this._notes(slide, notes); return slide; } // ---------- SECTION DIVIDER ---------- section_slide({ label, title, notes }) { this.n += 1; const slide = this.p.addSlide(); slide.background = { color: C.crimsonDk }; slide.addText(label ||
- , { x: 1.0, y: 2.7, w: PW - 2, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, bold: true, color:
- , charSpacing: 2, }); slide.addText(title, { x: 1.0, y: 3.2, w: PW - 2, h: 1.6, margin: 0, fontFace: FONT_H, fontSize: 34, bold: true, color: C.white, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- BULLETS ---------- bullets({ title, intro, bullets, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const items = bullets.map((b, i) => { if (typeof b ===
- ) { return { text: b, options: { bullet: { code:
- , indent: 18 }, color: C.ink, fontSize: 15, paraSpaceAfter: 10, breakLine: true } }; } // {t, sub:true} return { text: b.t, options: { bullet: { code:
- , indent: 18 }, indentLevel: 1, color: C.gray, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true } }; }); slide.addText(items, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: PH - y - 0.6, margin: 0, fontFace: FONT_B, valign:
- , }); this._notes(slide, notes); return slide; } // ---------- CODE / MONO CALLOUT ---------- code({ title, intro, code, caption, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.6, margin: 0, fontFace: FONT_B, fontSize: 15, color: C.ink, valign:
- , }); y += 0.65; } const boxH = PH - y - (caption ? 1.0 : 0.6); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: boxH, rectRadius: 0.06, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(code, { x: MX + 0.5, y: y + 0.12, w: CONTENT_W - 0.7, h: boxH - 0.24, margin: 0, fontFace: FONT_M, fontSize: 12.5, color: C.codeInk, align:
- , }); if (caption) { slide.addText(caption, { x: MX + 0.32, y: y + boxH + 0.1, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 12, italic: true, color: C.gray, valign:
- , }); } this._notes(slide, notes); return slide; } // ---------- TWO COLUMN ---------- twocol({ title, left, right, notes }) { const slide = this._content(title); const y = 1.45, colW = (CONTENT_W - 0.5) / 2, h = PH - y - 0.6; const colX = [MX, MX + colW + 0.5]; [left, right].forEach((col, idx) => { const x = colX[idx]; // header chip slide.addText(col.heading, { x, y, w: colW, h: 0.45, margin: 0, fontFace: FONT_H, fontSize: 16, bold: true, color: C.crimson, valign:
- , }); const items = col.items.map((b) => ({ text: typeof b ===
- ? b : b.t, options: { bullet: { code:
- , indent: 16 }, color: C.ink, fontSize: 13.5, paraSpaceAfter: 8, breakLine: true }, })); slide.addText(items, { x, y: y + 0.5, w: colW, h: h - 0.5, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- TABLE ---------- table({ title, intro, headers, rows, colW, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 14, italic: true, color: C.gray, valign:
- , }); y += 0.55; } const head = headers.map((htext) => ({ text: htext, options: { fill: { color: C.crimson }, color: C.white, bold: true, fontSize: 12.5, valign:
- }, })); const body = rows.map((r, ri) => r.map((cell) => ({ text: String(cell), options: { fill: { color: ri % 2 === 0 ? C.white : C.panel }, color: C.ink, fontSize: 11.5, valign:
- , }, })) ); slide.addTable([head, ...body], { x: MX + 0.32, y, w: CONTENT_W - 0.32, colW: colW || undefined, border: { type:
- , pt: 0.5, color: C.panelLine }, align:
- , fontFace: FONT_B, rowH: 0.3, autoPage: false, }); this._notes(slide, notes); return slide; } // ---------- NUMBERED STEPS / PROCESS ---------- steps({ title, intro, steps, notes }) { const slide = this._content(title); let y = 1.4; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.6; } const n = steps.length; const avail = PH - y - 0.6; const rowH = Math.min(0.95, avail / n); steps.forEach((s, i) => { const ry = y + i * rowH; // number circle slide.addShape(this.p.shapes.OVAL, { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, fill: { color: C.crimson }, line: { type:
- }, }); slide.addText(String(i + 1), { x: MX + 0.32, y: ry, w: 0.45, h: 0.45, margin: 0, fontFace: FONT_B, fontSize: 15, bold: true, color: C.white, align:
- , }); const parts = [{ text: s.h +
- , options: { bold: true, color: C.ink, fontSize: 14 } }]; if (s.d) parts.push({ text: s.d, options: { color: C.gray, fontSize: 13 } }); slide.addText(parts, { x: MX + 0.95, y: ry - 0.12, w: CONTENT_W - 0.95, h: 0.69, margin: 0, fontFace: FONT_B, valign:
- , }); }); this._notes(slide, notes); return slide; } // ---------- BIG STAT CALLOUTS (grid of numbers) ---------- stats({ title, intro, stats, notes }) { const slide = this._content(title); let y = 1.5; if (intro) { slide.addText(intro, { x: MX + 0.32, y, w: CONTENT_W - 0.32, h: 0.5, margin: 0, fontFace: FONT_B, fontSize: 15, italic: true, color: C.gray, valign:
- , }); y += 0.7; } const n = stats.length; const gap = 0.4; const cardW = (CONTENT_W - gap * (n - 1)) / n; const cardH = 2.4; stats.forEach((s, i) => { const x = MX + i * (cardW + gap); slide.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y, w: cardW, h: cardH, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.panelLine, width: 1 }, shadow: makeShadow(), }); slide.addText(s.big, { x, y: y + 0.3, w: cardW, h: 1.1, margin: 0, fontFace: FONT_H, fontSize: 40, bold: true, color: C.crimson, align:
- , }); slide.addText(s.label, { x: x + 0.15, y: y + 1.45, w: cardW - 0.3, h: 0.85, margin: 0, fontFace: FONT_B, fontSize: 13, color: C.ink, align:


## Slide Notes From presentation/UNanofabTools/filetransfer/slides/_build/meta.js

READ ALOUD OR USE AS SPEAKER NOTES:

- Utah Nanofab · University of Utah
- UNanofabTools Server — A Plain-English Guide


## Slide Notes From presentation/UNanofabTools/filetransfer/slides/_build/tooldecks/filetransfer.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); module.exports = { filename:
- The couriers that ship each machine's logs up to the server. A plain-English walkthrough.
- This session covers the small Windows scripts that automatically copy machine log files from each tool's control PC up to the
- server. They're the delivery service that makes machine data appear on the website. No coding background needed. We'll cover why
- they exist, how they work, the difference between the modern and old versions, and how one is set up.
- Many tools write their logs to the Windows PC that runs the machine.
- Those files just sit there locally — the server can't see them.
- For the website to show a tool's data, the logs must get to the server.
- These scripts move them automatically, so no one has to remember.
- Set up the why. Each cleanroom tool's control PC saves log files locally. The website can only show data the server has, so those
- logs need to travel from the machine's PC up to the server. These scripts are the automated couriers that do exactly that, every day,
- without anyone lifting a finger.
- The files in this group
- The master template — copy and customize per machine
- Template filled in for the ALD tool
- Filled in for the Denton 635
- Filled in for the furnace controller
- Older version for Windows XP furnace PCs
- The roster. There's one template and several copies of it, each adjusted for a specific machine (different folder to watch, different
- label on the server). The lone .bat file is an older-style version for furnace PCs still running Windows XP. They're all the same
- idea with per-machine details swapped in.
- , steps: [ { h:
- make sure only one copy runs at a time.
- look for logs changed in the last 24 hours.
- send each one to the server over an encrypted connection.
- wait until midnight and do it again.
- Walk the four steps. The script sets a lock so two copies can't run at once, finds files changed in the last day, securely copies each
- to the server using PuTTY's pscp tool over SSH (an encrypted channel), then waits until midnight and repeats. Once set up, each
- machine ships its latest logs every day, untended.
- What 'secure copy over SSH' means
- pscp is a small PuTTY tool for copying files over SSH.
- SSH is an encrypted connection — files aren't sent in the clear.
- Login uses a key file, not a typed password.
- Files land in a per-machine folder on the server.
- Demystify the transfer. pscp is part of PuTTY, a common Windows tool; SSH is the standard encrypted way to reach another computer.
- The script authenticates with a key file rather than a password, and drops each file into that machine's folder on the server. The
- encryption means the logs travel safely across the network.
- Loop on their own until midnight.
- For furnace PCs still on Windows XP.
- Run once; Windows' scheduler repeats them.
- Explain the two flavors. PowerShell is modern Windows scripting — the .ps1 files are current and loop on their own. The single .bat
- file exists because some furnace control PCs still run Windows XP, which can't run modern PowerShell well; it does the same job in the
- older language and relies on Windows' Task Scheduler to run it on a schedule. The developer notes actually recommend the scheduler
- approach for all of them, as it's more reliable.
- Setting one up (the big picture)
- Copy the template and edit a few clearly-marked values:
- The folder to watch (where that machine writes its logs).
- Where PuTTY's pscp tool lives on that PC.
- The key file used to log in to the server.
- The destination folder on the server.
- Outline deployment without the full procedure. You copy the template and edit a handful of values near the top: which folder to
- watch, where pscp is, which key to use, and where on the server the files go. Then it's set to run automatically. There's a separate
- step-by-step setup guide in the repository for the exact commands.
- Good to know (and a recommendation)
- They only copy files — originals on the machine are never changed.
- Only files changed in the last 24h are sent, not the whole history.
- Each must be customized per machine.
- They log in with a personal account — remove that dependency via either an IT-issued service account OR a purpose-bound SSH key as 'phelan'.
- Set expectations and flag the main recommendation. The scripts are read-and-copy only; they never alter or delete the originals. They
- send just the last day's changes to avoid re-uploading everything. Each needs per-machine customization. The one real concern: they
- authenticate with a personal CADE account, so if that account is ever disabled, every machine's uploads stop. There are two ways to
- fix this. The cleanest is to ask University IT for a dedicated service account on nfhistory, but IT controls account creation so
- that's a ticket, not a one-afternoon job. The Nanofab-side alternative is to generate a purpose-bound SSH key that authenticates
- as the shared phelan server account, with command= restrictions in authorized_keys to limit what the key can do. Either fix
- Securely copied over SSH with pscp; originals untouched.
- One template, customized per machine; a batch version for old PCs.
- Recommendation: remove personal-account dependency + use Task Scheduler.
- Wrap up. These unattended scripts are how each machine's daily logs reach the server, where the website displays them. They're
- simple, encrypted, and read-only. The two improvements worth making — remove the personal-account dependency (IT service account
- or a purpose-bound shared-account key) and switch to the Windows Task Scheduler instead of self-loops — are in the developer
