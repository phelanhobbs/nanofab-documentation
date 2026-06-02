const M = require("../meta");

module.exports = {
  filename: "Utilities.pptx",
  title: "Utilities",
  build(d) {
    d.title_slide({
      kicker: "UNANOFABTOOLS · TOOLS",
      title: "Utilities",
      subtitle: "The workshop drawer: small helper programs for specific jobs.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers a handful of small, standalone helper programs that don't belong to any larger tool — a peak counter, a " +
        "certificate converter, a database setup script, a remote-file fetcher, and one unfinished stub. They share nothing except being " +
        "small, single-purpose helpers. Think of them as the project's workshop drawer. No coding background needed.",
    });

    d.table({
      title: "The five utilities at a glance",
      headers: ["File", "Job", "Status"],
      rows: [
        ["peakCount.py", "Count peaks in pressure data", "Working"],
        ["gencert.py", "Convert a certificate file for the server", "Works (run by hand)"],
        ["init_chem_db.py", "Create the chemical-database tables", "Works (run once)"],
        ["fetch_ssh.py", "Developer helper to pull a file off the server", "Dev only"],
        ["NMonStore.py", "Intended data-storing monitor", "Unfinished stub"],
      ],
      colW: [3.2, 5.7, 3.0],
      notes:
        "Overview the set. Three are working tools you'd actually run, one is a personal developer helper, and one is an unfinished " +
        "placeholder. We'll take them one at a time. The 'Status' column matters: not everything in a repository is finished or meant for " +
        "general use, and it's important documentation says so plainly.",
    });

    d.bullets({
      title: "peakCount.py — counting peaks",
      bullets: [
        "Process pressures rise and fall, making 'peaks' in the data.",
        "Counting peaks can mean counting cycles or events in a run.",
        "This reads a data file (or several) and counts the peaks for you.",
        "You can tune the sensitivity and optionally show a graph.",
      ],
      notes:
        "Explain peakCount. During a process the pressure goes up and down, and counting those peaks is sometimes how you count cycles or " +
        "events. This command-line tool reads pressure data files and counts the peaks, with options to tune how big a bump must be to count " +
        "and to show a graph with the peaks marked. It uses a standard peak-finding algorithm plus extra logic to catch a peak right at the " +
        "end of a run, which simple methods miss. There's a fuller graphical version in the NanofabToolkit.",
    });

    d.bullets({
      title: "gencert.py — the website's certificate",
      bullets: [
        "A secure site needs a certificate — the browser padlock.",
        "Certificates often arrive as one combined file (.pfx).",
        "The server needs it split into two files (cert + key).",
        "This script does that one-time conversion at renewal time.",
      ],
      notes:
        "Explain gencert. The padlock in a browser comes from a certificate. They often arrive as a single combined .pfx file, but the server " +
        "needs it as two separate .pem files. This script does that conversion, run by hand whenever the certificate is renewed. It writes the " +
        "private key without a passphrase — which the server setup expects — so that key file must be kept somewhere protected.",
    });

    d.bullets({
      title: "init_chem_db.py — first-time database setup",
      bullets: [
        "The chemical inventory lives in a PostgreSQL database.",
        "Its tables must be created before first use.",
        "This script connects and runs the table-creation script.",
        "You run it once when setting up the inventory on a new server.",
      ],
      notes:
        "Explain init_chem_db. The chemical inventory needs its database tables created before it can work. This script connects to PostgreSQL " +
        "and runs the setup script that builds those tables and views. You run it once on a fresh server. Important caveat: the live inventory " +
        "has gained extra columns and a table over time that this setup script doesn't yet create — so a brand-new database built from it " +
        "alone would be missing a few pieces. The developer notes spell out the fix.",
    });

    d.twocol({
      title: "The dev helper and the unfinished one",
      left: {
        heading: "fetch_ssh.py — dev only",
        items: [
          "Logs in to the server securely.",
          "Copies one file (the inventory code) down.",
          "A personal developer convenience, not for general use.",
        ],
      },
      right: {
        heading: "NMonStore.py — unfinished",
        items: [
          "A skeleton that was never completed.",
          "Just counts to five into a text file.",
          "Should be finished or removed.",
        ],
      },
      notes:
        "Two to be candid about. fetch_ssh.py is a personal developer tool that pulls one file off the server to compare against a local copy " +
        "— useful to the developer, not meant for general use, with personal credentials baked in. NMonStore.py is an unfinished stub: it " +
        "literally counts to five with a 'your code goes here' comment. It was the start of a monitor that was never completed; a future " +
        "maintainer should finish or delete it. Documenting unfinished code honestly saves the next person from guessing.",
    });

    d.bullets({
      title: "Why document the odds and ends?",
      bullets: [
        "Every real project accumulates small helpers.",
        "Knowing what each does — and which are unfinished — saves time.",
        "It prevents a successor running a half-built script and trusting it.",
        "The status labels ('working', 'dev only', 'stub') are the key takeaway.",
      ],
      notes:
        "Make the meta-point. Every project has a drawer of small scripts, and an undocumented drawer is a trap for whoever inherits it. The " +
        "value of this section is less the individual tools and more the honest status on each: what's solid, what's personal, and what's " +
        "unfinished. That's exactly what a successor needs to avoid wasting time or trusting something half-built.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Five small helpers: peak counter, cert converter, DB setup, file fetcher, a stub.",
        "Three are working tools; one is dev-only; one is unfinished.",
        "init_chem_db doesn't yet build the full database — noted for fixing.",
        "Honest status labels matter as much as the tools themselves.",
      ],
      notes:
        "Wrap up. These are the project's miscellaneous helpers. Most work and do one job well; one is a personal dev tool; one is an " +
        "unfinished stub. The one functional gap worth fixing is that the database setup script doesn't yet produce a complete database. The " +
        "broader lesson is the value of documenting the odds and ends honestly. Questions welcome.",
    });
  },
};
