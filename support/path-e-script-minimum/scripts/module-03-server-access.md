# Minimum Acceptable Full Path E - Module 03: Server Access

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-03-server-access.md

# Module 3 - Server Access And Safe Inspection

## Goal

The maintainer can explain and perform safe server access: two-hop SSH, shared `phelan` UNIX account, tmux inspection, safe detach, and non-destructive survey collection.

## Required Screen

SHOW:

- `presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx` (repo path: presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx)
- `presentation/UNanofabTools/serveraccess/README.md` (repo path: presentation/UNanofabTools/serveraccess/README.md)
- `documentation/UNanofabTools/serveraccess/README.md` (repo path: documentation/UNanofabTools/serveraccess/README.md)
- `known-issues/UNanofabTools/serveraccess.md` (repo path: known-issues/UNanofabTools/serveraccess.md)

## Verbatim Script

READ ALOUD:

"Access is one of the most important parts of the handoff because a maintainer can understand the architecture and still accidentally take the site down by mishandling tmux. We will go slowly."

SHOW:

Open `Server-Access.pptx`.

READ ALOUD:

"The access path is two-hop. First, the maintainer reaches CADE. Second, from CADE, they SSH to `nfhistory`. On `nfhistory`, the Nanofab-side login is the shared UNIX account `phelan`. That is not ideal as a long-term identity model, but it is the current operational boundary. Nanofab cannot create UNIX accounts. University IT controls root and `useradd`."

"Per-person identity exists as SSH keys or labels within the shared `phelan` access model. If the team wants per-person UNIX accounts on `nfhistory`, that is an IT ticket. It is not something the Nanofab maintainer can implement by editing app code."

SHOW:

The tmux slides in `Server-Access.pptx`.

READ ALOUD:

"The two sessions that matter are `flaskserver` and `downloader`. `flaskserver` hosts the website process. `downloader` hosts `HSCDownloader.py`, which pulls CORES data and writes `HSCDATA`. A tmux session is like a saved terminal. You can attach to look at it. You detach to leave it running."

"The safe ritual is: attach, look, detach with `Ctrl-b d`. Do not type `exit`. Do not press `Ctrl-c`. If you type `exit`, you may close the shell tmux is hosting. If you press `Ctrl-c`, you send an interrupt to the running process. Either mistake can stop the service."

## Live Demo

If safe and access is available:

DO:

1. SSH through the documented path.
2. Run:

```sh
tmux ls
```

3. Attach read-only if possible, or attach normally only for a controlled demo:

```sh
tmux attach -t flaskserver
```

4. Look. Do not type into the service.
5. Detach with `Ctrl-b d`.
6. Repeat for:

```sh
tmux attach -t downloader
```

7. Detach with `Ctrl-b d`.

READ ALOUD:

"I am detaching, not exiting. Detach means the program continues running. Exiting would close the shell. `Ctrl-c` would interrupt the process. This distinction is operationally important."

If live access is unavailable:

READ ALOUD:

"We are skipping the live attach because access is unavailable or unsafe. The maintainer still needs to practice this later. Until they have attached and detached safely, access training is not complete."

LOG:

Record whether the maintainer practiced attaching and detaching.

## Survey Script

READ ALOUD:

"The survey script is the read-only way to capture live-server facts. A survey snapshot is evidence. It lets future maintainers compare what the live server was doing at a specific time against what the docs claim."

DO IF SAFE:

```sh
bash ~/survey_nfhistory.sh | tee /tmp/nfhistory_survey_$(date +%F).txt
```

READ ALOUD:

"Before committing any snapshot, inspect it for secrets. Keep paths, key names, service names, package names, timestamps, and non-secret operational facts. Redact secret values."

## Recovery Frame

READ ALOUD:

"The current recovery shape is tmux-based. If `flaskserver` is gone, the documented stopgap is to recreate the tmux session, `cd` to `~/server/UNanofabTools`, activate the venv, run `python run.py`, and detach. If `downloader` is gone, the shape is similar, but the command is `python3 HSCDownloader.py`. This is a recovery procedure, not the ideal target. The ideal target is supervised services."

SHOW:

The recovery commands in `documentation/UNanofabTools/serveraccess/README.md` (repo path: documentation/UNanofabTools/serveraccess/README.md).

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What are the two SSH hops? | Laptop/workstation to CADE, then CADE to `nfhistory`. |
| Why does the SSH config use `User phelan`? | Nanofab users currently access `nfhistory` through the shared `phelan` UNIX account because IT controls UNIX account creation. |
| What are the two important tmux sessions? | `flaskserver` for the website and `downloader` for `HSCDownloader.py`. |
| What exact keys detach from tmux? | `Ctrl-b` followed by `d`. |
| Why is `Ctrl-c` dangerous in a live service pane? | It sends SIGINT to the running service process and can stop it. |
| Why is `exit` dangerous in a live service pane? | It can terminate the shell hosted by tmux and stop the service session. |
| What is Nanofab allowed to change? | Nanofab-owned app code, docs, known issues, app config under its control, service processes, and operational files under `/home/phelan/`. |
| What access changes require IT? | Creating UNIX users, changing root-owned files, modifying `/root/`, root SSH, VM-level access policy, and other root-only changes. |

