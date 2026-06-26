# Medium Full Path E - Module 03: Server Access

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

## Source-code pass for Module 03

READ ALOUD:

We are now doing the source-code pass for Server Access. The maintainer should connect this module to two-hop SSH, shared phelan account, tmux safety, and survey snapshots. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Live-state pass for Module 03

READ ALOUD:

We are now doing the live-state pass for Server Access. The maintainer should connect this module to two-hop SSH, shared phelan account, tmux safety, and survey snapshots. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Failure-mode pass for Module 03

READ ALOUD:

We are now doing the failure-mode pass for Server Access. The maintainer should connect this module to two-hop SSH, shared phelan account, tmux safety, and survey snapshots. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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
flaskserver: 2 windows (created …) [80x24]
```

(Window counts as of the 2026-06-01 survey; the exact number of windows per session may vary — what matters is that both sessions exist.)

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

> **Production note.** `python run.py` is the development invocation. If the deployment was migrated to `gunicorn` (see `documentation/UNanofabTools/flaskserver/09-deployment-and-operations.md`), substitute the gunicorn command from that runbook. The shape — `tmux new -s flaskserver`, `cd`, activate, run, detach — is the same. **Update (2026-06-18):** the two services now run under **user-level systemd** (`systemctl --user restart flaskserver` / `hscdownloader`, `Restart=on-failure`, linger enabled), so recovery is normally a `systemctl --user restart` rather than recreating the tmux session; the tmux procedure remains a valid manual fallback.

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

> **Cold-start note.** Step 3 below assumes someone can already log in as `phelan`. If no current keyholder is available (e.g. the previous admin has left and no working key remains), contact the **CADE IT department** to install the new public key instead — then continue from step 4.

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

### 3. tmux sessions are the only process supervisor — ✅ RESOLVED (2026-06-18) *(was High)*
- **Resolution:** both services now run as **user-level systemd** units (`systemctl --user`, `Restart=on-failure`, linger enabled) rather than bare `python` in tmux, so a crash auto-restarts and a reboot brings them back. (Still `python run.py`, not gunicorn — optional follow-up per #7.)
- **Original finding:** the website (`flaskserver`) and HSCDownloader (`downloader`) ran as plain `python` inside tmux with nothing supervising them — a crash left the service down until a human noticed, and a reboot killed both sessions.
- **Note:** these are *user* units (passwordless sudo is scoped to `systemctl`, not `/etc`); a root unit would need IT, but user-unit + linger is equivalent for uptime.

### 4. Accidental `exit` or `Ctrl-c` inside a session takes the service down — High (impact) / Low (likelihood once trained)
- **Where:** any attach. There is no guard, no `trap`, no read-only mode.
- **Risk:** a user attaches to look at logs, hits `Ctrl-c` reflexively, and silently kills the website. The layman README emphasizes `Ctrl-b d` precisely because of this.
- **Fix:** with #3 now resolved (2026-06-18, systemd auto-restart), an accidental kill self-heals. A read-only attach pattern for visitors (`tmux attach -r -t flaskserver`) is still a good stopgap against fat-fingering an interactive pane.

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

1. **#3** — ✅ done (2026-06-18): both services under user-systemd (eliminated #4's silent-kill failure mode). *(Optional: migrate to gunicorn per #7.)*
2. **#7** — confirm the live `flaskserver` command and document the actual one.
3. **#6, #10** — formalize key issuance, rotation, and delivery (Nanofab can do this with a binder/password manager; no IT involvement needed).
4. **#5, #8, #9, #11** — robustness and cleanup.

Needs IT (open a ticket):
- **#1** — per-person UNIX accounts on `nfhistory`. Cannot be implemented from the Nanofab side; structural until IT agrees.
- **#2** — DNS A record `nfhistory.eng.utah.edu` → `155.98.11.8`. CADE IT / Eng IT controls DNS.


# Module Slide Note Corpus



## Slide Notes From presentation/UNanofabTools/serveraccess/slides/_build/build_tool.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); const fs = require(
- ); const { Deck } = require(
- ); const M = require(
- ); const modPath = process.argv[2]; if (!modPath) { console.error(
- ); process.exit(1); } const OUT = process.env.OUT || path.join(__dirname,
- ); fs.mkdirSync(OUT, { recursive: true }); (async () => { const mod = require(path.join(__dirname, modPath)); const d = new Deck({ title: mod.title, subtitle: M.series, author: M.presenter, footer:
- + mod.title }); mod.build(d); const outPath = path.join(OUT, mod.filename); await d.save(outPath); console.log(


## Slide Notes From presentation/UNanofabTools/serveraccess/slides/_build/deckkit.js

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


## Slide Notes From presentation/UNanofabTools/serveraccess/slides/_build/meta.js

READ ALOUD OR USE AS SPEAKER NOTES:

- Utah Nanofab · University of Utah
- UNanofabTools Server — A Plain-English Guide


## Slide Notes From presentation/UNanofabTools/serveraccess/slides/_build/tooldecks/serveraccess.js

READ ALOUD OR USE AS SPEAKER NOTES:

- ); module.exports = { filename:
- How to log in to nfhistory — the two-hop route through CADE,
- and how to operate the long-running tmux sessions safely.
- This session covers the unusual login pattern the cleanroom server requires: you can't reach it directly. You first SSH into a CADE
- lab machine, then SSH from there into the server. Once you're on the server, the website and the data downloader each live inside a
- tmux session that you must never accidentally exit. We'll go through the user procedure, the admin's onboarding job, and what to do
- if a session gets killed. No prior SSH experience required.
- It is not reachable from outside that network — including your laptop.
- CADE lab machines ARE on that network, so they serve as a stepping stone.
- This pattern is called a 'jump host' or 'bastion'.
- Set up the why. The server is intentionally not on the public internet. CADE — the College of Engineering's lab computer pool — sits
- on a network that can talk to it, so we use a CADE machine as a middle hop. Industry calls this a jump host. Once you understand that
- framing, the rest of the procedure follows naturally.
- Any one of these is fine — they're identical and share your home directory.
- machines total pick any one
- Reassure the audience that they don't have to memorize a particular machine. CADE is a pool of 75 interchangeable Linux boxes. They
- share your home directory over NFS, which means once you put your SSH config on any one of them, it's there on all of them. If lab1-10
- is slow, hop into lab1-11. The number doesn't matter.
- What you need before your first login
- A CADE account — sign up at usertools.eng.utah.edu.
- A CADE SSH key (~/.ssh/CADE on your laptop).
- An nfhistory SSH key — issued by the cleanroom admin.
- Your CADE username (for hop 1). Note: the server username is always 'phelan'.
- These are one-time prerequisites. CADE accounts are self-service via the usertools portal. Your CADE key is a small file that proves
- you're you; you generate it on your laptop and upload the public half to CADE. The nfhistory key — the second key, for the second hop
- — is generated and delivered to you by the cleanroom admin. The most important point: your CADE username is yours, but the username
- you use on the server is always 'phelan'. That's a shared cleanroom account, not your name. People trip over this constantly.
- Hop 1 — laptop to CADE
- From a terminal on your laptop:
- │ └── replace with your CADE username
- └── use the CADE key at this path
- # lab1-10 may be replaced by any of:
- On success you're at a Linux prompt on the CADE machine.
- Walk through the command piece by piece. ssh is the secure-shell tool. -i tells it which key file to use. Your CADE username goes
- before the @, the CADE machine after. After this completes you're remotely logged into the CADE box — every command you type now runs
- there, not on your laptop. Cosmetically nothing dramatic changes; just a different prompt.
- Hop 2 — CADE to nfhistory
- Once you're on CADE, just three words:
- # This works because of this file on CADE: ~/.ssh/config
- The 'phelan' user is fixed — every user authenticates as the same shared account.
- Hop 2 is shockingly short — three words — because the heavy lifting is in the config file. That file lives at ~/.ssh/config on the
- CADE machine; you write it once and forget it. Walk through each line: Host is the nickname, Hostname is the actual IP, User is the
- fixed shared account name 'phelan', IdentityFile is where the second key lives. Emphasize that User MUST be phelan — that's not your
- name, that's the cleanroom server's shared account.
- Recap of the login flow
- ssh nfhistory (uses the config file on CADE)
- as the shared 'phelan' account.
- Reinforce the shape of the procedure. Four steps. Two ssh commands. After this completes you're at a Linux prompt on the cleanroom
- server, where the two long-running services live. The audience should be able to recite this in their sleep after a few logins.
- On the server: two tmux sessions
- The website — the Flask app behind nfhistory.nanofab.utah.edu
- HSCDownloader — pulls per-machine data from CORES, writes HSCDATA CSVs
- Introduce tmux at a high level: it's a 'saved terminal' — a window with a program running in it that keeps going even when nobody's
- logged in. The cleanroom server uses exactly two of them. The website is the one users see; the downloader is the data pipeline that
- keeps the website's machine pages fresh. Both must stay alive 24/7. **Update (2026-06-18):** these two services now run under
- user-level systemd (systemctl --user, auto-restart on failure, linger), so they survive crashes and reboots on their own. The tmux
- sessions remain a convenient way to watch live console output, and the detach hygiene below still matters for clean inspection —
- though an accidental exit no longer takes the website down the way it used to.
- Looking at a session (attaching)
- tmux ls # list all sessions
- tmux attach -t flaskserver # look at the website's console
- tmux attach -t downloader # look at the downloader's console
- Attaching shows you the live output. It does NOT restart anything.
- Demonstrate the routine inspection commands. tmux ls confirms both sessions are alive — if either is missing the program isn't
- running. tmux attach drops you into the live console of one of them, so you can read recent log output. Attaching is read-mostly: it
- doesn't disturb the process inside.
- ★ Leaving WITHOUT killing the program ★
- This is the single most important slide. Read it twice.
- Press Ctrl-b, release, then press d.
- That's the tmux 'detach' shortcut: it leaves the session running.
- DO NOT type 'exit' — that ends the program inside the session.
- DO NOT press Ctrl-c — that also ends the program.
- Hammer this. The single most common mistake is to attach to a session, read what they wanted, then close the terminal or type exit.
- Either kills the program. The correct way out is to detach: Ctrl-b is tmux's 'prefix' (a signal that the next key is meant for tmux),
- and d is the detach command. Type them as two separate keystrokes. After detaching you're back at the plain server shell; the program
- is still running. From there, exit twice walks you back out of the server and then out of CADE — that's fine.
- Scroll, read the recent output.
- Ctrl-b then d — you're back at the server prompt.
- exit, exit — closes the SSH chain. Sessions stay alive.
- Synthesize the previous slides into a memorable four-step ritual. Attach. Look. Detach with Ctrl-b d. Then walk away — exiting the
- outer shells is fine; only typing exit INSIDE the session is the problem. If a user can do these four steps every time, they will
- never bring the website down by accident.
- If 'tmux attach -t flaskserver' says no session, the website is down. Bring it back:
- # then detach with Ctrl-b d
- Verify by loading nfhistory.nanofab.utah.edu in a browser.
- If a session is gone — accidental exit, server reboot — recovery is mechanical. Open a new tmux session named after the program,
- change into its folder, activate the Python virtual environment, run the script. Then DETACH (don't forget). Confirm the website
- responds. If the deployment was migrated to gunicorn for production, substitute that command — the runbook in the developer docs has
- the exact form. The SHAPE — new tmux session, cd, activate, run, detach — never changes.
- Same idea for the data downloader:
- # then detach with Ctrl-b d
- Verify by watching fresh CSVs appear in ~/server/UNanofabTools/HSCDATA.
- Identical pattern for the downloader. New tmux session named downloader, cd into the shared UNanofabTools install, activate venv, run the
- script, detach. Confirmation is that fresh CSV files start landing in ~/server/UNanofabTools/HSCDATA on the next scheduled cycle. Bring the downloader up
- before the website if both are down — fresh data should exist before the site serves it.
- Who does what (Nanofab side)
- Generate your own CADE key.
- Receive nfhistory key from admin.
- Attach, look, detach with Ctrl-b d.
- Nanofab admin (sudo, not root)
- Generate nfhistory key pair per user.
- Install public half in /home/phelan/.ssh/authorized_keys.
- Deliver private half + config block securely.
- Recreate killed sessions per the runbook.
- Remove keys when a user separates.
- Split the Nanofab-side responsibilities. The user handles their own CADE side — account, key, config file. The Nanofab admin
- handles the cleanroom side — generating per-user nfhistory keys, installing them under the shared phelan account, and being the
- on-call for recovering killed sessions. Offboarding is just deleting the user's line from authorized_keys, because everyone shares
- the same UNIX account. CRUCIAL: the Nanofab admin has sudo as phelan but NOT root. Anything requiring root — see next slide.
- What goes through IT instead
- Create new UNIX accounts on nfhistory.
- Rebuild the VM from scratch.
- Per-person UNIX accounts → IT ticket.
- Tighten /root/.ssh/authorized_keys mode → IT ticket.
- Confirm backup scope + restore → IT ticket.
- Configure auto-patching on the VM → IT ticket.
- Restore from backup after a loss → IT ticket.
- Boundary slide. University IT owns the VM, root, the backup pipeline, and base patching. The Nanofab team has sudo as phelan but
- cannot create UNIX users and cannot modify /root/. So the access docs say everyone shares the phelan account not because that's a
- design choice — it's the structural reality of the IT/Nanofab boundary. Anything that requires root is an IT ticket. iceolate is
- IT's admin host; the root SSH key in /root/.ssh/authorized_keys belongs to IT and shouldn't be touched.
- Common confusions (and quick fixes)
- 'My CADE name vs server name' — server user is ALWAYS 'phelan'. Not yours.
- 'Which lab1-X?' — any of them. They're identical.
- 'Closed my laptop, the site went down' — you didn't detach. Use Ctrl-b d.
- 'ssh nfhistory' said host not found — you have to be on CADE first.
- 'Permission denied' on hop 2 — key not at the IdentityFile path, or User isn't phelan.
- Anticipate the recurring questions. The username confusion comes up every time. The lab1 number doesn't matter. Closed-laptop =
- didn't-detach is the canonical 'oops, I broke the site' scenario. ssh nfhistory only works after hop 1 — it's defined in the CADE
- config, not your laptop's. Permission denied almost always means the key file isn't at the path the config points at, or the User
- Server account is shared as 'phelan' — not your name.
- Two tmux sessions: flaskserver (website), downloader (data ETL).
- Detach with Ctrl-b d. Never exit. Never Ctrl-c.
- If a session is gone, recreate it with tmux new + cd + venv + run + detach.
- Wrap up. Two hops to reach the server. Phelan is the shared account name. Two tmux sessions hold the only two services. The single
- rule that prevents almost all outages: detach with Ctrl-b d; never type exit or Ctrl-c inside the session. Recovery is mechanical when
