const M = require("../meta");

module.exports = {
  filename: "01-Server-Overview.pptx",
  title: "Server Overview",
  build(d) {
    d.title_slide({
      kicker: "PART 01",
      title: "Server Overview",
      subtitle: M.series + "\nThe big picture: what a server is, what ours does, and who uses it.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "Welcome. This is the first of a 16-part series explaining the UNanofabTools server in plain English. " +
        "Today's session is the big picture — by the end you should understand what a 'server' even is, what jobs ours performs, " +
        "and who (and what) talks to it. No coding background needed. Later sessions go deeper into each piece. " +
        "I'll keep jargon to a minimum and define every term the first time it shows up.",
    });

    d.bullets({
      title: "What is a server, in one sentence?",
      intro: "A server is a program that runs continuously, waiting for others to ask it for things.",
      bullets: [
        "The thing that asks is called a client; each request gets a response.",
        "Open a web page in a browser → the browser is the client, the server sends back the page.",
        "A sensor in the cleanroom sends a reading → the sensor is the client, the server stores it.",
        "A desktop tool fetches data → the tool is the client, the server hands back the answer.",
        "The server is always on; the clients come and go.",
      ],
      notes:
        "The single most useful idea in this whole series: a server is just a program that takes a request and gives back a response. " +
        "Everything else is bookkeeping around that. A 'client' is anything that makes a request — a web browser, a sensor, a desktop app. " +
        "Give the browser example out loud: when you type an address and hit enter, your browser quietly sends a request across the network, " +
        "our server prepares an answer (an HTML page), and sends it back; the browser draws it. The server doesn't initiate anything — " +
        "it waits and responds. That's why it has to be always-on.",
    });

    d.bullets({
      title: "What this server does",
      intro: "Six jobs, all bundled into one program.",
      bullets: [
        "Accounts — usernames, passwords, two-factor login, admin permissions.",
        "Task tracker — staff assign each other to-do items, attach files, mark them done.",
        "Machine portal — a page per tool (ALD, PECVD, furnaces, etc.) with data tables and graphs.",
        "Data sink — Raspberry Pi sensors push their readings here to be stored.",
        "Chemical inventory — every bottle is barcoded, tracked, and reported on.",
        "Demo viewer — a standalone particle-counter page for visitors and outreach.",
      ],
      notes:
        "It's important the audience understands this is not six separate programs — it's one application wearing six hats. " +
        "Walk through each: accounts (who can log in and what they can do); the task tracker (an internal to-do list); " +
        "the machine portal (one web page per cleanroom tool showing its historical data); the data sink (small computers " +
        "next to machines that send measurements automatically); the chemical inventory (the biggest piece — barcoded bottle tracking); " +
        "and a small public demo page. Each of these gets its own session later in the series.",
    });

    d.steps({
      title: "Who (and what) uses it",
      intro: "Three kinds of client arrive at the same server.",
      steps: [
        { h: "Lab staff in a browser", d: "log in and use HTML pages — tasks, machine data, inventory." },
        { h: "Raspberry Pi devices", d: "small computers by machines that POST sensor readings automatically, no login." },
        { h: "Desktop tools (NanofabToolkit)", d: "apps staff run that fetch data back out to visualize it." },
      ],
      notes:
        "A key concept: the server serves two very different audiences. Humans use a browser with logins and 2-factor authentication; " +
        "machines (the Raspberry Pi sensors and desktop tools) talk to it directly without logging in. Both arrive at the same program, " +
        "but the code routes them to different handlers. Why no login for the machines? Because they sit on a private, locked-down lab network — " +
        "that's the security boundary instead of a password. We'll revisit that trade-off in the Security session.",
    });

    d.code({
      title: "How it fits together",
      intro: "A whiteboard sketch of the whole system:",
      code:
"  Browsers ─────HTTPS──┐\n" +
"  Pi sensors ──HTTPS───┼──►  nginx  (port 443, handles encryption)\n" +
"  Desktop apps ─HTTPS──┘            │  forwards locally to\n" +
"                                    ▼  127.0.0.1:5000\n" +
"                              ┌──────────────┐\n" +
"                              │  Flask app   │  (our code)\n" +
"                              └──────┬───────┘\n" +
"                                     │\n" +
"                  ┌──────────────────┼────────────────┐\n" +
"                  ▼                  ▼                 ▼\n" +
"              SQLite DBs        PostgreSQL        CSV files\n" +
"             (users, tasks,    (chemical          (sensor &\n" +
"              sessions...)      inventory)         machine logs)",
      caption: "nginx is the front door and handles encryption; Flask runs behind it and does the work.",
      notes:
        "Don't rush this slide. Trace the arrows: requests come in over HTTPS (the secure, padlock version of web traffic). " +
        "They first hit nginx, a piece of software whose job is to handle encryption and act as the front door. " +
        "nginx then forwards each request locally to our Flask program. Flask is where our actual code lives. " +
        "Flask reads and writes data in three places: small SQLite database files, a larger PostgreSQL database for chemicals, " +
        "and plain CSV spreadsheet files for sensor and machine history. The key takeaway: encryption and the application logic " +
        "are handled by different programs, each doing what it's best at.",
    });

    d.bullets({
      title: "Four things worth noticing",
      bullets: [
        "Encryption is handled by nginx, not our code — Flask only listens locally and never faces the internet directly.",
        "There isn't one database — there are several, each holding a different kind of data.",
        "The chemical inventory is special: it uses PostgreSQL, a more powerful database than the rest.",
        "CSV files aren't just exports — they're the real long-term home of sensor history.",
      ],
      notes:
        "These four points prevent common misunderstandings. (1) Our program never touches encryption — nginx does — which is why " +
        "developers don't have to manage certificates in the app. (2) 'The database' is actually several databases; that's a historical " +
        "choice we live with. (3) The chemical inventory outgrew the simple databases and lives in PostgreSQL, which supports the heavier " +
        "features it needs. (4) Surprising but important: the minute-by-minute sensor history is stored as CSV files on disk, not in a " +
        "database — the database only keeps each sensor's latest reading. Back up those CSV files.",
    });

    d.table({
      title: "Where each kind of data lives",
      headers: ["Data", "Stored in"],
      rows: [
        ["User accounts", "SQLite file (signininfo.db)"],
        ["Login sessions", "SQLite file (sessioninfo.db)"],
        ["Tasks & attachments", "SQLite file (tasks.db)"],
        ["Latest sensor readings", "SQLite file (particle_sensors.db)"],
        ["Chemical inventory", "PostgreSQL database"],
        ["Sensor & machine history", "CSV files on disk (LogData / HSCDATA)"],
      ],
      colW: [5.9, 6.0],
      notes:
        "This table is a reference you can point back to all series long. The four SQLite files are simple, single-file databases — " +
        "great for small data. PostgreSQL is a full database server, used only by the chemical inventory because it needs the horsepower. " +
        "And the CSV files hold the bulk, append-only history. If someone asks 'where does X live?', this slide answers it.",
    });

    d.table({
      title: "Vocabulary, part 1: the web basics",
      headers: ["Term", "Plain meaning"],
      rows: [
        ["Request", "A message a client sends asking for something"],
        ["Response", "What the server sends back (with a status code)"],
        ["GET", "“Give me this” — page loads and data fetches"],
        ["POST", "“Here is some data” — form submissions, sensor uploads"],
        ["Status code", "200 = OK, 404 = not found, 500 = server error"],
        ["HTTPS", "The encrypted (padlock) version of web traffic"],
      ],
      colW: [3.0, 8.9],
      notes:
        "These six terms appear constantly. Requests and responses we covered. GET and POST are the two verbs we'll mention most: " +
        "GET means 'give me something' (no data attached); POST means 'here, take this data' (a form or a sensor reading). " +
        "Status codes are the server's one-word verdict — 200 means success, 404 means it couldn't find what you asked for, " +
        "500 means the server itself hit an error. HTTPS is just HTTP with encryption. Don't memorize — they'll become familiar as we go.",
    });

    d.table({
      title: "Vocabulary, part 2: the building blocks",
      headers: ["Term", "Plain meaning"],
      rows: [
        ["Endpoint / route", "A specific address the server answers, e.g. /login"],
        ["Blueprint", "A “chapter” of the server grouping related routes"],
        ["Template", "An HTML page with blanks the server fills in"],
        ["Model", "A description of one table in the database"],
        ["Service", "Plain code that does the real work behind a route"],
        ["Session", "A record that says “this person is logged in right now”"],
      ],
      colW: [3.0, 8.9],
      notes:
        "These describe how the code is organized — they'll matter in the deeper sessions. An endpoint (or route) is one address the " +
        "server knows how to answer. Blueprints group related routes into chapters (auth, tasks, inventory, etc.). Templates are HTML " +
        "pages with fill-in-the-blank spots. Models describe database tables. Services hold the actual logic. A session is the record " +
        "that keeps you logged in. You don't need these cold today; I'm planting them so they're familiar later.",
    });

    d.code({
      title: "The mental model to hold onto",
      intro: "If you remember one thing from this session, make it this:",
      code:
"   A server is a function that takes a request\n" +
"   and returns a response.\n\n" +
"   request  ─►  [ server decides what to do ]  ─►  response\n\n" +
"   Everything else — logins, databases, sensors,\n" +
"   inventory — is detail around that one idea.",
      notes:
        "Land this firmly. Every feature we discuss for the next fifteen sessions is a variation on 'a request comes in, the server does " +
        "something, a response goes out.' When the inventory page loads, that's a request and a response. When a sensor uploads a reading, " +
        "that's a request and a response. Keeping this frame makes the rest of the series much easier to follow.",
    });

    d.twocol({
      title: "What this series covers — and doesn't",
      left: {
        heading: "In scope",
        items: [
          "The modern Flask application (the app/ folder).",
          "How it starts, its settings, and security.",
          "Each feature: auth, tasks, machines, sensors, inventory.",
          "How the sensors and desktop tools connect to it.",
        ],
      },
      right: {
        heading: "Out of scope",
        items: [
          "PowerShell file-transfer scripts.",
          "The standalone machine analysis programs.",
          "Raspberry Pi firmware (covered in a separate session).",
          "Anything not part of the live web application.",
        ],
      },
      notes:
        "Setting expectations: we're covering the current, modern version of the server — the organized code under the 'app' folder. " +
        "We skip the helper scripts, the standalone analysis programs, and the Raspberry Pi firmware, since those are documented in their " +
        "own per-tool sessions. New development happens in the modern app and that's what we're documenting here.",
    });

    d.code({
      title: "A request and a response, concretely",
      intro: "What actually crosses the wire when you open a page:",
      code:
"  You →  GET /tasks          (\"give me the tasks page\")\n" +
"\n" +
"  Server → 200 OK            (\"here it is\")\n" +
"           <html> ... the tasks page ... </html>\n" +
"\n" +
"  A sensor →  POST /particle-data   (\"store this reading\")\n" +
"  Server   →  200 OK                (\"got it\")",
      caption: "GET asks for something; POST hands something over. 200 means success.",
      notes:
        "Make the abstract concrete. When you open the tasks page your browser sends a GET request for /tasks and the server replies 200 (OK) " +
        "with the page's HTML. When a sensor uploads, it sends a POST to /particle-data and the server replies 200 to confirm. Two verbs cover " +
        "almost everything: GET ('give me') and POST ('here, take this'). The number 200 is the server's way of saying 'success.' Don't worry " +
        "about other codes yet — we'll meet 404 and 500 in a moment.",
    });

    d.bullets({
      title: "Why split nginx and Flask?",
      intro: "Two programs, each doing what it's best at.",
      bullets: [
        "nginx is excellent at encryption and being a fast, tough front door.",
        "Flask is where our actual application logic lives.",
        "Letting each specialize is simpler and safer than one program doing both.",
        "Flask never faces the internet directly — only nginx does.",
      ],
      notes:
        "Reinforce the division of labor since it underpins the security story. nginx is battle-tested software whose specialty is handling " +
        "encrypted connections and serving as a hardened front door. Flask is where our code runs. Rather than make one program do both jobs " +
        "(and do them less well), each specializes. A side benefit: Flask is tucked behind nginx and never directly exposed to the internet, " +
        "which shrinks what an attacker can even reach.",
    });

    d.bullets({
      title: "Where we go from here",
      intro: "The next sessions, in order:",
      bullets: [
        "How it starts up, and where its settings come from.",
        "Logging in: passwords, two-factor, and the admin panel.",
        "The everyday features: tasks, machine pages, and log files.",
        "The sensor pipeline: how Raspberry Pis feed the server.",
        "The chemical inventory — the largest feature — in depth.",
        "Security, the full request walk-through, and a reference list of every address.",
      ],
      notes:
        "Close by previewing the roadmap so people know what's coming and can pick the sessions most relevant to them. " +
        "Managers might care most about security and the big picture; whoever inherits the code will want the deep-dive sessions. " +
        "Invite questions now while the framing is fresh, then we'll build on it. Thank them for their time.",
    });
  },
};