REQUIRE:

The maintainer can recite: "Attach, look, detach with `Ctrl-b d`; do not exit; do not `Ctrl-c`."

## Stop Point

STOP POINT:

Stop here if the maintainer has not practiced safe detach. Assign practice in a non-production tmux session or schedule a supervised production inspection.


# Expanded Module 03: Server Access

READ ALOUD:

This expanded section revisits Module 03, Server Access. The focus is two-hop SSH, shared phelan account, tmux safety, and survey snapshots. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 03

READ ALOUD:

We are now doing the orientation pass for Server Access. The maintainer should connect this module to two-hop SSH, shared phelan account, tmux safety, and survey snapshots. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx`
- `presentation/UNanofabTools/serveraccess/README.md`
- `documentation/UNanofabTools/serveraccess/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention two-hop SSH, shared phelan account, tmux safety, and survey snapshots. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 03

READ ALOUD:

We are now doing the evidence pass for Server Access. The maintainer should connect this module to two-hop SSH, shared phelan account, tmux safety, and survey snapshots. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx`
- `presentation/UNanofabTools/serveraccess/README.md`
- `documentation/UNanofabTools/serveraccess/README.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention two-hop SSH, shared phelan account, tmux safety, and survey snapshots. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: presentation/UNanofabTools/serveraccess/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Accessing the Server — A Plain-English Guide

This guide explains how to actually log in to the cleanroom server (`nfhistory`) — the machine that runs the website and the HSCDownloader. Written for someone who has never used SSH before; terms are defined as they appear.

## The short version

You can't reach the server directly from outside the lab. To get to it you have to take **two hops**:

