

# Source Reconstruction: UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md

- Repository: `UNanofabTools`
- Relative path: `CHEM_INVENTORY_V2_QUICK_REF.md`
- Lines read: `219`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `87625e107c3a3fea`
- Code fence language: `markdown`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```markdown
# Chemical Inventory v2 - Quick Reference

## New Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/chem/barcodes/queue` | GET | Manage barcode printing queue |
| `/chem/barcodes/print` | GET | Print-ready label page |
| `/chem/barcodes/mark-printed` | POST | Mark labels as printed |
| `/chem/api/inventory_json` | GET | JSON API for inventory data |

## New Database Fields

### containers table
- `added_by` (TEXT) - Who added the container
- `created_at` (TIMESTAMPTZ) - When container was created
- `label_printed` (BOOLEAN) - Whether label has been printed
- `label_printed_at` (TIMESTAMPTZ) - When label was last printed

### rooms table
- `room_no` (TEXT) - Room number (e.g., "02022N")
- `room_name` (TEXT) - Room name (e.g., "Bay A")
- `room_desc` (TEXT) - Room description
- `area_class` (TEXT) - Area classification (e.g., "H-5")

## Label Specifications

- **Sheet**: 8.5" × 11" Letter
- **Margins**: 0.25" top/bottom, 1.00" left/right
- **Label Size**: 1.25" × 1.5"
- **Layout**: 5 columns × 6 rows = 30 labels/sheet
- **Font**: Libre Barcode 39 (Google Fonts)
- **Format**: `*BARCODE*` for Code 39 encoding

## URL Parameters

### Barcode Queue
- `?q=search_term` - Filter containers
- `?preselect=barcode1,barcode2` - Auto-select specific barcodes

### Barcode Print
- `?barcodes=code1,code2` - Barcodes to print
- `?copies=2` - Number of copies per label (default: 1)

## Service Layer Methods

```python
from app.services.chem_service import ChemInventoryService

service = ChemInventoryService()

# Get barcode queue with optional search
queue = service.get_barcode_queue(search_query="")

# Get labels for printing
labels = service.get_barcode_labels(
    barcode_list=["100001", "100002"],
    copies_per_label=1
)

# Mark labels as printed
service.mark_barcodes_printed(["100001", "100002"])
```

## Migration Commands

```bash
# Backup existing database
pg_dump -h localhost -U chemuser chemdb > backup.sql

# Run migration (for existing databases)
psql -h localhost -U chemuser -d chemdb -f chem_schema_migration_v2.sql

# Create new database (fresh install)
psql -h localhost -U chemuser -d chemdb -f chem_schema.sql
python init_chem_db.py
```

## Common Tasks

### Add Chemical and Print Label
1. Go to `/chem/add`
2. Fill form (including "Added By")
3. Submit → auto-redirected to queue with new items selected
4. Click "Open Print Page"
5. Print (Ctrl+P / Cmd+P)
6. Return and click "Mark Selected Printed"

### Search Across All Fields
```python
# Search works on ANY field now using row_to_json()
service.search_inventory(query="acetone")  # Finds in name
service.search_inventory(query="100001")   # Finds barcode
service.search_inventory(query="John")     # Finds in added_by
service.search_inventory(query="Bay A")    # Finds in room_name
```

### Manual Label Printing
1. Go to `/chem/barcodes/queue`
2. Search (optional): `?q=acetone`
3. Check boxes for containers
4. Click "Open Print Page"
5. Browser opens with formatted labels
6. Print
7. Return and mark printed

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Barcode font not loading | Check internet connection (Google Fonts CDN) |
| Labels misaligned | Verify printer settings: no margins, 100% scale |
| Search not working | Ensure PostgreSQL 9.2+ (requires row_to_json) |
| Migration fails | Check for existing column conflicts, review errors |
| "Added By" not saving | Verify containers table has `added_by` column |

## CSS Classes (for customization)

