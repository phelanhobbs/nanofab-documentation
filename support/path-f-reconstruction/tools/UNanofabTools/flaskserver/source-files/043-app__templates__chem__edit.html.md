

# Source Reconstruction: UNanofabTools/app/templates/chem/edit.html

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `app/templates/chem/edit.html`
- Lines read: `581`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `9440ad081013e14e`
- Code fence language: `html`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Template Structure Summary

- Forms: 1 detected
- Inputs: 26 detected
- Scripts: 1 detected

## Sanitized Source Excerpt

```html
{% extends "chem/base.html" %}

{% block title %}Edit Chemical Container – Utah Nanofab{% endblock %}

{% block content %}
<section class="page-head">
  <h1>Edit Chemical Container</h1>
  <p class="muted">
    Scan or enter a <strong>barcode</strong> to load an existing container, then update any fields and save.
  </p>
</section>

<section class="card">
  <form method="post" action="{{ url_for('chem.edit_container') }}" autocomplete="off">
    <!-- REQUIRED HIDDEN ID -->
    <input type="hidden" id="container_id" name="container_id">

    <!-- LOOKUP -->
    <div class="grid location-grid">
      <div class="field field-span-2">
        <label for="barcode_lookup"><strong>Barcode</strong></label>
        <input id="barcode_lookup" name="barcode_lookup" type="text" placeholder="Scan or enter barcode" inputmode="text">
        <div class="hint">Use barcode to load the existing container record.</div>
      </div>

      <div class="field">
        <label>&nbsp;</label>
        <button class="btn" type="button" id="lookupBtn">Load Container</button>
      </div>

      <div class="field">
        <label for="container_code">Container Code</label>
        <input id="container_code" name="container_code_display" type="text" readonly placeholder="Will autofill">
      </div>
    </div>

    <hr class="sep">

    <!-- MATERIAL -->
    <h2 class="h2">Material</h2>
    <div class="grid location-grid">
      <div class="field field-span-2">
        <label for="item_name">Material Name</label>
        <input id="item_name" name="item_name" type="text" placeholder="Chemical name">
      </div>

      <div class="field">
        <label for="vendor_name">Vendor</label>
        <input id="vendor_name" name="vendor_name" type="text" placeholder="Vendor">
      </div>

      <div class="field">
        <label for="physical_state">Physical State</label>
        <input id="physical_state" name="physical_state" type="text" placeholder="Liquid / Solid / Gas">
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
        <label for="catalog_number">Catalog #</label>
        <input id="catalog_number" name="catalog_number" type="text" placeholder="Catalog number">
      </div>

      <div class="field field-span-2">
        <label for="description">Description</label>
        <textarea id="description" name="description" rows="3" placeholder="Optional description"></textarea>
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
        <div class="hint">Select a room template or edit room fields manually.</div>
      </div>

      <div class="field">
        <label for="room_no">Room #</label>
        <input id="room_no" name="room_no" type="text" placeholder="e.g. 2025N">
      </div>

      <div class="field">
        <label for="room_name">Room Name</label>
        <input id="room_name" name="room_name" type="text" placeholder="e.g. Bay A">
      </div>

      <div class="field field-span-2">
        <label for="room_desc">Room Description</label>
        <input id="room_desc" name="room_desc" type="text" placeholder="Optional room description">
      </div>

      <div class="field">
        <label for="area_class">Area Class</label>
        <input id="area_class" name="area_class" type="text" placeholder="e.g. H-5">
      </div>

      <div class="field field-span-2">
        <label>Selected Room</label>
        <input id="room_display" type="text" readonly placeholder="No location selected">
      </div>

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

    <hr class="sep">

    <!-- DATES / COMPLIANCE -->
    <h2 class="h2">Dates & Compliance</h2>
    <div class="grid location-grid">
      <div class="field">
        <label for="manuf_date">Manufacture Date</label>
        <input id="manuf_date" name="manuf_date" type="date">
      </div>

      <div class="field">
        <label for="expiry_date">Expiration Date</label>
        <input id="expiry_date" name="expiry_date" type="date">
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
        <label for="nmr_expiry">NMR Expiry</label>
        <input id="nmr_expiry" name="nmr_expiry" type="date">
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
      <button class="btn" type="submit">Save Changes</button>
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
select,
button {
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
    if (statusEl) statusEl.textContent = msg || "";
  }

  function fill(id, value) {
  const el = document.getElementById(id);
  if (!el) {
    console.log("MISSING ELEMENT ID:", id, "VALUE:", value);
    return;
  }
  el.value = value == null ? "" : value;
  }

  function updateRoomDisplay() {
    const roomName = document.getElementById("room_name")?.value || "";
    const roomNo = document.getElementById("room_no")?.value || "";
    const areaClass = document.getElementById("area_class")?.value || "";
    fill("room_display", [roomName, roomNo, areaClass].filter(Boolean).join(" | "));
  }

  function normalizeDate(v) {
    if (!v) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const s = String(v).slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    return "";
  }

  function detectTemplate(data) {
    const roomNo = (data.room_no || "").trim();
    const roomName = (data.room_name || "").trim();
    const areaClass = (data.area_class || "").trim();

    for (const [key, tpl] of Object.entries(LOCATION_TEMPLATES)) {
      if (
        (tpl.room_no || "") === roomNo &&
        (tpl.room_name || "") === roomName &&
        (tpl.area_class || "") === areaClass
      ) {
        return key;
      }
    }
    return "";
  }

  function applyLocationTemplate(templateKey) {
    const tpl = LOCATION_TEMPLATES[templateKey];

    if (!tpl) {
      updateRoomDisplay();
      return;
    }

    fill("room_no", tpl.room_no || "");
    fill("room_name", tpl.room_name || "");
    fill("area_class", tpl.area_class || "");
    updateRoomDisplay();

    setStatus("Location template applied.");
    setTimeout(() => setStatus(""), 1200);
  }

  async function loadContainerByBarcode() {
    const barcode = (document.getElementById("barcode_lookup")?.value || "").trim();
    if (!barcode) {
      setStatus("Enter a barcode first.");
      return;
    }

    setStatus("Loading container...");

    try {
      const res = await fetch(`/chem/api/container_lookup?barcode=${encodeURIComponent(barcode)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const payload = await res.json();
      const data = payload && payload.data ? payload.data : null;
      console.log("LOOKUP DATA:", data);
      if (!data) {
        setStatus("No container found for that barcode.");
        return;
      }

      fill("container_id", data.container_id);
      fill("container_code", data.container_code);
      fill("item_name", data.item_name);
      fill("description", data.description);
      fill("catalog_number", data.catalog_number);
      fill("physical_state", data.physical_state);
      fill("size", data.size);
      fill("unit", data.unit);
      fill("system", data.system);
      fill("vendor_name", data.vendor_name);

      fill("room_no", data.room_no);
      fill("room_name", data.room_name);
      fill("room_desc", data.room_desc);
      fill("area_class", data.area_class);

      fill("storage_location", data.storage_location);
      fill("storage_sublocation", data.storage_sublocation);
      fill("storage_device", data.storage_device);

      fill("manuf_date", normalizeDate(data.manuf_date));
      fill("expiry_date", normalizeDate(data.expiry_date));
      fill("lot_number", data.lot_number);
      fill("choice", data.choice);
      fill("nmr", data.nmr);
      fill("nmr_expiry", normalizeDate(data.nmr_expiry));
      fill("owner", data.owner);
      fill("notes", data.notes);
      fill("added_by", data.added_by);

      const detected = detectTemplate(data);
      fill("location_template", detected);
      updateRoomDisplay();

      setStatus("Container loaded.");
      setTimeout(() => setStatus(""), 1500);
    } catch (err) {
      console.error(err);
      setStatus("Load failed. Check server logs.");
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
        const res = await fetch(`/chem/api/suggest?field=${encodeURIComponent(fieldName)}&q=${encodeURIComponent(q)}&limit=12`);
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

  document.getElementById("lookupBtn")?.addEventListener("click", loadContainerByBarcode);

  document.getElementById("barcode_lookup")?.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      loadContainerByBarcode();
    }
  });

  document.getElementById("location_template")?.addEventListener("change", function () {
    applyLocationTemplate(this.value);
  });

  ["room_no", "room_name", "area_class"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", updateRoomDisplay);
  });

  attachSuggest("item_name", "name");
  attachSuggest("vendor_name", "vendor");
  attachSuggest("unit", "unit");
  attachSuggest("system", "system");
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

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.

