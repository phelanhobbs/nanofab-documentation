const M = require("../meta");

module.exports = {
  filename: "13-Request-Lifecycle-Walkthrough.pptx",
  title: "Request Lifecycle",
  build(d) {
    d.title_slide({
      kicker: "PART 13",
      title: "The Life of a Request",
      subtitle: M.series + "\nWhat happens, step by step, when something asks the server for something.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session ties the series together by following individual requests from start to finish. We'll trace three: a person opening a " +
        "page, a sensor uploading a reading, and a chemical-inventory page load. The point is to show that everything we've discussed is just " +
        "variations on one pipeline. It's the 'aha, it all connects' session.",
    });

    d.code({
      title: "The universal pipeline",
      intro: "Every request — no matter the source — follows this path:",
      code:
"  client\n" +
"    └─► nginx (decrypts)\n" +
"          └─► Flask (matches the address)\n" +
"                └─► [permission checks, if any]\n" +
"                      └─► the handler does the work\n" +
"                            └─► talks to a database or files\n" +
"                                  └─► builds a response\n" +
"          ◄── nginx (re-encrypts) ◄── response",
      caption: "Page, sensor upload, or inventory load — same pipeline, different handler.",
      notes:
        "This is the spine of the session. Every request, whatever its source, flows the same way: it arrives encrypted, nginx decrypts and " +
        "forwards it, Flask matches the address to a handler, any permission checks run, the handler does its work — usually touching a " +
        "database or files — and builds a response, which travels back out through nginx, re-encrypted. The only thing that differs between " +
        "requests is what the handler does in the middle. Hold this diagram in mind for the three examples.",
    });

    d.steps({
      title: "Example 1 — a person opens the tasks page",
      steps: [
        { h: "Request arrives", d: "browser asks for /tasks over the encrypted connection." },
        { h: "Logged-in check", d: "not logged in → redirect to login; logged in → continue." },
        { h: "Handler gathers data", d: "your tasks, unfinished tasks, all tasks." },
        { h: "Page is built", d: "the template fills in the data as HTML." },
        { h: "Response returns", d: "the browser draws the tasks page." },
      ],
      notes:
        "First example, the human path. You request the tasks page. The login check runs first; if you're not authenticated you're sent to " +
        "the login page, otherwise it proceeds. The handler pulls the three task lists from the tasks database, hands them to a template that " +
        "produces the HTML page, and that page goes back to your browser. This is the typical shape of every logged-in web page in the system.",
    });

    d.steps({
      title: "Example 2 — a sensor uploads a reading",
      steps: [
        { h: "Request arrives", d: "a Pi posts JSON to /particle-data." },
        { h: "No login check", d: "device endpoints are open on the private network." },
        { h: "Validate the data", d: "confirm the required fields are present." },
        { h: "Store it", d: "append to the CSV history and update the latest snapshot." },
        { h: "Acknowledge", d: "reply success so the Pi can move on." },
      ],
      notes:
        "Second example, the machine path — same pipeline, no login. A Pi posts a reading; because it's a device endpoint there's no " +
        "authentication step. The handler validates the required fields, writes the reading to the sensor's CSV history and updates the " +
        "latest-reading row in the database, then replies success. Notice it's the identical pipeline as the web page — arrive, route, " +
        "(skip permission), do work, respond — just with different work in the middle.",
    });

    d.steps({
      title: "Example 3 — the inventory page loads",
      steps: [
        { h: "Request arrives", d: "browser asks for /chem/inventory." },
        { h: "Connect to PostgreSQL", d: "reuse a pooled connection to the chem database." },
        { h: "Search the containers", d: "run the query, optionally filtered by a search box." },
        { h: "Build the page", d: "render the results as a sortable table." },
        { h: "Response returns", d: "the inventory appears in the browser." },
      ],
      notes:
        "Third example shows the only real variation: the data source. The inventory page talks to PostgreSQL instead of the small SQLite " +
        "files, using a reusable pooled connection so it's fast. It runs the search query, optionally narrowed by what you typed in the " +
        "search box, and renders the matching containers as a sortable table. Same pipeline again; the difference is just which datastore the " +
        "handler reaches into.",
    });

    d.bullets({
      title: "What's the same every time",
      bullets: [
        "Arrive encrypted → nginx decrypts → Flask routes → (permissions) → handler → datastore → response.",
        "Only the handler's work differs between requests.",
        "Encryption and routing are handled the same way for all of them.",
        "That uniformity is what makes the system easy to extend.",
      ],
      notes:
        "Drive the lesson home: across a human page load, a sensor upload, and a PostgreSQL-backed page, the plumbing is identical and only " +
        "the middle step changes. That's not an accident — it's why adding a feature is usually just 'add an address and a handler.' The " +
        "plumbing is already there and you don't touch it.",
    });

    d.table({
      title: "The three examples, side by side",
      headers: ["Step", "Tasks page", "Sensor upload", "Inventory page"],
      rows: [
        ["Encrypted in", "yes", "yes", "yes"],
        ["Login check", "yes", "no", "no (currently)"],
        ["Does work in", "tasks DB", "CSV + sensor DB", "PostgreSQL"],
        ["Sends back", "an HTML page", "a confirmation", "an HTML table"],
      ],
      colW: [2.6, 3.1, 3.3, 2.9],
      notes:
        "Put the three traces in one grid so the pattern is unmistakable. Every column starts encrypted and ends with a response; the only " +
        "rows that differ are whether there's a login check and which datastore the handler touches. Reading across, you can see the pipeline " +
        "is identical and only the middle changes. This single table is arguably the whole point of the session.",
    });

    d.bullets({
      title: "Decorators: the checkpoints before a handler",
      bullets: [
        "Some routes have 'guards' that run before the handler itself.",
        "'Logged in?' and 'admin?' are the common ones.",
        "They can redirect or reject a request before any work happens.",
        "Device and inventory routes simply have no such guard today.",
      ],
      notes:
        "Explain the permission step in the pipeline a bit more. Certain routes are wrapped with guards — small checkpoints that run before the " +
        "main handler. The usual ones ask 'are you logged in?' and 'are you an admin?'. If a check fails, the request is redirected or refused " +
        "before any real work happens. The device endpoints and (currently) the inventory routes have no such guard, which is exactly the gap " +
        "the security session flags. Seeing where the check sits in the pipeline makes that gap concrete.",
    });

    d.bullets({
      title: "Behind the scenes: nginx and the WSGI server",
      bullets: [
        "nginx receives the encrypted request and forwards a plain one locally.",
        "A 'WSGI server' (e.g. gunicorn) runs several copies of the app to handle load.",
        "Each request is handled start-to-finish by one worker.",
        "You don't see any of this — it just makes the app fast and reliable.",
      ],
      notes:
        "Add a little operational depth for completeness. Between the network and our code sit two pieces: nginx, which handles encryption and " +
        "forwarding, and a 'WSGI server' like gunicorn that runs several copies (workers) of our app so multiple requests can be served at " +
        "once. Each request is handled completely by one worker. Users never see this layer; it's the machinery that makes the server " +
        "responsive and resilient. A maintainer should know it's there.",
    });

    d.table({
      title: "Status codes: the one-word verdict",
      headers: ["Code", "Means"],
      rows: [
        ["200", "OK — here's what you asked for"],
        ["302", "Redirect — go here instead (e.g. to the login page)"],
        ["400", "Bad request — your data was missing or malformed"],
        ["403", "Forbidden — you're not allowed (e.g. a blocked download)"],
        ["404", "Not found — no such thing here"],
        ["500", "Server error — something broke on our side"],
      ],
      colW: [2.0, 9.9],
      notes:
        "Every response carries one of these codes — the server's terse verdict. 200 is success. 302 sends the browser elsewhere, which is how " +
        "'please log in first' works. 400 means the request was malformed (a sensor missing a field). 403 is a refusal, like the download " +
        "path-guard saying no. 404 means not found. 500 means our code hit an error. Knowing these six makes reading logs and diagnosing " +
        "problems far easier, so it's worth a slide.",
    });

    d.bullets({
      title: "Where the time actually goes",
      bullets: [
        "Network travel and decryption: fast and roughly constant.",
        "Address matching and guards: effectively instant.",
        "The handler's database or file work: the variable part.",
        "So 'the server is slow' almost always means 'a query or file read is slow.'",
      ],
      notes:
        "Pre-empt the most common performance question. The fixed parts of the pipeline — moving bytes, decrypting, matching the address, " +
        "running guards — are fast and predictable. The part that varies is the handler's work: a database query or a file read. So when a page " +
        "feels slow, the culprit is almost always there, not the framework or the network. That single insight saves a lot of " +
        "troubleshooting time.",
    });

    d.bullets({
      title: "Two practical takeaways",
      bullets: [
        "If something is slow, it's almost always the handler's work (a query or file read) — not the plumbing.",
        "Adding a feature means adding a route and a handler; the rest of the pipeline is reused.",
        "This is the mental model to bring to every other session.",
      ],
      notes:
        "Close with two useful conclusions. First, for troubleshooting: network and routing are fast and uniform, so when a page feels slow, " +
        "suspect the handler's database query or file access, not the framework. Second, for development: new features slot into the existing " +
        "pipeline as a new address plus a handler. Next session consolidates everything we've implied about security into one clear picture.",
    });
  },
};
