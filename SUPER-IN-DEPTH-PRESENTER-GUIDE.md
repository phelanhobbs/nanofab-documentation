# Super In Depth Presenter Guide

This file tells Faith how to present the complete handoff to a future maintainer while showing the existing slide decks on a screen.

Use this when the goal is not a quick briefing. Use it when the next maintainer should leave able to operate, audit, recover, and extend the system without contacting Faith.

This is a presenter script, not another slide deck. Keep the slides visible, but use this file to decide what to emphasize, when to pause, what to demonstrate, and what the maintainer must explain back before moving on.

## Presentation Philosophy

Take longer than feels necessary.

The danger is not boring the maintainer. The danger is leaving them with a polished overview but no operational confidence. This system is a mixture of web application code, live-server state, data pipelines, desktop tools, sensor firmware, shared-account access, and University IT boundaries. A future maintainer needs the full mental model, not just a tour of files.

Use the decks as anchors:

- The slides give the visual story.
- The layman READMEs give the same story in prose.
- The developer docs give the exact procedures and code-level reference.
- The known-issues files give the honest maintenance plan.
- The live server and source repos prove whether the docs are still true.

For each section, follow this rhythm:

1. Show the relevant deck.
2. Explain the purpose in plain English.
3. Open the matching docs or source files.
4. Demonstrate the live or local evidence if safe.
5. Ask the maintainer to explain it back.
6. Record any confusion as a doc or known-issues update.

Do not move on because you finished the slides. Move on only when the future maintainer can answer the comprehension checks.

## Expected Length

There is no time limit. A good version of this presentation can take several long sessions.

Minimum serious version:

- 2 full days.

Better version:

- 4 to 6 half-day sessions.

Best version:

- Several sessions spread over 1 to 2 weeks, with the maintainer doing reading, source checks, and live-server practice between sessions.

If you have to choose between finishing the deck list and letting the maintainer practice, choose practice.

## Required Setup

Before starting, prepare:

- A screen with slides open in presenter mode if possible.
- This file open beside the slides.
- [START-HERE.md](START-HERE.md) open.
- [PATH-D-DEEP-DIVE.md](PATH-D-DEEP-DIVE.md) open.
- The documentation repo checked out on the current handoff branch.
- The source repos available as sibling directories: `../UNanofabTools` and `../NanofabToolkit`.
- A terminal in `nanofab-documentation/`.
- A terminal in `../UNanofabTools/`.
- A terminal in `../NanofabToolkit/`.
- Browser access to `https://nfhistory.nanofab.utah.edu` if appropriate.
- SSH access to `nfhistory` if this is an operational maintainer handoff.

Before any live demo:

- Never show secret values on screen.
- Never paste bearer tokens, WiFi passwords, database passwords, Duo secrets, or private keys.
- Do not edit production files during the presentation unless the session is explicitly a maintenance session.
- In tmux, detach with `Ctrl-b d`.
- Do not press `Ctrl-c` in a live service pane.
- Do not type `exit` inside a live service pane unless you intentionally want to terminate the shell or process.

## Core Story To Repeat

Repeat this through the entire presentation:

`nfhistory` is not just a website. It is the hub where cleanroom users, machine logs, CORES data, chemical inventory, sensor devices, desktop tools, and University IT-owned infrastructure meet.

The maintainer must understand four boundaries:

- User-facing website vs background data supply.
- Application code vs live production state.
- Nanofab-owned operational surface vs University IT-owned infrastructure.
- Current/canonical code vs historical/deprecated code.

The maintainer should hear these facts many times:

- The live Flask app is installed at `/home/phelan/server/UNanofabTools/`.
- `HSCDownloader.py` lives in that same production install directory.
- Chem PostgreSQL is local on `nfhistory`, listening on `127.0.0.1:5432`.
- The Flask app and HSCDownloader currently run in tmux, not systemd.
- University IT owns the VM, root, root SSH, OS-level backup, and base patching.
- Nanofab owns the Flask app, HSCDownloader, chem DB use, cleanroom data trees, and `/home/phelan/`.
- The Nanofab admin has `sudo` as `phelan`, not root, and cannot create UNIX users.
- `NanofabToolkit` is canonical for PicoHelperTools and ParticleSensor.
- `hscdisplayerserver` is deprecated and should not be improved unless live evidence says it is still in use.

## Presenter Ground Rules

Say these at the beginning:

1. "I am going to over-explain. That is intentional."
2. "If something sounds operationally weird, I will say that directly and explain the boundary."
3. "The slides are not the source of truth. They are a map to the docs, source code, live state, and known issues."
4. "I will ask you to explain things back. That is not a test of you; it is a test of whether the handoff is complete."
5. "Any answer that depends on asking me later gets turned into written documentation today."

## Screen Layout

Use this layout if possible:

- Main screen: slide deck.
- Presenter laptop left pane: this guide.
- Presenter laptop right pane: terminal or documentation.
- Browser tab group: website, GitHub repo, docs files.
- Terminal tab group: docs repo, `../UNanofabTools`, `../NanofabToolkit`, SSH to `nfhistory`.

Do not keep secret-bearing files open on the projected screen. If you need to discuss `.env`, show key names only or use the annotated template in the docs.

## Full Deck Order

Use this as the master order. It intentionally covers more than Path A.