```css
/* Label grid container */
.sheet {
  display: grid;
  grid-template-columns: repeat(5, 1.25in);
  grid-auto-rows: 1.5in;
}

/* Individual label */
.label {
  border: 1px solid #ccc;
  padding: 2px;
  display: flex;
  flex-direction: column;
}

/* Barcode text */
.barcode {
  font-family: 'Libre Barcode 39', cursive;
  font-size: 24px;
}
```

## Navigation Structure

```
Chem Inventory (dropdown)
├── Inventory
├── Add
├── Report
├── Upload Scans
├── Print
├── Barcodes — Queue
└── Barcodes — Print
```

## File Locations

```
app/
├── blueprints/
│   └── chem_inventory.py         # Routes with 4 new endpoints
├── services/
│   └── chem_service.py           # Service layer with 3 new methods
└── templates/
    └── chem/
        ├── base.html             # Updated navigation
        ├── inventory.html        # 23 columns (was 20)
        ├── inventory_print.html  # Same updates as inventory
        ├── add.html              # Added "Added By" field
        ├── barcode_queue.html    # NEW - Queue management
        └── barcode_print.html    # NEW - Print layout

chem_schema.sql                   # Full schema (new installs)
chem_schema_migration_v2.sql      # Migration (existing DBs)
CHEM_INVENTORY_V2_UPGRADE.md      # Full documentation
```

## Environment Variables

```bash
# .env file
CHEM_PGHOST=localhost
CHEM_PGPORT=5432
CHEM_PGDATABASE=chemdb
CHEM_PGUSER=chemuser
CHEM_PGPASSWORD=<redacted-secret-value>
```

## API Example

```bash
# Get all inventory as JSON
curl http://localhost:5000/chem/api/inventory_json

# Response format:
{
  "data": [
    {
      "barcode": "100001",
      "material_name": "Acetone",
      "room_name": "Bay A",
      "added_by": "John Smith",
      "label_printed": false,
      ...
    }
  ]
}
```

## Version Info

- **Version**: v2.0
- **PostgreSQL**: 12+ required
- **Python**: 3.11+ required
- **Flask**: 3.0+ required
- **Key Dependency**: psycopg2-binary 2.9.9

---

