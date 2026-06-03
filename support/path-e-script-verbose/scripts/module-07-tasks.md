# Verbose Maximal Path E - Module 07: Tasks

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

## Source-code pass for Module 07

READ ALOUD:

We are now doing the source-code pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Live-state pass for Module 07

READ ALOUD:

We are now doing the live-state pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Failure-mode pass for Module 07

READ ALOUD:

We are now doing the failure-mode pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Maintenance-planning pass for Module 07

READ ALOUD:

We are now doing the maintenance-planning pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Security pass for Module 07

READ ALOUD:

We are now doing the security pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Recovery pass for Module 07

READ ALOUD:

We are now doing the recovery pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Documentation-drift pass for Module 07

READ ALOUD:

We are now doing the documentation-drift pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Teach-back pass for Module 07

READ ALOUD:

We are now doing the teach-back pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Homework-review pass for Module 07

READ ALOUD:

We are now doing the homework-review pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Quarterly-audit pass for Module 07

READ ALOUD:

We are now doing the quarterly-audit pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Backup-and-restore pass for Module 07

READ ALOUD:

We are now doing the backup-and-restore pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Ownership-boundary pass for Module 07

READ ALOUD:

We are now doing the ownership-boundary pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## No-contact rehearsal pass for Module 07

READ ALOUD:

We are now doing the no-contact rehearsal pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Operator-error pass for Module 07

READ ALOUD:

We are now doing the operator-error pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Data-integrity pass for Module 07

READ ALOUD:

We are now doing the data-integrity pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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

## Final-repetition pass for Module 07

READ ALOUD:

We are now doing the final-repetition pass for Tasks. The maintainer should connect this module to normal user workflows, task routes, services, database writes, and uploads. Do not accept a vague answer. Require a named file, named command, named source path, or named live-state observation wherever possible.

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



# Module Documentation Corpus



# Read-Aloud Documentation Corpus: presentation/UNanofabTools/flaskserver/06-Tasks.md

READ ALOUD:

The following source document is included directly in this tier so the presenter does not need to switch files just to preserve context. Read it slowly, then pause and ask the maintainer to identify the operational facts, risks, and owner boundaries it establishes.

# 06 — Tasks

The task tracker is an internal to-do list for lab staff: anyone can see open tasks, anyone with the `can_assign` permission can create them, and anyone can mark a task complete or attach files to it. Two files: `app/blueprints/tasks.py` (the routes) and `app/services/task_service.py` (the logic, which talks to the SQLite tasks database directly via `sqlite3` rather than SQLAlchemy).

## Why direct SQLite?

You'll notice that `task_service.py` opens raw SQLite connections (`sqlite3.connect(...)`) instead of using the SQLAlchemy session. The Task model *does* exist (`app/models/__init__.py`) but isn't really used here — the original task tracker predates the SQLAlchemy refactor and the direct queries were left in place. This works, but mixing the two approaches in the same app is something to be aware of when reading the code.

## The routes — `tasks.py`

### `/tasks` — the dashboard

```python
@tasks_bp.route('/tasks')
@login_required
def index():
    """Display tasks page"""
    # Get user tasks
    user_tasks = task_service.get_user_tasks(current_user.username)

    # Get unfinished tasks
    unfinished_tasks = task_service.get_unfinished_tasks()

    # Get all tasks
    all_tasks = task_service.get_all_tasks()

    # Check if user can assign tasks
    can_assign = auth_service.can_user_assign(current_user.username)

    return render_template('tasks.html',
                         user_tasks=user_tasks,
                         unfinished_tasks=unfinished_tasks,
                         all_tasks=all_tasks,
                         can_assign=can_assign)
```

Three separate queries feed the dashboard:

- **`user_tasks`** — tasks where this user is either the assigner or one of the assignees.
- **`unfinished_tasks`** — every task whose status isn't `'Completed'`.
- **`all_tasks`** — every task, completed or not.

Plus the boolean `can_assign`, used by the template to decide whether to show the "Create Task" button.

The template `tasks.html` then renders three sections from these lists.

### `/createtasks` (GET and POST)