| Order | Deck | Purpose |
|-------|------|---------|
| 1 | [00-Start-Here-Index.pptx](presentation/UNanofabTools/flaskserver/slides/00-Start-Here-Index.pptx) | Explain the slide series and how to use it. |
| 2 | [01-Server-Overview.pptx](presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx) | Establish the full server mental model. |
| 3 | [Live-Server.pptx](presentation/UNanofabTools/liveserver/slides/Live-Server.pptx) | Explain what is actually running on `nfhistory`. |
| 4 | [Server-Access.pptx](presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx) | Teach access, tmux, and safe inspection. |
| 5 | [02-How-It-Starts.pptx](presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx) | Show startup, app factory, and blueprints. |
| 6 | [03-Configuration.pptx](presentation/UNanofabTools/flaskserver/slides/03-Configuration.pptx) | Explain env vars, config classes, and data paths. |
| 7 | [04-Authentication-and-Login.pptx](presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx) | Explain login, sessions, password hashing, and Duo. |
| 8 | [05-Admin-Panel.pptx](presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx) | Explain admin permissions and user management. |
| 9 | [06-Tasks.pptx](presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx) | Explain the internal task tracker. |
| 10 | [07-Machines-and-Logs.pptx](presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx) | Explain machine pages, log browsing, downloads, and graphs. |
| 11 | [08-IoT-API-Endpoints.pptx](presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx) | Explain device ingestion endpoints and data contracts. |
| 12 | [09-Chemical-Inventory.pptx](presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx) | Explain the largest feature and the local PostgreSQL dependency. |
| 13 | [10-Database-Models.pptx](presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx) | Explain SQLite, PostgreSQL, tables, and persistence. |
| 14 | [11-Particle-Demo.pptx](presentation/UNanofabTools/flaskserver/slides/11-Particle-Demo.pptx) | Explain the standalone demo page. |
| 15 | [12-Consumers-NanofabToolkit.pptx](presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx) | Explain producers and consumers outside the Flask app. |
| 16 | [13-Request-Lifecycle-Walkthrough.pptx](presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx) | Tie requests, devices, nginx, auth, routes, and persistence together. |
| 17 | [14-Security-Model.pptx](presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx) | Explain security strengths and gaps honestly. |
| 18 | [15-Endpoint-Reference.pptx](presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx) | Explain every route family and how to audit route drift. |
| 19 | [HSC-Downloader.pptx](presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx) | Explain the CORES to HSCDATA data supply line. |
| 20 | [File-Transfer-Scripts.pptx](presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx) | Explain machine-control-PC uploads. |
| 21 | [PicoHelperTools.pptx](presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx) | Explain canonical Pico firmware. |
| 22 | [ParticleSensor.pptx](presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx) | Explain canonical desktop particle viewer. |
| 23 | [Pico-Firmware.pptx](presentation/UNanofabTools/picofirmware/slides/Pico-Firmware.pptx) | Explain older firmware copies and historical context. |
| 24 | [Particle-PC-Tools.pptx](presentation/UNanofabTools/particlepctools/slides/Particle-PC-Tools.pptx) | Explain older particle viewer/test generator copies. |
| 25 | [ParalyneReader.pptx](presentation/NanofabToolkit/ParalyneReader/slides/ParalyneReader.pptx) | Explain Parylene desktop data review. |
| 26 | [DAT-Tools.pptx](presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx) | Explain DATfixer and DATgrapher. |
| 27 | [DentonDecoder.pptx](presentation/NanofabToolkit/DentonDecoder/slides/DentonDecoder.pptx) | Explain the separate Denton charting tool. |
| 28 | [ALDPeakCounter.pptx](presentation/NanofabToolkit/ALDPeakCounter/slides/ALDPeakCounter.pptx) | Explain ALD cycle counting and run comparison. |
| 29 | [PreciousMetalReader.pptx](presentation/NanofabToolkit/PreciousMetalReader/slides/PreciousMetalReader.pptx) | Explain monthly CORES metal-usage extraction. |
| 30 | [Utilities.pptx](presentation/UNanofabTools/utilities/slides/Utilities.pptx) | Explain helper scripts and incomplete utilities. |
| 31 | [HSC-Displayer-Server-Legacy.pptx](presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx) | Explain the deprecated predecessor and why to avoid improving it. |

## Module 0 - Set The Contract

### Show

- [START-HERE.md](START-HERE.md)
- [PATH-D-DEEP-DIVE.md](PATH-D-DEEP-DIVE.md)
- This file.

### Say

"This handoff is not only about what files exist. It is about ownership. By the end, you should be able to operate the live server, explain the application architecture, identify what code is canonical, distinguish Nanofab tasks from IT tickets, audit the docs against the code, and create a maintenance plan."

"If you cannot answer something from the docs, source, or live state, we will write it down. The goal is to remove me as a dependency."

### Demonstrate

Open a terminal and run:

```sh
git status --short --branch
bash audit.sh
```

Do not dwell on every line yet. Use the audit output to prove the docs have a repeatable mechanical check.

### Ask The Maintainer

- What are the three documentation trees?
- Where are the source repos expected to live?
- What is the difference between Path C and Path D?
- What should happen if source, docs, and live state disagree?

### Do Not Move On Until

The maintainer can explain that this is a documentation-only GitHub repo and that code verification requires the sibling source repos.

## Module 1 - Big Picture Of The Server

### Show

- [00-Start-Here-Index.pptx](presentation/UNanofabTools/flaskserver/slides/00-Start-Here-Index.pptx)
- [01-Server-Overview.pptx](presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx)
- [presentation/UNanofabTools/flaskserver/README.md](presentation/UNanofabTools/flaskserver/README.md)
- [documentation/UNanofabTools/flaskserver/01-architecture.md](documentation/UNanofabTools/flaskserver/01-architecture.md)

### Presenter Intent

Give the maintainer the mental model before showing implementation details. They need to understand that the website is the visible part of a broader data system.

### Talk Track

Start with the user-facing story:

- Users open a cleanroom website.
- They log in.
- They see tasks, machine pages, logs, chemical inventory, and sensor views.
- Some data is entered by people.
- Some data is uploaded by devices.
- Some data is pulled from CORES by the downloader.
- Some data is stored in databases.
- Some data is stored as CSV/log files.

Then expand the system:

- Browser traffic comes through nginx and TLS.
- nginx proxies Flask on loopback.
- Flask routes requests through blueprints.
- Auth and sessions protect user-facing pages.
- Device endpoints are intentionally different from normal browser routes.
- SQLite handles several smaller app databases.
- PostgreSQL handles chemical inventory.
- `HSCDATA/`, `LogData/`, and `uploads/` matter for operational durability.

### Screen Choreography

While showing the overview deck, pause on:

- "What this server does."
- "Who and what uses it."
- "How it fits together."
- "Where each kind of data lives."
- "Why split nginx and Flask."

After those slides, switch to the architecture doc and point to the topology and persistence map. Do not read the whole doc on screen; use it to show that the slide story has a technical reference behind it.

### Ask The Maintainer

- What does `nfhistory` do for a normal cleanroom user?
- What does it do for sensors or machine data?
- Which requests come from people?
- Which requests come from devices?
- Where does nginx fit?
- Where does Flask fit?
- Which data stores are databases?
- Which data stores are file trees?

### Do Not Move On Until

The maintainer can draw the system as:

```text
browser/devices/CORES/tool PCs
  -> nfhistory
  -> nginx/TLS
  -> Flask
  -> SQLite/PostgreSQL/HSCDATA/LogData/uploads
```

## Module 2 - What Is Actually Running On `nfhistory`

### Show

