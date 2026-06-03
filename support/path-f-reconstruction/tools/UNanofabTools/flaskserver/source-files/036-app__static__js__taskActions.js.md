

# Source Reconstruction: UNanofabTools/app/static/js/taskActions.js

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `app/static/js/taskActions.js`
- Lines read: `118`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `2c5b33508708b998`
- Code fence language: `javascript`

## Reconstruction Purpose

This section is written so a maintainer can recreate the file's behavior without opening the source tree. The sanitized code excerpt preserves structure and names while removing secret-looking literal values. The line-by-line notes explain the operational reason for each line, the behavior that must survive a rewrite, and the edge cases to test.

## Sanitized Source Excerpt

```javascript
document.addEventListener('DOMContentLoaded', function() {
    var createTaskButton = document.getElementById('createTaskButton');
    if(createTaskButton) {
        createTaskButton.addEventListener('click', function() {
            window.location.href = '/createtasks';
        });
    }

    var form = document.getElementById('createTaskForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});

function handleSubmit(event) {
    event.preventDefault(); //prevent default form submission

    var form = document.getElementById('createTaskForm');
    var formData = new FormData(form);

    // Convert FormData to a plain object
    var formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    var assigneesSelect = document.getElementById('assignees');
    var selectedAssignees = Array.from(assigneesSelect.selectedOptions).map(option => option.value);
    formObject.assignees = selectedAssignees;

    fetch('/createtasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
    })
    .then(response => {
        console.log('Response status:', response.status);
        console.log('Response Status Text:', response.statusText)
        if (response.ok){
            window.location.href = '/tasks'; // Redirect to /tasks
        } else {
            alert('Error creating task');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error creating task')
    })
}

function changeStatus(taskId) {
    fetch('/changestatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: taskId }),
    })
    .then(response => {
        if (response.ok) {
            alert('Status updated to Completed');
            window.location.reload();
        } else {
            alert('Error updating status');
        }
    });
}


function claimTask(taskId) {
    fetch('/claimTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: taskId }),
        credentials: 'include',
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'Task claimed.') {
            document.getElementById(`claim-${taskId}`).innerText = 'Claimed';
            window.location.reload();
        } else {
            alert('Error claiming task');
        }
    })
    .catch(error => console.error('Error:', error));
}

function uploadFile(taskId) {
    var fileInput = document.getElementById('fileInput-' + taskId);
    fileInput.click();

    fileInput.onchange = function() {
        var file = fileInput.files[0];
        if (file) {
            var formData = new FormData();
            formData.append('file', file);
            formData.append('task_id', taskId);

            fetch('/uploadtaskfile', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    alert('File uploaded successfully');
                    window.location.reload();
                } else {
                    alert('File upload failed');
                }
            });
        }
    };
}
```

## Line-By-Line Reconstruction Notes

### Line 1

```text
document.addEventListener('DOMContentLoaded', function() {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 1 is classified as `js-event`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This event binding connects user actions to behavior. Preserve selector, event type, timing, and duplicate-listener behavior; edge cases include missing DOM nodes, dynamically inserted elements, and multiple clicks. Neighbor context: previous kind is `none` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 2

```text
    var createTaskButton = document.getElementById('createTaskButton');
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 2 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-event` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 3

```text
    if(createTaskButton) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 3 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `js-event`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 4

```text
        createTaskButton.addEventListener('click', function() {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 4 is classified as `js-event`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This event binding connects user actions to behavior. Preserve selector, event type, timing, and duplicate-listener behavior; edge cases include missing DOM nodes, dynamically inserted elements, and multiple clicks. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 5

```text
            window.location.href = '/createtasks';
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 5 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-event` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 6

```text
        });
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 6 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 7

```text
    }
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 7 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 8

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 8 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 9

```text
    var form = document.getElementById('createTaskForm');
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 9 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `blank` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 10

```text
    if (form) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 10 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `js-event`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 11

```text
        form.addEventListener('submit', handleSubmit);
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 11 is classified as `js-event`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This event binding connects user actions to behavior. Preserve selector, event type, timing, and duplicate-listener behavior; edge cases include missing DOM nodes, dynamically inserted elements, and multiple clicks. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 12

```text
    }
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 12 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-event` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 13

```text
});
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 13 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 14

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 14 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 15

```text
function handleSubmit(event) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 15 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `blank` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 16

```text
    event.preventDefault(); //prevent default form submission
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 16 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 17

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 17 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 18

```text
    var form = document.getElementById('createTaskForm');
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 18 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `blank` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 19

```text
    var formData = new FormData(form);
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 19 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 20

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 20 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `comment`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 21

```text
    // Convert FormData to a plain object
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 21 is classified as `comment`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This comment or prose line records intent, operator guidance, or historical context. Recreate the underlying behavior from code evidence, but preserve any operational warning because comments here often explain safety boundaries. Neighbor context: previous kind is `blank` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 22

```text
    var formObject = {};
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 22 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `comment` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 23

```text
    formData.forEach((value, key) => {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 23 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 24

```text
        formObject[key] = value;
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 24 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 25

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 25 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 26

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 26 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 27

```text
    var assigneesSelect = document.getElementById('assignees');
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 27 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `blank` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 28

```text
    var selectedAssignees = Array.from(assigneesSelect.selectedOptions).map(option => option.value);
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 28 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 29

```text
    formObject.assignees = selectedAssignees;
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 29 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 30

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 30 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `js-network`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 31

```text
    fetch('/createtasks', {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 31 is classified as `js-network`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures. Neighbor context: previous kind is `blank` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 32

```text
        method: 'POST',
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 32 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-network` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 33

```text
        headers: {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 33 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 34

```text
            'Content-Type': 'application/json'
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 34 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 35

```text
        },
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 35 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 36

```text
        body: JSON.stringify(formObject)
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 36 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 37

```text
    })
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 37 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 38

