# Path F Module 08 - File Transfer Scripts

This module is part of the Path F ultra-deep reconstruction manual. Its goal is to make the selected source area reproducible from documentation alone. Read the module conceptually first, then use the source reconstruction sections as the line-level reference.

## Files Covered

- `UNanofabTools/ALDTransfer.ps1`
- `UNanofabTools/CTRFurnaceTransfer.bat`
- `UNanofabTools/CTRFurnaceTransfer.ps1`
- `UNanofabTools/Dent635Transfer.ps1`
- `UNanofabTools/FileTransferSetup.md`
- `UNanofabTools/FileTransferTemplate.ps1`

## Module Reconstruction Contract

A maintainer should be able to recreate these files by preserving public behavior, data contracts, route names, templates, command behavior, file paths, and operational boundaries. The code excerpts below are sanitized. Any redacted value must be supplied from secure local configuration, not recovered from this documentation.



# Source Reconstruction: UNanofabTools/ALDTransfer.ps1

- Repository: `UNanofabTools`
- Relative path: `ALDTransfer.ps1`
- Lines read: `83`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `2795955fb4e784c5`
- Code fence language: `powershell`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```powershell
# Copyright (c) 2024 Phelan Hobbs
# All rights reserved.
#
# Version: 0.3.1
# Date: 2025-03-05
#
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce
# This PowerShell script is a template file used to monitor a folder and send the changed file to a server via pscp

# Log the script start time CHANGE THIS VALUE ###########
$logFilePath = "C:\Users\ALD\Desktop\script\log.txt" ####
#########################################################
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
    # Configuration CHANGE THSESE VALUES ######################
    $watcherPath = "C:\\Cambridge NanoTech\\Logfile\\"       ####
    $pscpPath = "C:\\Program Files\\PuTTY\\pscp.exe"       ####
    $privateKeyPath = "C:\\Users\\ALD\\.ssh\\id_rsa.ppk"   ####
    $remotePath = "/Users/phelanh/Desktop/Logs/ALD" ####
    ###########################################################

    # Function to send files modified in the past 24 hours
    function Send-Files {
        $currentTime = Get-Date
        $yesterday = $currentTime.AddDays(-1)

        # Get all files modified in the past 24 hours
        $files = Get-ChildItem -Path $watcherPath -Recurse | Where-Object { $_.LastWriteTime -ge $yesterday }

        foreach ($file in $files) {
            $watcherPathNorm = $watcherPath.TrimEnd('\')
            $relativePath = $file.FullName.Substring($watcherPathNorm.Length-1).TrimStart('\')
            $formattedRelativePath = $relativePath -Replace '\\', '/'
            $remotePathWithRelativePath = "$remotePath/$formattedRelativePath"
            $pscpArguments = "-P", $sshPort, "-i", "`"$privateKeyPath`"", "`"$($file.FullName)`"", "${sshUsername}@${sshServer}:`"$remotePathWithRelativePath`""


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
        #if it's before 6am, set the script to run at today's 6 am
        $nextRunTime = [datetime]::Today.AddDays(1)

        #if it's after 6am, set the script to run at tomorrow's 6 am
        if ($currentTime -ge $nextRunTime) {
            $nextRunTime = $nextRunTime.AddDays(1)
        }

        $timeTillNextRun = $nextRunTime - $currentTime
        Start-Sleep -Seconds $timeTillNextRun.TotalSeconds

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

### Line 1

```text
# Copyright (c) 2024 Phelan Hobbs
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 1 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `none` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
# All rights reserved.
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 2 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
#
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 3 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
# Version: 0.3.1
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 4 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
# Date: 2025-03-05
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 5 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
#
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 6 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 7 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
# This PowerShell script is a template file used to monitor a folder and send the changed file to a server via pscp
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 8 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 9 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
# Log the script start time CHANGE THIS VALUE ###########
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 10 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
$logFilePath = "C:\Users\ALD\Desktop\script\log.txt" ####
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 11 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
#########################################################
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 12 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
Write-Host "$(Get-Date), Script started" *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 13 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 14 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
# Create mutex to prevent multiple instances of the script from running
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 15 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
$mutexName = "Global\ALDTransferScriptMutex"
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 16 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
$mutex = New-Object System.Threading.Mutex($false, $mutexName)
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 17 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
if (-not $mutex.WaitOne(0, $false)) {
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 18 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
    Write-Host "$(Get-Date), Script already running, exiting" *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 19 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
    exit
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 20 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
}
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 21 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 22 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
try {
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 23 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
    $sshServer = "nfhistory.nanofab.utah.edu"
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 24 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
    $sshPort = 22
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 25 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
    $sshUsername = "phelanh"
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 26 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
    # Configuration CHANGE THSESE VALUES ######################
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 27 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
    $watcherPath = "C:\\Cambridge NanoTech\\Logfile\\"       ####
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 28 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
    $pscpPath = "C:\\Program Files\\PuTTY\\pscp.exe"       ####
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 29 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
    $privateKeyPath = "C:\\Users\\ALD\\.ssh\\id_rsa.ppk"   ####
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 30 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
    $remotePath = "/Users/phelanh/Desktop/Logs/ALD" ####
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 31 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
    ###########################################################
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 32 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 33 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
    # Function to send files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 34 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
    function Send-Files {
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 35 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
        $currentTime = Get-Date
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 36 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
        $yesterday = $currentTime.AddDays(-1)
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 37 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 38 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
        # Get all files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 39 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
        $files = Get-ChildItem -Path $watcherPath -Recurse | Where-Object { $_.LastWriteTime -ge $yesterday }
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 40 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 41 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
        foreach ($file in $files) {
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 42 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
            $watcherPathNorm = $watcherPath.TrimEnd('\')
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 43 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
            $relativePath = $file.FullName.Substring($watcherPathNorm.Length-1).TrimStart('\')
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 44 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
            $formattedRelativePath = $relativePath -Replace '\\', '/'
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 45 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
            $remotePathWithRelativePath = "$remotePath/$formattedRelativePath"
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 46 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
            $pscpArguments = "-P", $sshPort, "-i", "`"$privateKeyPath`"", "`"$($file.FullName)`"", "${sshUsername}@${sshServer}:`"$remotePathWithRelativePath`""
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 47 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 48 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `transfer` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 49 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
            # Log the full expected path
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 50 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
            $logMessage = "$(Get-Date), PSCP Arguments: $pscpArguments"
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 51 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
            Write-Host $logMessage *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 52 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 53 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
            # Send the file to the server via pscp
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 54 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
            Start-Process -FilePath $pscpPath -ArgumentList $pscpArguments -NoNewWindow -Wait
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 55 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
        }
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 56 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
    }
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 57 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 58 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
    #Calls send files function to send files modified in the past 24 hours as soon as program starts
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 59 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
    Send-Files
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 60 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 61 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
    # Schedule the task to run at midnight
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 62 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
    while ($true) {
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 63 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
        $currentTime = Get-Date
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 64 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
        #if it's before 6am, set the script to run at today's 6 am
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 65 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
        $nextRunTime = [datetime]::Today.AddDays(1)
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 66 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 67 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
        #if it's after 6am, set the script to run at tomorrow's 6 am
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 68 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
        if ($currentTime -ge $nextRunTime) {
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 69 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
            $nextRunTime = $nextRunTime.AddDays(1)
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 70 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
        }
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 71 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 72 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
        $timeTillNextRun = $nextRunTime - $currentTime
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 73 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
        Start-Sleep -Seconds $timeTillNextRun.TotalSeconds
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 74 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 75 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
        # Send files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 76 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
        Send-Files
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 77 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
    }
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 78 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
} finally {
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 79 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
    # Ensure that mutex is released
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 80 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
    $mutex.ReleaseMutex()
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 81 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
    $mutex.Dispose()
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 82 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
}
```

Reconstruction rule: in `UNanofabTools/ALDTransfer.ps1`, line 83 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/ALDTransfer.ps1`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.


# Source Reconstruction: UNanofabTools/CTRFurnaceTransfer.bat

- Repository: `UNanofabTools`
- Relative path: `CTRFurnaceTransfer.bat`
- Lines read: `83`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `4bf674b259cbceff`
- Code fence language: `bat`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```bat
@echo on
:: filepath: c:\Users\Phe\Code\Work\UNanofabTools\CTRFurnaceTransferTask.bat
:: Copyright (c) 2024 Phelan Hobbs
:: All rights reserved.
::
:: Version: 0.4.0
:: Date: 2025-03-07
::
:: This code was created for the University of Utah Nanofab
:: Windows XP batch version of the furnace transfer script
:: Modified for scheduled task execution

:: Configuration - MODIFY THESE VALUES
set logFilePath=C:\Documents and Settings\user\Desktop\script\log.txt
set watcherPath=C:\Program Files\TymkonTools\DataLog
set pscpPath=C:\Documents and Settings\user\Desktop\script\PuTTY\pscp.exe
set privateKeyPath=C:\Documents and Settings\user\Desktop\script\.ssh\privKey.ppk
set remotePath=/Users/phelanh/Desktop/Logs/Furnaces
set sshServer=nfhistory.nanofab.utah.edu
set sshPort=22
set sshUsername=phelanh

:: Log the script start time
echo %date% %time%, Script started >> "%logFilePath%"

:: Check for running instance using a lock file
if exist "%TEMP%\FurnTransferScript.lock" (
    echo %date% %time%, Script already running, exiting >> "%logFilePath%"
    exit /b 1
)

:: Create lock file
echo %date% %time% > "%TEMP%\FurnTransferScript.lock"

:: Set error handling
setlocal EnableExtensions EnableDelayedExpansion

:: Process files and exit
call :SendFiles
call :CleanUp
exit /b 0

:SendFiles
    echo %date% %time%, Running SendFiles function >> "%logFilePath%"

    :: Find all files in the watched directory
    for /f "tokens=*" %%a in ('dir /s /b /a-d "%watcherPath%"') do (
        call :ProcessFile "%%a"
    )
    goto :eof

:ProcessFile
    :: Extract filename and path
    set "filePath=%~1"
    set "fileName=%~nx1"

    :: Calculate relative path
    call set relPath=%%filePath:%watcherPath%=%%

    :: Fix path formatting (replace backslashes with forward slashes)
    set "remoteFilePath=%remotePath%/%relPath:\=/%"

    :: Log the operation
    echo %date% %time%, Processing file: %filePath% >> "%logFilePath%"
    echo %date% %time%, Target path: %remoteFilePath% >> "%logFilePath%"

    :: Transfer the file using PSCP
    "%pscpPath%" -P %sshPort% -i "%privateKeyPath%" "%filePath%" %sshUsername%@%sshServer%:"%remoteFilePath%"

    :: Log the result
    if %ERRORLEVEL% EQU 0 (
        echo %date% %time%, Successfully transferred file: %fileName% >> "%logFilePath%"
    ) else (
        echo %date% %time%, ERROR: Failed to transfer file: %fileName%, Error code: %ERRORLEVEL% >> "%logFilePath%"
    )

    goto :eof

:CleanUp
    :: Remove lock file on exit
    echo %date% %time%, Script completed >> "%logFilePath%"
    if exist "%TEMP%\FurnTransferScript.lock" del "%TEMP%\FurnTransferScript.lock"
    goto :eof
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
@echo on
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 1 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `none` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
:: filepath: c:\Users\Phe\Code\Work\UNanofabTools\CTRFurnaceTransferTask.bat
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 2 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
:: Copyright (c) 2024 Phelan Hobbs
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 3 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
:: All rights reserved.
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 4 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
::
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 5 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
:: Version: 0.4.0
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 6 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
:: Date: 2025-03-07
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 7 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
::
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 8 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
:: This code was created for the University of Utah Nanofab
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 9 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
:: Windows XP batch version of the furnace transfer script
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 10 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
:: Modified for scheduled task execution
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 11 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 12 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
:: Configuration - MODIFY THESE VALUES
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 13 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
set logFilePath=C:\Documents and Settings\user\Desktop\script\log.txt
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 14 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
set watcherPath=C:\Program Files\TymkonTools\DataLog
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 15 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
set pscpPath=C:\Documents and Settings\user\Desktop\script\PuTTY\pscp.exe
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 16 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
set privateKeyPath=C:\Documents and Settings\user\Desktop\script\.ssh\privKey.ppk
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 17 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
set remotePath=/Users/phelanh/Desktop/Logs/Furnaces
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 18 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
set sshServer=nfhistory.nanofab.utah.edu
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 19 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
set sshPort=22
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 20 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
set sshUsername=phelanh
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 21 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 22 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
:: Log the script start time
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 23 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
echo %date% %time%, Script started >> "%logFilePath%"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 24 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 25 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
:: Check for running instance using a lock file
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 26 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `blank` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
if exist "%TEMP%\FurnTransferScript.lock" (
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 27 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
    echo %date% %time%, Script already running, exiting >> "%logFilePath%"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 28 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
    exit /b 1
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 29 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
)
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 30 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 31 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
:: Create lock file
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 32 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
echo %date% %time% > "%TEMP%\FurnTransferScript.lock"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 33 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 34 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
:: Set error handling
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 35 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
setlocal EnableExtensions EnableDelayedExpansion
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 36 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 37 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
:: Process files and exit
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 38 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
call :SendFiles
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 39 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
call :CleanUp
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 40 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
exit /b 0
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 41 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 42 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
:SendFiles
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 43 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
    echo %date% %time%, Running SendFiles function >> "%logFilePath%"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 44 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 45 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
    :: Find all files in the watched directory
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 46 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
    for /f "tokens=*" %%a in ('dir /s /b /a-d "%watcherPath%"') do (
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 47 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
        call :ProcessFile "%%a"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 48 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
    )
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 49 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
    goto :eof
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 50 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 51 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
:ProcessFile
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 52 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
    :: Extract filename and path
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 53 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
    set "filePath=%~1"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 54 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
    set "fileName=%~nx1"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 55 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 56 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
    :: Calculate relative path
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 57 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
    call set relPath=%%filePath:%watcherPath%=%%
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 58 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 59 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
    :: Fix path formatting (replace backslashes with forward slashes)
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 60 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
    set "remoteFilePath=%remotePath%/%relPath:\=/%"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 61 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 62 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
    :: Log the operation
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 63 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
    echo %date% %time%, Processing file: %filePath% >> "%logFilePath%"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 64 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
    echo %date% %time%, Target path: %remoteFilePath% >> "%logFilePath%"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 65 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 66 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
    :: Transfer the file using PSCP
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 67 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
    "%pscpPath%" -P %sshPort% -i "%privateKeyPath%" "%filePath%" %sshUsername%@%sshServer%:"%remoteFilePath%"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 68 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 69 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
    :: Log the result
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 70 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
    if %ERRORLEVEL% EQU 0 (
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 71 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
        echo %date% %time%, Successfully transferred file: %fileName% >> "%logFilePath%"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 72 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
    ) else (
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 73 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
        echo %date% %time%, ERROR: Failed to transfer file: %fileName%, Error code: %ERRORLEVEL% >> "%logFilePath%"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 74 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
    )
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 75 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 76 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
    goto :eof
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 77 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 78 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
:CleanUp
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 79 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
    :: Remove lock file on exit
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 80 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
    echo %date% %time%, Script completed >> "%logFilePath%"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 81 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
    if exist "%TEMP%\FurnTransferScript.lock" del "%TEMP%\FurnTransferScript.lock"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 82 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
    goto :eof
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.bat`, line 83 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/CTRFurnaceTransfer.bat`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.


# Source Reconstruction: UNanofabTools/CTRFurnaceTransfer.ps1

- Repository: `UNanofabTools`
- Relative path: `CTRFurnaceTransfer.ps1`
- Lines read: `77`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `3c837e95bcc1bde7`
- Code fence language: `powershell`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```powershell
# Copyright (c) 2024 Phelan Hobbs
# All rights reserved.
#
# Version: 0.3.0
# Date: 2025-03
#
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce
# This PowerShell script is a template file used to monitor a folder and send the changed file to a server via pscp

# Log the script start time CHANGE THIS VALUE ###################################
$logFilePath = "C:\\Documents and Settings\\user\\Desktop\\script\\log.txt"  ####
#################################################################################
Write-Host "$(Get-Date), Script started" *> $logFilePath

# Create mutex to prevent multiple instances of the script from running
$mutexName = "Global\FurnTransferScriptMutex"
$mutex = New-Object System.Threading.Mutex($false, $mutexName)
if (-not $mutex.WaitOne(0, $false)) {
    Write-Host "$(Get-Date), Script already running, exiting" *> $logFilePath
    exit
}

try {
    $sshServer = "nfhistory.nanofab.utah.edu"
    $sshPort = 22
    $sshUsername = "phelanh"
    # Configuration CHANGE THSESE VALUES #########################################################
    $watcherPath = "C:\\Program Files\\TymkonTools\\DataLog"                                  ####
    $pscpPath = "C:\\Documents and Settings\\user\\Desktop\\script\\PuTTY\\pscp.exe"          ####
    $privateKeyPath = "C:\\Documents and Settings\\user\\Desktop\\script\\.ssh\\privKey.ppk"  ####
    $remotePath = "/Users/phelanh/Desktop/Logs/Furnaces"                                      ####
    ##############################################################################################

    # Function to send files modified in the past 24 hours
    function Send-Files {
        $currentTime = Get-Date
        $yesterday = $currentTime.AddDays(-1)

        # Get all files modified in the past 24 hours
        $files = Get-ChildItem -Path $watcherPath -Recurse | Where-Object { $_.LastWriteTime -ge $yesterday }

        foreach ($file in $files) {
            $watcherPathNorm = $watcherPath.TrimEnd('\')
            $relativePath = $file.FullName.Substring($watcherPathNorm.Length-1).TrimStart('\')
            $formattedRelativePath = $relativePath -Replace '\\', '/'
            $remotePathWithRelativePath = "$remotePath/$formattedRelativePath"
            $pscpArguments = "-P", $sshPort, "-i", "`"$privateKeyPath`"", "`"$($file.FullName)`"", "${sshUsername}@${sshServer}:`"$remotePathWithRelativePath`""


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

### Line 1

```text
# Copyright (c) 2024 Phelan Hobbs
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 1 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `none` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
# All rights reserved.
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 2 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
#
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 3 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
# Version: 0.3.0
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 4 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
# Date: 2025-03
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 5 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
#
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 6 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 7 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
# This PowerShell script is a template file used to monitor a folder and send the changed file to a server via pscp
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 8 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 9 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
# Log the script start time CHANGE THIS VALUE ###################################
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 10 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
$logFilePath = "C:\\Documents and Settings\\user\\Desktop\\script\\log.txt"  ####
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 11 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
#################################################################################
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 12 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
Write-Host "$(Get-Date), Script started" *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 13 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 14 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
# Create mutex to prevent multiple instances of the script from running
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 15 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
$mutexName = "Global\FurnTransferScriptMutex"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 16 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
$mutex = New-Object System.Threading.Mutex($false, $mutexName)
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 17 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
if (-not $mutex.WaitOne(0, $false)) {
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 18 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
    Write-Host "$(Get-Date), Script already running, exiting" *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 19 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
    exit
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 20 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
}
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 21 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 22 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
try {
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 23 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
    $sshServer = "nfhistory.nanofab.utah.edu"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 24 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
    $sshPort = 22
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 25 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
    $sshUsername = "phelanh"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 26 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
    # Configuration CHANGE THSESE VALUES #########################################################
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 27 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
    $watcherPath = "C:\\Program Files\\TymkonTools\\DataLog"                                  ####
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 28 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
    $pscpPath = "C:\\Documents and Settings\\user\\Desktop\\script\\PuTTY\\pscp.exe"          ####
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 29 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
    $privateKeyPath = "C:\\Documents and Settings\\user\\Desktop\\script\\.ssh\\privKey.ppk"  ####
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 30 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
    $remotePath = "/Users/phelanh/Desktop/Logs/Furnaces"                                      ####
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 31 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
    ##############################################################################################
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 32 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 33 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
    # Function to send files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 34 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
    function Send-Files {
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 35 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
        $currentTime = Get-Date
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 36 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
        $yesterday = $currentTime.AddDays(-1)
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 37 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 38 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
        # Get all files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 39 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
        $files = Get-ChildItem -Path $watcherPath -Recurse | Where-Object { $_.LastWriteTime -ge $yesterday }
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 40 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 41 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
        foreach ($file in $files) {
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 42 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
            $watcherPathNorm = $watcherPath.TrimEnd('\')
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 43 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
            $relativePath = $file.FullName.Substring($watcherPathNorm.Length-1).TrimStart('\')
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 44 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
            $formattedRelativePath = $relativePath -Replace '\\', '/'
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 45 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
            $remotePathWithRelativePath = "$remotePath/$formattedRelativePath"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 46 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
            $pscpArguments = "-P", $sshPort, "-i", "`"$privateKeyPath`"", "`"$($file.FullName)`"", "${sshUsername}@${sshServer}:`"$remotePathWithRelativePath`""
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 47 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 48 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `transfer` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 49 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
            # Log the full expected path
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 50 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
            $logMessage = "$(Get-Date), PSCP Arguments: $pscpArguments"
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 51 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
            Write-Host $logMessage *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 52 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 53 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
            # Send the file to the server via pscp
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 54 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
            Start-Process -FilePath $pscpPath -ArgumentList $pscpArguments -NoNewWindow -Wait
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 55 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
        }
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 56 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
    }
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 57 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 58 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
    #Calls send files function to send files modified in the past 24 hours as soon as program starts
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 59 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
    Send-Files
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 60 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 61 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
    # Schedule the task to run at midnight
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 62 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
    while ($true) {
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 63 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
        $currentTime = Get-Date
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 64 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
        $midnight = [datetime]::Today.AddDays(1)
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 65 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 66 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
        $timeToMidnight = $midnight - $currentTime
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 67 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
        Start-Sleep -Seconds $timeToMidnight.TotalSeconds
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 68 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 69 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
        # Send files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 70 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
        Send-Files
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 71 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
    }
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 72 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
} finally {
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 73 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
    # Ensure that mutex is released
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 74 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
    $mutex.ReleaseMutex()
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 75 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
    $mutex.Dispose()
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 76 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
}
```

Reconstruction rule: in `UNanofabTools/CTRFurnaceTransfer.ps1`, line 77 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/CTRFurnaceTransfer.ps1`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.


# Source Reconstruction: UNanofabTools/Dent635Transfer.ps1

- Repository: `UNanofabTools`
- Relative path: `Dent635Transfer.ps1`
- Lines read: `102`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `5969b0c7cb80c18a`
- Code fence language: `powershell`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```powershell
# Copyright (c) 2024 Phelan Hobbs
# All rights reserved.
#
# Version: 0.3.2
# Date: 2025-03-05
#
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce
# This PowerShell script is a template file used to monitor a folder and send the changed file to a server via pscp

# Log the script start time CHANGE THIS VALUE ###############
$logFilePath = "C:\Users\Denton\Desktop\script\log.txt"  ####
Write-Host "$(Get-Date), Script started" *> $logFilePath

# Create mutex to prevent multiple instances of the script from running
$mutexName = "Global\DentTransferScriptMutex"
$mutex = New-Object System.Threading.Mutex($false, $mutexName)
if (-not $mutex.WaitOne(0, $false)) {
    Write-Host "$(Get-Date), Script already running, exiting" *> $logFilePath
    exit
}

try {
    $sshServer = "nfhistory.nanofab.utah.edu"
    $sshPort = 22
    $sshUsername = "phelanh"
    # Configuration CHANGE THSESE VALUES ###################################
    $watcherPath = "C:\\CIMPLICITY\\Integrity_36\\Event_Log_All"        ####
    $pscpPath = "C:\\Users\\Denton\\Desktop\\script\\puTTY\\pscp.EXE"   ####
    $privateKeyPath = "C:\\Users\\Denton\\Desktop\\script\\id_rsa.ppk"  ####
    $remotePath = "/Users/phelanh/Desktop/Logs/Denton635"               ####
    ########################################################################

    # Function to send files modified in the past 24 hours
    function Send-Files {
        $currentTime = Get-Date
        $yesterday = $currentTime.AddDays(-1)

        # Get all files modified in the past 24 hours
        $files = Get-ChildItem -Path $watcherPath -Recurse | Where-Object { $_.LastWriteTime -ge $yesterday }

        foreach ($file in $files) {
            $logMessage = "$(Get-Date), Processing file: $($file.FullName)"
            Write-Host $logMessage *> $logFilePath
            try {
                $watcherPathNorm = $watcherPath.TrimEnd('\')
                $relativePath = $file.FullName.Substring($watcherPathNorm.Length-2).TrimStart('\')
                $formattedRelativePath = $relativePath -Replace '\\', '/'
                $remotePathWithRelativePath = "$remotePath/$formattedRelativePath"
                $pscpArguments = "-P", $sshPort, "-i", "`"$privateKeyPath`"", "`"$($file.FullName)`"", "${sshUsername}@${sshServer}:`"$remotePathWithRelativePath`""


                # Log the full expected path
                $logMessage = "$(Get-Date), PSCP Arguments: $pscpArguments"
                Write-Host $logMessage *> $logFilePath

                # Send the file to the server via pscp
                Start-Process -FilePath $pscpPath -ArgumentList $pscpArguments -NoNewWindow -Wait

                # Check if the command was successful
                # If the command failed, log the error and continue to the next file
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "$(Get-Date), Error sending file: $($file.FullName)" *> $logFilePath
                    continue
                } else {
                    # If the command was successful, log the success message
                    Write-Host "$(Get-Date), Successfully sent file: $($file.FullName)" *> $logFilePath
                }

                # Add a few blank lines after sending file
                Write-Host "`n`n" *> $logFilePath
            } catch {
                # Log any exceptions that occur during file processing
                Write-Host "$(Get-Date), ERROR processing file $($file.FullName): $($_.Exception.Message)" *>> $logFilePath
                Write-Host "`n`n" *>> $logFilePath
            }
        }

        # Log the completion of file processing
        $logMessage = "$(Get-Date), File processing completed"
        Write-Host "`n--------------------------------------------------`n" *>> $logFilePath

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
    $mutex.Close()
}
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
# Copyright (c) 2024 Phelan Hobbs
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 1 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `none` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
# All rights reserved.
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 2 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
#
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 3 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
# Version: 0.3.2
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 4 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
# Date: 2025-03-05
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 5 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
#
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 6 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 7 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
# This PowerShell script is a template file used to monitor a folder and send the changed file to a server via pscp
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 8 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 9 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
# Log the script start time CHANGE THIS VALUE ###############
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 10 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
$logFilePath = "C:\Users\Denton\Desktop\script\log.txt"  ####
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 11 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
Write-Host "$(Get-Date), Script started" *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 12 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 13 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
# Create mutex to prevent multiple instances of the script from running
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 14 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
$mutexName = "Global\DentTransferScriptMutex"
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 15 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
$mutex = New-Object System.Threading.Mutex($false, $mutexName)
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 16 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
if (-not $mutex.WaitOne(0, $false)) {
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 17 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
    Write-Host "$(Get-Date), Script already running, exiting" *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 18 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
    exit
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 19 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
}
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 20 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 21 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
try {
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 22 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
    $sshServer = "nfhistory.nanofab.utah.edu"
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 23 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
    $sshPort = 22
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 24 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
    $sshUsername = "phelanh"
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 25 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
    # Configuration CHANGE THSESE VALUES ###################################
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 26 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
    $watcherPath = "C:\\CIMPLICITY\\Integrity_36\\Event_Log_All"        ####
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 27 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
    $pscpPath = "C:\\Users\\Denton\\Desktop\\script\\puTTY\\pscp.EXE"   ####
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 28 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
    $privateKeyPath = "C:\\Users\\Denton\\Desktop\\script\\id_rsa.ppk"  ####
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 29 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
    $remotePath = "/Users/phelanh/Desktop/Logs/Denton635"               ####
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 30 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
    ########################################################################
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 31 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 32 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
    # Function to send files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 33 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
    function Send-Files {
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 34 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
        $currentTime = Get-Date
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 35 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
        $yesterday = $currentTime.AddDays(-1)
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 36 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 37 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
        # Get all files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 38 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
        $files = Get-ChildItem -Path $watcherPath -Recurse | Where-Object { $_.LastWriteTime -ge $yesterday }
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 39 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 40 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
        foreach ($file in $files) {
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 41 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
            $logMessage = "$(Get-Date), Processing file: $($file.FullName)"
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 42 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
            Write-Host $logMessage *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 43 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
            try {
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 44 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
                $watcherPathNorm = $watcherPath.TrimEnd('\')
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 45 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
                $relativePath = $file.FullName.Substring($watcherPathNorm.Length-2).TrimStart('\')
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 46 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
                $formattedRelativePath = $relativePath -Replace '\\', '/'
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 47 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
                $remotePathWithRelativePath = "$remotePath/$formattedRelativePath"
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 48 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
                $pscpArguments = "-P", $sshPort, "-i", "`"$privateKeyPath`"", "`"$($file.FullName)`"", "${sshUsername}@${sshServer}:`"$remotePathWithRelativePath`""
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 49 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 50 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `transfer` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 51 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
                # Log the full expected path
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 52 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
                $logMessage = "$(Get-Date), PSCP Arguments: $pscpArguments"
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 53 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
                Write-Host $logMessage *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 54 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 55 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
                # Send the file to the server via pscp
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 56 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
                Start-Process -FilePath $pscpPath -ArgumentList $pscpArguments -NoNewWindow -Wait
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 57 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 58 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `transfer` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
                # Check if the command was successful
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 59 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
                # If the command failed, log the error and continue to the next file
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 60 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
                if ($LASTEXITCODE -ne 0) {
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 61 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
                    Write-Host "$(Get-Date), Error sending file: $($file.FullName)" *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 62 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
                    continue
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 63 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
                } else {
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 64 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
                    # If the command was successful, log the success message
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 65 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
                    Write-Host "$(Get-Date), Successfully sent file: $($file.FullName)" *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 66 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
                }
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 67 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 68 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
                # Add a few blank lines after sending file
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 69 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
                Write-Host "`n`n" *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 70 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
            } catch {
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 71 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
                # Log any exceptions that occur during file processing
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 72 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
                Write-Host "$(Get-Date), ERROR processing file $($file.FullName): $($_.Exception.Message)" *>> $logFilePath
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 73 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
                Write-Host "`n`n" *>> $logFilePath
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 74 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
            }
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 75 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
        }
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 76 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 77 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
        # Log the completion of file processing
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 78 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
        $logMessage = "$(Get-Date), File processing completed"
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 79 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
        Write-Host "`n--------------------------------------------------`n" *>> $logFilePath
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 80 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 81 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
    }
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 82 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 83 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
    #Calls send files function to send files modified in the past 24 hours as soon as program starts
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 84 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
    Send-Files
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 85 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 86 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
    # Schedule the task to run at midnight
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 87 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
    while ($true) {
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 88 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
        $currentTime = Get-Date
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 89 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
        $midnight = [datetime]::Today.AddDays(1)
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 90 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 91 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
        $timeToMidnight = $midnight - $currentTime
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 92 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
        Start-Sleep -Seconds $timeToMidnight.TotalSeconds
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 93 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 94 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
        # Send files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 95 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
        Send-Files
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 96 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
    }
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 97 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
} finally {
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 98 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
    # Ensure that mutex is released
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 99 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
    $mutex.ReleaseMutex()
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 100 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
    $mutex.Close()
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 101 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
}
```

Reconstruction rule: in `UNanofabTools/Dent635Transfer.ps1`, line 102 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/Dent635Transfer.ps1`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.


# Source Reconstruction: UNanofabTools/FileTransferSetup.md

- Repository: `UNanofabTools`
- Relative path: `FileTransferSetup.md`
- Lines read: `99`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `ab1e435bf1848dc2`
- Code fence language: `markdown`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```markdown
Copyright (c) 2024 Phelan Hobbs
All rights reserved.

Version: 0.0.3


Here are the steps to setup a new instance of the file tranfer powershell script on a new machine used in the Nanofab. Additionally, instructions to setup a new server are below.

1) Ensure that all the required programs are installed on the machine being used in the nanofab
    The relevant programs are Windows PowerShell (https://learn.microsoft.com/en-us/powershell/) and PuTTY (https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).
    Please note down where PuTTY is installed.
    Please note what version of PuTTY is being installed, as PuTTY only supports Windows XP and Vista up until 0.74. Otherwise,
    use the most recent version for the reasons of security.

2) Ensure that you are on the correct network
    Currently, due to security concerns, the server only accepts ssh commands from machines registered to the CoE network. Even things like UConnect do not work due to the CoE IT's security policy.
    This can be accomplished by opening Powershell or command prompt and using the "ipconfig" command, the connected network will be listed under "Connection-specific DNS suffix". Alternatively, if you look up your IP, it should begin with 155.98.11.xx or 155.98.92.xx

3) Transfer the FileTransferTemplate.ps1 file onto the machine and rename it


4) Step 4 will depend on if you are running on a more modern version of windows (eg windows 11) you should follow method A
        but on older operating systems such as windows XP or Windows Vista, please follow method B

    _A: Modern Windows
    Open PowerShell and run the command "ssh-keygen -t rsa".
        You will be prompted "Enter file in which to save the key...", just call it "id_rsa". You will then be prompted for a passphrase, just hit enter twice to have no passphrase. Trust me, it's easier this way.
        Then please note where id_rsa is saved.
        Go to step 4

    _B: Older Windows
    Open PuTTYGen (included with your install of puTTY) and hit "Generate", using the mouse to generate randomness
        Note down the "Public key for pasting into OpenSSH authorized_keys file" and the private key which can be saved
        when saving the private key, call it id_rsa.ppk and do not set a password (just skip through it)
        Go to step 8

5) In Powershell, use the command "type" followed by the location of the id_rsa.pub key (example syntax
    "type C:\Users\machine\id_rsa.pub) and hit enter.
    This will display a set of text starting with "ssh-rsa" followed by a bunch of letters. Copy or note the entire response (including ssh-rsa)

6) Open PuTTYgen click "load" and navigate to the id_rsa.pub file. You may need to change the filetype from
    ".ppk" to "All Files *" and hit "Save the private key". Place it along side the id_rsa.

7) Right Click on your .ppk file and open "Properties" and navigate to the "security" tab and ensure that
    only the name of the machine has access. If any others are listed hit "advanced" and remove them

8) Now, remote into the server using Remote Desktop Connection (RDC) and open Powershell
    Run the command "notepad++ ~/.ssh/authorized_keys"

9) This will open a file. On a new line, add your entire key and save. DO NOT MESS WITH THE OTHER KEYS!

10) Decide where you'd like your folder to save your files. Please create a folder inside the LOGFILES
    folder and use that. Name it something easy to remember like MACHINEDATA

11) Right click the renamed .ps1 file and click edit, which will open the PowerShell ISA

12) There are going to be a handful of variables that are surrounded by ######## on the top and bottom
    These must be updated with the relevant file locations
    Importantly, there are four filepaths that need to be changed
        $watcherPath - This is the location of where logfiles from the machine are stored
        $pscpPath - This is the location of where PuTTY is saved
        $privateKeyPath - This is the location of your private key (from step 6)
        $remotePath - this is where the server will store the logfiles on the VM

13) Run the service to verify that it is working and able to transfer files from the machine to the VM
    If not, go back and determine what might be the issue
    If it does, note the file path of the .ps1 file

14) On the machine being used in the lab, hit Windows+R and write in taskschd.msc and hit enter

15) In the Task Scheduler, click on Create Task on right hand pane.

16) Give the task a name and description and select both "Run whether user is logged on or not" and "Run with highest privileges"

17) In the "Triggers" tab, click new and set the trigger to "At startup" and hit OK

18) In the actions tab, click New and set action to "Start a program"

19) In the Program/Script Field, find powershell.exe and add "-File "C:\path\to\script\TransferScript.ps1" in the arguements (replacing the file name appropriately)
        Note that by default, Powershell is located at "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe

20) In the settings tab, select "Allow task to be run on demand" and "restart the task if it fails"

21) Click Ok to save the task, entering the password if prompted

STARTING THE SCRIPT
1) Recall that the file transfer script is located on the decice and recall where it is saved
        This is why I like to place my scripts in C:/Users/[name]/Desktop/script, makes it easy to rememeber

2) Navigate to the folder that the script is located

3) If running on a more modern version of Windows such as Windows 11,
        right click the PS1 powershell script and click "Run with Powershell"
    If running on an old version of Windows like Windows XP,
        run the script by double clicking the batch file

4) Ensure that the script runs properly both right at runtime and the next morning

5) Bug test or make alterations as needed
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
Copyright (c) 2024 Phelan Hobbs
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 1 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `none` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
All rights reserved.
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 2 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 3 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
Version: 0.0.3
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 4 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 5 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 6 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
Here are the steps to setup a new instance of the file tranfer powershell script on a new machine used in the Nanofab. Additionally, instructions to setup a new server are below.
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 7 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 8 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
1) Ensure that all the required programs are installed on the machine being used in the nanofab
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 9 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
    The relevant programs are Windows PowerShell (https://learn.microsoft.com/en-us/powershell/) and PuTTY (https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 10 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
    Please note down where PuTTY is installed.
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 11 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
    Please note what version of PuTTY is being installed, as PuTTY only supports Windows XP and Vista up until 0.74. Otherwise,
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 12 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
    use the most recent version for the reasons of security.
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 13 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 14 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
2) Ensure that you are on the correct network
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 15 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
    Currently, due to security concerns, the server only accepts ssh commands from machines registered to the CoE network. Even things like UConnect do not work due to the CoE IT's security policy.
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 16 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
    This can be accomplished by opening Powershell or command prompt and using the "ipconfig" command, the connected network will be listed under "Connection-specific DNS suffix". Alternatively, if you look up your IP, it should begin with 155.98.11.xx or 155.98.92.xx
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 17 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 18 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
3) Transfer the FileTransferTemplate.ps1 file onto the machine and rename it
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 19 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 20 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 21 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
4) Step 4 will depend on if you are running on a more modern version of windows (eg windows 11) you should follow method A
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 22 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
        but on older operating systems such as windows XP or Windows Vista, please follow method B
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 23 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 24 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
    _A: Modern Windows
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 25 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
    Open PowerShell and run the command "ssh-keygen -t rsa".
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 26 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
        You will be prompted "Enter file in which to save the key...", just call it "id_rsa". You will then be prompted for a passphrase, just hit enter twice to have no passphrase. Trust me, it's easier this way.
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 27 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
        Then please note where id_rsa is saved.
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 28 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
        Go to step 4
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 29 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 30 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
    _B: Older Windows
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 31 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
    Open PuTTYGen (included with your install of puTTY) and hit "Generate", using the mouse to generate randomness
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 32 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
        Note down the "Public key for pasting into OpenSSH authorized_keys file" and the private key which can be saved
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 33 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
        when saving the private key, call it id_rsa.ppk and do not set a password (just skip through it)
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 34 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
        Go to step 8
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 35 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 36 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
5) In Powershell, use the command "type" followed by the location of the id_rsa.pub key (example syntax
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 37 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
    "type C:\Users\machine\id_rsa.pub) and hit enter.
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 38 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
    This will display a set of text starting with "ssh-rsa" followed by a bunch of letters. Copy or note the entire response (including ssh-rsa)
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 39 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 40 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
6) Open PuTTYgen click "load" and navigate to the id_rsa.pub file. You may need to change the filetype from
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 41 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
    ".ppk" to "All Files *" and hit "Save the private key". Place it along side the id_rsa.
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 42 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 43 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
7) Right Click on your .ppk file and open "Properties" and navigate to the "security" tab and ensure that
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 44 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
    only the name of the machine has access. If any others are listed hit "advanced" and remove them
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 45 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 46 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
8) Now, remote into the server using Remote Desktop Connection (RDC) and open Powershell
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 47 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
    Run the command "notepad++ ~/.ssh/authorized_keys"
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 48 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 49 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
9) This will open a file. On a new line, add your entire key and save. DO NOT MESS WITH THE OTHER KEYS!
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 50 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 51 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
10) Decide where you'd like your folder to save your files. Please create a folder inside the LOGFILES
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 52 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
    folder and use that. Name it something easy to remember like MACHINEDATA
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 53 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 54 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
11) Right click the renamed .ps1 file and click edit, which will open the PowerShell ISA
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 55 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 56 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
12) There are going to be a handful of variables that are surrounded by ######## on the top and bottom
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 57 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
    These must be updated with the relevant file locations
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 58 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
    Importantly, there are four filepaths that need to be changed
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 59 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
        $watcherPath - This is the location of where logfiles from the machine are stored
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 60 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
        $pscpPath - This is the location of where PuTTY is saved
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 61 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
        $privateKeyPath - This is the location of your private key (from step 6)
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 62 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
        $remotePath - this is where the server will store the logfiles on the VM
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 63 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 64 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
13) Run the service to verify that it is working and able to transfer files from the machine to the VM
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 65 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
    If not, go back and determine what might be the issue
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 66 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
    If it does, note the file path of the .ps1 file
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 67 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 68 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
14) On the machine being used in the lab, hit Windows+R and write in taskschd.msc and hit enter
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 69 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 70 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
15) In the Task Scheduler, click on Create Task on right hand pane.
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 71 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 72 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
16) Give the task a name and description and select both "Run whether user is logged on or not" and "Run with highest privileges"
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 73 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 74 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
17) In the "Triggers" tab, click new and set the trigger to "At startup" and hit OK
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 75 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 76 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
18) In the actions tab, click New and set action to "Start a program"
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 77 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 78 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
19) In the Program/Script Field, find powershell.exe and add "-File "C:\path\to\script\TransferScript.ps1" in the arguements (replacing the file name appropriately)
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 79 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
        Note that by default, Powershell is located at "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 80 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 81 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
20) In the settings tab, select "Allow task to be run on demand" and "restart the task if it fails"
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 82 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 83 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
21) Click Ok to save the task, entering the password if prompted
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 84 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 85 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
STARTING THE SCRIPT
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 86 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
1) Recall that the file transfer script is located on the decice and recall where it is saved
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 87 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
        This is why I like to place my scripts in C:/Users/[name]/Desktop/script, makes it easy to rememeber
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 88 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 89 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
2) Navigate to the folder that the script is located
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 90 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 91 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
3) If running on a more modern version of Windows such as Windows 11,
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 92 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
        right click the PS1 powershell script and click "Run with Powershell"
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 93 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
    If running on an old version of Windows like Windows XP,
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 94 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
        run the script by double clicking the batch file
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 95 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 96 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
4) Ensure that the script runs properly both right at runtime and the next morning
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 97 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 98 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
5) Bug test or make alterations as needed
```

Reconstruction rule: in `UNanofabTools/FileTransferSetup.md`, line 99 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/FileTransferSetup.md`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.


# Source Reconstruction: UNanofabTools/FileTransferTemplate.ps1

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

### Line 1

```text
# Copyright (c) 2024 Phelan Hobbs
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 1 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `none` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
# All rights reserved.
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 2 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
#
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 3 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
# Version: 0.2.0
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 4 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
# Date: 2025-02-26
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 5 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
#
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 6 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
# This code was created to be used by the University of Utah Nanofab under the direction of Kathy Anderson and Jim Pierce
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 7 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
# This PowerShell script is a template file used to monitor a folder and send the changed file to a server via pscp
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 8 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 9 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
# Log the script start time CHANGE THIS VALUE ###############
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 10 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
$logFilePath = "C:\Users\MACHINE\Desktop\script\log.txt" ####
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 11 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
#############################################################
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 12 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 13 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
Write-Host "$(Get-Date), Script started" *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 14 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 15 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
# Create mutex to prevent multiple instances of the script from running
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 16 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
$mutexName = "Global\ALDTransferScriptMutex"
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 17 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
$mutex = New-Object System.Threading.Mutex($false, $mutexName)
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 18 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
if (-not $mutex.WaitOne(0, $false)) {
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 19 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
    Write-Host "$(Get-Date), Script already running, exiting" *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 20 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
    exit
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 21 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
}
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 22 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 23 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
try {
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 24 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
    $sshServer = "nfhistory.nanofab.utah.edu"
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 25 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
    $sshPort = 22
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 26 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
    $sshUsername = "phelanh"
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 27 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
    # Configuration CHANGE THSESE VALUES ##########################
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 28 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
    $watcherPath = "C:\\MACHINE\\Desktop\\Logfile"             ####
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 29 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
    $pscpPath = "C:\\Program Files\\PuTTY\\pscp.exe"           ####
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 30 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
    $privateKeyPath = "C:\\Users\\MACHINE\\.ssh\\id_rsa.ppk"   ####
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 31 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
    $remotePath = "C:\\Users\\phelanh\\Desktop\\Logs\\MACHINE" ####
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 32 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
    ###############################################################
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 33 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 34 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
    # Function to send files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 35 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
    function Send-Files {
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 36 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
        $currentTime = Get-Date
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 37 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
        $yesterday = $currentTime.AddDays(-1)
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 38 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 39 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
        # Get all files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 40 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
        $files = Get-ChildItem -Path $watcherPath -Recurse | Where-Object { $_.LastWriteTime -ge $yesterday }
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 41 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 42 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
        foreach ($file in $files) {
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 43 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
            $relativePath = $file.FullName -replace [regex]::Escape($watcherPath), ''
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 44 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
            $remotePathWithRelativePath = Join-Path -Path $remotePath -ChildPath $relativePath
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 45 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
            $pscpArguments = "-P", $sshPort, "-i", "`"$privateKeyPath`"", "`"$file.FullName`"", "${sshUsername}@${sshServer}:`"$remotePathWithRelativePath`""
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 46 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 47 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `transfer` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
            # Log the full expected path
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 48 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
            $logMessage = "$(Get-Date), PSCP Arguments: $pscpArguments"
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 49 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
            Write-Host $logMessage *> $logFilePath
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 50 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 51 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
            # Send the file to the server via pscp
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 52 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `transfer`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
            Start-Process -FilePath $pscpPath -ArgumentList $pscpArguments -NoNewWindow -Wait
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 53 is classified as `transfer`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
        }
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 54 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `transfer` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
    }
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 55 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 56 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
    #Calls send files function to send files modified in the past 24 hours as soon as program starts
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 57 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
    Send-Files
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 58 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 59 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
    # Schedule the task to run at midnight
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 60 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
    while ($true) {
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 61 is classified as `shell-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
        $currentTime = Get-Date
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 62 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell-control` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
        $midnight = [datetime]::Today.AddDays(1)
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 63 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 64 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
        $timeToMidnight = $midnight - $currentTime
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 65 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
        Start-Sleep -Seconds $timeToMidnight.TotalSeconds
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 66 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 67 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
        # Send files modified in the past 24 hours
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 68 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
        Send-Files
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 69 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
    }
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 70 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
} finally {
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 71 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
    # Ensure that mutex is released
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 72 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
    $mutex.ReleaseMutex()
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 73 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `comment` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
    $mutex.Dispose()
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 74 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `shell`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
}
```

Reconstruction rule: in `UNanofabTools/FileTransferTemplate.ps1`, line 75 is classified as `shell`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state. Neighbor context: previous kind is `shell` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



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
