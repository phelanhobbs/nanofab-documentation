# Accessing the Server — A Plain-English Guide

This guide explains how to actually log in to the cleanroom server (`nfhistory`) — the machine that runs the website and the HSCDownloader. Written for someone who has never used SSH before; terms are defined as they appear.

## The short version

You can't reach the server directly from outside the lab. To get to it you have to take **two hops**:

1. From your laptop, log in to a **CADE lab machine** (a generic Linux machine in the university's College of Engineering lab pool).
2. From the CADE machine, log in to **`nfhistory`** (the cleanroom server).

Once you're on `nfhistory`, the two long-running programs — the website (`flaskserver`) and the data downloader (`downloader`) — are each kept running inside a **tmux session**. You attach to a session to look at it, then detach without killing it.

This page walks through all of that. There is a strict, separate developer reference at [`../../../documentation/UNanofabTools/serveraccess/`](../../../documentation/UNanofabTools/serveraccess/README.md); use it once you've read this.

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