1. From your laptop, log in to a **CADE lab machine** (a generic Linux machine in the university's College of Engineering lab pool).
2. From the CADE machine, log in to **`nfhistory`** (the cleanroom server).

Once you're on `nfhistory`, the two long-running programs — the website (`flaskserver`) and the data downloader (`downloader`) — are each kept running inside a **tmux session**. You attach to a session to look at it, then detach without killing it.

This page walks through all of that. There is a strict, separate developer reference at `documentation/UNanofabTools/serveraccess/` (repo path: documentation/UNanofabTools/serveraccess/README.md); use it once you've read this.

## Why two hops?

The server lives on a private network inside the university. A computer outside that network — including your laptop at home — cannot reach it directly. The CADE lab machines are on a network that *can* reach it, so they're used as a stepping-stone. This pattern is called a "jump host" or "bastion": you log into one machine, and from there log into the real one.

CADE (the "College of Engineering Lab" cluster) is a pool of identical Linux machines named `lab1-1`, `lab1-2`, … through `lab1-40`, and `lab2-1` through `lab2-35`. They're interchangeable — pick any one. If a particular machine is slow or offline, try another number.

## What you (the user) need before your first login

1. **A CADE account.** Sign up at <https://usertools.eng.utah.edu>. This is separate from your University ID; it has its own username and password.
2. **An SSH key for CADE.** A key is a small file that proves you're you, used instead of typing a password. (The CADE site walks through generating one and uploading the public half.) You keep the private half on your laptop, typically at `~/.ssh/CADE`.
3. **An SSH key for `nfhistory`** — a second key, used for the second hop. The server admin (the cleanroom team — see "What the admin must do" below) generates and installs this one for you.
4. **Your `nfhistory` username from the admin.** This is *not* your CADE username. (More on this in a moment.)

You only do steps 1–4 once.

## The two-hop login, step by step

### Hop 1 — your laptop → CADE

Open a terminal on your laptop and run:

```
ssh -i ~/.ssh/CADE <your-CADE-username>@lab1-10.eng.utah.edu
```

What each piece means:

- `ssh` — the secure-shell tool. It opens a remote command line on another computer.
- `-i ~/.ssh/CADE` — use the key file at `~/.ssh/CADE` to authenticate.
- `<your-CADE-username>` — the username from your CADE account (replace it with yours; e.g. `phelanh`).
- `lab1-10.eng.utah.edu` — the lab machine you're connecting to. You can use any of `lab1-1` through `lab1-40`, or `lab2-1` through `lab2-35`. They're equivalent — `lab1-10` is just a habit.

After this succeeds, your terminal is now on the CADE machine. You won't see anything fancy — just a different prompt — but every command you type now runs there, not on your laptop.

### Hop 2 — CADE → `nfhistory`

From the CADE machine, run:

```
ssh nfhistory
```

That's it. Just three words.

For this to work, you need a small configuration file on the CADE machine that tells SSH what `nfhistory` actually means. That file is `~/.ssh/config` on the CADE machine and contains:

```
Host nfhistory
  Hostname 155.98.11.8
  User phelan
  IdentityFile <path-to-your-nfhistory-key>
```

Each line:

- `Host nfhistory` — the nickname. This is what makes `ssh nfhistory` work.
- `Hostname 155.98.11.8` — the actual server address on the internal network.
- `User phelan` — the **server login name**. This is fixed: it must be `phelan`. (This is the shared cleanroom account on the server; everyone uses it. Your laptop or CADE name has nothing to do with it.)
- `IdentityFile …` — the path to the server key file the admin gave you, e.g. `~/.ssh/nfhistory`.

You create this `config` file once on your CADE home directory and never touch it again. After that, `ssh nfhistory` always works from any CADE machine you log into (your CADE home is shared between them).

## You're on the server — now what?

Once `ssh nfhistory` finishes you're at a Linux prompt on the cleanroom server. The two important programs are kept running inside two **tmux** sessions:

| Session name | What it runs |
|--------------|-------------|
| `flaskserver` | The website — the Flask app that serves `nfhistory.nanofab.utah.edu` |
| `downloader` | The HSCDownloader — the script that pulls per-machine run data from CORES and writes the spreadsheets the website displays |

A **tmux session** is just a "saved terminal" — a window with a program running in it that keeps going even after you disconnect. That's what lets the website and the downloader keep running 24/7 even when nobody is logged in.

### Looking at a session (attaching)

```
tmux attach -t flaskserver
```

…shows you the website's live console output. Substitute `downloader` to see the downloader instead.

### **Leaving a session WITHOUT killing it (detaching)**

This is the single most important thing on this page. **If you close the window or type `exit`, you will kill the program.** That will take down the website (or stop the downloader from collecting data) until someone notices and restarts it.

The correct way to leave is to **detach**:

> Press `Ctrl-b`, release it, then press `d`.

(That's "control-b followed by d" — two separate keystrokes, in that order. The `Ctrl-b` is tmux's "prefix" — a signal that the next key is meant for tmux instead of the program inside it. `d` is the detach command.)

After detaching you're back at the plain server prompt; the program inside the session is still running. From here, `exit` (or closing your laptop) is fine — the session stays alive on the server.

### A simple rule of thumb

- **`tmux attach -t <name>`** — go look.
- **`Ctrl-b` then `d`** — leave without breaking anything.
- **Don't type `exit` inside the session.** That ends the program.
- **Don't press `Ctrl-c` inside the session.** Same problem — that's the keyboard signal that says "stop the running program."

## If a session got killed by accident

It happens. If `tmux attach -t flaskserver` says "no session found" or similar, the program isn't running. Here's how to bring it back.

### Re-create the `flaskserver` session

```
tmux new -s flaskserver
cd ~/server/UNanofabTools
source venv/bin/activate
python run.py
```

Then detach with `Ctrl-b d` and walk away. The website is back.

### Re-create the `downloader` session

```
tmux new -s downloader
cd ~/server/UNanofabTools
source venv/bin/activate
python3 HSCDownloader.py
```

Then detach with `Ctrl-b d`. The downloader is back.

(If the exact folders or virtual-environment activation steps differ on your install, see the developer reference — but the *shape* is always the same: open a new tmux session named after the program, change into its folder, activate the Python environment, and run the script. Then **detach, don't exit**.)

## What the admin must do

Before any of the above works for a new user, the Nanofab admin has to do two things on the server side. (These are one-time per user.)

1. **Receive the user's CADE public key** and confirm the user can reach a CADE machine. (CADE accounts and keys are managed via <https://usertools.eng.utah.edu>; the admin doesn't do that part, but they do verify the user has CADE access before issuing the next key.)
2. **Issue an `nfhistory` SSH key**. The admin generates a key pair, installs the public half on `nfhistory` under the shared `phelan` account (`~/.ssh/authorized_keys`), and gives the user the private half plus a copy of the `~/.ssh/config` block above (with the right `IdentityFile` path filled in for that user). The user puts the private half on their CADE home directory and the config block in `~/.ssh/config` on CADE.

The admin should also know the basics of keeping the two sessions healthy:

- After a reboot or a session loss, **the admin** (or anyone with access) re-creates the two tmux sessions using the procedure in the previous section.
- The admin should keep a copy of the runbook — see the developer reference for the exact commands and paths.
- Onboarding a new user means generating one more key pair, no more.

### What the Nanofab admin *cannot* do (and what to ask IT for instead)

`nfhistory` is jointly operated. The Nanofab admin has `sudo` as `phelan` but does **not** have `root`. That means these things go through **University IT**, not the Nanofab admin:

- **Creating per-person UNIX accounts** on `nfhistory`. The shared `phelan` account is the only Nanofab-side login because IT controls user creation. (That's why everyone's `~/.ssh/config` says `User phelan`.)
- **Modifying anything under `/root/`** — including the root SSH key that IT uses for their own maintenance from `iceolate.eng.utah.edu`. Leave it alone.
- **The VM-level backup**. IT runs a backup off the box; the Nanofab team doesn't operate it. If you ever need a restore, it's a ticket to IT.
- **Rebuilding `nfhistory` from scratch.** That's an IT operation. If it ever happens, see the developer reference §5.3 for what the Nanofab admin should verify after IT returns the VM.

The right framing: the Nanofab admin owns everything under `/home/phelan/` (the Flask app, the downloader, the chemical-inventory database, the data trees) and the nginx `untools` config; IT owns the VM, root, backups, and base patching.

## Common confusions

- **"My CADE username and my `nfhistory` username are different."** Yes. Your CADE username is yours; the `nfhistory` username is always `phelan` (a shared cleanroom account). Don't try to use your CADE name in the second hop — it will fail.
- **"Which `lab1-X` should I use?"** Any of them. They're identical and they share your home directory, so your `~/.ssh/config` file is already there no matter which one you land on.
- **"I closed my laptop and the website went down."** Almost certainly you didn't detach properly. Read the "Leaving a session" box again — `Ctrl-b` then `d`.
- **"`ssh nfhistory` says 'permission denied' on CADE."** Either the key file isn't where `IdentityFile` points, or the `User` line isn't `phelan`, or the admin hasn't installed your public key on the server yet.
- **"`ssh nfhistory` says 'host not found' on my laptop."** That command only works *from CADE*. Hop 1 first, then Hop 2.

## In short

You hop from your laptop into a CADE lab machine, then from there into the cleanroom server. Two long-running programs live in two tmux sessions on the server. You look at them with `tmux attach`, you leave them by pressing `Ctrl-b` then `d`, and you only ever recreate a session if one was accidentally killed. The admin's job is to issue you the second key and tell you the path to put it.


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/serveraccess/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Server Access — Developer / Admin Reference

Formal reference for logging into the cleanroom server `nfhistory` (155.98.11.8) and operating the two long-running tmux sessions that host the website and the HSCDownloader. The layman companion lives at `presentation/UNanofabTools/serveraccess/README.md` (repo path: presentation/UNanofabTools/serveraccess/README.md). Known issues and recommended hardening are tracked in `known-issues/UNanofabTools/serveraccess.md` (repo path: known-issues/UNanofabTools/serveraccess.md).

This document is the canonical step-by-step for both **end users** (new staff and developers who need to attach to a session and read logs) and the **admin** (the cleanroom team member responsible for onboarding new users, restarting the services, and rotating keys).

---

## 1. Topology

```
   user laptop ──ssh (key: ~/.ssh/CADE)──►  CADE lab machine
                                            (lab1-1..40 or lab2-1..35
                                             .eng.utah.edu)
                                                  │
                                                  │ ssh (key on CADE; alias 'nfhistory')
                                                  ▼
                                            nfhistory  (155.98.11.8, shared 'phelan' account)
                                                  │
                                                  ▼
                                   tmux sessions:  flaskserver, downloader
```

Two SSH hops are mandatory; `nfhistory` is not reachable from outside the College of Engineering network. CADE provides the bastion. On `nfhistory`, two persistent tmux sessions hold the only two long-running processes the system depends on.

| Hop | From | To | Auth |
|-----|------|----|------|
| 1 | user laptop | `lab1-X.eng.utah.edu` (X ∈ 1..40) **or** `lab2-Y.eng.utah.edu` (Y ∈ 1..35) | CADE SSH key + CADE username |
| 2 | CADE machine | `nfhistory` (`155.98.11.8`) | `nfhistory` SSH key + fixed user `phelan` |

The `lab1-N`/`lab2-N` machines share a single CADE home directory via NFS, so once you place your `~/.ssh/config` and key on any one of them, all of them see it.

---

## 2. Prerequisites

### 2.1 User prerequisites

1. **CADE account.** Created via the College of Engineering self-service portal at <https://usertools.eng.utah.edu>. Username is per-person; password is set during account creation. The portal is also where the user uploads the public half of their CADE SSH key.
2. **CADE SSH key pair.** Generated on the user's laptop:

   ```sh
   ssh-keygen -t ed25519 -f ~/.ssh/CADE -C "<your-CADE-username>@cade"
   ```

   Private half stays at `~/.ssh/CADE`; the corresponding `~/.ssh/CADE.pub` is uploaded to the CADE portal.
3. **`nfhistory` SSH key pair.** Generated by the admin (see §5.1) and delivered to the user along with the `~/.ssh/config` block to place on CADE.

### 2.2 Admin prerequisites

1. Shell access on `nfhistory` as the shared `phelan` user.
2. Permission to edit `/home/phelan/.ssh/authorized_keys` on `nfhistory`.
3. A copy of this runbook and of the `flaskserver` and `downloader` start commands (§4.3).

---

## 3. User procedure

### 3.1 First-time setup on the user's CADE home directory

Hop 1 once to land on a CADE machine (any `lab1-X` or `lab2-Y`):

```sh
ssh -i ~/.ssh/CADE <your-CADE-username>@lab1-10.eng.utah.edu
```

Replace `<your-CADE-username>` with the CADE account name (for example `phelanh`). `lab1-10` may be replaced by any of `lab1-1` … `lab1-40` or `lab2-1` … `lab2-35`; the machines are interchangeable.

On the CADE machine, install the `nfhistory` private key the admin issued you (suggested path `~/.ssh/nfhistory`) and create or append `~/.ssh/config`:

```
Host nfhistory
  Hostname 155.98.11.8
  User phelan
  IdentityFile ~/.ssh/nfhistory
```

Constraints:

- `User` **must** be `phelan`. `nfhistory` has no per-person accounts; everyone authenticates as the shared `phelan` user (distinguished only by which public key authorised the session).
- `Hostname` is the internal IP `155.98.11.8`. There is no public DNS entry — the address is fixed and must be hard-coded here.
- `IdentityFile` is the path to the private key file the admin gave you. Permissions on that file must be `600`:

  ```sh
  chmod 600 ~/.ssh/nfhistory
  chmod 700 ~/.ssh
  ```

  SSH will refuse to use a key file that is group- or world-readable.

### 3.2 Routine login

```sh
# Hop 1 — laptop → CADE
ssh -i ~/.ssh/CADE <your-CADE-username>@lab1-10.eng.utah.edu

# Hop 2 — CADE → server
ssh nfhistory
```

On success, the prompt becomes that of the `phelan` user on `nfhistory`.

### 3.3 Attaching to a session

```sh
tmux attach -t flaskserver   # the Flask web app
tmux attach -t downloader    # the HSCDownloader ETL
```

`tmux ls` lists all sessions currently running on the server.

### 3.4 Detaching (leave without killing)

> **Press `Ctrl-b`, release, then press `d`.**

`Ctrl-b` is tmux's default prefix; `d` is the detach command. Detaching returns you to the plain shell on `nfhistory` while leaving the program inside the session running.

**Do not** type `exit` inside the session — that terminates the shell tmux is hosting, which terminates the program. **Do not** press `Ctrl-c` — that delivers SIGINT to the running process, which also terminates it.

### 3.5 Logout

After detaching, two `exit`s walk the connection back: one closes the `nfhistory` shell, the next closes the CADE shell.

---

## 4. Operating the long-running sessions

### 4.1 Inventory

| Session | Working directory (typical) | Process | Purpose |
|---------|----------------------------|---------|---------|
| `flaskserver` | `~/server/UNanofabTools` | `python run.py` (confirmed by `ps`/tmux state in the 2026-06-01 snapshot) | Serves `nfhistory.nanofab.utah.edu` behind nginx |
| `downloader` | `~/server/UNanofabTools` (same install — `HSCDownloader.py` lives next to `run.py`) | `python3 HSCDownloader.py` | Polls CORES n8n webhook and writes `HSCDATA/*.csv` |

The paths above match the current install. If a future move changes them, update this table — the rest of the procedure is unchanged.

### 4.2 Health check (without restarting anything)

From `nfhistory`:

```sh
tmux ls
```

Expected output:

```
downloader: 1 windows (created …) [80x24]
flaskserver: 1 windows (created …) [80x24]
```

If either session is missing, the program is not running. Proceed to §4.3.

### 4.3 Recreating a session (recovery)

If a session has been accidentally killed (someone typed `exit`, the server rebooted, `Ctrl-c` was pressed inside the session), follow these procedures verbatim.

#### Recreate `flaskserver`

```sh
tmux new -s flaskserver
cd ~/server/UNanofabTools
source venv/bin/activate
python run.py
```

Then detach with `Ctrl-b` `d`. Verify the website is up by visiting `nfhistory.nanofab.utah.edu`.

> **Production note.** `python run.py` is the development invocation. If the deployment was migrated to `gunicorn` (see `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`), substitute the gunicorn command from that runbook. The shape — `tmux new -s flaskserver`, `cd`, activate, run, detach — is the same.

#### Recreate `downloader`

```sh
tmux new -s downloader
cd ~/server/UNanofabTools
source venv/bin/activate
python3 HSCDownloader.py
```

Then detach with `Ctrl-b` `d`. Confirm the next scheduled pull writes a fresh CSV under `HSCDATA/`.

#### Order if both are down

Bring the **downloader** up first (it has no dependency on the website) and then the **flaskserver**. Either order works, but this pattern ensures fresh CSVs are present before the website starts serving them.

### 4.4 Useful tmux subcommands

| Command | Effect |
|---------|--------|
| `tmux ls` | list sessions |
| `tmux attach -t <name>` | attach to a session |
| `tmux new -s <name>` | create a new session named `<name>` |
| `tmux kill-session -t <name>` | terminate a session (use deliberately) |
| `Ctrl-b d` (inside) | detach the current session |
| `Ctrl-b ` (inside) | enter scrollback mode; `q` to exit |
| `Ctrl-b PgUp` (inside) | enter scrollback at the top of recent output |

The scrollback shortcut is the main reason to attach in the first place — read the last few hundred lines of the website's or downloader's log, then `q`, then `Ctrl-b d`.

---

## 5. Admin procedure

> **Operational boundary.** The Nanofab admin works **as `phelan` with `sudo`**, not as `root`. University IT owns `root` on `nfhistory` and is the only party that can create UNIX accounts, modify `/root/`, change the firewall, or operate the VM-level backup. Several steps below explicitly call out which side of the line each action falls on.

### 5.1 Onboarding a new user (one-time per person, Nanofab-side)

1. **Verify the user has a CADE account.** Confirm via the portal at <https://usertools.eng.utah.edu> that the user can SSH into a CADE machine on their own. If they cannot, send them there first; CADE management is outside the cleanroom team's scope.
2. **Generate an `nfhistory` key pair** on a trusted workstation:

   ```sh
   ssh-keygen -t ed25519 -f ./nfhistory_<username> -C "<username>@nfhistory"
   ```

   This produces `nfhistory_<username>` (private) and `nfhistory_<username>.pub` (public).
3. **Install the public half on `nfhistory`** under the shared `phelan` account (no `sudo` needed — `phelan` owns its own `~/.ssh/`):

   ```sh
   # logged in as phelan@nfhistory
   cat nfhistory_<username>.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

   Annotate the line with the user's name in a comment so future revocation is straightforward.
4. **Deliver the private half** to the user via a secure channel (encrypted message, in-person USB; do not email). Include:
   - the private key file,
   - the `~/.ssh/config` block from §3.1 with `IdentityFile` filled in,
   - a pointer to the layman guide at `presentation/UNanofabTools/serveraccess/README.md`.
5. **Record the issuance** somewhere durable (a shared spreadsheet, a key-management note in the cleanroom binder, the lab password manager). At minimum: user name, fingerprint of issued public key, date issued. Because every Nanofab user shares the `phelan` UNIX account (see §5.5 below), this log is the **only** per-person identity layer — keep it accurate.

### 5.2 Offboarding a user (Nanofab-side)

1. Open `/home/phelan/.ssh/authorized_keys` on `nfhistory`.
2. Delete the line carrying that user's public key (identified by the trailing comment from §5.1.3).
3. Record the removal in the same log used during issuance.

Because all Nanofab users share the `phelan` account, key removal is the *only* form of access revocation available to the Nanofab admin. There is no per-user UNIX account to disable.

### 5.3 If `nfhistory` is ever rebuilt — *this is IT's job*

The Nanofab team **cannot** rebuild `nfhistory` from scratch — VM creation, OS install, user creation, and base configuration are all IT operations. If the VM is ever lost or reinstalled, the sequence is:

1. **Open a ticket with University IT** to restore `nfhistory` from their backup pipeline (see [`documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md) §13). Confirm with IT which point-in-time snapshot to restore.
2. After IT confirms the VM is back, the Nanofab admin logs in as `phelan` and verifies:
   - the four SQLite DBs in `~/server/UNanofabTools/instance/` are present,
   - `~/server/UNanofabTools/uploads/`, `LogData/`, `HSCDATA/` are present,
   - the local PostgreSQL data dir (typically `/var/lib/postgresql/17/main/`) was restored — confirm by `psql -h localhost -d cheminventory -c '\dt'`,
   - `/etc/letsencrypt/` was restored — if not, certbot will reissue on next run.
