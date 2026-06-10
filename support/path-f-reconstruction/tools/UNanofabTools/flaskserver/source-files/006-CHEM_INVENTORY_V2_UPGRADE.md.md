

# Source Reconstruction: UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `CHEM_INVENTORY_V2_UPGRADE.md`
- Lines read: `281`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `f83e9621ca9f8c84`
- Code fence language: `markdown`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```markdown
# Chemical Inventory v2 Upgrade Summary

This document details the upgrade from Cheminventory_v5 to chem2 (chem-postgres-demo) version, adding professional barcode printing capabilities and improved database schema.

## Major Features Added

### 1. Barcode Label Printing System
- **Print-ready label layout**: 30 labels per sheet (5 columns × 6 rows)
- **Standard label compatibility**: Designed for Avery 5160-compatible 1.25" × 1.5" labels
- **CSS Grid precision layout**: Exact measurements for Letter-size paper (8.5" × 11")
- **Code 39 barcode font**: Uses Google Fonts "Libre Barcode 39" for barcode rendering
- **Two-stage workflow**:
  1. **Barcode Queue** (`/chem/barcodes/queue`): Select containers for printing
  2. **Print Page** (`/chem/barcodes/print`): Browser-native print dialog with formatted labels

### 2. Enhanced Search Functionality
- **Comprehensive field search**: Uses PostgreSQL `row_to_json()` to search ALL fields in one query
- **Single query performance**: No need to explicitly list columns for search
- **Case-insensitive matching**: Works across text, dates, numbers, and JSON data

### 3. Improved Navigation
- **Dropdown menu system**: "Chem Inventory" brand becomes expandable menu
- **7 navigation items**: Inventory, Add, Report, Upload Scans, Print, Barcodes Queue, Barcodes Print
- **Responsive design**: Maintains usability on different screen sizes
- **Print-friendly**: Navigation hidden when printing

### 4. Enhanced Database Schema
- **Barcode tracking**: `label_printed` (BOOLEAN), `label_printed_at` (TIMESTAMPTZ)
- **Audit trail**: `added_by` (TEXT), `created_at` (TIMESTAMPTZ)
- **Room details**: `room_no`, `room_name`, `room_desc`, `area_class`
- **Updated views**: inventory_view includes all new fields

## Files Modified

### Templates
1. **app/templates/chem/base.html**
   - Redesigned navigation with dropdown menu
   - Added 7 navigation links (was 5)
   - Print media query to hide navigation

2. **app/templates/chem/inventory.html**
   - Barcode column moved to first position with `<code>` tag
   - Added "Added By" column at end
   - Now shows 23 columns (was 20)

3. **app/templates/chem/inventory_print.html**
   - Same column updates as inventory.html
   - Maintains print-specific styling

4. **app/templates/chem/add.html**
   - Added "Added By" field to Ownership section
   - Added "Room Name" field to Location section
   - Restructured location fields (3-column grid)

5. **app/templates/chem/barcode_queue.html** *(NEW)*
   - Checkbox selection for bulk operations
   - "Mark Selected Printed" functionality
   - "Open Print Page" with preselection support
   - JavaScript for checkbox toggle and form submission

6. **app/templates/chem/barcode_print.html** *(NEW)*
   - CSS Grid layout: 5 columns × 6 rows
   - @page rule: Letter size, specific margins (0.25" T/B, 1.00" L/R)
   - Label dimensions: 1.25" × 1.5" with proper gaps
   - Libre Barcode 39 font integration
   - Auto-padding to 30 labels per sheet
   - Page breaks between sheets

### Python Code
1. **app/blueprints/chem_inventory.py**
   - Added `jsonify` import
   - Added 4 new routes:
     - `/chem/barcodes/queue` (GET): barcode management interface
     - `/chem/barcodes/print` (GET): print page with selected labels
     - `/chem/barcodes/mark-printed` (POST): mark labels as printed
     - `/chem/api/inventory_json` (GET): JSON API endpoint
   - Updated `add()` route:
     - Extracts `room_name` and `added_by` from form
     - Returns list of new barcodes
     - Redirects to barcode queue with preselect parameter

2. **app/services/chem_service.py**
   - Updated `search_inventory()`:
     - Uses `row_to_json(iv)::text ILIKE :q` for comprehensive search
     - Searches all fields without explicit column listing
   - Updated `_resolve_room()`:
     - Now accepts `room_name` parameter
     - Matches on room_no, room_name, room_desc, area_class
   - Updated `add_containers()`:
     - Accepts `room_name` and `added_by` in data dict
     - Returns list of new barcodes (was count)
     - Inserts `added_by` into containers table
   - Added 3 new methods:
     - `get_barcode_queue(search_query)`: Returns unprinted containers
     - `get_barcode_labels(barcode_list, copies)`: Prepares label data
     - `mark_barcodes_printed(barcode_list)`: Updates print status

### Database Schema
1. **chem_schema.sql** *(UPDATED)*
   - **rooms table**: Added `room_no`, `room_name`, `room_desc`, `area_class`
   - **containers table**: Added `added_by`, `created_at`, `label_printed`, `label_printed_at`
   - **Index**: Added `idx_containers_label_printed` for performance
   - **inventory_view**: Includes all new fields
   - **v_all_containers**: Includes new room and tracking fields

2. **chem_schema_migration_v2.sql** *(NEW)*
   - Migration script for existing databases
   - Adds all new columns with ALTER TABLE
   - Updates views to include new fields
   - Idempotent (safe to run multiple times)

## Technical Specifications

### Barcode Label Layout
- **Sheet size**: 8.5" × 11" (US Letter)
- **Page margins**: 0.25" top/bottom, 1.00" left/right
- **Label dimensions**: 1.25" width × 1.5" height
- **Column gap**: 0.17" (between labels horizontally)
- **Row gap**: 0.3" (between labels vertically)
- **Labels per sheet**: 30 (5 columns × 6 rows)
- **Label content**:
  - Barcode (Code 39 format: `*BARCODE*`)
  - Item name (truncated if needed)
  - Lot number

### PostgreSQL Requirements
- **Version**: 9.2+ (for `row_to_json()` function)
- **Extensions**: None required
- **New indexes**: `idx_containers_label_printed`

### Browser Compatibility
- **Print API**: Standard `window.print()` JavaScript
- **CSS Grid**: Modern browsers (Chrome 57+, Firefox 52+, Safari 10.1+)
- **Barcode font**: Google Fonts CDN (requires internet connection for first load)

## Migration Steps

### For New Installations
1. Use `chem_schema.sql` to create fresh database
2. Run `init_chem_db.py` to initialize connection
3. All features work immediately

### For Existing Databases
1. **Backup your database first!**
   ```bash
   pg_dump -h localhost -U your_user your_db > backup_before_v2.sql
   ```

2. Run migration script:
   ```bash
   psql -h localhost -U your_user -d your_db -f chem_schema_migration_v2.sql
   ```

3. Verify migration:
   ```sql
   -- Check new columns exist
   \d containers
   \d rooms

   -- Check views updated
   SELECT * FROM inventory_view LIMIT 1;
   ```

4. Update your `.env` file (if needed):
   ```
   CHEM_PGHOST=localhost
   CHEM_PGPORT=5432
   CHEM_PGDATABASE=your_db_name
   CHEM_PGUSER=your_username
   CHEM_PGPASSWORD=<redacted-secret-value>
   ```

5. Restart Flask application

## Usage Workflow

### Adding Chemicals with Barcode Printing
1. Navigate to **Chemical Inventory → Add**
2. Fill in chemical details including "Added By" field
3. Click "Add Container(s)"
4. **Automatically redirected** to Barcode Queue with new containers preselected
5. Review selection, adjust if needed
6. Click "Open Print Page"
7. Use browser's print dialog (Ctrl+P / Cmd+P)
8. Print to physical printer or PDF
9. Click "Mark Selected Printed" to update database

### Manual Barcode Printing
1. Navigate to **Barcodes → Queue**
2. Search for specific containers (optional)
3. Check boxes for containers needing labels
4. Click "Open Print Page"
5. Print labels
6. Return to queue and click "Mark Selected Printed"

### Searching Inventory
- **Search box** now searches across ALL fields:
  - Barcode, material name, lot number, owner, notes
  - Room details (number, name, description)
  - Dates (formatted as text in search)
  - Vendor, system, storage locations
  - Numeric fields converted to text for matching

## Key Differences from v5

| Feature | v5 | v2 |
|---------|----|----|
| Barcode printing | None | Full label printing system |
| Search | Limited columns | All fields via row_to_json |
| Navigation | Flat list | Dropdown menu |
| Room tracking | room_name only | room_no, room_name, room_desc, area_class |
| Audit trail | None | added_by, created_at |
| Print tracking | None | label_printed, label_printed_at |
| Add workflow | → Inventory | → Barcode Queue (with preselect) |

## Testing Checklist

- [ ] Add new chemical with all fields filled
- [ ] Verify redirect to barcode queue with preselection
- [ ] Search for chemical by various fields (name, barcode, owner, notes)
- [ ] Select multiple containers in barcode queue
- [ ] Open print page and verify 30 labels per sheet layout
- [ ] Print to PDF and verify label dimensions
- [ ] Mark labels as printed and verify timestamp in database
- [ ] Check inventory view shows "Added By" column
- [ ] Verify dropdown navigation works on all pages
- [ ] Test with existing data (after migration)

## Rollback Procedure

If issues occur, rollback using database backup:

```bash
# Drop existing database
dropdb -h localhost -U your_user your_db

