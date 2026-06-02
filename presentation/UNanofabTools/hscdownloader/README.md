# HSC Downloader — A Plain-English Guide

This guide explains `HSCDownloader.py`, the program that fetches machine usage data and prepares the spreadsheets the website displays. Written for a non-coder; terms are defined as they appear.

## What it does, in one sentence

HSCDownloader is the program that **regularly downloads each machine's run data from the university's records system and saves it as spreadsheets**, so the website's machine pages have something to show.

## Why it exists

When someone uses a cleanroom tool, they fill out a digital form recording the run (what was deposited, the settings, the results, and so on). Those forms are stored in a university system called **CORES** (the Center for Research Equipment & Services), behind a web service called n8n.

That data isn't directly usable by our website — it lives in CORES, in CORES's format. HSCDownloader bridges the gap:

1. It asks CORES for each machine's form data.
2. It tidies and reshapes that data into clean spreadsheets.
3. It saves those spreadsheets where the website can read them.

Think of it as the **supply line**: CORES is the warehouse, HSCDownloader is the delivery truck, and the website is the store shelf. (This is the same CORES system the "Precious Metal Reader" uses — a different part of the same warehouse.)

## How it works

HSCDownloader runs continuously and, on a schedule, does the following for each machine:

1. **Download.** It calls CORES's web service for that machine, using a secret access token to prove it's allowed.
2. **Reshape.** It takes the raw data and turns it into a neat table (using the data-handling library *pandas*).
3. **Save two versions.** For each machine it writes a full spreadsheet and a trimmed-down "small" version. The website's machine pages read the "small" versions.

It does this for essentially every tool in the cleanroom — deposition tools (ALD, E-beam, MOCVD, Parylene, the Dentons), dry-etch tools (DRIE, Isotropic, PlasmaLab, PlasmaTherm, Technics), and furnaces (CleanOx, DopedOx, LTO, Nitride, Poly, Allwin), among others. A PECVD recipe exists in the code, but the scheduled loop currently leaves it disabled.

Each machine has its own "recipe" function inside the program (for example, `saveALD`, `saveEbeam`, `saveDenton635`) that knows which columns matter for that tool and how to format them.

## Where it fits in the bigger picture

```
   CORES (n8n)  ──►  HSCDownloader  ──►  HSCDATA spreadsheets  ──►  the website's
   (the records)     (this program)     (small_<Machine>.csv)       machine pages
```

So when you open a machine's page on the website and see a table of recent runs, those numbers were fetched and formatted by HSCDownloader. If a machine page looks stale or empty, HSCDownloader is the first place to look.

## Good to know

- It **only reads** from CORES and **writes** spreadsheets locally; it never changes the original records in CORES.
- It runs on a **schedule**, automatically and unattended, and is designed to shut down cleanly when asked.
- It uses a **secret access token** to talk to CORES. That token is currently written into the program itself, which the developer notes flag as something to move into a protected setting.
- Each machine's formatting lives in its own function, so adding or adjusting a machine is a localized change.
- A couple of machines are noted in the code as "currently has no data" — expected gaps, not bugs.

In short: HSCDownloader is the quiet supply line that keeps the website's machine data current by pulling it from CORES and laying it out as spreadsheets the site can display.
