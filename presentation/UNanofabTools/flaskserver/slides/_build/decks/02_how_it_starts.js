const M = require("../meta");

module.exports = {
  filename: "02-How-It-Starts.pptx",
  title: "How the Server Starts",
  build(d) {
    d.title_slide({
      kicker: "PART 02",
      title: "How the Server Starts",
      subtitle: M.series + "\nFrom “turn it on” to “ready for the first request.”",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session traces the boot sequence — the chain of events between launching the program and it being ready to answer requests. " +
        "Three files do the work: run.py (the ignition), the application factory, and the configuration. Keep it conceptual; the audience " +
        "doesn't need to read Python, just understand the order things happen in and why it's organized this way.",
    });

    d.bullets({
      title: "The cast: three files",
      bullets: [
        "run.py — the ignition key. Tiny; its only job is to start things.",
        "app/__init__.py — the application factory, where the server is actually assembled.",
        "config/config.py — the settings, covered in its own session (Part 03).",
        "Keeping the starter tiny and the assembly separate is a deliberate, common pattern.",
      ],
      notes:
        "Introduce the three files by role, not by code. run.py is like a car key — it does almost nothing itself, it just turns the engine " +
        "over. The real assembly happens in the 'application factory.' Settings live in a third file we cover next session. The point of " +
        "splitting these is flexibility: you can build the server in different modes (development vs production, or for testing) without " +
        "rewriting anything.",
    });

    d.code({
      title: "run.py — the ignition",
      intro: "The whole starter file, simplified:",
      code:
"config_name = os.getenv('FLASK_ENV', 'development')\n" +
"app = create_app(config_name)\n\n" +
"if __name__ == '__main__':\n" +
"    app.run(host, port, debug=...)",
      caption: "Read which mode to run in, build the app, and (if launched directly) start serving.",
      notes:
        "Walk it in plain words. Line 1: look up an environment setting called FLASK_ENV to decide whether we're in 'development' or " +
        "'production' mode; default to development. Line 2: call create_app — that's the factory that assembles everything. The 'if' block " +
        "at the bottom only runs when you launch this file directly (handy for local testing); in real production a separate, sturdier " +
        "web server loads the app instead. The headline: run.py decides the mode, then hands off to the factory.",
    });

    d.steps({
      title: "What the factory does, in order",
      intro: "create_app() assembles the server step by step.",
      steps: [
        { h: "Build the app object", d: "create the empty Flask application." },
        { h: "Load settings", d: "copy the chosen configuration into the app." },
        { h: "Turn on add-ons", d: "database, logins, password hashing, migrations, cross-origin access." },
        { h: "Register the blueprints", d: "plug in each feature chapter (auth, tasks, machines, API, chem...)." },
        { h: "Wire small extras", d: "serve JS/CSS files, the favicon, a date formatter." },
        { h: "Ensure tables exist", d: "create any missing database tables, then return the ready app." },
      ],
      notes:
        "This is the heart of the session. The factory is a recipe with a fixed order. First it makes an empty application. Then it pours in " +
        "the settings. Then it switches on the add-on libraries — the database connector, the login system, the password hasher, the " +
        "migration tool, and cross-origin access. Then it registers the 'blueprints,' the feature chapters we'll cover one by one. " +
        "Then a few housekeeping routes. Finally it makes sure the database tables exist and hands back a fully assembled, ready server. " +
        "Order matters: you can't register features before the database connector is on, for example.",
    });

    d.bullets({
      title: "What are blueprints again?",
      intro: "A blueprint is a “chapter” of the server that groups related addresses.",
      bullets: [
        "auth — login, signup, password reset, logout.",
        "tasks — the to-do list.",
        "admin — user management.",
        "machines — the per-tool data pages and log files.",
        "api — the sensor/device endpoints.",
        "chem — the chemical inventory (its own /chem section).",
        "particle_demo — the standalone demo page.",
      ],
      notes:
        "Reinforce the blueprint idea since it recurs all series. Think of the server as a book and each blueprint as a chapter that owns a " +
        "set of related web addresses. Registering a blueprint is like adding its chapter to the book's table of contents so the server " +
        "knows those addresses exist. Each of these seven gets its own session (or shares one) later.",
    });

    d.code({
      title: "Why assemble inside a function?",
      intro: "The “factory” pattern, in one idea:",
      code:
"   build_a_fresh_server(mode):\n" +
"       ... assemble with that mode's settings ...\n" +
"       return server\n\n" +
"   # development build  → relaxed, auto-reloads\n" +
"   # production build    → strict, writes log files\n" +
"   # test build          → throwaway, for checks",
      caption: "One recipe, several builds — no copy-pasting between modes.",
      notes:
        "Explain the payoff of the factory pattern without jargon. Because assembly is a function you call with a 'mode,' you can produce " +
        "different builds from the same recipe: a relaxed development build that reloads when you edit it, a strict production build that " +
        "writes log files, or a disposable build for automated testing. Without this pattern you'd be duplicating setup code for each mode " +
        "and they'd drift apart. It's the same reason a kitchen uses one recipe scaled up or down rather than a separate cookbook per " +
        "portion size.",
    });

    d.bullets({
      title: "A couple of nuances",
      bullets: [
        "The server only listens locally (127.0.0.1) — nginx out front handles the public, encrypted traffic.",
        "“Create missing tables” fills in new tables but never changes existing ones; that needs a migration (Part 03/10).",
        "A small date-formatter is added so blank dates show a dash instead of the word “None.”",
      ],
      notes:
        "Two things worth flagging. First, the server binds to the local-only address, meaning only the same machine can reach it directly; " +
        "nginx is the public-facing front door. Second, the boot step that 'creates missing tables' is convenient but limited — it adds " +
        "brand-new tables but won't alter a table that already exists, so changing a table's shape requires a separate 'migration,' which " +
        "we'll mention again later. The date-formatter is a tiny quality-of-life touch for the inventory pages.",
    });

    d.bullets({
      title: "Development mode vs. production mode",
      intro: "The same startup, two personalities — chosen by one setting.",
      bullets: [
        "Development: reloads when you edit, shows full errors, skips two-factor.",
        "Production: stable, logs quietly to a file, enforces two-factor.",
        "The mode is read at the very first step of startup (FLASK_ENV).",
        "Pick the wrong mode and the server behaves very differently — safely or not.",
      ],
      notes:
        "Connect startup to the configuration session. The very first thing run.py does is read which mode to start in. That single choice " +
        "ripples through everything: development reloads on edits, shows detailed errors, and skips two-factor for convenience; production is " +
        "stable, logs to a file, and enforces two-factor. Same code, two personalities. The danger is running production in development mode, " +
        "which silently disables two-factor — a point we hammer in the configuration and security sessions.",
    });

    d.bullets({
      title: "Add-ons the factory switches on",
      intro: "Off-the-shelf libraries that handle common jobs.",
      bullets: [
        "Database connector — talks to the SQLite databases.",
        "Login system — tracks who's logged in and guards pages.",
        "Password hasher — scrambles passwords safely.",
        "Migration tool — applies recorded database changes.",
        "Cross-origin access — lets approved web tools call the server.",
      ],
      notes:
        "Demystify the 'add-ons' mentioned in the factory steps. These are well-known, reusable libraries the server switches on rather than " +
        "writing from scratch: one to talk to databases, one to manage logins and guard pages, one to hash passwords, one to apply database " +
        "changes, and one to permit approved cross-site requests. Using established libraries for these standard jobs is good practice — they're " +
        "more reliable and better tested than home-grown versions. The audience doesn't need names, just the idea that the server stands on " +
        "solid, reusable pieces.",
    });

    d.code({
      title: "What 'register a blueprint' looks like",
      intro: "Each feature chapter is plugged in with two lines:",
      code:
"  from app.blueprints.tasks import tasks_bp\n" +
"  app.register_blueprint(tasks_bp)\n\n" +
"  # repeat for: auth, admin, machines,\n" +
"  #            api, chem, particle_demo",
      caption: "Import the chapter, then plug it into the app. Seven chapters, seven plug-ins.",
      notes:
        "Show how little it takes to add a feature chapter: import it, then register it. The server does this for all seven blueprints during " +
        "startup. The reason it's done inside the factory function rather than at the top of the file is a technical one — it avoids a " +
        "chicken-and-egg loading problem — but the takeaway for the audience is simply that features are modular and snap in cleanly. Adding " +
        "an eighth feature later would be the same two lines.",
    });

    d.bullets({
      title: "Recap: the boot sequence",
      bullets: [
        "Launch run.py → it reads the mode (development or production).",
        "It calls the factory, which assembles the app: settings, add-ons, blueprints, extras, tables.",
        "The finished app is handed to a web server and starts listening.",
        "From here on, every request follows the path we'll trace in Part 13.",
      ],
      notes:
        "Summarize and bridge. The startup story is: read the mode, run the factory recipe, hand the finished server to be served. " +
        "Once it's listening, every incoming request flows through the same pipeline — which is exactly what Part 13 (Request Lifecycle) " +
        "walks through end to end. Next session, though, is Configuration: where all those settings actually come from.",
    });
  },
};
