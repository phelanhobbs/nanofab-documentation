# Minimum Acceptable Full Path E - Module 01: Big Picture Of The Server

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-01-big-picture.md

# Module 1 - Big Picture Of The Server

## Goal

The maintainer can describe the whole system in plain English before seeing implementation detail: who uses it, what data enters it, what data leaves it, where it runs, and what the major ownership boundaries are.

## Required Screen

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/00-Start-Here-Index.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/00-Start-Here-Index.pptx)
- `presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx)
- `presentation/UNanofabTools/flaskserver/README.md` (repo path: presentation/UNanofabTools/flaskserver/README.md)
- `documentation/UNanofabTools/flaskserver/01-architecture.md` (repo path: documentation/UNanofabTools/flaskserver/01-architecture.md)

## Verbatim Script

READ ALOUD:

"We start with the big picture because code is easier to understand after the system has a shape. `nfhistory` is not just a Flask app. It is the hub where cleanroom users, machine logs, CORES data, chemical inventory, sensor devices, desktop tools, and University IT-owned infrastructure meet."

SHOW:

Open `00-Start-Here-Index.pptx`.

READ ALOUD:

"This first deck tells us how the slide series is organized. Treat it as the table of contents. We are not trying to memorize every deck. We are learning where truth lives and how each deck maps to a specific part of the documentation and source code."

SHOW:

Open `01-Server-Overview.pptx`.

READ ALOUD:

"The user-facing story is simple. Cleanroom users open a website. They log in. They see tasks, machine pages, machine logs, chemical inventory, and sensor views. Some of that data is entered by people. Some is uploaded by devices. Some is copied from machine-control PCs. Some is pulled from CORES by `HSCDownloader.py`. Some is stored in SQLite. The chemical inventory uses a local PostgreSQL database. A lot of operational data is also stored as file trees: `HSCDATA`, `LogData`, and `uploads`."

"The technical story is that public HTTPS traffic reaches nginx on `nfhistory`. nginx terminates TLS and proxies to the Flask app on loopback. Flask routes requests through blueprints. User-facing routes use login and session checks. Device routes are different: some are intentionally unauthenticated because Pico devices post data to them. The app reads and writes databases and file trees. The result is a website that looks like one application but is actually a coordination point for several data sources."

SHOW:

Open `documentation/UNanofabTools/flaskserver/01-architecture.md` (repo path: documentation/UNanofabTools/flaskserver/01-architecture.md).

READ ALOUD:

"This architecture document is the technical version of the overview deck. The deck is useful for presentation. This document is useful when something breaks. Notice that the docs should name real paths, real modules, real databases, and real dependencies. We want documentation that can be acted on, not just understood abstractly."

## System Map Exercise

DO:

On a whiteboard or notes file, write:

```text
Users and browsers
  -> nginx and TLS on nfhistory
  -> Flask app
  -> blueprints and services
  -> SQLite, local PostgreSQL, HSCDATA, LogData, uploads

CORES and n8n
  -> HSCDownloader.py
  -> HSCDATA
  -> machine pages

Machine control PCs
  -> file-transfer scripts
  -> LogData
  -> machine pages and plots

Pico devices
  -> device API routes
  -> sensor storage and views

NanofabToolkit desktop tools
  -> local files or nfhistory APIs, depending on tool
