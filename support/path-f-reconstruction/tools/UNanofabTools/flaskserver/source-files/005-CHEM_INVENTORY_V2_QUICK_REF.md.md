

# Source Reconstruction: UNanofabTools/CHEM_INVENTORY_V2_QUICK_REF.md

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

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

### Line 5

```text
| Route | Method | Purpose |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 6

```text
|-------|--------|---------|
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 7

```text
| `/chem/barcodes/queue` | GET | Manage barcode printing queue |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 8

```text
| `/chem/barcodes/print` | GET | Print-ready label page |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 9

```text
| `/chem/barcodes/mark-printed` | POST | Mark labels as printed |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 10

```text
| `/chem/api/inventory_json` | GET | JSON API for inventory data |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 15

```text
- `added_by` (TEXT) - Who added the container
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 16

```text
- `created_at` (TIMESTAMPTZ) - When container was created
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 17

```text
- `label_printed` (BOOLEAN) - Whether label has been printed
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 18

```text
- `label_printed_at` (TIMESTAMPTZ) - When label was last printed
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 21

```text
- `room_no` (TEXT) - Room number (e.g., "02022N")
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 22

```text
- `room_name` (TEXT) - Room name (e.g., "Bay A")
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 23

```text
- `room_desc` (TEXT) - Room description
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 24

```text
- `area_class` (TEXT) - Area classification (e.g., "H-5")
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 28

```text
- **Sheet**: 8.5" × 11" Letter
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 29

```text
- **Margins**: 0.25" top/bottom, 1.00" left/right
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 30

```text
- **Label Size**: 1.25" × 1.5"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 31

```text
- **Layout**: 5 columns × 6 rows = 30 labels/sheet
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 32

```text
- **Font**: Libre Barcode 39 (Google Fonts)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 33

```text
- **Format**: `*BARCODE*` for Code 39 encoding
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 38

```text
- `?q=search_term` - Filter containers
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 39

```text
- `?preselect=barcode1,barcode2` - Auto-select specific barcodes
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 42

```text
- `?barcodes=code1,code2` - Barcodes to print
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 43

```text
- `?copies=2` - Number of copies per label (default: 1)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 47

```text
```python
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 48

```text
from app.services.chem_service import ChemInventoryService
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 50

```text
service = ChemInventoryService()
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 53

