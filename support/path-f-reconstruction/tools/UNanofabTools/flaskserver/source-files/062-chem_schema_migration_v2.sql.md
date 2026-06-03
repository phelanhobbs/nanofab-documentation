

# Source Reconstruction: UNanofabTools/chem_schema_migration_v2.sql

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `chem_schema_migration_v2.sql`
- Lines read: `92`
- Dirty in working tree at generation time: `yes`
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

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 1 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `none` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
-- Adds barcode printing support, room_name field, and added_by tracking
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 2 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
-- Run this against an existing database to add new columns
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 3 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 4 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
BEGIN;
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 5 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 6 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
-- Add new columns to rooms table
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 7 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
ALTER TABLE rooms
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 8 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
  ADD COLUMN IF NOT EXISTS room_no TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 9 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `schema` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
  ADD COLUMN IF NOT EXISTS room_name TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 10 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
  ADD COLUMN IF NOT EXISTS room_desc TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 11 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
  ADD COLUMN IF NOT EXISTS area_class TEXT;
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 12 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 13 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
-- Required by chem_service.resolve_room_id(), which upserts with
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 14 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
-- ON CONFLICT (room_no). PostgreSQL needs a matching unique index.
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 15 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
CREATE UNIQUE INDEX IF NOT EXISTS idx_rooms_room_no_unique ON rooms(room_no);
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 16 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 17 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
-- Add new columns to containers table
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 18 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
ALTER TABLE containers
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 19 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
  ADD COLUMN IF NOT EXISTS added_by TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 20 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `schema` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 21 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
  ADD COLUMN IF NOT EXISTS label_printed BOOLEAN DEFAULT FALSE,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 22 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
  ADD COLUMN IF NOT EXISTS label_printed_at TIMESTAMPTZ;
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 23 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 24 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
-- Add index for label_printed column (used for barcode queue filtering)
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 25 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
CREATE INDEX IF NOT EXISTS idx_containers_label_printed ON containers(label_printed);
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 26 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 27 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `schema` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
-- Update the inventory_view to include new fields
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 28 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `blank` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
CREATE OR REPLACE VIEW inventory_view AS
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 29 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
SELECT
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 30 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
  c.container_id,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 31 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
  c.barcode,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 32 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
  c.container_code,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 33 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
  c.entry_date AS inv_date,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 34 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
  c.area_class,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 35 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
  r.room_no,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 36 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
  r.room_name,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 37 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
  r.room_desc,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 38 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
  c.storage_location,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 39 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
  c.storage_sublocation,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 40 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
  c.storage_device,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 41 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
  i.name AS material_name,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 42 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
  i.name AS item_name,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 43 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
  i.description AS item_description,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 44 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
  c.size,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 45 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
  c.unit,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 46 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
  c.system,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 47 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
  v.vendor_name AS vendor,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 48 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
  c.lot_number,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 49 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
  c.manuf_date,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 50 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
  c.expiry_date AS exp_date,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 51 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
  c.choice,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 52 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
  c.nmr,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 53 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
  c.nmr_expiry AS nmr_exp,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 54 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
  c.owner,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 55 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
  c.notes,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 56 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
  c.status,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 57 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
  cat.name AS category,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 58 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
  c.added_by,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 59 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
  c.created_at,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 60 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
  c.label_printed,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 61 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
  c.label_printed_at
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 62 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
FROM containers c
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 63 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
JOIN items i ON i.item_id = c.item_id
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 64 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
LEFT JOIN vendors v ON v.vendor_id = i.vendor_id
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 65 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
LEFT JOIN rooms r ON r.room_id = c.room_id
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 66 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
LEFT JOIN categories cat ON cat.category_id = i.category_id;
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 67 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 68 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
-- Update the v_all_containers view as well
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 69 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `blank` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
CREATE OR REPLACE VIEW v_all_containers AS
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 70 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
SELECT
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 71 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
  c.container_id, c.barcode, c.container_code, c.status,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 72 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
  i.description, i.catalog_number, i.physical_state, i.volume_size,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 73 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
  v.vendor_name,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 74 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
  r.room_no, r.room_name, r.room_desc, r.area_class,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 75 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
  c.entry_date, c.expiry_date,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 76 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
  c.legacy_inventory_no, c.added_by, c.created_at,
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 77 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
  c.label_printed, c.label_printed_at
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 78 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
FROM containers c
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 79 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
JOIN items i         ON i.item_id  = c.item_id
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 80 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
LEFT JOIN vendors v  ON v.vendor_id = i.vendor_id
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 81 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
LEFT JOIN rooms r    ON r.room_id   = c.room_id;
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 82 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 83 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
COMMIT;
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 84 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 85 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
-- Migration notes:
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 86 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
-- 1. This script is idempotent - safe to run multiple times
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 87 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
-- 2. Uses "ADD COLUMN IF NOT EXISTS" to avoid errors if columns already exist
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 88 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
-- 3. All new columns are nullable to allow existing data to remain valid
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 89 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
-- 4. Default values: label_printed=FALSE, created_at=NOW()
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 90 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
-- 5. Existing containers will have NULL for added_by until edited
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 91 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
-- 6. Run this before using the new barcode printing features
```

Reconstruction rule: in `UNanofabTools/chem_schema_migration_v2.sql`, line 92 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



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