# Restore from backup
createdb -h localhost -U your_user your_db
psql -h localhost -U your_user -d your_db < backup_before_v2.sql
```

Then revert code changes:
```bash
git checkout HEAD~1 app/blueprints/chem_inventory.py
git checkout HEAD~1 app/services/chem_service.py
git checkout HEAD~1 app/templates/chem/
git checkout HEAD~1 chem_schema.sql
```

## Performance Notes

- **row_to_json search**: Slightly slower than column-specific search but negligible for databases <100k records
- **Barcode font loading**: First page load requires internet; subsequent loads use browser cache
- **Print performance**: 30 labels per page is optimal for memory usage and print speed
- **Index on label_printed**: Ensures barcode queue query remains fast even with large datasets

## Future Enhancements

Potential improvements for v3:
- Barcode scanner integration (USB/Bluetooth)
- QR code support (in addition to Code 39)
- Batch import from spreadsheet
- Email notifications for expiring chemicals
- Mobile-responsive barcode queue interface
- Label design customization UI
- Export to CSV/Excel with new fields

## Support

For issues or questions:
1. Check database migration completed successfully (`\d containers`, `\d rooms`)
2. Verify PostgreSQL version supports `row_to_json()` (9.2+)
3. Test barcode font loads in browser console: look for `Libre Barcode 39` in Network tab
4. Review Flask logs for service layer errors
5. Verify environment variables in `.env` file

---

**Upgrade Date**: 2024
**Version**: v2.0
**Compatibility**: PostgreSQL 12+, Flask 3.0+, Python 3.11+
```

