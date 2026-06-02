# Module 4 - How The Flask App Starts

## Goal

The maintainer understands the startup path from `run.py` through the app factory, configuration, extension initialization, blueprint registration, and route handling.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx`](../../presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx)
- [`../../presentation/UNanofabTools/flaskserver/02-How-It-Starts.md`](../../presentation/UNanofabTools/flaskserver/02-How-It-Starts.md)
- [`../../documentation/UNanofabTools/flaskserver/01-architecture.md`](../../documentation/UNanofabTools/flaskserver/01-architecture.md)
- [`../../documentation/UNanofabTools/flaskserver/02-getting-started.md`](../../documentation/UNanofabTools/flaskserver/02-getting-started.md)
- Source files in `../UNanofabTools`

## Verbatim Script

READ ALOUD:

"Now we move from the live server to the Flask application. The question is: when someone starts the app, what happens first, and how does that become a set of web pages and API routes?"

SHOW:

Open `02-How-It-Starts.pptx`.

READ ALOUD:

"The entry point is `run.py`. That file is the first place to look when the app does not start. It selects or loads configuration, creates the Flask app, and runs it. Inside the app factory, extensions are initialized, paths are configured, blueprints are registered, and route functions become reachable."

"Blueprints are the app's feature modules. If a page or endpoint exists, it is probably in a blueprint. Understanding blueprints prevents the maintainer from searching randomly. They can ask: which feature owns this route, and which blueprint implements that feature?"

## Source Demo

DO:

In `../UNanofabTools`, show:

```text
run.py
app/__init__.py
app/blueprints/
```

DO:

Run:

```sh
rg -n "def create_app|register_blueprint|app.run|FLASK_ENV" ../UNanofabTools
```

READ ALOUD:

"This search is not just for show. It demonstrates how a maintainer verifies the startup story. If the docs say there is an app factory, we find the app factory. If the docs say blueprints register, we find the registration. If the docs say `run.py` is the development-style live command today, we verify that against source and live-state docs."

SHOW:

Open [`../../documentation/UNanofabTools/flaskserver/01-architecture.md`](../../documentation/UNanofabTools/flaskserver/01-architecture.md).

READ ALOUD:

"The architecture doc should tell the same story as the source. If a route exists in code but not in docs, the endpoint docs need updating. If docs describe a route that no longer exists, that is documentation drift. Path D audits are built around catching exactly that kind of mismatch."

## Important Distinction

READ ALOUD:

"There are two startup ideas to keep separate. First is the current live state: the app is running as `python run.py` inside tmux. Second is the recommended production target: a supervised service, likely systemd and a WSGI server such as gunicorn. The deployment docs may show the target shape. The live-server docs show what is true now."

"When you debug a current outage, you use the live-state procedure. When you improve reliability, you use the target deployment runbook and known-issues guidance."

## Explain-Back

ASK:

- What file starts the Flask app?
- What is an app factory?
- What is a blueprint?
- Where would you look if a route existed in source but did not respond?
- What is the difference between the current tmux startup and the recommended supervised target?
- Why is `db.create_all()` or any implicit schema creation worth noticing?

REQUIRE:

The maintainer can explain: `run.py -> create_app -> config -> extensions -> blueprints -> routes`.

## Stop Point

STOP POINT:

Stop here if the source repo is missing or if the maintainer cannot identify `run.py`, the app factory, and the blueprint folder.
