const M = require("../meta");

module.exports = {
  filename: "PreciousMetalReader.pptx",
  repo: "NanofabToolkit",
  title: "PreciousMetalReader",
  build(d) {
    d.title_slide({
      kicker: "NANOFABTOOLKIT · TOOL",
      title: "PreciousMetalReader",
      subtitle: "Pull a month's precious-metal usage from CORES and turn it into a spreadsheet.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers PreciousMetalReader, a small desktop app that downloads precious-metal usage records from the university's CORES " +
        "system for a given month and produces a tidy CSV summary. Useful for billing and bookkeeping. No coding background needed. We'll also " +
        "clarify what makes this app distinct from the other CORES tool, HSCDownloader.",
    });

    d.bullets({
      title: "Why it exists",
      bullets: [
        "Denton evaporators consume precious metals — gold, platinum, and so on.",
        "CORES (the university's records system) logs each charge.",
        "For billing each month, the lab needs that data in a spreadsheet.",
        "This app downloads it and formats it without any manual web clicking.",
      ],
      notes:
        "Set up the why. When someone runs a Denton evaporator, CORES records the precious metals used. For billing and bookkeeping, the lab " +
        "needs that data, by month, in a spreadsheet. Doing this through the CORES website would be slow and click-heavy; this app turns it " +
        "into one click.",
    });

    d.code({
      title: "Where the data comes from",
      intro: "Not from our server — from a different university system:",
      code:
"  CORES (university records, via 'n8n' webhook)\n" +
"      │   GET line_item_batch_pull?service_ids=...\n" +
"      ▼\n" +
"  PreciousMetalReader (this app)\n" +
"      │   summarize, save as CSV\n" +
"      ▼\n" +
"  downloads/<month>_<metal>.csv  →  open in Excel",
      caption: "CORES holds the records; this app downloads and formats them. Our server isn't involved.",
      notes:
        "Make the data path explicit. The app talks directly to CORES (specifically a service called n8n that exposes CORES's data). It does " +
        "NOT go through the cleanroom's nfhistory server. The data flows: CORES → this app → a CSV in your downloads folder. Don't go looking " +
        "for these records on the nfhistory server; they live in CORES.",
    });

    d.twocol({
      title: "Cousin tool: HSCDownloader",
      left: {
        heading: "PreciousMetalReader (here)",
        items: [
          "Talks to CORES n8n.",
          "Specifically precious-metal line items.",
          "On-demand, run by a person.",
        ],
      },
      right: {
        heading: "HSCDownloader (UNanofabTools)",
        items: [
          "Also talks to CORES n8n.",
          "Pulls per-machine run forms.",
          "Continuous, scheduled, unattended.",
        ],
      },
      notes:
        "Acknowledge the cousin. Both apps fetch from the same CORES n8n system, but they pull different datasets and serve different purposes. " +
        "PreciousMetalReader is human-driven (you pick a month and run it once); HSCDownloader runs continuously to keep the website's machine " +
        "pages fresh. Same warehouse, different shipments.",
    });

    d.steps({
      title: "How a session goes",
      steps: [
        { h: "Pick month and year", d: "month from a dropdown; year typed in." },
        { h: "Specific or all?", d: "one tool/metal, or every tool/metal at once." },
        { h: "If specific, pick the machine + metal", d: "the metal list updates per machine." },
        { h: "Download", d: "the app fetches from CORES and writes a CSV." },
        { h: "Open the CSV", d: "in Excel for the summary." },
      ],
      notes:
        "Walk a session. Choose a month and year. Choose specific or all. If specific, choose the machine (Denton 635, Denton 18, TMV) — the " +
        "metal list updates automatically — then choose the metal. Click Download. The app talks to CORES and saves a CSV in a downloads " +
        "folder next to the app, ready to open in a spreadsheet. That's the whole flow.",
    });

    d.bullets({
      title: "What the app does behind the scenes",
      bullets: [
        "Computes the correct date range for that month (leap years included).",
        "Calls one CORES web service (specific) or several (all).",
        "Parses each response and combines the records.",
        "Summarizes line items per metal and writes a CSV.",
      ],
      notes:
        "Demystify the work. It computes the right date range (e.g. February in a leap year is 29 days). For 'specific' it calls one CORES " +
        "endpoint; for 'all' it loops over the dozen or so endpoints covering every metal/tool combination, combining responses and skipping " +
        "any that returned no data. It then groups the line items by metal, sums the charges, and writes the result as CSV. The raw downloads " +
        "are also kept in case you need them.",
    });

    d.bullets({
      title: "About the access token",
      bullets: [
        "CORES requires a secret token to prove the app is allowed to read.",
        "The token is currently written into the app itself.",
        "Standard expectation: move it into a protected setting and rotate it.",
        "On the to-fix list — it's a real credential.",
      ],
      notes:
        "Be candid about the security caveat. CORES needs a bearer token to authorize the request. Right now the token is in a Python file " +
        "shipped with the app, which is a credential leak risk — anyone with a copy of the app has the token. The recommendation in the " +
        "developer notes is to move it out into a protected setting and rotate it. Same recommendation applies to HSCDownloader.",
    });

    d.bullets({
      title: "Diagnostics and where files land",
      bullets: [
        "Every action goes into a log file in a logs/ folder.",
        "Downloaded CSVs land in a downloads/ folder next to the app.",
        "On startup errors, a friendly message box appears.",
        "Packaged as a Windows executable (PyInstaller); no Python install required.",
      ],
      notes:
        "Practical pointers. The app keeps a log file with what it did; downloads land in a 'downloads' folder next to the executable. If " +
        "something goes wrong on startup, you get a clear message rather than a silent crash. It's a single .exe to run, which makes life " +
        "easier for non-developer users.",
    });

    d.bullets({
      title: "Good to know",
      bullets: [
        "Read-only: never changes anything in CORES.",
        "Internet connection required.",
        "Encrypted in transit.",
        "Output is a CSV — open in Excel or any spreadsheet.",
      ],
      notes:
        "Operational summary. Read-only with respect to CORES. Internet required. Encrypted. Output is CSV, so any spreadsheet can open it. " +
        "There's no special server-side software involved — just CORES on one end and the app on your computer on the other.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Pick a month → app pulls precious-metal records from CORES → produces a CSV.",
        "Talks to CORES, not our cleanroom server.",
        "Cousin of HSCDownloader; same source, different data.",
        "Watch the embedded access token — move it out for safety.",
      ],
      notes:
        "Wrap up. PreciousMetalReader is a one-button monthly billing helper that talks to CORES directly. Don't confuse it with HSCDownloader " +
        "(same source, different data, different purpose). The headline maintenance item is the embedded token. Questions welcome.",
    });
  },
};