## Line-By-Line Reconstruction Notes

### Line 3

```text
This document details the upgrade from Cheminventory_v5 to chem2 (chem-postgres-demo) version, adding professional barcode printing capabilities and improved database schema.
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 8

```text
- **Print-ready label layout**: 30 labels per sheet (5 columns × 6 rows)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 9

```text
- **Standard label compatibility**: Designed for Avery 5160-compatible 1.25" × 1.5" labels
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 10

```text
- **CSS Grid precision layout**: Exact measurements for Letter-size paper (8.5" × 11")
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 11

```text
- **Code 39 barcode font**: Uses Google Fonts "Libre Barcode 39" for barcode rendering
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 12

```text
- **Two-stage workflow**:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 13

```text
  1. **Barcode Queue** (`/chem/barcodes/queue`): Select containers for printing
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 14

```text
  2. **Print Page** (`/chem/barcodes/print`): Browser-native print dialog with formatted labels
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 17

```text
- **Comprehensive field search**: Uses PostgreSQL `row_to_json()` to search ALL fields in one query
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 18

```text
- **Single query performance**: No need to explicitly list columns for search
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 19

```text
- **Case-insensitive matching**: Works across text, dates, numbers, and JSON data
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 22

```text
- **Dropdown menu system**: "Chem Inventory" brand becomes expandable menu
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 23

