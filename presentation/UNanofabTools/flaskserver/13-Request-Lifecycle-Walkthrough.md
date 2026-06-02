# 13 — Request Lifecycle Walkthroughs

So far we've discussed each piece of the server in isolation. This document tells the same story from the request's perspective: **what happens, in order, when a request comes in?**

We'll walk through three different request types, end to end:

1. A user in a browser opens the **tasks page**.
2. A Raspberry Pi POSTs a **particle sensor reading**.
3. A user in a browser opens the **chemical inventory** page.

Each illustrates a different cross-section of the server.

## Scenario 1: Browser opens `/tasks`

### Step 1 — DNS and TLS

The user types `https://nfhistory.nanofab.utah.edu/tasks` in their browser. The browser asks DNS for the IP, makes a TCP connection on port 443, completes the TLS handshake. **nginx** is listening here; it terminates the encryption.

### Step 2 — nginx proxies to Flask

Nginx is configured (in a config file outside this codebase) to reverse-proxy almost everything to `http://127.0.0.1:5000`. So nginx opens a connection to Flask on the loopback interface and forwards the GET request, including the user's cookies.

### Step 3 — Flask receives the request

Flask, running under either its development server or a production WSGI server like gunicorn, accepts the connection. The Werkzeug WSGI layer parses the HTTP request into Python objects:

- `request.method` = `'GET'`
- `request.path` = `'/tasks'`
- `request.cookies['session']` = the signed session cookie

Flask looks through its registered routes to find one that matches `/tasks`. It finds:

```python
@tasks_bp.route('/tasks')
@login_required
def index():
    ...
```

### Step 4 — `@login_required` runs

Decorators wrap the function. Outermost first, so before `index` itself executes, `@login_required` runs.

`login_required` checks `current_user.is_authenticated`. `current_user` is a Flask-Login proxy: under the hood, it looks for a user ID in the session cookie, then calls the `@login_manager.user_loader` function (defined in `app/__init__.py`):

```python
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
```

That runs `SELECT * FROM signininfo WHERE id = ?` against `signininfo.db`. If the user exists, `current_user` becomes that User object and `is_authenticated` is `True`. If not, Flask-Login redirects the request to `/login?next=/tasks`.

Assuming the user is logged in, `login_required` lets the request through.

### Step 5 — `index()` runs

```python
def index():
    user_tasks = task_service.get_user_tasks(current_user.username)
    unfinished_tasks = task_service.get_unfinished_tasks()
    all_tasks = task_service.get_all_tasks()
    can_assign = auth_service.can_user_assign(current_user.username)
    return render_template('tasks.html', ...)
```

Three database queries fire against `tasks.db` (via raw sqlite3), and one against `signininfo.db` (via SQLAlchemy) to look up `can_assign`. Each is a quick SELECT.

### Step 6 — Render the template

`render_template('tasks.html', ...)` hands the data to Jinja2, which loads `app/templates/tasks.html` and substitutes the variables (`{{ user_tasks }}`, `{{ can_assign }}`, etc.). The output is an HTML string.

### Step 7 — Response goes back out