For complete documentation, see `CHEM_INVENTORY_V2_UPGRADE.md`
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
# Chemical Inventory v2 - Quick Reference
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 1 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `none` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 2 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
## New Routes
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 3 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 4 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
| Route | Method | Purpose |
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 5 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
|-------|--------|---------|
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 6 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
| `/chem/barcodes/queue` | GET | Manage barcode printing queue |
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 7 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
| `/chem/barcodes/print` | GET | Print-ready label page |
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 8 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
| `/chem/barcodes/mark-printed` | POST | Mark labels as printed |
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 9 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
| `/chem/api/inventory_json` | GET | JSON API for inventory data |
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 10 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 11 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
## New Database Fields
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 12 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 13 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
### containers table
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 14 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
- `added_by` (TEXT) - Who added the container
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 15 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
- `created_at` (TIMESTAMPTZ) - When container was created
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 16 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
- `label_printed` (BOOLEAN) - Whether label has been printed
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 17 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
- `label_printed_at` (TIMESTAMPTZ) - When label was last printed
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 18 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 19 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
### rooms table
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 20 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
- `room_no` (TEXT) - Room number (e.g., "02022N")
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 21 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
- `room_name` (TEXT) - Room name (e.g., "Bay A")
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 22 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
- `room_desc` (TEXT) - Room description
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 23 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
- `area_class` (TEXT) - Area classification (e.g., "H-5")
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 24 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 25 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
## Label Specifications
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 26 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 27 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
- **Sheet**: 8.5" × 11" Letter
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 28 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
- **Margins**: 0.25" top/bottom, 1.00" left/right
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 29 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
- **Label Size**: 1.25" × 1.5"
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 30 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
- **Layout**: 5 columns × 6 rows = 30 labels/sheet
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 31 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
- **Font**: Libre Barcode 39 (Google Fonts)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 32 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
- **Format**: `*BARCODE*` for Code 39 encoding
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 33 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 34 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
## URL Parameters
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 35 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 36 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
### Barcode Queue
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 37 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
- `?q=search_term` - Filter containers
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 38 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
- `?preselect=barcode1,barcode2` - Auto-select specific barcodes
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 39 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 40 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
### Barcode Print
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 41 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
- `?barcodes=code1,code2` - Barcodes to print
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 42 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
- `?copies=2` - Number of copies per label (default: 1)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 43 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 44 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
## Service Layer Methods
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 45 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 46 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
```python
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 47 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
from app.services.chem_service import ChemInventoryService
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 48 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 49 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 50 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 51 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
# Get barcode queue with optional search
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 52 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
queue = service.get_barcode_queue(search_query="")
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 53 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 54 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
# Get labels for printing
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 55 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
labels = service.get_barcode_labels(
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 56 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
    barcode_list=["100001", "100002"],
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 57 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
    copies_per_label=1
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 58 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 59 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 60 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
# Mark labels as printed
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 61 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
service.mark_barcodes_printed(["100001", "100002"])
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 62 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 63 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 64 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
## Migration Commands
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 65 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 66 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 67 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
# Backup existing database
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 68 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
pg_dump -h localhost -U chemuser chemdb > backup.sql
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 69 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 70 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
# Run migration (for existing databases)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 71 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
psql -h localhost -U chemuser -d chemdb -f chem_schema_migration_v2.sql
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 72 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 73 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
# Create new database (fresh install)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 74 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
psql -h localhost -U chemuser -d chemdb -f chem_schema.sql
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 75 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
python init_chem_db.py
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 76 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 77 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 78 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
## Common Tasks
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 79 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 80 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
### Add Chemical and Print Label
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 81 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
1. Go to `/chem/add`
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 82 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
2. Fill form (including "Added By")
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 83 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
3. Submit → auto-redirected to queue with new items selected
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 84 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
4. Click "Open Print Page"
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 85 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
5. Print (Ctrl+P / Cmd+P)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 86 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
6. Return and click "Mark Selected Printed"
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 87 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 88 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
### Search Across All Fields
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 89 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
```python
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 90 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
# Search works on ANY field now using row_to_json()
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 91 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
service.search_inventory(query="acetone")  # Finds in name
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 92 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
service.search_inventory(query="100001")   # Finds barcode
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 93 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
service.search_inventory(query="John")     # Finds in added_by
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 94 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
service.search_inventory(query="Bay A")    # Finds in room_name
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 95 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 96 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 97 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
### Manual Label Printing
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 98 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
1. Go to `/chem/barcodes/queue`
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 99 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
2. Search (optional): `?q=acetone`
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 100 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
3. Check boxes for containers
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 101 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
4. Click "Open Print Page"
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 102 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
5. Browser opens with formatted labels
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 103 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
6. Print
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 104 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
7. Return and mark printed
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 105 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 106 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
## Troubleshooting
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 107 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 108 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
| Issue | Solution |
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 109 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
|-------|----------|
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 110 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
| Barcode font not loading | Check internet connection (Google Fonts CDN) |
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 111 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
| Labels misaligned | Verify printer settings: no margins, 100% scale |
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 112 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
| Search not working | Ensure PostgreSQL 9.2+ (requires row_to_json) |
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 113 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
| Migration fails | Check for existing column conflicts, review errors |
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 114 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
| "Added By" not saving | Verify containers table has `added_by` column |
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 115 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 116 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
## CSS Classes (for customization)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 117 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 118 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
```css
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 119 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
/* Label grid container */
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 120 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
.sheet {
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 121 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
  display: grid;
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 122 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
  grid-template-columns: repeat(5, 1.25in);
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 123 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
  grid-auto-rows: 1.5in;
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 124 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
}
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 125 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 126 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
/* Individual label */
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 127 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
.label {
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 128 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
  border: 1px solid #ccc;
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 129 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
  padding: 2px;
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 130 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
  display: flex;
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 131 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
  flex-direction: column;
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 132 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
}
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 133 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 134 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
/* Barcode text */
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 135 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
.barcode {
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 136 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
  font-family: 'Libre Barcode 39', cursive;
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 137 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
  font-size: 24px;
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 138 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
}
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 139 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 140 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 141 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
## Navigation Structure
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 142 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 143 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 144 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
Chem Inventory (dropdown)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 145 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
├── Inventory
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 146 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
├── Add
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 147 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
├── Report
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 148 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
├── Upload Scans
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 149 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
├── Print
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 150 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
├── Barcodes — Queue
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 151 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
└── Barcodes — Print
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 152 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 153 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 154 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
## File Locations
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 155 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 156 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 157 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
app/
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 158 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
├── blueprints/
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 159 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
│   └── chem_inventory.py         # Routes with 4 new endpoints
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 160 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
├── services/
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 161 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
│   └── chem_service.py           # Service layer with 3 new methods
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 162 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
└── templates/
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 163 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
    └── chem/
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 164 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
        ├── base.html             # Updated navigation
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 165 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
        ├── inventory.html        # 23 columns (was 20)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 166 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
        ├── inventory_print.html  # Same updates as inventory
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 167 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 168

```text
        ├── add.html              # Added "Added By" field
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 168 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 169

