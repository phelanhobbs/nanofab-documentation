

# Source Reconstruction: UNanofabTools/FileTransferTemplate.ps1

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `FileTransferTemplate.ps1`
- Lines read: `75`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `9949bf2d783e1e5f`
- Code fence language: `powershell`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```powershell
# Copyright (c) 2024 Phelan Hobbs
# All rights reserved.
#
# Version: 0.2.0
# Date: 2025-02-26
#
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce
# This PowerShell script is a template file used to monitor a folder and send the changed file to a server via pscp

# Log the script start time CHANGE THIS VALUE ###############
$logFilePath = "C:\Users\MACHINE\Desktop\script\log.txt" ####
#############################################################

Write-Host "$(Get-Date), Script started" *> $logFilePath

# Create mutex to prevent multiple instances of the script from running
$mutexName = "Global\ALDTransferScriptMutex"
$mutex = New-Object System.Threading.Mutex($false, $mutexName)
if (-not $mutex.WaitOne(0, $false)) {
    Write-Host "$(Get-Date), Script already running, exiting" *> $logFilePath
    exit
}

try {
    $sshServer = "nfhistory.nanofab.utah.edu"
    $sshPort = 22
    $sshUsername = "phelanh"
    # Configuration CHANGE THSESE VALUES ##########################
    $watcherPath = "C:\\MACHINE\\Desktop\\Logfile"             ####
    $pscpPath = "C:\\Program Files\\PuTTY\\pscp.exe"           ####
    $privateKeyPath = "C:\\Users\\MACHINE\\.ssh\\id_rsa.ppk"   ####
    $remotePath = "C:\\Users\\phelanh\\Desktop\\Logs\\MACHINE" ####
    ###############################################################

    # Function to send files modified in the past 24 hours
    function Send-Files {
        $currentTime = Get-Date
        $yesterday = $currentTime.AddDays(-1)

        # Get all files modified in the past 24 hours
        $files = Get-ChildItem -Path $watcherPath -Recurse | Where-Object { $_.LastWriteTime -ge $yesterday }

        foreach ($file in $files) {
            $relativePath = $file.FullName -replace [regex]::Escape($watcherPath), ''
            $remotePathWithRelativePath = Join-Path -Path $remotePath -ChildPath $relativePath
            $pscpArguments = "-P", $sshPort, "-i", "`"$privateKeyPath`"", "`"$file.FullName`"", "${sshUsername}@${sshServer}:`"$remotePathWithRelativePath`""

            # Log the full expected path
            $logMessage = "$(Get-Date), PSCP Arguments: $pscpArguments"
            Write-Host $logMessage *> $logFilePath

            # Send the file to the server via pscp
            Start-Process -FilePath $pscpPath -ArgumentList $pscpArguments -NoNewWindow -Wait
        }
    }

    #Calls send files function to send files modified in the past 24 hours as soon as program starts
    Send-Files

    # Schedule the task to run at midnight
    while ($true) {
        $currentTime = Get-Date
        $midnight = [datetime]::Today.AddDays(1)

        $timeToMidnight = $midnight - $currentTime
        Start-Sleep -Seconds $timeToMidnight.TotalSeconds

        # Send files modified in the past 24 hours
        Send-Files
    }
} finally {
    # Ensure that mutex is released
    $mutex.ReleaseMutex()
    $mutex.Dispose()
}
```

## Line-By-Line Reconstruction Notes

### Line 11

```text
$logFilePath = "C:\Users\MACHINE\Desktop\script\log.txt" ####
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 14

```text
Write-Host "$(Get-Date), Script started" *> $logFilePath
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 17

```text
$mutexName = "Global\ALDTransferScriptMutex"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 18

```text
$mutex = New-Object System.Threading.Mutex($false, $mutexName)
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 19

```text
if (-not $mutex.WaitOne(0, $false)) {
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 20

```text
    Write-Host "$(Get-Date), Script already running, exiting" *> $logFilePath
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 21

```text
    exit
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 22

```text
}
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 24

```text
try {
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 25

```text
    $sshServer = "nfhistory.nanofab.utah.edu"
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 26

```text
    $sshPort = 22
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 27

```text
    $sshUsername = "phelanh"
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 29

```text
    $watcherPath = "C:\\MACHINE\\Desktop\\Logfile"             ####
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 30

```text
    $pscpPath = "C:\\Program Files\\PuTTY\\pscp.exe"           ####
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 31

```text
    $privateKeyPath = "C:\\Users\\MACHINE\\.ssh\\id_rsa.ppk"   ####
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 32

```text
    $remotePath = "C:\\Users\\phelanh\\Desktop\\Logs\\MACHINE" ####
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 36

```text
    function Send-Files {
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 37

```text
        $currentTime = Get-Date
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 38

```text
        $yesterday = $currentTime.AddDays(-1)
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 41

```text
        $files = Get-ChildItem -Path $watcherPath -Recurse | Where-Object { $_.LastWriteTime -ge $yesterday }
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 43

```text
        foreach ($file in $files) {
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 44

```text
            $relativePath = $file.FullName -replace [regex]::Escape($watcherPath), ''
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 45

```text
            $remotePathWithRelativePath = Join-Path -Path $remotePath -ChildPath $relativePath
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 46

```text
            $pscpArguments = "-P", $sshPort, "-i", "`"$privateKeyPath`"", "`"$file.FullName`"", "${sshUsername}@${sshServer}:`"$remotePathWithRelativePath`""
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 49

```text
            $logMessage = "$(Get-Date), PSCP Arguments: $pscpArguments"
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 50

```text
            Write-Host $logMessage *> $logFilePath
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 53

```text
            Start-Process -FilePath $pscpPath -ArgumentList $pscpArguments -NoNewWindow -Wait
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 54

```text
        }
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 55

```text
    }
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 58

```text
    Send-Files
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 61

```text
    while ($true) {
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 62

```text
        $currentTime = Get-Date
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 63

```text
        $midnight = [datetime]::Today.AddDays(1)
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 65

```text
        $timeToMidnight = $midnight - $currentTime
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 66

```text
        Start-Sleep -Seconds $timeToMidnight.TotalSeconds
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 69

```text
        Send-Files
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 70

```text
    }
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 71

```text
} finally {
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 73

```text
    $mutex.ReleaseMutex()
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 74

```text
    $mutex.Dispose()
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 75

```text
}
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/FileTransferTemplate.ps1`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
