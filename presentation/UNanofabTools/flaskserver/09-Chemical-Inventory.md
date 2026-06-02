# 09 — Chemical Inventory

The chemical inventory is the largest single feature on the server. It tracks every chemical container ("bottle") in the lab — what's inside, who owns it, where it lives, when it expires, when it was last seen during a scan, and a paper-trail of every move/edit/scan/removal.

Two files:

- `app/blueprints/chem_inventory.py` — the URL routes (`/chem/...`).
- `app/services/chem_service.py` — the database logic (the biggest service in the codebase, ~1600 lines).

And a database schema file `chem_schema.sql` that describes the PostgreSQL tables.

This document covers:

1. The domain model (categories, vendors, rooms, items, containers, scans, cycles, transactions).
2. The URL routes and what users do on each page.
3. Highlights from the service layer.
4. How barcode generation and scan imports work.

A separate look at the raw schema is in this same document at the end — there's no separate `10-Schema.md`; the schema is small enough to live here.

## The mental model

Take a moment to absorb the entity diagram before reading code:

```
   ┌──────────────┐ 1     N ┌────────────┐
   │  categories  │─────────│   items    │            "Chemicals" → many bottles types
   └──────────────┘         │ (chemicals)│            Item = "Acetone, ACS grade"
                            └──────┬─────┘            unique by name
                                   │ 1
                            ┌──────┴─────┐
                            │            │ N
                            ▼            ▼
                       ┌──────────┐ ┌────────────────┐
                       │ vendors  │ │  containers    │  ← individual bottles!
                       │ (1 each) │ │  (the bottle)  │     each has its own barcode
                       └──────────┘ └────┬───────────┘
                                         │ N
                                         │
                                         ▼
                                  ┌──────────────────┐
                                  │ container_scans  │   ← "this bottle was seen on this date"
                                  └────────┬─────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │ inventory_cycles │   ← a scan-day / scan-event
                                  └──────────────────┘

   ┌──────────────┐ N      1 ┌────────────────┐
   │   rooms      │──────────│  containers    │       a bottle lives in one room
   └──────────────┘          └────────────────┘
```

In English: a **container** (one physical bottle) belongs to an **item** (the chemical it holds, like "Sulfuric Acid 98%"), comes from a **vendor**, and sits in a **room**. Every time someone walks around with a scanner, those scans are grouped into an **inventory cycle**, and each successful match becomes a **container_scan** row tied back to a specific container.

Everything else — barcode printing, expiration reports, transactions log — hangs off this skeleton.

## The PostgreSQL schema in plain English

