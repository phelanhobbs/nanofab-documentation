# DentonDecoder — A Plain-English Guide

This guide explains **DentonDecoder**, a desktop app from the NanofabToolkit that reads Denton evaporator `.dat` files or already-converted CSV logs and lets you chart any column over time. Written for a non-coder.

## What it does

A Denton evaporator's control software produces run logs with dozens of fields — chamber pressure, temperatures, power levels, flow rates, and so on. DentonDecoder can convert the machine's `.dat` file into a temporary CSV behind the scenes, or it can open an already-converted CSV directly. Looking at the raw table is hard; what you usually want is a chart of *one specific column* against time.

DentonDecoder is exactly that: a small desktop app where you pick one or more log files, choose which column to chart, and immediately see the graph. You can optionally switch to a logarithmic scale (helpful for vacuum-pressure data, which spans many orders of magnitude) and align multiple runs in time.

It is **not** the same as the DAT tools in UNanofabTools. DentonDecoder is a desktop GUI that can convert a selected `.dat` file and then graph arbitrary columns. The UNanofabTools DAT tools are command-line helpers focused on cleaning Denton 635 event logs and making pressure plots.

## How you use it

1. Launch the app and pick one or more Denton `.dat` or CSV log files.
2. Choose which column to chart from a dropdown (it lists every column the file contains).
3. The chart appears, showing that column over time.
4. Optionally tick a "log scale" box for pressure data, align multiple files in time, or save the chart as an image.

The default column when you first open a file is "Chamber Pressure (Torr)" — usually the most interesting one.

## What the chart shows

- The **x-axis** is time in seconds since the run started. Each row's timestamp (in `HH:MM:SS` form) is converted to "seconds since the first row."
- The **y-axis** is whatever column you picked.
- Crossing midnight is handled (one rollover correction).

## Good to know

- DentonDecoder only reads original files; `.dat` inputs are converted to temporary CSV files.
- The plotted CSV data needs a header row and `HH:MM:SS` timestamps in the first column.
- It runs locally — no internet required.
- The packaged Windows executable opens like any other program; no Python installation needed.
- If the app fails to start, a windowed error dialog appears with detailed diagnostics you can copy and send to a developer.

In short: a one-click way to turn Denton run logs into charts, with column selection, multi-file alignment, and a log-scale option for vacuum data.
