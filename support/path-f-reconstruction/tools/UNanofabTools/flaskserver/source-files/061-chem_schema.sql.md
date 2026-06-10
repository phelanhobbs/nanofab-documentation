

# Source Reconstruction: UNanofabTools/chem_schema.sql

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `chem_schema.sql`
- Lines read: `192`
- Dirty in working tree at generation time: `no`
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

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 2

```text
-- Includes inventory_view for the Flask application
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 4

```text
BEGIN;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 6

```text
-- ===== SEQUENCE for system-generated barcodes =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 7

```text
CREATE SEQUENCE IF NOT EXISTS seq_barcode
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 8

```text
  START WITH 100001 INCREMENT BY 1 NO MINVALUE NO MAXVALUE;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 10

```text
-- ===== LOOKUPS =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 11

```text
CREATE TABLE IF NOT EXISTS categories (
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 12

```text
  category_id SERIAL PRIMARY KEY,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 13

```text
  name        TEXT NOT NULL UNIQUE
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 14

```text
);
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 16

```text
CREATE TABLE IF NOT EXISTS vendors (
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 17

```text
  vendor_id   SERIAL PRIMARY KEY,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 18

```text
  vendor_name TEXT NOT NULL UNIQUE
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 19

```text
);
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 21

```text
CREATE TABLE IF NOT EXISTS rooms (
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 22

```text
  room_id     SERIAL PRIMARY KEY,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 23

```text
  room_no     TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 24

```text
  room_name   TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 25

```text
  room_desc   TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 26

```text
  area_class  TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 27

```text
  building    TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 28

```text
  lab_code    TEXT
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 29

```text
);
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 30

```text
CREATE UNIQUE INDEX IF NOT EXISTS idx_rooms_room_no_unique ON rooms(room_no);
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 32

```text
-- ===== ITEMS (chemical definitions) =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 33

```text
CREATE TABLE IF NOT EXISTS items (
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 34

```text
  item_id        SERIAL PRIMARY KEY,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 35

```text
  name           TEXT NOT NULL UNIQUE,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 36

```text
  description    TEXT NOT NULL,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 37

```text
  catalog_number TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 38

```text
  physical_state TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 39

```text
  volume_size    TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 40

```text
  category_id    INTEGER NOT NULL REFERENCES categories(category_id)
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 41

```text
                   ON UPDATE CASCADE ON DELETE RESTRICT,
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 42

```text
  vendor_id      INTEGER REFERENCES vendors(vendor_id)
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 43

```text
                   ON UPDATE CASCADE ON DELETE SET NULL
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 44

```text
);
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 46

```text
-- ===== CONTAINERS (individual bottles) =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 47

```text
CREATE TABLE IF NOT EXISTS containers (
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 48

```text
  container_id       BIGSERIAL PRIMARY KEY,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 49

```text
  item_id            INTEGER NOT NULL REFERENCES items(item_id)
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 50

```text
                        ON UPDATE CASCADE ON DELETE CASCADE,
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 51

```text
  barcode            TEXT NOT NULL UNIQUE,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 52

```text
  container_code     TEXT NOT NULL UNIQUE,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 53

```text
  room_id            INTEGER REFERENCES rooms(room_id)
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 54

```text
                        ON UPDATE CASCADE ON DELETE SET NULL,
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 55

```text
  entry_date         DATE,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 56

```text
  manuf_date         DATE,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 57

```text
  expiry_date        DATE,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 58

```text
  area_class         TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 59

```text
  storage_location   TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 60

```text
  storage_sublocation TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 61

```text
  storage_device     TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 62

```text
  system             TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 63

```text
  lot_number         TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 64

```text
  choice             TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 65

```text
  nmr                TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 66

```text
  nmr_expiry         DATE,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 67

```text
  owner              TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 68

```text
  notes              TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 69

```text
  status             TEXT NOT NULL DEFAULT 'Active',
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 70

```text
  size               TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 71

```text
  unit               TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 72

```text
  legacy_inventory_no TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 73

```text
  added_by           TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 74

```text
  created_at         TIMESTAMPTZ DEFAULT NOW(),
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 75

```text
  label_printed      BOOLEAN DEFAULT FALSE,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 76

```text
  label_printed_at   TIMESTAMPTZ
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 77

```text
);
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 78

```text
CREATE INDEX IF NOT EXISTS idx_containers_item   ON containers(item_id);
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 79

```text
CREATE INDEX IF NOT EXISTS idx_containers_room   ON containers(room_id);
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 80

```text
CREATE INDEX IF NOT EXISTS idx_containers_status ON containers(status);
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 81

```text
CREATE INDEX IF NOT EXISTS idx_containers_label_printed ON containers(label_printed);
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 83

```text
-- ===== INVENTORY CYCLES & SCANS =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 84

```text
CREATE TABLE IF NOT EXISTS inventory_cycles (
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 85

```text
  cycle_id   SERIAL PRIMARY KEY,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 86

```text
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 87

```text
  ended_at   TIMESTAMPTZ,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 88

```text
  created_by TEXT
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 89

```text
);
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 91

```text
CREATE TABLE IF NOT EXISTS scan_raw (
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 92

```text
  raw_id       BIGSERIAL PRIMARY KEY,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 93

```text
  cycle_id     INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id)
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 94

```text
                 ON UPDATE CASCADE ON DELETE CASCADE,
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 95

```text
  raw_code     TEXT NOT NULL,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 96

```text
  import_ts    TIMESTAMPTZ NOT NULL DEFAULT now(),
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 97

```text
  matched_container_id BIGINT REFERENCES containers(container_id)
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 98

```text
                 ON UPDATE CASCADE ON DELETE SET NULL
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 99

