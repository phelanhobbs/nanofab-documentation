const M = require("../meta");

module.exports = {
  filename: "06-Tasks.pptx",
  title: "Tasks",
  build(d) {
    d.title_slide({
      kicker: "PART 06",
      title: "The Task Tracker",
      subtitle: M.series + "\nAn internal to-do list with assignments and file attachments.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session covers the task tracker — a shared to-do list for staff. People with the 'can_assign' permission create tasks; anyone " +
        "can claim, complete, and attach files to them. It's a good, relatable feature to show a general audience because everyone " +
        "understands a to-do list. We'll also touch on a couple of behind-the-scenes design notes.",
    });

    d.bullets({
      title: "What the task tracker offers",
      bullets: [
        "A dashboard showing your tasks, unfinished tasks, and all tasks.",
        "Create a task with a title, description, due date, priority, and assignees.",
        "Claim a task to add yourself as an assignee.",
        "Mark a task complete.",
        "Attach files to a task.",
      ],
      notes:
        "Lay out the features plainly. The dashboard has three views: tasks involving you, everything unfinished, and everything. People " +
        "with permission can create tasks with the usual fields and assign them to coworkers. Anyone can 'claim' a task (put their name on " +
        "it), mark it done, or attach a file. It's a lightweight, shared checklist — nothing more complicated than that.",
    });

    d.bullets({
      title: "Who can do what",
      bullets: [
        "Any logged-in user: view, claim, complete, and attach files.",
        "Only users with can_assign: create new tasks.",
        "The create page checks that permission before letting you in.",
        "As always, the server enforces it — not just the hidden button.",
      ],
      notes:
        "Tie back to permissions. Everyday actions are open to any logged-in user. Creating and assigning tasks is gated behind the " +
        "'can_assign' flag from the admin session. The create page checks that flag up front, and — consistent with the whole system — the " +
        "server re-checks it rather than trusting the page to have hidden the button.",
    });

    d.steps({
      title: "Creating a task",
      steps: [
        { h: "Fill the form", d: "title, description, due date, priority, and one or more assignees." },
        { h: "Server validates", d: "checks the date format and your permission to assign." },
        { h: "Save the task", d: "store it, then record each assignee." },
        { h: "Back to the dashboard", d: "with a success message." },
      ],
      notes:
        "Walk the creation flow. You fill the form, including possibly several assignees at once. The server checks that the due date is a " +
        "real date and that you're allowed to assign. It then saves the task and records each assignee separately (one task can have many " +
        "assignees). Finally it returns you to the dashboard with a confirmation. If the date is malformed or you lack permission, it sends " +
        "you back with an error instead.",
    });

    d.bullets({
      title: "How assignees work (one task, many people)",
      intro: "This is a classic 'many-to-many' relationship.",
      bullets: [
        "One task can have several assignees; one person can be on many tasks.",
        "Assignees are kept in a separate list, linked to the task.",
        "The dashboard rolls those names back up next to each task.",
        "Claiming a task simply adds your name to that list.",
      ],
      notes:
        "Explain the structure gently. Because a task can have many people and a person can have many tasks, the names aren't stored inside " +
        "the task row itself — they live in a separate linked list. When the dashboard shows a task, it gathers that task's names back " +
        "together for display. 'Claiming' is just adding your name to the list (and it won't add you twice). This 'many-to-many' pattern " +
        "shows up again in the inventory.",
    });

    d.bullets({
      title: "File attachments, handled carefully",
      bullets: [
        "Only certain file types are accepted (documents, images, spreadsheets, PDFs).",
        "Filenames are sanitized so they can't escape the uploads folder.",
        "A timestamp is added so two files with the same name don't collide.",
        "The file is saved to disk; its location is recorded with the task.",
      ],
      notes:
        "Attachments get safety treatment. The server only accepts an allow-list of file types. It cleans the filename so a maliciously " +
        "named file can't write somewhere it shouldn't. It appends a timestamp so uploads with identical names don't overwrite each other. " +
        "The bytes go to disk in an uploads folder; the database just records where. The recurring theme: anything coming from outside is " +
        "treated cautiously.",
    });

    d.bullets({
      title: "A behind-the-scenes note",
      bullets: [
        "The task feature talks to its database directly, in an older style.",
        "Most of the newer code uses a higher-level database helper instead.",
        "Both work; it's just a seam from the system's history.",
        "Worth knowing if you ever maintain this part of the code.",
      ],
      notes:
        "One honest maintenance note for the record. The tasks code reaches into its database in an older, lower-level style, while most of " +
        "the newer parts of the system use a higher-level helper. Neither is wrong and both work fine; it's just a visible seam from how the " +
        "project grew over time. A general audience can ignore this, but a future maintainer should know the tasks area looks a little " +
        "different from the rest.",
    });

    d.bullets({
      title: "The dashboard's three views",
      bullets: [
        "Your tasks — anything you created or were assigned.",
        "Unfinished tasks — everything not yet marked complete.",
        "All tasks — the full list, finished or not.",
        "Each row shows status, due date, assignees, and any attached files.",
      ],
      notes:
        "Detail the landing page. It presents three lenses on the same data: tasks involving you, everything still open, and the complete " +
        "list. Each task row carries its status, due date, the people on it, and links to any files. The three-view layout means a person can " +
        "quickly answer 'what's on my plate?', a lead can see 'what's outstanding across the lab?', and anyone can browse history.",
    });

    d.code({
      title: "Why assignees live in a separate list",
      intro: "One task, several people — kept in a linking table:",
      code:
"  tasks                 assignees\n" +
"  -------               -----------------\n" +
"  #42 \"Clean trap\"      task #42 → Alice\n" +
"  #42 ...               task #42 → Bob\n" +
"  #43 \"Order N2\"        task #43 → Alice",
      caption: "A person can be on many tasks; a task can have many people. The list links them.",
      notes:
        "Visualize the many-to-many relationship. Rather than cram a list of names into the task row, names live in a separate linking table " +
        "where each line ties one task to one person. Task 42 has two lines (Alice and Bob); Alice appears on two different tasks. This is the " +
        "standard, clean way to model 'many of these relate to many of those,' and the dashboard simply gathers the names back together per " +
        "task for display.",
    });

    d.steps({
      title: "What happens when you attach a file",
      steps: [
        { h: "Check the type", d: "only allowed kinds (docs, images, PDFs, spreadsheets) pass." },
        { h: "Clean the name", d: "strip anything that could let it write outside the uploads folder." },
        { h: "Add a timestamp", d: "so two files named the same don't overwrite each other." },
        { h: "Save and record", d: "store the file; note its location against the task." },
      ],
      notes:
        "Walk the upload safeguards as a sequence, echoing the broader 'treat outside input as suspicious' theme. The server checks the file " +
        "type against an allow-list, cleans the filename so a sneaky name can't escape the uploads folder, appends a timestamp to avoid " +
        "collisions, then saves the bytes and records the location. None of this is visible to the user — they just see 'file attached' — but " +
        "each step closes a small risk.",
    });

    d.bullets({
      title: "Recap",
      bullets: [
        "A shared to-do list: create, assign, claim, complete, attach.",
        "Creating tasks needs the can_assign permission; the server enforces it.",
        "Assignees use a many-to-many design; claiming adds your name.",
        "Uploads are type-checked, sanitized, and timestamped.",
      ],
      notes:
        "Summarize. It's a friendly, practical feature that also quietly demonstrates permissions, the many-to-many pattern, and careful " +
        "file handling. Next session: the Machines portal — a page for every tool in the cleanroom.",
    });
  },
};
