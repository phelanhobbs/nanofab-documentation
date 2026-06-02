# ParalyneReader — A Plain-English Guide

This guide explains **ParalyneReader**, a NanofabToolkit desktop app for downloading and viewing Parylene-coater run data. Written for a non-coder.

## What it does

The Parylene coater has a Raspberry Pi that streams its analog readings (pressure, vapor, temperature) up to the cleanroom server during every run. The server stitches those streams into one CSV file per completed run and keeps them in a folder.

ParalyneReader is the app you open when you want to **see those runs from your desk**. It:

- Asks the server what Parylene run files are available.
- Lets you pick one (or several) and download them.
- Loads the data and plots it as a chart you can interact with.
- Applies smoothing if you ask, so trends are easier to see through the noise.
- Lets you nudge runs in time to overlay and compare them.

It is the desk-side counterpart to the coater's automatic uploads — the coater pushes data; this app pulls it back out.

## What you see when you open it

A single window with file controls and a chart area. Pressing a "List Files" button populates the list with what's currently on the server (newest first), shown with size and modified date. Pick the runs you care about, download them, and the chart fills in.

You'll also see options to:

- **Smooth** the data (moving averages, low-pass filtering — useful when the raw analog signal is jittery).
- **Normalize** between runs so different scales can be compared.
- **Shift one run in time** to align it with another.

## How a typical session goes

1. Open the app — it logs to a file in `logs/` so a developer can diagnose problems later.
2. Click to list the server's Parylene files. They appear newest-first with file sizes.
3. Pick one or more files and download them. The app uses background workers so the window stays responsive even on slow connections.
4. The chart shows each run's data, one color per run.
5. Smooth, normalize, or time-align as needed to make patterns visible.

## Good to know

- The app **only reads** server files; it never deletes or alters them.
- Downloads happen in the background — the app stays responsive.
- All connections are encrypted, though the app skips certificate verification (the internal certificate isn't in the standard trust store).
- A log file under `logs/paralyne_reader.log` records what the app did, which helps if something goes wrong.
- It connects to the same `/api/paralyne/analog/...` server endpoints documented under the flask server's sensor API session.

In short: a friendly desktop tool to browse, download, and compare Parylene coater run data without leaving your desk.