### Line 3

```text
{% block title %}Edit Chemical Container – Utah Nanofab{% endblock %}
```

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.

### Line 5

```text
{% block content %}
```

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.

### Line 6

```text
<section class="page-head">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 7

```text
  <h1>Edit Chemical Container</h1>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 8

```text
  <p class="muted">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 9

```text
    Scan or enter a <strong>barcode</strong> to load an existing container, then update any fields and save.
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 10

```text
  </p>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 11

```text
</section>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 13

```text
<section class="card">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 14

```text
  <form method="post" action="{{ url_for('chem.edit_container') }}" autocomplete="off">
```

`html-form` — This form line defines browser input flow. Preserve action URL, method, CSRF/auth assumptions, field names, and submit behavior; edge cases include missing required fields, browser autofill, duplicate submissions, and routes that expect exact names.

### Line 16

```text
    <input type="hidden" id="container_id" name="container_id">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 19

```text
    <div class="grid location-grid">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 20

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 21

```text
        <label for="barcode_lookup"><strong>Barcode</strong></label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 22

```text
        <input id="barcode_lookup" name="barcode_lookup" type="text" placeholder="Scan or enter barcode" inputmode="text">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 23

```text
        <div class="hint">Use barcode to load the existing container record.</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 24

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 26

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 27