- [Live-Server.pptx](presentation/UNanofabTools/liveserver/slides/Live-Server.pptx)
- [presentation/UNanofabTools/liveserver/README.md](presentation/UNanofabTools/liveserver/README.md)
- [documentation/UNanofabTools/liveserver/README.md](documentation/UNanofabTools/liveserver/README.md)
- [known-issues/UNanofabTools/liveserver.md](known-issues/UNanofabTools/liveserver.md)

### Presenter Intent

This is where the maintainer learns the difference between intended deployment and live deployment.

### Talk Track

"The production system is not exactly the ideal runbook. The ideal target is supervised services, but the live state is two tmux sessions. That is not just trivia. It determines how you inspect, restart, monitor, and recover the system."

Drive home:

- `nfhistory` is the live server.
- Debian 13, kernel 6.12, IP `155.98.11.8`.
- nginx handles public HTTPS.
- Flask listens behind nginx.
- PostgreSQL is local.
- TLS is Let's Encrypt and auto-renewed.
- Backups are handled off-box by University IT.
- Flask and HSCDownloader are not under systemd yet.
- University IT owns root, VM-level backup, base patching, and root SSH.
- Nanofab owns the app, downloader, chem DB use, and `/home/phelan/`.

### Screen Choreography

Show the Live Server deck slowly. Pause on:

- "The server in 30 seconds."
- "What's listening on the network."
- "Surprise: chem PostgreSQL is local."
- "Auto-managed vs. not."
- "Backups: handled by IT."
- "Root SSH = IT's access path."
- "Install lives at `~/server/UNanofabTools`."
- "Top recommendations."

Then open the live-server developer doc and show the findings list at the top. Explain that those findings intentionally mirror the known-issues file.

### Optional Live Demo

If live access is available and safe:

```sh
hostname
uname -a
tmux ls
ss -tulpn
systemctl status nginx
systemctl status postgresql@17-main
```

Do not expose secret files. If showing `.env`, show key names only.

### Ask The Maintainer

- What is healthy about the live server?
- What is the top reliability weakness?
- Why is local PostgreSQL important?
- What does University IT own?
- What does Nanofab own?
- What should not be changed by Nanofab?
- What is the real production install path?

### Do Not Move On Until

The maintainer can say: "The app and downloader currently live in tmux. Moving them to systemd is a Nanofab-owned reliability improvement. Root and VM-level backup are IT-owned."

## Module 3 - Server Access And Safe Inspection

### Show

- [Server-Access.pptx](presentation/UNanofabTools/serveraccess/slides/Server-Access.pptx)
- [presentation/UNanofabTools/serveraccess/README.md](presentation/UNanofabTools/serveraccess/README.md)
- [documentation/UNanofabTools/serveraccess/README.md](documentation/UNanofabTools/serveraccess/README.md)
- [known-issues/UNanofabTools/serveraccess.md](known-issues/UNanofabTools/serveraccess.md)

### Presenter Intent

This is one of the most important sections. A maintainer who knows the architecture but kills the tmux session during inspection can take the system down.

### Talk Track

"Access is two-hop: laptop to CADE, then CADE to `nfhistory`. On `nfhistory`, the Nanofab maintainer is using the shared UNIX account `phelan`. That is not ideal as a general security model, but it is the current IT boundary. Nanofab cannot create UNIX users."

"The two live processes are in tmux. You can inspect them, but you must detach safely."

### Screen Choreography

Pause hard on these slides:

- "What you need before your first login."
- "Hop 1."
- "Hop 2."
- "On the server: two tmux sessions."
- "Leaving WITHOUT killing the program."
- "The safe inspection ritual."
- "Recovery: re-create flaskserver."
- "Recovery: re-create downloader."
- "Who does what."
- "What goes through IT instead."

Read the detach slide twice.

### Live Demo

If safe:

1. SSH through CADE.
2. Run `tmux ls`.
3. Attach to `flaskserver`.
4. Look only.
5. Detach with `Ctrl-b d`.
6. Attach to `downloader`.
7. Look only.
8. Detach with `Ctrl-b d`.

Then show the survey command:

```sh
bash ~/survey_nfhistory.sh | tee /tmp/nfhistory_survey_$(date +%F).txt
```

If you do not run it live, show where snapshots live:

- [documentation/UNanofabTools/liveserver/snapshots/](documentation/UNanofabTools/liveserver/snapshots/)

### Ask The Maintainer

- What are the two SSH hops?
- Why is `User phelan` in the config?
- What two tmux sessions matter?
- How do you inspect without killing a program?
- What exactly does `Ctrl-b d` do?
- What should you never press casually in a live service pane?
- Which access changes require IT?

### Do Not Move On Until

The maintainer can recite:

```text
attach, look, detach with Ctrl-b d, do not exit, do not Ctrl-c
```

## Module 4 - How The Flask App Starts

### Show

- [02-How-It-Starts.pptx](presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx)
- [presentation/UNanofabTools/flaskserver/02-How-It-Starts.md](presentation/UNanofabTools/flaskserver/02-How-It-Starts.md)
- [documentation/UNanofabTools/flaskserver/01-architecture.md](documentation/UNanofabTools/flaskserver/01-architecture.md)
- [documentation/UNanofabTools/flaskserver/02-getting-started.md](documentation/UNanofabTools/flaskserver/02-getting-started.md)

### Presenter Intent

Teach the boot sequence so the maintainer knows where startup failures come from.

### Talk Track

"The app starts from `run.py`. That file decides which config to use, creates the Flask app, and runs it. Inside the app factory, extensions initialize, paths get configured, blueprints register, and the databases are made available."

"Blueprints are the app's feature modules. If a page exists, it is probably inside one of the blueprints."

### Source Demo

Open the source repo and show:

```text
../UNanofabTools/run.py
../UNanofabTools/app/__init__.py
../UNanofabTools/app/blueprints/
```

Run:

```sh
rg -n "def create_app|register_blueprint|app.run|FLASK_ENV" ../UNanofabTools
```

### Ask The Maintainer

- What file starts the app?
- What is the app factory?
- What is a blueprint?
- Why is startup different in development vs production?
- What does `db.create_all()` imply about migrations?
- Where would you look if a route existed in code but never responded?

### Do Not Move On Until

The maintainer can explain `run.py -> create_app -> config -> extensions -> blueprints -> routes`.

## Module 5 - Configuration And Local Development

### Show

- [03-Configuration.pptx](presentation/UNanofabTools/flaskserver/slides/03-Configuration.pptx)
- [presentation/UNanofabTools/flaskserver/03-Configuration.md](presentation/UNanofabTools/flaskserver/03-Configuration.md)
- [documentation/UNanofabTools/flaskserver/03-configuration-reference.md](documentation/UNanofabTools/flaskserver/03-configuration-reference.md)
- [documentation/UNanofabTools/flaskserver/02-getting-started.md](documentation/UNanofabTools/flaskserver/02-getting-started.md)