```text
- **7 navigation items**: Inventory, Add, Report, Upload Scans, Print, Barcodes Queue, Barcodes Print
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 24

```text
- **Responsive design**: Maintains usability on different screen sizes
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 25

```text
- **Print-friendly**: Navigation hidden when printing
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 28

```text
- **Barcode tracking**: `label_printed` (BOOLEAN), `label_printed_at` (TIMESTAMPTZ)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 29

```text
- **Audit trail**: `added_by` (TEXT), `created_at` (TIMESTAMPTZ)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 30

```text
- **Room details**: `room_no`, `room_name`, `room_desc`, `area_class`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 31

```text
- **Updated views**: inventory_view includes all new fields
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 36

```text
1. **app/templates/chem/base.html**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 37

```text
   - Redesigned navigation with dropdown menu
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 38

```text
   - Added 7 navigation links (was 5)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 39

```text
   - Print media query to hide navigation
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 41

```text
2. **app/templates/chem/inventory.html**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 42

```text
   - Barcode column moved to first position with `<code>` tag
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 43

```text
   - Added "Added By" column at end
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 44

```text
   - Now shows 23 columns (was 20)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 46

```text
3. **app/templates/chem/inventory_print.html**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 47

```text
   - Same column updates as inventory.html
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 48

```text
   - Maintains print-specific styling
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 50

```text
4. **app/templates/chem/add.html**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 51

```text
   - Added "Added By" field to Ownership section
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 52

```text
   - Added "Room Name" field to Location section
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 53

```text
   - Restructured location fields (3-column grid)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 55

```text
5. **app/templates/chem/barcode_queue.html** *(NEW)*
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 56

```text
   - Checkbox selection for bulk operations
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 57

```text
   - "Mark Selected Printed" functionality
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 58

```text
   - "Open Print Page" with preselection support
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 59

```text
   - JavaScript for checkbox toggle and form submission
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 61

```text
6. **app/templates/chem/barcode_print.html** *(NEW)*
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 62

```text
   - CSS Grid layout: 5 columns × 6 rows
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 63

```text
   - @page rule: Letter size, specific margins (0.25" T/B, 1.00" L/R)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 64

```text
   - Label dimensions: 1.25" × 1.5" with proper gaps
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 65

```text
   - Libre Barcode 39 font integration
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 66

```text
   - Auto-padding to 30 labels per sheet
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 67

```text
   - Page breaks between sheets
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 70

```text
1. **app/blueprints/chem_inventory.py**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 71

```text
   - Added `jsonify` import
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 72

```text
   - Added 4 new routes:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 73

```text
     - `/chem/barcodes/queue` (GET): barcode management interface
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 74

```text
     - `/chem/barcodes/print` (GET): print page with selected labels
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 75

```text
     - `/chem/barcodes/mark-printed` (POST): mark labels as printed
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 76

```text
     - `/chem/api/inventory_json` (GET): JSON API endpoint
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 77

```text
   - Updated `add()` route:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 78

```text
     - Extracts `room_name` and `added_by` from form
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 79

```text
     - Returns list of new barcodes
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 80

```text
     - Redirects to barcode queue with preselect parameter
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 82

```text
2. **app/services/chem_service.py**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 83

```text
   - Updated `search_inventory()`:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 84

```text
     - Uses `row_to_json(iv)::text ILIKE :q` for comprehensive search
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 85

```text
     - Searches all fields without explicit column listing
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 86

```text
   - Updated `_resolve_room()`:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 87

```text
     - Now accepts `room_name` parameter
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 88

```text
     - Matches on room_no, room_name, room_desc, area_class
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 89

```text
   - Updated `add_containers()`:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 90

```text
     - Accepts `room_name` and `added_by` in data dict
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 91

```text
     - Returns list of new barcodes (was count)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 92

```text
     - Inserts `added_by` into containers table
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 93

```text
   - Added 3 new methods:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 94

```text
     - `get_barcode_queue(search_query)`: Returns unprinted containers
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 95