```python
@tasks_bp.route('/createtasks', methods=['GET', 'POST'])
@login_required
def create_task():
    """Create a new task"""
    # Check if user can assign tasks
    if not auth_service.can_user_assign(current_user.username):
        flash('You do not have permission to create tasks', 'error')
        return redirect(url_for('tasks.index'))

    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        due_date_str = request.form.get('dueDate')
        priority = request.form.get('priority')
        assignees = request.form.getlist('assignees')

        # Parse due date
        due_date = None
        if due_date_str:
            try:
                due_date = datetime.strptime(due_date_str, '%Y-%m-%d')
            except ValueError:
                flash('Invalid date format', 'error')
                return redirect(url_for('tasks.create_task'))

        # Create task
        task = task_service.create_task(
            title=title,
            description=description,
            due_date=due_date,
            priority=priority,
            assigner=current_user.username,
            assignees=assignees
        )

        if task:
            flash('Task created successfully', 'success')
            return redirect(url_for('tasks.index'))
        else:
            flash('Error creating task', 'error')
            return redirect(url_for('tasks.create_task'))

    return render_template('createTask.html')
```

Key points:

- **Permission check first.** Even logged-in users without `can_assign` are bounced back to `/tasks` with an error message. The frontend hides the button for them too, but the server enforces it independently — never trust the client to police permissions.
- **`request.form.getlist('assignees')`** — when a single form field has multiple values (e.g., a multi-select dropdown sending `assignees=alice&assignees=bob`), `getlist` returns them all as a Python list. `request.form.get('assignees')` would only return the first.
- **`datetime.strptime(due_date_str, '%Y-%m-%d')`** — parse the date string from the form using the given format. If the user typed garbage, this raises `ValueError` and we flash an error.

### `/changestatus` — mark a task complete

```python
@tasks_bp.route('/changestatus', methods=['POST'])
@login_required
def change_status():
    """Change task status"""
    data = request.get_json()
    task_id = data.get('taskId')

    if task_service.update_task_status(task_id):
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'status': 'error'}), 400
```

JSON-style endpoint, called from JavaScript when a user clicks the "Complete" button on a row. `update_task_status` defaults to setting the task to `'Completed'`.

Note: there is no permission check beyond `@login_required` — any logged-in user can mark any task complete. If you wanted to restrict this to assignees only, this is where you'd add that.

### `/claimTask` — assign yourself

```python
@tasks_bp.route('/claimTask', methods=['POST'])
@login_required
def claim_task():
    """Claim a task"""
    data = request.get_json()
    task_id = data.get('taskId')

    if task_service.claim_task(task_id, current_user.username):
        return jsonify({'status': 'success', 'message': 'Task claimed'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Task already claimed or error occurred'}), 400
```

Lets a user add themselves as an assignee. If they're already an assignee, it returns the error message — this is how "Task already claimed" is conveyed.

### `/uploadtaskfile` — attach a file

```python
@tasks_bp.route('/uploadtaskfile', methods=['POST'])
@login_required
def upload_file():
    """Upload a file to a task"""
    task_id = request.form.get('task_id')
    file = request.files.get('file')

    if not file:
        return jsonify({'status': 'error', 'message': 'No file uploaded'}), 400

    if task_service.upload_task_file(task_id, file):
        return jsonify({'status': 'success', 'message': 'File uploaded'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Invalid file type or error occurred'}), 400
```

Uploads come in as `multipart/form-data` because they include a real file alongside the `task_id` field. `request.files.get('file')` retrieves the file as a Werkzeug `FileStorage` object.

The actual saving happens in `task_service.upload_task_file`, where extension validation and timestamped renaming are handled.

### `/users` — directly read user list

```python
@tasks_bp.route('/users', methods=['GET'])
@login_required
def get_users():
    """Get list of all users (for task assignment)"""
    import sqlite3
    import os

    # Get database path
    instance_path = os.path.join(os.getcwd(), 'instance')
    if os.path.exists(instance_path):
        db_path = os.path.join(instance_path, 'signininfo.db')
    else:
        db_path = 'signininfo.db'

    try:
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute('SELECT username FROM signininfo ORDER BY username')
        users = c.fetchall()
        conn.close()

        user_list = [user[0] for user in users]
        return jsonify(user_list), 200
    except Exception as e:
        print(f"Error getting users: {e}")
        return jsonify([]), 500
```

A simple endpoint that returns a JSON array of usernames, used by the "Assign To" dropdown on the create-task form. Notice it pokes the SQLite file directly rather than going through SQLAlchemy. The first `if os.path.exists` block deals with two possible locations for the SQLite database — Flask's `instance/` folder if present, otherwise the current directory.