### Presenter Intent

Make configuration concrete. The maintainer should know which settings are safe defaults, which are production secrets, and which paths matter.

### Talk Track

"Configuration is not decoration. It decides database paths, session behavior, Duo behavior, upload size, data directories, and whether the app behaves like development or production."

"The live app uses an `.env` file. Do not commit secret values. Do document key names."

### Source Demo

Show:

```text
../UNanofabTools/config/config.py
documentation/UNanofabTools/flaskserver/03-configuration-reference.md
```

Run:

```sh
rg -n "os.getenv|CHEM_|DUO|SECRET|SESSION|SQLALCHEMY|UPLOAD|DATA" ../UNanofabTools/config
```

Then compare with the docs.

### Explain These Carefully

- `SECRET_KEY` must be strong in production.
- Duo values are required when Duo is enabled.
- Chem DB settings point to local PostgreSQL on the live VM.
- SQLite paths resolve relative to `instance/`.
- `HSCDATA`, `LogData`, and `uploads` are operational data trees.
- Development defaults are not a security model.

### Ask The Maintainer

- Which env vars are secrets?
- Which env vars point to databases?
- Which config values affect cookie/session behavior?
- What breaks if `CHEM_*` values are wrong?
- What should be documented from `.env` and what should never be shown?

### Do Not Move On Until

The maintainer can identify production-sensitive config without seeing secret values.

## Module 6 - Authentication, Authorization, And Admin

### Show

- [04-Authentication-and-Login.pptx](presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx)
- [05-Admin-Panel.pptx](presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx)
- [presentation/UNanofabTools/flaskserver/04-Authentication-and-Login.md](presentation/UNanofabTools/flaskserver/04-Authentication-and-Login.md)
- [presentation/UNanofabTools/flaskserver/05-Admin-Panel.md](presentation/UNanofabTools/flaskserver/05-Admin-Panel.md)
- [documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md](documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md)

### Presenter Intent

Make the maintainer understand who can log in, how login is verified, how sessions work, where Duo fits, and how admin powers are guarded.

### Talk Track

"Authentication answers who you are. Authorization answers what you are allowed to do. The app uses both."

"Passwords are hashed, not stored as plaintext. Sessions let the app remember the user. Duo adds a second factor. The admin panel has server-side checks, not just hidden buttons."

### Source Demo

Show:

```text
../UNanofabTools/app/blueprints/auth.py
../UNanofabTools/app/blueprints/admin.py
../UNanofabTools/app/services/auth_service.py
../UNanofabTools/app/services/admin_service.py
```

Run:

```sh
rg -n "login_required|admin_required|session|duo|hash|verify|toggle|deleteUser" ../UNanofabTools/app
```

### Explain These Risks

- Admin checks must be enforced server-side.
- Password reset flows are sensitive.
- Duo settings are production-sensitive.
- Session lifetime and deletion behavior matter.
- Any admin route drift should be reflected in endpoint docs.

### Ask The Maintainer

- What is the difference between `login_required` and `admin_required`?
- Where is the first admin bootstrapped or assigned?
- How does the app avoid storing plaintext passwords?
- What does Duo add?
- What would you inspect if admin buttons disappeared but routes still worked?
- What would you inspect if login worked locally but not in production?

### Do Not Move On Until

The maintainer can identify the login route, admin route, service-layer auth helpers, and authorization matrix.

## Module 7 - Tasks And Everyday User Workflows

### Show