```text
     - `get_barcode_labels(barcode_list, copies)`: Prepares label data
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 96

```text
     - `mark_barcodes_printed(barcode_list)`: Updates print status
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 99

```text
1. **chem_schema.sql** *(UPDATED)*
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 100

```text
   - **rooms table**: Added `room_no`, `room_name`, `room_desc`, `area_class`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 101

```text
   - **containers table**: Added `added_by`, `created_at`, `label_printed`, `label_printed_at`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 102

```text
   - **Index**: Added `idx_containers_label_printed` for performance
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 103

```text
   - **inventory_view**: Includes all new fields
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 104

```text
   - **v_all_containers**: Includes new room and tracking fields
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 106

```text
2. **chem_schema_migration_v2.sql** *(NEW)*
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 107

```text
   - Migration script for existing databases
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 108

```text
   - Adds all new columns with ALTER TABLE
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 109

```text
   - Updates views to include new fields
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 110

```text
   - Idempotent (safe to run multiple times)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 115

```text
- **Sheet size**: 8.5" × 11" (US Letter)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 116

```text
- **Page margins**: 0.25" top/bottom, 1.00" left/right
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 117

```text
- **Label dimensions**: 1.25" width × 1.5" height
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 118

```text
- **Column gap**: 0.17" (between labels horizontally)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 119

```text
- **Row gap**: 0.3" (between labels vertically)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 120

```text
- **Labels per sheet**: 30 (5 columns × 6 rows)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 121

```text
- **Label content**:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 122

```text
  - Barcode (Code 39 format: `*BARCODE*`)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 123

```text
  - Item name (truncated if needed)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 124

```text
  - Lot number
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 127

```text
- **Version**: 9.2+ (for `row_to_json()` function)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 128

```text
- **Extensions**: None required
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 129

```text
- **New indexes**: `idx_containers_label_printed`
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 132

```text
- **Print API**: Standard `window.print()` JavaScript
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 133

```text
- **CSS Grid**: Modern browsers (Chrome 57+, Firefox 52+, Safari 10.1+)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 134

```text
- **Barcode font**: Google Fonts CDN (requires internet connection for first load)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 139

```text
1. Use `chem_schema.sql` to create fresh database
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 140

```text
2. Run `init_chem_db.py` to initialize connection
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 141

```text
3. All features work immediately
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 144

```text
1. **Backup your database first!**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 145

```text
   ```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 146

```text
   pg_dump -h localhost -U your_user your_db > backup_before_v2.sql
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 147

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 149

```text
2. Run migration script:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 150

```text
   ```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 151

```text
   psql -h localhost -U your_user -d your_db -f chem_schema_migration_v2.sql
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 152

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 154

```text
3. Verify migration:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 155

```text
   ```sql
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 156

```text
   -- Check new columns exist
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 157

```text
   \d containers
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 158

```text
   \d rooms
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 160

```text
   -- Check views updated
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 161

```text
   SELECT * FROM inventory_view LIMIT 1;
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 162

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 164

```text
4. Update your `.env` file (if needed):
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 165

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 166

```text
   CHEM_PGHOST=localhost
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 167

```text
   CHEM_PGPORT=5432
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 168

```text
   CHEM_PGDATABASE=your_db_name
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 169

```text
   CHEM_PGUSER=your_username
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 170

```text
   CHEM_PGPASSWORD=<redacted-secret-value>
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 171

```text
   ```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 173

```text
5. Restart Flask application
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 178

```text
1. Navigate to **Chemical Inventory → Add**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 179

```text
2. Fill in chemical details including "Added By" field
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 180

```text
3. Click "Add Container(s)"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 181

```text
4. **Automatically redirected** to Barcode Queue with new containers preselected
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 182

```text
5. Review selection, adjust if needed
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 183

```text
6. Click "Open Print Page"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 184

```text
7. Use browser's print dialog (Ctrl+P / Cmd+P)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 185

```text
8. Print to physical printer or PDF
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 186

```text
9. Click "Mark Selected Printed" to update database
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 189

