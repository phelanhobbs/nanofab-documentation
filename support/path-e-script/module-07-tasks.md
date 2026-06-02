# Module 7 - Tasks And Everyday User Workflows

## Goal

The maintainer understands the task tracker as a complete example of a normal user-facing Flask feature: route, template, login guard, service function, database model, file upload, and known risks.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx`](../../presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx)
- [`../../presentation/UNanofabTools/flaskserver/06-Tasks.md`](../../presentation/UNanofabTools/flaskserver/06-Tasks.md)
- [`../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md`](../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- [`../../documentation/UNanofabTools/flaskserver/06-service-layer-reference.md`](../../documentation/UNanofabTools/flaskserver/06-service-layer-reference.md)

## Verbatim Script

READ ALOUD:

"The task tracker is a good first feature to trace because it is ordinary. It is not the most exotic part of the system. It uses routes, templates, login checks, SQLite, service helpers, assignment logic, status changes, and file uploads. Once you understand tasks, other feature modules become less mysterious."

SHOW:

Open `06-Tasks.pptx`.

READ ALOUD:

"From the user's perspective, tasks are a work queue. Users view tasks, create tasks if allowed, claim tasks, change status, and upload files. From the maintainer's perspective, each of those actions maps to a route, some validation, service-layer behavior, database changes, and sometimes filesystem writes."

## Source Demo

DO:

Show:

```text
../UNanofabTools/app/blueprints/tasks.py
../UNanofabTools/app/services/task_service.py
../UNanofabTools/app/templates/
```

DO:

Run:

```sh
rg -n "tasks|createtasks|changestatus|claimTask|uploadtaskfile|TaskAssignee|TaskFile" ../UNanofabTools/app
```

READ ALOUD:

"This search demonstrates the maintenance pattern. Start at the route. Identify the service function. Identify the database model or file write. Then compare the route behavior to the HTTP API reference and service-layer docs."

SHOW:

Open the task routes in [`../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md`](../../documentation/UNanofabTools/flaskserver/05-http-api-reference.md).

READ ALOUD:

"The endpoint reference should state method, path, guard, input, behavior, and response. It should also mention known behavioral risks. For example, if a route allows any logged-in user to complete any task, that must be documented as a known issue or intentional design."

## File Upload Note

READ ALOUD:

"File uploads are always worth extra attention. A maintainer should ask where uploaded files are stored, how names are sanitized, whether allowed extensions are restricted, whether size limits exist, and whether backup coverage includes the upload path."

## Explain-Back

ASK:

- Which blueprint owns tasks?
- Which service file contains task behavior?
- Which database stores task data?
- Which task routes mutate state?
- Which task routes accept JSON?
- Which task routes accept form or file data?
- What is the security implication of a logged-in user changing task status?
- How would you verify docs against source for one task endpoint?

REQUIRE:

The maintainer can trace one task action from browser route to service code to data side effect.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot trace one task workflow end to end. Assign them to audit a single task route and report back with route, guard, input, service call, and side effect.
