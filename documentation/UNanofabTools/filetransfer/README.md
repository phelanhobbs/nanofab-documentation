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
