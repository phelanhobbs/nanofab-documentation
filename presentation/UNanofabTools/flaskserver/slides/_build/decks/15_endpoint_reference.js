const M = require("../meta");

module.exports = {
  filename: "15-Endpoint-Reference.pptx",
  title: "Endpoint Reference",
  build(d) {
    d.title_slide({
      kicker: "PART 15",
      title: "Every Address, At a Glance",
      subtitle: M.series + "\nA guided tour of all ~83 addresses the server answers.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "The final session is a reference tour. Rather than read every address aloud, we'll group them by feature so the audience sees the " +
        "shape of the whole system and knows where to look things up. It doubles as a map back to all the earlier sessions. Keep it brisk — " +
        "this is a 'where everything lives' wrap-up.",
    });

    d.stats({
      title: "The system by the numbers",
      stats: [
        { big: "~83", label: "total addresses the server answers" },
        { big: "7", label: "feature areas (blueprints)" },
        { big: "5", label: "databases behind it" },
      ],
      notes:
        "Open with scale. The server answers roughly eighty-three distinct addresses, organized into seven feature areas, backed by five " +
        "databases. These numbers aren't for memorizing — they convey that this is a substantial but comprehensible system. The rest of the " +
        "session breaks the addresses down by area.",
    });

    d.table({
      title: "Addresses by feature area",
      headers: ["Area", "Count", "Login?"],
      rows: [
        ["Authentication (login, signup, reset, logout)", "4", "Mostly public"],
        ["Tasks", "6", "Login"],
        ["Admin", "4", "Admin only"],
        ["Machines & logs", "~32", "Login"],
        ["Sensor / device API", "12", "None (devices)"],
        ["Chemical inventory", "20", "Currently open"],
        ["Particle demo + static files", "5", "Public"],
      ],
      colW: [7.0, 2.0, 2.9],
      notes:
        "This is the master map. The machines portal is the largest by count because every tool gets its own address. The sensor API is the " +
        "machine-facing group with no login. The inventory is large and currently open. Note the 'Login?' column ties straight back to the " +
        "security session: human features require login, device features rely on the network, and the inventory's openness is the flagged " +
        "gap. Point people here when they ask 'where does X live?'",
    });

    d.table({
      title: "Authentication addresses",
      headers: ["Address", "Does"],
      rows: [
        ["/login", "Show form / verify credentials + 2FA"],
        ["/signup", "Create an account (Duo-approved)"],
        ["/resetpassword", "Reset via username + uNID"],
        ["/logout", "End the session"],
      ],
      colW: [3.6, 8.3],
      notes:
        "A concrete example of one area's addresses, from the authentication session. Four addresses cover the whole login lifecycle. You " +
        "don't need to read each aloud — show that the reference is this simple per area: an address and a one-line description. The written " +
        "guide has this for all 83.",
    });

    d.table({
      title: "Sensor / device addresses",
      headers: ["Address", "Does"],
      rows: [
        ["/particle-data", "Receive or return particle readings"],
        ["/env-data", "Receive or return temp/humidity"],
        ["/sensor-data", "Receive combined readings"],
        ["/sdsanalog (+finished)", "Receive Parylene CSV batches"],
        ["/denton18pump (+finished)", "Receive Denton 18 pressure samples"],
        ["/api/paralyne/analog/...", "List and download Parylene files"],
      ],
      colW: [4.6, 7.3],
      notes:
        "The device-facing addresses from the sensor session, in reference form. These are the doorways the Raspberry Pis and the Parylene " +
        "reader use. Most receive data; a couple hand files back. All are open on the private network. This is the group to consult when " +
        "wiring up a new sensor or debugging why a reading didn't land.",
    });

    d.bullets({
      title: "How to read the full reference",
      bullets: [
        "Each entry lists: the address, its method, whether login is needed, and what it does.",
        "Grouped by feature area, matching this series' sessions.",
        "Includes the small built-in routes (JavaScript, CSS, favicon).",
        "Notes which old code is inactive, so you don't chase dead ends.",
      ],
      notes:
        "Explain the written reference's format so people can use it independently. Every entry gives the address, the request method, " +
        "whether it needs login, and a one-line description, grouped the same way as these sessions. It also documents the small built-in " +
        "file-serving routes and flags a duplicate, inactive copy of the inventory code so a future maintainer doesn't waste time on dead " +
        "code. It's the lookup table for the whole system.",
    });

    d.table({
      title: "Chemical inventory addresses",
      headers: ["Address", "Does"],
      rows: [
        ["/chem/inventory", "Search and browse containers"],
        ["/chem/add", "Add containers, generate barcodes"],
        ["/chem/move (+ move-bulk)", "Relocate one or many containers"],
        ["/chem/remove", "Soft-delete containers"],
        ["/chem/upload-scans", "Import an audit's scans"],
        ["/chem/report", "The reports dashboard"],
        ["/chem/transactions", "The full audit trail"],
      ],
      colW: [4.6, 7.3],
      notes:
        "Show the inventory's addresses since it's the biggest feature. These map directly onto the actions from Part 09: browse, add, move, " +
        "remove, scan, report, audit. Note these are the addresses currently without a login requirement — the security gap from Part 14. " +
        "Pointing that out here, against the concrete list, makes the recommendation 'gate the changing ones' very tangible.",
    });

    d.table({
      title: "Machines & everyday addresses",
      headers: ["Address", "Does"],
      rows: [
        ["/tasks, /createtasks", "Task dashboard and creation"],
        ["/adminpanel", "User management (admins only)"],
        ["/ald, /pecvd, /drie, ...", "Per-tool data pages"],
        ["/download/<file>", "Download a log file (guarded)"],
        ["/graph/<file>", "Graph a log file's contents"],
        ["/particle-demo", "The standalone demo viewer"],
      ],
      colW: [4.6, 7.3],
      notes:
        "Round out the tour with the people-facing addresses. Tasks and admin behave as their sessions described; each tool has its own data " +
        "page; the download and graph addresses are the path-guarded file routes from Part 07; and the demo viewer stands alone. Again, the " +
        "value isn't memorizing these — it's seeing that the whole system is a manageable list of clearly named addresses.",
    });

    d.bullets({
      title: "Reading the 'Login?' column",
      intro: "Access rules map cleanly onto the feature areas.",
      bullets: [
        "Human features (tasks, machines, admin): require login.",
        "Admin actions: require login AND admin.",
        "Device API: no login — trusted via the private network.",
        "Inventory: currently open — the known gap to close first.",
      ],
      notes:
        "Tie the reference back to the security model one last time. The access rules aren't scattered — they follow the feature areas. " +
        "Anything people use needs a login; admin actions need admin on top; the device API is intentionally open on the private network; and " +
        "the inventory's openness is the one item flagged for fixing. The endpoint reference and the security model are two views of the same " +
        "truth.",
    });

    d.table({
      title: "The small built-in routes",
      headers: ["Address", "Does"],
      rows: [
        ["/js/<file>", "Serve a JavaScript file"],
        ["/css/<file>", "Serve a stylesheet"],
        ["/favicon.ico", "The little browser-tab icon"],
      ],
      colW: [3.6, 8.3],
      notes:
        "Round out the count with the handful of plumbing routes that aren't a 'feature' but still answer requests: serving the page scripts, " +
        "the stylesheets, and the tab icon. They're included in the reference for completeness so the ~83 total adds up and so a maintainer " +
        "isn't surprised to find them. Nothing to configure; they just quietly serve static assets.",
    });

    d.bullets({
      title: "A note on dead code",
      bullets: [
        "A second, near-duplicate copy of the inventory code exists in the project.",
        "It is NOT active — the server never loads it.",
        "The reference flags it so you don't edit the wrong file.",
        "Lesson: trust the reference, not just file names, when navigating the code.",
      ],
      notes:
        "An important orientation note for a successor. There's a leftover, near-duplicate copy of the inventory code sitting in the project " +
        "that is not wired in and never runs. Without this warning, a new maintainer could waste time editing the dead copy and wonder why " +
        "nothing changes. The endpoint reference documents which file is actually live. The general lesson: in a system that grew over time, " +
        "lean on the documentation to tell active code from abandoned code.",
    });

    d.bullets({
      title: "Series wrap-up",
      bullets: [
        "A server takes a request and returns a response — everything else is detail.",
        "Humans log in (with two-factor); machines push data on a trusted network.",
        "Data lives in small databases, one big one, and CSV files.",
        "The written guide and developer docs go deeper when you need them.",
      ],
      notes:
        "Close the whole series. Return to the core idea from Part 01 — request in, response out — and recap the big themes: two kinds of " +
        "client, several datastores, and a consistent pipeline. Point listeners to the companion written guide for depth and to the separate " +
        "developer documentation if they'll maintain the system. Thank everyone for following the series, and open the floor for questions.",
    });
  },
};
