

# Source Reconstruction: UNanofabTools/app/static/js/adminActions.js

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `app/static/js/adminActions.js`
- Lines read: `59`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `feaa29e63ae1ce01`
- Code fence language: `javascript`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```javascript
// Description: Contains functions for admin actions on the admin page
// Allows buttons to function on the admin page
function deleteUser(uNID) {
    //deletes user with given uNID
    fetch('/deleteUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({uNID: uNID}),
    })
    //if response is ok, reload the page
    .then(response => {
        if(response.ok) {
            window.location.reload();
        } else {
            alert('Error deleting user');
        }
    });
}

function toggleAssign(uNID){
    //toggles assign status of user with given uNID
    fetch('/toggleAssign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({uNID: uNID}),
    })
    //if response is ok, reload the page
    .then(response => {
        if(response.ok) {
            window.location.reload();
        } else {
            alert('Error toggling assign status');
        }
    });

}

function toggleAdminStatus(uNID) {
    //toggles admin status of user with given uNID
    fetch('/toggleAdminStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({uNID: uNID}),
    })
    //if response is ok, reload the page
    .then(response => {
        if(response.ok) {
            window.location.reload();
        } else {
            alert('Error toggling admin status');
        }
    });
}
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
// Description: Contains functions for admin actions on the admin page
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 1 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `none` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
// Allows buttons to function on the admin page
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 2 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `comment` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
function deleteUser(uNID) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 3 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `comment` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
    //deletes user with given uNID
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 4 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `js-function` and next kind is `js-network`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
    fetch('/deleteUser', {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 5 is classified as `js-network`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures. Neighbor context: previous kind is `comment` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
        method: 'POST',
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 6 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-network` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
        headers: {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 7 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
            'Content-Type': 'application/json',
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 8 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
        },
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 9 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
        body: JSON.stringify({uNID: uNID}),
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 10 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
    })
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 11 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
    //if response is ok, reload the page
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 12 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
    .then(response => {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 13 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `comment` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
        if(response.ok) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 14 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
            window.location.reload();
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 15 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
        } else {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 16 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
            alert('Error deleting user');
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 17 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
        }
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 18 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 19 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 20 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 21 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
function toggleAssign(uNID){
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 22 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
    //toggles assign status of user with given uNID
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 23 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `js-function` and next kind is `js-network`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
    fetch('/toggleAssign', {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 24 is classified as `js-network`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures. Neighbor context: previous kind is `comment` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
        method: 'POST',
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 25 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-network` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
        headers: {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 26 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
            'Content-Type': 'application/json',
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 27 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
        },
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 28 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
        body: JSON.stringify({uNID: uNID}),
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 29 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
    })
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 30 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
    //if response is ok, reload the page
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 31 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
    .then(response => {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 32 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `comment` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
        if(response.ok) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 33 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
            window.location.reload();
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 34 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
        } else {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 35 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
            alert('Error toggling assign status');
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 36 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
        }
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 37 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 38 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 39 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 40 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `blank` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 41 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
function toggleAdminStatus(uNID) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 42 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `blank` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
    //toggles admin status of user with given uNID
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 43 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `js-function` and next kind is `js-network`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
    fetch('/toggleAdminStatus', {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 44 is classified as `js-network`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures. Neighbor context: previous kind is `comment` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
        method: 'POST',
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 45 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-network` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
        headers: {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 46 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
            'Content-Type': 'application/json',
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 47 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
        },
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 48 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
        body: JSON.stringify({uNID: uNID}),
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 49 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
    })
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 50 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
    //if response is ok, reload the page
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 51 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
    .then(response => {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 52 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `comment` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
        if(response.ok) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 53 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
            window.location.reload();
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 54 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
        } else {
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 55 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
            alert('Error toggling admin status');
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 56 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
        }
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 57 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 58 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/js/adminActions.js`, line 59 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/static/js/adminActions.js`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