```text
        <label>&nbsp;</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 28

```text
        <button class="btn" type="button" id="lookupBtn">Load Container</button>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 29

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 31

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 32

```text
        <label for="container_code">Container Code</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 33

```text
        <input id="container_code" name="container_code_display" type="text" readonly placeholder="Will autofill">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 34

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 35

```text
    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 37

```text
    <hr class="sep">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 40

```text
    <h2 class="h2">Material</h2>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 41

```text
    <div class="grid location-grid">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 42

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 43

```text
        <label for="item_name">Material Name</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 44

```text
        <input id="item_name" name="item_name" type="text" placeholder="Chemical name">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 45

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 47

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 48

```text
        <label for="vendor_name">Vendor</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 49

```text
        <input id="vendor_name" name="vendor_name" type="text" placeholder="Vendor">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 50

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 52

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 53

```text
        <label for="physical_state">Physical State</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 54

```text
        <input id="physical_state" name="physical_state" type="text" placeholder="Liquid / Solid / Gas">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 55

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 57

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 58

```text
        <label for="size">Amount per Container</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 59

```text
        <input id="size" name="size" type="text" placeholder="e.g. 1">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 60

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 62

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 63

```text
        <label for="unit">Unit</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 64

```text
        <input id="unit" name="unit" type="text" placeholder="e.g. Liter / mL / g">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 65

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 67

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 68

```text
        <label for="system">System</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 69

```text
        <input id="system" name="system" type="text" placeholder="Open / Closed / etc">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 70

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 72

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 73

```text
        <label for="catalog_number">Catalog #</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 74

```text
        <input id="catalog_number" name="catalog_number" type="text" placeholder="Catalog number">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 75

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 77

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 78

```text
        <label for="description">Description</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 79

```text
        <textarea id="description" name="description" rows="3" placeholder="Optional description"></textarea>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 80

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 82

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 83

```text
        <label for="lot_number"><strong>Lot #</strong></label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 84

```text
        <input id="lot_number" name="lot_number" type="text" placeholder="Lot number">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 85

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 86

```text
    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 88

```text
    <hr class="sep">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 91

```text
    <h2 class="h2">Location</h2>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 92

```text
    <div class="grid location-grid">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 93

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 94

```text
        <label for="location_template">Location Template</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 95

```text
        <select id="location_template" name="location_template">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 96

```text
          <option value="">Select a location...</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 97

```text
          <option value="gas_chem_room">Gas Chem Room</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 98

```text
          <option value="pass_through">Pass-Through</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 99

```text
          <option value="bay_a">Bay A</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 100

```text
          <option value="bay_b">Bay B</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 101

```text
          <option value="bay_c">Bay C</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 102

```text
          <option value="bay_d">Bay D</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 103

```text
          <option value="bay_e">Bay E</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 104

```text
          <option value="bay_f">Bay F</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 105

```text
          <option value="bay_g">Bay G</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 106

```text
          <option value="student_yellow">Student Yellow</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 107

```text
          <option value="mocvd">MOCVD</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 108

```text
          <option value="microfluidics">Microfluidics</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 109

```text
          <option value="metrology">Metrology</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 110

```text
          <option value="backend_lab">Backend Lab</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 111

```text
          <option value="prototyping_lab">Prototyping Lab</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 112

```text
          <option value="cr_shop">CR Shop</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 113

```text
        </select>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 114

