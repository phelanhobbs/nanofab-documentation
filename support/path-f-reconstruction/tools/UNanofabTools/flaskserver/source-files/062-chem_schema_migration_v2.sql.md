

# Source Reconstruction: UNanofabTools/chem_schema_migration_v2.sql

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `chem_schema_migration_v2.sql`
- Lines read: `92`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `0cb5061a86284021`
- Code fence language: `sql`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```sql
-- Migration script to upgrade existing chemical inventory database to v2
-- Adds barcode printing support, room_name field, and added_by tracking
-- Run this against an existing database to add new columns

BEGIN;

-- Add new columns to rooms table
ALTER TABLE rooms
  ADD COLUMN IF NOT EXISTS room_no TEXT,
  ADD COLUMN IF NOT EXISTS room_name TEXT,
  ADD COLUMN IF NOT EXISTS room_desc TEXT,
  ADD COLUMN IF NOT EXISTS area_class TEXT;

-- Required by chem_service.resolve_room_id(), which upserts with
-- ON CONFLICT (room_no). PostgreSQL needs a matching unique index.
CREATE UNIQUE INDEX IF NOT EXISTS idx_rooms_room_no_unique ON rooms(room_no);

-- Add new columns to containers table
ALTER TABLE containers
  ADD COLUMN IF NOT EXISTS added_by TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS label_printed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS label_printed_at TIMESTAMPTZ;

-- Add index for label_printed column (used for barcode queue filtering)
CREATE INDEX IF NOT EXISTS idx_containers_label_printed ON containers(label_printed);

-- Update the inventory_view to include new fields
CREATE OR REPLACE VIEW inventory_view AS
SELECT
  c.container_id,
  c.barcode,
  c.container_code,
  c.entry_date AS inv_date,
  c.area_class,
  r.room_no,
  r.room_name,
  r.room_desc,
  c.storage_location,
  c.storage_sublocation,
  c.storage_device,
  i.name AS material_name,
  i.name AS item_name,
  i.description AS item_description,
  c.size,
  c.unit,
  c.system,
  v.vendor_name AS vendor,
  c.lot_number,
  c.manuf_date,
  c.expiry_date AS exp_date,
  c.choice,
  c.nmr,
  c.nmr_expiry AS nmr_exp,
  c.owner,
  c.notes,
  c.status,
  cat.name AS category,
  c.added_by,
  c.created_at,
  c.label_printed,
  c.label_printed_at
FROM containers c
JOIN items i ON i.item_id = c.item_id
LEFT JOIN vendors v ON v.vendor_id = i.vendor_id
LEFT JOIN rooms r ON r.room_id = c.room_id
LEFT JOIN categories cat ON cat.category_id = i.category_id;

-- Update the v_all_containers view as well
CREATE OR REPLACE VIEW v_all_containers AS
SELECT
  c.container_id, c.barcode, c.container_code, c.status,
  i.description, i.catalog_number, i.physical_state, i.volume_size,
  v.vendor_name,
  r.room_no, r.room_name, r.room_desc, r.area_class,
  c.entry_date, c.expiry_date,
  c.legacy_inventory_no, c.added_by, c.created_at,
  c.label_printed, c.label_printed_at
FROM containers c
JOIN items i         ON i.item_id  = c.item_id
LEFT JOIN vendors v  ON v.vendor_id = i.vendor_id
LEFT JOIN rooms r    ON r.room_id   = c.room_id;

COMMIT;

-- Migration notes:
-- 1. This script is idempotent - safe to run multiple times
-- 2. Uses "ADD COLUMN IF NOT EXISTS" to avoid errors if columns already exist
-- 3. All new columns are nullable to allow existing data to remain valid
-- 4. Default values: label_printed=FALSE, created_at=NOW()
-- 5. Existing containers will have NULL for added_by until edited
-- 6. Run this before using the new barcode printing features
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
-- Migration script to upgrade existing chemical inventory database to v2
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 2

```text
-- Adds barcode printing support, room_name field, and added_by tracking
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 3

```text
-- Run this against an existing database to add new columns
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 5

```text
BEGIN;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 7

```text
-- Add new columns to rooms table
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 8

```text
ALTER TABLE rooms
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 9

```text
  ADD COLUMN IF NOT EXISTS room_no TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 10

```text
  ADD COLUMN IF NOT EXISTS room_name TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 11

