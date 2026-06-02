const M = require("../meta");

module.exports = {
  filename: "DentonDecoder.pptx",
  repo: "NanofabToolkit",
  title: "DentonDecoder",
  build(d) {
    d.title_slide({
      kicker: "NANOFABTOOLKIT · TOOL",
      title: "DentonDecoder",
      subtitle: "Chart any column of a Denton .dat or CSV log against time.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers DentonDecoder, a small desktop app that reads Denton evaporator .dat files or CSV logs and lets you chart any column over time. " +
        "Useful for inspecting a single run's pressure, temperature, power, or any other recorded value. No coding background needed. We'll " +
        "also clarify what makes it different from the DAT tools in UNanofabTools.",
    });

    d.bullets({
      title: "The problem it solves",
      bullets: [
        "Denton runs produce logs with dozens of fields — hard to read raw.",
        "The app can convert .dat inputs to temporary CSV, or open CSV directly.",
        "Usually you only care about one column over time (pressure, temp, etc.).",
        "DentonDecoder lets you pick a column and instantly see the chart.",
        "Optional log scale makes vacuum data readable across many orders of magnitude.",
      ],
      notes:
        "Set up the why. A Denton run produces data with many columns and many rows — useful, but not easy to scan. DentonDecoder can convert " +
        ".dat inputs into a temporary CSV or open a CSV directly. The common need is a chart of just one column over time. The log " +
        "scale option is genuinely useful for vacuum pressure, which spans many orders of magnitude.",
    });

    d.twocol({
      title: "Not the same as DATfixer/DATgrapher",
      left: {
        heading: "DentonDecoder (here)",
        items: [
          "Works on Denton .dat and CSV logs.",
          "GUI conversion to temporary CSV.",
          "Pick any column to chart.",
        ],
      },
      right: {
        heading: "DAT tools (in UNanofabTools)",
        items: [
          "Command-line log cleaning/plotting.",
          "Focused on pressure event logs.",
          "Specifically the Denton 635 event logs.",
        ],
      },
      notes:
        "Important clarification, because they sound similar. DentonDecoder is the desktop GUI workflow: choose .dat or CSV files, convert when " +
        "needed, and graph arbitrary columns. The DAT tools in UNanofabTools are command-line helpers focused on cleaning Denton 635 event logs " +
        "and pressure plots. They overlap in audience, not in workflow.",
    });

    d.steps({
      title: "How you use it",
      steps: [
        { h: "Open the app", d: "and pick one or more Denton .dat or CSV log files." },
        { h: "Choose a column", d: "from a dropdown — the app reads the file's header to list options." },
        { h: "See the chart", d: "rendered immediately; switch columns at will." },
        { h: "Optional: log scale", d: "useful for pressure; align files or save the chart as an image." },
      ],
      notes:
        "Walk through. Open .dat or CSV files. The app converts .dat files, reads the header row, and offers every common column in a dropdown. " +
        "Pick one and the chart appears. Switch columns freely. Toggle log scale for pressure or other huge-range data. Save the chart if needed. " +
        "The default starting column is Chamber Pressure (Torr) — usually the most interesting one.",
    });

    d.code({
      title: "How time is handled",
      intro: "Each row's HH:MM:SS timestamp becomes 'seconds since the first row':",
      code:
"  Row 1: 14:23:05  →  t = 0\n" +
"  Row 2: 14:23:10  →  t = 5\n" +
"  Row 3: 14:23:15  →  t = 10\n" +
"  ...\n" +
"  Crossing midnight is auto-corrected (one rollover).",
      caption: "The x-axis is elapsed time since the run started.",
      notes:
        "Explain the time math briefly. Each timestamp is HH:MM:SS only (no date). The first row's time becomes the zero point, and every " +
        "later row is plotted as seconds since that point. If the run crosses midnight, the app adds 24 hours automatically — for one " +
        "rollover. Runs longer than a day or with multiple midnights aren't supported and are flagged in the developer notes.",
    });

    d.bullets({
      title: "Why a log scale matters",
      bullets: [
        "Vacuum pressure can span from atmospheric to 1e-7 — that's 9 orders of magnitude.",
        "On a regular y-axis the small numbers all sit near zero.",
        "On a log axis you can see the whole pump-down curve clearly.",
        "One checkbox; toggle it as needed.",
      ],
      notes:
        "Make the log-scale option's value concrete. Vacuum pressure during a pump-down spans many orders of magnitude. On a linear scale, " +
        "everything small looks like zero — the early high-pressure portion crushes the rest flat. A logarithmic y-axis spreads the orders " +
        "out evenly so the whole curve is visible. One checkbox toggles it. Most pressure-vs-time inspections want this on.",
    });

    d.bullets({
      title: "What the input file needs to look like",
      bullets: [
        ".dat input convertible by the app, or CSV with a header row.",
        "First column = timestamp in HH:MM:SS form.",
        "Any number of other columns, with their names in the header.",
        "Rows the app can't parse are quietly skipped.",
      ],
      notes:
        "Set expectations on input. .dat files are converted to temporary CSV first. The plotted CSV must have a header row (so the app can list " +
        "column names) and HH:MM:SS timestamps in the first column. Other columns can be anything. Bad rows (non-numeric values, missing fields) " +
        "are skipped without complaint. If a column the app says it found produces only a few points, that's the file format being not quite " +
        "as expected.",
    });

    d.bullets({
      title: "Good to know",
      bullets: [
        "Read-only — never changes the source file.",
        ".dat conversion writes a temporary CSV.",
        "Runs locally; no internet needed.",
        "If startup fails, a windowed error dialog shows full diagnostics.",
        "Packaged as a Windows executable via PyInstaller — no Python install needed.",
      ],
      notes:
        "Practical points. Like its sibling tools, it only reads, never modifies source files; .dat conversion writes a temporary CSV. Runs entirely on your computer. The error-dialog " +
        "fallback on startup is genuinely useful — when the app fails for a non-developer, they get a copyable message instead of a silent " +
        "crash. Packaged with PyInstaller, so it's a single .exe to run.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Open Denton .dat or CSV logs; pick a column; see the chart.",
        "Optional log scale, file alignment, and save-as-image.",
        "Different from the UNanofabTools DAT command-line workflow.",
        "Simple, focused, no surprises.",
      ],
      notes:
        "Wrap up. DentonDecoder is a GUI visualizer for Denton .dat or CSV logs. It complements the DAT tools, not duplicates them. Simple " +
        "input, simple output, useful log-scale option. Questions welcome.",
    });
  },
};
