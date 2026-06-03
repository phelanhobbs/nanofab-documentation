

# Source Reconstruction: UNanofabTools/chem_schema.sql

- Repository: `UNanofabTools`
- Relative path: `chem_schema.sql`
- Lines read: `192`
- Dirty in working tree at generation time: `yes`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `f76bb65268eaece3`
- Code fence language: `sql`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```sql
-- Enhanced Chemical Inventory Schema (v2 with barcode printing support)
-- Includes inventory_view for the Flask application

BEGIN;

-- ===== SEQUENCE for system-generated barcodes =====
CREATE SEQUENCE IF NOT EXISTS seq_barcode
  START WITH 100001 INCREMENT BY 1 NO MINVALUE NO MAXVALUE;

-- ===== LOOKUPS =====
CREATE TABLE IF NOT EXISTS categories (
  category_id SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS vendors (
  vendor_id   SERIAL PRIMARY KEY,
  vendor_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS rooms (
  room_id     SERIAL PRIMARY KEY,
  room_no     TEXT,
  room_name   TEXT,
  room_desc   TEXT,
  area_class  TEXT,
  building    TEXT,
  lab_code    TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_rooms_room_no_unique ON rooms(room_no);

-- ===== ITEMS (chemical definitions) =====
CREATE TABLE IF NOT EXISTS items (
  item_id        SERIAL PRIMARY KEY,
  name           TEXT NOT NULL UNIQUE,
  description    TEXT NOT NULL,
  catalog_number TEXT,
  physical_state TEXT,
  volume_size    TEXT,
  category_id    INTEGER NOT NULL REFERENCES categories(category_id)
                   ON UPDATE CASCADE ON DELETE RESTRICT,
  vendor_id      INTEGER REFERENCES vendors(vendor_id)
                   ON UPDATE CASCADE ON DELETE SET NULL
);

-- ===== CONTAINERS (individual bottles) =====
CREATE TABLE IF NOT EXISTS containers (
  container_id       BIGSERIAL PRIMARY KEY,
  item_id            INTEGER NOT NULL REFERENCES items(item_id)
                        ON UPDATE CASCADE ON DELETE CASCADE,
  barcode            TEXT NOT NULL UNIQUE,
  container_code     TEXT NOT NULL UNIQUE,
  room_id            INTEGER REFERENCES rooms(room_id)
                        ON UPDATE CASCADE ON DELETE SET NULL,
  entry_date         DATE,
  manuf_date         DATE,
  expiry_date        DATE,
  area_class         TEXT,
  storage_location   TEXT,
  storage_sublocation TEXT,
  storage_device     TEXT,
  system             TEXT,
  lot_number         TEXT,
  choice             TEXT,
  nmr                TEXT,
  nmr_expiry         DATE,
  owner              TEXT,
  notes              TEXT,
  status             TEXT NOT NULL DEFAULT 'Active',
  size               TEXT,
  unit               TEXT,
  legacy_inventory_no TEXT,
  added_by           TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  label_printed      BOOLEAN DEFAULT FALSE,
  label_printed_at   TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_containers_item   ON containers(item_id);
CREATE INDEX IF NOT EXISTS idx_containers_room   ON containers(room_id);
CREATE INDEX IF NOT EXISTS idx_containers_status ON containers(status);
CREATE INDEX IF NOT EXISTS idx_containers_label_printed ON containers(label_printed);

-- ===== INVENTORY CYCLES & SCANS =====
CREATE TABLE IF NOT EXISTS inventory_cycles (
  cycle_id   SERIAL PRIMARY KEY,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at   TIMESTAMPTZ,
  created_by TEXT
);

CREATE TABLE IF NOT EXISTS scan_raw (
  raw_id       BIGSERIAL PRIMARY KEY,
  cycle_id     INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id)
                 ON UPDATE CASCADE ON DELETE CASCADE,
  raw_code     TEXT NOT NULL,
  import_ts    TIMESTAMPTZ NOT NULL DEFAULT now(),
  matched_container_id BIGINT REFERENCES containers(container_id)
                 ON UPDATE CASCADE ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_scan_raw_cycle ON scan_raw(cycle_id);
CREATE INDEX IF NOT EXISTS idx_scan_raw_code  ON scan_raw(raw_code);

CREATE TABLE IF NOT EXISTS container_scans (
  scan_id      BIGSERIAL PRIMARY KEY,
  cycle_id     INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id)
                 ON UPDATE CASCADE ON DELETE CASCADE,
  container_id BIGINT NOT NULL REFERENCES containers(container_id)
                 ON UPDATE CASCADE ON DELETE CASCADE,
  scan_ts      TIMESTAMPTZ NOT NULL DEFAULT now(),
  source       TEXT,
  status       TEXT NOT NULL CHECK (status IN ('FOUND','NEW')),
  UNIQUE (cycle_id, container_id)
);

-- ===== VIEWS =====
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

CREATE OR REPLACE VIEW v_cycle_report AS
SELECT
  cy.cycle_id,
  cy.started_at,
  COUNT(DISTINCT CASE WHEN cs.status='FOUND' THEN cs.container_id END) AS found_count,
  COUNT(DISTINCT CASE WHEN cs.status='NEW'   THEN cs.container_id END) AS new_count,
  (SELECT COUNT(*) FROM containers c WHERE c.status='Active'
    AND NOT EXISTS (
      SELECT 1 FROM container_scans cs2
      WHERE cs2.cycle_id=cy.cycle_id AND cs2.container_id=c.container_id
    )
  ) AS missing_count
FROM inventory_cycles cy
LEFT JOIN container_scans cs ON cs.cycle_id = cy.cycle_id
GROUP BY cy.cycle_id, cy.started_at
ORDER BY cy.started_at DESC;

-- ===== MAIN INVENTORY VIEW (for Flask app) =====
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

-- ===== SEED =====
INSERT INTO categories(name) VALUES ('Chemicals')
ON CONFLICT (name) DO NOTHING;

COMMIT;
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
-- Enhanced Chemical Inventory Schema (v2 with barcode printing support)
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 1 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `none` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
-- Includes inventory_view for the Flask application
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 2 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 3 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
BEGIN;
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 4 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 5 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
-- ===== SEQUENCE for system-generated barcodes =====
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 6 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
CREATE SEQUENCE IF NOT EXISTS seq_barcode
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 7 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
  START WITH 100001 INCREMENT BY 1 NO MINVALUE NO MAXVALUE;
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 8 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 9 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
-- ===== LOOKUPS =====
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 10 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
CREATE TABLE IF NOT EXISTS categories (
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 11 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
  category_id SERIAL PRIMARY KEY,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 12 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `schema` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
  name        TEXT NOT NULL UNIQUE
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 13 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 14 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 15 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
CREATE TABLE IF NOT EXISTS vendors (
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 16 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `blank` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
  vendor_id   SERIAL PRIMARY KEY,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 17 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `schema` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
  vendor_name TEXT NOT NULL UNIQUE
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 18 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 19 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 20 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
CREATE TABLE IF NOT EXISTS rooms (
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 21 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `blank` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
  room_id     SERIAL PRIMARY KEY,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 22 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `schema` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
  room_no     TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 23 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
  room_name   TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 24 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
  room_desc   TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 25 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
  area_class  TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 26 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
  building    TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 27 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
  lab_code    TEXT
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 28 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 29 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
CREATE UNIQUE INDEX IF NOT EXISTS idx_rooms_room_no_unique ON rooms(room_no);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 30 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 31 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
-- ===== ITEMS (chemical definitions) =====
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 32 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
CREATE TABLE IF NOT EXISTS items (
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 33 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
  item_id        SERIAL PRIMARY KEY,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 34 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `schema` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
  name           TEXT NOT NULL UNIQUE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 35 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
  description    TEXT NOT NULL,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 36 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
  catalog_number TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 37 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
  physical_state TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 38 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
  volume_size    TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 39 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
  category_id    INTEGER NOT NULL REFERENCES categories(category_id)
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 40 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
                   ON UPDATE CASCADE ON DELETE RESTRICT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 41 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
  vendor_id      INTEGER REFERENCES vendors(vendor_id)
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 42 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
                   ON UPDATE CASCADE ON DELETE SET NULL
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 43 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 44 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 45 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
-- ===== CONTAINERS (individual bottles) =====
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 46 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
CREATE TABLE IF NOT EXISTS containers (
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 47 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
  container_id       BIGSERIAL PRIMARY KEY,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 48 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `schema` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
  item_id            INTEGER NOT NULL REFERENCES items(item_id)
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 49 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
                        ON UPDATE CASCADE ON DELETE CASCADE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 50 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
  barcode            TEXT NOT NULL UNIQUE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 51 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
  container_code     TEXT NOT NULL UNIQUE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 52 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
  room_id            INTEGER REFERENCES rooms(room_id)
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 53 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
                        ON UPDATE CASCADE ON DELETE SET NULL,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 54 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
  entry_date         DATE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 55 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
  manuf_date         DATE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 56 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
  expiry_date        DATE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 57 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
  area_class         TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 58 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
  storage_location   TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 59 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
  storage_sublocation TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 60 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
  storage_device     TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 61 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
  system             TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 62 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
  lot_number         TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 63 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
  choice             TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 64 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
  nmr                TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 65 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
  nmr_expiry         DATE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 66 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
  owner              TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 67 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
  notes              TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 68 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
  status             TEXT NOT NULL DEFAULT 'Active',
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 69 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
  size               TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 70 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
  unit               TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 71 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
  legacy_inventory_no TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 72 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
  added_by           TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 73 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
  created_at         TIMESTAMPTZ DEFAULT NOW(),
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 74 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
  label_printed      BOOLEAN DEFAULT FALSE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 75 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
  label_printed_at   TIMESTAMPTZ
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 76 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 77 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
CREATE INDEX IF NOT EXISTS idx_containers_item   ON containers(item_id);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 78 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `sql` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
CREATE INDEX IF NOT EXISTS idx_containers_room   ON containers(room_id);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 79 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `schema` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
CREATE INDEX IF NOT EXISTS idx_containers_status ON containers(status);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 80 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `schema` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
CREATE INDEX IF NOT EXISTS idx_containers_label_printed ON containers(label_printed);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 81 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `schema` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 82 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `schema` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
-- ===== INVENTORY CYCLES & SCANS =====
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 83 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
CREATE TABLE IF NOT EXISTS inventory_cycles (
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 84 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
  cycle_id   SERIAL PRIMARY KEY,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 85 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `schema` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 86 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
  ended_at   TIMESTAMPTZ,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 87 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
  created_by TEXT
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 88 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 89 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 90 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
CREATE TABLE IF NOT EXISTS scan_raw (
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 91 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `blank` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
  raw_id       BIGSERIAL PRIMARY KEY,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 92 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `schema` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
  cycle_id     INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id)
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 93 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
                 ON UPDATE CASCADE ON DELETE CASCADE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 94 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
  raw_code     TEXT NOT NULL,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 95 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
  import_ts    TIMESTAMPTZ NOT NULL DEFAULT now(),
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 96 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
  matched_container_id BIGINT REFERENCES containers(container_id)
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 97 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
                 ON UPDATE CASCADE ON DELETE SET NULL
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 98 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 99 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
CREATE INDEX IF NOT EXISTS idx_scan_raw_cycle ON scan_raw(cycle_id);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 100 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `sql` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
CREATE INDEX IF NOT EXISTS idx_scan_raw_code  ON scan_raw(raw_code);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 101 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `schema` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 102 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `schema` and next kind is `schema`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
CREATE TABLE IF NOT EXISTS container_scans (
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 103 is classified as `schema`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots. Neighbor context: previous kind is `blank` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
  scan_id      BIGSERIAL PRIMARY KEY,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 104 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `schema` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
  cycle_id     INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id)
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 105 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
                 ON UPDATE CASCADE ON DELETE CASCADE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 106 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
  container_id BIGINT NOT NULL REFERENCES containers(container_id)
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 107 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
                 ON UPDATE CASCADE ON DELETE CASCADE,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 108 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
  scan_ts      TIMESTAMPTZ NOT NULL DEFAULT now(),
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 109 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
  source       TEXT,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 110 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
  status       TEXT NOT NULL CHECK (status IN ('FOUND','NEW')),
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 111 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
  UNIQUE (cycle_id, container_id)
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 112 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
);
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 113 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 114 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
-- ===== VIEWS =====
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 115 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
CREATE OR REPLACE VIEW v_all_containers AS
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 116 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
SELECT
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 117 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
  c.container_id, c.barcode, c.container_code, c.status,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 118 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
  i.description, i.catalog_number, i.physical_state, i.volume_size,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 119 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
  v.vendor_name,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 120 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
  r.room_no, r.room_name, r.room_desc, r.area_class,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 121 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
  c.entry_date, c.expiry_date,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 122 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
  c.legacy_inventory_no, c.added_by, c.created_at,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 123 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
  c.label_printed, c.label_printed_at
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 124 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
FROM containers c
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 125 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
JOIN items i         ON i.item_id  = c.item_id
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 126 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
LEFT JOIN vendors v  ON v.vendor_id = i.vendor_id
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 127 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
LEFT JOIN rooms r    ON r.room_id   = c.room_id;
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 128 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 129 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
CREATE OR REPLACE VIEW v_cycle_report AS
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 130 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
SELECT
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 131 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
  cy.cycle_id,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 132 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
  cy.started_at,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 133 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
  COUNT(DISTINCT CASE WHEN cs.status='FOUND' THEN cs.container_id END) AS found_count,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 134 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
  COUNT(DISTINCT CASE WHEN cs.status='NEW'   THEN cs.container_id END) AS new_count,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 135 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
  (SELECT COUNT(*) FROM containers c WHERE c.status='Active'
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 136 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
    AND NOT EXISTS (
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 137 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
      SELECT 1 FROM container_scans cs2
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 138 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
      WHERE cs2.cycle_id=cy.cycle_id AND cs2.container_id=c.container_id
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 139 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
    )
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 140 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
  ) AS missing_count
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 141 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
FROM inventory_cycles cy
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 142 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
LEFT JOIN container_scans cs ON cs.cycle_id = cy.cycle_id
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 143 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
GROUP BY cy.cycle_id, cy.started_at
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 144 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
ORDER BY cy.started_at DESC;
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 145 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 146 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
-- ===== MAIN INVENTORY VIEW (for Flask app) =====
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 147 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
CREATE OR REPLACE VIEW inventory_view AS
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 148 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
SELECT
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 149 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
  c.container_id,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 150 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
  c.barcode,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 151 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
  c.container_code,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 152 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
  c.entry_date AS inv_date,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 153 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
  c.area_class,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 154 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
  r.room_no,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 155 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
  r.room_name,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 156 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
  r.room_desc,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 157 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
  c.storage_location,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 158 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
  c.storage_sublocation,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 159 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
  c.storage_device,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 160 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
  i.name AS material_name,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 161 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
  i.name AS item_name,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 162 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
  i.description AS item_description,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 163 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
  c.size,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 164 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
  c.unit,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 165 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
  c.system,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 166 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
  v.vendor_name AS vendor,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 167 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 168

```text
  c.lot_number,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 168 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 169

