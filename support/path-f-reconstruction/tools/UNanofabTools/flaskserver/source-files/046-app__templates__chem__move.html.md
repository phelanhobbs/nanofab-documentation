

# Source Reconstruction: UNanofabTools/app/templates/chem/move.html

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `app/templates/chem/move.html`
- Lines read: `559`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `96b4d60d2aefe7d5`
- Code fence language: `html`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Template Structure Summary

- Forms: 2 detected
- Inputs: 22 detected
- Scripts: 5 detected

## Sanitized Source Excerpt

```html
{% extends "chem/base.html" %}
{% block title %}Move Container{% endblock %}

{% block content %}
<div class="container">
  <h1 class="page-title">Move Container</h1>

  <div class="card">
    <div class="row">
      <div class="col">
        <label for="barcode"><strong>Barcode</strong></label>
        <input id="barcode" name="barcode" type="text" placeholder="Scan or type barcode…" autocomplete="off">
        <div class="help">Scan a barcode, then press Enter (or click Load).</div>

        <div class="btn-row">
          <button type="button" id="btnLoad" class="btn">Load Current</button>
          <button type="button" id="btnClear" class="btn btn-secondary">Clear</button>
        </div>

        <div id="lookupStatus" class="status"></div>
      </div>

      <div class="col barcode-box">
        <div class="barcode-title">Scan Target</div>
        <div id="barcodeText" class="barcode-text">(empty)</div>
        <!-- If JsBarcode is available in your project, this will render -->
        <svg id="barcodeSvg"></svg>
        <div class="help">This is just to make it obvious what’s loaded. Use Clear between scans.</div>
      </div>
    </div>
  </div>

<section class="card">
  <h2 class="h2">Bulk Move by Scanner</h2>
  <p class="muted">
    Scan barcodes directly into the box below, one per line, then choose the destination and apply the move.
  </p>

  <form method="post" action="{{ url_for('chem.move_bulk') }}" autocomplete="off">
    <div class="grid location-grid">
      <div class="field field-span-2" style="grid-column: 1 / -1;">
        <label for="bulk_barcodes">Scanned Barcodes</label>

          <div class="hint" style="margin-bottom: 10px;">
              1. Click in the box below<br>
                  2. Scan the barcode image to dump stored scanner data<br>
                      3. Review and apply bulk move
                        </div>

                          <div style="display: grid; grid-template-columns: minmax(420px, 1fr) minmax(420px, 1fr); gap: 24px; align-items: start; width: 100%;">

                                  <!-- LEFT SIDE -->
                                      <div style="width: 100%;">
                                            <textarea
                                                    id="bulk_barcodes"
                                                            name="bulk_barcodes"
                                                                    rows="12"
                                                                            placeholder="Stored barcodes will appear here after scanning the trigger image"
                                                                                    style="width: 100%; min-height: 260px; resize: vertical; box-sizing: border-box;"></textarea>

                                                                                          <div class="hint" style="margin-top: 8px;">
                                                                                                  Scanner input goes into this box.
                                                                                                        </div>
                                                                                                            </div>

                                                                                                                <!-- RIGHT SIDE -->
                                                                                                                    <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                                                                                                                          <img
                                                                                                                                  id="dump_trigger_img"
                                                                                                                                          src="{{ url_for('static', filename='img/BARCODESCANOUT.png') }}"
                                                                                                                                                  alt="Scanner dump trigger barcode"
                                                                                                                                                          style="width: 100%; max-width: 300px; height: auto; border: 2px solid rgba(0,0,0,.15); border-radius: 10px; padding: 10px; background: #fff; cursor: pointer; box-sizing: border-box;">

                                                                                                                                                                <button
                                                                                                                                                                  class="btn btn-secondary"
                                                                                                                                                                    type="button"
                                                                                                                                                                      id="clear_bulk_scan"
                                                                                                                                                                        onclick="clearBulkScanBox()"
                                                                                                                                                                          style="margin-top: 14px;">
                                                                                                                                                                            Clear
                                                                                                                                                                            </button>
                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                    </div>

    </div>

    <hr class="sep">

    <h3 class="h2">Destination</h3>
    <div class="grid location-grid">
      <div class="field field-span-2">
        <label for="bulk_location_template">Location Template</label>
        <select id="bulk_location_template">
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
          <option value="unfound">Unfound</option>
        </select>
      </div>

      <div class="field">
        <label for="bulk_room_no">Room #</label>
        <input id="bulk_room_no" name="room_no" type="text" placeholder="e.g. 2018N">
      </div>

      <div class="field field-span-2">
        <label for="bulk_room_desc">Room Description</label>
        <input id="bulk_room_desc" name="room_desc" type="text" placeholder="e.g. Pass-Through">
      </div>

      <div class="field">
        <label for="bulk_area_class">Area Class</label>
        <input id="bulk_area_class" name="area_class" type="text" placeholder="e.g. H-5">
      </div>

      <div class="field field-span-2">
        <label for="bulk_storage_location">Storage Location</label>
        <input id="bulk_storage_location" name="storage_location" type="text" placeholder="e.g. Fume Hood, SE">
      </div>

      <div class="field">
        <label for="bulk_storage_sublocation">Sub-Storage Location</label>
        <input id="bulk_storage_sublocation" name="storage_sublocation" type="text" placeholder="e.g. Shelf 2">
      </div>

      <div class="field">
        <label for="bulk_storage_device">Storage Device</label>
        <input id="bulk_storage_device" name="storage_device" type="text" placeholder="e.g. Cabinet / As Received">
      </div>

      <div class="field">
        <label for="bulk_performed_by">Moved By</label>
        <input id="bulk_performed_by" name="performed_by" type="text" placeholder="Your name">
      </div>
    </div>

    <div class="actions">
      <button class="btn" type="submit">Apply Bulk Move</button>
    </div>
  </form>
</section>


  <form method="post" action="{{ url_for('chem.move_material') }}">
    <!-- barcode is submitted from this hidden input (we keep the visible barcode input outside the form UI) -->
    <input type="hidden" name="barcode" id="barcodeHidden">

    <div class="card">
      <h2 class="subhead">Location</h2>

      <div class="grid">
        <div class="grid-head">Field</div>
        <div class="grid-head">Current Location</div>
        <div class="grid-head">New Location</div>

        <!-- Room No -->
        <div class="grid-label">Room No</div>
        <div class="grid-current"><input id="cur_room_no" type="text" readonly></div>
        <div class="grid-new"><input id="room_no" name="room_no" type="text" placeholder="e.g., 02020N"></div>

        <!-- Room Desc -->
        <div class="grid-label">Room Desc</div>
        <div class="grid-current"><input id="cur_room_desc" type="text" readonly></div>
        <div class="grid-new"><input id="room_desc" name="room_desc" type="text" placeholder="e.g., H-5"></div>

        <!-- Area Class -->
        <div class="grid-label">Area Class</div>
        <div class="grid-current"><input id="cur_area_class" type="text" readonly></div>
        <div class="grid-new"><input id="area_class" name="area_class" type="text" placeholder="e.g., H-5"></div>

        <!-- Storage Location -->
        <div class="grid-label">Storage Location</div>
        <div class="grid-current"><input id="cur_storage_location" type="text" readonly></div>
        <div class="grid-new"><input id="storage_location" name="storage_location" type="text" placeholder="e.g., Fume Hood, SE"></div>

        <!-- Sub-Storage Location -->
        <div class="grid-label">Sub-Storage Location</div>
        <div class="grid-current"><input id="cur_storage_sublocation" type="text" readonly></div>
        <div class="grid-new"><input id="storage_sublocation" name="storage_sublocation" type="text" placeholder="e.g., Storage - Left"></div>

        <!-- Storage Device -->
        <div class="grid-label">Storage Device</div>
        <div class="grid-current"><input id="cur_storage_device" type="text" readonly></div>
        <div class="grid-new"><input id="storage_device" name="storage_device" type="text" placeholder="e.g., Acid Cabinet"></div>
	<div>
	<label>User</label>
	<input type="text" name="performed_by" placeholder="User">
	</div>
      </div>

      <div class="move-actions">
        <button type="submit" class="btn btn-primary" id="btnSubmit" disabled>Move</button>
      </div>
    </div>
  </form>
</div>

<style>
.container { max-width: 1100px; margin: 0 auto; padding: 16px; }
.page-title { margin: 14px 0 18px; }
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,.08);
  padding: 16px;
  margin-bottom: 16px;
}
.row { display: flex; gap: 16px; flex-wrap: wrap; }
.col { flex: 1 1 420px; min-width: 320px; }
label { display:block; margin-bottom: 6px; }
input[type="text"]{
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d7d7d7;
  border-radius: 10px;
  background: #fff;
}
input[readonly] { background: #f6f6f6; }
.help { font-size: 12px; opacity: .75; margin-top: 6px; }
.status { margin-top: 10px; font-size: 13px; }
.btn-row { display:flex; gap:10px; margin-top: 10px; }
.btn{
  border: 0;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
}
.btn-primary { background: #0b5; color: #fff; }
.btn-secondary { background: #444; color: #fff; }
.btn { background: #222; color: #fff; }
.btn:disabled { opacity: .5; cursor: not-allowed; }

.barcode-box{
  border: 1px dashed #ddd;
  border-radius: 12px;
  padding: 12px;
  background: #fafafa;
}
.barcode-title { font-weight: 700; margin-bottom: 6px; }
.barcode-text { font-size: 20px; font-weight: 800; letter-spacing: .5px; margin: 6px 0 10px; }
#barcodeSvg { width: 100%; height: 70px; }

.subhead { margin: 0 0 12px; font-size: 18px; }
.grid{
  display: grid;
  grid-template-columns: 180px 1fr 1fr;
  gap: 10px;
  align-items: center;
}
.grid-head { font-weight: 800; padding: 6px 0; }
.grid-label { font-weight: 600; }
.grid-current, .grid-new { }
.move-actions { margin-top: 16px; display:flex; justify-content:flex-end; }
@media (max-width: 900px){
  .grid{ grid-template-columns: 1fr; }
  .grid-head{ display:none; }
}
</style>

<script>
(function () {
  const barcodeEl = document.getElementById("barcode");
  const barcodeHiddenEl = document.getElementById("barcodeHidden");
  const statusEl = document.getElementById("lookupStatus");
  const btnLoad = document.getElementById("btnLoad");
  const btnClear = document.getElementById("btnClear");
  const btnSubmit = document.getElementById("btnSubmit");
  const barcodeText = document.getElementById("barcodeText");
  const barcodeSvg = document.getElementById("barcodeSvg");

  function setStatus(msg, isError) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.style.color = isError ? "#b00" : "#222";
  }

  function setCurrentField(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = (value == null ? "" : String(value));
  }

  function clearAll() {
    barcodeEl.value = "";
    barcodeHiddenEl.value = "";
    barcodeText.textContent = "(empty)";
    setStatus("");

    // clear current fields
    ["cur_room_no","cur_room_desc","cur_area_class","cur_storage_location","cur_storage_sublocation","cur_storage_device"]
      .forEach(id => setCurrentField(id, ""));

    // clear new fields
    ["room_no","room_desc","area_class","storage_location","storage_sublocation","storage_device"]
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });

    // clear barcode svg
    if (barcodeSvg) barcodeSvg.innerHTML = "";

    btnSubmit.disabled = true;
    barcodeEl.focus();
  }

  function renderBarcodeDisplay(code) {
    const c = (code || "").trim();
    barcodeText.textContent = c ? c : "(empty)";
    if (!c) {
      if (barcodeSvg) barcodeSvg.innerHTML = "";
      return;
    }

    // If JsBarcode exists globally in your project, use it.
    // This will NOT crash if JsBarcode isn't present.
    try {
      if (window.JsBarcode && barcodeSvg) {
        window.JsBarcode(barcodeSvg, c, {
          format: "CODE128",
          displayValue: false,
          margin: 0,
          height: 55
        });
      } else {
        if (barcodeSvg) barcodeSvg.innerHTML = "";
      }
    } catch (e) {
      if (barcodeSvg) barcodeSvg.innerHTML = "";
    }
  }

  async function loadCurrent() {
    const bc = (barcodeEl.value || "").trim();
    if (!bc) {
      setStatus("Scan/enter a barcode first.", true);
      return;
    }

    setStatus("Loading current location…");
    btnSubmit.disabled = true;

    try {
      const res = await fetch(`/chem/api/container_lookup?barcode=${encodeURIComponent(bc)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      const data = payload && payload.data ? payload.data : {};

      if (!data || Object.keys(data).length === 0) {
        setStatus("Barcode not found.", true);
        renderBarcodeDisplay(bc);
        barcodeHiddenEl.value = bc;
        return;
      }

      // Fill current (read-only)
      setCurrentField("cur_room_no", data.room_no);
      setCurrentField("cur_room_desc", data.room_desc);
      setCurrentField("cur_area_class", data.area_class);
      setCurrentField("cur_storage_location", data.storage_location);
      setCurrentField("cur_storage_sublocation", data.storage_sublocation);
      setCurrentField("cur_storage_device", data.storage_device);

      // Also lock in barcode to submit
      barcodeHiddenEl.value = bc;

      renderBarcodeDisplay(bc);

      // If removed, prevent moving
      if (String(data.status || "").toLowerCase() === "removed") {
        setStatus("This container is marked Removed. Move is disabled.", true);
        btnSubmit.disabled = true;
        return;
      }

      setStatus("Loaded.");
      btnSubmit.disabled = false;

      // Put cursor into first "new location" field
      const roomNoEl = document.getElementById("room_no");
      if (roomNoEl) roomNoEl.focus();
    } catch (e) {
      console.error(e);
      setStatus("Lookup failed (check server logs).", true);
    }
  }

  btnLoad.addEventListener("click", loadCurrent);
  btnClear.addEventListener("click", clearAll);

  barcodeEl.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      loadCurrent();
    }
  });

  // start empty
  clearAll();
})();
</script>

