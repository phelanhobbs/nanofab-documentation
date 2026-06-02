const M = require("../meta");

module.exports = {
  filename: "HSC-Displayer-Server-Legacy.pptx",
  title: "HSC Displayer Server (Legacy)",
  build(d) {
    d.title_slide({
      kicker: "UNANOFABTOOLS · LEGACY",
      title: "HSC Displayer Server",
      subtitle: "The original all-in-one website server — the predecessor of today's site.\nA plain-English walkthrough.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers HSCDisplayerServer.py — the original, all-in-one version of the website's server, before it was rewritten into " +
        "the modern Flask app. It does everything the current site does, but packed into one large file. We'll cover what it is, why it's " +
        "worth understanding, how it differs from the new version, and what should happen to it. No coding background needed.",
    });

    d.bullets({
      title: "What it is",
      bullets: [
        "A single, very large program (~2,600 lines) — the website's first server.",
        "Does everything the current site does, all in one file.",
        "The current Flask website is a tidied-up rewrite of this.",
        "Labeled 'legacy' because new work happens in the new version.",
      ],
      notes:
        "Define it plainly. This is one big file that was the cleanroom website's server before the rewrite. It handles logins, tasks, machine " +
        "pages, and sensor data — everything — but all in a single program. The current Flask site is the reorganized version of this same " +
        "thing. It's called 'legacy' because it's the old version; new development targets the new one.",
    });

    d.bullets({
      title: "Why understand it at all?",
      bullets: [
        "History: it explains why the new server is organized the way it is.",
        "It may still be the one actually running, depending on the setup.",
        "A maintainer must know which server is live and how this one works.",
        "It's a 'Rosetta stone' between old behavior and the new code.",
      ],
      notes:
        "Two reasons to care. First, history: understanding the original explains many choices in the rewrite. Second, and more practically, " +
        "depending on the deployment this monolith might still be the live server — so a maintainer needs to know which one is running and how " +
        "this one behaves. Because its web addresses match the new server's, it's also a useful reference for comparing old and new behavior.",
    });

    d.bullets({
      title: "What it does",
      bullets: [
        "Logins, passwords, two-factor (Duo), admin permissions.",
        "The task list: assign, claim, complete, attach files.",
        "Machine pages: tables, graphs, log downloads.",
        "Accepts the same Raspberry Pi sensor data the new site does.",
      ],
      notes:
        "List the features to show it's a complete server, not a fragment. It does everything the current site does: the whole login and " +
        "permission system, the task list, the machine pages with their tables and graphs, and the sensor-data endpoints the Picos post to. " +
        "Functionally it and the new server are the same; the difference is purely how the code is organized.",
    });

    d.twocol({
      title: "How it differs from the new version",
      left: {
        heading: "Legacy (this file)",
        items: [
          "Built on Python's bare-bones web tools.",
          "One giant 'switchboard' for all addresses.",
          "Handles its own encryption.",
          "Everything in one file.",
        ],
      },
      right: {
        heading: "New (Flask app)",
        items: [
          "Built on Flask, which handles plumbing.",
          "Split into labeled chapters (blueprints).",
          "Encryption handled by nginx out front.",
          "Organized into many small files.",
        ],
      },
      notes:
        "Contrast the two. The legacy server uses Python's built-in, bare-bones web tools, so the developer wrote a lot of plumbing by hand — " +
        "including one enormous switchboard that decides what to do for each web address, and its own encryption. The new version uses Flask, " +
        "which handles that plumbing, splits the switchboard into tidy labeled chapters, and lets nginx handle encryption. Same behavior, much " +
        "cleaner structure. That cleanup is exactly why the rewrite happened.",
    });

    d.code({
      title: "The 'switchboard' idea",
      intro: "All requests funnel through two long decision blocks:",
      code:
"  a page view comes in →  do_GET:\n" +
"       if /machines ... elif /admin ... elif /download ...\n" +
"\n" +
"  a form/upload comes in →  do_POST:\n" +
"       if /login ... elif /createtasks ... elif /sdsanalog ...\n" +
"\n" +
"  (the new server splits these into separate chapters)",
      caption: "Two long 'if this address, do that' blocks handle everything.",
      notes:
        "Make the structure concrete without code skills. Every request funnels into one of two long decision blocks: one for page views, one " +
        "for form submissions and uploads. Each is a long 'if the address is this, do that' chain covering every feature. It works, but it's " +
        "hard to read and change — which is why the rewrite broke it into separate, labeled sections. Seeing this explains the whole motivation " +
        "for the new architecture.",
    });

    d.bullets({
      title: "Same fundamentals as the new server",
      bullets: [
        "Passwords hashed (never stored in plain text).",
        "Two-factor login via Duo.",
        "Small databases for users, sessions, and tasks.",
        "Reads the same machine spreadsheets to draw pages.",
      ],
      notes:
        "Reassure that the security and data fundamentals are the same — this is what the new server was modeled on. Passwords are hashed, " +
        "two-factor is required, users/sessions/tasks live in small databases, and it reads the same HSCDATA spreadsheets to render machine " +
        "pages. The new server didn't change these ideas; it reorganized how they're expressed in code.",
    });

    d.bullets({
      title: "The debug-mode switch",
      bullets: [
        "Has a debug mode for local testing, like the new server.",
        "Debug mode skips two-factor and encryption for convenience.",
        "The code is emphatic: never turn it on for the real server.",
        "Same rule and same risk as the new version.",
      ],
      notes:
        "Note the debug switch since it's a shared risk. Like the new server, this one has a debug mode that skips two-factor and encryption " +
        "for local development, with prominent warnings never to enable it in production. Same discipline applies. It's worth knowing both " +
        "servers share this footgun.",
    });

    d.steps({
      title: "From monolith to modern site",
      intro: "The arc this file sits in.",
      steps: [
        { h: "First: this monolith", d: "one big file did everything — and it worked." },
        { h: "Then: the Flask rewrite", d: "the same features, split into tidy chapters." },
        { h: "Now: consolidate", d: "confirm what's live and retire the older one." },
      ],
      notes:
        "Give the historical arc. This monolith came first and did the whole job. The Flask app is the rewrite of the same features into a " +
        "maintainable structure. The remaining step is organizational: confirm which is actually serving the site and consolidate onto the " +
        "Flask app. Framing it as a timeline helps a non-technical audience see this isn't 'broken,' it's 'superseded.'",
    });

    d.bullets({
      title: "If this is the one in production",
      bullets: [
        "First priority: verify which server is actually live.",
        "Make sure the Flask app covers every address still in use.",
        "Watch for a couple of legacy-only addresses with no new-version twin.",
        "Then plan the cutover and retire this file.",
      ],
      notes:
        "Address the practical case. If this monolith is what's actually running, the work is to confirm that, check that the Flask app " +
        "implements every address still being used (a couple of legacy-only ones may exist), then plan a careful cutover. The risk to avoid is " +
        "patching one server while the other is live. The developer notes include a route-by-route comparison to support this.",
    });

    d.bullets({
      title: "What should happen to it",
      bullets: [
        "Treat it as reference/fallback — don't add features here.",
        "Confirm which server is actually live in production.",
        "Make sure the new server covers everything still in use.",
        "Then fully migrate and retire this file.",
      ],
      notes:
        "End with the recommendation. The plan should be: don't extend this file, confirm which server is actually running, ensure the Flask " +
        "app covers every address still in use (a couple of legacy-only ones may exist), then migrate fully and retire the monolith. Running " +
        "two implementations of the same system in parallel is the real long-term risk. All of this is in the developer notes and issues list.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "The legacy all-in-one server — the predecessor of today's site.",
        "Same features; one giant file instead of tidy chapters.",
        "Same fundamentals: hashing, two-factor, the same data.",
        "Goal: confirm what's live, reconcile, then retire it for the Flask app.",
      ],
      notes:
        "Wrap up. HSCDisplayerServer is the first draft of the website's server — complete and functional, but monolithic. The Flask app is " +
        "the clean rewrite. Understanding this file explains the rewrite and helps whoever maintains the system know what's live. The endgame " +
        "is to consolidate on the Flask app. Questions welcome.",
    });
  },
};
