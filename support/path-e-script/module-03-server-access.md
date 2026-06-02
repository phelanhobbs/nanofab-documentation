# Module 3 - Server Access And Safe Inspection

## Goal

The maintainer can explain and perform safe server access: two-hop SSH, shared `phelan` UNIX account, tmux inspection, safe detach, and non-destructive survey collection.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx`](../../presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx)
- [`../../presentation/UNanofabTools/serveraccess/README.md`](../../presentation/UNanofabTools/serveraccess/README.md)
- [`../../documentation/UNanofabTools/serveraccess/README.md`](../../documentation/UNanofabTools/serveraccess/README.md)
- [`../../known-issues/UNanofabTools/serveraccess.md`](../../known-issues/UNanofabTools/serveraccess.md)

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

The recovery commands in [`../../documentation/UNanofabTools/serveraccess/README.md`](../../documentation/UNanofabTools/serveraccess/README.md).

## Explain-Back

ASK:

- What are the two SSH hops?
- Why does the SSH config use `User phelan`?
- What are the two important tmux sessions?
- What exact keys detach from tmux?
- Why is `Ctrl-c` dangerous in a live service pane?
- Why is `exit` dangerous in a live service pane?
- What is Nanofab allowed to change?
- What access changes require IT?

REQUIRE:

The maintainer can recite: "Attach, look, detach with `Ctrl-b d`; do not exit; do not `Ctrl-c`."

## Stop Point

STOP POINT:

Stop here if the maintainer has not practiced safe detach. Assign practice in a non-production tmux session or schedule a supervised production inspection.
