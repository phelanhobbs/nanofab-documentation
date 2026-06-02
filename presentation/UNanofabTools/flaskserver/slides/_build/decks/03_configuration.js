const M = require("../meta");

module.exports = {
  filename: "03-Configuration.pptx",
  title: "Configuration",
  build(d) {
    d.title_slide({
      kicker: "PART 03",
      title: "Configuration",
      subtitle: M.series + "\nWhere the server reads its settings — and why they're not in the code.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session answers: where do the server's settings come from? Things like passwords, database addresses, file-size limits, and " +
        "whether we're in development or production. The short answer: from environment settings loaded out of a file, never hard-coded. " +
        "Keep it practical — the audience should leave knowing what's configurable and why secrets stay out of the code.",
    });

    d.bullets({
      title: "The core idea",
      bullets: [
        "Settings live outside the code, in a file called .env on the server.",
        "The code reads those settings at startup, with safe fallbacks if any are missing.",
        "Same code runs in development and production — only the settings differ.",
        "Secrets (passwords, keys) never get committed alongside the code.",
      ],
      notes:
        "The big principle is separation of settings from code. Imagine the program as an appliance and the .env file as its control panel: " +
        "you change behavior by turning dials on the panel, not by rewiring the appliance. This lets the identical code run on a laptop and " +
        "on the production server with different dials. Critically, it keeps secrets — like database passwords — out of the shared code, so " +
        "they don't leak when the code is copied or backed up.",
    });

    d.code({
      title: "How a setting is read",
      intro: "Every setting follows the same pattern:",
      code:
"  SECRET_KEY = getenv('SECRET_KEY', 'dev-default')\n" +
"               └ look this up ──┘  └ fallback ─┘\n\n" +
"  If the environment provides SECRET_KEY, use it.\n" +
"  Otherwise fall back to a safe development default.",
      caption: "Read from the environment; fall back to a sensible default if it's absent.",
      notes:
        "Show the shape without dwelling on syntax. Each setting says: 'look up this named value; if it's not provided, use this fallback.' " +
        "The fallbacks are deliberately weak development values — for example the default secret key literally says " +
        "'change in production.' That's a feature: the app still boots on a fresh laptop, but the weak defaults force you to set real " +
        "values before going live.",
    });

    d.table({
      title: "What's configurable — the essentials",
      headers: ["Setting", "Controls"],
      rows: [
        ["FLASK_ENV", "Development or production mode"],
        ["SECRET_KEY", "Signs login cookies — must be strong in production"],
        ["DEBUG_MODE", "Verbose errors and (importantly) skips 2-factor login"],
        ["Database URLs", "Where each database lives"],
        ["DUO_* keys", "Credentials for two-factor authentication"],
        ["Session cookie flags", "How securely the login cookie behaves"],
      ],
      colW: [3.6, 8.3],
      notes:
        "This is the practical heart. FLASK_ENV picks the mode. SECRET_KEY signs the login cookie — if it's weak or leaked, logins can be " +
        "forged, so production needs a strong random value. DEBUG_MODE is a big one: it turns on detailed errors AND skips two-factor " +
        "authentication, which is why it must never be on in production. Then the database locations, the Duo two-factor credentials, and " +
        "the cookie security flags. Each has a safe default for development.",
    });

    d.twocol({
      title: "Development vs. production",
      left: {
        heading: "Development",
        items: [
          "DEBUG_MODE on — skips two-factor so you can log in fast.",
          "Detailed error pages and auto-reload on edits.",
          "Cookies allowed over plain (unencrypted) connections.",
        ],
      },
      right: {
        heading: "Production",
        items: [
          "DEBUG_MODE off — two-factor enforced.",
          "Errors logged quietly to a rotating log file.",
          "Cookies only sent over encrypted (HTTPS) connections.",
        ],
      },
      notes:
        "The same code behaves very differently depending on mode, and it's all settings-driven. Development optimizes for the developer: " +
        "skip 2FA, show full errors, reload automatically, allow insecure cookies on localhost. Production optimizes for safety: enforce " +
        "2FA, hide errors from users while logging them, and only send the login cookie over encrypted connections. The dangerous mistake " +
        "would be running production with development settings — especially DEBUG_MODE on, which silently disables two-factor.",
    });

    d.bullets({
      title: "The data directories",
      bullets: [
        "UPLOAD_FOLDER — where task file attachments are saved.",
        "DATA_DIR (HSCDATA) — the per-machine summary spreadsheets.",
        "LOG_DATA_DIR (LogData) — machine logs and sensor history files.",
        "At startup these are turned into absolute paths and created if missing.",
      ],
      notes:
        "Three folder settings tell the server where files live: where to put uploaded attachments, where the machine summary spreadsheets " +
        "are, and where the machine logs and sensor histories go. At startup the server converts these to full, unambiguous paths and " +
        "creates the folders if they don't exist — a small fix that prevented a past bug where downloads looked in the wrong place.",
    });

    d.code({
      title: "What the settings file looks like",
      intro: "A few lines from the .env file (values are examples):",
      code:
"  FLASK_ENV=production\n" +
"  DEBUG_MODE=False\n" +
"  SECRET_KEY=<long random string>\n" +
"  DUO_IKEY=...   DUO_SKEY=...   DUO_HOST=...\n" +
"  CHEM_POSTGRES_PASSWORD=<strong password>\n" +
"  SESSION_COOKIE_SECURE=True",
      caption: "Plain name=value lines. No code — just settings the program reads at startup.",
      notes:
        "Show that the settings file is approachable — just 'name = value' lines, no programming. Point out a few: the mode, debug off, a long " +
        "random secret key, the Duo credentials, the database password, and the secure-cookie flag. Anyone comfortable editing a text file can " +
        "safely change configuration. Emphasize the values shown are placeholders; the real file holds the actual secrets and is guarded.",
    });

    d.bullets({
      title: "Safe defaults are intentionally weak",
      bullets: [
        "Missing settings fall back to obviously-unsafe development values.",
        "The default secret key literally says 'change in production.'",
        "The default database password is 'changeme.'",
        "This lets the app boot on a laptop while forcing real values before launch.",
      ],
      notes:
        "Explain a clever bit of design: the fallback values are deliberately bad. The default secret key says 'change in production'; the " +
        "default database password is 'changeme.' That's not sloppiness — it means a developer can start the app instantly on a fresh machine, " +
        "but those embarrassing defaults make it obvious you must set real values before going live. Weak-on-purpose defaults are a known, " +
        "sensible pattern.",
    });

    d.bullets({
      title: "Why several databases have separate addresses",
      bullets: [
        "Each SQLite database has its own location setting.",
        "The big chemical database (PostgreSQL) has its own host, name, and credentials.",
        "Keeping them in settings means you can move a database without touching code.",
        "Production and development can point at completely different databases.",
      ],
      notes:
        "Tie configuration to the databases session. Each database's location is a setting, not hard-coded. The simple SQLite databases each " +
        "have a file location; the larger PostgreSQL chemical database has a host, name, username, and password. Because these live in " +
        "settings, you can move a database, or point development at a throwaway copy and production at the real one, without editing any code. " +
        "That flexibility is the whole reason settings are centralized.",
    });

    d.table({
      title: "Common configuration mistakes",
      headers: ["Mistake", "Consequence / fix"],
      rows: [
        ["DEBUG_MODE on in production", "Two-factor silently disabled → set it False"],
        ["Default SECRET_KEY left in place", "Logins can be forged → set a strong random value"],
        ["Default DB password ('changeme')", "Easily guessed → set a real password"],
        ["Missing logs/ folder", "Production won't start → create the folder"],
      ],
      colW: [4.6, 7.3],
      notes:
        "Walk the failure modes a new operator is most likely to hit. The most dangerous is leaving DEBUG_MODE on in production because it " +
        "quietly turns off two-factor. Leaving the placeholder secret key allows forged logins. The default database password is trivially " +
        "guessable. And production logging needs a logs folder to exist or the app refuses to start. Each has a one-line fix. This slide is " +
        "essentially a pre-launch checklist.",
    });

    d.steps({
      title: "When you actually touch settings",
      steps: [
        { h: "On first install", d: "fill in real secret key, database, and Duo credentials." },
        { h: "When rotating secrets", d: "update keys/passwords, then restart." },
        { h: "When moving a database", d: "change its address; no code change needed." },
      ],
      notes:
        "Set expectations about how often this file changes — rarely. You edit it at install time to put in real values, occasionally when " +
        "rotating a credential, and when relocating a database. In every case it's a settings edit plus a restart, never a code change. Day to " +
        "day, nobody touches it. That stability is the point of separating settings from code.",
    });

    d.bullets({
      title: "Practical takeaways",
      bullets: [
        "To change behavior, edit .env — not the source code.",
        "Never set DEBUG_MODE on in production (it disables two-factor).",
        "Always set a strong SECRET_KEY and real database/Duo credentials before going live.",
        "Keep the .env file backed up separately and privately — it holds the secrets.",
      ],
      notes:
        "End with the operator's checklist. If you want to change how the server behaves, the .env file is almost always the place — not the " +
        "code. The cardinal sins are leaving DEBUG_MODE on in production and shipping with the weak default secret key. And because .env " +
        "contains every secret, back it up privately and separately from the code. Next session: Authentication — how logging in actually " +
        "works.",
    });
  },
};