```text
1. Navigate to **Barcodes → Queue**
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 190

```text
2. Search for specific containers (optional)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 191

```text
3. Check boxes for containers needing labels
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 192

```text
4. Click "Open Print Page"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 193

```text
5. Print labels
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 194

```text
6. Return to queue and click "Mark Selected Printed"
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 197

```text
- **Search box** now searches across ALL fields:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 198

```text
  - Barcode, material name, lot number, owner, notes
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 199

```text
  - Room details (number, name, description)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 200

```text
  - Dates (formatted as text in search)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 201

```text
  - Vendor, system, storage locations
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 202

```text
  - Numeric fields converted to text for matching
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 206

```text
| Feature | v5 | v2 |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 207

```text
|---------|----|----|
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 208

```text
| Barcode printing | None | Full label printing system |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 209

```text
| Search | Limited columns | All fields via row_to_json |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 210

```text
| Navigation | Flat list | Dropdown menu |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 211

```text
| Room tracking | room_name only | room_no, room_name, room_desc, area_class |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 212

```text
| Audit trail | None | added_by, created_at |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 213

```text
| Print tracking | None | label_printed, label_printed_at |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 214

```text
| Add workflow | → Inventory | → Barcode Queue (with preselect) |
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 218

```text
- [ ] Add new chemical with all fields filled
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 219

```text
- [ ] Verify redirect to barcode queue with preselection
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 220

```text
- [ ] Search for chemical by various fields (name, barcode, owner, notes)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 221

```text
- [ ] Select multiple containers in barcode queue
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 222

```text
- [ ] Open print page and verify 30 labels per sheet layout
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 223

```text
- [ ] Print to PDF and verify label dimensions
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 224

```text
- [ ] Mark labels as printed and verify timestamp in database
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 225

```text
- [ ] Check inventory view shows "Added By" column
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 226

```text
- [ ] Verify dropdown navigation works on all pages
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 227

```text
- [ ] Test with existing data (after migration)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 231

```text
If issues occur, rollback using database backup:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 233

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 235

```text
dropdb -h localhost -U your_user your_db
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 238

```text
createdb -h localhost -U your_user your_db
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 239

```text
psql -h localhost -U your_user -d your_db < backup_before_v2.sql
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 240

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 242

```text
Then revert code changes:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 243

```text
```bash
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 244

```text
git checkout HEAD~1 app/blueprints/chem_inventory.py
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 245

```text
git checkout HEAD~1 app/services/chem_service.py
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 246

```text
git checkout HEAD~1 app/templates/chem/
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 247

```text
git checkout HEAD~1 chem_schema.sql
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 248

```text
```
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 252

```text
- **row_to_json search**: Slightly slower than column-specific search but negligible for databases <100k records
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 253

```text
- **Barcode font loading**: First page load requires internet; subsequent loads use browser cache
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 254

```text
- **Print performance**: 30 labels per page is optimal for memory usage and print speed
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 255

```text
- **Index on label_printed**: Ensures barcode queue query remains fast even with large datasets
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 259

```text
Potential improvements for v3:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 260

```text
- Barcode scanner integration (USB/Bluetooth)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 261

```text
- QR code support (in addition to Code 39)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 262

```text
- Batch import from spreadsheet
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 263

```text
- Email notifications for expiring chemicals
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 264

```text
- Mobile-responsive barcode queue interface
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 265

```text
- Label design customization UI
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 266

```text
- Export to CSV/Excel with new fields
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 270

```text
For issues or questions:
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 271

```text
1. Check database migration completed successfully (`\d containers`, `\d rooms`)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 272

```text
2. Verify PostgreSQL version supports `row_to_json()` (9.2+)
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 273

```text
3. Test barcode font loads in browser console: look for `Libre Barcode 39` in Network tab
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 274

```text
4. Review Flask logs for service layer errors
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 275

```text
5. Verify environment variables in `.env` file
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.

### Line 277

```text
---
```

`prose` — This documentation line is part of the original repo's operator or developer guidance. Preserve the claim only if it still matches source and live state; edge cases include stale paths, old deployment assumptions, and instructions that expose secrets.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/CHEM_INVENTORY_V2_UPGRADE.md`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
