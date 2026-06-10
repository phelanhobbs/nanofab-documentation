

# Source Reconstruction: UNanofabTools/app/blueprints/chem_inventory_remote.py

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

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

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 2

```text
Chemical Inventory Blueprint
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 3

```text
Routes for managing chemical inventory
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 4

```text
"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 5

```text
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, Response
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 6

```text
from flask_login import login_required, current_user
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 7

```text
from sqlalchemy import text
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 8

```text
from app.services.chem_service import ChemInventoryService
```

`import` — This dependency line names an external package, standard-library module, or local module. A rebuild must install or recreate that dependency before this file can run; edge cases are missing packages, version drift, import cycles, and local module name collisions.

### Line 10

```text
chem_bp = Blueprint('chem', __name__, url_prefix='/chem')
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 13

```text
@chem_bp.route('/')
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 14

```text
@chem_bp.route('/inventory')
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 15

```text
def inventory():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 16

```text
    q = request.args.get("q", "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 17

```text
    limit = request.args.get("limit", type=int, default=500)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 19

```text
    show_removed = request.args.get("show_removed", "0")  # "1" to include Removed
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 20

```text
    show_printed = request.args.get("show_printed", "0")  # "1" to show Printed column
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 22

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 23

```text
    rows = service.search_inventory(q, limit, show_removed=show_removed)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 25

```text
    return render_template(
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 26

```text
        "chem/inventory.html",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 27

```text
        rows=rows, q=q, limit=limit,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 28

```text
        show_removed=show_removed,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 29

```text
        show_printed=show_printed
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 30

```text
    )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 33

```text
@chem_bp.route('/inventory/print')
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 34

```text
def inventory_print():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 35

```text
    """Print-friendly inventory view"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 36

```text
    q = request.args.get("q", "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 37

```text
    limit = request.args.get("limit", type=int, default=5000)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 39

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 40

```text
    rows = service.search_inventory(q, limit)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 42

```text
    return render_template("chem/inventory_print.html", rows=rows, q=q, limit=limit)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 45

```text
@chem_bp.route('/add', methods=["GET", "POST"])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 46

```text
def add():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 47

```text
    """Add new chemical containers"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 48

```text
    if request.method == "POST":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 50

```text
        data = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 52

```text
            'name': (request.form.get("name") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 53

```text
            'vendor_name': (request.form.get("vendor") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 54

```text
            'catalog': (request.form.get("catalog") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 55

```text
            'state': (request.form.get("state") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 56

```text
            'size': (request.form.get("size") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 57

```text
            'unit': (request.form.get("unit") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 58

```text
            'system': (request.form.get("system") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 59

```text
            'lot_number': (request.form.get("lot_number") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 62

```text
            'qty': max(1, min(int(request.form.get("qty") or "1"), 500)),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 65

```text
            'area_class': (request.form.get("area_class") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 66

```text
            'room_no': (request.form.get("room_no") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 67

```text
            'room_name': (request.form.get("room_name") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 68

```text
            'room_desc': (request.form.get("room_desc") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 69

```text
            'storage_location': (request.form.get("storage_location") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 70

```text
            'storage_subloc': (request.form.get("storage_sublocation") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 71

```text
            'storage_device': (request.form.get("storage_device") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 74

```text
            'entry': request.form.get("entry") or None,
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 75

```text
            'manuf_date': request.form.get("manuf_date") or None,
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 76

```text
            'expire': request.form.get("expire") or None,
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 77

```text
            'choice': (request.form.get("choice") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 78

```text
            'nmr': (request.form.get("nmr") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 79

```text
            'nmr_exp': request.form.get("nmr_exp") or None,
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 82

```text
            'owner': (request.form.get("owner") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 83

```text
            'added_by': (request.form.get("added_by") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 84

```text
            'notes': (request.form.get("notes") or "").strip(),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 85

```text
        }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 87

```text
        if not data['name']:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 88

```text
            flash("Material Name is required.", "warning")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 89

```text
            return redirect(url_for("chem.add"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 91

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 92

```text
            service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 93

```text
            new_barcodes = service.add_containers(data)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 94

```text
            flash(f"Added {len(new_barcodes)} container(s). Unique barcodes assigned.", "success")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 96

```text
            return redirect(url_for("chem.barcode_queue", preselect=",".join(new_barcodes)))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 97

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 98

```text
            flash(f"Error adding containers: {str(e)}", "error")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 99

```text
            return redirect(url_for("chem.add"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 101

```text
    return render_template("chem/add.html")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 104

```text
@chem_bp.route('/report')
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 105

```text
def report():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 106

```text
    """Display inventory reports and statistics"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 107

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 109

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 110

```text
        report_data = service.get_reports()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 111

```text
        return render_template("chem/report.html", **report_data)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 112

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 113

```text
        flash(f"Error generating report: {str(e)}", "error")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 114

```text
        return redirect(url_for("chem.inventory"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 117

```text
@chem_bp.route('/upload-scans', methods=["GET", "POST"])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 118

```text
def upload_scans():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 119

```text
    """Upload barcode scan files"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 120

```text
    if request.method == "POST":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 121

```text
        f = request.files.get("file")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 122

```text
        user = current_user.username if current_user.is_authenticated else None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 124

```text
        if not f or not f.filename:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 125

```text
            flash("Please choose a TXT file.", "warning")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 126

```text
            return redirect(url_for("chem.upload_scans"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 129

```text
        codes = []
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 130

```text
        for raw in f.stream.readlines():
```

`loop` — This loop repeats work over files, rows, devices, users, months, or sensor samples. Preserve ordering, termination, empty-input handling, duplicate handling, and partial-failure behavior; edge cases are zero items, one item, many items, and one bad item among many good ones.

### Line 131

```text
            try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 132

```text
                line = raw.decode("utf-8", "ignore").strip()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 133

```text
            except Exception:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 134

```text
                line = str(raw).strip()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 135

```text
            if line:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 136

```text
                codes.append(line)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 138

```text
        if not codes:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 139

```text
            flash("The file appears empty.", "warning")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 140

```text
            return redirect(url_for("chem.upload_scans"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 142

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 143

```text
            service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 144

```text
            cycle_id = service.import_scans(codes, f.filename, user)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 145

```text
            flash(f"Scan file imported successfully. Cycle ID: {cycle_id}", "success")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 146

```text
            return redirect(url_for("chem.report"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 147

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 148

```text
            flash(f"Error importing scans: {str(e)}", "error")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 149

```text
            return redirect(url_for("chem.upload_scans"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 151

```text
    return render_template("chem/upload_scans.html")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 154

```text
@chem_bp.route('/barcodes/queue')
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 155

```text
def barcode_queue():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 156

```text
    """Show unprinted barcodes queue"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 157

```text
    q = request.args.get('q', '').strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 158

```text
    only_unprinted = request.args.get('only_unprinted', '1')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 159

```text
    limit = request.args.get('limit', type=int) or 500
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 160

```text
    preselect = request.args.get('preselect', '').strip()
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 162

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 163

```text
    rows = service.get_barcode_queue(q, only_unprinted, limit)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 165

```text
    preselected = set([p.strip() for p in preselect.split(',') if p.strip()])
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 167

```text
    return render_template(
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 168

```text
        "chem/barcode_queue.html",
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 169

```text
        rows=rows,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 170

```text
        q=q,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 171

```text
        limit=limit,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 172

```text
        only_unprinted=only_unprinted,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 173

```text
        preselected=preselected
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 174

```text
    )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 177

```text
@chem_bp.route('/barcodes/print')
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 178

```text
def barcode_print():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 179

```text
    """Print barcode labels"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 180

```text
    q = request.args.get('q', '').strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 181

```text
    copies = max(1, int(request.args.get('copies', 1)))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 182

```text
    limit = 1000
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 184

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 185

```text
    labels = service.get_barcode_labels(q, copies, limit)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 188

```text
    pages = [labels[i:i+30] for i in range(0, len(labels), 30)] if labels else [[]]
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 190

```text
    return render_template("chem/barcode_print.html", pages=pages, q=q, copies=copies)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 193

```text
@chem_bp.route('/barcodes/mark-printed', methods=['POST'])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 194

```text
def barcode_mark_printed():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 195

```text
    """Mark selected barcodes as printed"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 196

```text
    barcodes = request.form.getlist('barcode')
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 198

```text
    if not barcodes:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 199

```text
        flash("No barcodes selected.", "warning")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 200

```text
        return redirect(url_for('chem.barcode_queue'))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 202

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 203

```text
        service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 204

```text
        count = service.mark_barcodes_printed(barcodes)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 205

```text
        flash(f"Marked {count} barcode(s) as printed.", "success")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 206

```text
    except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 207

```text
        flash(f"Error marking barcodes: {str(e)}", "error")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 209

```text
    return redirect(url_for('chem.barcode_queue'))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 212

```text
@chem_bp.route('/api/inventory_json')
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 213

```text
def api_inventory():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 214

```text
    """API endpoint for inventory data"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 215

```text
    q = request.args.get('q', '').strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 216

```text
    limit = request.args.get('limit', type=int) or 500
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 218

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 219

```text
    rows = service.search_inventory(q, limit)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 221

```text
    return jsonify({'rows': [dict(r) for r in rows]})
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 224

```text
@chem_bp.route("/inventory/export.csv")
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 225

```text
def inventory_export_csv():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 226

```text
    q = request.args.get("q", "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 227

```text
    limit = request.args.get("limit", type=int, default=500000)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 229

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 230

```text
    csv_text = service.export_inventory_csv(q, limit)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 232

```text
    return Response(
```

`return` — This return line defines what the caller receives. Preserve shape, type, status meaning, error sentinel behavior, and whether callers expect truthiness; edge cases include returning None, returning partial data, and returning a success-looking value after a failed side effect.

### Line 233

```text
        csv_text,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 234

```text
        mimetype="text/csv",
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 235

```text
        headers={"Content-Disposition": "attachment; filename=cheminventory_export.csv"},
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 236

```text
    )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 240

```text
@chem_bp.route("/remove", methods=["GET", "POST"])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 241

```text
def remove_material():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 242

```text
    if request.method == "POST":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 243

```text
        barcode = (request.form.get("barcode") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 244

```text
        reason = (request.form.get("reason") or "").strip() or None
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 245

```text
        notes = (request.form.get("notes") or "").strip() or None
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 247

```text
        user = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 248

```text
        if current_user.is_authenticated:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 249

```text
            user = current_user.username
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 250

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 251

```text
            user = (request.form.get("performed_by") or "").strip() or None
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 253

```text
        if not barcode:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 254

```text
            flash("Barcode is required.", "warning")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 255

```text
            return redirect(url_for("chem.remove_material"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 257

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 258

```text
            service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 259

```text
            service.remove_container(barcode, removed_by=user, reason=reason, notes=notes)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 260

```text
            flash(f"Removed container {barcode}.", "success")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 261

```text
            return redirect(url_for("chem.inventory", q=barcode))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 262

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 263

```text
            flash(f"Error removing container: {str(e)}", "error")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 264

```text
            return redirect(url_for("chem.remove_material"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 266

```text
    return render_template("chem/remove.html")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 270

```text
@chem_bp.route("/move", methods=["GET", "POST"])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 271

```text
def move_material():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 272

```text
    if request.method == "POST":
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 273

```text
        barcode = (request.form.get("barcode") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 275

```text
        room_no = (request.form.get("room_no") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 276

```text
        room_desc = (request.form.get("room_desc") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 277

```text
        area_class = (request.form.get("area_class") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 279

```text
        storage_location = (request.form.get("storage_location") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 280

```text
        storage_sublocation = (request.form.get("storage_sublocation") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 281

```text
        storage_device = (request.form.get("storage_device") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 283

```text
        user = None
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 284

```text
        if current_user.is_authenticated:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 285

```text
            user = current_user.username
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 286

```text
        else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 287

```text
            user = (request.form.get("performed_by") or "").strip() or None
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 289

```text
        if not barcode:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 290

```text
            flash("Barcode is required.", "warning")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 291

```text
            return redirect(url_for("chem.move_material"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 293

```text
        try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 294

```text
            service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 295

```text
            service.move_container(
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 296

```text
                barcode=barcode,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 297

```text
                room_no=room_no,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 298

```text
                room_desc=room_desc,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 299

```text
                area_class=area_class,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 300

```text
                storage_location=storage_location,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 301

```text
                storage_sublocation=storage_sublocation,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 302

```text
                storage_device=storage_device,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 303

```text
                moved_by=user,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 304

```text
            )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 305

```text
            flash(f"Moved {barcode}.", "success")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 306

```text
            return redirect(url_for("chem.inventory", q=barcode))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 307

```text
        except Exception as e:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 308

```text
            flash(f"Error moving container: {str(e)}", "error")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 309

```text
            return redirect(url_for("chem.move_material"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 311

```text
    return render_template("chem/move.html")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 315

```text
@chem_bp.route("/transactions")
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 316

```text
def transactions():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 317

```text
    q = (request.args.get("q") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 318

```text
    limit = 1000
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 319

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 320

```text
    rows = service.get_transactions(q=q, limit=limit)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 321

```text
    return render_template("chem/transactions.html", rows=rows, q=q, limit=limit)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 324

```text
@chem_bp.route("/api/suggest")
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 325

```text
def api_suggest():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 326

```text
    field = (request.args.get("field") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 327

```text
    q = (request.args.get("q") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 328

```text
    limit = request.args.get("limit", type=int, default=10)
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 330

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 331

```text
    results = service.suggest(field, q, limit)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 332

```text
    return jsonify({"results": results})
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 335

```text
@chem_bp.route("/api/autofill")
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 336

```text
def api_autofill():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 337

```text
    catalog = (request.args.get("catalog") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 338

```text
    name = (request.args.get("name") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 340

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 341

```text
    data = service.autofill(catalog=catalog, name=name)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 342

```text
    return jsonify({"data": data})
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 353

```text
@chem_bp.route("/barcodes/print-selected", methods=["POST"])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 354

```text
def barcode_print_selected():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 355

```text
    """Redirect to barcode print page with selected barcodes"""
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 356

```text
    barcodes = request.form.getlist("barcode")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 358

```text
    if not barcodes:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 359

```text
        flash("No barcodes selected to print.", "warning")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 360

```text
        return redirect(url_for("chem.barcode_queue"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 363

```text
    return redirect(url_for("chem.barcode_print", barcodes=",".join(barcodes)))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 366

```text
@chem_bp.route("/edit", methods=["GET"])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 367

```text
def edit():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 368

```text
    return render_template("chem/edit.html")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 371

```text
@chem_bp.route("/edit-container", methods=["POST"])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 372

```text
def edit_container():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 373

```text
    container_id = request.form.get("container_id")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 375

```text
    if not container_id:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 376

```text
        flash("Missing container_id", "danger")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 377

```text
        return redirect(url_for("chem.edit"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 379

```text
    try:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 380

```text
        container_id = int(container_id)
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 381

```text
    except ValueError:
```

`exception` — This exception boundary defines recovery. Recreate what is caught, what is logged, what is re-raised, and what user or device response is produced; edge cases include swallowing important failures, leaking secrets in errors, and continuing after corrupt state.

### Line 382

```text
        flash("Invalid container_id", "danger")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 383

```text
        return redirect(url_for("chem.edit"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 385

```text
    data = {
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 386

```text
        "item_name": request.form.get("item_name"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 387

```text
        "description": request.form.get("description"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 388

```text
        "catalog_number": request.form.get("catalog_number"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 389

```text
        "physical_state": request.form.get("physical_state"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 390

```text
        "size": request.form.get("size"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 391

```text
        "unit": request.form.get("unit"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 392

```text
        "system": request.form.get("system"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 393

```text
        "vendor_name": request.form.get("vendor_name"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 395

```text
        "room_no": request.form.get("room_no"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 396

```text
        "room_name": request.form.get("room_name"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 397

```text
        "room_desc": request.form.get("room_desc"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 398

```text
        "area_class": request.form.get("area_class"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 400

```text
        "storage_location": request.form.get("storage_location"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 401

```text
        "storage_sublocation": request.form.get("storage_sublocation"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 402

```text
        "storage_device": request.form.get("storage_device"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 404

```text
        "manuf_date": request.form.get("manuf_date"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 405

```text
        "expiry_date": request.form.get("expiry_date"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 406

```text
        "lot_number": request.form.get("lot_number"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 407

```text
        "choice": request.form.get("choice"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 408

```text
        "nmr": request.form.get("nmr"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 409

```text
        "nmr_expiry": request.form.get("nmr_expiry"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 410

```text
        "owner": request.form.get("owner"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 411

```text
        "notes": request.form.get("notes"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 412

```text
        "added_by": request.form.get("added_by"),
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 413

```text
    }
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 415

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 416

```text
    service.update_container(container_id, data)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 418

```text
    flash("Updated successfully", "success")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 419

```text
    return redirect(url_for("chem.edit"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 421

```text
@chem_bp.route("/api/container_lookup")
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 422

```text
def container_lookup():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 423

```text
    barcode = (request.args.get("barcode") or "").strip()
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 424

```text
    if not barcode:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 425

```text
        return jsonify({"data": None})
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 427

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 429

```text
    with service.engine.begin() as conn:
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 430

```text
        row = conn.execute(text("""
```

`database` — This database line affects durable state. Preserve table names, column names, constraints, query parameters, transaction boundaries, commit timing, rollback behavior, and migration assumptions; edge cases are missing rows, duplicate rows, concurrent writes, schema drift, and failed commits.

### Line 431

```text
            SELECT
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 432

```text
                c.container_id,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 433

```text
                c.item_id,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 434

```text
                c.room_id,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 435

```text
                c.barcode,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 436

```text
                c.container_code,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 438

```text
                i.name AS item_name,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 439

```text
                i.description AS description,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 440

```text
                i.catalog_number AS catalog_number,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 441

```text
                i.physical_state AS physical_state,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 443

```text
                COALESCE(c.size, i.volume_size) AS size,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 444

```text
                c.unit AS unit,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 445

```text
                c.system AS system,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 447

```text
                v.vendor_name AS vendor_name,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 449

```text
                r.room_no AS room_no,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 450

```text
                r.room_name AS room_name,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 451

```text
                r.room_desc AS room_desc,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 452

```text
                COALESCE(c.area_class, r.area_class) AS area_class,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 454

```text
                c.storage_location AS storage_location,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 455

```text
                c.storage_sublocation AS storage_sublocation,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 456

```text
                c.storage_device AS storage_device,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 458

```text
                c.manuf_date AS manuf_date,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 459

```text
                c.expiry_date AS expiry_date,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 460

```text
                c.lot_number AS lot_number,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 461

```text
                c.choice AS choice,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 462

```text
                c.nmr AS nmr,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 463

```text
                c.nmr_expiry AS nmr_expiry,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 464

```text
                c.owner AS owner,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 465

```text
                c.notes AS notes,
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 466

```text
                c.added_by AS added_by
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 467

```text
            FROM containers c
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 468

```text
            LEFT JOIN items i   ON c.item_id = i.item_id
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 469

```text
            LEFT JOIN vendors v ON i.vendor_id = v.vendor_id
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 470

```text
            LEFT JOIN rooms r   ON c.room_id = r.room_id
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 471

```text
            WHERE c.barcode = :barcode
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 472

```text
            LIMIT 1
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 473

```text
        """), {"barcode": barcode}).mappings().first()
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 475

```text
    print("LOOKUP ROW:", dict(row) if row else None)
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 476

```text
    return jsonify({"data": dict(row) if row else None})
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 479

```text
@chem_bp.route("/move-bulk", methods=["POST"])
```

`route` — This route decorator is an HTTP contract. Preserve the URL rule, allowed methods, authentication posture, request payload shape, response type, redirects, template names, and side effects; edge cases include wrong method, missing form fields, unauthenticated callers, stale sessions, and malformed device payloads.

### Line 480

```text
def move_bulk():
```

`function` — This function boundary is an interface. Preserve its name-level responsibility, parameters, return value, exceptions, side effects, and logging behavior; edge cases include None inputs, empty collections, filesystem absence, failed network calls, and repeated invocation.

### Line 481

```text
    service = ChemInventoryService()
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 483

```text
    raw_barcodes = request.form.get("bulk_barcodes")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 484

```text
    room_no = request.form.get("room_no")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 485

```text
    room_desc = request.form.get("room_desc")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 486

```text
    area_class = request.form.get("area_class")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 487

```text
    storage_location = request.form.get("storage_location")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 488

```text
    storage_sublocation = request.form.get("storage_sublocation")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 489

```text
    storage_device = request.form.get("storage_device")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 490

```text
    performed_by = request.form.get("performed_by")
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 492

```text
    print("BULK MOVE FORM:", dict(request.form))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 494

```text
    result = service.bulk_move_by_barcodes(
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 495

```text
        raw_barcodes=raw_barcodes,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 496

```text
        room_no=room_no,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 497

```text
        room_desc=room_desc,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 498

```text
        area_class=area_class,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 499

```text
        storage_location=storage_location,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 500

```text
        storage_sublocation=storage_sublocation,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 501

```text
        storage_device=storage_device,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 502

```text
        performed_by=performed_by,
```

`assignment` — This assignment establishes configuration, state, a constant, or an intermediate value. Preserve when it is evaluated, whether it is mutable, whether it can be overridden, and whether it is safe to expose; edge cases include defaults that are fine locally but unsafe in production.

### Line 503

```text
    )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 505

```text
    if result["requested_count"] == 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 506

```text
        flash("No barcodes were provided.", "warning")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 507

```text
        return redirect(url_for("chem.move_material"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.

### Line 509

```text
    if result["moved_count"] > 0:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 510

```text
        flash(
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 511

```text
            f'Bulk move complete: moved {result["moved_count"]} of {result["requested_count"]} scanned barcode(s).',
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 512

```text
            "success"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 513

```text
        )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 514

```text
    else:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 515

```text
        flash("No matching containers were moved.", "warning")
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 517

```text
    if result["unmatched"]:
```

`branch` — This branch decides between pathways. Recreate the condition and both the taken and not-taken behavior; edge cases include falsy values, missing keys, unexpected types, stale state, and a condition that was assumed impossible but occurs in production.

### Line 518

```text
        flash(
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 519

```text
            "Unmatched barcode(s): " + ", ".join(result["unmatched"][:20]) +
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 520

```text
            (" ..." if len(result["unmatched"]) > 20 else ""),
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 521

```text
            "warning"
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 522

```text
        )
```

`generic` — This line contributes to the file's behavior or documentation. Recreate it by preserving inputs, outputs, ordering, and side effects; edge cases are missing context, unexpected data, and differences between development and production.

### Line 524

```text
    return redirect(url_for("chem.move_material"))
```

`web` — This web-framework line touches request, response, session, redirect, or template behavior. Preserve browser-visible semantics and server-side authorization checks; edge cases are expired sessions, missing request fields, forged values, template context omissions, and response codes that clients depend on.



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
