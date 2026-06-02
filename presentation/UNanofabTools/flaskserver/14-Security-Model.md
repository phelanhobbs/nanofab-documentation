# 14 — Security Model

This document collects every security-relevant decision into one place. If you're presenting to a security-minded audience, or just want to understand the threat model, read this. Nothing here is new — it's a consolidation of details scattered across the earlier documents — but seeing it together makes the overall posture clear.

The server's security can be grouped into six topics: transport, authentication, authorization, input handling, file safety, and the deliberate gaps.

## 1. Transport security (encryption in transit)

- **All external traffic is HTTPS.** Nginx terminates TLS on port 443.
- **Flask never handles encryption.** It binds to `127.0.0.1:5000` — the loopback address — so nothing outside the server machine can talk to Flask directly. The only path in is through nginx.
- This is the standard "reverse proxy" pattern. It keeps the certificate and cipher configuration in nginx (which is purpose-built for it) and out of the Python app.

From `config/config.py`:

```python
HOST = os.getenv('HOST', '127.0.0.1')
PORT = int(os.getenv('PORT', 5000))
```

And from `run.py`'s docstring:

> nginx handles SSL on port 443 and proxies to this process on 127.0.0.1:5000. Flask never needs to manage SSL or bind to an external IP.

**Caveat:** the Picos and desktop apps connect with `verify=False`, meaning they encrypt but don't validate the server's certificate. This is because the internal certificate isn't in their trust stores. The traffic is still encrypted; it's just theoretically vulnerable to a man-in-the-middle who already controls the private network. On an internal lab SSID, this is an accepted trade-off.

## 2. Authentication (who are you?)

### Passwords

- Stored as **bcrypt hashes**, never plaintext (`auth_service.hash_password`).
- Bcrypt's default cost factor (~12) makes each hash slow to compute, which makes brute-forcing impractical.
- Verification uses `bcrypt.checkpw`, which is constant-time with respect to the hash comparison.

### Two-factor authentication (Duo)

- After a correct password, production requires a **Duo push** to the user's phone (`auth_service.duo_authenticate`).
- The login only completes if Duo returns `result == 'allow'`.
- 2FA is also required during **signup** — you cannot create an account for a uNID unless that uNID's Duo device approves. This prevents account spoofing.
- The only bypass is `DEBUG_MODE=True`, which is meant for local development only. In production, `DEBUG_MODE` is `False`.

### Sessions

- On successful login, two things happen:
  1. A row is written to `sessioninfo.db` with a random UUID (`auth_service.create_user_session`).
  2. Flask-Login sets a signed cookie containing the user's database ID.
- The cookie is signed with `SECRET_KEY`. If `SECRET_KEY` leaks, an attacker could forge sessions — so it must be a strong random value in production (the default `'dev-secret-key-change-in-production'` is intentionally unusable).
- `PERMANENT_SESSION_LIFETIME = 7200` is configured, but the current login flow does not mark Flask sessions permanent; it is not an enforced two-hour logout by itself.
- `delete_old_sessions()` exists to purge stale session rows, though it isn't auto-scheduled.

### Cookie hardening

From `config.py`:

```python
SESSION_COOKIE_SECURE = ...   # True in production: cookie only sent over HTTPS
SESSION_COOKIE_HTTPONLY = ... # True: JavaScript can't read the cookie (blunts XSS)
SESSION_COOKIE_SAMESITE = 'Lax'  # cookie not sent on cross-site POSTs (blunts CSRF)
```

These three flags are the standard cookie-security trio. `Secure` is relaxed to `False` only in `DevelopmentConfig` so local HTTP testing works.

## 3. Authorization (what are you allowed to do?)

The permission model is intentionally simple — two boolean flags on each user:

| Flag | Grants |
|------|--------|
| `is_admin` | Access to the admin panel; can delete users and toggle permissions |
| `can_assign` | Can create/assign tasks |

These are enforced with two decorators:

- **`@login_required`** (Flask-Login) — must be logged in.
- **`@admin_required`** (custom, in `admin.py`) — must be an admin. Always stacked on top of `@login_required`.

Example of the layered check:

```python
@admin_bp.route('/adminpanel')
@login_required
@admin_required
def admin_panel():
    ...
```

The task-creation route enforces `can_assign` inline rather than with a decorator:

```python
if not auth_service.can_user_assign(current_user.username):
    flash('You do not have permission to create tasks', 'error')
    return redirect(url_for('tasks.index'))
```

**Important principle the code follows:** permissions are enforced **server-side**, not just hidden in the UI. The front-end may hide the "Create Task" button from users without `can_assign`, but even if someone POSTs directly to `/createtasks`, the server rejects it. Never trust the client to police itself.

## 4. Input handling

### SQL injection

- The SQLite task code uses **parameterized queries** (`?` placeholders) everywhere — never string-formatted SQL with user data.
- The chemical inventory uses SQLAlchemy's `text()` with **bound parameters** (`:name` placeholders) everywhere.
- This is the single most important defense against SQL injection, and the code applies it consistently.

Example (chem service):

```python
conn.execute(text("SELECT container_id FROM containers WHERE barcode = :barcode"),
             {"barcode": barcode})
```

The `:barcode` value is sent to the database separately from the SQL text, so it can never be interpreted as SQL.

### Cross-site scripting (XSS)

- **Jinja2 auto-escapes** all template variables by default — `{{ value }}` renders `<script>` as harmless text.
- The auth service adds belt-and-suspenders escaping with `sanitize_input`, which trims, truncates, and HTML-escapes user input.

