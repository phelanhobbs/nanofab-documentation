

# Source Reconstruction: UNanofabTools/CTRFurnaceTransfer.bat

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

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

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 2

```text
:: filepath: c:\Users\Phe\Code\Work\UNanofabTools\CTRFurnaceTransferTask.bat
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 3

```text
:: Copyright (c) 2024 Phelan Hobbs
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 4

```text
:: All rights reserved.
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 5

```text
::
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 6

```text
:: Version: 0.4.0
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 7

```text
:: Date: 2025-03-07
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 8

```text
::
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 9

```text
:: This code was created for the University of Utah Nanofab
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 10

```text
:: Windows XP batch version of the furnace transfer script
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 11

```text
:: Modified for scheduled task execution
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 13

```text
:: Configuration - MODIFY THESE VALUES
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 14

```text
set logFilePath=C:\Documents and Settings\user\Desktop\script\log.txt
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 15

```text
set watcherPath=C:\Program Files\TymkonTools\DataLog
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 16

```text
set pscpPath=C:\Documents and Settings\user\Desktop\script\PuTTY\pscp.exe
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 17

```text
set privateKeyPath=C:\Documents and Settings\user\Desktop\script\.ssh\privKey.ppk
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 18

```text
set remotePath=/Users/phelanh/Desktop/Logs/Furnaces
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 19

```text
set sshServer=nfhistory.nanofab.utah.edu
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 20

```text
set sshPort=22
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 21

```text
set sshUsername=phelanh
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 23

```text
:: Log the script start time
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 24

```text
echo %date% %time%, Script started >> "%logFilePath%"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 26

```text
:: Check for running instance using a lock file
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 27

```text
if exist "%TEMP%\FurnTransferScript.lock" (
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 28

```text
    echo %date% %time%, Script already running, exiting >> "%logFilePath%"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 29

```text
    exit /b 1
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 30

```text
)
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 32

```text
:: Create lock file
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 33

```text
echo %date% %time% > "%TEMP%\FurnTransferScript.lock"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 35

```text
:: Set error handling
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 36

```text
setlocal EnableExtensions EnableDelayedExpansion
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 38

```text
:: Process files and exit
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 39

```text
call :SendFiles
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 40

```text
call :CleanUp
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 41

```text
exit /b 0
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 43

```text
:SendFiles
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 44

```text
    echo %date% %time%, Running SendFiles function >> "%logFilePath%"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 46

```text
    :: Find all files in the watched directory
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 47

```text
    for /f "tokens=*" %%a in ('dir /s /b /a-d "%watcherPath%"') do (
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 48

```text
        call :ProcessFile "%%a"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 49

```text
    )
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 50

```text
    goto :eof
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 52

```text
:ProcessFile
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 53

```text
    :: Extract filename and path
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 54

```text
    set "filePath=%~1"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 55

```text
    set "fileName=%~nx1"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 57

```text
    :: Calculate relative path
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 58

```text
    call set relPath=%%filePath:%watcherPath%=%%
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 60

```text
    :: Fix path formatting (replace backslashes with forward slashes)
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 61

```text
    set "remoteFilePath=%remotePath%/%relPath:\=/%"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 63

```text
    :: Log the operation
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 64

```text
    echo %date% %time%, Processing file: %filePath% >> "%logFilePath%"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 65

```text
    echo %date% %time%, Target path: %remoteFilePath% >> "%logFilePath%"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 67

```text
    :: Transfer the file using PSCP
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 68

```text
    "%pscpPath%" -P %sshPort% -i "%privateKeyPath%" "%filePath%" %sshUsername%@%sshServer%:"%remoteFilePath%"
```

`transfer` — This transfer command moves data between machines or directories. Preserve source path, destination path, authentication identity, retry behavior, and logging; edge cases include network loss, partial copies, personal-account dependency, and files changing while copied.

### Line 70

```text
    :: Log the result
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 71

```text
    if %ERRORLEVEL% EQU 0 (
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 72

```text
        echo %date% %time%, Successfully transferred file: %fileName% >> "%logFilePath%"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 73

```text
    ) else (
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 74

```text
        echo %date% %time%, ERROR: Failed to transfer file: %fileName%, Error code: %ERRORLEVEL% >> "%logFilePath%"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 75

```text
    )
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 77

```text
    goto :eof
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 79

```text
:CleanUp
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 80

```text
    :: Remove lock file on exit
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 81

```text
    echo %date% %time%, Script completed >> "%logFilePath%"
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.

### Line 82

```text
    if exist "%TEMP%\FurnTransferScript.lock" del "%TEMP%\FurnTransferScript.lock"
```

`shell-control` — This shell-control line decides or repeats operational work. Preserve quoting, variable expansion, error behavior, and whether the script continues after failure; edge cases include paths with spaces, missing commands, and different shell versions.

### Line 83

```text
    goto :eof
```

`shell` — This script line is part of an operational command path. Preserve environment assumptions, working directory, command availability, and output expectations; edge cases include running as the wrong user, missing permissions, and stale local state.



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
