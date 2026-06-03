

# Source Reconstruction: UNanofabTools/app/templates/chem/OLDbcq.html

- Repository: `UNanofabTools`
- Relative path: `app/templates/chem/OLDbcq.html`
- Lines read: `88`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `4bad62c8dce8e3d1`
- Code fence language: `html`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Template Structure Summary

- Forms: 2 detected
- Inputs: 4 detected
- Scripts: 1 detected

## Sanitized Source Excerpt

```html
{% extends "chem/base.html" %}
{% block title %}Barcodes — Queue{% endblock %}

{% block content %}
<div class="container">
  <div class="page-header">
    <h1>Barcode Queue</h1>
    <p class="muted">Select barcodes and print labels.</p>
  </div>

  <form class="toolbar" method="get" action="{{ url_for('chem.barcode_queue') }}">
    <input type="text" name="q" value="{{ q }}" placeholder="Search (name, barcode, room, etc.)">
    <input type="number" name="limit" value="{{ limit }}" min="1" max="5000" style="width:120px;">
    <label style="display:flex; gap:8px; align-items:center;">
      <input type="checkbox" name="only_unprinted" value="1" {% if only_unprinted == '1' %}checked{% endif %}>
      Only unprinted
    </label>
    <button type="submit">Search</button>
  </form>

  <form method="post" action="{{ url_for('chem.barcode_print_selected') }}">
    <div class="toolbar" style="margin-top:10px;">
      <button type="submit">Print Selected</button>
      <button type="submit" formaction="{{ url_for('chem.barcode_mark_printed') }}">Mark Selected Printed</button>
      <button type="button" id="selectAllBtn">Select All</button>
      <button type="button" id="clearAllBtn">Clear</button>
    </div>

    <div class="table-wrap">
      <table class="nf-table">
        <thead>
          <tr>
            <th style="width:44px;"></th>
            <th>Barcode</th>
            <th>Item</th>
            <th>Lot #</th>
            <th>Room</th>
            <th>Storage</th>
            <th>Printed?</th>
            <th>Date Added</th>
          </tr>
        </thead>
        <tbody>
        {% for r in rows %}
          <tr>
            <td>
              <input type="checkbox" name="barcode" value="{{ r.barcode }}"
                {% if r.barcode in preselected %}checked{% endif %}>
            </td>
            <td class="mono">{{ r.barcode }}</td>
            <td>{{ r.material_name or r.item_name or '' }}</td>
            <td>{{ r.lot_number or '' }}</td>
            <td>{{ r.room_no or '' }}</td>
            <td>{{ r.storage_location or '' }}{% if r.storage_sublocation %} — {{ r.storage_sublocation }}{% endif %}</td>
            <td>{{ 'Yes' if r.barcode_printed else 'No' }}</td>
            <td>{{ r.created_at or '' }}</td>
          </tr>
        {% endfor %}
        </tbody>
      </table>
    </div>
  </form>
</div>

<script>
(function(){
  const selectAllBtn = document.getElementById("selectAllBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");

  function getBoxes(){
    return Array.from(document.querySelectorAll('input[type="checkbox"][name="barcode"]'));
  }

  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", function(){
      getBoxes().forEach(b => b.checked = true);
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", function(){
      getBoxes().forEach(b => b.checked = false);
    });
  }
})();
</script>
{% endblock %}

```

## Line-By-Line Reconstruction Notes

### Line 1

