# 04 — Authentication and Login

This document covers how a user goes from "stranger" to "logged in." Two files are involved:

- `app/blueprints/auth.py` — the URL handlers: `/login`, `/signup`, `/logout`, `/resetpassword`.
- `app/services/auth_service.py` — the logic: hashing passwords, creating users, creating sessions, talking to Duo.

The split is deliberate: blueprints know about HTTP (forms, redirects, flashes); services don't. A service could be reused from a CLI script or a test without ever pulling in Flask.

## The mental model

```
   Browser              auth.py (blueprint)            auth_service.py
   --------             -------------------            ---------------
   POSTs form  ──────►  /login (POST)
                          │
                          ├─ sanitize input ─────────► sanitize_input()
                          ├─ check credentials ──────► verify_user_credentials()
                          │     └── reads User table
                          ├─ run Duo 2FA ────────────► duo_authenticate()  [skipped in DEBUG_MODE]
                          ├─ create session ─────────► create_user_session()
                          │     └── inserts into Session table
                          ├─ login_user(user)
                          │     └── Flask-Login sets the cookie
                          └─ redirect to /tasks
```

Each step is examined below.

## `auth.py` — the blueprint

The blueprint defines four routes. They're all small because the heavy lifting lives in the service.

### `/login` (GET and POST)

```python
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login"""
    if request.method == 'POST':
        username = auth_service.sanitize_input(request.form.get('username', ''))
        password = auth_service.sanitize_input(request.form.get('password', ''))

        # Verify user credentials
        user = auth_service.verify_user_credentials(username, password)

        if user:
            # Perform Duo 2FA if not in debug mode
            if current_app.config['DEBUG_MODE']:
                # Skip 2FA in debug mode
                session_id = auth_service.create_user_session(username)
                flask_session['session_id'] = session_id
                login_user(user)
                return redirect(url_for('tasks.index'))
            else:
                # Perform 2FA
                duo_success = asyncio.run(auth_service.duo_authenticate(user.unid))
                if duo_success:
                    session_id = auth_service.create_user_session(username)
                    flask_session['session_id'] = session_id
                    login_user(user)
                    return redirect(url_for('tasks.index'))
                else:
                    flash('2FA authentication failed', 'error')
                    return redirect(url_for('auth.login'))
        else:
            flash('Invalid credentials', 'error')
            return redirect(url_for('auth.login'))

    return render_template('login.html')
```

Line by line:

- **`@auth_bp.route('/login', methods=['GET', 'POST'])`** — register this function as the handler for `/login`, for both GETs (page loads) and POSTs (form submissions).
- **`if request.method == 'POST':`** — branch based on whether this is a form submission or a fresh page load. If it's a GET, we fall through to the final `return render_template('login.html')` and just show the login form.
- **`username = auth_service.sanitize_input(request.form.get('username', ''))`** — pull the `username` field from the submitted form (or empty string if missing), then run it through the sanitizer. The sanitizer trims whitespace, truncates to 255 chars, and HTML-escapes (so `<script>` becomes `&lt;script&gt;`).
- **Same for password.**
- **`user = auth_service.verify_user_credentials(username, password)`** — try to find a `User` row whose username matches and whose bcrypt-hashed password verifies against the supplied password. Returns the `User` object on success, `None` on failure.
- **`if user:`** — we have a valid user; now decide whether to require 2FA.
- **`if current_app.config['DEBUG_MODE']:`** — in development, skip Duo. Otherwise…
- **`duo_success = asyncio.run(auth_service.duo_authenticate(user.unid))`** — call Duo's API and wait synchronously for the user to tap "approve" on their phone. `asyncio.run(...)` is needed because `duo_authenticate` is defined as an `async` coroutine even though Flask itself is synchronous; this is a tidy way to bridge the two.
- **`session_id = auth_service.create_user_session(username)`** — generate a fresh UUID, write a row into the `sessioninfo` table.
- **`flask_session['session_id'] = session_id`** — store the session ID in Flask's signed cookie. Note: `flask_session` was imported as `session as flask_session` to avoid shadowing the SQLAlchemy `Session` model.
- **`login_user(user)`** — tell Flask-Login this user is authenticated. This is what sets up the `current_user` proxy used elsewhere.
- **`return redirect(url_for('tasks.index'))`** — send them to the tasks page.

When any step fails, we `flash(...)` an error and redirect back to `/login`. (`flash` queues a message that the next page render can display.)

### `/signup` (GET and POST)

```python
@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    """Handle user signup"""
    if request.method == 'POST':
        username = auth_service.sanitize_input(request.form.get('username', ''))
        password = auth_service.sanitize_input(request.form.get('password', ''))
        unid = auth_service.sanitize_input(request.form.get('unid', ''))

        # Check if user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Username already exists', 'error')
            return redirect(url_for('auth.signup'))

        # Perform Duo 2FA if not in debug mode
        if current_app.config['DEBUG_MODE']:
            # Skip 2FA in debug mode
            user = auth_service.create_user(username, password, unid)
            if user:
                flash('User created successfully', 'success')
                return redirect(url_for('auth.login'))
            else:
                flash('Error creating user', 'error')
                return redirect(url_for('auth.signup'))
        else:
            # Perform 2FA before creating user
            duo_success = asyncio.run(auth_service.duo_authenticate(unid))
            if duo_success:
                user = auth_service.create_user(username, password, unid)
                ...
```

