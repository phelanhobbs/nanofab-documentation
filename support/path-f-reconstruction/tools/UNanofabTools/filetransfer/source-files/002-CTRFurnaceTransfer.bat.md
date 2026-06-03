

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
