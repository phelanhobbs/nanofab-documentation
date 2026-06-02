const M = require("../meta");

module.exports = {
  filename: "DAT-Tools.pptx",
  title: "DAT Tools",
  build(d) {
    d.title_slide({
      kicker: "UNANOFABTOOLS · TOOL",
      title: "DAT Tools",
      subtitle: "DATfixer & DATgrapher — reading the Denton 635's logs.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This is a short, self-contained session on two small command-line utilities: DATfixer and DATgrapher. They exist to make the Denton " +
        "635 sputter system's log files readable. No coding background needed. By the end you'll know what problem they solve, how to run " +
        "them, and which one to reach for. It's a good example of a 'small but real' tool in the repository.",
    });

    d.bullets({
      title: "The problem: unreadable machine logs",
      intro: "The Denton 635 writes its logs in its own binary format.",
      bullets: [
        "Every run, the Denton 635 saves a log file ending in .DAT.",
        "That file is 'binary' — raw bytes, not letters; open it and you see gibberish.",
        "The useful data (pressures, timestamps, events) is in there, just encoded.",
        "We need a way to translate it into something a person can read.",
      ],
      notes:
        "Set up the why. The Denton 635 is an automated sputter-deposition system. Each run it writes a .DAT log in its own binary format — " +
        "meaning it stores numbers and control codes as raw bytes, not readable text. Open it in Notepad and it's a jumble. But the real data " +
        "is in there: chamber pressure over time, timestamps, machine states. These tools exist to decode that.",
    });

    d.twocol({
      title: "Two tools, two jobs",
      left: {
        heading: "DATfixer — the translator",
        items: [
          "Reads a raw .DAT file.",
          "Writes a clean, readable .txt file.",
          "Can also draw a graph directly.",
        ],
      },
      right: {
        heading: "DATgrapher — the chart maker",
        items: [
          "Reads a cleaned .txt file.",
          "Draws a pressure-vs-time graph.",
          "Shows it on screen or saves an image.",
        ],
      },
      notes:
        "Frame the pair simply. DATfixer is the translator: raw binary in, readable text out. DATgrapher is the chart maker: cleaned text in, " +
        "a pressure-over-time graph out. You usually run DATfixer first, then DATgrapher on its output — though DATfixer can also produce a " +
        "graph itself in one step. Translator then chart maker.",
    });

    d.steps({
      title: "The typical workflow",
      steps: [
        { h: "Locate the .DAT file", d: "on the same Windows machine as the tools." },
        { h: "Run DATfixer", d: "translate the .DAT into a readable _cleaned.txt." },
        { h: "Read or graph", d: "open the text, or run DATgrapher on it for a chart." },
      ],
      notes:
        "Walk the normal path. Find the .DAT on the machine, run DATfixer to get a cleaned text file (named the same with '_cleaned' added), " +
        "then either read that text directly or feed it to DATgrapher for a chart. Mention these are command-line tools run from PowerShell on " +
        "Windows, on the same machine that holds the file — they're not part of the website.",
    });

    d.code({
      title: "What's inside a .DAT file",
      intro: "DATfixer recognizes the Denton's byte markers and decodes them:",
      code:
"  raw bytes:   05 00 [8 bytes] 08 00 .. 00 ...\n" +
"                 │       │         │\n" +
"                 │       │         └─ field separator → a comma\n" +
"                 │       └─ an 8-byte number → a pressure value\n" +
"                 └─ 'a measurement follows' marker\n\n" +
"  becomes:    15:14:33), [0.000000486000], Auto, ...",
      caption: "Markers and raw numbers in → readable, comma-separated text out.",
      notes:
        "Give a peek under the hood without requiring code skills. DATfixer walks the file looking for the Denton's markers. A specific 2-byte " +
        "marker means 'a measurement follows,' and the next 8 bytes are a number — the chamber pressure — which it writes in brackets. Another " +
        "marker means 'separate these,' which it turns into a comma. It also strips the invisible junk characters and lines up timestamps. The " +
        "result is a tidy, comma-separated, human-readable line. The exact byte values were reverse-engineered from the machine's output.",
    });

    d.steps({
      title: "DATfixer, step by step",
      steps: [
        { h: "Decode measurements", d: "turn the byte markers into bracketed pressure numbers." },
        { h: "Insert separators", d: "turn delimiter markers into commas." },
        { h: "Strip the junk", d: "remove invisible control characters." },
        { h: "Tidy up", d: "put each timestamp on its own line; align the data." },
        { h: "Save", d: "write the result as a .txt next to the original." },
      ],
      notes:
        "This is the detailed 'what DATfixer does' slide. In order: decode the measurement markers into bracketed numbers; convert delimiter " +
        "markers to commas; remove the invisible control characters that made it unreadable (keeping line breaks and tabs); tidy the layout so " +
        "each timestamp starts a line and items are comma-separated; and finally save a .txt. The original .DAT is never modified.",
    });

    d.table({
      title: "Running DATfixer",
      intro: "Minimum: python.exe .\\DATfixer.py YourLog.DAT",
      headers: ["Option", "What it does"],
      rows: [
        ["-o NAME", "Save the cleaned file somewhere else / under a new name"],
        ["--graph", "Also draw a pressure-vs-time graph as a .png"],
        ["--strict", "Remove even line breaks and tabs (denser, rarely needed)"],
        ["--raw", "Skip the 'make it pretty' formatting"],
        ["--no-commas", "Don't insert commas between items"],
        ["-h / --help", "Show the help message"],
      ],
      colW: [3.2, 8.7],
      notes:
        "Show the command and the options. The bare command produces YourLog_cleaned.txt. The most common addition is --graph, which also saves " +
        "a PNG chart. The others are situational: -o to redirect output, --strict/--raw/--no-commas to change formatting. -h prints all of " +
        "them. Don't read every row aloud; point out the bare command and --graph as the two people will use most.",
    });

    d.bullets({
      title: "DATgrapher: charting the pressure",
      bullets: [
        "Reads a cleaned text file and finds each timestamp and pressure.",
        "Converts timestamps to 'seconds since the run started.'",
        "Plots pressure over time — on screen by default.",
        "A log scale option makes the huge range of vacuum pressures readable.",
      ],
      notes:
        "Explain DATgrapher. It scans a cleaned file for timestamps and bracketed pressure values, turns the times into seconds-from-start, " +
        "and plots pressure over time, popping up a window by default. The --log option is genuinely useful: vacuum pressures span many orders " +
        "of magnitude during a pump-down, and a logarithmic scale shows the whole curve instead of squashing the small numbers flat.",
    });

    d.table({
      title: "Running DATgrapher",
      intro: "Minimum: python.exe .\\DATgrapher.py YourLog_cleaned.txt",
      headers: ["Option", "What it does"],
      rows: [
        ["-o NAME", "Save the graph to an image file"],
        ["--no-display", "Don't pop up a window; just save the image"],
        ["--log", "Use a logarithmic scale for the pressure axis"],
        ["-h / --help", "Show the help message"],
      ],
      colW: [3.2, 8.7],
      notes:
        "The DATgrapher command and options. Point it at the cleaned .txt, not the raw .DAT. By default it shows the graph; --no-display saves " +
        "without a window (useful on a machine with no screen), and --log switches to the logarithmic pressure axis. Simpler than DATfixer — " +
        "four options.",
    });

    d.twocol({
      title: "Which tool when?",
      left: {
        heading: "Use DATfixer",
        items: [
          "To read a Denton log as text.",
          "For a quick graph in one step (--graph).",
        ],
      },
      right: {
        heading: "Use DATgrapher",
        items: [
          "To plot an already-cleaned file.",
          "To re-plot with a log scale.",
        ],
      },
      notes:
        "A quick decision aid. Reach for DATfixer to turn a raw log into readable text, or to get a fast graph in a single command. Reach for " +
        "DATgrapher when you already have cleaned files and want to chart them — especially to re-plot with a log scale. If in doubt: DATfixer " +
        "first, DATgrapher second.",
    });

    d.bullets({
      title: "Good to know (and a few rough edges)",
      bullets: [
        "The tools never change your original .DAT — they only read it.",
        "Point DATgrapher at the cleaned .txt, not the raw .DAT.",
        "Runs longer than a day aren't fully handled (a midnight-only correction exists).",
        "If only a few data points are found, you'll get a warning — usually a wrong-format input.",
      ],
      notes:
        "Set honest expectations. Originals are safe — read-only. A common mistake is pointing DATgrapher at the raw .DAT; use the cleaned " +
        "text. The time handling assumes a run within a day with at most one midnight crossing. And a 'few data points' warning almost always " +
        "means the input wasn't the expected format. These rough edges are documented in the developer notes for whoever maintains the tools.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Denton 635 logs are binary .DAT files — unreadable as-is.",
        "DATfixer translates them into clean text (and can graph).",
        "DATgrapher charts pressure vs. time from cleaned text.",
        "Both are command-line tools run on Windows; originals stay untouched.",
      ],
      notes:
        "Wrap up. Two small, focused tools: one translates the Denton's binary logs to readable text, the other charts the pressure. Run them " +
        "from PowerShell, originals are never modified. That's the whole story — a clean example of a small utility doing one job well. Open " +
        "for questions.",
    });
  },
};
