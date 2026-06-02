const M = require("../meta");

module.exports = {
  filename: "HSC-Downloader.pptx",
  title: "HSC Downloader",
  build(d) {
    d.title_slide({
      kicker: "UNANOFABTOOLS · TOOL",
      title: "HSC Downloader",
      subtitle: "The supply line that keeps the website's machine data current.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers HSCDownloader — the program that regularly pulls each machine's run data from the university's records system and " +
        "saves it as spreadsheets the website can display. It's the supply line behind every machine page. No coding background needed. We'll " +
        "cover why it exists, how it works, where it fits, and a couple of things to watch.",
    });

    d.bullets({
      title: "Why it exists",
      bullets: [
        "When someone uses a tool, they fill out a digital run form.",
        "Those forms live in the university's CORES records system.",
        "That data isn't in a form our website can use directly.",
        "HSCDownloader bridges the gap — it fetches and reformats it.",
      ],
      notes:
        "Set up the why. Every tool use is recorded in a digital form stored in CORES, the university's equipment records system. Our website " +
        "can't read CORES data directly, so HSCDownloader fetches it, reshapes it into clean spreadsheets, and saves them where the website " +
        "can read them. Without it, the machine pages would have nothing to show.",
    });

    d.code({
      title: "Where it fits",
      intro: "The supply line, end to end:",
      code:
"  CORES (the records)\n" +
"        │  download\n" +
"        ▼\n" +
"  HSCDownloader  ──reshape──►  HSCDATA spreadsheets\n" +
"                              (small_<Machine>.csv)\n" +
"                                     │\n" +
"                                     ▼\n" +
"                          the website's machine pages",
      caption: "CORES is the warehouse; HSCDownloader is the truck; the website is the shelf.",
      notes:
        "Trace the flow. CORES holds the records. HSCDownloader downloads them, reshapes them with a data-handling library, and writes " +
        "spreadsheets into the HSCDATA folder. The website's machine pages then read those spreadsheets. So the numbers you see on a machine " +
        "page came through this pipeline. If a page looks stale, HSCDownloader is the first suspect.",
    });

    d.steps({
      title: "What it does, on a schedule",
      steps: [
        { h: "Download", d: "ask CORES for a machine's form data, using a secret token." },
        { h: "Reshape", d: "turn the raw data into a neat table." },
        { h: "Save two versions", d: "a full spreadsheet and a trimmed 'small' one for the website." },
        { h: "Repeat", d: "do this for every machine, automatically, on a schedule." },
      ],
      notes:
        "Walk the cycle. For each machine it downloads the form data (proving it's allowed with a secret token), reshapes it into a table, and " +
        "writes two spreadsheets — a full one and a trimmed 'small' one that the website actually reads. It repeats this for each active tool, " +
        "automatically and unattended, and shuts down cleanly when asked.",
    });

    d.bullets({
      title: "One recipe per machine",
      bullets: [
        "Each tool has its own function: saveALD, saveEbeam, saveDenton635, ...",
        "Each knows which columns matter for that tool and how to format them.",
        "Covers deposition tools, dry-etch tools, and furnaces.",
        "So adjusting one machine is a small, localized change.",
      ],
      notes:
        "Explain the structure. Inside the program, each machine has its own 'recipe' function — saveALD, saveEbeam, and so on — that knows " +
        "that tool's important columns and formatting. It covers essentially every active major tool: deposition, dry etch, and furnaces. Because " +
        "each machine is its own function, changing one tool's output is a contained edit. (The flip side: there's a lot of near-duplicate " +
        "code across them, which the developer notes suggest consolidating.)",
    });

    d.bullets({
      title: "What you see on a machine page came from here",
      bullets: [
        "Open a tool's page → the table of recent runs is from HSCDownloader.",
        "The graphs are drawn from the same downloaded spreadsheets.",
        "Stale or empty machine page? Check HSCDownloader first.",
        "It only reads from CORES — it never changes the original records.",
      ],
      notes:
        "Make the connection concrete. The table and graphs on any machine page trace directly back to the spreadsheets this program writes. " +
        "So if a page is stale or blank, the question is usually 'is HSCDownloader running and reaching CORES?' Reassure that it's read-only " +
        "with respect to CORES — it never alters the source records, only copies and reformats them.",
    });

    d.bullets({
      title: "What CORES is",
      bullets: [
        "CORES = the university's Center for Research Equipment & Services records system.",
        "It stores the digital run forms staff fill out for each tool.",
        "HSCDownloader reads from it through a web service called n8n.",
        "It's the same system the Precious Metal Reader uses — a different part of it.",
      ],
      notes:
        "Define CORES so the source is clear. CORES is the university's equipment-records system; staff log each tool run there via a digital " +
        "form. HSCDownloader pulls that data through a CORES web service (n8n). Worth noting it's the same system another tool — the Precious " +
        "Metal Reader — talks to, just a different dataset, so people don't confuse the two.",
    });

    d.table({
      title: "It covers nearly every tool",
      headers: ["Category", "Examples"],
      rows: [
        ["Deposition", "ALD, E-beam, MOCVD, Parylene, Denton 635/18"],
        ["Dry etch", "DRIE, Isotropic, PlasmaLab, PlasmaTherm, Technics"],
        ["Furnaces", "CleanOx, DopedOx, LTO, Nitride, Poly, Allwin"],
      ],
      colW: [3.0, 8.9],
      notes:
        "Show the breadth. HSCDownloader has a recipe for essentially every major active tool, grouped as deposition, dry etch, and furnaces. " +
        "PECVD has code in the file but is currently disabled in the scheduled save loop. The point isn't the list; it's that one program keeps " +
        "most machine-page data current. Each machine maps to a CORES ID number behind the scenes.",
    });

    d.steps({
      title: "When a machine page goes stale",
      intro: "A quick troubleshooting path.",
      steps: [
        { h: "Is HSCDownloader running?", d: "if it stopped, no spreadsheets get updated." },
        { h: "Can it reach CORES?", d: "an outage or a changed token blocks downloads." },
        { h: "Did the machine's ID change?", d: "a renumbered CORES ID silently breaks that one tool." },
      ],
      notes:
        "Give a practical diagnostic. If a machine page looks stale, work down this list: is the downloader process running at all; can it reach " +
        "CORES (outage or an expired/rotated token); and did that machine's CORES ID change (which silently breaks just that tool). There's no " +
        "automatic alert today, so staleness is usually noticed by eye — which is itself on the fix list.",
    });

    d.bullets({
      title: "Things to watch",
      bullets: [
        "Its CORES access token is written into the program — should move to a protected setting.",
        "If CORES is down or the token changes, pages quietly go stale (no alert today).",
        "Each machine maps to a CORES ID; if an ID changes, that machine stops updating.",
        "A couple of machines are marked 'no data yet' — expected, not bugs.",
      ],
      notes:
        "Cover the watch-items honestly. The secret token is currently embedded in the code and should be moved into a protected setting and " +
        "rotated. There's no alerting, so a CORES outage or token change shows up only as stale machine pages — adding failure alerts is " +
        "recommended. Each machine is tied to a CORES ID number; if CORES renumbers one, that machine silently stops updating. And a few " +
        "machines are noted as having no data yet, which is expected. All of this is in the developer notes and issues list.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "HSCDownloader pulls machine run data from CORES and writes spreadsheets.",
        "Those spreadsheets are what the website's machine pages display.",
        "It runs on a schedule, one recipe per machine, read-only on CORES.",
        "Watch the embedded token and the lack of failure alerts.",
      ],
      notes:
        "Wrap up. HSCDownloader is the quiet supply line keeping machine data current: download from CORES, reshape, save, repeat. It's " +
        "essential but low-profile. The two things to improve are moving the access token into a protected setting and adding alerts so silent " +
        "staleness gets noticed. Questions welcome.",
    });
  },
};