<script>
(function () {
  const bulkBox = document.getElementById("bulk_barcodes");
  const focusBtn = document.getElementById("focus_bulk_scan");
  const clearBtn = document.getElementById("clear_bulk_scan");
  const templateEl = document.getElementById("bulk_location_template");

  const LOCATION_TEMPLATES = {
    bay_a: { room_no: "2025N", room_desc: "Bay A", area_class: "H-5" },
    bay_b: { room_no: "2022N", room_desc: "Bay B", area_class: "H-5" },
    bay_c: { room_no: "2020N", room_desc: "Bay C", area_class: "H-5" },
    bay_d: { room_no: "2018N", room_desc: "Bay D", area_class: "H-5" },
    bay_e: { room_no: "2016N", room_desc: "Bay E", area_class: "H-5" },
    bay_f: { room_no: "2014N", room_desc: "Bay F", area_class: "H-5" },
    bay_g: { room_no: "2012N", room_desc: "Bay G", area_class: "H-5" },

    student_yellow: { room_no: "2010N", room_desc: "Student Yellow", area_class: "H-5" },
    mocvd: { room_no: "2006N", room_desc: "MOCVD", area_class: "H-5" },
    microfluidics: { room_no: "2008N", room_desc: "Microfluidics", area_class: "H-5" },
    metrology: { room_no: "2026N", room_desc: "Metrology", area_class: "H-5" },

    backend_lab: { room_no: "2223", room_desc: "Backend Lab", area_class: "General" },
    prototyping_lab: { room_no: "2237", room_desc: "Prototyping Lab", area_class: "General" },
    cr_shop: { room_no: "2237N", room_desc: "CR Shop", area_class: "General" },

    gas_chem_room: { room_no: "2018N", room_desc: "Gas Chem Room", area_class: "H-2,3,4" },
    pass_through: { room_no: "2018N", room_desc: "Pass-Through", area_class: "H-5" },

    unfound: { room_no: "UNFOUND", room_desc: "Unfound", area_class: "Unfound" }
  };

  function setVal(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = value == null ? "" : value;
  }



  templateEl?.addEventListener("change", function () {
    const tpl = LOCATION_TEMPLATES[this.value];
    if (!tpl) return;

    setVal("bulk_room_no", tpl.room_no);
    setVal("bulk_room_desc", tpl.room_desc);
    setVal("bulk_area_class", tpl.area_class);





})();
</script>


<script>
const bulkBox = document.getElementById("bulk_barcodes");
const dumpImg = document.getElementById("dump_trigger_img");

dumpImg?.addEventListener("click", () => {
  bulkBox?.focus();
});


window.addEventListener("load", () => {
  bulkBox?.focus();
});


// Clicking image focuses textbox
dumpImg?.addEventListener("click", () => {
  bulkBox?.focus();
</script>



<script>
  function clearBulkScanBox() {
      const bulkBox = document.getElementById("bulk_barcodes");
          if (bulkBox) {
                bulkBox.value = "";
                      bulkBox.focus();
                          }
                            }

                              window.addEventListener("load", function () {
                                  const bulkBox = document.getElementById("bulk_barcodes");
                                      const dumpImg = document.getElementById("dump_trigger_img");

                                          if (dumpImg) {
                                                dumpImg.addEventListener("click", function () {
                                                        if (bulkBox) bulkBox.focus();
                                                              });
                                                                  }

                                                                      if (bulkBox) bulkBox.focus();
                                                                        });
                                                                        </script>
<script>
  const bulkTemplateEl = document.getElementById("bulk_location_template");

  const BULK_LOCATION_TEMPLATES = {
    bay_a: { room_no: "2025N", room_desc: "Bay A", area_class: "H-5" },
    bay_b: { room_no: "2022N", room_desc: "Bay B", area_class: "H-5" },
    bay_c: { room_no: "2020N", room_desc: "Bay C", area_class: "H-5" },
    bay_d: { room_no: "2018N", room_desc: "Bay D", area_class: "H-5" },
    bay_e: { room_no: "2016N", room_desc: "Bay E", area_class: "H-5" },
    bay_f: { room_no: "2014N", room_desc: "Bay F", area_class: "H-5" },
    bay_g: { room_no: "2012N", room_desc: "Bay G", area_class: "H-5" },

    student_yellow: { room_no: "2010N", room_desc: "Student Yellow", area_class: "H-5" },
    mocvd: { room_no: "2006N", room_desc: "MOCVD", area_class: "H-5" },
    microfluidics: { room_no: "2008N", room_desc: "Microfluidics", area_class: "H-5" },
    metrology: { room_no: "2026N", room_desc: "Metrology", area_class: "H-5" },

    backend_lab: { room_no: "2223", room_desc: "Backend Lab", area_class: "General" },
    prototyping_lab: { room_no: "2237", room_desc: "Prototyping Lab", area_class: "General" },
    cr_shop: { room_no: "2237N", room_desc: "CR Shop", area_class: "General" },

    gas_chem_room: { room_no: "2018N", room_desc: "Gas Chem Room", area_class: "H-2,3,4" },
    pass_through: { room_no: "2018N", room_desc: "Pass-Through", area_class: "H-5" },
    unfound: { room_no: "UNFOUND", room_desc: "Unfound", area_class: "Unfound" }
  };

  function setBulkVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || "";
  }

  if (bulkTemplateEl) {
    bulkTemplateEl.addEventListener("change", function () {
      const tpl = BULK_LOCATION_TEMPLATES[this.value];
      if (!tpl) return;

      setBulkVal("bulk_room_no", tpl.room_no);
      setBulkVal("bulk_room_desc", tpl.room_desc);
      setBulkVal("bulk_area_class", tpl.area_class);
    });
  }
</script>
{% endblock %}

```

## Line-By-Line Reconstruction Notes

### Line 1

```text
{% extends "chem/base.html" %}
```

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.

### Line 2

```text
{% block title %}Move Container{% endblock %}
```

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.

### Line 4

```text
{% block content %}
```

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.

### Line 5

```text
<div class="container">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 6

```text
  <h1 class="page-title">Move Container</h1>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 8

```text
  <div class="card">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 9

```text
    <div class="row">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 10

```text
      <div class="col">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 11

```text
        <label for="barcode"><strong>Barcode</strong></label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 12

```text
        <input id="barcode" name="barcode" type="text" placeholder="Scan or type barcode…" autocomplete="off">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 13

```text
        <div class="help">Scan a barcode, then press Enter (or click Load).</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 15

```text
        <div class="btn-row">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 16

```text
          <button type="button" id="btnLoad" class="btn">Load Current</button>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 17

```text
          <button type="button" id="btnClear" class="btn btn-secondary">Clear</button>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 18

```text
        </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 20

```text
        <div id="lookupStatus" class="status"></div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 21

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 23

```text
      <div class="col barcode-box">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 24

```text
        <div class="barcode-title">Scan Target</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 25

```text
        <div id="barcodeText" class="barcode-text">(empty)</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 27

```text
        <svg id="barcodeSvg"></svg>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 28

```text
        <div class="help">This is just to make it obvious what’s loaded. Use Clear between scans.</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 29

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 30

```text
    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 31

```text
  </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 33

```text
<section class="card">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 34

```text
  <h2 class="h2">Bulk Move by Scanner</h2>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 35

```text
  <p class="muted">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 36

```text
    Scan barcodes directly into the box below, one per line, then choose the destination and apply the move.
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 37

```text
  </p>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 39

```text
  <form method="post" action="{{ url_for('chem.move_bulk') }}" autocomplete="off">
```

`html-form` — This form line defines browser input flow. Preserve action URL, method, CSRF/auth assumptions, field names, and submit behavior; edge cases include missing required fields, browser autofill, duplicate submissions, and routes that expect exact names.

### Line 40

```text
    <div class="grid location-grid">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 41

```text
      <div class="field field-span-2" style="grid-column: 1 / -1;">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 42

```text
        <label for="bulk_barcodes">Scanned Barcodes</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 44

```text
          <div class="hint" style="margin-bottom: 10px;">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 45

```text
              1. Click in the box below<br>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 46

```text
                  2. Scan the barcode image to dump stored scanner data<br>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 47

```text
                      3. Review and apply bulk move
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 48

```text
                        </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 50

```text
                          <div style="display: grid; grid-template-columns: minmax(420px, 1fr) minmax(420px, 1fr); gap: 24px; align-items: start; width: 100%;">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 53

```text
                                      <div style="width: 100%;">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 54

```text
                                            <textarea
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 55

```text
                                                    id="bulk_barcodes"
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 56

```text
                                                            name="bulk_barcodes"
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 57

```text
                                                                    rows="12"
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 58

```text
                                                                            placeholder="Stored barcodes will appear here after scanning the trigger image"
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 59

```text
                                                                                    style="width: 100%; min-height: 260px; resize: vertical; box-sizing: border-box;"></textarea>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 61

```text
                                                                                          <div class="hint" style="margin-top: 8px;">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 62

```text
                                                                                                  Scanner input goes into this box.
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 63

```text
                                                                                                        </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 64

```text
                                                                                                            </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 67

```text
                                                                                                                    <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 68

```text
                                                                                                                          <img
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 69

```text
                                                                                                                                  id="dump_trigger_img"
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 70

```text
                                                                                                                                          src="{{ url_for('static', filename='img/BARCODESCANOUT.png') }}"
```

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.

### Line 71

```text
                                                                                                                                                  alt="Scanner dump trigger barcode"
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 72

```text
                                                                                                                                                          style="width: 100%; max-width: 300px; height: auto; border: 2px solid rgba(0,0,0,.15); border-radius: 10px; padding: 10px; background: #fff; cursor: pointer; box-sizing: border-box;">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 74

```text
                                                                                                                                                                <button
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 75

```text
                                                                                                                                                                  class="btn btn-secondary"
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 76

```text
                                                                                                                                                                    type="button"
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 77

```text
                                                                                                                                                                      id="clear_bulk_scan"
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 78

```text
                                                                                                                                                                        onclick="clearBulkScanBox()"
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 79

```text
                                                                                                                                                                          style="margin-top: 14px;">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 80

```text
                                                                                                                                                                            Clear
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 81

```text
                                                                                                                                                                            </button>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 82

```text
                                                                                                                                                                                                                  </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 83

```text
                                                                                                                                                                                                                    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 84

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

### Line 90

```text
    <h3 class="h2">Destination</h3>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 91

```text
    <div class="grid location-grid">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 92

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 93

```text
        <label for="bulk_location_template">Location Template</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 94

```text
        <select id="bulk_location_template">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 95

```text
          <option value="">Select a location...</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 96

```text
          <option value="gas_chem_room">Gas Chem Room</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 97

```text
          <option value="pass_through">Pass-Through</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 98

```text
          <option value="bay_a">Bay A</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 99

```text
          <option value="bay_b">Bay B</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 100

```text
          <option value="bay_c">Bay C</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 101

```text
          <option value="bay_d">Bay D</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 102

```text
          <option value="bay_e">Bay E</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 103

```text
          <option value="bay_f">Bay F</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 104

```text
          <option value="bay_g">Bay G</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 105

```text
          <option value="student_yellow">Student Yellow</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 106

```text
          <option value="mocvd">MOCVD</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 107

```text
          <option value="microfluidics">Microfluidics</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 108

```text
          <option value="metrology">Metrology</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 109

```text
          <option value="backend_lab">Backend Lab</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 110

```text
          <option value="prototyping_lab">Prototyping Lab</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 111

```text
          <option value="cr_shop">CR Shop</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 112

```text
          <option value="unfound">Unfound</option>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 113

```text
        </select>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 114

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 116

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 117

```text
        <label for="bulk_room_no">Room #</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 118

```text
        <input id="bulk_room_no" name="room_no" type="text" placeholder="e.g. 2018N">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 119

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 121

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 122

```text
        <label for="bulk_room_desc">Room Description</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 123

```text
        <input id="bulk_room_desc" name="room_desc" type="text" placeholder="e.g. Pass-Through">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 124

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 126

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 127

```text
        <label for="bulk_area_class">Area Class</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 128

```text
        <input id="bulk_area_class" name="area_class" type="text" placeholder="e.g. H-5">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 129

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 131

```text
      <div class="field field-span-2">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 132

```text
        <label for="bulk_storage_location">Storage Location</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 133

```text
        <input id="bulk_storage_location" name="storage_location" type="text" placeholder="e.g. Fume Hood, SE">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 134

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 136

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 137

```text
        <label for="bulk_storage_sublocation">Sub-Storage Location</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 138

```text
        <input id="bulk_storage_sublocation" name="storage_sublocation" type="text" placeholder="e.g. Shelf 2">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 139

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 141

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 142

```text
        <label for="bulk_storage_device">Storage Device</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 143

```text
        <input id="bulk_storage_device" name="storage_device" type="text" placeholder="e.g. Cabinet / As Received">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 144

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 146

```text
      <div class="field">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 147

```text
        <label for="bulk_performed_by">Moved By</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 148

```text
        <input id="bulk_performed_by" name="performed_by" type="text" placeholder="Your name">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 149

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 150

```text
    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 152

```text
    <div class="actions">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 153

```text
      <button class="btn" type="submit">Apply Bulk Move</button>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 154

```text
    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 155

```text
  </form>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 156

```text
</section>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 159

```text
  <form method="post" action="{{ url_for('chem.move_material') }}">
```

`html-form` — This form line defines browser input flow. Preserve action URL, method, CSRF/auth assumptions, field names, and submit behavior; edge cases include missing required fields, browser autofill, duplicate submissions, and routes that expect exact names.

### Line 161

```text
    <input type="hidden" name="barcode" id="barcodeHidden">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 163

```text
    <div class="card">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 164

```text
      <h2 class="subhead">Location</h2>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 166

```text
      <div class="grid">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 167

```text
        <div class="grid-head">Field</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 168

```text
        <div class="grid-head">Current Location</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 169

```text
        <div class="grid-head">New Location</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 172

```text
        <div class="grid-label">Room No</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 173

```text
        <div class="grid-current"><input id="cur_room_no" type="text" readonly></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 174

```text
        <div class="grid-new"><input id="room_no" name="room_no" type="text" placeholder="e.g., 02020N"></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 177

```text
        <div class="grid-label">Room Desc</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 178

```text
        <div class="grid-current"><input id="cur_room_desc" type="text" readonly></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 179

```text
        <div class="grid-new"><input id="room_desc" name="room_desc" type="text" placeholder="e.g., H-5"></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 182

```text
        <div class="grid-label">Area Class</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 183

```text
        <div class="grid-current"><input id="cur_area_class" type="text" readonly></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 184

```text
        <div class="grid-new"><input id="area_class" name="area_class" type="text" placeholder="e.g., H-5"></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 187

```text
        <div class="grid-label">Storage Location</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 188

```text
        <div class="grid-current"><input id="cur_storage_location" type="text" readonly></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 189

```text
        <div class="grid-new"><input id="storage_location" name="storage_location" type="text" placeholder="e.g., Fume Hood, SE"></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 192

```text
        <div class="grid-label">Sub-Storage Location</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 193

```text
        <div class="grid-current"><input id="cur_storage_sublocation" type="text" readonly></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 194

```text
        <div class="grid-new"><input id="storage_sublocation" name="storage_sublocation" type="text" placeholder="e.g., Storage - Left"></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 197

```text
        <div class="grid-label">Storage Device</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 198

```text
        <div class="grid-current"><input id="cur_storage_device" type="text" readonly></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 199

```text
        <div class="grid-new"><input id="storage_device" name="storage_device" type="text" placeholder="e.g., Acid Cabinet"></div>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 200

```text
	<div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 201

```text
	<label>User</label>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 202

```text
	<input type="text" name="performed_by" placeholder="User">
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 203

```text
	</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 204

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 206

```text
      <div class="move-actions">
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 207

```text
        <button type="submit" class="btn btn-primary" id="btnSubmit" disabled>Move</button>
```

`html-control` — This control line defines user-editable input or a visible action. Preserve name, id, value, required status, option set, and accessibility label; edge cases include empty values, unexpected values, disabled controls, and mismatches with Flask form parsing.

### Line 208

```text
      </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 209

```text
    </div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 210

```text
  </form>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 211

```text
</div>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 213

```text
<style>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 214

```text
.container { max-width: 1100px; margin: 0 auto; padding: 16px; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 215

```text
.page-title { margin: 14px 0 18px; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 216

```text
.card {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 217

```text
  background: #fff;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 218

```text
  border-radius: 12px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 219

```text
  box-shadow: 0 6px 20px rgba(0,0,0,.08);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 220

```text
  padding: 16px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 221

```text
  margin-bottom: 16px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 222

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 223

```text
.row { display: flex; gap: 16px; flex-wrap: wrap; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 224

```text
.col { flex: 1 1 420px; min-width: 320px; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 225

```text
label { display:block; margin-bottom: 6px; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 226

```text
input[type="text"]{
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 227

```text
  width: 100%;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 228

```text
  padding: 10px 12px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 229

```text
  border: 1px solid #d7d7d7;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 230

```text
  border-radius: 10px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 231

```text
  background: #fff;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 232

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 233

```text
input[readonly] { background: #f6f6f6; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 234

```text
.help { font-size: 12px; opacity: .75; margin-top: 6px; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 235

```text
.status { margin-top: 10px; font-size: 13px; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 236

```text
.btn-row { display:flex; gap:10px; margin-top: 10px; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 237

```text
.btn{
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 238

```text
  border: 0;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 239

```text
  padding: 10px 14px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 240

```text
  border-radius: 10px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 241

```text
  cursor: pointer;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 242

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 243

```text
.btn-primary { background: #0b5; color: #fff; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 244

```text
.btn-secondary { background: #444; color: #fff; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 245

```text
.btn { background: #222; color: #fff; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 246

```text
.btn:disabled { opacity: .5; cursor: not-allowed; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 248

```text
.barcode-box{
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 249

```text
  border: 1px dashed #ddd;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 250

```text
  border-radius: 12px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 251

```text
  padding: 12px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 252

```text
  background: #fafafa;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 253

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 254

```text
.barcode-title { font-weight: 700; margin-bottom: 6px; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 255

```text
.barcode-text { font-size: 20px; font-weight: 800; letter-spacing: .5px; margin: 6px 0 10px; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 258

```text
.subhead { margin: 0 0 12px; font-size: 18px; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 259

```text
.grid{
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 260

```text
  display: grid;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 261

```text
  grid-template-columns: 180px 1fr 1fr;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 262

```text
  gap: 10px;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 263

```text
  align-items: center;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 264

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 265

```text
.grid-head { font-weight: 800; padding: 6px 0; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 266

```text
.grid-label { font-weight: 600; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 267

```text
.grid-current, .grid-new { }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 268

```text
.move-actions { margin-top: 16px; display:flex; justify-content:flex-end; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 269

```text
@media (max-width: 900px){
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 270

```text
  .grid{ grid-template-columns: 1fr; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 271

```text
  .grid-head{ display:none; }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 272

```text
}
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 273

```text
</style>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 275

```text
<script>
```

`asset-link` — This asset linkage pulls in JavaScript, CSS, or browser behavior. Preserve relative paths, load order, cache expectations, and fallback behavior; edge cases include missing static files, stale browser cache, and scripts running before elements exist.

### Line 276

```text
(function () {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 277

```text
  const barcodeEl = document.getElementById("barcode");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 278

```text
  const barcodeHiddenEl = document.getElementById("barcodeHidden");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 279

```text
  const statusEl = document.getElementById("lookupStatus");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 280

```text
  const btnLoad = document.getElementById("btnLoad");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 281

```text
  const btnClear = document.getElementById("btnClear");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 282

```text
  const btnSubmit = document.getElementById("btnSubmit");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 283

```text
  const barcodeText = document.getElementById("barcodeText");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 284

```text
  const barcodeSvg = document.getElementById("barcodeSvg");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 286

```text
  function setStatus(msg, isError) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 287

```text
    if (!statusEl) return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 288

```text
    statusEl.textContent = msg || "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 289

```text
    statusEl.style.color = isError ? "#b00" : "#222";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 290

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 292

```text
  function setCurrentField(id, value) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 293

```text
    const el = document.getElementById(id);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 294

```text
    if (!el) return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 295

```text
    el.value = (value == null ? "" : String(value));
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 296

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 298

```text
  function clearAll() {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 299

```text
    barcodeEl.value = "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 300

```text
    barcodeHiddenEl.value = "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 301

```text
    barcodeText.textContent = "(empty)";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 302

```text
    setStatus("");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 305

```text
    ["cur_room_no","cur_room_desc","cur_area_class","cur_storage_location","cur_storage_sublocation","cur_storage_device"]
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 306

```text
      .forEach(id => setCurrentField(id, ""));
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 309

```text
    ["room_no","room_desc","area_class","storage_location","storage_sublocation","storage_device"]
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 310

```text
      .forEach(id => {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 311

```text
        const el = document.getElementById(id);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 312

```text
        if (el) el.value = "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 313

```text
      });
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 316

```text
    if (barcodeSvg) barcodeSvg.innerHTML = "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 318

```text
    btnSubmit.disabled = true;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 319

```text
    barcodeEl.focus();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 320

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 322

```text
  function renderBarcodeDisplay(code) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 323

```text
    const c = (code || "").trim();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 324

```text
    barcodeText.textContent = c ? c : "(empty)";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 325

```text
    if (!c) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 326

```text
      if (barcodeSvg) barcodeSvg.innerHTML = "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 327

```text
      return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 328

```text
    }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 332

```text
    try {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 333

```text
      if (window.JsBarcode && barcodeSvg) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 334

```text
        window.JsBarcode(barcodeSvg, c, {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 335

```text
          format: "CODE128",
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 336

```text
          displayValue: false,
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 337

```text
          margin: 0,
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 338

```text
          height: 55
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 339

```text
        });
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 340

```text
      } else {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 341

```text
        if (barcodeSvg) barcodeSvg.innerHTML = "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 342

```text
      }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 343

```text
    } catch (e) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 344

```text
      if (barcodeSvg) barcodeSvg.innerHTML = "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 345

```text
    }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 346

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 348

```text
  async function loadCurrent() {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 349

```text
    const bc = (barcodeEl.value || "").trim();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 350

```text
    if (!bc) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 351

```text
      setStatus("Scan/enter a barcode first.", true);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 352

```text
      return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 353

```text
    }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 355

```text
    setStatus("Loading current location…");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 356

```text
    btnSubmit.disabled = true;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 358

```text
    try {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 359

```text
      const res = await fetch(`/chem/api/container_lookup?barcode=${encodeURIComponent(bc)}`);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 360

```text
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 361

```text
      const payload = await res.json();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 362

```text
      const data = payload && payload.data ? payload.data : {};
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 364

```text
      if (!data || Object.keys(data).length === 0) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 365

```text
        setStatus("Barcode not found.", true);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 366

```text
        renderBarcodeDisplay(bc);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 367

```text
        barcodeHiddenEl.value = bc;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 368

```text
        return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 369

```text
      }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 372

```text
      setCurrentField("cur_room_no", data.room_no);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 373

```text
      setCurrentField("cur_room_desc", data.room_desc);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 374

```text
      setCurrentField("cur_area_class", data.area_class);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 375

```text
      setCurrentField("cur_storage_location", data.storage_location);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 376

```text
      setCurrentField("cur_storage_sublocation", data.storage_sublocation);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 377

```text
      setCurrentField("cur_storage_device", data.storage_device);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 380

```text
      barcodeHiddenEl.value = bc;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 382

```text
      renderBarcodeDisplay(bc);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 385

```text
      if (String(data.status || "").toLowerCase() === "removed") {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 386

```text
        setStatus("This container is marked Removed. Move is disabled.", true);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 387

```text
        btnSubmit.disabled = true;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 388

```text
        return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 389

```text
      }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 391

```text
      setStatus("Loaded.");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 392

```text
      btnSubmit.disabled = false;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 395

```text
      const roomNoEl = document.getElementById("room_no");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 396

```text
      if (roomNoEl) roomNoEl.focus();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 397

```text
    } catch (e) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 398

```text
      console.error(e);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 399

```text
      setStatus("Lookup failed (check server logs).", true);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 400

```text
    }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 401

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 403

```text
  btnLoad.addEventListener("click", loadCurrent);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 404

```text
  btnClear.addEventListener("click", clearAll);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 406

```text
  barcodeEl.addEventListener("keydown", (ev) => {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 407

```text
    if (ev.key === "Enter") {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 408

```text
      ev.preventDefault();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 409

```text
      loadCurrent();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 410

```text
    }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 411

```text
  });
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 414

```text
  clearAll();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 415

```text
})();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 416

```text
</script>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 418

```text
<script>
```

`asset-link` — This asset linkage pulls in JavaScript, CSS, or browser behavior. Preserve relative paths, load order, cache expectations, and fallback behavior; edge cases include missing static files, stale browser cache, and scripts running before elements exist.

### Line 419

```text
(function () {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 420

```text
  const bulkBox = document.getElementById("bulk_barcodes");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 421

```text
  const focusBtn = document.getElementById("focus_bulk_scan");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 422

```text
  const clearBtn = document.getElementById("clear_bulk_scan");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 423

```text
  const templateEl = document.getElementById("bulk_location_template");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 425

```text
  const LOCATION_TEMPLATES = {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 426

```text
    bay_a: { room_no: "2025N", room_desc: "Bay A", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 427

```text
    bay_b: { room_no: "2022N", room_desc: "Bay B", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 428

```text
    bay_c: { room_no: "2020N", room_desc: "Bay C", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 429

```text
    bay_d: { room_no: "2018N", room_desc: "Bay D", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 430

```text
    bay_e: { room_no: "2016N", room_desc: "Bay E", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 431

```text
    bay_f: { room_no: "2014N", room_desc: "Bay F", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 432

```text
    bay_g: { room_no: "2012N", room_desc: "Bay G", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 434

```text
    student_yellow: { room_no: "2010N", room_desc: "Student Yellow", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 435

```text
    mocvd: { room_no: "2006N", room_desc: "MOCVD", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 436

```text
    microfluidics: { room_no: "2008N", room_desc: "Microfluidics", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 437

```text
    metrology: { room_no: "2026N", room_desc: "Metrology", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 439

```text
    backend_lab: { room_no: "2223", room_desc: "Backend Lab", area_class: "General" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 440

```text
    prototyping_lab: { room_no: "2237", room_desc: "Prototyping Lab", area_class: "General" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 441

```text
    cr_shop: { room_no: "2237N", room_desc: "CR Shop", area_class: "General" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 443

```text
    gas_chem_room: { room_no: "2018N", room_desc: "Gas Chem Room", area_class: "H-2,3,4" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 444

```text
    pass_through: { room_no: "2018N", room_desc: "Pass-Through", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 446

```text
    unfound: { room_no: "UNFOUND", room_desc: "Unfound", area_class: "Unfound" }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 447

```text
  };
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 449

```text
  function setVal(id, value) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 450

```text
    const el = document.getElementById(id);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 451

```text
    if (!el) return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 452

```text
    el.value = value == null ? "" : value;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 453

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 457

```text
  templateEl?.addEventListener("change", function () {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 458

```text
    const tpl = LOCATION_TEMPLATES[this.value];
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 459

```text
    if (!tpl) return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 461

```text
    setVal("bulk_room_no", tpl.room_no);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 462

```text
    setVal("bulk_room_desc", tpl.room_desc);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 463

```text
    setVal("bulk_area_class", tpl.area_class);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 469

```text
})();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 470

```text
</script>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 473

```text
<script>
```

`asset-link` — This asset linkage pulls in JavaScript, CSS, or browser behavior. Preserve relative paths, load order, cache expectations, and fallback behavior; edge cases include missing static files, stale browser cache, and scripts running before elements exist.

### Line 474

```text
const bulkBox = document.getElementById("bulk_barcodes");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 475

```text
const dumpImg = document.getElementById("dump_trigger_img");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 477

```text
dumpImg?.addEventListener("click", () => {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 478

```text
  bulkBox?.focus();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 479

```text
});
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 482

```text
window.addEventListener("load", () => {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 483

```text
  bulkBox?.focus();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 484

```text
});
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 488

```text
dumpImg?.addEventListener("click", () => {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 489

```text
  bulkBox?.focus();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 490

```text
</script>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 494

```text
<script>
```

`asset-link` — This asset linkage pulls in JavaScript, CSS, or browser behavior. Preserve relative paths, load order, cache expectations, and fallback behavior; edge cases include missing static files, stale browser cache, and scripts running before elements exist.

### Line 495

```text
  function clearBulkScanBox() {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 496

```text
      const bulkBox = document.getElementById("bulk_barcodes");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 497

```text
          if (bulkBox) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 498

```text
                bulkBox.value = "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 499

```text
                      bulkBox.focus();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 500

```text
                          }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 501

```text
                            }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 503

```text
                              window.addEventListener("load", function () {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 504

```text
                                  const bulkBox = document.getElementById("bulk_barcodes");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 505

```text
                                      const dumpImg = document.getElementById("dump_trigger_img");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 507

```text
                                          if (dumpImg) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 508

```text
                                                dumpImg.addEventListener("click", function () {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 509

```text
                                                        if (bulkBox) bulkBox.focus();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 510

```text
                                                              });
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 511

```text
                                                                  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 513

```text
                                                                      if (bulkBox) bulkBox.focus();
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 514

```text
                                                                        });
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 515

```text
                                                                        </script>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 516

```text
<script>
```

`asset-link` — This asset linkage pulls in JavaScript, CSS, or browser behavior. Preserve relative paths, load order, cache expectations, and fallback behavior; edge cases include missing static files, stale browser cache, and scripts running before elements exist.

### Line 517

```text
  const bulkTemplateEl = document.getElementById("bulk_location_template");
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 519

```text
  const BULK_LOCATION_TEMPLATES = {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 520

```text
    bay_a: { room_no: "2025N", room_desc: "Bay A", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 521

```text
    bay_b: { room_no: "2022N", room_desc: "Bay B", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 522

```text
    bay_c: { room_no: "2020N", room_desc: "Bay C", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 523

```text
    bay_d: { room_no: "2018N", room_desc: "Bay D", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 524

```text
    bay_e: { room_no: "2016N", room_desc: "Bay E", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 525

```text
    bay_f: { room_no: "2014N", room_desc: "Bay F", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 526

```text
    bay_g: { room_no: "2012N", room_desc: "Bay G", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 528

```text
    student_yellow: { room_no: "2010N", room_desc: "Student Yellow", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 529

```text
    mocvd: { room_no: "2006N", room_desc: "MOCVD", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 530

```text
    microfluidics: { room_no: "2008N", room_desc: "Microfluidics", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 531

```text
    metrology: { room_no: "2026N", room_desc: "Metrology", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 533

```text
    backend_lab: { room_no: "2223", room_desc: "Backend Lab", area_class: "General" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 534

```text
    prototyping_lab: { room_no: "2237", room_desc: "Prototyping Lab", area_class: "General" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 535

```text
    cr_shop: { room_no: "2237N", room_desc: "CR Shop", area_class: "General" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 537

```text
    gas_chem_room: { room_no: "2018N", room_desc: "Gas Chem Room", area_class: "H-2,3,4" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 538

```text
    pass_through: { room_no: "2018N", room_desc: "Pass-Through", area_class: "H-5" },
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 539

```text
    unfound: { room_no: "UNFOUND", room_desc: "Unfound", area_class: "Unfound" }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 540

```text
  };
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 542

```text
  function setBulkVal(id, value) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 543

```text
    const el = document.getElementById(id);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 544

```text
    if (el) el.value = value || "";
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 545

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 547

```text
  if (bulkTemplateEl) {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 548

```text
    bulkTemplateEl.addEventListener("change", function () {
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 549

```text
      const tpl = BULK_LOCATION_TEMPLATES[this.value];
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 550

```text
      if (!tpl) return;
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 552

```text
      setBulkVal("bulk_room_no", tpl.room_no);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 553

```text
      setBulkVal("bulk_room_desc", tpl.room_desc);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 554

```text
      setBulkVal("bulk_area_class", tpl.area_class);
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 555

```text
    });
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 556

```text
  }
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 557

```text
</script>
```

`html` — This HTML structure controls what the user sees. Preserve hierarchy, semantic meaning, important classes and ids, and template blocks; edge cases include long text, missing data, mobile layout, and hidden dependencies used by JavaScript.

### Line 558

```text
{% endblock %}
```

`template` — This template expression bridges server data into HTML. Preserve variable names, filters, loops, and conditional rendering; edge cases include missing context keys, empty lists, unsafe HTML, and values that need escaping.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/templates/chem/move.html`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
