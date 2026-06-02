# Module 6 - Authentication, Authorization, And Admin

## Goal

The maintainer understands how users log in, how sessions work, where Duo fits, how admin powers are guarded, and which authentication or authorization gaps require careful maintenance.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx`](../../presentation/UNanofabTools/flaskserver/slides/04-Authentication-and-Login.pptx)
- [`../../presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx`](../../presentation/UNanofabTools/flaskserver/slides/05-Admin-Panel.pptx)
- [`../../presentation/UNanofabTools/flaskserver/04-Authentication-and-Login.md`](../../presentation/UNanofabTools/flaskserver/04-Authentication-and-Login.md)
- [`../../presentation/UNanofabTools/flaskserver/05-Admin-Panel.md`](../../presentation/UNanofabTools/flaskserver/05-Admin-Panel.md)
- [`../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md`](../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md)

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

Open [`../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md`](../../documentation/UNanofabTools/flaskserver/07-authentication-and-authorization.md).

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
