# Minimum Acceptable Full Path E - Module 06: Authentication And Admin

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Expanded Module 06: Authentication And Admin

READ ALOUD:

This expanded section revisits Module 06, Authentication And Admin. The focus is login, authorization, Duo, admin guards, and password handling. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 06

READ ALOUD:

We are now doing the orientation pass for Authentication And Admin. The maintainer should connect this module to login, authorization, Duo, admin guards, and password handling. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

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

- The corresponding slide deck from the Path E deck order.
- The matching layman README.
- The matching developer reference.
- The matching known-issues file if the module has one.
- The source repo path if this pass requires code evidence.

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

Continue to 08-integrations-and-data-contracts.md (reference path: 08-integrations-and-data-contracts.md).