The schema lives in `chem_schema.sql`. (There's a v2 migration too, `chem_schema_migration_v2.sql`, that adds fields like `label_printed`.)

### Tables

| Table | What it stores | Notes |
|-------|----------------|-------|
| `categories` | High-level chemical group: "Chemicals", "Acids", "Solvents" | A small lookup table |
| `vendors` | Sigma, VWR, Avantor, etc. | Unique by `vendor_name` |
| `rooms` | Each storage room: number, name, description, area-classification | Multiple containers per room |
| `items` | One row per chemical product (not per bottle) | Unique by `name`; references `categories` and optionally `vendors` |
| `containers` | One row per physical bottle | The big table; references `items` and `rooms`; has barcode, dates, location, lot, owner, etc. |
| `inventory_cycles` | One row per scan session ("audit") | Has a start time, end time, and the user who created it |
| `scan_raw` | Every raw barcode scanned during a cycle | Lets you trace "this label was seen" even if no container matched |
| `container_scans` | Resolved scans (raw + matched container) with `'FOUND'` or `'NEW'` status | Unique on (cycle, container) so a bottle can't double-count in one cycle |
| `transactions` (added later) | Every ADD/MOVE/EDIT/REMOVE/SCAN_UPLOAD action | The paper trail. Columns: action, container_id, barcode, item_id, room_id, details (JSON), performed_by, created_at |

### The "sequence" for barcodes

```sql
CREATE SEQUENCE IF NOT EXISTS seq_barcode
  START WITH 100001 INCREMENT BY 1 NO MINVALUE NO MAXVALUE;
```

A Postgres sequence — a thread-safe ever-incrementing counter. Each new container's barcode is just the next sequence value. Starting at 100001 keeps every barcode 6 digits.

### Views

Two important views are defined:

- **`inventory_view`** — denormalized join of containers + items + vendors + rooms + categories. Most "list / search inventory" queries point at this so templates don't have to re-write the join every time.
- **`v_cycle_report`** — per-cycle counts of FOUND, NEW, and MISSING containers.

### A caveat: the committed schema is behind the live database

Worth knowing if you ever rebuild this database from scratch: the live code in `chem_service.py` reads and writes several columns and one whole table that are **not** present in either committed `.sql` file (`chem_schema.sql` or `chem_schema_migration_v2.sql`). Examples the code relies on but the committed schema doesn't define:

- `containers.last_scan_at` (set during scan imports, read by inventory search)
- `containers.removed_at`, `removed_by`, `remove_reason`, `remove_notes` (used by the soft-delete remove flow)
- The extended `inventory_cycles` columns: `filename`, `performed_by`, `report_name`, `location`, `total_scanned`, `matched_count`, `unmatched_count`
- A `barcode` column on `scan_raw` and on `container_scans`
- The entire `transactions` audit table

In other words, the production Postgres database has had columns added over time (via ad-hoc `ALTER TABLE` statements that were never committed back to the `.sql` files). The committed schema captures the original v1 + v2 shape; the live database is a few steps ahead. If someone tried to stand up a fresh database using only the committed `.sql` files, several features would fail until those missing columns/tables were added. This is a maintenance gap worth closing by writing the missing migrations.

### Foreign-key behavior

A few interesting `ON DELETE` clauses:

- Deleting an **item** cascades to its **containers** (`ON DELETE CASCADE`).
- Deleting a **vendor** just nullifies the link on `items.vendor_id` (`ON DELETE SET NULL`) — the item survives.
- Deleting a **room** just nullifies the link on `containers.room_id` — the bottle survives (it just has no current room).
- `ON DELETE RESTRICT` on the items.category_id link prevents deleting a category that still has items.

These choices reflect what's destructive in the real world: deleting a chemical product really does mean the bottles are gone; deleting a room or vendor record shouldn't lose the bottles.

## The routes — `chem_inventory.py`

The blueprint is registered with `url_prefix='/chem'`, so every route below is under `/chem`.

```python
chem_bp = Blueprint('chem', __name__, url_prefix='/chem')
```

I'll group the routes by purpose.

### View / search inventory

```python
@chem_bp.route('/')
@chem_bp.route("/inventory")
def inventory():
    service = ChemInventoryService()
    q = request.args.get("q", "").strip()
    limit = int(request.args.get("limit", 500))
    show_removed = request.args.get("show_removed", "0") == "1"

    rows = service.search_inventory(q, limit, show_removed=show_removed)

    return render_template(
        "chem/inventory.html",
        rows=rows,
        q=q,
        limit=limit,
        show_removed=show_removed,
    )
```

The main inventory page. Three URL params:

- **`q`** — search query (matches against many fields; see `search_inventory` below).
- **`limit`** — how many rows to show (default 500).
- **`show_removed`** — if `1`, include removed containers in the list. By default, removed containers are hidden.

Note this route is **not** decorated with `@login_required`. That's likely intentional for read-only inventory views (so visitors at a kiosk can search without a login), but worth flagging as a deliberate exception in the security model.

### Print-friendly view

```python
@chem_bp.route('/inventory/print')
def inventory_print():
    """Print-friendly inventory view"""
    q = request.args.get("q", "").strip()
    limit = request.args.get("limit", type=int, default=5000)

    service = ChemInventoryService()
    rows = service.search_inventory(q, limit)

    return render_template("chem/inventory_print.html", rows=rows, q=q, limit=limit)
```

A version of the same data styled for a printer (no buttons, larger limit).

### CSV export

```python
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
```

Builds the entire (possibly filtered) inventory as a CSV string and returns it with `Content-Disposition: attachment` so the browser saves it as `cheminventory_export.csv`.

### Add containers

```python
@chem_bp.route('/add', methods=["GET", "POST"])
def add():
    """Add new chemical containers"""
    if request.method == "POST":
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
            ...
        }

        if not data['name']:
            flash("Material Name is required.", "warning")
            return redirect(url_for("chem.add"))

        try:
            service = ChemInventoryService()
            new_barcodes = service.add_containers(data)
            flash(f"Added {len(new_barcodes)} container(s). Unique barcodes assigned.", "success")
            return redirect(url_for("chem.barcode_queue", preselect=",".join(new_barcodes)))
        except Exception as e:
            flash(f"Error adding containers: {str(e)}", "error")
            return redirect(url_for("chem.add"))

    return render_template("chem/add.html")
```

What's happening:

- The form is large — material info, location info, dates, ownership, plus a `qty` that lets you add **N** containers in one submission (capped to 500 via the `max(1, min(qty, 500))` clamp).
- After insert, the user is redirected to the **barcode queue** page with the new barcodes preselected, so they can print labels immediately.
- The hard requirement is just `name`. Everything else is optional.

`service.add_containers` (covered below) handles inserting all the linked rows (vendor, room, item, container) atomically.

### Bulk move / individual move

```python
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
        ...
```

`/chem/move` handles one bottle at a time. There's also `/chem/move-bulk` that accepts a textbox full of barcodes and moves them all to the same destination.

Notice the user-attribution fallback: if the user is logged in, attribute the move to them; otherwise accept a `performed_by` text field. This makes the page usable without login but still records who did it.

### Remove containers

```python
@chem_bp.route("/remove", methods=["GET", "POST"])
def remove():
    service = ChemInventoryService()

    if request.method == "POST":
        raw_barcodes = (request.form.get("barcode") or "").strip()
        performed_by = (request.form.get("performed_by") or "").strip()
        reason = (request.form.get("reason") or "").strip()
        notes = (request.form.get("notes") or "").strip()

        if not raw_barcodes:
            flash("Please scan or enter at least one barcode.", "warning")
            return redirect(url_for("chem.remove"))

        result = service.remove_containers_by_barcodes(
            raw_barcodes=raw_barcodes,
            removed_by=performed_by or None,
            reason=reason or None,
            notes=notes or None,
        )
        ...
```

"Remove" doesn't physically delete the row — it marks the container as `status='REMOVED'`. By default, removed containers are filtered out of inventory views. This is **soft delete**, a common pattern when you want auditability — the data is still there for reports and historical exports.

The endpoint accepts one or many barcodes in one textarea (the service splits them by newline/comma).

### Edit a container

```python
@chem_bp.route("/edit", methods=["GET"])
def edit():
    return render_template("chem/edit.html")


@chem_bp.route("/edit-container", methods=["POST"])
def edit_container():
    container_id = request.form.get("container_id")
    ...
    data = {
        "item_name": request.form.get("item_name"),
        "description": request.form.get("description"),
        ...
    }

    service = ChemInventoryService()
    service.update_container(container_id, data)

    flash("Updated successfully", "success")
    return redirect(url_for("chem.edit"))
```

A two-step UX: the user looks up a barcode on `/chem/edit`, the page fetches its data via `/chem/api/container_lookup`, the user edits the fields and POSTs back to `/chem/edit-container`.

### Barcode queue / printing

```python
@chem_bp.route('/barcodes/queue')
def barcode_queue():
    ...
    rows = service.get_barcode_queue(q, only_unprinted, limit)
    ...
    return render_template("chem/barcode_queue.html", ...)


@chem_bp.route('/barcodes/print')
def barcode_print():
    """Print barcode labels"""
    ...
    copies = max(1, int(request.args.get('copies', 1)))
    ...
    labels = service.get_barcode_labels(q, copies, limit)
    pages = [labels[i:i+30] for i in range(0, len(labels), 30)] if labels else [[]]
    return render_template("chem/barcode_print.html", pages=pages, q=q, copies=copies)


@chem_bp.route('/barcodes/mark-printed', methods=['POST'])
def barcode_mark_printed():
    """Mark selected barcodes as printed"""
    barcodes = request.form.getlist('barcode')
    ...
    count = service.mark_barcodes_printed(barcodes)
    flash(f"Marked {count} barcode(s) as printed.", "success")
    return redirect(url_for('chem.barcode_queue'))
```

Three pieces:

- **`/barcodes/queue`** — list barcodes pending printing.
- **`/barcodes/print`** — render a printable HTML page laid out as 5×6 grids of labels (30 per page).
- **`/barcodes/mark-printed`** — toggle `label_printed=TRUE` on the selected containers.

The `print-selected` route is a small redirector that takes selected barcodes from the queue and feeds them into the print page.

### Scan upload

```python
@chem_bp.route("/upload-scans", methods=["GET", "POST"])
def upload_scans():
    if request.method == "POST":
        user = (request.form.get("user") or "").strip()
        report_name = (request.form.get("report_name") or "").strip()
        location = (request.form.get("location") or "").strip()
        barcode_text = (request.form.get("barcode_text") or "").strip()

        uploaded_file = request.files.get("file")

        lines = []

        # 1) Barcode textbox input
        if barcode_text:
            lines.extend(
                [line.strip() for line in barcode_text.splitlines() if line.strip()]
            )

        # 2) Optional txt file input
        filename = None
        if uploaded_file and uploaded_file.filename:
            filename = uploaded_file.filename
            file_text = uploaded_file.read().decode("utf-8", errors="ignore")
            lines.extend(
                [line.strip() for line in file_text.splitlines() if line.strip()]
            )

        # Remove duplicates while preserving order
        seen = set()
        barcodes = []
        for line in lines:
            if line not in seen:
                seen.add(line)
                barcodes.append(line)
        ...
        result = service.import_scans(
            barcodes=barcodes,
            filename=filename,
            performed_by=user or None,
            report_name=report_name,
            location=location or None,
        )
        ...
```

This is the page where a user uploads the barcodes they've just scanned in a room. Two input modes are accepted simultaneously:

- A textbox they can paste into.
- An optional `.txt` file from their handheld scanner.

The combined lines are de-duplicated *while preserving order* (the `seen` set trick). Empty lines are skipped.

The combined list goes to `service.import_scans`, which inserts an `inventory_cycle` row, then one `scan_raw` row per barcode, and (for matched barcodes) a `container_scans` row + an update of the container's `last_scan_at`.

### Reports

```python
@chem_bp.route("/report")
def report():
    service = ChemInventoryService()

    totals = service.report_totals()
    expiring = service.report_expiring()
    expired = service.report_expired()
    nmr_due = service.report_nmr_due()
    by_room = service.report_by_room()
    by_vendor = service.report_by_vendor()
    by_system = service.report_by_system()
    by_owner = service.report_by_owner()

    scan_reports = service.get_scan_reports()
    coverage_rows = service.get_inventory_scan_coverage()

    scanned_count = sum(1 for row in coverage_rows if row["scan_status"] == "SCANNED")
    unscanned_count = sum(1 for row in coverage_rows if row["scan_status"] == "UNSCANNED")
    total_count = len(coverage_rows)

    return render_template(
        "chem/report.html",
        ...
    )
```

A single dashboard route that fetches **ten** different aggregations and renders them all. Each aggregation is a separate SQL query inside the service. The page is heavy on the database — every visit re-runs all of these — but since the data is in Postgres with proper indexes, it stays fast enough for a small inventory.

The `scan_coverage` query is interesting: it returns one row per active container, with a `scan_status` of `'SCANNED'` or `'UNSCANNED'` based on whether it appears in the latest cycle. The Python then tallies how many fell into each bucket.

### Transactions log

```python
@chem_bp.route("/transactions")
def transactions():
    q = (request.args.get("q") or "").strip()
    limit = 1000
    service = ChemInventoryService()
    rows = service.get_transactions(q=q, limit=limit)
    return render_template("chem/transactions.html", rows=rows, q=q, limit=limit)
```

Shows the audit trail. Every ADD/MOVE/EDIT/REMOVE/SCAN_UPLOAD action recorded by `log_transaction` ends up in the `transactions` table and shows up here.

### Small API endpoints

```python
@chem_bp.route('/api/inventory_json')
def api_inventory():
    """API endpoint for inventory data"""
    q = request.args.get('q', '').strip()
    limit = request.args.get('limit', type=int) or 500

    service = ChemInventoryService()
    rows = service.search_inventory(q, limit)

    return jsonify({'rows': [dict(r) for r in rows]})


@chem_bp.route("/api/suggest")
def api_suggest():
    field = (request.args.get("field") or "").strip()
    q = (request.args.get("q") or "").strip()
    limit = request.args.get("limit", type=int, default=10)

    service = ChemInventoryService()
    results = service.suggest(field, q, limit)
    return jsonify({"results": results})


@chem_bp.route("/api/autofill")
def api_autofill():
    catalog = (request.args.get("catalog") or "").strip()
    name = (request.args.get("name") or "").strip()

    service = ChemInventoryService()
    data = service.autofill(catalog=catalog, name=name)
    return jsonify({"data": data})


@chem_bp.route("/api/container_lookup")
def container_lookup():
    barcode = (request.args.get("barcode") or "").strip()
    ...
    with service.engine.begin() as conn:
        row = conn.execute(text("""..."""), {"barcode": barcode}).mappings().first()

    return jsonify({"data": dict(row) if row else None})
```

Three small JSON endpoints used by the front-end JavaScript:

- **`/api/inventory_json`** — same data as the HTML inventory page, but as JSON.
- **`/api/suggest`** — intended for type-ahead lists (a `field` name plus a partial query). Note: the underlying `suggest` service method is currently a stub returning an empty list, so this endpoint always responds with `{"results": []}`.
- **`/api/autofill`** — intended to look up an item by catalog number or name and return its known fields so the **Add** page can auto-fill. Note: the underlying `autofill` service method is currently a stub returning an empty object, so this endpoint always responds with `{"data": {}}`.
- **`/api/container_lookup`** — given a barcode, returns the full denormalized record. Used by the **Edit** page.

The `container_lookup` SQL is a good example of the joins used throughout this module:

```sql
SELECT
    c.container_id, c.item_id, c.room_id, c.barcode, c.container_code,
    i.name AS item_name, i.description, i.catalog_number, i.physical_state,
    COALESCE(c.size, i.volume_size) AS size, c.unit, c.system,
    v.vendor_name,
    r.room_no, r.room_name, r.room_desc,
    COALESCE(c.area_class, r.area_class) AS area_class,
    c.storage_location, c.storage_sublocation, c.storage_device,
    c.manuf_date, c.expiry_date, c.lot_number, c.choice,
    c.nmr, c.nmr_expiry, c.owner, c.notes, c.added_by
FROM containers c
LEFT JOIN items i   ON c.item_id   = i.item_id
LEFT JOIN vendors v ON i.vendor_id = v.vendor_id
LEFT JOIN rooms r   ON c.room_id   = r.room_id
WHERE c.barcode = :barcode
LIMIT 1
```

Two things to notice:

- **`COALESCE(c.size, i.volume_size)`** — the container can override the item's default size, but if it doesn't, fall back to the item's value. Same trick for area_class.
- **The placeholder `:barcode`** is bound separately, never spliced into the string. SQL injection-proof.

## The service — `chem_service.py`

The service is one big class, `ChemInventoryService`. It stores a SQLAlchemy `Engine` (created lazily) and exposes one method per operation. Below are highlights — there's too much code to cover every method, but the patterns repeat.

### Engine setup with fallback

```python
def get_chem_engine():
    """Create or return the global chemical database engine"""
    global _chem_engine
    if _chem_engine is None:
        try:
            host = current_app.config.get("CHEM_PGHOST", "localhost")
            ...
        except RuntimeError:
            load_dotenv()
            host = os.getenv("CHEM_PGHOST", os.getenv("PGHOST", "localhost"))
            ...

        url = f"postgresql+psycopg2://{user}:{pwd}@{host}:{port}/{db}"
        _chem_engine = create_engine(url, pool_pre_ping=True, pool_size=5, max_overflow=10, future=True)

    return _chem_engine
```

The engine is a process-wide global. The first call creates it; subsequent calls reuse the same one. `pool_pre_ping=True` makes the pool gracefully recover from a dropped DB connection. `pool_size=5, max_overflow=10` permits up to 15 concurrent connections.

The `except RuntimeError` is for situations where the chemical service is used from a standalone Python script (e.g. a one-off migration tool) outside of a Flask app context. In that case, fall back to reading env vars directly.

### Tiny helpers

```python
def _upsert(self, conn, table, key_col, value, id_col=None):
    """Insert or get existing record by unique column"""
    if value is None or str(value).strip() == "":
        return None

    if id_col is None:
        id_map = {
            "categories": "category_id",
            "vendors": "vendor_id",
            ...
        }
        id_col = id_map.get(table, f"{table[:-1]}_id")

    val = str(value).strip()
    row = conn.execute(
        text(f"SELECT {id_col} FROM {table} WHERE {key_col}=:v"),
        {"v": val}
    ).fetchone()

    if row:
        return row[0]

    return conn.execute(
        text(f"INSERT INTO {table}({key_col}) VALUES (:v) RETURNING {id_col}"),
        {"v": val}
    ).scalar()
```

A general-purpose "make sure this lookup row exists, return its ID" helper. Used everywhere to upsert vendor and category names.

```python
def _next_barcode(self, conn):
    """Generate next barcode from sequence"""
    return str(conn.execute(text("SELECT nextval('seq_barcode')")).scalar())
```

One line — calls Postgres's `nextval('seq_barcode')`, which atomically increments the sequence and returns the new value. **This is why barcodes are unique even under concurrent inserts**: Postgres guarantees it at the DB level.

### Room resolution

The function `resolve_room_id` is the most-touched piece of logic — it gets called by every `add_containers` and `move_container`. The rules are layered to handle messy real-world input:

1. If `room_no` is given, look up by it; if found, update missing fields from the form and return the ID.
2. Else try `room_desc` (description).
3. Else try `room_name`.
4. Else create a new room with whatever we have.

The full code is in lines 94–220 of `chem_service.py`. The pattern: try several lookup strategies in order; only create a new row if nothing matched. This avoids duplicate room records when users type a known room slightly differently.

### Searching inventory — `search_inventory`

```python
def search_inventory(self, query="", limit=500, show_removed=False):
    q = (query or "").strip()
    like = f"%{q}%"

    sql = """
        SELECT
            c.container_id, c.item_id, c.room_id,
            c.area_class, c.storage_location, ...
            c.barcode, c.size, c.unit, c.system, c.status,
            c.created_at, c.last_scan_at AS scan_date,
            i.name, i.catalog_number, i.physical_state,
            v.vendor_name AS vendor,
            r.room_no, r.room_name
        FROM containers c
        LEFT JOIN items i   ON c.item_id   = i.item_id
        LEFT JOIN vendors v ON i.vendor_id = v.vendor_id
        LEFT JOIN rooms r   ON c.room_id   = r.room_id
        WHERE 1=1
    """

    params = {"limit": limit}

    if not show_removed:
        sql += " AND COALESCE(c.status, 'ACTIVE') != 'REMOVED' "

    if q:
        sql += """
            AND (
                COALESCE(i.name, '') ILIKE :like
                OR COALESCE(i.catalog_number, '') ILIKE :like
                OR COALESCE(v.vendor_name, '') ILIKE :like
                OR COALESCE(c.barcode, '') ILIKE :like
                OR COALESCE(c.lot_number, '') ILIKE :like
                ...
            )
        """
        params["like"] = like

    sql += " ORDER BY i.name NULLS LAST, c.barcode NULLS LAST LIMIT :limit"

    with self.engine.begin() as conn:
        rows = conn.execute(text(sql), params).mappings().all()

    return rows
```

Three things make this worth annotating:

- **`WHERE 1=1`** is a trick that lets you append `AND ...` conditionally without worrying about the first one needing `WHERE` instead. Always true, no overhead.
- **`ILIKE`** is Postgres's case-insensitive LIKE. `'%q%'` matches anywhere in the string.
- **The `OR ... OR ... OR ...`** lets a single search box query against many columns. Slow on huge tables; fine for a few thousand containers.
- **`.mappings().all()`** returns rows as dictionaries instead of tuples, which the template uses by key.

### Adding containers — `add_containers`

```python
def add_containers(self, data):
    """Add new chemical containers - returns list of new barcodes"""
    with self.engine.begin() as conn:
        cat_id = self._upsert(conn, "categories", "name", "Chemicals")
        vendor_id = self._upsert(conn, "vendors", "vendor_name", data['vendor_name']) if data['vendor_name'] else None

        room_id = self.resolve_room_id(
            conn,
            data.get("room_no"),
            data.get("room_desc") or data.get("room_name"),
            data.get("area_class"),
        )

        item_id = conn.execute(text("""
            INSERT INTO items(name, description, catalog_number, physical_state, volume_size, vendor_id, category_id)
            VALUES (:n, :n, :c, :s, :sz, :vid, :cat)
            ON CONFLICT (name) DO UPDATE
                SET vendor_id      = COALESCE(items.vendor_id,      EXCLUDED.vendor_id),
                    category_id    = COALESCE(items.category_id,    EXCLUDED.category_id),
                    catalog_number = COALESCE(items.catalog_number, EXCLUDED.catalog_number),
                    physical_state = COALESCE(items.physical_state, EXCLUDED.physical_state),
                    volume_size    = COALESCE(items.volume_size,    EXCLUDED.volume_size)
            RETURNING item_id
        """), {...}).scalar()

        # Create N containers with unique barcodes
        qty = data.get('qty', 1)
        new_barcodes = []

        for _ in range(qty):
            bc = self._next_barcode(conn)
            new_barcodes.append(bc)

            result = conn.execute(text("""
                INSERT INTO containers(...) VALUES (...)
                RETURNING container_id
            """), {...})

            container_id = result.scalar()

            self.log_transaction(...)

        return new_barcodes
```

This is the canonical example of how the service stays atomic:

- **`with self.engine.begin() as conn`** — opens a transaction. Everything inside runs as one unit; if anything raises, the whole block rolls back.
- Upsert categories, vendors, rooms, items. None of those duplicate.
- The `ON CONFLICT (name) DO UPDATE` clause is Postgres's UPSERT. If a row with that item name already exists, the columns that were `NULL` get filled in from the form. Existing non-null values are preserved (thanks to `COALESCE`).
- Then loop `qty` times: pull the next barcode from the sequence, insert a container, log a transaction. Each barcode is its own DB call but it's all in one transaction.

If anything in this whole block fails halfway through, you don't get half-written containers. Good design.

### Scan import — `import_scans`

```python
def import_scans(self, barcodes, filename=None, performed_by=None, report_name=None, location=None):
    cleaned = [b.strip() for b in barcodes if b and b.strip()]
    total = len(cleaned)

    with self.engine.begin() as conn:
        cycle_row = conn.execute(text("""
            INSERT INTO inventory_cycles (
                filename, performed_by, report_name, location, total_scanned
            )
            VALUES (
                :filename, :performed_by, :report_name, :location, :total_scanned
            )
            RETURNING cycle_id
        """), {...}).fetchone()

        cycle_id = cycle_row[0]

        matched = 0
        unmatched = 0

        for barcode in cleaned:
            container = conn.execute(text("""
                SELECT container_id FROM containers WHERE barcode = :barcode LIMIT 1
            """), {"barcode": barcode}).fetchone()

            matched_container_id = container[0] if container else None

            conn.execute(text("""
                INSERT INTO scan_raw (cycle_id, raw_code, barcode, matched_container_id)
                VALUES (:cycle_id, :raw_code, :barcode, :matched_container_id)
            """), {...})

            if matched_container_id:
                matched += 1
                conn.execute(text("""
                    INSERT INTO container_scans (
                        container_id, cycle_id, barcode, source, status
                    )
                    VALUES (
                        :container_id, :cycle_id, :barcode, 'UPLOAD', 'FOUND'
                    )
                """), {...})

                conn.execute(text("""
                    UPDATE containers SET last_scan_at = NOW() WHERE container_id = :container_id
                """), {...})
            else:
                unmatched += 1

        conn.execute(text("""
            UPDATE inventory_cycles
            SET matched_count = :matched, unmatched_count = :unmatched
            WHERE cycle_id = :cycle_id
        """), {...})

        self.log_transaction(conn, action="SCAN_UPLOAD", performed_by=performed_by, details={...})

    return {
        "cycle_id": cycle_id,
        "total": total,
        "matched": matched,
        "unmatched": unmatched,
    }
```

The logic for each barcode:

1. Look up the matching container by barcode.
2. Insert a `scan_raw` row (even if no container matched — so unknown labels are still recorded).
3. If matched, insert a `container_scans` row and bump the container's `last_scan_at` to now.
4. If not matched, the `unmatched` counter goes up.

At the end, the cycle's counts are updated, and one summary entry is added to the transactions log.

This whole thing is again in one transaction — if the database dies halfway, the whole scan import is rolled back rather than leaving a half-imported cycle.

### Soft-delete: `remove_containers_by_barcodes`

```python
def remove_containers_by_barcodes(self, raw_barcodes, removed_by=None, reason=None, notes=None):
    ...
    with self.engine.begin() as conn:
        # parse comma/newline-separated barcodes
        bclist = ...

        not_found = []
        removed_count = 0
        for bc in bclist:
            row = conn.execute(text("SELECT container_id FROM containers WHERE barcode = :b"), {"b": bc}).fetchone()
            if not row:
                not_found.append(bc)
                continue

            conn.execute(text("""
                UPDATE containers
                SET status = 'REMOVED',
                    removed_at = NOW(),
                    removed_by = :u,
                    remove_reason = :r,
                    remove_notes = :n
                WHERE container_id = :id
            """), {...})
            self.log_transaction(conn, action="REMOVE", container_id=row[0], barcode=bc,
                                 performed_by=removed_by, details={"reason": reason, "notes": notes})
            removed_count += 1

    return {"removed_count": removed_count, "not_found": not_found}
```

Again: soft delete (`status='REMOVED'`) rather than `DELETE FROM containers`, plus a transaction-log entry. The function returns counts so the route can display "Removed N containers, M not found."

### Many small report methods

The remaining ~20 methods are each a single SQL query that returns a different report shape:

- `report_totals()` — counts of active, expired, etc.
- `report_expiring()` — bottles expiring soon.
- `report_expired()` — bottles already expired.
- `report_nmr_due()` — bottles whose NMR check is overdue.
- `report_by_room()`, `report_by_vendor()`, `report_by_system()`, `report_by_owner()` — groupings.
- `get_scan_reports()`, `get_inventory_scan_coverage()` — cycle/coverage rollups.
- `suggest(field, q, limit)` — currently a stub that returns an empty list (the type-ahead feature is not implemented).
- `autofill(catalog, name)` — currently a stub that returns an empty object (the catalog auto-fill feature is not implemented).
- `log_transaction(...)` — INSERTs into `transactions` (the audit table). It serializes the `details` argument to JSON and records the action, container, barcode, item, room, who did it, and a `NOW()` timestamp.

Each is essentially "SQL + return rows". The pattern stays consistent.

## Summary

The chemical inventory is built around five core ideas:

1. **Separate items from containers.** "Acetone" is one item; the 17 bottles of acetone are 17 containers.
2. **Barcodes from a Postgres sequence.** That's how uniqueness is guaranteed under any number of concurrent inserts.
3. **Scans are linked to cycles.** Every audit gets a cycle ID, and every scan is anchored to its cycle.
4. **Soft delete with an audit trail.** Containers are never physically removed; they get `status='REMOVED'`, and every action goes into the `transactions` table.
5. **Atomic operations via SQLAlchemy transactions.** `with self.engine.begin()` blocks make multi-step writes all-or-nothing.

The volume of code is large (~1600 lines in the service), but most of it is small SQL queries. Once you grasp the entity model and the upsert/transaction pattern, the rest reads like a long list of variations on the same theme.

Next: `10-Database-Models.md`.
