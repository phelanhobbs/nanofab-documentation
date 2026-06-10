

# Source Reconstruction: UNanofabTools/HSCDATA/js/taskActions.js

## Breadcrumbs

[Path F Home](../../../../README.md) | [Navigator](../../../../NAVIGATOR.md) | [Troubleshooting Routes](../../../../TROUBLESHOOTING-ROUTES.md) | [Reconstruction Checklist](../../../../RECONSTRUCTION-CHECKLIST.md) | [First Hour](../../../../MAINTAINER-FIRST-HOUR.md) | [Glossary](../../../../GLOSSARY.md) | [Evidence Template](../../../../REBUILD-EVIDENCE-TEMPLATE.md) | [Fixture Index](../../../../FIXTURE-AND-EVIDENCE-INDEX.md) | [Tool Index](../../../INDEX.md) | [System Map](../../../00-system-map/README.md) | [Owning Tool README](../README.md)

If you opened this page directly from search, stop here first: read the owning tool README, then return to this source page only for implementation evidence.

- Repository: `UNanofabTools`
- Relative path: `HSCDATA/js/taskActions.js`
- Lines read: `116`
- Dirty in working tree at generation time: `no`
- Untracked at generation time: `no`
- Sanitized SHA-256 prefix: `69b63a403f3dae8a`
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

`js-event` — This event binding connects user actions to behavior. Preserve selector, event type, timing, and duplicate-listener behavior; edge cases include missing DOM nodes, dynamically inserted elements, and multiple clicks.

### Line 2

```text
    var createTaskButton = document.getElementById('createTaskButton');
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 3

```text
    if(createTaskButton) {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 4

```text
        createTaskButton.addEventListener('click', function() {
```

`js-event` — This event binding connects user actions to behavior. Preserve selector, event type, timing, and duplicate-listener behavior; edge cases include missing DOM nodes, dynamically inserted elements, and multiple clicks.

### Line 5

```text
            window.location.href = '/createtasks';
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 6

```text
        });
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 7

```text
    }
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 9

```text
    var form = document.getElementById('createTaskForm');
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 10

```text
    if (form) {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 11

```text
        form.addEventListener('submit', handleSubmit);
```

`js-event` — This event binding connects user actions to behavior. Preserve selector, event type, timing, and duplicate-listener behavior; edge cases include missing DOM nodes, dynamically inserted elements, and multiple clicks.

### Line 12

```text
    }
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 13

```text
});
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 15

```text
function handleSubmit(event) {
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 16

```text
    event.preventDefault(); //prevent default form submission
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 18

```text
    var form = document.getElementById('createTaskForm');
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 19

```text
    var formData = new FormData(form);
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 22

```text
    var formObject = {};
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 23

```text
    formData.forEach((value, key) => {
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 24

```text
        formObject[key] = value;
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 25

```text
    });
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 27

```text
    var assigneesSelect = document.getElementById('assignees');
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 28

```text
    var selectedAssignees = Array.from(assigneesSelect.selectedOptions).map(option => option.value);
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 29

```text
    formObject.assignees = selectedAssignees;
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 31

```text
    fetch('/createtasks', {
```

`js-network` — This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures.

### Line 32

```text
        method: 'POST',
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 33

```text
        headers: {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 34

```text
            'Content-Type': 'application/json'
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 35

```text
        },
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 36

```text
        body: JSON.stringify(formObject)
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 37

```text
    })
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 38

```text
    .then(response => {
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 39

```text
        console.log('Response status:', response.status);
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 40

```text
        console.log('Response Status Text:', response.statusText)
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 41

```text
        if (response.ok){
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 42

```text
            window.location.href = '/tasks'; // Redirect to /tasks
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 43

```text
        } else {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 44

```text
            alert('Error creating task');
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 45

```text
        }
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 46

