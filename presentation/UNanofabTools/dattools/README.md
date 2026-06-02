# DAT Tools — A Plain-English Guide

This guide explains two small programs in the UNanofabTools repository: **DATfixer** and **DATgrapher**. It's written for someone without a coding background. If a term is unfamiliar, it's defined the first time it appears.

## What problem do these tools solve?

The **Denton 635** is an automated sputter-deposition system in the cleanroom. Every time it runs, it writes a log of what happened — timestamps, pressures, and machine events — into a file ending in `.DAT`.

The catch: that `.DAT` file is written in the machine's own **binary format**. "Binary" here means it's not plain text — if you open it in Notepad, you see a jumble of unreadable symbols, because the numbers and control codes are stored as raw bytes rather than as letters you can read. The useful information (like the chamber pressure at each moment) is in there, but it's encoded.

These two tools turn that jumble into something a human can use:

- **DATfixer** reads a raw `.DAT` file and writes out a clean, readable `.txt` file — and can optionally draw a graph.
- **DATgrapher** takes a cleaned `.txt` file and draws a pressure-versus-time graph you can look at or save.

Think of DATfixer as the *translator* and DATgrapher as the *chart maker*. You usually run DATfixer first, then DATgrapher on its output (though DATfixer can also make a graph directly).

## Where they run

These are **command-line tools** — you run them by typing a command, not by clicking an icon. They're meant to be run on a Windows machine (the same one that has the `.DAT` file) from PowerShell, which is Windows' built-in command window. They are not part of the website/server; they're standalone helpers a person runs by hand when they need to read a Denton log.

They rely on two common add-on libraries — **matplotlib** (for drawing graphs) and **numpy** (for number handling) — which need to be installed once on the machine.

## DATfixer: the translator

### What it does, step by step

1. It opens the raw `.DAT` file and reads all the bytes.
2. It looks for a specific marker the Denton uses to mark a measurement, and decodes the eight bytes after it into a real number (a pressure reading). It writes that number in square brackets, like `[0.000000486000]`.
3. It looks for another marker the Denton uses to separate pieces of information, and replaces it with a comma.
4. It strips out the leftover invisible "control characters" that made the file unreadable (while keeping useful ones like line breaks and tabs).
5. It tidies the result: it puts each timestamp on its own line and adds commas between items so the data lines up neatly.
6. It saves the cleaned result as a `.txt` file. By default the new file has the same name as the original with `_cleaned` added.

The result is a text file where each line looks roughly like a timestamp followed by readings and machine states, separated by commas — something you can open, read, search, or paste into a spreadsheet.

### How to run it

In PowerShell, navigate to the folder containing the program and your `.DAT` file, then type:

```
python.exe .\DATfixer.py YourLogFile.DAT
```

That's the minimum — it produces `YourLogFile_cleaned.txt` next to the original.

### The options

You can add any of these to change the behavior:

- `-o NAME` (or `--output NAME`) — save the cleaned file somewhere else, or under a different name.
- `--strict` — remove *all* invisible characters, including line breaks and tabs. Produces a denser, less readable file; rarely needed.
- `--raw` — skip the "make it pretty" formatting. You get the decoded data without the timestamp-per-line and tidy spacing.
- `--no-commas` — don't insert commas between items.
- `--graph` — in addition to the text file, draw a pressure-vs-time graph and save it as a `.png` image with the same name.
- `-h` (or `--help`) — print a help message listing all of these.

So a common "give me the text and a graph" command is:

```
python.exe .\DATfixer.py YourLogFile.DAT --graph
```

## DATgrapher: the chart maker

### What it does

DATgrapher reads a *cleaned* text file (the kind DATfixer produces) and makes a pressure-versus-time chart. It scans each line for a timestamp and a bracketed pressure value, converts the timestamps into "seconds since the run started," and plots pressure over time. By default it pops the chart up on screen; you can also save it to an image file.

### How to run it

```
python.exe .\DATgrapher.py YourLogFile_cleaned.txt
```

This opens a window showing the graph.

### The options

- `-o NAME` (or `--output NAME`) — save the graph to an image file at this path.
- `--no-display` — don't pop up a window; just save the image (useful when running on a machine with no screen). If you use this without `-o`, it saves a `.png` next to the input.
- `--log` — use a logarithmic scale for the pressure axis. This is helpful because vacuum pressures span a huge range (from near atmospheric down to very tiny numbers); a log scale makes the whole pump-down visible at once instead of squashing the small numbers flat.
- `-h` (or `--help`) — print the help message.

## Which tool should I use?

- Just want to *read* a Denton log? Run **DATfixer** and open the resulting `.txt`.
- Want a *quick graph*? Run **DATfixer** with `--graph`, or run **DATgrapher** on an already-cleaned file.
- Already have cleaned files and want to *re-plot* them (e.g. with a log scale)? Use **DATgrapher**.

## Good to know

- These tools only read your files; they don't change the original `.DAT`. The original is always preserved.
- DATgrapher expects DATfixer's *cleaned* output, not a raw `.DAT`. Point it at the `.txt`, not the `.DAT`.
- A run that crosses midnight is handled with a small correction, but logs spanning more than one full day aren't something these tools were designed for.
- If only a few data points are found, the tools print a warning — usually a sign the input wasn't the expected format.

That's the whole story: one tool to translate the Denton's binary logs into readable text, and one to chart the pressure over time.