```

READ ALOUD:

"This map is intentionally plain. A future maintainer should be able to redraw it without the slides. If they cannot, they are not ready to debug the system. Most operational confusion comes from mixing up the website, the live server, the data pipelines, and the desktop tools."

## Ownership Frame

READ ALOUD:

"There are four boundaries we will repeat constantly. First, user-facing website versus background data supply. Second, application code versus live production state. Third, Nanofab-owned operational surface versus University IT-owned infrastructure. Fourth, current canonical code versus historical or deprecated code."

"University IT owns the VM, root, root SSH, OS-level backup, and base patching. Nanofab owns the Flask app, `HSCDownloader.py`, the chemical inventory's use of PostgreSQL, cleanroom data trees, and everything under `/home/phelan/`. The Nanofab admin has `sudo` as `phelan`, not root. Nanofab cannot create UNIX users. That fact matters because it changes what counts as a fix."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What does `nfhistory` do for a normal cleanroom user? | It provides the cleanroom website: login, tasks, machine pages/logs, chemical inventory, and sensor views. |
| What data comes from CORES? | Machine usage data pulled by `HSCDownloader.py` and written into `HSCDATA`. |
| What data comes from machine-control PCs? | Tool log files uploaded by file-transfer scripts into `LogData`. |
| What data comes from Pico devices? | Particle/environment sensor payloads posted to device API routes. |
| What is nginx doing? | It handles public HTTPS/TLS and proxies requests to the Flask app on loopback. |
| What is Flask doing? | It routes browser/device requests through blueprints, auth checks, services, templates, databases, and file trees. |
| Which data stores are databases? | Several SQLite databases plus the local PostgreSQL database used for chemical inventory. |
| Which data stores are file trees? | `HSCDATA`, `LogData`, `uploads`, and sensor/log file directories. |
| What does University IT own? | The VM, root, root SSH, base patching, VM-level/off-box backup, and UNIX account creation. |
| What does Nanofab own? | The Flask app, downloader, application docs, app/data behavior, chem DB usage, data trees, and `/home/phelan/` operational surface. |

REQUIRE:

The maintainer can draw the system map from memory and identify at least one data producer, one web-facing component, one database, one file tree, and one IT-owned component.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot explain the system map without looking. Assign them to reread the server overview README and architecture doc before the next session.


# Expanded Module 01: Big Picture Of The Server

READ ALOUD:

This expanded section revisits Module 01, Big Picture Of The Server. The focus is the system map, data producers, and ownership boundaries. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 01

READ ALOUD:

We are now doing the orientation pass for Big Picture Of The Server. The maintainer should connect this module to the system map, data producers, and ownership boundaries. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx`
- `presentation/UNanofabTools/flaskserver/01-Server-Overview.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention the system map, data producers, and ownership boundaries. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 01

READ ALOUD:

We are now doing the evidence pass for Big Picture Of The Server. The maintainer should connect this module to the system map, data producers, and ownership boundaries. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx`
- `presentation/UNanofabTools/flaskserver/01-Server-Overview.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention the system map, data producers, and ownership boundaries. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/README.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# UNanofabTools Server — A Plain-English Guide

This folder contains a thorough, layperson-friendly explanation of the UNanofabTools **server** code. It is intended to be the source material for a presentation, but it also stands on its own as documentation.

## What's in here

The server has been broken into focused topics so you can read in order, or jump to a specific area. Files are numbered to suggest a reading order, but you don't have to read them in sequence.

| # | File | What it covers |
|---|------|-----------------|
| 01 | `01-Server-Overview.md` | The big picture: what a "server" is, what *this* server does, and who uses it |
| 02 | `02-How-It-Starts.md` | What happens when the server boots: `run.py`, the application factory, blueprints |
| 03 | `03-Configuration.md` | Where the server reads its settings from: `config/config.py`, `.env`, database URLs |
| 04 | `04-Authentication-and-Login.md` | Logging in, signing up, password reset, and the two-factor (Duo) flow |
| 05 | `05-Admin-Panel.md` | Tools for admins: managing users, granting permissions |
| 06 | `06-Tasks.md` | The internal task list (assignments, due dates, file attachments) |
| 07 | `07-Machines-and-Logs.md` | Pages for every machine, plus log-file browsers and downloads |
| 08 | `08-IoT-API-Endpoints.md` | How the Raspberry Pi sensors and shop-floor tools push data to the server |
| 09 | `09-Chemical-Inventory.md` | The chemical inventory system: barcodes, containers, scans, reports |
| 10 | `10-Database-Models.md` | The "tables": Users, Sessions, Tasks, Particle Sensors |
| 11 | `11-Particle-Demo.md` | A small static-file route used for a particle counter demo page |
| 12 | `12-Consumers-NanofabToolkit.md` | How the NanofabToolkit desktop apps and Pico firmware talk to the server |
| 13 | `13-Request-Lifecycle-Walkthrough.md` | What happens, step by step, when a user clicks something or a sensor POSTs data |
| 14 | `14-Security-Model.md` | The security story in one place: sessions, login_required, CORS, Duo, hashing |
| 15 | `15-Endpoint-Reference.md` | A flat list of every URL the server handles, with a one-line description |

## Scope

These documents describe the **modern Flask server** that lives under `app/` plus its supporting files (`run.py`, `config/`, the `.sql` schema).

## How to read the code snippets

Each document quotes pieces of the actual server code. When something is non-obvious, the explanation goes line-by-line; otherwise the explanation describes the function as a whole. Code is shown exactly as it appears in the repository so you can find it back in the source tree.

## A note on terminology

The first document, `01-Server-Overview.md`, defines the key vocabulary: *server*, *client*, *request*, *response*, *endpoint*, *route*, *blueprint*, *database*, *model*, *service*, *template*. If a term in a later document feels unfamiliar, the overview is the place to look first.


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/01-Server-Overview.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 01 — Server Overview

Before we look at any code, let's make sure we're using the same vocabulary, then look at the system from 30,000 feet.

## What is a server, in one sentence?

A **server** is a program that sits running on a computer somewhere, waiting for other programs (called **clients**) to ask it for things over the network. Each "ask" is called a **request**, and the server answers with a **response**.

Almost everything you do on the internet works this way:

- You open `https://nfhistory.nanofab.utah.edu` in a browser → the browser is the client, your laptop sends a request, the server sends back an HTML page as the response, and the browser draws it.
- A Raspberry Pi out in the cleanroom takes a particle-sensor reading and POSTs it as JSON → the Pi is the client, our server is on the receiving end, and it stores the reading in a database.
- The PreciousMetalReader desktop app fetches monthly precious-metal usage records from CORES → the desktop app is the client, the CORES web service is the server.

