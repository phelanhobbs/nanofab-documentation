

# Source Reconstruction: UNanofabTools/app/templates/chem/transactions.html

- Repository: `UNanofabTools`
- Relative path: `app/templates/chem/transactions.html`
- Lines read: `83`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `a796556bd513c3a8`
- Code fence language: `html`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Template Structure Summary

- Forms: 1 detected
- Inputs: 1 detected
- Scripts: 0 detected

## Sanitized Source Excerpt

```html
{% extends "chem/base.html" %}
{% block title %}Transactions – Chemical Inventory{% endblock %}

{% block content %}
<div class="container">
  <h1 class="page-title">Transactions / Audit Log</h1>

  <div class="card">
    <form method="get" action="{{ url_for('chem.transactions') }}" class="search-row">
      <input type="text" name="q" value="{{ q }}" placeholder="Search barcode, action, user, material, notes…">
      <button class="btn primary" type="submit">Search</button>
      {% if q %}
        <a class="btn" href="{{ url_for('chem.transactions') }}">Clear</a>
      {% endif %}
    </form>
    <div class="hint">Showing up to {{ limit }} most recent rows.</div>
  </div>

  <div class="card" style="margin-top:16px;">
    <div class="table-wrap">
      <table class="nf-table">
        <thead>
          <tr>
            <th style="min-width:170px;">Time</th>
            <th style="min-width:90px;">Action</th>
            <th style="min-width:90px;">Barcode</th>
            <th style="min-width:220px;">Item</th>
            <th style="min-width:110px;">Room</th>
            <th style="min-width:160px;">Storage</th>
            <th style="min-width:140px;">User</th>
            <th style="min-width:160px;">Reason</th>
            <th style="min-width:260px;">Notes</th>
          </tr>
        </thead>
        <tbody>
          {% for r in rows %}
            <tr>
              <td class="mono">{{ r.created_at if r.created_at is not none else r.ts }}</td>
              <td><span class="pill">{{ r.action }}</span></td>
              <td class="mono">
                {% if r.barcode %}
                  <a href="{{ url_for('chem.inventory', q=r.barcode) }}">{{ r.barcode }}</a>
                {% else %}
                  —
                {% endif %}
              </td>
              <td>{{ r.material_name or "—" }}</td>
              <td class="mono">{{ r.room_no or "—" }}</td>
              <td>{{ r.storage_location or "—" }}</td>
              <td>{{ r.performed_by or "—" }}</td>
              <td>{{ r.reason or "—" }}</td>
              <td>{{ r.notes or "—" }}</td>
            </tr>
          {% endfor %}
          {% if not rows %}
            <tr>
              <td colspan="9" class="muted" style="padding:18px;">No transactions found.</td>
            </tr>
          {% endif %}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.page-title { margin: 10px 0 14px; }
.card { background: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,.04); }
.search-row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.search-row input { flex:1; min-width: 280px; padding: 10px 12px; font-size: 16px; border:1px solid #bbb; border-radius:6px; }
.btn { display:inline-block; padding: 10px 14px; border:1px solid #bbb; border-radius: 999px; background:#fff; cursor:pointer; text-decoration:none; }
.btn.primary { background:#c00; border-color:#c00; color:#fff; }
.hint, .muted { color:#666; font-size: 13px; margin-top: 8px; }
.table-wrap { overflow-x:auto; }
.nf-table { width:100%; border-collapse: collapse; }
.nf-table th, .nf-table td { border:1px solid #444; padding: 10px; vertical-align: top; }
.nf-table th { background:#f5f5f5; font-size: 18px; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
.pill { display:inline-block; padding: 4px 10px; border-radius: 999px; background:#eee; font-weight: 700; }
</style>
{% endblock %}

```

## Line-By-Line Reconstruction Notes

### Line 1

