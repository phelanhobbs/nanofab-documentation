# UNanofabTools Server — Developer Documentation

Formal technical documentation for the UNanofabTools Flask server. This is a developer handoff reference: it assumes familiarity with Python, Flask, SQL, and HTTP, and is intended to let a new maintainer operate and extend the server without further onboarding.

## Scope

This documentation covers the **modern Flask application** rooted at `app/`, together with its entry point (`run.py`), configuration (`config/`), database schema (`chem_schema.sql`, `chem_schema_migration_v2.sql`), and Alembic migrations (`migrations/`).

New development should target the `app/` package.

## Document index

| Doc | Title | Contents |
|-----|-------|----------|
| [01](01-architecture.md) | Architecture | System topology, tech stack, application-factory pattern, layering (blueprints / services / models), request flow, repository layout |
| [02](02-getting-started.md) | Getting Started | Local development setup: prerequisites, virtualenv, dependencies, environment, database initialization, running |
| [03](03-configuration-reference.md) | Configuration Reference | Every configuration key and environment variable, defaults, dev vs. production behavior |
| [04](04-database-schema.md) | Database Schema Reference | All SQLite models and the PostgreSQL chemical-inventory schema: tables, columns, types, constraints, relationships, views, sequences, and migrations |
| [05](05-http-api-reference.md) | HTTP API Reference | Every route: method, path, authentication, request parameters/body, response shape, status codes, and side effects |
| [06](06-service-layer-reference.md) | Service Layer Reference | Every service-module function: signature, parameters, return value, behavior, and exceptions |
| [07](07-authentication-and-authorization.md) | Authentication & Authorization | Login/signup/reset flows, Duo 2FA, server-side sessions, Flask-Login integration, the permission model, and the decorators |
| [08](08-integrations-and-data-contracts.md) | Integrations & Data Contracts | The JSON/CSV contracts with Raspberry Pi firmware and the NanofabToolkit desktop apps; the Duo and PostgreSQL integrations |
| [09](09-deployment-and-operations.md) | Deployment & Operations | Production runbook: WSGI serving, nginx reverse-proxy template, systemd unit template, TLS, PostgreSQL provisioning, on-disk data layout, log rotation, backups, and troubleshooting |
| [10](10-development-guide.md) | Development Guide | How to add a blueprint, model, service, migration, or template; project conventions; and extension recipes |

## Conventions used in this documentation

- File paths are given relative to the repository root unless otherwise noted.
- Code is quoted verbatim from the source so identifiers can be searched in the tree.
- "SQLite databases" refers to the four files under `instance/`; "the chem database" refers to the local PostgreSQL database (`postgresql@17-main` on the same host, bound to `127.0.0.1:5432`, confirmed by the live-server survey in [`../liveserver/README.md`](../liveserver/README.md) §10).
- HTTP examples use the production host `nfhistory.nanofab.utah.edu`.

## At-a-glance system summary

UNanofabTools is a Flask application serving three classes of client:

1. **Browsers** — lab staff using authenticated HTML pages (auth, tasks, admin, machine data, chemical inventory).
2. **Raspberry Pi devices** — unauthenticated JSON/CSV `POST` endpoints that ingest sensor and machine data.
3. **Desktop tools** (NanofabToolkit) — unauthenticated JSON/file `GET` endpoints that retrieve data for visualization.

Data is persisted to four SQLite databases (users, sessions, tasks, particle sensors), one PostgreSQL database (chemical inventory), and a tree of CSV files on disk (`LogData/`, `HSCDATA/`). TLS is terminated by nginx; Flask runs behind it on the loopback interface.

Start with [01-architecture.md](01-architecture.md) for the full picture.