The server is always-on; the clients come and go.

## What does *this* server do?

UNanofabTools is the Utah Nanofab cleanroom's internal web application. The server has several jobs all bundled into one program:

1. **Account management** — usernames, passwords, two-factor login via Duo, admin permissions.
2. **A task tracker** — staff can assign each other to-do items, attach files, mark things done.
3. **A machine portal** — one web page per tool in the cleanroom (ALD, MOCVD, PECVD, parylene, Denton evaporators, furnaces, dry etchers, etc.) that shows historical data tables, graphs, and downloadable log files.
4. **An IoT data sink** — Raspberry Pi Picos sitting next to machines POST their readings here. The Pico sensors include SPS30 particle counters and DHT22 temperature/humidity sensors. The Parylene tool's Pi streams CSV batches of analog pressure/temperature data. The Denton 18 evaporator's Pi posts vacuum-pressure readings.
5. **A chemical inventory** — every bottle in the lab has a barcode; the server tracks what is where, what's expired, who owns it, and produces printable labels and reports.
6. **A static demo viewer** — a small one-off route that serves a self-contained particle counter demo page for visitors / outreach.

All of those live behind the same login, in the same Flask app, in the same `app/` directory.

## What it looks like from the outside

Here is the layout you'd see if you sketched it on a whiteboard:

```
   ┌──────────────────────────┐
   │ Lab staff in a browser   │ ──── HTTPS ────┐
   └──────────────────────────┘                │
                                               │
   ┌──────────────────────────┐                │     ┌─────────────────────┐
   │ Raspberry Pi Picos       │ ──── HTTPS ────┼──── │  nginx (port 443)   │
   │  (particle, env, parylene│                │     │  handles SSL        │
   │   pressure, denton18)    │                │     └────────┬────────────┘
   └──────────────────────────┘                │              │ proxy to
                                               │              ▼ 127.0.0.1:5000
   ┌──────────────────────────┐                │     ┌─────────────────────┐
   │ NanofabToolkit desktop   │ ──── HTTPS ────┘     │  Flask app          │
   │ apps (ParalyneReader,    │                      │  (this codebase)    │
   │  ParticleSensor GUI,     │                      └────┬──────┬─────────┘
   │  PreciousMetalReader…)   │                           │      │
   └──────────────────────────┘                           ▼      ▼
                                                    ┌────────┐ ┌────────┐
                                                    │ SQLite │ │Postgres│
                                                    │ DBs    │ │chem DB │
                                                    └────────┘ └────────┘
```

A few things to notice:

- **SSL/HTTPS is handled by nginx, not by Flask.** Flask itself listens only on `127.0.0.1:5000` — i.e. only the same machine can reach it directly. Nginx is the front door on the public network at port 443. This is a common, sensible pattern: nginx is very good at TLS and serving static files; Flask is good at running Python application logic; you let each one do its job.
- **There are several databases** — not one. The user accounts, sessions, tasks, and particle-sensor cache each live in their own SQLite file. The chemical inventory is the odd one out: it uses a PostgreSQL database instead, because it needs more advanced features (sequences for barcode generation, complex JOINs, ON CONFLICT upserts). On the production server, that PostgreSQL instance runs on the **same machine** as the Flask app (bound to `127.0.0.1:5432`), so "different database engine" doesn't mean "different computer."
- **The server has two kinds of "users."** There are *humans* using a browser (with logins, sessions, cookies, Duo 2FA, HTML pages) and there are *machines* (Picos, desktop apps) that hit raw JSON endpoints without logging in. Both arrive at the same Flask process; the routing inside Flask sends them to different handlers.