```text
    })
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 47

```text
    .catch(error => {
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 48

```text
        console.error('Error:', error);
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 49

```text
        alert('Error creating task')
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 50

```text
    })
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 51

```text
}
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 53

```text
function changeStatus(taskId) {
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 54

```text
    fetch('/changestatus', {
```

`js-network` — This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures.

### Line 55

```text
        method: 'POST',
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 56

```text
        headers: {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 57

```text
            'Content-Type': 'application/json',
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 58

```text
        },
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 59

```text
        body: JSON.stringify({ taskId: taskId }),
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 60

```text
    })
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 61

```text
    .then(response => {
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 62

```text
        if (response.ok) {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 63

```text
            alert('Status updated to Completed');
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 64

```text
        } else {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 65

```text
            alert('Error updating status');
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 66

```text
        }
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 67

```text
    });
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 68

```text
}
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 71

```text
function claimTask(taskId) {
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 72

```text
    fetch('/claimTask', {
```

`js-network` — This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures.

### Line 73

```text
        method: 'POST',
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 74

```text
        headers: {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 75

```text
            'Content-Type': 'application/json',
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 76

```text
        },
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 77

```text
        body: JSON.stringify({ taskId: taskId }),
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 78

```text
        credentials: 'include',
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 79

```text
    })
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 80

```text
    .then(response => response.text())
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 81

```text
    .then(data => {
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 82

```text
        if (data === 'Task claimed.') {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 83

```text
            document.getElementById(`claim-${taskId}`).innerText = 'Claimed';
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 84

```text
            window.location.reload();
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 85

```text
        } else {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 86

```text
            alert('Error claiming task');
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 87

```text
        }
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 88

```text
    })
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 89

```text
    .catch(error => console.error('Error:', error));
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 90

```text
}
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 92

```text
function uploadFile(taskId) {
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 93

```text
    var fileInput = document.getElementById('fileInput-' + taskId);
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 94

```text
    fileInput.click();
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 96

```text
    fileInput.onchange = function() {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 97

```text
        var file = fileInput.files[0];
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 98

```text
        if (file) {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 99

```text
            var formData = new FormData();
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 100

```text
            formData.append('file', file);
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 101

```text
            formData.append('task_id', taskId);
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 103

```text
            fetch('/uploadtaskfile', {
```

`js-network` — This JavaScript network line defines a browser-to-server contract. Preserve endpoint URL, method, payload format, response parsing, and UI error handling; edge cases include non-JSON responses, expired sessions, slow requests, and partial failures.

### Line 104

```text
                method: 'POST',
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 105

```text
                body: formData
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 106

```text
            })
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 107

```text
            .then(response => {
```

`js-function` — This JavaScript function defines client-side behavior. Preserve parameters, returned promises or values, DOM side effects, and error handling; edge cases include null elements, malformed server data, and browser compatibility.

### Line 108

```text
                if (response.ok) {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 109

```text
                    alert('File uploaded successfully');
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 110

```text
                } else {
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 111

```text
                    alert('File upload failed');
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 112

```text
                }
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 113

```text
            });
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 114

```text
        }
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 115

```text
    };
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.

### Line 116

```text
}
```

`javascript` — This JavaScript line contributes client-side state, rendering, or utilities. Preserve data shape, selector assumptions, timing, and browser-visible behavior; edge cases include stale DOM, missing data attributes, and failed network calls.



## Edge-Case Matrix For This File

1. **Empty Input**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `empty input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
2. **Single Input**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `single input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
3. **Large Input**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `large input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
4. **Duplicate Input**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `duplicate input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
5. **Malformed Input**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `malformed input` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
6. **Missing File**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `missing file` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
7. **Permission Denied**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `permission denied` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
8. **Network Timeout**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `network timeout` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
9. **Stale Credential**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `stale credential` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
10. **Rotated Secret**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `rotated secret` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
11. **Schema Drift**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `schema drift` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
12. **Partial Database Write**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `partial database write` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
13. **Concurrent Request**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `concurrent request` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
14. **Browser Refresh**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `browser refresh` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
15. **Double Submit**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `double submit` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
16. **Stale Tmux Session**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `stale tmux session` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
17. **Wrong Working Directory**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `wrong working directory` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
18. **Wrong User Account**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `wrong user account` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
19. **University It Boundary**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `University IT boundary` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
20. **Backup Restore**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `backup restore` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
21. **Disk Pressure**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `disk pressure` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
22. **Old Source Copy**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `old source copy` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
23. **Production Versus Development Configuration**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `production versus development configuration` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
24. **Redacted Secret Reconstruction**: When recreating `UNanofabTools/HSCDATA/js/taskActions.js`, test the `redacted secret reconstruction` case explicitly. The expected result is not merely that the code avoids crashing; the expected result is that the user-visible response, log entry, database state, file output, and follow-up operational instruction remain consistent with the rest of the system. If the original behavior is unsafe, document the compatibility break and the reason before changing it.
