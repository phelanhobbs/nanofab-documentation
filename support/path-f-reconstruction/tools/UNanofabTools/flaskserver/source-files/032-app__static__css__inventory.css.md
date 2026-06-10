

# Source Reconstruction: UNanofabTools/app/static/css/inventory.css

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

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

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 2

```text
  --nf-red:#cc0000;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 3

```text
  --nf-red-dark:#a80000;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 4

```text
  --nf-dark:#111;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 5

```text
  --nf-text:#202124;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 6

```text
  --nf-muted:#6b7280;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 7

```text
  --nf-border:#e5e7eb;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 8

```text
  --nf-bg:#f7f7f7;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 9

```text
  --ok:#19a974;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 10

```text
  --warn:#f59e0b;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 11

```text
  --bad:#dc2626;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 12

```text
}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 15

```text
html,body{height:100%}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 16

```text
body{
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 17

```text
  margin:0;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 18

```text
  font:14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 19

```text
  color:var(--nf-text);
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 20

```text
  background:var(--nf-bg);
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 21

```text
}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 24

```text
.nf-header{background:var(--nf-red); color:#fff; position:sticky; top:0; z-index:10; box-shadow:0 1px 0 rgba(0,0,0,.08)}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 25

```text
.nf-bar{max-width:1400px; margin:0 auto; padding:10px 16px; display:flex; gap:16px; align-items:center; justify-content:space-between}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 27

```text
.nf-brand{color:#fff; text-decoration:none; font-weight:800; letter-spacing:.02em; display:flex; align-items:center; gap:2px;}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 28

```text
.nf-brand .nf-u{display:inline-grid; place-items:center; width:20px; height:20px; border-radius:2px; background:#fff; color:var(--nf-red); font-weight:900}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 30

```text
.nf-nav{display:flex; gap:12px; flex-wrap:wrap}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 31

```text
.nf-link{color:#fff; text-decoration:none; padding:6px 10px; border-radius:6px}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 32

```text
.nf-link:hover{background:rgba(255,255,255,.15)}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 33

```text
.nf-link.active{background:#fff; color:var(--nf-red); font-weight:700}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 36

```text
.page{max-width:1400px; margin:18px auto 48px; padding:0 16px}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 37

```text
.flash-wrap{max-width:1000px; margin:0 auto 10px}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 38

```text
.flash{padding:10px 12px; border-radius:8px; background:#fff; border:1px solid var(--nf-border)}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 39

```text
.flash.success{border-color:#c7f0d8; background:#f3fdf7}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 40

```text
.flash.error{border-color:#ffd1d1; background:#fff7f7}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 43

```text
input[type="text"],input[type="date"],input[type="number"],input[type="file"],select,textarea{
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 44

```text
  padding:8px 10px; border:1px solid var(--nf-border); border-radius:8px; background:#fff; width:100%;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 45

```text
}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 46

```text
button,.btn{
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 47

```text
  display:inline-flex; align-items:center; gap:8px;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 48

```text
  padding:8px 14px; border-radius:999px; border:1px solid var(--nf-red);
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 49

```text
  background:var(--nf-red); color:#fff; cursor:pointer; text-decoration:none;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 50

```text
}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 51

```text
button:hover,.btn:hover{background:var(--nf-red-dark); border-color:var(--nf-red-dark)}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 54

```text
.actions, .searchbar{display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin:8px 0 16px}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 55

```text
.muted{color:var(--nf-muted); font-size:12px}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 58

```text
.table-wrap{overflow:auto; background:#fff; border:1px solid var(--nf-border); border-radius:12px}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 59

```text
.inv-table{width:100%; min-width:1400px; border-collapse:separate; border-spacing:0; font-size:13px}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 60

```text
.inv-table thead th{
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 61

```text
  position:sticky; top:0; z-index:1; background:#fff; text-align:left; font-weight:700;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 62

```text
  padding:10px 12px; border-bottom:2px solid var(--nf-red);
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 63

```text
}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 64

```text
.inv-table tbody td{padding:8px 12px; border-bottom:1px solid var(--nf-border); vertical-align:top}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 65

```text
.inv-table tbody tr:hover{background:#fafafa}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 66

```text
.inv-table code{background:#f3f4f6; padding:2px 6px; border-radius:6px}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 69

```text
.inv-table .sticky-col{left:0; position:sticky; background:#fff; box-shadow:1px 0 0 var(--nf-border)}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 72

```text
.pill{display:inline-block; padding:2px 8px; border-radius:999px; font-weight:700; font-size:12px}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 73

```text
.pill.ok{background:rgba(25,169,116,.1); color:var(--ok)}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 74

```text
.pill.warn{background:rgba(245,158,11,.12); color:var(--warn)}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 75

```text
.pill.bad{background:rgba(220,38,38,.12); color:var(--bad)}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 78

```text
.nf-footer{max-width:1400px; margin:24px auto; padding:0 16px; color:var(--nf-muted); font-size:12px}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 81

```text
@media print{
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 82

```text
  .nf-header,.nf-footer,.actions,.searchbar,.flash-wrap{display:none!important}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 83

```text
  .page{margin:0; padding:0}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 84

```text
  .table-wrap{border:0}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 85

```text
  .inv-table thead th,.inv-table tbody td{padding:6px 8px; font-size:11.5px}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 86

```text
}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 89

```text
.tabs .tab{
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 90

```text
  background:#fff;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 91

```text
  color:var(--nf-text);
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 92

```text
  border:1px solid var(--nf-border);
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 93

```text
}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 94

```text
.tabs .tab.active{
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 95

```text
  background:var(--nf-red);
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 96

```text
  color:#fff;
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 97

```text
  border-color:var(--nf-red);
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.

### Line 98

```text
}
```

`css` — This CSS line contributes presentation. Preserve selectors that JavaScript or templates rely on, layout constraints, print behavior, and responsive behavior; edge cases include long labels, small screens, and overlapping controls.



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
