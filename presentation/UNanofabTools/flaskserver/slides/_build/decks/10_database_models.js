const M = require("../meta");

module.exports = {
  filename: "10-Database-Models.pptx",
  title: "Database Models",
  build(d) {
    d.title_slide({
      kicker: "PART 10",
      title: "The Databases",
      subtitle: M.series + "\nThe tables behind the system, and what each one holds.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session demystifies the databases. The word 'model' just means a description of one table. We'll cover the five databases, " +
        "what each table stores, and a few design choices. Keep it light — the goal is for the audience to know where each kind of data " +
        "lives, not to memorize columns.",
    });

    d.bullets({
      title: "First, what's a 'table' and a 'model'?",
      bullets: [
        "A table is a grid: columns are fields, rows are records — like a spreadsheet tab.",
        "A model is the code's description of one table (its name and columns).",
        "The server has several databases, each holding a few related tables.",
        "Some data also lives in plain CSV files, not in a database at all.",
      ],
      notes:
        "Ground the vocabulary. A database table is just a structured grid, like a tab in a spreadsheet: each column is a field (username, " +
        "email...) and each row is one record. A 'model' is simply how the code describes a table. The system spreads its tables across a few " +
        "databases. And remember from earlier: a lot of sensor history lives in CSV files rather than a database.",
    });

    d.table({
      title: "Five databases at a glance",
      headers: ["Database", "Holds"],
      rows: [
        ["signininfo (SQLite)", "User accounts"],
        ["sessioninfo (SQLite)", "Active login sessions"],
        ["tasks (SQLite)", "Tasks, assignees, file links"],
        ["particle_sensors (SQLite)", "Latest reading per sensor"],
        ["cheminventory (PostgreSQL)", "The whole chemical inventory"],
      ],
      colW: [4.6, 7.3],
      notes:
        "The lay of the land: four small single-file SQLite databases and one full PostgreSQL database. Users, sessions, tasks, and the " +
        "latest sensor readings each get their own SQLite file. The chemical inventory — much larger and more demanding — lives in " +
        "PostgreSQL. Splitting the SQLite data into four files is a historical choice; a fresh design would likely combine them, but it works " +
        "fine.",
    });

    d.bullets({
      title: "The user and session tables",
      bullets: [
        "Users: username, a scrambled password, university ID, and two permission flags.",
        "The password column holds the bcrypt fingerprint — never the real password.",
        "Sessions: a random ID, the username, and when it was created.",
        "Together they answer 'who is this, and are they currently logged in?'",
      ],
      notes:
        "The accounts table stores each user's name, the scrambled password fingerprint, their university ID, and the two permission flags " +
        "from earlier (admin, can-assign). The sessions table records each active login as a random ID tied to a username and a timestamp. " +
        "Between them they handle identity and 'are you logged in right now.' Reassure again: the real password is never in here.",
    });

    d.bullets({
      title: "The task tables",
      bullets: [
        "Tasks: title, description, due date, priority, who assigned it, status.",
        "Assignees: a separate list linking people to tasks (many-to-many).",
        "Task files: the saved file locations for each task's attachments.",
        "Three tables working together to model a shared to-do list.",
      ],
      notes:
        "The tasks feature uses three tables. The main one holds each task's details. A second holds assignees — a separate linking list " +
        "because a task can have many people and a person many tasks (the many-to-many idea from the tasks session). A third records where " +
        "each attached file is stored. Three simple tables combine into the full task tracker.",
    });

    d.bullets({
      title: "The particle-sensor table",
      intro: "Stores only the most recent reading per sensor.",
      bullets: [
        "One row per (room, sensor) — kept unique by a constraint.",
        "Holds the latest mass, count, and size measurements, plus optional temp/humidity.",
        "New readings overwrite the old row (an 'upsert').",
        "The full history lives in CSV files, not here.",
      ],
      notes:
        "This table is intentionally a snapshot, not a log. It keeps exactly one row per sensor location — enforced by a uniqueness rule — " +
        "holding that sensor's most recent measurements. When a new reading arrives, it overwrites the existing row (an 'upsert' = update or " +
        "insert). The complete minute-by-minute history is in the CSV files. So this table powers 'what's happening now' dashboards quickly, " +
        "while the CSVs are the archive.",
    });

    d.bullets({
      title: "The chemical-inventory tables",
      bullets: [
        "Lookups: categories, vendors, rooms.",
        "Core: items (chemicals) and containers (bottles).",
        "Audits: inventory cycles, raw scans, and matched container scans.",
        "History: a transactions log of every action.",
      ],
      notes:
        "The inventory is the most elaborate. There are small lookup tables (categories, vendors, rooms), the two core tables from the " +
        "inventory session (items and containers), the audit tables (a cycle plus its scans), and the transactions log that records every " +
        "action. We covered how these relate last session; here the point is just that the richness of the inventory comes from this set of " +
        "well-defined tables.",
    });

    d.bullets({
      title: "Two notes for maintainers",
      bullets: [
        "New tables are auto-created at startup, but changing an existing table needs a 'migration.'",
        "A migration is a recorded, repeatable schema change — the safe way to evolve tables.",
        "The live inventory database has a few columns added over time that aren't yet in the saved schema files.",
      ],
      notes:
        "Two things a successor must know. First, the server auto-creates brand-new tables on startup, but it will not alter an existing " +
        "table — that requires a 'migration,' which is a recorded, repeatable change script. Always use migrations so every copy of the " +
        "database stays in step. Second, the live chemical-inventory database has drifted slightly ahead of the saved schema files (a few " +
        "columns and a table were added directly over time). That's captured in the separate issues list with the exact fixes; it matters " +
        "if anyone rebuilds the inventory database from scratch.",
    });

    d.code({
      title: "A table is just a labeled grid",
      intro: "The users table, sketched:",
      code:
"  username | passwordHash | uNID    | isAdmin | canAssign\n" +
"  ---------+--------------+---------+---------+----------\n" +
"  alice    | $2b$12$Xk... | u012345 |  true   |   true\n" +
"  bob      | $2b$12$Qp... | u067890 |  false  |   true",
      caption: "Columns are the fields; each row is one record. Note: no real passwords, just fingerprints.",
      notes:
        "Make 'table' tangible with the users example. Columns are the fields — username, the password fingerprint, university ID, and the two " +
        "permission flags. Each row is one person. Point out again that the password column holds fingerprints, not passwords. Everyone has " +
        "seen a spreadsheet; a database table is the same idea with stricter rules about what goes in each column.",
    });

    d.bullets({
      title: "Why four small databases, not one?",
      bullets: [
        "It's a historical choice carried forward, not a fresh design.",
        "Each (users, sessions, tasks, sensors) lives in its own file.",
        "It works fine; it just adds a little bookkeeping.",
        "A future cleanup could merge them — noted, not urgent.",
      ],
      notes:
        "Answer the obvious question honestly. Splitting users, sessions, tasks, and sensor readings into four separate SQLite files is a " +
        "legacy decision the system grew up with, not something a fresh design would necessarily do. It functions perfectly well; it just means " +
        "a bit more bookkeeping about which file holds what. It's the kind of thing a successor might consolidate someday, but there's no " +
        "pressing reason to.",
    });

    d.bullets({
      title: "SQLite vs. PostgreSQL — when each fits",
      bullets: [
        "SQLite: a single file, zero setup — great for small, simple data.",
        "PostgreSQL: a full database server — handles heavier needs and more users.",
        "The inventory chose PostgreSQL for its counters, complex queries, and safe multi-step updates.",
        "Right tool for the size of the job.",
      ],
      notes:
        "Give the audience a way to think about the two database types. SQLite is a single file with no server to run — ideal for small, simple " +
        "datasets like users and tasks. PostgreSQL is a full-blown database server — more setup, but it handles the inventory's needs: the " +
        "barcode counter, complex multi-table queries, and all-or-nothing updates under concurrent use. It's not that one is better; they fit " +
        "different jobs, and the system uses each where it makes sense.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "Four small SQLite databases + one PostgreSQL database.",
        "Users, sessions, tasks, latest sensor readings, and the inventory.",
        "Sensor history lives in CSV files; the database keeps only the latest reading.",
        "Evolve tables with migrations; mind the inventory's schema drift.",
      ],
      notes:
        "Summarize where data lives and how to change it safely. Next session is short — the standalone particle-counter demo page — before " +
        "we look at the sensor and desktop programs that talk to the server.",
    });
  },
};
