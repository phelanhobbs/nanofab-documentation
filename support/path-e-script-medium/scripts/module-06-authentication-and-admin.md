# Medium Full Path E - Module 06: Authentication And Admin

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-06-auth-admin.md

# Module 6 - Authentication, Authorization, And Admin

## Goal

The maintainer understands how users log in, how sessions work, where Duo fits, how admin powers are guarded, and which authentication or authorization gaps require careful maintenance.

## Required Screen

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx)
- `presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx)
- `presentation/UNanofabTools/flaskserver/04-Authentication-and-Login.md` (repo path: presentation/UNanofabTools/flaskserver/04-Authentication-and-Login.md)
- `presentation/UNanofabTools/flaskserver/05-Admin-Panel.md` (repo path: presentation/UNanofabTools/flaskserver/05-Admin-Panel.md)
- `documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md` (repo path: documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md)

## Verbatim Script

READ ALOUD:

"Authentication answers who you are. Authorization answers what you are allowed to do. The system needs both. A login page alone is not a security model. Hidden buttons alone are not a security model. Sensitive routes must be checked server-side."

SHOW:

Open `04-Authentication-and-Login.pptx`.

READ ALOUD:

"The login system uses stored user identity, password verification, sessions, and Duo where configured. Passwords should be hashed, not stored as plaintext. Sessions let the app remember that a user has authenticated. Duo adds a second factor. Each of those pieces has configuration and failure modes."

"If login works locally but not in production, do not assume the route is broken. Check configuration, secret values, Duo settings, callback behavior, session settings, and whether the production environment is using the expected database."

SHOW:

Open `05-Admin-Panel.pptx`.

READ ALOUD:

"Admin behavior must be enforced on the server. If a non-admin cannot see a button, that is helpful UI, but it is not enough. The route must check that the user is an admin before performing admin actions."

## Source Demo

DO:

Show:

```text
../UNanofabTools/app/blueprints/auth.py
../UNanofabTools/app/blueprints/admin.py
../UNanofabTools/app/services/auth_service.py
../UNanofabTools/app/services/admin_service.py
```

DO:

Run:

```sh
rg -n "login_required|admin_required|session|duo|hash|verify|toggle|deleteUser" ../UNanofabTools/app
```

READ ALOUD:

"This search proves where authentication and authorization live. We are looking for route decorators, session writes, Duo integration, password hashing, and admin mutations. When auditing security, do not read only the docs. Read the actual guard conditions."

SHOW:

Open `documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md` (repo path: documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md).

READ ALOUD:

"This developer doc should contain the authorization matrix. If a route mutates users, admin status, passwords, tasks, or chemical inventory, the maintainer should be able to answer who can call it and where the check is enforced."

## Risk Framing

READ ALOUD:

"The risks in this area are high because mistakes can grant access or allow unauthorized changes. Important questions are: Are admin checks server-side? Are passwords hashed? Are Duo secrets protected? Are session settings production-appropriate? Are admin actions auditable? Do route docs match the source?"

"Any route drift here matters more than a cosmetic docs mismatch. If source has a new admin route and the docs do not mention it, the maintainer may not audit it."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| What is the difference between authentication and authorization? | Authentication proves who the user is; authorization decides what that authenticated user may do. |
| What is the difference between `login_required` and `admin_required`? | `login_required` requires a logged-in user; `admin_required` requires admin privileges in addition to login. |
| Where would you inspect password verification? | The auth blueprint and auth service, especially password hashing/checking logic. |
| Where would you inspect admin route guards? | `app/blueprints/admin.py`, admin decorators/helpers, and admin service calls. |
| What does Duo add? | A second authentication factor beyond the password. |
| What should never be stored or shown in plaintext? | Passwords, Duo secrets, session secrets, bearer tokens, database passwords, and private keys. |
| What would you inspect if admin buttons disappeared but routes still worked? | Templates/UI conditions first, then server-side admin route guards to confirm authorization is still enforced. |
| What would you inspect if login worked locally but not in production? | Production config, `.env` key names/values off-screen, Duo settings, session/cookie settings, database path, and deployed source/live process state. |

REQUIRE:

The maintainer can identify the login route, admin route, service-layer auth helpers, and authorization documentation.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot explain why UI-only admin hiding is insufficient or cannot find the server-side admin checks.


# Expanded Module 06: Authentication And Admin

READ ALOUD:

This expanded section revisits Module 06, Authentication And Admin. The focus is login, authorization, Duo, admin guards, and password handling. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 06

READ ALOUD:

We are now doing the orientation pass for Authentication And Admin. The maintainer should connect this module to login, authorization, Duo, admin guards, and password handling. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx`
- `presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx`
- `documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention login, authorization, Duo, admin guards, and password handling. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 06

READ ALOUD:

We are now doing the evidence pass for Authentication And Admin. The maintainer should connect this module to login, authorization, Duo, admin guards, and password handling. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx`
- `presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx`
- `documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention login, authorization, Duo, admin guards, and password handling. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Source-code pass for Module 06

READ ALOUD:

We are now doing the source-code pass for Authentication And Admin. The maintainer should connect this module to login, authorization, Duo, admin guards, and password handling. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx`
- `presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx`
- `documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention login, authorization, Duo, admin guards, and password handling. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Live-state pass for Module 06

READ ALOUD:

We are now doing the live-state pass for Authentication And Admin. The maintainer should connect this module to login, authorization, Duo, admin guards, and password handling. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx`
- `presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx`
- `documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention login, authorization, Duo, admin guards, and password handling. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Failure-mode pass for Module 06

READ ALOUD:

We are now doing the failure-mode pass for Authentication And Admin. The maintainer should connect this module to login, authorization, Duo, admin guards, and password handling. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx`
- `presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx`
- `documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention login, authorization, Duo, admin guards, and password handling. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

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



# Read-Aloud Documentation Corpus: documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 07 — Authentication & Authorization

This document describes how identity and permissions work: the login/signup/reset flows, Duo 2FA, the dual session model, Flask-Login integration, the permission model, and the decorators. It is a behavioral spec; for function signatures see `06`, for routes see `05`.

## 7.1 Identity model

A user is a row in `signininfo` (`User` model) with:

- `username` — login identifier (unique).
- `password_hash` — bcrypt hash (column `passwordHash`).
- `unid` — University ID (unique); doubles as the Duo username and the password-reset secret.
- `is_admin`, `can_assign` — the two permission flags.

There is no role table and no per-resource ACL; authorization is entirely these two booleans plus "is authenticated."

## 7.2 Password handling

- Hashing: `bcrypt.hashpw(password.encode(), bcrypt.gensalt())` (default cost ≈ 12). Plaintext is never stored.
- Verification: `bcrypt.checkpw(...)`.
- All credential input is run through `auth_service.sanitize_input` (strip, truncate to 255, `html.escape`) before use.

## 7.3 Login flow (`POST /login`)

```
sanitize(username,password)
   └─ verify_user_credentials(username,password)   # username lookup + bcrypt
        ├─ None  → flash 'Invalid credentials' → redirect /login
        └─ User  → if DEBUG_MODE:
                       create_user_session → flask_session['session_id'] → login_user → redirect /tasks
                   else:
                       asyncio.run(duo_authenticate(user.unid))
                          ├─ True  → create_user_session → login_user → redirect /tasks
                          └─ False → flash '2FA authentication failed' → redirect /login
