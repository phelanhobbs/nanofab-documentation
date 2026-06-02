# PreciousMetalReader — A Plain-English Guide

This guide explains **PreciousMetalReader**, a NanofabToolkit desktop app that pulls precious-metal usage records from the university system for a given month and produces a tidy summary. Written for a non-coder.

## What it does

When someone uses a Denton evaporator, the Center for Research Equipment & Services (CORES) records the precious metals consumed (gold, platinum, etc.). For billing and bookkeeping, the lab needs to pull those records out of CORES for a given month and reformat them.

PreciousMetalReader is the desktop app that does this. You pick a month and year, choose either a specific tool/metal combination or "all of them," and the app:

1. Connects to the CORES system over the internet.
2. Downloads the matching usage records for that month.
3. Summarizes them into a clean CSV file you can open in Excel.

It is **not** connected to the cleanroom's `nfhistory` server — it talks directly to CORES, which is a separate university system. (It happens to use the same CORES system as `HSCDownloader.py`, which we documented under UNanofabTools, but for a different kind of data.)

## What you see when you open it

A window with:

- A **date picker** at the top — choose a month from a dropdown and type a year.
- A **mode toggle** — "Specific Tool/Metal" or "All Tools/Metals."
- In "specific" mode, a **machine dropdown** (Denton 635, Denton 18, TMV) and a **metal dropdown** (the options update when you pick the machine).
- A **Download** button.
- Status and result information.

## How a session goes

1. Pick a month (e.g. March) and a year.
2. Choose **Specific** if you want a single tool/metal, or **All** to pull everything.
3. If specific, choose the machine, and then the metal from the list that appears.
4. Click **Download**. The app talks to CORES and saves the results as a CSV in a `downloads/` folder next to the app.
5. Open the CSV in Excel (or any spreadsheet) to see the summary.

## Good to know

- The app **only reads** from CORES; it never changes anything there.
- It needs an **internet connection** and a valid access token (the token is built into the app for now).
- All connections are encrypted.
- A log file records what the app did, which helps if downloads fail.
- The downloads end up in a `downloads/` folder next to the app — that's where to look for the resulting CSVs.

## Where it fits

```
   CORES (the records)
        │  download
        ▼
   PreciousMetalReader (this app)
        │  summarize
        ▼
   downloads/<month>_<metal>.csv  → open in Excel
```

In short: a one-button way to pull a month's precious-metal usage from CORES and turn it into a spreadsheet you can hand to billing.