```text
        <div class="hint">Select a room template or edit room fields manually.</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 115

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 117

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 118

```text
        <label for="room_no">Room #</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 119

```text
        <input id="room_no" name="room_no" type="text" placeholder="e.g. 2025N">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 120

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 122

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 123

```text
        <label for="room_name">Room Name</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 124

```text
        <input id="room_name" name="room_name" type="text" placeholder="e.g. Bay A">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 125

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 127

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 128

```text
        <label for="room_desc">Room Description</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 129

```text
        <input id="room_desc" name="room_desc" type="text" placeholder="Optional room description">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 130

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 132

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 133

```text
        <label for="area_class">Area Class</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 134

```text
        <input id="area_class" name="area_class" type="text" placeholder="e.g. H-5">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 135

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 137

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 138

```text
        <label>Selected Room</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 139

```text
        <input id="room_display" type="text" readonly placeholder="No location selected">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 140

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 142

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 143

```text
        <label for="storage_location">Storage Location</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 144

```text
        <input id="storage_location" name="storage_location" type="text" placeholder="e.g. Fume Hood, SE">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 145

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 147

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 148

```text
        <label for="storage_sublocation">Sub-Storage Location</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 149

```text
        <input id="storage_sublocation" name="storage_sublocation" type="text" placeholder="e.g. Shelf 2">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 150

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 152

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 153

```text
        <label for="storage_device">Storage Device</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 154

```text
        <input id="storage_device" name="storage_device" type="text" placeholder="e.g. Cabinet / As Received">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 155

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 156

```text
    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 158

```text
    <hr class="sep">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 161

```text
    <h2 class="h2">Dates & Compliance</h2>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 162

```text
    <div class="grid location-grid">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 163

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 164

```text
        <label for="manuf_date">Manufacture Date</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 165

```text
        <input id="manuf_date" name="manuf_date" type="date">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 166

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 168

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 169

```text
        <label for="expiry_date">Expiration Date</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 170

```text
        <input id="expiry_date" name="expiry_date" type="date">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 171

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 173

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 174

```text
        <label for="choice">Choice</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 175

```text
        <input id="choice" name="choice" type="text" placeholder="">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 176

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 177

```text
    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 179

```text
    <hr class="sep">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 182

```text
    <h2 class="h2">NMR</h2>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 183

```text
    <div class="grid">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 184

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 185

```text
        <label for="nmr">NMR</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 186

```text
        <input id="nmr" name="nmr" type="text" placeholder="">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 187

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 189

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 190

```text
        <label for="nmr_expiry">NMR Expiry</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 191

```text
        <input id="nmr_expiry" name="nmr_expiry" type="date">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 192

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 193

```text
    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 195

```text
    <hr class="sep">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 198

```text
    <h2 class="h2">Ownership</h2>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 199

```text
    <div class="grid">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 200

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 201

```text
        <label for="owner">Owner</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 202

```text
        <input id="owner" name="owner" type="text" placeholder="">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 203

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 205

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 206

```text
        <label for="added_by">Added By</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 207

```text
        <input id="added_by" name="added_by" type="text" placeholder="">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 208

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 210

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 211

```text
        <label for="notes">Notes</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 212

```text
        <textarea id="notes" name="notes" rows="3" placeholder=""></textarea>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 213

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 214

```text
    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 216

```text
    <div class="actions">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 217

```text
      <button class="btn" type="submit">Save Changes</button>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 218

```text
      <a class="btn btn-secondary" href="{{ url_for('chem.inventory') }}">Cancel</a>
```

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.

### Line 219

```text
      <span id="autofillStatus" class="muted"></span>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 220

```text
    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 221

```text
  </form>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 222

```text
</section>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 224

