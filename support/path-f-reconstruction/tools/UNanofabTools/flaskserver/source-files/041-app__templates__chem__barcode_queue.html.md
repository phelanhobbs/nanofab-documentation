

# Source Reconstruction: UNanofabTools/app/templates/chem/barcode_queue.html

- Repository: `UNanofabTools`
- Relative path: `app/templates/chem/barcode_queue.html`
- Lines read: `125`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `b31aff0e8d226e89`
- Code fence language: `html`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Template Structure Summary

- Forms: 2 detected
- Inputs: 3 detected
- Scripts: 1 detected

## Sanitized Source Excerpt

```html
{% extends "chem/base.html" %}
{% block title %}Barcodes — Queue{% endblock %}

{% block content %}
<div class="actions" style="justify-content:space-between; align-items:end; margin-bottom:18px;">
  <div>
    <h1 style="margin:0;">Barcode Queue</h1>
    <p class="muted" style="margin:6px 0 0 0;">Search queued barcodes and mark selected labels as printed.</p>
  </div>
</div>

<div class="card" style="padding:18px; margin-bottom:18px;">
  <form method="get" action="{{ url_for('chem.barcode_queue') }}" style="display:flex; gap:12px; flex-wrap:wrap; align-items:end;">
    <div style="min-width:280px; flex:1;">
      <label for="q" style="display:block; margin-bottom:6px; font-weight:600;">Search</label>
      <input
        id="q"
        type="text"
        name="q"
        value="{{ q }}"
        placeholder="Search by name, barcode, room, storage, etc."
        style="width:100%; padding:10px;"
      >
    </div>

    <label style="display:flex; gap:8px; align-items:center; padding-bottom:10px;">
      <input type="checkbox" name="only_unprinted" value="1" {% if only_unprinted == '1' %}checked{% endif %}>
      Only unprinted
    </label>

    <div style="display:flex; gap:10px;">
      <button type="submit" class="btn">Search</button>
      <a class="btn" href="{{ url_for('chem.barcode_queue') }}">Clear</a>
    </div>
  </form>
</div>

<form method="post" action="{{ url_for('chem.barcode_mark_printed') }}">
  <div class="actions" style="justify-content:space-between; margin-bottom:12px;">
    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <button type="submit" class="btn btn-primary">Mark Selected Printed</button>
      <button type="button" class="btn" id="selectAllBtn">Select All</button>
      <button type="button" class="btn" id="clearAllBtn">Clear</button>
    </div>
    <div class="muted">
      {{ rows|length }} item{{ '' if rows|length == 1 else 's' }}
    </div>
  </div>

  <div class="card" style="padding:0;">
    <div style="overflow-x:auto;">
      <table class="inv-table" style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th style="width:44px; padding:10px 12px;"></th>
            <th style="padding:10px 12px;">Barcode</th>
            <th style="padding:10px 12px;">Item</th>
            <th style="padding:10px 12px;">Lot #</th>
            <th style="padding:10px 12px;">Room</th>
            <th style="padding:10px 12px;">Storage</th>
            <th style="padding:10px 12px;">Printed?</th>
            <th style="padding:10px 12px;">Date Added</th>
          </tr>
        </thead>
        <tbody>
        {% for r in rows %}
          <tr>
            <td style="padding:10px 12px;">
              <input
                type="checkbox"
                name="barcode"
                value="{{ r.barcode }}"
                {% if r.barcode in preselected %}checked{% endif %}
              >
            </td>
            <td class="mono" style="padding:10px 12px;"><code>{{ r.barcode }}</code></td>
            <td style="padding:10px 12px;">{{ r.material_name or r.item_name or '' }}</td>
            <td style="padding:10px 12px;">{{ r.lot_number or '' }}</td>
            <td style="padding:10px 12px;">{{ r.room_no or '' }}</td>
            <td style="padding:10px 12px;">
              {{ r.storage_location or '' }}{% if r.storage_sublocation %} — {{ r.storage_sublocation }}{% endif %}
            </td>
            <td style="padding:10px 12px;">
              {% if r.barcode_printed %}
                <span style="color:#067647; font-weight:600;">Yes</span>
              {% else %}
                <span style="color:#b42318; font-weight:600;">No</span>
              {% endif %}
            </td>
            <td style="padding:10px 12px;">{{ r.created_at.strftime('%m/%d/%y') if r.created_at else '' }}</td>
          </tr>
        {% else %}
          <tr>
            <td colspan="8" style="padding:16px 12px;" class="muted">No barcode queue items found.</td>
          </tr>
        {% endfor %}
        </tbody>
      </table>
    </div>
  </div>
</form>

<script>
(function(){
  const selectAllBtn = document.getElementById("selectAllBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");

  function getBoxes() {
    return Array.from(document.querySelectorAll('input[type="checkbox"][name="barcode"]'));
  }

  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", function() {
      getBoxes().forEach(b => b.checked = true);
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", function() {
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

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 1 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `none` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
{% block title %}Barcodes — Queue{% endblock %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 2 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 3 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
{% block content %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 4 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
<div class="actions" style="justify-content:space-between; align-items:end; margin-bottom:18px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 5 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
  <div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 6 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
    <h1 style="margin:0;">Barcode Queue</h1>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 7 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
    <p class="muted" style="margin:6px 0 0 0;">Search queued barcodes and mark selected labels as printed.</p>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 8 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
  </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 9 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
</div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 10 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 11 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
<div class="card" style="padding:18px; margin-bottom:18px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 12 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html-form`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
  <form method="get" action="{{ url_for('chem.barcode_queue') }}" style="display:flex; gap:12px; flex-wrap:wrap; align-items:end;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 13 is classified as `html-form`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This form line defines browser input flow. Preserve action URL, method, CSRF/auth assumptions, field names, and submit behavior; edge cases include missing required fields, browser autofill, duplicate submissions, and routes that expect exact names. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
    <div style="min-width:280px; flex:1;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 14 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-form` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
      <label for="q" style="display:block; margin-bottom:6px; font-weight:600;">Search</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 15 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
      <input
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 16 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
        id="q"
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 17 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
        type="text"
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 18 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
        name="q"
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 19 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
        value="{{ q }}"
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 20 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
        placeholder="Search by name, barcode, room, storage, etc."
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 21 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
        style="width:100%; padding:10px;"
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 22 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
      >
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 23 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 24 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 25 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
    <label style="display:flex; gap:8px; align-items:center; padding-bottom:10px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 26 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
      <input type="checkbox" name="only_unprinted" value="1" {% if only_unprinted == '1' %}checked{% endif %}>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 27 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
      Only unprinted
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 28 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
    </label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 29 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 30 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
    <div style="display:flex; gap:10px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 31 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
      <button type="submit" class="btn">Search</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 32 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
      <a class="btn" href="{{ url_for('chem.barcode_queue') }}">Clear</a>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 33 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 34 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
  </form>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 35 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