## Vocabulary cheat sheet

You will see these words throughout the rest of the documents. Knowing them now will save you a lookup later.

| Term | What it means here |
|------|---------------------|
| **HTTP request** | A message a client sends to the server. Has a method (GET, POST, etc.), a URL path, headers, and sometimes a body of data. |
| **HTTP response** | What the server sends back. Has a status code (200 = OK, 404 = not found, 500 = server crashed, etc.), headers, and a body. |
| **GET** | "Give me this resource." Used for page loads and data fetches. No body. |
| **POST** | "Here is some new data — accept it." Used for form submissions and pushing sensor readings. Has a body. |
| **Endpoint** / **route** | A specific URL the server is willing to answer, e.g. `/login` or `/particle-data`. In Flask code this looks like `@some_blueprint.route('/login')`. |
| **Blueprint** | Flask's way of grouping related routes. We have one blueprint per major area (auth, tasks, machines, api, chem, etc.). Think of a blueprint as a "chapter" of the server. |
| **Template** | An HTML file with placeholders the server fills in (`{{ variable }}`). Flask uses the Jinja2 templating engine. |
| **Model** | A Python class that describes one table in the database. The library Flask-SQLAlchemy turns Python class definitions into real tables. |
| **Service** | A plain Python module that contains the actual *logic* (talking to the database, hashing passwords, parsing CSVs). Blueprints handle the URL stuff; services handle the work. This separation keeps each file shorter and easier to test. |
| **Session** | A short-lived record that says "user X is currently logged in from browser Y." A cookie in the browser carries an ID that points back at a session row in the database. |
| **Bcrypt** | A password-hashing algorithm. We never store plaintext passwords; we store the bcrypt hash. Bcrypt is intentionally slow, so guessing passwords is expensive. |
| **Duo / 2FA** | A second login factor. After your password is correct, Duo sends a push notification to your phone; you tap "approve" before you actually get in. |
| **CORS** | Cross-Origin Resource Sharing — a browser security rule. We enable CORS so that browser-based tools from other origins can call our JSON endpoints. |
| **JSON** | A simple text format for structured data. The IoT endpoints accept and return JSON. |
| **CSV** | Comma-separated values. Most machine log files are CSV. Many endpoints accept or return CSV. |

If you're new to all of this, the single most useful mental model is: **a server is a function that takes an HTTP request and returns an HTTP response. Everything else is bookkeeping around that function.**

## The directory layout you're about to see

When you look at the repository, the server code is organized like this. Everything else in the repo (`.ps1` PowerShell scripts, the `.zip` archives, machine-specific Python files) is **outside** this guide's scope.

```
UNanofabTools/
├── run.py                  ← starts the server (covered in 02)
├── requirements.txt        ← lists the Python packages we depend on
│
├── config/
│   └── config.py           ← settings, environment variables (covered in 03)
│
├── app/                    ← the actual Flask application
│   ├── __init__.py         ← application factory (covered in 02)
│   ├── models/             ← database table definitions (covered in 10)
│   ├── services/           ← business logic — talks to databases
│   ├── blueprints/         ← URL handlers grouped by topic
│   │   ├── auth.py
│   │   ├── admin.py
│   │   ├── tasks.py
│   │   ├── machines.py
│   │   ├── api.py
│   │   ├── chem_inventory.py
│   │   └── particle_demo_will.py
│   └── templates/          ← HTML files served to users
│
├── chem_schema.sql         ← the PostgreSQL schema for the chemical inventory
└── instance/               ← runtime data: the SQLite DB files live here
```

Read the next document, `02-How-It-Starts.md`, to see how Python turns these files into a running server.


# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/01-architecture.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 01 — Architecture

## 1.1 Overview

UNanofabTools is a monolithic Flask web application that combines six functional domains behind a single process:

1. Authentication & account management (`auth`)
2. User administration (`admin`)
3. Internal task tracking (`tasks`)
4. Machine data & log-file portal (`machines`)
5. IoT/device data ingestion & retrieval (`api`)
6. Chemical inventory management (`chem`)

Plus a small static-file blueprint for a particle-counter demo (`particle_demo_will`).

The application is constructed via the **application-factory pattern** (`app/create_app`) and organized into three layers: **blueprints** (HTTP routing), **services** (business logic and persistence), and **models** (ORM table definitions). Persistence spans four SQLite databases, one PostgreSQL database, and a CSV-file tree on disk.

## 1.2 Technology stack

| Concern | Technology | Version (per `requirements.txt`) |
|---------|-----------|----------------------------------|
| Web framework | Flask | 3.0.0 |
| Auth/session | Flask-Login | 0.6.3 |
| ORM (SQLite) | Flask-SQLAlchemy | 3.1.1 |
| ORM core / engine (PostgreSQL) | SQLAlchemy | 2.0.25 |
| Password hashing | Flask-Bcrypt 1.0.1 / bcrypt 4.1.2 | — |
| Schema migrations | Flask-Migrate (Alembic) | — |
| CORS | Flask-CORS | 4.0.0 |
| 2FA | duo-client | 5.3.0 |
| PostgreSQL driver | psycopg2-binary | 2.9.9 |
| Data processing | pandas | 2.2.0 |
| Excel export | xlsxwriter | 3.2.0 |
| Env-var loading | python-dotenv | 1.0.0 |
| Timezones | pytz | 2024.1 |

Python target: 3.x (the development virtualenvs in the repo use 3.14; any 3.10+ is appropriate). Templating is Jinja2 (bundled with Flask). Front-end charts use Chart.js (loaded client-side in templates).

## 1.3 System topology

```
                          ┌─────────────────────────────┐
   Browsers ─────HTTPS───►│                             │
                          │   nginx  (:443, TLS term.)  │
   Pi devices ───HTTPS───►│   reverse proxy             │
                          │                             │
   Desktop apps ─HTTPS───►└──────────────┬──────────────┘
                                         │ HTTP proxy_pass
                                         ▼ 127.0.0.1:5000
                          ┌─────────────────────────────┐
                          │  Flask process               │
                          │  (python run.py today;       │
                          │   gunicorn is the target)    │
                          └───┬───────────────┬──────────┘
                              │               │ TCP 127.0.0.1:5432
              ┌───────────────┘               └─────────────────┐
              ▼                                                  ▼
   ┌──────────────────────┐                        ┌──────────────────────────┐
   │ SQLite (instance/)   │                        │ PostgreSQL (cheminventory)│
   │  signininfo.db       │                        │  LOCAL on this same VM,   │
   │  sessioninfo.db      │                        │  postgresql@17-main,      │
   │  tasks.db            │                        │  bound to 127.0.0.1:5432  │
   │  particle_sensors.db │                        │  (containers, items,      │
   └──────────────────────┘                        │   rooms, vendors, scans,  │
              │                                    │   cycles, transactions)   │
              │                                    └──────────────────────────┘
              ▼
   ┌──────────────────────────────────────┐
   │ CSV file tree on disk                 │
   │  LogData/  (machine logs, sensor CSV) │
   │  HSCDATA/  (per-machine summary CSV)  │
   │  uploads/  (task file attachments)    │
   └──────────────────────────────────────┘
```

