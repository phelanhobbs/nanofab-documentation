

# Source Reconstruction: UNanofabTools/app/blueprints/chem_inventory_remote.py

- Repository: `UNanofabTools`
- Relative path: `app/blueprints/chem_inventory_remote.py`
- Lines read: `524`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `edc60572fd14ea4f`
- Code fence language: `python`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Python Structure Summary

- Imports: `from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, Response`, `from flask_login import login_required, current_user`, `from sqlalchemy import text`, `from app.services.chem_service import ChemInventoryService`
- Classes: none detected
- Functions: `inventory`, `inventory_print`, `add`, `report`, `upload_scans`, `barcode_queue`, `barcode_print`, `barcode_mark_printed`, `api_inventory`, `inventory_export_csv`, `remove_material`, `move_material`, `transactions`, `api_suggest`, `api_autofill`, `barcode_print_selected`, `edit`, `edit_container`, `container_lookup`, `move_bulk`
- Routes: `@chem_bp.route('/')`, `@chem_bp.route('/inventory')`, `@chem_bp.route('/inventory/print')`, `@chem_bp.route('/add', methods=["GET", "POST"])`, `@chem_bp.route('/report')`, `@chem_bp.route('/upload-scans', methods=["GET", "POST"])`, `@chem_bp.route('/barcodes/queue')`, `@chem_bp.route('/barcodes/print')`, `@chem_bp.route('/barcodes/mark-printed', methods=['POST'])`, `@chem_bp.route('/api/inventory_json')`, `@chem_bp.route("/inventory/export.csv")`, `@chem_bp.route("/remove", methods=["GET", "POST"])`, `@chem_bp.route("/move", methods=["GET", "POST"])`, `@chem_bp.route("/transactions")`, `@chem_bp.route("/api/suggest")`, `@chem_bp.route("/api/autofill")`, `#@chem_bp.route("/api/container_lookup")`, `@chem_bp.route("/barcodes/print-selected", methods=["POST"])`, `@chem_bp.route("/edit", methods=["GET"])`, `@chem_bp.route("/edit-container", methods=["POST"])`, `@chem_bp.route("/api/container_lookup")`, `@chem_bp.route("/move-bulk", methods=["POST"])`

## Sanitized Source Excerpt