- [06-Tasks.pptx](presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx)
- [presentation/UNanofabTools/flaskserver/06-Tasks.md](presentation/UNanofabTools/flaskserver/06-Tasks.md)
- [documentation/UNanofabTools/flaskserver/05-http-api-reference.md](documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- [documentation/UNanofabTools/flaskserver/06-service-layer-reference.md](documentation/UNanofabTools/flaskserver/06-service-layer-reference.md)

### Presenter Intent

Use the task tracker as the first example of a normal user-facing Flask feature.

### Talk Track

"Tasks are a good first feature to understand because they use routes, templates, login checks, SQLite, service helpers, assignment logic, status changes, and file uploads."

### Source Demo

Show:

```text
../UNanofabTools/app/blueprints/tasks.py
../UNanofabTools/app/services/task_service.py
../UNanofabTools/app/templates/
```

Run:

```sh
rg -n "tasks|createtasks|changestatus|claimTask|uploadtaskfile|TaskAssignee|TaskFile" ../UNanofabTools/app
```

### Ask The Maintainer

- Which database stores tasks?
- What routes create or update tasks?
- What route uploads task files?
- What protects task pages?
- Why do assignees live separately from tasks?
- What would you check if task attachments stopped working?

### Do Not Move On Until

The maintainer can trace one task from creation to database row to dashboard display.

## Module 8 - Machines, Logs, And The File-Based Data Model

### Show

- [07-Machines-and-Logs.pptx](presentation/UNanofabTools/flaskserver/slides/07-Machines-and-Logs.pptx)
- [presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md](presentation/UNanofabTools/flaskserver/07-Machines-and-Logs.md)
- [documentation/UNanofabTools/flaskserver/05-http-api-reference.md](documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- [documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md](documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md)

### Presenter Intent

Make the maintainer understand that not all important data is in a database.

### Talk Track

"Machine pages are powered by a mixture of code routes and file trees. Some files come from HSCDownloader. Some come from machine PCs. Some are logs. These directories are not optional; they are part of the production data model."

### Source Demo

Show:

```text
../UNanofabTools/app/blueprints/machines.py
../UNanofabTools/app/services/data_service.py
../UNanofabTools/HSCDATA/
../UNanofabTools/LogData/
```

Run:

```sh
rg -n "HSCDATA|LogData|download|graph|render_machine_data|render_log_files|submitALDData" ../UNanofabTools/app
```

### Explain These Carefully

- Safe downloads require path checks.
- Log graphing depends on file format assumptions.
- `HSCDATA` comes from HSCDownloader.
- `LogData` often comes from machine-control-PC transfers.
- File trees must be backed up, not just databases.

### Ask The Maintainer

- Which directories feed machine pages?
- What is the difference between `HSCDATA` and `LogData`?
- What makes file download routes dangerous if implemented carelessly?
- What would you check if a machine page is stale?
- What would you check if graphing fails for one log file?

### Do Not Move On Until

The maintainer can name the machine data path from external producer to web page.

## Module 9 - Device APIs And Sensor Data

### Show

- [08-IoT-API-Endpoints.pptx](presentation/UNanofabTools/flaskserver/slides/08-IoT-API-Endpoints.pptx)
- [12-Consumers-NanofabToolkit.pptx](presentation/UNanofabTools/flaskserver/slides/12-Consumers-NanofabToolkit.pptx)
- [presentation/UNanofabTools/flaskserver/08-IoT-API-Endpoints.md](presentation/UNanofabTools/flaskserver/08-IoT-API-Endpoints.md)
- [presentation/UNanofabTools/flaskserver/12-Consumers-NanofabToolkit.md](presentation/UNanofabTools/flaskserver/12-Consumers-NanofabToolkit.md)
- [documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md](documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md)

### Presenter Intent

Make the maintainer understand device endpoints as a different trust model from normal user pages.

### Talk Track

"The app has routes for devices. They are not the same as browser pages. A Raspberry Pi or other device posts readings. The server validates shape, writes files or database rows, and returns simple responses."

"The unauthenticated device route model is an honest security trade-off. It should be understood, documented, and hardened deliberately."

### Source Demo

Show:

```text
../UNanofabTools/app/blueprints/api.py
../NanofabToolkit/PicoHelperTools/
../NanofabToolkit/ParticleSensor/
```

Run:

```sh
rg -n "particle-data|sensor-data|env-data|sdsanalog|denton18pump|POST|GET" ../UNanofabTools/app/blueprints/api.py
rg -n "particle-data|sensor-data|env-data|requests|urequests|room|sensor" ../NanofabToolkit/PicoHelperTools ../NanofabToolkit/ParticleSensor
```

### Explain These Data Contracts

- Particle readings.
- Environmental readings.
- Combined sensor readings.
- Parylene analog batches.
- Denton 18 pump logs.
- Desktop apps reading back data.

### Ask The Maintainer

- Which endpoints accept device data?
- Which endpoints are unauthenticated?
- What does a particle reading contain?
- Where does particle data get written?
- Which source repo is canonical for Pico firmware?
- Which source repo is canonical for the ParticleSensor desktop app?
- What should be hardened first if device writes become a concern?

### Do Not Move On Until

The maintainer can trace a Pico reading from firmware to Flask route to storage to viewer.

## Module 10 - Chemical Inventory And PostgreSQL

### Show

- [09-Chemical-Inventory.pptx](presentation/UNanofabTools/flaskserver/slides/09-Chemical-Inventory.pptx)
- [10-Database-Models.pptx](presentation/UNanofabTools/flaskserver/slides/10-Database-Models.pptx)
- [presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md](presentation/UNanofabTools/flaskserver/09-Chemical-Inventory.md)
- [presentation/UNanofabTools/flaskserver/10-Database-Models.md](presentation/UNanofabTools/flaskserver/10-Database-Models.md)
- [documentation/UNanofabTools/flaskserver/04-database-schema.md](documentation/UNanofabTools/flaskserver/04-database-schema.md)
- [known-issues/UNanofabTools/flaskserver.md](known-issues/UNanofabTools/flaskserver.md)

### Presenter Intent

This is one of the most important modules. The chem inventory is the biggest feature, uses PostgreSQL instead of SQLite, and has known schema/security issues that a maintainer must understand.

### Talk Track

"The chemical inventory is not just another page. It has its own PostgreSQL schema, barcode sequence, containers, items, rooms, cabinets, scan/audit tables, reports, and transaction history."

"The live chem database is local on `nfhistory`. Older external-database wording was corrected. If you see external-Postgres assumptions in future docs, treat that as drift."

### Source Demo

Show:

```text
../UNanofabTools/app/blueprints/chem_inventory.py
../UNanofabTools/app/services/chem_service.py
../UNanofabTools/chem_schema.sql
../UNanofabTools/chem_schema_migration_v2.sql
documentation/UNanofabTools/flaskserver/04-database-schema.md
```

Run:

```sh
rg -n "CHEM_|create_engine|postgres|containers|items|rooms|transactions|barcode|scan|report" ../UNanofabTools
```

### Live Demo If Safe

Show service existence and listener only:

```sh
systemctl status postgresql@17-main
ss -tulpn | rg "5432|postgres"
```

Do not show database passwords.

### Explain These Risks

- Committed schema can drift from live schema.
- `init_chem_db.py` is not a complete source of truth.
- Chem write routes need careful auth review.
- Database backups matter separately from source code.
- Room/cabinet/location schema assumptions affect inventory operations.

### Ask The Maintainer

- Why is chem PostgreSQL and not SQLite?
- Where does PostgreSQL run in production?
- Which env vars point Flask to it?
- Which files define or migrate schema?
- What is schema drift?
- What should be backed up?
- Which chem routes write data?
- Which known issues matter most for chem?

### Do Not Move On Until

The maintainer can explain the chem inventory's data model and why schema drift is a priority.

## Module 11 - Request Lifecycle And Endpoint Reference

### Show

- [13-Request-Lifecycle-Walkthrough.pptx](presentation/UNanofabTools/flaskserver/slides/13-Request-Lifecycle-Walkthrough.pptx)
- [15-Endpoint-Reference.pptx](presentation/UNanofabTools/flaskserver/slides/15-Endpoint-Reference.pptx)
- [presentation/UNanofabTools/flaskserver/13-Request-Lifecycle-Walkthrough.md](presentation/UNanofabTools/flaskserver/13-Request-Lifecycle-Walkthrough.md)
- [presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md](presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md)
- [documentation/UNanofabTools/flaskserver/05-http-api-reference.md](documentation/UNanofabTools/flaskserver/05-http-api-reference.md)

### Presenter Intent

Tie together everything they have learned so far. This is where the maintainer moves from "I know the pieces" to "I can trace behavior."

### Talk Track

"Every request has a life: client, DNS/TLS/nginx, Flask routing, decorators, handler, service/database/filesystem, response. Human browser requests and device POSTs differ in auth and payload, but they still move through the same basic pipeline."

### Source Demo

Run:

```sh
rg -n "^[[:space:]]*@[a-zA-Z_]+\\.route\\(|^[[:space:]]*@app\\.route\\(" ../UNanofabTools/app
```

Then compare to:

- [documentation/UNanofabTools/flaskserver/05-http-api-reference.md](documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- [presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md](presentation/UNanofabTools/flaskserver/15-Endpoint-Reference.md)

### Practice Exercise

Pick three routes:

- One login-protected browser route.
- One admin route.
- One unauthenticated device route.

For each, have the maintainer identify:

- URL.
- method.
- blueprint.
- auth requirement.
- handler function.
- service function if any.
- data store touched.
- response.
- known risks.

### Ask The Maintainer

- How does a browser request differ from a device POST?
- Where does nginx stop and Flask begin?
- What do decorators do?
- Which endpoint families are highest risk?
- How would you detect route docs falling out of sync with code?

### Do Not Move On Until

The maintainer can audit one endpoint from docs to source to data side effects.

## Module 12 - Security Model

### Show

- [14-Security-Model.pptx](presentation/UNanofabTools/flaskserver/slides/14-Security-Model.pptx)
- [presentation/UNanofabTools/flaskserver/14-Security-Model.md](presentation/UNanofabTools/flaskserver/14-Security-Model.md)
- [documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md](documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md)
- [known-issues/UNanofabTools/README.md](known-issues/UNanofabTools/README.md)

### Presenter Intent

Be direct and honest. The future maintainer needs to know what is protected, what is intentionally open, what is historically weak, and what to harden first.

### Talk Track

"Security here is layered, but not perfect. TLS is in place. Login and Duo exist. Admin checks exist. File safety checks exist. But device endpoints and chem write paths need careful attention, and some historical tools had hard-coded secrets."

"Do not hide uncomfortable facts. If a secret was ever hard-coded, assume rotation is needed. If a route writes without auth, treat that as a high-priority review."

### Discuss

- TLS and cert renewal.
- Password hashing.
- Duo.
- Sessions.
- Admin authorization.
- Input validation.
- File path safety.
- Device endpoint trust model.
- Secrets in source.
- Shared `phelan` account.
- IT-owned root path.
- Backup boundary.

### Ask The Maintainer

- Which secrets must never be committed?
- Which routes are deliberately unauthenticated?
- Which writes should be reviewed first?
- Why is shared `phelan` not solved by simply creating UNIX users?
- What is an IT security ticket vs a Nanofab code fix?
- What should be rotated if exposed?

### Do Not Move On Until

The maintainer can name the top security follow-ups without looking.

## Module 13 - HSCDownloader And CORES Data

### Show

- [HSC-Downloader.pptx](presentation/UNanofabTools/hscdownloader/slides/HSC-Downloader.pptx)
- [presentation/UNanofabTools/hscdownloader/README.md](presentation/UNanofabTools/hscdownloader/README.md)
- [documentation/UNanofabTools/hscdownloader/README.md](documentation/UNanofabTools/hscdownloader/README.md)
- [known-issues/UNanofabTools/hscdownloader.md](known-issues/UNanofabTools/hscdownloader.md)

### Presenter Intent

Teach the data supply line that makes machine pages current.

### Talk Track

"HSCDownloader is the bridge from CORES/n8n data to the CSV files the website reads. If a machine page goes stale, this is one of the first places to inspect."

"The production downloader is not in a separate directory. `HSCDownloader.py` lives next to `run.py` in `/home/phelan/server/UNanofabTools/`."

### Source Demo

Show:

```text
../UNanofabTools/HSCDownloader.py
../UNanofabTools/HSCDATA/
```

Run:

```sh
rg -n "save|CORES|HSCDATA|requests|Bearer|time|schedule|while" ../UNanofabTools/HSCDownloader.py documentation/UNanofabTools/hscdownloader/README.md known-issues/UNanofabTools/hscdownloader.md
```

Do not reveal bearer token values.

### Ask The Maintainer

- What does HSCDownloader write?
- What reads those files?
- Where is it running in production?
- What tmux session owns it?
- What known secret issue exists?
- What would you check if machine data stopped updating?

### Do Not Move On Until

The maintainer can explain CORES to HSCDownloader to `HSCDATA` to machine pages.

## Module 14 - File Transfers From Machine PCs

### Show

- [File-Transfer-Scripts.pptx](presentation/UNanofabTools/filetransfer/slides/File-Transfer-Scripts.pptx)
- [presentation/UNanofabTools/filetransfer/README.md](presentation/UNanofabTools/filetransfer/README.md)
- [documentation/UNanofabTools/filetransfer/README.md](documentation/UNanofabTools/filetransfer/README.md)
- [known-issues/UNanofabTools/filetransfer.md](known-issues/UNanofabTools/filetransfer.md)

### Presenter Intent

Show how machine-control PCs push local logs to the server, and make the personal-account dependency clear.

### Talk Track

"The server does not magically know everything a tool PC logs. Some files have to be copied from machine-control computers. These scripts are the couriers."

"The main operational issue is identity. Transfers depending on a personal account are fragile. A better Nanofab-side fix is a purpose-bound key into `phelan`; a cleaner service-account model requires IT."

### Source Demo

Run:

```sh
rg -n "scp|ssh|phelan|CADE|LogData|mutex|powershell|bat" ../UNanofabTools documentation/UNanofabTools/filetransfer known-issues/UNanofabTools/filetransfer.md
```

### Ask The Maintainer

- What does each file-transfer script move?
- Where does it put data?
- Why is a personal account dependency risky?
- What can Nanofab fix without IT?
- What would require IT?
- How would you test a transfer without overwriting production data?

### Do Not Move On Until

The maintainer can distinguish HSCDownloader data from tool-PC file-transfer data.

## Module 15 - Pico Firmware And Particle Sensor Ecosystem

### Show

- [PicoHelperTools.pptx](presentation/NanofabToolkit/PicoHelperTools/slides/PicoHelperTools.pptx)
- [ParticleSensor.pptx](presentation/NanofabToolkit/ParticleSensor/slides/ParticleSensor.pptx)
- [Pico-Firmware.pptx](presentation/UNanofabTools/picofirmware/slides/Pico-Firmware.pptx)
- [Particle-PC-Tools.pptx](presentation/UNanofabTools/particlepctools/slides/Particle-PC-Tools.pptx)
- [documentation/NanofabToolkit/PicoHelperTools/README.md](documentation/NanofabToolkit/PicoHelperTools/README.md)
- [documentation/NanofabToolkit/ParticleSensor/README.md](documentation/NanofabToolkit/ParticleSensor/README.md)
- [known-issues/UNanofabTools/picofirmware.md](known-issues/UNanofabTools/picofirmware.md)
- [known-issues/UNanofabTools/particlepctools.md](known-issues/UNanofabTools/particlepctools.md)
- [known-issues/NanofabToolkit/ParticleSensor.md](known-issues/NanofabToolkit/ParticleSensor.md)

### Presenter Intent

Make the canonical-copy rule unmissable.

### Talk Track

"For Pico firmware and ParticleSensor, `NanofabToolkit` is canonical. The copies in `UNanofabTools` are older or historical. This matters because a future maintainer could waste time patching the wrong repo."

"The Pico devices produce data. The Flask app receives it. ParticleSensor reads and visualizes it."

### Source Demo

Show:

```text
../NanofabToolkit/PicoHelperTools/
../NanofabToolkit/ParticleSensor/
../UNanofabTools/picofirmware/
../UNanofabTools/particlepctools/
```

Run:

```sh
rg -n "room|sensor|particle-data|sensor-data|wifi|password|requests|urequests" ../NanofabToolkit/PicoHelperTools ../NanofabToolkit/ParticleSensor ../UNanofabTools
```

Do not show real WiFi passwords.

### Ask The Maintainer

- Which repo is canonical for Pico firmware?
- Which repo is canonical for ParticleSensor?
- What data does a Pico send?
- Which Flask endpoints receive it?
- What historical secret issue exists in firmware?
- What is the risk of a test generator targeting production?

### Do Not Move On Until

The maintainer can say which repo to modify and which repo to treat as historical.

## Module 16 - Other Desktop And Data Tools

### Show

- [ParalyneReader.pptx](presentation/NanofabToolkit/ParalyneReader/slides/ParalyneReader.pptx)
- [DAT-Tools.pptx](presentation/UNanofabTools/dattools/slides/DAT-Tools.pptx)
- [DentonDecoder.pptx](presentation/NanofabToolkit/DentonDecoder/slides/DentonDecoder.pptx)
- [ALDPeakCounter.pptx](presentation/NanofabToolkit/ALDPeakCounter/slides/ALDPeakCounter.pptx)
- [PreciousMetalReader.pptx](presentation/NanofabToolkit/PreciousMetalReader/slides/PreciousMetalReader.pptx)
- [Utilities.pptx](presentation/UNanofabTools/utilities/slides/Utilities.pptx)
- the matching developer READMEs under `documentation/`.

### Presenter Intent

Give enough depth that the maintainer knows what each tool does, where it lives, what data it expects, and whether it affects the live website.

### Talk Track

"These tools are smaller, but they matter because they encode lab-specific workflows. The maintainer does not need to rewrite them today, but they must know which are live dependencies, which are user conveniences, and which have maintenance risks."

### Tool-By-Tool Emphasis

ParalyneReader:

- Desktop review of Parylene analog data.
- Talks to server-side data endpoints.
- Uses background downloads to keep UI responsive.
- Smoothing, normalization, and alignment are user-facing behavior.

DAT Tools:

- `DATfixer` and `DATgrapher` are Denton 635 helpers.
- They are not the same as DentonDecoder.
- Binary `.DAT` parsing by magic bytes is a maintenance risk.

DentonDecoder:

- Charts Denton `.dat` or CSV logs against time.
- It is a broader charting tool, not the same workflow as DATfixer/DATgrapher.

ALDPeakCounter:

- Counts ALD cycles.
- Supports time alignment across runs.
- Peak detection parameters matter.

PreciousMetalReader:

- Pulls monthly precious-metal usage from CORES.
- Similar external-token concerns apply conceptually to HSCDownloader.

Utilities:

- Helper scripts are uneven.
- `init_chem_db.py` is not a complete chem database solution.
- Some utilities are developer helpers, not production tools.

### Ask The Maintainer

- Which tools talk to `nfhistory`?
- Which tools are standalone?
- Which tools consume CORES?
- Which tools consume local log files?
- Which tools are user-facing conveniences vs live infrastructure?
- Which utility would you not trust as a complete production setup?

### Do Not Move On Until

The maintainer can group every tool by purpose, source repo, input, output, and operational importance.

## Module 17 - Legacy Server

### Show

- [HSC-Displayer-Server-Legacy.pptx](presentation/UNanofabTools/hscdisplayerserver/slides/HSC-Displayer-Server-Legacy.pptx)
- [presentation/UNanofabTools/hscdisplayerserver/README.md](presentation/UNanofabTools/hscdisplayerserver/README.md)
- [documentation/UNanofabTools/hscdisplayerserver/README.md](documentation/UNanofabTools/hscdisplayerserver/README.md)
- [documentation/UNanofabTools/hscdisplayerserver/ROUTES.md](documentation/UNanofabTools/hscdisplayerserver/ROUTES.md)
- [known-issues/UNanofabTools/hscdisplayerserver.md](known-issues/UNanofabTools/hscdisplayerserver.md)

### Presenter Intent

Prevent future maintainers from mistaking the deprecated server for the active architecture.

### Talk Track

"This is documented so you recognize it, not because it should be improved. It is the older monolithic predecessor. The directive is to retire it in favor of the Flask app unless live evidence proves it is still serving something important."

### Ask The Maintainer

- Why is this documented?
- Why should it not be the first maintenance target?
- How would you confirm whether it is active?
- What should happen if it is still running?

### Do Not Move On Until

The maintainer can identify the legacy server and avoid patching it by accident.

## Module 18 - Known Issues And Maintenance Triage

### Show

- [known-issues/UNanofabTools/README.md](known-issues/UNanofabTools/README.md)
- [known-issues/UNanofabTools/liveserver.md](known-issues/UNanofabTools/liveserver.md)
- [known-issues/UNanofabTools/serveraccess.md](known-issues/UNanofabTools/serveraccess.md)
- [known-issues/UNanofabTools/flaskserver.md](known-issues/UNanofabTools/flaskserver.md)
- [known-issues/NanofabToolkit/README.md](known-issues/NanofabToolkit/README.md)

Then open every remaining known-issues file briefly.

### Presenter Intent

Turn knowledge into action. The maintainer should leave with a priority model, not just a list of problems.

### Talk Track

"The known-issues tree is not an apology. It is the maintenance queue. It separates bugs, tech debt, security exposure, reliability gaps, and IT-bound work."

"The important split is not just high/medium/low. It is Nanofab-actionable vs IT-ticket."

### Triage Framework

Fix first:

1. Exposed secrets and required rotations.
2. Unauthenticated or weakly protected write routes.
3. Data-loss or backup uncertainty.
4. Production reliability issues like tmux-only supervision.
5. Chem schema drift and incomplete migrations.
6. Personal-account dependencies.
7. Doc/code drift that could cause bad operations.
8. Deprecated-code cleanup.
9. Cosmetic cleanup.

### Ask The Maintainer

- What are the top three Nanofab-owned fixes?
- What are the top three IT tickets?
- Which known issue would you handle first and why?
- Which issue looks scary but is actually IT-owned?
- Which issue is low priority because the code is deprecated?
- What evidence is needed before closing a known issue?

### Do Not Move On Until

The maintainer can produce a 7-day and 30-day maintenance plan.

## Module 19 - Path D Audit Practice

### Show

- [PATH-D-DEEP-DIVE.md](PATH-D-DEEP-DIVE.md)
- [EVALUATE.md](EVALUATE.md)
- [audit.sh](audit.sh)

### Presenter Intent

This section converts the presentation from listening into ownership.

### Exercise 1 - Run The Audit

Run:

```sh
bash audit.sh
```

Have the maintainer read:

- context
- coverage matrix
- stale-string checks
- broken-link check
- source vs docs spot-checks

Explain which warnings are expected context and which would be real problems.

### Exercise 2 - Verify One Route

Pick one route from [documentation/UNanofabTools/flaskserver/05-http-api-reference.md](documentation/UNanofabTools/flaskserver/05-http-api-reference.md).

Have the maintainer find it in source:

```sh
rg -n "<route-name-or-path>" ../UNanofabTools/app
```

They must identify:

- code file
- route decorator
- methods
- auth
- handler function
- data touched
- doc match or drift

### Exercise 3 - Verify One Known Issue

Pick one known issue. Have the maintainer prove whether it still exists by checking:

- source code
- docs
- live server if applicable
- issue file

Then ask whether to keep, edit, close, or escalate the issue.

### Exercise 4 - Draft A Maintenance Plan

Have the maintainer write:

```md
## Next 7 Days

## Next 30 Days

## Next Quarter

## IT Tickets

## Evidence Still Missing
```

### Do Not Move On Until

The maintainer has performed at least one real doc/source verification without your step-by-step help.

## Module 20 - Operational Scenarios

### Presenter Intent

Make the maintainer practice incident thinking before they have a real incident.

### Scenario A - Website Is Down

Ask them to talk through:

- Is nginx running?
- Is TLS working?
- Is Flask listening on loopback?
- Is `flaskserver` tmux alive?
- Is disk full?
- Are there tracebacks?
- Did config or venv change?
- How do you restart safely?

### Scenario B - Machine Data Is Stale

Ask:

- Is `downloader` tmux alive?
- Is `HSCDownloader.py` running?
- Are files fresh in `HSCDATA/`?
- Did CORES/n8n/token behavior change?
- Is this downloader, external API, or website display?

### Scenario C - Chem Inventory Fails

Ask:

- Is PostgreSQL running locally?
- Is it listening on `127.0.0.1:5432`?
- Are `CHEM_*` vars present?
- Did schema drift break the route?
- Is this a read path or write path?
- What backups exist?

### Scenario D - A New Maintainer Needs Access

Ask:

- Do they have CADE?
- Where is their public key added?
- How is it labeled?
- How is access revoked?
- What requires IT?

### Scenario E - The VM Is Lost

Ask:

- Who opens the IT ticket?
- What does IT restore?
- How do you verify `/home/phelan/`?
- How do you verify PostgreSQL?
- How do you restart app and downloader?
- What data might be missing?

### Do Not Move On Until

The maintainer can handle each scenario without asking "what would Faith do?"

## Module 21 - Final No-Contact Check

Use this as the closing section. Do not treat it as optional.

### Ask These Questions

Ownership:

- Who owns the VM?
- Who owns root?
- Who owns `/home/phelan/`?
- Who owns app code?
- Who owns off-box backups?
- Who can create UNIX users?

Runtime:

- What serves the public site?
- What does nginx proxy to?
- What process writes `HSCDATA`?
- What are the two required tmux sessions?
- What is the production install path?
- What should replace tmux long term?

Data:

- Which data is SQLite?
- Which data is PostgreSQL?
- Which data is CSV/log files?
- Which data comes from devices?
- Which data comes from CORES?
- Which data must be backed up?

Code:

- Where is the app factory?
- Where are blueprints?
- Where is auth?
- Where is chem DB access?
- Where is HSCDownloader?
- Which repo is canonical for Pico firmware?
- Which repo is canonical for ParticleSensor?
- Which code is deprecated?

Security:

- Where should secrets live?
- Which secrets were historically hard-coded?
- Which routes are unauthenticated?
- Which writes are highest-risk?
- What is Nanofab-owned vs IT-owned?

Maintenance:

- What are the first three fixes?
- What are the first three IT tickets?
- How do you run the documentation audit?
- How do you close a known issue?
- How do you update the live-server snapshot?

### Final Statement To Make

"If you can answer these from the docs, source, and live state, then you do not need me. If you cannot, we write down the missing fact before this handoff ends."

## What To Leave With The Maintainer

Leave them with:

- This documentation repo.
- The `super-in-depth` branch.
- [START-HERE.md](START-HERE.md).
- [PATH-D-DEEP-DIVE.md](PATH-D-DEEP-DIVE.md).
- This presenter guide.
- Current source repo locations and commits.
- Current live-server survey snapshot.
- Their access status and revocation procedure.
- A current known-issues tree.
- A 7-day, 30-day, and quarterly maintenance plan.
- A list of open IT tickets or IT questions.

## If You Run Out Of Time

Do not skip these:

1. Live server boundary and tmux safety.
2. Source repo locations and canonical-copy rule.
3. Flask startup/config/auth basics.
4. Chem inventory and local PostgreSQL.
5. HSCDownloader and `HSCDATA`.
6. Device endpoints and sensor data.
7. Known issues and top priorities.
8. No-contact exit check.

If there is truly not enough time, assign the remaining decks as homework and schedule a follow-up where the maintainer explains them back.

## Presenter Checklist

Before the handoff:

- Confirm branch and commit.
- Confirm source repos are available.
- Confirm live access or document why it is unavailable.
- Confirm slides open.
- Confirm no secret files are projected.
- Run `bash audit.sh`.

During the handoff:

- Show slides.
- Open matching docs.
- Open source only when it proves the point.
- Ask the maintainer to explain back.
- Record every missing fact.
- Separate Nanofab tasks from IT tickets.

After the handoff:

- Update docs for any missing context.
- Update known issues for new findings.
- Commit and push documentation changes.
- Send the maintainer the final branch and commit.
- Confirm they can access the repo without you.

## Closing Principle

The goal is not for the future maintainer to remember every line. The goal is for them to know where truth lives, how to verify it, what is safe to change, what is not theirs to change, and how to turn uncertainty into documented evidence.