```text
queue = service.get_barcode_queue(search_query="")
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 56

```text
labels = service.get_barcode_labels(
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 57

```text
    barcode_list=["100001", "100002"],
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 58

```text
    copies_per_label=1
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 59

```text
)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 62

```text
service.mark_barcodes_printed(["100001", "100002"])
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 63

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 67

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 69

```text
pg_dump -h localhost -U chemuser chemdb > backup.sql
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 72

```text
psql -h localhost -U chemuser -d chemdb -f chem_schema_migration_v2.sql
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 75

```text
psql -h localhost -U chemuser -d chemdb -f chem_schema.sql
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 76

```text
python init_chem_db.py
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 77

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 82

```text
1. Go to `/chem/add`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 83

```text
2. Fill form (including "Added By")
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 84

```text
3. Submit → auto-redirected to queue with new items selected
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 85

```text
4. Click "Open Print Page"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 86

```text
5. Print (Ctrl+P / Cmd+P)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 87

```text
6. Return and click "Mark Selected Printed"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 90

```text
```python
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 92

```text
service.search_inventory(query="acetone")  # Finds in name
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 93

```text
service.search_inventory(query="100001")   # Finds barcode
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 94

```text
service.search_inventory(query="John")     # Finds in added_by
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 95

```text
service.search_inventory(query="Bay A")    # Finds in room_name
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 96

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 99

```text
1. Go to `/chem/barcodes/queue`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 100

```text
2. Search (optional): `?q=acetone`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 101

```text
3. Check boxes for containers
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 102

```text
4. Click "Open Print Page"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 103

```text
5. Browser opens with formatted labels
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 104

```text
6. Print
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 105

```text
7. Return and mark printed
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 109

```text
| Issue | Solution |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 110

```text
|-------|----------|
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 111

```text
| Barcode font not loading | Check internet connection (Google Fonts CDN) |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 112

```text
| Labels misaligned | Verify printer settings: no margins, 100% scale |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 113

```text
| Search not working | Ensure PostgreSQL 9.2+ (requires row_to_json) |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 114

```text
| Migration fails | Check for existing column conflicts, review errors |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 115

```text
| "Added By" not saving | Verify containers table has `added_by` column |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 119

```text
```css
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 121

```text
.sheet {
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 122

```text
  display: grid;
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 123

```text
  grid-template-columns: repeat(5, 1.25in);
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 124

```text
  grid-auto-rows: 1.5in;
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 125

```text
}
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 128

```text
.label {
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 129

```text
  border: 1px solid #ccc;
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 130

```text
  padding: 2px;
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 131

```text
  display: flex;
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 132

```text
  flex-direction: column;
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 133

```text
}
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 136

```text
.barcode {
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 137

```text
  font-family: 'Libre Barcode 39', cursive;
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 138

```text
  font-size: 24px;
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 139

```text
}
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 140

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 144

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 145

```text
Chem Inventory (dropdown)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 146

```text
├── Inventory
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 147

```text
├── Add
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 148

```text
├── Report
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 149

```text
├── Upload Scans
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 150

```text
├── Print
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 151

```text
├── Barcodes — Queue
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 152

```text
└── Barcodes — Print
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 153

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 157

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 158

```text
app/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 159

```text
├── blueprints/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 160

```text
│   └── chem_inventory.py         # Routes with 4 new endpoints
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 161

```text
├── services/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 162

```text
│   └── chem_service.py           # Service layer with 3 new methods
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 163

```text
└── templates/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 164

```text
    └── chem/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 165

```text
        ├── base.html             # Updated navigation
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 166

```text
        ├── inventory.html        # 23 columns (was 20)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 167

```text
        ├── inventory_print.html  # Same updates as inventory
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 168

```text
        ├── add.html              # Added "Added By" field
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 169

```text
        ├── barcode_queue.html    # NEW - Queue management
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 170

```text
        └── barcode_print.html    # NEW - Print layout
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 172

```text
chem_schema.sql                   # Full schema (new installs)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 173

```text
chem_schema_migration_v2.sql      # Migration (existing DBs)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 174

```text
CHEM_INVENTORY_V2_UPGRADE.md      # Full documentation
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 175

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 179

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 181

```text
CHEM_PGHOST=localhost
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 182

```text
CHEM_PGPORT=5432
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 183

```text
CHEM_PGDATABASE=chemdb
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 184

```text
CHEM_PGUSER=chemuser
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 185

```text
CHEM_PGPASSWORD=<redacted-secret-value>
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 186

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 190

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 192

```text
curl http://localhost:5000/chem/api/inventory_json
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 195

```text
{
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 196

```text
  "data": [
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 197

```text
    {
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 198

```text
      "barcode": "100001",
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 199

```text
      "material_name": "Acetone",
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 200

```text
      "room_name": "Bay A",
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 201

```text
      "added_by": "John Smith",
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 202

```text
      "label_printed": false,
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 203

```text
      ...
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 204

```text
    }
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 205

```text
  ]
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 206

```text
}
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 207

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 211

```text
- **Version**: v2.0
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 212

```text
- **PostgreSQL**: 12+ required
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 213

```text
- **Python**: 3.11+ required
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 214

```text
- **Flask**: 3.0+ required
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 215

```text
- **Key Dependency**: psycopg2-binary 2.9.9
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 217

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 219

```text
For complete documentation, see `CHEM_INVENTORY_V2_UPGRADE.md`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.



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
