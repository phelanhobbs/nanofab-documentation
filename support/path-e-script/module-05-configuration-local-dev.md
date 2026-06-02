# Module 5 - Configuration And Local Development

## Goal

The maintainer understands configuration as an operational contract: environment variables, paths, database settings, Duo settings, local development behavior, and secret handling.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/flaskserver/slides/03-Configuration.pptx`](../../presentation/UNanofabTools/flaskserver/slides/03-Configuration.pptx)
- [`../../presentation/UNanofabTools/flaskserver/03-Configuration.md`](../../presentation/UNanofabTools/flaskserver/03-Configuration.md)
- [`../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md`](../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md)
- [`../../documentation/UNanofabTools/flaskserver/02-getting-started.md`](../../documentation/UNanofabTools/flaskserver/02-getting-started.md)
- `../UNanofabTools/config/config.py`

## Verbatim Script

READ ALOUD:

"Configuration is not decoration. Configuration determines what database files are used, where uploads go, whether Duo is enabled, how sessions behave, how large uploads can be, and how the app finds operational data. A maintainer who does not understand configuration will misdiagnose failures."

SHOW:

Open `03-Configuration.pptx`.

READ ALOUD:

"The live app uses environment-backed settings. Some settings are safe to document as values, such as non-secret paths or hostnames. Some settings are secret and must never be shown on screen or committed. We document key names and behavior. We do not document secret values."

SHOW:

Open [`../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md`](../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md).

READ ALOUD:

"This configuration reference should match the source. It should mention every environment variable used by `config.py`. If source uses an environment variable that the docs omit, a future maintainer may miss a required production setting. If docs list a variable source no longer uses, that is stale documentation."

## Source Demo

DO:

Run:

```sh
rg -n "os.getenv|CHEM_|DUO|SECRET|SESSION|SQLALCHEMY|UPLOAD|DATA" ../UNanofabTools/config
```

READ ALOUD:

"This command searches for configuration inputs. We are not reading `.env` secret values. We are reading the code that names the keys. This is safe and it is exactly how to verify docs against source."

SHOW:

Compare `../UNanofabTools/config/config.py` with [`../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md`](../../documentation/UNanofabTools/flaskserver/03-configuration-reference.md).

READ ALOUD:

"Pay special attention to `SECRET_KEY`, Duo settings, SQLAlchemy settings, upload/data paths, and chemical database settings. The chemical database is local on `nfhistory`, not an external database server. The relevant host is `127.0.0.1` in the live deployment. That fact affects firewall assumptions, backup assumptions, and restore planning."

## Local Development

READ ALOUD:

"Local development is a different environment from production. Development defaults are useful for getting started, but they are not a security model. A local app can use local files and development settings. Production must use strong secrets, correct database paths, correct Duo settings, and durable operational data paths."

SHOW:

Open [`../../documentation/UNanofabTools/flaskserver/02-getting-started.md`](../../documentation/UNanofabTools/flaskserver/02-getting-started.md).

READ ALOUD:

"The getting-started doc should let a maintainer create a local environment without guessing. If a step fails because dependencies changed or a file moved, that is documentation drift. The fix is not to memorize the workaround. The fix is to update the doc."

## Secret Boundary

READ ALOUD:

"When discussing `.env`, we show key names only. For example, it is acceptable to say there is a `SECRET_KEY` setting or a `CHEM_PGHOST` setting. It is not acceptable to show the secret value. For old hard-coded secrets found in source, the documentation should preserve the fact that the secret exists and should be rotated, but the GitHub documentation bundle must not contain the literal secret."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Which configuration values are secrets? | `SECRET_KEY`, Duo secrets/keys, database passwords, bearer tokens, WiFi passwords, private keys, and any credential-like value. |
| Which configuration values point to databases? | SQLAlchemy/SQLite settings plus chemical PostgreSQL settings such as `CHEM_*` variables. |
| Which values control session or login behavior? | `SECRET_KEY`, session/cookie settings, login/auth config, and Duo-related settings. |
| What breaks if chemical database settings are wrong? | Chemical inventory routes cannot connect correctly; reads/writes, barcode operations, reports, and inventory pages can fail or hit the wrong database. |
| Why is local PostgreSQL an important fact? | Backup, firewall, restore, service health, and troubleshooting assumptions depend on PostgreSQL running locally on `nfhistory`. |
| What can be safely shown from `.env`? | Key names and non-secret operational metadata, not values. |
| What must never be shown or committed? | Literal secret values, tokens, passwords, Duo secrets, private keys, session cookies, and database passwords. |

REQUIRE:

The maintainer can identify production-sensitive config without seeing secret values and can explain how to compare env-var docs against `config.py`.

## Stop Point

STOP POINT:

Stop here if source and docs disagree on configuration. Log the mismatch, update docs later, and do not proceed as if configuration is understood.