3. Recreate the two tmux sessions per §4.3 if they didn't come up automatically.
4. If `phelan`'s `~/.ssh/authorized_keys` was lost, reissue keys per §5.1 for every active user.

### 5.4 Routine admin checks (Nanofab-side)

| Cadence | Check |
|---------|-------|
| daily | `tmux ls` confirms both sessions are alive |
| weekly | tail the website log inside `flaskserver`; confirm no recurring tracebacks |
| weekly | confirm fresh CSVs land in `HSCDATA/` from the `downloader` |
| monthly | check current TLS cert expiry (`sudo openssl x509 -in /etc/letsencrypt/live/nfhistory.nanofab.utah.edu/fullchain.pem -noout -enddate`) |
| on demand | rotate keys for any user who has separated from the lab |

### 5.5 Why everyone shares the `phelan` account

The cleanroom team does **not** have the ability to create UNIX accounts on `nfhistory` — IT controls `root` and `useradd`. Every Nanofab user (admin or otherwise) authenticates as the shared `phelan` UNIX account; per-person identity exists only as a separate line in `/home/phelan/.ssh/authorized_keys`. If finer-grained per-user accounts ever become important, that's a ticket to IT, not a Nanofab implementation task. See `known-issues/UNanofabTools/serveraccess.md` #1.