## The service — `task_service.py`

This module wraps every operation in a try/except, so the route handlers don't have to. Every function follows the same pattern: open a connection, run a query, close the connection, return the result.

### Path helper

```python
def _get_db_path(db_name='tasks.db'):
    """Get the absolute path to the database file"""
    # Use instance folder if it exists, otherwise use current directory
    instance_path = os.path.join(os.getcwd(), 'instance')
    if os.path.exists(instance_path):
        return os.path.join(instance_path, db_name)
    return db_name
```

Same idea as the `/users` route above: prefer the `instance/` folder, fall back to CWD. The leading underscore on `_get_db_path` is a Python convention indicating "this is private to the module."

### Creating a task

```python
def create_task(title, description, due_date, priority, assigner, assignees):
    """Create a new task"""
    try:
        conn = sqlite3.connect(_get_db_path('tasks.db'))
        c = conn.cursor()

        # Format due date
        due_date_str = due_date.strftime('%Y-%m-%d') if due_date else None
        assign_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Insert task
        c.execute('''
            INSERT INTO tasks (task_title, task_description, task_assign_date, task_due_date,
                             task_priority, task_assigner, task_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (title, description, assign_date, due_date_str, priority, assigner, 'Pending'))

        task_id = c.lastrowid

        # Add assignees
        for assignee_name in assignees:
            c.execute('INSERT INTO assignees (task_id, assignee_name) VALUES (?, ?)',
                     (task_id, assignee_name))

        conn.commit()
        conn.close()
        return task_id
    except Exception as e:
        if conn:
            conn.close()
        print(f"Error creating task: {e}")
        return None
```

Step by step:

1. Open SQLite.
2. Format dates as strings (SQLite stores them as text).
3. Insert a row into `tasks`. The `?` placeholders are parameter substitutions — **never** string-format SQL with `f"INSERT ... {title}"` because that opens you to SQL injection. The current code uses parameterized queries correctly.
4. `c.lastrowid` is the auto-generated integer primary key of the row we just inserted.
5. For each assignee, insert a row into `assignees` linking that assignee to this task. This is a classic many-to-many: one task can have many assignees and one assignee can be on many tasks.
6. Commit. Close. Return the new task's id.

### Listing tasks

There are three list functions: `get_user_tasks`, `get_all_tasks`, `get_unfinished_tasks`. They are near-clones — the only differences are the SQL WHERE clause and what they include. Here's the most interesting one:

```python
def get_user_tasks(username):
    """Get tasks for a specific user (assigned or created by them)"""
    try:
        conn = sqlite3.connect(_get_db_path('tasks.db'))
        c = conn.cursor()

        # Query tasks where user is assigner or assignee
        c.execute('''
            SELECT t.task_id, t.task_title, t.task_description, t.task_assign_date, t.task_due_date,
                   t.task_priority, t.task_assigner, t.task_status, GROUP_CONCAT(a.assignee_name) as assignees
            FROM tasks t
            LEFT JOIN assignees a ON t.task_id = a.task_id
            WHERE t.task_assigner = ? OR a.assignee_name = ?
            GROUP BY t.task_id
        ''', (username, username))

        tasks = c.fetchall()

        # Add files to each task
        formatted_tasks = []
        for task in tasks:
            c.execute('SELECT file_path FROM task_files WHERE task_id = ?', (task[0],))
            files = c.fetchall()
            formatted_tasks.append(task + (files,))

        conn.close()
        return formatted_tasks
    except Exception as e:
        print(f"Error getting user tasks: {e}")
        if conn:
            conn.close()
        return []
```

The SQL does two important things:

- **`LEFT JOIN assignees a ON t.task_id = a.task_id`** — for every task, attach the (zero or more) rows from `assignees` that reference it. Without the LEFT, tasks with no assignees would be dropped. LEFT means "keep the left side even when the right side has nothing."
- **`GROUP_CONCAT(a.assignee_name) as assignees`** — for each group (one group per task), concatenate the assignee names into a single comma-separated string. The combination of `GROUP BY t.task_id` and `GROUP_CONCAT` is a tidy way to flatten the many-to-many into one row per task.

After the main query, a second pass attaches the file paths. For each task, we run a small `SELECT file_path FROM task_files WHERE task_id = ?` and append the result as an extra tuple column. The template knows to expect that shape.

