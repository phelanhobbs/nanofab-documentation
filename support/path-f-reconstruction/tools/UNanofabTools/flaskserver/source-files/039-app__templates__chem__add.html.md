

# Source Reconstruction: UNanofabTools/app/templates/chem/add.html

- Repository: `UNanofabTools`
- Relative path: `app/templates/chem/add.html`
- Lines read: `524`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `433897d6cd130f0e`
- Code fence language: `html`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Template Structure Summary

- Forms: 1 detected
- Inputs: 23 detected
- Scripts: 1 detected

## Sanitized Source Excerpt

```html
{% extends "chem/base.html" %}

{% block title %}Add Chemical – Utah Nanofab{% endblock %}

{% block content %}
<section class="page-head">
  <h1>Add Chemical Containers</h1>
  <p class="muted">
    Start with <strong>Catalog #</strong> (recommended). If it exists in the inventory, fields will autofill.
    Lot # is always manual per container (Unless entering multiple containers with the same lot#).
  </p>
</section>

<section class="card">
  <form method="post" action="{{ url_for('chem.add') }}" autocomplete="off">
    <!-- CATALOG FIRST -->
    <div class="grid location-grid">
      <div class="field field-span-2">
        <label for="catalog"><strong>Catalog #</strong></label>
        <input id="catalog" name="catalog" type="text" placeholder="e.g. 328634" inputmode="text">
        <div class="hint">Enter a known catalog # to autofill Vendor/Name/Unit/Location/etc.</div>
      </div>

      <div class="field">
        <label for="qty"># of Containers</label>
        <input id="qty" name="qty" type="number" min="1" max="500" value="1">
      </div>
    </div>

    <hr class="sep">

    <!-- MATERIAL -->
    <h2 class="h2">Material</h2>
    <div class="grid location-grid">
      <div class="field field-span-2">
        <label for="name">Material Name</label>
        <input id="name" name="name" type="text" placeholder="Chemical name">
      </div>

      <div class="field">
        <label for="vendor">Vendor</label>
        <input id="vendor" name="vendor" type="text" placeholder="Vendor">
      </div>

      <div class="field">
        <label for="state">Physical State</label>
        <input id="state" name="state" type="text" placeholder="Liquid / Solid / Gas">
      </div>

      <div class="field">
        <label for="size">Amount per Container</label>
        <input id="size" name="size" type="text" placeholder="e.g. 1">
      </div>

      <div class="field">
        <label for="unit">Unit</label>
        <input id="unit" name="unit" type="text" placeholder="e.g. Liter / mL / g">
      </div>

      <div class="field">
        <label for="system">System</label>
        <input id="system" name="system" type="text" placeholder="Open / Closed / etc">
      </div>

      <div class="field field-span-2">
        <label for="lot_number"><strong>Lot #</strong></label>
        <input id="lot_number" name="lot_number" type="text" placeholder="Lot number">
      </div>
    </div>

    <hr class="sep">

<!-- LOCATION -->
<h2 class="h2">Location</h2>
<div class="grid location-grid">

  <!-- TEMPLATE DROPDOWN -->
  <div class="field field-span-2">
    <label for="location_template">Location Template</label>
    <select id="location_template" name="location_template">
      <option value="">Select a location...</option>
        <option value="gas_chem_room">Gas Chem Room</option>
        <option value="pass_through">Pass-Through</option>
      <option value="bay_a">Bay A</option>
      <option value="bay_b">Bay B</option>
      <option value="bay_c">Bay C</option>
      <option value="bay_d">Bay D</option>
      <option value="bay_e">Bay E</option>
      <option value="bay_f">Bay F</option>
      <option value="bay_g">Bay G</option>

      <option value="student_yellow">Student Yellow</option>
      <option value="mocvd">MOCVD</option>
      <option value="microfluidics">Microfluidics</option>
      <option value="metrology">Metrology</option>

      <option value="backend_lab">Backend Lab</option>
      <option value="prototyping_lab">Prototyping Lab</option>
      <option value="cr_shop">CR Shop</option>
    </select>
    <div class="hint">Select a room. Storage fields remain editable.</div>
  </div>

  <!-- HIDDEN FIELDS (IMPORTANT) -->
  <input type="hidden" id="room_no" name="room_no">
  <input type="hidden" id="room_name" name="room_name">
  <input type="hidden" id="area_class" name="area_class">

  <!-- OPTIONAL DISPLAY (nice UX) -->
  <div class="field field-span-2">
    <label>Selected Room</label>
    <input id="room_display" type="text" readonly placeholder="No location selected">
  </div>

  <!-- USER-EDITABLE FIELDS -->
  <div class="field field-span-2">
    <label for="storage_location">Storage Location</label>
    <input id="storage_location" name="storage_location" type="text" placeholder="e.g. Fume Hood, SE">
  </div>

  <div class="field">
    <label for="storage_sublocation">Sub-Storage Location</label>
    <input id="storage_sublocation" name="storage_sublocation" type="text" placeholder="e.g. Shelf 2">
  </div>

  <div class="field">
    <label for="storage_device">Storage Device</label>
    <input id="storage_device" name="storage_device" type="text" placeholder="e.g. Cabinet / As Received">
  </div>
</div>
    <!-- DATES / COMPLIANCE -->
    <h2 class="h2">Dates & Compliance</h2>
    <div class="grid location-grid">
      <div class="field">
        <label for="manuf_date">Manufacture Date</label>
        <input id="manuf_date" name="manuf_date" type="date">
      </div>

      <div class="field">
        <label for="expire">Expiration Date</label>
        <input id="expire" name="expire" type="date">
      </div>

      <div class="field">
        <label for="choice">Choice</label>
        <input id="choice" name="choice" type="text" placeholder="">
      </div>
    </div>

    <hr class="sep">

    <!-- NMR -->
    <h2 class="h2">NMR</h2>
    <div class="grid">
      <div class="field">
        <label for="nmr">NMR</label>
        <input id="nmr" name="nmr" type="text" placeholder="">
      </div>

      <div class="field">
        <label for="nmr_exp">NMR Expiry</label>
        <input id="nmr_exp" name="nmr_exp" type="date">
      </div>
    </div>

    <hr class="sep">

    <!-- OWNERSHIP / NOTES -->
    <h2 class="h2">Ownership</h2>
    <div class="grid">
      <div class="field">
        <label for="owner">Owner</label>
        <input id="owner" name="owner" type="text" placeholder="">
      </div>

      <div class="field">
        <label for="added_by">Added By</label>
        <input id="added_by" name="added_by" type="text" placeholder="">
      </div>

      <div class="field field-span-2">
        <label for="notes">Notes</label>
        <textarea id="notes" name="notes" rows="3" placeholder=""></textarea>
      </div>
    </div>

    <div class="actions">
      <button class="btn" type="submit">Add Container(s)</button>
      <a class="btn btn-secondary" href="{{ url_for('chem.inventory') }}">Cancel</a>
      <span id="autofillStatus" class="muted"></span>
    </div>
  </form>
</section>

<style>
.page-head {
  max-width: 1100px;
  margin: 20px auto 14px;
  padding: 0 12px;
}

.page-head h1 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 800;
  color: #222;
}

.muted {
  opacity: 0.78;
}

.card {
  max-width: 1100px;
  margin: 0 auto 24px;
  background: #fff;
  border-radius: 14px;
  padding: 18px 18px 22px;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-span-2 {
  grid-column: span 2;
}

label {
  font-weight: 700;
  font-size: 15px;
  color: #222;
  line-height: 1.2;
}

input,
textarea,
select {
  padding: 11px 12px;
  border: 1px solid rgba(0,0,0,.16);
  border-radius: 10px;
  outline: none;
  background: #fff;
  font-size: 15px;
  min-height: 46px;
  box-sizing: border-box;
}

textarea {
  min-height: 82px;
  resize: vertical;
}

input[readonly] {
  background: #f5f5f5;
  color: #555;
}

input:focus,
textarea:focus,
select:focus {
  border-color: rgba(204,0,0,.55);
  box-shadow: 0 0 0 3px rgba(204,0,0,.12);
}

.sep {
  border: 0;
  border-top: 1px solid rgba(0,0,0,.10);
  margin: 18px 0 18px;
}

.h2 {
  margin: 6px 0 14px;
  font-size: 20px;
  font-weight: 800;
  color: #222;
  line-height: 1.2;
}

.hint {
  font-size: 13px;
  opacity: .75;
  margin-top: -1px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
}

.btn {
  background: #c00;
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 11px 16px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
}

.btn:hover {
  filter: brightness(.96);
}

.btn-secondary {
  background: #444;
}

/* Stronger separation between stacked sections */
.section-block {
  margin-bottom: 10px;
}

.section-block:last-of-type {
  margin-bottom: 0;
}

/* Give extra breathing room specifically after Location rows */
.location-grid {
  margin-bottom: 14px;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .field-span-2 {
    grid-column: span 2;
  }
}
</style>
{% endblock %}
{% block scripts %}
<script>
(function () {
  const statusEl = document.getElementById("autofillStatus");

  const CATALOG_AUTOFILL_FIELDS = ["name", "vendor", "state", "size", "unit", "system"];

  const LOCATION_TEMPLATES = {
    bay_a: { room_no: "2025N", room_name: "Bay A", area_class: "H-5" },
    bay_b: { room_no: "2022N", room_name: "Bay B", area_class: "H-5" },
    bay_c: { room_no: "2020N", room_name: "Bay C", area_class: "H-5" },
    bay_d: { room_no: "2018N", room_name: "Bay D", area_class: "H-5" },
    bay_e: { room_no: "2016N", room_name: "Bay E", area_class: "H-5" },
    bay_f: { room_no: "2014N", room_name: "Bay F", area_class: "H-5" },
    bay_g: { room_no: "2012N", room_name: "Bay G", area_class: "H-5" },

    student_yellow: { room_no: "2010N", room_name: "Student Yellow", area_class: "H-5" },
    mocvd: { room_no: "2006N", room_name: "MOCVD", area_class: "H-5" },
    microfluidics: { room_no: "2008N", room_name: "Microfluidics", area_class: "H-5" },
    metrology: { room_no: "2026N", room_name: "Metrology", area_class: "H-5" },

    backend_lab: { room_no: "2223", room_name: "Backend Lab", area_class: "General" },
    prototyping_lab: { room_no: "2237", room_name: "Prototyping Lab", area_class: "General" },
    cr_shop: { room_no: "2237N", room_name: "CR Shop", area_class: "General" },

    gas_chem_room: { room_no: "2018N", room_name: "Gas Chem Room", area_class: "H-2,3,4" },
    pass_through: { room_no: "2018N", room_name: "Pass-Through", area_class: "H-5" }
  };

  function setStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
  }

  function setIfEmpty(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    const current = (el.value || "").trim();
    const incoming = (value == null ? "" : String(value)).trim();
    if (!incoming) return;

    if (!current) {
      el.value = incoming;
    }
  }

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = value == null ? "" : value;
  }

  function applyLocationTemplate(templateKey) {
    const tpl = LOCATION_TEMPLATES[templateKey];

    if (!tpl) {
      setValue("room_no", "");
      setValue("room_name", "");
      setValue("area_class", "");
      setValue("room_display", "");
      return;
    }

    setValue("room_no", tpl.room_no || "");
    setValue("room_name", tpl.room_name || "");
    setValue("area_class", tpl.area_class || "");
    setValue("room_display", `${tpl.room_name || ""} (${tpl.room_no || ""}, ${tpl.area_class || ""})`);

    setStatus("Location template applied.");
    setTimeout(() => setStatus(""), 1500);
  }

  async function autofillByCatalog(catalog) {
    const cat = (catalog || "").trim();
    if (!cat) return;

    setStatus("Autofilling…");

    try {
      const res = await fetch(`/chem/api/autofill?catalog=${encodeURIComponent(cat)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const payload = await res.json();
      const data = payload && payload.data ? payload.data : {};

      if (!data || Object.keys(data).length === 0) {
        setStatus("No match found for that Catalog # (that’s OK — enter manually).");
        return;
      }

      if (data.catalog) {
        setIfEmpty("catalog", data.catalog);
      }

      CATALOG_AUTOFILL_FIELDS.forEach((k) => {
        if (k in data) setIfEmpty(k, data[k]);
      });

      setStatus("Autofill complete.");
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      console.error(e);
      setStatus("Autofill failed (check server logs).");
    }
  }

  const catalogEl = document.getElementById("catalog");
  if (catalogEl) {
    catalogEl.addEventListener("change", () => autofillByCatalog(catalogEl.value));
    catalogEl.addEventListener("blur", () => autofillByCatalog(catalogEl.value));
    catalogEl.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        autofillByCatalog(catalogEl.value);
      }
    });
  }

  const templateEl = document.getElementById("location_template");
  if (templateEl) {
    templateEl.addEventListener("change", function () {
      applyLocationTemplate(this.value);
    });

    if (templateEl.value) {
      applyLocationTemplate(templateEl.value);
    }
  }

  function attachSuggest(inputId, fieldName) {
    const el = document.getElementById(inputId);
    if (!el) return;

    const listId = `${inputId}_list`;
    let dl = document.getElementById(listId);

    if (!dl) {
      dl = document.createElement("datalist");
      dl.id = listId;
      document.body.appendChild(dl);
      el.setAttribute("list", listId);
    }

    let lastQ = "";
    el.addEventListener("input", async () => {
      const q = (el.value || "").trim();
      if (q.length < 2 || q === lastQ) return;
      lastQ = q;

      try {
        const res = await fetch(
          `/chem/api/suggest?field=${encodeURIComponent(fieldName)}&q=${encodeURIComponent(q)}&limit=12`
        );
        if (!res.ok) return;

        const payload = await res.json();
        const results = payload && payload.results ? payload.results : [];

        dl.innerHTML = "";
        results.forEach((v) => {
          const opt = document.createElement("option");
          opt.value = v;
          dl.appendChild(opt);
        });
      } catch (e) {
      }
    });
  }

  attachSuggest("name", "name");
  attachSuggest("vendor", "vendor");
  attachSuggest("unit", "unit");
  attachSuggest("storage_device", "storage_device");
  attachSuggest("storage_location", "storage_location");
  attachSuggest("storage_sublocation", "storage_sublocation");
})();
</script>
{% endblock %}
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
{% extends "chem/base.html" %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 1 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `none` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 2 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
{% block title %}Add Chemical – Utah Nanofab{% endblock %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 3 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 4 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `template` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
{% block content %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 5 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
<section class="page-head">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 6 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
  <h1>Add Chemical Containers</h1>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 7 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
  <p class="muted">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 8 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
    Start with <strong>Catalog #</strong> (recommended). If it exists in the inventory, fields will autofill.
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 9 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
    Lot # is always manual per container (Unless entering multiple containers with the same lot#).
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 10 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
  </p>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 11 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
</section>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 12 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 13 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
<section class="card">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 14 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html-form`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
  <form method="post" action="{{ url_for('chem.add') }}" autocomplete="off">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 15 is classified as `html-form`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This form line defines browser input flow. Preserve action URL, method, CSRF/auth assumptions, field names, and submit behavior; edge cases include missing required fields, browser autofill, duplicate submissions, and routes that expect exact names. Neighbor context: previous kind is `html` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
    <!-- CATALOG FIRST -->
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 16 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `html-form` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
    <div class="grid location-grid">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 17 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `comment` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
      <div class="field field-span-2">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 18 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
        <label for="catalog"><strong>Catalog #</strong></label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 19 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
        <input id="catalog" name="catalog" type="text" placeholder="e.g. 328634" inputmode="text">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 20 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
        <div class="hint">Enter a known catalog # to autofill Vendor/Name/Unit/Location/etc.</div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 21 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 22 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 23 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 24 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
        <label for="qty"># of Containers</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 25 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
        <input id="qty" name="qty" type="number" min="1" max="500" value="1">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 26 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 27 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 28 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 29 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
    <hr class="sep">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 30 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 31 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
    <!-- MATERIAL -->
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 32 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
    <h2 class="h2">Material</h2>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 33 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `comment` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
    <div class="grid location-grid">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 34 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
      <div class="field field-span-2">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 35 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
        <label for="name">Material Name</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 36 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
        <input id="name" name="name" type="text" placeholder="Chemical name">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 37 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 38 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 39 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 40 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
        <label for="vendor">Vendor</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 41 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
        <input id="vendor" name="vendor" type="text" placeholder="Vendor">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 42 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 43 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 44 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 45 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
        <label for="state">Physical State</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 46 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
        <input id="state" name="state" type="text" placeholder="Liquid / Solid / Gas">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 47 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 48 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 49 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 50 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
        <label for="size">Amount per Container</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 51 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
        <input id="size" name="size" type="text" placeholder="e.g. 1">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 52 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 53 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 54 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 55 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
        <label for="unit">Unit</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 56 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
        <input id="unit" name="unit" type="text" placeholder="e.g. Liter / mL / g">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 57 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 58 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 59 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 60 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
        <label for="system">System</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 61 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
        <input id="system" name="system" type="text" placeholder="Open / Closed / etc">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 62 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 63 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 64 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
      <div class="field field-span-2">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 65 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
        <label for="lot_number"><strong>Lot #</strong></label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 66 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
        <input id="lot_number" name="lot_number" type="text" placeholder="Lot number">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 67 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 68 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 69 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 70 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
    <hr class="sep">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 71 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 72 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
<!-- LOCATION -->
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 73 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
<h2 class="h2">Location</h2>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 74 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `comment` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
<div class="grid location-grid">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 75 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 76 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
  <!-- TEMPLATE DROPDOWN -->
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 77 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
  <div class="field field-span-2">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 78 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `comment` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
    <label for="location_template">Location Template</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 79 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
    <select id="location_template" name="location_template">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 80 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
      <option value="">Select a location...</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 81 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
        <option value="gas_chem_room">Gas Chem Room</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 82 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
        <option value="pass_through">Pass-Through</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 83 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
      <option value="bay_a">Bay A</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 84 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
      <option value="bay_b">Bay B</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 85 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
      <option value="bay_c">Bay C</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 86 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
      <option value="bay_d">Bay D</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 87 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
      <option value="bay_e">Bay E</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 88 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
      <option value="bay_f">Bay F</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 89 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
      <option value="bay_g">Bay G</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 90 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 91 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
      <option value="student_yellow">Student Yellow</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 92 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
      <option value="mocvd">MOCVD</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 93 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
      <option value="microfluidics">Microfluidics</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 94 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
      <option value="metrology">Metrology</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 95 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 96 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
      <option value="backend_lab">Backend Lab</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 97 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
      <option value="prototyping_lab">Prototyping Lab</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 98 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
      <option value="cr_shop">CR Shop</option>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 99 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
    </select>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 100 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
    <div class="hint">Select a room. Storage fields remain editable.</div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 101 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
  </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 102 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 103 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
  <!-- HIDDEN FIELDS (IMPORTANT) -->
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 104 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
  <input type="hidden" id="room_no" name="room_no">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 105 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `comment` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
  <input type="hidden" id="room_name" name="room_name">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 106 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-control` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
  <input type="hidden" id="area_class" name="area_class">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 107 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 108 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html-control` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
  <!-- OPTIONAL DISPLAY (nice UX) -->
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 109 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
  <div class="field field-span-2">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 110 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `comment` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
    <label>Selected Room</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 111 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
    <input id="room_display" type="text" readonly placeholder="No location selected">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 112 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
  </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 113 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 114 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
  <!-- USER-EDITABLE FIELDS -->
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 115 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
  <div class="field field-span-2">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 116 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `comment` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
    <label for="storage_location">Storage Location</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 117 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
    <input id="storage_location" name="storage_location" type="text" placeholder="e.g. Fume Hood, SE">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 118 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 119

```text
  </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 119 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 120

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 120 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 121

```text
  <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 121 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 122

```text
    <label for="storage_sublocation">Sub-Storage Location</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 122 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 123

```text
    <input id="storage_sublocation" name="storage_sublocation" type="text" placeholder="e.g. Shelf 2">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 123 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 124

```text
  </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 124 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 125

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 125 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 126

```text
  <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 126 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 127

```text
    <label for="storage_device">Storage Device</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 127 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 128

```text
    <input id="storage_device" name="storage_device" type="text" placeholder="e.g. Cabinet / As Received">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 128 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 129

```text
  </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 129 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 130

```text
</div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 130 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 131

```text
    <!-- DATES / COMPLIANCE -->
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 131 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 132

```text
    <h2 class="h2">Dates & Compliance</h2>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 132 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `comment` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 133

```text
    <div class="grid location-grid">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 133 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 134

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 134 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 135

```text
        <label for="manuf_date">Manufacture Date</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 135 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 136

```text
        <input id="manuf_date" name="manuf_date" type="date">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 136 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 137

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 137 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 138

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 138 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 139

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 139 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 140

```text
        <label for="expire">Expiration Date</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 140 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 141

```text
        <input id="expire" name="expire" type="date">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 141 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 142

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 142 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 143

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 143 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 144

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 144 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 145

```text
        <label for="choice">Choice</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 145 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 146

```text
        <input id="choice" name="choice" type="text" placeholder="">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 146 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 147

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 147 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 148

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 148 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 149

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 149 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 150

```text
    <hr class="sep">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 150 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 151

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 151 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 152

```text
    <!-- NMR -->
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 152 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 153

```text
    <h2 class="h2">NMR</h2>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 153 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `comment` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 154

```text
    <div class="grid">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 154 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 155

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 155 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 156

```text
        <label for="nmr">NMR</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 156 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 157

```text
        <input id="nmr" name="nmr" type="text" placeholder="">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 157 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 158

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 158 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 159

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 159 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 160

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 160 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 161

```text
        <label for="nmr_exp">NMR Expiry</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 161 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 162

```text
        <input id="nmr_exp" name="nmr_exp" type="date">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 162 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 163

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 163 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 164

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 164 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 165

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 165 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 166

```text
    <hr class="sep">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 166 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 167

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 167 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 168

```text
    <!-- OWNERSHIP / NOTES -->
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 168 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 169

```text
    <h2 class="h2">Ownership</h2>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 169 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `comment` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 170

```text
    <div class="grid">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 170 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 171

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 171 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 172

```text
        <label for="owner">Owner</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 172 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 173

```text
        <input id="owner" name="owner" type="text" placeholder="">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 173 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 174

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 174 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 175

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 175 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 176

```text
      <div class="field">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 176 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 177

```text
        <label for="added_by">Added By</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 177 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 178

```text
        <input id="added_by" name="added_by" type="text" placeholder="">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 178 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 179

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 179 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html-control` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 180

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 180 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 181

```text
      <div class="field field-span-2">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 181 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 182

```text
        <label for="notes">Notes</label>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 182 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 183

```text
        <textarea id="notes" name="notes" rows="3" placeholder=""></textarea>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 183 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 184

```text
      </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 184 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 185

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 185 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 186

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 186 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 187

```text
    <div class="actions">
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 187 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html-control`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 188

```text
      <button class="btn" type="submit">Add Container(s)</button>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 188 is classified as `html-control`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 189

```text
      <a class="btn btn-secondary" href="{{ url_for('chem.inventory') }}">Cancel</a>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 189 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html-control` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 190

```text
      <span id="autofillStatus" class="muted"></span>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 190 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 191

```text
    </div>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 191 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 192

```text
  </form>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 192 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 193

```text
</section>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 193 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 194

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 194 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 195

```text
<style>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 195 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 196

```text
.page-head {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 196 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 197

```text
  max-width: 1100px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 197 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 198

```text
  margin: 20px auto 14px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 198 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 199

```text
  padding: 0 12px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 199 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 200

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 200 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 201

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 201 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 202

```text
.page-head h1 {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 202 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 203

```text
  margin: 0 0 8px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 203 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 204

```text
  font-size: 28px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 204 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 205

```text
  font-weight: 800;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 205 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 206

```text
  color: #222;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 206 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 207

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 207 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 208

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 208 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 209

```text
.muted {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 209 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 210

```text
  opacity: 0.78;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 210 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 211

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 211 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 212

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 212 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 213

```text
.card {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 213 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 214

```text
  max-width: 1100px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 214 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 215

```text
  margin: 0 auto 24px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 215 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 216

```text
  background: #fff;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 216 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 217

```text
  border-radius: 14px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 217 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 218

```text
  padding: 18px 18px 22px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 218 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 219

```text
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 219 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 220

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 220 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 221

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 221 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 222

```text
.grid {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 222 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 223

```text
  display: grid;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 223 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 224

```text
  grid-template-columns: repeat(4, minmax(0, 1fr));
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 224 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 225

```text
  gap: 16px 14px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 225 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 226

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 226 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 227

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 227 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 228

```text
.field {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 228 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 229

```text
  display: flex;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 229 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 230

```text
  flex-direction: column;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 230 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 231

```text
  gap: 7px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 231 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 232

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 232 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 233

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 233 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 234

```text
.field-span-2 {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 234 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 235

```text
  grid-column: span 2;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 235 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 236

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 236 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 237

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 237 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 238

```text
label {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 238 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 239

```text
  font-weight: 700;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 239 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 240

```text
  font-size: 15px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 240 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 241

```text
  color: #222;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 241 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 242

```text
  line-height: 1.2;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 242 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 243

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 243 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 244

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 244 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 245

```text
input,
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 245 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 246

```text
textarea,
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 246 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 247

```text
select {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 247 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 248

```text
  padding: 11px 12px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 248 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 249

```text
  border: 1px solid rgba(0,0,0,.16);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 249 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 250

```text
  border-radius: 10px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 250 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 251

```text
  outline: none;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 251 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 252

```text
  background: #fff;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 252 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 253

```text
  font-size: 15px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 253 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 254

```text
  min-height: 46px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 254 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 255

```text
  box-sizing: border-box;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 255 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 256

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 256 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 257

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 257 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 258

```text
textarea {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 258 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 259

```text
  min-height: 82px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 259 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 260

```text
  resize: vertical;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 260 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 261

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 261 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 262

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 262 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 263

```text
input[readonly] {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 263 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 264

```text
  background: #f5f5f5;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 264 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 265

```text
  color: #555;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 265 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 266

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 266 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 267

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 267 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 268

```text
input:focus,
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 268 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 269

```text
textarea:focus,
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 269 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 270

```text
select:focus {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 270 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 271

```text
  border-color: rgba(204,0,0,.55);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 271 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 272

```text
  box-shadow: 0 0 0 3px rgba(204,0,0,.12);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 272 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 273

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 273 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 274

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 274 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 275

```text
.sep {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 275 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 276

```text
  border: 0;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 276 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 277

```text
  border-top: 1px solid rgba(0,0,0,.10);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 277 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 278

```text
  margin: 18px 0 18px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 278 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 279

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 279 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 280

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 280 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 281

```text
.h2 {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 281 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 282

```text
  margin: 6px 0 14px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 282 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 283

```text
  font-size: 20px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 283 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 284

```text
  font-weight: 800;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 284 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 285

```text
  color: #222;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 285 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 286

```text
  line-height: 1.2;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 286 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 287

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 287 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 288

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 288 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 289

```text
.hint {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 289 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 290

```text
  font-size: 13px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 290 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 291

```text
  opacity: .75;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 291 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 292

```text
  margin-top: -1px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 292 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 293

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 293 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 294

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 294 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 295

```text
.actions {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 295 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 296

```text
  display: flex;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 296 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 297

```text
  align-items: center;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 297 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 298

```text
  gap: 10px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 298 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 299

```text
  margin-top: 22px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 299 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 300

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 300 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 301

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 301 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 302

```text
.btn {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 302 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 303

```text
  background: #c00;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 303 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 304

```text
  color: #fff;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 304 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 305

```text
  border: 0;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 305 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 306

```text
  border-radius: 10px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 306 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 307

```text
  padding: 11px 16px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 307 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 308

```text
  cursor: pointer;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 308 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 309

```text
  font-size: 15px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 309 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 310

```text
  font-weight: 700;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 310 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 311

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 311 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 312

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 312 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 313

```text
.btn:hover {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 313 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 314

```text
  filter: brightness(.96);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 314 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 315

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 315 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 316

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 316 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 317

```text
.btn-secondary {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 317 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 318

```text
  background: #444;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 318 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 319

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 319 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 320

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 320 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 321

```text
/* Stronger separation between stacked sections */
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 321 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 322

```text
.section-block {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 322 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `comment` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 323

```text
  margin-bottom: 10px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 323 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 324

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 324 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 325

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 325 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 326

```text
.section-block:last-of-type {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 326 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 327

```text
  margin-bottom: 0;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 327 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 328

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 328 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 329

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 329 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 330

```text
/* Give extra breathing room specifically after Location rows */
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 330 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 331

```text
.location-grid {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 331 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `comment` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 332

```text
  margin-bottom: 14px;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 332 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 333

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 333 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 334

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 334 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 335

```text
@media (max-width: 900px) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 335 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 336

```text
  .grid {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 336 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 337

```text
    grid-template-columns: repeat(2, minmax(0, 1fr));
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 337 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 338

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 338 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 339

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 339 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 340

```text
  .field-span-2 {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 340 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 341

```text
    grid-column: span 2;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 341 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 342

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 342 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 343

```text
}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 343 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 344

```text
</style>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 344 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 345

```text
{% endblock %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 345 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 346

```text
{% block scripts %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 346 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `template` and next kind is `asset-link`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 347

```text
<script>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 347 is classified as `asset-link`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This asset linkage pulls in JavaScript, CSS, or browser behavior. Preserve relative paths, load order, cache expectations, and fallback behavior; edge cases include missing static files, stale browser cache, and scripts running before elements exist. Neighbor context: previous kind is `template` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 348

```text
(function () {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 348 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `asset-link` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 349

```text
  const statusEl = document.getElementById("autofillStatus");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 349 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 350

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 350 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 351

```text
  const CATALOG_AUTOFILL_FIELDS = ["name", "vendor", "state", "size", "unit", "system"];
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 351 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 352

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 352 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 353

```text
  const LOCATION_TEMPLATES = {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 353 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 354

```text
    bay_a: { room_no: "2025N", room_name: "Bay A", area_class: "H-5" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 354 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 355

```text
    bay_b: { room_no: "2022N", room_name: "Bay B", area_class: "H-5" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 355 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 356

```text
    bay_c: { room_no: "2020N", room_name: "Bay C", area_class: "H-5" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 356 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 357

```text
    bay_d: { room_no: "2018N", room_name: "Bay D", area_class: "H-5" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 357 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 358

```text
    bay_e: { room_no: "2016N", room_name: "Bay E", area_class: "H-5" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 358 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 359

```text
    bay_f: { room_no: "2014N", room_name: "Bay F", area_class: "H-5" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 359 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 360

```text
    bay_g: { room_no: "2012N", room_name: "Bay G", area_class: "H-5" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 360 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 361

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 361 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 362

```text
    student_yellow: { room_no: "2010N", room_name: "Student Yellow", area_class: "H-5" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 362 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 363

```text
    mocvd: { room_no: "2006N", room_name: "MOCVD", area_class: "H-5" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 363 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 364

```text
    microfluidics: { room_no: "2008N", room_name: "Microfluidics", area_class: "H-5" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 364 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 365

```text
    metrology: { room_no: "2026N", room_name: "Metrology", area_class: "H-5" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 365 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 366

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 366 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 367

```text
    backend_lab: { room_no: "2223", room_name: "Backend Lab", area_class: "General" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 367 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 368

```text
    prototyping_lab: { room_no: "2237", room_name: "Prototyping Lab", area_class: "General" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 368 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 369

```text
    cr_shop: { room_no: "2237N", room_name: "CR Shop", area_class: "General" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 369 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 370

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 370 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 371

```text
    gas_chem_room: { room_no: "2018N", room_name: "Gas Chem Room", area_class: "H-2,3,4" },
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 371 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 372

```text
    pass_through: { room_no: "2018N", room_name: "Pass-Through", area_class: "H-5" }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 372 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 373

```text
  };
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 373 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 374

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 374 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 375

```text
  function setStatus(msg) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 375 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 376

```text
    if (!statusEl) return;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 376 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 377

```text
    statusEl.textContent = msg || "";
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 377 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 378

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 378 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 379

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 379 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 380

```text
  function setIfEmpty(id, value) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 380 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 381

```text
    const el = document.getElementById(id);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 381 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 382

```text
    if (!el) return;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 382 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 383

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 383 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 384

```text
    const current = (el.value || "").trim();
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 384 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 385

```text
    const incoming = (value == null ? "" : String(value)).trim();
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 385 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 386

```text
    if (!incoming) return;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 386 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 387

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 387 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 388

```text
    if (!current) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 388 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 389

```text
      el.value = incoming;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 389 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 390

```text
    }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 390 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 391

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 391 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 392

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 392 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 393

```text
  function setValue(id, value) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 393 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 394

```text
    const el = document.getElementById(id);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 394 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 395

```text
    if (!el) return;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 395 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 396

```text
    el.value = value == null ? "" : value;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 396 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 397

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 397 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 398

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 398 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 399

```text
  function applyLocationTemplate(templateKey) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 399 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 400

```text
    const tpl = LOCATION_TEMPLATES[templateKey];
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 400 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 401

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 401 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 402

```text
    if (!tpl) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 402 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 403

```text
      setValue("room_no", "");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 403 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 404

```text
      setValue("room_name", "");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 404 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 405

```text
      setValue("area_class", "");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 405 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 406

```text
      setValue("room_display", "");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 406 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 407

```text
      return;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 407 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 408

```text
    }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 408 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 409

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 409 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 410

```text
    setValue("room_no", tpl.room_no || "");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 410 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 411

```text
    setValue("room_name", tpl.room_name || "");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 411 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 412

```text
    setValue("area_class", tpl.area_class || "");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 412 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 413

```text
    setValue("room_display", `${tpl.room_name || ""} (${tpl.room_no || ""}, ${tpl.area_class || ""})`);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 413 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 414

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 414 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 415

```text
    setStatus("Location template applied.");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 415 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 416

```text
    setTimeout(() => setStatus(""), 1500);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 416 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 417

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 417 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 418

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 418 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 419

```text
  async function autofillByCatalog(catalog) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 419 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 420

```text
    const cat = (catalog || "").trim();
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 420 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 421

```text
    if (!cat) return;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 421 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 422

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 422 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 423

```text
    setStatus("Autofilling…");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 423 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 424

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 424 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 425

```text
    try {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 425 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 426

```text
      const res = await fetch(`/chem/api/autofill?catalog=${encodeURIComponent(cat)}`);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 426 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 427

```text
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 427 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 428

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 428 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 429

```text
      const payload = await res.json();
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 429 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 430

```text
      const data = payload && payload.data ? payload.data : {};
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 430 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 431

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 431 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 432

```text
      if (!data || Object.keys(data).length === 0) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 432 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 433

```text
        setStatus("No match found for that Catalog # (that’s OK — enter manually).");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 433 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 434

```text
        return;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 434 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 435

```text
      }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 435 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 436

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 436 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 437

```text
      if (data.catalog) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 437 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 438

```text
        setIfEmpty("catalog", data.catalog);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 438 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 439

```text
      }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 439 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 440

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 440 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 441

```text
      CATALOG_AUTOFILL_FIELDS.forEach((k) => {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 441 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 442

```text
        if (k in data) setIfEmpty(k, data[k]);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 442 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 443

```text
      });
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 443 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 444

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 444 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 445

```text
      setStatus("Autofill complete.");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 445 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 446

```text
      setTimeout(() => setStatus(""), 2000);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 446 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 447

```text
    } catch (e) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 447 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 448

```text
      console.error(e);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 448 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 449

```text
      setStatus("Autofill failed (check server logs).");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 449 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 450

```text
    }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 450 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 451

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 451 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 452

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 452 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 453

```text
  const catalogEl = document.getElementById("catalog");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 453 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 454

```text
  if (catalogEl) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 454 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 455

```text
    catalogEl.addEventListener("change", () => autofillByCatalog(catalogEl.value));
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 455 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 456

```text
    catalogEl.addEventListener("blur", () => autofillByCatalog(catalogEl.value));
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 456 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 457

```text
    catalogEl.addEventListener("keydown", (ev) => {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 457 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 458

```text
      if (ev.key === "Enter") {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 458 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 459

```text
        ev.preventDefault();
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 459 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 460

```text
        autofillByCatalog(catalogEl.value);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 460 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 461

```text
      }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 461 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 462

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 462 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 463

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 463 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 464

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 464 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 465

```text
  const templateEl = document.getElementById("location_template");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 465 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 466

```text
  if (templateEl) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 466 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 467

```text
    templateEl.addEventListener("change", function () {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 467 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 468

```text
      applyLocationTemplate(this.value);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 468 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 469

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 469 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 470

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 470 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 471

```text
    if (templateEl.value) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 471 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 472

```text
      applyLocationTemplate(templateEl.value);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 472 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 473

```text
    }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 473 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 474

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 474 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 475

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 475 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 476

```text
  function attachSuggest(inputId, fieldName) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 476 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 477

```text
    const el = document.getElementById(inputId);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 477 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 478

```text
    if (!el) return;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 478 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 479

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 479 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 480

```text
    const listId = `${inputId}_list`;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 480 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 481

```text
    let dl = document.getElementById(listId);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 481 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 482

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 482 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 483

```text
    if (!dl) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 483 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 484

```text
      dl = document.createElement("datalist");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 484 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 485

```text
      dl.id = listId;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 485 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 486

```text
      document.body.appendChild(dl);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 486 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 487

```text
      el.setAttribute("list", listId);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 487 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 488

```text
    }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 488 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 489

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 489 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 490

```text
    let lastQ = "";
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 490 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 491

```text
    el.addEventListener("input", async () => {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 491 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 492

```text
      const q = (el.value || "").trim();
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 492 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 493

```text
      if (q.length < 2 || q === lastQ) return;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 493 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 494

```text
      lastQ = q;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 494 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 495

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 495 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 496

```text
      try {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 496 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 497

```text
        const res = await fetch(
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 497 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 498

```text
          `/chem/api/suggest?field=${encodeURIComponent(fieldName)}&q=${encodeURIComponent(q)}&limit=12`
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 498 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 499

```text
        );
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 499 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 500

```text
        if (!res.ok) return;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 500 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 501

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 501 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 502

```text
        const payload = await res.json();
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 502 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 503

```text
        const results = payload && payload.results ? payload.results : [];
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 503 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 504

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 504 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 505

```text
        dl.innerHTML = "";
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 505 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 506

```text
        results.forEach((v) => {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 506 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 507

```text
          const opt = document.createElement("option");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 507 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 508

```text
          opt.value = v;
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 508 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 509

```text
          dl.appendChild(opt);
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 509 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 510

```text
        });
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 510 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 511

```text
      } catch (e) {
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 511 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 512

```text
      }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 512 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 513

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 513 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 514

```text
  }
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 514 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 515

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 515 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 516

```text
  attachSuggest("name", "name");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 516 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `blank` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 517

```text
  attachSuggest("vendor", "vendor");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 517 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 518

```text
  attachSuggest("unit", "unit");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 518 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 519

```text
  attachSuggest("storage_device", "storage_device");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 519 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 520

```text
  attachSuggest("storage_location", "storage_location");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 520 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 521

```text
  attachSuggest("storage_sublocation", "storage_sublocation");
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 521 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 522

```text
})();
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 522 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `html`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 523

```text
</script>
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 523 is classified as `html`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript. Neighbor context: previous kind is `html` and next kind is `template`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 524

```text
{% endblock %}
```

Reconstruction rule: in `UNanofabTools/app/templates/chem/add.html`, line 524 is classified as `template`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping. Neighbor context: previous kind is `html` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/templates/chem/add.html`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