```text
  c.manuf_date,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 169 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 170

```text
  c.expiry_date AS exp_date,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 170 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 171

```text
  c.choice,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 171 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 172

```text
  c.nmr,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 172 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 173

```text
  c.nmr_expiry AS nmr_exp,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 173 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 174

```text
  c.owner,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 174 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 175

```text
  c.notes,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 175 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 176

```text
  c.status,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 176 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 177

```text
  cat.name AS category,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 177 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 178

```text
  c.added_by,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 178 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 179

```text
  c.created_at,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 179 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 180

```text
  c.label_printed,
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 180 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 181

```text
  c.label_printed_at
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 181 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 182

```text
FROM containers c
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 182 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 183

```text
JOIN items i ON i.item_id = c.item_id
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 183 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 184

```text
LEFT JOIN vendors v ON v.vendor_id = i.vendor_id
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 184 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 185

```text
LEFT JOIN rooms r ON r.room_id = c.room_id
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 185 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 186

```text
LEFT JOIN categories cat ON cat.category_id = i.category_id;
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 186 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 187

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 187 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 188

```text
-- ===== SEED =====
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 188 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `sql-data`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 189

```text
INSERT INTO categories(name) VALUES ('Chemicals')
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 189 is classified as `sql-data`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 190

```text
ON CONFLICT (name) DO NOTHING;
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 190 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `sql-data` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 191

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 191 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `sql` and next kind is `sql`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 192

```text
COMMIT;
```

Reconstruction rule: in `UNanofabTools/chem_schema.sql`, line 192 is classified as `sql`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions. Neighbor context: previous kind is `blank` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/chem_schema.sql`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/chem_schema.sql`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/chem_schema.sql`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/chem_schema.sql`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/chem_schema.sql`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/chem_schema.sql`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/chem_schema.sql`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/chem_schema.sql`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/chem_schema.sql`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/chem_schema.sql`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/chem_schema.sql`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/chem_schema.sql`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/chem_schema.sql`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/chem_schema.sql`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/chem_schema.sql`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/chem_schema.sql`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/chem_schema.sql`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/chem_schema.sql`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/chem_schema.sql`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/chem_schema.sql`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/chem_schema.sql`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/chem_schema.sql`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/chem_schema.sql`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/chem_schema.sql`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