```

Two side effects on success: a `Session` row is created (server-side) and Flask-Login sets its signed cookie (client-side). See §7.4.

## 7.4 The dual session model

There are **two** independent session mechanisms in play:

1. **Flask-Login's signed cookie.** `login_user(user)` stores the user's `id` in Flask's session cookie (signed with `SECRET_KEY`). On each request, `@login_manager.user_loader` (`load_user`) reloads the `User` via `User.query.get(int(user_id))`, populating `current_user`. This is what `@login_required` and `current_user` rely on.

2. **The server-side `sessioninfo` table.** `create_user_session(username)` writes a UUID row, and the UUID is also stored in `flask_session['session_id']`. This provides an auditable server-side record and supports `delete_old_sessions`.

In the current code, **authorization decisions use mechanism #1** (Flask-Login). Mechanism #2 is recorded but not consulted for access control. If you build admin tooling to revoke sessions, note that deleting a `sessioninfo` row does **not** invalidate the Flask-Login cookie by itself; you would also need to rotate `SECRET_KEY` or add a check against `sessioninfo` in a `before_request` hook.

Session lifetime: `PERMANENT_SESSION_LIFETIME = 7200` seconds (2 hours) is configured, but Flask only applies it to sessions marked permanent. The current login flow does not set `flask_session.permanent = True`, so browser-session cookie behavior remains the effective default unless that is changed. `delete_old_sessions(minutes=120)` purges old `sessioninfo` rows but is not scheduled by default.

## 7.5 Signup flow (`POST /signup`)

```
sanitize(username,password,unid)
   └─ reject if username exists
   └─ if DEBUG_MODE: create_user → redirect /login
      else: duo_authenticate(unid) → if allow: create_user → /login ; else flash → /signup
