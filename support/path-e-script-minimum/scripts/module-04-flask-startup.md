# Minimum Acceptable Full Path E - Module 04: Flask Startup

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-04-flask-startup.md

# Module 4 - How The Flask App Starts

## Goal

The maintainer understands the startup path from `run.py` through the app factory, configuration, extension initialization, blueprint registration, and route handling.

## Required Screen

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx)
- `presentation/UNanofabTools/flaskserver/02-How-It-Starts.md` (repo path: presentation/UNanofabTools/flaskserver/02-How-It-Starts.md)
- `documentation/UNanofabTools/flaskserver/01-architecture.md` (repo path: documentation/UNanofabTools/flaskserver/01-architecture.md)
- `documentation/UNanofabTools/flaskserver/02-getting-started.md` (repo path: documentation/UNanofabTools/flaskserver/02-getting-started.md)
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

Open `documentation/UNanofabTools/flaskserver/01-architecture.md` (repo path: documentation/UNanofabTools/flaskserver/01-architecture.md).

READ ALOUD:

"The architecture doc should tell the same story as the source. If a route exists in code but not in docs, the endpoint docs need updating. If docs describe a route that no longer exists, that is documentation drift. Path D audits are built around catching exactly that kind of mismatch."

## Important Distinction

READ ALOUD:

"There are two startup ideas to keep separate. First is the current live state: the app is running as `python run.py` inside tmux. Second is the recommended production target: a supervised service, likely systemd and a WSGI server such as gunicorn. The deployment docs may show the target shape. The live-server docs show what is true now."

"When you debug a current outage, you use the live-state procedure. When you improve reliability, you use the target deployment runbook and known-issues guidance."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What file starts the Flask app? | `run.py`. |
| What is an app factory? | The function that creates/configures the Flask app, initializes extensions, registers blueprints, and returns the app object. |
| What is a blueprint? | A Flask feature module that groups related routes/views and is registered with the app. |
| Where would you look if a route existed in source but did not respond? | Check blueprint registration in the app factory, route decorators, nginx/proxy behavior, auth guards, and live process state. |
| What is the difference between the current tmux startup and the recommended supervised target? | Current live state is `python run.py` inside tmux; target state is a supervised service such as systemd/gunicorn that restarts and survives reboot. |
| Why is `db.create_all()` or any implicit schema creation worth noticing? | It may hide missing migrations/schema drift and can make production schema changes less controlled. |

REQUIRE:

The maintainer can explain: `run.py -> create_app -> config -> extensions -> blueprints -> routes`.

## Stop Point

STOP POINT:

Stop here if the source repo is missing or if the maintainer cannot identify `run.py`, the app factory, and the blueprint folder.


# Expanded Module 04: Flask Startup

READ ALOUD:

This expanded section revisits Module 04, Flask Startup. The focus is run.py, app factory, extensions, blueprints, and startup drift. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 04

READ ALOUD:

We are now doing the orientation pass for Flask Startup. The maintainer should connect this module to run.py, app factory, extensions, blueprints, and startup drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx`
- `presentation/UNanofabTools/flaskserver/02-How-It-Starts.md`
- `documentation/UNanofabTools/flaskserver/01-architecture.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention run.py, app factory, extensions, blueprints, and startup drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 04

READ ALOUD:

We are now doing the evidence pass for Flask Startup. The maintainer should connect this module to run.py, app factory, extensions, blueprints, and startup drift. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/02-How-It-Starts.pptx`
- `presentation/UNanofabTools/flaskserver/02-How-It-Starts.md`
- `documentation/UNanofabTools/flaskserver/01-architecture.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention run.py, app factory, extensions, blueprints, and startup drift. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