```text
<style>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 225

```text
.page-head {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 226

```text
  max-width: 1100px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 227

```text
  margin: 20px auto 14px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 228

```text
  padding: 0 12px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 229

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 231

```text
.page-head h1 {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 232

```text
  margin: 0 0 8px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 233

```text
  font-size: 28px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 234

```text
  font-weight: 800;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 235

```text
  color: #222;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 236

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 238

```text
.muted {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 239

```text
  opacity: 0.78;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 240

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 242

```text
.card {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 243

```text
  max-width: 1100px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 244

```text
  margin: 0 auto 24px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 245

```text
  background: #fff;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 246

```text
  border-radius: 14px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 247

```text
  padding: 18px 18px 22px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 248

```text
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 249

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 251

```text
.grid {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 252

```text
  display: grid;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 253

```text
  grid-template-columns: repeat(4, minmax(0, 1fr));
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 254

```text
  gap: 16px 14px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 255

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 257

```text
.field {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 258

```text
  display: flex;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 259

```text
  flex-direction: column;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 260

```text
  gap: 7px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 261

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 263

```text
.field-span-2 {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 264

```text
  grid-column: span 2;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 265

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 267

```text
label {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 268

```text
  font-weight: 700;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 269

```text
  font-size: 15px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 270

```text
  color: #222;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 271

```text
  line-height: 1.2;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 272

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 274

```text
input,
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 275

```text
textarea,
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 276

```text
select,
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 277

```text
button {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 278

```text
  padding: 11px 12px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 279

```text
  border: 1px solid rgba(0,0,0,.16);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 280

```text
  border-radius: 10px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 281

```text
  outline: none;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 282

```text
  background: #fff;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 283

```text
  font-size: 15px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 284

```text
  min-height: 46px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 285

```text
  box-sizing: border-box;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 286

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 288

```text
textarea {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 289

```text
  min-height: 82px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 290

```text
  resize: vertical;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 291

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 293

```text
input[readonly] {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 294

```text
  background: #f5f5f5;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 295

```text
  color: #555;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 296

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 298

```text
input:focus,
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 299

```text
textarea:focus,
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 300

```text
select:focus {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 301

```text
  border-color: rgba(204,0,0,.55);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 302

```text
  box-shadow: 0 0 0 3px rgba(204,0,0,.12);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 303

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 305

```text
.sep {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 306

```text
  border: 0;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 307

```text
  border-top: 1px solid rgba(0,0,0,.10);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 308

```text
  margin: 18px 0 18px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 309

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 311

```text
.h2 {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 312

```text
  margin: 6px 0 14px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 313

```text
  font-size: 20px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 314

```text
  font-weight: 800;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 315

```text
  color: #222;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 316

```text
  line-height: 1.2;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 317

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 319

```text
.hint {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 320

```text
  font-size: 13px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 321

```text
  opacity: .75;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 322

```text
  margin-top: -1px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 323

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 325

```text
.actions {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 326

```text
  display: flex;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 327

```text
  align-items: center;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 328

```text
  gap: 10px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 329

```text
  margin-top: 22px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 330

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 332

```text
.btn {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 333

```text
  background: #c00;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 334

```text
  color: #fff;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 335

```text
  border: 0;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 336

```text
  border-radius: 10px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 337

```text
  padding: 11px 16px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 338

```text
  cursor: pointer;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 339

```text
  font-size: 15px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 340

```text
  font-weight: 700;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 341

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 343

```text
.btn:hover {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 344

```text
  filter: brightness(.96);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 345

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 347

```text
.btn-secondary {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 348

```text
  background: #444;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 349

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 351

```text
.location-grid {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 352

```text
  margin-bottom: 14px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 353

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 355

```text
@media (max-width: 900px) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 356

```text
  .grid {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 357

```text
    grid-template-columns: repeat(2, minmax(0, 1fr));
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 358

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 360

```text
  .field-span-2 {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 361

```text
    grid-column: span 2;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 362

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 363

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 364

```text
</style>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 365

```text
{% endblock %}
```

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.

### Line 367

```text
{% block scripts %}
```

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.

### Line 368

```text
<script>
```

`asset-link` — This asset linkage pulls in JavaScript, CSS, or browser behavior. Preserve relative paths, load order, cache expectations, and fallback behavior; edge cases include missing static files, stale browser cache, and scripts running before elements exist.

### Line 369

```text
(function () {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 370

```text
  const statusEl = document.getElementById("autofillStatus");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 372

```text
  const LOCATION_TEMPLATES = {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 373

```text
    bay_a: { room_no: "2025N", room_name: "Bay A", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 374

```text
    bay_b: { room_no: "2022N", room_name: "Bay B", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 375

```text
    bay_c: { room_no: "2020N", room_name: "Bay C", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 376

```text
    bay_d: { room_no: "2018N", room_name: "Bay D", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 377

```text
    bay_e: { room_no: "2016N", room_name: "Bay E", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 378

```text
    bay_f: { room_no: "2014N", room_name: "Bay F", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 379

```text
    bay_g: { room_no: "2012N", room_name: "Bay G", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 381

```text
    student_yellow: { room_no: "2010N", room_name: "Student Yellow", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 382

```text
    mocvd: { room_no: "2006N", room_name: "MOCVD", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 383

```text
    microfluidics: { room_no: "2008N", room_name: "Microfluidics", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 384

```text
    metrology: { room_no: "2026N", room_name: "Metrology", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 386

```text
    backend_lab: { room_no: "2223", room_name: "Backend Lab", area_class: "General" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 387

```text
    prototyping_lab: { room_no: "2237", room_name: "Prototyping Lab", area_class: "General" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 388

```text
    cr_shop: { room_no: "2237N", room_name: "CR Shop", area_class: "General" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 390

```text
    gas_chem_room: { room_no: "2018N", room_name: "Gas Chem Room", area_class: "H-2,3,4" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 391

```text
    pass_through: { room_no: "2018N", room_name: "Pass-Through", area_class: "H-5" }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 392

```text
  };
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 394

```text
  function setStatus(msg) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 395

```text
    if (statusEl) statusEl.textContent = msg || "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 396

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 398

```text
  function fill(id, value) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 399

```text
  const el = document.getElementById(id);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 400

```text
  if (!el) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 401

```text
    console.log("MISSING ELEMENT ID:", id, "VALUE:", value);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 402

```text
    return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 403

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 404

```text
  el.value = value == null ? "" : value;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 405

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 407

```text
  function updateRoomDisplay() {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 408

```text
    const roomName = document.getElementById("room_name")?.value || "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 409

```text
    const roomNo = document.getElementById("room_no")?.value || "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 410

```text
    const areaClass = document.getElementById("area_class")?.value || "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 411

```text
    fill("room_display", [roomName, roomNo, areaClass].filter(Boolean).join(" | "));
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 412

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 414

```text
  function normalizeDate(v) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 415

```text
    if (!v) return "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 416

```text
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 417

```text
    const s = String(v).slice(0, 10);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 418

```text
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 419

```text
    return "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 420

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 422

```text
  function detectTemplate(data) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 423

```text
    const roomNo = (data.room_no || "").trim();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 424

```text
    const roomName = (data.room_name || "").trim();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 425

```text
    const areaClass = (data.area_class || "").trim();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 427

```text
    for (const [key, tpl] of Object.entries(LOCATION_TEMPLATES)) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 428

```text
      if (
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 429

```text
        (tpl.room_no || "") === roomNo &&
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 430

```text
        (tpl.room_name || "") === roomName &&
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 431

```text
        (tpl.area_class || "") === areaClass
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 432

```text
      ) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 433

```text
        return key;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 434

```text
      }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 435

```text
    }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 436

```text
    return "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 437

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 439

```text
  function applyLocationTemplate(templateKey) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 440

```text
    const tpl = LOCATION_TEMPLATES[templateKey];
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 442

```text
    if (!tpl) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 443

```text
      updateRoomDisplay();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 444

```text
      return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 445

```text
    }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 447

```text
    fill("room_no", tpl.room_no || "");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 448

```text
    fill("room_name", tpl.room_name || "");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 449

```text
    fill("area_class", tpl.area_class || "");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 450

```text
    updateRoomDisplay();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 452

```text
    setStatus("Location template applied.");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 453

```text
    setTimeout(() => setStatus(""), 1200);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 454

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 456

```text
  async function loadContainerByBarcode() {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 457

```text
    const barcode = (document.getElementById("barcode_lookup")?.value || "").trim();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 458

```text
    if (!barcode) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 459

```text
      setStatus("Enter a barcode first.");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 460

```text
      return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 461

```text
    }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 463

```text
    setStatus("Loading container...");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 465

```text
    try {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 466

```text
      const res = await fetch(`/chem/api/container_lookup?barcode=${encodeURIComponent(barcode)}`);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 467

```text
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 469

```text
      const payload = await res.json();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 470

```text
      const data = payload && payload.data ? payload.data : null;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 471

```text
      console.log("LOOKUP DATA:", data);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 472

```text
      if (!data) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 473

```text
        setStatus("No container found for that barcode.");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 474

```text
        return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 475

```text
      }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 477

```text
      fill("container_id", data.container_id);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 478

```text
      fill("container_code", data.container_code);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 479

```text
      fill("item_name", data.item_name);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 480

```text
      fill("description", data.description);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 481

```text
      fill("catalog_number", data.catalog_number);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 482

```text
      fill("physical_state", data.physical_state);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 483

```text
      fill("size", data.size);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 484

```text
      fill("unit", data.unit);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 485

```text
      fill("system", data.system);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 486

```text
      fill("vendor_name", data.vendor_name);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 488

```text
      fill("room_no", data.room_no);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 489

```text
      fill("room_name", data.room_name);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 490

```text
      fill("room_desc", data.room_desc);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 491

```text
      fill("area_class", data.area_class);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 493

```text
      fill("storage_location", data.storage_location);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 494

```text
      fill("storage_sublocation", data.storage_sublocation);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 495

```text
      fill("storage_device", data.storage_device);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 497

```text
      fill("manuf_date", normalizeDate(data.manuf_date));
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 498

```text
      fill("expiry_date", normalizeDate(data.expiry_date));
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 499

```text
      fill("lot_number", data.lot_number);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 500

```text
      fill("choice", data.choice);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 501

```text
      fill("nmr", data.nmr);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 502

```text
      fill("nmr_expiry", normalizeDate(data.nmr_expiry));
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 503

```text
      fill("owner", data.owner);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 504

```text
      fill("notes", data.notes);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 505

```text
      fill("added_by", data.added_by);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 507

```text
      const detected = detectTemplate(data);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 508

```text
      fill("location_template", detected);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 509

```text
      updateRoomDisplay();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 511

```text
      setStatus("Container loaded.");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 512

```text
      setTimeout(() => setStatus(""), 1500);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 513

```text
    } catch (err) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 514

```text
      console.error(err);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 515

```text
      setStatus("Load failed. Check server logs.");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 516

```text
    }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 517

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 519

```text
  function attachSuggest(inputId, fieldName) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 520

```text
    const el = document.getElementById(inputId);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 521

```text
    if (!el) return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 523

```text
    const listId = `${inputId}_list`;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 524

```text
    let dl = document.getElementById(listId);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 526

```text
    if (!dl) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 527

```text
      dl = document.createElement("datalist");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 528

```text
      dl.id = listId;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 529

```text
      document.body.appendChild(dl);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 530

```text
      el.setAttribute("list", listId);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 531

```text
    }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 533

```text
    let lastQ = "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 534

```text
    el.addEventListener("input", async () => {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 535

```text
      const q = (el.value || "").trim();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 536

```text
      if (q.length < 2 || q === lastQ) return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 537

```text
      lastQ = q;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 539

```text
      try {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 540

```text
        const res = await fetch(`/chem/api/suggest?field=${encodeURIComponent(fieldName)}&q=${encodeURIComponent(q)}&limit=12`);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 541

```text
        if (!res.ok) return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 542

```text
        const payload = await res.json();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 543

```text
        const results = payload && payload.results ? payload.results : [];
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 544

```text
        dl.innerHTML = "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 545

```text
        results.forEach((v) => {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 546

```text
          const opt = document.createElement("option");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 547

```text
          opt.value = v;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 548

```text
          dl.appendChild(opt);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 549

```text
        });
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 550

```text
      } catch (e) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 551

```text
      }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 552

```text
    });
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 553

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 555

```text
  document.getElementById("lookupBtn")?.addEventListener("click", loadContainerByBarcode);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 557

```text
  document.getElementById("barcode_lookup")?.addEventListener("keydown", (ev) => {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 558

```text
    if (ev.key === "Enter") {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 559

```text
      ev.preventDefault();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 560

```text
      loadContainerByBarcode();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 561

```text
    }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 562

```text
  });
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 564

```text
  document.getElementById("location_template")?.addEventListener("change", function () {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 565

```text
    applyLocationTemplate(this.value);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 566

```text
  });
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 568

```text
  ["room_no", "room_name", "area_class"].forEach((id) => {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 569

```text
    document.getElementById(id)?.addEventListener("input", updateRoomDisplay);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 570

```text
  });
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 572

```text
  attachSuggest("item_name", "name");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 573

```text
  attachSuggest("vendor_name", "vendor");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 574

```text
  attachSuggest("unit", "unit");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 575

```text
  attachSuggest("system", "system");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 576

```text
  attachSuggest("storage_device", "storage_device");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 577

```text
  attachSuggest("storage_location", "storage_location");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 578

```text
  attachSuggest("storage_sublocation", "storage_sublocation");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 579

```text
})();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 580

```text
</script>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 581

```text
{% endblock %}
```

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/templates/chem/edit.html`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
