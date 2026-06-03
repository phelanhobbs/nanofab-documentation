

# Source Reconstruction: UNanofabTools/app/templates/chem/inventory.html

- Repository: `UNanofabTools`
- Relative path: `app/templates/chem/inventory.html`
- Lines read: `175`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `1e591a9abcbe209a`
- Code fence language: `html`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Template Structure Summary

- Forms: 1 detected
- Inputs: 3 detected
- Scripts: 1 detected

## Sanitized Source Excerpt

```html
{% extends "chem/base.html" %}
{% block content %}
  <h1>Chemical Inventory</h1>

  <form class="actions" method="get" action="{{ url_for('chem.inventory') }}">
    <input type="text" name="q" placeholder="Search name, description, barcode…" value="{{ q or '' }}">
    <button class="btn" type="submit">Search</button>
    <span class="muted">Showing up to {{ limit }} rows{{ ' for "' ~ q ~ '"' if q }}.</span>
    <a class="btn btn-secondary" href="{{ url_for('chem.inventory_export_csv', q=q) }}">
  Export CSV
</a>
	<label style="margin-left:12px;">
  <input type="checkbox" name="show_removed" value="1" {% if show_removed == "1" %}checked{% endif %}>
  Show Removed
</label>

<label style="margin-left:12px;">
  <input type="checkbox" name="show_printed" value="1" {% if show_printed == "1" %}checked{% endif %}>
  Show Printed column
</label>

  </form>

  <div class="table-wrap">
  <table class="inv-table">
    <thead>
      <tr>
        <th>Barcode</th>
        <th>Material Name</th>
        <th>Room#</th>
        <th>Room Name</th>
        <th>Storage Location</th>
        <th>Storage Sublocation</th>
        <th>Storage Device</th>
        <th>Area Class</th>
        <th>Size</th>
        <th>Unit</th>
        <th>System</th>
        <th>Vendor</th>
        <th>Lot#</th>
        <th>Scan Date</th>
        <th>Entry Date</th>
        <th>Manuf Date</th>
        <th>Exp Date</th>
	    <th>Catalog #</th>
	    <th>Status</th>
        {% if show_printed == "1" %}<th>Printed?</th>{% endif %}
        <th>Choice</th>
        <th>NMR</th>
        <th>NMR Exp</th>
        <th>Owner</th>
        <th>Notes</th>
        <th class="nowrap">Added By</th>
      </tr>
    </thead>
    <tbody>
      {% for r in rows %}
      <tr>
        <td class="nowrap"><code>{{ r.barcode or '—' }}</code></td>
        <td class="wrap">{{ r.name or '—' }}</td>
        <td class="nowrap">{{ r.room_no or '—' }}</td>
        <td class="nowrap">{{ r.room_name or '—' }}</td>
        <td class="wrap">{{ r.storage_location or '—' }}</td>
        <td class="wrap">{{ r.storage_sublocation or '—' }}</td>
        <td class="wrap">{{ r.storage_device or '—' }}</td>
        <td class="nowrap">{{ r.area_class or '—' }}</td>


        <td class="nowrap">{{ r.size or '—' }}</td>
        <td class="nowrap">{{ r.unit or '—' }}</td>
        <td class="wrap">{{ r.system or '—' }}</td>
        <td class="nowrap">{{ r.vendor or '—' }}</td>
        <td class="nowrap">{{ r.lot_number or '—' }}</td>
	<td>
	    {% if r.scan_date %}
	      {{ r.scan_date.strftime('%Y-%m-%d')}}
	    {% else %}
            Not Scanned
        {% endif %}

	</td>


    <td>
	    {% if r.inv_date %}
	      {{ r.inv_date.strftime('%Y-%m-%d') }}
	    {% endif %}
	</td>

        <td class="nowrap">{{ r.manuf_date|fmtdate }}</td>
        <td class="nowrap">{{ r.exp_date|fmtdate }}</td>
	<td>{{ r.catalog_number }}</td>
	<td>{{ r.status }}</td>
	{% if show_printed == "1" %}
	<td>{{ 'Yes' if r.label_printed else 'No' }}</td>
	{% endif %}

        <td class="nowrap">{{ r.choice or '—' }}</td>
        <td class="nowrap">{{ r.nmr or '—' }}</td>
        <td class="nowrap">{{ r.nmr_exp|fmtdate }}</td>
        <td class="nowrap">{{ r.owner or '—' }}</td>
        <td class="notes-col">
	  {% set note_text = r.notes or '' %}
	  {% if note_text %}
	    <div class="note-preview">
	      {{ note_text[:60] }}{% if note_text|length > 60 %}...{% endif %}
	    </div>

	    {% if note_text|length > 60 %}
	      <button type="button" class="note-toggle-btn" onclick="toggleNote(this)">
	        Show
	      </button>
	      <div class="note-full" style="display:none;">
	        {{ note_text }}
	      </div>
	    {% endif %}
	  {% endif %}
	</td>
        <td>{{ r.get('added_by') if r.get else 'no get' }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>

<script>
function toggleNote(btn) {
  const full = btn.parentElement.querySelector(".note-full");
  const preview = btn.parentElement.querySelector(".note-preview");

  if (!full || !preview) return;

  if (full.style.display === "none" || full.style.display === "") {
    full.style.display = "block";
    preview.style.display = "none";
    btn.textContent = "Hide";
  } else {
    full.style.display = "none";
    preview.style.display = "block";
    btn.textContent = "Show";
  }
}
</script>
<style>
.notes-col {
  max-width: 260px;
  vertical-align: top;
}

.note-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.note-full {
  white-space: normal;
  word-break: break-word;
  margin-top: 6px;
  max-width: 320px;
}

.note-toggle-btn {
  margin-top: 4px;
  padding: 2px 8px;
  font-size: 12px;
  border: 1px solid #bbb;
  border-radius: 6px;
  background: #000000;
  cursor: pointer;
}
</style>

{% endblock %}
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
{% extends "chem/base.html" %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 1 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `none` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
{% block content %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 2 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
  <h1>Chemical Inventory</h1>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 3 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 4 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html-form`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
  <form class="actions" method="get" action="{{ url_for('chem.inventory') }}">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 5 is classified as `html-form`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This form line defines browser input flow. Preserve action URL, method, CSRF/auth assumptions, field names, and submit behavior; edge cases include missing required fields, browser autofill, duplicate submissions, and routes that expect exact names. Neighbor context: previous kind is `blank` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
    <input type="text" name="q" placeholder="Search name, description, barcode…" value="{{ q or '' }}">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 6 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-form` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
    <button class="btn" type="submit">Search</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 7 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-control` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
    <span class="muted">Showing up to {{ limit }} rows{{ ' for "' ~ q ~ '"' if q }}.</span>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 8 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html-control` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
    <a class="btn btn-secondary" href="{{ url_for('chem.inventory_export_csv', q=q) }}">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 9 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
  Export CSV
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 10 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
</a>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 11 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
	<label style="margin-left:12px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 12 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
  <input type="checkbox" name="show_removed" value="1" {% if show_removed == "1" %}checked{% endif %}>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 13 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
  Show Removed
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 14 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 15 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 16 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
<label style="margin-left:12px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 17 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
  <input type="checkbox" name="show_printed" value="1" {% if show_printed == "1" %}checked{% endif %}>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 18 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
  Show Printed column
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 19 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 20 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 21 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
  </form>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 22 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 23 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
  <div class="table-wrap">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 24 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
  <table class="inv-table">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 25 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
    <thead>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 26 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
      <tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 27 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
        <th>Barcode</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 28 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
        <th>Material Name</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 29 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
        <th>Room#</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 30 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
        <th>Room Name</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 31 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
        <th>Storage Location</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 32 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
        <th>Storage Sublocation</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 33 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
        <th>Storage Device</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 34 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
        <th>Area Class</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 35 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
        <th>Size</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 36 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
        <th>Unit</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 37 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
        <th>System</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 38 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
        <th>Vendor</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 39 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
        <th>Lot#</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 40 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
        <th>Scan Date</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 41 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
        <th>Entry Date</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 42 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
        <th>Manuf Date</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 43 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
        <th>Exp Date</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 44 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
	    <th>Catalog #</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 45 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
	    <th>Status</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 46 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
        {% if show_printed == "1" %}<th>Printed?</th>{% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 47 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
        <th>Choice</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 48 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
        <th>NMR</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 49 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
        <th>NMR Exp</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 50 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
        <th>Owner</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 51 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
        <th>Notes</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 52 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
        <th class="nowrap">Added By</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 53 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
      </tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 54 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
    </thead>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 55 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
    <tbody>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 56 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
      {% for r in rows %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 57 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
      <tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 58 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
        <td class="nowrap"><code>{{ r.barcode or '—' }}</code></td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 59 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
        <td class="wrap">{{ r.name or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 60 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
        <td class="nowrap">{{ r.room_no or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 61 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
        <td class="nowrap">{{ r.room_name or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 62 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
        <td class="wrap">{{ r.storage_location or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 63 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
        <td class="wrap">{{ r.storage_sublocation or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 64 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
        <td class="wrap">{{ r.storage_device or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 65 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
        <td class="nowrap">{{ r.area_class or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 66 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 67 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `template` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 68 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
        <td class="nowrap">{{ r.size or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 69 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `blank` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
        <td class="nowrap">{{ r.unit or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 70 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
        <td class="wrap">{{ r.system or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 71 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
        <td class="nowrap">{{ r.vendor or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 72 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
        <td class="nowrap">{{ r.lot_number or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 73 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
	<td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 74 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
	    {% if r.scan_date %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 75 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
	      {{ r.scan_date.strftime('%Y-%m-%d')}}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 76 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
	    {% else %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 77 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
            Not Scanned
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 78 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
        {% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 79 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 80 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
	</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 81 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 82 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 83 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
    <td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 84 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
	    {% if r.inv_date %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 85 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
	      {{ r.inv_date.strftime('%Y-%m-%d') }}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 86 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
	    {% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 87 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
	</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 88 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 89 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
        <td class="nowrap">{{ r.manuf_date|fmtdate }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 90 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `blank` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
        <td class="nowrap">{{ r.exp_date|fmtdate }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 91 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
	<td>{{ r.catalog_number }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 92 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
	<td>{{ r.status }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 93 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
	{% if show_printed == "1" %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 94 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
	<td>{{ 'Yes' if r.label_printed else 'No' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 95 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
	{% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 96 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 97 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
        <td class="nowrap">{{ r.choice or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 98 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `blank` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
        <td class="nowrap">{{ r.nmr or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 99 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
        <td class="nowrap">{{ r.nmr_exp|fmtdate }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 100 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
        <td class="nowrap">{{ r.owner or '—' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 101 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
        <td class="notes-col">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 102 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
	  {% set note_text = r.notes or '' %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 103 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
	  {% if note_text %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 104 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
	    <div class="note-preview">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 105 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
	      {{ note_text[:60] }}{% if note_text|length > 60 %}...{% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 106 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
	    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 107 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 108 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
	    {% if note_text|length > 60 %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 109 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `blank` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
	      <button type="button" class="note-toggle-btn" onclick="toggleNote(this)">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 110 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
	        Show
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 111 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
	      </button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 112 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
	      <div class="note-full" style="display:none;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 113 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
	        {{ note_text }}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 114 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
	      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 115 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
	    {% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 116 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
	  {% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 117 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
	</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 118 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
        <td>{{ r.get('added_by') if r.get else 'no get' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 119 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
      </tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 120 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
      {% endfor %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 121 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
    </tbody>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 122 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
  </table>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 123 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
</div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 124 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 125 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `asset-link`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
<script>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 126 is classified as `asset-link`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This asset linkage pulls in JavaScript, CSS, or browser behavior. Preserve relative paths, load order, cache expectations, and fallback behavior; edge cases include missing static files, stale browser cache, and scripts running before elements exist. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
function toggleNote(btn) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 127 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `asset-link` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
  const full = btn.parentElement.querySelector(".note-full");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 128 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
  const preview = btn.parentElement.querySelector(".note-preview");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 129 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 130 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
  if (!full || !preview) return;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 131 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 132 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
  if (full.style.display === "none" || full.style.display === "") {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 133 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
    full.style.display = "block";
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 134 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
    preview.style.display = "none";
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 135 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
    btn.textContent = "Hide";
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 136 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
  } else {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 137 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
    full.style.display = "none";
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 138 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
    preview.style.display = "block";
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 139 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
    btn.textContent = "Show";
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 140 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 141 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 142 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
</script>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 143 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
<style>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 144 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
.notes-col {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 145 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
  max-width: 260px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 146 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
  vertical-align: top;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 147 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 148 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 149 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
.note-preview {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 150 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
  white-space: nowrap;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 151 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
  overflow: hidden;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 152 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
  text-overflow: ellipsis;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 153 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
  max-width: 220px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 154 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 155 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 156 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
.note-full {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 157 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
  white-space: normal;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 158 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
  word-break: break-word;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 159 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
  margin-top: 6px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 160 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
  max-width: 320px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 161 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 162 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 163 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
.note-toggle-btn {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 164 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
  margin-top: 4px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 165 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
  padding: 2px 8px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 166 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
  font-size: 12px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 167 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 168

```text
  border: 1px solid #bbb;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 168 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 169

```text
  border-radius: 6px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 169 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 170

```text
  background: #000000;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 170 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 171

```text
  cursor: pointer;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 171 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 172

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 172 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 173

```text
</style>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 173 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 174

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 174 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 175

```text
{% endblock %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/inventory.html`, line 175 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `blank` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/templates/chem/inventory.html`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
