# Module 1 - Big Picture Of The Server

## Goal

The maintainer can describe the whole system in plain English before seeing implementation detail: who uses it, what data enters it, what data leaves it, where it runs, and what the major ownership boundaries are.

## Required Screen

SHOW:

- [`../../presentation/UNanofabTools/flaskserver/slides/00-Start-Here-Index.pptx`](../../presentation/UNanofabTools/flaskserver/slides/00-Start-Here-Index.pptx)
- [`../../presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx`](../../presentation/UNanofabTools/flaskserver/slides/01-Server-Overview.pptx)
- [`../../presentation/UNanofabTools/flaskserver/README.md`](../../presentation/UNanofabTools/flaskserver/README.md)
- [`../../documentation/UNanofabTools/flaskserver/01-architecture.md`](../../documentation/UNanofabTools/flaskserver/01-architecture.md)

## Verbatim Script

READ ALOUD:

"We start with the big picture because code is easier to understand after the system has a shape. `nfhistory` is not just a Flask app. It is the hub where cleanroom users, machine logs, CORES data, chemical inventory, sensor devices, desktop tools, and University IT-owned infrastructure meet."

SHOW:

Open `00-Start-Here-Index.pptx`.

READ ALOUD:

"This first deck tells us how the slide series is organized. Treat it as the table of contents. We are not trying to memorize every deck. We are learning where truth lives and how each deck maps to a specific part of the documentation and source code."

SHOW:

Open `01-Server-Overview.pptx`.

READ ALOUD:

"The user-facing story is simple. Cleanroom users open a website. They log in. They see tasks, machine pages, machine logs, chemical inventory, and sensor views. Some of that data is entered by people. Some is uploaded by devices. Some is copied from machine-control PCs. Some is pulled from CORES by `HSCDownloader.py`. Some is stored in SQLite. The chemical inventory uses a local PostgreSQL database. A lot of operational data is also stored as file trees: `HSCDATA`, `LogData`, and `uploads`."

"The technical story is that public HTTPS traffic reaches nginx on `nfhistory`. nginx terminates TLS and proxies to the Flask app on loopback. Flask routes requests through blueprints. User-facing routes use login and session checks. Device routes are different: some are intentionally unauthenticated because Pico devices post data to them. The app reads and writes databases and file trees. The result is a website that looks like one application but is actually a coordination point for several data sources."

SHOW:

Open [`../../documentation/UNanofabTools/flaskserver/01-architecture.md`](../../documentation/UNanofabTools/flaskserver/01-architecture.md).

READ ALOUD:

"This architecture document is the technical version of the overview deck. The deck is useful for presentation. This document is useful when something breaks. Notice that the docs should name real paths, real modules, real databases, and real dependencies. We want documentation that can be acted on, not just understood abstractly."

## System Map Exercise

DO:

On a whiteboard or notes file, write:

```text
Users and browsers
  -> nginx and TLS on nfhistory
  -> Flask app
  -> blueprints and services
  -> SQLite, local PostgreSQL, HSCDATA, LogData, uploads

CORES and n8n
  -> HSCDownloader.py
  -> HSCDATA
  -> machine pages

Machine control PCs
  -> file-transfer scripts
  -> LogData
  -> machine pages and plots

Pico devices
  -> device API routes
  -> sensor storage and views

NanofabToolkit desktop tools
  -> local files or nfhistory APIs, depending on tool
```

READ ALOUD:

"This map is intentionally plain. A future maintainer should be able to redraw it without the slides. If they cannot, they are not ready to debug the system. Most operational confusion comes from mixing up the website, the live server, the data pipelines, and the desktop tools."

## Ownership Frame

READ ALOUD:

"There are four boundaries we will repeat constantly. First, user-facing website versus background data supply. Second, application code versus live production state. Third, Nanofab-owned operational surface versus University IT-owned infrastructure. Fourth, current canonical code versus historical or deprecated code."

"University IT owns the VM, root, root SSH, OS-level backup, and base patching. Nanofab owns the Flask app, `HSCDownloader.py`, the chemical inventory's use of PostgreSQL, cleanroom data trees, and everything under `/home/phelan/`. The Nanofab admin has `sudo` as `phelan`, not root. Nanofab cannot create UNIX users. That fact matters because it changes what counts as a fix."

## Explain-Back

ASK:

- What does `nfhistory` do for a normal cleanroom user?
- What data comes from CORES?
- What data comes from machine-control PCs?
- What data comes from Pico devices?
- What is nginx doing?
- What is Flask doing?
- Which data stores are databases?
- Which data stores are file trees?
- What does University IT own?
- What does Nanofab own?

REQUIRE:

The maintainer can draw the system map from memory and identify at least one data producer, one web-facing component, one database, one file tree, and one IT-owned component.

## Stop Point

STOP POINT:

Stop here if the maintainer cannot explain the system map without looking. Assign them to reread the server overview README and architecture doc before the next session.