</div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 36 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 37 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html-form`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
<form method="post" action="{{ url_for('chem.barcode_mark_printed') }}">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 38 is classified as `html-form`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This form line defines browser input flow. Preserve action URL, method, CSRF/auth assumptions, field names, and submit behavior; edge cases include missing required fields, browser autofill, duplicate submissions, and routes that expect exact names. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
  <div class="actions" style="justify-content:space-between; margin-bottom:12px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 39 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-form` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
    <div style="display:flex; gap:10px; flex-wrap:wrap;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 40 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
      <button type="submit" class="btn btn-primary">Mark Selected Printed</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 41 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
      <button type="button" class="btn" id="selectAllBtn">Select All</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 42 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-control` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
      <button type="button" class="btn" id="clearAllBtn">Clear</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 43 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 44 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
    <div class="muted">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 45 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
      {{ rows|length }} item{{ '' if rows|length == 1 else 's' }}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 46 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 47 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
  </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 48 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 49 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
  <div class="card" style="padding:0;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 50 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
    <div style="overflow-x:auto;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 51 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
      <table class="inv-table" style="width:100%; border-collapse:collapse;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 52 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
        <thead>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 53 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
          <tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 54 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
            <th style="width:44px; padding:10px 12px;"></th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 55 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
            <th style="padding:10px 12px;">Barcode</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 56 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
            <th style="padding:10px 12px;">Item</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 57 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
            <th style="padding:10px 12px;">Lot #</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 58 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
            <th style="padding:10px 12px;">Room</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 59 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
            <th style="padding:10px 12px;">Storage</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 60 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
            <th style="padding:10px 12px;">Printed?</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 61 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
            <th style="padding:10px 12px;">Date Added</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 62 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
          </tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 63 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
        </thead>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 64 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
        <tbody>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 65 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
        {% for r in rows %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 66 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
          <tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 67 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
            <td style="padding:10px 12px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 68 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
              <input
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 69 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
                type="checkbox"
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 70 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
                name="barcode"
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 71 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
                value="{{ r.barcode }}"
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 72 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
                {% if r.barcode in preselected %}checked{% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 73 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
              >
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 74 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
            </td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 75 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
            <td class="mono" style="padding:10px 12px;"><code>{{ r.barcode }}</code></td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 76 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
            <td style="padding:10px 12px;">{{ r.material_name or r.item_name or '' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 77 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
            <td style="padding:10px 12px;">{{ r.lot_number or '' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 78 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
            <td style="padding:10px 12px;">{{ r.room_no or '' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 79 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
            <td style="padding:10px 12px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 80 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
              {{ r.storage_location or '' }}{% if r.storage_sublocation %} — {{ r.storage_sublocation }}{% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 81 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
            </td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 82 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
            <td style="padding:10px 12px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 83 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
              {% if r.barcode_printed %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 84 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
                <span style="color:#067647; font-weight:600;">Yes</span>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 85 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
              {% else %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 86 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
                <span style="color:#b42318; font-weight:600;">No</span>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 87 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
              {% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 88 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
            </td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 89 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
            <td style="padding:10px 12px;">{{ r.created_at.strftime('%m/%d/%y') if r.created_at else '' }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 90 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
          </tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 91 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
        {% else %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 92 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
          <tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 93 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
            <td colspan="8" style="padding:16px 12px;" class="muted">No barcode queue items found.</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 94 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
          </tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 95 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
        {% endfor %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 96 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
        </tbody>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 97 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
      </table>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 98 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 99 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
  </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 100 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
</form>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 101 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 102 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `asset-link`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
<script>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 103 is classified as `asset-link`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This asset linkage pulls in JavaScript, CSS, or browser behavior. Preserve relative paths, load order, cache expectations, and fallback behavior; edge cases include missing static files, stale browser cache, and scripts running before elements exist. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
(function(){
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 104 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `asset-link` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
  const selectAllBtn = document.getElementById("selectAllBtn");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 105 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
  const clearAllBtn = document.getElementById("clearAllBtn");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 106 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 107 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
  function getBoxes() {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 108 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
    return Array.from(document.querySelectorAll('input[type="checkbox"][name="barcode"]'));
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 109 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 110 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 111 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
  if (selectAllBtn) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 112 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
    selectAllBtn.addEventListener("click", function() {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 113 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
      getBoxes().forEach(b => b.checked = true);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 114 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 115 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 116 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 117 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
  if (clearAllBtn) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 118 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
    clearAllBtn.addEventListener("click", function() {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 119 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
      getBoxes().forEach(b => b.checked = false);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 120 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 121 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 122 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
})();
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 123 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
</script>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 124 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
{% endblock %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/barcode_queue.html`, line 125 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/templates/chem/barcode_queue.html`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