```python
def sanitize_input(input_str, max_length=255):
    import html
    sanitized = input_str.strip()
    sanitized = sanitized[:max_length]
    sanitized = html.escape(sanitized)
    return sanitized
```

**One known sharp edge:** `data_service.csv_to_html_table` builds an HTML table by hand and does **not** escape cell contents. If a machine CSV ever contained `<script>`, it would render as live HTML. Since the CSVs are produced by trusted machine software, this is low-risk in practice — but it's the one place where the auto-escaping guarantee doesn't apply, and it's worth a future fix (escape each cell with `html.escape`).

### Request size limits

```python
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
```

Uploads larger than 16 MB are rejected by Flask before any of our code runs, preventing memory-exhaustion via giant uploads.

## 5. File safety

Several endpoints serve or accept files. Each guards against **path traversal** (the `../../etc/passwd` class of attack), but with varying thoroughness:

### Strongest: `machines.py` downloads and graphs

```python
log_dir = os.path.realpath(current_app.config['LOG_DATA_DIR'])
actual_path = os.path.realpath(filepath)

if not actual_path.startswith(log_dir + os.sep):
    return jsonify({'error': 'Access denied'}), 403
```

`realpath` resolves symlinks and `..` segments to a canonical absolute path, then the code verifies the result is inside the allowed directory. This is the correct, thorough approach — it even defends against symlink tricks.

### Medium: Parylene download endpoint

```python
if '..' in filename or '/' in filename or '\\' in filename:
    return jsonify({'error': 'Invalid filename'}), 400
if not filename.endswith('.csv'):
    return jsonify({'error': 'File not found'}), 404
```

String-based rejection plus an extension allow-list. Sufficient because the Flask route uses `<filename>` (not `<path:filename>`), so slashes can't appear anyway.

### Medium: particle demo

```python
if ".." in filename or filename.startswith("/"):
    abort(400)
```

Simple string check. Adequate for a folder with no symlinks.

### Upload safety

Task file uploads are guarded by:

- **An extension allow-list** (`allowed_file`).
- **`secure_filename`** from Werkzeug, which strips dangerous characters so a malicious filename can't escape the upload folder.
- **A timestamp suffix** so uploads can't overwrite each other.

## 6. The deliberate gaps

A fair security review names what *isn't* protected and why. These are conscious trade-offs for an internal lab tool, not oversights to hide:

1. **The IoT endpoints (`/particle-data`, `/env-data`, `/sensor-data`, `/sdsanalog`, `/denton18pump`, and their `finished` variants) have no authentication.** Any device that can reach the server can POST data. The trust boundary is the private network: the Picos are on a locked-down SSID, and the endpoints aren't publicly advertised. There's no API key or token. If this server were ever exposed to the public internet, these endpoints would need authentication (an API key header at minimum).

2. **The entire chemical inventory (`/chem/*`) is unauthenticated.** The blueprint imports `login_required` but never applies it to any route. That means anyone who can reach the server can search, add, move, edit, and remove chemical containers. For a kiosk-style internal tool this may be acceptable for *reading*, but the **write** routes (add/move/remove/edit) being open is a real gap worth closing — at minimum, gate the mutating routes behind `@login_required`.

3. **CORS is wide open** (`CORS(app)` with no origin restriction). Any website's JavaScript can call the JSON endpoints from a browser. Combined with the unauthenticated endpoints, a malicious page a logged-out user visits could POST sensor data or read inventory. Tightening CORS to the known internal origins would reduce this surface.

4. **`verify=False` on the client side** disables certificate validation (discussed under Transport).

5. **The password-reset flow uses the uNID as the only secret** (no email confirmation, no Duo step). Anyone who knows a username and its associated uNID can reset that user's password. Since uNIDs are semi-public within the university, this is weaker than the login flow. Adding a Duo push to the reset flow would close it.

6. **Timing oracle on login.** `verify_user_credentials` skips the bcrypt comparison when the username doesn't exist, so a non-existent username returns slightly faster than a wrong password. This is a minor information leak (an attacker can enumerate valid usernames) and is low-priority.

## Summary scorecard

| Area | Status |
|------|--------|
| HTTPS in transit | Strong (nginx TLS, Flask loopback-only) |
| Password storage | Strong (bcrypt) |
| Two-factor login | Strong (Duo, mandatory in production) |
| Session cookies | Strong (Secure + HttpOnly + SameSite, 2-hour expiry) |
| SQL injection | Strong (parameterized everywhere) |
| XSS | Strong (Jinja auto-escape) with one unescaped CSV-table edge |
| Path traversal | Strong on machine downloads; adequate elsewhere |
| Upload safety | Strong (allow-list + secure_filename) |
| IoT endpoint auth | **Open by design** (perimeter trust) |
| Chem inventory auth | **Open — write routes should be gated** |
| CORS | **Wide open — could be tightened** |
| Password reset strength | **Weaker than login (uNID only)** |

The headline: **the human-facing login path is well-secured** (bcrypt + Duo + hardened cookies + parameterized queries). **The machine-facing and inventory paths trade authentication for convenience**, relying on network perimeter security. That's a reasonable posture for an internal cleanroom tool, but the three bolded gaps (chem write routes, IoT auth, CORS) are the things to mention if anyone asks "what would you harden first?"

Next: `15-Endpoint-Reference.md`.
