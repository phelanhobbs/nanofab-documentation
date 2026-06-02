const M = require("../meta");

module.exports = {
  filename: "07-Machines-and-Logs.pptx",
  title: "Machines & Logs",
  build(d) {
    d.title_slide({
      kicker: "PART 07",
      title: "Machines & Log Files",
      subtitle: M.series + "\nA page for every tool, plus safe file downloads and graphs.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers the machines portal: a web page per cleanroom tool showing data tables and graphs, plus browsers for raw log " +
        "files with download and graphing. There's also a nice security detail in how downloads are protected. All of these pages require " +
        "login. Keep it concrete — staff will recognize these pages.",
    });

    d.bullets({
      title: "What the machines portal provides",
      bullets: [
        "One page per tool: ALD, E-beam, MOCVD, PECVD, furnaces, dry etchers, and more.",
        "Each page shows a sortable table of that tool's data.",
        "Some pages add graphs of key columns over time.",
        "Tools that produce run logs also get a file browser.",
        "Every page requires login.",
      ],
      notes:
        "Describe the portal. Roughly seventeen tools each get a page. The page reads that tool's summary spreadsheet and shows it as a " +
        "sortable table; some pages also draw graphs of important columns, like ALD chuck and precursor temperatures. Tools that generate " +
        "per-run log files (like the Parylene coater or the Denton evaporators) additionally get a file browser. All of this is behind login.",
    });

    d.bullets({
      title: "Two kinds of pages",
      intro: "The portal reuses two generic builders.",
      bullets: [
        "Data pages — read a summary spreadsheet, show a table (+ optional graphs).",
        "Log-file pages — list a folder of run logs, newest first, ready to download or graph.",
        "Each tool's route is one line that calls the right builder.",
        "This keeps seventeen pages from being seventeen copies of code.",
      ],
      notes:
        "There are really only two page templates behind everything. A 'data page' reads a tool's summary spreadsheet and renders a table " +
        "plus optional graphs. A 'log-file page' lists a folder of raw run logs sorted newest-first. Each individual tool is then just a " +
        "one-line entry that says 'build me a data page for ALD' or 'build me a log page for Parylene.' That reuse is why adding a tool is " +
        "trivial and why the pages stay consistent.",
    });

    d.bullets({
      title: "Downloading and graphing log files",
      bullets: [
        "Pick a log file to download it, or graph its contents in the browser.",
        "Graphs pick sensible columns automatically (e.g. ALD power, pressure).",
        "Charts are drawn in the browser from data the server prepares.",
        "Files are sorted by the date embedded in their filenames.",
      ],
      notes:
        "From a log-file page you can download a file or view its contents as a graph without leaving the browser. The server knows which " +
        "columns make sense to plot for each tool — forward and reflected power for ALD radio-frequency logs, pressure for pressure logs, " +
        "and so on. The actual chart is drawn in your browser from data the server hands over. The file list is ordered by the date baked " +
        "into each filename, which the server parses.",
    });

    d.steps({
      title: "Safe downloads: the path check",
      intro: "How the server stops a download from escaping its data folder.",
      steps: [
        { h: "Resolve the real path", d: "expand any shortcuts and '..' tricks to a true location." },
        { h: "Confirm it's inside the data folder", d: "the real path must start with the allowed folder." },
        { h: "If outside → refuse", d: "respond 'access denied' instead of serving the file." },
        { h: "If inside → serve it", d: "send the file as a download." },
      ],
      notes:
        "This is the security highlight. A classic attack on file servers is asking for something like '../../secret' to climb out of the " +
        "intended folder. The server defends against it properly: it first resolves the request to a true, canonical location (expanding any " +
        "shortcuts or '..' segments), then checks that the result still lives inside the approved data folder. If it doesn't, the server " +
        "refuses with 'access denied'; only files genuinely inside the folder are served. This 'resolve then verify' approach is the correct " +
        "way to do it.",
    });

    d.bullets({
      title: "A small calculator: ALD deposition rate",
      bullets: [
        "Pick a material, deposition mode, and chuck temperature.",
        "The server filters past ALD runs matching those choices.",
        "It computes rate = thickness ÷ number of cycles for each run.",
        "The results come back as a chart.",
      ],
      notes:
        "One bespoke feature worth a mention: an ALD deposition-rate calculator. You choose a material, a deposition mode, and a chuck " +
        "temperature; the server finds the matching past runs in the ALD spreadsheet, divides measured thickness by number of cycles for " +
        "each, and returns the deposition rates as a chart. It's a small example of the server doing real analysis, not just displaying " +
        "stored data.",
    });

    d.bullets({
      title: "One honest caveat",
      bullets: [
        "The data tables are built from trusted machine spreadsheets.",
        "Those cell values aren't specially escaped when shown.",
        "Fine today because the spreadsheets come from trusted tools.",
        "Worth tightening if untrusted data ever feeds these pages.",
      ],
      notes:
        "A maintenance note for completeness. The machine data tables are built directly from the tools' spreadsheets, and the cell contents " +
        "aren't specially sanitized before display. That's acceptable because the data comes from trusted machine software — but if a future " +
        "change ever let untrusted data into those spreadsheets, the display step should be hardened. A general audience can treat this as a " +
        "footnote.",
    });

    d.table({
      title: "The tools, by category",
      headers: ["Category", "Tools"],
      rows: [
        ["Deposition", "ALD, E-beam, MOCVD, Parylene, PECVD, Denton 635, Denton 18"],
        ["Dry etch", "DRIE, Isotropic, PlasmaLab, PlasmaTherm, Technics"],
        ["Furnaces", "CleanOx, DopedOx, LTO, Nitride, Poly, Allwin"],
      ],
      colW: [3.0, 8.9],
      notes:
        "Show the breadth so the audience recognizes their own tools. Roughly seventeen instruments are grouped into deposition tools, dry " +
        "etch tools, and furnaces. Each appears as a page in the portal. The point isn't the specific list — it's that the portal is the " +
        "single place to find historical data for essentially every major tool in the cleanroom.",
    });

    d.code({
      title: "Adding a tool is one line",
      intro: "Each tool page is a single entry that reuses a builder:",
      code:
"  @route('/ald')\n" +
"  def ald():\n" +
"      return show_machine_page('ALD', graphs=[...])\n\n" +
"  @route('/pecvd')\n" +
"  def pecvd():\n" +
"      return show_machine_page('PECVD')",
      caption: "Seventeen tools, seventeen tiny entries — all sharing one builder.",
      notes:
        "Reinforce the reuse payoff. Each tool's page is essentially one short entry that calls a shared builder with the tool's name (and " +
        "optionally which columns to graph). Because the heavy lifting is in the shared builder, the pages stay consistent and adding a new " +
        "tool is trivial — a future maintainer copies one entry and changes the name. This is good engineering: write the logic once, reuse it " +
        "everywhere.",
    });

    d.bullets({
      title: "Where the machine data comes from",
      bullets: [
        "Summary tables come from per-tool spreadsheets in a data folder (HSCDATA).",
        "Raw run logs are dropped into a logs folder (LogData) by transfer scripts and Pis.",
        "The portal reads those files; it doesn't collect the data itself.",
        "So the portal is a viewer over files other systems produce.",
      ],
      notes:
        "Clarify the data source so expectations are right. The portal doesn't gather data from the tools directly — it reads files that other " +
        "processes deposit: summary spreadsheets in one folder and raw run logs in another, placed there by transfer scripts and the Raspberry " +
        "Pis. The portal is essentially a polished viewer over those files. That separation is why the sensor and consumer sessions matter: " +
        "they're what fill these folders.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "A consistent page per tool: tables, optional graphs, and log browsers.",
        "Two reusable builders power all of it.",
        "Downloads are protected by a resolve-then-verify path check.",
        "Everything here requires login.",
      ],
      notes:
        "Summarize. The portal gives every tool a uniform page, built from two reusable templates, with properly guarded downloads. Next " +
        "session shifts from people-facing pages to the machine-facing side: how the Raspberry Pi sensors push data into the server.",
    });
  },
};
