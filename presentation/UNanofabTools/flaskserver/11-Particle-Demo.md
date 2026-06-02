# 11 — Particle Demo

The `particle_demo_will` blueprint is the smallest blueprint in the codebase: about 30 lines. It exists to serve a standalone HTML demo page (and its assets) for the particle counter, used for outreach and visitor demos. It is decoupled from the rest of the app — no login, no database, no template engine. Just static files.

## The full file

```python
import os
from flask import Blueprint, send_file, abort

particle_demo_will_bp = Blueprint(
    "particle_demo_will",
    __name__,
    url_prefix="/particle-demo"
)

# Use absolute path to the templates directory
DEMO_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "templates", "particle-demoWill")

@particle_demo_will_bp.route("/", methods=["GET"])
def index():
    # If the user hits the bare root, serve the default demo
    default_file = os.path.join(DEMO_DIR, "UtahNanofabParticleCounterDemo.html")
    if os.path.exists(default_file):
        return send_file(default_file)
    abort(404)

@particle_demo_will_bp.route("/<path:filename>", methods=["GET"])
def assets(filename: str):
    # Protect against directory traversal
    if ".." in filename or filename.startswith("/"):
        abort(400)

    file_path = os.path.join(DEMO_DIR, filename)
    if os.path.exists(file_path):
        return send_file(file_path)

    abort(404)
```

## Walking through it

### The blueprint setup

```python
particle_demo_will_bp = Blueprint(
    "particle_demo_will",
    __name__,
    url_prefix="/particle-demo"
)
```

Blueprint with `url_prefix="/particle-demo"`. So `@route("/")` becomes `GET /particle-demo/` and `@route("/<path:filename>")` becomes `GET /particle-demo/<anything>`.

### Locating the demo folder

```python
DEMO_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "templates",
    "particle-demoWill"
)
```

Reading this from the inside out:

- `os.path.abspath(__file__)` — the absolute path to this file (`particle_demo_will.py`).
- `os.path.dirname(...)` once — the directory containing this file (`app/blueprints/`).
- `os.path.dirname(...)` again — one level up (`app/`).
- Then append `"templates"` and `"particle-demoWill"`.

Net result: `<repo>/app/templates/particle-demoWill/`. The demo HTML and its assets live there.

### The root route

```python
@particle_demo_will_bp.route("/", methods=["GET"])
def index():
    # If the user hits the bare root, serve the default demo
    default_file = os.path.join(DEMO_DIR, "UtahNanofabParticleCounterDemo.html")
    if os.path.exists(default_file):
        return send_file(default_file)
    abort(404)
```

Hitting `/particle-demo/` returns the file `UtahNanofabParticleCounterDemo.html`. If that file is missing for some reason, `abort(404)` returns a generic Flask 404 page.

### The asset route

```python
@particle_demo_will_bp.route("/<path:filename>", methods=["GET"])
def assets(filename: str):
    # Protect against directory traversal
    if ".." in filename or filename.startswith("/"):
        abort(400)

    file_path = os.path.join(DEMO_DIR, filename)
    if os.path.exists(file_path):
        return send_file(file_path)

    abort(404)
```

Hitting any other path under `/particle-demo/` — like `/particle-demo/styles.css` or `/particle-demo/images/banner.png` — falls through to this route.

The traversal guard:

- **`if ".." in filename`** — blocks `../../something` attempts to escape the demo folder.
- **`if filename.startswith("/")`** — blocks absolute paths.

These two checks together mean the user can only reach files under `DEMO_DIR`. (Compare with the more thorough `realpath` + prefix check in `machines.py`'s `/download` route, which handles symlinks too. Here the simpler check is fine because the demo folder has no symlinks.)

If the file exists, it's served via `send_file`. Otherwise, 404.

## Why this exists

The demo page is a single HTML file with JavaScript that fetches from the live `/particle-data` endpoint and renders a real-time visualization. It's designed to be self-contained — show on a kiosk at an event, demo for visitors, etc. It doesn't need login because:

- It only fetches public-readable particle data.
- It needs to work without anyone signed in (visitors won't have accounts).

Routing it through a dedicated blueprint also keeps the demo's URL stable (`/particle-demo/`) and visually separates it from the rest of the app.

## Summary

This is the kind of route you write when "I have one specific HTML page I need to serve, plus a folder of supporting files, and nothing else." Three things to remember:

- Files are pulled from `app/templates/particle-demoWill/`.
- Traversal protection is simple string-based, sufficient for this use case.
- No login required.

Next: `12-Consumers-NanofabToolkit.md`.
