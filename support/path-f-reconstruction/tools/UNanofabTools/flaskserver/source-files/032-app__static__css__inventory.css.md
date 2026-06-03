

# Source Reconstruction: UNanofabTools/app/static/css/inventory.css

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `app/static/css/inventory.css`
- Lines read: `98`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `09ceb8940f1a674f`
- Code fence language: `css`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```css
:root{
  --nf-red:#cc0000;
  --nf-red-dark:#a80000;
  --nf-dark:#111;
  --nf-text:#202124;
  --nf-muted:#6b7280;
  --nf-border:#e5e7eb;
  --nf-bg:#f7f7f7;
  --ok:#19a974;
  --warn:#f59e0b;
  --bad:#dc2626;
}

*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  font:14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  color:var(--nf-text);
  background:var(--nf-bg);
}

/* Header */
.nf-header{background:var(--nf-red); color:#fff; position:sticky; top:0; z-index:10; box-shadow:0 1px 0 rgba(0,0,0,.08)}
.nf-bar{max-width:1400px; margin:0 auto; padding:10px 16px; display:flex; gap:16px; align-items:center; justify-content:space-between}
/* Header brand spacing — make the U badge sit closer to the text */
.nf-brand{color:#fff; text-decoration:none; font-weight:800; letter-spacing:.02em; display:flex; align-items:center; gap:2px;}
.nf-brand .nf-u{display:inline-grid; place-items:center; width:20px; height:20px; border-radius:2px; background:#fff; color:var(--nf-red); font-weight:900}

.nf-nav{display:flex; gap:12px; flex-wrap:wrap}
.nf-link{color:#fff; text-decoration:none; padding:6px 10px; border-radius:6px}
.nf-link:hover{background:rgba(255,255,255,.15)}
.nf-link.active{background:#fff; color:var(--nf-red); font-weight:700}

/* Page shell */
.page{max-width:1400px; margin:18px auto 48px; padding:0 16px}
.flash-wrap{max-width:1000px; margin:0 auto 10px}
.flash{padding:10px 12px; border-radius:8px; background:#fff; border:1px solid var(--nf-border)}
.flash.success{border-color:#c7f0d8; background:#f3fdf7}
.flash.error{border-color:#ffd1d1; background:#fff7f7}

/* Forms + buttons */
input[type="text"],input[type="date"],input[type="number"],input[type="file"],select,textarea{
  padding:8px 10px; border:1px solid var(--nf-border); border-radius:8px; background:#fff; width:100%;
}
button,.btn{
  display:inline-flex; align-items:center; gap:8px;
  padding:8px 14px; border-radius:999px; border:1px solid var(--nf-red);
  background:var(--nf-red); color:#fff; cursor:pointer; text-decoration:none;
}
button:hover,.btn:hover{background:var(--nf-red-dark); border-color:var(--nf-red-dark)}

/* Search bar on inventory */
.actions, .searchbar{display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin:8px 0 16px}
.muted{color:var(--nf-muted); font-size:12px}

/* Table */
.table-wrap{overflow:auto; background:#fff; border:1px solid var(--nf-border); border-radius:12px}
.inv-table{width:100%; min-width:1400px; border-collapse:separate; border-spacing:0; font-size:13px}
.inv-table thead th{
  position:sticky; top:0; z-index:1; background:#fff; text-align:left; font-weight:700;
  padding:10px 12px; border-bottom:2px solid var(--nf-red);
}
.inv-table tbody td{padding:8px 12px; border-bottom:1px solid var(--nf-border); vertical-align:top}
.inv-table tbody tr:hover{background:#fafafa}
.inv-table code{background:#f3f4f6; padding:2px 6px; border-radius:6px}

/* sticky first column if used */
.inv-table .sticky-col{left:0; position:sticky; background:#fff; box-shadow:1px 0 0 var(--nf-border)}

/* Pills */
.pill{display:inline-block; padding:2px 8px; border-radius:999px; font-weight:700; font-size:12px}
.pill.ok{background:rgba(25,169,116,.1); color:var(--ok)}
.pill.warn{background:rgba(245,158,11,.12); color:var(--warn)}
.pill.bad{background:rgba(220,38,38,.12); color:var(--bad)}

/* Footer */
.nf-footer{max-width:1400px; margin:24px auto; padding:0 16px; color:var(--nf-muted); font-size:12px}

/* Print */
@media print{
  .nf-header,.nf-footer,.actions,.searchbar,.flash-wrap{display:none!important}
  .page{margin:0; padding:0}
  .table-wrap{border:0}
  .inv-table thead th,.inv-table tbody td{padding:6px 8px; font-size:11.5px}
}

/* Tab controls (override global button styles) */
.tabs .tab{
  background:#fff;
  color:var(--nf-text);
  border:1px solid var(--nf-border);
}
.tabs .tab.active{
  background:var(--nf-red);
  color:#fff;
  border-color:var(--nf-red);
}
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
:root{
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 1 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `none` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
  --nf-red:#cc0000;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 2 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
  --nf-red-dark:#a80000;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 3 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
  --nf-dark:#111;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 4 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
  --nf-text:#202124;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 5 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
  --nf-muted:#6b7280;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 6 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
  --nf-border:#e5e7eb;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 7 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
  --nf-bg:#f7f7f7;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 8 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
  --ok:#19a974;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 9 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
  --warn:#f59e0b;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 10 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
  --bad:#dc2626;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 11 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 12 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 13 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
*{box-sizing:border-box}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 14 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
html,body{height:100%}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 15 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
body{
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 16 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
  margin:0;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 17 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
  font:14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 18 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
  color:var(--nf-text);
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 19 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
  background:var(--nf-bg);
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 20 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 21 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 22 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
/* Header */
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 23 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
.nf-header{background:var(--nf-red); color:#fff; position:sticky; top:0; z-index:10; box-shadow:0 1px 0 rgba(0,0,0,.08)}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 24 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
.nf-bar{max-width:1400px; margin:0 auto; padding:10px 16px; display:flex; gap:16px; align-items:center; justify-content:space-between}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 25 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
/* Header brand spacing — make the U badge sit closer to the text */
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 26 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
.nf-brand{color:#fff; text-decoration:none; font-weight:800; letter-spacing:.02em; display:flex; align-items:center; gap:2px;}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 27 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
.nf-brand .nf-u{display:inline-grid; place-items:center; width:20px; height:20px; border-radius:2px; background:#fff; color:var(--nf-red); font-weight:900}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 28 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 29 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
.nf-nav{display:flex; gap:12px; flex-wrap:wrap}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 30 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
.nf-link{color:#fff; text-decoration:none; padding:6px 10px; border-radius:6px}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 31 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
.nf-link:hover{background:rgba(255,255,255,.15)}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 32 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
.nf-link.active{background:#fff; color:var(--nf-red); font-weight:700}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 33 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 34 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
/* Page shell */
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 35 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
.page{max-width:1400px; margin:18px auto 48px; padding:0 16px}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 36 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
.flash-wrap{max-width:1000px; margin:0 auto 10px}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 37 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
.flash{padding:10px 12px; border-radius:8px; background:#fff; border:1px solid var(--nf-border)}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 38 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
.flash.success{border-color:#c7f0d8; background:#f3fdf7}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 39 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
.flash.error{border-color:#ffd1d1; background:#fff7f7}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 40 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 41 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
/* Forms + buttons */
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 42 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
input[type="text"],input[type="date"],input[type="number"],input[type="file"],select,textarea{
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 43 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
  padding:8px 10px; border:1px solid var(--nf-border); border-radius:8px; background:#fff; width:100%;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 44 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 45 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
button,.btn{
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 46 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
  display:inline-flex; align-items:center; gap:8px;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 47 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
  padding:8px 14px; border-radius:999px; border:1px solid var(--nf-red);
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 48 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
  background:var(--nf-red); color:#fff; cursor:pointer; text-decoration:none;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 49 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 50 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
button:hover,.btn:hover{background:var(--nf-red-dark); border-color:var(--nf-red-dark)}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 51 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 52 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
/* Search bar on inventory */
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 53 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
.actions, .searchbar{display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin:8px 0 16px}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 54 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
.muted{color:var(--nf-muted); font-size:12px}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 55 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 56 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
/* Table */
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 57 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
.table-wrap{overflow:auto; background:#fff; border:1px solid var(--nf-border); border-radius:12px}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 58 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
.inv-table{width:100%; min-width:1400px; border-collapse:separate; border-spacing:0; font-size:13px}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 59 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
.inv-table thead th{
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 60 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
  position:sticky; top:0; z-index:1; background:#fff; text-align:left; font-weight:700;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 61 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
  padding:10px 12px; border-bottom:2px solid var(--nf-red);
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 62 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 63 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
.inv-table tbody td{padding:8px 12px; border-bottom:1px solid var(--nf-border); vertical-align:top}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 64 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
.inv-table tbody tr:hover{background:#fafafa}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 65 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
.inv-table code{background:#f3f4f6; padding:2px 6px; border-radius:6px}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 66 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 67 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
/* sticky first column if used */
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 68 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
.inv-table .sticky-col{left:0; position:sticky; background:#fff; box-shadow:1px 0 0 var(--nf-border)}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 69 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 70 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
/* Pills */
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 71 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
.pill{display:inline-block; padding:2px 8px; border-radius:999px; font-weight:700; font-size:12px}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 72 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
.pill.ok{background:rgba(25,169,116,.1); color:var(--ok)}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 73 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
.pill.warn{background:rgba(245,158,11,.12); color:var(--warn)}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 74 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
.pill.bad{background:rgba(220,38,38,.12); color:var(--bad)}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 75 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 76 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
/* Footer */
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 77 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
.nf-footer{max-width:1400px; margin:24px auto; padding:0 16px; color:var(--nf-muted); font-size:12px}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 78 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 79 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
/* Print */
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 80 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
@media print{
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 81 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
  .nf-header,.nf-footer,.actions,.searchbar,.flash-wrap{display:none!important}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 82 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
  .page{margin:0; padding:0}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 83 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
  .table-wrap{border:0}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 84 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
  .inv-table thead th,.inv-table tbody td{padding:6px 8px; font-size:11.5px}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 85 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 86 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 87 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `css` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
/* Tab controls (override global button styles) */
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 88 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
.tabs .tab{
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 89 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `comment` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
  background:#fff;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 90 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
  color:var(--nf-text);
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 91 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
  border:1px solid var(--nf-border);
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 92 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 93 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
.tabs .tab.active{
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 94 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
  background:var(--nf-red);
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 95 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
  color:#fff;
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 96 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
  border-color:var(--nf-red);
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 97 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `css`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/css/inventory.css`, line 98 is classified as `css`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls. Neighbor context: previous kind is `css` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/static/css/inventory.css`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