The function returns the HTML. Flask wraps it in a `Response` object with `Content-Type: text/html; charset=utf-8` and `Set-Cookie: session=...` (if anything changed in the session). The WSGI server hands it to nginx, which encrypts it via TLS and sends it back to the browser. The browser parses the HTML, requests its CSS/JS assets (which trigger more requests through Flask's `/css/...` and `/js/...` routes), and renders the page.

Total time, end to end: typically tens to a few hundred milliseconds.

## Scenario 2: Pico POSTs a particle reading

### Step 1 — Pico WiFi + TLS

The Pico has been sleeping. Its timer fires at the top of the 15-minute interval. It:

- Wakes up, ensures WiFi is connected.
- Resolves `nfhistory.nanofab.utah.edu` via DNS.
- Opens a TLS connection to port 443.

Note: the Pico's HTTP library (`urequests`) typically uses `verify=False` because Picos don't have a full root certificate store on flash. The connection is encrypted, but the cert is trusted blindly. Since the Pico is on a private SSID, this is acceptable.

### Step 2 — Pico sends the request

```
POST /particle-data HTTP/1.1
Host: nfhistory.nanofab.utah.edu
Content-Type: application/json
Content-Length: 612

{"room_name":"HEADLESS","sensor_number":"009","timestamp":1747876800.0,
 "raw_measurements":{...},"converted_values":{...}}
```

### Step 3 — Nginx proxies to Flask

Same nginx proxy. The Pico's JSON body is forwarded intact.

### Step 4 — Flask routes the request

The path `/particle-data` matches:

```python
@api_bp.route('/particle-data', methods=['POST'])
def receive_particle_data():
    ...
```

There is **no `@login_required`** on this route. The check is skipped; the function runs immediately.

### Step 5 — `receive_particle_data` runs

The handler:

1. Verifies `Content-Type: application/json`.
2. Parses the JSON body via `request.get_json()`.
3. Checks `room_name`, `sensor_number`, `timestamp` are present.
4. Parses the timestamp (handles both Unix float and ISO string).
5. Pulls `raw_measurements` and `converted_values` nested dicts.

### Step 6 — Two writes

```python
# CSV Historical Data Logging
log_historical_particle_data(room_name, sensor_number, sensor_timestamp,
                           raw_measurements, converted_values)
```

This appends one row to `LogData/particle_sensors/HEADLESS_009_historical.csv`. If the file doesn't exist yet, it's created with a header row first.

```python
existing_record = ParticleSensorData.query.filter_by(
    room_name=room_name,
    sensor_number=sensor_number
).first()

if existing_record:
    existing_record.timestamp = sensor_timestamp
    # ... update every field ...
else:
    new_record = ParticleSensorData(...)
    db.session.add(new_record)

db.session.commit()
```

A `SELECT ... LIMIT 1` against `particle_sensors.db` finds the existing row for this (room, sensor) pair. If it exists, every column is overwritten; if not, a new row is inserted. The unique constraint on `(room_name, sensor_number)` guarantees only one row per location.

### Step 7 — Response

```python
return jsonify({
    'status': 'success',
    'message': f'Particle data received for sensor {sensor_number} in {room_name}',
    'sensor_id': f"{room_name}/{sensor_number}",
    'timestamp': sensor_timestamp.isoformat()
}), 200
```

Flask wraps the dict as JSON with `Content-Type: application/json`. Nginx encrypts. The Pico reads the response code, logs success, closes the connection, goes back to sleep.

Total time, including the round trip: ~1–2 seconds, of which Flask's contribution is a few tens of milliseconds.

## Scenario 3: Browser opens `/chem/inventory`

This route is similar to Scenario 1 except the data layer is PostgreSQL instead of SQLite.

### Step 1–3 — Same as Scenario 1

DNS → TLS → nginx → Flask.

### Step 4 — Route match

```python
@chem_bp.route('/')
@chem_bp.route("/inventory")
def inventory():
    ...
```

This route does **not** have `@login_required`. The chemical inventory's read-only pages are deliberately public-facing.

### Step 5 — Build the service

```python
service = ChemInventoryService()
```

In its `__init__`:

```python
def __init__(self):
    self.engine = get_chem_engine()
```

`get_chem_engine()` looks at the process-wide `_chem_engine` variable:

- If it's `None`, build a new SQLAlchemy engine pointing at PostgreSQL using the `CHEM_PGHOST` etc. from config, and store it.
- Otherwise, return the cached engine.

Result: connections are pooled across requests. This pool is exactly the design intent of `pool_pre_ping=True, pool_size=5, max_overflow=10`.

### Step 6 — Search

```python
rows = service.search_inventory(q, limit, show_removed=show_removed)
```

`search_inventory` opens a transaction (`with self.engine.begin() as conn:`), constructs a SQL string with the right WHERE clauses, parameterizes the search term, and runs `SELECT ... FROM containers c LEFT JOIN items i ... LEFT JOIN vendors v ... LEFT JOIN rooms r ... LIMIT :limit`.

Postgres uses the index on `containers.barcode` (and similar) to satisfy the ILIKE queries quickly. Results stream back into the transaction. The `with` block exits, closing the transaction.

### Step 7 — Render the template

`render_template("chem/inventory.html", rows=rows, ...)` produces HTML showing every row in a sortable table with action buttons (Move, Remove, Edit).

### Step 8 — Response

Standard HTML response back through nginx. The browser also fetches a few JS files (`tablesort.js`, etc.) via the `/js/...` route to enable column sorting and filtering.

## What's the same in every request?

Across all three scenarios, the high-level flow is identical:

```
Client
  → nginx (port 443, TLS)
  → Flask WSGI (127.0.0.1:5000)
  → app routing (path match)
  → optional decorators (login_required, admin_required)
  → blueprint handler
  → service layer (db queries, file I/O)
  → response (template, JSON, file, redirect)
  → Flask wraps the response
  → nginx (TLS again)
  → Client
```

The differences are *only* in what runs inside the handler. Browser pages render templates; API endpoints return JSON; download endpoints stream files. The plumbing is uniform.

## What this means in practice

Two takeaways:

1. **Most "the server is slow" problems live in step 6.** Network and routing are fast; templates and queries are where time goes. If a page is slow, profile the SQL or the file I/O, not Flask itself.
2. **Adding a feature is repetitive.** A new feature is: a new route in a blueprint + a new function (or two) in a service. Optionally a new model + a new template. You don't need to touch nginx, the factory, or any of the plumbing.

Next: `14-Security-Model.md`.
