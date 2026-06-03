# Minimum Acceptable Full Path E - Module 07: Tasks

This generated module file is part of the split Path E tier. Read it as a self-contained script for this module, then stop at the module's stop conditions before continuing.



# Existing Path E v1 Module Script: module-07-tasks.md

# Module 7 - Tasks And Everyday User Workflows

## Goal

The maintainer understands the task tracker as a complete example of a normal user-facing Flask feature: route, template, login guard, service function, database model, file upload, and known risks.

## Required Screen

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx` (repo path: presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx)
- `presentation/UNanofabTools/flaskserver/06-Tasks.md` (repo path: presentation/UNanofabTools/flaskserver/06-Tasks.md)
- `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (repo path: documentation/UNanofabTools/flaskserver/05-http-api-reference.md)
- `documentation/UNanofabTools/flaskserver/06-service-layer-reference.md` (repo path: documentation/UNanofabTools/flaskserver/06-service-layer-reference.md)

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

Open the task routes in `documentation/UNanofabTools/flaskserver/05-http-api-reference.md` (repo path: documentation/UNanofabTools/flaskserver/05-http-api-reference.md).

READ ALOUD:

"The endpoint reference should state method, path, guard, input, behavior, and response. It should also mention known behavioral risks. For example, if a route allows any logged-in user to complete any task, that must be documented as a known issue or intentional design."

## File Upload Note

READ ALOUD:

"File uploads are always worth extra attention. A maintainer should ask where uploaded files are stored, how names are sanitized, whether allowed extensions are restricted, whether size limits exist, and whether backup coverage includes the upload path."

## Explain-Back

ASK:

| Question | Expected answer |
|---|---|
| Which blueprint owns tasks? | The tasks blueprint, typically `app/blueprints/tasks.py`. |
| Which service file contains task behavior? | `app/services/task_service.py`. |
| Which database stores task data? | The task-related SQLite database/tables documented for the Flask app. |
| Which task routes mutate state? | Create/update/status/claim/upload routes such as task creation, `/changestatus`, `/claimTask`, and `/uploadtaskfile`. |
| Which task routes accept JSON? | JSON routes include task status/claim style endpoints documented with JSON bodies, such as `/changestatus` and `/claimTask`. |
| Which task routes accept form or file data? | Task creation forms and multipart upload routes such as `/uploadtaskfile`. |
| What is the security implication of a logged-in user changing task status? | If only login is required, any logged-in user may be able to change task state unless ownership/admin checks are added. |
| How would you verify docs against source for one task endpoint? | Compare the endpoint reference to the route decorator, guard, input parsing, service call, side effect, response, and known-issues entry. |

REQUIRE:

The maintainer can trace one task action from browser route to service code to data side effect.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot trace one task workflow end to end. Assign them to audit a single task route and report back with route, guard, input, service call, and side effect.


# Expanded Module 07: Tasks

READ ALOUD:

This expanded section revisits Module 07, Tasks. The focus is normal user workflows, task routes, services, database writes, and uploads. The presenter should not treat this as optional padding. It is a structured repetition cycle: explain the idea, show evidence, rehearse failure modes, ask for a teach-back, and record gaps.

## Orientation pass for Module 07

READ ALOUD:

We are now doing the orientation pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx`
- `presentation/UNanofabTools/flaskserver/06-Tasks.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention normal user workflows, task routes, services, database writes, and uploads. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

## Evidence pass for Module 07

READ ALOUD:

We are now doing the evidence pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

SHOW:

- `presentation/UNanofabTools/flaskserver/slides/06-Tasks.pptx`
- `presentation/UNanofabTools/flaskserver/06-Tasks.md`
- If this pass requires source evidence, also open the matching sibling source repo path and name the file shown.

DO:

1. Restate the module's operational purpose.
2. Name the highest-risk misunderstanding for this module.
3. Name the evidence that resolves that misunderstanding.
4. Ask the maintainer to repeat the evidence path from memory.
5. Write any incomplete answer into the handoff notes.

EXPECTED MAINTAINER ANSWER:

The answer must mention normal user workflows, task routes, services, database writes, and uploads. It must also separate Nanofab-owned app or documentation work from University IT-owned root, VM, backup, patching, or account work whenever that boundary is relevant. If the module touches production, the answer must say how to inspect safely without exposing secrets or stopping services.

COMMON WRONG ANSWERS TO CORRECT:

- Treating a slide as the source of truth instead of evidence.
- Treating tmux as a process supervisor.
- Treating local PostgreSQL as external.
- Assigning root-owned or account-creation work to Nanofab.
- Updating historical copies instead of canonical source.
- Closing a known issue without source, live, or documented evidence.

STOP CONDITION:

If the maintainer cannot name the evidence path, stop the module. Reopen the relevant docs, rerun the safe check, or assign the missing verification as homework. Do not move on by relying on confidence or memory.