```text
{% extends "chem/base.html" %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 1 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `none` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
{% block title %}Barcodes — Queue{% endblock %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 2 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 3 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
{% block content %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 4 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
<div class="container">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 5 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
  <div class="page-header">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 6 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
    <h1>Barcode Queue</h1>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 7 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
    <p class="muted">Select barcodes and print labels.</p>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 8 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
  </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 9 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 10 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html-form`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
  <form class="toolbar" method="get" action="{{ url_for('chem.barcode_queue') }}">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 11 is classified as `html-form`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This form line defines browser input flow. Preserve action URL, method, CSRF/auth assumptions, field names, and submit behavior; edge cases include missing required fields, browser autofill, duplicate submissions, and routes that expect exact names. Neighbor context: previous kind is `blank` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
    <input type="text" name="q" value="{{ q }}" placeholder="Search (name, barcode, room, etc.)">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 12 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-form` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
    <input type="number" name="limit" value="{{ limit }}" min="1" max="5000" style="width:120px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 13 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
    <label style="display:flex; gap:8px; align-items:center;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 14 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
      <input type="checkbox" name="only_unprinted" value="1" {% if only_unprinted == '1' %}checked{% endif %}>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 15 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
      Only unprinted
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 16 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
    </label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 17 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
    <button type="submit">Search</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 18 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
  </form>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 19 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 20 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html-form`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
  <form method="post" action="{{ url_for('chem.barcode_print_selected') }}">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 21 is classified as `html-form`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This form line defines browser input flow. Preserve action URL, method, CSRF/auth assumptions, field names, and submit behavior; edge cases include missing required fields, browser autofill, duplicate submissions, and routes that expect exact names. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
    <div class="toolbar" style="margin-top:10px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 22 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-form` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
      <button type="submit">Print Selected</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 23 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
      <button type="submit" formaction="{{ url_for('chem.barcode_mark_printed') }}">Mark Selected Printed</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 24 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-control` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
      <button type="button" id="selectAllBtn">Select All</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 25 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-control` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
      <button type="button" id="clearAllBtn">Clear</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 26 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 27 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 28 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
    <div class="table-wrap">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 29 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
      <table class="nf-table">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 30 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
        <thead>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 31 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
          <tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 32 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
            <th style="width:44px;"></th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 33 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
            <th>Barcode</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 34 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
            <th>Item</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 35 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
            <th>Lot #</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 36 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
            <th>Room</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 37 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
            <th>Storage</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 38 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
            <th>Printed?</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 39 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
            <th>Date Added</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 40 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
          </tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 41 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
        </thead>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 42 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
        <tbody>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 43 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
        {% for r in rows %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 44 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
          <tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 45 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
            <td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 46 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
              <input type="checkbox" name="barcode" value="{{ r.barcode }}"
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 47 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
                {% if r.barcode in preselected %}checked{% endif %}>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 48 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
            </td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 49 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
            <td class="mono">{{ r.barcode }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 50 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
            <td>{{ r.material_name or r.item_name or '' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 51 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
            <td>{{ r.lot_number or '' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 52 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
            <td>{{ r.room_no or '' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 53 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
            <td>{{ r.storage_location or '' }}{% if r.storage_sublocation %} — {{ r.storage_sublocation }}{% endif %}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 54 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
            <td>{{ 'Yes' if r.barcode_printed else 'No' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 55 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
            <td>{{ r.created_at or '' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 56 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
          </tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 57 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
        {% endfor %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 58 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
        </tbody>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 59 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
      </table>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 60 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 61 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
  </form>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 62 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
</div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 63 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 64 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `asset-link`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
<script>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 65 is classified as `asset-link`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This asset linkage pulls in JavaScript, CSS, or browser behavior. Preserve relative paths, load order, cache expectations, and fallback behavior; edge cases include missing static files, stale browser cache, and scripts running before elements exist. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
(function(){
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 66 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `asset-link` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
  const selectAllBtn = document.getElementById("selectAllBtn");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 67 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
  const clearAllBtn = document.getElementById("clearAllBtn");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 68 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 69 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
  function getBoxes(){
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 70 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
    return Array.from(document.querySelectorAll('input[type="checkbox"][name="barcode"]'));
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 71 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 72 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 73 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
  if (selectAllBtn) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 74 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
    selectAllBtn.addEventListener("click", function(){
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 75 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
      getBoxes().forEach(b => b.checked = true);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 76 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 77 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 78 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 79 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
  if (clearAllBtn) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 80 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
    clearAllBtn.addEventListener("click", function(){
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 81 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
      getBoxes().forEach(b => b.checked = false);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 82 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 83 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 84 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
})();
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 85 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
</script>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 86 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
{% endblock %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/OLDbcq.html`, line 87 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/templates/chem/OLDbcq.html`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