```text
    .then(response => {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 38 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 39

```text
        console.log('Response status:', response.status);
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 39 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 40

```text
        console.log('Response Status Text:', response.statusText)
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 40 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 41

```text
        if (response.ok){
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 41 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 42

```text
            window.location.href = '/tasks'; // Redirect to /tasks
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 42 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 43

```text
        } else {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 43 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 44

```text
            alert('Error creating task');
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 44 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 45

```text
        }
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 45 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 46

```text
    })
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 46 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 47

```text
    .catch(error => {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 47 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 48

```text
        console.error('Error:', error);
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 48 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 49

```text
        alert('Error creating task')
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 49 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 50

```text
    })
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 50 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 51

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 51 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 52

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 52 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 53

```text
function changeStatus(taskId) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 53 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `blank` and next kind is `js-network`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 54

```text
    fetch('/changestatus', {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 54 is classified as `js-network`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 55

```text
        method: 'POST',
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 55 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-network` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 56

```text
        headers: {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 56 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 57

```text
            'Content-Type': 'application/json',
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 57 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 58

```text
        },
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 58 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 59

```text
        body: JSON.stringify({ taskId: taskId }),
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 59 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 60

```text
    })
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 60 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 61

```text
    .then(response => {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 61 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 62

```text
        if (response.ok) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 62 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 63

```text
            alert('Status updated to Completed');
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 63 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 64

```text
            window.location.reload();
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 64 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 65

```text
        } else {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 65 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 66

```text
            alert('Error updating status');
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 66 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 67

```text
        }
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 67 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 68

```text
    });
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 68 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 69

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 69 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 70

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 70 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 71

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 71 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `blank` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 72

```text
function claimTask(taskId) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 72 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `blank` and next kind is `js-network`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 73

```text
    fetch('/claimTask', {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 73 is classified as `js-network`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 74

```text
        method: 'POST',
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 74 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-network` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 75

```text
        headers: {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 75 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 76

```text
            'Content-Type': 'application/json',
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 76 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 77

```text
        },
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 77 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 78

```text
        body: JSON.stringify({ taskId: taskId }),
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 78 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 79

```text
        credentials: 'include',
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 79 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 80

```text
    })
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 80 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 81

```text
    .then(response => response.text())
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 81 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 82

```text
    .then(data => {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 82 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 83

```text
        if (data === 'Task claimed.') {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 83 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 84

```text
            document.getElementById(`claim-${taskId}`).innerText = 'Claimed';
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 84 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 85

```text
            window.location.reload();
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 85 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 86

```text
        } else {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 86 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 87

```text
            alert('Error claiming task');
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 87 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 88

```text
        }
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 88 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 89

```text
    })
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 89 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 90

```text
    .catch(error => console.error('Error:', error));
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 90 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 91

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 91 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 92

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 92 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 93

```text
function uploadFile(taskId) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 93 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `blank` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 94

```text
    var fileInput = document.getElementById('fileInput-' + taskId);
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 94 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 95

```text
    fileInput.click();
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 95 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 96

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 96 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 97

```text
    fileInput.onchange = function() {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 97 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `blank` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 98

```text
        var file = fileInput.files[0];
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 98 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 99

```text
        if (file) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 99 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 100

```text
            var formData = new FormData();
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 100 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 101

```text
            formData.append('file', file);
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 101 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 102

```text
            formData.append('task_id', taskId);
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 102 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `blank`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 103

```text
<blank line>
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 103 is classified as `blank`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This blank line separates neighboring ideas. Keep an equivalent separation when recreating the file so imports, configuration, control flow, and output sections remain reviewable. Neighbor context: previous kind is `javascript` and next kind is `js-network`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 104

```text
            fetch('/uploadtaskfile', {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 104 is classified as `js-network`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures. Neighbor context: previous kind is `blank` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 105

```text
                method: 'POST',
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 105 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-network` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 106

```text
                body: formData
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 106 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 107

```text
            })
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 107 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `js-function`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 108

```text
            .then(response => {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 108 is classified as `js-function`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 109

```text
                if (response.ok) {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 109 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `js-function` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 110

```text
                    alert('File uploaded successfully');
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 110 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 111

```text
                    window.location.reload();
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 111 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 112

```text
                } else {
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 112 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 113

```text
                    alert('File upload failed');
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 113 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 114

```text
                }
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 114 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 115

```text
            });
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 115 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 116

```text
        }
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 116 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 117

```text
    };
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 117 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `javascript`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.

### Line 118

```text
}
```

Reconstruction rule: in `UNanofabTools/app/static/js/taskActions.js`, line 118 is classified as `javascript`. A compatible reimplementation must preserve the same observable contract even if the exact spelling changes. This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls. Neighbor context: previous kind is `javascript` and next kind is `none`. When rebuilding, check this line together with its neighbors rather than in isolation, because adjacent lines often provide setup, validation, or cleanup.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/app/static/js/taskActions.js`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
