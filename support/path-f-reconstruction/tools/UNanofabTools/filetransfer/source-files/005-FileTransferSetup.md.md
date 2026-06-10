

# Source Reconstruction: UNanofabTools/FileTransferSetup.md

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

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

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 2

```text
All rights reserved.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 4

```text
Version: 0.0.3
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 7

```text
Here are the steps to setup a new instance of the file tranfer powershell script on a new machine used in the Nanofab. Additionally, instructions to setup a new server are below.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 9

```text
1) Ensure that all the required programs are installed on the machine being used in the nanofab
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 10

```text
    The relevant programs are Windows PowerShell (https://learn.microsoft.com/en-us/powershell/) and PuTTY (https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 11

```text
    Please note down where PuTTY is installed.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 12

```text
    Please note what version of PuTTY is being installed, as PuTTY only supports Windows XP and Vista up until 0.74. Otherwise,
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 13

```text
    use the most recent version for the reasons of security.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 15

```text
2) Ensure that you are on the correct network
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 16

```text
    Currently, due to security concerns, the server only accepts ssh commands from machines registered to the CoE network. Even things like UConnect do not work due to the CoE IT's security policy.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 17

```text
    This can be accomplished by opening Powershell or command prompt and using the "ipconfig" command, the connected network will be listed under "Connection-specific DNS suffix". Alternatively, if you look up your IP, it should begin with 155.98.11.xx or 155.98.92.xx
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 19

```text
3) Transfer the FileTransferTemplate.ps1 file onto the machine and rename it
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 22

```text
4) Step 4 will depend on if you are running on a more modern version of windows (eg windows 11) you should follow method A
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 23

```text
        but on older operating systems such as windows XP or Windows Vista, please follow method B
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 25

```text
    _A: Modern Windows
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 26

```text
    Open PowerShell and run the command "ssh-keygen -t rsa".
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 27

```text
        You will be prompted "Enter file in which to save the key...", just call it "id_rsa". You will then be prompted for a passphrase, just hit enter twice to have no passphrase. Trust me, it's easier this way.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 28

```text
        Then please note where id_rsa is saved.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 29

```text
        Go to step 4
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 31

```text
    _B: Older Windows
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 32

```text
    Open PuTTYGen (included with your install of puTTY) and hit "Generate", using the mouse to generate randomness
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 33

```text
        Note down the "Public key for pasting into OpenSSH authorized_keys file" and the private key which can be saved
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 34

```text
        when saving the private key, call it id_rsa.ppk and do not set a password (just skip through it)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 35

```text
        Go to step 8
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 37

```text
5) In Powershell, use the command "type" followed by the location of the id_rsa.pub key (example syntax
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 38

```text
    "type C:\Users\machine\id_rsa.pub) and hit enter.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 39

```text
    This will display a set of text starting with "ssh-rsa" followed by a bunch of letters. Copy or note the entire response (including ssh-rsa)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 41

```text
6) Open PuTTYgen click "load" and navigate to the id_rsa.pub file. You may need to change the filetype from
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 42

```text
    ".ppk" to "All Files *" and hit "Save the private key". Place it along side the id_rsa.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 44

```text
7) Right Click on your .ppk file and open "Properties" and navigate to the "security" tab and ensure that
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 45

```text
    only the name of the machine has access. If any others are listed hit "advanced" and remove them
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 47

```text
8) Now, remote into the server using Remote Desktop Connection (RDC) and open Powershell
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 48

```text
    Run the command "notepad++ ~/.ssh/authorized_keys"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 50

```text
9) This will open a file. On a new line, add your entire key and save. DO NOT MESS WITH THE OTHER KEYS!
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 52

```text
10) Decide where you'd like your folder to save your files. Please create a folder inside the LOGFILES
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 53

```text
    folder and use that. Name it something easy to remember like MACHINEDATA
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 55

```text
11) Right click the renamed .ps1 file and click edit, which will open the PowerShell ISA
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 57

```text
12) There are going to be a handful of variables that are surrounded by ######## on the top and bottom
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 58

```text
    These must be updated with the relevant file locations
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 59

```text
    Importantly, there are four filepaths that need to be changed
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 60

```text
        $watcherPath - This is the location of where logfiles from the machine are stored
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 61

```text
        $pscpPath - This is the location of where PuTTY is saved
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 62

```text
        $privateKeyPath - This is the location of your private key (from step 6)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 63

```text
        $remotePath - this is where the server will store the logfiles on the VM
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 65

```text
13) Run the service to verify that it is working and able to transfer files from the machine to the VM
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 66

```text
    If not, go back and determine what might be the issue
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 67

```text
    If it does, note the file path of the .ps1 file
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 69

```text
14) On the machine being used in the lab, hit Windows+R and write in taskschd.msc and hit enter
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 71

```text
15) In the Task Scheduler, click on Create Task on right hand pane.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 73

```text
16) Give the task a name and description and select both "Run whether user is logged on or not" and "Run with highest privileges"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 75

```text
17) In the "Triggers" tab, click new and set the trigger to "At startup" and hit OK
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 77

```text
18) In the actions tab, click New and set action to "Start a program"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 79

```text
19) In the Program/Script Field, find powershell.exe and add "-File "C:\path\to\script\TransferScript.ps1" in the arguements (replacing the file name appropriately)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 80

```text
        Note that by default, Powershell is located at "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 82

```text
20) In the settings tab, select "Allow task to be run on demand" and "restart the task if it fails"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 84

```text
21) Click Ok to save the task, entering the password if prompted
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 86

```text
STARTING THE SCRIPT
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 87

```text
1) Recall that the file transfer script is located on the decice and recall where it is saved
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 88

```text
        This is why I like to place my scripts in C:/Users/[name]/Desktop/script, makes it easy to rememeber
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 90

```text
2) Navigate to the folder that the script is located
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 92

```text
3) If running on a more modern version of Windows such as Windows 11,
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 93

```text
        right click the PS1 powershell script and click "Run with Powershell"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 94

```text
    If running on an old version of Windows like Windows XP,
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 95

```text
        run the script by double clicking the batch file
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 97

```text
4) Ensure that the script runs properly both right at runtime and the next morning
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 99

```text
5) Bug test or make alterations as needed
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.



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
