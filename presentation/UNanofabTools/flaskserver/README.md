# UNanofabTools Server — A Plain-English Guide

This folder contains a thorough, layperson-friendly explanation of the UNanofabTools **server** code. It is intended to be the source material for a presentation, but it also stands on its own as documentation.

## What's in here

The server has been broken into focused topics so you can read in order, or jump to a specific area. Files are numbered to suggest a reading order, but you don't have to read them in sequence.

| # | File | What it covers |
|---|------|-----------------|
| 01 | `01-Server-Overview.md` | The big picture: what a "server" is, what *this* server does, and who uses it |
| 02 | `02-How-It-Starts.md` | What happens when the server boots: `run.py`, the application factory, blueprints |
| 03 | `03-Configuration.md` | Where the server reads its settings from: `config/config.py`, `.env`, database URLs |
| 04 | `04-Authentication-and-Login.md` | Logging in, signing up, password reset, and the two-factor (Duo) flow |
| 05 | `05-Admin-Panel.md` | Tools for admins: managing users, granting permissions |
| 06 | `06-Tasks.md` | The internal task list (assignments, due dates, file attachments) |
| 07 | `07-Machines-and-Logs.md` | Pages for every machine, plus log-file browsers and downloads |
| 08 | `08-IoT-API-Endpoints.md` | How the Raspberry Pi sensors and shop-floor tools push data to the server |
| 09 | `09-Chemical-Inventory.md` | The chemical inventory system: barcodes, containers, scans, reports |
| 10 | `10-Database-Models.md` | The "tables": Users, Sessions, Tasks, Particle Sensors |
| 11 | `11-Particle-Demo.md` | A small static-file route used for a particle counter demo page |
| 12 | `12-Consumers-NanofabToolkit.md` | How the NanofabToolkit desktop apps and Pico firmware talk to the server |
| 13 | `13-Request-Lifecycle-Walkthrough.md` | What happens, step by step, when a user clicks something or a sensor POSTs data |
| 14 | `14-Security-Model.md` | The security story in one place: sessions, login_required, CORS, Duo, hashing |
| 15 | `15-Endpoint-Reference.md` | A flat list of every URL the server handles, with a one-line description |

## Scope

These documents describe the **modern Flask server** that lives under `app/` plus its supporting files (`run.py`, `config/`, the `.sql` schema).

## How to read the code snippets

Each document quotes pieces of the actual server code. When something is non-obvious, the explanation goes line-by-line; otherwise the explanation describes the function as a whole. Code is shown exactly as it appears in the repository so you can find it back in the source tree.

## A note on terminology

The first document, `01-Server-Overview.md`, defines the key vocabulary: *server*, *client*, *request*, *response*, *endpoint*, *route*, *blueprint*, *database*, *model*, *service*, *template*. If a term in a later document feels unfamiliar, the overview is the place to look first.
