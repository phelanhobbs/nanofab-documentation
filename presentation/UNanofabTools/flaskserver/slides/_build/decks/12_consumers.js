const M = require("../meta");

module.exports = {
  filename: "12-Consumers-NanofabToolkit.pptx",
  title: "Consumers (NanofabToolkit)",
  build(d) {
    d.title_slide({
      kicker: "PART 12",
      title: "What Talks to the Server",
      subtitle: M.series + "\nThe Raspberry Pi sensors and desktop tools on the other end.",
      presenter: M.presenter, role: M.role, dept: M.dept, date: M.date,
      notes:
        "This session looks at the programs on the other side of the server's machine-facing API — the 'consumers.' They live in a separate " +
        "project called NanofabToolkit. There are two kinds: tiny programs on Raspberry Pi sensors that push data in, and desktop apps that " +
        "pull data out to display it. Understanding both completes the picture of how data flows.",
    });

    d.bullets({
      title: "Two kinds of consumer",
      bullets: [
        "Producers — Raspberry Pi firmware that sends sensor readings to the server.",
        "Consumers — desktop apps that fetch data back to visualize or download it.",
        "Both live in the NanofabToolkit project, separate from the server.",
        "They talk to the server only over the addresses from Part 08.",
      ],
      notes:
        "Two roles. 'Producers' are the small programs running on Raspberry Pi boards next to machines; they push readings to the server. " +
        "'Consumers' are desktop applications staff run on Windows PCs to fetch and display data. Both live in a separate code project " +
        "(NanofabToolkit) and interact with the server only through the machine-facing addresses we covered in the sensor session. The server " +
        "and these tools are decoupled — either side can change as long as the data format stays stable.",
    });

    d.table({
      title: "The producers (Raspberry Pis)",
      headers: ["Firmware", "Sends to", "What"],
      rows: [
        ["Particle sensor", "/particle-data", "SPS30 dust readings"],
        ["Environmental sensor", "/env-data", "DHT22 temp/humidity"],
        ["Combined sensor", "/sensor-data", "Both, in one message"],
        ["Parylene Pi", "/sdsanalog", "Streamed CSV batches"],
        ["Denton 18 Pi", "/denton18pump", "Vacuum-pressure samples"],
      ],
      colW: [3.4, 3.0, 5.5],
      notes:
        "Map the producers to their endpoints. Each Pi runs purpose-built firmware: a particle sensor posts dust readings; an environmental " +
        "sensor posts temperature and humidity; a newer combined unit posts both at once; the Parylene coater streams CSV batches; the Denton " +
        "18 posts vacuum pressure. These match one-to-one with the endpoint families from Part 08. The room and sensor labels are baked into " +
        "each Pi before it's deployed.",
    });

    d.bullets({
      title: "What the Pis handle on their own",
      bullets: [
        "Connecting to the lab Wi-Fi (and reconnecting if it drops).",
        "Keeping their clock accurate so timestamps are right.",
        "Sending on a schedule (e.g. every 15 minutes).",
        "Recovering from errors — even restarting themselves if needed.",
      ],
      notes:
        "The Pis are surprisingly self-sufficient, which matters because nobody babysits them. They manage Wi-Fi connections and reconnect " +
        "after dropouts, sync their clocks so timestamps are correct, send on a fixed schedule, and include watchdog logic to recover from " +
        "errors — up to rebooting themselves. From the server's point of view none of this is visible; a Pi just shows up reliably every few " +
        "minutes with a reading. Robust little devices are what make the data stream trustworthy.",
    });

    d.bullets({
      title: "The consumers (desktop apps)",
      bullets: [
        "Particle viewer — shows current readings on a cleanroom map, plus history per sensor.",
        "Parylene reader — lists and downloads finished Parylene run files.",
        "A few local-only tools that don't touch the server at all.",
        "They fetch via the GET addresses; the server just serves the data.",
      ],
      notes:
        "On the consuming side, the main app is a particle-data viewer that draws a cleanroom map color-coded by current readings and lets " +
        "you drill into any sensor's history. A Parylene reader lists and downloads finished run files. There are also standalone analysis " +
        "tools that work on already-downloaded files and never contact the server. The viewers use the data-fetching addresses; the server's " +
        "only job is to hand over the numbers.",
    });

    d.steps({
      title: "A full round trip",
      intro: "From a sensor reading to a chart on screen.",
      steps: [
        { h: "Pi reads its sensor", d: "and builds a small data message." },
        { h: "Pi sends it to the server", d: "which stores it (CSV history + latest snapshot)." },
        { h: "Later, an app asks for data", d: "current readings, or one sensor's history." },
        { h: "The app draws it", d: "a map, a table, or a chart." },
      ],
      notes:
        "Tie it together with the end-to-end story. A Pi takes a reading and packages it, sends it to the server, which files it away (full " +
        "history to CSV, latest reading to the database). Sometime later a desktop app asks the server for the current snapshot or a specific " +
        "sensor's history, and renders it as a map, table, or chart. The server is simply the well-known meeting point in the middle — the " +
        "producers fill it, the consumers read it.",
    });

    d.bullets({
      title: "One note and one non-member",
      bullets: [
        "The desktop apps skip certificate checking because the server uses an internal certificate.",
        "Encrypted in transit, just not validated — acceptable on the private network.",
        "The 'Precious Metal Reader' tool ships in the toolkit but talks to a different system, not this server.",
      ],
      notes:
        "Two clarifications. The desktop tools connect with certificate validation turned off, because the server uses an internal " +
        "certificate the tools don't recognize — the traffic is still encrypted, just not verified, which is acceptable inside the private " +
        "network. And a heads-up to prevent confusion: one tool in the toolkit, the Precious Metal Reader, calls a completely separate " +
        "university system, not this server — so don't go looking for it in our code.",
    });

    d.code({
      title: "What the sensor code actually sends",
      intro: "A simplified version of the Pi's send step:",
      code:
"  reading = read_sensor()\n" +
"  message = {\n" +
"     room_name: \"Bay C\", sensor_number: \"003\",\n" +
"     timestamp: now(), ...measurements...\n" +
"  }\n" +
"  POST  message  →  /particle-data",
      caption: "Take a reading, package it with its identity and time, send it. That's the producer.",
      notes:
        "Show that the producer side is conceptually simple. The firmware reads the sensor, packages the numbers together with which room and " +
        "sensor it is and the current time, and posts that to the server. The complexity in real firmware is the reliability scaffolding " +
        "(Wi-Fi, clock, retries) around this core, not the core itself. Seeing the producing and receiving code side by side makes the data " +
        "contract from Part 08 click.",
    });

    d.bullets({
      title: "Why the room and sensor labels matter",
      bullets: [
        "Each Pi is pre-labeled with its room and sensor number.",
        "Those labels travel with every reading.",
        "The viewer app uses them to place readings on the cleanroom map.",
        "Mislabel a Pi and its data shows up in the wrong place.",
      ],
      notes:
        "Stress the importance of the labels, a common real-world gotcha. Every reading carries the room and sensor identifiers baked into " +
        "that Pi. The desktop viewer relies on them to color the right square on the cleanroom map. If a Pi is deployed with the wrong label, " +
        "its perfectly good data will appear in the wrong room. So the labels are part of the data contract, and getting them right at " +
        "deployment matters.",
    });

    d.table({
      title: "Producers and consumers, side by side",
      headers: ["Program", "Role", "Talks to"],
      rows: [
        ["Particle / env / combined firmware", "Producer", "Sends readings in"],
        ["Parylene & Denton Pis", "Producer", "Stream machine data in"],
        ["Particle viewer (desktop)", "Consumer", "Fetches readings out"],
        ["Parylene reader (desktop)", "Consumer", "Downloads run files"],
        ["Local analysis tools", "Neither", "Work on saved files only"],
      ],
      colW: [4.6, 2.4, 4.9],
      notes:
        "A consolidated map of the ecosystem. The Raspberry Pis are producers, sending data in. The desktop viewers are consumers, pulling " +
        "data out. A few standalone tools are neither — they crunch files you've already downloaded and never touch the server. This table is " +
        "the 'who's who' of everything that surrounds the server, and it clarifies that not everything in the toolkit even talks to it.",
    });

    d.bullets({
      title: "Why this design is good",
      bullets: [
        "Server is a hub; tools are spokes — each can change independently.",
        "New sensor? Add an endpoint and point firmware at it.",
        "New view? Add a fetch and a desktop (or web) display.",
        "The contract between them is just structured data over HTTPS.",
      ],
      notes:
        "End on the architectural payoff. Because the server and the tools only agree on a data format, you can replace either side freely. " +
        "Adding a new sensor type means adding an endpoint and pointing new firmware at it; adding a new visualization means adding a fetch " +
        "and a display. The clean contract — structured data over an encrypted connection — is what keeps the whole ecosystem flexible. Next " +
        "session walks a single request through the server end to end.",
    });
  },
};
