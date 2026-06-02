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