---

## 6. Reference: full command summary

```sh
# === user, on laptop ===
ssh -i ~/.ssh/CADE <CADE-username>@lab1-10.eng.utah.edu

# === user, on any CADE machine, one-time setup ===
mkdir -p ~/.ssh && chmod 700 ~/.ssh
# place ~/.ssh/nfhistory (private key from admin), then:
chmod 600 ~/.ssh/nfhistory
cat >> ~/.ssh/config <<'EOF'
Host nfhistory
  Hostname 155.98.11.8
  User phelan
  IdentityFile ~/.ssh/nfhistory
EOF
chmod 600 ~/.ssh/config

# === user, on CADE, routine ===
ssh nfhistory

# === user, on nfhistory ===
tmux ls
tmux attach -t flaskserver       # or 'downloader'
# leave with Ctrl-b then d

# === recovery (either user or admin), on nfhistory ===
tmux new -s flaskserver
cd ~/server/UNanofabTools && source venv/bin/activate && python run.py
# Ctrl-b d

tmux new -s downloader
cd ~/server/UNanofabTools && source venv/bin/activate && python3 HSCDownloader.py
# Ctrl-b d
```

---

## 7. Operational invariants

- **`User phelan` is fixed.** Every Nanofab user authenticates as `phelan` on `nfhistory` because IT — not the Nanofab team — controls UNIX-account creation. Per-user identity is encoded only in *which key authorised the login*. Do not edit the `User` line in `~/.ssh/config` to anything else.
- **The Nanofab admin has `sudo` but not `root`.** University IT owns root. Anything that requires modifying `/root/`, creating UNIX users, changing the firewall, or operating the VM-level backup is an IT ticket.
- **`155.98.11.8` is fixed.** No DNS entry resolves to it from outside the lab. If the server is renumbered, every user's `~/.ssh/config` Hostname line must be updated; getting a DNS alias is an IT (Eng-DNS) ticket — see `known-issues/UNanofabTools/serveraccess.md` #2.
- **Both sessions must always be alive.** A missing `flaskserver` means the website is down; a missing `downloader` means new CORES data is not arriving. The §4.3 recovery procedure is the response in either case.
- **Detach, never exit.** `Ctrl-b d` is the only safe way to leave a session.
- **CADE homes are NFS-shared.** Whatever you put in `~/.ssh/config` and `~/.ssh/nfhistory` on `lab1-10` is visible on `lab2-23` and vice versa.
- **Root SSH access is IT's, from `iceolate.eng.utah.edu`.** Do not touch `/root/.ssh/authorized_keys` or change `PermitRootLogin` without coordinating with IT — see `documentation/UNanofabTools/liveserver/README.md` §9.1.