### Updating status / claiming

```python
def update_task_status(task_id, status='Completed'):
    """Update task status"""
    try:
        conn = sqlite3.connect(_get_db_path('tasks.db'))
        c = conn.cursor()

        c.execute('UPDATE tasks SET task_status = ? WHERE task_id = ?', (status, task_id))

        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error updating task status: {e}")
        if conn:
            conn.close()
        return False


def claim_task(task_id, username):
    """Claim a task by adding user as assignee"""
    try:
        conn = sqlite3.connect(_get_db_path('tasks.db'))
        c = conn.cursor()

        # Check if user is already an assignee
        c.execute('SELECT * FROM assignees WHERE task_id = ? AND assignee_name = ?',
                 (task_id, username))
        existing = c.fetchone()

        if not existing:
            c.execute('INSERT INTO assignees (task_id, assignee_name) VALUES (?, ?)',
                     (task_id, username))
            conn.commit()
            conn.close()
            return True

        conn.close()
        return False
    except Exception as e:
        print(f"Error claiming task: {e}")
        if conn:
            conn.close()
        return False
```

- `update_task_status` just runs a plain UPDATE.
- `claim_task` first checks whether the user is already an assignee (no duplicate rows). If not, it inserts. The "no-op-on-duplicate" returns `False`, which is what the route turns into the "Task already claimed" message.

### Uploading a file

```python
def upload_task_file(task_id, file):
    """Upload a file for a task"""
    try:
        if file and allowed_file(file.filename):
            # Add timestamp to filename
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            filename = secure_filename(file.filename)
            name, ext = os.path.splitext(filename)
            filename_with_timestamp = f"{name}_{timestamp}{ext}"

            # Save file
            upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)

            filepath = os.path.join(upload_folder, filename_with_timestamp)
            file.save(filepath)

            # Add to database
            conn = sqlite3.connect(_get_db_path('tasks.db'))
            c = conn.cursor()

            c.execute('INSERT INTO task_files (task_id, file_path) VALUES (?, ?)',
                     (task_id, filepath))

            conn.commit()
            conn.close()
            return True
        return False
    except Exception as e:
        print(f"Error uploading file: {e}")
        return False
```

Two safety measures:

- **`allowed_file(file.filename)`** — only file extensions in an allow-list (see below) are accepted.
- **`secure_filename(file.filename)`** — Werkzeug's helper strips any sneaky characters from the filename, e.g. `../../etc/passwd` becomes `etc_passwd`. This prevents path traversal attacks.

Then the filename gets a timestamp suffix so two uploads with the same name don't clobber each other: `report.pdf` becomes `report_20260519143015.pdf`.

The file is saved to disk; its path is recorded in `task_files` linked to the task ID. The template later renders each file's path as a downloadable link.

### Extension allow-list

```python
def allowed_file(filename):
    """Check if file extension is allowed"""
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'csv'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
```

A literal hard-coded list inside the function. Note that this is *different* from the one in `config.py` (`Config.ALLOWED_EXTENSIONS`), which has the same defaults but is configurable. Slight inconsistency: the config value is ignored here. A future cleanup would be to switch this to `current_app.config['ALLOWED_EXTENSIONS']`.

### Files for a task

```python
def get_task_files(task_id):
    """Get all files for a task"""
    try:
        conn = sqlite3.connect(_get_db_path('tasks.db'))
        c = conn.cursor()

        c.execute('SELECT file_path FROM task_files WHERE task_id = ?', (task_id,))
        files = c.fetchall()

        conn.close()
        return files
    except Exception as e:
        print(f"Error getting task files: {e}")
        if conn:
            conn.close()
        return []
```

Used internally by the list functions when they append files to each task row.

## Summary

The tasks module is a typical CRUD (Create, Read, Update, Delete-ish) feature, with two interesting wrinkles:

- It uses **direct SQLite** instead of SQLAlchemy. That's a historical holdover; the model classes exist in `app/models/__init__.py` but aren't used.
- The **many-to-many between tasks and assignees** is implemented with a separate `assignees` table, joined with `LEFT JOIN` and flattened using `GROUP_CONCAT`.

Files are stored on disk in the `UPLOAD_FOLDER` (default `uploads/`), with sanitized names and timestamps appended.

Next: `07-Machines-and-Logs.md`.
