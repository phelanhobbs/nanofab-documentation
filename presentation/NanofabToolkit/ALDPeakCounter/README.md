# ALDPeakCounter — A Plain-English Guide

This guide explains the **ALDPeakCounter** desktop app from the NanofabToolkit. Written for a non-coder; terms are defined as they appear.

## What it does

ALDPeakCounter is a small Windows desktop app that **counts and visualizes peaks in pressure-vs-time data files**. In an ALD (atomic layer deposition) run, the chamber pressure rises and falls in a regular pattern; each rise-and-fall is a deposition cycle, so counting the peaks is one way to count the cycles in a run.

You open one or several data files, the app draws the pressure curves and marks the detected peaks, and you can adjust the detection rules and the time alignment between files to compare them side by side.

## What you see when you open it

A single window with four areas:

1. **File controls** at the top — buttons to add files and clear the list.
2. **Peak-detection parameters** — four numbers that control how sensitive the peak detector is.
3. **Time alignment controls** — once files are loaded, a row per file with a slider and number so you can shift each file forward or backward in time to overlay them.
4. **A live chart at the bottom** — each file in its own color, with detected peaks marked. You can click-and-drag a box to zoom in, and there's a "Reset Zoom" button.

## How you use it

A typical session looks like this:

1. Click **Add Files** and pick one or more text data files. Each file's first column is the time, the second column is the pressure.
2. (Optional) Tweak the **detection parameters** — see below for what each one does.
3. Click **Process Files**. The app reads each file, counts the peaks, lists the totals in the text area, and draws the chart with peaks marked.
4. (Optional) Use the **time alignment** sliders to nudge files in time so their cycles line up — useful when comparing two runs that started at different moments.
5. Click-and-drag on the chart to zoom; click **Reset Zoom** to return to the full view.

## The four detection parameters

These control "what counts as a peak":

- **Min Height** — peaks must reach at least this pressure. Leave at 0 to disable.
- **Prominence** — how much a peak must stand out from the curve around it. The default (0.01) is usually a good starting point.
- **Min Distance** — peaks must be at least this many samples apart. The default (10) avoids counting noise wiggles.
- **Min Width** — peaks must be at least this wide. Leave at 0 to disable.

Tighten the parameters if you're seeing too many peaks; loosen them if it's missing real ones.

## Time alignment

Each loaded file gets its own row of controls. The slider goes from -50 to +50 (you can also type a number into the box). Click **Apply** to shift that file by that amount, **Zero** to reset just that file, or the master **Reset All Offsets** button to zero everything. This is purely a visual aid for comparing runs — it doesn't change the underlying files.

## Good to know

- The app only **reads** files; it never changes the originals.
- It expects plain text files with a header row and tab-separated columns; the first two columns are time and pressure.
- The peak detector uses a standard, well-tested algorithm, with a small extra rule to catch a peak right at the end of a run that simple methods miss.
- It runs locally on your machine; no internet connection is needed.
- If something goes wrong on startup, a windowed error dialog opens with a detailed message you can copy and send to a developer.

In short: a focused desktop tool for counting cycles in an ALD log and visually comparing multiple runs together.