---

## 8. Related documentation

- Layman companion: `presentation/UNanofabTools/serveraccess/README.md`.
- Known issues / tech debt: `known-issues/UNanofabTools/serveraccess.md`.
- **Live server inventory** (what is actually running on `nfhistory` right now — TLS certs, services, packages, what's surprising about the install): `documentation/UNanofabTools/liveserver/` (repo path: documentation/UNanofabTools/liveserver/README.md). The survey script lives there too.
- The two services hosted in the tmux sessions: `documentation/UNanofabTools/flaskserver/` and `documentation/UNanofabTools/hscdownloader/`.
- Deployment runbook for `flaskserver` (gunicorn, nginx, env vars): `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`.


# Read-Aloud Documentation Corpus: known-issues/UNanofabTools/serveraccess.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# Server Access — Known Issues & Technical Debt

Working list for the SSH access pattern and the two tmux sessions on `nfhistory`. Separate from the successor docs. Nothing here has been changed in the code or in the server's current setup.

Severity: **High** = operational/security risk · **Medium** = robustness/maintainability · **Low** = cleanup.

---

### 1. Shared `phelan` account on `nfhistory` — Medium (structural constraint)
- **Where:** every Nanofab user authenticates as the same `phelan` UNIX user on the server. Per-user identity exists only as a distinct line in `/home/phelan/.ssh/authorized_keys`.
- **Reality:** **the Nanofab team cannot create UNIX accounts.** University IT owns `root` on `nfhistory`; the Nanofab admin has `sudo` as `phelan` but cannot `su` to root or `useradd` new users. The shared-account model is therefore a structural constraint imposed by IT's operational boundary, not a Nanofab implementation choice.
- **Risk (residual):** no per-user audit trail in `wtmp`/`last`/process accounting — every Nanofab action appears as `phelan`. Revocation requires editing `authorized_keys`. If a key isn't annotated with whose it is, offboarding becomes guesswork.
- **Mitigation (Nanofab-side):** keep a tightly-controlled key-issuance log in the lab binder or the Nanofab-shared password manager: name, fingerprint, date issued, date rotated, date revoked. The runbook (`§5.1` step 5) already calls for this.
- **Fix (if ever desired):** **open a ticket with University IT** asking them to create per-person UNIX accounts on `nfhistory` (e.g. `faithh`, etc.), each with `sudo` rights as needed, with `phelan` retained for the service processes. Until IT agrees, item #1 cannot be implemented from the Nanofab side.

### 2. Hard-coded server IP in every user's `~/.ssh/config` — High
- **Where:** `Hostname 155.98.11.8` in the `~/.ssh/config` block users place on CADE.
- **Risk:** if the server is renumbered (planned move, DHCP change, subnet renumber) every user's CADE config must be updated by hand. There is no DNS abstraction layer. The IP is also publicly documented now (here and in onboarding emails), which leaks an internal address.
- **Fix:** ask College of Engineering IT to register a DNS A record such as `nfhistory.eng.utah.edu` pointing at the internal IP, then change every user's config to use the name. Update this runbook in lockstep. Treat the IP itself as sensitive until the alias exists.

### 3. tmux sessions are the only process supervisor — High
- **Where:** the website (`flaskserver`) and HSCDownloader (`downloader`) run as plain `python` processes inside tmux. Nothing supervises them.
- **Risk:** if a process crashes (unhandled exception, OOM, transient bug), tmux keeps the shell open at a prompt — but the *service is down* until a human attaches and notices. A server reboot kills both sessions entirely. There is no automatic restart, no alerting, no health endpoint monitor.
- **Fix:** convert both services to `systemd` units (`flaskserver.service`, `hscdownloader.service`) with `Restart=on-failure` and a `WantedBy=multi-user.target` so they survive reboots. Keep tmux as a *debugging* convenience (attach to a `journalctl -fu flaskserver` window) rather than the supervisor of record. See `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md` for the gunicorn unit shape this should follow.

### 4. Accidental `exit` or `Ctrl-c` inside a session takes the service down — High (impact) / Low (likelihood once trained)
- **Where:** any attach. There is no guard, no `trap`, no read-only mode.
- **Risk:** a user attaches to look at logs, hits `Ctrl-c` reflexively, and silently kills the website. The layman README emphasizes `Ctrl-b d` precisely because of this.
- **Fix:** once #3 is done, this stops being a problem — killing the process triggers an automatic restart. As a stopgap, consider running the services under `tmux` with `set -g remain-on-exit on` so the pane stays visible after a crash and a watcher script can detect it. Also consider a read-only attach pattern for visitors (`tmux attach -r -t flaskserver`).

### 5. Two-hop access depends on CADE availability — Medium
- **Where:** every login flows through a CADE lab machine.
- **Risk:** if CADE is down for maintenance, the cleanroom server is unreachable, including for incident response. There is no out-of-band path documented.
- **Fix:** document a fallback (a second jump host inside the same network, or a maintenance VPN). At minimum, list which CADE machines have historically had the highest uptime so on-call staff don't burn through dead numbers.

### 6. No documented key rotation cadence — Medium
- **Where:** keys issued under §5.1 of the runbook have no expiry, no rotation policy, and no log of who holds what.
- **Risk:** an ex-employee's key remains valid until someone proactively removes it. With #1 in place, this is a single shared `authorized_keys` and tracking is on the honor system.
- **Fix:** adopt an annual rotation policy; keep a key-issuance log (name, fingerprint, date issued, date last rotated, date revoked). Use SSH certificate authority signing if/when CADE IT supports it — that gives expiring credentials automatically.

### 7. Production invocation likely differs from the documented `python run.py` — Medium
- **Where:** §4.3 of the runbook shows `python run.py` as the `flaskserver` recovery command. That is the Flask development server.
- **Risk:** if the live deployment is gunicorn (per `flaskserver/09-deployment-and-operations.md`) and a recovery uses `python run.py` instead, the server comes back up but in dev mode — single-threaded, debug-enabled, fewer workers, no proper signal handling. The site appears to work but degrades under load and exposes more in tracebacks.
- **Fix:** confirm which command the live `flaskserver` session currently runs (attach and look at process tree) and document *that* command exactly in §4.3. If it really is `python run.py`, treat that as a separate finding to migrate to gunicorn.

### 8. CADE NFS home is a single point of failure for the config — Low/Medium
- **Where:** every user's `~/.ssh/config` and `~/.ssh/nfhistory` lives in their NFS-mounted CADE home.
- **Risk:** if CADE NFS is degraded, the config can fail to load and `ssh nfhistory` will appear broken in ways unrelated to the cleanroom server. Confusing during incidents.
- **Fix:** mostly out-of-scope (CADE IT manages NFS) but worth noting in the user guide so people don't chase ghosts.

### 9. No documented "is the website actually responding?" check — Low
- **Where:** the runbook checks `tmux ls`; that confirms the *session* is alive, not that the *service* is responding.
- **Risk:** the Flask process may be wedged on a request, the gunicorn workers may be deadlocked, etc., while tmux is happy.
- **Fix:** add a `curl --max-time 5 https://nfhistory.nanofab.utah.edu/healthz` check to §4.2 (and add a `/healthz` route if it doesn't exist).

### 10. Private keys delivered out-of-band with no inventory — Low
- **Where:** §5.1 step 4 — "deliver private key via secure channel."
- **Risk:** "secure channel" is unspecified; a USB stick left in a drawer is technically secure but practically not. No record of *what* was delivered.
- **Fix:** standardize on a single delivery mechanism (e.g. age-encrypted file shared via lab password manager) and document it. Pair with the issuance log from #6.

### 11. The `Ctrl-b` prefix can clash with terminal shortcuts — Low
- **Where:** anyone attaching from a terminal that already uses `Ctrl-b`.
- **Risk:** confusing for new users; surprise key swallowing.
- **Fix:** consider standardizing on a less-conflicty prefix (e.g. `Ctrl-a`) via a server-wide `~/.tmux.conf`. Communicate the change in the runbook before doing it.

---

## Suggested priority order

Nanofab-actionable items only. Items the Nanofab team cannot resolve on its own (because they require IT) are listed separately below.

1. **#3** — put both services under `systemd`. Eliminates #4 and most of the operational fragility in one move. Doable with `sudo` from the Nanofab side.
2. **#7** — confirm the live `flaskserver` command and document the actual one.
3. **#6, #10** — formalize key issuance, rotation, and delivery (Nanofab can do this with a binder/password manager; no IT involvement needed).
4. **#5, #8, #9, #11** — robustness and cleanup.

Needs IT (open a ticket):
- **#1** — per-person UNIX accounts on `nfhistory`. Cannot be implemented from the Nanofab side; structural until IT agrees.
- **#2** — DNS A record `nfhistory.eng.utah.edu` → `155.98.11.8`. CADE IT / Eng IT controls DNS.
