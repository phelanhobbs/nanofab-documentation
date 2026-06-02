# 01 — Server Overview

Before we look at any code, let's make sure we're using the same vocabulary, then look at the system from 30,000 feet.

## What is a server, in one sentence?

A **server** is a program that sits running on a computer somewhere, waiting for other programs (called **clients**) to ask it for things over the network. Each "ask" is called a **request**, and the server answers with a **response**.

Almost everything you do on the internet works this way:

- You open `https://nfhistory.nanofab.utah.edu` in a browser → the browser is the client, your laptop sends a request, the server sends back an HTML page as the response, and the browser draws it.
- A Raspberry Pi out in the cleanroom takes a particle-sensor reading and POSTs it as JSON → the Pi is the client, our server is on the receiving end, and it stores the reading in a database.
- The PrecioiusMetalReader desktop app fetches the latest reagent prices → the desktop app is the client, an internal web service is the server.

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