```text
        ├── barcode_queue.html    # NEW - Queue management
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 169 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 170

```text
        └── barcode_print.html    # NEW - Print layout
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 170 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 171

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 171 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 172

```text
chem_schema.sql                   # Full schema (new installs)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 172 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 173

```text
chem_schema_migration_v2.sql      # Migration (existing DBs)
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 173 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 174

```text
CHEM_INVENTORY_V2_UPGRADE.md      # Full documentation
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 174 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 175

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 175 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 176

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 176 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 177

```text
## Environment Variables
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 177 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 178

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 178 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 179

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 179 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 180

```text
# .env file
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 180 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 181

```text
CHEM_PGHOST=localhost
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 181 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 182

```text
CHEM_PGPORT=5432
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 182 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 183

```text
CHEM_PGDATABASE=chemdb
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 183 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 184

```text
CHEM_PGUSER=chemuser
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 184 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 185

```text
CHEM_PGPASSWORD=<redacted-secret-value>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 185 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 186

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 186 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 187

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 187 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 188

```text
## API Example
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 188 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 189

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 189 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 190

```text
```bash
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 190 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 191

```text
# Get all inventory as JSON
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 191 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 192

```text
curl http://localhost:5000/chem/api/inventory_json
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 192 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 193

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 193 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 194

```text
# Response format:
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 194 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 195

```text
{
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 195 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 196

```text
  "data": [
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 196 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 197

```text
    {
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 197 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 198

```text
      "barcode": "100001",
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 198 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 199

```text
      "material_name": "Acetone",
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 199 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 200

```text
      "room_name": "Bay A",
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 200 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 201

```text
      "added_by": "John Smith",
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 201 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 202

```text
      "label_printed": false,
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 202 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 203

```text
      ...
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 203 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 204

```text
    }
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 204 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 205

```text
  ]
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 205 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 206

```text
}
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 206 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 207

```text
```
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 207 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 208

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 208 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 209

```text
## Version Info
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 209 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 210

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 210 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 211

```text
- **Version**: v2.0
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 211 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 212

```text
- **PostgreSQL**: 12+ required
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 212 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 213

```text
- **Python**: 3.11+ required
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 213 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 214

```text
- **Flask**: 3.0+ required
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 214 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 215

```text
- **Key Dependency**: psycopg2-binary 2.9.9
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 215 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `prose` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 216

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 216 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 217

```text
---
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 217 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 218

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 218 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `prose` and next kind is `prose`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 219

```text
For complete documentation, see `CHEM_INVENTORY_V2_UPGRADE.md`
```

Reconstruction rule: in `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, line 219 is classified as `prose`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets. Neighbor context: previous kind is `blank` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