The structure mirrors `/login`. New things:

- We collect a third field, **`unid`** — the University of Utah's internal "uNID" identifier, used as the Duo username.
- We check if the username is already taken via `User.query.filter_by(username=username).first()`. SQLAlchemy turns that into `SELECT * FROM signininfo WHERE username = ? LIMIT 1`.
- The Duo step is run against the new user's `unid` *before* the row is written. This means: you can't create an account for someone unless you (or they) actually have their Duo-enrolled phone in hand. Nice. It prevents random signups for arbitrary uNIDs.
- On success, redirect to `/login` (you still have to log in afterward; signup doesn't auto-log-you-in).

### `/logout`

```python
@auth_bp.route('/logout')
@login_required
def logout():
    """Handle user logout"""
    logout_user()
    flash('Logged out successfully', 'success')
    return redirect(url_for('auth.login'))
```

A short one:

- **`@login_required`** is a decorator from Flask-Login. If the user isn't logged in, it redirects them to the login page before the function ever runs. This means hitting `/logout` while logged out is a no-op redirect.
- **`logout_user()`** clears the Flask-Login state and removes the user cookie.
- Then a `flash` and redirect back to login.

### `/resetpassword`

```python
@auth_bp.route('/resetpassword', methods=['GET', 'POST'])
def reset_password():
    """Handle password reset"""
    if request.method == 'POST':
        username = auth_service.sanitize_input(request.form.get('username', ''))
        unid = auth_service.sanitize_input(request.form.get('unid', ''))
        new_password = auth_service.sanitize_input(request.form.get('password', ''))

        # Verify username and UNID
        if auth_service.verify_user_unid(username, unid):
            if auth_service.update_user_password(username, new_password):
                flash('Password updated successfully', 'success')
                return redirect(url_for('auth.login'))
            else:
                flash('Error updating password', 'error')
                return redirect(url_for('auth.reset_password'))
        else:
            flash('Invalid username or UNID', 'error')
            return redirect(url_for('auth.reset_password'))

    return render_template('resetpassword.html')
```

The reset flow is **password-and-uNID-based**: to reset your password, you must know the uNID that's stored alongside your username. `verify_user_unid(username, unid)` enforces that match. If both fields match a row, `update_user_password` writes a fresh bcrypt hash.

Note that this flow does **not** require Duo. The implicit assumption is that the uNID is a moderate-strength secret because only the user and the admins know it; for a stronger flow, a follow-up Duo push would be advisable.

## `auth_service.py` — the logic

This is where the actual work happens. The functions are tiny and single-purpose, which is what makes them re-usable and easy to read.

### Hashing

```python
def hash_password(password):
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())


def verify_password(password, password_hash):
    """Verify a password against a hash"""
    return bcrypt.checkpw(password.encode(), password_hash)
```

`bcrypt.hashpw(plain, salt)` produces a hash that includes the salt and the cost factor inside the result string itself; that's why `verify_password` only needs the hash, not the salt separately. **We never store plaintext passwords.**

`bcrypt.gensalt()` defaults to a cost factor of 12, meaning each hash takes ~hundreds of milliseconds to compute. That's slow on purpose: it makes brute-force guessing impractical.

### Creating a user

```python
def create_user(username, password, unid):
    """Create a new user"""
    try:
        password_hash = hash_password(password)
        user = User(username=username, password_hash=password_hash, unid=unid)
        db.session.add(user)
        db.session.commit()
        return user
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating user: {e}")
        return None
```

- Hash the password.
- Construct a `User` ORM object.
- `db.session.add(user)` queues the INSERT, `db.session.commit()` runs it inside a transaction.
- On any error (duplicate username, DB down, etc.), roll back the transaction and log the exception. Return `None` so the caller can show "Error creating user."

### Verifying credentials

```python
def verify_user_credentials(username, password):
    """Verify user credentials"""
    user = User.query.filter_by(username=username).first()
    if user and verify_password(password, user.password_hash):
        return user
    return None
```

Look up by username, then check the password hash. Short-circuiting `and` means if the user doesn't exist we never try to verify, avoiding a `NoneType` error.

A side effect of this design: trying to log in with a wrong username versus a wrong password takes about the same amount of time, because the bcrypt comparison is the slow step and both paths reach it (the `None` user path skips bcrypt, which is technically a timing oracle — but it's a minor issue here).

### Reset-password helpers

```python
def verify_user_unid(username, unid):
    """Verify user UNID for password reset"""
    user = User.query.filter_by(username=username, unid=unid).first()
    return user is not None


def update_user_password(username, new_password):
    """Update user password"""
    try:
        user = User.query.filter_by(username=username).first()
        if user:
            user.password_hash = hash_password(new_password)
            db.session.commit()
            return True
        return False
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating password: {e}")
        return False
```

Pretty self-explanatory. Note that `update_user_password` will silently no-op (returning `False`) if the username doesn't exist. That's defensive: a buggy form shouldn't crash, just fail.

### Sessions

```python
def create_user_session(username):
    """Create a new session for a user"""
    session_id = str(uuid.uuid4())
    session = Session(session_id=session_id, username=username)
    db.session.add(session)
    db.session.commit()
    return session_id


def get_user_from_session(session_id):
    """Get username from session ID"""
    session = Session.query.filter_by(session_id=session_id).first()
    return session.username if session else None


def delete_old_sessions(minutes=120):
    """Delete sessions older than specified minutes"""
    cutoff_time = datetime.utcnow() - timedelta(minutes=minutes)
    Session.query.filter(Session.created_at < cutoff_time).delete()
    db.session.commit()
```

Each session is a row in the `sessioninfo` table containing a random UUID and the username. The UUID is what gets put into the Flask cookie.

`delete_old_sessions` is a janitor function: it deletes rows older than 120 minutes (2 hours by default). It is defined here but not auto-scheduled — it can be called from an admin tool or a cron job.

### Permission checks

```python
def is_user_admin(username):
    """Check if user is an admin"""
    user = User.query.filter_by(username=username).first()
    return user.is_admin if user else False


def can_user_assign(username):
    """Check if user can assign tasks"""
    user = User.query.filter_by(username=username).first()
    return user.can_assign if user else False
```

Tiny helpers that read the `is_admin` and `can_assign` booleans on the User row. Used by the admin blueprint and the task-creation route, respectively.

### Duo 2FA

```python
async def duo_authenticate(unid):
    """Perform Duo 2FA authentication"""
    try:
        auth_api = duo_client.Auth(
            ikey=current_app.config['DUO_IKEY'],
            skey=current_app.config['DUO_SKEY'],
            host=current_app.config['DUO_HOST']
        )

        auth_params = {
            'username': unid,
            'factor': 'push',
            'device': 'auto'
        }

        response = await asyncio.to_thread(auth_api.auth, **auth_params)
        return response['result'] == 'allow'
    except Exception as e:
        current_app.logger.error(f"Duo authentication error: {e}")
        return False
```

What's happening here:

- We build a `duo_client.Auth` object using the three secret keys from config.
- We ask Duo to push a notification to whatever Duo-enrolled device the uNID owns (`'factor': 'push'`, `'device': 'auto'`).
- The actual call `auth_api.auth(...)` is a *blocking* HTTP request inside the `duo_client` library. We don't want to block Flask's event loop, so we wrap it in `asyncio.to_thread(...)` which runs the blocking call in a background thread and awaits its result.
- Duo's API returns a JSON object; we look at `response['result']`. If it equals `'allow'`, the user tapped "approve." Anything else (denial, timeout, error) returns `False`.
- Any exception is logged and returns `False`.

The end result: this function returns `True` only if the user actively approved the push.

### Sanitizing input

```python
def sanitize_input(input_str, max_length=255):
    """Sanitize user input to prevent attacks"""
    import html
    sanitized = input_str.strip()
    sanitized = sanitized[:max_length]
    sanitized = html.escape(sanitized)
    return sanitized
```

Three steps:

1. **`.strip()`** — remove leading/trailing whitespace.
2. **`[:max_length]`** — truncate to 255 characters (or whatever was passed in).
3. **`html.escape(...)`** — turn dangerous characters (`<`, `>`, `&`, `"`, `'`) into safe HTML entities. This is defense-in-depth: Jinja already auto-escapes when rendering templates, but if a value gets logged or displayed somewhere unescaped, this protects against XSS.

Note that this is **not** SQL-injection defense — SQLAlchemy's parameterized queries handle that. This sanitizer is about preventing user-supplied strings from becoming executable HTML or JavaScript.

## Summary

| Step | Where it lives | What it does |
|------|-----------------|--------------|
| Show login form | `/login` GET in `auth.py` | Render `login.html` |
| Submit credentials | `/login` POST in `auth.py` | Sanitize → verify → Duo → session → cookie → redirect |
| Verify hash | `auth_service.verify_user_credentials` | DB lookup + bcrypt compare |
| 2FA | `auth_service.duo_authenticate` | Push notification via duo_client |
| Create session row | `auth_service.create_user_session` | UUID → DB row |
| Set cookie | `flask_login.login_user` (via `login_user(user)`) | Signed cookie containing user.id |
| Logout | `/logout` in `auth.py` | `logout_user()` clears the cookie |
| Reset password | `/resetpassword` POST | Verify by username+uNID, then bcrypt-rehash new password |

Two things to remember:

1. **No plaintext passwords ever live in the database** — only bcrypt hashes.
2. **Two-factor is mandatory in production**; the only escape hatch is `DEBUG_MODE=True`, which is meant for local development.

Next: `05-Admin-Panel.md`.