```text
);
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 100

```text
CREATE INDEX IF NOT EXISTS idx_scan_raw_cycle ON scan_raw(cycle_id);
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 101

```text
CREATE INDEX IF NOT EXISTS idx_scan_raw_code  ON scan_raw(raw_code);
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 103

```text
CREATE TABLE IF NOT EXISTS container_scans (
```

`schema` — This schema line defines persistent database shape. Preserve names, types, constraints, defaults, indexes, and migration order; edge cases include existing production data, nullable changes, unique conflicts, and restore from older snapshots.

### Line 104

```text
  scan_id      BIGSERIAL PRIMARY KEY,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 105

```text
  cycle_id     INTEGER NOT NULL REFERENCES inventory_cycles(cycle_id)
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 106

```text
                 ON UPDATE CASCADE ON DELETE CASCADE,
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 107

```text
  container_id BIGINT NOT NULL REFERENCES containers(container_id)
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 108

```text
                 ON UPDATE CASCADE ON DELETE CASCADE,
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 109

```text
  scan_ts      TIMESTAMPTZ NOT NULL DEFAULT now(),
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 110

```text
  source       TEXT,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 111

```text
  status       TEXT NOT NULL CHECK (status IN ('FOUND','NEW')),
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 112

```text
  UNIQUE (cycle_id, container_id)
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 113

```text
);
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 115

```text
-- ===== VIEWS =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 116

```text
CREATE OR REPLACE VIEW v_all_containers AS
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 117

```text
SELECT
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 118

```text
  c.container_id, c.barcode, c.container_code, c.status,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 119

```text
  i.description, i.catalog_number, i.physical_state, i.volume_size,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 120

```text
  v.vendor_name,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 121

```text
  r.room_no, r.room_name, r.room_desc, r.area_class,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 122

```text
  c.entry_date, c.expiry_date,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 123

```text
  c.legacy_inventory_no, c.added_by, c.created_at,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 124

```text
  c.label_printed, c.label_printed_at
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 125

```text
FROM containers c
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 126

```text
JOIN items i         ON i.item_id  = c.item_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 127

```text
LEFT JOIN vendors v  ON v.vendor_id = i.vendor_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 128

```text
LEFT JOIN rooms r    ON r.room_id   = c.room_id;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 130

```text
CREATE OR REPLACE VIEW v_cycle_report AS
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 131

```text
SELECT
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 132

```text
  cy.cycle_id,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 133

```text
  cy.started_at,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 134

```text
  COUNT(DISTINCT CASE WHEN cs.status='FOUND' THEN cs.container_id END) AS found_count,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 135

```text
  COUNT(DISTINCT CASE WHEN cs.status='NEW'   THEN cs.container_id END) AS new_count,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 136

```text
  (SELECT COUNT(*) FROM containers c WHERE c.status='Active'
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 137

```text
    AND NOT EXISTS (
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 138

```text
      SELECT 1 FROM container_scans cs2
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 139

```text
      WHERE cs2.cycle_id=cy.cycle_id AND cs2.container_id=c.container_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 140

```text
    )
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 141

```text
  ) AS missing_count
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 142

```text
FROM inventory_cycles cy
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 143

```text
LEFT JOIN container_scans cs ON cs.cycle_id = cy.cycle_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 144

```text
GROUP BY cy.cycle_id, cy.started_at
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 145

```text
ORDER BY cy.started_at DESC;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 147

```text
-- ===== MAIN INVENTORY VIEW (for Flask app) =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 148

```text
CREATE OR REPLACE VIEW inventory_view AS
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 149

```text
SELECT
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 150

```text
  c.container_id,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 151

```text
  c.barcode,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 152

```text
  c.container_code,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 153

```text
  c.entry_date AS inv_date,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 154

```text
  c.area_class,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 155

```text
  r.room_no,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 156

```text
  r.room_name,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 157

```text
  r.room_desc,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 158

```text
  c.storage_location,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 159

```text
  c.storage_sublocation,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 160

```text
  c.storage_device,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 161

```text
  i.name AS material_name,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 162

```text
  i.name AS item_name,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 163

```text
  i.description AS item_description,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 164

```text
  c.size,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 165

```text
  c.unit,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 166

```text
  c.system,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 167

```text
  v.vendor_name AS vendor,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 168

```text
  c.lot_number,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 169

```text
  c.manuf_date,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 170

```text
  c.expiry_date AS exp_date,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 171

```text
  c.choice,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 172

```text
  c.nmr,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 173

```text
  c.nmr_expiry AS nmr_exp,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 174

```text
  c.owner,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 175

```text
  c.notes,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 176

```text
  c.status,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 177

```text
  cat.name AS category,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 178

```text
  c.added_by,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 179

```text
  c.created_at,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 180

```text
  c.label_printed,
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 181

```text
  c.label_printed_at
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 182

```text
FROM containers c
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 183

```text
JOIN items i ON i.item_id = c.item_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 184

```text
LEFT JOIN vendors v ON v.vendor_id = i.vendor_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 185

```text
LEFT JOIN rooms r ON r.room_id = c.room_id
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 186

```text
LEFT JOIN categories cat ON cat.category_id = i.category_id;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 188

```text
-- ===== SEED =====
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 189

```text
INSERT INTO categories(name) VALUES ('Chemicals')
```

`sql-data` — This SQL data operation changes or reads rows. Preserve parameterization, filtering, ordering, and transaction scope; edge cases are no matches, duplicate matches, unexpected nulls, and data that violates later assumptions.

### Line 190

```text
ON CONFLICT (name) DO NOTHING;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.

### Line 192

```text
COMMIT;
```

`sql` — This SQL line contributes to database setup or migration. Preserve dialect-specific syntax and execution order; edge cases include running it twice, running against a newer schema, and running with insufficient permissions.



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
