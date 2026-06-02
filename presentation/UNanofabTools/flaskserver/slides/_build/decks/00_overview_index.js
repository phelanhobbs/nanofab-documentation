const M = require("../meta");

module.exports = {
  filename: "00-Start-Here-Index.pptx",
  title: "Start Here — Series Overview",
  build(d) {
    d.title_slide({
      kicker: "START HERE",
      title: "The UNanofabTools Server",
      subtitle: M.series + "\nA 16-part walkthrough of how the cleanroom's web server works.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This is the kickoff / table-of-contents session for the whole series. Use it to set context, explain who the series is for, " +
        "and let people choose which later sessions matter to them. Everything is written for a non-developer audience. " +
        "If you only present one session to a general audience, present Part 01 (Server Overview). If you're handing the system to a " +
        "successor, the later deep-dive sessions matter most.",
    });

    d.bullets({
      title: "What this series is",
      bullets: [
        "A plain-English explanation of the server that runs the cleanroom's internal web tools.",
        "Written for coworkers without a coding background — every term is defined as it appears.",
        "Sixteen short topics, each standing on its own; read in order or jump to what you need.",
        "Companion to the written guide; these decks are the presentable version of it.",
      ],
      notes:
        "Set expectations. This is not training to become a developer — it's so that non-technical staff and managers can understand " +
        "what the server does, and so a future maintainer has a gentle on-ramp before the technical documentation. Each topic is " +
        "self-contained; nobody has to sit through all sixteen to get value from one.",
    });

    d.bullets({
      title: "Who should care about which parts",
      intro: "Different audiences, different sessions.",
      bullets: [
        "Everyone: Part 01 (Server Overview) — the big picture in fifteen minutes.",
        "Managers / safety: Parts 09 (Chemical Inventory) and 14 (Security).",
        "Anyone running the sensors: Parts 08 (Sensor API) and 12 (Consumers).",
        "A future maintainer: all of them — especially 02, 03, 09, 10, 13, 14.",
      ],
      notes:
        "Help people self-select. A manager probably wants the inventory and security stories; whoever maintains the Raspberry Pi sensors " +
        "wants the API and consumer sessions; a successor developer should watch everything. Naming the audiences up front respects " +
        "people's time and signals that the series is modular.",
    });

    d.table({
      title: "The sixteen topics (1 of 2)",
      headers: ["Part", "Topic", "In one line"],
      rows: [
        ["01", "Server Overview", "What a server is and what ours does"],
        ["02", "How It Starts", "What happens when the server boots"],
        ["03", "Configuration", "Where the server reads its settings"],
        ["04", "Authentication", "Logging in, passwords, two-factor"],
        ["05", "Admin Panel", "Managing users and permissions"],
        ["06", "Tasks", "The internal to-do list with attachments"],
        ["07", "Machines & Logs", "A page per tool, plus log downloads"],
        ["08", "Sensor API", "How Raspberry Pis push data in"],
      ],
      colW: [1.1, 3.4, 7.4],
      notes:
        "Walk the first half of the catalog briefly. Don't read every row aloud — let people scan it. Emphasize that the numbering is a " +
        "suggested order, not a requirement. Parts 01–04 are the foundation; 05–08 are the everyday features.",
    });

    d.table({
      title: "The sixteen topics (2 of 2)",
      headers: ["Part", "Topic", "In one line"],
      rows: [
        ["09", "Chemical Inventory", "Barcodes, containers, scans, reports"],
        ["10", "Database Models", "The tables and what they hold"],
        ["11", "Particle Demo", "A standalone demo viewer page"],
        ["12", "Consumers", "The Pi firmware & desktop apps"],
        ["13", "Request Lifecycle", "Step-by-step path of one request"],
        ["14", "Security Model", "Encryption, logins, the trade-offs"],
        ["15", "Endpoint Reference", "Every address the server answers"],
        ["00", "Start Here", "This overview / table of contents"],
      ],
      colW: [1.1, 3.4, 7.4],
      notes:
        "The second half. Part 09 (Chemical Inventory) is the largest single topic. Parts 13–15 are the wrap-up: a full request " +
        "walk-through, the consolidated security picture, and a reference list of every address. This deck (00) is the one you're in now.",
    });

    d.steps({
      title: "How to use these decks",
      steps: [
        { h: "Slides are the summary", d: "the on-screen content is intentionally light." },
        { h: "Speaker notes are the script", d: "every slide has reader's notes with the full explanation." },
        { h: "Present or self-study", d: "read the notes aloud, or read them on your own as a guide." },
      ],
      notes:
        "Explain the format. The slides themselves are deliberately uncluttered — they're the headline. The detailed explanation lives in " +
        "the speaker notes (also called reader's notes) attached to each slide, which is what I'm reading from now. That means these decks " +
        "double as a self-study guide: someone can open the file, read the notes under each slide, and learn the material without a live " +
        "presenter. In PowerPoint, the notes show in the presenter view or below each slide in Notes Page view.",
    });

    d.bullets({
      title: "What you'll be able to do after this series",
      bullets: [
        "Explain, to a colleague, what the server is and why it exists.",
        "Know where each kind of data lives and who can touch it.",
        "Follow a request from a click (or a sensor) all the way through.",
        "Speak the basic vocabulary without feeling lost.",
        "Know where to look things up in the written guide.",
      ],
      notes:
        "State the concrete outcomes so people know what they're investing time for. This isn't about turning anyone into a programmer; it's " +
        "about confident literacy — being able to talk about the system, reason about where data is, understand the access rules, and find " +
        "answers in the written documentation. Frame these as the success criteria for the series.",
    });

    d.steps({
      title: "A 30-second taste: how it all works",
      intro: "The one idea everything rests on.",
      steps: [
        { h: "Something asks", d: "a browser, a sensor, or a tool sends a request." },
        { h: "The server decides", d: "it figures out what's being asked and does the work." },
        { h: "It answers", d: "a web page, some data, or a confirmation goes back." },
      ],
      notes:
        "Plant the core mental model right at the start so the rest of the series has a spine. A server is a thing that receives requests and " +
        "returns responses. A person loading a page, a sensor uploading a reading, a tool fetching data — all three are just 'ask, decide, " +
        "answer.' We'll repeat this in Part 01 and again in Part 13; repetition is intentional.",
    });

    d.twocol({
      title: "Two audiences, one server",
      left: {
        heading: "People",
        items: [
          "Use a web browser.",
          "Log in, with two-factor.",
          "See HTML pages: tasks, machines, inventory.",
        ],
      },
      right: {
        heading: "Machines",
        items: [
          "Sensors and desktop tools.",
          "No login — trusted by the network.",
          "Exchange raw data, not web pages.",
        ],
      },
      notes:
        "Introduce a distinction that surprises people and recurs throughout: the server serves both humans and machines, very differently. " +
        "Humans browse with logins and two-factor; machines (the Raspberry Pi sensors and desktop apps) talk to it directly without logging " +
        "in, trusted because they're on a private network. Same server, two front doors. Keep this in mind for the security and sensor " +
        "sessions.",
    });

    d.bullets({
      title: "How the decks and the written guide fit together",
      bullets: [
        "These 16 decks are the presentable summary — one per topic.",
        "Each deck's speaker notes are the spoken script / self-study text.",
        "A companion written guide covers the same topics in prose, with more depth.",
        "Separate developer documentation exists for whoever maintains the code.",
      ],
      notes:
        "Clarify the family of materials so people pick the right one. The decks (these) are for presenting and quick study. The written " +
        "layperson guide is the same material in readable prose with more room for detail. And there's a separate, more technical developer " +
        "documentation set for a successor maintaining the system. Today we're using the decks; mention the others exist so people know where " +
        "to go for more.",
    });

    d.bullets({
      title: "Ground rules for the series",
      bullets: [
        "No coding knowledge assumed — terms are defined the first time they appear.",
        "Analogies over jargon; the goal is understanding, not precision for its own sake.",
        "Each deck ends by pointing to the next topic.",
        "Questions are welcome at any point — this is meant to demystify, not impress.",
      ],
      notes:
        "Close the kickoff by stating the spirit of the series: clarity over cleverness. Encourage interruptions and questions. " +
        "Then move into Part 01, the Server Overview, which gives the whole-system picture everything else builds on.",
    });
  },
};