```text
  ADD COLUMN IF NOT EXISTS room_desc TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 12

```text
  ADD COLUMN IF NOT EXISTS area_class TEXT;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 14

```text
-- Required by chem_service.resolve_room_id(), which upserts with
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 15

```text
-- ON CONFLICT (room_no). PostgreSQL needs a matching unique index.
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 16

```text
CREATE UNIQUE INDEX IF NOT EXISTS idx_rooms_room_no_unique ON rooms(room_no);
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 18

```text
-- Add new columns to containers table
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 19

```text
ALTER TABLE containers
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 20

```text
  ADD COLUMN IF NOT EXISTS added_by TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 21

```text
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 22

```text
  ADD COLUMN IF NOT EXISTS label_printed BOOLEAN DEFAULT FALSE,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 23

```text
  ADD COLUMN IF NOT EXISTS label_printed_at TIMESTAMPTZ;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 25

```text
-- Add index for label_printed column (used for barcode queue filtering)
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 26

```text
CREATE INDEX IF NOT EXISTS idx_containers_label_printed ON containers(label_printed);
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 28

```text
-- Update the inventory_view to include new fields
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 29

```text
CREATE OR REPLACE VIEW inventory_view AS
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 30

```text
SELECT
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 31

```text
  c.container_id,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 32

```text
  c.barcode,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 33

```text
  c.container_code,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 34

```text
  c.entry_date AS inv_date,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 35

```text
  c.area_class,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 36

```text
  r.room_no,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 37

```text
  r.room_name,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 38

```text
  r.room_desc,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 39

```text
  c.storage_location,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 40

```text
  c.storage_sublocation,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 41

```text
  c.storage_device,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 42

```text
  i.name AS material_name,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 43

```text
  i.name AS item_name,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 44

```text
  i.description AS item_description,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 45

```text
  c.size,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 46

```text
  c.unit,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 47

```text
  c.system,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 48

```text
  v.vendor_name AS vendor,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 49

```text
  c.lot_number,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 50

```text
  c.manuf_date,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 51

```text
  c.expiry_date AS exp_date,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 52

```text
  c.choice,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 53

```text
  c.nmr,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 54

```text
  c.nmr_expiry AS nmr_exp,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 55

```text
  c.owner,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 56

```text
  c.notes,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 57

```text
  c.status,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 58

```text
  cat.name AS category,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 59

```text
  c.added_by,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 60

```text
  c.created_at,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 61

```text
  c.label_printed,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 62

```text
  c.label_printed_at
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 63

```text
FROM containers c
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 64

```text
JOIN items i ON i.item_id = c.item_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 65

```text
LEFT JOIN vendors v ON v.vendor_id = i.vendor_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 66

```text
LEFT JOIN rooms r ON r.room_id = c.room_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 67

```text
LEFT JOIN categories cat ON cat.category_id = i.category_id;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 69

```text
-- Update the v_all_containers view as well
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 70

```text
CREATE OR REPLACE VIEW v_all_containers AS
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 71

```text
SELECT
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 72

```text
  c.container_id, c.barcode, c.container_code, c.status,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 73

```text
  i.description, i.catalog_number, i.physical_state, i.volume_size,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 74

```text
  v.vendor_name,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 75

```text
  r.room_no, r.room_name, r.room_desc, r.area_class,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 76

```text
  c.entry_date, c.expiry_date,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 77

```text
  c.legacy_inventory_no, c.added_by, c.created_at,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 78

```text
  c.label_printed, c.label_printed_at
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 79

```text
FROM containers c
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 80

```text
JOIN items i         ON i.item_id  = c.item_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 81

```text
LEFT JOIN vendors v  ON v.vendor_id = i.vendor_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 82

```text
LEFT JOIN rooms r    ON r.room_id   = c.room_id;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 84

```text
COMMIT;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 86

```text
-- Migration notes:
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 87

```text
-- 1. This script is idempotent - safe to run multiple times
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 88

```text
-- 2. Uses "ADD COLUMN IF NOT EXISTS" to avoid errors if columns already exist
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 89

```text
-- 3. All new columns are nullable to allow existing data to remain valid
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 90

```text
-- 4. Default values: label_printed=FALSE, created_at=NOW()
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 91

```text
-- 5. Existing containers will have NULL for added_by until edited
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 92

```text
-- 6. Run this before using the new barcode printing features
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/chem_schema_migration_v2.sql`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
