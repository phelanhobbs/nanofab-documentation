# 02 — How the Server Starts

This document walks through, line by line, what happens between the moment you run the server and the moment it is ready to handle its first request. Three files are involved: `run.py`, `app/__init__.py`, and `config/config.py`. (The third file gets its own document, `03-Configuration.md`; we'll only reference it here.)

## The starter file: `run.py`

This is the entry point — the file you point Python at to launch the server. It is only 19 lines long, which is intentional. The interesting code lives in `app/__init__.py`; `run.py` is just the "ignition key."

```python
"""
WSGI entry point for the Flask application.

Deployment: nginx handles SSL on port 443 and proxies to this process on
127.0.0.1:5000.  Flask never needs to manage SSL or bind to an external IP.
"""
import os
from app import create_app
from config.config import config

config_name = os.getenv('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == '__main__':
    host = app.config['HOST']
    port = app.config['PORT']
    debug = app.config['DEBUG_MODE']
    app.logger.info(f"Starting Flask on {host}:{port} (debug={debug})")
    app.run(host=host, port=port, debug=debug, use_reloader=debug)
```

Line by line:

- **The triple-quoted comment at the top** is a docstring explaining the deployment model — nginx is out in front handling encryption, so Flask itself only needs to listen on the loopback address `127.0.0.1`. (Loopback = "only this same computer can talk to me." It's not exposed to the network.)
- **`import os`** — gives us access to operating-system stuff. We use `os.getenv()` below to read environment variables.
- **`from app import create_app`** — imports the function `create_app` from the `app/` directory's `__init__.py`. We'll dissect that function next.
- **`from config.config import config`** — imports the configuration dictionary (it maps strings like `'production'` to configuration classes). The actual configuration classes are explained in `03-Configuration.md`.
- **`config_name = os.getenv('FLASK_ENV', 'development')`** — looks at the environment variable `FLASK_ENV`. If it's set, use that; otherwise default to `'development'`. In production you set `FLASK_ENV=production` so you get the production settings.
- **`app = create_app(config_name)`** — calls the factory function. This actually builds the Flask app. By the time this line finishes, `app` is a fully configured Flask application ready to handle requests. Everything below is "if you're running this file directly, also start the dev web server."
- **`if __name__ == '__main__':`** — a Python idiom meaning "only run the indented block if this file was executed as a script, not imported as a library." In production, a WSGI server like gunicorn or uwsgi imports `app` from this file and serves it; that path skips the `app.run()` call. The block under `if __name__ == '__main__':` is mainly for local development with `python run.py`.
- **`app.run(host=host, port=port, debug=debug, use_reloader=debug)`** — start Flask's built-in development server. `use_reloader=debug` means: in debug mode, watch the files and auto-restart when something changes. This is great for development but never for production (Flask's built-in server is single-threaded and slow).

So `run.py` does almost nothing on its own; the magic is in `create_app`.

## The application factory: `app/__init__.py`

This file defines `create_app()` — the function that builds the Flask application. The "factory" pattern is a deliberate choice: instead of constructing a global `app = Flask(__name__)` at import time, you call a function that builds a fresh `app` each time. This is helpful for testing (you can build a test app with different config) and for some deployment patterns.

Here is the full file with annotations.

```python
"""
Flask application factory
"""
import os
from datetime import datetime, date
from flask import Flask
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_cors import CORS
from config.config import config
from app.models import db, User
```

These imports pull in:

- **Flask** itself.
- **Flask-Login**, an extension that handles "is this user logged in?" mechanics — session cookies, the `@login_required` decorator, etc.
- **Flask-Bcrypt**, the password-hashing helper.
- **Flask-Migrate**, which manages database schema changes over time (the `migrations/` folder).
- **Flask-CORS**, the cross-origin policy enabler.
- The configuration dictionary, and the `db` object plus `User` model from our own `app/models/` package.

```python
# Initialize extensions
login_manager = LoginManager()
bcrypt = Bcrypt()
migrate = Migrate()
```

These three objects are created at the module level *before* the Flask app exists. That's because each one will later be attached to the app via `.init_app(app)`. This two-step "construct then init" pattern is what lets the factory work — the extensions exist as module-level singletons but they're not bound to an app until `create_app` runs.

### The factory function itself

```python
def create_app(config_name='default'):
    """Create and configure the Flask application"""
    app = Flask(__name__)
```

Builds a new Flask object. `__name__` is the dotted import name of this module (`app`), which Flask uses to locate the `templates/` and `static/` folders relative to this file.

```python
    # Load configuration
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
```

Two things happen here:

1. `config[config_name]` is a class like `DevelopmentConfig` or `ProductionConfig`. `from_object` copies every uppercase attribute on that class into `app.config`. So `DEBUG_MODE`, `HOST`, `PORT`, `SQLALCHEMY_DATABASE_URI`, etc. all become entries in `app.config`.
2. `init_app(app)` runs any extra setup the config class wants to do — for example, the production config installs a rotating log handler. (See `03-Configuration.md` for details.)

```python
    # Enable CORS for all domains and routes
    CORS(app)
```

Allows JavaScript running on any origin (any other domain) to call our JSON endpoints. This is broad on purpose — the API is consumed by several different web pages and tools that don't all share an origin. Note that CORS is a *browser* enforcement; the Pico sensors and desktop apps don't care about it.

```python
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
```

Now we hand each pre-constructed extension a reference to the app. This is where they actually start hooking themselves into Flask — registering before-request handlers, exposing decorators, etc.

```python
    # Configure login manager
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Please log in to access this page.'
    login_manager.login_message_category = 'info'
```

Tells Flask-Login what to do when an unauthenticated user hits a `@login_required` page: redirect them to the route named `auth.login` (defined in `app/blueprints/auth.py`), and flash the message `'Please log in to access this page.'` so it can be displayed.

### A custom template filter

```python
    @app.template_filter("fmtdate")
    def fmtdate(value, fmt="%Y-%m-%d"):
        """Format date values for display"""
        if value in (None, "", "—"):
            return "—"
        if isinstance(value, (date, datetime)):
            return value.strftime(fmt)
        return str(value)
```

This adds a filter named `fmtdate` to Jinja (the template engine). In an HTML template you can now write `{{ some_date | fmtdate }}` and it will:

- Return an em-dash `"—"` if the value is missing, blank, or already a dash.
- Format the date `YYYY-MM-DD` if it's a real `date`/`datetime` object.
- Otherwise fall back to the string representation.

This is used heavily in the chemical inventory templates so blank dates look tidy rather than printing `None`.

### Registering blueprints

```python
    # Register blueprints
    from app.blueprints.auth import auth_bp
    from app.blueprints.tasks import tasks_bp
    from app.blueprints.admin import admin_bp
    from app.blueprints.machines import machines_bp
    from app.blueprints.api import api_bp
    from app.blueprints.chem_inventory import chem_bp
    from app.blueprints.particle_demo_will import particle_demo_will_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(machines_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(chem_bp)
    app.register_blueprint(particle_demo_will_bp)
```

A blueprint is Flask's mechanism for splitting a big app into chapters. Each `_bp` object is defined in its own file, where it owns a set of routes. `app.register_blueprint(bp)` plugs those routes into the main app.

Why is this done inside `create_app` rather than at the top of the file? **To avoid circular imports.** Each blueprint module imports things from `app.models` and `app.services`, which in turn import `db` from `app.models`. By deferring blueprint imports until inside the function, we sidestep the chicken-and-egg problem.

The seven blueprints, in plain language:

| Blueprint | URL prefix | Topic | Documented in |
|-----------|-----------|-------|----------------|
| `auth_bp` | (none) | Login, signup, password reset, logout | `04-Authentication-and-Login.md` |
| `tasks_bp` | (none) | Task list, create/claim/complete tasks, file uploads | `06-Tasks.md` |
| `admin_bp` | (none) | User management, toggle permissions | `05-Admin-Panel.md` |
| `machines_bp` | (none) | All per-machine pages, log file browser, downloads, graphing | `07-Machines-and-Logs.md` |
| `api_bp` | (none) | JSON/CSV endpoints used by Picos and desktop apps | `08-IoT-API-Endpoints.md` |
| `chem_bp` | `/chem` | Chemical inventory, barcode queue, scan reports | `09-Chemical-Inventory.md` |
| `particle_demo_will_bp` | `/particle-demo` | Static-file viewer for a demo HTML page | `11-Particle-Demo.md` |

### A few inline routes

After the blueprints, the factory adds three small routes directly to the app rather than to a blueprint:

```python
    # Register static routes
    @app.route('/js/<path:filename>')
    def serve_js(filename):
        """Serve JavaScript files"""
        return app.send_static_file(f'js/{filename}')

    @app.route('/css/<path:filename>')
    def serve_css(filename):
        """Serve CSS files"""
        return app.send_static_file(f'css/{filename}')

    @app.route('/favicon.ico')
    def favicon():
        """Serve favicon"""
        favicon_path = os.path.join(app.root_path, '..', 'favicon.ico')
        if os.path.isfile(favicon_path):
            return app.send_static_file('../favicon.ico')
        return '', 404
```

- The first two are convenience routes for JavaScript and CSS files. Any request for `/js/foo.js` or `/css/foo.css` returns the corresponding file from the static folder.
- The favicon route returns the little browser-tab icon, or a 404 if the file isn't there.

Note: `<path:filename>` is Flask's way of capturing a chunk of the URL — including slashes — and handing it to the function as the `filename` argument.

### Creating the database tables

```python
    # Create database tables
    with app.app_context():
        db.create_all()

    return app
```

`db.create_all()` looks at every model class registered with SQLAlchemy and runs the `CREATE TABLE` statements for any tables that don't yet exist. Crucially, it does **not** modify existing tables — if you change a model, you need a migration to alter the table. The `migrate` extension above is what handles that.

The factory then returns the fully-built `app`, and back in `run.py` we're ready to either run it directly or hand it to a production WSGI server.

### The user loader

Finally, after `create_app`, there's one more piece:

```python
@login_manager.user_loader
def load_user(user_id):
    """Load user for Flask-Login"""
    return User.query.get(int(user_id))
```

Flask-Login keeps only the user's ID in the session cookie. When a request comes in, it calls this function to convert the ID back into a full `User` object. The function does a database lookup: "given this primary key, fetch the user row." If the row exists, that user becomes `current_user` for the rest of the request; if not, the request is treated as anonymous.

This single function is the bridge between the bare ID in the cookie and the rich `User` object that the rest of the code uses.

## Summary — the boot sequence

To recap, here is what happens from "you run the server" to "it's ready":

1. `python run.py` is executed (or a production WSGI server imports `app` from it).
2. `run.py` reads `FLASK_ENV` and decides which config to use (development by default).
3. It calls `create_app(config_name)`.
4. Inside `create_app`:
   - A Flask object is built.
   - The configuration class's attributes are copied into `app.config`, then `init_app` runs to do per-config setup (e.g. logging in production).
   - CORS is enabled.
   - SQLAlchemy, Flask-Login, Bcrypt, and Migrate are bound to the app.
   - The `fmtdate` Jinja filter is registered.
   - All seven blueprints are imported and registered.
   - `/js/...`, `/css/...`, and `/favicon.ico` routes are wired up directly.
   - `db.create_all()` ensures every SQLite table exists.
5. The factory returns the configured app.
6. If you're running `run.py` directly, Flask's development server starts on the configured host and port. If you're under gunicorn/uwsgi, that production server takes over.
7. The server begins listening for HTTP requests.

From this point on, every incoming request enters Flask, gets matched to a blueprint route, and is dispatched. That dispatch process is covered in `13-Request-Lifecycle-Walkthrough.md`.

Next: `03-Configuration.md` — exactly what settings exist and where they come from.
