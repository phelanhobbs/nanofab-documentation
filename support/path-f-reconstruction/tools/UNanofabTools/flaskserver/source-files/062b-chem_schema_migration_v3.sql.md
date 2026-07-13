

# Source Reconstruction: UNanofabTools/chem_schema_migration_v3.sql

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

> **Manually added supplement (2026-06-29).** This page was inserted by hand after `chem_schema_migration_v3.sql` was committed to `UNanofabTools` (commit `313e495`); the generated Path F corpus predates it. The filename carries a `b` suffix so the surrounding source pages are not renumbered — the next full `build_path_f.py` run will fold this file into the normal sequence and update `SOURCE-MANIFEST.json` / `WORDCOUNT.md`. No secret-looking literals are present in this file, so nothing is redacted.

- Repository: `UNanofabTools`
- Relative path: `chem_schema_migration_v3.sql`
- Source commit: `313e495` (2026-06-29)
- Code fence language: `sql`

## Reconstruction Purpose

`chem_schema_migration_v3.sql` reconciles the committed chem schema with objects that had been added to the live `cheminventory` PostgreSQL database by hand over time (the "schema drift"). It is idempotent (`IF NOT EXISTS` on every statement), so it is a safe no-op on the live database and a required step for any fresh rebuild so the rebuilt DB matches production. Apply it **after** `chem_schema.sql` (v1) and `chem_schema_migration_v2.sql` (v2); `init_chem_db.py` does this automatically (v1 → v2 → v3). It was verified column-for-column against a live `pg_dump --schema-only` of production.

Key reconstruction facts that must survive a rewrite:

- `transactions.details` is **`TEXT`**, not JSONB — the app stores `json.dumps(...)` as a string and reads it back with `details::json->>...`, and the transaction search uses `COALESCE(details,'') ILIKE ...`. Do not "upgrade" it to JSONB.
- `containers` gains `last_scan_at`, `expiration_date`, and the barcode-print columns (`barcode_printed`, `barcode_printed_at`, `barcode_print_batch`, `label_printed_by`) plus two indexes.
- `inventory_cycles` gains the scan-report columns (`report_name, location, total_scanned, matched_count, unmatched_count, created_at, filename, performed_by`).
- `scan_raw` and `container_scans` each gain a `barcode` column.
- The whole `transactions` audit table is created here.

## Sanitized Source

```sql
-- chem_schema_migration_v3.sql
-- Reconciles the committed schema with objects that were added to the live
-- `cheminventory` database by hand over time (the "schema drift").
--
-- Idempotent: every statement uses IF NOT EXISTS, so this is a safe no-op on the
-- live database and is required for fresh deployments so a rebuilt DB matches prod.
-- Apply AFTER chem_schema.sql (v1) and chem_schema_migration_v2.sql.
--
-- Verified column-for-column against a live `pg_dump --schema-only` of production.

BEGIN;

-- ===== containers: columns + indexes added in production =====
ALTER TABLE containers ADD COLUMN IF NOT EXISTS last_scan_at        TIMESTAMPTZ;
ALTER TABLE containers ADD COLUMN IF NOT EXISTS expiration_date     DATE;
ALTER TABLE containers ADD COLUMN IF NOT EXISTS barcode_printed     BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE containers ADD COLUMN IF NOT EXISTS barcode_printed_at  TIMESTAMPTZ;
ALTER TABLE containers ADD COLUMN IF NOT EXISTS barcode_print_batch TEXT;
ALTER TABLE containers ADD COLUMN IF NOT EXISTS label_printed_by    TEXT;
CREATE INDEX IF NOT EXISTS idx_containers_last_scan_at    ON containers (last_scan_at DESC);
CREATE INDEX IF NOT EXISTS idx_containers_barcode_printed ON containers (barcode_printed);

-- ===== inventory_cycles: scan-report columns added in production =====
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS report_name     TEXT;
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS location        TEXT;
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS total_scanned   INTEGER DEFAULT 0;
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS matched_count   INTEGER DEFAULT 0;
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS unmatched_count INTEGER DEFAULT 0;
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS created_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT now();
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS filename        TEXT;
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS performed_by    TEXT;

-- ===== scan_raw / container_scans: barcode column added in production =====
ALTER TABLE scan_raw        ADD COLUMN IF NOT EXISTS barcode TEXT;
ALTER TABLE container_scans ADD COLUMN IF NOT EXISTS barcode TEXT;

-- ===== transactions: audit-trail table added in production =====
-- IMPORTANT: `details` is TEXT (the app stores json.dumps(...) as a string and
-- reads it back with `details::json->>...`; keeping it TEXT is also what makes the
-- transaction-search `COALESCE(details,'') ILIKE ...` valid). Do NOT make it JSONB.
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id SERIAL PRIMARY KEY,
    action         TEXT,
    container_id   INTEGER,
    barcode        TEXT,
    item_id        INTEGER,
    room_id        INTEGER,
    details        TEXT,
    performed_by   TEXT,
    created_at     TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

COMMIT;
```

## Edge cases to test

- Re-running v3 on a database that already has these objects must be a no-op (idempotency) — verified on prod 2026-06-29 ("already exists, skipping", clean COMMIT).
- A fresh build via `init_chem_db.py` (v1→v2→v3) must reproduce all five chem tables with matching columns/types.
- Do not reorder: v3 assumes the v1 tables and v2 columns already exist.
