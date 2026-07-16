

# Source Reconstruction: UNanofabTools/chem_schema_migration_v3.sql

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `chem_schema_migration_v3.sql`
- Lines read: `53`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `5557d1d69c29181f`
- Code fence language: `sql`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

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

## Line-By-Line Reconstruction Notes

### Line 1

```text
-- chem_schema_migration_v3.sql
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 2

```text
-- Reconciles the committed schema with objects that were added to the live
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 3

```text
-- `cheminventory` database by hand over time (the "schema drift").
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 4

```text
--
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 5

```text
-- Idempotent: every statement uses IF NOT EXISTS, so this is a safe no-op on the
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 6

```text
-- live database and is required for fresh deployments so a rebuilt DB matches prod.
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 7

```text
-- Apply AFTER chem_schema.sql (v1) and chem_schema_migration_v2.sql.
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 8

```text
--
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 9

```text
-- Verified column-for-column against a live `pg_dump --schema-only` of production.
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 11

```text
BEGIN;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 13

```text
-- ===== containers: columns + indexes added in production =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 14

```text
ALTER TABLE containers ADD COLUMN IF NOT EXISTS last_scan_at        TIMESTAMPTZ;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 15

```text
ALTER TABLE containers ADD COLUMN IF NOT EXISTS expiration_date     DATE;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 16

```text
ALTER TABLE containers ADD COLUMN IF NOT EXISTS barcode_printed     BOOLEAN NOT NULL DEFAULT FALSE;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 17

```text
ALTER TABLE containers ADD COLUMN IF NOT EXISTS barcode_printed_at  TIMESTAMPTZ;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 18

```text
ALTER TABLE containers ADD COLUMN IF NOT EXISTS barcode_print_batch TEXT;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 19

```text
ALTER TABLE containers ADD COLUMN IF NOT EXISTS label_printed_by    TEXT;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 20

```text
CREATE INDEX IF NOT EXISTS idx_containers_last_scan_at    ON containers (last_scan_at DESC);
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 21

```text
CREATE INDEX IF NOT EXISTS idx_containers_barcode_printed ON containers (barcode_printed);
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 23

```text
-- ===== inventory_cycles: scan-report columns added in production =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 24

```text
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS report_name     TEXT;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 25

```text
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS location        TEXT;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 26

```text
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS total_scanned   INTEGER DEFAULT 0;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 27

```text
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS matched_count   INTEGER DEFAULT 0;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 28

```text
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS unmatched_count INTEGER DEFAULT 0;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 29

```text
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS created_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT now();
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 30

```text
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS filename        TEXT;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 31

```text
ALTER TABLE inventory_cycles ADD COLUMN IF NOT EXISTS performed_by    TEXT;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 33

```text
-- ===== scan_raw / container_scans: barcode column added in production =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 34

```text
ALTER TABLE scan_raw        ADD COLUMN IF NOT EXISTS barcode TEXT;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 35

```text
ALTER TABLE container_scans ADD COLUMN IF NOT EXISTS barcode TEXT;
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 37

```text
-- ===== transactions: audit-trail table added in production =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 38

```text
-- IMPORTANT: `details` is TEXT (the app stores json.dumps(...) as a string and
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 39

```text
-- reads it back with `details::json->>...`; keeping it TEXT is also what makes the
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 40

```text
-- transaction-search `COALESCE(details,'') ILIKE ...` valid). Do NOT make it JSONB.
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 41

```text
CREATE TABLE IF NOT EXISTS transactions (
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 42

```text
    transaction_id SERIAL PRIMARY KEY,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 43

```text
    action         TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 44

```text
    container_id   INTEGER,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 45

```text
    barcode        TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 46

```text
    item_id        INTEGER,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 47

```text
    room_id        INTEGER,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 48

```text
    details        TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 49

```text
    performed_by   TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 50

```text
    created_at     TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 51

```text
);
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 53

```text
COMMIT;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/chem_schema_migration_v3.sql`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