```python
"""
Chemical Inventory Blueprint
Routes for managing chemical inventory
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, Response
from flask_login import login_required, current_user
from sqlalchemy import text
from app.services.chem_service import ChemInventoryService

chem_bp = Blueprint('chem', __name__, url_prefix='/chem')


@chem_bp.route('/')
@chem_bp.route('/inventory')
def inventory():
    q = request.args.get("q", "").strip()
    limit = request.args.get("limit", type=int, default=500)

    show_removed = request.args.get("show_removed", "0")  # "1" to include Removed
    show_printed = request.args.get("show_printed", "0")  # "1" to show Printed column

    service = ChemInventoryService()
    rows = service.search_inventory(q, limit, show_removed=show_removed)

    return render_template(
        "chem/inventory.html",
        rows=rows, q=q, limit=limit,
        show_removed=show_removed,
        show_printed=show_printed
    )


@chem_bp.route('/inventory/print')
def inventory_print():
    """Print-friendly inventory view"""
    q = request.args.get("q", "").strip()
    limit = request.args.get("limit", type=int, default=5000)

    service = ChemInventoryService()
    rows = service.search_inventory(q, limit)

    return render_template("chem/inventory_print.html", rows=rows, q=q, limit=limit)


@chem_bp.route('/add', methods=["GET", "POST"])
def add():
    """Add new chemical containers"""
    if request.method == "POST":
        # Extract form data
        data = {
            # Material
            'name': (request.form.get("name") or "").strip(),
            'vendor_name': (request.form.get("vendor") or "").strip(),
            'catalog': (request.form.get("catalog") or "").strip(),
            'state': (request.form.get("state") or "").strip(),
            'size': (request.form.get("size") or "").strip(),
            'unit': (request.form.get("unit") or "").strip(),
            'system': (request.form.get("system") or "").strip(),
            'lot_number': (request.form.get("lot_number") or "").strip(),

            # Quantity
            'qty': max(1, min(int(request.form.get("qty") or "1"), 500)),

            # Location
            'area_class': (request.form.get("area_class") or "").strip(),
            'room_no': (request.form.get("room_no") or "").strip(),
            'room_name': (request.form.get("room_name") or "").strip(),
            'room_desc': (request.form.get("room_desc") or "").strip(),
            'storage_location': (request.form.get("storage_location") or "").strip(),
            'storage_subloc': (request.form.get("storage_sublocation") or "").strip(),
            'storage_device': (request.form.get("storage_device") or "").strip(),

            # Dates & compliance
            'entry': request.form.get("entry") or None,
            'manuf_date': request.form.get("manuf_date") or None,
            'expire': request.form.get("expire") or None,
            'choice': (request.form.get("choice") or "").strip(),
            'nmr': (request.form.get("nmr") or "").strip(),
            'nmr_exp': request.form.get("nmr_exp") or None,

            # Ownership
            'owner': (request.form.get("owner") or "").strip(),
            'added_by': (request.form.get("added_by") or "").strip(),
            'notes': (request.form.get("notes") or "").strip(),
        }

        if not data['name']:
            flash("Material Name is required.", "warning")
            return redirect(url_for("chem.add"))

        try:
            service = ChemInventoryService()
            new_barcodes = service.add_containers(data)
            flash(f"Added {len(new_barcodes)} container(s). Unique barcodes assigned.", "success")
            # Redirect to barcode queue with new barcodes preselected
            return redirect(url_for("chem.barcode_queue", preselect=",".join(new_barcodes)))
        except Exception as e:
            flash(f"Error adding containers: {str(e)}", "error")
            return redirect(url_for("chem.add"))

    return render_template("chem/add.html")


@chem_bp.route('/report')
def report():
    """Display inventory reports and statistics"""
    service = ChemInventoryService()

    try:
        report_data = service.get_reports()
        return render_template("chem/report.html", **report_data)
    except Exception as e:
        flash(f"Error generating report: {str(e)}", "error")
        return redirect(url_for("chem.inventory"))


@chem_bp.route('/upload-scans', methods=["GET", "POST"])
def upload_scans():
    """Upload barcode scan files"""
    if request.method == "POST":
        f = request.files.get("file")
        user = current_user.username if current_user.is_authenticated else None

        if not f or not f.filename:
            flash("Please choose a TXT file.", "warning")
            return redirect(url_for("chem.upload_scans"))

        # Read barcode lines from file
        codes = []
        for raw in f.stream.readlines():
            try:
                line = raw.decode("utf-8", "ignore").strip()
            except Exception:
                line = str(raw).strip()
            if line:
                codes.append(line)

        if not codes:
            flash("The file appears empty.", "warning")
            return redirect(url_for("chem.upload_scans"))

        try:
            service = ChemInventoryService()
            cycle_id = service.import_scans(codes, f.filename, user)
            flash(f"Scan file imported successfully. Cycle ID: {cycle_id}", "success")
            return redirect(url_for("chem.report"))
        except Exception as e:
            flash(f"Error importing scans: {str(e)}", "error")
            return redirect(url_for("chem.upload_scans"))

    return render_template("chem/upload_scans.html")


@chem_bp.route('/barcodes/queue')
def barcode_queue():
    """Show unprinted barcodes queue"""
    q = request.args.get('q', '').strip()
    only_unprinted = request.args.get('only_unprinted', '1')
    limit = request.args.get('limit', type=int) or 500
    preselect = request.args.get('preselect', '').strip()

    service = ChemInventoryService()
    rows = service.get_barcode_queue(q, only_unprinted, limit)

    preselected = set([p.strip() for p in preselect.split(',') if p.strip()])

    return render_template(
        "chem/barcode_queue.html",
        rows=rows,
        q=q,
        limit=limit,
        only_unprinted=only_unprinted,
        preselected=preselected
    )


@chem_bp.route('/barcodes/print')
def barcode_print():
    """Print barcode labels"""
    q = request.args.get('q', '').strip()
    copies = max(1, int(request.args.get('copies', 1)))
    limit = 1000

    service = ChemInventoryService()
    labels = service.get_barcode_labels(q, copies, limit)

    # Chunk into pages of 30 labels (5 cols x 6 rows)
    pages = [labels[i:i+30] for i in range(0, len(labels), 30)] if labels else [[]]

    return render_template("chem/barcode_print.html", pages=pages, q=q, copies=copies)


@chem_bp.route('/barcodes/mark-printed', methods=['POST'])
def barcode_mark_printed():
    """Mark selected barcodes as printed"""
    barcodes = request.form.getlist('barcode')

    if not barcodes:
        flash("No barcodes selected.", "warning")
        return redirect(url_for('chem.barcode_queue'))

    try:
        service = ChemInventoryService()
        count = service.mark_barcodes_printed(barcodes)
        flash(f"Marked {count} barcode(s) as printed.", "success")
    except Exception as e:
        flash(f"Error marking barcodes: {str(e)}", "error")

    return redirect(url_for('chem.barcode_queue'))


@chem_bp.route('/api/inventory_json')
def api_inventory():
    """API endpoint for inventory data"""
    q = request.args.get('q', '').strip()
    limit = request.args.get('limit', type=int) or 500

    service = ChemInventoryService()
    rows = service.search_inventory(q, limit)

    return jsonify({'rows': [dict(r) for r in rows]})

#Chem Inventory Export 12/18/2025 -WORKS- =)
@chem_bp.route("/inventory/export.csv")
def inventory_export_csv():
    q = request.args.get("q", "").strip()
    limit = request.args.get("limit", type=int, default=500000)

    service = ChemInventoryService()
    csv_text = service.export_inventory_csv(q, limit)

    return Response(
        csv_text,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=cheminventory_export.csv"},
    )

#Remove Route 12/18/2025
#Updated 1/13/2026
@chem_bp.route("/remove", methods=["GET", "POST"])
def remove_material():
    if request.method == "POST":
        barcode = (request.form.get("barcode") or "").strip()
        reason = (request.form.get("reason") or "").strip() or None
        notes = (request.form.get("notes") or "").strip() or None

        user = None
        if current_user.is_authenticated:
            user = current_user.username
        else:
            user = (request.form.get("performed_by") or "").strip() or None

        if not barcode:
            flash("Barcode is required.", "warning")
            return redirect(url_for("chem.remove_material"))

        try:
            service = ChemInventoryService()
            service.remove_container(barcode, removed_by=user, reason=reason, notes=notes)
            flash(f"Removed container {barcode}.", "success")
            return redirect(url_for("chem.inventory", q=barcode))
        except Exception as e:
            flash(f"Error removing container: {str(e)}", "error")
            return redirect(url_for("chem.remove_material"))

    return render_template("chem/remove.html")

#Move Route 12/18/2025
#Updated 1/13/2025
@chem_bp.route("/move", methods=["GET", "POST"])
def move_material():
    if request.method == "POST":
        barcode = (request.form.get("barcode") or "").strip()

        room_no = (request.form.get("room_no") or "").strip()
        room_desc = (request.form.get("room_desc") or "").strip()
        area_class = (request.form.get("area_class") or "").strip()

        storage_location = (request.form.get("storage_location") or "").strip()
        storage_sublocation = (request.form.get("storage_sublocation") or "").strip()
        storage_device = (request.form.get("storage_device") or "").strip()

        user = None
        if current_user.is_authenticated:
            user = current_user.username
        else:
            user = (request.form.get("performed_by") or "").strip() or None

        if not barcode:
            flash("Barcode is required.", "warning")
            return redirect(url_for("chem.move_material"))

        try:
            service = ChemInventoryService()
            service.move_container(
                barcode=barcode,
                room_no=room_no,
                room_desc=room_desc,
                area_class=area_class,
                storage_location=storage_location,
                storage_sublocation=storage_sublocation,
                storage_device=storage_device,
                moved_by=user,
            )
            flash(f"Moved {barcode}.", "success")
            return redirect(url_for("chem.inventory", q=barcode))
        except Exception as e:
            flash(f"Error moving container: {str(e)}", "error")
            return redirect(url_for("chem.move_material"))

    return render_template("chem/move.html")

#Transactions Route 12/18/2025

@chem_bp.route("/transactions")
def transactions():
    q = (request.args.get("q") or "").strip()
    limit = 1000
    service = ChemInventoryService()
    rows = service.get_transactions(q=q, limit=limit)
    return render_template("chem/transactions.html", rows=rows, q=q, limit=limit)

#Suggest endpoint for type ahead Lists 1/7/2025
@chem_bp.route("/api/suggest")
def api_suggest():
    field = (request.args.get("field") or "").strip()
    q = (request.args.get("q") or "").strip()
    limit = request.args.get("limit", type=int, default=10)

    service = ChemInventoryService()
    results = service.suggest(field, q, limit)
    return jsonify({"results": results})

#Auto Fill by catalog or barcode endpoint 1/7/2025
@chem_bp.route("/api/autofill")
def api_autofill():
    catalog = (request.args.get("catalog") or "").strip()
    name = (request.args.get("name") or "").strip()

    service = ChemInventoryService()
    data = service.autofill(catalog=catalog, name=name)
    return jsonify({"data": data})

#container lookup api route added 1/13/2026
#@chem_bp.route("/api/container_lookup")
#def api_container_lookup():
#    barcode = (request.args.get("barcode") or "").strip()
#    service = ChemInventoryService()
#    data = service.get_container_location(barcode)
#    return jsonify({"data": data or {}})

#print to np700
@chem_bp.route("/barcodes/print-selected", methods=["POST"])
def barcode_print_selected():
    """Redirect to barcode print page with selected barcodes"""
    barcodes = request.form.getlist("barcode")

    if not barcodes:
        flash("No barcodes selected to print.", "warning")
        return redirect(url_for("chem.barcode_queue"))

    # Pass as comma-separated list
    return redirect(url_for("chem.barcode_print", barcodes=",".join(barcodes)))

#4/2/2026 Move Page pushed to live
@chem_bp.route("/edit", methods=["GET"])
def edit():
    return render_template("chem/edit.html")


@chem_bp.route("/edit-container", methods=["POST"])
def edit_container():
    container_id = request.form.get("container_id")

    if not container_id:
        flash("Missing container_id", "danger")
        return redirect(url_for("chem.edit"))

    try:
        container_id = int(container_id)
    except ValueError:
        flash("Invalid container_id", "danger")
        return redirect(url_for("chem.edit"))

    data = {
        "item_name": request.form.get("item_name"),
        "description": request.form.get("description"),
        "catalog_number": request.form.get("catalog_number"),
        "physical_state": request.form.get("physical_state"),
        "size": request.form.get("size"),
        "unit": request.form.get("unit"),
        "system": request.form.get("system"),
        "vendor_name": request.form.get("vendor_name"),

        "room_no": request.form.get("room_no"),
        "room_name": request.form.get("room_name"),
        "room_desc": request.form.get("room_desc"),
        "area_class": request.form.get("area_class"),

        "storage_location": request.form.get("storage_location"),
        "storage_sublocation": request.form.get("storage_sublocation"),
        "storage_device": request.form.get("storage_device"),

        "manuf_date": request.form.get("manuf_date"),
        "expiry_date": request.form.get("expiry_date"),
        "lot_number": request.form.get("lot_number"),
        "choice": request.form.get("choice"),
        "nmr": request.form.get("nmr"),
        "nmr_expiry": request.form.get("nmr_expiry"),
        "owner": request.form.get("owner"),
        "notes": request.form.get("notes"),
        "added_by": request.form.get("added_by"),
    }

    service = ChemInventoryService()
    service.update_container(container_id, data)

    flash("Updated successfully", "success")
    return redirect(url_for("chem.edit"))

@chem_bp.route("/api/container_lookup")
def container_lookup():
    barcode = (request.args.get("barcode") or "").strip()
    if not barcode:
        return jsonify({"data": None})

    service = ChemInventoryService()

    with service.engine.begin() as conn:
        row = conn.execute(text("""
            SELECT
                c.container_id,
                c.item_id,
                c.room_id,
                c.barcode,
                c.container_code,

                i.name AS item_name,
                i.description AS description,
                i.catalog_number AS catalog_number,
                i.physical_state AS physical_state,

                COALESCE(c.size, i.volume_size) AS size,
                c.unit AS unit,
                c.system AS system,

                v.vendor_name AS vendor_name,

                r.room_no AS room_no,
                r.room_name AS room_name,
                r.room_desc AS room_desc,
                COALESCE(c.area_class, r.area_class) AS area_class,

                c.storage_location AS storage_location,
                c.storage_sublocation AS storage_sublocation,
                c.storage_device AS storage_device,

                c.manuf_date AS manuf_date,
                c.expiry_date AS expiry_date,
                c.lot_number AS lot_number,
                c.choice AS choice,
                c.nmr AS nmr,
                c.nmr_expiry AS nmr_expiry,
                c.owner AS owner,
                c.notes AS notes,
                c.added_by AS added_by
            FROM containers c
            LEFT JOIN items i   ON c.item_id = i.item_id
            LEFT JOIN vendors v ON i.vendor_id = v.vendor_id
            LEFT JOIN rooms r   ON c.room_id = r.room_id
            WHERE c.barcode = :barcode
            LIMIT 1
        """), {"barcode": barcode}).mappings().first()

    print("LOOKUP ROW:", dict(row) if row else None)
    return jsonify({"data": dict(row) if row else None})

# Added 4/8/2026 Bulk Inventory update to "Move" inventory page
@chem_bp.route("/move-bulk", methods=["POST"])
def move_bulk():
    service = ChemInventoryService()

    raw_barcodes = request.form.get("bulk_barcodes")
    room_no = request.form.get("room_no")
    room_desc = request.form.get("room_desc")
    area_class = request.form.get("area_class")
    storage_location = request.form.get("storage_location")
    storage_sublocation = request.form.get("storage_sublocation")
    storage_device = request.form.get("storage_device")
    performed_by = request.form.get("performed_by")

    print("BULK MOVE FORM:", dict(request.form))

    result = service.bulk_move_by_barcodes(
        raw_barcodes=raw_barcodes,
        room_no=room_no,
        room_desc=room_desc,
        area_class=area_class,
        storage_location=storage_location,
        storage_sublocation=storage_sublocation,
        storage_device=storage_device,
        performed_by=performed_by,
    )

    if result["requested_count"] == 0:
        flash("No barcodes were provided.", "warning")
        return redirect(url_for("chem.move_material"))

    if result["moved_count"] > 0:
        flash(
            f'Bulk move complete: moved {result["moved_count"]} of {result["requested_count"]} scanned barcode(s).',
            "success"
        )
    else:
        flash("No matching containers were moved.", "warning")

    if result["unmatched"]:
        flash(
            "Unmatched barcode(s): " + ", ".join(result["unmatched"][:20]) +
            (" ..." if len(result["unmatched"]) > 20 else ""),
            "warning"
        )

    return redirect(url_for("chem.move_material"))
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 1 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `none` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
Chemical Inventory Blueprint
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 2 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
Routes for managing chemical inventory
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 3 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 4 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, Response
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 5 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `generic` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
from flask_login import login_required, current_user
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 6 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
from sqlalchemy import text
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 7 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `import`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
from app.services.chem_service import ChemInventoryService
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 8 is classified as `import`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions. Neighbor context: previous kind is `import` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 9 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `import` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
chem_bp = Blueprint('chem', __name__, url_prefix='/chem')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 10 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 11 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 12 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
@chem_bp.route('/')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 13 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
@chem_bp.route('/inventory')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 14 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `route` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
def inventory():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 15 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
    q = request.args.get("q", "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 16 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
    limit = request.args.get("limit", type=int, default=500)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 17 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 18 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
    show_removed = request.args.get("show_removed", "0")  # "1" to include Removed
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 19 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
    show_printed = request.args.get("show_printed", "0")  # "1" to show Printed column
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 20 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 21 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 22 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
    rows = service.search_inventory(q, limit, show_removed=show_removed)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 23 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 24 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
    return render_template(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 25 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
        "chem/inventory.html",
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 26 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
        rows=rows, q=q, limit=limit,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 27 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
        show_removed=show_removed,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 28 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
        show_printed=show_printed
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 29 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
    )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 30 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 31 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 32 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
@chem_bp.route('/inventory/print')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 33 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
def inventory_print():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 34 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
    """Print-friendly inventory view"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 35 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
    q = request.args.get("q", "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 36 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
    limit = request.args.get("limit", type=int, default=5000)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 37 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 38 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 39 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
    rows = service.search_inventory(q, limit)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 40 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 41 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
    return render_template("chem/inventory_print.html", rows=rows, q=q, limit=limit)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 42 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 43 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 44 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
@chem_bp.route('/add', methods=["GET", "POST"])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 45 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
def add():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 46 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
    """Add new chemical containers"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 47 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
    if request.method == "POST":
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 48 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
        # Extract form data
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 49 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
        data = {
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 50 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
            # Material
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 51 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
            'name': (request.form.get("name") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 52 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `comment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
            'vendor_name': (request.form.get("vendor") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 53 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
            'catalog': (request.form.get("catalog") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 54 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
            'state': (request.form.get("state") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 55 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
            'size': (request.form.get("size") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 56 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
            'unit': (request.form.get("unit") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 57 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
            'system': (request.form.get("system") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 58 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
            'lot_number': (request.form.get("lot_number") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 59 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 60 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
            # Quantity
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 61 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
            'qty': max(1, min(int(request.form.get("qty") or "1"), 500)),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 62 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 63 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
            # Location
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 64 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
            'area_class': (request.form.get("area_class") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 65 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `comment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
            'room_no': (request.form.get("room_no") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 66 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
            'room_name': (request.form.get("room_name") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 67 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
            'room_desc': (request.form.get("room_desc") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 68 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
            'storage_location': (request.form.get("storage_location") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 69 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
            'storage_subloc': (request.form.get("storage_sublocation") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 70 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
            'storage_device': (request.form.get("storage_device") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 71 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 72 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
            # Dates & compliance
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 73 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
            'entry': request.form.get("entry") or None,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 74 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `comment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
            'manuf_date': request.form.get("manuf_date") or None,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 75 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
            'expire': request.form.get("expire") or None,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 76 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
            'choice': (request.form.get("choice") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 77 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
            'nmr': (request.form.get("nmr") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 78 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
            'nmr_exp': request.form.get("nmr_exp") or None,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 79 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 80 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
            # Ownership
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 81 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
            'owner': (request.form.get("owner") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 82 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `comment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
            'added_by': (request.form.get("added_by") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 83 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
            'notes': (request.form.get("notes") or "").strip(),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 84 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
        }
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 85 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 86 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
        if not data['name']:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 87 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
            flash("Material Name is required.", "warning")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 88 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
            return redirect(url_for("chem.add"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 89 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 90 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
        try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 91 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
            service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 92 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
            new_barcodes = service.add_containers(data)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 93 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
            flash(f"Added {len(new_barcodes)} container(s). Unique barcodes assigned.", "success")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 94 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
            # Redirect to barcode queue with new barcodes preselected
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 95 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
            return redirect(url_for("chem.barcode_queue", preselect=",".join(new_barcodes)))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 96 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `comment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
        except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 97 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
            flash(f"Error adding containers: {str(e)}", "error")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 98 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
            return redirect(url_for("chem.add"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 99 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 100 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
    return render_template("chem/add.html")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 101 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 102 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 103 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
@chem_bp.route('/report')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 104 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
def report():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 105 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
    """Display inventory reports and statistics"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 106 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 107 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 108 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 109 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
        report_data = service.get_reports()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 110 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
        return render_template("chem/report.html", **report_data)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 111 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `assignment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 112 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
        flash(f"Error generating report: {str(e)}", "error")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 113 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
        return redirect(url_for("chem.inventory"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 114 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 115 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 116 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
@chem_bp.route('/upload-scans', methods=["GET", "POST"])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 117 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
def upload_scans():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 118 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
    """Upload barcode scan files"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 119 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
    if request.method == "POST":
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 120 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
        f = request.files.get("file")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 121 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
        user = current_user.username if current_user.is_authenticated else None
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 122 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 123 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
        if not f or not f.filename:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 124 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
            flash("Please choose a TXT file.", "warning")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 125 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
            return redirect(url_for("chem.upload_scans"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 126 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 127 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
        # Read barcode lines from file
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 128 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
        codes = []
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 129 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `loop`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
        for raw in f.stream.readlines():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 130 is classified as `loop`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones. Neighbor context: previous kind is `assignment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
            try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 131 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `loop` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
                line = raw.decode("utf-8", "ignore").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 132 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
            except Exception:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 133 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
                line = str(raw).strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 134 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
            if line:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 135 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
                codes.append(line)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 136 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 137 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
        if not codes:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 138 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
            flash("The file appears empty.", "warning")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 139 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
            return redirect(url_for("chem.upload_scans"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 140 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 141 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
        try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 142 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
            service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 143 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
            cycle_id = service.import_scans(codes, f.filename, user)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 144 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
            flash(f"Scan file imported successfully. Cycle ID: {cycle_id}", "success")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 145 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
            return redirect(url_for("chem.report"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 146 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
        except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 147 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
            flash(f"Error importing scans: {str(e)}", "error")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 148 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
            return redirect(url_for("chem.upload_scans"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 149 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 150 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
    return render_template("chem/upload_scans.html")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 151 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 152 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 153 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
@chem_bp.route('/barcodes/queue')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 154 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
def barcode_queue():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 155 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
    """Show unprinted barcodes queue"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 156 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
    q = request.args.get('q', '').strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 157 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
    only_unprinted = request.args.get('only_unprinted', '1')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 158 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
    limit = request.args.get('limit', type=int) or 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 159 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `database`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
    preselect = request.args.get('preselect', '').strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 160 is classified as `database`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 161 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `database` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 162 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
    rows = service.get_barcode_queue(q, only_unprinted, limit)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 163 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 164 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
    preselected = set([p.strip() for p in preselect.split(',') if p.strip()])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 165 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 166 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
    return render_template(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 167 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 168

```text
        "chem/barcode_queue.html",
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 168 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 169

```text
        rows=rows,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 169 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 170

```text
        q=q,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 170 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 171

```text
        limit=limit,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 171 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 172

```text
        only_unprinted=only_unprinted,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 172 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 173

```text
        preselected=preselected
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 173 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 174

```text
    )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 174 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 175

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 175 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 176

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 176 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 177

```text
@chem_bp.route('/barcodes/print')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 177 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 178

```text
def barcode_print():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 178 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 179

```text
    """Print barcode labels"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 179 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 180

```text
    q = request.args.get('q', '').strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 180 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 181

```text
    copies = max(1, int(request.args.get('copies', 1)))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 181 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 182

```text
    limit = 1000
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 182 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 183

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 183 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 184

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 184 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 185

```text
    labels = service.get_barcode_labels(q, copies, limit)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 185 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 186

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 186 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 187

```text
    # Chunk into pages of 30 labels (5 cols x 6 rows)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 187 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 188

```text
    pages = [labels[i:i+30] for i in range(0, len(labels), 30)] if labels else [[]]
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 188 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 189

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 189 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 190

```text
    return render_template("chem/barcode_print.html", pages=pages, q=q, copies=copies)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 190 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 191

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 191 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 192

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 192 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 193

```text
@chem_bp.route('/barcodes/mark-printed', methods=['POST'])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 193 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 194

```text
def barcode_mark_printed():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 194 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 195

```text
    """Mark selected barcodes as printed"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 195 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 196

```text
    barcodes = request.form.getlist('barcode')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 196 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 197

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 197 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 198

```text
    if not barcodes:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 198 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 199

```text
        flash("No barcodes selected.", "warning")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 199 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 200

```text
        return redirect(url_for('chem.barcode_queue'))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 200 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 201

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 201 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 202

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 202 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 203

```text
        service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 203 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 204

```text
        count = service.mark_barcodes_printed(barcodes)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 204 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 205

```text
        flash(f"Marked {count} barcode(s) as printed.", "success")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 205 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 206

```text
    except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 206 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 207

```text
        flash(f"Error marking barcodes: {str(e)}", "error")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 207 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 208

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 208 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 209

```text
    return redirect(url_for('chem.barcode_queue'))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 209 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 210

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 210 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 211

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 211 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 212

```text
@chem_bp.route('/api/inventory_json')
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 212 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 213

```text
def api_inventory():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 213 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 214

```text
    """API endpoint for inventory data"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 214 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 215

```text
    q = request.args.get('q', '').strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 215 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 216

```text
    limit = request.args.get('limit', type=int) or 500
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 216 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 217

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 217 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 218

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 218 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 219

```text
    rows = service.search_inventory(q, limit)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 219 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 220

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 220 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 221

```text
    return jsonify({'rows': [dict(r) for r in rows]})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 221 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 222

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 222 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 223

```text
#Chem Inventory Export 12/18/2025 -WORKS- =)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 223 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 224

```text
@chem_bp.route("/inventory/export.csv")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 224 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `comment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 225

```text
def inventory_export_csv():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 225 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 226

```text
    q = request.args.get("q", "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 226 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 227

```text
    limit = request.args.get("limit", type=int, default=500000)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 227 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 228

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 228 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 229

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 229 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 230

```text
    csv_text = service.export_inventory_csv(q, limit)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 230 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 231

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 231 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `return`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 232

```text
    return Response(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 232 is classified as `return`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 233

```text
        csv_text,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 233 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `return` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 234

```text
        mimetype="text/csv",
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 234 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 235

```text
        headers={"Content-Disposition": "attachment; filename=cheminventory_export.csv"},
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 235 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 236

```text
    )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 236 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 237

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 237 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 238

```text
#Remove Route 12/18/2025
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 238 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 239

```text
#Updated 1/13/2026
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 239 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 240

```text
@chem_bp.route("/remove", methods=["GET", "POST"])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 240 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `comment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 241

```text
def remove_material():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 241 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 242

```text
    if request.method == "POST":
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 242 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 243

```text
        barcode = (request.form.get("barcode") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 243 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 244

```text
        reason = (request.form.get("reason") or "").strip() or None
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 244 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 245

```text
        notes = (request.form.get("notes") or "").strip() or None
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 245 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 246

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 246 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 247

```text
        user = None
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 247 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 248

```text
        if current_user.is_authenticated:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 248 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 249

```text
            user = current_user.username
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 249 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 250

```text
        else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 250 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 251

```text
            user = (request.form.get("performed_by") or "").strip() or None
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 251 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 252

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 252 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 253

```text
        if not barcode:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 253 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 254

```text
            flash("Barcode is required.", "warning")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 254 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 255

```text
            return redirect(url_for("chem.remove_material"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 255 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 256

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 256 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 257

```text
        try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 257 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 258

```text
            service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 258 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 259

```text
            service.remove_container(barcode, removed_by=user, reason=reason, notes=notes)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 259 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 260

```text
            flash(f"Removed container {barcode}.", "success")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 260 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 261

```text
            return redirect(url_for("chem.inventory", q=barcode))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 261 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 262

```text
        except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 262 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 263

```text
            flash(f"Error removing container: {str(e)}", "error")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 263 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 264

```text
            return redirect(url_for("chem.remove_material"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 264 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 265

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 265 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 266

```text
    return render_template("chem/remove.html")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 266 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 267

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 267 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 268

```text
#Move Route 12/18/2025
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 268 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 269

```text
#Updated 1/13/2025
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 269 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 270

```text
@chem_bp.route("/move", methods=["GET", "POST"])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 270 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `comment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 271

```text
def move_material():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 271 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 272

```text
    if request.method == "POST":
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 272 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 273

```text
        barcode = (request.form.get("barcode") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 273 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 274

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 274 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 275

```text
        room_no = (request.form.get("room_no") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 275 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 276

```text
        room_desc = (request.form.get("room_desc") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 276 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 277

```text
        area_class = (request.form.get("area_class") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 277 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 278

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 278 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 279

```text
        storage_location = (request.form.get("storage_location") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 279 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 280

```text
        storage_sublocation = (request.form.get("storage_sublocation") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 280 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 281

```text
        storage_device = (request.form.get("storage_device") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 281 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 282

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 282 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 283

```text
        user = None
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 283 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 284

```text
        if current_user.is_authenticated:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 284 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 285

```text
            user = current_user.username
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 285 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `branch` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 286

```text
        else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 286 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 287

```text
            user = (request.form.get("performed_by") or "").strip() or None
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 287 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 288

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 288 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 289

```text
        if not barcode:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 289 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 290

```text
            flash("Barcode is required.", "warning")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 290 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 291

```text
            return redirect(url_for("chem.move_material"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 291 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 292

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 292 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 293

```text
        try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 293 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 294

```text
            service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 294 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 295

```text
            service.move_container(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 295 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 296

```text
                barcode=barcode,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 296 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 297

```text
                room_no=room_no,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 297 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 298

```text
                room_desc=room_desc,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 298 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 299

```text
                area_class=area_class,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 299 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 300

```text
                storage_location=storage_location,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 300 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 301

```text
                storage_sublocation=storage_sublocation,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 301 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 302

```text
                storage_device=storage_device,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 302 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 303

```text
                moved_by=user,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 303 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 304

```text
            )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 304 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 305

```text
            flash(f"Moved {barcode}.", "success")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 305 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 306

```text
            return redirect(url_for("chem.inventory", q=barcode))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 306 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 307

```text
        except Exception as e:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 307 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 308

```text
            flash(f"Error moving container: {str(e)}", "error")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 308 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 309

```text
            return redirect(url_for("chem.move_material"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 309 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 310

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 310 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 311

```text
    return render_template("chem/move.html")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 311 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 312

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 312 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 313

```text
#Transactions Route 12/18/2025
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 313 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 314

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 314 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 315

```text
@chem_bp.route("/transactions")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 315 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 316

```text
def transactions():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 316 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 317

```text
    q = (request.args.get("q") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 317 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `function` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 318

```text
    limit = 1000
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 318 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 319

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 319 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 320

```text
    rows = service.get_transactions(q=q, limit=limit)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 320 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 321

```text
    return render_template("chem/transactions.html", rows=rows, q=q, limit=limit)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 321 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 322

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 322 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 323

```text
#Suggest endpoint for type ahead Lists 1/7/2025
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 323 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 324

```text
@chem_bp.route("/api/suggest")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 324 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `comment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 325

```text
def api_suggest():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 325 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 326

```text
    field = (request.args.get("field") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 326 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 327

```text
    q = (request.args.get("q") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 327 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 328

```text
    limit = request.args.get("limit", type=int, default=10)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 328 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 329

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 329 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 330

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 330 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 331

```text
    results = service.suggest(field, q, limit)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 331 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 332

```text
    return jsonify({"results": results})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 332 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 333

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 333 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 334

```text
#Auto Fill by catalog or barcode endpoint 1/7/2025
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 334 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 335

```text
@chem_bp.route("/api/autofill")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 335 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `comment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 336

```text
def api_autofill():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 336 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 337

```text
    catalog = (request.args.get("catalog") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 337 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 338

```text
    name = (request.args.get("name") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 338 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 339

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 339 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 340

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 340 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 341

```text
    data = service.autofill(catalog=catalog, name=name)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 341 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 342

```text
    return jsonify({"data": data})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 342 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 343

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 343 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 344

```text
#container lookup api route added 1/13/2026
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 344 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 345

```text
#@chem_bp.route("/api/container_lookup")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 345 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 346

```text
#def api_container_lookup():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 346 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 347

```text
#    barcode = (request.args.get("barcode") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 347 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 348

```text
#    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 348 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 349

```text
#    data = service.get_container_location(barcode)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 349 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 350

```text
#    return jsonify({"data": data or {}})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 350 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 351

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 351 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 352

```text
#print to np700
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 352 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 353

```text
@chem_bp.route("/barcodes/print-selected", methods=["POST"])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 353 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `comment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 354

```text
def barcode_print_selected():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 354 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 355

```text
    """Redirect to barcode print page with selected barcodes"""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 355 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `function` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 356

```text
    barcodes = request.form.getlist("barcode")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 356 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 357

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 357 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 358

```text
    if not barcodes:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 358 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 359

```text
        flash("No barcodes selected to print.", "warning")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 359 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 360

```text
        return redirect(url_for("chem.barcode_queue"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 360 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 361

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 361 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 362

```text
    # Pass as comma-separated list
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 362 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 363

```text
    return redirect(url_for("chem.barcode_print", barcodes=",".join(barcodes)))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 363 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 364

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 364 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 365

```text
#4/2/2026 Move Page pushed to live
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 365 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 366

```text
@chem_bp.route("/edit", methods=["GET"])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 366 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `comment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 367

```text
def edit():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 367 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 368

```text
    return render_template("chem/edit.html")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 368 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `function` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 369

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 369 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 370

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 370 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 371

```text
@chem_bp.route("/edit-container", methods=["POST"])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 371 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 372

```text
def edit_container():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 372 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 373

```text
    container_id = request.form.get("container_id")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 373 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `function` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 374

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 374 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 375

```text
    if not container_id:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 375 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 376

```text
        flash("Missing container_id", "danger")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 376 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 377

```text
        return redirect(url_for("chem.edit"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 377 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 378

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 378 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 379

```text
    try:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 379 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 380

```text
        container_id = int(container_id)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 380 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `exception` and next kind is `exception`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 381

```text
    except ValueError:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 381 is classified as `exception`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 382

```text
        flash("Invalid container_id", "danger")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 382 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `exception` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 383

```text
        return redirect(url_for("chem.edit"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 383 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 384

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 384 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 385

```text
    data = {
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 385 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 386

```text
        "item_name": request.form.get("item_name"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 386 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 387

```text
        "description": request.form.get("description"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 387 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 388

```text
        "catalog_number": request.form.get("catalog_number"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 388 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 389

```text
        "physical_state": request.form.get("physical_state"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 389 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 390

```text
        "size": request.form.get("size"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 390 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 391

```text
        "unit": request.form.get("unit"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 391 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 392

```text
        "system": request.form.get("system"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 392 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 393

```text
        "vendor_name": request.form.get("vendor_name"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 393 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 394

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 394 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 395

```text
        "room_no": request.form.get("room_no"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 395 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 396

```text
        "room_name": request.form.get("room_name"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 396 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 397

```text
        "room_desc": request.form.get("room_desc"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 397 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 398

```text
        "area_class": request.form.get("area_class"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 398 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 399

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 399 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 400

```text
        "storage_location": request.form.get("storage_location"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 400 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 401

```text
        "storage_sublocation": request.form.get("storage_sublocation"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 401 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 402

```text
        "storage_device": request.form.get("storage_device"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 402 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 403

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 403 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 404

```text
        "manuf_date": request.form.get("manuf_date"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 404 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 405

```text
        "expiry_date": request.form.get("expiry_date"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 405 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 406

```text
        "lot_number": request.form.get("lot_number"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 406 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 407

```text
        "choice": request.form.get("choice"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 407 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 408

```text
        "nmr": request.form.get("nmr"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 408 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 409

```text
        "nmr_expiry": request.form.get("nmr_expiry"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 409 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 410

```text
        "owner": request.form.get("owner"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 410 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 411

```text
        "notes": request.form.get("notes"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 411 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 412

```text
        "added_by": request.form.get("added_by"),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 412 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 413

```text
    }
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 413 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 414

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 414 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 415

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 415 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 416

```text
    service.update_container(container_id, data)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 416 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 417

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 417 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 418

```text
    flash("Updated successfully", "success")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 418 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 419

```text
    return redirect(url_for("chem.edit"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 419 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 420

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 420 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 421

```text
@chem_bp.route("/api/container_lookup")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 421 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `blank` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 422

```text
def container_lookup():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 422 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 423

```text
    barcode = (request.args.get("barcode") or "").strip()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 423 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `function` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 424

```text
    if not barcode:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 424 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 425

```text
        return jsonify({"data": None})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 425 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 426

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 426 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 427

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 427 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 428

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 428 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 429

```text
    with service.engine.begin() as conn:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 429 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `database`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 430

```text
        row = conn.execute(text("""
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 430 is classified as `database`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 431

```text
            SELECT
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 431 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `database` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 432

```text
                c.container_id,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 432 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 433

```text
                c.item_id,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 433 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 434

```text
                c.room_id,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 434 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 435

```text
                c.barcode,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 435 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 436

```text
                c.container_code,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 436 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 437

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 437 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 438

```text
                i.name AS item_name,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 438 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 439

```text
                i.description AS description,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 439 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 440

```text
                i.catalog_number AS catalog_number,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 440 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 441

```text
                i.physical_state AS physical_state,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 441 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 442

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 442 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 443

```text
                COALESCE(c.size, i.volume_size) AS size,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 443 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 444

```text
                c.unit AS unit,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 444 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 445

```text
                c.system AS system,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 445 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 446

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 446 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 447

```text
                v.vendor_name AS vendor_name,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 447 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 448

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 448 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 449

```text
                r.room_no AS room_no,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 449 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 450

```text
                r.room_name AS room_name,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 450 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 451

```text
                r.room_desc AS room_desc,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 451 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 452

```text
                COALESCE(c.area_class, r.area_class) AS area_class,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 452 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 453

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 453 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 454

```text
                c.storage_location AS storage_location,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 454 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 455

```text
                c.storage_sublocation AS storage_sublocation,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 455 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 456

```text
                c.storage_device AS storage_device,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 456 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 457

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 457 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 458

```text
                c.manuf_date AS manuf_date,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 458 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 459

```text
                c.expiry_date AS expiry_date,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 459 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 460

```text
                c.lot_number AS lot_number,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 460 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 461

```text
                c.choice AS choice,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 461 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 462

```text
                c.nmr AS nmr,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 462 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 463

```text
                c.nmr_expiry AS nmr_expiry,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 463 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 464

```text
                c.owner AS owner,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 464 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 465

```text
                c.notes AS notes,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 465 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 466

```text
                c.added_by AS added_by
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 466 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 467

```text
            FROM containers c
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 467 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 468

```text
            LEFT JOIN items i   ON c.item_id = i.item_id
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 468 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `generic` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 469

```text
            LEFT JOIN vendors v ON i.vendor_id = v.vendor_id
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 469 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 470

```text
            LEFT JOIN rooms r   ON c.room_id = r.room_id
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 470 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 471

```text
            WHERE c.barcode = :barcode
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 471 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 472

```text
            LIMIT 1
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 472 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 473

```text
        """), {"barcode": barcode}).mappings().first()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 473 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 474

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 474 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 475

```text
    print("LOOKUP ROW:", dict(row) if row else None)
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 475 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 476

```text
    return jsonify({"data": dict(row) if row else None})
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 476 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 477

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 477 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 478

```text
# Added 4/8/2026 Bulk Inventory update to "Move" inventory page
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 478 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `route`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 479

```text
@chem_bp.route("/move-bulk", methods=["POST"])
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 479 is classified as `route`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads. Neighbor context: previous kind is `comment` and next kind is `function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 480

```text
def move_bulk():
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 480 is classified as `function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation. Neighbor context: previous kind is `route` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 481

```text
    service = ChemInventoryService()
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 481 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `function` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 482

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 482 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `assignment` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 483

```text
    raw_barcodes = request.form.get("bulk_barcodes")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 483 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 484

```text
    room_no = request.form.get("room_no")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 484 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 485

```text
    room_desc = request.form.get("room_desc")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 485 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 486

```text
    area_class = request.form.get("area_class")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 486 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 487

```text
    storage_location = request.form.get("storage_location")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 487 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 488

```text
    storage_sublocation = request.form.get("storage_sublocation")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 488 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 489

```text
    storage_device = request.form.get("storage_device")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 489 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 490

```text
    performed_by = request.form.get("performed_by")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 490 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `web` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 491

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 491 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 492

```text
    print("BULK MOVE FORM:", dict(request.form))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 492 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 493

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 493 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 494

```text
    result = service.bulk_move_by_barcodes(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 494 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `blank` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 495

```text
        raw_barcodes=raw_barcodes,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 495 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 496

```text
        room_no=room_no,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 496 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 497

```text
        room_desc=room_desc,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 497 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 498

```text
        area_class=area_class,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 498 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 499

```text
        storage_location=storage_location,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 499 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 500

```text
        storage_sublocation=storage_sublocation,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 500 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 501

```text
        storage_device=storage_device,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 501 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `assignment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 502

```text
        performed_by=performed_by,
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 502 is classified as `assignment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production. Neighbor context: previous kind is `assignment` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 503

```text
    )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 503 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `assignment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 504

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 504 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 505

```text
    if result["requested_count"] == 0:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 505 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 506

```text
        flash("No barcodes were provided.", "warning")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 506 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 507

```text
        return redirect(url_for("chem.move_material"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 507 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 508

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 508 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `web` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 509

```text
    if result["moved_count"] > 0:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 509 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 510

```text
        flash(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 510 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 511

```text
            f'Bulk move complete: moved {result["moved_count"]} of {result["requested_count"]} scanned barcode(s).',
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 511 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 512

```text
            "success"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 512 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 513

```text
        )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 513 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 514

```text
    else:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 514 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 515

```text
        flash("No matching containers were moved.", "warning")
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 515 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 516

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 516 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `branch`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 517

```text
    if result["unmatched"]:
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 517 is classified as `branch`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production. Neighbor context: previous kind is `blank` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 518

```text
        flash(
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 518 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `branch` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 519

```text
            "Unmatched barcode(s): " + ", ".join(result["unmatched"][:20]) +
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 519 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 520

```text
            (" ..." if len(result["unmatched"]) > 20 else ""),
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 520 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 521

```text
            "warning"
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 521 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `generic`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 522

```text
        )
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 522 is classified as `generic`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production. Neighbor context: previous kind is `generic` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 523

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 523 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `generic` and next kind is `web`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 524

```text
    return redirect(url_for("chem.move_material"))
```

Reconstruction rule: in `UNanofabTools/app/blueprints/chem_inventory_remote.py`, line 524 is classified as `web`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on. Neighbor context: previous kind is `blank` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/blueprints/chem_inventory_remote.py`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
