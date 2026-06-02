# Path E Operator Protocol

Use this protocol for every module in this script pack.

## Roles

Presenter means the person reading the script and driving slides, terminals, and documents.

Maintainer means the future maintainer receiving the handoff.

Robot means a presenter with no private context. If you are a human with private context, still follow the robot rules. They prevent accidental omissions.

## Script Markers

`READ ALOUD` means read the text verbatim or as close to verbatim as possible.

`SHOW` means switch the visible screen to the named deck, document, source file, web page, or terminal.

`DO` means perform the command or action. If it is unsafe, read the instruction and explain why you are skipping it.

`PAUSE` means stop talking long enough for the maintainer to inspect, write notes, or ask a question.

`ASK` means ask the question and wait for the maintainer to answer in their own words.

`REQUIRE` means do not move on until the maintainer can perform or explain the item.

`LOG` means write down the answer, confusion, or finding in an audit notes file.

`STOP POINT` means the module can end there. Assign homework and schedule the next session.

## Global Safety Rules

READ ALOUD:

"Before we begin, I am going to state the safety rules that apply to every session. We do not show secret values on screen. We do not paste bearer tokens, WiFi passwords, database passwords, Duo secrets, or private keys. We do not edit production files during a handoff unless this has explicitly become a maintenance session. If we enter tmux on the live server, we detach with `Ctrl-b d`. We do not press `Ctrl-c` inside a live service pane. We do not type `exit` inside a live service pane unless we intentionally want to terminate that shell or process."

"If a command might expose secrets, we either do not run it on the projected screen, or we run a safer command that shows only key names, filenames, process names, or service names. The goal is evidence without disclosure."

## Workspace Setup

SHOW:

- [`../../START-HERE.md`](../../START-HERE.md)
- [`../PRESENTATION-GUIDE.md`](../PRESENTATION-GUIDE.md)
- this script pack

DO:

Open terminals in:

```sh
cd nanofab-documentation
cd ../UNanofabTools
cd ../NanofabToolkit
```

If a source repo is missing, stop the source-code portions of the handoff and log that as a handoff risk.

DO:

From the documentation repo, run:

```sh
git status --short --branch
bash support/audit.sh
```

READ ALOUD:

"The documentation repo is not the application source. It is the handoff bundle. The source repos are expected beside it as sibling directories. Whenever we verify code, we use `../UNanofabTools` and `../NanofabToolkit`. If those are missing, the documentation cannot be fully verified."

## Evidence Log

DO:

Create or open a notes file for this handoff. A temporary file is acceptable at first:

```sh
mkdir -p /tmp/nanofab-path-e
touch /tmp/nanofab-path-e/handoff-notes.md
```

Use this structure:

```md
# Path E Handoff Notes - YYYY-MM-DD

## Participants
- Presenter:
- Maintainer:

## Repos
- nanofab-documentation:
- UNanofabTools:
- NanofabToolkit:

## Live Server Access
- Access available:
- User used:
- Survey snapshot:

## Questions That Need Documentation
- None yet.

## Findings
- None yet.
```

READ ALOUD:

"Any answer that depends on memory gets written down. Any confusion that lasts more than a minute becomes either a documentation update, a known-issues item, or an explicit open question. A good handoff removes dependence on Faith, including dependence on vague recollection."

## Source Of Truth Order

READ ALOUD:

"When two things disagree, we use this source-of-truth order. First is live production state observed directly on `nfhistory`. Second is current source code in the active production checkout. Third is current source code in the canonical Git repos. Fourth is database schemas, migrations, and live database introspection. Fifth is current developer documentation. Sixth is layman documentation and slides. Seventh is historical snapshots. Last is memory, assumptions, old chat notes, or what someone remembers."

"If a lower source disagrees with a higher source, we update the lower source or write a known-issues item explaining why it is intentionally different."

## Explain-Back Standard

At the end of every module, the maintainer must explain the module in their own words. The presenter must not rescue the answer too early.

ASK:

| Question | Expected answer |
|---|---|
| What did this module establish? | The maintainer should summarize the module's core fact, workflow, or decision rule in their own words, not quote the slide title. |
| What file or live evidence proves it? | They should name the specific deck, README, developer doc, source file, audit output, live command, or snapshot used as evidence. |
| What part is Nanofab-owned? | App code, docs, known-issues updates, `HSCDownloader.py`, the Flask app, chem DB usage, data trees, and work under `/home/phelan/` when applicable. |
| What part is University IT-owned? | VM infrastructure, root, `/root/`, root SSH, UNIX account creation, VM-level backup, base patching, and firewall-level infrastructure when applicable. |
| What should be checked again later? | Any source/live drift, missing evidence, unresolved question, backup coverage, access state, or known issue that was not fully verified during the module. |

REQUIRE:

The maintainer can answer without reading the script word for word. If they cannot, repeat the relevant section, open the referenced docs, and log what was unclear.

## Stop Conditions

Stop a module immediately if:

- a secret appears on screen;
- a live production command would be unsafe;
- a source repo is missing and the module depends on source inspection;
- the maintainer cannot explain a prerequisite module;
- a documented path or command appears stale;
- the presenter does not know whether an action is Nanofab-owned or IT-owned.

READ ALOUD:

"Stopping is not failure. Stopping is how we avoid inventing answers. When we stop, we write down what blocked us and decide what evidence would resolve it."

## End-Of-Session Closeout

At the end of each session:

DO:

1. Review the notes file.
2. List every unanswered question.
3. Assign reading or evidence collection for the next session.
4. Confirm no secrets were copied into notes.
5. If documentation was edited, run `bash support/audit.sh` and `git diff --check`.

READ ALOUD:

"The handoff is cumulative. We do not rely on remembering what happened last time. We leave each session with notes, homework, and a clear next step."