```

Because Duo runs against the supplied `unid` before the account is created, you cannot register an account for a uNID unless that uNID's Duo device approves. Signup does not log the user in; they must subsequently `/login`.

## 7.6 Password reset (`POST /resetpassword`)

```
sanitize(username,unid,new_password)
   └─ verify_user_unid(username,unid)   # both must match an existing row
        ├─ True  → update_user_password → flash success → /login
        └─ False → flash 'Invalid username or UNID' → /resetpassword
```

There is **no Duo step** in reset — the uNID is the sole secret. (Flagged in the known-issues file as weaker than login.)

## 7.7 Duo 2FA integration

`auth_service.duo_authenticate(unid)` (async):

```python
auth_api = duo_client.Auth(ikey=cfg['DUO_IKEY'], skey=cfg['DUO_SKEY'], host=cfg['DUO_HOST'])
response = await asyncio.to_thread(auth_api.auth, username=unid, factor='push', device='auto')
return response['result'] == 'allow'
```

- Sends a **push** to the user's auto-selected Duo device.
- The blocking `duo_client` call runs in a worker thread via `asyncio.to_thread`; blueprints invoke the coroutine with `asyncio.run(...)`.
- Returns `True` only on explicit `'allow'`. Any exception (missing creds, network, denial, timeout) logs and returns `False`.
- Bypassed entirely when `DEBUG_MODE` is `True`.

Required config: `DUO_IKEY`, `DUO_SKEY`, `DUO_HOST` (see `03`).

## 7.8 Authorization: decorators and checks

### `@login_required` (Flask-Login)
Applied to all browser-facing routes that require a session (tasks, machines, admin, logout). Unauthenticated requests are redirected to `auth.login` (`login_manager.login_view`) with the flash message configured in `create_app`.

### `@admin_required` (custom, `admin.py`)
```python
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not auth_service.is_user_admin(current_user.username):
            flash('You do not have permission to access this page', 'error')
            return redirect(url_for('tasks.index'))
        return f(*args, **kwargs)
    return decorated_function
```
Stacked **below** `@login_required` on every admin route, so the effective requirement is "authenticated AND `is_admin`."

### `can_assign` (inline check, `tasks.create_task`)
Not a decorator; checked in the view body:
```python
if not auth_service.can_user_assign(current_user.username):
    flash('You do not have permission to create tasks', 'error')
    return redirect(url_for('tasks.index'))