All five datastores live on the same VM. Browsers, devices, and desktop apps reach the box only through nginx on `:443`; nginx forwards to Flask on `127.0.0.1:5000`; Flask talks to the SQLite files directly and to PostgreSQL over `127.0.0.1:5432`. This was confirmed by the live-server survey (`documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md) §3.1 and §10); older diagrams that placed chem PostgreSQL off-box have been corrected.

The diagram shows the live network shape and the intended production process boundary. The current `nfhistory` snapshot still has Flask running as `python run.py` inside tmux, not gunicorn/systemd; see the live-server inventory for that operational gap.

Key invariants:

- **Flask binds to `127.0.0.1:5000`** (see `config/config.py` `HOST`/`PORT`). It is not directly reachable from the network. nginx is the only ingress and performs TLS termination. (A legacy alternative — gunicorn binding `0.0.0.0:443` with `--certfile/--keyfile` — is described in `09-deployment-and-operations.md` but the nginx model is the current intent per `run.py`'s docstring.)
- **Two human-auth tiers, a device tier, and a separate chem SSO tier coexist.** Browser routes are gated by `@login_required` / `@admin_required`; device routes are ungated; the chem module is gated by its own WordPress signed-token session (a `before_request` hook, since 2026-06-25), distinct from Flask-Login (see `05` and `07`).
- **CSV files are an authoritative data store**, not just exports. Particle/environmental history and machine logs live only as CSV; the SQLite `particle_sensor_data` table caches only the latest reading per sensor.

## 1.4 The application-factory pattern

The app is built by `create_app(config_name)` in `app/__init__.py`. There is no module-level `app = Flask(...)`; instead extensions are instantiated at import time and bound to the app inside the factory.

```python
login_manager = LoginManager()
bcrypt = Bcrypt()
migrate = Migrate()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    CORS(app)
    db.init_app(app)
    login_manager.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    ...
    return app
```

Factory responsibilities, in order:

1. Instantiate `Flask(__name__)`.
2. Load config from the selected config class (`app.config.from_object`) and run its `init_app` hook (absolute-path resolution; production logging).
3. Enable CORS for all origins/routes.
4. Bind extensions: SQLAlchemy (`db`), Flask-Login, Bcrypt, Flask-Migrate.
5. Configure Flask-Login (`login_view = 'auth.login'`, messages).
6. Register the `fmtdate` Jinja filter (date formatting for chem templates).
7. Import and register all seven blueprints.
8. Register inline static routes: `/js/<path>`, `/css/<path>`, `/favicon.ico`.
9. Call `db.create_all()` within an app context to create any missing SQLite tables.

Blueprint imports are deferred to inside the factory to avoid circular imports (blueprints import from `app.services` and `app.models`, which import `db` from `app.models`).

The Flask-Login user loader is defined at module scope:

```python
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
```

### Consequence: `db.create_all()` vs. migrations

`db.create_all()` creates missing SQLite tables on every boot but never alters existing ones. Schema changes to SQLite-backed models therefore require an Alembic migration (`flask db migrate` / `flask db upgrade`), not just a model edit. The chem PostgreSQL schema is **not** managed by `db.create_all()` at all — it is provisioned separately (see `04` and `09`).

## 1.5 Layering

```
app/
├── __init__.py          ← application factory + user_loader
├── blueprints/          ← HTTP layer: routing, request parsing, response shaping
│   ├── auth.py
│   ├── admin.py
│   ├── tasks.py
│   ├── machines.py
│   ├── api.py
│   ├── chem_inventory.py
│   ├── particle_demo_will.py
│   └── chem_inventory_remote.py   ← NOT registered; inert (see note)
├── services/            ← business logic + persistence
│   ├── auth_service.py
│   ├── admin_service.py
│   ├── task_service.py        ← uses raw sqlite3 (not SQLAlchemy)
│   ├── data_service.py        ← CSV/pandas processing
│   └── chem_service.py        ← PostgreSQL via SQLAlchemy Core (text())
├── models/              ← ORM table definitions
│   ├── __init__.py            ← db, User, Session, Task, TaskAssignee, TaskFile
│   ├── particle_sensor.py     ← ParticleSensorData
│   ├── chem_inventory.py      ← chem tables (declarative; documentation/parity)
│   ├── session.py, task.py, user.py  ← EMPTY placeholder files
├── templates/           ← Jinja2 templates (top-level + chem/ subdir)
└── static/              ← css/inventory.css, js/{adminActions,graph,taskActions,tablesort}.js
```

**Layering rules observed by the codebase:**

- Blueprints handle HTTP concerns only (parse `request`, call services, return `render_template`/`jsonify`/`redirect`). They do not contain SQL except for two exceptions: `tasks.get_users` and `chem_inventory.container_lookup` execute queries inline.
- Services contain logic and persistence and do not import Flask request/response objects (they may use `current_app` for config and logging).
- Models define tables. Note three inconsistencies worth knowing:
  - `task_service.py` bypasses the ORM and uses the `sqlite3` standard library directly against `tasks.db`. The `Task`/`TaskAssignee`/`TaskFile` models exist but are used only by `db.create_all()` to create the tables.
  - `chem_service.py` uses **SQLAlchemy Core** (`engine`, `text()`), not the ORM session, and not the declarative models in `app/models/chem_inventory.py`. Those model classes are parity/documentation artifacts.
  - `app/models/session.py`, `task.py`, and `user.py` are empty (0 bytes); the real classes live in `app/models/__init__.py`.

### Note: `chem_inventory_remote.py`

`app/blueprints/chem_inventory_remote.py` defines a near-duplicate `chem_bp` with the same `/chem/*` routes. It is **not imported or registered** in `app/__init__.py`, so it never executes. Treat it as inert. Only `chem_inventory.py` is live.

## 1.6 Request flow

A request traverses these stages:

```
client → nginx (TLS) → WSGI → Flask routing → [decorators] → blueprint view → service(s) → datastore
                                                                    │
                                  response ◄── template/json/file ◄─┘
```

1. **nginx** terminates TLS and `proxy_pass`es to `127.0.0.1:5000`, forwarding headers and cookies.
2. **WSGI/Werkzeug** parses the HTTP request into a `request` object.
3. **Routing** matches the path+method to a blueprint view function.
4. **Decorators** run outermost-first: `@login_required` then `@admin_required` (where present). Unauthenticated requests to protected routes redirect to `auth.login`.
5. **View** parses inputs, invokes one or more **services**, and builds a response (`render_template`, `jsonify`, `send_file`, or `redirect`).
6. Response propagates back through WSGI and nginx (re-encrypted).

Detailed scenario walkthroughs (browser page, device POST, chem page) are in `05` and `08`.

## 1.7 Persistence map

| Datastore | Location | Owner | Access method |
|-----------|----------|-------|---------------|
| `signininfo.db` (users) | `instance/signininfo.db` | `auth_service`, `admin_service` | Flask-SQLAlchemy ORM (default bind) |
| `sessioninfo.db` (sessions) | `instance/sessioninfo.db` | `auth_service` | ORM (`sessions` bind) |
| `tasks.db` (tasks) | `instance/tasks.db` | `task_service` | **raw `sqlite3`** |
| `particle_sensors.db` | `instance/particle_sensors.db` | `api` blueprint | ORM (`particle_sensors` bind) |
| PostgreSQL `cheminventory` | **local on this same VM** (`postgresql@17-main`, bound to `127.0.0.1:5432`; see `documentation/UNanofabTools/liveserver/README.md` (repo path: documentation/UNanofabTools/liveserver/README.md) §10) | `chem_service` | SQLAlchemy Core (`text()`) |
| `LogData/` tree | filesystem | `api`, `machines`, `data_service` (raw machine logs uploaded by the `filetransfer` scripts; sensor CSVs written by the `api` blueprint from posts originated by the `NanofabToolkit/PicoHelperTools` (repo path: documentation/NanofabToolkit/PicoHelperTools/README.md) firmware) | direct file I/O |
| `HSCDATA/` | filesystem | `machines`, `data_service` (CSVs populated by the external `hscdownloader` tool pulling from CORES) | CSV via `csv`/pandas |
| `uploads/` | filesystem | `task_service` | direct file I/O |

The database bind keys (`sessions`, `tasks`, `particle_sensors`) are configured in `config.py` under `SQLALCHEMY_BINDS` and declared on each model via `__bind_key__`. See `04`.

## 1.8 Directory layout (repository root, server-relevant only)

```
UNanofabTools/
├── run.py                       ← WSGI entry point / dev launcher
├── requirements.txt
├── setup.sh / quick_setup.sh    ← bootstrap scripts
├── init_chem_db.py              ← provisions the PostgreSQL chem schema
├── chem_schema.sql              ← chem schema (v1 base)
├── chem_schema_migration_v2.sql ← chem schema (v2 additive migration)
├── .env.example                 ← environment-variable template
├── config/
│   └── config.py                ← configuration classes
├── app/                         ← the application package (see 1.5)
├── migrations/                  ← Alembic/Flask-Migrate (one revision present)
│   ├── alembic.ini, env.py, script.py.mako, README
│   └── versions/01bdbfe91bd5_create_particle_sensor_tables.py
└── instance/                    ← runtime SQLite databases
    ├── signininfo.db
    ├── sessioninfo.db
    ├── tasks.db
    └── particle_sensors.db
```

Everything else at the repo root (`*.ps1`, `*.zip`, standalone machine `.py` files, miscellaneous `.md` notes) is outside the Flask application and outside this documentation's scope.

Continue to 02-getting-started.md (repo path: documentation/UNanofabTools/flaskserver/02-getting-started.md).
