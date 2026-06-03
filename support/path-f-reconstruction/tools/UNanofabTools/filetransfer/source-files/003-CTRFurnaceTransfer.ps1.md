

# Source Reconstruction: UNanofabTools/CTRFurnaceTransfer.ps1

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

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