```

### Decorator ordering
```python
@admin_bp.route('/adminpanel')
@login_required        # outermost: runs first
@admin_required        # runs second
def admin_panel(): ...
```
Order matters: `@login_required` must precede `@admin_required` so unauthenticated users are redirected before `current_user.username` is dereferenced (an anonymous `current_user` has no meaningful `username`).

## 7.9 Authorization matrix

| Area | Requirement | Enforcement |
|------|-------------|-------------|
| `/login`, `/signup`, `/resetpassword` | none | public |
| `/logout` | authenticated | `@login_required` |
| `/tasks`, task actions, `/users` | authenticated | `@login_required` |
| `/createtasks` | authenticated + `can_assign` | `@login_required` + inline check |
| All `/adminpanel`, `/deleteUser`, `/toggle*` | authenticated + `is_admin` | `@login_required` + `@admin_required` |
| All machine routes | authenticated | `@login_required` |
| All `/api/*` device routes | none | public (perimeter trust) |
| All `/chem/*` routes | none | **public** (`login_required` imported but unused) |
| `/particle-demo/*` | none | public |

## 7.10 Transport & cookie security (summary)

- TLS terminated by nginx; Flask binds loopback only (see `09`).
- Session cookie flags (config): `Secure` (prod), `HttpOnly`, `SameSite=Lax`.
- `SECRET_KEY` signs the Flask-Login cookie; protect it. The dev default is unusable in production.

## 7.11 Practical guidance for the maintainer

- **To require login on the chem module**, add `@login_required` to the routes in `chem_inventory.py` (the import is already present). Decide whether read routes stay public; the write routes (`add`, `move`, `move-bulk`, `remove`, `edit-container`, `upload-scans`, `mark-printed`) are the priority.
- **To add a new permission**, add a boolean column to `User` (via migration), a `can_X(username)` helper in `auth_service`, and either a decorator (mirror `admin_required`) or an inline check.
- **To enforce server-side session revocation**, add a `before_request` that verifies `flask_session['session_id']` still exists in `sessioninfo` and matches `current_user`; otherwise `logout_user()`.
- **Never set `DEBUG_MODE=True` in production** — it disables 2FA for both login and signup.

Continue to 08-integrations-and-data-contracts.md (repo path: documentation/UNanofabTools/flaskserver/08-integrations-and-data-contracts.md).


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/04-Authentication-and-Login.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

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


# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/05-Admin-Panel.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 05 — Admin Panel

The admin panel is a tiny module for managing users: viewing the user list, deleting users, and toggling two boolean permissions (`is_admin` and `can_assign`). It is composed of two short files, `app/blueprints/admin.py` and `app/services/admin_service.py`, working together with the User model.

## The `admin_required` gate

Every admin route is protected by **two** decorators. Both must pass before the route handler runs.

```python
def admin_required(f):
    """Decorator to require admin access"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not auth_service.is_user_admin(current_user.username):
            flash('You do not have permission to access this page', 'error')
            return redirect(url_for('tasks.index'))
        return f(*args, **kwargs)
    return decorated_function
```

This is a custom decorator. Decorators in Python are functions that wrap other functions. Reading from the inside out:

- **`decorated_function`** is the new wrapper. When the wrapper is called, it first checks `auth_service.is_user_admin(current_user.username)`. If the user isn't an admin, it flashes an error and redirects them to the tasks page.
- **`@wraps(f)`** copies `f`'s name and docstring onto the wrapper so debugging tools see the original function rather than `decorated_function`.
- **`return f(*args, **kwargs)`** — if the admin check passed, run the original handler with whatever arguments came in.

In practice, each admin route is decorated like this:

```python
@admin_bp.route('/adminpanel')
@login_required
@admin_required
def admin_panel():
    ...
```

Order matters: `@login_required` runs *first* (outermost), so unauthenticated users are bounced before `@admin_required` is even consulted. `@admin_required` then refines that to "logged in **and** admin." This is a common layered-permissions pattern.

## The routes

### `/adminpanel` — show the user list

```python
@admin_bp.route('/adminpanel')
@login_required
@admin_required
def admin_panel():
    """Display admin panel"""
    users = admin_service.get_all_users()
    return render_template('adminpanel.html', users=users)
```

`get_all_users()` returns a list of every `User` row; the template renders them in a table with delete/toggle buttons.

### `/deleteUser` — DELETE-style action

```python
@admin_bp.route('/deleteUser', methods=['POST'])
@login_required
@admin_required
def delete_user():
    """Delete a user"""
    data = request.get_json()
    unid = data.get('uNID')

    if admin_service.delete_user(unid):
        return jsonify({'status': 'success', 'message': 'User deleted'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to delete user'}), 400
```

This route expects a JSON body — i.e., it's called from JavaScript (`fetch`) rather than a normal HTML form. The JS extracts the uNID of the user-to-delete from a table row and POSTs `{"uNID": "u12345"}`. The route delegates to `admin_service.delete_user(unid)` and returns a JSON status.

Note this is `POST /deleteUser` rather than `DELETE /users/<id>`, which would be more RESTful. The current style is fine; it's just slightly less idiomatic.

### `/toggleAdminStatus` and `/toggleAssign`

```python
@admin_bp.route('/toggleAdminStatus', methods=['POST'])
@login_required
@admin_required
def toggle_admin():
    """Toggle user admin status"""
    data = request.get_json()
    unid = data.get('uNID')

    if admin_service.toggle_admin_status(unid):
        return jsonify({'status': 'success', 'message': 'Admin status toggled'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to toggle admin status'}), 400


@admin_bp.route('/toggleAssign', methods=['POST'])
@login_required
@admin_required
def toggle_assign():
    """Toggle user task assignment privilege"""
    data = request.get_json()
    unid = data.get('uNID')

    if admin_service.toggle_assign_privilege(unid):
        return jsonify({'status': 'success', 'message': 'Assign privilege toggled'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to toggle assign privilege'}), 400
```

Same structure as `/deleteUser`, but for flipping the `is_admin` and `can_assign` flags. "Toggle" means: if it's `True`, set it to `False`, and vice-versa.

## The service

`admin_service.py` is even shorter than the blueprint — about 55 lines.

```python
def get_all_users():
    """Get all users"""
    return User.query.all()
```

Returns every row from the User table.

```python
def delete_user(unid):
    """Delete a user by UNID"""
    try:
        user = User.query.filter_by(unid=unid).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return True
        return False
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting user: {e}")
        return False
```

- Find the user by uNID.
- If found, queue a DELETE, commit, return `True`.
- If not found, return `False`.
- On any DB error, rollback and log.

```python
def toggle_admin_status(unid):
    """Toggle user admin status"""
    try:
        user = User.query.filter_by(unid=unid).first()
        if user:
            user.is_admin = not user.is_admin
            db.session.commit()
            return True
        return False
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error toggling admin status: {e}")
        return False


def toggle_assign_privilege(unid):
    """Toggle user task assignment privilege"""
    try:
        user = User.query.filter_by(unid=unid).first()
        if user:
            user.can_assign = not user.can_assign
            db.session.commit()
            return True
        return False
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error toggling assign privilege: {e}")
        return False
```

These two are near-clones. The key trick: `user.is_admin = not user.is_admin` flips the boolean in place; the next `commit()` makes that change permanent.

## How the table sees it

On the front end (`adminActions.js` in the JS files), the user table's "Delete," "Admin," and "Assign" buttons each call `fetch()` with the row's uNID, then update the row in the DOM based on the response.

This is a clear separation:

- **Server**: enforce the rules, persist changes.
- **Client (JavaScript)**: present buttons and update visuals.

That's it for admin. It is small on purpose — a single page with three actions, each gated behind a double permission check.

Next: `06-Tasks.md`.