```text
{% extends "chem/base.html" %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 1 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `none` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
{% block title %}Transactions – Chemical Inventory{% endblock %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 2 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 3 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
{% block content %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 4 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
<div class="container">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 5 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
  <h1 class="page-title">Transactions / Audit Log</h1>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 6 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 7 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
  <div class="card">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 8 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html-form`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
    <form method="get" action="{{ url_for('chem.transactions') }}" class="search-row">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 9 is classified as `html-form`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This form line defines browser input flow. Preserve action URL, method, CSRF/auth assumptions, field names, and submit behavior; edge cases include missing required fields, browser autofill, duplicate submissions, and routes that expect exact names. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
      <input type="text" name="q" value="{{ q }}" placeholder="Search barcode, action, user, material, notes…">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 10 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-form` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
      <button class="btn primary" type="submit">Search</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 11 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-control` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
      {% if q %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 12 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html-control` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
        <a class="btn" href="{{ url_for('chem.transactions') }}">Clear</a>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 13 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
      {% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 14 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
    </form>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 15 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
    <div class="hint">Showing up to {{ limit }} most recent rows.</div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 16 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
  </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 17 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 18 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
  <div class="card" style="margin-top:16px;">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 19 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
    <div class="table-wrap">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 20 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
      <table class="nf-table">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 21 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
        <thead>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 22 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
          <tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 23 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
            <th style="min-width:170px;">Time</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 24 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
            <th style="min-width:90px;">Action</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 25 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
            <th style="min-width:90px;">Barcode</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 26 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
            <th style="min-width:220px;">Item</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 27 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
            <th style="min-width:110px;">Room</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 28 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
            <th style="min-width:160px;">Storage</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 29 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
            <th style="min-width:140px;">User</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 30 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
            <th style="min-width:160px;">Reason</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 31 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
            <th style="min-width:260px;">Notes</th>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 32 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
          </tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 33 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
        </thead>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 34 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
        <tbody>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 35 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
          {% for r in rows %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 36 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
            <tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 37 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
              <td class="mono">{{ r.created_at if r.created_at is not none else r.ts }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 38 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
              <td><span class="pill">{{ r.action }}</span></td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 39 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
              <td class="mono">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 40 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
                {% if r.barcode %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 41 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
                  <a href="{{ url_for('chem.inventory', q=r.barcode) }}">{{ r.barcode }}</a>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 42 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
                {% else %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 43 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
                  —
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 44 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
                {% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 45 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
              </td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 46 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
              <td>{{ r.material_name or "—" }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 47 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
              <td class="mono">{{ r.room_no or "—" }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 48 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
              <td>{{ r.storage_location or "—" }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 49 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
              <td>{{ r.performed_by or "—" }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 50 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
              <td>{{ r.reason or "—" }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 51 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
              <td>{{ r.notes or "—" }}</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 52 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
            </tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 53 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
          {% endfor %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 54 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
          {% if not rows %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 55 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
            <tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 56 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
              <td colspan="9" class="muted" style="padding:18px;">No transactions found.</td>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 57 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
            </tr>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 58 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
          {% endif %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 59 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
        </tbody>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 60 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
      </table>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 61 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 62 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
  </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 63 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
</div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 64 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 65 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
<style>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 66 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 67 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
.page-title { margin: 10px 0 14px; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 68 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
.card { background: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,.04); }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 69 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
.search-row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 70 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
.search-row input { flex:1; min-width: 280px; padding: 10px 12px; font-size: 16px; border:1px solid #bbb; border-radius:6px; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 71 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
.btn { display:inline-block; padding: 10px 14px; border:1px solid #bbb; border-radius: 999px; background:#fff; cursor:pointer; text-decoration:none; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 72 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
.btn.primary { background:#c00; border-color:#c00; color:#fff; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 73 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
.hint, .muted { color:#666; font-size: 13px; margin-top: 8px; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 74 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
.table-wrap { overflow-x:auto; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 75 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
.nf-table { width:100%; border-collapse: collapse; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 76 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
.nf-table th, .nf-table td { border:1px solid #444; padding: 10px; vertical-align: top; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 77 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
.nf-table th { background:#f5f5f5; font-size: 18px; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 78 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 79 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
.pill { display:inline-block; padding: 4px 10px; border-radius: 999px; background:#eee; font-weight: 700; }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 80 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
</style>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 81 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
{% endblock %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/transactions.html`, line 82 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/templates/chem/transactions.html`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
